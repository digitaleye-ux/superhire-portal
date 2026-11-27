import type { CandidateItem } from "@/proto/candidate-cards/data";
import type {
  ChartBucket,
  ChartGranularity,
  CommissionRecord,
  EarningsCommissionModel,
  EarningsDateRangePreset,
  ModelBreakdownSummary,
  PayoutRecord,
} from "./RecruiterEarnings.types";

/** Reference calendar anchor for consistent IST reporting (Nov 2026) */
export const CURRENT_MONTH_PREFIX = "2026-11";
export const LAST_MONTH_PREFIX = "2026-10";
export const CURRENT_YEAR_PREFIX = "2026";

export function formatInr(amount: number): string {
  if (amount === 0) return "₹0";
  const sign = amount < 0 ? "-" : "";
  return `${sign}₹${Math.abs(Math.round(amount)).toLocaleString("en-IN")}`;
}

export function formatCompactInrAxis(amount: number): string {
  if (amount === 0) return "₹0";
  if (amount >= 100000) {
    const lakhs = amount / 100000;
    return `₹${Number.isInteger(lakhs) ? lakhs : lakhs.toFixed(1)}L`;
  }
  if (amount >= 1000) {
    const thousands = amount / 1000;
    return `₹${Number.isInteger(thousands) ? thousands : thousands.toFixed(1)}k`;
  }
  return `₹${amount}`;
}

export function companyLogoUrl(domain: string): string {
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
}

/**
 * Canonical candidate-job commission ledger records.
 * Reconciles 1:1 with RecruiterDashboard (Overview) and Track Candidates:
 * - Lifetime Earned: ₹61,000 (₹57,000 Paid + ₹4,000 Pending)
 * - Potential: ₹2,69,300 (₹6,300 Shortlist + ₹2,63,000 Closure)
 * - Ineligible: 1 record (₹2,000)
 */
