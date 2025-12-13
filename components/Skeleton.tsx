"use client";

import { memo } from "react";

type SkeletonProps = {
  className?: string;
};

export const Skeleton = memo(function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div className={`animate-pulse bg-neutral-200 dark:bg-neutral-700 rounded ${className}`} />
  );
});

export const MarketCardSkeleton = memo(function MarketCardSkeleton() {
  return (
    <div className="flex flex-col rounded-2xl border border-neutral-200 bg-white px-4 sm:px-6 py-4 sm:py-5 min-h-[180px] dark:border-neutral-700 dark:bg-neutral-900">
      <div className="mb-3 sm:mb-4 flex items-center justify-between">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-20" />
      </div>
      <Skeleton className="h-6 w-full mb-2" />
      <Skeleton className="h-6 w-3/4" />
      <div className="mt-4 sm:mt-6 grid grid-cols-2 gap-2 sm:gap-3">
        <div className="rounded-xl border border-neutral-200 bg-neutral-50 px-3 sm:px-4 py-3 dark:border-neutral-700 dark:bg-neutral-800">
          <Skeleton className="h-3 w-8 mb-2" />
          <Skeleton className="h-8 w-12" />
        </div>
        <div className="rounded-xl border border-neutral-200 bg-neutral-50 px-3 sm:px-4 py-3 dark:border-neutral-700 dark:bg-neutral-800">
          <Skeleton className="h-3 w-8 mb-2" />
          <Skeleton className="h-8 w-12" />
        </div>
      </div>
    </div>
  );
});

export const BalanceCardSkeleton = memo(function BalanceCardSkeleton() {
  return (
    <div className="rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-4 dark:border-neutral-700 dark:bg-neutral-800">
      <Skeleton className="h-3 w-12 mb-3" />
      <Skeleton className="h-8 w-24" />
    </div>
  );
});

export const TableRowSkeleton = memo(function TableRowSkeleton({ cols = 4 }: { cols?: number }) {
  return (
    <div className="flex gap-4 py-4 border-b border-neutral-200 dark:border-neutral-700">
      {[...Array(cols)].map((_, i) => (
        <Skeleton key={i} className="h-5 flex-1" />
      ))}
    </div>
  );
});
