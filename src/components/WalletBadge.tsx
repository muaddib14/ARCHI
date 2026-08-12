'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '@/hooks/useAuth';

export function WalletBadge() {
  const { wallet, disconnect } = useAuth();
  const [disconnecting, setDisconnecting] = useState(false);

  if (!wallet) return null;

  const handleDisconnect = async () => {
    setDisconnecting(true);
    try {
      await disconnect();
      toast.success('Wallet disconnected');
    } catch (err) {
      console.error('Error disconnecting wallet:', err);
      toast.error('Failed to disconnect wallet');
    } finally {
      setDisconnecting(false);
    }
  };

  return (
    <div className="wallet-badge">
      <span className="wallet-badge-dot" />
      <span className="wallet-badge-address">
        {wallet.slice(0, 4)}...{wallet.slice(-4)}
      </span>
      <button
        className="wallet-badge-disconnect"
        onClick={handleDisconnect}
        disabled={disconnecting}
        title="Disconnect wallet"
        aria-label="Disconnect wallet"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <path d="M16 17l5-5-5-5" />
          <path d="M21 12H9" />
        </svg>
      </button>
    </div>
  );
}
