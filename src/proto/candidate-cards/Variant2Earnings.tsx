import {
  ArrowRightIcon,
  BriefcaseBusinessIcon,
  HandCoinsIcon,
  IndianRupeeIcon,
  LinkedinIcon,
  Link2Icon,
  MapPinIcon,
} from "@/components/shared/Icon";
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
 * Header: Initials Avatar + Candidate Name on left | Status Tag on right
 * Body: "for {Role} at {Company}" ('for'/'at' tertiary, 'role'/'company' primary)
 */
export function Variant2Earnings({
  candidate,
  onAction,
}: {
  candidate: CandidateItem;
  onAction?: () => void;
}) {
  const statusClass = STATUS_CLASS[candidate.status] || styles.statusNeutral;
  const curNum = candidate.currentCtc?.replace(/^₹\s*/, "").match(/[\d.]+/)?.[0];
  const expNum = candidate.expectedCtc?.replace(/^₹\s*/, "").match(/[\d.]+/)?.[0];
  const ctcText = candidate.ctcRange?.replace(/^₹\s*/, "") || (curNum && expNum ? `${curNum}–${expNum} LPA` : candidate.expectedCtc.replace(/^₹\s*/, ""));

  return (
    <div
      className={styles.card}
      tabIndex={0}
      role="group"
      aria-label={`${candidate.name}, applied for ${candidate.role} at ${candidate.company}`}
    >
      {/* Header: Candidate Name on left + LinkedIn & Resume icons | Status Tag on right */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.primaryTitle} style={{ fontSize: 14 }} title={candidate.name}>
            {candidate.name}
          </span>
          <div className={styles.headerActions}>
            <button
              type="button"
              className={styles.headerActionBtn}
              aria-label={`View ${candidate.name}'s LinkedIn profile`}
              title="View LinkedIn profile"
              onClick={(e) => {
                e.stopPropagation();
                window.open(`https://linkedin.com/in/${candidate.name.toLowerCase().replace(/\s+/g, "")}`, "_blank", "noopener,noreferrer");
              }}
            >
              <LinkedinIcon size="sm" />
            </button>
            <button
              type="button"
              className={styles.headerActionBtn}
              aria-label={`View ${candidate.name}'s resume`}
              title="View resume"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <Link2Icon size="sm" />
            </button>
          </div>
        </div>
        <span className={`${styles.status} ${statusClass}`}>
          {STATUS_LABEL[candidate.status] || candidate.status}
        </span>
      </div>

      {/* Body: 'for {role} at {company}' -> Clean Meta */}
      <div className={styles.body}>
        <div className={styles.main}>
          <div className={styles.titleArea}>
            <p className={styles.roleAndCompany} title={`Applied for ${candidate.role} at ${candidate.company}`}>
              <span style={{ color: "var(--semantics-text-tertiary)", fontWeight: "normal" }}>for </span>
              <span style={{ color: "var(--semantics-text-primary)", fontWeight: "medium" }}>{candidate.role}</span>
              <span style={{ color: "var(--semantics-text-tertiary)", fontWeight: "normal" }}> at </span>
              <span style={{ color: "var(--semantics-text-primary)", fontWeight: "medium" }}>{candidate.company}</span>
            </p>
          </div>

          <div className={styles.meta}>
            <span className={styles.metaItem}>
              <IndianRupeeIcon size="sm" className={styles.icon} />
              <span className={styles.metaText}>{ctcText}</span>
            </span>
            <span className={styles.metaSeparator}>·</span>
            <span className={styles.metaItem}>
              <BriefcaseBusinessIcon size="sm" className={styles.icon} />
              <span className={styles.metaText}>{candidate.experience}</span>
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

export default Variant2Earnings;
