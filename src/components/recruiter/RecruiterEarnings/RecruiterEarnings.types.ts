import type { CandidateItem } from "@/proto/candidate-cards/data";

/**
 * Commission models supported by SuperHire (PRD §1, §3.2):
 * - shortlist: Recruiter earns commission when employer shortlists the candidate
 * - closure: Recruiter earns commission after candidate joins and completes 1 month
 */
export type EarningsCommissionModel = "shortlist" | "closure";

/**
 * Dimension 1 — Earning eligibility status (PRD §3.4):
 * Tracks whether the submission has met its commission earning condition.
 */
export type EarningEligibilityStatus = "potential" | "earned" | "ineligible";

/**
 * Dimension 2 — Payment status (PRD §3.4):
 * Tracks disbursement lifecycle independently from earning eligibility.
 * Never combined into a single status badge.
 */
export type CommissionPaymentStatus =
  | "not-payable"
  | "pending"
  | "processing"
  | "paid"
  | "failed";

/**
 * Payout batch status (PRD §8.7, §11.2)
 */
export type PayoutRecordStatus =
  | "scheduled"
  | "processing"
  | "paid"
  | "failed"
  | "reversed";

export type EarningsDateRangePreset =
  | "this-month"
  | "last-month"
  | "this-year"
  | "all-time"
  | "custom";

export type ChartGranularity = "monthly" | "quarterly";

export interface CommissionMilestone {
  id: string;
  label: string;
  dateLabel: string;
  state: "completed" | "current" | "upcoming" | "ineligible";
  isEarningTrigger?: boolean;
  note?: string;
}

/**
 * Individual candidate-job submission commission record (PRD §11.1).
 * Amounts are stored as integer minor/whole INR units (precision-safe, no floats).
 */
export interface CommissionRecord {
  id: string;
  submissionId: number;
  recruiterId: string;
  candidateId: number;
  personId: string;
  candidateName: string;
  initials: string;
  jobId: number;
  roleTitle: string;
  employerId: string;
  employer: string;
  domain: string;
  commissionModel: EarningsCommissionModel;
  /** Integer INR amount (precision-safe) */
  commissionAmount: number;
  currency: "INR";
  earningConditionSummary: string;
  earningStatus: EarningEligibilityStatus;
  paymentStatus: CommissionPaymentStatus;
  /** Current hiring stage in Track for context without duplicating full pipeline */
  hiringStageLabel: string;
  /** Plain-language explanation of why commission is earned, potential, or ineligible */
  statusExplanation: string;
  /** ISO YYYY-MM-DD dates for accurate timezone-consistent filtering & chart grouping */
  submittedDateIso: string;
  submittedDateLabel: string;
  shortlistedDateIso?: string;
  shortlistedDateLabel?: string;
  joiningDateIso?: string;
  joiningDateLabel?: string;
  oneMonthCompletionDateIso?: string;
  oneMonthCompletionDateLabel?: string;
  oneMonthVerified?: boolean;
  /** Date the earning condition was satisfied (basis for Earnings over time chart — PRD ER-022) */
  earnedDateIso?: string;
  earnedDateLabel?: string;
  updatedDateIso: string;
  updatedDateLabel: string;
  updatedRelativeLabel: string;
  /** Associated payout ID when assigned to a scheduled or completed payout */
  payoutId?: string;
  payoutReference?: string;
  paidDateIso?: string;
  paidDateLabel?: string;
  transactionReference?: string;
  milestones: CommissionMilestone[];
}

/**
 * Payout disbursement record (PRD §11.2).
 * Reconciles 1:1 with the sum of its included commission entries + explicit adjustments.
 */
export interface PayoutRecord {
  id: string;
  recruiterId: string;
  reference: string;
  /** Integer INR amount */
  amount: number;
  currency: "INR";
  status: PayoutRecordStatus;
  scheduledDateIso?: string;
  scheduledDateLabel?: string;
  initiatedDateIso?: string;
  initiatedDateLabel?: string;
  paidDateIso?: string;
  paidDateLabel?: string;
  paidDateTimeLabel?: string;
  paymentMethod?: string;
  transactionReference?: string;
  includedCommissionIds: string[];
  adjustmentAmount: number;
  adjustmentNote?: string;
  statusNote?: string;
}

export interface ChartBucket {
  key: string;
  label: string;
  shortLabel: string;
  earnedAmount: number;
  earnedCount: number;
}

export interface ModelBreakdownSummary {
  model: EarningsCommissionModel;
  label: string;
  conditionText: string;
  earnedAmount: number;
  potentialAmount: number;
  earnedCount: number;
  potentialCount: number;
  footnote?: string;
}

export interface EarningsNavigationPreset {
  earningStatus?: "all" | EarningEligibilityStatus;
  paymentStatus?: CommissionPaymentStatus[];
  model?: EarningsCommissionModel | "all";
  openPayoutId?: string | null;
  openCommissionId?: string | null;
}

export interface RecruiterEarningsProps {
  liveCandidates?: CandidateItem[];
  initialPreset?: EarningsNavigationPreset | null;
  onConsumePreset?: () => void;
  onNavigateToCandidate: (candidateId: number) => void;
  onNavigateToJob?: (jobId: number) => void;
}
