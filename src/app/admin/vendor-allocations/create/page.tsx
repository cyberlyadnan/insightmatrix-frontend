"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

import { VendorAllocationForm } from "@/components/admin/vendor-allocations/vendor-allocation-form";
import { ROUTES } from "@/constants/routes";
import { parseApiError } from "@/services/api/errors";
import { createVendorAllocation } from "@/services/vendor-allocation/vendor-allocation-api";
import { listVendors } from "@/services/vendor/vendor-api";
import { listPanelSurveys } from "@/services/panel-survey";
import { queryKeys } from "@/services/queries";

export default function CreateVendorAllocationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedSurveyId = searchParams.get("surveyId") ?? "";

  const { data: surveysData, isLoading: surveysLoading } = useQuery({
    queryKey: queryKeys.panelSurveys.list({ pageSize: 100 }),
    queryFn: () => listPanelSurveys({ pageSize: 100 }),
  });

  const { data: vendorsData, isLoading: vendorsLoading } = useQuery({
    queryKey: queryKeys.vendors.list({ pageSize: 100, status: "active" }),
    queryFn: () => listVendors({ pageSize: 100, status: "active" }),
  });

  const createMut = useMutation({
    mutationFn: createVendorAllocation,
    onSuccess: (allocation) => {
      toast.success("Allocation created");
      router.push(ROUTES.admin.vendorAllocation(allocation.id));
    },
    onError: (e) => toast.error(parseApiError(e)),
  });

  const surveys = (surveysData?.items ?? [])
    .filter((s) => s.surveyStatus === "active" || s.id === preselectedSurveyId)
    .map((s) => ({
      id: s.id,
      label: `${s.surveyCode} — ${s.surveyName}`,
      remainingQuota: s.remainingQuota ?? 0,
    }));

  const vendors = (vendorsData?.items ?? []).map((v) => ({
    id: v.id,
    label: `${v.vendorCode} — ${v.companyName}`,
  }));

  const loading = surveysLoading || vendorsLoading;

  return (
    <div className="max-w-2xl space-y-8 text-gray-900">
      <Link
        href={ROUTES.admin.vendorAllocations}
        className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to allocations
      </Link>

      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">
          New assignment
        </p>
        <h1 className="text-2xl font-black tracking-tight">Assign survey to vendor</h1>
        <p className="text-sm text-gray-500 mt-1">
          A routing link (ALLOC-xxxx) is generated automatically after creation.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-6 md:p-8 shadow-sm">
        {loading ? (
          <p className="text-sm text-gray-500 py-8 text-center">Loading form…</p>
        ) : (
          <VendorAllocationForm
            surveys={surveys}
            vendors={vendors}
            surveyLocked={Boolean(preselectedSurveyId)}
            initialValues={{ panelSurveyId: preselectedSurveyId }}
            isSubmitting={createMut.isPending}
            onSubmit={(payload) => createMut.mutate(payload)}
          />
        )}
      </div>
    </div>
  );
}
