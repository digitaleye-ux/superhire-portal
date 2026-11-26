import { forwardRef } from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./Tab.module.css";

export interface TabProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "role"> {
  /** Visible label text. */
  label: string;
  /** Selected state (Figma "Active"). Hover is handled via CSS :hover. */
  active?: boolean;
  /** Optional count badge displayed next to the label. */
  count?: number | string;
  children?: ReactNode;
}

/**
 * Tab — Figma node 486:3426.
 * States: Default | Hover | Active (pressed) | Selected | Focus-visible | Disabled.
 */
export const Tab = forwardRef<HTMLButtonElement, TabProps>(function Tab(
  {
    label,
    active = false,
    count,
    className,
    type = "button",
    disabled,
    children,
    ...rest
  },
  ref
) {
  return (
    <button
      ref={ref}
      type={type}
      role="tab"
      aria-selected={active}
      disabled={disabled}
      className={[styles.root, active ? styles.active : "", className]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    >
      {children ?? (
        <>
          <span className={styles.label}>{label}</span>
          {count !== undefined && (
            <span className={styles.count}>{count}</span>
          )}
        </>
      )}
    </button>
  );
});

export default Tab;
