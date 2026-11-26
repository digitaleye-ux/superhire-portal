import { useState } from "react";
import { CheckIcon, ChevronDownIcon, PauseIcon, XIcon } from "@/components/shared/Icon";
import type { CandidateDetail, TimelineStage } from "@/proto/candidate-panel/data";
import s from "./ProgressVariants.module.css";

/**
 * Direction 3 — "Focus Stepper"
 * Axis: Segmented Progress Bar + Active Milestone Spotlight
 *
 * Designed for high-volume scanning:
 *   1. 6-segment horizontal progress bar shows overall status at a glance.
 *   2. Prominent Spotlight Card highlights the active stage, its date, and detailed note.
 *   3. Collapsible journey history for deep-dive auditing without clutter.
 */
export function ProgressFocusStepper({ detail }: { detail: CandidateDetail }) {
  const [historyOpen, setHistoryOpen] = useState(false);

  const isTerminalOrHold = (state: TimelineStage["state"]) =>
    state === "not-approved" ||
    state === "not-shortlisted" ||
    state === "interview-unsuccessful" ||
    state === "offer-declined" ||
    state === "withdrawn" ||
    state === "on-hold";

  // Find active milestone (current, on-hold, terminal, or final joined)
  const activeStage =
    detail.stages.find((st) => st.state === "current" || isTerminalOrHold(st.state)) ??
    detail.stages[detail.stages.length - 1];

  return (
    <div className={s.stepperTracker} aria-label="Hiring progress with segmented stepper">
      {/* Top Header */}
      <div className={s.stepperHeader}>
        <div className={s.stepperHeaderTitleRow}>
          <h3 className={s.stepperTitle}>Hiring progress</h3>
          <span className={s.stepperBadge}>{detail.progressHeadline}</span>
        </div>

        {/* 6-Segment Horizontal Progress Stepper Bar */}
        <div className={s.stepperSegments} role="progressbar" aria-valuenow={detail.milestonesReached} aria-valuemin={0} aria-valuemax={detail.totalMilestones}>
          {detail.stages.map((st) => {
            const isDone = st.state === "done";
            const isCurrent = st.step === activeStage.step;
            const isAlert = isTerminalOrHold(st.state);

            return (
              <div
                key={st.step}
                className={`${s.segmentItem} ${
                  isDone
                    ? s.segmentDone
                    : isCurrent
                    ? isAlert
                      ? s.segmentAlert
                      : s.segmentCurrent
                    : s.segmentUpcoming
                }`}
                title={`Step ${st.step}: ${st.label}`}
              >
                <div className={s.segmentBar} />
                <span className={s.segmentLabel}>
                  {isDone ? <CheckIcon size={10} strokeWidth={3} /> : st.step}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Prominent Active Milestone Spotlight */}
      <div className={`${s.spotlightCard} ${isTerminalOrHold(activeStage.state) ? s.spotlightCardAlert : ""}`}>
        <div className={s.spotlightHeader}>
          <div className={s.spotlightStageInfo}>
            <span className={s.spotlightStageEyebrow}>
              {activeStage.state === "done" && activeStage.step === 6
                ? "COMPLETED JOURNEY"
                : isTerminalOrHold(activeStage.state)
                ? "APPLICATION STATUS"
                : "CURRENT STAGE"}
            </span>
            <h4 className={s.spotlightTitle}>
              {activeStage.step}. {activeStage.label}
            </h4>
          </div>

          <div className={s.spotlightMeta}>
            {activeStage.date && (
              <span className={s.spotlightDate}>{activeStage.date}</span>
            )}
          </div>
        </div>

        <p className={s.spotlightDescription}>
          {activeStage.updateText || activeStage.outcome}
        </p>
      </div>

      {/* Collapsible Full Journey Log */}
      <div className={s.historySection}>
        <button
          type="button"
          className={s.historyToggleBtn}
          onClick={() => setHistoryOpen((v) => !v)}
          aria-expanded={historyOpen}
        >
          <span>{historyOpen ? "Hide milestone history" : "View all 6 milestones"}</span>
          <ChevronDownIcon
            size={12}
            style={{
              transform: historyOpen ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 150ms ease",
            }}
          />
        </button>

        {historyOpen && (
          <ol className={s.historyTimeline}>
            {detail.stages.map((st, idx) => {
              const isLast = idx === detail.stages.length - 1;
              const isDone = st.state === "done";
              const isCurrent = st.step === activeStage.step;
              const isAlert = isTerminalOrHold(st.state);

              return (
                <li key={st.step} className={s.historyItem}>
                  <div className={s.historyRail}>
                    <div
                      className={`${s.historyNode} ${
                        isDone
                          ? s.historyNodeDone
                          : isCurrent
                          ? s.historyNodeCurrent
                          : isAlert
                          ? s.historyNodeAlert
                          : s.historyNodeUpcoming
                      }`}
                    >
                      {isDone ? (
                        <CheckIcon size={10} strokeWidth={3} />
                      ) : st.state === "on-hold" ? (
                        <PauseIcon size={10} strokeWidth={2.5} />
                      ) : isAlert ? (
                        <XIcon size={10} strokeWidth={2.5} />
                      ) : (
                        <span>{st.step}</span>
                      )}
                    </div>
                    {!isLast && <div className={s.historyLine} />}
                  </div>

                  <div className={s.historyContent}>
                    <div className={s.historyHead}>
                      <span className={s.historyStepTitle}>
                        {st.step}. {st.label}
                      </span>
                      {st.date && <span className={s.historyDate}>{st.date}</span>}
                    </div>
                    {(st.outcome || st.updateText) && (
                      <p className={s.historyNote}>{st.outcome || st.updateText}</p>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </div>
  );
}
