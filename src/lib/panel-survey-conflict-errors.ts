import type { UseFormSetError } from "react-hook-form";

import { parseApiError } from "@/services/api/errors";
import type { PanelSurveyFormValues } from "@/validations/panel-survey.schema";

const CONFLICT_FIELD_MESSAGES: Array<{
  match: string;
  field: keyof PanelSurveyFormValues;
  message: string;
}> = [
  {
    match: "Survey code already exists",
    field: "surveyCode",
    message: "This survey code is already in use. Choose a different code.",
  },
  {
    match: "Survey name already exists",
    field: "surveyName",
    message: "This survey name is already in use. Choose a different name.",
  },
  {
    match: "External survey ID already exists",
    field: "externalSurveyId",
    message: "This external survey ID is already in use.",
  },
];

/** Map duplicate survey API errors to react-hook-form field errors. Returns true if handled. */
export function applyPanelSurveyConflictToForm(
  error: unknown,
  setError: UseFormSetError<PanelSurveyFormValues>
): boolean {
  const msg = parseApiError(error, "");
  for (const rule of CONFLICT_FIELD_MESSAGES) {
    if (msg.includes(rule.match)) {
      setError(rule.field, { type: "server", message: rule.message });
      return true;
    }
  }
  return false;
}

export function panelSurveyConflictToastMessage(error: unknown): string | null {
  const msg = parseApiError(error, "");
  for (const rule of CONFLICT_FIELD_MESSAGES) {
    if (msg.includes(rule.match)) {
      return rule.message;
    }
  }
  return null;
}
