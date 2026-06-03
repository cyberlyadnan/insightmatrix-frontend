import type { PrescreenForm, PrescreenQuestion } from "@/types/prescreen";

function normalizeQuestion(raw: unknown): PrescreenQuestion | null {
  if (!raw || typeof raw !== "object") return null;
  const q = raw as Record<string, unknown>;
  const id = String(q.id ?? "").trim();
  if (!id) return null;

  const options = Array.isArray(q.options)
    ? q.options
        .map((opt) => {
          if (!opt || typeof opt !== "object") return null;
          const o = opt as Record<string, unknown>;
          const optId = String(o.id ?? o.value ?? "").trim();
          const value = String(o.value ?? optId).trim();
          const label = String(o.label ?? value).trim();
          if (!value) return null;
          return { id: optId || value, label, value };
        })
        .filter((o): o is NonNullable<typeof o> => o !== null)
    : [];

  const validation =
    q.validation && typeof q.validation === "object"
      ? (q.validation as PrescreenQuestion["validation"])
      : {};

  return {
    id,
    type: (q.type as PrescreenQuestion["type"]) ?? "short_text",
    title: String(q.title ?? "Question"),
    description: String(q.description ?? ""),
    helperText: String(q.helperText ?? ""),
    required: Boolean(q.required),
    placeholder: String(q.placeholder ?? ""),
    defaultValue: (q.defaultValue ?? null) as PrescreenQuestion["defaultValue"],
    options,
    validation,
    randomizeOptions: Boolean(q.randomizeOptions),
    order: typeof q.order === "number" ? q.order : 0,
  };
}

/** Coerce API prescreen payloads so UI never crashes on missing nested fields. */
export function normalizePrescreenForm(raw: unknown): PrescreenForm | null {
  if (!raw || typeof raw !== "object") return null;
  const plain = raw as Record<string, unknown>;
  const id = String(plain.id ?? plain._id ?? "").trim();
  if (!id) return null;

  const questions = Array.isArray(plain.questions)
    ? plain.questions
        .map(normalizeQuestion)
        .filter((q): q is PrescreenQuestion => q !== null)
        .sort((a, b) => a.order - b.order)
    : [];

  return {
    id,
    title: String(plain.title ?? ""),
    slug: String(plain.slug ?? ""),
    description: String(plain.description ?? ""),
    status: (plain.status as PrescreenForm["status"]) ?? "published",
    isRequiredForPanel: Boolean(plain.isRequiredForPanel),
    category: (plain.category as PrescreenForm["category"]) ?? null,
    tags: Array.isArray(plain.tags) ? (plain.tags as string[]) : [],
    targetAudience: (plain.targetAudience as PrescreenForm["targetAudience"]) ?? {
      ageGroups: [],
      countries: [],
      industries: [],
      professions: [],
      vendors: [],
      customSegments: [],
    },
    visibility: (plain.visibility as PrescreenForm["visibility"]) ?? "internal",
    settings: (plain.settings as PrescreenForm["settings"]) ?? {
      collectEmail: false,
      allowEditAfterSubmit: false,
      showProgressBar: false,
    },
    questions,
  };
}
