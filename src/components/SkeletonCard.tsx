'use client';

export function SkeletonCard() {
  return (
    <div className="knowledge-card" style={{ cursor: 'default' }}>
      <div>
        <div className="knowledge-card-header">
          <div
            className="knowledge-card-icon"
            style={{
              background: 'var(--purple-soft)',
              animation: 'pulse 2s infinite',
              width: '44px',
              height: '44px',
            }}
          />
          <div style={{ flex: 1 }}>
            <div
              style={{
                height: '20px',
                background: 'var(--purple-soft)',
                borderRadius: '6px',
                marginBottom: '8px',
                animation: 'pulse 2s infinite',
                width: '70%',
              }}
            />
            <div
              style={{
                height: '16px',
                background: 'var(--purple-soft)',
                borderRadius: '6px',
                animation: 'pulse 2s infinite',
                width: '50%',
              }}
            />
          </div>
        </div>

        <div
          style={{
            height: '48px',
            background: 'var(--purple-soft)',
            borderRadius: '6px',
            marginBottom: '16px',
            animation: 'pulse 2s infinite',
          }}
        />

        <div
          style={{
            display: 'flex',
            gap: '12px',
            fontSize: '12px',
          }}
        >
          <div style={{ flex: 1 }}>
            <div
              style={{
                height: '12px',
                background: 'var(--purple-soft)',
                borderRadius: '4px',
                marginBottom: '4px',
                animation: 'pulse 2s infinite',
              }}
            />
            <div
              style={{
                height: '14px',
                background: 'var(--purple-soft)',
                borderRadius: '4px',
                animation: 'pulse 2s infinite',
              }}
            />
          </div>
          <div style={{ flex: 1, textAlign: 'right' }}>
            <div
              style={{
                height: '12px',
                background: 'var(--purple-soft)',
                borderRadius: '4px',
                marginBottom: '4px',
                animation: 'pulse 2s infinite',
              }}
            />
            <div
              style={{
                height: '14px',
                background: 'var(--purple-soft)',
                borderRadius: '4px',
                animation: 'pulse 2s infinite',
              }}
            />
          </div>
        </div>
      </div>

      <div
        style={{
          height: '16px',
          background: 'var(--purple-soft)',
          borderRadius: '4px',
          animation: 'pulse 2s infinite',
          width: '60%',
        }}
      />

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
