'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

interface Agent {
  id: string;
  name: string;
  description: string;
  owner_wallet: string;
  model: string;
  system_prompt: string;
  status: 'active' | 'inactive' | 'archived';
  created_at: string;
  updated_at: string;
}

interface Interaction {
  id: string;
  query: string;
  result: string;
  status: string;
  execution_ms: number;
  created_at: string;
}

export default function AgentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, wallet } = useAuth();
  const agentId = params.id as string;

  const [agent, setAgent] = useState<Agent | null>(null);
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [executing, setExecuting] = useState(false);
  const [result, setResult] = useState('');
  const [executionTime, setExecutionTime] = useState(0);

  // Load agent details
  useEffect(() => {
    const fetchAgent = async () => {
      try {
        const res = await fetch(`/api/agents/${agentId}`);
        if (!res.ok) throw new Error('Failed to load agent');
        const data = await res.json();
        setAgent(data.agent);
      } catch (err) {
        console.error('Error loading agent:', err);
      } finally {
        setLoading(false);
      }
    };

    const fetchInteractions = async () => {
      try {
        const res = await fetch(`/api/interactions?agent_id=${agentId}&limit=20`);
        if (!res.ok) throw new Error('Failed to load interactions');
        const data = await res.json();
        setInteractions(data.interactions || []);
      } catch (err) {
        console.error('Error loading interactions:', err);
      }
    };

    if (agentId) {
      fetchAgent();
      fetchInteractions();
    }
  }, [agentId]);

  const handleExecute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setExecuting(true);
    setResult('');
    setExecutionTime(0);

    try {
      const startTime = Date.now();
      const res = await fetch('/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agent_id: agentId, query })
      });

      if (!res.ok) throw new Error('Execution failed');
      const data = await res.json();
      setExecutionTime(Date.now() - startTime);
      setResult(data.result || 'No response');

      // Refresh interactions
      const interRes = await fetch(`/api/interactions?agent_id=${agentId}&limit=20`);
      const interData = await interRes.json();
      setInteractions(interData.interactions || []);

      setQuery('');
    } catch (err) {
      setResult(`Error: ${err instanceof Error ? err.message : 'Execution failed'}`);
    } finally {
      setExecuting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <h1>Connect Wallet</h1>
          <p>Please connect your Phantom wallet</p>
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>Loading agent...</p>
      </main>
    );
  }

  if (!agent) {
    return (
      <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <h1>Agent Not Found</h1>
          <Link href="/agents" style={{ color: '#667eea' }}>Back to Registry</Link>
        </div>
      </main>
    );
  }

  return (
    <main style={{ minHeight: '100vh', background: 'var(--canvas, #faf5ff)' }}>
      {/* Navigation */}
      <div className="nav-wrapper">
        <nav className="nav-capsule">
          <Link href="/" className="nav-brand">
            <span className="nav-brand-text">ARCHI</span>
          </Link>
          <div className="nav-links">
            <Link href="/" className="nav-link">Home</Link>
            <Link href="/agents" className="nav-link active">Agents</Link>
          </div>
        </nav>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        {/* Agent Header */}
        <div style={{ marginBottom: '2rem' }}>
          <Link href="/agents" style={{ color: '#667eea', textDecoration: 'none', marginBottom: '1rem', display: 'block' }}>
            ← Back to Agents
          </Link>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{agent.name}</h1>
          <p style={{ color: '#666', fontSize: '1.1rem', marginBottom: '1rem' }}>{agent.description}</p>
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            <div>
              <p style={{ color: '#999', fontSize: '0.9rem' }}>Model</p>
              <p style={{ fontWeight: '600' }}>{agent.model}</p>
            </div>
            <div>
              <p style={{ color: '#999', fontSize: '0.9rem' }}>Status</p>
              <p style={{ fontWeight: '600' }}>
                <span className={agent.status === 'active' ? 'badge-success' : 'badge-warning'} style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '0.85rem' }}>
                  {agent.status}
                </span>
              </p>
            </div>
            <div>
              <p style={{ color: '#999', fontSize: '0.9rem' }}>Created</p>
              <p style={{ fontWeight: '600' }}>{new Date(agent.created_at).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
          {/* Execution Console */}
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '2rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ marginBottom: '1.5rem' }}>Execution Console</h2>

            <form onSubmit={handleExecute} style={{ marginBottom: '1.5rem' }}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>Query</label>
                <textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ask your agent a question..."
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontFamily: 'monospace',
                    fontSize: '0.9rem',
                    minHeight: '100px',
                    resize: 'vertical'
                  }}
                  disabled={executing}
                />
              </div>
              <button
                type="submit"
                disabled={executing || !query.trim()}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: executing ? '#ccc' : '#667eea',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: '600',
                  cursor: executing ? 'not-allowed' : 'pointer',
                  fontSize: '1rem'
                }}
              >
                {executing ? 'Executing...' : 'Execute Query'}
              </button>
            </form>

            {result && (
              <div style={{
                background: '#f5f5f5',
                border: '1px solid #ddd',
                borderRadius: '6px',
                padding: '1rem',
                marginBottom: '1rem'
              }}>
                <div style={{ fontSize: '0.85rem', color: '#999', marginBottom: '0.5rem' }}>
                  Response {executionTime > 0 && `(${executionTime}ms)`}
                </div>
                <pre style={{
                  margin: 0,
                  fontSize: '0.9rem',
                  overflow: 'auto',
                  maxHeight: '300px',
                  fontFamily: 'monospace'
                }}>
                  {result}
                </pre>
              </div>
            )}

            {/* System Prompt */}
            <div style={{
              background: '#f0f4ff',
              border: '1px solid #e0e4ff',
              borderRadius: '6px',
              padding: '1rem'
            }}>
              <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem' }}>System Prompt</p>
              <pre style={{
                margin: 0,
                fontSize: '0.85rem',
                overflow: 'auto',
                maxHeight: '150px',
                fontFamily: 'monospace',
                color: '#333'
              }}>
                {agent.system_prompt}
              </pre>
            </div>
          </div>

          {/* Interaction History */}
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '2rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ marginBottom: '1.5rem' }}>Interaction History</h2>

            {interactions.length === 0 ? (
              <p style={{ color: '#999', textAlign: 'center', padding: '2rem 0' }}>
                No interactions yet. Execute a query to start.
              </p>
            ) : (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                maxHeight: '600px',
                overflow: 'auto'
              }}>
                {interactions.map(interaction => (
                  <div key={interaction.id} style={{
                    border: '1px solid #eee',
                    borderRadius: '6px',
                    padding: '1rem',
                    background: '#fafafa'
                  }}>
                    <div style={{ marginBottom: '0.5rem' }}>
                      <p style={{ fontSize: '0.85rem', color: '#999', margin: '0 0 0.25rem 0' }}>
                        {new Date(interaction.created_at).toLocaleString()}
                      </p>
                      <p style={{ fontSize: '0.9rem', fontWeight: '600', margin: 0 }}>
                        {interaction.query}
                      </p>
                    </div>
                    {interaction.result && (
                      <p style={{
                        fontSize: '0.85rem',
                        color: '#666',
                        margin: '0.5rem 0 0 0',
                        maxHeight: '80px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {interaction.result.substring(0, 150)}...
                      </p>
                    )}
                    <div style={{ fontSize: '0.75rem', color: '#999', marginTop: '0.5rem' }}>
                      {interaction.execution_ms}ms · Status: {interaction.status}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
