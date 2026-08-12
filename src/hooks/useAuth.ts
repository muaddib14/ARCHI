import { useWallet } from '@solana/wallet-adapter-react';

export function useAuth() {
  const { connected, publicKey, disconnect } = useWallet();

  return {
    isAuthenticated: connected && !!publicKey,
    wallet: publicKey?.toString() || null,
    connected,
    disconnect,
  };
}
