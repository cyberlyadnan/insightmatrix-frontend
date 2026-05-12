/**
 * Participant id flow: panel sends ?pid=… (or survey-configured key) to our landing page;
 * we persist it and append it to the supplier URL under trackingParameterName for completes/callbacks.
 */

export const PARTICIPANT_STORAGE_PREFIX = "insightmatrix.surveyParticipant";

export type StoredParticipantContext = {
  surveyId: string;
  participantId: string;
  /** Query key used on our landing URL */
  participantQueryParam: string;
  /** Query key appended on the supplier survey URL */
  outboundTrackingKey: string;
  capturedAt: string;
};

export function participantStorageKey(surveyId: string): string {
  return `${PARTICIPANT_STORAGE_PREFIX}:${surveyId}`;
}

export function persistParticipantContext(entry: StoredParticipantContext): void {
  if (typeof sessionStorage === "undefined") return;
  try {
    sessionStorage.setItem(participantStorageKey(entry.surveyId), JSON.stringify(entry));
  } catch {
    // quota / private mode — redirect still works without persistence
  }
}

export function readStoredParticipantContext(surveyId: string): StoredParticipantContext | null {
  if (typeof sessionStorage === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(participantStorageKey(surveyId));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredParticipantContext;
    if (parsed && typeof parsed.participantId === "string" && parsed.surveyId === surveyId) {
      return parsed;
    }
  } catch {
    /* ignore */
  }
  return null;
}

/**
 * Reads participant id from the landing URL using the survey's configured query key first,
 * then common fallbacks so integrations stay tolerant without ignoring explicit config.
 */
export function extractParticipantIdFromSearchParams(
  searchParams: URLSearchParams,
  participantQueryParam: string
): string | null {
  const primary = (participantQueryParam || "pid").trim() || "pid";
  const keys = [primary, "pid", "participant_id", "uid", "txn_id", "rid"];
  const seen = new Set<string>();
  for (const k of keys) {
    if (seen.has(k)) continue;
    seen.add(k);
    const v = searchParams.get(k)?.trim();
    if (v) return v;
  }
  return null;
}

/**
 * Appends the participant id to the supplier entry URL using their expected tracking key.
 */
export function buildVendorEntryUrl(
  externalSurveyUrl: string,
  trackingParameterName: string,
  participantId: string
): string {
  const key = (trackingParameterName || "toid").trim();
  const url = new URL(externalSurveyUrl);
  url.searchParams.set(key, participantId);
  return url.toString();
}
