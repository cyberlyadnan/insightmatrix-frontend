import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { AuthUser } from "@/types";

interface AuthState {
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
  clearSession: () => void;
}

/** Session cookies are httpOnly; `user` is hydrated from login + `/users/profile` and kept in sessionStorage */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      clearSession: () => set({ user: null }),
    }),
    {
      name: "insightmatrix-auth",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({ user: state.user }),
    }
  )
);
