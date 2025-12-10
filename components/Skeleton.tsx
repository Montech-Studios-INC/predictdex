"use client";

import { memo } from "react";

type SkeletonProps = {
  className?: string;
};

export const Skeleton = memo(function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div className={`animate-pulse bg-white/5 rounded ${className}`} />
  );
});

export const MarketCardSkeleton = memo(function MarketCardSkeleton() {
  return (
    <div className="flex flex-col border border-white/5 bg-gradient-to-b from-charcoal/80 to-slate/60 px-4 sm:px-6 py-4 sm:py-5 min-h-[180px]">
      <div className="mb-3 sm:mb-4 flex items-center justify-between">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-20" />
      </div>
      <Skeleton className="h-6 w-full mb-2" />
      <Skeleton className="h-6 w-3/4" />
      <div className="mt-4 sm:mt-6 grid grid-cols-2 gap-2 sm:gap-3">
        <div className="border border-white/10 bg-white/5 px-3 sm:px-4 py-3">
          <Skeleton className="h-3 w-8 mb-2" />
          <Skeleton className="h-8 w-12" />
        </div>
        <div className="border border-white/10 bg-white/5 px-3 sm:px-4 py-3">
          <Skeleton className="h-3 w-8 mb-2" />
          <Skeleton className="h-8 w-12" />
        </div>
      </div>
    </div>
  );
});

export const BalanceCardSkeleton = memo(function BalanceCardSkeleton() {
  return (
    <div className="border border-white/10 bg-white/5 px-4 py-4">
      <Skeleton className="h-3 w-12 mb-3" />
      <Skeleton className="h-8 w-24" />
    </div>
  );
});

export const TableRowSkeleton = memo(function TableRowSkeleton({ cols = 4 }: { cols?: number }) {
  return (
    <div className="flex gap-4 py-4 border-b border-white/5">
      {[...Array(cols)].map((_, i) => (
        <Skeleton key={i} className="h-5 flex-1" />
      ))}
    </div>
  );
});
