import { format as formatDateFns } from "date-fns";

export function formatDate(value: Date | number | string, pattern = "PP"): string {
  const d = typeof value === "string" ? new Date(value) : value;
  return formatDateFns(d, pattern);
}

/** Consistent CRM currency — INR by default (₹1,250.00). */
export function formatCurrency(amount: number, currency = "INR", locale = "en-IN"): string {
  const n = Number.isFinite(amount) ? amount : 0;
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
}

/** Percentages with one decimal place (83.4%). */
export function formatPercent(value: number, digits = 1): string {
  const n = Number.isFinite(value) ? value : 0;
  return `${n.toFixed(digits)}%`;
}

/** Whole/decimal numbers with thousands separators (12,450). */
export function formatNumber(value: number, digits = 0): string {
  const n = Number.isFinite(value) ? value : 0;
  return new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(n);
}
