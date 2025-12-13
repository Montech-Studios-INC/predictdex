import { notFound } from "next/navigation";
import MarketsBoard from "@/components/MarketsBoard";
import type { MarketCategory } from "@/lib/api/types";

const categories = ["Politics", "Civics", "Sports", "Culture"] as const;

type Props = {
  params: {
    category: string;
  };
};

export function generateStaticParams() {
  return categories.map((category) => ({
    category: category.toLowerCase(),
  }));
}

export default function CategoryPage({ params }: Props) {
  const match = categories.find(
    (category) => category.toLowerCase() === params.category.toLowerCase()
  ) as MarketCategory | undefined;

  if (!match) {
    notFound();
  }

  return (
    <div className="space-y-10">
      <header className="rounded-3xl border border-neutral-200 bg-white px-8 py-10 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <p className="text-xs uppercase tracking-[0.4em] text-orange-500">Category</p>
        <h1 className="mt-4 text-4xl font-semibold text-neutral-900 dark:text-white">{match}</h1>
        <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-300">
          {getCategoryDescription(match)}
        </p>
      </header>

      <MarketsBoard
        title={`${match} Markets`}
        description="Real-time predictions updated as liquidity moves."
        showFilters={false}
        category={match}
      />
    </div>
  );
}

function getCategoryDescription(category: MarketCategory): string {
  switch (category) {
    case "Politics":
      return "Elections, governance, and policy decisions across the African continent.";
    case "Civics":
      return "Civil society, social movements, and community developments.";
    case "Sports":
      return "Football, athletics, and sporting events across Africa.";
    case "Culture":
      return "Arts, entertainment, and cultural phenomena shaping the continent.";
    default:
      return "Markets capturing pan-African narratives.";
  }
}
