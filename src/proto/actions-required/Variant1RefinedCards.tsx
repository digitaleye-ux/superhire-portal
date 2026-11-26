import type { ActionsRequiredVariantProps } from "./ActionsRequiredVariants.types";
import { companyLogoUrl } from "@/components/recruiter/RecruiterDashboard/RecruiterDashboard.data";
import { Badge } from "@/components/shared/Badge";
import { Button } from "@/components/shared/Button";
import { ArrowRightIcon, CheckIcon } from "@/components/shared/Icon";
import s from "./ActionsRequiredVariants.module.css";

/**
 * VARIANT 1: Refined Cards
 * Strict alignment to Bolt Design System foundations:
 * - Spacing: Bolt spatial scale (4px, 8px, 12px, 16px, 20px)
 * - Typescale: .text-style-heading-4 (title), .text-style-label-2 (candidate), .text-style-label-3 (role/company), .text-style-caption (time/desc)
 * - Colors: --semantics-surface-primary, --semantics-border-default, --semantics-border-warning, --semantics-text-*
 * - Buttons: Design System <Button> component (variant primary/secondary, size sm)
 * - Tags: Design System <Badge> component (type priority with --semantics-badge-urgent-*)
 */
export function Variant1RefinedCards({
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

      <div className={s.v1Grid}>
        {actions.map((act) => (
          <article key={act.id} className={s.v1Card}>
            <div className={s.v1Top}>
              <div className={s.v1MetaRow}>
                <Badge type="priority" className={s.v1Badge}>
                  {act.badgeLabel}
                </Badge>
                <span className={s.v1Time}>{act.requestedAt}</span>
              </div>

              <div className={s.v1CandidateRow}>
                <img
                  src={companyLogoUrl(act.domain)}
                  alt={act.company}
                  className={s.v1CompanyLogo}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = "none";
                  }}
                />
                <div className={s.v1CandidateInfo}>
                  <span className={s.v1CandidateName}>{act.candidateName}</span>
                  <span className={s.v1RoleCompany}>
                    {act.roleTitle} · {act.company}
                  </span>
                </div>
              </div>

              <p className={s.v1IssueSummary} title={act.title}>
                {act.title}
              </p>
            </div>

            <div className={s.v1Footer}>
              <Button
                variant="primary"
                size="sm"
                trailingIcon={<ArrowRightIcon size="xs" />}
                onClick={() => onEditCandidate(act.candidateId, act.title)}
              >
                {act.ctaLabel}
              </Button>

              <Button
                variant="secondary"
                size="sm"
                leadingIcon={<CheckIcon size="xs" />}
                onClick={() => onDismissAction(act.id)}
                aria-label={`Mark ${act.candidateName} request as resolved`}
              >
                Mark done
              </Button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
export default Variant1RefinedCards;
