import type { CandidateStatus } from "@/components/recruiter/CandidateCard";
import type { CandidateItem } from "@/proto/candidate-cards/data";
import type {
  ActionRequiredItem,
  ActivePipelineStageId,
  ActiveRoleSummary,
  CommissionModel,
  DashboardSnapshot,
  PipelineStageMeta,
  SubmissionRecord,
} from "./RecruiterDashboard.types";

export const ACTIVE_PIPELINE_STAGES: PipelineStageMeta[] = [
  {
    id: "submitted",
    step: 1,
    label: "Submitted",
    shortLabel: "Submitted",
    trackStatus: "submitted",
    description: "Sourced and submitted to SuperHire for second-level vetting",
  },
  {
    id: "profile-approved",
    step: 2,
    label: "Profile approved",
    shortLabel: "Profile approved",
    trackStatus: "under-review",
    description: "Vetted by SuperHire and shared with the employer as interview-ready",
  },
  {
    id: "shortlisted",
    step: 3,
    label: "Shortlisted",
    shortLabel: "Shortlisted",
    trackStatus: "shortlisted",
    description: "Employer accepted the profile (triggers commission on shortlist-model roles)",
  },
  {
    id: "interview",
    step: 4,
    label: "Interview",
    shortLabel: "Interview",
    trackStatus: "interview",
    description: "Candidate is actively interviewing with the employer's hiring team",
  },
  {
    id: "offer",
    step: 5,
    label: "Offer",
    shortLabel: "Offer",
    trackStatus: "offered",
    description: "Employer has extended an offer to the candidate",
  },
  {
    id: "joined",
    step: 6,
    label: "Joined",
    shortLabel: "Joined",
    trackStatus: "joined",
    description: "Candidate has joined the employer (closure roles require 1-month completion)",
  },
];

export function formatInr(amount: number): string {
  if (amount === 0) return "₹0";
  return "₹" + amount.toLocaleString("en-IN");
}

export function companyLogoUrl(domain: string): string {
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
}

export function mapStageToTrackStatuses(
  stage: ActivePipelineStageId
): CandidateStatus[] {
  switch (stage) {
    case "submitted":
      return ["submitted"];
    case "profile-approved":
      return ["superhire-review", "employer-review", "under-review"];
    case "shortlisted":
      return ["shortlisted"];
    case "interview":
      return ["interview"];
    case "offer":
      return ["offered"];
    case "joined":
      return ["joined"];
  }
}

