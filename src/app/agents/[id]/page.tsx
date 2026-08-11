'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';
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
  const { isAuthenticated } = useAuth();
  const agentId = params.id as string;

  const [agent, setAgent] = useState<Agent | null>(null);
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [executing, setExecuting] = useState(false);
  const [result, setResult] = useState('');
  const [resultStatus, setResultStatus] = useState<'success' | 'error' | null>(null);
  const [executionTime, setExecutionTime] = useState(0);

  useEffect(() => {
    const fetchAgent = async () => {
      try {
        const res = await fetch(`/api/agents/${agentId}`);
        if (!res.ok) throw new Error('Failed to load agent');
        const data = await res.json();
        setAgent(data.agent || data);
      } catch (err) {
        console.error('Error loading agent:', err);
        toast.error('Failed to load agent');
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

    const loadingToast = toast.loading('Executing query...');
    setExecuting(true);
    setResult('');
    setResultStatus(null);
    setExecutionTime(0);

    try {
      const startTime = Date.now();
      const res = await fetch('/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agent_id: agentId, query })
      });

      const data = await res.json();
      setExecutionTime(Date.now() - startTime);

      const isError = !res.ok || data.status === 'error';
      setResultStatus(isError ? 'error' : 'success');
      setResult(isError ? (data.error || data.result || 'Execution failed') : (data.result || 'No response'));

      const interRes = await fetch(`/api/interactions?agent_id=${agentId}&limit=20`);
      const interData = await interRes.json();
      setInteractions(interData.interactions || []);

      if (isError) {
        toast.error('Query execution failed', { id: loadingToast });
      } else {
        setQuery('');
        toast.success('Query executed successfully!', { id: loadingToast });
      }
    } catch (err) {
      setResultStatus('error');
      setResult(err instanceof Error ? err.message : 'Execution failed');
      toast.error('Failed to execute query', { id: loadingToast });
    } finally {
      setExecuting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--canvas)' }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ color: 'var(--purple-deep)' }}>Connect Wallet</h1>
          <p style={{ color: 'var(--stone)' }}>Please connect your Phantom wallet</p>
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main style={{ minHeight: '100vh', background: 'var(--canvas)' }}>
        <div className="announcement-bar">
          <span className="announcement-dot"></span>
          <span>Agent Execution Console — Autonomous AI on Solana</span>
        </div>

        <div className="nav-wrapper" style={{ top: '36px' }}>
          <nav className="nav-capsule">
            <Link href="/" className="nav-brand">
              <div className="nav-brand-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" />
                  <path d="M2 17L12 22L22 17" />
                  <path d="M2 12L12 17L22 12" />
                </svg>
              </div>
              <span className="nav-brand-text">ARCHI</span>
            </Link>
          </nav>
        </div>

        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '130px 24px 60px' }}>
          {/* Header Skeleton */}
          <div style={{
            background: '#ffffff',
            border: '2.5px solid var(--purple-deep)',
            borderRadius: 'var(--r-lg)',
            padding: '36px',
            marginBottom: '40px',
            animation: 'pulse 2s infinite'
          }}>
            <div style={{ marginBottom: '20px' }}>
              <div style={{
                height: '32px',
                background: 'var(--purple-soft)',
                borderRadius: '8px',
                marginBottom: '12px',
                width: '40%'
              }} />
              <div style={{
                height: '16px',
                background: 'var(--purple-soft)',
                borderRadius: '6px',
                width: '60%'
              }} />
            </div>
          </div>

          {/* Two Column Skeleton */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '60px' }}>
            <div style={{
              background: '#ffffff',
              border: '2.5px solid var(--purple-deep)',
              borderRadius: 'var(--r-lg)',
              padding: '24px',
              height: '600px',
              animation: 'pulse 2s infinite'
            }} />
            <div style={{
              background: '#ffffff',
              border: '2.5px solid var(--purple-deep)',
              borderRadius: 'var(--r-lg)',
              padding: '24px',
              height: '600px',
              animation: 'pulse 2s infinite'
            }} />
          </div>
        </div>

        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}</style>
      </main>
    );
  }

  if (!agent) {
    return (
      <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--canvas)' }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ color: 'var(--purple-deep)' }}>Agent Not Found</h1>
          <Link href="/agents" style={{ color: 'var(--purple-main)', fontWeight: '700' }}>Back to Registry</Link>
        </div>
      </main>
    );
  }

  return (
    <main style={{ minHeight: '100vh', background: 'var(--canvas)' }}>
      <Toaster position="bottom-right" />

      {/* Announcement Bar */}
      <div className="announcement-bar">
        <span className="announcement-dot"></span>
        <span>Agent Execution Console — Autonomous AI on Solana</span>
        <a href="https://solana.com" target="_blank" rel="noopener noreferrer" className="announcement-link">
          Built on Solana →
        </a>
      </div>

      {/* Navigation */}
      <div className="nav-wrapper" style={{ top: '36px' }}>
        <nav className="nav-capsule">
          <Link href="/" className="nav-brand">
            <div className="nav-brand-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" />
                <path d="M2 17L12 22L22 17" />
                <path d="M2 12L12 17L22 12" />
              </svg>
            </div>
            <span className="nav-brand-text">ARCHI</span>
          </Link>
          <div className="nav-links">
            <Link href="/" className="nav-link">Home</Link>
            <Link href="/agents" className="nav-link active" style={{ color: 'var(--purple-main)', fontWeight: '800' }}>Agents</Link>
          </div>
          <Link href="/agents" className="nav-cta">← Back to Registry</Link>
        </nav>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '130px 24px 60px' }}>
        {/* Agent Header Card */}
        <div style={{
          background: '#ffffff',
          border: '2.5px solid var(--purple-deep)',
          borderRadius: 'var(--r-lg)',
          padding: '36px',
          boxShadow: 'var(--shadow-retro)',
          marginBottom: '40px'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div style={{ flex: 1 }}>
              <h1 style={{
                fontSize: '32px',
                fontWeight: '900',
                color: 'var(--purple-deep)',
                marginBottom: '8px',
                letterSpacing: '-0.02em'
              }}>
                {agent.name}
              </h1>
              <p style={{
                fontSize: '16px',
                color: 'var(--stone)',
                lineHeight: '1.6',
                marginBottom: '0'
              }}>
                {agent.description}
              </p>
            </div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              background: agent.status === 'active' ? '#dcfce7' : 'var(--purple-soft)',
              color: agent.status === 'active' ? '#166534' : 'var(--stone)',
              fontSize: '12px',
              fontWeight: '700',
              borderRadius: 'var(--r-pill)',
              border: `1.5px solid ${agent.status === 'active' ? '#86efac' : 'rgba(109, 40, 217, 0.2)'}`
            }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'currentColor' }}></span>
              {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '24px',
            paddingTop: '24px',
            borderTop: '1.5px solid var(--purple-soft)'
          }}>
            <div>
              <p style={{ fontSize: '11px', fontWeight: '800', color: 'var(--purple-main)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>Model</p>
              <p style={{ fontSize: '14px', fontWeight: '700', color: 'var(--purple-deep)', margin: '0', fontFamily: 'var(--font-mono)' }}>{agent.model.split('-').slice(-2).join('-')}</p>
            </div>
            <div>
              <p style={{ fontSize: '11px', fontWeight: '800', color: 'var(--purple-main)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>Owner</p>
              <p style={{ fontSize: '13px', fontWeight: '600', color: 'var(--purple-deep)', margin: '0', fontFamily: 'var(--font-mono)' }}>{agent.owner_wallet.slice(0, 8)}...{agent.owner_wallet.slice(-6)}</p>
            </div>
            <div>
              <p style={{ fontSize: '11px', fontWeight: '800', color: 'var(--purple-main)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>Created</p>
              <p style={{ fontSize: '14px', fontWeight: '700', color: 'var(--purple-deep)', margin: '0' }}>{new Date(agent.created_at).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '60px' }}>
          {/* Execution Console */}
          <div style={{
            background: '#ffffff',
            border: '2.5px solid var(--purple-deep)',
            borderRadius: 'var(--r-lg)',
            padding: '24px',
            boxShadow: 'var(--shadow-retro-sm)'
          }}>
            <h2 style={{
              fontSize: '18px',
              fontWeight: '800',
              color: 'var(--purple-deep)',
              marginBottom: '20px',
              letterSpacing: '-0.01em'
            }}>
              Execution Console
            </h2>

            <form onSubmit={handleExecute} style={{ marginBottom: '20px' }}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{
                  display: 'block',
                  fontWeight: '700',
                  fontSize: '13px',
                  color: 'var(--purple-deep)',
                  marginBottom: '8px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Query
                </label>
                <textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ask your agent a question..."
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid var(--purple-deep)',
                    borderRadius: 'var(--r-sm)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '13px',
                    minHeight: '100px',
                    resize: 'vertical',
                    color: 'var(--purple-deep)',
                    background: '#ffffff',
                    boxShadow: '2px 2px 0px var(--purple-soft)'
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
                  background: executing ? 'var(--pebble)' : 'var(--purple-main)',
                  color: 'white',
                  border: '2px solid var(--purple-deep)',
                  borderRadius: 'var(--r-pill)',
                  fontWeight: '700',
                  cursor: executing || !query.trim() ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  boxShadow: '2px 2px 0px var(--purple-deep)',
                  transition: 'all 0.15s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
                onMouseOver={(e) => !executing && (e.currentTarget.style.transform = 'translate(-1px, -1px)')}
                onMouseOut={(e) => (e.currentTarget.style.transform = 'translate(0, 0)')}
              >
                {executing ? (
                  <>
                    <span
                      style={{
                        width: '14px',
                        height: '14px',
                        border: '2px solid rgba(255,255,255,0.4)',
                        borderTopColor: '#ffffff',
                        borderRadius: '50%',
                        display: 'inline-block',
                        animation: 'spin 0.7s linear infinite'
                      }}
                    />
                    Executing...
                  </>
                ) : (
                  <>⚡ Execute Query</>
                )}
              </button>
              <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
              `}</style>
            </form>

            {result && (
              <div style={{
                background: resultStatus === 'error' ? '#fdf2f8' : '#f0fdf4',
                border: `1.5px solid ${resultStatus === 'error' ? 'var(--retro-coral)' : 'var(--retro-mint)'}`,
                borderRadius: 'var(--r-sm)',
                padding: '12px',
                marginBottom: '16px'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '11px',
                  fontWeight: '700',
                  color: resultStatus === 'error' ? '#9d174d' : '#166534',
                  marginBottom: '8px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  <span>{resultStatus === 'error' ? '✕' : '✓'}</span>
                  <span>{resultStatus === 'error' ? 'Error' : 'Response'} {executionTime > 0 && `(${executionTime}ms)`}</span>
                </div>
                <pre style={{
                  margin: 0,
                  fontSize: '12px',
                  overflow: 'auto',
                  maxHeight: '250px',
                  fontFamily: 'var(--font-mono)',
                  color: resultStatus === 'error' ? '#9d174d' : '#166534',
                  lineHeight: '1.5',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word'
                }}>
                  {result}
                </pre>
              </div>
            )}

            {/* System Prompt */}
            <div style={{
              background: 'var(--purple-soft)',
              border: '1.5px solid var(--purple-light)',
              borderRadius: 'var(--r-sm)',
              padding: '12px'
            }}>
              <p style={{
                fontSize: '11px',
                fontWeight: '700',
                color: 'var(--purple-main)',
                margin: '0 0 8px 0',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                System Prompt
              </p>
              <pre style={{
                margin: 0,
                fontSize: '11px',
                overflow: 'auto',
                maxHeight: '120px',
                fontFamily: 'var(--font-mono)',
                color: 'var(--purple-deep)',
                lineHeight: '1.4'
              }}>
                {agent.system_prompt}
              </pre>
            </div>
          </div>

          {/* Interaction History */}
          <div style={{
            background: '#ffffff',
            border: '2.5px solid var(--purple-deep)',
            borderRadius: 'var(--r-lg)',
            padding: '24px',
            boxShadow: 'var(--shadow-retro-sm)',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <h2 style={{
              fontSize: '18px',
              fontWeight: '800',
              color: 'var(--purple-deep)',
              marginBottom: '16px',
              letterSpacing: '-0.01em'
            }}>
              Recent Interactions
            </h2>

            {interactions.length === 0 ? (
              <div style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--stone)',
                textAlign: 'center',
                padding: '40px 20px'
              }}>
                <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.6' }}>
                  No interactions yet.<br />Execute a query to start.
                </p>
              </div>
            ) : (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                maxHeight: '500px',
                overflow: 'auto'
              }}>
                {interactions.map(interaction => {
                  const isFailed = interaction.status === 'failed';
                  return (
                    <div key={interaction.id} style={{
                      border: `1.5px solid ${isFailed ? 'var(--retro-coral)' : 'var(--purple-light)'}`,
                      borderRadius: 'var(--r-sm)',
                      padding: '12px',
                      background: isFailed ? '#fdf2f8' : 'var(--purple-soft)',
                      transition: 'all 0.2s ease'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '6px'
                      }}>
                        <div style={{
                          fontSize: '10px',
                          fontWeight: '700',
                          color: isFailed ? '#9d174d' : 'var(--purple-main)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}>
                          {new Date(interaction.created_at).toLocaleString()}
                        </div>
                        <div style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '2px 8px',
                          borderRadius: 'var(--r-pill)',
                          fontSize: '9px',
                          fontWeight: '800',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          background: isFailed ? '#fecdd3' : '#dcfce7',
                          color: isFailed ? '#9d174d' : '#166534'
                        }}>
                          <span>{isFailed ? '✕' : '✓'}</span>
                          {isFailed ? 'Failed' : 'Success'}
                        </div>
                      </div>
                      <p style={{
                        fontSize: '13px',
                        fontWeight: '700',
                        color: 'var(--purple-deep)',
                        margin: '0 0 6px 0',
                        lineHeight: '1.4'
                      }}>
                        {interaction.query}
                      </p>
                      {interaction.result && (
                        <p style={{
                          fontSize: '12px',
                          color: 'var(--stone)',
                          margin: '0',
                          maxHeight: '60px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          lineHeight: '1.4'
                        }}>
                          {interaction.result.substring(0, 120)}{interaction.result.length > 120 ? '...' : ''}
                        </p>
                      )}
                      <div style={{
                        fontSize: '10px',
                        color: 'var(--pebble)',
                        marginTop: '6px',
                        fontWeight: '600'
                      }}>
                        ⚡ {interaction.execution_ms}ms
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
