"use client";

import { categories } from "@/data/predictions";

type Props = {
  value: string | null;
  onChange: (category: string | null) => void;
  compact?: boolean;
};

export default function CategoryFilter({ value, onChange, compact = false }: Props) {
  return (
    <div className={`flex flex-wrap gap-2 ${compact ? "text-xs" : "text-sm"}`}>
      <button
        onClick={() => onChange(null)}
        className={`border px-3 py-2 uppercase tracking-[0.35em] ${
          value === null
            ? "border-emerald-300 bg-emerald-50 text-emerald-700"
            : "border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900"
        }`}
      >
        All
      </button>
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onChange(category)}
          className={`border px-3 py-2 uppercase tracking-[0.35em] ${
            value === category
              ? "border-orange-400 bg-orange-50 text-orange-800"
              : "border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900"
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
