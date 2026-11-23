import { useMemo, useRef, useState } from "react";
import type { CandidateFormValues } from "./SubmitCandidate.types";

export type Key = keyof CandidateFormValues;
export type StringKey = Exclude<Key, "resume" | "verifiedRequirements">;

export const EMPTY: CandidateFormValues = {
  name: "",
  email: "",
  phoneCode: "+91",
  phone: "",
  experience: "",
  working: "Yes",
  company: "",
  currentCtc: "",
  expectedCtc: "",
  notice: "",
  noticeNegotiable: "No",
  education: "",
  linkedin: "",
  github: "",
  portfolio: "",
  resume: null,
  verifiedRequirements: [],
  remarks: "",
};

export const NOTICE_OPTIONS = ["Immediately", "15 days", "30 days", "45 days", "60 days", "90 days"];
export const EDUCATION_OPTIONS = [
  "BE/B.Tech from Tier 1 College (IIT, BITS, NIT, DTU etc)",
  "BE/B.Tech from other college",
  "ME/M.Tech or MCA",
  "MBA / PGDM",
  "Diploma",
  "Other",
];
export const COUNTRY_CODES = ["+91", "+1", "+44", "+971", "+65"];
export const MAX_RESUME_BYTES = 5 * 1024 * 1024;

const num = /^\d+(\.\d+)?$/;
const normalizeUrl = (s: string) => (/^https?:\/\//i.test(s) ? s : `https://${s}`);

function urlError(raw: string, host?: string, label = "link"): string | undefined {
  const s = raw.trim();
  if (!s) return undefined;
  try {
    const u = new URL(normalizeUrl(s));
    if (!u.hostname.includes(".")) throw new Error();
    if (host && !u.hostname.includes(host)) return `Enter a ${label} on ${host}`;
  } catch {
    return `Enter a valid ${label}`;
  }
  return undefined;
}

/** Which keys are currently relevant (conditional fields drop out). */
export function activeKeys(v: CandidateFormValues): Key[] {
  const keys: Key[] = [
    "name", "email", "phone", "experience",
    "expectedCtc", "notice", "linkedin", "github",
    "portfolio", "resume", "verifiedRequirements", "remarks",
  ];
  if (v.working !== "No") keys.push("company", "currentCtc");
  return keys;
}

export const REQUIRED: Key[] = [
  "name", "email", "phone", "experience", "company", "currentCtc",
  "expectedCtc", "notice", "linkedin", "resume",
];

export function validate(v: CandidateFormValues, requiredCount = 0): Partial<Record<Key, string>> {
  const e: Partial<Record<Key, string>> = {};
  const active = new Set(activeKeys(v));
  const req = (k: StringKey, msg: string) => {
    if (active.has(k) && !String(v[k] ?? "").trim()) e[k] = msg;
  };
  req("name", "Enter the candidate's full name");
  req("email", "Enter an email address");
  req("phone", "Enter a phone number");
  req("experience", "Enter total experience");
  req("company", "Enter the current company");
  req("currentCtc", "Enter the current CTC");
  req("expectedCtc", "Enter the expected CTC");
  req("notice", "Select a notice period");
  req("linkedin", "Enter candidate's LinkedIn URL");

  if (!e.name && v.name.trim().length < 2) e.name = "Name is too short";
  if (!e.email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim()))
    e.email = "Enter a valid email, like name@company.com";
  if (!e.phone && v.phone.replace(/\D/g, "").length !== 10)
    e.phone = "Enter a 10-digit mobile number";
  if (!e.experience && (!num.test(v.experience) || Number(v.experience) > 50))
    e.experience = "Enter years as a number, e.g. 4 or 4.5";
  for (const k of ["currentCtc", "expectedCtc"] as const)
    if (!e[k] && active.has(k) && (!num.test(v[k]) || Number(v[k]) <= 0))
      e[k] = "Enter the amount in lakhs, e.g. 32";

  if (!e.linkedin) {
    const li = urlError(v.linkedin, "linkedin.com", "LinkedIn URL");
    if (li) e.linkedin = li;
  }
  const gh = urlError(v.github, "github.com", "GitHub URL");
  if (gh) e.github = gh;
  const pf = urlError(v.portfolio, undefined, "link");
  if (pf) e.portfolio = pf;

  if (!v.resume) e.resume = "Upload the candidate's resume";
  else if (!/\.(pdf|docx?)$/i.test(v.resume.name)) e.resume = "Use a PDF or Word file";
  else if (v.resume.size > MAX_RESUME_BYTES) e.resume = "File is larger than 5 MB";
  if (requiredCount > 0 && v.verifiedRequirements.length < requiredCount) {
    e.verifiedRequirements = "Confirm all must-have requirements before submitting";
  }
  return e;
}

