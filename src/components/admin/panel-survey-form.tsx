"use client";

import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import { useFormHydrateFromDefaults } from "@/hooks/use-form-hydrate-from-defaults";
import {
  useFieldArray,
  useForm,
  type ControllerRenderProps,
  type FieldErrors,
  type Path,
  type Resolver,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useFormField,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  PANEL_QUOTA_GROUP_STATUSES,
  PANEL_SURVEY_DEVICE_TYPES,
  PANEL_SURVEY_STATUSES,
  PANEL_GENDER_LABELS,
  PANEL_QUOTA_GROUP_STATUS_LABELS,
  PANEL_SURVEY_STATUS_LABELS,
} from "@/constants/panel-survey";
import {
  PANEL_COMPANY_SIZE_OPTIONS,
  PANEL_COUNTRY_OPTIONS,
  PANEL_INDUSTRY_OPTIONS,
  PANEL_LANGUAGE_OPTIONS,
  PANEL_PROFESSION_OPTIONS,
} from "@/constants/panel-targeting-options";
import { QuotaPairFields } from "@/components/admin/quota-pair-fields";
import { TargetingMultiSelect } from "@/components/admin/targeting-multi-select";
import {
  flattenPanelSurveyFieldErrors,
  humanizePanelSurveyFieldPath,
  PANEL_SURVEY_SECTION_IDS,
  panelSurveyFieldPathToSectionId,
  panelSurveyFieldPathToTab,
} from "@/lib/panel-survey-form-errors";
import { applyPanelSurveyConflictToForm } from "@/lib/panel-survey-conflict-errors";
import { parseApiError } from "@/services/api/errors";
import { cn } from "@/lib/utils";
import { applySupplierUrlHintsToForm, previewSupplierRedirectUrl } from "@/lib/supplier-survey-url";
import type { SurveyCompany } from "@/services/survey-company";
import {
  panelSurveyFormSchema,
  type PanelSurveyFormValues,
} from "@/validations/panel-survey.schema";

/** Binds `<input type="number">` so RHF stores integers, not strings (matches Zod + API). */
function intInputBind(
  field: Pick<
    ControllerRenderProps<PanelSurveyFormValues, Path<PanelSurveyFormValues>>,
    "name" | "ref" | "onBlur" | "value" | "onChange"
  >,
  emptyAs: number
) {
  return {
    name: field.name,
    ref: field.ref,
    onBlur: field.onBlur,
    value: typeof field.value === "number" && Number.isFinite(field.value) ? field.value : "",
    onChange: (e: ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      if (raw === "") {
        field.onChange(emptyAs);
        return;
      }
      const n = Number.parseInt(raw, 10);
      field.onChange(Number.isFinite(n) ? n : emptyAs);
    },
  };
}

function ProviderSearchSelect({
  value,
  onChange,
  onBlur,
  providers,
  disabled,
}: {
  value: string;
  onChange: (id: string) => void;
  onBlur: () => void;
  providers: Pick<SurveyCompany, "id" | "companyName" | "companyCode">[];
  disabled?: boolean;
}) {
  const { formItemId, formMessageId, error } = useFormField();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selected = providers.find((p) => p.id === value);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return providers;
    return providers.filter(
      (p) => p.companyName.toLowerCase().includes(q) || p.companyCode.toLowerCase().includes(q)
    );
  }, [providers, query]);

  useEffect(() => {
    function handlePointerDown(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  return (
    <div ref={containerRef} className="max-w-xl space-y-2">
      {selected ? (
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="text-gray-600">Selected:</span>
          <span className="font-semibold text-gray-900">
            {selected.companyName}{" "}
            <span className="font-mono font-normal text-gray-500">({selected.companyCode})</span>
          </span>
          <button
            type="button"
            disabled={disabled}
            className="text-xs font-bold text-brand-primary hover:text-brand-hover disabled:opacity-50"
            onClick={() => onChange("")}
          >
            Clear
          </button>
        </div>
      ) : null}

      <div className="relative">
        <Input
          id={formItemId}
          data-panel-survey-anchor="providerId"
          placeholder="Search providers by name or code…"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => {
            onBlur();
          }}
          disabled={disabled}
          className="h-11 rounded-xl border-gray-200 text-sm text-gray-900 placeholder:text-gray-400"
          autoComplete="off"
          aria-autocomplete="list"
          aria-expanded={open}
          aria-invalid={!!error}
          aria-describedby={error ? formMessageId : undefined}
        />

        {open ? (
          <ul
            className="absolute z-50 mt-1 max-h-56 w-full overflow-auto rounded-xl border border-gray-200 bg-white py-1 shadow-lg"
            role="listbox"
          >
            {providers.length === 0 ? (
              <li className="px-3 py-2.5 text-sm text-gray-500">No survey providers available.</li>
            ) : filtered.length === 0 ? (
              <li className="px-3 py-2.5 text-sm text-gray-500">No providers match your search.</li>
            ) : (
              filtered.map((p) => (
                <li key={p.id}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={p.id === value}
                    className={cn(
                      "w-full px-3 py-2.5 text-left text-sm text-gray-900 hover:bg-gray-50",
                      p.id === value && "bg-brand-subtle"
                    )}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      onChange(p.id);
                      setQuery("");
                      setOpen(false);
                    }}
                  >
                    {p.companyName}{" "}
                    <span className="font-mono text-gray-500">({p.companyCode})</span>
                  </button>
                </li>
              ))
            )}
          </ul>
        ) : null}
      </div>
    </div>
  );
}

