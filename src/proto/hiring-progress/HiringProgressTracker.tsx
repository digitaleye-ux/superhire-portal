import { Milestone, MilestoneTimeline, type MilestoneVariant } from "@/components/shared/Milestone";
import type { CandidateDetail, TimelineStage } from "@/proto/candidate-panel/data";
import s from "./HiringProgressTracker.module.css";

interface HiringProgressTrackerProps {
  detail: CandidateDetail;
}

function resolveMilestoneVariant(state: TimelineStage["state"]): MilestoneVariant {
  if (state === "done") return "completed";
  if (state === "current") return "current";
  if (state === "on-hold") return "warning";
  if (
    state === "not-approved" ||
    state === "not-shortlisted" ||
    state === "interview-unsuccessful" ||
    state === "offer-declined" ||
    state === "withdrawn"
  ) {
    return "danger";
  }
  return "upcoming";
}

export function HiringProgressTracker({ detail }: HiringProgressTrackerProps) {
  return (
    <div className={s.tracker} aria-label="Candidate hiring journey progress">
      {/* Tracker Header */}
      <div className={s.header}>
        <h3 className={s.title}>Hiring progress</h3>
      </div>

      {/* 6 Milestones Vertical Timeline using Bolt Milestone component */}
      <MilestoneTimeline>
        {detail.stages.map((stage, idx) => {
          const isLast = idx === detail.stages.length - 1;
          const variant = resolveMilestoneVariant(stage.state);
          const isDone = variant === "completed";
          const isCurrent = variant === "current";
          const isAlert = variant === "danger" || variant === "warning";

          // Expand description for current active milestone, terminal alert outcome, or final Joined outcome
          const isExpanded =
            isCurrent ||
            isAlert ||
            (isDone && stage.step === detail.stages.length && Boolean(stage.updateText));

          return (
            <Milestone
              key={stage.step}
              step={stage.step}
              title={stage.label}
              variant={variant}
              date={stage.date}
              outcome={isDone && !isExpanded ? stage.outcome : undefined}
              description={isExpanded ? stage.updateText : undefined}
              connectorDone={isDone}
              isLast={isLast}
            />
          );
        })}
      </MilestoneTimeline>
    </div>
  );
}

export default HiringProgressTracker;
