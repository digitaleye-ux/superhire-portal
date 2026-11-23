import type { CandidateItem } from "@/proto/candidate-cards/data";
import { DUMMY_CANDIDATE_ITEMS } from "@/proto/candidate-cards/data";

/* ------------------------------------------------------------------ *
 * Candidate Details Side Panel — Clean, Essential Data Model
 * 6-stage lifecycle:
 *   1. Candidate submitted (Recruiter submitted the candidate)
 *   2. Profile approved (SuperHire second-level review & approval)
 *   3. Employer shortlisted (Employer selected the profile)
 *   4. Interview (Interview rounds: scheduled, ongoing, or completed)
 *   5. Offer extended (Employer extended an offer)
 *   6. Candidate joined (Placement confirmed & verified by SuperHire)
 * ------------------------------------------------------------------ */

export type StageKey =
  | "submitted"
  | "approved"
  | "shortlisted"
  | "interview"
  | "offer"
  | "joined";

export type StageState =
  | "done"
  | "current"
  | "upcoming"
  | "not-approved"
  | "not-shortlisted"
  | "interview-unsuccessful"
  | "offer-declined"
  | "withdrawn"
  | "on-hold";

export interface MilestoneNextStep {
  text: string;
  owner: "Recruiter" | "Employer" | "SuperHire" | "Candidate";
  actionLabel?: string;
}

export interface TimelineStage {
  step: number; // 1 to 6
  key: StageKey;
  label: string; // "Candidate submitted" | "Profile approved" | "Employer shortlisted" | "Interview" | "Offer extended" | "Candidate joined"
  state: StageState;
  date?: string; // e.g. "17 Nov", "25 November · 11:00 AM"
  outcome?: string; // e.g. "Submitted by you", "Approved by SuperHire", "Shortlisted by employer"
  badgeLabel?: string; // e.g. "Current stage", "Action needed", "In progress", "Feedback pending", "On hold", "Application closed", "Completed"
  headline?: string; // e.g. "Verification in progress", "Technical interview · Round 2"
  scheduledTime?: string; // e.g. "25 November · 11:00 AM"
  updateText?: string; // One short update text
  metaText?: string; // Date / source: e.g. "Submitted today · 9:15 AM", "Updated by employer · 22 Nov"
  noteText?: string; // Context note: e.g. "Waiting for employer's decision.", "Expected update: 25 November"
  actionLabel?: string; // CTA button label, ONLY when recruiter needs to act
  details?: Record<string, string>; // e.g. { "Offered CTC": "₹25 LPA fixed", "Expected joining": "15 Dec 2026" }
  // Backward compat:
  updateTitle?: string;
  updatedBy?: string;
  updatedAt?: string;
  nextStep?: MilestoneNextStep;
  feedback?: string;
  update?: string;
}

export interface LatestUpdateInfo {
  statusLabel: string;
  waitingDuration: string;
  isOverdue?: boolean;
  updateText: string;
  nextAction?: string;
}

export interface ActivityEntry {
  id: string;
  date: string;
  time: string;
  title: string;
  detail: string;
}

export interface CandidateNote {
  id: string;
  author: string;
  authorRole: "recruiter" | "employer";
  date: string;
  text: string;
}

export interface CandidateDetail {
  item: CandidateItem;
  /* 1. Candidate overview */
  name: string;
  initials: string;
  designation: string;
  experience: string;
  location: string;
  resumeName: string;
  resumeSize: string;
  /* 2. Job details */
  company: string;
  domain: string;
  jobTitle: string;
  commission: string;
  commissionNote: string;
  earningModel?: "shortlist" | "closure";
  /* 3. Hiring progress (6 milestones) */
  progressHeadline: string; // e.g. "4 of 6 milestones reached", "Not approved", "On hold"
  milestonesReached: number; // e.g. 4
  totalMilestones: number; // 6
  stages: TimelineStage[];
  /* 4. Latest update */
  latest: LatestUpdateInfo;
  /* 5. Activity history */
  activities: ActivityEntry[];
  /* 6. Recruiter & employer notes */
  recruiterNotes: CandidateNote[];
  employerNotes: CandidateNote[];
  /* Secondary candidate context (kept minimal below progress) */
  currentCtc: string;
  expectedCtc: string;
  noticePeriod: string;
  email: string;
  phone: string;
}

