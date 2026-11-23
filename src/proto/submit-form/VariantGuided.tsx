import type { ReactNode } from "react";
import { Checkbox } from "@/components/shared/Checkbox";
import { CheckIcon, MailIcon } from "@/components/recruiter/SubmitCandidate/icons";
import {
  EDUCATION_OPTIONS,
  NOTICE_OPTIONS,
} from "@/components/recruiter/SubmitCandidate/useCandidateForm";
import type { StringKey } from "@/components/recruiter/SubmitCandidate/useCandidateForm";
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

function Card({
  n,
  title,
  checks,
  children,
}: {
  n: number;
  title: string;
  checks: boolean[];
  children: ReactNode;
}) {
  const done = checks.every(Boolean);
  const filled = checks.filter(Boolean).length;
  return (
    <section className={v.card} data-done={done ? "" : undefined}>
      <header className={v.cardHead}>
        <span className={v.step} data-done={done ? "" : undefined} aria-hidden="true">
          {done ? <CheckIcon size={14} /> : n}
        </span>
        <h3 className={v.cardTitle}>{title}</h3>
        <span className={v.cardMeta}>
          {done ? "Complete" : `${filled}/${checks.length}`}
        </span>
      </header>
      {children}
    </section>
  );
}

/** Variant 2 — Guided: each section is a surface card with its own completion state + overall progress. */
export default function VariantGuided({ form, requirements, onShortcutSubmit }: VariantProps) {
  useModelDefaults(form);
  const { x, patch } = useExtras();
  const { values, set, bind, touch, shown, errors } = form;
  const employed = values.working !== "No";
  const showNeg = values.notice !== "" && values.notice !== "Immediately";
  const ok = (k: StringKey) => String(values[k]).trim() !== "" && !errors[k];

  const basic = [ok("name"), ok("email"), ok("phone"), x.location.trim() !== ""];
  const work = [
    ok("experience"),
    ok("expectedCtc"),
    ok("notice"),
    ...(employed ? [ok("company"), ok("currentCtc")] : []),
  ];
  const profile = [ok("education")];
  const verify = [
    requirements.length === 0 || values.verifiedRequirements.length === requirements.length,
    x.consent,
  ];
  const all = [basic, work, profile, verify];
  const doneCount = all.filter((c) => c.every(Boolean)).length;

  return (
    <div className={v.stack}>
      <div className={v.progress} role="status" aria-live="polite">
        <div className={v.progressTop}>
          <span className={v.label}>Submission progress</span>
          <span className={v.progressText}>{doneCount} of {all.length} sections complete</span>
        </div>
        <div className={v.bar} aria-hidden="true">
          {all.map((c, i) => (
            <span key={i} className={v.seg} data-on={c.every(Boolean) ? "" : undefined} />
          ))}
        </div>
      </div>

      <Card n={1} title="Candidate" checks={basic}>
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
          <TextField
            id="cf-location"
            label="Current location"
            value={x.location}
            onChange={(val) => patch({ location: val })}
            placeholder="Bengaluru"
            autoComplete="address-level2"
          />
          <div className={v.field}>
            <span className={v.label} aria-hidden="true">&nbsp;</span>
            <div style={{ minHeight: 40, display: "flex", alignItems: "center" }}>
              <Checkbox
                label="Open to relocate"
                checked={x.relocate}
                onChange={(e) => patch({ relocate: e.target.checked })}
              />
            </div>
          </div>
        </div>
      </Card>

      <Card n={2} title="Experience & pay" checks={work}>
        <div className={v.grid}>
          <TextField {...bind("experience")} label="Total experience" numeric suffix="Years" placeholder="4" />
          {employed ? (
            <TextField {...bind("company")} label="Current company" placeholder="Amazon" />
          ) : (
            <div />
          )}
          <div className={v.full}>
            <Checkbox
              label="Not currently employed"
              checked={!employed}
              onChange={(e) => set("working", e.target.checked ? "No" : "Yes")}
            />
          </div>
          {employed && (
            <TextField {...bind("currentCtc")} label="Current CTC" numeric suffix="Lakhs" placeholder="32" />
          )}
          <TextField {...bind("expectedCtc")} label="Expected CTC" numeric suffix="Lakhs" placeholder="40" />
          <DesignedDropdownField
            {...bind("notice")}
            label="Notice period"
            options={NOTICE_OPTIONS}
          />
          {showNeg && (
            <div className={v.field}>
              <span className={v.label} aria-hidden="true">&nbsp;</span>
              <div style={{ minHeight: 40, display: "flex", alignItems: "center" }}>
                <Checkbox
                  label="Negotiable"
                  checked={values.noticeNegotiable === "Yes"}
                  onChange={(e) => set("noticeNegotiable", e.target.checked ? "Yes" : "No")}
                />
              </div>
            </div>
          )}
        </div>
      </Card>

      <Card n={3} title="Profile" checks={profile}>
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
        </div>
      </Card>

      <Card n={4} title="Verify & submit" checks={verify}>
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
      </Card>
    </div>
  );
}