const defaultQuotaRow = (): PanelSurveyFormValues["quotaGroups"][number] => ({
  groupName: "",
  groupDescription: "",
  totalQuota: "0",
  remainingQuota: "0",
  status: "active",
});

type PanelSurveyFormProps = {
  mode: "create" | "edit";
  entityId?: string;
  defaultValues: PanelSurveyFormValues;
  providers: Pick<SurveyCompany, "id" | "companyName" | "companyCode">[];
  onSubmit: (values: PanelSurveyFormValues) => void | Promise<void>;
  isSubmitting: boolean;
  submitError?: unknown;
};

function SectionCard({
  title,
  id,
  children,
}: {
  title: string;
  id?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      id={id}
      className="scroll-mt-28 rounded-[2rem] border border-gray-100 bg-white p-6 md:p-8 shadow-sm"
    >
      <h2 className="text-lg font-black text-gray-900 mb-6 pb-4 border-b border-gray-100">
        {title}
      </h2>
      {children}
    </div>
  );
}

export function PanelSurveyForm({
  mode,
  entityId,
  defaultValues,
  providers,
  onSubmit,
  isSubmitting,
  submitError,
}: PanelSurveyFormProps) {
  const form = useForm<PanelSurveyFormValues>({
    resolver: zodResolver(panelSurveyFormSchema) as Resolver<PanelSurveyFormValues>,
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "quotaGroups",
  });

  useFormHydrateFromDefaults(form, defaultValues, { mode, entityId });

  const [activeTab, setActiveTab] = useState<"basic" | "advanced">("basic");

  useEffect(() => {
    if (!submitError) return;
    const handled = applyPanelSurveyConflictToForm(submitError, form.setError);
    if (!handled) return;
    const msg = parseApiError(submitError, "");
    if (msg.includes("External survey ID")) {
      setActiveTab("advanced");
    } else {
      setActiveTab("basic");
    }
  }, [submitError, form]);

  const watchedSurveyUrl = form.watch("externalSurveyUrl");
  const watchedTrackingParam = form.watch("trackingParameterName");
  const redirectPreview = useMemo(
    () =>
      previewSupplierRedirectUrl(
        String(watchedSurveyUrl ?? ""),
        String(watchedTrackingParam ?? "toid")
      ),
    [watchedSurveyUrl, watchedTrackingParam]
  );

  const handleInvalid = (errors: FieldErrors<PanelSurveyFormValues>) => {
    const flat = flattenPanelSurveyFieldErrors(errors);
    if (flat.length === 0) {
      toast.error("Could not submit — check highlighted fields.");
      return;
    }
    const firstPath = flat[0].path;
    setActiveTab(panelSurveyFieldPathToTab(firstPath));
    const lines = flat
      .slice(0, 6)
      .map((e) => `${humanizePanelSurveyFieldPath(e.path)}: ${e.message}`);
    const extra = flat.length > 6 ? `\n…plus ${flat.length - 6} more.` : "";
    toast.error("Fix these before saving", {
      description: `${lines.join("\n")}${extra}`,
    });
    const sectionId = panelSurveyFieldPathToSectionId(firstPath);
    requestAnimationFrame(() => {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "center" });
      if (firstPath === "providerId" || firstPath.startsWith("providerId.")) {
        document.querySelector<HTMLElement>('[data-panel-survey-anchor="providerId"]')?.focus();
        return;
      }
      void form.setFocus(firstPath as Path<PanelSurveyFormValues>);
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, handleInvalid)} className="space-y-8">
        <div className="flex flex-wrap gap-2 border-b border-gray-100 pb-1">
          <button
            type="button"
            onClick={() => setActiveTab("basic")}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-colors",
              activeTab === "basic"
                ? "bg-gray-900 text-white"
                : "bg-gray-50 text-gray-500 hover:text-gray-900"
            )}
          >
            Basic
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("advanced")}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-colors",
              activeTab === "advanced"
                ? "bg-gray-900 text-white"
                : "bg-gray-50 text-gray-500 hover:text-gray-900"
            )}
          >
            Advanced
          </button>
          <p className="w-full text-xs text-gray-500 pt-1">
            {activeTab === "basic"
              ? "Required routing fields only — name, provider, supplier URL, and quotas."
              : "Optional targeting, metrics, billing, and settings."}
          </p>
        </div>

        <div className={cn("space-y-8", activeTab !== "basic" && "hidden")}>
          <SectionCard title="Basic survey information" id={PANEL_SURVEY_SECTION_IDS.basic}>
            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="surveyName"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel className="font-bold text-gray-700">Survey name</FormLabel>
                    <FormControl>
                      <Input
                        className="rounded-xl h-11 border-gray-200"
                        placeholder="Study title"
                        {...field}
                      />
                    </FormControl>
                    <p className="text-xs text-gray-500">Must be unique across all surveys.</p>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="surveyCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-gray-700">Survey code</FormLabel>
                    <FormControl>
                      <Input
                        className="rounded-xl h-11 border-gray-200 uppercase font-mono text-sm"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                        disabled={mode === "edit"}
                      />
                    </FormControl>
                    <p className="text-xs text-gray-500">
                      Unique identifier — immutable after creation.
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="surveyStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-gray-700">Status</FormLabel>
                    <FormControl>
                      <select
                        className="w-full h-11 rounded-xl border border-gray-200 px-3 text-sm text-gray-900 bg-white"
                        {...field}
                      >
                        {PANEL_SURVEY_STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {PANEL_SURVEY_STATUS_LABELS[s]}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </SectionCard>

          <SectionCard title="Provider selection" id={PANEL_SURVEY_SECTION_IDS.provider}>
            <FormField
              control={form.control}
              name="providerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-gray-700">Survey provider</FormLabel>
                  <ProviderSearchSelect
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    providers={providers}
                    disabled={isSubmitting}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </SectionCard>

          <SectionCard title="External survey URL configuration" id={PANEL_SURVEY_SECTION_IDS.url}>
            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="externalSurveyUrl"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel className="font-bold text-gray-700">Provider survey URL</FormLabel>
                    <FormControl>
                      <Input
                        className="rounded-xl h-11 border-gray-200 font-mono text-xs text-gray-900 placeholder:text-gray-400"
                        placeholder="https://survey.partner.com/…?pid=…"
                        {...field}
                        onBlur={(e) => {
                          field.onBlur();
                          applySupplierUrlHintsToForm(
                            e.target.value,
                            (name, value) =>
                              form.setValue(name as keyof PanelSurveyFormValues, value),
                            (name) =>
                              String(form.getValues(name as keyof PanelSurveyFormValues) ?? "")
                          );
                        }}
                      />
                    </FormControl>
                    <p className="text-xs text-gray-500">
                      Paste the supplier entry URL. We fix common typos (
                      <span className="font-mono">gid-…</span> →{" "}
                      <span className="font-mono">gid=…</span>) and auto-detect the respondent
                      parameter. Examples: Friendly <span className="font-mono">PID=XXXXX</span>,
                      Enevna <span className="font-mono">toid=</span>, Epitome{" "}
                      <span className="font-mono">pid=</span>.
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="supplierProjectPid"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel className="font-bold text-gray-700">Callback project ID</FormLabel>
                    <FormControl>
                      <Input
                        className="rounded-xl h-11 border-gray-200 font-mono text-sm text-gray-900 placeholder:text-gray-400"
                        placeholder="e.g. ERS41608 — from supplier portal, not respondent pid"
                        {...field}
                      />
                    </FormControl>
                    <p className="text-xs text-gray-500">
                      Identifies <strong>which study</strong> on supplier callbacks. This is{" "}
                      <strong>not</strong> the respondent token and often is <strong>not</strong>{" "}
                      the empty <span className="font-mono">pid=</span> on the entry URL.
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="trackingParameterName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-gray-700">
                      Tracking parameter name
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="rounded-xl h-11 border-gray-200 font-mono text-sm"
                        placeholder="toid, uid, subid…"
                        {...field}
                      />
                    </FormControl>
                    <p className="text-xs text-gray-500">
                      Query key we set on the <strong>supplier</strong> URL with the platform token
                      (<span className="font-mono">IMX…</span>). Auto-filled when you paste the link
                      — override if your supplier specifies another key.
                    </p>
                    {redirectPreview ? (
                      <p className="text-xs text-gray-500 mt-2 rounded-lg bg-slate-50 border border-gray-100 p-3 font-mono break-all">
                        Redirect preview: {redirectPreview}
                      </p>
                    ) : null}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="participantQueryParam"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-gray-700">
                      Internal share link parameter
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="rounded-xl h-11 border-gray-200 font-mono text-sm"
                        placeholder="toid"
                        {...field}
                      />
                    </FormControl>
                    <p className="text-xs text-gray-500">
                      Query key on <span className="font-mono">/survey/start/…</span> for your
                      team&apos;s respondent id — e.g.{" "}
                      <span className="font-mono">?{field.value || "toid"}=AdnanAhmad</span>. Use{" "}
                      <span className="font-mono">toid</span> (not supplier{" "}
                      <span className="font-mono">pid</span>) to avoid confusion.
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </SectionCard>

          <SectionCard title="Quota configuration" id={PANEL_SURVEY_SECTION_IDS.quotas}>
            <div className="grid gap-6 md:grid-cols-2 mb-2">
              <QuotaPairFields
                control={form.control}
                setValue={form.setValue}
                getValues={form.getValues}
                totalName="totalQuota"
                remainingName="remainingQuota"
                syncResetKey={`${mode}-${entityId ?? "new"}`}
              />
            </div>
            <p className="text-xs text-gray-500 mb-8">
              Remaining quota matches total by default. Edit remaining separately anytime to set a
              different value.
            </p>

            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-black uppercase tracking-widest text-gray-400">
                Dynamic quota groups
              </h3>
              <button
                type="button"
                onClick={() => append(defaultQuotaRow())}
                className="inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-gray-900 text-white text-xs font-black uppercase tracking-widest hover:bg-black"
              >
                <Plus className="w-4 h-4" />
                Add group
              </button>
            </div>

            <div className="space-y-4">
              {fields.length === 0 ? (
                <p className="text-sm text-gray-500 py-4 border border-dashed border-gray-200 rounded-2xl text-center">
                  No quota groups yet. Add segments such as “Parent of Kid 4–5” or “Gift givers”.
                </p>
              ) : (
                fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="rounded-2xl border border-gray-100 bg-gray-50/80 p-4 md:p-6 space-y-4"
                  >
                    <div className="flex justify-between items-start gap-2">
                      <span className="text-xs font-black uppercase tracking-widest text-gray-400">
                        Group {index + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="text-rose-600 hover:bg-rose-50 p-2 rounded-lg"
                        aria-label="Remove group"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name={`quotaGroups.${index}.groupName`}
                        render={({ field: f }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel className="text-gray-700 font-bold">Group name</FormLabel>
                            <FormControl>
                              <Input className="rounded-xl border-gray-200" {...f} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`quotaGroups.${index}.groupDescription`}
                        render={({ field: f }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel className="text-gray-700 font-bold">Description</FormLabel>
                            <FormControl>
                              <Textarea
                                className="rounded-xl border-gray-200 min-h-[60px]"
                                {...f}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid gap-4 md:grid-cols-2 md:col-span-2">
                        <QuotaPairFields
                          control={form.control}
                          setValue={form.setValue}
                          getValues={form.getValues}
                          totalName={`quotaGroups.${index}.totalQuota`}
                          remainingName={`quotaGroups.${index}.remainingQuota`}
                          totalLabel="Total quota"
                          remainingLabel="Remaining"
                          syncResetKey={`${mode}-${entityId ?? "new"}-group-${index}`}
                          compact
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name={`quotaGroups.${index}.status`}
                        render={({ field: f }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel className="text-gray-700 font-bold">Status</FormLabel>
                            <FormControl>
                              <select
                                className="w-full h-11 rounded-xl border border-gray-200 px-3 text-sm text-gray-900 bg-white"
                                {...f}
                              >
                                {PANEL_QUOTA_GROUP_STATUSES.map((s) => (
                                  <option key={s} value={s}>
                                    {PANEL_QUOTA_GROUP_STATUS_LABELS[s]}
                                  </option>
                                ))}
                              </select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </SectionCard>
        </div>

        <div className={cn("space-y-8", activeTab !== "advanced" && "hidden")}>
          <SectionCard title="Targeting configuration" id={PANEL_SURVEY_SECTION_IDS.targeting}>
            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="countriesLine"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel className="font-bold text-gray-700">Target countries</FormLabel>
                    <FormControl>
                      <TargetingMultiSelect
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        options={PANEL_COUNTRY_OPTIONS}
                        placeholder="Select countries…"
                        searchPlaceholder="Search countries…"
                      />
                    </FormControl>
                    <p className="text-xs text-gray-500">
                      Stored as ISO codes (e.g. US, GB). Leave empty for all countries.
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="targetGender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-gray-700">Gender targeting</FormLabel>
                    <FormControl>
                      <select
                        className="w-full h-11 rounded-xl border border-gray-200 px-3 text-sm text-gray-900 bg-white"
                        {...field}
                      >
                        {Object.entries(PANEL_GENDER_LABELS).map(([v, label]) => (
                          <option key={v} value={v}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="targetAgeMin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold text-gray-700">Age min</FormLabel>
                      <FormControl>
                        <Input
                          className="rounded-xl h-11 border-gray-200"
                          placeholder="Optional"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="targetAgeMax"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold text-gray-700">Age max</FormLabel>
                      <FormControl>
                        <Input
                          className="rounded-xl h-11 border-gray-200"
                          placeholder="Optional"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="professionsLine"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel className="font-bold text-gray-700">
                      Professions / segments
                    </FormLabel>
                    <FormControl>
                      <TargetingMultiSelect
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        options={PANEL_PROFESSION_OPTIONS}
                        placeholder="Select professions…"
                        searchPlaceholder="Search professions…"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="industriesLine"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel className="font-bold text-gray-700">Industries</FormLabel>
                    <FormControl>
                      <TargetingMultiSelect
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        options={PANEL_INDUSTRY_OPTIONS}
                        placeholder="Select industries…"
                        searchPlaceholder="Search industries…"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="companySizesLine"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel className="font-bold text-gray-700">Company sizes</FormLabel>
                    <FormControl>
                      <TargetingMultiSelect
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        options={PANEL_COMPANY_SIZE_OPTIONS}
                        placeholder="Select company sizes…"
                        searchPlaceholder="Search…"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="languagesLine"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel className="font-bold text-gray-700">Languages</FormLabel>
                    <FormControl>
                      <TargetingMultiSelect
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        options={PANEL_LANGUAGE_OPTIONS}
                        placeholder="Select languages…"
                        searchPlaceholder="Search languages…"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="devices"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel className="font-bold text-gray-700">Devices</FormLabel>
                    <div className="flex flex-wrap gap-4">
                      {PANEL_SURVEY_DEVICE_TYPES.map((d) => (
                        <label
                          key={d}
                          className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            className="rounded border-gray-300"
                            checked={field.value?.includes(d)}
                            onChange={(e) => {
                              const next = new Set(field.value ?? []);
                              if (e.target.checked) next.add(d);
                              else next.delete(d);
                              field.onChange([...next]);
                            }}
                          />
                          <span className="capitalize">{d}</span>
                        </label>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </SectionCard>

          <SectionCard title="Survey metrics (points)" id={PANEL_SURVEY_SECTION_IDS.metrics}>
            <p className="text-xs text-gray-500 mb-4 -mt-2">
              Panel rewards use <strong>points</strong> only. Leave blank if not applicable.
            </p>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <FormField
                control={form.control}
                name="incidenceRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-gray-700">Incidence rate (%)</FormLabel>
                    <FormControl>
                      <Input
                        className="rounded-xl h-11 border-gray-200"
                        placeholder="0–100"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="estimatedLOI"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-gray-700">Est. LOI (minutes)</FormLabel>
                    <FormControl>
                      <Input className="rounded-xl h-11 border-gray-200" type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="payoutToUser"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-gray-700">
                      Participant points / complete
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="rounded-xl h-11 border-gray-200 text-gray-900"
                        placeholder="e.g. 150"
                        {...field}
                      />
                    </FormControl>
                    <p className="text-xs text-gray-500">Points credited to the member’s wallet.</p>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="revenuePerComplete"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-gray-700">
                      Internal reference pts / complete
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="rounded-xl h-11 border-gray-200 text-gray-900"
                        placeholder="e.g. 200"
                        {...field}
                      />
                    </FormControl>
                    <p className="text-xs text-gray-500">
                      Ops / budgeting reference only — not cash.
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </SectionCard>

          <SectionCard title="Company billing (money)" id={PANEL_SURVEY_SECTION_IDS.billing}>
            <p className="text-xs text-gray-500 mb-4 -mt-2">
              What the <strong>survey provider</strong> pays InsightMatrix in currency (e.g. USD).
              This feeds the <strong>Company payments</strong> module and PDF invoices. Member
              rewards above stay in <strong>points</strong> only.
            </p>
            <div className="grid gap-6 md:grid-cols-2 max-w-2xl">
              <FormField
                control={form.control}
                name="companyBillingAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-gray-700">
                      Contract / project fee (USD)
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="rounded-xl h-11 border-gray-200 text-gray-900"
                        type="text"
                        inputMode="decimal"
                        placeholder="0.00"
                        {...field}
                      />
                    </FormControl>
                    <p className="text-xs text-gray-500">
                      Subtotal before tax on the supplier invoice.
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="companyBillingTaxPercent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-gray-700">Tax % (if applicable)</FormLabel>
                    <FormControl>
                      <Input
                        className="rounded-xl h-11 border-gray-200 text-gray-900"
                        type="text"
                        inputMode="decimal"
                        placeholder="0"
                        {...field}
                      />
                    </FormControl>
                    <p className="text-xs text-gray-500">Use 0 when no sales/VAT applies.</p>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </SectionCard>

          <SectionCard title="Survey settings" id={PANEL_SURVEY_SECTION_IDS.settings}>
            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="externalSurveyId"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel className="font-bold text-gray-700">External survey ID</FormLabel>
                    <FormControl>
                      <Input
                        className="rounded-xl h-11 border-gray-200 font-mono text-sm"
                        placeholder="From supplier portal (optional)"
                        {...field}
                      />
                    </FormControl>
                    <p className="text-xs text-gray-500">
                      From supplier portal (optional). Must be unique when provided.
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="surveyPriority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-gray-700">Priority</FormLabel>
                    <FormControl>
                      <Input
                        className="rounded-xl h-11 border-gray-200"
                        type="number"
                        inputMode="numeric"
                        step={1}
                        placeholder="0"
                        {...intInputBind(field, 0)}
                      />
                    </FormControl>
                    <p className="text-xs text-gray-500">
                      Higher numbers surface first in routing UIs.
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="maxMemberAttempts"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-gray-700">Max member attempts</FormLabel>
                    <FormControl>
                      <Input
                        className="rounded-xl h-11 border-gray-200"
                        type="number"
                        inputMode="numeric"
                        min={1}
                        max={10}
                        step={1}
                        placeholder="2"
                        {...intInputBind(field, 2)}
                      />
                    </FormControl>
                    <p className="text-xs text-gray-500">
                      How many times a member may start this study (e.g. after a terminate). Range
                      1–10. Default 2. After a successful complete (points awarded), they cannot
                      start again.
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-gray-700">Start date</FormLabel>
                    <FormControl>
                      <Input
                        className="rounded-xl h-11 border-gray-200"
                        type="datetime-local"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-gray-700">End date</FormLabel>
                    <FormControl>
                      <Input
                        className="rounded-xl h-11 border-gray-200"
                        type="datetime-local"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </SectionCard>

          <SectionCard title="Notes" id={PANEL_SURVEY_SECTION_IDS.notes}>
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-gray-700">Internal notes</FormLabel>
                  <FormControl>
                    <Textarea
                      className="rounded-xl border-gray-200 min-h-[120px]"
                      placeholder="Integration notes, buyer contacts, point caps…"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </SectionCard>
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="rounded-xl bg-gray-900 text-white hover:bg-black h-11 px-10 font-bold"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin mr-2 h-4 w-4 inline" />
                Saving…
              </>
            ) : mode === "create" ? (
              "Create survey"
            ) : (
              "Save changes"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
