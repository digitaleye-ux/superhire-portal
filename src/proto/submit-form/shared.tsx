import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { CandidateForm } from "@/components/recruiter/SubmitCandidate/useCandidateForm";
import type { SubmitCandidateJob } from "@/components/recruiter/SubmitCandidate/SubmitCandidate.types";

export interface VariantProps {
  form: CandidateForm;
  requirements: string[];
  job: SubmitCandidateJob;
  onShortcutSubmit: () => void;
}

/**
 * Proposed model changes (variants 2–4):
 *  - "Currently working?" question is dropped. Employed is the default; the rare
 *    exception is a "Not currently employed" checkbox.
 *  - "Notice negotiable?" becomes a checkbox, defaulting to No.
 * These effects keep the existing validation happy without touching the real hook.
 */
export function useModelDefaults(form: CandidateForm) {
  const { values, set } = form;
  useEffect(() => {
    if (values.working === "") set("working", "Yes");
  }, [values.working]);
  useEffect(() => {
    if (values.notice && values.notice !== "Immediately" && values.noticeNegotiable === "") {
      set("noticeNegotiable", "No");
    }
  }, [values.notice, values.noticeNegotiable]);
}

/** Proto-only fields that don't exist on the real form yet. */
export function useExtras() {
  const [x, setX] = useState({ location: "", relocate: false, consent: false });
  return { x, patch: (p: Partial<typeof x>) => setX((s) => ({ ...s, ...p })) };
}

/** "₹32–48 L" → [32, 48]. */
export function parseBudget(label: string): [number, number] | null {
  const m = label.match(/(\d+(?:\.\d+)?)\s*[–-]\s*(\d+(?:\.\d+)?)/);
  return m ? [Number(m[1]), Number(m[2])] : null;
}

export function budgetVerdict(expected: string, label: string) {
  const b = parseBudget(label);
  const e = Number(expected);
  if (!b || !expected || Number.isNaN(e)) return null;
  if (e < b[0]) return { tone: "ok" as const, text: `Under budget · ${label}` };
  if (e <= b[1]) return { tone: "ok" as const, text: `Within budget · ${label}` };
  return { tone: "warn" as const, text: `${(e - b[1]).toFixed(e % 1 ? 1 : 0)} L above budget · ${label}` };
}

export function Group({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
