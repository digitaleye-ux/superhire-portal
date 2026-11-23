import type { ReactNode } from "react";
import { SearchInput } from "@/components/shared/SearchInput";
import styles from "./PageHeader.module.css";

export interface PageHeaderSearch {
  /** Placeholder text for the search field. */
  placeholder?: string;
  /** Current value (controlled). Omit for uncontrolled. */
  value?: string;
  /** Fired on every change with the new value. */
  onChange?: (value: string) => void;
}

export interface PageHeaderProps {
  /** The page title (heading). */
  title: string;
  /** When provided, renders a search field on the right. */
  search?: PageHeaderSearch;
  /**
   * Optional trailing content (buttons, filters) rendered after the search.
   * Lets each page extend the header without changing this component.
   */
  actions?: ReactNode;
  className?: string;
}

/**
 * Page header — Figma node 444:5556. Title on the left, an optional search
 * field (and optional actions) on the right. Shared across portals.
 */
export function PageHeader({
  title,
  search,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <header className={[styles.header, className].filter(Boolean).join(" ")}>
      <div className={styles.row}>
        <h1 className={styles.title}>{title}</h1>

        {(search || actions) && (
          <div className={styles.right}>
            {search && (
              <SearchInput
                className={styles.search}
                placeholder={search.placeholder}
                value={search.value}
                onChange={
                  search.onChange
                    ? (e) => search.onChange?.(e.target.value)
                    : undefined
                }
              />
            )}
            {actions}
          </div>
        )}
      </div>
    </header>
  );
}

export default PageHeader;
