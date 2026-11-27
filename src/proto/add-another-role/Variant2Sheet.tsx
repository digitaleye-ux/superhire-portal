import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/shared/Badge";
import { Button } from "@/components/shared/Button";
import { Checkbox } from "@/components/shared/Checkbox";
import { IconButton } from "@/components/shared/IconButton";
import { SearchInput } from "@/components/shared/SearchInput";
import {
  BriefcaseBusinessIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  IndianRupeeIcon,
  MapPinIcon,
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
  const [searchQuery, setSearchQuery] = useState("");
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

  const verifyAllForJob = (job: PrototypeJob) => {
    setVerifiedMap((prev) => ({
      ...prev,
      [job.id]: [...job.mustHaves],
    }));
  };

  const filteredJobs = useMemo(() => {
    return PROTOTYPE_CLAIMED_JOBS.filter((job) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        job.role.toLowerCase().includes(q) ||
        job.company.toLowerCase().includes(q) ||
        job.location.toLowerCase().includes(q)
      );
    });
  }, [searchQuery]);

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
        {/* Command Header */}
        <div className={s.commandHeader}>
          <div className={s.commandTopRow}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <h2 className={s.commandTitle}>Command Match</h2>
              <span className={s.kbdBadge}>Esc to close</span>
            </div>
            {onClose && (
              <IconButton
                icon={<XIcon size="md" />}
                ariaLabel="Close add role sheet"
                size="md"
                onClick={onClose}
              />
            )}
          </div>

          <SearchInput
            placeholder={`Search claimed roles for ${candidate.name}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClear={() => setSearchQuery("")}
            autoFocus
          />
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
          </div>

          {/* Claimed Roles Accordion List */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--semantics-text-secondary)" }}>
              Claimed mandates ({filteredJobs.length})
            </span>

            {filteredJobs.map((job) => {
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
                      borderRadius: 10,
                      border: "1px dashed var(--semantics-border-default)",
                      background: "var(--semantics-surface-secondary)",
                      opacity: 0.65,
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
                  className={[
                    s.commandRoleCard,
                    isExpanded ? s.commandRoleCardActive : "",
                  ].join(" ")}
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
                        {job.badge && <Badge type={job.badge} />}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 12, color: "var(--semantics-text-tertiary)" }}>
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
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <span style={{ fontSize: 12, fontWeight: 600, color: "var(--semantics-text-secondary)" }}>
                          Must-have dealbreakers ({verified.length}/{job.mustHaves.length} verified):
                        </span>
                        {!allVerified && (
                          <button
                            type="button"
                            onClick={() => verifyAllForJob(job)}
                            style={{
                              background: "transparent",
                              border: 0,
                              color: "var(--semantics-text-brand)",
                              fontSize: 12,
                              fontWeight: 500,
                              cursor: "pointer",
                              padding: 0,
                            }}
                          >
                            Verify all
                          </button>
                        )}
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

                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 8 }}>
                        <span style={{ fontSize: 12, color: "var(--semantics-text-tertiary)" }}>
                          Profile, resume, & CTC pre-filled automatically
                        </span>
                        <Button
                          variant="primary"
                          size="sm"
                          disabled={!allVerified || submittingId === job.id}
                          onClick={() => handleSubmit(job)}
                        >
                          {submittingId === job.id ? "Submitting…" : `Submit to ${job.company}`}
                        </Button>
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
