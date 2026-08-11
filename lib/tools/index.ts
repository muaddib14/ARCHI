import { httpTool } from './http';
import { emailTool } from './email';
import { blockchainTool } from './blockchain';

export const tools = {
  http_request: httpTool,
  send_email: emailTool,
  blockchain_call: blockchainTool,
};

export type ToolName = keyof typeof tools;

export function getToolDefinitions() {
  return Object.values(tools).map(tool => tool.definition);
}

export async function executeTool(
  toolName: string,
  input: Record<string, any>
): Promise<any> {
  const tool = tools[toolName as ToolName];
  if (!tool) {
    throw new Error(`Tool ${toolName} not found`);
  }
  return tool.handler(input as any);
}
