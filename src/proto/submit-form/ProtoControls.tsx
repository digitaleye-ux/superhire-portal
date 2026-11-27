import { useId } from "react";
import type { KeyboardEvent, ReactNode } from "react";
import { Dropdown } from "@/components/shared/Dropdown";
import { Radio } from "@/components/shared/Radio";
import { Checkbox } from "@/components/shared/Checkbox";
import { COUNTRY_CODES } from "@/components/recruiter/SubmitCandidate/useCandidateForm";
import styles from "./ProtoControls.module.css";

function Msg({ id, error, hint }: { id: string; error?: string; hint?: string }) {
  if (!error && !hint) return null;
  return (
    <p id={id} className={error ? styles.error : styles.hint} aria-live="polite">
      {error ?? hint}
    </p>
  );
}

export function TextField({
  id,
  label,
  value,
  onChange,
  onBlur,
  error,
  type = "text",
  inputMode,
  autoComplete = "off",
  placeholder,
  optional,
  prefix,
  suffix,
  numeric,
  autoFocus,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  error?: string;
  type?: "text" | "email" | "url";
  inputMode?: "text" | "decimal" | "email" | "url";
  autoComplete?: string;
  placeholder?: string;
  optional?: boolean;
  prefix?: ReactNode;
  suffix?: string;
  numeric?: boolean;
  autoFocus?: boolean;
}) {
  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}
        {optional && <span className={styles.optional}> · Optional</span>}
      </label>
      <div className={styles.control} data-invalid={error ? "" : undefined}>
        {prefix && <span className={styles.prefix}>{prefix}</span>}
        <input
          id={id}
          className={styles.input}
          style={{
            paddingLeft: prefix ? 38 : undefined,
            paddingRight: suffix ? `calc(${suffix.length}ch + 28px)` : undefined,
          }}
          type={type}
          inputMode={numeric ? "decimal" : inputMode}
          value={value}
          onChange={(e) =>
            onChange(numeric ? e.target.value.replace(/[^\d.]/g, "") : e.target.value)
          }
          onBlur={onBlur}
          autoComplete={autoComplete}
          spellCheck={false}
          placeholder={placeholder}
          aria-invalid={error ? true : undefined}
          autoFocus={autoFocus}
        />
        {suffix && <span className={styles.suffix}>{suffix}</span>}
      </div>
      <Msg id={`${id}-msg`} error={error} />
    </div>
  );
}

export function PhoneField({
  id,
  label,
  value,
  code,
  onChange,
  onCode,
  onBlur,
  error,
}: {
  id: string;
  label: string;
  value: string;
  code: string;
  onChange: (v: string) => void;
  onCode: (v: string) => void;
  onBlur?: () => void;
  error?: string;
}) {
  const currentCode = code || "+91";
  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <div className={styles.phoneControl} data-invalid={error ? "" : undefined}>
        <Dropdown
          label={currentCode}
          options={COUNTRY_CODES.map((c) => ({ value: c, label: c }))}
          selected={[currentCode]}
          onChange={(next) => onCode(next[0] ?? "+91")}
          multiple={false}
          singleShowsValue
          align="left"
          className={styles.phoneDropdownRoot}
          triggerClassName={styles.phoneDropdownTrigger}
          menuClassName={styles.phoneDropdownMenu}
        />
        <input
          id={id}
          className={styles.phoneInput}
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          value={value}
          onChange={(e) => onChange(e.target.value.replace(/[^\d\s-]/g, ""))}
          onBlur={onBlur}
          placeholder="98765 43210"
          aria-invalid={error ? true : undefined}
        />
      </div>
      <Msg id={`${id}-msg`} error={error} />
    </div>
  );
}

