"use client";

import React, { use } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { RefreshCw } from "lucide-react";
import { ServiceForm } from "@/components/admin/services/service-form";
import {
  getServiceBySlugOrId,
  updateService,
  type ServiceCmsRecord,
} from "@/services/services-cms/services-cms-api";
import { queryKeys } from "@/services/queries/queryKeys";

interface Props {
  params: Promise<{ id: string }>;
}

export default function EditServicePage({ params }: Props) {
  const { id } = use(params);
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    data: service,
    isLoading,
    error,
  } = useQuery({
    queryKey: queryKeys.servicesCms.detail(id),
    queryFn: () => getServiceBySlugOrId(id),
    enabled: Boolean(id),
  });

  const updateMutation = useMutation({
    mutationFn: (payload: Partial<ServiceCmsRecord>) => updateService(service?._id || id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.servicesCms.all });
      alert("Service updated successfully!");
    },
    onError: (err: unknown) => {
      const msg =
        typeof err === "object" && err !== null && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : err instanceof Error
            ? err.message
            : "Failed to update service";
      alert(msg || "Failed to update service");
    },
  });

  const handleUpdate = async (payload: Partial<ServiceCmsRecord>) => {
    await updateMutation.mutateAsync(payload);
  };

  if (isLoading) {
    return (
      <div className="py-24 text-center">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto text-brand-primary mb-3" />
        <p className="font-bold text-gray-700">Loading service details...</p>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="py-24 text-center bg-white rounded-[2rem] border border-gray-100 p-8">
        <h2 className="text-xl font-black text-gray-900 mb-2">Service Not Found</h2>
        <p className="text-sm text-gray-500 mb-6">
          The requested service could not be found or loaded from the database.
        </p>
        <button
          type="button"
          onClick={() => router.push("/admin/services")}
          className="px-6 py-2.5 bg-gray-900 text-white font-bold text-xs rounded-xl"
        >
          Back to Services
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-4">
      <ServiceForm
        mode="edit"
        initialData={service}
        onSubmit={handleUpdate}
        isSubmitting={updateMutation.isPending}
      />
    </div>
  );
}
