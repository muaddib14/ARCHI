import { NextRequest, NextResponse } from 'next/server';

const MOCK_AGENTS = [
  {
    id: 'agent-solana-arb-01',
    name: 'Jupiter Arbitrage Sentinel',
    description: 'Autonomous high-frequency arbitrage agent monitoring DEX price divergences across Raydium and Orca.',
    owner_wallet: '7v9W...xQ8z',
    blockchain_id: 'solana-mainnet',
    model: 'claude-3-5-sonnet',
    system_prompt: 'Monitor DEX liquidity pools and execute atomic swaps on Solana.',
    status: 'active',
    created_at: '2026-08-10T14:32:00Z',
    updated_at: '2026-08-11T10:00:00Z'
  },
  {
    id: 'agent-token-launcher-02',
    name: 'Pump.fun Token Foundry',
    description: 'Deploys SPL tokens with custom bonding curves and automated social announcement dispatch.',
    owner_wallet: '3a1X...mK9p',
    blockchain_id: 'solana-mainnet',
    model: 'gpt-4o',
    system_prompt: 'Handle SPL token deployment and liquidity pool seeding.',
    status: 'active',
    created_at: '2026-08-09T09:15:00Z',
    updated_at: '2026-08-11T11:20:00Z'
  },
  {
    id: 'agent-rag-memory-03',
    name: 'Supabase Vector Memory',
    description: 'RAG knowledge agent vectorizing on-chain transaction history into pgvector embeddings.',
    owner_wallet: '9b2Y...pL4k',
    blockchain_id: 'solana-mainnet',
    model: 'claude-3-5-sonnet',
    system_prompt: 'Index Solana transactions and answer queries with pgvector memory.',
    status: 'active',
    created_at: '2026-08-08T18:45:00Z',
    updated_at: '2026-08-11T08:10:00Z'
  },
  {
    id: 'agent-portfolio-rebalancer-04',
    name: 'Pyth Oracle Rebalancer',
    description: 'Rebalances asset portfolios dynamically based on real-time Pyth Network price feeds.',
    owner_wallet: '5c3Z...nR8m',
    blockchain_id: 'solana-mainnet',
    model: 'o3-mini',
    system_prompt: 'Fetch Pyth price feeds and maintain target asset ratios.',
    status: 'inactive',
    created_at: '2026-08-05T12:00:00Z',
    updated_at: '2026-08-10T16:30:00Z'
  }
];

export async function GET() {
  try {
    if (process.env.DATABASE_URL) {
      try {
        const { query } = await import('../../../../lib/db');
        const dbAgents = await query(
          'SELECT * FROM agents WHERE status != $1 ORDER BY created_at DESC',
          ['archived']
        );
        if (dbAgents && dbAgents.length > 0) {
          return NextResponse.json(dbAgents);
        }
      } catch (e) {
        console.warn('DB query fallback to mock agents:', e);
      }
    }
    return NextResponse.json(MOCK_AGENTS);
  } catch (error) {
    return NextResponse.json(MOCK_AGENTS);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newAgent = {
      id: `agent-${Date.now()}`,
      name: body.name || 'New Custom Agent',
      description: body.description || 'Autonomous AI agent on Solana.',
      owner_wallet: body.owner_wallet || '7v9W...xQ8z',
      blockchain_id: 'solana-mainnet',
      model: body.model || 'claude-3-5-sonnet',
      system_prompt: body.system_prompt || 'You are an autonomous AI agent.',
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    return NextResponse.json(newAgent, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create agent' }, { status: 500 });
  }
}
