import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types";

interface AuthState {
  user: User | null;
  /** In-memory only until httpOnly cookies are wired server-side */
  accessToken: string | null;
  refreshToken: string | null;
  setSession: (payload: Partial<Pick<AuthState, "user" | "accessToken" | "refreshToken">>) => void;
  clearSession: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      setSession: (payload) => set((state) => ({ ...state, ...payload })),
      clearSession: () => set({ user: null, accessToken: null, refreshToken: null }),
    }),
    {
      name: "insightmatrix-auth",
      partialize: (state) => ({
        user: state.user,
      }),
    }
  )
);
