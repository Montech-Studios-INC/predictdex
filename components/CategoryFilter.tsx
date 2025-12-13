"use client";

const categories = ["Politics", "Civics", "Sports", "Culture"] as const;

type Props = {
  value: string | null;
  onChange: (category: string | null) => void;
  compact?: boolean;
};

export default function CategoryFilter({ value, onChange, compact = false }: Props) {
  return (
    <div className={`flex overflow-x-auto gap-2 pb-2 scrollbar-hide ${compact ? "text-xs" : "text-xs sm:text-sm"}`}>
      <button
        onClick={() => onChange(null)}
        className={`rounded-full border px-3 sm:px-4 py-2.5 uppercase tracking-[0.2em] sm:tracking-[0.35em] whitespace-nowrap transition-colors ${
          value === null 
            ? "border-orange-500 bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-300" 
            : "border-neutral-200 text-neutral-600 hover:text-neutral-900 hover:border-neutral-300 dark:border-neutral-700 dark:text-neutral-400 dark:hover:text-white dark:hover:border-neutral-600"
        }`}
      >
        All
      </button>
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onChange(category)}
          className={`rounded-full border px-3 sm:px-4 py-2.5 uppercase tracking-[0.2em] sm:tracking-[0.35em] whitespace-nowrap transition-colors ${
            value === category 
              ? "border-orange-500 bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-300" 
              : "border-neutral-200 text-neutral-600 hover:text-neutral-900 hover:border-neutral-300 dark:border-neutral-700 dark:text-neutral-400 dark:hover:text-white dark:hover:border-neutral-600"
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
