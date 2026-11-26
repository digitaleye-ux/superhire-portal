import type { CandidateStatus } from "@/components/recruiter/CandidateCard";
import type { CandidateItem } from "@/proto/candidate-cards/data";
import type { EarningsNavigationPreset } from "@/components/recruiter/RecruiterEarnings";

/**
 * Six active pipeline stages defined in Section 02 & Section 5B.
 * Exceptional/terminal statuses ("on-hold", "unsuccessful") are kept strictly separate.
 */
export type ActivePipelineStageId =
  | "submitted"
  | "profile-approved"
  | "shortlisted"
  | "interview"
  | "offer"
  | "joined";

export type ExceptionalStageId = "on-hold" | "unsuccessful";

export type SubmissionStageId = ActivePipelineStageId | ExceptionalStageId;

export type CommissionModel = "shortlist" | "closure";

/**
 * Financial categories from Section 03:
 * - earned: Earning condition has been met (equals payment-pending + paid)
 * - potential: Candidate is progressing, but earning condition has not yet been met
 * - none: Unsuccessful or closed before earning condition
 */
export type EarningEligibility = "earned" | "potential" | "none";

export type PayoutStatus = "paid" | "payment-pending" | "not-applicable";

export type EarningsFilterCategory =
  | "all"
  | "earned"
  | "payment-pending"
  | "paid"
  | "potential";

export interface SubmissionRecord {
  id: number;
  /** Maps to CandidateItem.id for opening the Candidate Tracking side panel */
  candidateId: number;
  /** Unique person identifier to distinguish Unique Candidates vs Submissions */
  personId: string;
  candidateName: string;
  initials: string;
  jobId: number;
  roleTitle: string;
  company: string;
  domain: string;
  stage: SubmissionStageId;
  trackStatus: CandidateStatus;
  stageContext: string;
  lastUpdatedLabel: string;
  lastUpdatedMinutesAgo: number;
  submittedLabel: string;
  commissionModel: CommissionModel;
  commissionAmount: number;
  commissionFormatted: string;
  /** For per-closure submissions that reached Joined */
  joinedDate?: string;
  oneMonthCompletionDate?: string;
  oneMonthCompleted?: boolean;
  daysIntoRetention?: number;
  earningEligibility: EarningEligibility;
  payoutStatus: PayoutStatus;
  paidDate?: string;
  expectedPayoutDate?: string;
  earningConditionNote: string;
}

export interface ActiveRoleSummary {
  jobId: number;
  roleTitle: string;
  company: string;
  domain: string;
  commissionModel: CommissionModel;
  commissionFormatted: string;
  totalSubmitted: number;
  progressSummary: string;
  stageBreakdown: {
    submitted: number;
    approved: number;
    shortlisted: number;
    interview: number;
    offer: number;
    joined: number;
    "on-hold"?: number;
    unsuccessful?: number;
  };
  lastActivityLabel: string;
}

export interface ActionRequiredItem {
  id: string;
  submissionId: number;
  candidateId: number;
  candidateName: string;
  initials: string;
  roleTitle: string;
  company: string;
  domain: string;
  issueType:
    | "missing-details"
    | "corrected-resume"
    | "superhire-request"
    | "submission-correction";
  badgeLabel: string;
  title: string;
  description: string;
  ctaLabel: string;
  requestedAt: string;
}

export interface PipelineStageMeta {
  id: ActivePipelineStageId;
  step: number;
  label: string;
  shortLabel: string;
  trackStatus: CandidateStatus;
  description: string;
}

export interface DashboardSnapshot {
  recruiterName: string;
  submissions: SubmissionRecord[];
  uniqueCandidateCount: number;
  totalSubmissionsCount: number;
  reviewedSubmissionsCount: number;
  shortlistRate: number;
  employerShortlistedCount: number;
  inHiringProcessCount: number;
  pipelineCounts: Record<ActivePipelineStageId, number>;
  onHoldCount: number;
  unsuccessfulCount: number;
  earnings: {
    totalEarned: number;
    paymentPending: number;
    paid: number;
    potentialCommission: number;
    shortlistModelEarned: number;
    closureModelEarned: number;
    shortlistModelPotential: number;
    closureModelPotential: number;
    nextPayoutDate: string;
  };
  recentProgress: SubmissionRecord[];
  activeRoles: ActiveRoleSummary[];
  actionsRequired: ActionRequiredItem[];
}

export interface RecruiterDashboardProps {
  liveCandidates?: CandidateItem[];
  selectedCandidateId?: number | null;
  onNavigateToCandidates: (
    statuses?: CandidateStatus[],
    filterLabel?: string
  ) => void;
  onSelectCandidate: (
    candidateId: number,
    submission?: SubmissionRecord
  ) => void;
  onEditCandidate: (candidateId: number, reasonLabel?: string) => void;
  onSelectRole: (jobId: number) => void;
  onExploreJobs: () => void;
  onNavigateToEarnings?: (preset?: EarningsNavigationPreset) => void;
}
