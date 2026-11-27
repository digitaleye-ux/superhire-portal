import type { HTMLAttributes, ReactNode } from "react";

/**
 * Semantic milestone status variants:
 * - "completed": Milestone successfully passed (solid brand purple circle + white checkmark)
 * - "current": In-progress active milestone (purple ring with bullseye dot + soft lavender halo)
 * - "upcoming": Future milestone not yet reached (neutral muted ring)
 * - "warning": Paused or on-hold milestone (amber ring + pause icon)
 * - "danger": Unsuccessful, closed, or rejected milestone (red ring + X icon)
 */
export type MilestoneVariant =
  | "completed"
  | "current"
  | "upcoming"
  | "warning"
  | "danger";

export interface MilestoneProps extends Omit<HTMLAttributes<HTMLLIElement>, "title"> {
  /** Numerical step indicator (e.g. 1, 2, 3) */
  step?: number | string;
  /** Milestone title / label */
  title: ReactNode;
  /** State variant: "completed" | "current" | "upcoming" | "warning" | "danger" */
  variant: MilestoneVariant;
  /** Date or timestamp string rendered in text-style-label-3 tertiary */
  date?: ReactNode;
  /** Main description or active update text */
  description?: ReactNode;
  /** Completed outcome text (rendered when milestone is completed) */
  outcome?: ReactNode;
  /** Optional badge or tag displayed in the milestone header */
  badge?: ReactNode;
  /** Whether the connector spine below this milestone should be filled (brand purple) */
  connectorDone?: boolean;
  /** Whether this is the last milestone in the sequence (hides trailing track) */
  isLast?: boolean;
  /** Optional custom node override */
  customNode?: ReactNode;
  /** Optional extra content or action button */
  children?: ReactNode;
}

export interface MilestoneTimelineProps extends HTMLAttributes<HTMLOListElement> {
  /** Ordered list of Milestone items */
  children: ReactNode;
}

export interface MilestoneNodeProps extends HTMLAttributes<HTMLDivElement> {
  /** Node variant */
  variant: MilestoneVariant;
  /** Accessible label */
  ariaLabel?: string;
}
