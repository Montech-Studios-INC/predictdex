/**
 * Wallet Extension Conflict Handler
 * 
 * Prevents "Cannot redefine property: ethereum" errors when multiple wallet
 * extensions (MetaMask, Coinbase, Brave, etc.) compete for window.ethereum.
 * 
 * This module must be imported early in the application lifecycle.
 */

let initialized = false;

export function initWalletConflictHandler(): void {
  if (typeof window === 'undefined' || initialized) return;
  initialized = true;

  try {
    const ethereum = (window as any).ethereum;
    if (!ethereum) return;

    const descriptor = Object.getOwnPropertyDescriptor(window, 'ethereum');
    
    if (descriptor && !descriptor.configurable) {
      if (ethereum.providers?.length > 1) {
        console.info(
          `[AfricaPredicts] ${ethereum.providers.length} wallet providers detected. ` +
          'RainbowKit will handle provider selection.'
        );
      }
      return;
    }

    if (ethereum.providers?.length) {
      console.info(
        `[AfricaPredicts] ${ethereum.providers.length} wallet providers available.`
      );
    }

    try {
      Object.defineProperty(window, 'ethereum', {
        value: ethereum,
        writable: false,
        configurable: false,
        enumerable: true,
      });
    } catch {
      // Property already locked by another extension - this is fine
    }
  } catch (error) {
    // Silent fail - wallet functionality will still work via RainbowKit
  }
}

export async function validateWalletConnectProjectId(projectId: string): Promise<boolean> {
  if (!projectId || projectId.length !== 32) {
    console.error('[AfricaPredicts] Invalid WalletConnect project ID format');
    return false;
  }
  
  try {
    const response = await fetch(
      `https://relay.walletconnect.com/?projectId=${projectId}`,
      { method: 'HEAD', mode: 'no-cors' }
    );
    return true;
  } catch {
    console.warn('[AfricaPredicts] Could not validate WalletConnect project ID');
    return true; // Allow to proceed, actual errors will surface at connection time
  }
}
