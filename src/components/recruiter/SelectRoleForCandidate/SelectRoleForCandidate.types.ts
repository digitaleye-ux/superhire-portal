import type { CandidateItem } from "@/proto/candidate-cards/data";

export interface ClaimedRoleItem {
  id: number;
  company: string;
  domain: string;
  role: string;
  packageLabel: string;
  experience: string;
  location: string;
  mode?: string;
  jobType?: string;
  commission: string;
  earningModel?: "shortlist" | "closure";
  badge?: "trending" | "priority" | "spotlight" | "just-in" | "closed";
}

export interface SelectRoleForCandidateProps {
  /** The candidate being submitted to another role. */
  candidate: CandidateItem;
  /** List of claimed roles belonging to the recruiter. */
  claimedJobs: ClaimedRoleItem[];
  /** Existing applications for this candidate to check against duplicates. */
  existingSubmissions?: Array<{ company: string; role: string }>;
  /** Optional custom description under the candidate's name. */
  description?: string;
  /** Callback when the recruiter picks a target role. */
  onSelectJob: (job: ClaimedRoleItem) => void;
  /** Callback to redirect the user to Explore if no claimed roles are suitable. */
  onExploreJobs: () => void;
  /** Close the role picker drawer. */
  onClose: () => void;
  className?: string;
}
