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
import { ReactNode, useMemo, useEffect, useState } from "react";
import { WagmiConfig, configureChains, createConfig } from "wagmi";
import { arbitrum, bsc, mainnet, polygon } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";

const APP_NAME = "AfricaPredicts";

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_ID || "ad5430505e81b8a112c85ab079f48f18";

if (!projectId) {
  console.warn(
    "NEXT_PUBLIC_WALLETCONNECT_ID is not set. " +
    "Get one free at https://cloud.walletconnect.com/"
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
  const queryClient = useMemo(() => new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  }), []);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <WagmiConfig config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider chains={chains} modalSize="compact">
          {mounted ? children : null}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiConfig>
  );
}
