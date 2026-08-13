'use client';

import { useState } from 'react';

interface ConnectActionButtonProps {
  integrationName: string;
  actionName: string;
}

const STEPS = ['Requesting scope', 'Verifying wallet signature', 'Authorizing access'];
const STEP_DELAY_MS = 550;

export function ConnectActionButton({ integrationName, actionName }: ConnectActionButtonProps) {
  const [status, setStatus] = useState<'idle' | 'connecting' | 'connected'>('idle');
  const [stepIndex, setStepIndex] = useState(0);

  const handleConnect = () => {
    setStatus('connecting');
    setStepIndex(0);
    STEPS.forEach((_, i) => {
      setTimeout(() => setStepIndex(i + 1), (i + 1) * STEP_DELAY_MS);
    });
    setTimeout(() => setStatus('connected'), STEPS.length * STEP_DELAY_MS + 400);
  };

  const handleClose = () => {
    setStatus('idle');
    setStepIndex(0);
  };

  return (
    <>
      <button
        type="button"
        onClick={handleConnect}
        style={{
          padding: '8px 18px',
          background: '#ffffff',
          color: 'var(--purple-main)',
          border: '2px solid var(--purple-main)',
          borderRadius: 'var(--r-pill)',
          fontWeight: 700,
          fontSize: '12.5px',
          cursor: 'pointer',
          boxShadow: '2px 2px 0px var(--purple-soft)',
          transition: 'all 0.15s ease',
        }}
        onMouseOver={(e) => (e.currentTarget.style.transform = 'translate(-1px, -1px)')}
        onMouseOut={(e) => (e.currentTarget.style.transform = 'translate(0, 0)')}
      >
        Connect
      </button>

      {status !== 'idle' && (
        <div
          onClick={status === 'connected' ? handleClose : undefined}
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
            padding: '20px',
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
              maxWidth: '380px',
              width: '100%',
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: status === 'connected' ? '#dcfce7' : 'var(--purple-soft)',
                border: `2px solid ${status === 'connected' ? '#16a34a' : 'var(--purple-deep)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px',
                color: status === 'connected' ? '#16a34a' : 'var(--purple-main)',
              }}
            >
              {status === 'connected' ? (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="M4 12l6 6L20 6" />
                </svg>
              ) : (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="5" y="11" width="14" height="10" rx="2" />
                  <path d="M8 11V7a4 4 0 018 0v4" />
                </svg>
              )}
            </div>

            <h3 style={{ fontSize: '18px', fontWeight: 900, color: 'var(--purple-deep)', marginBottom: '6px', letterSpacing: '-0.01em' }}>
              {status === 'connected' ? 'Connected' : `Connecting to ${integrationName}`}
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--stone)', marginBottom: '20px' }}>
              Action: <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{actionName}</span>
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: status === 'connected' ? '20px' : '4px' }}>
              {STEPS.map((label, i) => (
                <div
                  key={label}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: i < stepIndex ? 'var(--purple-deep)' : 'rgba(30, 27, 75, 0.35)',
                    transition: 'color 0.2s ease',
                  }}
                >
                  <span
                    style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: i < stepIndex ? 'var(--purple-main)' : 'var(--purple-soft)',
                      color: '#ffffff',
                    }}
                  >
                    {i < stepIndex && (
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4">
                        <path d="M4 12l6 6L20 6" />
                      </svg>
                    )}
                  </span>
                  {label}
                </div>
              ))}
            </div>

            {status === 'connected' && (
              <>
                <div
                  style={{
                    background: '#f0fdf4',
                    border: '1px solid #86efac',
                    borderRadius: 'var(--r-sm)',
                    padding: '10px 14px',
                    fontSize: '12.5px',
                    color: '#166534',
                    fontWeight: 600,
                    marginBottom: '18px',
                    lineHeight: 1.5,
                  }}
                >
                  {integrationName} connected — your agent can now call this action.
                </div>
                <button
                  onClick={handleClose}
                  style={{
                    width: '100%',
                    padding: '10px 20px',
                    background: 'var(--purple-main)',
                    color: '#ffffff',
                    border: '2px solid var(--purple-deep)',
                    borderRadius: 'var(--r-pill)',
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: 'pointer',
                    boxShadow: '2px 2px 0px var(--purple-deep)',
                  }}
                >
                  Done
                </button>
              </>
            )}

            {/* <p style={{ fontSize: '10.5px', color: 'rgba(30, 27, 75, 0.35)', marginTop: '14px', textAlign: 'center' }}>
              Demo flow — no real credentials are shared.
            </p> */}
          </div>
        </div>
      )}
    </>
  );
}
