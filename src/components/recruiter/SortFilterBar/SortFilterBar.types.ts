import type { DropdownOption } from "@/components/shared/Dropdown";

/** The set of active filter selections, keyed by filter id. */
export interface FilterState {
  commission: string[];
  experience: string[];
  location: string[];
}

export interface SortFilterBarProps {
  /** Current filter selections. */
  filters: FilterState;
  /** Called when any filter changes, with the full next state. */
  onFiltersChange: (next: FilterState) => void;
  /** Current sort value (single). */
  sort: string;
  /** Called when the sort changes. */
  onSortChange: (value: string) => void;
  className?: string;
}

/** Filter option sets — mirror the Figma design. */
export const FILTER_OPTIONS: {
  id: keyof FilterState;
  label: string;
  options: DropdownOption[];
}[] = [
  {
    id: "commission",
    label: "Commission",
    options: [
      { value: "shortlist", label: "Earn per shortlist" },
      { value: "closure", label: "Earn per closure" },
    ],
  },
  {
    id: "experience",
    label: "Experience",
    options: [
      { value: "0", label: "0 years" },
      { value: "1-2", label: "1–2 years" },
      { value: "3-5", label: "3–5 years" },
      { value: "6-8", label: "6–8 years" },
      { value: "9+", label: "9+ years" },
    ],
  },
  {
    id: "location",
    label: "Location",
    options: [
      { value: "bengaluru", label: "Bengaluru" },
      { value: "hyderabad", label: "Hyderabad" },
      { value: "pune", label: "Pune" },
      { value: "chennai", label: "Chennai" },
      { value: "gurugram", label: "Gurugram" },
      { value: "remote", label: "Remote" },
    ],
  },
];

/** Sort options — single-select (radios). */
export const SORT_OPTIONS: DropdownOption[] = [
  { value: "recommended", label: "Recommended" },
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "highest-commission", label: "Highest commission" },
  { value: "highest-salary", label: "Highest salary" },
];
