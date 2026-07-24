"use client";

import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronDown, Loader2, Plus, Receipt, Download } from "lucide-react";
import { toast } from "sonner";

import { PageHelp } from "@/components/crm/page-help";
import { ADMIN_PAGE_HELP } from "@/constants/admin-page-help";
import { Modal } from "@/components/shared/Modal";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { parseApiError } from "@/services/api/errors";
import {
  createCompanySurveyPayment,
  downloadCompanyPaymentInvoicePdf,
  listCompanySurveyPayments,
  patchCompanySurveyPaymentStatus,
  type CompanyPaymentStatus,
  type CompanySurveyPaymentRow,
} from "@/services/company-survey-payment-api";
import { listPanelSurveys, type PanelSurvey } from "@/services/panel-survey";
import { listSurveyCompanies, type SurveyCompany } from "@/services/survey-company";
import { queryKeys } from "@/services/queries";
import { cn } from "@/lib/utils";

function companyLabel(c: CompanySurveyPaymentRow["surveyCompanyId"]): string {
  if (c && typeof c === "object" && "companyName" in c) return String(c.companyName ?? "—");
  return "—";
}

function surveyLabel(c: CompanySurveyPaymentRow["panelSurveyId"]): string {
  if (c && typeof c === "object" && "surveyName" in c) return String(c.surveyName ?? "—");
  return "—";
}

function paymentId(row: CompanySurveyPaymentRow): string {
  return String(row._id);
}

const STATUS_OPTIONS: CompanyPaymentStatus[] = ["pending", "paid", "cancelled"];

