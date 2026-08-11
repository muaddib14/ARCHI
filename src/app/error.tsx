'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '40px 20px', background: 'var(--canvas, #faf5ff)' }}>
      <div style={{ background: '#ffffff', border: '2.5px solid var(--purple-deep)', padding: '48px', borderRadius: '20px', boxShadow: 'var(--shadow-retro)', maxWidth: '480px' }}>
        <h1 style={{ fontSize: '36px', fontWeight: '900', color: 'var(--purple-deep)', marginBottom: '12px' }}>Something went wrong</h1>
        <p style={{ color: 'var(--stone)', fontSize: '14px', marginBottom: '24px', lineHeight: '1.6' }}>
          An error occurred while loading this page.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
          <button onClick={() => reset()} className="nav-cta" style={{ cursor: 'pointer', border: 'none' }}>
            Try Again
          </button>
          <Link href="/" className="btn-hero-secondary" style={{ padding: '10px 20px', textDecoration: 'none' }}>
            Home
          </Link>
        </div>
      </div>
    </main>
  );
}
