"use client";

import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { BookOpen, Loader2, Search, Upload } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PANEL_BOOK_ORG_LABELS } from "@/constants/panel-book";
import { parseApiError } from "@/services/api/errors";
import {
  getPanelBookAssetAdmin,
  listPanelBookLeads,
  uploadPanelBookPdf,
  type PanelBookLeadRow,
} from "@/services/panel-book-api";
import { queryKeys } from "@/services/queries";

function formatBytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

export default function AdminPanelBookPage() {
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [uploading, setUploading] = useState(false);

  const listFilters = useMemo(() => ({ page, pageSize: 20, search }), [page, search]);

  const { data: asset, isLoading: assetLoading } = useQuery({
    queryKey: queryKeys.panelBook.asset,
    queryFn: getPanelBookAssetAdmin,
  });

  const { data: listData, isLoading: listLoading } = useQuery({
    queryKey: queryKeys.panelBook.leads(listFilters),
    queryFn: () => listPanelBookLeads(listFilters),
  });

  const items = listData?.items ?? [];
  const meta = listData?.meta;

  async function onPickFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      toast.error("Please choose a PDF file.");
      return;
    }
    setUploading(true);
    try {
      await uploadPanelBookPdf(file);
      toast.success("Panel Book PDF updated.");
      await qc.invalidateQueries({ queryKey: queryKeys.panelBook.asset });
    } catch (err) {
      toast.error(parseApiError(err, "Upload failed."));
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-10 text-gray-900">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-gray-900">Panel Book</h1>
        <p className="mt-1 max-w-2xl text-sm font-medium text-gray-600">
          Upload the PDF visitors receive after submitting the public Panel Book form. Review
          download requests and organization details below.
        </p>
      </div>

      <div className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-subtle text-brand-primary">
              <BookOpen className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-black text-gray-900">Panel Book PDF</h2>
              {assetLoading ? (
                <p className="text-sm text-gray-500">Loading…</p>
              ) : asset?.hasFile ? (
                <p className="text-sm text-gray-600">
                  <span className="font-semibold text-gray-900">
                    {asset.originalFileName ?? "current.pdf"}
                  </span>
                  {" · "}
                  {formatBytes(asset.fileSizeBytes)}
                  {asset.updatedAt ? (
                    <>
                      {" · "}
                      Updated {format(new Date(asset.updatedAt), "MMM d, yyyy HH:mm")}
                    </>
                  ) : null}
                </p>
              ) : (
                <p className="text-sm font-medium text-amber-700">
                  No PDF uploaded yet. Visitors will see a message after submitting the form.
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="file"
              accept="application/pdf,.pdf"
              className="sr-only"
              id="panel-book-pdf"
              onChange={onPickFile}
              disabled={uploading}
            />
            <Button
              type="button"
              variant="outline"
              className="h-11 rounded-xl border-gray-300 font-bold"
              disabled={uploading}
              onClick={() => document.getElementById("panel-book-pdf")?.click()}
            >
              {uploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="mr-2 h-4 w-4" />
              )}
              {uploading ? "Uploading…" : asset?.hasFile ? "Replace PDF" : "Upload PDF"}
            </Button>
          </div>
        </div>
        <p className="mt-4 text-xs text-gray-500">Maximum file size 40 MB. Only PDF is accepted.</p>
      </div>

      <div className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm md:p-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-black text-gray-900">Download requests</h2>
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search name, email, company…"
              className="h-11 rounded-xl border-gray-200 pl-10"
            />
          </div>
        </div>

        {listLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-10 w-10 animate-spin text-brand-primary" />
          </div>
        ) : items.length === 0 ? (
          <p className="py-12 text-center text-sm text-gray-500">No submissions yet.</p>
        ) : (
          <>
            <div className="-mx-2 overflow-x-auto">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-[10px] font-black uppercase tracking-wider text-gray-500">
                    <th className="pb-3 pl-2">Date</th>
                    <th className="pb-3 px-2">Name</th>
                    <th className="pb-3 px-2">Work email</th>
                    <th className="pb-3 px-2">Company</th>
                    <th className="pb-3 px-2">Type</th>
                    <th className="pb-3 px-2">Job title</th>
                    <th className="pb-3 pr-2">Country</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {items.map((row: PanelBookLeadRow) => (
                    <tr key={row.id} className="hover:bg-gray-50/80">
                      <td className="whitespace-nowrap py-3 pl-2 text-xs text-gray-500">
                        {row.createdAt ? format(new Date(row.createdAt), "MMM d, yyyy HH:mm") : "—"}
                      </td>
                      <td className="py-3 px-2 font-semibold">
                        {row.firstName} {row.lastName}
                      </td>
                      <td className="py-3 px-2 text-gray-700">{row.workEmail}</td>
                      <td className="py-3 px-2">{row.companyName}</td>
                      <td className="py-3 px-2 text-xs text-gray-600">
                        {PANEL_BOOK_ORG_LABELS[row.organizationType]}
                      </td>
                      <td className="max-w-[180px] truncate py-3 px-2">{row.jobTitle}</td>
                      <td className="py-3 pr-2 font-mono text-xs">{row.country}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {meta && meta.totalPages > 1 ? (
              <div className="mt-8 flex justify-between border-t border-gray-100 pt-6 text-sm">
                <span className="text-gray-600">
                  Page {meta.page} of {meta.totalPages}
                </span>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    Previous
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={page >= meta.totalPages}
                    onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                  >
                    Next
                  </Button>
                </div>
              </div>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}
