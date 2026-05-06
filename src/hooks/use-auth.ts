"use client";

import { useAuthStore } from "@/store/authStore";

export function useAuth() {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const clearSession = useAuthStore((s) => s.clearSession);

  return {
    user,
    setUser,
    clearSession,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
  };
}