export const BASE_COMMISSION_RECORDS: CommissionRecord[] = [
  {
    id: "CM-101",
    submissionId: 101,
    recruiterId: "rec-aisha-01",
    candidateId: 1,
    personId: "person-rohan",
    candidateName: "Rohan Mehta",
    initials: "RM",
    jobId: 1,
    roleTitle: "Senior Frontend Engineer",
    employerId: "emp-google",
    employer: "Google",
    domain: "google.com",
    commissionModel: "shortlist",
    commissionAmount: 2000,
    currency: "INR",
    earningConditionSummary:
      "Employer shortlists the submitted candidate after SuperHire vetting.",
    earningStatus: "earned",
    paymentStatus: "pending",
    hiringStageLabel: "Interview",
    statusExplanation:
      "Google shortlisted Rohan on 19 Nov 2026, satisfying the Earn per shortlist condition. Your ₹2,000 commission is earned and queued for the confirmed 28 Nov 2026 payout.",
    submittedDateIso: "2026-11-16",
    submittedDateLabel: "16 Nov 2026",
    shortlistedDateIso: "2026-11-19",
    shortlistedDateLabel: "19 Nov 2026",
    earnedDateIso: "2026-11-19",
    earnedDateLabel: "19 Nov 2026",
    updatedDateIso: "2026-11-24",
    updatedDateLabel: "24 Nov 2026",
    updatedRelativeLabel: "2h ago",
    payoutId: "po-3",
    payoutReference: "PO-2026-1128",
    milestones: [
      {
        id: "m1",
        label: "Submitted to SuperHire",
        dateLabel: "16 Nov 2026",
        state: "completed",
      },
      {
        id: "m2",
        label: "Employer shortlist confirmed",
        dateLabel: "19 Nov 2026",
        state: "completed",
        isEarningTrigger: true,
        note: "Earning condition met — ₹2,000 unlocked",
      },
      {
        id: "m3",
        label: "Scheduled payout disbursement",
        dateLabel: "Expected 28 Nov 2026",
        state: "current",
        note: "Assigned to payout batch PO-2026-1128",
      },
    ],
  },
  {
    id: "CM-102",
    submissionId: 102,
    recruiterId: "rec-aisha-01",
    candidateId: 2,
    personId: "person-priya",
    candidateName: "Priya Nair",
    initials: "PN",
    jobId: 2,
    roleTitle: "Senior Backend Engineer, Payments Platform",
    employerId: "emp-razorpay",
    employer: "Razorpay",
    domain: "razorpay.com",
    commissionModel: "shortlist",
    commissionAmount: 2000,
    currency: "INR",
    earningConditionSummary:
      "Employer shortlists the submitted candidate after SuperHire vetting.",
    earningStatus: "earned",
    paymentStatus: "pending",
    hiringStageLabel: "Shortlisted",
    statusExplanation:
      "Razorpay shortlisted Priya on 22 Nov 2026, satisfying the Earn per shortlist condition. Your ₹2,000 commission is earned and included in the 28 Nov 2026 payout.",
    submittedDateIso: "2026-11-19",
    submittedDateLabel: "19 Nov 2026",
    shortlistedDateIso: "2026-11-22",
    shortlistedDateLabel: "22 Nov 2026",
    earnedDateIso: "2026-11-22",
    earnedDateLabel: "22 Nov 2026",
    updatedDateIso: "2026-11-24",
    updatedDateLabel: "24 Nov 2026",
    updatedRelativeLabel: "5h ago",
    payoutId: "po-3",
    payoutReference: "PO-2026-1128",
    milestones: [
      {
        id: "m1",
        label: "Submitted to SuperHire",
        dateLabel: "19 Nov 2026",
        state: "completed",
      },
      {
        id: "m2",
        label: "Employer shortlist confirmed",
        dateLabel: "22 Nov 2026",
        state: "completed",
        isEarningTrigger: true,
        note: "Earning condition met — ₹2,000 unlocked",
      },
      {
        id: "m3",
        label: "Scheduled payout disbursement",
        dateLabel: "Expected 28 Nov 2026",
        state: "current",
        note: "Assigned to payout batch PO-2026-1128",
      },
    ],
  },
  {
    id: "CM-111",
    submissionId: 111,
    recruiterId: "rec-aisha-01",
    candidateId: 2,
    personId: "person-priya",
    candidateName: "Priya Nair",
    initials: "PN",
    jobId: 13,
    roleTitle: "Machine Learning Engineer, Recommendations",
    employerId: "emp-meesho",
    employer: "Meesho",
    domain: "meesho.com",
    commissionModel: "shortlist",
    commissionAmount: 2000,
    currency: "INR",
    earningConditionSummary:
      "Employer shortlists the submitted candidate after SuperHire vetting.",
    earningStatus: "potential",
    paymentStatus: "not-payable",
    hiringStageLabel: "Submitted",
    statusExplanation:
      "This separate submission for Priya is currently in SuperHire's second-level vetting queue. Commission remains potential until Meesho shortlists the profile.",
    submittedDateIso: "2026-11-24",
    submittedDateLabel: "24 Nov 2026",
    updatedDateIso: "2026-11-24",
    updatedDateLabel: "24 Nov 2026",
    updatedRelativeLabel: "4h ago",
    milestones: [
      {
        id: "m1",
        label: "Submitted to SuperHire",
        dateLabel: "24 Nov 2026",
        state: "completed",
        note: "Undergoing SuperHire vetting",
      },
      {
        id: "m2",
        label: "Employer shortlist confirmation",
        dateLabel: "Pending employer review",
        state: "current",
        isEarningTrigger: true,
      },
      {
        id: "m3",
        label: "Payout disbursement",
        dateLabel: "After shortlist confirmation",
        state: "upcoming",
      },
    ],
  },
  {
    id: "CM-108",
    submissionId: 108,
    recruiterId: "rec-aisha-01",
    candidateId: 5,
    personId: "person-vikram",
    candidateName: "Vikram Singh",
    initials: "VS",
    jobId: 5,
    roleTitle: "Engineering Manager, Consumer Growth",
    employerId: "emp-swiggy",
    employer: "Swiggy",
    domain: "swiggy.com",
    commissionModel: "shortlist",
    commissionAmount: 2500,
    currency: "INR",
    earningConditionSummary:
      "Employer shortlists the submitted candidate after SuperHire vetting.",
    earningStatus: "potential",
    paymentStatus: "not-payable",
    hiringStageLabel: "Submitted",
    statusExplanation:
      "Vikram's submission is currently under SuperHire review before delivery to Swiggy. Commission becomes earned only once Swiggy confirms shortlist.",
    submittedDateIso: "2026-11-24",
    submittedDateLabel: "24 Nov 2026",
    updatedDateIso: "2026-11-24",
    updatedDateLabel: "24 Nov 2026",
    updatedRelativeLabel: "6h ago",
    milestones: [
      {
        id: "m1",
        label: "Submitted to SuperHire",
        dateLabel: "24 Nov 2026",
        state: "completed",
        note: "Vetting in progress",
      },
      {
        id: "m2",
        label: "Employer shortlist confirmation",
        dateLabel: "Pending employer review",
        state: "current",
        isEarningTrigger: true,
      },
      {
        id: "m3",
        label: "Payout disbursement",
        dateLabel: "After shortlist confirmation",
        state: "upcoming",
      },
    ],
  },
  {
    id: "CM-103",
    submissionId: 103,
    recruiterId: "rec-aisha-01",
    candidateId: 4,
    personId: "person-sneha",
    candidateName: "Sneha Iyer",
    initials: "SI",
    jobId: 4,
    roleTitle: "Product Designer, Design Systems & Core Workflows",
    employerId: "emp-atlassian",
    employer: "Atlassian",
    domain: "atlassian.com",
    commissionModel: "closure",
    commissionAmount: 39000,
    currency: "INR",
    earningConditionSummary:
      "Candidate joins the employer and completes one month of employment.",
    earningStatus: "potential",
    paymentStatus: "not-payable",
    hiringStageLabel: "Offer",
    statusExplanation:
      "Atlassian has extended an offer to Sneha. Under the Earn per closure model, commission remains potential until she joins Atlassian and completes one month of employment.",
    submittedDateIso: "2026-11-10",
    submittedDateLabel: "10 Nov 2026",
    shortlistedDateIso: "2026-11-14",
    shortlistedDateLabel: "14 Nov 2026",
    updatedDateIso: "2026-11-23",
    updatedDateLabel: "23 Nov 2026",
    updatedRelativeLabel: "12h ago",
    milestones: [
      {
        id: "m1",
        label: "Submitted to SuperHire",
        dateLabel: "10 Nov 2026",
        state: "completed",
      },
      {
        id: "m2",
        label: "Employer shortlisted & interviewed",
        dateLabel: "14 Nov 2026",
        state: "completed",
        note: "Offer extended on 23 Nov 2026",
      },
      {
        id: "m3",
        label: "Candidate joins employer",
        dateLabel: "Awaiting offer acceptance & start",
        state: "current",
      },
      {
        id: "m4",
        label: "One-month employment verified",
        dateLabel: "1 month after joining",
        state: "upcoming",
        isEarningTrigger: true,
      },
    ],
  },
  {
    id: "CM-106",
    submissionId: 106,
    recruiterId: "rec-aisha-01",
    candidateId: 3,
    personId: "person-arjun",
    candidateName: "Arjun Kapoor",
    initials: "AK",
    jobId: 3,
    roleTitle:
      "Staff Software Engineer, Payments Reliability & Developer Experience Platform",
    employerId: "emp-stripe",
    employer: "Stripe",
    domain: "stripe.com",
    commissionModel: "closure",
    commissionAmount: 90000,
    currency: "INR",
    earningConditionSummary:
      "Candidate joins the employer and completes one month of employment.",
    earningStatus: "potential",
    paymentStatus: "not-payable",
    hiringStageLabel: "Profile approved",
    statusExplanation:
      "SuperHire approved Arjun's profile and shared it with Stripe. Commission remains potential until Arjun is hired, joins Stripe, and completes one month of employment.",
    submittedDateIso: "2026-11-22",
    submittedDateLabel: "22 Nov 2026",
    updatedDateIso: "2026-11-23",
    updatedDateLabel: "23 Nov 2026",
    updatedRelativeLabel: "18h ago",
    milestones: [
      {
        id: "m1",
        label: "Submitted & approved by SuperHire",
        dateLabel: "22 Nov 2026",
        state: "completed",
      },
      {
        id: "m2",
        label: "Employer hiring process",
        dateLabel: "Shared with Stripe hiring team",
        state: "current",
      },
      {
        id: "m3",
        label: "Candidate joins employer",
        dateLabel: "Pending hiring outcome",
        state: "upcoming",
      },
      {
        id: "m4",
        label: "One-month employment verified",
        dateLabel: "1 month after joining",
        state: "upcoming",
        isEarningTrigger: true,
      },
    ],
  },
  {
    id: "CM-107",
    submissionId: 107,
    recruiterId: "rec-aisha-01",
    candidateId: 8,
    personId: "person-aditya",
    candidateName: "Aditya Verma",
    initials: "AV",
    jobId: 12,
    roleTitle: "Senior iOS Engineer",
    employerId: "emp-cred",
    employer: "Cred",
    domain: "cred.club",
    commissionModel: "closure",
    commissionAmount: 50000,
    currency: "INR",
    earningConditionSummary:
      "Candidate joins the employer and completes one month of employment.",
    earningStatus: "potential",
    paymentStatus: "not-payable",
    hiringStageLabel: "Interview",
    statusExplanation:
      "Aditya is actively interviewing with Cred (Round 3). Because this role uses Earn per closure, commission becomes earned only after joining and completing one month.",
    submittedDateIso: "2026-11-16",
    submittedDateLabel: "16 Nov 2026",
    shortlistedDateIso: "2026-11-18",
    shortlistedDateLabel: "18 Nov 2026",
    updatedDateIso: "2026-11-23",
    updatedDateLabel: "23 Nov 2026",
    updatedRelativeLabel: "1d ago",
    milestones: [
      {
        id: "m1",
        label: "Submitted to SuperHire",
        dateLabel: "16 Nov 2026",
        state: "completed",
      },
      {
        id: "m2",
        label: "Shortlisted & interviewing",
        dateLabel: "18 Nov 2026",
        state: "current",
        note: "In Round 3 interviews at Cred",
      },
      {
        id: "m3",
        label: "Candidate joins employer",
        dateLabel: "Pending offer & start",
        state: "upcoming",
      },
      {
        id: "m4",
        label: "One-month employment verified",
        dateLabel: "1 month after joining",
        state: "upcoming",
        isEarningTrigger: true,
      },
    ],
  },
  {
    id: "CM-110",
    submissionId: 110,
    recruiterId: "rec-aisha-01",
    candidateId: 1,
    personId: "person-rohan",
    candidateName: "Rohan Mehta",
    initials: "RM",
    jobId: 9,
    roleTitle: "Senior Full-Stack Product Engineer",
    employerId: "emp-linear",
    employer: "Linear",
    domain: "linear.app",
    commissionModel: "closure",
    commissionAmount: 42000,
    currency: "INR",
    earningConditionSummary:
      "Candidate joins the employer and completes one month of employment.",
    earningStatus: "potential",
    paymentStatus: "not-payable",
    hiringStageLabel: "Profile approved",
    statusExplanation:
      "Rohan's profile was approved by SuperHire and shared with Linear. Tracked independently from Rohan's other applications; unlocks after joining + 1 month.",
    submittedDateIso: "2026-11-21",
    submittedDateLabel: "21 Nov 2026",
    updatedDateIso: "2026-11-22",
    updatedDateLabel: "22 Nov 2026",
    updatedRelativeLabel: "2d ago",
    milestones: [
      {
        id: "m1",
        label: "Submitted & approved by SuperHire",
        dateLabel: "21 Nov 2026",
        state: "completed",
      },
      {
        id: "m2",
        label: "Employer hiring process",
        dateLabel: "Review at Linear",
        state: "current",
      },
      {
        id: "m3",
        label: "Candidate joins employer",
        dateLabel: "Pending hiring outcome",
        state: "upcoming",
      },
      {
        id: "m4",
        label: "One-month employment verified",
        dateLabel: "1 month after joining",
        state: "upcoming",
        isEarningTrigger: true,
      },
    ],
  },
  {
    id: "CM-105",
    submissionId: 105,
    recruiterId: "rec-aisha-01",
    candidateId: 6,
    personId: "person-siddharth",
    candidateName: "Siddharth Venkatasubramanian",
    initials: "SV",
    jobId: 9,
    roleTitle: "Senior Full-Stack Product Engineer",
    employerId: "emp-linear",
    employer: "Linear",
    domain: "linear.app",
    commissionModel: "closure",
    commissionAmount: 42000,
    currency: "INR",
    earningConditionSummary:
      "Candidate joins the employer and completes one month of employment.",
    earningStatus: "potential",
    paymentStatus: "not-payable",
    hiringStageLabel: "Joined",
    statusExplanation:
      "Siddharth joined Linear on 05 Nov 2026, but has not yet completed one month of employment. Commission remains potential until 1-month completion is verified on or after 05 Dec 2026.",
    submittedDateIso: "2026-10-14",
    submittedDateLabel: "14 Oct 2026",
    shortlistedDateIso: "2026-10-19",
    shortlistedDateLabel: "19 Oct 2026",
    joiningDateIso: "2026-11-05",
    joiningDateLabel: "05 Nov 2026",
    oneMonthCompletionDateIso: "2026-12-05",
    oneMonthCompletionDateLabel: "Target 05 Dec 2026",
    oneMonthVerified: false,
    updatedDateIso: "2026-11-21",
    updatedDateLabel: "21 Nov 2026",
    updatedRelativeLabel: "3d ago",
    milestones: [
      {
        id: "m1",
        label: "Submitted to SuperHire",
        dateLabel: "14 Oct 2026",
        state: "completed",
      },
      {
        id: "m2",
        label: "Employer shortlisted",
        dateLabel: "19 Oct 2026",
        state: "completed",
      },
      {
        id: "m3",
        label: "Candidate joined Linear",
        dateLabel: "05 Nov 2026",
        state: "completed",
        note: "Employment started — 1-month retention period active",
      },
      {
        id: "m4",
        label: "One-month employment verification",
        dateLabel: "Expected 05 Dec 2026",
        state: "current",
        isEarningTrigger: true,
        note: "Outstanding requirement before ₹42,000 becomes earned",
      },
    ],
  },
  {
    id: "CM-113",
    submissionId: 113,
    recruiterId: "rec-aisha-01",
    candidateId: 9,
    personId: "person-ananya",
    candidateName: "Ananya Reddy",
    initials: "AR",
    jobId: 6,
    roleTitle: "DevOps Engineer",
    employerId: "emp-zerodha",
    employer: "Zerodha",
    domain: "zerodha.com",
    commissionModel: "shortlist",
    commissionAmount: 2000,
    currency: "INR",
    earningConditionSummary:
      "Employer shortlists the submitted candidate after SuperHire vetting.",
    earningStatus: "ineligible",
    paymentStatus: "not-payable",
    hiringStageLabel: "Rejected",
    statusExplanation:
      "Zerodha closed review without shortlisting Ananya (Kubernetes production scale mismatch). Because the shortlist condition was not met, this submission is ineligible for commission.",
    submittedDateIso: "2026-11-12",
    submittedDateLabel: "12 Nov 2026",
    updatedDateIso: "2026-11-21",
    updatedDateLabel: "21 Nov 2026",
    updatedRelativeLabel: "3d ago",
    milestones: [
      {
        id: "m1",
        label: "Submitted to SuperHire",
        dateLabel: "12 Nov 2026",
        state: "completed",
      },
      {
        id: "m2",
        label: "Employer shortlist decision",
        dateLabel: "21 Nov 2026",
        state: "ineligible",
        isEarningTrigger: true,
        note: "Not shortlisted by employer — commission ineligible",
      },
    ],
  },
  {
    id: "CM-112",
    submissionId: 112,
    recruiterId: "rec-aisha-01",
    candidateId: 7,
    personId: "person-meera",
    candidateName: "Meera Joshi",
    initials: "MJ",
    jobId: 7,
    roleTitle: "Data Analyst, Core Product",
    employerId: "emp-notion",
    employer: "Notion",
    domain: "notion.so",
    commissionModel: "shortlist",
    commissionAmount: 1800,
    currency: "INR",
    earningConditionSummary:
      "Employer shortlists the submitted candidate after SuperHire vetting.",
    earningStatus: "potential",
    paymentStatus: "not-payable",
    hiringStageLabel: "On hold",
    statusExplanation:
      "Notion paused hiring for Q4 headcount review before shortlist evaluation. Commission remains potential while the role is on hold.",
    submittedDateIso: "2026-11-14",
    submittedDateLabel: "14 Nov 2026",
    updatedDateIso: "2026-11-19",
    updatedDateLabel: "19 Nov 2026",
    updatedRelativeLabel: "5d ago",
    milestones: [
      {
        id: "m1",
        label: "Submitted to SuperHire",
        dateLabel: "14 Nov 2026",
        state: "completed",
      },
      {
        id: "m2",
        label: "Employer shortlist confirmation",
        dateLabel: "Role paused on 19 Nov 2026",
        state: "current",
        isEarningTrigger: true,
        note: "Awaiting employer hiring resume",
      },
    ],
  },
  {
    id: "CM-104",
    submissionId: 104,
    recruiterId: "rec-aisha-01",
    candidateId: 6,
    personId: "person-karthik",
    candidateName: "Karthik Subramanian",
    initials: "KS",
    jobId: 8,
    roleTitle: "Design Systems Engineer",
    employerId: "emp-figma",
    employer: "Figma",
    domain: "figma.com",
    commissionModel: "closure",
    commissionAmount: 55000,
    currency: "INR",
    earningConditionSummary:
      "Candidate joins the employer and completes one month of employment.",
    earningStatus: "earned",
    paymentStatus: "paid",
    hiringStageLabel: "Joined",
    statusExplanation:
      "Karthik joined Figma on 08 Oct 2026 and completed one month of employment on 08 Nov 2026. Your ₹55,000 closure commission was verified as earned on 08 Nov and disbursed on 15 Nov 2026.",
    submittedDateIso: "2026-09-20",
    submittedDateLabel: "20 Sep 2026",
    shortlistedDateIso: "2026-09-25",
    shortlistedDateLabel: "25 Sep 2026",
    joiningDateIso: "2026-10-08",
    joiningDateLabel: "08 Oct 2026",
    oneMonthCompletionDateIso: "2026-11-08",
    oneMonthCompletionDateLabel: "08 Nov 2026",
    oneMonthVerified: true,
    earnedDateIso: "2026-11-08",
    earnedDateLabel: "08 Nov 2026",
    updatedDateIso: "2026-11-15",
    updatedDateLabel: "15 Nov 2026",
    updatedRelativeLabel: "15 Nov 2026",
    payoutId: "po-2",
    payoutReference: "PO-2026-1115",
    paidDateIso: "2026-11-15",
    paidDateLabel: "15 Nov 2026",
    transactionReference: "HDFCN52026111588412",
    milestones: [
      {
        id: "m1",
        label: "Submitted to SuperHire",
        dateLabel: "20 Sep 2026",
        state: "completed",
      },
      {
        id: "m2",
        label: "Employer shortlisted",
        dateLabel: "25 Sep 2026",
        state: "completed",
      },
      {
        id: "m3",
        label: "Candidate joined Figma",
        dateLabel: "08 Oct 2026",
        state: "completed",
      },
      {
        id: "m4",
        label: "One-month employment verified",
        dateLabel: "08 Nov 2026",
        state: "completed",
        isEarningTrigger: true,
        note: "Earning condition met — ₹55,000 unlocked",
      },
      {
        id: "m5",
        label: "Payout disbursed",
        dateLabel: "15 Nov 2026",
        state: "completed",
        note: "Paid via NEFT in batch PO-2026-1115",
      },
    ],
  },
  {
    id: "CM-109",
    submissionId: 109,
    recruiterId: "rec-aisha-01",
    candidateId: 1,
    personId: "person-rohan",
    candidateName: "Rohan Mehta",
    initials: "RM",
    jobId: 16,
    roleTitle: "Site Reliability Engineer",
    employerId: "emp-phonepe",
    employer: "PhonePe",
    domain: "phonepe.com",
    commissionModel: "shortlist",
    commissionAmount: 2000,
    currency: "INR",
    earningConditionSummary:
      "Employer shortlists the submitted candidate after SuperHire vetting.",
    earningStatus: "earned",
    paymentStatus: "paid",
    hiringStageLabel: "Shortlisted",
    statusExplanation:
      "PhonePe shortlisted Rohan on 14 Oct 2026, satisfying the Earn per shortlist condition. Disbursed on 18 Oct 2026 in payout PO-2026-1018.",
    submittedDateIso: "2026-10-09",
    submittedDateLabel: "09 Oct 2026",
    shortlistedDateIso: "2026-10-14",
    shortlistedDateLabel: "14 Oct 2026",
    earnedDateIso: "2026-10-14",
    earnedDateLabel: "14 Oct 2026",
    updatedDateIso: "2026-10-18",
    updatedDateLabel: "18 Oct 2026",
    updatedRelativeLabel: "18 Oct 2026",
    payoutId: "po-1",
    payoutReference: "PO-2026-1018",
    paidDateIso: "2026-10-18",
    paidDateLabel: "18 Oct 2026",
    transactionReference: "HDFCN52026101844903",
    milestones: [
      {
        id: "m1",
        label: "Submitted to SuperHire",
        dateLabel: "09 Oct 2026",
        state: "completed",
      },
      {
        id: "m2",
        label: "Employer shortlist confirmed",
        dateLabel: "14 Oct 2026",
        state: "completed",
        isEarningTrigger: true,
        note: "Earning condition met — ₹2,000 unlocked",
      },
      {
        id: "m3",
        label: "Payout disbursed",
        dateLabel: "18 Oct 2026",
        state: "completed",
        note: "Paid via NEFT in batch PO-2026-1018",
      },
    ],
  },
];