/** Designed Dropdown wrapper (single-select, uses shared Dropdown with Radio menu). */
export function DesignedDropdownField({
  id,
  label,
  value,
  options,
  onChange,
  error,
  placeholder = "Select",
  align = "left",
}: {
  id: string;
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
  error?: string;
  placeholder?: string;
  align?: "left" | "right";
}) {
  return (
    <div className={styles.field}>
      <span id={`${id}-lbl`} className={styles.label}>
        {label}
      </span>
      <div
        className={styles.dropdownFull}
        data-invalid={error ? "" : undefined}
        aria-labelledby={`${id}-lbl`}
      >
        <Dropdown
          variant="form"
          size="lg"
          fullWidth
          label={label}
          placeholder={placeholder}
          multiple={false}
          singleShowsValue
          align={align}
          options={options.map((o) => ({ value: o, label: o }))}
          selected={value ? [value] : []}
          onChange={(next) => onChange(next[0] ?? "")}
          invalid={Boolean(error)}
        />
      </div>
      <Msg id={`${id}-msg`} error={error} />
    </div>
  );
}

/** Designed Radio group: "inline" (plain horizontal radios) or "card" (bordered radio tiles). */
export function DesignedRadioField({
  id,
  label,
  value,
  options = ["Yes", "No"],
  onChange,
  onBlur,
  error,
  appearance = "inline",
}: {
  id: string;
  label: string;
  value: string;
  options?: string[];
  onChange: (v: string) => void;
  onBlur?: () => void;
  error?: string;
  appearance?: "inline" | "card";
}) {
  const name = useId();
  return (
    <fieldset className={styles.fieldset} aria-invalid={error ? true : undefined}>
      <legend className={styles.label}>{label}</legend>
      {appearance === "card" ? (
        <div className={styles.radioCardGroup} data-invalid={error ? "" : undefined}>
          {options.map((o) => (
            <div key={o} className={styles.radioCard} data-on={value === o ? "" : undefined}>
              <Radio
                name={name}
                label={o}
                value={o}
                checked={value === o}
                onChange={() => onChange(o)}
                onBlur={onBlur}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.radioInline}>
          {options.map((o) => (
            <Radio
              key={o}
              name={name}
              label={o}
              value={o}
              checked={value === o}
              onChange={() => onChange(o)}
              onBlur={onBlur}
            />
          ))}
        </div>
      )}
      <Msg id={`${id}-msg`} error={error} />
    </fieldset>
  );
}

/** Designed Checkbox checklist: "plain" (clean rows without borders) or "boxed" (bordered rows). */
export function DesignedChecklistField({
  id,
  legend,
  options,
  values,
  onChange,
  onBlur,
  hint,
  error,
  appearance = "plain",
}: {
  id: string;
  legend: string;
  options: string[];
  values: string[];
  onChange: (v: string[]) => void;
  onBlur?: () => void;
  hint?: string;
  error?: string;
  appearance?: "plain" | "boxed";
}) {
  const toggle = (o: string) =>
    onChange(values.includes(o) ? values.filter((x) => x !== o) : [...values, o]);
  return (
    <fieldset className={styles.fieldset} aria-invalid={error ? true : undefined}>
      <div className={styles.legendRow}>
        <legend className={styles.label}>{legend}</legend>
        <span className={styles.legendCount}>
          {values.length}/{options.length} verified
        </span>
      </div>
      {hint && <p className={styles.hint}>{hint}</p>}
      <div
        className={appearance === "boxed" ? styles.checkListBoxed : styles.checkListPlain}
        data-invalid={error ? "" : undefined}
      >
        {options.map((o) => {
          const on = values.includes(o);
          return (
            <div
              key={o}
              className={appearance === "boxed" ? styles.checkCard : styles.checkListRow}
              data-on={on ? "" : undefined}
            >
              <Checkbox
                label={o}
                checked={on}
                onChange={() => toggle(o)}
                onBlur={onBlur}
              />
            </div>
          );
        })}
      </div>
      <Msg id={`${id}-msg`} error={error} />
    </fieldset>
  );
}

export function TextAreaField({
  id,
  label,
  value,
  onChange,
  onBlur,
  onSubmitShortcut,
  optional,
  placeholder,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  onSubmitShortcut?: () => void;
  optional?: boolean;
  placeholder?: string;
}) {
  const onKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      onSubmitShortcut?.();
    }
  };
  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}
        {optional && <span className={styles.optional}> · Optional</span>}
      </label>
      <textarea
        id={id}
        className={`${styles.input} ${styles.textarea}`}
        rows={3}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        onKeyDown={onKey}
        maxLength={600}
      />
      <p className={styles.hint}>
        <span className={styles.count}>{value.length}/600</span>
      </p>
    </div>
  );
}
