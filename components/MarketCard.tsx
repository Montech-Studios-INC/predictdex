import Link from "next/link";
import { memo } from "react";
import type { Market } from "@/lib/api/types";

const formatVolume = (volume: number, symbol: string): string => {
  if (volume >= 1000000) {
    return `${symbol}${(volume / 1000000).toFixed(1)}M`;
  }
  if (volume >= 1000) {
    return `${symbol}${(volume / 1000).toFixed(1)}K`;
  }
  return `${symbol}${volume.toFixed(0)}`;
};

const STATUS_COLORS: Record<string, string> = {
  open: "text-green-600 dark:text-green-400",
  closed: "text-yellow-600 dark:text-yellow-400",
  resolved: "text-blue-600 dark:text-blue-400",
};

type Props = {
  market: Market;
  compact?: boolean;
};

function MarketCard({ market, compact = false }: Props) {
  const statusColor = STATUS_COLORS[market.status] ?? "text-neutral-500 dark:text-neutral-400";

  return (
    <Link
      href={`/markets/${market.slug}`}
      className="card-hover flex flex-col rounded-2xl border border-neutral-200 bg-white px-4 sm:px-6 py-4 sm:py-5 shadow-sm transition min-h-[180px] dark:border-neutral-700 dark:bg-neutral-900"
    >
      <div className="mb-3 sm:mb-4 flex items-center justify-between text-xs uppercase tracking-[0.2em] sm:tracking-[0.3em]">
        <span className={statusColor}>{market.status}</span>
        <span className="text-orange-500">{market.category}</span>
      </div>
      <h3 className="text-lg sm:text-xl font-semibold text-neutral-900 dark:text-white line-clamp-2">{market.question}</h3>
      <div className="mt-4 sm:mt-6 grid grid-cols-2 gap-2 sm:gap-3 text-sm">
        <div className="rounded-xl border border-neutral-200 bg-neutral-50 px-3 sm:px-4 py-3 dark:border-neutral-700 dark:bg-neutral-800">
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.25em] sm:tracking-[0.35em] text-neutral-500 dark:text-neutral-400">YES</p>
          <p className="text-xl sm:text-2xl font-semibold text-green-600 dark:text-green-400">
            {(market.yesPrice * 100).toFixed(0)}%
          </p>
        </div>
        <div className="rounded-xl border border-neutral-200 bg-neutral-50 px-3 sm:px-4 py-3 dark:border-neutral-700 dark:bg-neutral-800">
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.25em] sm:tracking-[0.35em] text-neutral-500 dark:text-neutral-400">NO</p>
          <p className="text-xl sm:text-2xl font-semibold text-red-600 dark:text-red-400">
            {(market.noPrice * 100).toFixed(0)}%
          </p>
        </div>
      </div>
      {!compact && (
        <div className="mt-4 sm:mt-6 flex items-center justify-between text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.35em] text-neutral-500 dark:text-neutral-400">
          <span>Vol {formatVolume(market.volume, market.symbol || '$')}</span>
          <span>
            {new Date(market.closesAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </span>
        </div>
      )}
    </Link>
  );
}

export default memo(MarketCard);
