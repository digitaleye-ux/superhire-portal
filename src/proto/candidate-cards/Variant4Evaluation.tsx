import { useState } from "react";
import {
  ArrowRightIcon,
  BriefcaseBusinessIcon,
  HandCoinsIcon,
  MapPinIcon,
} from "@/components/shared/Icon";
import { logoUrl } from "./data";
import type { CandidateItem } from "./data";
import styles from "./variants.module.css";

const STATUS_CLASS: Record<string, string> = {
  submitted: styles.statusNeutral,
  "under-review": styles.statusInfo,
  shortlisted: styles.statusBrand,
  interview: styles.statusWarning,
  offered: styles.statusSuccess,
  joined: styles.statusSuccess,
  "on-hold": styles.statusNeutral,
  rejected: styles.statusDanger,
};

const STATUS_LABEL: Record<string, string> = {
  submitted: "Submitted",
  "under-review": "Under review",
  shortlisted: "Shortlisted",
  interview: "Interview",
  offered: "Offered",
  joined: "Joined",
  "on-hold": "On hold",
  rejected: "Rejected",
};

/**
 * Variant 4: Evaluation Focus (Recruiter pipeline triage).
 * Header: Company logo + Company Name on left | Status Tag on right.
 * Body: Candidate Name (Primary Title) -> Role with Briefcase + Notice + Location (Meta).
 * Footer: Commission on left | Add another role on right.
 */
export function Variant4Evaluation({
  candidate,
  onAction,
}: {
  candidate: CandidateItem;
  onAction?: () => void;
}) {
  const [logoFailed, setLogoFailed] = useState(false);
  const statusClass = STATUS_CLASS[candidate.status] || styles.statusNeutral;
  const logo = candidate.domain ? logoUrl(candidate.domain) : "";
  const showLogo = Boolean(logo) && !logoFailed;

  return (
    <div
      className={styles.card}
      tabIndex={0}
      role="group"
      aria-label={`${candidate.name}, applied for ${candidate.role} at ${candidate.company}`}
    >
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          {showLogo ? (
            <img
              className={styles.companyLogo}
              src={logo}
              alt={`${candidate.company} logo`}
              onError={() => setLogoFailed(true)}
            />
          ) : (
            <span className={styles.companyLogoFallback} aria-hidden="true" />
          )}
          <span className={styles.company} title={candidate.company}>
            {candidate.company}
          </span>
        </div>
        <span className={`${styles.status} ${statusClass}`}>
          {STATUS_LABEL[candidate.status] || candidate.status}
        </span>
      </div>

      {/* Body: Candidate Name (Title) -> Role with Briefcase + Notice + Location (Meta) */}
      <div className={styles.body}>
        <div className={styles.main}>
          <div className={styles.titleArea}>
            <p className={styles.primaryTitle} title={candidate.name}>
              {candidate.name}
            </p>
          </div>

          <div className={styles.meta} title={`${candidate.role} · ${candidate.noticePeriod} · ${candidate.location}`}>
            <span className={styles.metaItem}>
              <BriefcaseBusinessIcon size="sm" className={styles.icon} />
              <strong className={styles.metaHighlight}>{candidate.role}</strong>
            </span>
            <span className={styles.metaSeparator}>·</span>
            <span className={styles.metaItem}>
              <span className={styles.metaText}>{candidate.noticePeriod} notice</span>
            </span>
            <span className={styles.metaSeparator}>·</span>
            <span className={styles.metaItem}>
              <MapPinIcon size="sm" className={styles.icon} />
              <span className={styles.metaText}>{candidate.location}</span>
            </span>
          </div>
        </div>

        <hr className={styles.divider} />

        {/* Footer: Hand-Coins Commission / shortlist + Hover "Add another role" */}
        <div className={styles.footer}>
          <span
            className={styles.commission}
            title={
              candidate.earningModel === "closure"
                ? "Earn per closure · Paid when candidate joins and completes one month"
                : "Earn per shortlist · Paid when candidate is shortlisted by employer"
            }
          >
            <HandCoinsIcon size="sm" className={styles.icon} />
            <span className={styles.commissionAmount}>{candidate.commission}</span>
            <span className={styles.commissionUnit}>
              {candidate.earningModel === "closure" ? "per closure" : "per shortlist"}
            </span>
          </span>
          <button
            type="button"
            className={styles.action}
            onClick={(e) => {
              e.stopPropagation();
              onAction?.();
            }}
          >
            <span className={styles.actionLabel}>Add another role</span>
            <ArrowRightIcon size="sm" className={styles.icon} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Variant4Evaluation;
