import type { DropdownOption } from "@/components/shared/Dropdown";

export interface CandidateFilterState {
  status: string[];
  company: string[];
}

export interface CandidateSortFilterBarProps {
  /** Active candidate filter selections. */
  filters: CandidateFilterState;
  /** Triggered when filters change. */
  onFiltersChange: (next: CandidateFilterState) => void;
  /** Current selected sort key. */
  sort: string;
  /** Triggered when sort key changes. */
  onSortChange: (value: string) => void;
  className?: string;
}

export const CANDIDATE_FILTER_OPTIONS: {
  id: keyof CandidateFilterState;
  label: string;
  options: DropdownOption[];
}[] = [
  {
    id: "status",
    label: "Status",
    options: [
      { value: "submitted", label: "Submitted" },
      { value: "under-review", label: "Review" },
      { value: "shortlisted", label: "Shortlisted" },
      { value: "interview", label: "Interview" },
      { value: "offered", label: "Offer" },
      { value: "joined", label: "Joined" },
      { value: "on-hold", label: "On hold" },
      { value: "rejected", label: "Rejected" },
    ],
  },
  {
    id: "company",
    label: "Company",
    options: [
      { value: "Google", label: "Google" },
      { value: "Razorpay", label: "Razorpay" },
      { value: "Stripe", label: "Stripe" },
      { value: "Atlassian", label: "Atlassian" },
      { value: "Swiggy", label: "Swiggy" },
      { value: "Figma", label: "Figma" },
      { value: "Notion", label: "Notion" },
      { value: "Cred", label: "Cred" },
      { value: "Zerodha", label: "Zerodha" },
    ],
  },
];

export const CANDIDATE_SORT_OPTIONS: DropdownOption[] = [
  { value: "newest", label: "Recently submitted" },
  { value: "oldest", label: "Oldest submitted" },
  { value: "name-asc", label: "Candidate name (A–Z)" },
  { value: "ctc-desc", label: "Expected CTC (High to Low)" },
  { value: "exp-desc", label: "Experience (High to Low)" },
  { value: "commission-desc", label: "Highest commission" },
];
