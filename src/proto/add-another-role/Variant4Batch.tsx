import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/shared/Badge";
import { Button } from "@/components/shared/Button";
import { Checkbox } from "@/components/shared/Checkbox";
import {
  BriefcaseBusinessIcon,
  CheckIcon,
  HandCoinsIcon,
  IndianRupeeIcon,
  MapPinIcon,
  SparklesIcon,
  XIcon,
} from "@/components/shared/Icon";
import type { CandidateItem } from "@/proto/candidate-cards/data";
import { PROTOTYPE_CLAIMED_JOBS, SAMPLE_CANDIDATE } from "./data";
import s from "./variants.module.css";

export default function Variant4Batch({
  candidate = SAMPLE_CANDIDATE,
  onClose,
  onComplete,
}: {
  candidate?: CandidateItem;
  onClose?: () => void;
  onComplete?: (count: number, roles: string[]) => void;
}) {
  // Candidate's current claimed role (exclude or mark applied)
  const availableJobs = PROTOTYPE_CLAIMED_JOBS.filter(
    (j) => !(j.company === candidate.company && j.role === candidate.role)
  );

  const [selectedJobIds, setSelectedJobIds] = useState<number[]>([availableJobs[0]?.id].filter(Boolean));
  const [checkedDealbreakers, setCheckedDealbreakers] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // Compute union of must-haves across selected jobs
  const selectedJobs = useMemo(
    () => availableJobs.filter((j) => selectedJobIds.includes(j.id)),
    [availableJobs, selectedJobIds]
  );

  const mergedDealbreakers = useMemo(() => {
    const set = new Set<string>();
    selectedJobs.forEach((j) => {
      j.mustHaves.forEach((m) => set.add(m));
    });
    return Array.from(set);
  }, [selectedJobs]);

  // Calculate total potential bounty across selected jobs
  const totalBounty = useMemo(() => {
    return selectedJobs.reduce((acc, j) => {
      const num = parseInt(j.commission.replace(/[^0-9]/g, ""), 10) || 0;
      return acc + num;
    }, 0);
  }, [selectedJobs]);

  const toggleJob = (id: number) => {
    setSelectedJobIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedJobIds.length === availableJobs.length) {
      setSelectedJobIds([]);
    } else {
      setSelectedJobIds(availableJobs.map((j) => j.id));
    }
  };

  const toggleDealbreaker = (req: string) => {
    setCheckedDealbreakers((prev) =>
      prev.includes(req) ? prev.filter((x) => x !== req) : [...prev, req]
    );
  };

  const handleBatchSubmit = () => {
    if (selectedJobs.length === 0) {
      toast.error("Please select at least one role.");
      return;
    }
    const missingCount = mergedDealbreakers.length - checkedDealbreakers.length;
    if (missingCount > 0) {
      toast.error(`Please verify all ${mergedDealbreakers.length} must-have dealbreakers.`);
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      const roleNames = selectedJobs.map((j) => `${j.role} (${j.company})`);
      toast.success(`Batch submitted ${candidate.name} to ${selectedJobs.length} roles!`, {
        description: `Successfully syndicated across: ${roleNames.join(", ")}.`,
      });
      onComplete?.(selectedJobs.length, roleNames);
      onClose?.();
    }, 700);
  };

  return (
    <div className={s.batchDrawer}>
      {/* Header */}
      <div className={s.batchHeader}>
        <div>
          <h2 className={s.batchTitle}>Batch Syndicate Candidate</h2>
          <p className={s.batchSubtitle}>
            Submit {candidate.name} to multiple claimed mandates in 1 single action
          </p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className={s.closeButton}
            aria-label="Close batch drawer"
          >
            <XIcon size={18} />
          </button>
        )}
      </div>

      {/* Scrollable Content */}
      <div className={s.batchScrollArea}>
        {/* Candidate Summary Card */}
        <div className={s.candidatePill}>
          <div className={s.candidateInfo}>
            <span className={s.candidateName}>{candidate.name}</span>
            <div className={s.candidateMeta}>
              <span className={s.metaItem}>
                <BriefcaseBusinessIcon size={13} /> {candidate.experience}
              </span>
              <span className={s.metaItem}>
                <IndianRupeeIcon size={13} /> {candidate.currentCtc}
              </span>
              <span className={s.metaItem}>
                <MapPinIcon size={13} /> {candidate.location}
              </span>
              <span className={s.metaItem}>{candidate.noticePeriod}</span>
            </div>
          </div>
          <div className={s.resumeAttachedBadge}>
            <CheckIcon size={12} />
            <span>Resume attached ({`${candidate.name.replace(/\s+/g, "_")}_Resume.pdf`})</span>
          </div>
        </div>

        {/* Roles List */}
        <div>
          <div className={s.batchSectionHeading}>
            <span>Select Roles to Target ({selectedJobIds.length}/{availableJobs.length})</span>
            <button type="button" onClick={selectAll}>
              {selectedJobIds.length === availableJobs.length ? "Deselect all" : "Select all eligible"}
            </button>
          </div>

          <div className={s.batchRolesList}>
            {availableJobs.map((job) => {
              const isSelected = selectedJobIds.includes(job.id);
              return (
                <div
                  key={job.id}
                  className={s.batchRoleRow}
                  data-checked={isSelected}
                  onClick={() => toggleJob(job.id)}
                  role="checkbox"
                  aria-checked={isSelected}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === " " || e.key === "Enter") {
                      e.preventDefault();
                      toggleJob(job.id);
                    }
                  }}
                >
                  <Checkbox
                    checked={isSelected}
                    onChange={() => toggleJob(job.id)}
                    label=""
                    aria-label={`Select ${job.role}`}
                  />

                  <img
                    src={`https://www.google.com/s2/favicons?domain=${job.domain}&sz=64`}
                    alt={job.company}
                    style={{ width: 32, height: 32, borderRadius: 6, objectFit: "cover" }}
                    onError={(e) => {
                      (e.currentTarget as HTMLElement).style.display = "none";
                    }}
                  />

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                      <span style={{ fontWeight: 600, fontSize: 14 }}>{job.role}</span>
                      <span style={{ fontSize: 13, color: "var(--semantics-text-tertiary)" }}>
                        at {job.company}
                      </span>
                      {job.badge && (
                        <Badge type={job.badge}>
                          {job.badge}
                        </Badge>
                      )}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        marginTop: 4,
                        fontSize: 12,
                        color: "var(--semantics-text-secondary)",
                      }}
                    >
                      <span>{job.experience}</span>
                      <span>•</span>
                      <span>{job.packageLabel}</span>
                      <span>•</span>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}>
                        <MapPinIcon size={12} /> {job.location} ({job.mode})
                      </span>
                    </div>
                  </div>

                  {/* Bounty Pill */}
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4,
                        fontSize: 13,
                        fontWeight: 600,
                        color: "var(--semantics-text-link)",
                      }}
                    >
                      <HandCoinsIcon size={14} />
                      {job.commission}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--semantics-text-tertiary)" }}>
                      per shortlist
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Consolidated Dealbreakers Checklist */}
        {selectedJobs.length > 0 && (
          <div className={s.batchDealbreakersBox}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <SparklesIcon size={15} style={{ color: "var(--semantics-text-brand, #4f46e5)" }} />
                <span style={{ fontSize: 13, fontWeight: 600 }}>
                  Consolidated Must-Haves Checklist ({checkedDealbreakers.length}/{mergedDealbreakers.length} Verified)
                </span>
              </div>
              <button
                type="button"
                onClick={() => setCheckedDealbreakers([...mergedDealbreakers])}
                style={{
                  fontSize: 12,
                  color: "var(--semantics-text-link)",
                  background: "none",
                  border: 0,
                  cursor: "pointer",
                }}
              >
                Verify all ({mergedDealbreakers.length})
              </button>
            </div>

            <p style={{ margin: 0, fontSize: 12, color: "var(--semantics-text-secondary)" }}>
              Ensure {candidate.name} satisfies these mandatory qualifications across the selected {selectedJobs.length} roles:
            </p>

            <div className={s.batchReqList}>
              {mergedDealbreakers.map((req) => {
                const isChecked = checkedDealbreakers.includes(req);
                return (
                  <label
                    key={req}
                    className={s.batchReqItem}
                    onClick={() => toggleDealbreaker(req)}
                  >
                    <Checkbox
                      checked={isChecked}
                      onChange={() => toggleDealbreaker(req)}
                      label=""
                      aria-label={req}
                    />
                    <span
                      style={{
                        color: isChecked
                          ? "var(--semantics-text-primary)"
                          : "var(--semantics-text-secondary)",
                      }}
                    >
                      {req}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Sticky Bottom Footer */}
      <div className={s.batchFooter}>
        <div className={s.batchTotal}>
          <span className={s.batchTotalLabel}>Total Bounty Potential</span>
          <span className={s.batchTotalAmount}>
            ₹{totalBounty.toLocaleString("en-IN")} / shortlists
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {onClose && (
            <Button variant="secondary" onClick={onClose} disabled={submitting}>
              Cancel
            </Button>
          )}
          <Button
            variant="primary"
            onClick={handleBatchSubmit}
            disabled={submitting || selectedJobs.length === 0}
          >
            {submitting ? "Submitting..." : `Submit to ${selectedJobs.length} ${selectedJobs.length === 1 ? "Role" : "Roles"}`}
          </Button>
        </div>
      </div>
    </div>
  );
}
