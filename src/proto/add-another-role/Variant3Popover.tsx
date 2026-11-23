import { useState } from "react";
import { toast } from "sonner";
import { Checkbox } from "@/components/shared/Checkbox";
import { ArrowLeftIcon, ArrowRightIcon, XIcon } from "@/components/shared/Icon";
import type { CandidateItem } from "@/proto/candidate-cards/data";
import type { PrototypeJob } from "./data";
import { PROTOTYPE_CLAIMED_JOBS, SAMPLE_CANDIDATE } from "./data";
import s from "./variants.module.css";

export default function Variant3Popover({
  candidate = SAMPLE_CANDIDATE,
  onComplete,
}: {
  candidate?: CandidateItem;
  onComplete?: (role: string, company: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<PrototypeJob | null>(null);
  const [verifiedReqs, setVerifiedReqs] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const availableJobs = PROTOTYPE_CLAIMED_JOBS.filter(
    (j) => !(j.company === candidate.company && j.role === candidate.role)
  );

  const toggleReq = (r: string) => {
    setVerifiedReqs((prev) => (prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r]));
  };

  const handleFinalSubmit = () => {
    if (!selectedJob) return;
    if (verifiedReqs.length < selectedJob.mustHaves.length) {
      toast.error("Please confirm all must-haves before submitting.");
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      toast.success(`Quick submitted ${candidate.name}!`, {
        description: `Added to ${selectedJob.role} at ${selectedJob.company}.`,
      });
      onComplete?.(selectedJob.role, selectedJob.company);
      setOpen(false);
      setSelectedJob(null);
      setVerifiedReqs([]);
    }, 500);
  };

  return (
    <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ maxWidth: 420 }}>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>In-Place Card Flyout Popover</h3>
        <p style={{ margin: "4px 0 16px", fontSize: 13, color: "var(--semantics-text-tertiary)" }}>
          Anchored directly to the card footer. Avoids opening heavy side drawers or modal overlays.
        </p>

        {/* Mock Candidate Card */}
        <div
          style={{
            border: "1px solid var(--semantics-border-strong)",
            borderRadius: 8,
            padding: 16,
            background: "var(--semantics-background-primary)",
            position: "relative",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <span style={{ fontWeight: 600, fontSize: 16 }}>{candidate.name}</span>
            <span style={{ fontSize: 12, padding: "2px 8px", background: "#f1f5f9", borderRadius: 12 }}>
              {candidate.status}
            </span>
          </div>

          <p style={{ margin: "0 0 12px", fontSize: 14, color: "var(--semantics-text-secondary)" }}>
            for <strong style={{ color: "var(--semantics-text-primary)" }}>{candidate.role}</strong> at{" "}
            <strong style={{ color: "var(--semantics-text-primary)" }}>{candidate.company}</strong>
          </p>

          <div style={{ fontSize: 12, color: "var(--semantics-text-tertiary)", marginBottom: 16 }}>
            {candidate.expectedCtc} · {candidate.experience} · {candidate.location}
          </div>

          <hr style={{ border: 0, borderTop: "1px solid var(--semantics-border-default)", margin: "0 0 12px" }} />

          {/* Card Footer with Popover Trigger */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 13, fontWeight: 500 }}>{candidate.commission} per shortlist</span>

            <div className={s.popoverTriggerWrapper}>
              <button
                type="button"
                onClick={() => {
                  setOpen(!open);
                  setSelectedJob(null);
                }}
                style={{
                  padding: "6px 12px",
                  borderRadius: 6,
                  border: "1px solid var(--semantics-border-interactive, #4f46e5)",
                  background: open ? "var(--semantics-surface-brand-subtle)" : "transparent",
                  color: "var(--semantics-text-link, #4f46e5)",
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <span>Add another role</span>
                <ArrowRightIcon size="xs" />
              </button>

              {/* Popover Flyout Menu */}
              {open && (
                <div className={s.popoverOverlay}>
                  <div className={s.popoverHeader}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      {selectedJob && (
                        <button
                          type="button"
                          onClick={() => setSelectedJob(null)}
                          style={{ border: 0, background: "transparent", cursor: "pointer", padding: 0 }}
                        >
                          <ArrowLeftIcon size="xs" />
                        </button>
                      )}
                      <span className={s.popoverTitle}>
                        {selectedJob ? `Verify for ${selectedJob.company}` : "Select claimed role"}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      style={{ border: 0, background: "transparent", cursor: "pointer", padding: 0 }}
                    >
                      <XIcon size="sm" />
                    </button>
                  </div>

                  {!selectedJob ? (
                    <div className={s.popoverList}>
                      {availableJobs.map((j) => (
                        <button
                          key={j.id}
                          type="button"
                          className={s.popoverItem}
                          onClick={() => {
                            setSelectedJob(j);
                            setVerifiedReqs([]);
                          }}
                        >
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--semantics-text-primary)" }}>
                              {j.role}
                            </div>
                            <div style={{ fontSize: 11, color: "var(--semantics-text-tertiary)" }}>
                              {j.company} · {j.packageLabel} · {j.location}
                            </div>
                          </div>
                          <span style={{ fontSize: 12, fontWeight: 500, color: "var(--semantics-text-link)" }}>
                            {j.commission}
                          </span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 12 }}>
                      <div style={{ fontSize: 12, color: "var(--semantics-text-secondary)" }}>
                        Confirm dealbreakers for <strong>{selectedJob.role}</strong>:
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {selectedJob.mustHaves.map((m) => (
                          <Checkbox
                            key={m}
                            label={m}
                            checked={verifiedReqs.includes(m)}
                            onChange={() => toggleReq(m)}
                          />
                        ))}
                      </div>

                      <button
                        type="button"
                        disabled={verifiedReqs.length < selectedJob.mustHaves.length || submitting}
                        onClick={handleFinalSubmit}
                        style={{
                          marginTop: 6,
                          width: "100%",
                          padding: "8px 12px",
                          borderRadius: 6,
                          background:
                            verifiedReqs.length === selectedJob.mustHaves.length
                              ? "var(--color-primary-base, #4f46e5)"
                              : "#e2e8f0",
                          color: verifiedReqs.length === selectedJob.mustHaves.length ? "#fff" : "#94a3b8",
                          border: 0,
                          fontWeight: 600,
                          fontSize: 13,
                          cursor: verifiedReqs.length === selectedJob.mustHaves.length ? "pointer" : "not-allowed",
                        }}
                      >
                        {submitting ? "Submitting…" : `Submit to ${selectedJob.company}`}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
