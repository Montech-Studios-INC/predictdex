"use client";

import { countries } from "@/data/predictions";

type Props = {
  value: string | null;
  onChange: (country: string | null) => void;
  compact?: boolean;
};

export default function CountryFilter({ value, onChange, compact = false }: Props) {
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
      {countries.map((country) => (
        <button
          key={country}
          onClick={() => onChange(country)}
          className={`border px-3 py-2 uppercase tracking-[0.35em] ${
            value === country
              ? "border-emerald-500 bg-emerald-100 text-emerald-800"
              : "border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900"
          }`}
        >
          {country}
        </button>
      ))}
    </div>
  );
}
