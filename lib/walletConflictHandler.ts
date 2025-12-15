/**
 * Wallet Extension Conflict Handler
 * 
 * Handles conflicts when multiple wallet extensions (MetaMask, Coinbase, etc.)
 * try to redefine window.ethereum. This prevents "Cannot redefine property: ethereum" errors.
 */

export function initWalletConflictHandler(): void {
  if (typeof window === 'undefined') return;

  try {
    const existingEthereum = (window as any).ethereum;
    
    if (existingEthereum) {
      const descriptor = Object.getOwnPropertyDescriptor(window, 'ethereum');
      
      if (descriptor && !descriptor.configurable) {
        console.warn(
          '[AfricaPredicts] Multiple wallet extensions detected. ' +
          'Using the primary wallet provider.'
        );
      }
    }

    const providers: any[] = [];
    
    if (existingEthereum?.providers?.length) {
      providers.push(...existingEthereum.providers);
    } else if (existingEthereum) {
      providers.push(existingEthereum);
    }

    if (providers.length > 1) {
      console.info(
        `[AfricaPredicts] ${providers.length} wallet providers detected. ` +
        'RainbowKit will handle provider selection.'
      );
    }
  } catch (error) {
    console.warn('[AfricaPredicts] Wallet conflict check failed:', error);
  }
}

export function getAvailableProviders(): any[] {
  if (typeof window === 'undefined') return [];
  
  const ethereum = (window as any).ethereum;
  
  if (!ethereum) return [];
  
  if (ethereum.providers?.length) {
    return ethereum.providers;
  }
  
  return [ethereum];
}

export function getProviderByName(name: string): any | null {
  const providers = getAvailableProviders();
  
  const providerMap: Record<string, (p: any) => boolean> = {
    metamask: (p) => p.isMetaMask && !p.isBraveWallet,
    coinbase: (p) => p.isCoinbaseWallet,
    brave: (p) => p.isBraveWallet,
    rainbow: (p) => p.isRainbow,
  };
  
  const check = providerMap[name.toLowerCase()];
  if (!check) return null;
  
  return providers.find(check) || null;
}