export const BASE_SUBMISSIONS: SubmissionRecord[] = [
  {
    id: 101,
    candidateId: 1,
    personId: "person-rohan",
    candidateName: "Rohan Mehta",
    initials: "RM",
    jobId: 1,
    roleTitle: "Senior Frontend Engineer",
    company: "Google",
    domain: "google.com",
    stage: "interview",
    trackStatus: "interview",
    stageContext: "Round 2 · System Design scheduled for Thu",
    lastUpdatedLabel: "2 hrs ago",
    lastUpdatedMinutesAgo: 120,
    submittedLabel: "4 days ago",
    commissionModel: "shortlist",
    commissionAmount: 2000,
    commissionFormatted: "₹2,000",
    earningEligibility: "earned",
    payoutStatus: "payment-pending",
    expectedPayoutDate: "28 Nov 2026",
    earningConditionNote: "Earned on employer shortlist · Payout scheduled 28 Nov",
  },
  {
    id: 102,
    candidateId: 2,
    personId: "person-priya",
    candidateName: "Priya Nair",
    initials: "PN",
    jobId: 2,
    roleTitle: "Senior Backend Engineer, Payments Platform",
    company: "Razorpay",
    domain: "razorpay.com",
    stage: "shortlisted",
    trackStatus: "shortlisted",
    stageContext: "Shortlisted by Hiring Manager",
    lastUpdatedLabel: "5 hrs ago",
    lastUpdatedMinutesAgo: 300,
    submittedLabel: "5 days ago",
    commissionModel: "shortlist",
    commissionAmount: 2000,
    commissionFormatted: "₹2,000",
    earningEligibility: "earned",
    payoutStatus: "payment-pending",
    expectedPayoutDate: "28 Nov 2026",
    earningConditionNote: "Earned on employer shortlist · Awaiting weekly payout cycle",
  },
  {
    id: 103,
    candidateId: 4,
    personId: "person-sneha",
    candidateName: "Sneha Iyer",
    initials: "SI",
    jobId: 4,
    roleTitle: "Product Designer, Design Systems & Core Workflows",
    company: "Atlassian",
    domain: "atlassian.com",
    stage: "offer",
    trackStatus: "offered",
    stageContext: "Offer extended · Candidate reviewing compensation",
    lastUpdatedLabel: "12 hrs ago",
    lastUpdatedMinutesAgo: 720,
    submittedLabel: "14 days ago",
    commissionModel: "closure",
    commissionAmount: 39000,
    commissionFormatted: "₹39,000",
    earningEligibility: "potential",
    payoutStatus: "not-applicable",
    earningConditionNote: "Per-closure model · Unlocks 30 days after candidate joins",
  },
  {
    id: 104,
    candidateId: 6,
    personId: "person-karthik",
    candidateName: "Karthik Subramanian",
    initials: "KS",
    jobId: 8,
    roleTitle: "Design Systems Engineer",
    company: "Figma",
    domain: "figma.com",
    stage: "joined",
    trackStatus: "joined",
    stageContext: "Joined 08 Oct · 1-month retention confirmed",
    lastUpdatedLabel: "2 days ago",
    lastUpdatedMinutesAgo: 2880,
    submittedLabel: "45 days ago",
    commissionModel: "closure",
    commissionAmount: 55000,
    commissionFormatted: "₹55,000",
    joinedDate: "08 Oct 2026",
    oneMonthCompletionDate: "08 Nov 2026",
    oneMonthCompleted: true,
    daysIntoRetention: 30,
    earningEligibility: "earned",
    payoutStatus: "paid",
    paidDate: "15 Nov 2026",
    earningConditionNote: "Completed 1 month on 08 Nov · Paid via NEFT on 15 Nov",
  },
  {
    id: 105,
    candidateId: 6,
    personId: "person-siddharth",
    candidateName: "Siddharth Venkatasubramanian",
    initials: "SV",
    jobId: 9,
    roleTitle: "Senior Full-Stack Product Engineer",
    company: "Linear",
    domain: "linear.app",
    stage: "joined",
    trackStatus: "joined",
    stageContext: "Joined 05 Nov · Completing 1st month (Day 18 of 30)",
    lastUpdatedLabel: "3 days ago",
    lastUpdatedMinutesAgo: 4320,
    submittedLabel: "38 days ago",
    commissionModel: "closure",
    commissionAmount: 42000,
    commissionFormatted: "₹42,000",
    joinedDate: "05 Nov 2026",
    oneMonthCompletionDate: "05 Dec 2026",
    oneMonthCompleted: false,
    daysIntoRetention: 18,
    earningEligibility: "potential",
    payoutStatus: "not-applicable",
    earningConditionNote: "Joined 05 Nov · Moves to Earned after 1-month completion on 05 Dec",
  },
  {
    id: 106,
    candidateId: 3,
    personId: "person-arjun",
    candidateName: "Arjun Kapoor",
    initials: "AK",
    jobId: 3,
    roleTitle: "Staff Software Engineer, Payments Reliability & Developer Experience Platform",
    company: "Stripe",
    domain: "stripe.com",
    stage: "profile-approved",
    trackStatus: "under-review",
    stageContext: "Approved by SuperHire · Shared with Stripe hiring team",
    lastUpdatedLabel: "18 hrs ago",
    lastUpdatedMinutesAgo: 1080,
    submittedLabel: "2 days ago",
    commissionModel: "closure",
    commissionAmount: 90000,
    commissionFormatted: "₹90,000",
    earningEligibility: "potential",
    payoutStatus: "not-applicable",
    earningConditionNote: "Per-closure model · Requires join + 1 month retention",
  },
  {
    id: 107,
    candidateId: 8,
    personId: "person-aditya",
    candidateName: "Aditya Verma",
    initials: "AV",
    jobId: 12,
    roleTitle: "Senior iOS Engineer",
    company: "Cred",
    domain: "cred.club",
    stage: "interview",
    trackStatus: "interview",
    stageContext: "Round 3 · Architecture & Bar Raiser on Friday",
    lastUpdatedLabel: "1 day ago",
    lastUpdatedMinutesAgo: 1800,
    submittedLabel: "8 days ago",
    commissionModel: "closure",
    commissionAmount: 50000,
    commissionFormatted: "₹50,000",
    earningEligibility: "potential",
    payoutStatus: "not-applicable",
    earningConditionNote: "Per-closure model · Unlocks 30 days after joining",
  },
  {
    id: 108,
    candidateId: 5,
    personId: "person-vikram",
    candidateName: "Vikram Singh",
    initials: "VS",
    jobId: 5,
    roleTitle: "Engineering Manager, Consumer Growth",
    company: "Swiggy",
    domain: "swiggy.com",
    stage: "submitted",
    trackStatus: "submitted",
    stageContext: "Submitted to SuperHire · Vetting in progress",
    lastUpdatedLabel: "6 hrs ago",
    lastUpdatedMinutesAgo: 360,
    submittedLabel: "Today",
    commissionModel: "shortlist",
    commissionAmount: 2500,
    commissionFormatted: "₹2,500",
    earningEligibility: "potential",
    payoutStatus: "not-applicable",
    earningConditionNote: "Per-shortlist model · Unlocks when Swiggy shortlists profile",
  },
  {
    id: 109,
    candidateId: 1,
    personId: "person-rohan",
    candidateName: "Rohan Mehta",
    initials: "RM",
    jobId: 16,
    roleTitle: "Site Reliability Engineer",
    company: "PhonePe",
    domain: "phonepe.com",
    stage: "shortlisted",
    trackStatus: "shortlisted",
    stageContext: "Shortlisted · Round 1 being coordinated by employer",
    lastUpdatedLabel: "4 days ago",
    lastUpdatedMinutesAgo: 5760,
    submittedLabel: "9 days ago",
    commissionModel: "shortlist",
    commissionAmount: 2000,
    commissionFormatted: "₹2,000",
    earningEligibility: "earned",
    payoutStatus: "paid",
    paidDate: "18 Oct 2026",
    earningConditionNote: "Earned on shortlist (2nd submission for Rohan) · Paid 18 Oct",
  },
  {
    id: 110,
    candidateId: 1,
    personId: "person-rohan",
    candidateName: "Rohan Mehta",
    initials: "RM",
    jobId: 9,
    roleTitle: "Senior Full-Stack Product Engineer",
    company: "Linear",
    domain: "linear.app",
    stage: "profile-approved",
    trackStatus: "under-review",
    stageContext: "Approved by SuperHire (3rd submission for Rohan)",
    lastUpdatedLabel: "2 days ago",
    lastUpdatedMinutesAgo: 2900,
    submittedLabel: "3 days ago",
    commissionModel: "closure",
    commissionAmount: 42000,
    commissionFormatted: "₹42,000",
    earningEligibility: "potential",
    payoutStatus: "not-applicable",
    earningConditionNote: "Independent submission #3 for Rohan Mehta · Closure model",
  },
  {
    id: 111,
    candidateId: 2,
    personId: "person-priya",
    candidateName: "Priya Nair",
    initials: "PN",
    jobId: 13,
    roleTitle: "Machine Learning Engineer, Recommendations",
    company: "Meesho",
    domain: "meesho.com",
    stage: "submitted",
    trackStatus: "submitted",
    stageContext: "Submitted · SuperHire reviewing resume correction",
    lastUpdatedLabel: "4 hrs ago",
    lastUpdatedMinutesAgo: 240,
    submittedLabel: "Today",
    commissionModel: "shortlist",
    commissionAmount: 2000,
    commissionFormatted: "₹2,000",
    earningEligibility: "potential",
    payoutStatus: "not-applicable",
    earningConditionNote: "Per-shortlist model · Unlocks when Meesho shortlists profile",
  },
  {
    id: 112,
    candidateId: 7,
    personId: "person-meera",
    candidateName: "Meera Joshi",
    initials: "MJ",
    jobId: 7,
    roleTitle: "Data Analyst, Core Product",
    company: "Notion",
    domain: "notion.so",
    stage: "on-hold",
    trackStatus: "on-hold",
    stageContext: "Employer paused hiring for Q4 headcount review",
    lastUpdatedLabel: "5 days ago",
    lastUpdatedMinutesAgo: 7200,
    submittedLabel: "10 days ago",
    commissionModel: "shortlist",
    commissionAmount: 1800,
    commissionFormatted: "₹1,800",
    earningEligibility: "potential",
    payoutStatus: "not-applicable",
    earningConditionNote: "Role on hold · Outside active 6-stage pipeline",
  },
  {
    id: 113,
    candidateId: 9,
    personId: "person-ananya",
    candidateName: "Ananya Reddy",
    initials: "AR",
    jobId: 6,
    roleTitle: "DevOps Engineer",
    company: "Zerodha",
    domain: "zerodha.com",
    stage: "unsuccessful",
    trackStatus: "rejected",
    stageContext: "Not shortlisted · Kubernetes production scale mismatch",
    lastUpdatedLabel: "3 days ago",
    lastUpdatedMinutesAgo: 4500,
    submittedLabel: "12 days ago",
    commissionModel: "shortlist",
    commissionAmount: 2000,
    commissionFormatted: "₹2,000",
    earningEligibility: "none",
    payoutStatus: "not-applicable",
    earningConditionNote: "Submission closed · No commission earned",
  },
];

