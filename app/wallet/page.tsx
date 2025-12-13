import WalletDashboard from "@/components/WalletDashboard";

export default function WalletPage() {
  return (
    <div className="space-y-10">
      <header className="rounded-3xl border border-slate-200 bg-white px-8 py-10 shadow-sm">
        <p className="text-xs uppercase tracking-[0.4em] text-emerald-700">Wallet</p>
        <h1 className="mt-4 text-4xl font-semibold text-slate-900">Manage your on-chain balance</h1>
        <p className="mt-3 text-sm text-slate-600">
          Connect via MetaMask or WalletConnect, deposit stablecoins, and withdraw to any EVM wallet.
        </p>
      </header>

      <WalletDashboard />
    </div>
  );
}
