import type { InputHTMLAttributes, ReactNode } from "react";

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "prefix"> {
  /** Visible label text. */
  label?: string;
  /** Whether to render the label. Defaults to true if `label` is provided. */
  showLabel?: boolean;
  /** Optional hint text displayed below the input. */
  hint?: string;
  /** Error message displayed below the input. Overrides hint and triggers error styles. */
  error?: string;
  /** Optional leading icon or element. */
  leadingIcon?: ReactNode;
  /** Optional trailing icon or element. */
  trailingIcon?: ReactNode;
  /** Optional text suffix (e.g. "Years", "Lakhs"). */
  suffix?: string;
  /** Extra class name for the wrapper element. */
  className?: string;
}
