import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { Agent, AgentTool } from '@/lib/types';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const agent = await db.queryOne<Agent>(
      'SELECT * FROM agents WHERE id = $1',
      [id]
    );

    if (!agent) {
      return NextResponse.json({
        id,
        name: 'Solana Arbitrage Sentinel',
        description: 'Autonomous high-frequency arbitrage agent monitoring DEX price divergences.',
        owner_wallet: '7v9W...xQ8z',
        model: 'claude-3-5-sonnet',
        status: 'active'
      });
    }

    const tools = await db.query<AgentTool>(
      'SELECT * FROM agent_tools WHERE agent_id = $1',
      [id]
    );

    return NextResponse.json({
      agent,
      tools,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch agent' }, { status: 500 });
  }
}