export const BASE_PAYOUT_RECORDS: PayoutRecord[] = [
  {
    id: "po-3",
    recruiterId: "rec-aisha-01",
    reference: "PO-2026-1128",
    amount: 4000,
    currency: "INR",
    status: "scheduled",
    scheduledDateIso: "2026-11-28",
    scheduledDateLabel: "28 Nov 2026",
    paymentMethod: "NEFT Bank Transfer (HDFC Bank ·••4821)",
    includedCommissionIds: ["CM-101", "CM-102"],
    adjustmentAmount: 0,
    statusNote:
      "Confirmed payout batch scheduled for 28 Nov 2026. Includes 2 verified shortlist commissions.",
  },
  {
    id: "po-2",
    recruiterId: "rec-aisha-01",
    reference: "PO-2026-1115",
    amount: 55000,
    currency: "INR",
    status: "paid",
    scheduledDateIso: "2026-11-15",
    scheduledDateLabel: "15 Nov 2026",
    initiatedDateIso: "2026-11-14",
    initiatedDateLabel: "14 Nov 2026",
    paidDateIso: "2026-11-15",
    paidDateLabel: "15 Nov 2026",
    paidDateTimeLabel: "15 Nov 2026, 11:42 AM IST",
    paymentMethod: "NEFT Bank Transfer (HDFC Bank ·••4821)",
    transactionReference: "HDFCN52026111588412",
    includedCommissionIds: ["CM-104"],
    adjustmentAmount: 0,
    statusNote: "Successfully settled to your registered bank account.",
  },
  {
    id: "po-1",
    recruiterId: "rec-aisha-01",
    reference: "PO-2026-1018",
    amount: 2000,
    currency: "INR",
    status: "paid",
    scheduledDateIso: "2026-10-18",
    scheduledDateLabel: "18 Oct 2026",
    initiatedDateIso: "2026-10-17",
    initiatedDateLabel: "17 Oct 2026",
    paidDateIso: "2026-10-18",
    paidDateLabel: "18 Oct 2026",
    paidDateTimeLabel: "18 Oct 2026, 02:15 PM IST",
    paymentMethod: "NEFT Bank Transfer (HDFC Bank ·••4821)",
    transactionReference: "HDFCN52026101844903",
    includedCommissionIds: ["CM-109"],
    adjustmentAmount: 0,
    statusNote: "Successfully settled to your registered bank account.",
  },
];

