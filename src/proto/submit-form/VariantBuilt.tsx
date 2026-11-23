import { useState } from "react";
import type { KeyboardEvent } from "react";
import { Checkbox } from "@/components/shared/Checkbox";
import { CheckIcon, MailIcon } from "@/components/recruiter/SubmitCandidate/icons";
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
import { budgetVerdict, useExtras, useModelDefaults } from "./shared";
import type { VariantProps } from "./shared";
import v from "./v2.module.css";

function Stepper({
  id,
  label,
  value,
  onChange,
  onBlur,
  error,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  error?: string;
}) {
  const n = Number(value);
  const valid = value !== "" && !Number.isNaN(n);
  const bump = (d: number) => {
    const next = Math.min(50, Math.max(0, (valid ? n : 0) + d));
    onChange(String(Math.round(next * 2) / 2));
  };
  return (
    <div className={v.field}>
      <label htmlFor={id} className={v.label}>{label}</label>
      <div className={v.stepper} data-invalid={error ? "" : undefined}>
        <button type="button" className={v.stepBtn} aria-label="Decrease by half a year" disabled={valid && n <= 0} onClick={() => bump(-0.5)}>−</button>
        <div className={v.stepMid}>
          <input
            id={id}
            className={v.stepVal}
            style={{ width: `${Math.max(2, value.length)}ch` }}
            inputMode="decimal"
            value={value}
            placeholder="0"
            autoComplete="off"
            aria-invalid={error ? true : undefined}
            onChange={(e) => onChange(e.target.value.replace(/[^\d.]/g, ""))}
            onBlur={onBlur}
          />
          <span className={v.stepUnit}>yrs</span>
        </div>
        <button type="button" className={v.stepBtn} aria-label="Increase by half a year" onClick={() => bump(0.5)}>+</button>
      </div>
      {error && <p className={v.sub} style={{ color: "var(--primitives-error-600)" }}>{error}</p>}
    </div>
  );
}

function ChipChoice({
  label,
  options,
  value,
  onChange,
  error,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
  error?: string;
}) {
  const idx = options.indexOf(value);
  const onKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    const d = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const next = options[(Math.max(idx, 0) + d + options.length) % options.length];
    onChange(next);
    (e.currentTarget.parentElement?.querySelector(`[data-v="${next}"]`) as HTMLElement | null)?.focus();
  };
  return (
    <div className={v.field}>
      <span className={v.label} id="cf-notice-lbl">{label}</span>
      <div className={v.chipGroup} role="radiogroup" aria-labelledby="cf-notice-lbl" data-invalid={error ? "" : undefined}>
        {options.map((o, i) => (
          <button
            key={o}
            type="button"
            role="radio"
            data-v={o}
            aria-checked={value === o}
            tabIndex={value === o || (idx < 0 && i === 0) ? 0 : -1}
            className={v.chip}
            onClick={() => onChange(o)}
            onKeyDown={onKey}
          >
            {o}
          </button>
        ))}
      </div>
      {error && <p className={v.sub} style={{ color: "var(--primitives-error-600)" }}>{error}</p>}
    </div>
  );
}

/** Variant 4 — Purpose-built controls: stepper, notice chips, pay-vs-budget, add-a-link. Applies every field recommendation. */
export default function VariantBuilt({ form, requirements, job, onShortcutSubmit }: VariantProps) {
  useModelDefaults(form);
  const { x, patch } = useExtras();
  const { values, set, bind, touch, shown } = form;
  const employed = values.working !== "No";
  const showNeg = values.notice !== "" && values.notice !== "Immediately";
  const verdict = budgetVerdict(values.expectedCtc, job.packageLabel);
  const [open, setOpen] = useState({ github: false, portfolio: false });
  const showGithub = open.github || values.github !== "";
  const showPortfolio = open.portfolio || values.portfolio !== "";

  return (
    <div className={v.stack}>
      <section className={v.section}>
        <h3 className={v.title}>Candidate</h3>
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
          <div className={v.full}>
            <div className={v.field}>
              <TextField
                id="cf-location"
                label="Current location"
                value={x.location}
                onChange={(val) => patch({ location: val })}
                placeholder="Bengaluru"
                autoComplete="address-level2"
              />
              <Checkbox
                label={`Open to relocate${job.location ? ` to ${job.location}` : ""}`}
                checked={x.relocate}
                onChange={(e) => patch({ relocate: e.target.checked })}
              />
            </div>
          </div>
        </div>
      </section>

      <section className={v.section}>
        <h3 className={v.title}>Experience & pay</h3>
        <div className={v.grid}>
          <Stepper {...bind("experience")} label="Total experience" />
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
          <div className={v.full}>
            <div className={v.payPair}>
              {employed ? (
                <TextField {...bind("currentCtc")} label="Current CTC" numeric suffix="Lakhs" placeholder="32" />
              ) : (
                <div />
              )}
              <span className={v.payArrow} aria-hidden="true">→</span>
              <TextField {...bind("expectedCtc")} label="Expected CTC" numeric suffix="Lakhs" placeholder="40" />
            </div>
          </div>
          {verdict && (
            <div className={v.full}>
              <span className={v.verdict} data-tone={verdict.tone} role="status">
                {verdict.tone === "ok" && <CheckIcon size={12} />}
                {verdict.text}
              </span>
            </div>
          )}
          <div className={v.full}>
            <ChipChoice
              label="Notice period"
              options={NOTICE_OPTIONS}
              value={values.notice}
              onChange={(val) => set("notice", val)}
              error={shown("notice")}
            />
          </div>
          {showNeg && (
            <div className={v.full}>
              <Checkbox
                label="Notice period is negotiable"
                checked={values.noticeNegotiable === "Yes"}
                onChange={(e) => set("noticeNegotiable", e.target.checked ? "Yes" : "No")}
              />
            </div>
          )}
        </div>
      </section>

      <section className={v.section}>
        <h3 className={v.title}>Profile</h3>
        <div className={v.grid}>
          <div className={v.full}>
            <DesignedDropdownField
              {...bind("education")}
              label="Highest education qualification"
              options={EDUCATION_OPTIONS}
            />
          </div>
          <div className={v.full}>
            <TextField {...bind("linkedin")} label="LinkedIn" type="url" optional placeholder="linkedin.com/in/samsmith" />
          </div>
          {showGithub && (
            <div className={v.full}>
              <TextField {...bind("github")} label="GitHub" type="url" optional placeholder="github.com/samsmith" />
            </div>
          )}
          {showPortfolio && (
            <div className={v.full}>
              <TextField {...bind("portfolio")} label="Portfolio" type="url" optional placeholder="samsmith.dev" />
            </div>
          )}
          {(!showGithub || !showPortfolio) && (
            <div className={`${v.full} ${v.addRow}`}>
              {!showGithub && (
                <button type="button" className={v.addBtn} onClick={() => setOpen((o) => ({ ...o, github: true }))}>+ GitHub</button>
              )}
              {!showPortfolio && (
                <button type="button" className={v.addBtn} onClick={() => setOpen((o) => ({ ...o, portfolio: true }))}>+ Portfolio</button>
              )}
            </div>
          )}
        </div>
      </section>

      <section className={v.section}>
        <h3 className={v.title}>Verify & submit</h3>
        <DesignedChecklistField
          id="cf-requirements"
          legend="Must-have requirements"
          hint="Only tick what you've verified in the resume or on a call."
          options={requirements}
          values={values.verifiedRequirements}
          onChange={(next) => set("verifiedRequirements", next)}
          onBlur={() => touch("verifiedRequirements")}
          error={shown("verifiedRequirements")}
          appearance="boxed"
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
