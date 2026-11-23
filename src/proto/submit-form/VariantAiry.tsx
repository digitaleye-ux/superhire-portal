import { MailIcon } from "@/components/recruiter/SubmitCandidate/icons";
import {
  EDUCATION_OPTIONS,
  NOTICE_OPTIONS,
} from "@/components/recruiter/SubmitCandidate/useCandidateForm";
import type { CandidateForm } from "@/components/recruiter/SubmitCandidate/useCandidateForm";
import {
  DesignedChecklistField,
  DesignedDropdownField,
  DesignedRadioField,
  PhoneField,
  TextAreaField,
  TextField,
} from "./ProtoControls";
import v from "./variants.module.css";

/** Variant 1 — Airy & Borderless: no dividers, 36px gaps, inline Radios, Dropdowns, plain Checkboxes. */
export default function VariantAiry({
  form,
  requirements,
  onShortcutSubmit,
}: {
  form: CandidateForm;
  requirements: string[];
  job?: unknown;
  onShortcutSubmit: () => void;
}) {
  const { values, set, bind, touch, shown } = form;
  const working = values.working === "Yes";
  const showNegotiable = values.notice !== "" && values.notice !== "Immediately";

  return (
    <div className={v.airyForm}>
      <section className={v.airySection}>
        <h3 className={v.sectionTitle}>Basic information</h3>
        <div className={v.grid}>
          <div className={v.full}>
            <TextField {...bind("name")} label="Name" autoComplete="name" placeholder="Sam Smith" />
          </div>
          <TextField
            {...bind("email")}
            label="Email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="name@company.com"
            prefix={<MailIcon />}
          />
          <PhoneField
            {...bind("phone")}
            label="Phone number"
            code={values.phoneCode}
            onCode={(c) => set("phoneCode", c)}
          />
        </div>
      </section>

      <section className={v.airySection}>
        <h3 className={v.sectionTitle}>Employment details</h3>
        <div className={v.grid}>
          <TextField {...bind("experience")} label="Total experience" numeric suffix="Years" placeholder="4" />
          <DesignedRadioField {...bind("working")} label="Currently working?" appearance="inline" />
          {working && (
            <div className={v.full}>
              <TextField {...bind("company")} label="Current company" placeholder="Amazon" />
            </div>
          )}
          {working && (
            <TextField {...bind("currentCtc")} label="Current CTC" numeric suffix="Lakhs" placeholder="32" />
          )}
          <TextField {...bind("expectedCtc")} label="Expected CTC" numeric suffix="Lakhs" placeholder="40" />
          <DesignedDropdownField
            {...bind("notice")}
            label="Notice period"
            options={NOTICE_OPTIONS}
            align="right"
          />
          {showNegotiable && (
            <DesignedRadioField
              {...bind("noticeNegotiable")}
              label="Notice negotiable?"
              appearance="inline"
            />
          )}
        </div>
      </section>

      <section className={v.airySection}>
        <h3 className={v.sectionTitle}>Other details</h3>
        <div className={v.grid}>
          <div className={v.full}>
            <DesignedDropdownField
              {...bind("education")}
              label="Highest education qualification"
              options={EDUCATION_OPTIONS}
            />
          </div>
          <TextField {...bind("linkedin")} label="LinkedIn" type="url" optional placeholder="linkedin.com/in/samsmith" />
          <TextField {...bind("github")} label="GitHub" type="url" optional placeholder="github.com/samsmith" />
          <div className={v.full}>
            <TextField {...bind("portfolio")} label="Portfolio / website" type="url" optional placeholder="samsmith.dev" />
          </div>
        </div>
      </section>

      <section className={v.airySection}>
        <h3 className={v.sectionTitle}>Must-have requirements</h3>
        <div className={v.grid}>
          <div className={v.full}>
            <DesignedChecklistField
              id="cf-requirements"
              legend="Confirm the candidate meets all dealbreakers"
              hint="Only submit if you've verified these in the resume or on a call."
              options={requirements}
              values={values.verifiedRequirements}
              onChange={(next) => set("verifiedRequirements", next)}
              onBlur={() => touch("verifiedRequirements")}
              error={shown("verifiedRequirements")}
              appearance="plain"
            />
          </div>
          <div className={v.full}>
            <TextAreaField
              id="cf-remarks"
              label="Additional remarks"
              optional
              value={values.remarks}
              onChange={(val) => set("remarks", val)}
              onBlur={bind("remarks").onBlur}
              onSubmitShortcut={onShortcutSubmit}
              placeholder="Anything the hiring team should know about this candidate"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
