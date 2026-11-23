import type { ReactNode } from "react";
import { Checkbox } from "@/components/shared/Checkbox";
import { MailIcon } from "@/components/recruiter/SubmitCandidate/icons";
import {
  EDUCATION_OPTIONS,
  NOTICE_OPTIONS,
} from "@/components/recruiter/SubmitCandidate/useCandidateForm";
import {
  DesignedChecklistField,
  DesignedDropdownField,
  PhoneField,
  TextAreaField,
  TextField,
} from "./ProtoControls";
import { useExtras, useModelDefaults } from "./shared";
import type { VariantProps } from "./shared";
import v from "./v2.module.css";

function Row({ label, optional, children }: { label: string; optional?: boolean; children: ReactNode }) {
  return (
    <div className={v.row}>
      <span className={v.rowLabel} aria-hidden="true">
        {label}
        {optional && <em> · Optional</em>}
      </span>
      <div className={v.cell}>{children}</div>
    </div>
  );
}

/** Variant 3 — Spec sheet: label column + ghost inputs that show their border on hover/focus. Reads like a profile, edits like a form. */
export default function VariantSheet({ form, requirements, onShortcutSubmit }: VariantProps) {
  useModelDefaults(form);
  const { x, patch } = useExtras();
  const { values, set, bind, touch, shown } = form;
  const employed = values.working !== "No";
  const showNeg = values.notice !== "" && values.notice !== "Immediately";

  return (
    <div className={v.stack}>
      <section className={v.section}>
        <h3 className={v.eyebrow}>Candidate</h3>
        <div className={`${v.sheet} ${v.ghost}`}>
          <Row label="Name">
            <TextField {...bind("name")} label="Name" autoComplete="name" placeholder="Sam Smith" />
          </Row>
          <Row label="Email">
            <TextField
              {...bind("email")}
              label="Email"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="name@company.com"
              prefix={<MailIcon />}
            />
          </Row>
          <Row label="Phone">
            <PhoneField
              {...bind("phone")}
              label="Phone number"
              code={values.phoneCode}
              onCode={(c) => set("phoneCode", c)}
            />
          </Row>
          <Row label="Location">
            <TextField
              id="cf-location"
              label="Current location"
              value={x.location}
              onChange={(val) => patch({ location: val })}
              placeholder="Bengaluru"
              autoComplete="address-level2"
            />
            <Checkbox
              label="Open to relocate"
              checked={x.relocate}
              onChange={(e) => patch({ relocate: e.target.checked })}
            />
          </Row>
        </div>
      </section>

      <section className={v.section}>
        <h3 className={v.eyebrow}>Experience & pay</h3>
        <div className={`${v.sheet} ${v.ghost}`}>
          <Row label="Experience">
            <TextField {...bind("experience")} label="Total experience" numeric suffix="Years" placeholder="4" />
          </Row>
          <Row label="Company">
            {employed && (
              <TextField {...bind("company")} label="Current company" placeholder="Amazon" />
            )}
            <Checkbox
              label="Not currently employed"
              checked={!employed}
              onChange={(e) => set("working", e.target.checked ? "No" : "Yes")}
            />
          </Row>
          {employed && (
            <Row label="Current CTC">
              <TextField {...bind("currentCtc")} label="Current CTC" numeric suffix="Lakhs" placeholder="32" />
            </Row>
          )}
          <Row label="Expected CTC">
            <TextField {...bind("expectedCtc")} label="Expected CTC" numeric suffix="Lakhs" placeholder="40" />
          </Row>
          <Row label="Notice period">
            <DesignedDropdownField {...bind("notice")} label="Notice period" options={NOTICE_OPTIONS} />
            {showNeg && (
              <Checkbox
                label="Negotiable"
                checked={values.noticeNegotiable === "Yes"}
                onChange={(e) => set("noticeNegotiable", e.target.checked ? "Yes" : "No")}
              />
            )}
          </Row>
        </div>
      </section>

      <section className={v.section}>
        <h3 className={v.eyebrow}>Profile</h3>
        <div className={`${v.sheet} ${v.ghost}`}>
          <Row label="Education">
            <DesignedDropdownField
              {...bind("education")}
              label="Highest education qualification"
              options={EDUCATION_OPTIONS}
            />
          </Row>
          <Row label="LinkedIn" optional>
            <TextField {...bind("linkedin")} label="LinkedIn" type="url" placeholder="linkedin.com/in/samsmith" />
          </Row>
          <Row label="GitHub" optional>
            <TextField {...bind("github")} label="GitHub" type="url" placeholder="github.com/samsmith" />
          </Row>
          <Row label="Portfolio" optional>
            <TextField {...bind("portfolio")} label="Portfolio" type="url" placeholder="samsmith.dev" />
          </Row>
        </div>
      </section>

      <section className={v.section}>
        <h3 className={v.eyebrow}>Verify & submit</h3>
        <DesignedChecklistField
          id="cf-requirements"
          legend="Must-have requirements"
          hint="Only tick what you've verified in the resume or on a call."
          options={requirements}
          values={values.verifiedRequirements}
          onChange={(next) => set("verifiedRequirements", next)}
          onBlur={() => touch("verifiedRequirements")}
          error={shown("verifiedRequirements")}
          appearance="plain"
        />
        <TextAreaField
          id="cf-remarks"
          label="Why this candidate fits"
          optional
          value={values.remarks}
          onChange={(val) => set("remarks", val)}
          onBlur={bind("remarks").onBlur}
          onSubmitShortcut={onShortcutSubmit}
          placeholder="Two lines the hiring team should read first"
        />
        <div className={v.consent}>
          <Checkbox
            label="The candidate has agreed to be submitted for this role"
            checked={x.consent}
            onChange={(e) => patch({ consent: e.target.checked })}
          />
        </div>
      </section>
    </div>
  );
}
