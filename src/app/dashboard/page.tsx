'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

interface Agent {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'archived';
}

interface Interaction {
  id: string;
  agent_id: string;
  query: string;
  result: string;
  execution_ms: number;
  created_at: string;
}

export default function DashboardPage() {
  const { isAuthenticated } = useAuth();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [stats, setStats] = useState({
    totalAgents: 0,
    activeAgents: 0,
    totalInteractions: 0,
    avgExecutionTime: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch agents
        const agentsRes = await fetch('/api/agents');
        const agentsData = await agentsRes.json();
        setAgents(agentsData);

        // Fetch interactions
        const interactionsRes = await fetch('/api/interactions?limit=50');
        const interactionsData = await interactionsRes.json();
        setInteractions(interactionsData.interactions || []);

        // Calculate stats
        const totalAgents = agentsData.length;
        const activeAgents = agentsData.filter((a: Agent) => a.status === 'active').length;
        const totalInteractions = interactionsData.interactions?.length || 0;
        const avgExecutionTime = interactionsData.interactions?.length > 0
          ? Math.round(
              interactionsData.interactions.reduce((sum: number, i: Interaction) => sum + (i.execution_ms || 0), 0) /
              interactionsData.interactions.length
            )
          : 0;

        setStats({
          totalAgents,
          activeAgents,
          totalInteractions,
          avgExecutionTime
        });
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchDashboardData();
    }
  }, [isAuthenticated]);

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
            <Link href="/dashboard" className="nav-link active" style={{ color: '#667eea', fontWeight: '800' }}>
              Dashboard
            </Link>
          </div>
        </nav>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        {/* Page Header */}
        <div style={{ marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Dashboard</h1>
          <p style={{ color: '#666', fontSize: '1.1rem' }}>Overview of your ARCHI agents and activity</p>
        </div>

        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
          marginBottom: '3rem'
        }}>
          {/* Total Agents */}
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '2rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '2px solid #667eea'
          }}>
            <p style={{ color: '#999', fontSize: '0.9rem', margin: 0 }}>Total Agents</p>
            <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#667eea', margin: '0.5rem 0 0 0' }}>
              {stats.totalAgents}
            </p>
          </div>

          {/* Active Agents */}
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '2rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '2px solid #10b981'
          }}>
            <p style={{ color: '#999', fontSize: '0.9rem', margin: 0 }}>Active Agents</p>
            <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#10b981', margin: '0.5rem 0 0 0' }}>
              {stats.activeAgents}
            </p>
          </div>

          {/* Total Interactions */}
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '2rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '2px solid #f59e0b'
          }}>
            <p style={{ color: '#999', fontSize: '0.9rem', margin: 0 }}>Total Interactions</p>
            <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#f59e0b', margin: '0.5rem 0 0 0' }}>
              {stats.totalInteractions}
            </p>
          </div>

          {/* Avg Execution Time */}
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '2rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '2px solid #8b5cf6'
          }}>
            <p style={{ color: '#999', fontSize: '0.9rem', margin: 0 }}>Avg Execution Time</p>
            <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#8b5cf6', margin: '0.5rem 0 0 0' }}>
              {stats.avgExecutionTime}ms
            </p>
          </div>
        </div>

        {/* Two Column Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          {/* Agents Overview */}
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '2rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ marginBottom: '1.5rem' }}>Your Agents</h2>
            {agents.length === 0 ? (
              <p style={{ color: '#999', textAlign: 'center', padding: '2rem 0' }}>
                No agents yet.{' '}
                <Link href="/agents/forge" style={{ color: '#667eea' }}>
                  Create one
                </Link>
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {agents.map(agent => (
                  <Link
                    key={agent.id}
                    href={`/agents/${agent.id}`}
                    style={{
                      border: '1px solid #eee',
                      borderRadius: '6px',
                      padding: '1rem',
                      textDecoration: 'none',
                      color: '#333',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      transition: 'all 0.2s',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.background = '#f9f9f9';
                      (e.currentTarget as HTMLElement).style.borderColor = '#667eea';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.background = 'transparent';
                      (e.currentTarget as HTMLElement).style.borderColor = '#eee';
                    }}
                  >
                    <span style={{ fontWeight: '600' }}>{agent.name}</span>
                    <span
                      style={{
                        fontSize: '0.85rem',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        background: agent.status === 'active' ? '#dcfce7' : '#fef3c7',
                        color: agent.status === 'active' ? '#166534' : '#92400e'
                      }}
                    >
                      {agent.status}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '2rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ marginBottom: '1.5rem' }}>Recent Activity</h2>
            {interactions.length === 0 ? (
              <p style={{ color: '#999', textAlign: 'center', padding: '2rem 0' }}>
                No interactions yet
              </p>
            ) : (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                maxHeight: '400px',
                overflow: 'auto'
              }}>
                {interactions.slice(0, 10).map(interaction => (
                  <div
                    key={interaction.id}
                    style={{
                      border: '1px solid #eee',
                      borderRadius: '6px',
                      padding: '1rem',
                      background: '#fafafa'
                    }}
                  >
                    <p style={{ fontSize: '0.9rem', fontWeight: '600', margin: '0 0 0.5rem 0' }}>
                      {interaction.query.substring(0, 50)}...
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#999' }}>
                      <span>{new Date(interaction.created_at).toLocaleTimeString()}</span>
                      <span>{interaction.execution_ms}ms</span>
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
