"use client";

import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, GripVertical, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { parseApiError } from "@/services/api/errors";
import {
  createPrescreen,
  listPrescreenCategories,
  reorderPrescreenQuestions,
  updatePrescreen,
} from "@/services/prescreen";
import { queryKeys } from "@/services/queries";
import { usePrescreenBuilderStore } from "@/store";
import type { PrescreenForm, PrescreenQuestionType } from "@/types/prescreen";

const schema = z.object({
  title: z.string().min(2, "Title is required"),
  slug: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  visibility: z.enum(["private", "internal", "public"]).default("internal"),
  category: z.string().nullable().optional(),
  tagsText: z.string().optional(),
});

const QUESTION_TYPE_OPTIONS: { label: string; value: PrescreenQuestionType }[] = [
  { label: "Short Text", value: "short_text" },
  { label: "Paragraph", value: "paragraph" },
  { label: "Radio Select", value: "radio" },
  { label: "Checkbox", value: "checkbox" },
  { label: "Dropdown", value: "dropdown" },
  { label: "Number", value: "number" },
  { label: "Email", value: "email" },
  { label: "Date", value: "date" },
  { label: "Yes / No", value: "yes_no" },
];

type FormValues = z.infer<typeof schema>;

type Props = {
  initialData?: PrescreenForm;
  mode: "create" | "edit";
  prescreenId?: string;
};

function isOptionType(type: PrescreenQuestionType) {
  return type === "radio" || type === "checkbox" || type === "dropdown";
}

