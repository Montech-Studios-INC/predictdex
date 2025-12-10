import Link from "next/link";
import MarketsBoard from "@/components/MarketsBoard";

export default function HomePage() {
  return (
    <div className="space-y-10 sm:space-y-16">
      <section className="grid gap-6 sm:gap-10 border border-white/5 bg-slate/40 px-4 sm:px-8 py-8 sm:py-12 lg:grid-cols-2">
        <div className="space-y-4 sm:space-y-6">
          <p className="text-xs uppercase tracking-[0.3em] sm:tracking-[0.4em] text-gold">AfricaPredicts</p>
          <h1 className="text-2xl sm:text-4xl font-semibold leading-snug text-white lg:text-5xl">
            The Pan-African Prediction Exchange
          </h1>
          <p className="text-base sm:text-lg text-mist">
            Trade real-time predictions on politics, civics, sports, and culture across the continent.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Link
              href="/markets"
              className="border border-royal bg-royal px-5 sm:px-6 py-3.5 sm:py-3 text-sm uppercase tracking-[0.2em] sm:tracking-[0.4em] text-white hover:bg-transparent text-center"
            >
              Start Trading
            </Link>
            <Link
              href="/login"
              className="border border-royal/50 bg-royal/10 px-5 sm:px-6 py-3.5 sm:py-3 text-sm uppercase tracking-[0.2em] sm:tracking-[0.4em] text-gold hover:bg-royal/20 text-center"
            >
              Sign In
            </Link>
          </div>
        </div>

        <div className="space-y-4 sm:space-y-6 border border-white/5 bg-charcoal/50 p-4 sm:p-6">
          <p className="text-xs uppercase tracking-[0.25em] sm:tracking-[0.35em] text-mist">Platform Stats</p>
          <div className="grid gap-3 sm:gap-4 grid-cols-2">
            <div className="border border-white/10 bg-white/5 px-3 sm:px-4 py-3">
              <p className="text-[10px] sm:text-xs uppercase tracking-[0.25em] sm:tracking-[0.35em] text-mist">Markets</p>
              <p className="text-xl sm:text-3xl font-semibold text-gold">Live</p>
            </div>
            <div className="border border-white/10 bg-white/5 px-3 sm:px-4 py-3">
              <p className="text-[10px] sm:text-xs uppercase tracking-[0.25em] sm:tracking-[0.35em] text-mist">Currencies</p>
              <p className="text-xl sm:text-3xl font-semibold text-electric">ETH • USDC</p>
            </div>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.25em] sm:tracking-[0.35em] text-mist">Why AfricaPredicts</p>
            <ul className="mt-3 space-y-2 text-sm text-mist">
              <li>• Fast settlement on Polygon + Arbitrum</li>
              <li>• Markets curated by local analysts</li>
              <li>• Transparent DAO-managed liquidity</li>
            </ul>
          </div>
        </div>
      </section>

      <MarketsBoard
        title="Top Predictions in Africa"
        description="Trade trending narratives curated by our intelligence desk."
        limit={6}
        offset={0}
        showFilters={false}
      />
    </div>
  );
}
