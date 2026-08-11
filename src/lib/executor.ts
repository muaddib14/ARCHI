import { db } from './db';
import { executeTool, getToolDefinitions } from './tools';
import { Agent, ExecutionResult } from './types';

interface OpenRouterMessage {
  role: 'user' | 'assistant' | 'system';
  content: string | any[];
}

interface ToolUseBlock {
  type: 'tool_use';
  id: string;
  name: string;
  input: any;
}

interface TextBlock {
  type: 'text';
  text: string;
}

// Ordered fastest -> slowest based on live benchmark against OpenRouter
// (see OPENROUTER_SETUP.md for the full table + methodology + re-run date).
// First entry is the primary model; the rest are automatic fallbacks used
// when a call errors out (rate limit, model down, no endpoints, timeout, etc).
// Models that returned empty completions or errors during benchmarking were
// excluded (code-only or too-small models unsuitable for general agent chat).
const FREE_MODEL_FALLBACK_CHAIN = [
  'nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free', // ~606ms
  'nvidia/nemotron-3-nano-30b-a3b:free',                // ~696ms
  'nvidia/nemotron-3.5-lightning:free',                 // ~723ms
  'google/gemma-4-26b-a4b-it:free',                     // ~1522ms
  'poolside/laguna-s-2.1:free',                         // ~2160ms
  'nvidia/nemotron-3-super-120b-a12b:free',             // ~6771ms
  'nvidia/nemotron-3-ultra-550b-a55b:free'              // ~10416ms
];

export class AgentExecutor {
  private static readonly OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
  private static readonly API_BASE = 'https://openrouter.ai/api/v1';

  private static getModelChain(): string[] {
    const configured = process.env.OPENROUTER_MODEL;
    if (!configured) return FREE_MODEL_FALLBACK_CHAIN;
    // Configured model goes first, then the rest of the free chain as backup
    // (deduplicated in case it's already in the list).
    return [configured, ...FREE_MODEL_FALLBACK_CHAIN.filter((m) => m !== configured)];
  }

  static async execute(
    query: string,
    systemPrompt?: string,
    tools?: any[]
  ): Promise<ExecutionResult> {
    if (!this.OPENROUTER_API_KEY) {
      throw new Error('OPENROUTER_API_KEY not configured');
    }

    const startTime = Date.now();
    const messages: OpenRouterMessage[] = [
      { role: 'user', content: query }
    ];

    const systemContent = systemPrompt || 'You are a helpful AI agent. Use tools when needed to complete tasks.';
    const availableTools = tools || getToolDefinitions();
    const modelChain = this.getModelChain();

    let usedModel = modelChain[0];
    let lastError: Error | null = null;

    try {
      let response: any = null;

      // Try each model in the chain until one succeeds.
      for (const model of modelChain) {
        try {
          response = await this.callOpenRouter(model, messages, systemContent, availableTools);
          usedModel = model;
          lastError = null;
          break;
        } catch (err) {
          lastError = err instanceof Error ? err : new Error(String(err));
          console.warn(`Model ${model} failed, trying next fallback:`, lastError.message);
        }
      }

      if (!response) {
        throw lastError || new Error('All models in fallback chain failed');
      }

      let result = '';
      let toolCalls: Array<{ name: string; input: any; result: string }> = [];

      while (response.stop_reason === 'tool_calls' && response.content) {
        const toolUseBlocks = response.content.filter(
          (block: any) => block.type === 'tool_use'
        ) as ToolUseBlock[];

        if (toolUseBlocks.length === 0) break;

        for (const block of toolUseBlocks) {
          const toolResult = await executeTool(block.name, block.input);
          toolCalls.push({
            name: block.name,
            input: block.input,
            result: JSON.stringify(toolResult)
          });
        }

        // Add assistant response and tool results to messages
        messages.push({
          role: 'assistant',
          content: response.content
        });

        messages.push({
          role: 'user',
          content: toolUseBlocks.map((block) => ({
            type: 'tool_result',
            tool_use_id: block.id,
            content: JSON.stringify(
              typeof toolCalls[toolCalls.length - 1]?.result === 'string'
                ? JSON.parse(toolCalls[toolCalls.length - 1]?.result || '{}')
                : toolCalls[toolCalls.length - 1]?.result
            )
          }))
        });

        // Continue conversation on the same model that succeeded
        response = await this.callOpenRouter(usedModel, messages, systemContent, availableTools);
      }

      // Extract final text response
      const textBlocks = response.content?.filter(
        (block: any) => block.type === 'text'
      ) as TextBlock[];

      result = textBlocks?.map((block) => block.text).join('\n') || 'Task completed.';

      const executionMs = Date.now() - startTime;

      return {
        status: 'completed',
        result,
        execution_ms: executionMs,
        tokens_used: response.usage?.total_tokens || 0,
        tool_calls: toolCalls.length > 0 ? toolCalls : undefined,
        model_used: usedModel
      };
    } catch (error) {
      const executionMs = Date.now() - startTime;
      return {
        status: 'error',
        result: `Execution failed: ${error instanceof Error ? error.message : String(error)}`,
        execution_ms: executionMs,
        tokens_used: 0,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  private static async callOpenRouter(
    model: string,
    messages: OpenRouterMessage[],
    systemPrompt: string,
    tools: any[]
  ): Promise<any> {
    const payload = {
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages
      ],
      tools: tools.map((tool) => ({
        type: 'function',
        function: {
          name: tool.name,
          description: tool.description,
          parameters: tool.input_schema
        }
      })),
      tool_choice: 'auto',
      temperature: 0.7,
      max_tokens: 512
    };

    const response = await fetch(`${this.API_BASE}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'https://archi-ai.vercel.app',
        'X-Title': 'ARCHI'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorBody = await response.text();
      let message = `OpenRouter API error (${response.status})`;
      try {
        const parsed = JSON.parse(errorBody);
        if (parsed?.error?.code === 402) {
          message = 'OpenRouter account is out of credits. Please top up at openrouter.ai/settings/credits.';
        } else if (parsed?.error?.message) {
          message = parsed.error.message;
        }
      } catch {
        message = `${message}: ${errorBody}`;
      }
      throw new Error(message);
    }

    const data = await response.json();
    const message = data.choices[0].message;

    // Parse tool calls from message
    let content = [];
    if (message.content) {
      content.push({ type: 'text', text: message.content });
    }

    if (message.tool_calls) {
      for (const toolCall of message.tool_calls) {
        content.push({
          type: 'tool_use',
          id: toolCall.id,
          name: toolCall.function.name,
          input: JSON.parse(toolCall.function.arguments)
        });
      }
    }

    return {
      content: content.length > 0 ? content : [{ type: 'text', text: message.content || '' }],
      stop_reason: message.tool_calls ? 'tool_calls' : 'end_turn',
      usage: data.usage
    };
  }

  async execute(
    query: string,
    systemPrompt?: string,
    tools?: any[]
  ) {
    return AgentExecutor.execute(query, systemPrompt, tools);
  }
}

export async function executeAgentTask(
  agentId: string,
  query: string,
  systemPrompt?: string
): Promise<ExecutionResult> {
  // Fetch agent from DB to get system prompt if not provided
  if (!systemPrompt) {
    const agent = await db.queryOne<Agent>(
      'SELECT * FROM agents WHERE id = $1',
      [agentId]
    );
    if (agent) {
      systemPrompt = agent.system_prompt;
    }
  }

  return AgentExecutor.execute(query, systemPrompt);
}
