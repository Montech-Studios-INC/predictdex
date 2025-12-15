"use client";

import "@rainbow-me/rainbowkit/styles.css";
import { RainbowKitProvider, connectorsForWallets } from "@rainbow-me/rainbowkit";
import {
  metaMaskWallet,
  walletConnectWallet,
  coinbaseWallet,
  rainbowWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useMemo, useEffect } from "react";
import { WagmiConfig, configureChains, createConfig } from "wagmi";
import { arbitrum, bsc, mainnet, polygon } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { initWalletConflictHandler, validateWalletConnectProjectId } from "@/lib/walletConflictHandler";

const APP_NAME = "AfricaPredicts";

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_ID;

if (!projectId) {
  throw new Error(
    "NEXT_PUBLIC_WALLETCONNECT_ID is required for wallet connections. " +
    "Get one free at https://cloud.walletconnect.com/"
  );
}

if (projectId.length !== 32) {
  console.error(
    "[AfricaPredicts] WalletConnect project ID appears invalid. " +
    "Expected 32-character hex string."
  );
}

const { chains, publicClient } = configureChains(
  [mainnet, polygon, arbitrum, bsc],
  [publicProvider()]
);

const connectors = connectorsForWallets([
  {
    groupName: "Recommended",
    wallets: [
      metaMaskWallet({ projectId, chains }),
      walletConnectWallet({ projectId, chains }),
      coinbaseWallet({ appName: APP_NAME, chains }),
      rainbowWallet({ projectId, chains }),
    ],
  },
]);

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

type ProvidersProps = {
  children: ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  const queryClient = useMemo(() => new QueryClient(), []);

  useEffect(() => {
    initWalletConflictHandler();
  }, []);

  return (
    <WagmiConfig config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider chains={chains} modalSize="compact">
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiConfig>
  );
}
