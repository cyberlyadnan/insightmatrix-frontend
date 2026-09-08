"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ServiceForm } from "@/components/admin/services/service-form";
import { createService, type ServiceCmsRecord } from "@/services/services-cms/services-cms-api";
import { queryKeys } from "@/services/queries/queryKeys";

export default function CreateServicePage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (payload: Partial<ServiceCmsRecord>) => createService(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.servicesCms.all });
      router.push("/admin/services");
    },
    onError: (err: unknown) => {
      const msg =
        typeof err === "object" && err !== null && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : err instanceof Error
            ? err.message
            : "Failed to create service";
      alert(msg || "Failed to create service");
    },
  });

  const handleCreate = async (payload: Partial<ServiceCmsRecord>) => {
    await createMutation.mutateAsync(payload);
  };

  return (
    <div className="max-w-6xl mx-auto py-4">
      <ServiceForm mode="create" onSubmit={handleCreate} isSubmitting={createMutation.isPending} />
    </div>
  );
}
