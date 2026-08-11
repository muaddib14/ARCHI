import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { KNOWLEDGE_ITEMS } from '@/data/knowledgeData';

export async function generateStaticParams() {
  return KNOWLEDGE_ITEMS.map((item) => ({
    slug: item.id,
  }));
}

export default async function KnowledgeDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = KNOWLEDGE_ITEMS.find((k) => k.id === slug);

  if (!item) {
    notFound();
  }

  const relatedItems = KNOWLEDGE_ITEMS.filter(
    (k) => k.category === item.category && k.id !== item.id
  ).slice(0, 3);

  return (
    <main style={{ minHeight: '100vh', background: 'var(--canvas, #faf5ff)' }}>
      {/* Top Announcement Bar */}
      <div className="announcement-bar">
        <span className="announcement-dot"></span>
        <span>ARCHI Knowledge Directory for Autonomous AI Agents</span>
        <Link href="/knowledge" className="announcement-link">
          ← Back to Directory
        </Link>
      </div>

      {/* Main Container */}
      <div className="detail-container">
        {/* Breadcrumb Back Link */}
        <Link href="/knowledge" className="back-link">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back to Knowledge Directory
        </Link>

        {/* Integration Header Card */}
        <div className="detail-header-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
            <div className="knowledge-card-icon" style={{ width: '56px', height: '56px', borderRadius: '16px' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" />
                <path d="M2 17L12 22L22 17" />
              </svg>
            </div>
            <div>
              <span className="knowledge-card-category" style={{ fontSize: '13px', fontWeight: '800' }}>
                {item.category}
              </span>
              <h1 style={{ fontSize: '32px', fontWeight: '900', color: 'var(--purple-deep)', marginTop: '4px' }}>
                {item.name}
              </h1>
            </div>
          </div>

          <p style={{ fontSize: '17px', color: 'var(--stone)', lineHeight: '1.65', marginBottom: '28px', maxWidth: '780px' }}>
            {item.description}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '14px', fontWeight: '800', color: 'var(--purple-main)', background: 'var(--purple-soft)', padding: '6px 14px', borderRadius: '50px', border: '1px solid var(--purple-deep)' }}>
              {item.actionsCount} API Actions Available
            </span>
            {item.website && (
              <a href={item.website} target="_blank" rel="noopener noreferrer" className="btn-hero-secondary" style={{ padding: '8px 20px', fontSize: '13px', color: 'var(--purple-deep)', borderColor: 'var(--purple-deep)' }}>
                Website ↗
              </a>
            )}
            {item.github && (
              <a href={item.github} target="_blank" rel="noopener noreferrer" className="btn-hero-secondary" style={{ padding: '8px 20px', fontSize: '13px', color: 'var(--purple-deep)', borderColor: 'var(--purple-deep)' }}>
                GitHub ↗
              </a>
            )}
            {item.docs && (
              <a href={item.docs} target="_blank" rel="noopener noreferrer" className="btn-hero-secondary" style={{ padding: '8px 20px', fontSize: '13px', color: 'var(--purple-deep)', borderColor: 'var(--purple-deep)' }}>
                API Docs ↗
              </a>
            )}
          </div>
        </div>

        {/* Actions List Header */}
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '900', color: 'var(--purple-deep)', marginBottom: '8px' }}>
            Available API Actions ({item.actions.length})
          </h2>
          <p style={{ color: 'var(--stone)', fontSize: '15px' }}>
            Structured function definitions and payload specifications for AI agent tool execution.
          </p>
        </div>

        {/* Actions Specs List */}
        {item.actions.map((action, idx) => (
          <div className="action-card" key={idx}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span className={`method-badge method-badge--${action.method.toLowerCase()}`}>
                  {action.method}
                </span>
                <span style={{ fontSize: '18px', fontWeight: '800', fontFamily: 'var(--font-mono)', color: 'var(--purple-deep)' }}>
                  {action.name}
                </span>
              </div>
            </div>

            <p style={{ fontSize: '14px', color: 'var(--stone)', marginBottom: '16px', lineHeight: '1.55' }}>
              {action.description}
            </p>

            {/* Parameters Table if available */}
            {action.parameters && action.parameters.length > 0 && (
              <div style={{ marginTop: '16px', marginBottom: '16px' }}>
                <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--purple-main)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
                  PARAMETERS SCHEMA
                </div>
                <div style={{ overflowX: 'auto', border: '1.5px solid var(--purple-deep)', borderRadius: '10px' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ background: 'var(--purple-soft)', borderBottom: '1.5px solid var(--purple-deep)' }}>
                        <th style={{ padding: '8px 14px', fontWeight: '800', color: 'var(--purple-deep)' }}>Param Name</th>
                        <th style={{ padding: '8px 14px', fontWeight: '800', color: 'var(--purple-deep)' }}>Type</th>
                        <th style={{ padding: '8px 14px', fontWeight: '800', color: 'var(--purple-deep)' }}>Required</th>
                        <th style={{ padding: '8px 14px', fontWeight: '800', color: 'var(--purple-deep)' }}>Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {action.parameters.map((p, pIdx) => (
                        <tr key={pIdx} style={{ borderBottom: '1px solid var(--purple-soft)' }}>
                          <td style={{ padding: '8px 14px', fontFamily: 'var(--font-mono)', fontWeight: '700', color: 'var(--purple-deep)' }}>{p.name}</td>
                          <td style={{ padding: '8px 14px', color: 'var(--purple-main)', fontFamily: 'var(--font-mono)' }}>{p.type}</td>
                          <td style={{ padding: '8px 14px', fontWeight: '700' }}>
                            {p.required ? <span style={{ color: 'var(--retro-coral)' }}>Yes</span> : <span style={{ color: 'var(--stone)' }}>Optional</span>}
                          </td>
                          <td style={{ padding: '8px 14px', color: 'var(--stone)' }}>{p.desc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Sample Payload */}
            {action.samplePayload && (
              <div style={{ marginTop: '16px' }}>
                <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--purple-main)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>
                  SAMPLE INVOCATION PAYLOAD
                </div>
                <pre className="code-box">
                  <code>{action.samplePayload}</code>
                </pre>
              </div>
            )}
          </div>
        ))}

        {/* Related Integrations */}
        {relatedItems.length > 0 && (
          <div style={{ marginTop: '64px', paddingTop: '36px', borderTop: '2px solid var(--purple-soft)' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '900', color: 'var(--purple-deep)', marginBottom: '20px' }}>
              Related {item.category} Integrations
            </h3>
            <div className="knowledge-grid">
              {relatedItems.map((rel) => (
                <Link href={`/knowledge/${rel.id}`} key={rel.id}>
                  <div className="knowledge-card">
                    <div>
                      <div className="knowledge-card-header">
                        <div className="knowledge-card-icon">
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 2L2 7L12 12L22 7L12 2Z" />
                          </svg>
                        </div>
                        <div className="knowledge-card-title">{rel.name}</div>
                      </div>
                      <p className="knowledge-card-desc">{rel.description}</p>
                    </div>
                    <div className="knowledge-card-meta">
                      <span className="knowledge-card-actions">{rel.actionsCount} actions</span>
                      <span className="knowledge-card-category">{rel.category}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-inner">
          <div>
            <div className="footer-brand-name">ARCHI KNOWLEDGE</div>
            <p className="footer-brand-tag">Open API Knowledge base for AI agents on Solana.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
