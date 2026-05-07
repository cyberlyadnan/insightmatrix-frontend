export type PrescreenStatus = "draft" | "published" | "archived";
export type PrescreenVisibility = "private" | "internal" | "public";
export type PrescreenQuestionType =
  | "short_text"
  | "paragraph"
  | "radio"
  | "checkbox"
  | "dropdown"
  | "number"
  | "email"
  | "date"
  | "yes_no";

export interface PrescreenOption {
  id: string;
  label: string;
  value: string;
}

export interface PrescreenQuestion {
  id: string;
  type: PrescreenQuestionType;
  title: string;
  description: string;
  helperText: string;
  required: boolean;
  placeholder: string;
  defaultValue: string | number | boolean | string[] | null;
  options: PrescreenOption[];
  validation: {
    minLength?: number | null;
    maxLength?: number | null;
    minSelections?: number | null;
    maxSelections?: number | null;
    minValue?: number | null;
    maxValue?: number | null;
    pattern?: string | null;
  };
  randomizeOptions: boolean;
  order: number;
}

export interface PrescreenCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
}

export interface PrescreenForm {
  id: string;
  title: string;
  slug: string;
  description: string;
  status: PrescreenStatus;
  category: PrescreenCategory | null;
  tags: string[];
  targetAudience: {
    ageGroups: string[];
    countries: string[];
    industries: string[];
    professions: string[];
    vendors: string[];
    customSegments: string[];
  };
  visibility: PrescreenVisibility;
  settings: {
    collectEmail: boolean;
    allowEditAfterSubmit: boolean;
    showProgressBar: boolean;
  };
  questions: PrescreenQuestion[];
  createdAt?: string;
  updatedAt?: string;
}
