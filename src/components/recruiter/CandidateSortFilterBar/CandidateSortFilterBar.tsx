import { Dropdown } from "@/components/shared/Dropdown";
import {
  CANDIDATE_FILTER_OPTIONS,
  CANDIDATE_SORT_OPTIONS,
  type CandidateSortFilterBarProps,
} from "./CandidateSortFilterBar.types";
import styles from "@/components/recruiter/SortFilterBar/SortFilterBar.module.css";

/**
 * Candidate Sort & Filter bar — tailored specifically for the Track candidates page.
 * Provides multi-select filters for Status, Company, Experience, Notice Period, Expected CTC,
 * and Location, paired with single-select sorting by recency, candidate name, CTC, or commission.
 */
export function CandidateSortFilterBar({
  filters,
  onFiltersChange,
  sort,
  onSortChange,
  className,
}: CandidateSortFilterBarProps) {
  return (
    <div className={[styles.bar, className].filter(Boolean).join(" ")}>
      <div className={styles.filters}>
        {CANDIDATE_FILTER_OPTIONS.map(({ id, label, options }) => (
          <Dropdown
            key={id}
            variant="filter"
            size="sm"
            label={label}
            options={options}
            selected={filters[id]}
            onChange={(next) => onFiltersChange({ ...filters, [id]: next })}
            multiple
          />
        ))}
      </div>

      <div className={styles.sort}>
        <Dropdown
          variant="filter"
          size="sm"
          label="Recently submitted"
          options={CANDIDATE_SORT_OPTIONS}
          selected={sort ? [sort] : ["newest"]}
          onChange={(next) => onSortChange(next[0] ?? "newest")}
          multiple={false}
          singleShowsValue
          align="right"
        />
      </div>
    </div>
  );
}

export default CandidateSortFilterBar;
