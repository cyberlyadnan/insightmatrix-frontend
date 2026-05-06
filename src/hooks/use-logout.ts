"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { queryKeys } from "@/services/queries";
import { logoutRequest } from "@/services/auth";
import { useAuthStore } from "@/store/authStore";

export function useLogout() {
  const qc = useQueryClient();
  const router = useRouter();
  const clearSession = useAuthStore((s) => s.clearSession);

  return useMutation({
    mutationFn: logoutRequest,
    onSettled: () => {
      qc.removeQueries({ queryKey: queryKeys.auth.profile });
      clearSession();
      router.replace("/login");
      toast.success("Logged out");
    },
  });
}
