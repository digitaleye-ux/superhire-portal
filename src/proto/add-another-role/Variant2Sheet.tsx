import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/shared/Badge";
import { Checkbox } from "@/components/shared/Checkbox";
import {
  BriefcaseBusinessIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  IndianRupeeIcon,
  MapPinIcon,
  SparklesIcon,
  XIcon,
} from "@/components/shared/Icon";
import type { CandidateItem } from "@/proto/candidate-cards/data";
import type { PrototypeJob } from "./data";
import { PROTOTYPE_CLAIMED_JOBS, SAMPLE_CANDIDATE } from "./data";
import s from "./variants.module.css";

export default function Variant2Sheet({
  candidate = SAMPLE_CANDIDATE,
  onClose,
  onComplete,
}: {
  candidate?: CandidateItem;
  onClose?: () => void;
  onComplete?: (role: string, company: string) => void;
}) {
  const [expandedJobId, setExpandedJobId] = useState<number | null>(PROTOTYPE_CLAIMED_JOBS[0].id);
  const [verifiedMap, setVerifiedMap] = useState<Record<number, string[]>>({});
  const [submittingId, setSubmittingId] = useState<number | null>(null);

  const toggleCheck = (jobId: number, req: string) => {
    setVerifiedMap((prev) => {
      const cur = prev[jobId] || [];
      const next = cur.includes(req) ? cur.filter((x) => x !== req) : [...cur, req];
      return { ...prev, [jobId]: next };
    });
  };

  const handleSubmit = (job: PrototypeJob) => {
    const verified = verifiedMap[job.id] || [];
    if (verified.length < job.mustHaves.length) {
      toast.error("Please confirm all must-have dealbreakers before submitting.");
      return;
    }
    setSubmittingId(job.id);
    setTimeout(() => {
      setSubmittingId(null);
      toast.success(`Candidate submitted for ${job.role}`, {
        description: `Successfully submitted ${candidate.name} to ${job.company}.`,
      });
      onComplete?.(job.role, job.company);
      onClose?.();
    }, 600);
  };

  return (
    <div className={s.modalBackdrop} onClick={onClose}>
      <div
        className={s.modalSheet}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={`Submit ${candidate.name} to another role`}
      >
        {/* Header */}
        <div className={s.modalHeader}>
          <div>
            <h2 className={s.modalTitle}>Submit to another role</h2>
            <span style={{ fontSize: 13, color: "var(--semantics-text-tertiary)" }}>
              Pick a claimed mandate to reuse {candidate.name}'s verified profile.
            </span>
          </div>
          <button
            type="button"
            className={s.closeBtn}
            onClick={onClose}
            aria-label="Close"
            style={{
              border: 0,
              background: "transparent",
              cursor: "pointer",
              padding: 4,
              color: "var(--semantics-text-tertiary)",
            }}
          >
            <XIcon size="md" />
          </button>
        </div>

        {/* Body */}
        <div className={s.modalBody}>
          {/* Candidate Snapshot Bar */}
          <div className={s.candidatePill}>
            <div className={s.candidateInfo}>
              <span className={s.candidateName}>{candidate.name}</span>
              <div className={s.candidateMeta}>
                <span className={s.metaItem}>
                  <IndianRupeeIcon size="xs" />
                  <span>{candidate.expectedCtc.replace(/^₹\s*/, "")}</span>
                </span>
                <span>·</span>
                <span className={s.metaItem}>
                  <BriefcaseBusinessIcon size="xs" />
                  <span>{candidate.experience}</span>
                </span>
                <span>·</span>
                <span>{candidate.noticePeriod} notice</span>
                <span>·</span>
                <span className={s.metaItem}>
                  <MapPinIcon size="xs" />
                  <span>{candidate.location}</span>
                </span>
              </div>
            </div>
            <span className={s.resumeAttachedBadge}>
              <SparklesIcon size="xs" />
              <span>Resume attached</span>
            </span>
          </div>

          {/* Claimed Roles List */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--semantics-text-secondary)" }}>
              Claimed mandates ({PROTOTYPE_CLAIMED_JOBS.filter((j) => j.company !== candidate.company).length})
            </span>

            {PROTOTYPE_CLAIMED_JOBS.map((job) => {
              const isCurrent = job.company === candidate.company && job.role === candidate.role;
              const isExpanded = expandedJobId === job.id;
              const verified = verifiedMap[job.id] || [];
              const allVerified = verified.length === job.mustHaves.length;

              if (isCurrent) {
                return (
                  <div
                    key={job.id}
                    style={{
                      padding: 12,
                      borderRadius: 8,
                      border: "1px dashed var(--semantics-border-default)",
                      background: "var(--semantics-surface-secondary)",
                      opacity: 0.6,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 500, color: "var(--semantics-text-secondary)" }}>
                        {job.role} · {job.company}
                      </div>
                      <div style={{ fontSize: 12, color: "var(--semantics-text-tertiary)" }}>
                        Current active application on Track
                      </div>
                    </div>
                    <Badge type="closed">Current Application</Badge>
                  </div>
                );
              }

              return (
                <div
                  key={job.id}
                  style={{
                    border: `1px solid ${isExpanded ? "var(--semantics-border-interactive, #4f46e5)" : "var(--semantics-border-default)"}`,
                    borderRadius: 10,
                    padding: 14,
                    background: "var(--semantics-background-primary)",
                    transition: "all 150ms ease",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      cursor: "pointer",
                    }}
                    onClick={() => setExpandedJobId(isExpanded ? null : job.id)}
                  >
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                        <span style={{ fontSize: 14, fontWeight: 600, color: "var(--semantics-text-primary)" }}>
                          {job.role}
                        </span>
                        <span style={{ fontSize: 14, color: "var(--semantics-text-tertiary)" }}>
                          at {job.company}
                        </span>
                        <span className={s.matchBadge}>{job.matchScore}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 12, color: "var(--semantics-text-tertiary)" }}>
                        <span>{job.packageLabel}</span>
                        <span>·</span>
                        <span>{job.experience}</span>
                        <span>·</span>
                        <span>{job.location}</span>
                        <span>·</span>
                        <span style={{ color: "var(--semantics-text-primary)", fontWeight: 500 }}>
                          {job.commission} per shortlist
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      style={{
                        border: 0,
                        background: "transparent",
                        cursor: "pointer",
                        color: "var(--semantics-text-tertiary)",
                        padding: 4,
                      }}
                      aria-label={isExpanded ? "Collapse" : "Expand"}
                    >
                      {isExpanded ? <ChevronUpIcon size="sm" /> : <ChevronDownIcon size="sm" />}
                    </button>
                  </div>

                  {isExpanded && (
                    <div className={s.accordionContent}>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: "var(--semantics-text-secondary)", marginBottom: 8 }}>
                          Must-have dealbreakers ({verified.length}/{job.mustHaves.length} verified):
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                          {job.mustHaves.map((req) => (
                            <Checkbox
                              key={req}
                              label={req}
                              checked={verified.includes(req)}
                              onChange={() => toggleCheck(job.id, req)}
                            />
                          ))}
                        </div>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 8 }}>
                        <span style={{ fontSize: 12, color: "var(--semantics-text-tertiary)" }}>
                          Profile, resume, & CTC pre-filled automatically
                        </span>
                        <button
                          type="button"
                          disabled={!allVerified || submittingId === job.id}
                          onClick={() => handleSubmit(job)}
                          style={{
                            padding: "8px 16px",
                            borderRadius: 6,
                            background: allVerified ? "var(--color-primary-base, #4f46e5)" : "var(--semantics-surface-disabled, #e2e8f0)",
                            color: allVerified ? "#fff" : "var(--semantics-text-disabled, #94a3b8)",
                            border: 0,
                            fontWeight: 600,
                            fontSize: 13,
                            cursor: allVerified ? "pointer" : "not-allowed",
                            transition: "all 150ms ease",
                          }}
                        >
                          {submittingId === job.id ? "Submitting…" : `Submit to ${job.company}`}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
