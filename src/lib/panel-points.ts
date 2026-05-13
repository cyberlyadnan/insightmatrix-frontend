/** Align with backend `pointsFromPayout` for member UI */
export function panelPointsFromPayout(payoutToUser: number | null | undefined): number {
  const n = Number(payoutToUser);
  if (!Number.isFinite(n) || n <= 0) return 100;
  return Math.max(50, Math.round(n * 100));
}
