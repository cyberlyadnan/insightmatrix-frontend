import { ROUTES } from "@/constants/routes";
import { buildSiteUrl } from "@/lib/site-url";

const PLACEHOLDER_RESPONDENT_ID = "RESPONDENT_ID";

/** Public panel landing URL — im_attempt is auto-created when the link is opened */
export function buildPanelSurveyShareLink(surveyId: string, siteBase?: string): string {
  const path = ROUTES.surveyStart(surveyId);
  return buildSiteUrl(path, siteBase);
}

/** Copy template — replace RESPONDENT_ID with each respondent's id (toid, pid, gid, etc.) */
export function buildPanelSurveyShareLinkExample(
  surveyId: string,
  participantQueryParam = "toid",
  siteBase?: string
): string {
  const base = buildPanelSurveyShareLink(surveyId, siteBase);
  const key = String(participantQueryParam || "pid").trim() || "pid";
  return `${base}?${encodeURIComponent(key)}=${PLACEHOLDER_RESPONDENT_ID}`;
}
