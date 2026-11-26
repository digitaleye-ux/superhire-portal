import { forwardRef } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import styles from "./Badge.module.css";

export type BadgeType =
  | "trending"
  | "priority"
  | "spotlight"
  | "just-in"
  | "closed"
  | "success"
  | "warning"
  | "error"
  | "info"
  | "neutral";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** Which badge variant to render. */
  type: BadgeType;
  /** Override the default label text for the variant. */
  children?: ReactNode;
  className?: string;
  /** Optional leading status dot */
  dot?: boolean;
}

const DEFAULT_LABEL: Record<BadgeType, string> = {
  trending: "Trending",
  priority: "Priority",
  spotlight: "Spotlight",
  "just-in": "Just In",
  closed: "Closed",
  success: "Success",
  warning: "Warning",
  error: "Error",
  info: "Info",
  neutral: "Neutral",
};

const TYPE_CLASS: Record<BadgeType, string> = {
  trending: styles.trending,
  priority: styles.priority,
  spotlight: styles.spotlight,
  "just-in": styles.justIn,
  closed: styles.closed,
  success: styles.success,
  warning: styles.warning,
  error: styles.error,
  info: styles.info,
  neutral: styles.neutral,
};

/**
 * Badge — Figma node 374:1871. A small status pill in semantic colors.
 * Non-interactive display indicator.
 */
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { type, children, className, dot = false, ...rest },
  ref
) {
  return (
    <span
      ref={ref}
      className={[styles.badge, TYPE_CLASS[type], className]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    >
      {dot && <span className={styles.dot} aria-hidden="true" />}
      {children ?? DEFAULT_LABEL[type]}
    </span>
  );
});

export default Badge;
