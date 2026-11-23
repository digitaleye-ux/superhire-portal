import type { InputHTMLAttributes } from "react";
import { CheckIcon } from "@/components/shared/Icon";
import styles from "./Checkbox.module.css";

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  /** Visible label text. */
  label: string;
}

/**
 * Checkbox — Figma node 426:3084. 16px control + label, multi-select.
 * Renders a real <input type="checkbox"> for accessibility.
 */
export function Checkbox({ label, className, ...inputProps }: CheckboxProps) {
  return (
    <label className={[styles.root, className].filter(Boolean).join(" ")}>
      <input type="checkbox" className={styles.input} {...inputProps} />
      <span className={styles.control} aria-hidden="true">
        <CheckIcon size="xs" className={styles.check} />
      </span>
      <span className={styles.label}>{label}</span>
    </label>
  );
}

export default Checkbox;