/** Never auto-fills verifiedRequirements — recruiters must verify dealbreakers manually. */
export function buildParsedSample(): Partial<CandidateFormValues> {
  return {
    name: "Sam Smith",
    email: "samsmith@gmail.com",
    phone: "9447361834",
    experience: "4",
    working: "Yes",
    company: "Amazon",
    currentCtc: "32",
    expectedCtc: "40",
    notice: "60 days",
    noticeNegotiable: "Yes",
    education: EDUCATION_OPTIONS[0],
    linkedin: "linkedin.com/in/samsmith",
    github: "github.com/samsmith",
    portfolio: "samsmith.dev",
  };
}

export function useCandidateForm(
  requiredCount: number,
  onSubmit?: (values: CandidateFormValues) => void | Promise<void>,
  initialValues?: Partial<CandidateFormValues>
) {
  const [values, setValues] = useState<CandidateFormValues>(() => ({
    ...EMPTY,
    ...(initialValues || {}),
  }));
  const [touched, setTouched] = useState<Set<Key>>(new Set());
  const [attempted, setAttempted] = useState(false);
  const [status, setStatus] = useState<"idle" | "submitting" | "done">("idle");
  const submittingRef = useRef(false);

  const errors = useMemo(() => validate(values, requiredCount), [values, requiredCount]);

  const set = <K extends Key>(k: K, val: CandidateFormValues[K]) =>
    setValues((v) => ({ ...v, [k]: val }));
  const touch = (k: Key) =>
    setTouched((t) => (t.has(k) ? t : new Set(t).add(k)));

  /** Late validation: only show an error once touched or after a submit attempt. */
  const shown = (k: Key) => (attempted || touched.has(k) ? errors[k] : undefined);

  const bind = (k: StringKey) => ({
    id: `cf-${k}`,
    value: values[k],
    onChange: (v: string) => set(k, v),
    onBlur: () => touch(k),
    error: shown(k),
  });

  /** Prefills empty fields from a parsed resume; preserves anything already typed. */
  const prefill = (parsed: Partial<CandidateFormValues>): number => {
    let count = 0;
    const patch: Partial<CandidateFormValues> = {};
    for (const [k, v] of Object.entries(parsed) as [Key, unknown][]) {
      if (k === "resume") continue;
      const cur = values[k];
      if (Array.isArray(cur) && Array.isArray(v)) {
        if (cur.length === 0 && v.length > 0) {
          (patch[k] as string[]) = v;
          count++;
        }
      } else if ((cur === "" || cur == null) && v != null && v !== "") {
        (patch[k] as unknown) = v;
        count++;
      }
    }
    if (count > 0) setValues((prev) => ({ ...prev, ...patch }));
    return count;
  };

  /** Returns false (and flags every field) when invalid. Guards double submit. */
  const submit = async (): Promise<boolean> => {
    setAttempted(true);
    if (Object.keys(errors).length > 0) return false;
    if (submittingRef.current) return true;
    submittingRef.current = true;
    setStatus("submitting");
    try {
      await onSubmit?.(values);
      await new Promise((r) => setTimeout(r, 700));
    } finally {
      submittingRef.current = false;
    }
    setStatus("done");
    return true;
  };

  const reset = () => {
    setValues(EMPTY);
    setTouched(new Set());
    setAttempted(false);
    setStatus("idle");
  };

  return {
    values, set, bind, errors, shown, touch, prefill, submit, reset, status,
  };
}

export type CandidateForm = ReturnType<typeof useCandidateForm>;

export function focusFirstInvalid(root: HTMLElement | null) {
  requestAnimationFrame(() => {
    const el = root?.querySelector<HTMLElement>('[aria-invalid="true"]');
    if (!el) return;
    const target = el.matches("input,select,textarea,button")
      ? el
      : el.querySelector<HTMLElement>("input,select,textarea,button");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target?.focus({ preventScroll: true });
    target?.scrollIntoView({ block: "center", behavior: reduce ? "auto" : "smooth" });
  });
}
