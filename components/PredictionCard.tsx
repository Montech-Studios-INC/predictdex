import Link from "next/link";
import type { Prediction } from "@/data/predictions";

type Props = {
  prediction: Prediction;
  compact?: boolean;
};

const numberFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const countryFlag: Record<string, string> = {
  Nigeria: "🇳🇬",
  "South Africa": "🇿🇦",
  Kenya: "🇰🇪",
  Ghana: "🇬🇭",
  Zambia: "🇿🇲",
  Egypt: "🇪🇬",
  Morocco: "🇲🇦",
  Uganda: "🇺🇬",
  Tanzania: "🇹🇿",
  Ethiopia: "🇪🇹",
};

function getCountryFlag(name: string): string {
  return countryFlag[name] ?? "🌍";
}

export default function PredictionCard({ prediction, compact = false }: Props) {
  return (
    <Link
      href={`/markets/${prediction.slug}`}
      className="card-hover flex flex-col rounded-2xl border border-neutral-200 bg-white px-6 py-5 shadow-sm transition hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900"
    >
      <div className="mb-4 flex items-center justify-between text-xs uppercase tracking-[0.3em] text-neutral-600 dark:text-neutral-300">
        <span className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1 text-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100">
          <span>{getCountryFlag(prediction.country)}</span>
          <span>{prediction.country}</span>
        </span>
        <span className="rounded-full border border-orange-100 bg-orange-50 px-3 py-1 text-orange-700 dark:border-orange-300/40 dark:bg-orange-500/15 dark:text-orange-100">
          {prediction.category}
        </span>
      </div>
      <h3 className="text-xl font-semibold text-neutral-900 dark:text-white">{prediction.title}</h3>
      <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-xl border border-neutral-200 bg-orange-50 px-4 py-3 dark:border-neutral-800 dark:bg-orange-500/10">
          <p className="text-xs uppercase tracking-[0.35em] text-orange-800 dark:text-orange-100">YES</p>
          <p className="text-2xl font-semibold text-orange-700 dark:text-orange-200">
            {(prediction.yesPrice * 100).toFixed(0)}%
          </p>
        </div>
        <div className="rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-800">
          <p className="text-xs uppercase tracking-[0.35em] text-neutral-700 dark:text-neutral-200">NO</p>
          <p className="text-2xl font-semibold text-neutral-900 dark:text-white">
            {(prediction.noPrice * 100).toFixed(0)}%
          </p>
        </div>
      </div>
      {!compact && (
        <div className="mt-6 flex items-center justify-between text-xs uppercase tracking-[0.35em] text-neutral-600 dark:text-neutral-300">
          <span className="text-neutral-700 dark:text-neutral-200">Liquidity {prediction.liquidity}</span>
          <span className="text-neutral-700 dark:text-neutral-200">Volume {numberFormatter.format(prediction.volume)}</span>
        </div>
      )}
    </Link>
  );
}
