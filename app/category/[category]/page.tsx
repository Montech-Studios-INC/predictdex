import { notFound } from "next/navigation";
import PredictionsBoard from "@/components/PredictionsBoard";
import { categories } from "@/data/predictions";

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
  const match = categories.find((category) => category.toLowerCase() === params.category.toLowerCase());

  if (!match) {
    notFound();
  }

  return (
    <div className="space-y-10">
      <header className="rounded-3xl border border-slate-200 bg-white px-8 py-10 shadow-sm">
        <p className="text-xs uppercase tracking-[0.4em] text-emerald-700">Category</p>
        <h1 className="mt-4 text-4xl font-semibold text-slate-900">{match}</h1>
        <p className="mt-3 text-sm text-slate-600">
          From rate cuts to celebrity drops, {match} markets capture pan-African sentiment.
        </p>
      </header>

      <PredictionsBoard
        title={`${match} Markets`}
        description="URL-powered filters ensure this board spotlights the narratives you care about."
        showFilters
        initialCategory={match}
      />
    </div>
  );
}
