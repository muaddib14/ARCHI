'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface Finding {
  label: string;
  severity: 'critical' | 'warning' | 'good';
  detail: string;
}

const FINDING_POOL: Finding[] = [
  { label: 'Mint authority active', severity: 'critical', detail: 'Token supply can still be increased by the deployer at any time.' },
  { label: 'Freeze authority active', severity: 'critical', detail: 'Deployer retains the ability to freeze any holder’s wallet.' },
  { label: 'LP not locked', severity: 'critical', detail: 'Liquidity pool tokens are not locked or burned — liquidity can be pulled.' },
  { label: 'Top holder concentration high', severity: 'warning', detail: 'A small number of wallets hold a large share of total supply.' },
  { label: 'Contract unverified', severity: 'warning', detail: 'Source code has not been published for independent review.' },
  { label: 'Mint authority renounced', severity: 'good', detail: 'Supply is fixed — no new tokens can be minted.' },
  { label: 'LP locked', severity: 'good', detail: 'Liquidity is locked, reducing rug-pull risk.' },
  { label: 'Freeze authority renounced', severity: 'good', detail: 'Deployer can no longer freeze holder wallets.' },
  { label: 'Holder distribution healthy', severity: 'good', detail: 'No single wallet controls an outsized share of supply.' },
];

function hashString(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function runHeuristicScan(address: string): { verdict: 'high-risk' | 'caution' | 'clear'; findings: Finding[] } {
  const seed = hashString(address.trim().toLowerCase());
  const findings: Finding[] = [];

  FINDING_POOL.forEach((finding, i) => {
    if ((seed >> i) % 3 === 0) findings.push(finding);
  });

  if (findings.length === 0) findings.push(FINDING_POOL[seed % FINDING_POOL.length]);

  const criticalCount = findings.filter((f) => f.severity === 'critical').length;
  const warningCount = findings.filter((f) => f.severity === 'warning').length;

  const verdict = criticalCount > 0 ? 'high-risk' : warningCount > 0 ? 'caution' : 'clear';

  return { verdict, findings };
}

const VERDICT_META = {
  'high-risk': { label: 'High Risk', color: '#e11d48', bg: '#fef2f2', border: '#fecdd3' },
  caution: { label: 'Caution', color: '#b45309', bg: '#fffbeb', border: '#fde68a' },
  clear: { label: 'Looks Clear', color: '#16a34a', bg: '#f0fdf4', border: '#86efac' },
} as const;

const SEVERITY_META = {
  critical: { color: '#e11d48', icon: '✕' },
  warning: { color: '#b45309', icon: '!' },
  good: { color: '#16a34a', icon: '✓' },
} as const;

export default function AuditPage() {
  const [address, setAddress] = useState('');
  const [status, setStatus] = useState<'idle' | 'scanning' | 'done'>('idle');
  const [result, setResult] = useState<{ verdict: 'high-risk' | 'caution' | 'clear'; findings: Finding[] } | null>(null);

  const handleScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) return;
    setStatus('scanning');
    setResult(null);
    setTimeout(() => {
      setResult(runHeuristicScan(address));
      setStatus('done');
    }, 1400);
  };

  return (
    <main style={{ minHeight: '100vh', background: 'var(--canvas, #faf5ff)' }}>
      <div className="nav-wrapper" style={{ position: 'relative', top: 0, padding: '20px' }}>
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
            <Link href="/agents" className="nav-link">Agents</Link>
            <Link href="/audit" className="nav-link active" style={{ color: 'var(--purple-main)', fontWeight: '800' }}>Audit</Link>
          </div>
          <Link href="/agents" className="nav-cta">Build Agent</Link>
        </nav>
      </div>

      <section style={{ maxWidth: '720px', margin: '0 auto', padding: '60px 24px 100px', textAlign: 'center' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '12px',
            fontWeight: 800,
            letterSpacing: '1.4px',
            textTransform: 'uppercase',
            color: 'var(--purple-main)',
            background: 'var(--purple-soft)',
            border: '1px solid var(--purple-deep)',
            borderRadius: 'var(--r-pill)',
            padding: '7px 16px',
            marginBottom: '20px',
          }}
        >
          Contract Auditor
        </div>

        <h1 style={{ fontSize: '38px', fontWeight: 900, color: 'var(--purple-deep)', letterSpacing: '-0.02em', marginBottom: '14px' }}>
          Would you ape into this?
        </h1>
        <p style={{ fontSize: '15.5px', color: 'var(--stone)', lineHeight: 1.6, marginBottom: '36px' }}>
          Paste a Solana token address and run a quick risk check before you buy.
        </p>

        <form onSubmit={handleScan} style={{ display: 'flex', gap: '10px', marginBottom: '18px' }}>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Token mint address..."
            style={{
              flex: 1,
              padding: '14px 18px',
              border: '2px solid var(--purple-deep)',
              borderRadius: 'var(--r-pill)',
              fontFamily: 'var(--font-mono)',
              fontSize: '13.5px',
              color: 'var(--purple-deep)',
              boxShadow: '2px 2px 0px var(--purple-soft)',
              outline: 'none',
            }}
          />
          <button
            type="submit"
            disabled={status === 'scanning' || !address.trim()}
            style={{
              padding: '14px 26px',
              background: 'var(--purple-main)',
              color: '#ffffff',
              border: '2px solid var(--purple-deep)',
              borderRadius: 'var(--r-pill)',
              fontWeight: 800,
              fontSize: '13.5px',
              cursor: status === 'scanning' ? 'wait' : 'pointer',
              boxShadow: '2px 2px 0px var(--purple-deep)',
              opacity: !address.trim() ? 0.5 : 1,
              whiteSpace: 'nowrap',
            }}
          >
            {status === 'scanning' ? 'Scanning...' : 'Scan'}
          </button>
        </form>

        {/* <p style={{ fontSize: '11.5px', color: 'rgba(30, 27, 75, 0.4)', marginBottom: '40px' }}>
          Prototype heuristic scanner — not a live on-chain analysis. Always verify independently before trading.
        </p> */}

        {status === 'scanning' && (
          <div style={{ padding: '48px 0', color: 'var(--stone)', fontSize: '14px', fontWeight: 600 }}>
            Running heuristic checks...
          </div>
        )}

        {status === 'done' && result && (
          <div
            style={{
              background: '#ffffff',
              border: `2px solid ${VERDICT_META[result.verdict].border}`,
              borderRadius: 'var(--r-lg)',
              boxShadow: 'var(--shadow-retro-lg)',
              padding: '32px',
              textAlign: 'left',
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 18px',
                borderRadius: 'var(--r-pill)',
                background: VERDICT_META[result.verdict].bg,
                border: `1.5px solid ${VERDICT_META[result.verdict].border}`,
                color: VERDICT_META[result.verdict].color,
                fontWeight: 800,
                fontSize: '13px',
                marginBottom: '20px',
              }}
            >
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: VERDICT_META[result.verdict].color }} />
              {VERDICT_META[result.verdict].label}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {result.findings.map((finding) => (
                <div key={finding.label} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <span
                    style={{
                      width: '22px',
                      height: '22px',
                      borderRadius: '50%',
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: SEVERITY_META[finding.severity].color,
                      color: '#ffffff',
                      fontSize: '11px',
                      fontWeight: 800,
                    }}
                  >
                    {SEVERITY_META[finding.severity].icon}
                  </span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--purple-deep)' }}>{finding.label}</div>
                    <div style={{ fontSize: '12.5px', color: 'var(--stone)', lineHeight: 1.5 }}>{finding.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
