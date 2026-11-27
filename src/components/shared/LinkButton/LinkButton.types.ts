import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

export type LinkButtonVariant = "brand" | "neutral" | "danger";
export type LinkButtonSize = "sm" | "md" | "lg";
export type LinkButtonUnderline = "none" | "hover" | "always";

export interface LinkButtonBaseProps {
  /** Visual variant from design system tokens. Defaults to "brand". */
  variant?: LinkButtonVariant;
  /** Size token: sm (12px), md (14px, default), lg (16px). */
  size?: LinkButtonSize;
  /** Underline decoration behavior. Defaults to "none". */
  underline?: LinkButtonUnderline;
  /** Convenience shortcut: appends a trailing ArrowRightIcon with directional glide. */
  arrow?: boolean;
  /** Custom leading icon element. */
  leadingIcon?: ReactNode;
  /** Custom trailing icon element. Overrides `arrow` if both provided. */
  trailingIcon?: ReactNode;
  /** Content label or inline nodes. */
  children?: ReactNode;
  /** Custom additional class names. */
  className?: string;
  /** Disabled state. */
  disabled?: boolean;
}

export type LinkButtonAsButtonProps = LinkButtonBaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    as?: "button";
    href?: never;
  };

export type LinkButtonAsAnchorProps = LinkButtonBaseProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    as: "a";
    href: string;
  };

export type LinkButtonProps = LinkButtonAsButtonProps | LinkButtonAsAnchorProps;
