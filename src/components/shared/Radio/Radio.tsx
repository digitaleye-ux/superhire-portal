import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";
import styles from "./Radio.module.css";

export interface RadioProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  /** Visible label text. */
  label: string;
}

/**
 * Radio button — Figma node 424:3050. 16px control + label, single-select.
 * Renders a real <input type="radio"> for accessibility and grouping via name.
 */
export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
  { label, className, disabled, ...inputProps },
  ref
) {
  return (
    <label
      className={[styles.root, disabled ? styles.disabled : "", className]
        .filter(Boolean)
        .join(" ")}
    >
      <input
        ref={ref}
        type="radio"
        disabled={disabled}
        className={styles.input}
        {...inputProps}
      />
      <span className={styles.control} aria-hidden="true" />
      <span className={styles.label}>{label}</span>
    </label>
  );
});

export default Radio;
