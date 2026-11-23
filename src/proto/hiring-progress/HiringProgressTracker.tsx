import {
  CheckIcon,
  PauseIcon,
  XIcon,
} from "@/components/shared/Icon";
import type { CandidateDetail, TimelineStage } from "@/proto/candidate-panel/data";
import s from "./HiringProgressTracker.module.css";

interface HiringProgressTrackerProps {
  detail: CandidateDetail;
}

export function HiringProgressTracker({ detail }: HiringProgressTrackerProps) {
  const isTerminalOrHold = (state: TimelineStage["state"]) =>
    state === "not-approved" ||
    state === "not-shortlisted" ||
    state === "interview-unsuccessful" ||
    state === "offer-declined" ||
    state === "withdrawn" ||
    state === "on-hold";

  const getCardBadgeClass = (stage: TimelineStage) => {
    const label = (stage.badgeLabel ?? "").toLowerCase();
    if (
      stage.state === "on-hold" ||
      label.includes("action needed") ||
      label.includes("pending") ||
      label.includes("hold")
    ) {
      return s.badgeWarning;
    }
    if (isTerminalOrHold(stage.state) || label.includes("closed")) {
      return s.badgeDanger;
    }
    if (label.includes("completed") || stage.state === "done") {
      return s.badgeSuccess;
    }
    return s.badgeBrand;
  };

  return (
    <div className={s.tracker} aria-label="Candidate hiring journey progress">
      {/* Tracker Header */}
      <div className={s.header}>
        <h3 className={s.title}>Hiring progress</h3>
      </div>

      {/* 6 Milestones Vertical Timeline */}
      <ol className={s.timeline}>
        {detail.stages.map((stage) => {
          const isDone = stage.state === "done";
          const isCurrent = stage.state === "current";
          const isAlert = isTerminalOrHold(stage.state);
          const isUpcoming = stage.state === "upcoming";

          // Expand description for current active milestone, terminal alert outcome, or final Joined outcome
          const isExpanded =
            isCurrent ||
            isAlert ||
            (isDone && stage.step === detail.stages.length && Boolean(stage.updateText));

          return (
            <li key={stage.step} className={s.item}>
              {/* Vertical spine rail connecting nodes */}
              <div
                className={`${s.spineRail} ${isDone ? s.spineRailDone : ""}`}
                aria-hidden="true"
              />

              {/* Milestone node icon */}
              <div className={s.nodeWrapper}>
                {isDone ? (
                  <div className={`${s.node} ${s.nodeDone}`} aria-label="Completed">
                    <CheckIcon size={12} strokeWidth={3} />
                  </div>
                ) : isCurrent ? (
                  <div className={`${s.node} ${s.nodeCurrent}`} aria-label="Current stage">
                    <span className={s.nodeDot} />
                  </div>
                ) : stage.state === "on-hold" ? (
                  <div className={`${s.node} ${s.nodeWarning}`} aria-label="On hold">
                    <PauseIcon size={12} strokeWidth={2.5} />
                  </div>
                ) : isAlert ? (
                  <div className={`${s.node} ${s.nodeDanger}`} aria-label="Closed">
                    <XIcon size={12} strokeWidth={2.5} />
                  </div>
                ) : (
                  <div className={`${s.node} ${s.nodeUpcoming}`} aria-label="Upcoming" />
                )}
              </div>

              {/* Milestone content */}
              <div className={s.content}>
                {/* 1. Milestone Header (Title + Date/Badge) */}
                <div className={s.milestoneHeader}>
                  <span
                    className={
                      isUpcoming
                        ? s.stepTitleUpcoming
                        : isCurrent
                        ? s.stepTitleCurrent
                        : s.stepTitle
                    }
                  >
                    {stage.step}. {stage.label}
                  </span>

                  <div className={s.milestoneRight}>
                    {/* Date / timestamp when available */}
                    {stage.date && !stage.badgeLabel && (
                      <span className={s.stepDate}>{stage.date}</span>
                    )}

                    {/* Status badge when action, alert, or state label present */}
                    {stage.badgeLabel && (
                      <span className={`${s.badge} ${getCardBadgeClass(stage)}`}>
                        {stage.badgeLabel}
                      </span>
                    )}
                  </div>
                </div>

                {/* 2. Completed outcome description */}
                {isDone && !isExpanded && stage.outcome && (
                  <p className={s.stepOutcome}>{stage.outcome}</p>
                )}

                {/* 3. Active / Current milestone description (Clean typography, no card box) */}
                {isExpanded && stage.updateText && (
                  <div className={s.activeBody}>
                    <p className={s.stepDescription}>{stage.updateText}</p>
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
