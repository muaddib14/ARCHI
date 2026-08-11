'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';
import { useAuth } from '@/hooks/useAuth';
import { useWallet } from '@solana/wallet-adapter-react';
import { SkeletonCard } from '@/components/SkeletonCard';

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
            <Link href="/knowledge" className="nav-link">Knowledge</Link>
            <Link href="/agents" className="nav-link active" style={{ color: 'var(--purple-main)', fontWeight: '800' }}>Agents</Link>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="nav-link">GitHub</a>
          </div>
          <button className="nav-cta" onClick={() => setShowCreateModal(true)}>
            + Deploy Agent
          </button>
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
            {filteredAgents.map(agent => (
              <Link href={`/agents/${agent.id}`} key={agent.id}>
                <div className="knowledge-card" style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}>
                  <div>
                    <div className="knowledge-card-header">
                      <div className="knowledge-card-icon" style={{
                        background: agent.status === 'active' ? '#dcfce7' : 'var(--purple-soft)',
                        color: agent.status === 'active' ? '#166534' : 'var(--stone)',
                        fontSize: '20px'
                      }}>
                        {agent.status === 'active' ? '●' : '○'}
                      </div>
                      <div style={{ flex: 1 }}>
                        <h3 className="knowledge-card-title" style={{ marginBottom: '4px' }}>{agent.name}</h3>
                        <div style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '3px 10px',
                          background: agent.status === 'active' ? '#dcfce7' : 'var(--purple-soft)',
                          color: agent.status === 'active' ? '#166534' : 'var(--stone)',
                          fontSize: '11px',
                          fontWeight: '700',
                          borderRadius: 'var(--r-pill)',
                          border: `1px solid ${agent.status === 'active' ? '#86efac' : 'rgba(109, 40, 217, 0.2)'}`
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
                </div>
              </Link>
            ))}
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
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '2rem',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ margin: 0 }}>Deploy New Agent</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: '#999'
                }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCreateAgent} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>Agent Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '6px'
                  }}
                  placeholder="e.g., Trading Sentinel"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    minHeight: '80px'
                  }}
                  placeholder="What does this agent do?"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>Model</label>
                <select
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '6px'
                  }}
                >
                  <option>claude-3-5-sonnet-20241022</option>
                  <option>claude-3-opus-20240229</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>System Prompt</label>
                <textarea
                  value={formData.system_prompt}
                  onChange={(e) => setFormData({ ...formData, system_prompt: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    minHeight: '100px'
                  }}
                  placeholder="Define the agent's behavior and personality..."
                />
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>Owner Wallet</label>
                <input
                  type="text"
                  readOnly
                  disabled
                  value={wallet || ''}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    backgroundColor: '#f5f5f5',
                    color: '#999'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: '0.75rem 1.5rem',
                    background: 'var(--purple-main, #667eea)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Deploy Agent
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  style={{
                    flex: 1,
                    padding: '0.75rem 1.5rem',
                    background: '#f5f5f5',
                    border: 'none',
                    borderRadius: '6px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
