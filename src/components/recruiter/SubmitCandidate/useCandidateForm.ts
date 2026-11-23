import { useMemo, useRef, useState } from "react";
import type {
  CandidateFormValues,
  FormCertificationEntry,
  FormEducationEntry,
  FormProjectEntry,
  FormWorkExperienceEntry,
} from "./SubmitCandidate.types";

export type Key = keyof CandidateFormValues;
export type StringKey = Exclude<
  Key,
  | "resume"
  | "verifiedRequirements"
  | "educationList"
  | "workExperienceList"
  | "projectsList"
  | "certificationsList"
  | "skillsList"
>;

export function createEmptyEducation(id = `edu-${Date.now()}`): FormEducationEntry {
  return {
    id,
    degree: "",
    institution: "",
    startYear: "",
    endYear: "",
    location: "",
    grade: "",
  };
}

export function createEmptyWorkExperience(id = `exp-${Date.now()}`): FormWorkExperienceEntry {
  return {
    id,
    role: "",
    company: "",
    startDate: "",
    endDate: "Present",
    location: "",
    highlightsText: "",
  };
}

export function createEmptyProject(id = `proj-${Date.now()}`): FormProjectEntry {
  return {
    id,
    title: "",
    subtitle: "",
    description: "",
  };
}

export function createEmptyCertification(id = `cert-${Date.now()}`): FormCertificationEntry {
  return {
    id,
    name: "",
    issuer: "",
    issuedDate: "",
    credentialId: "",
  };
}

export const EMPTY: CandidateFormValues = {
  name: "",
  email: "",
  phoneCode: "+91",
  phone: "",
  location: "",
  workModePreference: "Hybrid / Remote",
  experience: "",
  working: "Yes",
  company: "",
  currentCtc: "",
  expectedCtc: "",
  notice: "",
  noticeNegotiable: "No",
  education: "",
  educationList: [createEmptyEducation("edu-1")],
  workExperienceList: [createEmptyWorkExperience("exp-1")],
  projectsList: [createEmptyProject("proj-1")],
  certificationsList: [createEmptyCertification("cert-1")],
  skillsList: [],
  linkedin: "",
  github: "",
  portfolio: "",
  resume: null,
  verifiedRequirements: [],
  remarks: "",
};

export const NOTICE_OPTIONS = ["Immediately", "15 days", "30 days", "45 days", "60 days", "90 days"];
export const WORK_MODE_OPTIONS = ["Hybrid / Remote", "Remote", "Hybrid", "On-site"];
export const YEAR_OPTIONS = Array.from({ length: 36 }, (_, i) => String(2030 - i));
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
    "name",
    "email",
    "phone",
    "location",
    "workModePreference",
    "experience",
    "expectedCtc",
    "notice",
    "linkedin",
    "github",
    "portfolio",
    "resume",
    "verifiedRequirements",
    "remarks",
  ];
  if (v.working !== "No") keys.push("currentCtc");
  return keys;
}

