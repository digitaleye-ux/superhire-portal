import type { JobDetailData } from "@/components/recruiter/JobDetail";

export interface CandidateFormValues {
  name: string;
  email: string;
  phoneCode: string;
  phone: string;
  experience: string;
  working: string; // "Yes" | "No" | ""
  company: string;
  currentCtc: string;
  expectedCtc: string;
  notice: string;
  noticeNegotiable: string; // "Yes" | "No" | ""
  education: string;
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
  /** Back button callback to return to role picker drawer. */
  onBack?: () => void;
}
