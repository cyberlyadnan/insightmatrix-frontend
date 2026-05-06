import { create } from "zustand";
import type { AuthUser } from "@/types";

interface AuthState {
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
  clearSession: () => void;
}

/** Session cookies are httpOnly; `user` is hydrated from `/users/profile` or login/register responses */
export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearSession: () => set({ user: null }),
}));