export const BASE_ACTIONS_REQUIRED: ActionRequiredItem[] = [
  {
    id: "act-1",
    submissionId: 108,
    candidateId: 5,
    candidateName: "Vikram Singh",
    initials: "VS",
    roleTitle: "Engineering Manager, Consumer Growth",
    company: "Swiggy",
    domain: "swiggy.com",
    issueType: "missing-details",
    badgeLabel: "Missing details",
    title: "Complete notice period buyout & current CTC breakdown",
    description:
      "SuperHire vetting needs clarity on whether Vikram's 60-day notice period at his current employer is negotiable before forwarding to Swiggy.",
    ctaLabel: "Complete details",
    requestedAt: "Requested 3h ago",
  },
  {
    id: "act-2",
    submissionId: 111,
    candidateId: 2,
    candidateName: "Priya Nair",
    initials: "PN",
    roleTitle: "Machine Learning Engineer, Recommendations",
    company: "Meesho",
    domain: "meesho.com",
    issueType: "corrected-resume",
    badgeLabel: "Resume update",
    title: "Upload unredacted resume with valid GitHub & contact header",
    description:
      "The uploaded PDF had truncated project descriptions on page 2. Upload a clean copy so SuperHire can approve the profile.",
    ctaLabel: "Upload corrected resume",
    requestedAt: "Requested 4h ago",
  },
];

