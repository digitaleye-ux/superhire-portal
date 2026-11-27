export interface JobDetailCompany {
  /** Number of open jobs, display string e.g. "1,000+". */
  openJobs: string;
  /** Industry/domain, e.g. "Fintech, Payments". */
  domain: string;
  /** Business model, e.g. "B2B & B2B2C". */
  businessModel: string;
  /** Employee count, display string e.g. "3,000+". */
  employees: string;
  /** Valuation, display string e.g. "~$7.5B". */
  valuation: string;
  /** Year established, e.g. "2014". */
  established: string;
  /** Company headquarters location, e.g. "Mountain View, CA". */
  headquarters?: string;
  /** Company website domain or URL, e.g. "google.com". */
  website?: string;
  /** About paragraph. */
  about: string;
  /** Culture points. */
  culture: string[];
  /** Perks & benefits. */
  perks: string[];
}

export interface JobDetailData {
  id: string | number;
  company: string;
  companyLogoUrl?: string;
  /** Optional status badge, same as the job card. */
  badge?: import("@/components/shared/Badge").BadgeType;
  role: string;
  /** Display-ready package label, e.g. "₹55–80 L". */
  packageLabel: string;
  /** Commission, e.g. "₹2,000" or "₹50,000". */
  commission: string;
  /** Recruiter earning model: "shortlist" | "closure" */
  earningModel?: "shortlist" | "closure";
  jobType: string;
  mode: string;
  /** Location display label, e.g. "Bengaluru +3". */
  location: string;
  /** Full location list for the tooltip. */
  locationFull?: string;
  experience: string;
  noticePeriod: string;
  openings: number;

  /**
   * Editorial Job Details format:
   * 1. About the role — short introduction and purpose of the position
   * 2. What you'll do — responsibilities and expected impact
   * 3. What we're looking for — required experience, skills and qualifications
   * 4. Nice to have — preferred qualifications (optional)
   * 5. Role expectations — structured details (experience, employment, work mode, location, openings)
   * 6. Compensation and benefits — salary, bonus, equity, role-specific perks (optional)
   */
  aboutRole?: string;
  /** Legacy fallback for aboutRole */
  overview?: string;

  /** Responsibilities and expected impact */
  responsibilities?: string[];

  /** Requirements and essential qualifications (What we're looking for) */
  requirements?: string[];
  /** Legacy fallbacks for requirements */
  skills?: string[];
  criteria?: string[];

  /** Preferred qualifications (Nice to have) */
  niceToHave?: string[];

  /** Structured role expectations override (falls back to top-level fields) */
  roleExpectations?: {
    experience?: string;
    employment?: string;
    workMode?: string;
    location?: string;
    openings?: number | string;
    noticePeriod?: string;
  };

  /** Compensation and role-specific benefits (optional) */
  compensationAndBenefits?: string[] | string;

  /** Illustrative disclaimer text */
  disclaimer?: string;

  /** Company tab content. */
  companyInfo: JobDetailCompany;
}

export interface JobDetailProps {
  job: JobDetailData;
  /** Close the panel. */
  onClose: () => void;
  /** Claim or submit candidate action. */
  onClaim?: (id: JobDetailData["id"]) => void;
  /** Unclaim action (rendered as a secondary button to the left of the primary action when provided). */
  onUnclaim?: (id: JobDetailData["id"]) => void;
  /** Copy job link callback. */
  onCopyLink?: () => void;
  /** Download job details callback. */
  onDownloadJd?: () => void;
  /** Secondary unclaim button label in footer. Defaults to "Unclaim role". */
  unclaimLabel?: string;
  /** Primary button label in footer. Defaults to "Claim role". */
  actionLabel?: string;
  className?: string;
}
