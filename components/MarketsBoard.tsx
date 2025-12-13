"use client";

import { useState, useCallback, memo } from "react";
import MarketCard from "./MarketCard";
import CategoryFilter from "./CategoryFilter";
import { MarketCardSkeleton } from "./Skeleton";
import { useMarkets } from "@/lib/hooks/useMarkets";
import type { MarketCategory } from "@/lib/api/types";

type Props = {
  title?: string;
  limit?: number;
  offset?: number;
  description?: string;
  showFilters?: boolean;
  initialCategory?: MarketCategory | null;
  initialCountry?: string | null;
};

function MarketsBoard({
  title = "Markets",
  limit = 20,
  offset = 0,
  description,
  showFilters = true,
  initialCategory = null,
  initialCountry = null,
}: Props) {
  const [categoryFilter, setCategoryFilter] = useState<MarketCategory | null>(initialCategory);

  const { markets, isLoading, error } = useMarkets({
    category: categoryFilter,
    country: initialCountry,
    limit,
    offset,
  });

  const handleCategoryChange = useCallback((category: string | null) => {
    setCategoryFilter(category as MarketCategory | null);
  }, []);

  return (
    <section className="space-y-4 sm:space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] sm:tracking-[0.4em] text-orange-500">{title}</p>
        {description && <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">{description}</p>}
      </div>

      {showFilters && (
        <div className="space-y-4">
          <CategoryFilter value={categoryFilter} onChange={handleCategoryChange} />
        </div>
      )}

      {isLoading ? (
        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <MarketCardSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 sm:p-6 text-center dark:border-red-500/20 dark:bg-red-900/10">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">Unable to load markets from the server</p>
        </div>
      ) : markets.length === 0 ? (
        <p className="text-sm text-neutral-500 dark:text-neutral-400">No markets available for this filter.</p>
      ) : (
        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
          {markets.map((market) => (
            <MarketCard key={market.id} market={market} />
          ))}
        </div>
      )}
    </section>
  );
}

export default memo(MarketsBoard);
