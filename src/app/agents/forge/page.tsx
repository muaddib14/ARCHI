'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

export default function AgentForgePage() {
  const router = useRouter();
  const { isAuthenticated, wallet } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    model: 'claude-3-5-sonnet-20241022',
    system_prompt: ''
  });

  if (!isAuthenticated) {
    return (
      <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <h1>Connect Wallet</h1>
          <p>Please connect your Phantom wallet to create an agent</p>
        </div>
      </main>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!formData.name.trim()) {
        throw new Error('Agent name is required');
      }

      const res = await fetch('/api/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          owner_wallet: wallet
        })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create agent');
      }

      const newAgent = await res.json();
      router.push(`/agents/${newAgent.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ minHeight: '100vh', background: '#faf5ff' }}>
      {/* Navigation */}
      <div className="nav-wrapper">
        <nav className="nav-capsule">
          <Link href="/" className="nav-brand">
            <span className="nav-brand-text">ARCHI</span>
          </Link>
          <div className="nav-links">
            <Link href="/" className="nav-link">Home</Link>
            <Link href="/agents" className="nav-link">Agents</Link>
          </div>
        </nav>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <Link href="/agents" style={{ color: '#667eea', textDecoration: 'none', marginBottom: '1rem', display: 'block' }}>
            ← Back to Agents
          </Link>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Create New Agent</h1>
          <p style={{ color: '#666' }}>Forge your own autonomous AI agent on Solana</p>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '2rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          {error && (
            <div style={{
              background: '#fee2e2',
              border: '1px solid #fca5a5',
              color: '#991b1b',
              padding: '1rem',
              borderRadius: '6px',
              marginBottom: '1.5rem'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Agent Name */}
            <div>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>
                Agent Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Trading Sentinel"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '1rem'
                }}
              />
            </div>

            {/* Description */}
            <div>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="What does this agent do?"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  minHeight: '100px',
                  fontSize: '1rem',
                  fontFamily: 'inherit'
                }}
              />
            </div>

            {/* Model Selection */}
            <div>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>
                Model
              </label>
              <select
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '1rem'
                }}
              >
                <option value="claude-3-5-sonnet-20241022">Claude 3.5 Sonnet (Recommended)</option>
                <option value="claude-3-opus-20240229">Claude 3 Opus</option>
              </select>
            </div>

            {/* System Prompt */}
            <div>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>
                System Prompt
              </label>
              <textarea
                value={formData.system_prompt}
                onChange={(e) => setFormData({ ...formData, system_prompt: e.target.value })}
                placeholder="Define the agent's behavior, personality, and instructions..."
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  minHeight: '150px',
                  fontSize: '0.95rem',
                  fontFamily: 'monospace'
                }}
              />
              <p style={{ fontSize: '0.85rem', color: '#999', marginTop: '0.5rem' }}>
                Example: "You are a DeFi trading bot that analyzes market conditions and executes trades on Solana. Always verify contract addresses before executing transactions."
              </p>
            </div>

            {/* Owner Wallet */}
            <div>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>
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
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  backgroundColor: '#f5f5f5',
                  color: '#999',
                  fontFamily: 'monospace'
                }}
              />
            </div>

            {/* Submit Button */}
            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <button
                type="submit"
                disabled={loading}
                style={{
                  flex: 1,
                  padding: '12px 24px',
                  background: loading ? '#ccc' : '#667eea',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: '600',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: '1rem'
                }}
              >
                {loading ? 'Creating Agent...' : 'Create Agent'}
              </button>
              <Link
                href="/agents"
                style={{
                  flex: 1,
                  padding: '12px 24px',
                  background: '#f5f5f5',
                  color: '#333',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  textAlign: 'center',
                  textDecoration: 'none'
                }}
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>

        {/* Info Card */}
        <div style={{
          background: '#f0f4ff',
          border: '1px solid #e0e4ff',
          borderRadius: '12px',
          padding: '1.5rem',
          marginTop: '2rem'
        }}>
          <h3 style={{ marginTop: 0, color: '#667eea' }}>How Agent Forging Works</h3>
          <ul style={{ color: '#666', lineHeight: '1.8' }}>
            <li><strong>Name & Description:</strong> Identify your agent's purpose</li>
            <li><strong>Model:</strong> Choose the AI model (Claude recommended)</li>
            <li><strong>System Prompt:</strong> Define behavior, constraints, and capabilities</li>
            <li><strong>Execution:</strong> Agent will be deployed and ready to execute queries</li>
            <li><strong>Tools:</strong> Add tools from the agent detail page after creation</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
