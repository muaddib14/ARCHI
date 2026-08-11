export interface Agent {
  id: string;
  name: string;
  description: string;
  owner_wallet: string;
  blockchain_id: string | null;
  model: string;
  system_prompt: string;
  status: 'active' | 'inactive' | 'archived';
  created_at: string;
  updated_at: string;
}

export interface AgentTool {
  id: string;
  agent_id: string;
  tool_name: string;
  is_enabled: boolean;
  config: Record<string, any> | null;
  created_at: string;
}

export interface AgentInteraction {
  id: string;
  agent_id: string;
  query: string;
  result: string | null;
  status: 'pending' | 'completed' | 'failed';
  tokens_used: number | null;
  cost_lamports: number | null;
  execution_ms: number | null;
  created_at: string;
}

export interface ToolDefinition {
  name: string;
  description: string;
  input_schema?: Record<string, any>;
}

export interface ToolResult {
  success: boolean;
  data?: any;
  error?: string;
}

export interface ExecutionResult {
  agentId?: string;
  query?: string;
  status: 'completed' | 'error' | 'pending';
  result: string;
  tokens_used: number;
  execution_ms: number;
  tool_calls?: Array<{ name: string; input: any; result: string }>;
  error?: string;
  model_used?: string;
}
