/** Align with backend `panel-survey-routing.ts` */
export const PANEL_ROUTING_EVENT_TYPES = [
  "complete",
  "terminate",
  "screenout",
  "quota_full",
  "quality_reject",
  "duplicate",
] as const;

export type PanelRoutingEventType = (typeof PANEL_ROUTING_EVENT_TYPES)[number];

export const PANEL_ROUTING_EVENT_LABELS: Record<PanelRoutingEventType, string> = {
  complete: "Complete",
  terminate: "Terminated",
  screenout: "Screen-out",
  quota_full: "Quota full",
  quality_reject: "Quality reject",
  duplicate: "Duplicate",
};
