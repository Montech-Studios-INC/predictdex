"use client";

import { useParams } from "next/navigation";
import MarketsBoard from "@/components/MarketsBoard";

export default function CountryPage() {
  const params = useParams();
  const country = params.country as string;

  const countryDisplay = country
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <main className="min-h-screen bg-night">
      <section className="relative overflow-hidden border-b border-white/5 py-16">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0" style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              transparent,
              transparent 40px,
              rgba(59, 130, 246, 0.03) 40px,
              rgba(59, 130, 246, 0.03) 80px
            )`
          }} />
        </div>
        <div className="relative mx-auto max-w-6xl px-6 lg:px-12">
          <p className="text-xs uppercase tracking-[0.4em] text-gold mb-3">
            Markets in
          </p>
          <h1 className="text-4xl font-bold text-white md:text-5xl mb-4">
            {countryDisplay}
          </h1>
          <p className="text-lg text-mist max-w-xl">
            Explore prediction markets focused on {countryDisplay}.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12 lg:px-12">
        <MarketsBoard initialCountry={country} />
      </section>
    </main>
  );
}
