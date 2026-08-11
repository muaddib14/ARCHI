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

export class AgentExecutor {
  private static readonly OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
  private static readonly OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || 'mistralai/mixtral-8x7b-instruct';
  private static readonly API_BASE = 'https://openrouter.ai/api/v1';

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

    try {
      let response = await this.callOpenRouter(
        messages,
        systemContent,
        availableTools
      );

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

        // Continue conversation
        response = await this.callOpenRouter(
          messages,
          systemContent,
          availableTools
        );
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
        tool_calls: toolCalls.length > 0 ? toolCalls : undefined
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
    messages: OpenRouterMessage[],
    systemPrompt: string,
    tools: any[]
  ): Promise<any> {
    const payload = {
      model: this.OPENROUTER_MODEL,
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
      max_tokens: 2048
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
      const error = await response.text();
      throw new Error(`OpenRouter API error: ${response.status} ${error}`);
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
