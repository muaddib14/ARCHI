'use client';

interface ConfirmModalProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  danger = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!open) return null;

  return (
    <div
      onClick={onCancel}
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
          maxWidth: '420px',
          width: '100%',
        }}
      >
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: danger ? '#fdf2f8' : 'var(--purple-soft)',
            border: `2px solid ${danger ? 'var(--retro-coral)' : 'var(--purple-deep)'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '20px',
            color: danger ? 'var(--retro-coral)' : 'var(--purple-main)',
          }}
        >
          {danger ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M3 6h18" />
              <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v5" />
              <circle cx="12" cy="16" r="0.5" fill="currentColor" />
            </svg>
          )}
        </div>

        <h3
          style={{
            fontSize: '20px',
            fontWeight: '900',
            color: 'var(--purple-deep)',
            marginBottom: '10px',
            letterSpacing: '-0.01em',
          }}
        >
          {title}
        </h3>

        <p
          style={{
            fontSize: '14px',
            color: 'var(--stone)',
            lineHeight: '1.6',
            marginBottom: '28px',
          }}
        >
          {message}
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button
            onClick={onCancel}
            style={{
              padding: '10px 20px',
              background: '#ffffff',
              color: 'var(--purple-deep)',
              border: '2px solid var(--purple-deep)',
              borderRadius: 'var(--r-pill)',
              fontWeight: '700',
              fontSize: '13px',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-retro-sm)',
              transition: 'all 0.15s ease',
            }}
            onMouseOver={(e) => (e.currentTarget.style.transform = 'translate(-1px, -1px)')}
            onMouseOut={(e) => (e.currentTarget.style.transform = 'translate(0, 0)')}
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            style={{
              padding: '10px 20px',
              background: danger ? 'var(--retro-coral)' : 'var(--purple-main)',
              color: '#ffffff',
              border: `2px solid ${danger ? '#be123c' : 'var(--purple-deep)'}`,
              borderRadius: 'var(--r-pill)',
              fontWeight: '700',
              fontSize: '13px',
              cursor: 'pointer',
              boxShadow: `2px 2px 0px ${danger ? '#be123c' : 'var(--purple-deep)'}`,
              transition: 'all 0.15s ease',
            }}
            onMouseOver={(e) => (e.currentTarget.style.transform = 'translate(-1px, -1px)')}
            onMouseOut={(e) => (e.currentTarget.style.transform = 'translate(0, 0)')}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