export const REQUIRED: Key[] = [
  "name",
  "email",
  "phone",
  "experience",
  "currentCtc",
  "expectedCtc",
  "notice",
  "linkedin",
  "resume",
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
    name: "Rohan Mehta",
    email: "rohan.mehta@gmail.com",
    phone: "9845061834",
    location: "Bengaluru, India",
    workModePreference: "Hybrid / Remote",
    experience: "6",
    working: "Yes",
    company: "Zeta",
    currentCtc: "32",
    expectedCtc: "45",
    notice: "30 days",
    noticeNegotiable: "Yes",
    education: EDUCATION_OPTIONS[0],
    educationList: [
      {
        id: "edu-1",
        degree: "B.Tech in Computer Science & Engineering",
        institution: "National Institute of Technology Karnataka (NITK), Surathkal",
        startYear: "2016",
        endYear: "2020",
        location: "Mangaluru",
        grade: "8.9 CGPA · First Class with Distinction",
      },
    ],
    workExperienceList: [
      {
        id: "exp-1",
        role: "Senior Frontend Engineer",
        company: "Zeta",
        startDate: "Apr 2023",
        endDate: "Present",
        location: "Bengaluru · Hybrid",
        highlightsText: [
          "Architected the core card-issuing console in React 18 & TypeScript used by 40+ enterprise banking partners.",
          "Led migration to a token-driven design system, cutting feature delivery cycle time by 34% across 6 squads.",
          "Reduced P95 interaction latency (INP) from 240ms to 68ms via virtualized data grids and web-worker offloads.",
        ].join("\n"),
      },
      {
        id: "exp-2",
        role: "Software Engineer II — Web Platform",
        company: "Razorpay",
        startDate: "Jul 2020",
        endDate: "Mar 2023",
        location: "Bengaluru",
        highlightsText: [
          "Built merchant checkout customization workflows handling over ₹1,200 Cr in monthly transaction volume.",
          "Authored automated Playwright visual regression suites achieving 99.4% release confidence across payment flows.",
        ].join("\n"),
      },
    ],
    projectsList: [
      {
        id: "proj-1",
        title: "Bolt UI — Multi-Brand Design Token Engine",
        subtitle: "Lead Author · 2025",
        description:
          "Zero-runtime CSS token pipeline and accessible React primitive library supporting instant theme switching and WCAG AA contrast validation.",
      },
      {
        id: "proj-2",
        title: "TraceLens Web Vitals Telemetry",
        subtitle: "Creator · 2024",
        description:
          "Lightweight RUM collector and flamegraph visualizer for long animation frames (LoAF) and INP attribution.",
      },
    ],
    certificationsList: [
      {
        id: "cert-1",
        name: "Google Cloud Certified — Professional Cloud Developer",
        issuer: "Google Cloud",
        issuedDate: "Aug 2025",
        credentialId: "GCP-PCD-994182",
      },
      {
        id: "cert-2",
        name: "W3C Web Accessibility Specialist (WAS)",
        issuer: "IAAP / W3C",
        issuedDate: "Jan 2024",
        credentialId: "IAAP-WAS-41029",
      },
    ],
    skillsList: [
      "TypeScript",
      "React 18/19",
      "Next.js",
      "JavaScript (ES2024)",
      "HTML5 / CSS Architecture",
      "Design Systems",
      "GraphQL & Apollo",
      "Core Web Vitals (LCP / INP)",
      "Accessibility (WCAG 2.2 AA)",
      "Playwright & Vitest",
      "Node.js",
      "Webpack / Vite",
    ],
    linkedin: "linkedin.com/in/rohan-mehta",
    github: "github.com/rohan-mehta",
    portfolio: "rohan-mehta.dev",
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

      if (k === "educationList" && Array.isArray(v)) {
        const isDefaultBlank =
          values.educationList.length === 1 &&
          !values.educationList[0].degree.trim() &&
          !values.educationList[0].institution.trim();
        if (values.educationList.length === 0 || isDefaultBlank) {
          patch.educationList = v as FormEducationEntry[];
          count++;
        }
        continue;
      }

      if (k === "workExperienceList" && Array.isArray(v)) {
        const isDefaultBlank =
          values.workExperienceList.length === 1 &&
          !values.workExperienceList[0].role.trim() &&
          !values.workExperienceList[0].company.trim();
        if (values.workExperienceList.length === 0 || isDefaultBlank) {
          patch.workExperienceList = v as FormWorkExperienceEntry[];
          count++;
        }
        continue;
      }

      if (k === "projectsList" && Array.isArray(v)) {
        const isDefaultBlank =
          values.projectsList.length === 1 &&
          !values.projectsList[0].title.trim() &&
          !values.projectsList[0].description.trim();
        if (values.projectsList.length === 0 || isDefaultBlank) {
          patch.projectsList = v as FormProjectEntry[];
          count++;
        }
        continue;
      }

      if (k === "certificationsList" && Array.isArray(v)) {
        const isDefaultBlank =
          values.certificationsList.length === 1 &&
          !values.certificationsList[0].name.trim() &&
          !values.certificationsList[0].issuer.trim();
        if (values.certificationsList.length === 0 || isDefaultBlank) {
          patch.certificationsList = v as FormCertificationEntry[];
          count++;
        }
        continue;
      }

      if (Array.isArray(cur) && Array.isArray(v)) {
        if (cur.length === 0 && v.length > 0) {
          (patch[k] as string[]) = v as string[];
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
    setValues({
      ...EMPTY,
      educationList: [createEmptyEducation("edu-1")],
      workExperienceList: [createEmptyWorkExperience("exp-1")],
      projectsList: [createEmptyProject("proj-1")],
      certificationsList: [createEmptyCertification("cert-1")],
    });
    setTouched(new Set());
    setAttempted(false);
    setStatus("idle");
  };

  return {
    values,
    set,
    bind,
    errors,
    shown,
    touch,
    prefill,
    submit,
    reset,
    status,
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