/**
 * Merges canonical records with any newly submitted candidates from the live shell session.
 */
export function buildCommissionRecords(
  liveCandidates?: CandidateItem[]
): CommissionRecord[] {
  const records: CommissionRecord[] = [...BASE_COMMISSION_RECORDS];

  if (liveCandidates && liveCandidates.length > 9) {
    const extra = liveCandidates.slice(0, liveCandidates.length - 9);
    extra.forEach((c, idx) => {
      const model: EarningsCommissionModel = c.earningModel || "shortlist";
      const amt =
        parseInt(c.commission.replace(/[^\d]/g, ""), 10) ||
        (model === "closure" ? 50000 : 2000);
      records.unshift({
        id: `CM-LIVE-${500 + idx}`,
        submissionId: 500 + idx,
        recruiterId: "rec-aisha-01",
        candidateId: c.id,
        personId: `live-${c.name.toLowerCase().replace(/\s+/g, "-")}`,
        candidateName: c.name,
        initials: c.initials,
        jobId: 2,
        roleTitle: c.role,
        employerId: `emp-${c.company.toLowerCase().replace(/\s+/g, "-")}`,
        employer: c.company,
        domain: c.domain,
        commissionModel: model,
        commissionAmount: amt,
        currency: "INR",
        earningConditionSummary:
          model === "closure"
            ? "Candidate joins the employer and completes one month of employment."
            : "Employer shortlists the submitted candidate after SuperHire vetting.",
        earningStatus: "potential",
        paymentStatus: "not-payable",
        hiringStageLabel: "Submitted",
        statusExplanation:
          model === "closure"
            ? "Newly submitted in this session. Commission becomes earned after the candidate joins the employer and completes one month."
            : "Newly submitted in this session. Commission becomes earned once the employer shortlists this candidate.",
        submittedDateIso: "2026-11-24",
        submittedDateLabel: "24 Nov 2026",
        updatedDateIso: "2026-11-24",
        updatedDateLabel: "24 Nov 2026",
        updatedRelativeLabel: "Just now",
        milestones: [
          {
            id: "m1",
            label: "Submitted to SuperHire",
            dateLabel: "24 Nov 2026",
            state: "completed",
            note: "Awaiting SuperHire second-level vetting",
          },
          {
            id: "m2",
            label:
              model === "closure"
                ? "Candidate joins & completes 1 month"
                : "Employer shortlist confirmation",
            dateLabel: "Pending",
            state: "current",
            isEarningTrigger: true,
          },
        ],
      });
    });
  }

  // Default sort: most recently updated first (PRD §8.5, §12.2)
  return records.sort((a, b) => {
    if (b.updatedDateIso !== a.updatedDateIso) {
      return b.updatedDateIso.localeCompare(a.updatedDateIso);
    }
    return a.id.localeCompare(b.id);
  });
}

