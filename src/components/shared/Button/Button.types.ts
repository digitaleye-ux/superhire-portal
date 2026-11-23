import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonVariant = "primary" | "secondary" | "tertiary";
export type ButtonSize = "xs" | "sm" | "md" | "lg";
export type ButtonState = "default" | "hover" | "focus" | "disabled";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual variant from the Bolt Design System (Figma node 97:563). Defaults to "primary". */
  variant?: ButtonVariant;
  /** Size token: xs (28px), sm (32px), md (36px), lg (40px). Defaults to "md". */
  size?: ButtonSize;
  /**
   * Optional visual state override for design system previews / static matrices.
   * In interactive use, omit this so CSS :hover, :focus-visible, and :disabled apply naturally.
   */
  state?: ButtonState;
  /** Text label (used if `children` is not provided). Defaults to "Button". */
  label?: string;
  /** Custom leading icon element. */
  leadingIcon?: ReactNode;
  /** Custom trailing icon element. */
  trailingIcon?: ReactNode;
  /** Whether to show the leading icon slot (uses Figma placeholder icon if `leadingIcon` is omitted). */
  showLeadingIcon?: boolean;
  /** Whether to show the trailing icon slot (uses Figma placeholder icon if `trailingIcon` is omitted). */
  showTrailingIcon?: boolean;
}