export const PANEL_CANDIDATES: CandidateItem[] = DUMMY_CANDIDATE_ITEMS;

function slug(s: string) {
  return s.toLowerCase().replace(/[^a-z]+/g, ".").replace(/^\.|\.$/g, "");
}

export function buildDetail(item: CandidateItem): CandidateDetail {
  const first = item.name.split(" ")[0];
  const email = `${slug(item.name)}@gmail.com`;
  const phone = "+91 98450 61834";

  // Realistic current designation based on role
  const currentOrgMap: Record<number, string> = {
    1: "Senior Frontend Engineer at Zeta",
    2: "Senior Backend Engineer at Freshworks",
    3: "Staff Software Engineer at Juspay",
    4: "Senior Product Designer at Postman",
    5: "Engineering Manager at Meesho",
    6: "Staff UI Engineer at BrowserStack",
    7: "Product Data Analyst at Cleartax",
    8: "Senior iOS Engineer at Groww",
    9: "DevOps Engineer at Chargebee",
  };

  const designation = currentOrgMap[item.id] ?? `${item.role.replace(/,.*$/, "")} at Zeta`;

  let stages: TimelineStage[] = [];
  let latest: LatestUpdateInfo;
  let activities: ActivityEntry[] = [];
  const earningModel = item.earningModel ?? "shortlist";
  let commissionNote =
    earningModel === "closure"
      ? "Payable when candidate joins & completes 1 month"
      : "Payable when candidate is shortlisted by employer";
  let recruiterNotes: CandidateNote[] = [];
  let employerNotes: CandidateNote[] = [];
  let progressHeadline = "4 of 6 milestones reached";
  let milestonesReached = 4;
  const totalMilestones = 6;

  if (item.id === 1) {
    // Rohan Mehta — Google (Interview – In direct interview loop)
    progressHeadline = "3 of 6 milestones reached";
    milestonesReached = 3;
    stages = [
      {
        step: 1,
        key: "submitted",
        label: "Candidate submitted",
        state: "done",
        date: "14 Nov",
        outcome: "You submitted Rohan's profile for Senior Frontend Engineer at Google.",
      },
      {
        step: 2,
        key: "approved",
        label: "Profile approved",
        state: "done",
        date: "14 Nov",
        outcome: "SuperHire completed its second-level review and approved the candidate for employer consideration.",
      },
      {
        step: 3,
        key: "shortlisted",
        label: "Employer shortlisted",
        state: "done",
        date: "15 Nov",
        outcome: "Google reviewed the candidate's profile and selected them to move forward in the hiring process.",
      },
      {
        step: 4,
        key: "interview",
        label: "Interview",
        state: "current",
        badgeLabel: "Round 2 scheduled",
        date: "25 Nov · 11:00 AM",
        updateText: "Google scheduled Round 2 (System Design) directly with Rohan for 25 Nov at 11:00 AM.",
      },
      { step: 5, key: "offer", label: "Offer extended", state: "upcoming" },
      { step: 6, key: "joined", label: "Candidate joined", state: "upcoming" },
    ];

    latest = {
      statusLabel: "Technical interview · Scheduled",
      waitingDuration: "25 November · 11:00 AM",
      updateText: "Second technical interview (System Design) scheduled. Round 1 cleared.",
      nextAction: "Confirm the candidate's availability.",
    };

    activities = [
      {
        id: "a1",
        date: "22 Nov",
        time: "2:30 PM",
        title: "Round 2 interview scheduled",
        detail: "System Design round with Arvind Rao (EM, Google) set for 25 Nov at 11:00 AM.",
      },
      {
        id: "a2",
        date: "16 Nov",
        time: "11:30 AM",
        title: "Round 1 completed — Passed",
        detail: "Interviewer noted strong React performance debugging and clean state abstractions.",
      },
      {
        id: "a3",
        date: "15 Nov",
        time: "2:10 PM",
        title: "Shortlisted by employer",
        detail: "Google hiring team shortlisted the profile and requested Round 1 availability.",
      },
      {
        id: "a4",
        date: "14 Nov",
        time: "5:40 PM",
        title: "Profile approved",
        detail: "SuperHire completed second-level vetting and forwarded profile to Google.",
      },
      {
        id: "a5",
        date: "14 Nov",
        time: "10:05 AM",
        title: "Profile submitted",
        detail: `You submitted ${item.name} for ${item.role} at ${item.company}.`,
      },
    ];

    recruiterNotes = [
      {
        id: "rn1",
        author: "Added by you",
        authorRole: "recruiter",
        date: "18 Nov, 2:30 PM",
        text: "Candidate prefers remote opportunities. Flexible on compensation for the right role.",
      },
      {
        id: "rn2",
        author: "Added by you",
        authorRole: "recruiter",
        date: "15 Nov, 6:10 PM",
        text: "Available for calls after 5 PM on weekdays. Interested in the company but currently evaluating another offer.",
      },
    ];

    employerNotes = [
      {
        id: "en1",
        author: "Arvind Rao",
        authorRole: "employer",
        date: "22 Nov",
        text: "Round 2 confirmed for 25 Nov at 11:00 AM. Please send the candidate's availability confirmation before EOD.",
      },
    ];
  } else if (item.id === 8) {
    // Aditya Verma — Cred (Interview – Direct feedback in review)
    progressHeadline = "3 of 6 milestones reached";
    milestonesReached = 3;
    stages = [
      {
        step: 1,
        key: "submitted",
        label: "Candidate submitted",
        state: "done",
        date: "10 Nov",
        outcome: "You submitted Aditya's profile for Lead iOS Engineer at Cred.",
      },
      {
        step: 2,
        key: "approved",
        label: "Profile approved",
        state: "done",
        date: "11 Nov",
        outcome: "SuperHire completed its second-level review and approved the candidate for employer consideration.",
      },
      {
        step: 3,
        key: "shortlisted",
        label: "Employer shortlisted",
        state: "done",
        date: "12 Nov",
        outcome: "Cred reviewed the candidate's profile and selected them to move forward in the hiring process.",
      },
      {
        step: 4,
        key: "interview",
        label: "Interview",
        state: "current",
        badgeLabel: "Feedback in review",
        date: "13 Nov · Employer",
        updateText: "Round 2 completed directly between Cred and Aditya. Engineering panel scorecard is in review.",
      },
      { step: 5, key: "offer", label: "Offer extended", state: "upcoming" },
      { step: 6, key: "joined", label: "Candidate joined", state: "upcoming" },
    ];

    latest = {
      statusLabel: "Round 2 completed · Feedback pending",
      waitingDuration: "13 Nov · 5:00 PM",
      isOverdue: true,
      updateText: "Waiting for employer feedback and the next interview decision.",
      nextAction: "Follow up with the employer.",
    };

    activities = [
      {
        id: "a1",
        date: "13 Nov",
        time: "5:00 PM",
        title: "Round 2 interview completed",
        detail: "60-minute Mobile System Architecture session completed. Scorecard pending from interviewer.",
      },
      {
        id: "a2",
        date: "12 Nov",
        time: "6:20 PM",
        title: "Round 1 cleared",
        detail: "Passed live coding round with strong feedback on CoreAnimation performance.",
      },
      {
        id: "a3",
        date: "12 Nov",
        time: "11:00 AM",
        title: "Shortlisted by employer",
        detail: "Cred Mobile team shortlisted Aditya for technical interviews.",
      },
      {
        id: "a4",
        date: "10 Nov",
        time: "3:15 PM",
        title: "Profile submitted",
        detail: `You submitted ${item.name} for ${item.role} at ${item.company}.`,
      },
    ];

    recruiterNotes = [
      {
        id: "rn1",
        author: "Added by you",
        authorRole: "recruiter",
        date: "15 Nov, 4:20 PM",
        text: "Prefers high-ownership mobile teams. Available for calls after 6 PM; check in on Friday regarding his timeline.",
      },
    ];

    employerNotes = [
      {
        id: "en1",
        author: "Cred Mobile Engineering Lead",
        authorRole: "employer",
        date: "13 Nov",
        text: "Round 2 (Mobile Architecture) completed. Scorecard in review with the panel. Will share outcome and next steps shortly.",
      },
    ];
  } else if (item.status === "shortlisted") {
    // Priya Nair — Razorpay (Shortlisted by employer -> direct interview scheduling)
    progressHeadline = "3 of 6 milestones reached";
    milestonesReached = 3;
    stages = [
      {
        step: 1,
        key: "submitted",
        label: "Candidate submitted",
        state: "done",
        date: "13 Nov",
        outcome: "You submitted Priya's profile for Backend Engineer at Razorpay.",
      },
      {
        step: 2,
        key: "approved",
        label: "Profile approved",
        state: "done",
        date: "15 Nov",
        outcome: "SuperHire completed its second-level review and approved the candidate for employer consideration.",
      },
      {
        step: 3,
        key: "shortlisted",
        label: "Employer shortlisted",
        state: "done",
        date: "17 Nov",
        outcome: "Razorpay reviewed the candidate's profile and selected them to move forward in the hiring process.",
      },
      {
        step: 4,
        key: "interview",
        label: "Interview",
        state: "current",
        badgeLabel: "Scheduling directly",
        date: "17 Nov · Employer",
        updateText: "Razorpay reached out directly to Priya to coordinate time slots for Round 1 technical interview.",
      },
      { step: 5, key: "offer", label: "Offer extended", state: "upcoming" },
      { step: 6, key: "joined", label: "Candidate joined", state: "upcoming" },
    ];

    latest = {
      statusLabel: "Shortlisted · Interview availability requested",
      waitingDuration: "17 Nov · 4:45 PM",
      updateText: "Employer requested three available time slots for the first interview.",
      nextAction: "Share the candidate's availability.",
    };

    activities = [
      {
        id: "a1",
        date: "17 Nov",
        time: "4:45 PM",
        title: "Shortlisted by Razorpay",
        detail: "Hiring manager approved profile for Round 1 technical interview.",
      },
      {
        id: "a2",
        date: "15 Nov",
        time: "1:20 PM",
        title: "Profile approved",
        detail: "SuperHire validated Go, Kafka, and high-throughput payments experience.",
      },
      {
        id: "a3",
        date: "13 Nov",
        time: "11:10 AM",
        title: "Profile submitted",
        detail: `You submitted ${item.name} for ${item.role} at ${item.company}.`,
      },
    ];

    recruiterNotes = [
      {
        id: "rn1",
        author: "Added by you",
        authorRole: "recruiter",
        date: "17 Nov, 4:15 PM",
        text: "Open to relocating to Bengaluru with 2 weeks' notice. Flexible on expected CTC depending on the opportunity.",
      },
    ];

    employerNotes = [
      {
        id: "en1",
        author: "Payments Engineering Manager, Razorpay",
        authorRole: "employer",
        date: "17 Nov",
        text: "Shortlisted for Round 1 (Distributed Systems). Requesting 3 time slots this week — will confirm once the candidate's availability is verified.",
      },
    ];
  } else if (item.status === "under-review") {
    // Arjun Kapoor — Stripe (Profile approved by SuperHire -> waiting for employer shortlist)
    progressHeadline = "2 of 6 milestones reached";
    milestonesReached = 2;
    stages = [
      {
        step: 1,
        key: "submitted",
        label: "Candidate submitted",
        state: "done",
        date: "17 Nov",
        outcome: "You submitted Arjun's profile for Staff Infrastructure Engineer at Stripe.",
      },
      {
        step: 2,
        key: "approved",
        label: "Profile approved",
        state: "done",
        date: "17 Nov",
        outcome: "SuperHire completed its second-level review and approved the candidate for employer consideration.",
      },
      {
        step: 3,
        key: "shortlisted",
        label: "Employer shortlisted",
        state: "current",
        date: "17 Nov · 3:30 PM",
        updateText: "Stripe reviewed the candidate's profile and is evaluating selection to move forward in the hiring process.",
      },
      { step: 4, key: "interview", label: "Interview", state: "upcoming" },
      { step: 5, key: "offer", label: "Offer extended", state: "upcoming" },
      { step: 6, key: "joined", label: "Candidate joined", state: "upcoming" },
    ];

    latest = {
      statusLabel: "Profile approved · Sent to employer",
      waitingDuration: "17 Nov · 3:30 PM",
      updateText: "Candidate passed SuperHire's review and was forwarded to the employer.",
      nextAction: "Waiting for the employer's shortlist decision.",
    };

    activities = [
      {
        id: "a1",
        date: "17 Nov",
        time: "3:30 PM",
        title: "Profile approved by SuperHire",
        detail: "Profile passed completeness check (98% fit) and shared with Stripe Platform hiring team.",
      },
      {
        id: "a2",
        date: "17 Nov",
        time: "10:00 AM",
        title: "Profile submitted",
        detail: `You submitted ${item.name} for ${item.role} at ${item.company}.`,
      },
    ];

    recruiterNotes = [
      {
        id: "rn1",
        author: "Added by you",
        authorRole: "recruiter",
        date: "17 Nov, 11:20 AM",
        text: "Prefers remote roles; open to hybrid for a Staff platform scope. Available for calls before 11 AM or after 5 PM.",
      },
    ];

    employerNotes = [
      {
        id: "en1",
        author: "Stripe Platform Hiring Lead",
        authorRole: "employer",
        date: "17 Nov",
        text: "Profile received and under review. Will confirm shortlist decision within 2 business days.",
      },
    ];
  } else if (item.status === "offered") {
    // Sneha Iyer — Atlassian (Offer)
    progressHeadline = "4 of 6 milestones reached";
    milestonesReached = 4;
    stages = [
      {
        step: 1,
        key: "submitted",
        label: "Candidate submitted",
        state: "done",
        date: "4 Nov",
        outcome: "You submitted Sneha's profile for Senior Product Designer at Atlassian.",
      },
      {
        step: 2,
        key: "approved",
        label: "Profile approved",
        state: "done",
        date: "5 Nov",
        outcome: "SuperHire completed its second-level review and approved the candidate for employer consideration.",
      },
      {
        step: 3,
        key: "shortlisted",
        label: "Employer shortlisted",
        state: "done",
        date: "6 Nov",
        outcome: "Atlassian reviewed the candidate's profile and selected them to move forward in the hiring process.",
      },
      {
        step: 4,
        key: "interview",
        label: "Interview",
        state: "done",
        date: "12 Nov · Employer",
        outcome: "Candidate progressed through the employer's interview process. 3 interview rounds completed.",
      },
      {
        step: 5,
        key: "offer",
        label: "Offer extended",
        state: "current",
        badgeLabel: "Awaiting acceptance",
        date: "15 Nov · Employer",
        updateText: "Atlassian extended an offer to Sneha. Awaiting candidate decision.",
      },
      { step: 6, key: "joined", label: "Candidate joined", state: "upcoming" },
    ];

    latest = {
      statusLabel: "Offer extended · Awaiting acceptance",
      waitingDuration: "15 Nov · 5:10 PM",
      updateText: "Employer extended an offer to the candidate. Awaiting candidate decision.",
      nextAction: "Waiting for candidate decision.",
    };

    activities = [
      {
        id: "a1",
        date: "15 Nov",
        time: "5:10 PM",
        title: "Offer letter released",
        detail: "Atlassian shared formal offer directly with candidate.",
      },
      {
        id: "a2",
        date: "12 Nov",
        time: "4:00 PM",
        title: "Final interview cleared",
        detail: "Cleared Head of Design round with unanimous hire recommendation.",
      },
      {
        id: "a3",
        date: "6 Nov",
        time: "2:15 PM",
        title: "Shortlisted by Atlassian",
        detail: "Shortlisted for Confluence Product Designer interview loop.",
      },
      {
        id: "a4",
        date: "4 Nov",
        time: "11:45 AM",
        title: "Profile submitted",
        detail: `You submitted ${item.name} for ${item.role} at ${item.company}.`,
      },
    ];

    recruiterNotes = [
      {
        id: "rn1",
        author: "Added by you",
        authorRole: "recruiter",
        date: "16 Nov, 3:45 PM",
        text: "Check with candidate about offer decision on Friday. Interested in the team but currently comparing scope with another offer.",
      },
    ];

    employerNotes = [
      {
        id: "en1",
        author: "Confluence Design Lead, Atlassian",
        authorRole: "employer",
        date: "15 Nov",
        text: "Formal offer released directly to candidate. Candidate has until 21 Nov to respond.",
      },
    ];
  } else if (item.status === "joined") {
    // Karthik Subramanian — Figma (Joined)
    progressHeadline = "6 of 6 milestones reached";
    milestonesReached = 6;
    commissionNote = "Paid in full on 18 Nov";
    stages = [
      {
        step: 1,
        key: "submitted",
        label: "Candidate submitted",
        state: "done",
        date: "4 Oct",
        outcome: "You submitted Karthik's profile for Staff Frontend Engineer at Figma.",
      },
      {
        step: 2,
        key: "approved",
        label: "Profile approved",
        state: "done",
        date: "5 Oct",
        outcome: "SuperHire completed its second-level review and approved the candidate for employer consideration.",
      },
      {
        step: 3,
        key: "shortlisted",
        label: "Employer shortlisted",
        state: "done",
        date: "7 Oct",
        outcome: "Figma reviewed the candidate's profile and selected them to move forward in the hiring process.",
      },
      {
        step: 4,
        key: "interview",
        label: "Interview",
        state: "done",
        date: "18 Oct · Employer",
        outcome: "Candidate progressed through the employer's interview process. 3 interview rounds completed.",
      },
      {
        step: 5,
        key: "offer",
        label: "Offer extended",
        state: "done",
        date: "21 Oct · Employer",
        outcome: "Employer extended an offer to the candidate. Offer accepted by candidate.",
      },
      {
        step: 6,
        key: "joined",
        label: "Candidate joined",
        state: "done",
        date: "4 Nov · Verified by SuperHire",
        updateText: "Candidate joined Figma and the placement was confirmed by SuperHire.",
      },
    ];

    latest = {
      statusLabel: "Candidate joined · Placement confirmed",
      waitingDuration: "4 November",
      updateText: "Candidate successfully joined Figma. Placement verified by SuperHire.",
    };

    activities = [
      {
        id: "a1",
        date: "18 Nov",
        time: "10:30 AM",
        title: "Commission payout settled",
        detail: "₹3,00,000 transferred via NEFT following 15-day retention confirmation.",
      },
      {
        id: "a2",
        date: "4 Nov",
        time: "9:30 AM",
        title: "Candidate joined Figma",
        detail: "Onboarding confirmed by Figma People Operations.",
      },
      {
        id: "a3",
        date: "22 Oct",
        time: "6:00 PM",
        title: "Offer accepted",
        detail: "Signed offer letter returned by candidate.",
      },
      {
        id: "a4",
        date: "4 Oct",
        time: "12:15 PM",
        title: "Profile submitted",
        detail: `You submitted ${item.name} for ${item.role} at ${item.company}.`,
      },
    ];

    recruiterNotes = [
      {
        id: "rn1",
        author: "Added by you",
        authorRole: "recruiter",
        date: "20 Oct, 5:00 PM",
        text: "Prioritized design systems and core canvas engineering culture over higher competing cash offer.",
      },
    ];

    employerNotes = [
      {
        id: "en1",
        author: "Figma Core UI Engineering Lead",
        authorRole: "employer",
        date: "4 Nov",
        text: "Karthik joined the Core UI engineering group. Onboarding confirmed by Figma People Operations.",
      },
    ];
  } else if (item.status === "on-hold") {
    // Meera Joshi — Notion (On hold)
    progressHeadline = "On hold";
    milestonesReached = 2;
    stages = [
      {
        step: 1,
        key: "submitted",
        label: "Candidate submitted",
        state: "done",
        date: "8 Nov",
        outcome: "You submitted Meera's profile for Senior Data Analyst at Notion.",
      },
      {
        step: 2,
        key: "approved",
        label: "Profile approved",
        state: "done",
        date: "9 Nov",
        outcome: "SuperHire completed its second-level review and approved the candidate for employer consideration.",
      },
      {
        step: 3,
        key: "shortlisted",
        label: "Employer shortlisted",
        state: "on-hold",
        badgeLabel: "On hold",
        date: "13 Nov · Employer",
        updateText: "Notion reviewed the candidate's profile and selected them to move forward. Hiring is temporarily paused during Q3 headcount review.",
      },
      { step: 4, key: "interview", label: "Interview", state: "upcoming" },
      { step: 5, key: "offer", label: "Offer extended", state: "upcoming" },
      { step: 6, key: "joined", label: "Candidate joined", state: "upcoming" },
    ];

    latest = {
      statusLabel: "Shortlisted · Role on hold",
      waitingDuration: "13 November",
      updateText: "Hiring paused temporarily during Q3 headcount review. Candidate remains shortlisted.",
      nextAction: "Waiting for employer · Updated timeline expected by 25 November.",
    };

    activities = [
      {
        id: "a1",
        date: "13 Nov",
        time: "3:40 PM",
        title: "Role placed on hold",
        detail: "Hiring paused temporarily due to Q3 team budget review.",
      },
      {
        id: "a2",
        date: "11 Nov",
        time: "11:20 AM",
        title: "Shortlisted by Notion",
        detail: "Profile approved by Core Product Analytics lead.",
      },
      {
        id: "a3",
        date: "8 Nov",
        time: "2:00 PM",
        title: "Profile submitted",
        detail: `You submitted ${item.name} for ${item.role} at ${item.company}.`,
      },
    ];

    recruiterNotes = [
      {
        id: "rn1",
        author: "Added by you",
        authorRole: "recruiter",
        date: "14 Nov, 2:10 PM",
        text: "Happy to wait for the Notion role to reopen in Q4, as long as we share an updated timeline by next Friday.",
      },
    ];

    employerNotes = [
      {
        id: "en1",
        author: "Core Product Analytics Lead, Notion",
        authorRole: "employer",
        date: "13 Nov",
        text: "Interviews paused temporarily during Q3 headcount realignment. Meera stays shortlisted. Updated hiring timeline expected by 25 Nov.",
      },
    ];
  } else if (item.status === "rejected") {
    // Ananya Reddy — Zerodha (Interview – Unsuccessful)
    progressHeadline = "Application closed";
    milestonesReached = 3;
    commissionNote = "Not eligible (application closed)";
    stages = [
      {
        step: 1,
        key: "submitted",
        label: "Candidate submitted",
        state: "done",
        date: "6 Nov",
        outcome: "You submitted Ananya's profile for DevOps Engineer at Zerodha.",
      },
      {
        step: 2,
        key: "approved",
        label: "Profile approved",
        state: "done",
        date: "8 Nov",
        outcome: "SuperHire completed its second-level review and approved the candidate for employer consideration.",
      },
      {
        step: 3,
        key: "shortlisted",
        label: "Employer shortlisted",
        state: "done",
        date: "10 Nov",
        outcome: "Zerodha reviewed the candidate's profile and selected them to move forward in the hiring process.",
      },
      {
        step: 4,
        key: "interview",
        label: "Interview",
        state: "interview-unsuccessful",
        badgeLabel: "Application closed",
        date: "15 Nov · Employer",
        updateText: "Interview unsuccessful (Round 1). Employer feedback: More hands-on experience with Kubernetes infrastructure is required.",
      },
      { step: 5, key: "offer", label: "Offer extended", state: "upcoming" },
      { step: 6, key: "joined", label: "Candidate joined", state: "upcoming" },
    ];

    latest = {
      statusLabel: "Interview unsuccessful · Round 1",
      waitingDuration: "15 November",
      updateText: "Employer feedback: Candidate needs more hands-on experience with Kubernetes infrastructure.",
      nextAction: "Application closed. Candidate can be considered for other roles.",
    };

    activities = [
      {
        id: "a1",
        date: "15 Nov",
        time: "5:30 PM",
        title: "Application closed after Round 1",
        detail: "Employer shared feedback citing bare-metal Kubernetes scale requirements.",
      },
      {
        id: "a2",
        date: "14 Nov",
        time: "3:00 PM",
        title: "Round 1 technical interview completed",
        detail: "Interviewed by Zerodha Infrastructure team.",
      },
      {
        id: "a3",
        date: "10 Nov",
        time: "1:15 PM",
        title: "Shortlisted for interview",
        detail: "Profile selected for Round 1 technical discussion.",
      },
      {
        id: "a4",
        date: "6 Nov",
        time: "10:20 AM",
        title: "Profile submitted",
        detail: `You submitted ${item.name} for ${item.role} at ${item.company}.`,
      },
    ];

    recruiterNotes = [
      {
        id: "rn1",
        author: "Added by you",
        authorRole: "recruiter",
        date: "15 Nov, 6:00 PM",
        text: "Open to cloud-native DevOps roles at mid-stage fintech startups. Prefers Bengaluru or remote.",
      },
    ];

    employerNotes = [
      {
        id: "en1",
        author: "Zerodha Infrastructure Team",
        authorRole: "employer",
        date: "15 Nov",
        text: "Not selected after Round 1. Strong CI/CD and Docker fundamentals, but the role requires deeper hands-on debugging of bare-metal Kubernetes clusters.",
      },
    ];
  } else {
    // Vikram Singh — Swiggy (Candidate submitted -> Profile approved in review)
    progressHeadline = "1 of 6 milestones reached";
    milestonesReached = 1;
    stages = [
      {
        step: 1,
        key: "submitted",
        label: "Candidate submitted",
        state: "done",
        date: "Today · 9:15 AM",
        outcome: "You submitted Vikram's profile for Full-Stack Engineer at Swiggy.",
      },
      {
        step: 2,
        key: "approved",
        label: "Profile approved",
        state: "current",
        date: "Today · 9:15 AM",
        updateText: "SuperHire is conducting its second-level review to approve the candidate for employer consideration.",
      },
      { step: 3, key: "shortlisted", label: "Employer shortlisted", state: "upcoming" },
      { step: 4, key: "interview", label: "Interview", state: "upcoming" },
      { step: 5, key: "offer", label: "Offer extended", state: "upcoming" },
      { step: 6, key: "joined", label: "Candidate joined", state: "upcoming" },
    ];

    latest = {
      statusLabel: "Submitted · Verification in progress",
      waitingDuration: "Submitted today · 9:15 AM",
      updateText: "SuperHire is reviewing the candidate's profile.",
      nextAction: "No recruiter action needed.",
    };

    activities = [
      {
        id: "a1",
        date: "Today",
        time: "9:15 AM",
        title: "Profile submitted",
        detail: `You submitted ${first} for ${item.role} at ${item.company}.`,
      },
    ];

    recruiterNotes = [];

    employerNotes = [];
  }

  return {
    item,
    name: item.name,
    initials: item.initials,
    designation,
    experience: item.experience,
    location: item.location,
    resumeName: `${item.name.replace(/\s+/g, "_")}_Resume.pdf`,
    resumeSize: "412 KB",
    company: item.company,
    domain: item.domain,
    jobTitle: item.role,
    commission: item.commission,
    commissionNote,
    earningModel,
    progressHeadline,
    milestonesReached,
    totalMilestones,
    stages,
    latest,
    activities,
    recruiterNotes,
    employerNotes,
    currentCtc: item.currentCtc,
    expectedCtc: item.expectedCtc,
    noticePeriod: item.noticePeriod,
    email,
    phone,
  };
}
