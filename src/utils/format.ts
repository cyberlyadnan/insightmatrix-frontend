import { format as formatDateFns } from "date-fns";

export function formatDate(value: Date | number | string, pattern = "PP"): string {
  const d = typeof value === "string" ? new Date(value) : value;
  return formatDateFns(d, pattern);
}

export function formatCurrency(amount: number, currency = "USD", locale = "en-US"): string {
  return new Intl.NumberFormat(locale, { style: "currency", currency }).format(amount);
}
