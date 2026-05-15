/** Normalized API error payload — extend when backend contract is fixed */
export interface ApiErrorBody {
  message?: string;
  code?: string;
  errors?: Record<string, string[]>;
  /** Backend may attach Joi details, nested messages, etc. */
  details?: unknown;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}
