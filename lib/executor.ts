import Anthropic from '@anthropic-ai/sdk';
import { db } from './db';
import { tools, executeTool, getToolDefinitions } from './tools';
import { Agent, ExecutionResult } from './types';

interface ToolUseBlock {
  type: 'tool_use';
  id: string;
  name: string;
  input: Record<string, any>;
}

interface TextBlock {
  type: 'text';
  text: string;
}

type ContentBlock = ToolUseBlock | TextBlock | any;

export class AgentExecutor {
  private client: Anthropic;

  constructor() {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY environment variable is not set');
    }
    this.client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }

  async execute(agentId: string, query: string): Promise<ExecutionResult> {
    const startTime = Date.now();

    // 1. Load agent from database
    const agent = await db.queryOne<Agent>(
      'SELECT * FROM agents WHERE id = $1',
      [agentId]
    );

    if (!agent) {
      throw new Error(`Agent ${agentId} not found`);
    }

    // 2. Get available tools for this agent
    const agentTools = await db.query<{ tool_name: string }>(
      'SELECT tool_name FROM agent_tools WHERE agent_id = $1 AND is_enabled = true',
      [agentId]
    );

    const toolNames = agentTools.map(t => t.tool_name);
    const toolDefinitions = getToolDefinitions().filter(t =>
      toolNames.includes(t.name)
    );

    // 3. Build initial message
    const messages: Array<{ role: 'user' | 'assistant'; content: any }> = [
      {
        role: 'user',
        content: query,
      },
    ];

    let response = await this.client.messages.create({
      model: agent.model,
      max_tokens: 2048,
      system: agent.system_prompt || 'You are a helpful AI agent.',
      messages,
      tools: toolDefinitions as any,
    });

    // 4. Handle tool use loop
    let iterations = 0;
    const maxIterations = 10;

    while (response.stop_reason === 'tool_use' && iterations < maxIterations) {
      iterations++;

      // Find all tool use blocks
      const toolUseBlocks = response.content.filter(
        (block): block is ToolUseBlock => block.type === 'tool_use'
      );

      if (toolUseBlocks.length === 0) break;

      // Execute all tools
      const toolResults = await Promise.all(
        toolUseBlocks.map(async toolUse => {
          try {
            const result = await executeTool(toolUse.name, toolUse.input);
            return {
              type: 'tool_result' as const,
              tool_use_id: toolUse.id,
              content: JSON.stringify(result),
            };
          } catch (error) {
            return {
              type: 'tool_result' as const,
              tool_use_id: toolUse.id,
              content: JSON.stringify({
                success: false,
                error: error instanceof Error ? error.message : 'Tool execution failed',
              }),
              is_error: true,
            };
          }
        })
      );

      // Add assistant message and tool results to conversation
      messages.push({
        role: 'assistant',
        content: response.content,
      });

      messages.push({
        role: 'user',
        content: toolResults,
      });

      // Continue conversation
      response = await this.client.messages.create({
        model: agent.model,
        max_tokens: 2048,
        system: agent.system_prompt || 'You are a helpful AI agent.',
        messages,
        tools: toolDefinitions as any,
      });
    }

    // 5. Extract final response
    const textBlocks = response.content.filter(
      (block): block is TextBlock => block.type === 'text'
    );

    const finalResult = textBlocks.map(b => b.text).join('\n');
    const executionMs = Date.now() - startTime;

    // 6. Store interaction in database
    await db.query(
      `INSERT INTO agent_interactions
       (agent_id, query, result, status, execution_ms, created_at)
       VALUES ($1, $2, $3, $4, $5, NOW())`,
      [agentId, query, finalResult, 'completed', executionMs]
    );

    return {
      agentId,
      query,
      result: finalResult,
      tokensUsed: 0,
      executionMs,
    };
  }
}

export async function createAgent(
  name: string,
  description: string,
  ownerWallet: string,
  systemPrompt: string,
  model: string = 'claude-3-5-sonnet-20241022'
): Promise<Agent> {
  const result = await db.queryOne<Agent>(
    `INSERT INTO agents (name, description, owner_wallet, system_prompt, model, status)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [name, description, ownerWallet, systemPrompt, model, 'active']
  );

  if (!result) {
    throw new Error('Failed to create agent');
  }

  return result;
}

export async function enableToolForAgent(
  agentId: string,
  toolName: string,
  config?: Record<string, any>
): Promise<void> {
  await db.query(
    `INSERT INTO agent_tools (agent_id, tool_name, is_enabled, config)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (agent_id, tool_name) DO UPDATE
     SET is_enabled = true, config = $4`,
    [agentId, toolName, true, config ? JSON.stringify(config) : null]
  );
}
