"use client";

import { FormEvent, useState } from "react";
import WalletWidget from "./WalletWidget";
import { useWalletStore, type Chain } from "@/lib/stores/useWalletStore";

export default function WalletDashboard() {
  const { deposit, withdraw, setChain, selectedChain, transactions } = useWalletStore();
  const [depositAmount, setDepositAmount] = useState(250);
  const [withdrawAmount, setWithdrawAmount] = useState(120);
  const [withdrawAddress, setWithdrawAddress] = useState("0x0000...africa");
  const [asset, setAsset] = useState<"USDT" | "USDC">("USDT");

  const handleDeposit = (event: FormEvent) => {
    event.preventDefault();
    deposit(depositAmount, asset);
  };

  const handleWithdraw = (event: FormEvent) => {
    event.preventDefault();
    withdraw(withdrawAmount, asset);
  };

  const networks: Chain[] = ["BNB", "Polygon", "Arbitrum"];

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="space-y-8 lg:col-span-1">
        <WalletWidget />
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs uppercase tracking-[0.4em] text-slate-600">Chain</p>
          <div className="mt-4 flex flex-wrap gap-3 text-xs uppercase tracking-[0.35em]">
            {networks.map((chain) => (
              <button
                key={chain}
                onClick={() => setChain(chain as any)}
                className={`border px-4 py-2 ${
                  selectedChain === chain
                    ? "border-emerald-500 bg-emerald-50 text-emerald-800"
                    : "border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900"
                }`}
              >
                {chain}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-8 lg:col-span-2">
        <form onSubmit={handleDeposit} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs uppercase tracking-[0.4em] text-slate-600">Deposit</p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="text-xs uppercase tracking-[0.35em] text-slate-600">
              Amount
              <input
                type="number"
                min={50}
                className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-900 focus:border-emerald-500 focus:outline-none"
                value={depositAmount}
                onChange={(event) => setDepositAmount(Number(event.target.value))}
              />
            </label>
            <label className="text-xs uppercase tracking-[0.35em] text-slate-600">
              Asset
              <select
                className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-900 focus:border-emerald-500 focus:outline-none"
                value={asset}
                onChange={(event) => setAsset(event.target.value as "USDT" | "USDC")}
              >
                <option value="USDT">USDT</option>
                <option value="USDC">USDC</option>
              </select>
            </label>
          </div>
          <button
            type="submit"
            className="mt-6 rounded-lg border border-emerald-600 bg-emerald-600 px-6 py-3 text-xs uppercase tracking-[0.35em] text-white shadow-sm hover:bg-emerald-700"
          >
            Initiate Deposit
          </button>
        </form>

        <form onSubmit={handleWithdraw} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs uppercase tracking-[0.4em] text-slate-600">Withdraw</p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="text-xs uppercase tracking-[0.35em] text-slate-600">
              Amount
              <input
                type="number"
                min={50}
                className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-900 focus:border-orange-400 focus:outline-none"
                value={withdrawAmount}
                onChange={(event) => setWithdrawAmount(Number(event.target.value))}
              />
            </label>
            <label className="text-xs uppercase tracking-[0.35em] text-slate-600">
              Wallet Address
              <input
                type="text"
                className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-900 focus:border-orange-400 focus:outline-none"
                value={withdrawAddress}
                onChange={(event) => setWithdrawAddress(event.target.value)}
              />
            </label>
          </div>
          <button
            type="submit"
            className="mt-6 rounded-lg border border-orange-500 bg-orange-500 px-6 py-3 text-xs uppercase tracking-[0.35em] text-white shadow-sm hover:bg-orange-600"
          >
            Request Withdrawal
          </button>
        </form>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-600">Transaction history</p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs uppercase tracking-[0.35em] text-slate-600">
                <tr className="text-left">
                  <th className="border-b border-slate-200 py-3">Type</th>
                  <th className="border-b border-slate-200 py-3">Amount</th>
                  <th className="border-b border-slate-200 py-3">Chain</th>
                  <th className="border-b border-slate-200 py-3">Status</th>
                  <th className="border-b border-slate-200 py-3">Time</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.id} className="text-slate-700">
                    <td className="border-b border-slate-100 py-3">{tx.type}</td>
                    <td className="border-b border-slate-100 py-3">
                      ${tx.amount.toLocaleString()} {tx.asset}
                    </td>
                    <td className="border-b border-slate-100 py-3">{tx.chain}</td>
                    <td className="border-b border-slate-100 py-3">{tx.status}</td>
                    <td className="border-b border-slate-100 py-3">
                      {new Date(tx.timestamp).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
