"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

import { getPrescreen } from "@/services/prescreen";
import { queryKeys } from "@/services/queries";
import { PrescreenBuilder } from "../../components/prescreen-builder";

export default function EditPrescreenPage() {
  const params = useParams<{ id: string }>();
  const id = String(params?.id || "");

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.prescreens.detail(id),
    queryFn: () => getPrescreen(id),
    enabled: Boolean(id),
  });

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-12 rounded-xl bg-gray-100 animate-pulse" />
        ))}
      </div>
    );
  }

  if (!data) return <p className="text-sm text-gray-500">Prescreen not found.</p>;

  return <PrescreenBuilder mode="edit" initialData={data} prescreenId={id} />;
}
