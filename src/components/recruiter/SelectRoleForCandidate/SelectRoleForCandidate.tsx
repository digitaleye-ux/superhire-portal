import { useMemo, useState } from "react";
import { Badge } from "@/components/shared/Badge";
import { Button } from "@/components/shared/Button";
import { IconButton } from "@/components/shared/IconButton";
import { LinkButton } from "@/components/shared/LinkButton";
import { SearchInput } from "@/components/shared/SearchInput";
import { Tag } from "@/components/shared/Tag";
import { HandCoinsIcon, XIcon } from "@/components/shared/Icon";
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
  const [searchQuery, setSearchQuery] = useState("");

  const subtitle =
    description || `Select a claimed role to submit ${candidate.name} with their existing profile.`;

  const isAlreadySubmitted = (job: ClaimedRoleItem) =>
    existingSubmissions.some(
      (s) =>
        s.company.toLowerCase() === job.company.toLowerCase() &&
        s.role.toLowerCase() === job.role.toLowerCase()
    );

  const filteredJobs = useMemo(() => {
    if (!searchQuery.trim()) return claimedJobs;
    const q = searchQuery.toLowerCase();
    return claimedJobs.filter((job) => {
      return (
        job.role.toLowerCase().includes(q) ||
        job.company.toLowerCase().includes(q) ||
        job.location.toLowerCase().includes(q)
      );
    });
  }, [claimedJobs, searchQuery]);

  return (
    <section
      className={[styles.panel, className].filter(Boolean).join(" ")}
      aria-label={`Select a role for ${candidate.name}`}
    >
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.topRow}>
          <div className={styles.candidateIdentity}>
            <div className={styles.avatar} aria-hidden="true">
              {candidate.initials || candidate.name.slice(0, 2).toUpperCase()}
            </div>
            <div className={styles.titleBlock}>
              <h2 className={styles.title}>Submit {candidate.name}</h2>
              <p className={styles.subtitle}>{subtitle}</p>
            </div>
          </div>
          <IconButton
            icon={<XIcon size="md" />}
            size="md"
            onClick={onClose}
            ariaLabel="Close select role drawer"
          />
        </div>

        {/* Candidate Context Meta */}
        <div className={styles.candidateMetaStrip}>
          <span className={styles.metaHighlight}>
            Applied for {candidate.role} at {candidate.company}
          </span>
          {candidate.experience && (
            <>
              <span className={styles.metaSeparator} aria-hidden="true">·</span>
              <span>{candidate.experience}</span>
            </>
          )}
          {candidate.location && (
            <>
              <span className={styles.metaSeparator} aria-hidden="true">·</span>
              <span>{candidate.location}</span>
            </>
          )}
          {candidate.noticePeriod && (
            <>
              <span className={styles.metaSeparator} aria-hidden="true">·</span>
              <span>Notice: {candidate.noticePeriod}</span>
            </>
          )}
        </div>
      </header>

      {/* Search Input */}
      <div className={styles.searchSection}>
        <SearchInput
          placeholder="Search claimed roles by role, company, location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onClear={() => setSearchQuery("")}
        />
      </div>

      {/* Roles List */}
      <div className={styles.scroll}>
        <div className={styles.sectionHeader}>
          <span className={styles.roleCount}>
            {filteredJobs.length} {filteredJobs.length === 1 ? "claimed role" : "claimed roles"}
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
        ) : filteredJobs.length === 0 ? (
          <div className={styles.emptyState}>
            <p className={styles.emptyTitle}>No roles match your search</p>
            <p className={styles.emptyText}>
              Try searching with a different keyword or clear the search field.
            </p>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setSearchQuery("")}
            >
              Clear search
            </Button>
          </div>
        ) : (
          <div className={styles.rolesList}>
            {filteredJobs.map((job) => {
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
                      <Tag variant="neutral" size="sm">
                        Already submitted
                      </Tag>
                    ) : job.badge ? (
                      <Badge type={job.badge} />
                    ) : null}
                  </div>

                  <div className={styles.roleCardBody}>
                    <h4 className={styles.roleTitle} title={job.role}>
                      {job.role}
                    </h4>

                    <div className={styles.cardMeta}>
                      <span>{job.packageLabel.replace(/^₹\s*/, "")}</span>
                      <span className={styles.metaSeparator} aria-hidden="true">·</span>
                      <span>{job.experience}</span>
                      <span className={styles.metaSeparator} aria-hidden="true">·</span>
                      <span>{job.location}</span>
                    </div>
                  </div>

                  <div className={styles.cardFooter}>
                    <span
                      className={styles.commission}
                      title={
                        job.earningModel === "closure"
                          ? "Earn per closure · Paid when candidate joins and completes one month"
                          : "Earn per shortlist · Paid when candidate is shortlisted by employer"
                      }
                    >
                      <HandCoinsIcon size="sm" />
                      <span className={styles.commissionAmount}>{job.commission}</span>
                      <span className={styles.commissionUnit}>
                        {job.earningModel === "closure" ? " per closure" : " per shortlist"}
                      </span>
                    </span>

                    {!disabled && (
                      <LinkButton variant="brand" arrow>
                        Select role
                      </LinkButton>
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
