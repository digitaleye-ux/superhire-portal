export type CandidateStatus =
  | "submitted"
  | "under-review"
  | "shortlisted"
  | "interview"
  | "offered"
  | "joined"
  | "on-hold"
  | "rejected";

export interface CandidateCardProps {
  /** Candidate's full name — displayed as the prominent 16px primary title. */
  candidateName: string;
  /** Role the candidate was submitted for — displayed on line 2 as "for {roleTitle} at {company}". */
  roleTitle: string;
  /** Target hiring company name shown in line 2. */
  company: string;
  /** Optional custom initials for the avatar in the header. Auto-computed from candidateName if omitted. */
  initials?: string;
  /** Work location, e.g. "Bengaluru" or "Remote". */
  location?: string;
  /** Candidate's experience, e.g. "6 yrs". */
  experience?: string;
  /** Candidate's current CTC, e.g. "₹32 LPA" or "32 LPA". Used with expectedCtc to form a CTC range. */
  currentCtc?: string;
  /** Candidate's expected CTC / package, e.g. "₹45 LPA" or "45 LPA". */
  expectedCtc?: string;
  /** Candidate's CTC range, e.g. "32–45 LPA" or "32–45 L". Overrides currentCtc and expectedCtc when provided. */
  ctcRange?: string;
  /** Candidate's notice period, e.g. "30 days". */
  noticePeriod?: string;
  /** Current candidate pipeline status tag shown in the header. */
  status: CandidateStatus;
  /** Commission amount shown in the footer. Defaults to "₹25,000". */
  commission?: string;
  /**
   * Recruiter earning model:
   * - "shortlist": paid when candidate is shortlisted by employer (default: "per shortlist")
   * - "closure": paid when candidate joins and completes one month (default: "per closure")
   */
  earningModel?: "shortlist" | "closure";
  /** Optional LinkedIn profile URL. */
  linkedinUrl?: string;
  /** Optional callback fired when clicking the LinkedIn icon. */
  onViewLinkedin?: () => void;
  /** Optional GitHub profile URL. Only displayed if filled by the recruiter. */
  githubUrl?: string;
  /** Optional callback fired when clicking the GitHub icon. */
  onViewGithub?: () => void;
  /** Optional resume URL or document link. */
  resumeUrl?: string;
  /** Optional callback fired when clicking the view resume icon. */
  onViewResume?: () => void;
  /** Hover action button label. Defaults to "Add another role". */
  actionLabel?: string;
  /** Fired when the footer action button is clicked. */
  onAction?: () => void;
  /** Fired when the whole card is clicked (e.g. to open candidate detail drawer). */
  onClick?: () => void;
  /** Optional callback fired when clicking "Copy candidate link" in the kebab menu. */
  onCopyLink?: () => void;
  /** Optional callback fired when clicking "Withdraw candidate" in the kebab menu. */
  onWithdraw?: () => void;
  className?: string;
}
