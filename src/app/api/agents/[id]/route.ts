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
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
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

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const agent = await db.queryOne<Agent>(
      `UPDATE agents SET status = 'archived', updated_at = NOW() WHERE id = $1 RETURNING *`,
      [id]
    );

    if (!agent) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, agent });
  } catch (error) {
    console.error('Agent delete error:', error);
    return NextResponse.json({ error: 'Failed to delete agent' }, { status: 500 });
  }
}
