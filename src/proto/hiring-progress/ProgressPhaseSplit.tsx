import { CheckIcon, PauseIcon, XIcon, SparklesIcon, BriefcaseBusinessIcon } from "@/components/shared/Icon";
import type { CandidateDetail, TimelineStage } from "@/proto/candidate-panel/data";
import s from "./ProgressVariants.module.css";

/**
 * Direction 2 — "Phase Split"
 * Axis: Two-Phase Operational Architecture
 *
 * Visually groups the 6 milestones into SuperHire's 2 operational phases:
 *   Phase 1: Candidate Delivery (Steps 1–3: Double Vetting & Shortlist handoff)
 *   Phase 2: Employer Direct Loop (Steps 4–6: Direct candidate coordination)
 *
 * Clarifies platform accountability vs employer execution at a glance.
 */
export function ProgressPhaseSplit({ detail }: { detail: CandidateDetail }) {
  const isTerminalOrHold = (state: TimelineStage["state"]) =>
    state === "not-approved" ||
    state === "not-shortlisted" ||
    state === "interview-unsuccessful" ||
    state === "offer-declined" ||
    state === "withdrawn" ||
    state === "on-hold";

  const phase1Stages = detail.stages.slice(0, 3);
  const phase2Stages = detail.stages.slice(3, 6);

  const phase1Complete = phase1Stages.every((s) => s.state === "done");
  const phase1Active = phase1Stages.some((s) => s.state === "current");

  const renderStage = (stage: TimelineStage, isLastInPhase: boolean) => {
    const isDone = stage.state === "done";
    const isCurrent = stage.state === "current";
    const isAlert = isTerminalOrHold(stage.state);
    const isUpcoming = stage.state === "upcoming";
    const isExpanded =
      isCurrent ||
      isAlert ||
      (isDone && stage.step === detail.stages.length && Boolean(stage.updateText));

    return (
      <div key={stage.step} className={s.phaseItem}>
        <div className={s.phaseSpineRail}>
          <div
            className={`${s.phaseNode} ${
              isDone
                ? s.phaseNodeDone
                : isCurrent
                ? s.phaseNodeCurrent
                : stage.state === "on-hold"
                ? s.phaseNodeWarning
                : isAlert
                ? s.phaseNodeDanger
                : s.phaseNodeUpcoming
            }`}
          >
            {isDone ? (
              <CheckIcon size={12} strokeWidth={3} />
            ) : isCurrent ? (
              <span className={s.phaseNodeDot} />
            ) : stage.state === "on-hold" ? (
              <PauseIcon size={12} strokeWidth={2.5} />
            ) : isAlert ? (
              <XIcon size={12} strokeWidth={2.5} />
            ) : null}
          </div>
          {!isLastInPhase && (
            <div
              className={`${s.phaseLine} ${isDone ? s.phaseLineDone : ""}`}
              aria-hidden="true"
            />
          )}
        </div>

        <div className={s.phaseContent}>
          <div className={s.phaseHeaderRow}>
            <span
              className={
                isUpcoming
                  ? s.phaseTitleUpcoming
                  : isCurrent
                  ? s.phaseTitleCurrent
                  : s.phaseTitle
              }
            >
              {stage.step}. {stage.label}
            </span>

            {stage.badgeLabel ? (
              <span className={s.phaseBadge}>{stage.badgeLabel}</span>
            ) : stage.date ? (
              <span className={s.phaseDate}>{stage.date}</span>
            ) : isUpcoming ? (
              <span className={s.phaseUpcomingTag}>Upcoming</span>
            ) : null}
          </div>

          {/* Completed outcome description */}
          {isDone && !isExpanded && stage.outcome && (
            <p className={s.phaseOutcome}>{stage.outcome}</p>
          )}

          {/* Active stage description */}
          {isExpanded && stage.updateText && (
            <p className={s.phaseDescription}>{stage.updateText}</p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={s.phaseSplitTracker} aria-label="Hiring progress by operational phases">
      {/* Overall Header */}
      <div className={s.phaseOverallHeader}>
        <h3 className={s.phaseOverallTitle}>Hiring progress</h3>
        <span className={s.phaseOverallBadge}>{detail.progressHeadline}</span>
      </div>

      {/* Phase 1 Box: Double-Vetting Delivery */}
      <section className={`${s.phaseCard} ${phase1Complete ? s.phaseCardDone : ""}`}>
        <div className={s.phaseCardHeader}>
          <div className={s.phaseMetaGroup}>
            <span className={s.phasePill}>Phase 1</span>
            <div className={s.phaseTitles}>
              <h4 className={s.phaseHeading}>Candidate Delivery</h4>
              <p className={s.phaseSubtitle}>Double-vetted and handed off to employer</p>
            </div>
          </div>
          {phase1Complete ? (
            <span className={s.phaseStatusSuccess}>
              <SparklesIcon size="xs" />
              <span>Double vetting complete</span>
            </span>
          ) : phase1Active ? (
            <span className={s.phaseStatusBrand}>Vetting in progress</span>
          ) : null}
        </div>

        <div className={s.phaseList}>
          {phase1Stages.map((st, i) => renderStage(st, i === phase1Stages.length - 1))}
        </div>
      </section>

      {/* Phase 2 Box: Employer Direct Process */}
      <section className={s.phaseCard}>
        <div className={s.phaseCardHeader}>
          <div className={s.phaseMetaGroup}>
            <span className={s.phasePill}>Phase 2</span>
            <div className={s.phaseTitles}>
              <h4 className={s.phaseHeading}>Employer Direct Process</h4>
              <p className={s.phaseSubtitle}>Direct interview scheduling, offers & joining</p>
            </div>
          </div>
          <span className={s.phaseStatusNeutral}>
            <BriefcaseBusinessIcon size="xs" />
            <span>Direct with candidate</span>
          </span>
        </div>

        <div className={s.phaseList}>
          {phase2Stages.map((st, i) => renderStage(st, i === phase2Stages.length - 1))}
        </div>
      </section>
    </div>
  );
}