/**
 * Checks whether an ISO date (YYYY-MM-DD) falls inside the selected date range.
 */
export function isDateInSelectedRange(
  isoDate: string | undefined,
  preset: EarningsDateRangePreset,
  customStart: string,
  customEnd: string
): boolean {
  if (preset === "all-time") return true;
  if (!isoDate) return false;

  if (preset === "this-month") {
    return isoDate.startsWith(CURRENT_MONTH_PREFIX);
  }
  if (preset === "last-month") {
    return isoDate.startsWith(LAST_MONTH_PREFIX);
  }
  if (preset === "this-year") {
    return isoDate.startsWith(CURRENT_YEAR_PREFIX);
  }
  if (preset === "custom") {
    if (customStart && isoDate < customStart) return false;
    if (customEnd && isoDate > customEnd) return false;
    return true;
  }
  return true;
}

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/**
 * Builds discrete, zero-interpolation chart buckets using ONLY earned commissions
 * grouped strictly by `earnedDateIso` (PRD §6.3, §7.3 ER-020–ER-026, §8.3).
 */
export function buildEarningsChartSeries(
  records: CommissionRecord[],
  preset: EarningsDateRangePreset,
  granularity: ChartGranularity,
  modelFilter: EarningsCommissionModel | "all",
  customStart: string,
  customEnd: string
): ChartBucket[] {
  const eligibleEarned = records.filter((r) => {
    if (r.earningStatus !== "earned" || !r.earnedDateIso) return false;
    if (modelFilter !== "all" && r.commissionModel !== modelFilter) return false;
    return isDateInSelectedRange(r.earnedDateIso, preset, customStart, customEnd);
  });

  // Weekly buckets for single-month presets ("this-month" or "last-month")
  if (preset === "this-month" || preset === "last-month") {
    const monthLabel = preset === "this-month" ? "Nov" : "Oct";
    const endDay = preset === "this-month" ? 30 : 31;
    const weekDefs = [
      { key: "w1", label: `01–07 ${monthLabel} 2026`, shortLabel: `1–7 ${monthLabel}`, min: 1, max: 7 },
      { key: "w2", label: `08–14 ${monthLabel} 2026`, shortLabel: `8–14 ${monthLabel}`, min: 8, max: 14 },
      { key: "w3", label: `15–21 ${monthLabel} 2026`, shortLabel: `15–21 ${monthLabel}`, min: 15, max: 21 },
      { key: "w4", label: `22–${endDay} ${monthLabel} 2026`, shortLabel: `22–${endDay} ${monthLabel}`, min: 22, max: 31 },
    ];

    return weekDefs.map((w) => {
      let earnedAmount = 0;
      let earnedCount = 0;
      eligibleEarned.forEach((r) => {
        const day = parseInt(r.earnedDateIso!.slice(8, 10), 10);
        if (day >= w.min && day <= w.max) {
          earnedAmount += r.commissionAmount;
          earnedCount += 1;
        }
      });
      return {
        key: w.key,
        label: w.label,
        shortLabel: w.shortLabel,
        earnedAmount,
        earnedCount,
      };
    });
  }

  // Quarterly grouping for multi-month ranges
  if (granularity === "quarterly") {
    const quarters = [
      { key: "2026-Q1", label: "Q1 2026 (Jan–Mar)", shortLabel: "Q1 '26", months: ["01", "02", "03"] },
      { key: "2026-Q2", label: "Q2 2026 (Apr–Jun)", shortLabel: "Q2 '26", months: ["04", "05", "06"] },
      { key: "2026-Q3", label: "Q3 2026 (Jul–Sep)", shortLabel: "Q3 '26", months: ["07", "08", "09"] },
      { key: "2026-Q4", label: "Q4 2026 (Oct–Dec)", shortLabel: "Q4 '26", months: ["10", "11", "12"] },
    ];
    return quarters.map((q) => {
      let earnedAmount = 0;
      let earnedCount = 0;
      eligibleEarned.forEach((r) => {
        const yr = r.earnedDateIso!.slice(0, 4);
        const mo = r.earnedDateIso!.slice(5, 7);
        if (yr === "2026" && q.months.includes(mo)) {
          earnedAmount += r.commissionAmount;
          earnedCount += 1;
        }
      });
      return {
        key: q.key,
        label: q.label,
        shortLabel: q.shortLabel,
        earnedAmount,
        earnedCount,
      };
    });
  }

  // Default Monthly grouping across Jan–Nov 2026 (zero-earnings periods preserved cleanly)
  const buckets: ChartBucket[] = [];
  for (let m = 0; m <= 10; m++) {
    const mm = String(m + 1).padStart(2, "0");
    const prefix = `2026-${mm}`;
    let earnedAmount = 0;
    let earnedCount = 0;
    eligibleEarned.forEach((r) => {
      if (r.earnedDateIso!.startsWith(prefix)) {
        earnedAmount += r.commissionAmount;
        earnedCount += 1;
      }
    });
    buckets.push({
      key: prefix,
      label: `${MONTH_NAMES[m]} 2026`,
      shortLabel: MONTH_NAMES[m],
      earnedAmount,
      earnedCount,
    });
  }
  return buckets;
}

