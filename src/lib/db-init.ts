import { query } from './db';

export async function initializeDatabase() {
  try {
    // Create agents table
    await query(`
      CREATE TABLE IF NOT EXISTS agents (
        id BIGSERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        owner_wallet VARCHAR(255) NOT NULL,
        blockchain_id VARCHAR(255),
        model VARCHAR(255) DEFAULT 'claude-3-5-sonnet-20241022',
        system_prompt TEXT DEFAULT 'You are a helpful AI agent on Solana.',
        status VARCHAR(50) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create agent_tools table
    await query(`
      CREATE TABLE IF NOT EXISTS agent_tools (
        id BIGSERIAL PRIMARY KEY,
        agent_id BIGINT NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
        tool_name VARCHAR(255) NOT NULL,
        is_enabled BOOLEAN DEFAULT true,
        config JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create agent_interactions table
    await query(`
      CREATE TABLE IF NOT EXISTS agent_interactions (
        id BIGSERIAL PRIMARY KEY,
        agent_id BIGINT NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
        query TEXT NOT NULL,
        result TEXT,
        status VARCHAR(50) DEFAULT 'pending',
        tokens_used INTEGER,
        cost_lamports INTEGER,
        execution_ms INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create audit_logs table
    await query(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id BIGSERIAL PRIMARY KEY,
        agent_id BIGINT NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
        action VARCHAR(255) NOT NULL,
        details JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create indexes
    await query(`CREATE INDEX IF NOT EXISTS idx_agents_owner ON agents(owner_wallet)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_agents_status ON agents(status)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_interactions_agent ON agent_interactions(agent_id)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_interactions_created ON agent_interactions(created_at)`);

    console.log('✅ Database initialized successfully');
    return true;
  } catch (error) {
    console.error('❌ Database initialization error:', error);
    throw error;
  }
}
