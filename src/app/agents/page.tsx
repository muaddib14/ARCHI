'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';
import { useAuth } from '@/hooks/useAuth';
import { useWallet } from '@solana/wallet-adapter-react';
import { SkeletonCard } from '@/components/SkeletonCard';
import { ConfirmModal } from '@/components/ConfirmModal';
import { WalletBadge } from '@/components/WalletBadge';

interface AgentItem {
  id: string;
  name: string;
  description: string;
  owner_wallet: string;
  blockchain_id: string | null;
  model: string;
  system_prompt: string;
  status: 'active' | 'inactive' | 'archived';
  created_at: string;
  updated_at: string;
}

export default function AgentsPage() {
  const { isAuthenticated, wallet } = useAuth();
  const { select, wallets } = useWallet();
  const [agents, setAgents] = useState<AgentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  // Form state for creating agent
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    model: 'claude-3-5-sonnet-20241022',
    system_prompt: '',
    owner_wallet: ''
  });

  useEffect(() => {
    fetch('/api/agents')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setAgents(data);
        }
      })
      .catch(err => console.error('Error fetching agents:', err))
      .finally(() => setLoading(false));
  }, []);

  const filteredAgents = useMemo(() => {
    return agents.filter(agent => {
      const matchesStatus = selectedStatus === 'All' || agent.status.toLowerCase() === selectedStatus.toLowerCase();
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        agent.name.toLowerCase().includes(q) ||
        agent.description.toLowerCase().includes(q) ||
        agent.model.toLowerCase().includes(q) ||
        agent.owner_wallet.toLowerCase().includes(q);

      return matchesStatus && matchesSearch;
    });
  }, [agents, searchQuery, selectedStatus]);

  const handleCreateAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !wallet) return;

    const loadingToast = toast.loading('Creating agent...');

    try {
      const res = await fetch('/api/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, owner_wallet: wallet })
      });

      if (!res.ok) {
        const error = await res.json();
        toast.error(`Failed to create agent: ${error.error || 'Unknown error'}`, { id: loadingToast });
        return;
      }

      const newAgent = await res.json();
      setAgents(prev => [newAgent, ...prev]);
      setShowCreateModal(false);
      setFormData({ name: '', description: '', model: 'claude-3-5-sonnet-20241022', system_prompt: '', owner_wallet: '' });

      toast.success(`Agent "${newAgent.name}" created successfully!`, { id: loadingToast });
    } catch (err) {
      console.error('Error creating agent:', err);
      toast.error('Failed to create agent. Please try again.', { id: loadingToast });
    }
  };

  const handleDeleteAgent = (e: React.MouseEvent, agentId: string, agentName: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDeleteTarget({ id: agentId, name: agentName });
  };

  const confirmDeleteAgent = async () => {
    if (!deleteTarget) return;
    const { id: agentId, name: agentName } = deleteTarget;
    setDeleteTarget(null);

    const loadingToast = toast.loading('Deleting agent...');

    try {
      const res = await fetch(`/api/agents/${agentId}`, { method: 'DELETE' });

      if (!res.ok) {
        const error = await res.json();
        toast.error(`Failed to delete agent: ${error.error || 'Unknown error'}`, { id: loadingToast });
        return;
      }

      setAgents(prev => prev.filter(a => a.id !== agentId));
      toast.success(`Agent "${agentName}" deleted successfully!`, { id: loadingToast });
    } catch (err) {
      console.error('Error deleting agent:', err);
      toast.error('Failed to delete agent. Please try again.', { id: loadingToast });
    }
  };

  if (!isAuthenticated) {
    const phantomWallet = wallets.find(w => w.adapter.name === 'Phantom');
    return (
      <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h1 style={{ marginBottom: '1rem' }}>Connect Phantom Wallet</h1>
          <p style={{ marginBottom: '2rem', color: '#666' }}>Please connect your Phantom wallet to continue</p>
          <button
            onClick={() => phantomWallet && select(phantomWallet.adapter.name)}
            style={{
              padding: '12px 24px',
              background: 'var(--purple-main, #667eea)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Connect Phantom
          </button>
        </div>
      </main>
    );
  }

  return (
    <main style={{ minHeight: '100vh', background: 'var(--canvas, #faf5ff)' }}>
      <Toaster position="bottom-right" />
      <ConfirmModal
        open={!!deleteTarget}
        title="Delete Agent?"
        message={`"${deleteTarget?.name}" will be archived and removed from the registry. This action cannot be undone from the UI.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        danger
        onConfirm={confirmDeleteAgent}
        onCancel={() => setDeleteTarget(null)}
      />
      {/* Top Announcement Bar */}
      <div className="announcement-bar">
        <span className="announcement-dot"></span>
        <span>ARCHI Agent Registry — Autonomous Agents on Solana</span>
        <a href="https://solana.com" target="_blank" rel="noopener noreferrer" className="announcement-link">
          Built on Solana →
        </a>
      </div>

      {/* Navigation */}
      <div className="nav-wrapper" style={{ top: '36px' }}>
        <nav className="nav-capsule">
          <Link href="/" className="nav-brand">
            <div className="nav-brand-icon">
              <img src="/logo.png" alt="ARCHI" />
            </div>
            <span className="nav-brand-text">ARCHI</span>
          </Link>
          <div className="nav-links">
            <Link href="/" className="nav-link">Home</Link>
            <Link href="/knowledge" className="nav-link">Knowledge</Link>
            <Link href="/agents" className="nav-link active" style={{ color: 'var(--purple-main)', fontWeight: '800' }}>Agents</Link>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="nav-link">GitHub</a>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <WalletBadge />
            <button className="nav-cta" onClick={() => setShowCreateModal(true)}>
              + Deploy Agent
            </button>
          </div>
        </nav>
      </div>

      {/* Agents Hero Header */}
      <section className="knowledge-hero">
        <div className="knowledge-hero-eyebrow">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M9 12h6" />
            <path d="M12 9v6" />
          </svg>
          AGENT REGISTRY
        </div>

        <h1 className="knowledge-hero-title">
          Autonomous AI Agents.<br />
          On-Chain. Owned by You.
        </h1>

        <p className="knowledge-hero-sub">
          Deploy, audit, and monitor self-sovereign AI agents executing trades, token mints, and RAG knowledge tasks directly on Solana.
        </p>

        <div className="knowledge-hero-links">
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-hero-primary"
            style={{ padding: '10px 24px', fontSize: '14px', borderRadius: '50px', cursor: 'pointer' }}
          >
            + Deploy New Agent
          </button>
          <a href="/knowledge" className="knowledge-hero-link">Explore Agent Tool Specs →</a>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="section" style={{ paddingTop: '0' }}>
        {/* Search Input */}
        <div className="search-wrapper">
          <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            className="search-input"
            placeholder="Search agents by name, model, wallet address, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Status Filters */}
        <div className="filter-container">
          {['All', 'Active', 'Inactive'].map(status => (
            <button
              key={status}
              className={`filter-pill ${selectedStatus === status ? 'active' : ''}`}
              onClick={() => setSelectedStatus(status)}
            >
              <span>{status}</span>
            </button>
          ))}
        </div>

        {/* Agent Cards Grid */}
        {loading ? (
          <div className="knowledge-grid">
            {[...Array(6)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filteredAgents.length > 0 ? (
          <div className="knowledge-grid">
            {filteredAgents.map(agent => {
              const isActive = agent.status === 'active';
              return (
                <div className="knowledge-card" key={agent.id} style={{ position: 'relative', transition: 'all 0.2s ease' }}>
                  <button
                    onClick={(e) => handleDeleteAgent(e, agent.id, agent.name)}
                    title="Delete agent"
                    aria-label={`Delete ${agent.name}`}
                    style={{
                      position: 'absolute',
                      top: '14px',
                      right: '14px',
                      width: '28px',
                      height: '28px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: '#ffffff',
                      border: '1.5px solid rgba(244, 63, 94, 0.3)',
                      borderRadius: '50%',
                      color: 'var(--retro-coral)',
                      cursor: 'pointer',
                      zIndex: 2,
                      transition: 'all 0.15s ease'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = 'var(--retro-coral)';
                      e.currentTarget.style.color = '#ffffff';
                      e.currentTarget.style.borderColor = 'var(--retro-coral)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = '#ffffff';
                      e.currentTarget.style.color = 'var(--retro-coral)';
                      e.currentTarget.style.borderColor = 'rgba(244, 63, 94, 0.3)';
                    }}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M3 6h18" />
                      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                    </svg>
                  </button>

                  <Link href={`/agents/${agent.id}`} style={{ display: 'block', cursor: 'pointer' }}>
                    <div>
                      <div className="knowledge-card-header">
                        <div className="knowledge-card-icon" style={{
                          background: isActive ? '#dcfce7' : 'var(--purple-soft)',
                          color: isActive ? '#166534' : 'var(--stone)',
                          position: 'relative'
                        }}>
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                            <rect x="5" y="9" width="14" height="11" rx="3" />
                            <path d="M9 9V6a3 3 0 0 1 6 0v3" />
                            <circle cx="9.5" cy="14.5" r="1.4" fill="currentColor" stroke="none" />
                            <circle cx="14.5" cy="14.5" r="1.4" fill="currentColor" stroke="none" />
                            <path d="M9.5 17.5h5" />
                          </svg>
                          {isActive && (
                            <span style={{
                              position: 'absolute',
                              top: '-2px',
                              right: '-2px',
                              width: '10px',
                              height: '10px',
                              borderRadius: '50%',
                              background: '#22c55e',
                              border: '2px solid #ffffff',
                              boxShadow: '0 0 0 2px rgba(34, 197, 94, 0.25)',
                              animation: 'pulse-dot 2s ease-in-out infinite'
                            }} />
                          )}
                        </div>
                        <div style={{ flex: 1 }}>
                          <h3 className="knowledge-card-title" style={{ marginBottom: '4px' }}>{agent.name}</h3>
                          <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '3px 10px',
                            background: isActive ? '#dcfce7' : 'var(--purple-soft)',
                            color: isActive ? '#166534' : 'var(--stone)',
                            fontSize: '11px',
                            fontWeight: '700',
                            borderRadius: 'var(--r-pill)',
                            border: `1px solid ${isActive ? '#86efac' : 'rgba(109, 40, 217, 0.2)'}`
                          }}>
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'currentColor' }}></span>
                            {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
                          </div>
                        </div>
                      </div>

                      <p className="knowledge-card-desc">{agent.description || 'No description provided'}</p>

                      <div style={{
                        display: 'flex',
                        gap: '12px',
                        fontSize: '12px',
                        color: 'var(--stone)',
                        marginBottom: '16px',
                        paddingBottom: '12px',
                        borderBottom: '1px solid var(--purple-soft)'
                      }}>
                        <div>
                          <div style={{ fontWeight: '700', marginBottom: '2px' }}>Model</div>
                          <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)' }}>{agent.model.split('-').pop()}</div>
                        </div>
                        <div style={{ flex: 1, textAlign: 'right' }}>
                          <div style={{ fontWeight: '700', marginBottom: '2px' }}>Owner</div>
                          <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', opacity: 0.7 }}>{agent.owner_wallet.slice(0, 6)}...{agent.owner_wallet.slice(-4)}</div>
                        </div>
                      </div>
                    </div>

                    <div style={{
                      display: 'flex',
                      gap: '8px',
                      fontSize: '12px',
                      color: 'var(--purple-main)',
                      fontWeight: '700'
                    }}>
                      <span>View Details</span>
                      <span>→</span>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '100px 40px',
            background: 'linear-gradient(135deg, rgba(243, 232, 255, 0.5) 0%, rgba(255, 255, 255, 0.8) 100%)',
            border: '2px solid var(--purple-light)',
            borderRadius: 'var(--r-lg)',
            maxWidth: '600px',
            margin: '0 auto',
            boxShadow: '0 4px 20px rgba(109, 40, 217, 0.06)'
          }}>
            <div style={{
              width: '3px',
              height: '48px',
              background: 'var(--purple-main)',
              margin: '0 auto 24px',
              borderRadius: '2px'
            }}></div>

            <h3 style={{
              fontSize: '28px',
              fontWeight: '900',
              color: 'var(--purple-deep)',
              marginBottom: '12px',
              letterSpacing: '-0.02em'
            }}>
              Ready to Deploy?
            </h3>

            <p style={{
              color: 'var(--stone)',
              fontSize: '15px',
              lineHeight: '1.7',
              marginBottom: '40px',
              maxWidth: '480px',
              margin: '0 auto 40px'
            }}>
              No agents in this filter yet. Deploy your first autonomous AI agent with custom tools, system prompts, and real-time monitoring.
            </p>

            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-hero-primary"
              style={{
                padding: '14px 36px',
                fontSize: '15px',
                borderRadius: '50px',
                cursor: 'pointer',
                fontWeight: '800',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translate(-2px, -2px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translate(0, 0)';
              }}
            >
              + Deploy First Agent
            </button>
          </div>
        )}
      </section>

      {/* Create Agent Modal */}
      {showCreateModal && (
        <div
          onClick={() => setShowCreateModal(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(30, 27, 75, 0.55)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            padding: '20px'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#ffffff',
              border: '2.5px solid var(--purple-deep)',
              borderRadius: 'var(--r-lg)',
              boxShadow: 'var(--shadow-retro-lg)',
              padding: '32px',
              maxWidth: '520px',
              width: '100%',
              maxHeight: '88vh',
              overflowY: 'auto'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: 'var(--purple-soft)',
                  border: '2px solid var(--purple-deep)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--purple-main)',
                  marginBottom: '20px'
                }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="5" y="9" width="14" height="11" rx="3" />
                  <path d="M9 9V6a3 3 0 0 1 6 0v3" />
                  <circle cx="9.5" cy="14.5" r="1.4" fill="currentColor" stroke="none" />
                  <circle cx="14.5" cy="14.5" r="1.4" fill="currentColor" stroke="none" />
                  <path d="M9.5 17.5h5" />
                </svg>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                aria-label="Close"
                style={{
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'var(--purple-soft)',
                  border: '1.5px solid var(--purple-light)',
                  borderRadius: '50%',
                  fontSize: '18px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  color: 'var(--purple-deep)',
                  lineHeight: 1
                }}
              >
                ×
              </button>
            </div>

            <h2 style={{
              fontSize: '24px',
              fontWeight: '900',
              color: 'var(--purple-deep)',
              marginBottom: '6px',
              letterSpacing: '-0.01em'
            }}>
              Deploy New Agent
            </h2>
            <p style={{
              fontSize: '13px',
              color: 'var(--stone)',
              marginBottom: '24px',
              lineHeight: '1.5'
            }}>
              Configure your autonomous AI agent. It will be registered on-chain under your connected wallet.
            </p>

            <form onSubmit={handleCreateAgent} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div>
                <label style={{
                  display: 'block',
                  fontWeight: '700',
                  fontSize: '12px',
                  color: 'var(--purple-deep)',
                  marginBottom: '8px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Agent Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid var(--purple-deep)',
                    borderRadius: 'var(--r-sm)',
                    fontFamily: 'var(--font-body)',
                    fontSize: '14px',
                    color: 'var(--purple-deep)',
                    boxShadow: '2px 2px 0px var(--purple-soft)',
                    outline: 'none'
                  }}
                  placeholder="e.g., Trading Sentinel"
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontWeight: '700',
                  fontSize: '12px',
                  color: 'var(--purple-deep)',
                  marginBottom: '8px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid var(--purple-deep)',
                    borderRadius: 'var(--r-sm)',
                    fontFamily: 'var(--font-body)',
                    fontSize: '14px',
                    color: 'var(--purple-deep)',
                    minHeight: '70px',
                    resize: 'vertical',
                    boxShadow: '2px 2px 0px var(--purple-soft)',
                    outline: 'none'
                  }}
                  placeholder="What does this agent do?"
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontWeight: '700',
                  fontSize: '12px',
                  color: 'var(--purple-deep)',
                  marginBottom: '8px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Model
                </label>
                <select
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid var(--purple-deep)',
                    borderRadius: 'var(--r-sm)',
                    fontFamily: 'var(--font-body)',
                    fontSize: '14px',
                    color: 'var(--purple-deep)',
                    boxShadow: '2px 2px 0px var(--purple-soft)',
                    outline: 'none',
                    background: '#ffffff',
                    cursor: 'pointer'
                  }}
                >
                  <option>claude-3-5-sonnet-20241022</option>
                  <option>claude-3-opus-20240229</option>
                </select>
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontWeight: '700',
                  fontSize: '12px',
                  color: 'var(--purple-deep)',
                  marginBottom: '8px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  System Prompt
                </label>
                <textarea
                  value={formData.system_prompt}
                  onChange={(e) => setFormData({ ...formData, system_prompt: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid var(--purple-deep)',
                    borderRadius: 'var(--r-sm)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '13px',
                    color: 'var(--purple-deep)',
                    minHeight: '90px',
                    resize: 'vertical',
                    boxShadow: '2px 2px 0px var(--purple-soft)',
                    outline: 'none'
                  }}
                  placeholder="Define the agent's behavior and personality..."
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontWeight: '700',
                  fontSize: '12px',
                  color: 'var(--purple-deep)',
                  marginBottom: '8px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Owner Wallet
                </label>
                <input
                  type="text"
                  readOnly
                  disabled
                  value={wallet || ''}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid var(--purple-light)',
                    borderRadius: 'var(--r-sm)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '12px',
                    background: 'var(--purple-soft)',
                    color: 'var(--stone)'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  style={{
                    flex: 1,
                    padding: '12px 20px',
                    background: '#ffffff',
                    color: 'var(--purple-deep)',
                    border: '2px solid var(--purple-deep)',
                    borderRadius: 'var(--r-pill)',
                    fontWeight: '700',
                    fontSize: '14px',
                    cursor: 'pointer',
                    boxShadow: 'var(--shadow-retro-sm)',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.transform = 'translate(-1px, -1px)')}
                  onMouseOut={(e) => (e.currentTarget.style.transform = 'translate(0, 0)')}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: '12px 20px',
                    background: 'var(--purple-main)',
                    color: '#ffffff',
                    border: '2px solid var(--purple-deep)',
                    borderRadius: 'var(--r-pill)',
                    fontWeight: '700',
                    fontSize: '14px',
                    cursor: 'pointer',
                    boxShadow: '2px 2px 0px var(--purple-deep)',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.transform = 'translate(-1px, -1px)')}
                  onMouseOut={(e) => (e.currentTarget.style.transform = 'translate(0, 0)')}
                >
                  ⚡ Deploy Agent
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
