import type { ButtonHTMLAttributes, ReactNode } from "react";

export type IconButtonSize = "xs" | "sm" | "md" | "lg";
export type IconButtonVariant = "default" | "bordered" | "ghost";

export interface IconButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** The icon to display inside the circular frame. */
  icon?: ReactNode;
  /** Accessible label describing the button action (REQUIRED for screen readers). */
  ariaLabel: string;
  /**
   * Size variant:
   * - "xs" (28px, 12px icon) — compact card headers, table action columns
   * - "sm" (32px, 16px icon, default) — drawer headers, standard actions
   * - "md" (36px, 20px icon) — modal header close buttons
   * - "lg" (40px, 20px icon) — prominent action triggers
   */
  size?: IconButtonSize;
  /** Visual variant: "default" (bordered circular container) or "ghost" (borderless resting state). */
  variant?: IconButtonVariant;
  /** Whether the button represents an open menu / active toggle state. */
  active?: boolean;
  /** Optional custom class name. */
  className?: string;
  /** Child content if icon is passed as children instead of prop. */
  children?: ReactNode;
}
