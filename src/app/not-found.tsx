import Link from 'next/link';

export default function NotFound() {
  return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '40px 20px', background: 'var(--canvas, #faf5ff)' }}>
      <div style={{ background: '#ffffff', border: '2.5px solid var(--purple-deep)', padding: '48px', borderRadius: '20px', boxShadow: 'var(--shadow-retro)', maxWidth: '480px' }}>
        <h1 style={{ fontSize: '36px', fontWeight: '900', color: 'var(--purple-deep)', marginBottom: '12px' }}>404</h1>
        <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--purple-main)', marginBottom: '16px' }}>Page Not Found</h2>
        <p style={{ color: 'var(--stone)', fontSize: '14px', marginBottom: '24px', lineHeight: '1.6' }}>
          The integration platform or page you're looking for doesn't exist in the ARCHI Knowledge Directory.
        </p>
        <Link href="/knowledge" className="nav-cta" style={{ display: 'inline-block', textDecoration: 'none' }}>
          Back to Directory
        </Link>
      </div>
    </main>
  );
}
