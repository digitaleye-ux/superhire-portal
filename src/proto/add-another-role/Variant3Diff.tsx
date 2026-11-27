import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/shared/Button";
import { Checkbox } from "@/components/shared/Checkbox";
import { IconButton } from "@/components/shared/IconButton";
import {
  BriefcaseBusinessIcon,
  CheckIcon,
  IndianRupeeIcon,
  MapPinIcon,
  XIcon,
} from "@/components/shared/Icon";
import type { CandidateItem } from "@/proto/candidate-cards/data";
import type { PrototypeJob } from "./data";
import { PROTOTYPE_CLAIMED_JOBS, SAMPLE_CANDIDATE } from "./data";
import s from "./variants.module.css";

const QUICK_PITCH_PROMPTS = [
  "Immediate joiner (can negotiate to 15 days)",
  "Top 5% candidate in system design round",
  "Extensive hands-on fintech experience",
];

export default function Variant3Diff({
  candidate = SAMPLE_CANDIDATE,
  onClose,
  onComplete,
}: {
  candidate?: CandidateItem;
  onClose?: () => void;
  onComplete?: (role: string, company: string) => void;
}) {
  const availableJobs = PROTOTYPE_CLAIMED_JOBS.filter(
    (j) => !(j.company === candidate.company && j.role === candidate.role)
  );

  const [selectedJob, setSelectedJob] = useState<PrototypeJob>(availableJobs[0]);
  const [checkedMustHaves, setCheckedMustHaves] = useState<string[]>([]);
  const [pitchNote, setPitchNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const toggleMustHave = (item: string) => {
    setCheckedMustHaves((prev) =>
      prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item]
    );
  };

  const verifyAll = () => {
    setCheckedMustHaves([...selectedJob.mustHaves]);
  };

  const handleSelectJob = (job: PrototypeJob) => {
    setSelectedJob(job);
    setCheckedMustHaves([]);
  };

  const handleQuickSubmit = () => {
    if (checkedMustHaves.length < selectedJob.mustHaves.length) {
      toast.error("Please confirm all must-have dealbreakers before submitting.");
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      toast.success(`Submitted ${candidate.name} to ${selectedJob.company}!`, {
        description: `Directly matched with ${selectedJob.role}. Pitch note attached.`,
      });
      onComplete?.(selectedJob.role, selectedJob.company);
      onClose?.();
    }, 600);
  };

  const allVerified = checkedMustHaves.length === selectedJob.mustHaves.length;

  return (
    <div className={s.drawerBackdrop} onClick={onClose}>
      <div
        className={s.drawerPanel}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={`Inline Diff & Quick Match for ${candidate.name}`}
      >
        {/* Header */}
        <div className={s.batchHeader}>
          <div>
            <h2 className={s.batchTitle}>Requirement Diff & Quick Pitch</h2>
            <p className={s.batchSubtitle}>
              Compare qualifications in-place & submit in 1-step without second pages
            </p>
          </div>
          {onClose && (
            <IconButton
              icon={<XIcon size="md" />}
              ariaLabel="Close drawer"
              size="md"
              onClick={onClose}
            />
          )}
        </div>

        {/* Scrollable Body */}
        <div className={s.batchScrollArea}>
          {/* Candidate Dossier Bar */}
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

          {/* Role Selector Tabs */}
          <div>
            <span style={{ fontSize: 12, fontWeight: 600, color: "var(--semantics-text-secondary)", display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Select Target Role
            </span>
            <div className={s.diffRoleSelector}>
              {availableJobs.map((job) => {
                const isActive = job.id === selectedJob.id;
                return (
                  <button
                    key={job.id}
                    type="button"
                    className={[s.diffRolePill, isActive ? s.diffRolePillActive : ""].join(" ")}
                    onClick={() => handleSelectJob(job)}
                  >
                    <span>{job.company}</span>
                    <span style={{ fontSize: 12, opacity: 0.8 }}>· {job.role}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Live Diff Comparison Matrix */}
          <div className={s.diffComparisonCard}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: "var(--semantics-text-primary)" }}>
                  {selectedJob.role} at {selectedJob.company}
                </h3>
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: "var(--semantics-text-primary)" }}>
                {selectedJob.commission} bounty
              </span>
            </div>

            <div className={s.diffGrid}>
              <div className={s.diffCriterion}>
                <span className={s.diffCriterionLabel}>Experience</span>
                <span className={s.diffCriterionValue}>{candidate.experience} vs {selectedJob.experience}</span>
                <span className={s.diffCriterionMatch}>
                  <CheckIcon size="xs" /> Fit
                </span>
              </div>

              <div className={s.diffCriterion}>
                <span className={s.diffCriterionLabel}>Location</span>
                <span className={s.diffCriterionValue}>{candidate.location}</span>
                <span className={s.diffCriterionMatch}>
                  <CheckIcon size="xs" /> Matches {selectedJob.mode}
                </span>
              </div>

              <div className={s.diffCriterion}>
                <span className={s.diffCriterionLabel}>Notice Period</span>
                <span className={s.diffCriterionValue}>{candidate.noticePeriod}</span>
                <span className={s.diffCriterionMatch}>
                  <CheckIcon size="xs" /> Immediate ready
                </span>
              </div>
            </div>

            {/* Must-Haves Checklist */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: "var(--semantics-text-secondary)" }}>
                  Must-have dealbreakers ({checkedMustHaves.length}/{selectedJob.mustHaves.length}):
                </span>
                {!allVerified && (
                  <button
                    type="button"
                    onClick={verifyAll}
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
                    Confirm all criteria
                  </button>
                )}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {selectedJob.mustHaves.map((req) => (
                  <Checkbox
                    key={req}
                    label={req}
                    checked={checkedMustHaves.includes(req)}
                    onChange={() => toggleMustHave(req)}
                  />
                ))}
              </div>
            </div>

            {/* Recruiter Pitch Note */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: "var(--semantics-text-secondary)" }}>
                Recruiter Pitch Note (optional):
              </span>
              <div className={s.quickChipsRow}>
                {QUICK_PITCH_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    className={s.quickChip}
                    onClick={() =>
                      setPitchNote((prev) => (prev ? `${prev} · ${prompt}` : prompt))
                    }
                  >
                    + {prompt}
                  </button>
                ))}
              </div>
              <textarea
                className={s.pitchTextarea}
                placeholder="Highlight candidate strengths directly to the hiring manager..."
                value={pitchNote}
                onChange={(e) => setPitchNote(e.target.value)}
                rows={2}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={s.batchFooter}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 11, color: "var(--semantics-text-tertiary)", textTransform: "uppercase" }}>
              Bounty on Shortlist
            </span>
            <span style={{ fontSize: 16, fontWeight: 600, color: "var(--semantics-text-primary)" }}>
              {selectedJob.commission}
            </span>
          </div>

          <Button
            variant="primary"
            size="md"
            disabled={!allVerified || submitting}
            onClick={handleQuickSubmit}
          >
            {submitting ? "Submitting…" : `Submit to ${selectedJob.company}`}
          </Button>
        </div>
      </div>
    </div>
  );
}
