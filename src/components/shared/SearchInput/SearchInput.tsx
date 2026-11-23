import type { InputHTMLAttributes } from "react";
import { SearchIcon } from "@/components/shared/Icon";
import styles from "./SearchInput.module.css";

export interface SearchInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  /** Placeholder text. */
  placeholder?: string;
  /** Accessible label (defaults to "Search"). Visually hidden. */
  ariaLabel?: string;
  /** Extra class for the wrapper. */
  className?: string;
}

/**
 * Search input — a leading search icon + text field. Figma node 443:5544.
 * Shared primitive: used in the page header and reusable across portals.
 */
export function SearchInput({
  placeholder = "Search",
  ariaLabel = "Search",
  className,
  ...inputProps
}: SearchInputProps) {
  return (
    <div className={[styles.field, className].filter(Boolean).join(" ")}>
      <SearchIcon size="sm" className={styles.icon} />
      <input
        type="search"
        className={styles.input}
        placeholder={placeholder}
        aria-label={ariaLabel}
        {...inputProps}
      />
    </div>
  );
}

export default SearchInput;
