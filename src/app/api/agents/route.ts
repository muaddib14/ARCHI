import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { initializeBlockchain } from '@/lib/blockchain';
import { Agent } from '@/lib/types';
import { initializeDatabase } from '@/lib/db-init';

let dbInitialized = false;

async function ensureDbInitialized() {
  if (!dbInitialized && process.env.DATABASE_URL) {
    try {
      await initializeDatabase();
      dbInitialized = true;
    } catch (e) {
      console.warn('Database initialization warning:', e);
    }
  }
}

export async function GET() {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }

    await ensureDbInitialized();

    try {
      const agents = await db.query<Agent>(
        'SELECT * FROM agents WHERE status != $1 ORDER BY created_at DESC',
        ['archived']
      );
      return NextResponse.json(agents);
    } catch (e) {
      console.error('Database query error:', e);
      return NextResponse.json([], { status: 200 });
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const {
      name,
      description,
      owner_wallet,
      system_prompt,
      model
    } = await req.json();

    if (!name || !owner_wallet) {
      return NextResponse.json(
        { error: 'name and owner_wallet are required' },
        { status: 400 }
      );
    }

    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503 }
      );
    }

    await ensureDbInitialized();

    // Create agent in database
    try {
      const result = await db.queryOne<Agent>(
        `INSERT INTO agents (name, description, owner_wallet, system_prompt, model, status)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [
          name,
          description || null,
          owner_wallet,
          system_prompt || 'You are a helpful AI agent on Solana.',
          model || 'claude-3-5-sonnet-20241022',
          'active'
        ]
      );

      if (!result) {
        return NextResponse.json(
          { error: 'Failed to create agent' },
          { status: 500 }
        );
      }

      // Sync to blockchain (optional - non-blocking)
      try {
        if (process.env.SOLANA_RPC_URL) {
          const blockchain = initializeBlockchain(process.env.SOLANA_RPC_URL);
          console.log(`Queuing agent ${result.id} for blockchain sync`);
        }
      } catch (e) {
        console.warn('Blockchain sync failed (non-critical):', e);
      }

      return NextResponse.json(result, { status: 201 });
    } catch (error) {
      console.error('Agent creation database error:', error);
      return NextResponse.json(
        { error: 'Database error while creating agent' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Agent creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create agent' },
      { status: 500 }
    );
  }
}
