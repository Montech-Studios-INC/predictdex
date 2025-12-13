"use client";

import { useAccount } from "wagmi";
import { useWalletStore } from "@/lib/stores/useWalletStore";

export default function WalletWidget() {
  const { address, isConnected } = useAccount();
  const { stableBalances, selectedChain } = useWalletStore();

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-xs uppercase tracking-[0.4em] text-slate-600">Wallet</p>
      <h3 className="mt-2 text-2xl font-semibold text-slate-900">
        {isConnected ? address : "No wallet connected"}
      </h3>
      <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
        {Object.entries(stableBalances).map(([asset, value]) => (
          <div key={asset} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-xs uppercase tracking-[0.35em] text-slate-700">{asset}</p>
            <p className="text-2xl font-semibold text-emerald-700">${value.toLocaleString()}</p>
          </div>
        ))}
      </div>
      <p className="mt-4 text-xs uppercase tracking-[0.3em] text-slate-600">
        Active Chain: <span className="text-slate-900">{selectedChain}</span>
      </p>
    </div>
  );
}
