import { useState } from "react";
import { Clock } from "lucide-react";
import { ChevronDownIcon } from "@/components/shared/Icon";
import type { LatestUpdateInfo, TimelineStage } from "@/proto/candidate-panel/data";
import s from "./ProgressVariants.module.css";

/**
 * Direction 2 — "Action Dossier"
 * Axis: Triage & Ownership First
 *
 * Promotes the active stage into a prominent Command Card highlighting SLA,
 * ownership ("ball with"), and next action, paired with a compact horizontal
 * 6-stage stepper that eliminates vertical scrolling.
 */
export function ProgressActionDossier({
  stages,
  latest,
  companyName = "Employer",
}: {
  stages: TimelineStage[];
  latest?: LatestUpdateInfo;
  companyName?: string;
}) {
  const [historyOpen, setHistoryOpen] = useState(false);
  const currentStage = stages.find((s) => s.state === "current") || stages[0];
  const completedStages = stages.filter((s) => s.state === "done");

  return (
    <div className={s.dossierContainer}>
      {/* 1. Active Stage Command Card */}
      <div className={s.commandCard}>
        <div className={s.commandHeader}>
          <div className={s.commandTitleGroup}>
            <h4 className={s.commandTitle}>{currentStage.label}</h4>
            <span className={s.commandDurationChip}>
              <Clock size={12} />
              <span>{latest?.waitingDuration || "Active"}</span>
            </span>
          </div>
          <span className={s.ownerBadge}>Action: {companyName}</span>
        </div>

        <p className={s.commandBody}>
          {latest?.updateText || currentStage.update || "Stage in progress."}
        </p>

        {latest?.nextAction && (
          <div className={s.commandNextRow}>
            <div className={s.commandNextLeft}>
              <span className={s.commandNextLabel}>Next step:</span>
              <span className={s.commandNextText} title={latest.nextAction}>
                {latest.nextAction}
              </span>
            </div>
            <span className={s.commandSlaTag}>48h SLA</span>
          </div>
        )}
      </div>

      {/* 2. Horizontal 6-Stage Progress Stepper */}
      <div className={s.stepperBar} aria-label="Pipeline progression">
        {stages.map((st) => {
          const isDone = st.state === "done";
          const isCurrent = st.state === "current";
          return (
            <div
              key={st.key}
              className={`${s.stepperItem} ${isDone ? s.stepperItemDone : ""} ${
                isCurrent ? s.stepperItemCurrent : ""
              }`}
              title={`${st.label} (${st.state})`}
            >
              <div className={s.stepperTrack} />
              <span className={s.stepperLabel}>
                {isDone ? `✓ ${st.label.replace("Profile ", "")}` : st.label.replace("Profile ", "")}
              </span>
            </div>
          );
        })}
      </div>

      {/* 3. Collapsible Completed Milestones */}
      {completedStages.length > 0 && (
        <>
          <button
            type="button"
            className={s.historyToggle}
            onClick={() => setHistoryOpen((v) => !v)}
            aria-expanded={historyOpen}
          >
            <ChevronDownIcon
              size={14}
              style={{
                transform: historyOpen ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 150ms ease",
              }}
            />
            <span>
              {historyOpen
                ? "Hide completed history"
                : `View completed history (${completedStages.length})`}
            </span>
          </button>

          {historyOpen && (
            <div className={s.historyList}>
              {completedStages.map((st) => (
                <div key={st.key} className={s.historyItem}>
                  <span className={s.historyItemName}>{st.label}</span>
                  <span className={s.historyItemDate}>{st.date || "Completed"}</span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
