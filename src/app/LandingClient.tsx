'use client';

import React, { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function LandingClient() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const handleBuildAgent = useCallback(() => {
    router.push('/agents');
  }, [router]);

  return (
    <main>
      {/* NAVIGATION */}
      <div className="nav-wrapper">
        <nav className="nav-capsule">
          <a href="#" className="nav-brand">
            <div className="nav-brand-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" />
                <path d="M2 17L12 22L22 17" />
                <path d="M2 12L12 17L22 12" />
              </svg>
            </div>
            <span className="nav-brand-text">ARCHI</span>
          </a>
          <div className="nav-links">
            <a href="#why" className="nav-link">Why ARCHI</a>
            <a href="/knowledge" className="nav-link" style={{ color: 'var(--purple-main)', fontWeight: '800' }}>Knowledge</a>
            <a href="#compare" className="nav-link">Compare</a>
            <a href="#tech" className="nav-link">Tech</a>
          </div>
          <button className="nav-cta" onClick={handleBuildAgent}>
            Build Agent
          </button>
        </nav>
      </div>

      {/* HERO */}
      <section className="hero">
        <span className="hero-eyebrow">
          <span className="hero-eyebrow-dot"></span>
          Agentic AI on Solana
        </span>
        <h1 className="hero-headline">
          Your AI Agents.<br />On Solana. <em>Own Them.</em>
        </h1>
        <p className="hero-sub">
          Deploy autonomous AI agents with full ownership and transparency. No rent to OpenAI. No black boxes. Your infrastructure, on-chain.
        </p>
        <div className="hero-buttons">
          <button className="btn-hero-primary" onClick={handleBuildAgent}>
            Build Your Agent
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <a href="/knowledge" className="btn-hero-secondary">
            Knowledge Base →
          </a>
        </div>

        {/* Hero Mockup */}
        <div className="hero-mockup">
          <div className="mockup-frame">
            <div className="mockup-bar">
              <span className="mockup-dot mockup-dot--r"></span>
              <span className="mockup-dot mockup-dot--y"></span>
              <span className="mockup-dot mockup-dot--g"></span>
              <span className="mockup-url">app.arc.fun/agents</span>
            </div>
            <div className="mockup-screen">
              <div className="mockup-sidebar">
                <div className="mockup-sidebar-brand">ARCHI Dashboard</div>
                <div className="mockup-sidebar-item active">Dashboard</div>
                <div className="mockup-sidebar-item">Agent Registry</div>
                <div className="mockup-sidebar-item">Agent Forge</div>
                <div className="mockup-sidebar-item">Audit Logs</div>
              </div>
              <div className="mockup-main">
                <div className="mockup-header">
                  <span className="mockup-header-title">Active AI Agents</span>
                  <span className="mockup-header-btn">+ Deploy Agent</span>
                </div>
                <div className="mockup-row">
                  <div className="mockup-avatar mockup-avatar--1"></div>
                  <div className="mockup-row-content">
                    <div className="mockup-row-title">Trading Sentinel</div>
                    <div className="mockup-row-meta">claude-3-sonnet / Last run 2m ago / 847 interactions</div>
                  </div>
                  <span className="mockup-row-badge mockup-row-badge--active">Active</span>
                </div>
                <div className="mockup-row">
                  <div className="mockup-avatar mockup-avatar--2"></div>
                  <div className="mockup-row-content">
                    <div className="mockup-row-title">Data Harvester</div>
                    <div className="mockup-row-meta">gpt-4-turbo / Last run 18m ago / 1,204 interactions</div>
                  </div>
                  <span className="mockup-row-badge mockup-row-badge--active">Active</span>
                </div>
                <div className="mockup-row">
                  <div className="mockup-avatar mockup-avatar--3"></div>
                  <div className="mockup-row-content">
                    <div className="mockup-row-title">Contract Auditor</div>
                    <div className="mockup-row-meta">claude-3-opus / Last run 1h ago / 312 interactions</div>
                  </div>
                  <span className="mockup-row-badge mockup-row-badge--idle">Idle</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Landscape Silhouette */}
        <div className="hero-landscape">
          <svg viewBox="0 0 1440 180" fill="none" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 180V120C240 70 480 140 720 90C960 40 1200 110 1440 80V180H0Z" fill="rgba(30,27,75,0.25)" />
            <path d="M0 180V140C320 90 640 150 960 110C1120 90 1280 130 1440 100V180H0Z" fill="rgba(30,27,75,0.15)" />
          </svg>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="logos-section">
        <div className="logos-label">Built on proven infrastructure</div>
        <div className="marquee">
          <div className="marquee-track">
            <div className="logo-item">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.28 6.882a.647.647 0 0 0-.502-.24H4.532a.324.324 0 0 0-.228.553l2.486 2.486a.647.647 0 0 0 .502.24h12.246a.324.324 0 0 0 .228-.554L17.28 6.882Z" />
              </svg>
              <span>Solana</span>
            </div>
            <div className="logo-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 19h20L12 2z" />
              </svg>
              <span>Anchor</span>
            </div>
            <div className="logo-item">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M21.362 9.354H12V.396a.396.396 0 0 0-.716-.233L2.203 12.424l-.401.562a.795.795 0 0 0 .645 1.257H12v8.958a.396.396 0 0 0 .716.233l9.081-12.261.401-.562a.795.795 0 0 0-.645-1.257h-.191Z" />
              </svg>
              <span>Supabase</span>
            </div>
            <div className="logo-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <ellipse cx="12" cy="5" rx="9" ry="3" />
                <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
              </svg>
              <span>pgvector</span>
            </div>
            <div className="logo-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="16 18 22 12 16 6" />
                <polyline points="8 6 2 12 8 18" />
              </svg>
              <span>Next.js</span>
            </div>

            {/* Duplicate */}
            <div className="logo-item">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.28 6.882a.647.647 0 0 0-.502-.24H4.532a.324.324 0 0 0-.228.553l2.486 2.486a.647.647 0 0 0 .502.24h12.246a.324.324 0 0 0 .228-.554L17.28 6.882Z" />
              </svg>
              <span>Solana</span>
            </div>
            <div className="logo-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 19h20L12 2z" />
              </svg>
              <span>Anchor</span>
            </div>
            <div className="logo-item">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M21.362 9.354H12V.396a.396.396 0 0 0-.716-.233L2.203 12.424l-.401.562a.795.795 0 0 0 .645 1.257H12v8.958a.396.396 0 0 0 .716.233l9.081-12.261.401-.562a.795.795 0 0 0-.645-1.257h-.191Z" />
              </svg>
              <span>Supabase</span>
            </div>
            <div className="logo-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <ellipse cx="12" cy="5" rx="9" ry="3" />
                <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
              </svg>
              <span>pgvector</span>
            </div>
            <div className="logo-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="16 18 22 12 16 6" />
                <polyline points="8 6 2 12 8 18" />
              </svg>
              <span>Next.js</span>
            </div>
          </div>
        </div>
      </div>

      {/* BENEFITS */}
      <section className="section" id="why">
        <div className="section-centered">
          <span className="section-eyebrow">Why ARCHI</span>
          <h2 className="section-heading">Own your AI. Not rent it.</h2>
          <p className="section-desc">
            Unlike centralized AI services, your agents live on-chain. You control the code. You control the data. You own the tokens.
          </p>
        </div>

        <div className="benefits-grid">
          <div className="benefit-card">
            <div className="benefit-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.78 7.78 5.5 5.5 0 0 1 7.78-7.78zm0 0L15.5 7.5" />
              </svg>
            </div>
            <div className="benefit-title">You Own Your Agents</div>
            <p className="benefit-text">Deploy with full control. No vendor lock-in. Your agents, your rules — not rented from a centralized provider.</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </div>
            <div className="benefit-title">Every Action Auditable</div>
            <p className="benefit-text">Every action is logged on-chain. No one — not even us — can hide or alter what your agent did. Nothing hidden.</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
            </div>
            <div className="benefit-title">On Solana for Cost and Speed</div>
            <p className="benefit-text">Leverage Solana's sub-second finality and minimal gas fees. Production-grade performance without the heavy bill.</p>
          </div>
        </div>
      </section>

      {/* COMPARISON */}
      <section className="section section-centered" id="compare">
        <span className="section-eyebrow">Compare</span>
        <h2 className="section-heading">Why decentralized AI?</h2>
        <p className="section-desc">Centralized providers own your data and meter your usage. ARCHI puts you in control.</p>

        <div className="comparison-wrapper">
          <table className="comparison-table">
            <thead>
              <tr>
                <th>Aspect</th>
                <th>OpenAI API (Centralized)</th>
                <th>ARCHI (Decentralized)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Ownership</td>
                <td><span className="table-badge table-badge--old">Provider owns data & model</span></td>
                <td><span className="table-badge table-badge--arc">You own your agent</span></td>
              </tr>
              <tr>
                <td>Transparency</td>
                <td>Blackbox — trust provider</td>
                <td>On-chain audit trail</td>
              </tr>
              <tr>
                <td>Cost Model</td>
                <td>Pay-per-call, metered</td>
                <td>Own it — one-time mint + gas</td>
              </tr>
              <tr>
                <td>Control</td>
                <td><span className="table-badge table-badge--old">Limited customization</span></td>
                <td><span className="table-badge table-badge--arc">Full control over deployment</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* TECH STACK */}
      <section className="section" id="tech">
        <div className="section-centered">
          <span className="section-eyebrow">Infrastructure</span>
          <h2 className="section-heading">Production-grade stack</h2>
          <p className="section-desc">Open-source, battle-tested components chosen for reliability at scale.</p>
        </div>

        <div className="tech-grid">
          <div className="tech-card">
            <div className="tech-card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="16 18 22 12 16 6" />
                <polyline points="8 6 2 12 8 18" />
              </svg>
            </div>
            <div className="tech-card-name">Next.js</div>
            <div className="tech-card-desc">App Router + TypeScript</div>
          </div>
          <div className="tech-card">
            <div className="tech-card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <div className="tech-card-name">Rust + Anchor</div>
            <div className="tech-card-desc">Solana smart contracts</div>
          </div>
          <div className="tech-card">
            <div className="tech-card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <ellipse cx="12" cy="5" rx="9" ry="3" />
                <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
              </svg>
            </div>
            <div className="tech-card-name">PostgreSQL</div>
            <div className="tech-card-desc">Supabase + pgvector</div>
          </div>
          <div className="tech-card">
            <div className="tech-card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
              </svg>
            </div>
            <div className="tech-card-name">Solana</div>
            <div className="tech-card-desc">On-chain execution & audit</div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section" id="cta">
        <div className="cta-inner">
          <h2 className="cta-heading">
            Build your agent.<br />Own your infrastructure.
          </h2>
          <p className="cta-desc">Deploy your first autonomous agent on Solana today. Full control. Full transparency.</p>
          <div className="cta-buttons">
            <button className="btn-cta-primary" onClick={handleBuildAgent}>Build Your Agent</button>
            <a href="https://github.com/yourusername/archi" className="btn-cta-ghost">Explore Docs</a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-inner">
          <div>
            <div className="footer-brand-name">ARCHI</div>
            <p className="footer-brand-tag">Decentralized autonomous AI agents on Solana. Your agents. Your rules.</p>
          </div>
          <div className="footer-columns">
            <div>
              <div className="footer-col-title">Product</div>
              <div className="footer-col-links">
                <a href="#">Agent Registry</a>
                <a href="#">Agent Forge</a>
                <a href="#">Dashboard</a>
              </div>
            </div>
            <div>
              <div className="footer-col-title">Resources</div>
              <div className="footer-col-links">
                <a href="#">Documentation</a>
                <a href="#">Architecture</a>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2025 ARCHI. Decentralized AI on Solana.</span>
          <span>Next.js Retro Purple Edition</span>
        </div>
      </footer>
    </main>
  );
}