function CompanySearchPicker({
  companies,
  value,
  onChange,
}: {
  companies: SurveyCompany[];
  value: string;
  onChange: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const selected = companies.find((c) => c.id === value);
  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return companies;
    return companies.filter(
      (c) =>
        c.companyName.toLowerCase().includes(t) ||
        c.companyCode.toLowerCase().includes(t) ||
        c.companyEmail.toLowerCase().includes(t)
    );
  }, [companies, q]);

  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  return (
    <div ref={ref} className="relative min-w-0 w-full max-w-full">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "mt-1 flex h-11 w-full min-w-0 max-w-full items-center justify-between gap-2 overflow-hidden rounded-xl border border-gray-200 bg-white px-3 text-left text-sm text-gray-900 shadow-sm",
          !selected && "text-gray-500"
        )}
      >
        <span className="min-w-0 flex-1 truncate font-medium">
          {selected ? `${selected.companyName} (${selected.companyCode})` : "Select provider…"}
        </span>
        <ChevronDown
          className={cn("size-4 shrink-0 text-gray-500 transition-transform", open && "rotate-180")}
        />
      </button>
      {open ? (
        <div className="absolute left-0 right-0 z-[100] mt-1 max-h-[min(50vh,320px)] min-w-0 max-w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name, code, email…"
            className="h-10 min-w-0 max-w-full rounded-none border-0 border-b border-gray-100 bg-gray-50/80 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:ring-0"
            autoComplete="off"
            onMouseDown={(e) => e.stopPropagation()}
          />
          <ul className="max-h-52 overflow-y-auto overflow-x-hidden py-1" role="listbox">
            {filtered.length === 0 ? (
              <li className="px-3 py-2.5 text-sm text-gray-500">No matches.</li>
            ) : (
              filtered.map((c) => (
                <li key={c.id} className="min-w-0 px-1">
                  <button
                    type="button"
                    role="option"
                    className={cn(
                      "w-full max-w-full rounded-lg px-2 py-2.5 text-left text-sm leading-snug text-gray-900 break-words whitespace-normal hover:bg-gray-50 sm:px-3",
                      c.id === value && "bg-brand-subtle font-semibold"
                    )}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      onChange(c.id);
                      setOpen(false);
                      setQ("");
                    }}
                  >
                    {c.companyName}{" "}
                    <span className="font-mono text-xs text-gray-500">({c.companyCode})</span>
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

function SurveySearchPicker({
  surveys,
  isLoading,
  isError,
  value,
  onChange,
  search,
  onSearchChange,
  companySelected,
}: {
  surveys: PanelSurvey[];
  isLoading: boolean;
  isError: boolean;
  value: string;
  onChange: (id: string) => void;
  search: string;
  onSearchChange: (s: string) => void;
  companySelected: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = surveys.find((s) => s.id === value);

  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  return (
    <div ref={ref} className="relative min-w-0 w-full max-w-full">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "mt-1 flex h-auto min-h-11 w-full min-w-0 max-w-full items-center justify-between gap-2 overflow-hidden rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-left text-sm text-gray-900 shadow-sm sm:h-11 sm:py-0",
          !selected && "text-gray-500"
        )}
      >
        <span className="min-w-0 flex-1 truncate font-medium leading-snug">
          {selected ? `${selected.surveyName} (${selected.surveyCode})` : "Select survey…"}
        </span>
        {isLoading && open ? (
          <Loader2 className="size-4 shrink-0 animate-spin text-gray-500" />
        ) : (
          <ChevronDown
            className={cn(
              "size-4 shrink-0 text-gray-500 transition-transform",
              open && "rotate-180"
            )}
          />
        )}
      </button>
      {open ? (
        <div className="absolute left-0 right-0 z-[100] mt-1 max-h-[min(50vh,320px)] min-w-0 max-w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={
              companySelected ? "Search surveys for this provider…" : "Search all surveys…"
            }
            className="h-10 min-w-0 max-w-full rounded-none border-0 border-b border-gray-100 bg-gray-50/80 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:ring-0"
            autoComplete="off"
            onMouseDown={(e) => e.stopPropagation()}
          />
          <ul className="max-h-52 overflow-y-auto overflow-x-hidden py-1" role="listbox">
            {isError ? (
              <li className="px-3 py-2.5 text-sm text-red-600">Could not load surveys.</li>
            ) : isLoading ? (
              <li className="flex items-center justify-center gap-2 px-3 py-6 text-sm text-gray-500">
                <Loader2 className="size-4 animate-spin" />
                Loading…
              </li>
            ) : surveys.length === 0 ? (
              <li className="px-3 py-2.5 text-sm text-gray-500">
                No surveys found. Try another search
                {companySelected ? " or pick a different provider." : "."}
              </li>
            ) : (
              surveys.map((s) => (
                <li key={s.id} className="min-w-0 px-1">
                  <button
                    type="button"
                    role="option"
                    className={cn(
                      "flex w-full max-w-full flex-col items-start gap-0.5 rounded-lg px-2 py-2.5 text-left text-sm leading-snug text-gray-900 break-words whitespace-normal hover:bg-gray-50 sm:flex-row sm:flex-wrap sm:items-baseline sm:gap-x-1 sm:px-3",
                      s.id === value && "bg-brand-subtle font-semibold"
                    )}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      onChange(s.id);
                      setOpen(false);
                    }}
                  >
                    <span className="min-w-0 font-medium break-words">{s.surveyName}</span>
                    <span className="inline font-mono text-xs text-gray-500">({s.surveyCode})</span>
                    <span className="text-[10px] font-bold uppercase text-gray-400 sm:ml-1">
                      {s.surveyStatus}
                    </span>
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

export default function AdminCompanyPaymentsPage() {
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<"" | CompanyPaymentStatus>("");
  const [createOpen, setCreateOpen] = useState(false);
  const [formCompanyId, setFormCompanyId] = useState("");
  const [formSurveyId, setFormSurveyId] = useState("");
  const [formAmount, setFormAmount] = useState("0");
  const [formTax, setFormTax] = useState("0");
  const [formNotes, setFormNotes] = useState("");

  const [surveyModalSearch, setSurveyModalSearch] = useState("");
  const deferredSurveySearch = useDeferredValue(surveyModalSearch);

  const filters = useMemo(
    () => ({
      page,
      pageSize: 20,
      status: statusFilter || undefined,
    }),
    [page, statusFilter]
  );

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.companyPayments.list(filters),
    queryFn: () => listCompanySurveyPayments(filters),
  });

  const { data: companiesData } = useQuery({
    queryKey: queryKeys.surveyCompanies.list({ page: 1, pageSize: 500 }),
    queryFn: () => listSurveyCompanies({ page: 1, pageSize: 500 }),
    enabled: createOpen,
  });

  const surveyListParams = useMemo(
    () => ({
      page: 1,
      pageSize: 100,
      search: deferredSurveySearch.trim() || undefined,
      providerId: formCompanyId || undefined,
    }),
    [deferredSurveySearch, formCompanyId]
  );

  const {
    data: surveysModalData,
    isLoading: surveysModalLoading,
    isError: surveysModalError,
  } = useQuery({
    queryKey: queryKeys.panelSurveys.list(surveyListParams),
    queryFn: () => listPanelSurveys(surveyListParams),
    enabled: createOpen,
  });

  useEffect(() => {
    setFormSurveyId("");
  }, [formCompanyId]);

  const items = data?.items ?? [];
  const meta = data?.meta;
  const companies = companiesData?.items ?? [];
  const surveysForModal = surveysModalData?.items ?? [];

  function handleCreateModalChange(open: boolean) {
    if (open) {
      setCreateOpen(true);
      return;
    }
    setCreateOpen(false);
    setFormCompanyId("");
    setFormSurveyId("");
    setFormAmount("0");
    setFormTax("0");
    setFormNotes("");
    setSurveyModalSearch("");
  }

  const refresh = () => qc.invalidateQueries({ queryKey: queryKeys.companyPayments.all });

  const createMutation = useMutation({
    mutationFn: createCompanySurveyPayment,
    onSuccess: async () => {
      toast.success("Payment entry created.");
      handleCreateModalChange(false);
      await refresh();
    },
    onError: (e) => toast.error(parseApiError(e, "Could not create entry.")),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: CompanyPaymentStatus }) =>
      patchCompanySurveyPaymentStatus(id, { status }),
    onSuccess: async () => {
      toast.success("Status updated.");
      await refresh();
    },
    onError: (e) => toast.error(parseApiError(e, "Could not update status.")),
  });

  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  async function onDownloadInvoice(row: CompanySurveyPaymentRow) {
    const id = paymentId(row);
    setDownloadingId(id);
    try {
      await downloadCompanyPaymentInvoicePdf(id, row.invoiceNumber);
    } catch (e) {
      toast.error(parseApiError(e, "Could not download invoice."));
    } finally {
      setDownloadingId(null);
    }
  }

  function submitCreate() {
    const subtotal = Number.parseFloat(formAmount);
    const tax = Number.parseFloat(formTax);
    if (!formCompanyId || !formSurveyId) {
      toast.error("Select a company and a survey.");
      return;
    }
    if (!Number.isFinite(subtotal) || subtotal < 0) {
      toast.error("Enter a valid payment amount.");
      return;
    }
    if (!Number.isFinite(tax) || tax < 0 || tax > 100) {
      toast.error("Tax % must be between 0 and 100.");
      return;
    }
    createMutation.mutate({
      surveyCompanyId: formCompanyId,
      panelSurveyId: formSurveyId,
      subtotalAmount: subtotal,
      taxPercent: tax,
      notes: formNotes.trim() || undefined,
    });
  }

  return (
    <div className="space-y-8 text-gray-900">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Company Payments</h1>
          <p className="text-sm text-gray-600 font-medium mt-1 max-w-2xl">
            Track supplier fees (money companies pay InsightMatrix). Member rewards stay in points.
            Creating a panel survey auto-generates a pending invoice line. Download PDFs to share
            with finance contacts.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <PageHelp content={ADMIN_PAGE_HELP.companyPayments} />
          <Button
            type="button"
            onClick={() => handleCreateModalChange(true)}
            className="h-11 px-5 rounded-xl bg-gray-900 text-white font-bold hover:bg-black shrink-0"
          >
            <Plus className="w-4 h-4 mr-2 inline" />
            New payment entry
          </Button>
        </div>
      </div>

      <div className="rounded-[2rem] border border-gray-200 bg-white p-5 md:p-6 shadow-sm">
        <div className="flex flex-wrap gap-3 mb-6">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as "" | CompanyPaymentStatus);
              setPage(1);
            }}
            className="h-11 rounded-xl border border-gray-200 px-3 text-sm text-gray-900 bg-white"
          >
            <option value="">All statuses</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-10 h-10 animate-spin text-brand-primary" />
          </div>
        ) : items.length === 0 ? (
          <EmptyState
            icon={Receipt}
            title="No payment records"
            description="Create a panel survey with a company billing amount, or add a manual entry."
          />
        ) : (
          <>
            <div className="hidden xl:block overflow-x-auto -mx-2">
              <table className="w-full min-w-[1000px] text-left text-sm text-gray-900">
                <thead>
                  <tr className="border-b border-gray-200 text-[10px] font-black uppercase tracking-wider text-gray-600">
                    <th className="pb-3 pl-2">Invoice</th>
                    <th className="pb-3 px-2">Company</th>
                    <th className="pb-3 px-2">Survey</th>
                    <th className="pb-3 px-2">Source</th>
                    <th className="pb-3 px-2 text-right">Subtotal</th>
                    <th className="pb-3 px-2 text-right">Tax %</th>
                    <th className="pb-3 px-2 text-right">Total</th>
                    <th className="pb-3 px-2">Status</th>
                    <th className="pb-3 pr-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {items.map((row) => (
                    <tr key={paymentId(row)} className="hover:bg-gray-50/80">
                      <td className="py-3 pl-2 font-mono text-xs font-bold">{row.invoiceNumber}</td>
                      <td className="py-3 px-2 text-sm font-semibold">
                        {companyLabel(row.surveyCompanyId)}
                      </td>
                      <td className="py-3 px-2 text-sm max-w-[200px] truncate">
                        {surveyLabel(row.panelSurveyId)}
                      </td>
                      <td className="py-3 px-2 text-xs text-gray-600">
                        {row.source === "manual" ? "Manual" : "Auto"}
                      </td>
                      <td className="py-3 px-2 text-right tabular-nums">
                        {row.currency} {row.subtotalAmount.toFixed(2)}
                      </td>
                      <td className="py-3 px-2 text-right tabular-nums">{row.taxPercent}%</td>
                      <td className="py-3 px-2 text-right font-bold tabular-nums">
                        {row.currency} {row.totalAmount.toFixed(2)}
                      </td>
                      <td className="py-3 px-2">
                        <select
                          value={row.status}
                          disabled={statusMutation.isPending}
                          onChange={(e) =>
                            statusMutation.mutate({
                              id: paymentId(row),
                              status: e.target.value as CompanyPaymentStatus,
                            })
                          }
                          className="h-9 rounded-lg border border-gray-200 px-2 text-xs font-bold bg-white"
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="py-3 pr-2 text-right">
                        <button
                          type="button"
                          disabled={downloadingId === paymentId(row)}
                          onClick={() => onDownloadInvoice(row)}
                          className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-gray-200 bg-white text-xs font-bold text-gray-900 hover:bg-gray-50 disabled:opacity-50"
                        >
                          {downloadingId === paymentId(row) ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Download className="w-3.5 h-3.5" />
                          )}
                          PDF
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="xl:hidden space-y-4">
              {items.map((row) => (
                <div
                  key={paymentId(row)}
                  className="rounded-2xl border border-gray-200 bg-gray-50/80 p-4 space-y-2 text-gray-900"
                >
                  <div className="flex justify-between gap-2 items-center">
                    <span className="font-mono text-xs font-bold">{row.invoiceNumber}</span>
                    <select
                      value={row.status}
                      disabled={statusMutation.isPending}
                      onChange={(e) =>
                        statusMutation.mutate({
                          id: paymentId(row),
                          status: e.target.value as CompanyPaymentStatus,
                        })
                      }
                      className="h-9 rounded-lg border border-gray-200 px-2 text-xs font-bold bg-white max-w-[140px]"
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                  <p className="text-sm font-bold">{companyLabel(row.surveyCompanyId)}</p>
                  <p className="text-xs text-gray-600 truncate">{surveyLabel(row.panelSurveyId)}</p>
                  <p className="text-sm font-black">
                    {row.currency} {row.totalAmount.toFixed(2)}{" "}
                    <span className="text-gray-500 font-bold text-xs">(incl. tax)</span>
                  </p>
                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      disabled={downloadingId === paymentId(row)}
                      onClick={() => onDownloadInvoice(row)}
                      className="flex-1 h-10 rounded-xl border border-gray-200 bg-white text-xs font-black uppercase inline-flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {downloadingId === paymentId(row) ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : null}
                      Download PDF
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {meta && meta.totalPages > 1 ? (
              <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-100">
                <p className="text-sm text-gray-600">
                  Page {meta.page} of {meta.totalPages}
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="h-10 px-4 rounded-xl border border-gray-200 bg-white text-sm font-bold disabled:opacity-40"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    disabled={page >= meta.totalPages}
                    onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                    className="h-10 px-4 rounded-xl border border-gray-200 bg-white text-sm font-bold disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              </div>
            ) : null}
          </>
        )}
      </div>

      <Modal
        open={createOpen}
        onOpenChange={handleCreateModalChange}
        title="New company payment"
        description="Link an invoice line to an existing provider and panel survey."
        footer={
          <div className="flex w-full min-w-0 flex-col-reverse gap-2 sm:w-auto sm:flex-row sm:flex-wrap sm:justify-end sm:gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleCreateModalChange(false)}
              className="h-10 w-full rounded-xl border-2 border-gray-600 bg-slate-200 px-4 font-bold text-gray-900 shadow-sm hover:bg-slate-300 hover:text-gray-950 sm:w-auto sm:min-w-[7rem]"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={submitCreate}
              disabled={createMutation.isPending}
              className="h-10 w-full rounded-xl bg-gray-900 px-4 font-bold text-white hover:bg-black sm:w-auto sm:min-w-[7rem]"
            >
              {createMutation.isPending ? "Saving…" : "Create entry"}
            </Button>
          </div>
        }
      >
        <div className="min-w-0 space-y-4 text-gray-900">
          <div className="min-w-0">
            <label className="text-xs font-bold text-gray-600 uppercase tracking-widest">
              Company
            </label>
            <CompanySearchPicker
              companies={companies}
              value={formCompanyId}
              onChange={setFormCompanyId}
            />
          </div>
          <div className="min-w-0">
            <label className="text-xs font-bold text-gray-600 uppercase tracking-widest">
              Panel survey
            </label>
            <SurveySearchPicker
              surveys={surveysForModal}
              isLoading={surveysModalLoading}
              isError={surveysModalError}
              value={formSurveyId}
              onChange={setFormSurveyId}
              search={surveyModalSearch}
              onSearchChange={setSurveyModalSearch}
              companySelected={Boolean(formCompanyId)}
            />
            <p className="mt-1 text-pretty text-[11px] leading-relaxed text-gray-500">
              Pick a provider first to narrow surveys. The survey must belong to that provider
              (checked when you save).
            </p>
          </div>
          <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="min-w-0">
              <label className="text-xs font-bold text-gray-600 uppercase tracking-widest">
                Amount (USD)
              </label>
              <Input
                type="number"
                min={0}
                step="0.01"
                value={formAmount}
                onChange={(e) => setFormAmount(e.target.value)}
                className="mt-1 h-11 min-w-0 max-w-full rounded-xl border-gray-200"
              />
            </div>
            <div className="min-w-0">
              <label className="text-xs font-bold text-gray-600 uppercase tracking-widest">
                Tax %
              </label>
              <Input
                type="number"
                min={0}
                max={100}
                step="0.1"
                value={formTax}
                onChange={(e) => setFormTax(e.target.value)}
                className="mt-1 h-11 min-w-0 max-w-full rounded-xl border-gray-200"
              />
            </div>
          </div>
          <div className="min-w-0">
            <label className="text-xs font-bold text-gray-600 uppercase tracking-widest">
              Notes (optional)
            </label>
            <Input
              value={formNotes}
              onChange={(e) => setFormNotes(e.target.value)}
              className="mt-1 h-11 min-w-0 max-w-full rounded-xl border-gray-200"
              placeholder="PO number, billing contact…"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
