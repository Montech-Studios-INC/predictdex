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
        className={`border px-3 sm:px-4 py-2.5 uppercase tracking-[0.2em] sm:tracking-[0.35em] whitespace-nowrap ${
          value === null ? "border-gold text-gold" : "border-white/10 text-mist hover:text-white"
        }`}
      >
        All
      </button>
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onChange(category)}
          className={`border px-3 sm:px-4 py-2.5 uppercase tracking-[0.2em] sm:tracking-[0.35em] whitespace-nowrap ${
            value === category ? "border-electric text-white" : "border-white/10 text-mist hover:text-white"
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