export function PrescreenBuilder({ initialData, mode, prescreenId }: Props) {
  const router = useRouter();
  const qc = useQueryClient();
  const [preview, setPreview] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const { questions, setQuestions, addQuestion, updateQuestion, removeQuestion, reorderQuestion } =
    usePrescreenBuilderStore();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: initialData?.title ?? "",
      slug: initialData?.slug ?? "",
      description: initialData?.description ?? "",
      status: initialData?.status ?? "draft",
      visibility: initialData?.visibility ?? "internal",
      category: initialData?.category?.id ?? null,
      tagsText: initialData?.tags?.join(", ") ?? "",
    },
  });

  const { data: categories = [] } = useQuery({
    queryKey: queryKeys.prescreens.categories,
    queryFn: listPrescreenCategories,
  });

  useEffect(() => {
    setQuestions(initialData?.questions ?? []);
  }, [initialData?.id, setQuestions, initialData?.questions]);

  const createMutation = useMutation({
    mutationFn: createPrescreen,
    onSuccess: async (created) => {
      await qc.invalidateQueries({ queryKey: queryKeys.prescreens.all });
      toast.success("Prescreen created");
      router.push(`/admin/prescreen/edit/${created.id}`);
    },
    onError: (error) => toast.error(parseApiError(error, "Could not create prescreen")),
  });

  const updateMutation = useMutation({
    mutationFn: async (payload: Partial<PrescreenForm>) =>
      updatePrescreen(String(prescreenId), payload),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: queryKeys.prescreens.all });
      if (prescreenId)
        await qc.invalidateQueries({ queryKey: queryKeys.prescreens.detail(prescreenId) });
      toast.success("Prescreen saved");
    },
    onError: (error) => toast.error(parseApiError(error, "Could not save prescreen")),
  });

  const reorderMutation = useMutation({
    mutationFn: async () => {
      if (!prescreenId) return;
      return reorderPrescreenQuestions(prescreenId, questions);
    },
  });

  const isSaving = createMutation.isPending || updateMutation.isPending;

  const payload = useMemo(() => {
    const values = form.getValues();
    return {
      title: values.title.trim(),
      slug: values.slug?.trim() || undefined,
      description: values.description?.trim() || "",
      status: values.status,
      visibility: values.visibility,
      category: values.category || null,
      tags:
        values.tagsText
          ?.split(",")
          .map((tag) => tag.trim())
          .filter(Boolean) ?? [],
      questions,
    };
  }, [form, questions]);

  const onSave = form.handleSubmit(() => {
    if (mode === "create") createMutation.mutate(payload);
    else updateMutation.mutate(payload);
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-black text-gray-900">
          {mode === "create" ? "Create Prescreen Form" : "Edit Prescreen Form"}
        </h1>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
          <Button
            type="button"
            variant="outline"
            onClick={() => setPreview((p) => !p)}
            className="text-gray-900 border-gray-300 hover:text-gray-900 w-full sm:w-auto"
          >
            <Eye className="w-4 h-4 mr-2" />
            {preview ? "Hide Preview" : "Preview"}
          </Button>
          <Button
            onClick={onSave}
            disabled={isSaving}
            className="w-full sm:w-auto bg-gray-900 hover:bg-black text-white border border-gray-900 shadow-sm"
          >
            {isSaving ? "Saving..." : "Save Prescreen"}
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-white border border-gray-100 rounded-3xl p-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500 font-bold mb-2">Title</p>
              <Input
                {...form.register("title")}
                placeholder="General User Prescreen"
                className="text-gray-900 placeholder:text-gray-400"
              />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-bold mb-2">Slug (optional)</p>
              <Input
                {...form.register("slug")}
                placeholder="general-user-prescreen"
                className="text-gray-900 placeholder:text-gray-400"
              />
            </div>
            <div className="md:col-span-2">
              <p className="text-xs text-gray-500 font-bold mb-2">Description</p>
              <textarea
                {...form.register("description")}
                className="w-full min-h-20 rounded-xl border border-gray-200 p-3 text-sm text-gray-900 placeholder:text-gray-400"
                placeholder="Describe this prescreen objective."
              />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-bold mb-2">Status</p>
              <select
                {...form.register("status")}
                className="w-full h-10 rounded-xl border border-gray-200 px-3 text-sm text-gray-900 bg-white"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-bold mb-2">Visibility</p>
              <select
                {...form.register("visibility")}
                className="w-full h-10 rounded-xl border border-gray-200 px-3 text-sm text-gray-900 bg-white"
              >
                <option value="internal">Internal</option>
                <option value="private">Private</option>
                <option value="public">Public</option>
              </select>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-bold mb-2">Category</p>
              <select
                {...form.register("category")}
                className="w-full h-10 rounded-xl border border-gray-200 px-3 text-sm text-gray-900 bg-white"
              >
                <option value="">No category</option>
                {categories.map((item) => (
                  <option value={item.id} key={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-bold mb-2">Tags (comma separated)</p>
              <Input
                {...form.register("tagsText")}
                placeholder="general, usa, students"
                className="text-gray-900 placeholder:text-gray-400"
              />
            </div>
          </div>

          <div className="space-y-4">
            {questions.length === 0 ? (
              <div className="p-6 rounded-2xl border border-dashed border-gray-200 text-sm text-gray-500">
                No questions yet. Add from right sidebar.
              </div>
            ) : (
              questions.map((q, idx) => (
                <div
                  key={q.id}
                  draggable
                  onDragStart={() => setDragIndex(idx)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={async () => {
                    if (dragIndex === null || dragIndex === idx) return;
                    reorderQuestion(dragIndex, idx);
                    setDragIndex(null);
                    if (prescreenId) await reorderMutation.mutateAsync();
                  }}
                  className="border border-gray-100 rounded-2xl p-4 bg-gray-50/50"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <GripVertical className="w-4 h-4 text-gray-400" />
                      <span className="text-xs font-bold text-gray-500 uppercase truncate">
                        {q.type}
                      </span>
                    </div>
                    <button
                      type="button"
                      className="text-rose-600 hover:text-rose-700"
                      onClick={() => removeQuestion(q.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="mt-3 space-y-2">
                    <Input
                      value={q.title}
                      onChange={(e) => updateQuestion(q.id, { title: e.target.value })}
                      className="text-gray-900 placeholder:text-gray-400"
                    />
                    <Input
                      value={q.description}
                      onChange={(e) => updateQuestion(q.id, { description: e.target.value })}
                      placeholder="Question description"
                      className="text-gray-900 placeholder:text-gray-400"
                    />
                    <div className="flex items-center justify-between">
                      <label className="text-xs text-gray-600 flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={q.required}
                          onChange={(e) => updateQuestion(q.id, { required: e.target.checked })}
                        />
                        Required
                      </label>
                    </div>
                    {isOptionType(q.type) && (
                      <div className="space-y-2 pt-1">
                        {q.options.map((option) => (
                          <div key={option.id} className="flex flex-col sm:flex-row gap-2">
                            <Input
                              value={option.label}
                              onChange={(e) =>
                                updateQuestion(q.id, {
                                  options: q.options.map((item) =>
                                    item.id === option.id
                                      ? {
                                          ...item,
                                          label: e.target.value,
                                          value: e.target.value.toLowerCase().replace(/\s+/g, "_"),
                                        }
                                      : item
                                  ),
                                })
                              }
                              className="text-gray-900 placeholder:text-gray-400"
                            />
                            <button
                              type="button"
                              className="px-3 h-10 rounded-lg border border-gray-300 text-xs text-gray-900 bg-white hover:bg-gray-50 whitespace-nowrap"
                              onClick={() =>
                                updateQuestion(q.id, {
                                  options: q.options.filter((item) => item.id !== option.id),
                                })
                              }
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          className="text-xs font-bold text-brand-primary hover:text-brand-hover"
                          onClick={() =>
                            updateQuestion(q.id, {
                              options: [
                                ...q.options,
                                {
                                  id: `opt_${Math.random().toString(36).slice(2, 9)}`,
                                  label: `Option ${q.options.length + 1}`,
                                  value: `option_${q.options.length + 1}`,
                                },
                              ],
                            })
                          }
                        >
                          + Add option
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-gray-100 rounded-3xl p-5">
            <h3 className="font-black text-gray-900 mb-3">Question Types</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
              {QUESTION_TYPE_OPTIONS.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => addQuestion(item.value)}
                  className="h-10 rounded-xl border border-gray-300 bg-white text-gray-900 text-sm font-semibold text-left px-3 hover:border-brand-primary hover:text-brand-primary"
                >
                  {item.label}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-3">Drag question cards to reorder.</p>
          </div>

          {preview && (
            <div className="bg-white border border-gray-100 rounded-3xl p-5 space-y-4">
              <h3 className="font-black text-gray-900">Live Preview</h3>
              <div className="border border-gray-100 rounded-2xl p-4 max-h-[460px] overflow-y-auto">
                <h4 className="font-black text-gray-900">
                  {payload.title || "Untitled Prescreen"}
                </h4>
                {payload.description ? (
                  <p className="text-sm text-gray-500 mt-1">{payload.description}</p>
                ) : null}
                <div className="space-y-4 mt-4">
                  {questions.map((q) => (
                    <div key={q.id}>
                      <p className="text-sm font-bold text-gray-900">
                        {q.title} {q.required ? <span className="text-rose-500">*</span> : null}
                      </p>
                      {q.description ? (
                        <p className="text-xs text-gray-500 mt-1">{q.description}</p>
                      ) : null}
                      <div className="mt-2">
                        {isOptionType(q.type) ? (
                          <div className="space-y-1">
                            {q.options.map((opt) => (
                              <label
                                key={opt.id}
                                className="text-xs text-gray-600 flex items-center gap-2"
                              >
                                <input type={q.type === "radio" ? "radio" : "checkbox"} disabled />
                                {opt.label}
                              </label>
                            ))}
                          </div>
                        ) : q.type === "paragraph" ? (
                          <textarea
                            disabled
                            className="w-full rounded-lg border border-gray-200 h-16"
                          />
                        ) : (
                          <Input
                            disabled
                            placeholder={q.placeholder || "Answer"}
                            className="text-gray-900 placeholder:text-gray-400"
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
