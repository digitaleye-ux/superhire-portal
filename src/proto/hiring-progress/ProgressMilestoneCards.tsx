import { ArrowRightIcon, CheckIcon } from "@/components/shared/Icon";
import type { LatestUpdateInfo, TimelineStage } from "@/proto/candidate-panel/data";
import s from "./ProgressVariants.module.css";

/**
 * Direction 3 — "Milestone Rail"
 * Axis: Segmented Milestone Cards & Structured Disclosure
 *
 * Each stage is represented as a structured card in a stack.
 * The active stage gets a prominent spotlight treatment with step numbers,
 * while past stages provide a clean receipt of completion and upcoming
 * stages remain quietly in the background.
 */
export function ProgressMilestoneCards({
  stages,
  latest,
}: {
  stages: TimelineStage[];
  latest?: LatestUpdateInfo;
}) {
  return (
    <div className={s.cardsContainer} aria-label="Milestone stages">
      {stages.map((st, idx) => {
        const stepNum = idx + 1;
        const isDone = st.state === "done";
        const isCurrent = st.state === "current";
        const isUpcoming = st.state === "upcoming";

        return (
          <div
            key={st.key}
            className={`${s.milestoneCard} ${
              isDone ? s.milestoneCardDone : ""
            } ${isCurrent ? s.milestoneCardCurrent : ""} ${
              isUpcoming ? s.milestoneCardUpcoming : ""
            }`}
          >
            <div className={s.milestoneCardHead}>
              <div className={s.milestoneLeft}>
                <span className={s.milestoneStepNum}>
                  {isDone ? <CheckIcon size={12} /> : stepNum}
                </span>
                <span className={s.milestoneTitle}>{st.label}</span>
              </div>

              <div className={s.milestoneMeta}>
                {isCurrent && (
                  <span className={s.milestoneDuration}>
                    {latest?.waitingDuration || "In progress"}
                  </span>
                )}
                {st.date && <span className={s.milestoneDate}>{st.date}</span>}
              </div>
            </div>

            {/* Current stage narrative body */}
            {isCurrent && latest && (
              <>
                <p className={s.milestoneBody}>{latest.updateText}</p>
                {latest.nextAction && (
                  <div className={s.milestoneNextFooter}>
                    <ArrowRightIcon size={13} className={s.milestoneNextArrow} />
                    <span>Next: {latest.nextAction}</span>
                  </div>
                )}
              </>
            )}

            {/* Done stage summary */}
            {isDone && st.update && (
              <p className={s.milestoneBody}>{st.update}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
