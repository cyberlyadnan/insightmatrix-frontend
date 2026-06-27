/**
 * Supplier entry URL parsing (mirrors backend supplier-survey-url.ts).
 */

const PLACEHOLDER_VALUES = new Set([
  "",
  "xxxxx",
  "xxxx",
  "xxx",
  "x",
  "uid",
  "subid",
  "token",
  "test",
  "your_id",
  "yourid",
  "respondent_id",
  "respondentid",
  "participant_id",
  "participantid",
  "insert_id",
  "replace_me",
  "placeholder",
]);

const STRUCTURAL_PARAM_KEYS = new Set([
  "gid",
  "vid",
  "prsid",
  "hash",
  "survey_id",
  "surveyid",
  "id",
  "prj",
  "study_id",
  "studyid",
  "c",
  "campaign",
  "affiliate",
  "source",
]);

const TRACKING_KEY_PRIORITY = [
  "toid",
  "uid",
  "subid",
  "rid",
  "txn_id",
  "transaction_id",
  "ssn",
  "token",
  "respondent_id",
  "participant_id",
  "pid",
  "PID",
] as const;

const PROJECT_ID_KEY_PRIORITY = [
  "pid",
  "PID",
  "project_id",
  "projectid",
  "prj",
  "study_id",
  "studyid",
  "source",
] as const;

export type SupplierUrlHints = {
  normalizedUrl: string;
  supplierProjectPid: string | null;
  trackingParameterName: string | null;
};

function isRespondentPlaceholder(value: string): boolean {
  const t = value.trim();
  if (!t) return true;
  const lower = t.toLowerCase();
  if (PLACEHOLDER_VALUES.has(lower)) return true;
  if (/^x{3,}$/i.test(t)) return true;
  if (/^\[.+\]$/.test(t) || /^\{.+\}$/.test(t)) return true;
  return false;
}

export function ensureAbsoluteSurveyUrl(urlString: string): string {
  const raw = urlString.trim();
  if (!raw) return raw;
  if (/^https?:\/\//i.test(raw)) return raw;
  return `https://${raw}`;
}

export function normalizeMalformedSupplierUrl(urlString: string): string {
  const withScheme = ensureAbsoluteSurveyUrl(urlString);
  const qIndex = withScheme.indexOf("?");
  if (qIndex === -1) return withScheme;

  const base = withScheme.slice(0, qIndex + 1);
  let query = withScheme.slice(qIndex + 1);

  query = query.replace(/(^|&)([a-zA-Z][a-zA-Z0-9_]*)-([^&=]+)/g, "$1$2=$3");
  query = query.replace(/(^|&)([a-zA-Z][a-zA-Z0-9_]*)-(?=&|$)/g, "$1$2=");

  return base + query;
}

function listQueryParams(url: URL): { key: string; value: string }[] {
  const out: { key: string; value: string }[] = [];
  for (const key of url.searchParams.keys()) {
    out.push({ key, value: url.searchParams.get(key) ?? "" });
  }
  return out;
}

function findParamKey(entries: { key: string }[], name: string): string | null {
  const want = name.toLowerCase();
  const hit = entries.find((e) => e.key.toLowerCase() === want);
  return hit?.key ?? null;
}

export function inferTrackingParameterFromUrl(urlString: string): string | null {
  const normalized = normalizeMalformedSupplierUrl(urlString);
  try {
    const url = new URL(normalized);
    const entries = listQueryParams(url);
    if (entries.length === 0) return "toid";

    const placeholderKeys = entries
      .filter(
        ({ key, value }) =>
          !STRUCTURAL_PARAM_KEYS.has(key.toLowerCase()) && isRespondentPlaceholder(value)
      )
      .map(({ key }) => key);

    for (const preferred of TRACKING_KEY_PRIORITY) {
      const found = placeholderKeys.find((k) => k.toLowerCase() === preferred.toLowerCase());
      if (found) return found;
    }

    if (placeholderKeys.length > 0) return placeholderKeys[0];

    const toidKey = findParamKey(entries, "toid");
    if (toidKey) return toidKey;

    const pidKey = findParamKey(entries, "pid");
    if (pidKey) return pidKey;

    return "toid";
  } catch {
    return null;
  }
}

export function extractSupplierProjectPidFromUrl(urlString: string): string | null {
  const normalized = normalizeMalformedSupplierUrl(urlString);
  try {
    const url = new URL(normalized);
    const trackingKey = (inferTrackingParameterFromUrl(normalized) ?? "").toLowerCase();

    for (const want of PROJECT_ID_KEY_PRIORITY) {
      for (const key of url.searchParams.keys()) {
        if (key.toLowerCase() !== want.toLowerCase()) continue;
        if (key.toLowerCase() === trackingKey) continue;

        const v = url.searchParams.get(key)?.trim();
        if (!v || isRespondentPlaceholder(v)) continue;
        return v.slice(0, 200);
      }
    }
    return null;
  } catch {
    return null;
  }
}

export function inferSupplierUrlHints(urlString: string): SupplierUrlHints {
  const normalized = normalizeMalformedSupplierUrl(urlString);
  return {
    normalizedUrl: normalized,
    supplierProjectPid: extractSupplierProjectPidFromUrl(normalized),
    trackingParameterName: inferTrackingParameterFromUrl(normalized),
  };
}

/** Apply URL hints to form fields without wiping manually entered values */
export function applySupplierUrlHintsToForm(
  urlString: string,
  setValue: (name: string, value: string) => void,
  getValue: (name: string) => string
): void {
  const hints = inferSupplierUrlHints(urlString);
  if (hints.normalizedUrl && hints.normalizedUrl !== urlString.trim()) {
    setValue("externalSurveyUrl", hints.normalizedUrl);
  }
  if (hints.supplierProjectPid) {
    const currentPid = String(getValue("supplierProjectPid") ?? "").trim();
    if (!currentPid) {
      setValue("supplierProjectPid", hints.supplierProjectPid);
    }
  }
  if (hints.trackingParameterName) {
    const current = String(getValue("trackingParameterName") ?? "").trim();
    if (!current || current === "toid") {
      setValue("trackingParameterName", hints.trackingParameterName);
    }
  }
}

/** Preview redirect URL with a sample token (admin form helper) */
export function previewSupplierRedirectUrl(
  externalSurveyUrl: string,
  trackingParameterName: string,
  sampleToken = "IMXSAMPLE01"
): string | null {
  const normalized = normalizeMalformedSupplierUrl(externalSurveyUrl);
  if (!normalized) return null;
  try {
    const url = new URL(normalized);
    const key = (trackingParameterName || "toid").trim() || "toid";
    let targetKey = key;
    for (const k of url.searchParams.keys()) {
      if (k.toLowerCase() === key.toLowerCase()) {
        targetKey = k;
        break;
      }
    }
    url.searchParams.set(targetKey, sampleToken);
    return url.toString();
  } catch {
    return null;
  }
}
