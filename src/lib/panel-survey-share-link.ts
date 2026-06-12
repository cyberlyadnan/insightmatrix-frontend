import { ROUTES } from "@/constants/routes";
import { buildSiteUrl } from "@/lib/site-url";

/** Public panel landing URL — im_attempt is auto-created when the link is opened */
export function buildPanelSurveyShareLink(surveyId: string, siteBase?: string): string {
  const path = ROUTES.surveyStart(surveyId);
  return buildSiteUrl(path, siteBase);
}

/** @deprecated Same as buildPanelSurveyShareLink — kept for API field compatibility */
export function buildPanelSurveyShareLinkExample(surveyId: string, siteBase?: string): string {
  return buildPanelSurveyShareLink(surveyId, siteBase);
}
