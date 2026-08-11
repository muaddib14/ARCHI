import { executeAgentTask } from '@/lib/executor';
import { db } from '@/lib/db';
import { AgentInteraction } from '@/lib/types';
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

    // Log interaction as pending
    const interaction = await db.queryOne<AgentInteraction>(
      `INSERT INTO agent_interactions (agent_id, query, status)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [agent_id, query, 'pending']
    );

    // Execute agent task
    const result = await executeAgentTask(agent_id, query);

    // Update interaction with result
    if (interaction) {
      await db.query(
        `UPDATE agent_interactions
         SET status = $1, result = $2, tokens_used = $3, execution_ms = $4
         WHERE id = $5`,
        [
          result.status === 'error' ? 'failed' : 'completed',
          result.result,
          result.tokens_used,
          result.execution_ms,
          interaction.id
        ]
      );
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Execution error:', error);

    const message = error instanceof Error ? error.message : 'Execution failed';

    return NextResponse.json(
      { error: message, status: 'error' },
      { status: 500 }
    );
  }
}
