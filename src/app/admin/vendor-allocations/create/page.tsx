"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useRef } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { VendorAllocationForm } from "@/components/admin/vendor-allocations/vendor-allocation-form";
import { ROUTES } from "@/constants/routes";
import { crmToast } from "@/lib/crm-toast";
import { parseApiError } from "@/services/api/errors";
import { createVendorAllocation } from "@/services/vendor-allocation/vendor-allocation-api";
import { listVendors } from "@/services/vendor/vendor-api";
import { listPanelSurveys } from "@/services/panel-survey/panel-survey-api";
import { queryKeys } from "@/services/queries";

export default function CreateVendorAllocationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedSurveyId = searchParams.get("surveyId") ?? "";
  const continueRef = useRef(false);

  // Fetch all surveys without status filtering so admin can select any survey
  const { data: surveysData, isLoading: surveysLoading } = useQuery({
    queryKey: queryKeys.panelSurveys.list({ pageSize: 500 }),
    queryFn: () => listPanelSurveys({ pageSize: 500 }),
  });

  // Fetch all vendors without status filtering so admin can select any vendor
  const { data: vendorsData, isLoading: vendorsLoading } = useQuery({
    queryKey: queryKeys.vendors.list({ pageSize: 500 }),
    queryFn: () => listVendors({ pageSize: 500 }),
  });

  const createBatchMut = useMutation({
    mutationFn: async (payloads: Parameters<typeof createVendorAllocation>[0][]) => {
      const createdList = [];
      for (const payload of payloads) {
        const item = await createVendorAllocation(payload);
        createdList.push(item);
      }
      return createdList;
    },
    onSuccess: (allocations) => {
      crmToast.saved();
      if (allocations.length === 1) {
        toast.success("Successfully assigned survey to vendor partner!");
        if (continueRef.current) {
          router.push(ROUTES.admin.vendorAllocation(allocations[0].id));
        } else {
          router.push(ROUTES.admin.vendorAllocations);
        }
      } else {
        toast.success(`Successfully created ${allocations.length} vendor allocations in batch!`);
        router.push(ROUTES.admin.vendorAllocations);
      }
    },
    onError: (e) => toast.error(parseApiError(e)),
  });

  const surveys = surveysData?.items ?? [];
  const vendors = vendorsData?.items ?? [];
  const loading = surveysLoading || vendorsLoading;

  return (
    <div className="max-w-4xl mx-auto space-y-8 text-gray-900 pb-16">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href={ROUTES.admin.vendorAllocations}
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-900 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to allocations
        </Link>

        <div className="hidden sm:flex items-center gap-2 text-xs text-gray-400">
          <span>Admin</span>
          <span>/</span>
          <span>Vendor Allocations</span>
          <span>/</span>
          <span className="text-gray-700 font-semibold">New Assignment</span>
        </div>
      </div>

      {/* Page Title Header */}
      <div className="space-y-1">
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
          New assignment
        </p>
        <h1 className="text-2xl font-black tracking-tight text-gray-900">
          Assign Survey to Vendor Partner
        </h1>
        <p className="text-sm text-gray-500">
          Select surveys and a vendor partner. Dedicated routing links (ALLOC-xxxx) will be
          generated automatically.
        </p>
      </div>

      {/* Main Form Container */}
      <div className="rounded-3xl border border-gray-100 bg-white p-6 md:p-10 shadow-sm">
        {loading ? (
          <div className="py-16 text-center space-y-3">
            <Loader2 className="h-8 w-8 animate-spin text-brand-primary mx-auto" />
            <p className="text-sm font-semibold text-gray-700">
              Loading surveys and vendor partners…
            </p>
            <p className="text-xs text-gray-400">
              Retrieving full catalog with real-time quotas and partner records
            </p>
          </div>
        ) : (
          <VendorAllocationForm
            surveys={surveys}
            vendors={vendors}
            surveyLocked={Boolean(preselectedSurveyId)}
            initialValues={{ panelSurveyId: preselectedSurveyId }}
            isSubmitting={createBatchMut.isPending}
            onSubmit={(payloads, { continueEditing }) => {
              continueRef.current = continueEditing;
              createBatchMut.mutate(payloads);
            }}
          />
        )}
      </div>
    </div>
  );
}
