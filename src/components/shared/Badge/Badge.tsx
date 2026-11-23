import styles from "./Badge.module.css";

export type BadgeType =
  | "trending"
  | "priority"
  | "spotlight"
  | "just-in"
  | "closed";

export interface BadgeProps {
  /** Which badge variant to render. */
  type: BadgeType;
  /** Override the default label text for the variant. */
  children?: string;
  className?: string;
}

const DEFAULT_LABEL: Record<BadgeType, string> = {
  trending: "Trending",
  priority: "Priority",
  spotlight: "Spotlight",
  "just-in": "Just In",
  closed: "Closed",
};

const TYPE_CLASS: Record<BadgeType, string> = {
  trending: styles.trending,
  priority: styles.priority,
  spotlight: styles.spotlight,
  "just-in": styles.justIn,
  closed: styles.closed,
};

/**
 * Badge — Figma node 374:1871. A small status pill in one of five semantic
 * colors. Shared primitive, used on the Job Card and reusable elsewhere.
 */
export function Badge({ type, children, className }: BadgeProps) {
  return (
    <span
      className={[styles.badge, TYPE_CLASS[type], className]
        .filter(Boolean)
        .join(" ")}
    >
      {children ?? DEFAULT_LABEL[type]}
    </span>
  );
}

export default Badge;
