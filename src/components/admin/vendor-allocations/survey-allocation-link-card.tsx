"use client";

import Link from "next/link";
import { Plus, Share2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { ROUTES } from "@/constants/routes";
import { listPanelSurveyVendorAllocations } from "@/services/vendor-allocation/vendor-allocation-api";
import { queryKeys } from "@/services/queries";

type Props = {
  surveyId: string;
  surveyName: string;
  surveyRemainingQuota: number;
};

export function SurveyAllocationLinkCard({ surveyId, surveyName, surveyRemainingQuota }: Props) {
  const { data } = useQuery({
    queryKey: queryKeys.vendorAllocations.bySurvey(surveyId),
    queryFn: () => listPanelSurveyVendorAllocations(surveyId, { pageSize: 1 }),
  });

  const count = data?.meta?.total ?? data?.items?.length ?? 0;

  return (
    <div className="rounded-2xl border border-dashed border-gray-200 bg-slate-50/80 p-6 md:p-8">
      <div className="flex items-start gap-4">
        <div className="h-12 w-12 rounded-xl bg-white border border-gray-100 flex items-center justify-center shrink-0">
          <Share2 className="h-6 w-6 text-brand-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-black text-gray-900">Vendor survey distribution</h3>
          <p className="text-sm text-gray-500 mt-1">
            Manage vendor assignments for <strong>{surveyName}</strong> in the dedicated module.
            Survey remaining quota: <strong>{surveyRemainingQuota}</strong>
            {count > 0 ? (
              <>
                {" "}
                · <strong>{count}</strong> allocation{count === 1 ? "" : "s"}
              </>
            ) : null}
          </p>
          <div className="flex flex-wrap gap-3 mt-4">
            <Link
              href={`${ROUTES.admin.vendorAllocations}?survey=${surveyId}`}
              className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-bold text-white hover:bg-black"
            >
              View allocations
            </Link>
            <Link
              href={`${ROUTES.admin.vendorAllocationsCreate}?surveyId=${surveyId}`}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-800 hover:bg-gray-50"
            >
              <Plus className="h-4 w-4" />
              Assign vendor
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
