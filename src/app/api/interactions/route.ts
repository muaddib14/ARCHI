import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { AgentInteraction } from '@/lib/types';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const agentId = searchParams.get('agent_id');
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');

    let query =
      'SELECT * FROM agent_interactions WHERE 1=1';
    const params: any[] = [];

    if (agentId) {
      query += ' AND agent_id = $' + (params.length + 1);
      params.push(agentId);
    }

    query += ' ORDER BY created_at DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
    params.push(limit, offset);

    const interactions = await db.query<AgentInteraction>(query, params);

    return NextResponse.json({
      interactions,
      limit,
      offset,
    });
  } catch (error) {
    console.error('Error fetching interactions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch interactions' },
      { status: 500 }
    );
  }
}
