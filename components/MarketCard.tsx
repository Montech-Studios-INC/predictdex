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
  open: "text-green-400",
  closed: "text-yellow-400",
  resolved: "text-blue-400",
};

type Props = {
  market: Market;
  compact?: boolean;
};

function MarketCard({ market, compact = false }: Props) {
  const statusColor = STATUS_COLORS[market.status] ?? "text-mist";

  return (
    <Link
      href={`/markets/${market.slug}`}
      className="card-hover flex flex-col border border-white/5 bg-gradient-to-b from-charcoal/80 to-slate/60 px-4 sm:px-6 py-4 sm:py-5 transition min-h-[180px]"
    >
      <div className="mb-3 sm:mb-4 flex items-center justify-between text-xs uppercase tracking-[0.2em] sm:tracking-[0.3em] text-mist">
        <span className={statusColor}>{market.status}</span>
        <span className="text-electric">{market.category}</span>
      </div>
      <h3 className="text-lg sm:text-xl font-semibold text-white line-clamp-2">{market.question}</h3>
      <div className="mt-4 sm:mt-6 grid grid-cols-2 gap-2 sm:gap-3 text-sm">
        <div className="border border-white/10 bg-white/5 px-3 sm:px-4 py-3">
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.25em] sm:tracking-[0.35em] text-mist">YES</p>
          <p className="text-xl sm:text-2xl font-semibold text-gold">
            {(market.yesPrice * 100).toFixed(0)}%
          </p>
        </div>
        <div className="border border-white/10 bg-white/5 px-3 sm:px-4 py-3">
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.25em] sm:tracking-[0.35em] text-mist">NO</p>
          <p className="text-xl sm:text-2xl font-semibold text-electric">
            {(market.noPrice * 100).toFixed(0)}%
          </p>
        </div>
      </div>
      {!compact && (
        <div className="mt-4 sm:mt-6 flex items-center justify-between text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.35em] text-mist">
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
