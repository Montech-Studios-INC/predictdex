"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function ConnectWalletButton() {
  return (
    <ConnectButton.Custom>
      {({ account, chain, openAccountModal, openChainModal, openConnectModal, mounted }) => {
        const ready = mounted;
        const connected = ready && account && chain;

        return (
          <div className="flex items-center gap-2">
            <button
              onClick={connected ? openAccountModal : openConnectModal}
              className="inline-flex items-center justify-center rounded-full bg-orange-500 px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white shadow-sm transition-colors hover:bg-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-neutral-900"
            >
              {connected ? account.displayName : "Connect Wallet"}
            </button>
            {connected && chain && (
              <button
                onClick={openChainModal}
                className="text-[11px] tracking-wide px-3 py-2 rounded-full border border-neutral-200 bg-white text-neutral-800 hover:bg-neutral-50 transition-colors dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700"
              >
                {chain.name}
              </button>
            )}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}
