import ConnectWalletButton from "@/components/ConnectWalletButton";

export default function AccountPage() {
  return (
    <div className="space-y-10">
      <header className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white px-8 py-10 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-emerald-700">Account</p>
          <h1 className="mt-4 text-4xl font-semibold text-slate-900">Profile & Preferences</h1>
          <p className="mt-3 text-sm text-slate-600">
            Wallet connection = identity. Tune notifications, regional focus, and risk guardrails.
          </p>
        </div>
        <ConnectWalletButton />
      </header>

      <div className="grid gap-8 lg:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-600">Profile</p>
          <div className="mt-4 space-y-4 text-sm text-slate-700">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-slate-700">Display Name</p>
              <p>Pan-African Strategist</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-slate-700">Preferred Markets</p>
              <p>Politics, Business, Crypto</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-slate-700">Risk Mode</p>
              <p>Capital guardrails set at $10k / week</p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-600">Notifications</p>
          <ul className="mt-4 space-y-3 text-sm text-slate-700">
            <li>• Telegram pings for volatility spikes</li>
            <li>• Email digest every Monday 6am WAT</li>
            <li>• SMS alerts for settlements above $5k</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
