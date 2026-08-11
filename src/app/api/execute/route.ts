import { AgentExecutor } from '@/lib/executor';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { agent_id, query } = await req.json();

    if (!agent_id || !query) {
      return NextResponse.json(
        { error: 'agent_id and query are required' },
        { status: 400 }
      );
    }

    const executor = new AgentExecutor();
    const result = await executor.execute(agent_id, query);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Execution error:', error);

    const message = error instanceof Error ? error.message : 'Execution failed';

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
