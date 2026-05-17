"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Link2, Loader2, Pause, Play, Plus, Trash2, XCircle } from "lucide-react";
import { toast } from "sonner";

import { CopyRoutingLinkButton } from "@/components/vendor/copy-routing-link-button";
import { Modal } from "@/components/shared/Modal";
import {
  VENDOR_ALLOCATION_STATUS_LABELS,
  VENDOR_ALLOCATION_STATUS_STYLES,
  type VendorAllocationStatus,
} from "@/constants/vendor-allocation";
import { parseApiError } from "@/services/api/errors";
import { listVendors } from "@/services/vendor/vendor-api";
import {
  closeVendorAllocation,
  createVendorAllocation,
  deleteVendorAllocation,
  listPanelSurveyVendorAllocations,
  pauseVendorAllocation,
  resumeVendorAllocation,
  updateVendorAllocation,
} from "@/services/vendor-allocation/vendor-allocation-api";
import { queryKeys } from "@/services/queries";
import type { VendorSurveyAllocation } from "@/types/vendor-allocation";

function StatusBadge({ status }: { status: VendorAllocationStatus }) {
  return (
    <span
      className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${VENDOR_ALLOCATION_STATUS_STYLES[status]}`}
    >
      {VENDOR_ALLOCATION_STATUS_LABELS[status]}
    </span>
  );
}

type Props = {
  surveyId: string;
  surveyRemainingQuota: number;
};

export function VendorAllocationsSection({ surveyId, surveyRemainingQuota }: Props) {
  const qc = useQueryClient();
  const [createOpen, setCreateOpen] = useState(false);
  const [vendorId, setVendorId] = useState("");
  const [allocatedQuota, setAllocatedQuota] = useState(10);
  const [vendorCpi, setVendorCpi] = useState(0);

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.vendorAllocations.bySurvey(surveyId),
    queryFn: () => listPanelSurveyVendorAllocations(surveyId, { pageSize: 50 }),
  });

  const { data: vendorsData } = useQuery({
    queryKey: queryKeys.vendors.list({ pageSize: 100, status: "active" }),
    queryFn: () => listVendors({ pageSize: 100, status: "active" }),
    enabled: createOpen,
  });

  const invalidate = () =>
    qc.invalidateQueries({ queryKey: queryKeys.vendorAllocations.bySurvey(surveyId) });

  const createMut = useMutation({
    mutationFn: () =>
      createVendorAllocation({
        panelSurveyId: surveyId,
        vendorId,
        allocatedQuota,
        vendorCpi,
      }),
    onSuccess: () => {
      toast.success("Allocation created");
      setCreateOpen(false);
      invalidate();
    },
    onError: (e) => toast.error(parseApiError(e)),
  });

  const pauseMut = useMutation({
    mutationFn: pauseVendorAllocation,
    onSuccess: () => {
      toast.success("Allocation paused");
      invalidate();
    },
    onError: (e) => toast.error(parseApiError(e)),
  });

  const resumeMut = useMutation({
    mutationFn: resumeVendorAllocation,
    onSuccess: () => {
      toast.success("Allocation resumed");
      invalidate();
    },
    onError: (e) => toast.error(parseApiError(e)),
  });

  const closeMut = useMutation({
    mutationFn: closeVendorAllocation,
    onSuccess: () => {
      toast.success("Allocation closed");
      invalidate();
    },
    onError: (e) => toast.error(parseApiError(e)),
  });

  const deleteMut = useMutation({
    mutationFn: deleteVendorAllocation,
    onSuccess: () => {
      toast.success("Allocation removed");
      invalidate();
    },
    onError: (e) => toast.error(parseApiError(e)),
  });

  const updateQuotaMut = useMutation({
    mutationFn: ({ id, quota }: { id: string; quota: number }) =>
      updateVendorAllocation(id, { allocatedQuota: quota }),
    onSuccess: () => {
      toast.success("Quota updated");
      invalidate();
    },
    onError: (e) => toast.error(parseApiError(e)),
  });

  const items = data?.items ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-black text-gray-900">Vendor allocations</h3>
          <p className="text-sm text-gray-500 mt-0.5">
            Survey remaining quota: <strong>{surveyRemainingQuota}</strong> · Vendors receive
            routing links only
          </p>
        </div>
        <button
          type="button"
          onClick={() => setCreateOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-bold text-white hover:bg-black"
        >
          <Plus className="h-4 w-4" />
          Assign vendor
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      ) : items.length === 0 ? (
        <p className="text-sm text-gray-500 py-8 text-center border border-dashed rounded-2xl">
          No vendor allocations yet.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-[10px] font-black uppercase tracking-widest text-gray-500">
                <th className="px-4 py-3">Code</th>
                <th className="px-4 py-3">Vendor</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Quota</th>
                <th className="px-4 py-3">Metrics</th>
                <th className="px-4 py-3">Routing</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((row: VendorSurveyAllocation) => (
                <AllocationRow
                  key={row.id}
                  row={row}
                  onPause={() => pauseMut.mutate(row.id)}
                  onResume={() => resumeMut.mutate(row.id)}
                  onClose={() => closeMut.mutate(row.id)}
                  onDelete={() => {
                    if (confirm("Remove this allocation? Only allowed with zero sessions.")) {
                      deleteMut.mutate(row.id);
                    }
                  }}
                  onUpdateQuota={(quota) => updateQuotaMut.mutate({ id: row.id, quota })}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={createOpen} onOpenChange={setCreateOpen} title="Assign survey to vendor">
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (!vendorId) {
              toast.error("Select a vendor");
              return;
            }
            createMut.mutate();
          }}
        >
          <label className="block text-sm font-semibold text-gray-700">
            Vendor
            <select
              className="mt-1 w-full rounded-xl border border-gray-200 h-11 px-3"
              value={vendorId}
              onChange={(e) => setVendorId(e.target.value)}
              required
            >
              <option value="">Select vendor…</option>
              {(vendorsData?.items ?? []).map((v) => (
                <option key={v.id} value={v.id}>
                  {v.vendorCode} — {v.companyName}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm font-semibold text-gray-700">
            Allocated quota
            <input
              type="number"
              min={1}
              max={surveyRemainingQuota}
              className="mt-1 w-full rounded-xl border border-gray-200 h-11 px-3"
              value={allocatedQuota}
              onChange={(e) => setAllocatedQuota(Number(e.target.value))}
            />
          </label>
          <label className="block text-sm font-semibold text-gray-700">
            Vendor CPI ($)
            <input
              type="number"
              min={0}
              step="0.01"
              className="mt-1 w-full rounded-xl border border-gray-200 h-11 px-3"
              value={vendorCpi}
              onChange={(e) => setVendorCpi(Number(e.target.value))}
            />
          </label>
          <button
            type="submit"
            disabled={createMut.isPending}
            className="w-full h-11 rounded-xl bg-gray-900 text-white font-bold hover:bg-black disabled:opacity-50"
          >
            {createMut.isPending ? "Creating…" : "Create allocation"}
          </button>
        </form>
      </Modal>
    </div>
  );
}

function AllocationRow({
  row,
  onPause,
  onResume,
  onClose,
  onDelete,
  onUpdateQuota,
}: {
  row: VendorSurveyAllocation;
  onPause: () => void;
  onResume: () => void;
  onClose: () => void;
  onDelete: () => void;
  onUpdateQuota: (q: number) => void;
}) {
  const [editingQuota, setEditingQuota] = useState(false);
  const [quotaInput, setQuotaInput] = useState(row.allocatedQuota);

  return (
    <tr className="border-b border-gray-50 hover:bg-gray-50/50">
      <td className="px-4 py-3 font-mono text-xs font-bold">{row.allocationCode}</td>
      <td className="px-4 py-3">
        <p className="font-semibold text-gray-900">{row.vendor?.companyName ?? "—"}</p>
        <p className="text-xs text-gray-500">{row.vendor?.vendorCode}</p>
      </td>
      <td className="px-4 py-3">
        <StatusBadge status={row.status} />
      </td>
      <td className="px-4 py-3">
        {editingQuota ? (
          <div className="flex gap-1 items-center">
            <input
              type="number"
              min={1}
              className="w-20 rounded border px-2 py-1 text-xs"
              value={quotaInput}
              onChange={(e) => setQuotaInput(Number(e.target.value))}
            />
            <button
              type="button"
              className="text-xs font-bold text-brand-primary"
              onClick={() => {
                onUpdateQuota(quotaInput);
                setEditingQuota(false);
              }}
            >
              Save
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="text-left"
            onClick={() => setEditingQuota(true)}
            title="Click to edit quota"
          >
            <span className="font-bold">{row.liveRemainingQuota}</span>
            <span className="text-gray-400"> / {row.allocatedQuota} left</span>
          </button>
        )}
      </td>
      <td className="px-4 py-3 text-xs text-gray-600">
        <p>
          Starts {row.startedCount} · C {row.completedCount}
        </p>
        <p>
          T {row.terminateCount} · QF {row.quotaFullCount} · QR {row.qualityRejectCount}
        </p>
        <p>
          CR {row.conversionRate}% · IR {row.incidenceRate}%
        </p>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1 max-w-[200px]">
          <Link2 className="h-3 w-3 shrink-0 text-gray-400" />
          <span className="truncate text-xs font-mono text-gray-500">{row.routingLink}</span>
        </div>
        <CopyRoutingLinkButton routingLink={row.routingLink} className="mt-2 h-8 text-xs px-2" />
      </td>
      <td className="px-4 py-3">
        <div className="flex justify-end gap-1">
          {row.status === "active" && (
            <button
              type="button"
              onClick={onPause}
              className="p-2 rounded-lg hover:bg-amber-50 text-amber-700"
              title="Pause"
            >
              <Pause className="h-4 w-4" />
            </button>
          )}
          {row.status === "paused" && (
            <button
              type="button"
              onClick={onResume}
              className="p-2 rounded-lg hover:bg-emerald-50 text-emerald-700"
              title="Resume"
            >
              <Play className="h-4 w-4" />
            </button>
          )}
          {row.status !== "closed" && (
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
              title="Close"
            >
              <XCircle className="h-4 w-4" />
            </button>
          )}
          <button
            type="button"
            onClick={onDelete}
            className="p-2 rounded-lg hover:bg-rose-50 text-rose-600"
            title="Remove"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
        {(row.startDate || row.endDate) && (
          <p className="text-[10px] text-gray-400 mt-1 text-right">
            {row.startDate ? format(new Date(row.startDate), "MMM d") : "—"} –{" "}
            {row.endDate ? format(new Date(row.endDate), "MMM d") : "—"}
          </p>
        )}
      </td>
    </tr>
  );
}
