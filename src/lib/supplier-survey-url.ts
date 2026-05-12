/** Partner survey URL: `pid` query = company project id (callback correlation). */
export function extractSupplierProjectPidFromUrl(urlString: string): string | null {
  const raw = urlString?.trim();
  if (!raw) return null;
  try {
    const u = new URL(raw);
    const v = u.searchParams.get("pid");
    if (v == null) return null;
    const t = v.trim();
    return t.length ? t : null;
  } catch {
    return null;
  }
}
