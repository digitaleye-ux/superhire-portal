import type { ActionsRequiredVariantProps } from "./ActionsRequiredVariants.types";
import { companyLogoUrl } from "@/components/recruiter/RecruiterDashboard/RecruiterDashboard.data";
import { ArrowRightIcon, CheckIcon } from "@/components/shared/Icon";
import s from "./ActionsRequiredVariants.module.css";

/**
 * VARIANT 2: Inbox Stack
 * Axis: Streamlined Task Queue - Single Container
 * High operational density. Consolidates separate wide cards into a single
 * task inbox container with hairline dividers, candidate avatar, inline blocker
 * description, and quick-action buttons on each row.
 */
export function Variant2InboxStack({
  actions,
  onEditCandidate,
  onDismissAction,
}: ActionsRequiredVariantProps) {
  if (actions.length === 0) return null;

  return (
    <div className={s.sectionRoot}>
      <div className={s.sectionHeader}>
        <h2 className={s.sectionTitle}>
          Action required <span className={s.countPill}>{actions.length}</span>
        </h2>
      </div>

      <div className={s.v2Container}>
        <div className={s.v2List}>
          {actions.map((act) => (
            <div key={act.id} className={s.v2Row}>
              {/* Candidate Identity */}
              <div className={s.v2CandidateCell}>
                <div className={s.v2Avatar}>{act.initials}</div>
                <div className={s.v2CandidateMeta}>
                  <div className={s.v2CandidateTitleRow}>
                    <span className={s.v2Name}>{act.candidateName}</span>
                    <img
                      src={companyLogoUrl(act.domain)}
                      alt={act.company}
                      style={{ width: 14, height: 14, borderRadius: 2, flexShrink: 0 }}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display = "none";
                      }}
                    />
                  </div>
                  <span className={s.v2Subline}>
                    {act.roleTitle} · {act.company}
                  </span>
                </div>
              </div>

              {/* Issue & Blocker Note */}
              <div className={s.v2IssueCell}>
                <div className={s.v2IssueHeader}>
                  <span className={s.v2IssueBadge}>{act.badgeLabel}</span>
                  <span style={{ fontSize: 11, color: "var(--semantics-text-tertiary)" }}>
                    {act.requestedAt}
                  </span>
                </div>
                <span className={s.v2IssueSnippet} title={act.description}>
                  {act.description}
                </span>
              </div>

              {/* Direct Actions */}
              <div className={s.v2ActionsCell}>
                <button
                  type="button"
                  className={s.btnPrimary}
                  onClick={() => onEditCandidate(act.candidateId, act.title)}
                >
                  <span>{act.ctaLabel}</span>
                  <ArrowRightIcon size="sm" />
                </button>

                <button
                  type="button"
                  className={s.v2DismissBtn}
                  onClick={() => onDismissAction(act.id)}
                  title={`Mark ${act.candidateName} as resolved`}
                  aria-label="Mark done"
                >
                  <CheckIcon size="sm" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
export default Variant2InboxStack;
