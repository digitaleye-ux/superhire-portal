import type { BadgeType } from "@/components/shared/Badge";

export type EarningModel = "shortlist" | "closure";

export interface JobCardProps {
  /** Company name shown in the header. */
  company: string;
  /** URL of the company logo. Falls back to a neutral placeholder when omitted or broken. */
  companyLogoUrl?: string;
  /** Job role / title. */
  roleTitle: string;
  /** Compensation package label, e.g. "₹12–18 LPA". Omit if unknown. */
  packageLabel?: string;
  /** Required experience label, e.g. "3–5 yrs". Omit if unknown. */
  experience?: string;
  /**
   * Job location display label, e.g. "Bengaluru" or "Bengaluru +3".
   * Produce multi-location labels with `formatLocations` in the data layer.
   * Omit if unknown.
   */
  location?: string;
  /**
   * Full location list for the hover tooltip, e.g. "Bengaluru, Pune, Remote".
   * Only needed when `location` is a rolled-up "+N" label. Produce it with
   * `locationsTitle`.
   */
  locationFull?: string;
  /** Work mode, e.g. "Remote", "Hybrid", "On-site". Omit if unknown. */
  mode?: string;
  /** Employment type, e.g. "Full-time". Omit if unknown. */
  jobType?: string;
  /** Commission amount shown in the footer, e.g. "₹2,000" or "₹50,000". Footer hides if omitted. */
  commission?: string;
  /**
   * Recruiter earning model:
   * - "shortlist": paid when candidate is shortlisted by employer (default: "per shortlist")
   * - "closure": paid when candidate joins and completes one month (default: "per closure")
   */
  earningModel?: EarningModel;
  /**
   * Optional status badge shown in the header (e.g. "trending", "priority",
   * "spotlight", "just-in", "closed"). Omit for no badge.
   */
  badge?: BadgeType;
  /**
   * Whether to show the small leading icons in the meta row
   * (package / experience / location). Defaults to true. Job type has no icon.
   */
  showMetaIcons?: boolean;
  /**
   * Action button label on card hover/focus in the footer.
   * Defaults to "Claim role". For Claimed roles page, this is "Submit candidate".
   */
  actionLabel?: string;
  /**
   * Fired when the card's primary action ("Claim role" / "Submit candidate") is triggered.
   * When provided, the card reveals the claim action on hover / focus.
   */
  onClaim?: () => void;
  /**
   * Generic handler for the primary action button.
   */
  onAction?: () => void;
  /** Fired when the card itself is clicked (e.g. to open the detail panel).
   * When provided, the whole card is clickable and keyboard-activatable.
   */
  onClick?: () => void;
  /** Whether the card is in claimed mode (enables kebab menu). */
  isClaimed?: boolean;
  /** Fired when Unclaim is clicked from the kebab menu. */
  onUnclaim?: () => void;
  /** Fired when Submit candidate is clicked from the kebab menu. */
  onSubmitCandidate?: () => void;
  /** Fired when Copy job link is clicked from the kebab menu. */
  onCopyLink?: () => void;
  /** Fired when Download job description is clicked from the kebab menu. */
  onDownloadJd?: () => void;
  /** Optional additional class name for the outer element. */
  className?: string;
}
