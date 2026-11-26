import type { JobDetailData } from "@/components/recruiter/JobDetail";

export interface FormEducationEntry {
  id: string;
  degree: string;
  institution: string;
  areaOfStudy?: string;
  startYear: string;
  endYear: string;
  location: string;
  grade: string;
}

export interface FormWorkExperienceEntry {
  id: string;
  role: string;
  company: string;
  startDate: string;
  endDate: string;
  location: string;
  workMode?: string;
  isCurrent?: boolean;
  highlightsText: string;
}

export interface FormProjectEntry {
  id: string;
  title: string;
  subtitle: string;
  description: string;
}

export interface FormCertificationEntry {
  id: string;
  name: string;
  issuer: string;
  issuedDate: string;
  credentialId: string;
}

export interface CandidateFormValues {
  name: string;
  email: string;
  phoneCode: string;
  phone: string;
  location: string;
  workModePreference: string;
  experience: string;
  working: string; // "Yes" | "No" | ""
  company: string;
  currentCtc: string;
  expectedCtc: string;
  notice: string;
  noticeNegotiable: string; // "Yes" | "No" | ""
  education: string;
  educationList: FormEducationEntry[];
  workExperienceList: FormWorkExperienceEntry[];
  projectsList: FormProjectEntry[];
  certificationsList: FormCertificationEntry[];
  skillsList: string[];
  linkedin: string;
  github: string;
  portfolio: string;
  resume: File | null;
  verifiedRequirements: string[];
  remarks: string;
}

export type SubmitCandidateJob = JobDetailData;

export interface SubmitCandidateProps {
  /** Job for which the candidate is being submitted (also powers the Job details tab). */
  job: SubmitCandidateJob;
  /** Close the side panel. */
  onClose: () => void;
  /** Called with validated candidate values on submit. */
  onSubmit?: (values: CandidateFormValues, jobId: SubmitCandidateJob["id"]) => void | Promise<void>;
  className?: string;
  /** Pre-filled candidate values (e.g. when cross-submitting via Add another role). */
  initialValues?: Partial<CandidateFormValues>;
  /** Descriptive banner label explaining where the prefill came from. */
  prefillSourceLabel?: string;
  /** Custom label for the primary submit action button. Defaults to "Submit candidate". */
  submitLabel?: string;
  /** Back button callback to return to role picker drawer. */
  onBack?: () => void;
}
