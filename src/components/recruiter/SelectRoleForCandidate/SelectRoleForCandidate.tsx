import { useState } from "react";
import { Badge } from "@/components/shared/Badge";
import { Button } from "@/components/shared/Button";
import { IconButton } from "@/components/shared/IconButton";
import {
  ArrowRightIcon,
  BriefcaseBusinessIcon,
  HandCoinsIcon,
  IndianRupeeIcon,
  MapPinIcon,
  XIcon,
} from "@/components/shared/Icon";
import type { ClaimedRoleItem, SelectRoleForCandidateProps } from "./SelectRoleForCandidate.types";
import styles from "./SelectRoleForCandidate.module.css";

function logoUrl(domain: string): string {
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
}

export function SelectRoleForCandidate({
  candidate,
  claimedJobs,
  existingSubmissions = [],
  description,
  onSelectJob,
  onExploreJobs,
  onClose,
  className,
}: SelectRoleForCandidateProps) {
  const [logoErrors, setLogoErrors] = useState<Record<number, boolean>>({});

  const subtitle =
    description || `Select an active claimed role to submit ${candidate.name}.`;

  const isAlreadySubmitted = (job: ClaimedRoleItem) =>
    existingSubmissions.some(
      (s) =>
        s.company.toLowerCase() === job.company.toLowerCase() &&
        s.role.toLowerCase() === job.role.toLowerCase()
    );

  return (
    <section
      className={[styles.panel, className].filter(Boolean).join(" ")}
      aria-label={`Select a role for ${candidate.name}`}
    >
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.topRow}>
          <div className={styles.titleGroup}>
            <h2 className={styles.title}>{candidate.name}</h2>
            <p className={styles.description}>{subtitle}</p>
          </div>
          <IconButton
            icon={<XIcon size="md" />}
            size="md"
            onClick={onClose}
            ariaLabel="Close select role drawer"
          />
        </div>
      </header>

      {/* Content Scroll Area */}
      <div className={styles.scroll}>
        <div className={styles.sectionHeader}>
          <span className={styles.roleCount}>
            {claimedJobs.length} {claimedJobs.length === 1 ? "claimed role" : "claimed roles"}
          </span>
        </div>

        {claimedJobs.length === 0 ? (
          <div className={styles.emptyState}>
            <p className={styles.emptyTitle}>No claimed roles available</p>
            <p className={styles.emptyText}>
              Claim roles from the Explore page to submit {candidate.name} to new opportunities.
            </p>
            <Button variant="primary" size="md" onClick={onExploreJobs}>
              Explore open jobs
            </Button>
          </div>
        ) : (
          <div className={styles.rolesList}>
            {claimedJobs.map((job) => {
              const submitted = isAlreadySubmitted(job);
              const closed = job.badge === "closed";
              const disabled = submitted || closed;

              return (
                <div
                  key={job.id}
                  className={[
                    styles.roleCard,
                    disabled ? styles.roleCardDisabled : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  role="button"
                  tabIndex={disabled ? undefined : 0}
                  aria-disabled={disabled ? true : undefined}
                  onClick={() => {
                    if (!disabled) onSelectJob(job);
                  }}
                  onKeyDown={(e) => {
                    if (!disabled && (e.key === "Enter" || e.key === " ")) {
                      e.preventDefault();
                      onSelectJob(job);
                    }
                  }}
                >
                  <div className={styles.roleCardHead}>
                    <div className={styles.companyRow}>
                      {!logoErrors[job.id] ? (
                        <img
                          src={logoUrl(job.domain)}
                          alt={`${job.company} logo`}
                          className={styles.logo}
                          onError={() =>
                            setLogoErrors((prev) => ({ ...prev, [job.id]: true }))
                          }
                        />
                      ) : (
                        <span className={styles.logoFallback} aria-hidden="true" />
                      )}
                      <span className={styles.companyName}>{job.company}</span>
                    </div>

                    {submitted ? (
                      <span className={styles.alreadyBadge}>Already submitted</span>
                    ) : job.badge ? (
                      <Badge type={job.badge} />
                    ) : null}
                  </div>

                  <h4 className={styles.roleTitle} title={job.role}>
                    {job.role}
                  </h4>

                  <div className={styles.cardMeta}>
                    <span className={styles.metaItem}>
                      <IndianRupeeIcon size="sm" className={styles.icon} />
                      <span>{job.packageLabel.replace(/^₹\s*/, "")}</span>
                    </span>
                    <span className={styles.metaSeparator}>·</span>
                    <span className={styles.metaItem}>
                      <BriefcaseBusinessIcon size="sm" className={styles.icon} />
                      <span>{job.experience}</span>
                    </span>
                    <span className={styles.metaSeparator}>·</span>
                    <span className={styles.metaItem}>
                      <MapPinIcon size="sm" className={styles.icon} />
                      <span>{job.location}</span>
                    </span>
                  </div>

                  <hr className={styles.cardDivider} />

                  <div className={styles.cardFooter}>
                    <span
                      className={styles.commission}
                      title={
                        job.earningModel === "closure"
                          ? "Earn per closure · Paid when candidate joins and completes one month"
                          : "Earn per shortlist · Paid when candidate is shortlisted by employer"
                      }
                    >
                      <HandCoinsIcon size="sm" className={styles.icon} />
                      <span className={styles.commissionAmount}>
                        {job.commission}
                      </span>
                      <span className={styles.commissionUnit}>
                        {job.earningModel === "closure" ? " per closure" : " per shortlist"}
                      </span>
                    </span>

                    {!disabled && (
                      <span className={styles.selectAction}>
                        <span>Select role</span>
                        <ArrowRightIcon size="sm" />
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

export default SelectRoleForCandidate;
