import type { ActionsRequiredVariantProps } from "./ActionsRequiredVariants.types";
import { companyLogoUrl } from "@/components/recruiter/RecruiterDashboard/RecruiterDashboard.data";
import { ArrowRightIcon, CheckIcon } from "@/components/shared/Icon";
import { AlertCircle } from "lucide-react";
import s from "./ActionsRequiredVariants.module.css";

/**
 * VARIANT 3: Split Callout
 * Axis: Contextual Split - High-Impact Vetting Callout
 * Asymmetric 2-column split that separates candidate background and vetting review notes
 * (left) from a dedicated resolution bay (right) highlighting why it's blocked and what happens next.
 */
export function Variant3SplitCallout({
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

      <div className={s.v3Stack}>
        {actions.map((act) => (
          <article key={act.id} className={s.v3Card}>
            {/* Left Context Column */}
            <div className={s.v3ContextSide}>
              <div className={s.v3ContextHead}>
                <div className={s.v3Profile}>
                  <img
                    src={companyLogoUrl(act.domain)}
                    alt={act.company}
                    className={s.v3CompanyLogo}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = "none";
                    }}
                  />
                  <div className={s.v3CandidateMeta}>
                    <span className={s.v3CandidateName}>{act.candidateName}</span>
                    <span className={s.v3RoleSub}>
                      {act.roleTitle} · {act.company}
                    </span>
                  </div>
                </div>

                <span style={{ fontSize: 12, color: "var(--semantics-text-tertiary)" }}>
                  {act.requestedAt}
                </span>
              </div>

              <div className={s.v3ReviewBox}>
                <span className={s.v3ReviewBoxLabel}>
                  <AlertCircle size={13} />
                  SuperHire Vetting Note · {act.badgeLabel}
                </span>
                <p className={s.v3ReviewBoxText}>{act.description}</p>
              </div>
            </div>

            {/* Right Action Bay */}
            <div className={s.v3ActionBay}>
              <div className={s.v3ActionPrompt}>
                <span className={s.v3ActionStatus}>Forwarding Paused</span>
                <p className={s.v3ActionHint}>
                  Resolve this request to clear SuperHire vetting and submit to {act.company}.
                </p>
              </div>

              <div className={s.v3ActionButtons}>
                <button
                  type="button"
                  className={s.btnPrimary}
                  style={{ width: "100%" }}
                  onClick={() => onEditCandidate(act.candidateId, act.title)}
                >
                  <span>{act.ctaLabel}</span>
                  <ArrowRightIcon size="sm" />
                </button>

                <button
                  type="button"
                  className={s.btnSecondary}
                  style={{ width: "100%" }}
                  onClick={() => onDismissAction(act.id)}
                >
                  <CheckIcon size="sm" />
                  <span>Mark resolved</span>
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
export default Variant3SplitCallout;
