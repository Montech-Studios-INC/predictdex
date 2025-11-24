import { create } from "zustand";
import { categories, predictions, type Prediction } from "@/data/predictions";

type PredictionStore = {
  predictions: Prediction[];
  countryFilter: string | null;
  categoryFilter: string | null;
  setCountryFilter: (country: string | null) => void;
  setCategoryFilter: (category: string | null) => void;
  clearFilters: () => void;
  getFiltered: (country?: string | null, category?: string | null) => Prediction[];
};

export const usePredictionStore = create<PredictionStore>((set, get) => ({
  predictions,
  countryFilter: null,
  categoryFilter: null,
  setCountryFilter: (country) => {
    const normalized = country ?? null;
    if (get().countryFilter === normalized) return;
    set({ countryFilter: normalized });
  },
  setCategoryFilter: (category) => {
    const normalized = category && categories.includes(category as any) ? category : null;
    if (get().categoryFilter === normalized) return;
    set({ categoryFilter: normalized });
  },
  clearFilters: () => {
    if (!get().countryFilter && !get().categoryFilter) return;
    set({ countryFilter: null, categoryFilter: null });
  },
  getFiltered: (country, category) => {
    const state = get();
    const countryValue = country ?? state.countryFilter;
    const categoryValue = category ?? state.categoryFilter;

    return state.predictions.filter((prediction) => {
      const matchesCountry = countryValue
        ? prediction.country.toLowerCase() === countryValue.toLowerCase()
        : true;
      const matchesCategory = categoryValue
        ? prediction.category.toLowerCase() === categoryValue.toLowerCase()
        : true;
      return matchesCountry && matchesCategory;
    });
  },
}));
