"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import MarketsBoard from "@/components/MarketsBoard";
import ConnectWalletButton from "@/components/ConnectWalletButton";

const primaryCta =
  "inline-flex items-center justify-center rounded-full bg-orange-500 px-6 py-2 text-xs font-semibold tracking-[0.2em] uppercase text-white shadow-sm hover:bg-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-neutral-950";

const countryFlag: Record<string, string> = {
  Nigeria: "🇳🇬",
  "South Africa": "🇿🇦",
  Kenya: "🇰🇪",
  Ghana: "🇬🇭",
  Zambia: "🇿🇲",
  Egypt: "🇪🇬",
  Morocco: "🇲🇦",
  Uganda: "🇺🇬",
  Tanzania: "🇹🇿",
  Ethiopia: "🇪🇹",
};

const trendingCountries = ["Nigeria", "South Africa", "Kenya", "Ghana"];
const allCountries = Object.keys(countryFlag);

export default function HomePage() {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCountries = useMemo(() => {
    if (!searchTerm) return allCountries;
    return allCountries.filter((country) => country.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [searchTerm]);

  return (
    <div className="space-y-16">
      <section className="relative overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <Image
          src="/africapredicts/giraffe-hero.jpg"
          alt="AfricaPredicts giraffe"
          fill
          priority
          className="object-cover object-right"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/75 to-white/0 dark:from-black/90 dark:via-black/75 dark:to-black/30" />

        <div className="relative z-10 max-w-xl py-16 px-6 md:py-24 md:px-12">
          <p className="text-xs uppercase tracking-[0.4em] text-orange-500">AfricaPredicts</p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight text-neutral-900 dark:text-white lg:text-5xl">
            AfricaPredicts — The Giraffe of the continent
          </h1>
          <p className="mt-4 text-lg text-neutral-700 dark:text-neutral-200">
            A tall vantage point on Africa&apos;s narratives: trade what matters with clarity and speed.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            {["Real-time markets", "Pan-African coverage", "Serious traders only"].map((item) => (
              <span
                key={item}
                className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-800 shadow-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
              >
                <span className="h-2 w-2 rounded-full bg-orange-500" />
                {item}
              </span>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link href="/markets" className={primaryCta}>
              Start trading
            </Link>
            <ConnectWalletButton />
          </div>
        </div>
      </section>

      <section className="space-y-6 rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex flex-col gap-2">
          <p className="text-xs uppercase tracking-[0.3em] text-orange-500">Trending countries</p>
          <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white">Where narratives move</h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-300">
            Spotlighting the most active markets this week. Pick a country or search to dive in.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {trendingCountries.map((country) => (
            <button
              key={country}
              onClick={() => setSelectedCountry(country)}
              className="flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm text-neutral-900 shadow-sm transition hover:border-orange-400 hover:text-orange-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:border-orange-400"
            >
              <span>{countryFlag[country] ?? "🌍"}</span>
              <span>{country}</span>
            </button>
          ))}
        </div>

        <div className="mt-2 flex flex-col gap-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search countries"
            className="w-full max-w-md rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder:text-neutral-500"
          />

          <div className="flex flex-wrap gap-2">
            {filteredCountries.map((country) => (
              <button
                key={country}
                onClick={() => setSelectedCountry(country)}
                className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition ${
                  selectedCountry === country
                    ? "border-orange-500 bg-orange-50 text-orange-700 dark:border-orange-400 dark:bg-orange-500/10 dark:text-orange-100"
                    : "border-neutral-200 bg-white text-neutral-900 hover:border-orange-400 hover:text-orange-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:border-orange-400"
                }`}
              >
                <span>{countryFlag[country] ?? "🌍"}</span>
                <span>{country}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <MarketsBoard
        key={selectedCountry ?? "all"}
        title="Top 10 Predictions in Africa"
        description="Instantly trade trending narratives curated by our intelligence desk."
        limit={10}
        showFilters={false}
        initialCountry={selectedCountry}
      />
    </div>
  );
}
