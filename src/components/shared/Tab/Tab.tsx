import type { ButtonHTMLAttributes } from "react";
import styles from "./Tab.module.css";

export interface TabProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "role"> {
  /** Visible label text. */
  label: string;
  /** Selected state (Figma "Active"). Hover is handled via CSS :hover. */
  active?: boolean;
}

/**
 * Tab — Figma node 486:3426. States: Default, Hover (strong bottom border),
 * Active (link text + interactive bottom border).
 */
export function Tab({ label, active = false, className, type = "button", ...rest }: TabProps) {
  return (
    <button
      type={type}
      role="tab"
      aria-selected={active}
      className={[styles.root, active ? styles.active : "", className]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    >
      {label}
    </button>
  );
}

export default Tab;
