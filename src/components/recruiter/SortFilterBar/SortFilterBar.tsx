import { Dropdown } from "@/components/shared/Dropdown";
import {
  FILTER_OPTIONS,
  SORT_OPTIONS,
  type SortFilterBarProps,
} from "./SortFilterBar.types";
import styles from "./SortFilterBar.module.css";

/**
 * Sort & filter bar — Figma node 438:5270. A row of multi-select filter
 * dropdowns on the left and a single-select sort dropdown on the right.
 * Controlled: owns no state, lifts selections via callbacks.
 */
export function SortFilterBar({
  filters,
  onFiltersChange,
  sort,
  onSortChange,
  className,
}: SortFilterBarProps) {
  return (
    <div className={[styles.bar, className].filter(Boolean).join(" ")}>
      <div className={styles.filters}>
        {FILTER_OPTIONS.map(({ id, label, options }) => (
          <Dropdown
            key={id}
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
          label="Recommended"
          options={SORT_OPTIONS}
          selected={sort ? [sort] : []}
          onChange={(next) => onSortChange(next[0] ?? "")}
          multiple={false}
          singleShowsValue
          align="right"
        />
      </div>
    </div>
  );
}

export default SortFilterBar;
