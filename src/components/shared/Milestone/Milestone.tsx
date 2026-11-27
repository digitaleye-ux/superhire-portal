import { forwardRef } from "react";
import { CheckIcon } from "@/components/shared/Icon";
import type {
  MilestoneNodeProps,
  MilestoneProps,
  MilestoneTimelineProps,
  MilestoneVariant,
} from "./Milestone.types";
import styles from "./Milestone.module.css";

const NODE_CLASS_MAP: Record<MilestoneVariant, string> = {
  completed: styles.nodeCompleted,
  current: styles.nodeCurrent,
  upcoming: styles.nodeUpcoming,
  warning: styles.nodeWarning,
  danger: styles.nodeDanger,
};

const TITLE_CLASS_MAP: Record<MilestoneVariant, string> = {
  completed: styles.titleCompleted,
  current: styles.titleCurrent,
  upcoming: styles.titleUpcoming,
  warning: styles.titleWarning,
  danger: styles.titleDanger,
};

/**
 * MilestoneNode primitive rendering the checkmark or semantic bullseye indicator.
 * Paused and rejected states rely on color (amber/danger red) rather than icons;
 * the tag explains the outcome.
 */
export const MilestoneNode = forwardRef<HTMLDivElement, MilestoneNodeProps>(
  function MilestoneNode({ variant, ariaLabel, className, ...rest }, ref) {
    const nodeClass = [
      styles.node,
      NODE_CLASS_MAP[variant],
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div
        ref={ref}
        className={nodeClass}
        aria-label={ariaLabel ?? variant}
        {...rest}
      >
        {variant === "completed" && (
          <CheckIcon size={12} strokeWidth={2.5} />
        )}
        {variant === "current" && (
          <span className={styles.nodeDot} />
        )}
        {variant === "warning" && (
          <span className={`${styles.nodeDot} ${styles.nodeDotWarning}`} />
        )}
        {variant === "danger" && (
          <span className={`${styles.nodeDot} ${styles.nodeDotDanger}`} />
        )}
      </div>
    );
  }
);

/**
 * MilestoneTimeline container (accessible <ol> element).
 */
export const MilestoneTimeline = forwardRef<
  HTMLOListElement,
  MilestoneTimelineProps
>(function MilestoneTimeline({ children, className, ...rest }, ref) {
  const rootClass = [styles.timeline, className].filter(Boolean).join(" ");
  return (
    <ol ref={ref} className={rootClass} {...rest}>
      {children}
    </ol>
  );
});

/**
 * Milestone item component representing a single lifecycle stage.
 */
export const Milestone = forwardRef<HTMLLIElement, MilestoneProps>(
  function Milestone(
    {
      step,
      title,
      variant,
      date,
      description,
      outcome,
      badge,
      connectorDone,
      isLast = false,
      customNode,
      children,
      className,
      ...rest
    },
    ref
  ) {
    const isConnectorDone = connectorDone ?? variant === "completed";

    const itemClass = [styles.item, className].filter(Boolean).join(" ");

    const titleClass = TITLE_CLASS_MAP[variant];

    return (
      <li
        ref={ref}
        className={itemClass}
        aria-current={variant === "current" ? "step" : undefined}
        {...rest}
      >
        {/* Connecting spine rail */}
        {!isLast && (
          <div
            className={`${styles.spineRail} ${
              isConnectorDone ? styles.spineRailDone : ""
            }`}
            aria-hidden="true"
          />
        )}

        {/* Milestone Node */}
        <div className={styles.nodeWrapper}>
          {customNode ?? <MilestoneNode variant={variant} />}
        </div>

        {/* Milestone Content Area */}
        <div className={styles.content}>
          {/* Header (Title + Date/Badge) */}
          <div className={styles.header}>
            <span className={styles.titleArea}>
              <span className={titleClass}>
                {step !== undefined && `${step}. `}
                {title}
              </span>
            </span>

            <div className={styles.rightArea}>
              {badge}
              {date && <span className={styles.date}>{date}</span>}
            </div>
          </div>

          {/* Completed Outcome Description */}
          {variant === "completed" && outcome && (
            <p className={styles.outcome}>{outcome}</p>
          )}

          {/* Description / Active update text */}
          {(description || children) && (
            <div className={styles.body}>
              {description && (
                <p className={styles.description}>{description}</p>
              )}
              {children}
            </div>
          )}
        </div>
      </li>
    );
  }
);

export default Milestone;
