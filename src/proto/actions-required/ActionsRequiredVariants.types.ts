import type { ActionRequiredItem } from "@/components/recruiter/RecruiterDashboard/RecruiterDashboard.types";

export interface ActionsRequiredVariantProps {
  actions: ActionRequiredItem[];
  onEditCandidate: (candidateId: number, reasonLabel?: string) => void;
  onDismissAction: (actionId: string) => void;
}
