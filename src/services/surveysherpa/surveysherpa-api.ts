import { apiClient } from "@/services/api";

export type SurveySherpaLanguage = {
  id: number;
  country_name?: string;
  country_code?: string;
  language_name?: string;
  language_code?: string;
  language?: string;
  name?: string;
};

export type SurveySherpaSurveyQualification = {
  questionKey: string;
  questionText: string;
  questionType: string;
  options: string[];
};

export type SurveySherpaRemoteSurvey = {
  survey_id: number;
  survey_name: string;
  description?: string;
  lang_id: number;
  complete_required: number;
  loi: number;
  ir: number;
  cpi: number;
  url: string;
  created_at?: string;
  modifiedDate?: string;
  isImported?: boolean;
  localSurveyId?: string;
  localStatus?: string;
  localRemainingQuota?: number;
};

export type SurveySherpaStatusResponse = {
  connected: boolean;
  validKey: boolean;
  message: string;
  languageCount: number;
  languages: SurveySherpaLanguage[];
  baseUrl: string;
  hasKeyConfigured: boolean;
};

export type SurveySherpaSurveyDetails = SurveySherpaRemoteSurvey & {
  qualifications: SurveySherpaSurveyQualification[];
};

export type SurveySherpaStats = {
  survey_id: number;
  total_entrance: number;
  total_completes: number;
};

export const surveySherpaApi = {
  /**
   * Check connection status and test API key
   */
  async getStatus(): Promise<SurveySherpaStatusResponse> {
    const res = await apiClient.get<{ data: SurveySherpaStatusResponse }>("/surveysherpa/status");
    return res.data.data;
  },

  /**
   * Update runtime credentials
   */
  async updateCredentials(
    accessKey: string,
    baseUrl?: string
  ): Promise<SurveySherpaStatusResponse> {
    const res = await apiClient.post<{ data: SurveySherpaStatusResponse }>(
      "/surveysherpa/credentials",
      {
        accessKey,
        baseUrl,
      }
    );
    return res.data.data;
  },

  /**
   * Get supported languages
   */
  async getDefinitions(): Promise<SurveySherpaLanguage[]> {
    const res = await apiClient.get<{ data: SurveySherpaLanguage[] }>("/surveysherpa/definitions");
    return res.data.data;
  },

  /**
   * Get remote surveys with local import status
   */
  async getRemoteSurveys(): Promise<{
    surveys: SurveySherpaRemoteSurvey[];
    languages: { id: number; name: string }[];
    requiresValidKey?: boolean;
  }> {
    const res = await apiClient.get<{
      data: {
        surveys: SurveySherpaRemoteSurvey[];
        languages: { id: number; name: string }[];
        requiresValidKey?: boolean;
      };
    }>("/surveysherpa/surveys");
    return res.data.data;
  },

  /**
   * Get specific survey details + screener qualifications
   */
  async getSurveyDetails(surveyId: number): Promise<SurveySherpaSurveyDetails> {
    const res = await apiClient.get<{ data: SurveySherpaSurveyDetails }>(
      `/surveysherpa/surveys/${surveyId}`
    );
    return res.data.data;
  },

  /**
   * Get live stats
   */
  async getSurveyStats(
    surveyId: number
  ): Promise<{ stats: SurveySherpaStats | null; updated: boolean }> {
    const res = await apiClient.get<{
      data: { stats: SurveySherpaStats | null; updated: boolean };
    }>(`/surveysherpa/surveys/${surveyId}/stats`);
    return res.data.data;
  },

  /**
   * Import single survey into InsightMatrix PanelSurvey
   */
  async importSurvey(
    surveyId: number,
    options?: { autoActivate?: boolean; defaultStatus?: string }
  ): Promise<{ survey: unknown; isNew: boolean }> {
    const res = await apiClient.post<{ data: { survey: unknown; isNew: boolean } }>(
      `/surveysherpa/surveys/${surveyId}/import`,
      options
    );
    return res.data.data;
  },

  /**
   * Trigger full sync of all surveys
   */
  async syncAll(options?: {
    autoActivate?: boolean;
    syncQualifications?: boolean;
    defaultStatus?: string;
  }): Promise<{
    totalRemote: number;
    created: number;
    updated: number;
    failed: number;
    errors: string[];
  }> {
    const res = await apiClient.post<{
      data: {
        totalRemote: number;
        created: number;
        updated: number;
        failed: number;
        errors: string[];
      };
    }>("/surveysherpa/sync", options);
    return res.data.data;
  },
};
