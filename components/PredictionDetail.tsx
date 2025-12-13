"use client";

import { useState } from "react";
import type { Prediction } from "@/data/predictions";
import ChartBox from "./ChartBox";
import OrderBookPanel from "./OrderBookPanel";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});

type Props = {
  prediction: Prediction;
};

export default function PredictionDetail({ prediction }: Props) {
  const [amount, setAmount] = useState(250);
  const [direction, setDirection] = useState<"yes" | "no">("yes");

  const selectedPrice = direction === "yes" ? prediction.yesPrice : prediction.noPrice;
  const estimatedPayout = amount * (1 / selectedPrice);
  const fee = amount * 0.02;

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.3em] text-slate-600">
            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-emerald-800">
              {prediction.country}
            </span>
            <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-amber-800">
              {prediction.category}
            </span>
            <span>Liquidity {prediction.liquidity}</span>
          </div>
          <h1 className="mt-6 text-3xl font-semibold text-slate-900">{prediction.title}</h1>
          <p className="mt-4 text-sm text-slate-600">{prediction.marketDescription}</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-emerald-50 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.4em] text-emerald-800">YES PRICE</p>
              <p className="text-3xl font-semibold text-emerald-700">
                {(prediction.yesPrice * 100).toFixed(0)}%
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-orange-50 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.4em] text-orange-800">NO PRICE</p>
              <p className="text-3xl font-semibold text-orange-700">
                {(prediction.noPrice * 100).toFixed(0)}%
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.4em] text-slate-700">VOLUME</p>
              <p className="text-3xl font-semibold text-slate-900">
                ${prediction.volume.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <ChartBox />
        <OrderBookPanel />

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs uppercase tracking-[0.4em] text-slate-600">Timeline</p>
          <p className="mt-2 text-slate-800">{prediction.timeline}</p>
          <p className="mt-6 text-xs uppercase tracking-[0.4em] text-slate-600">Source</p>
          {prediction.source ? (
            <a href={prediction.source} target="_blank" rel="noreferrer" className="mt-2 block text-emerald-700">
              {prediction.source}
            </a>
          ) : (
            <p className="mt-2 text-slate-600">Source coming soon.</p>
          )}
          <div className="mt-6">
            <p className="text-xs uppercase tracking-[0.4em] text-slate-600">Community sentiment</p>
            <div className="mt-3 h-3 w-full rounded-full border border-slate-200 bg-slate-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-sky-400"
                style={{ width: `${prediction.sentiment}%` }}
              />
            </div>
            <p className="mt-2 text-sm text-slate-600">{prediction.sentiment}% bullish</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs uppercase tracking-[0.4em] text-slate-600">Trade</p>
          <div className="mt-4 flex gap-3 text-sm uppercase tracking-[0.3em]">
            <button
              onClick={() => setDirection("yes")}
              className={`flex-1 border px-3 py-2 ${
                direction === "yes"
                  ? "border-emerald-500 bg-emerald-50 text-emerald-800"
                  : "border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900"
              }`}
            >
              Buy YES
            </button>
            <button
              onClick={() => setDirection("no")}
              className={`flex-1 border px-3 py-2 ${
                direction === "no"
                  ? "border-orange-400 bg-orange-50 text-orange-800"
                  : "border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900"
              }`}
            >
              Buy NO
            </button>
          </div>

          <label className="mt-6 block text-xs uppercase tracking-[0.4em] text-slate-600">
            Stake (USDC)
            <input
              type="number"
              min={10}
              value={amount}
              onChange={(event) => setAmount(Number(event.target.value))}
              className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-900 focus:border-emerald-500 focus:outline-none"
            />
          </label>

          <div className="mt-4 space-y-3 text-sm text-slate-600">
            <div className="flex items-center justify-between">
              <span>Estimated payout</span>
              <span className="text-slate-900">{currencyFormatter.format(estimatedPayout)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Oracle fee</span>
              <span className="text-slate-900">{currencyFormatter.format(fee)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Price</span>
              <span className="text-slate-900">{(selectedPrice * 100).toFixed(1)}%</span>
            </div>
          </div>

          <button className="mt-6 w-full rounded-lg border border-emerald-600 bg-emerald-600 px-4 py-3 text-sm uppercase tracking-[0.35em] text-white shadow-sm hover:bg-emerald-700">
            Confirm Trade
          </button>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs uppercase tracking-[0.4em] text-slate-600">Fee Schedule</p>
          <ul className="mt-4 space-y-2 text-sm text-slate-600">
            <li>Maker rebate: 0.05%</li>
            <li>Taker fee: 0.30%</li>
            <li>Settlement fee: 1.0%</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
