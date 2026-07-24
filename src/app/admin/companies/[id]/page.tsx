"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Calendar,
  ExternalLink,
  Mail,
  Pencil,
  Phone,
  Power,
  User,
  Globe,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

import { ConfirmDialog } from "@/components/crm/confirm-dialog";
import { crmToast } from "@/lib/crm-toast";
import { ROUTES } from "@/constants/routes";
import { SURVEY_PROVIDER_LABELS } from "@/constants/survey-company";
import { parseApiError } from "@/services/api/errors";
import {
  deleteSurveyCompany,
  getSurveyCompany,
  patchSurveyCompanyStatus,
} from "@/services/survey-company";
import { queryKeys } from "@/services/queries";

function StatusBadge({ status }: { status: "active" | "inactive" }) {
  const active = status === "active";
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
        active ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-600"
      }`}
    >
      {active ? "Active" : "Inactive"}
    </span>
  );
}

export default function SurveyCompanyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params.id === "string" ? params.id : "";
  const qc = useQueryClient();
  const [deleteOpen, setDeleteOpen] = useState(false);

  const {
    data: company,
    isLoading,
    isError,
  } = useQuery({
    queryKey: queryKeys.surveyCompanies.detail(id),
    queryFn: () => getSurveyCompany(id),
    enabled: Boolean(id),
  });

  const statusMutation = useMutation({
    mutationFn: async () => {
      const next = company?.status === "active" ? "inactive" : "active";
      return patchSurveyCompanyStatus(id, next);
    },
    onSuccess: async (updated) => {
      toast.success(updated.status === "active" ? "Company enabled" : "Company disabled");
      await qc.invalidateQueries({ queryKey: queryKeys.surveyCompanies.all });
      await qc.invalidateQueries({ queryKey: queryKeys.surveyCompanies.detail(id) });
    },
    onError: (error) => toast.error(parseApiError(error, "Could not update status")),
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteSurveyCompany(id),
    onSuccess: async () => {
      crmToast.deleted();
      setDeleteOpen(false);
      await qc.invalidateQueries({ queryKey: queryKeys.surveyCompanies.all });
      router.push(ROUTES.admin.companies);
    },
    onError: (error) => toast.error(parseApiError(error, "Could not delete company")),
  });

  if (!id) {
    return <p className="text-sm text-gray-500">Invalid company.</p>;
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-pulse">
        <div className="h-10 bg-gray-100 rounded-xl w-2/3" />
        <div className="h-48 bg-gray-100 rounded-[2rem]" />
        <div className="h-32 bg-gray-100 rounded-[2rem]" />
      </div>
    );
  }

  if (isError || !company) {
    return (
      <div className="max-w-4xl mx-auto">
        <p className="text-gray-600 font-medium">Company not found.</p>
        <Link
          href={ROUTES.admin.companies}
          className="text-brand-primary font-bold mt-2 inline-block"
        >
          Back to list
        </Link>
      </div>
    );
  }

  const created = company.createdAt
    ? format(new Date(company.createdAt), "MMM d, yyyy HH:mm")
    : "—";
  const updated = company.updatedAt
    ? format(new Date(company.updatedAt), "MMM d, yyyy HH:mm")
    : "—";

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
        <div>
          <Link
            href={ROUTES.admin.companies}
            className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-brand-primary mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Companies
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">
              {company.companyName}
            </h1>
            <StatusBadge status={company.status} />
          </div>
          <p className="text-sm font-mono text-gray-500 mt-1">{company.companyCode}</p>
        </div>
        <div className="flex flex-wrap gap-2 shrink-0">
          <button
            type="button"
            onClick={() => statusMutation.mutate()}
            disabled={statusMutation.isPending}
            className="h-11 px-4 rounded-xl border border-gray-200 bg-white text-sm font-bold text-gray-900 hover:bg-gray-50 inline-flex items-center gap-2 disabled:opacity-60"
          >
            <Power className="w-4 h-4" />
            {company.status === "active" ? "Disable" : "Enable"}
          </button>
          <Link
            href={ROUTES.admin.companyEdit(id)}
            className="h-11 px-4 rounded-xl bg-gray-900 text-white text-sm font-bold hover:bg-black inline-flex items-center gap-2"
          >
            <Pencil className="w-4 h-4" />
            Edit
          </Link>
          <button
            type="button"
            onClick={() => setDeleteOpen(true)}
            className="h-11 px-4 rounded-xl border border-rose-200 text-rose-600 text-sm font-bold hover:bg-rose-50"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-[2rem] border border-gray-100 bg-white p-6 md:p-8 shadow-sm">
          <h2 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">
            Provider profile
          </h2>
          <dl className="space-y-4 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-gray-500 font-medium">Type</dt>
              <dd className="font-bold text-gray-900 text-right">
                {SURVEY_PROVIDER_LABELS[company.providerType]}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-gray-500 font-medium">Contact</dt>
              <dd className="font-bold text-gray-900 text-right flex items-center gap-1 justify-end">
                <User className="w-4 h-4 text-gray-400 shrink-0" />
                {company.contactPersonName || "—"}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-gray-500 font-medium">Email</dt>
              <dd className="font-bold text-gray-900 text-right break-all">
                {company.companyEmail ? (
                  <a
                    href={`mailto:${company.companyEmail}`}
                    className="inline-flex items-center gap-1 text-brand-primary hover:underline"
                  >
                    <Mail className="w-4 h-4 shrink-0" />
                    {company.companyEmail}
                  </a>
                ) : (
                  "—"
                )}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-gray-500 font-medium">Phone</dt>
              <dd className="font-bold text-gray-900 text-right">
                {company.companyPhone ? (
                  <span className="inline-flex items-center gap-1 justify-end">
                    <Phone className="w-4 h-4 text-gray-400" />
                    {company.companyPhone}
                  </span>
                ) : (
                  "—"
                )}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-gray-500 font-medium">Website</dt>
              <dd className="font-bold text-right">
                {company.websiteUrl ? (
                  <a
                    href={company.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-brand-primary hover:underline break-all"
                  >
                    <Globe className="w-4 h-4 shrink-0" />
                    {company.websiteUrl}
                    <ExternalLink className="w-3 h-3 shrink-0 opacity-60" />
                  </a>
                ) : (
                  "—"
                )}
              </dd>
            </div>
          </dl>
        </div>

        <div className="rounded-[2rem] border border-gray-100 bg-white p-6 md:p-8 shadow-sm">
          <h2 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">
            Record
          </h2>
          <ul className="space-y-4 text-sm">
            <li className="flex gap-3 text-gray-700">
              <Calendar className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-black text-gray-900">Created</p>
                <p className="text-gray-500">{created}</p>
              </div>
            </li>
            <li className="flex gap-3 text-gray-700">
              <Calendar className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-black text-gray-900">Last updated</p>
                <p className="text-gray-500">{updated}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div className="rounded-[2rem] border border-gray-100 bg-white p-6 md:p-8 shadow-sm">
        <h2 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">Notes</h2>
        {company.notes?.trim() ? (
          <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">{company.notes}</p>
        ) : (
          <p className="text-gray-500 text-sm">No internal notes.</p>
        )}
      </div>

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        description={`This removes "${company.companyName}" from the directory. This action cannot be undone.`}
        loading={deleteMutation.isPending}
        onConfirm={() => deleteMutation.mutate()}
      >
        <p className="text-sm text-gray-600">
          This action cannot be undone from the admin UI. Ensure no active integrations depend on
          this provider code.
        </p>
      </ConfirmDialog>
    </div>
  );
}
