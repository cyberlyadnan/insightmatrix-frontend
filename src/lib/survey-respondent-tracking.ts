/** Vendor toid or internal-team id from the share / routing link */
export function resolveTrackingParticipantId(row: {
  trackingParticipantId?: string;
  vendorRespondentToid?: string;
}): string {
  return (row.trackingParticipantId ?? row.vendorRespondentToid ?? "").trim();
}
