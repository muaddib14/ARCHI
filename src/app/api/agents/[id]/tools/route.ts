import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { AgentTool } from '@/lib/types';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const tools = await db.query<AgentTool>(
      'SELECT * FROM agent_tools WHERE agent_id = $1 ORDER BY created_at DESC',
      [id]
    );

    return NextResponse.json({ tools: tools || [] });
  } catch (error) {
    return NextResponse.json({ tools: [] });
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { tool_name, config } = await req.json();

    if (!tool_name) {
      return NextResponse.json({ error: 'tool_name is required' }, { status: 400 });
    }

    const newTool = {
      id: `tool-${Date.now()}`,
      agent_id: id,
      tool_name,
      is_enabled: true,
      config: config || null,
      created_at: new Date().toISOString()
    };

    return NextResponse.json(newTool, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add tool' }, { status: 500 });
  }
}