export function buildDashboardSnapshot(
  dismissedActionIds: string[] = [],
  liveCandidates?: CandidateItem[]
): DashboardSnapshot {
  const submissions: SubmissionRecord[] = [...BASE_SUBMISSIONS];

  // Sync any newly submitted candidates from the live shell session
  if (liveCandidates && liveCandidates.length > 9) {
    const extra = liveCandidates.slice(0, liveCandidates.length - 9);
    extra.forEach((c, idx) => {
      const model: CommissionModel = c.earningModel || "shortlist";
      const amt =
        parseInt(c.commission.replace(/[^\d]/g, ""), 10) ||
        (model === "closure" ? 50000 : 2000);
      submissions.unshift({
        id: 500 + idx,
        candidateId: c.id,
        personId: `live-${c.name.toLowerCase().replace(/\s+/g, "-")}`,
        candidateName: c.name,
        initials: c.initials,
        jobId: 2,
        roleTitle: c.role,
        company: c.company,
        domain: c.domain,
        stage: "submitted",
        trackStatus: c.status,
        stageContext: "Newly submitted in this session · Pending SuperHire vetting",
        lastUpdatedLabel: "Just now",
        lastUpdatedMinutesAgo: 1,
        submittedLabel: "Today",
        commissionModel: model,
        commissionAmount: amt,
        commissionFormatted: c.commission,
        earningEligibility: "potential",
        payoutStatus: "not-applicable",
        earningConditionNote:
          model === "closure"
            ? "Per-closure model · Unlocks 30 days after joining"
            : "Per-shortlist model · Unlocks on employer shortlist",
      });
    });
  }

  const uniquePeople = new Set(submissions.map((s) => s.personId));

  const pipelineCounts: Record<ActivePipelineStageId, number> = {
    submitted: 0,
    "profile-approved": 0,
    shortlisted: 0,
    interview: 0,
    offer: 0,
    joined: 0,
  };

  let onHoldCount = 0;
  let unsuccessfulCount = 0;

  let totalEarned = 0;
  let paymentPending = 0;
  let paid = 0;
  let potentialCommission = 0;
  let shortlistModelEarned = 0;
  let closureModelEarned = 0;
  let shortlistModelPotential = 0;
  let closureModelPotential = 0;

  submissions.forEach((s) => {
    if (s.stage === "on-hold") {
      onHoldCount += 1;
    } else if (s.stage === "unsuccessful") {
      unsuccessfulCount += 1;
    } else {
      pipelineCounts[s.stage] += 1;
    }

    if (s.earningEligibility === "earned") {
      totalEarned += s.commissionAmount;
      if (s.payoutStatus === "paid") {
        paid += s.commissionAmount;
      } else {
        paymentPending += s.commissionAmount;
      }
      if (s.commissionModel === "shortlist") {
        shortlistModelEarned += s.commissionAmount;
      } else {
        closureModelEarned += s.commissionAmount;
      }
    } else if (s.earningEligibility === "potential") {
      potentialCommission += s.commissionAmount;
      if (s.commissionModel === "shortlist") {
        shortlistModelPotential += s.commissionAmount;
      } else {
        closureModelPotential += s.commissionAmount;
      }
    }
  });

  const totalSubmissionsCount = submissions.length;
  // Submissions reviewed by SuperHire (excluding initial vetting queue)
  const reviewedSubmissions = submissions.filter((s) => s.stage !== "submitted");
  const reviewedSubmissionsCount = reviewedSubmissions.length;

  const employerShortlistedCount =
    pipelineCounts.shortlisted +
    pipelineCounts.interview +
    pipelineCounts.offer +
    pipelineCounts.joined;
  const shortlistRate =
    reviewedSubmissionsCount > 0
      ? Math.round((employerShortlistedCount / reviewedSubmissionsCount) * 100)
      : 0;

  const inHiringProcessCount =
    pipelineCounts.shortlisted + pipelineCounts.interview + pipelineCounts.offer;

  const recentProgress = submissions
    .filter((s) => s.lastUpdatedMinutesAgo <= 1440)
    .sort((a, b) => a.lastUpdatedMinutesAgo - b.lastUpdatedMinutesAgo);

  const roleMap = new Map<number, ActiveRoleSummary>();
  submissions.forEach((s) => {
    if (s.stage === "unsuccessful") return;
    const existing = roleMap.get(s.jobId);
    const breakdown = existing?.stageBreakdown ?? {
      submitted: 0,
      approved: 0,
      shortlisted: 0,
      interview: 0,
      offer: 0,
      joined: 0,
      "on-hold": 0,
      unsuccessful: 0,
    };
    if (s.stage === "submitted") breakdown.submitted += 1;
    if (s.stage === "profile-approved") breakdown.approved += 1;
    if (s.stage === "shortlisted") breakdown.shortlisted += 1;
    if (s.stage === "interview") breakdown.interview += 1;
    if (s.stage === "offer") breakdown.offer += 1;
    if (s.stage === "joined") breakdown.joined += 1;
    if (s.stage === "on-hold") breakdown["on-hold"] = (breakdown["on-hold"] ?? 0) + 1;

    const parts: string[] = [];
    if (breakdown.joined > 0) parts.push(`${breakdown.joined} Joined`);
    if (breakdown.offer > 0) parts.push(`${breakdown.offer} Offer`);
    if (breakdown.interview > 0) parts.push(`${breakdown.interview} Interview`);
    if (breakdown.shortlisted > 0) parts.push(`${breakdown.shortlisted} Shortlisted`);
    if (breakdown.approved > 0) parts.push(`${breakdown.approved} Profile approved`);
    if (breakdown.submitted > 0 && parts.length < 2) {
      parts.push(`${breakdown.submitted} In vetting`);
    }

    roleMap.set(s.jobId, {
      jobId: s.jobId,
      roleTitle: s.roleTitle,
      company: s.company,
      domain: s.domain,
      commissionModel: s.commissionModel,
      commissionFormatted: s.commissionFormatted,
      totalSubmitted: (existing?.totalSubmitted ?? 0) + 1,
      progressSummary: parts.join(" · ") || "1 Submitted",
      stageBreakdown: breakdown,
      lastActivityLabel: existing ? existing.lastActivityLabel : s.lastUpdatedLabel,
    });
  });

  const activeRoles = Array.from(roleMap.values());
  const actionsRequired = BASE_ACTIONS_REQUIRED.filter(
    (a) => !dismissedActionIds.includes(a.id)
  );

  return {
    recruiterName: "Aisha",
    submissions,
    uniqueCandidateCount: uniquePeople.size,
    totalSubmissionsCount,
    reviewedSubmissionsCount,
    shortlistRate,
    employerShortlistedCount,
    inHiringProcessCount,
    pipelineCounts,
    onHoldCount,
    unsuccessfulCount,
    earnings: {
      totalEarned,
      paymentPending,
      paid,
      potentialCommission,
      shortlistModelEarned,
      closureModelEarned,
      shortlistModelPotential,
      closureModelPotential,
      nextPayoutDate: "28 Nov 2026",
    },
    recentProgress,
    activeRoles,
    actionsRequired,
  };
}
