import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AppState {
  locale: string;
  /** Panel rewards currency display preference */
  currency: string;
  setLocale: (locale: string) => void;
  setCurrency: (currency: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      locale: "en-GB",
      currency: "USD",
      setLocale: (locale) => set({ locale }),
      setCurrency: (currency) => set({ currency }),
    }),
    { name: "insightmatrix-app" }
  )
);
