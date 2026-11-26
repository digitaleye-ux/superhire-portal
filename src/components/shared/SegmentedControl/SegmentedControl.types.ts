import type { ReactNode } from "react";

export type SegmentedControlSize = "sm" | "md" | "lg";

export interface SegmentedControlOption<T = string> {
  /** Value representing this segment */
  value: T;
  /** Visible label text */
  label: string;
  /** Optional badge/count displayed next to the label */
  count?: number | string;
  /** Optional leading icon */
  icon?: ReactNode;
  /** Whether this individual option is disabled */
  disabled?: boolean;
}

export interface SegmentedControlProps<T = string> {
  /** Available options/segments */
  options: SegmentedControlOption<T>[];
  /** Currently selected value */
  value: T;
  /** Callback fired when selection changes */
  onChange: (value: T) => void;
  /** Size token variant. Defaults to "sm". */
  size?: SegmentedControlSize;
  /** Whether the control should span the full width of its parent */
  fullWidth?: boolean;
  /** Accessible label for the control group */
  ariaLabel?: string;
  /** Extra class name for the wrapper track */
  className?: string;
  /** Whether the whole control is disabled */
  disabled?: boolean;
}
