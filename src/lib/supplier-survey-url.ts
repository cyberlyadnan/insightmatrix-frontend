/**
 * Supplier entry URL helpers.
 *
 * Two different "pid" concepts (common with Epitome / ERS-style links):
 * - Callback project id (e.g. ERS41608) — identifies the study on callbacks; often NOT in the URL.
 * - Supplier respondent param (often also named pid on the URL) — we fill with IMX… on redirect.
 *
 * Internal share links use a separate key (default toid) — never confuse with callback project id.
 */

export type SupplierUrlHints = {
  /** Non-empty project id found in URL query (rare — many suppliers omit it) */
  supplierProjectPid: string | null;
  /** Best-guess query key for respondent token on supplier redirect */
  trackingParameterName: string | null;
};

/** Callback / project id from supplier URL when present and non-empty */
export function extractSupplierProjectPidFromUrl(urlString: string): string | null {
  const raw = urlString?.trim();
  if (!raw) return null;
  try {
    const u = new URL(raw);
    for (const key of ["pid", "project_id", "projectid", "prj", "study_id"]) {
      const v = u.searchParams.get(key)?.trim();
      if (v) return v;
    }
    return null;
  } catch {
    return null;
  }
}

/** Infer supplier redirect + callback hints from a pasted entry URL */
export function inferSupplierUrlHints(urlString: string): SupplierUrlHints {
  const raw = urlString?.trim();
  if (!raw) {
    return { supplierProjectPid: null, trackingParameterName: null };
  }

  try {
    const u = new URL(raw);
    const keys = [...u.searchParams.keys()].map((k) => k.toLowerCase());

    const supplierProjectPid = extractSupplierProjectPidFromUrl(raw);

    let trackingParameterName: string | null = null;
    if (keys.includes("toid")) trackingParameterName = "toid";
    else if (keys.includes("uid")) trackingParameterName = "uid";
    else if (keys.includes("subid")) trackingParameterName = "subid";
    else if (keys.includes("rid")) trackingParameterName = "rid";
    else if (keys.includes("pid")) trackingParameterName = "pid";
    else if (keys.includes("gid") && keys.includes("pid")) trackingParameterName = "pid";

    return { supplierProjectPid, trackingParameterName };
  } catch {
    return { supplierProjectPid: null, trackingParameterName: null };
  }
}

/** Apply URL hints to form fields without wiping manually entered project ids */
export function applySupplierUrlHintsToForm(
  urlString: string,
  setValue: (name: string, value: string) => void,
  getValue: (name: string) => string
): void {
  const hints = inferSupplierUrlHints(urlString);
  if (hints.supplierProjectPid) {
    setValue("supplierProjectPid", hints.supplierProjectPid);
  }
  if (hints.trackingParameterName) {
    const current = String(getValue("trackingParameterName") ?? "").trim();
    if (!current || current === "toid") {
      setValue("trackingParameterName", hints.trackingParameterName);
    }
  }
}