/**
 * Computes lifetime financial totals and model breakdowns with exact integer arithmetic.
 * Total earned = Paid + Pending + Processing + Failed (all earned items).
 */
export function computeEarningsSummary(
  records: CommissionRecord[],
  payouts: PayoutRecord[]
) {
  let lifetimeEarned = 0;
  let paymentPending = 0;
  let paymentProcessing = 0;
  let lifetimePaid = 0;
  let paymentFailed = 0;
  let potentialTotal = 0;
  let pendingSubmissionsCount = 0;

  const shortlist: ModelBreakdownSummary = {
    model: "shortlist",
    label: "Earn per shortlist",
    conditionText: "Earned when the employer shortlists your candidate",
    earnedAmount: 0,
    potentialAmount: 0,
    earnedCount: 0,
    potentialCount: 0,
  };

  const closure: ModelBreakdownSummary = {
    model: "closure",
    label: "Earn per closure",
    conditionText: "Earned after candidate joins and completes 1 month",
    earnedAmount: 0,
    potentialAmount: 0,
    earnedCount: 0,
    potentialCount: 0,
  };

  let joinedPendingRetentionCount = 0;

  records.forEach((r) => {
    const target = r.commissionModel === "shortlist" ? shortlist : closure;

    if (r.earningStatus === "earned") {
      lifetimeEarned += r.commissionAmount;
      target.earnedAmount += r.commissionAmount;
      target.earnedCount += 1;

      if (r.paymentStatus === "paid") {
        lifetimePaid += r.commissionAmount;
      } else if (r.paymentStatus === "pending") {
        paymentPending += r.commissionAmount;
        pendingSubmissionsCount += 1;
      } else if (r.paymentStatus === "processing") {
        paymentProcessing += r.commissionAmount;
      } else if (r.paymentStatus === "failed") {
        paymentFailed += r.commissionAmount;
      }
    } else if (r.earningStatus === "potential") {
      potentialTotal += r.commissionAmount;
      target.potentialAmount += r.commissionAmount;
      target.potentialCount += 1;
      if (
        r.commissionModel === "closure" &&
        r.joiningDateIso &&
        !r.oneMonthVerified
      ) {
        joinedPendingRetentionCount += 1;
      }
    }
  });

  if (joinedPendingRetentionCount > 0) {
    closure.footnote = `Includes ${joinedPendingRetentionCount} joined ${
      joinedPendingRetentionCount === 1 ? "candidate" : "candidates"
    } awaiting 1-month verification`;
  }

  // Paid this month from successful payout records in the current calendar month (PRD ER-011)
  const paidThisMonthPayouts = payouts.filter(
    (p) =>
      p.status === "paid" &&
      p.paidDateIso?.startsWith(CURRENT_MONTH_PREFIX)
  );
  const paidThisMonth = paidThisMonthPayouts.reduce(
    (sum, p) => sum + p.amount,
    0
  );

  // Confirmed next scheduled payout (PRD ER-012 — never invent if none exists)
  const nextScheduledPayout =
    payouts.find(
      (p) => p.status === "scheduled" || p.status === "processing"
    ) ?? null;

  return {
    lifetimeEarned,
    lifetimePaid,
    paymentPending,
    paymentProcessing,
    paymentFailed,
    potentialTotal,
    pendingSubmissionsCount,
    paidThisMonth,
    paidThisMonthPayoutCount: paidThisMonthPayouts.length,
    nextScheduledPayout,
    models: [shortlist, closure] as [
      ModelBreakdownSummary,
      ModelBreakdownSummary,
    ],
  };
}
