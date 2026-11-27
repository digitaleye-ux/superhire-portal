import { useId, useState } from "react";
import type { KeyboardEvent, ReactNode, DragEvent } from "react";
import { Dropdown } from "@/components/shared/Dropdown";
import { SegmentedControl } from "@/components/shared/SegmentedControl";
import { CheckIcon, FileIcon, UploadIcon, XIcon } from "./icons";
import { MONTH_OPTIONS, YEAR_OPTIONS } from "./useCandidateForm";
import styles from "./fields.module.css";

/* ---------- Shell: label above, hint, colocated error ---------- */
interface ShellProps {
  id: string;
  label: string;
  optional?: boolean;
  hint?: string;
  error?: string;
  children: ReactNode;
  as?: "label" | "legend";
}
export function Field({ id, label, optional, hint, error, children }: ShellProps) {
  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}
        {optional && <span className={styles.optional}> · Optional</span>}
      </label>
      {children}
      <Msg id={`${id}-msg`} error={error} hint={hint} />
    </div>
  );
}
function Msg({ id, error, hint }: { id: string; error?: string; hint?: string }) {
  if (!error && !hint) return null;
  return (
    <p id={id} className={error ? styles.error : styles.hint} aria-live="polite">
      {error ?? hint}
    </p>
  );
}
const describedBy = (id: string, error?: string, hint?: string) =>
  error || hint ? `${id}-msg` : undefined;

/* ---------- Text input (overlay prefix / suffix per emil-forms #6) ---------- */
interface TextProps {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  error?: string;
  type?: "text" | "email" | "tel" | "url";
  inputMode?: "text" | "numeric" | "decimal" | "email" | "tel" | "url";
  autoComplete?: string;
  placeholder?: string;
  optional?: boolean;
  hint?: string;
  prefix?: ReactNode;
  suffix?: string;
  numeric?: boolean;
  autoFocus?: boolean;
  disabled?: boolean;
}
export function TextField({
  id, label, value, onChange, onBlur, error, type = "text", inputMode,
  autoComplete = "off", placeholder, optional, hint, prefix, suffix, numeric, autoFocus, disabled,
}: TextProps) {
  const isTouch = typeof window !== "undefined" && "ontouchstart" in window;
  return (
    <Field id={id} label={label} optional={optional} hint={hint} error={error}>
      <div className={styles.control} data-invalid={error ? "" : undefined}>
        {prefix && <span className={styles.prefix}>{prefix}</span>}
        <input
          id={id}
          className={styles.input}
          style={{
            paddingLeft: prefix
              ? "calc(var(--space-8x) + var(--space-2x))"
              : undefined,
            paddingRight: suffix
              ? `calc(${suffix.length}ch + var(--space-6x) + var(--space-1x))`
              : undefined,
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
          aria-describedby={describedBy(id, error, hint)}
          autoFocus={autoFocus && !isTouch}
          disabled={disabled}
          data-1p-ignore={autoComplete === "off" ? "true" : undefined}
          data-lpignore={autoComplete === "off" ? "true" : undefined}
        />
        {suffix && <span className={styles.suffix}>{suffix}</span>}
      </div>
    </Field>
  );
}

/* ---------- Phone: fixed +91 prefix + tel input ---------- */
export function PhoneField(props: {
  id: string;
  label: string;
  value: string;
  code?: string;
  onChange: (v: string) => void;
  onCode?: (v: string) => void;
  onBlur?: () => void;
  error?: string;
}) {
  const { id, label, value, onChange, onBlur, error } = props;

  return (
    <Field id={id} label={label} error={error}>
      <div className={styles.phoneControl} data-invalid={error ? "" : undefined}>
        <span className={styles.phoneFixedPrefix}>+91</span>
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
          aria-describedby={describedBy(id, error)}
        />
      </div>
    </Field>
  );
}

/* ---------- Select: design system Dropdown component ---------- */
export function SelectField(props: {
  id: string; label: string; value: string; options: string[];
  onChange: (v: string) => void; onBlur?: () => void; error?: string;
  placeholder?: string; hint?: string;
}) {
  const { id, label, value, options, onChange, onBlur, error, placeholder = "Select notice period", hint } = props;
  const allOptions = value && !options.includes(value) ? [value, ...options] : options;
  return (
    <Field id={id} label={label} error={error} hint={hint}>
      <Dropdown
        variant="form"
        size="lg"
        fullWidth
        label={label}
        placeholder={placeholder}
        options={allOptions.map((o) => ({ value: o, label: o }))}
        selected={value ? [value] : []}
        onChange={(next) => {
          onChange(next[0] ?? "");
          onBlur?.();
        }}
        multiple={false}
        singleShowsValue
        invalid={Boolean(error)}
        align="left"
      />
    </Field>
  );
}

/* ---------- Month & Year Picker: side-by-side Dropdown components ---------- */
const MONTH_MAP: Record<string, string> = {
  jan: "Jan", january: "Jan",
  feb: "Feb", february: "Feb",
  mar: "Mar", march: "Mar",
  apr: "Apr", april: "Apr",
  may: "May",
  jun: "Jun", june: "Jun",
  jul: "Jul", july: "Jul",
  aug: "Aug", august: "Aug",
  sep: "Sep", september: "Sep",
  oct: "Oct", october: "Oct",
  nov: "Nov", november: "Nov",
  dec: "Dec", december: "Dec",
};

export function MonthYearPicker(props: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  disabledPlaceholder?: string;
  error?: string;
  hint?: string;
}) {
  const { id, label, value, onChange, disabled, disabledPlaceholder = "Present", error, hint } = props;

  const rawParts = value && value !== "Present" ? value.trim().split(/\s+/) : [];
  const parsedMonth = rawParts[0] ? (MONTH_MAP[rawParts[0].toLowerCase()] || rawParts[0]) : "";
  const parsedYear = rawParts.length > 1 ? rawParts[1] : (rawParts.length === 1 && /^\d{4}$/.test(rawParts[0]) ? rawParts[0] : "");

  const handleMonth = (m: string) => {
    const y = parsedYear || "2024";
    onChange(`${m} ${y}`);
  };

  const handleYear = (y: string) => {
    const m = parsedMonth || "Jan";
    onChange(`${m} ${y}`);
  };

  return (
    <Field id={id} label={label} error={error} hint={hint}>
      {disabled ? (
        <div className={styles.control}>
          <input
            id={id}
            className={styles.input}
            value={disabledPlaceholder}
            disabled
            readOnly
          />
        </div>
      ) : (
        <div className={styles.monthYearRow}>
          <div className={styles.monthCol}>
            <Dropdown
              variant="form"
              size="lg"
              fullWidth
              label="Month"
              placeholder="Month"
              options={MONTH_OPTIONS.map((m) => ({ value: m, label: m }))}
              selected={parsedMonth ? [parsedMonth] : []}
              onChange={(next) => handleMonth(next[0] ?? "")}
              multiple={false}
              singleShowsValue
              invalid={Boolean(error)}
              align="left"
            />
          </div>
          <div className={styles.yearCol}>
            <Dropdown
              variant="form"
              size="lg"
              fullWidth
              label="Year"
              placeholder="Year"
              options={YEAR_OPTIONS.map((y) => ({ value: y, label: y }))}
              selected={parsedYear ? [parsedYear] : []}
              onChange={(next) => handleYear(next[0] ?? "")}
              multiple={false}
              singleShowsValue
              invalid={Boolean(error)}
              align="left"
            />
          </div>
        </div>
      )}
    </Field>
  );
}

/* ---------- Yes / No: native radios styled as a segmented control ---------- */
export function Segmented(props: {
  id: string; label: string; value: string; options?: string[];
  onChange: (v: string) => void; onBlur?: () => void; error?: string;
}) {
  const { id, label, value, options = ["Yes", "No"], onChange, onBlur, error } = props;
  return (
    <fieldset
      className={styles.fieldset}
      aria-invalid={error ? true : undefined}
      aria-describedby={describedBy(id, error)}
    >
      <legend className={styles.label}>{label}</legend>
      <SegmentedControl
        size="md"
        value={value}
        onChange={(v) => {
          onChange(v);
          onBlur?.();
        }}
        options={options.map((o) => ({ value: o, label: o }))}
      />
      <Msg id={`${id}-msg`} error={error} />
    </fieldset>
  );
}

/* ---------- Toggle chips: native checkboxes, whole chip is the hit area ---------- */
export function ChipGroup(props: {
  id: string; legend: string; options: string[]; values: string[];
  onChange: (v: string[]) => void; hint?: string;
}) {
  const { id, legend, options, values, onChange, hint } = props;
  const toggle = (o: string) =>
    onChange(values.includes(o) ? values.filter((x) => x !== o) : [...values, o]);
  return (
    <fieldset className={styles.fieldset} aria-describedby={hint ? `${id}-msg` : undefined}>
      <legend className={styles.label}>{legend}</legend>
      <div className={styles.chips}>
        {options.map((o) => {
          const on = values.includes(o);
          return (
            <label key={o} className={styles.chip}>
              <input
                type="checkbox"
                checked={on}
                onChange={() => toggle(o)}
                className={styles.srOnly}
              />
              <span className={styles.chipFace} data-on={on ? "" : undefined}>
                <span className={styles.chipCheck}><CheckIcon size={12} /></span>
                {o}
              </span>
            </label>
          );
        })}
      </div>
      <Msg id={`${id}-msg`} hint={hint} />
    </fieldset>
  );
}


/* ---------- Checklist rows: native checkboxes, clean airy list ---------- */
export function ChecklistGroup(props: {
  id: string;
  legend?: string;
  count?: { verified: number; total: number };
  options: string[];
  values: string[];
  onChange: (v: string[]) => void;
  onBlur?: () => void;
  hint?: string;
  footer?: ReactNode;
  error?: string;
}) {
  const { id, legend, count, options, values, onChange, onBlur, hint, footer, error } = props;
  const toggle = (o: string) =>
    onChange(values.includes(o) ? values.filter((x) => x !== o) : [...values, o]);
  return (
    <fieldset
      className={styles.fieldset}
      aria-invalid={error ? true : undefined}
      aria-describedby={describedBy(id, error, typeof footer === "string" ? footer : hint)}
    >
      {legend && (
        <div className={styles.legendRow}>
          <legend className={styles.label}>{legend}</legend>
          {count && (
            <span className={styles.legendCount}>
              {count.verified}/{count.total} verified
            </span>
          )}
        </div>
      )}
      {hint && <p className={styles.hint}>{hint}</p>}
      <div className={styles.checklist} data-invalid={error ? "" : undefined}>
        {options.map((o) => {
          const on = values.includes(o);
          return (
            <label key={o} className={styles.checkRow} data-on={on ? "" : undefined}>
              <input
                type="checkbox"
                checked={on}
                onChange={() => toggle(o)}
                onBlur={onBlur}
                className={styles.srOnly}
              />
              <span className={styles.checkBox} data-on={on ? "" : undefined} aria-hidden="true">
                {on && <CheckIcon size={12} />}
              </span>
              <span className={styles.checkText}>{o}</span>
            </label>
          );
        })}
      </div>
      {error ? (
        <Msg id={`${id}-msg`} error={error} />
      ) : footer ? (
        <p id={`${id}-msg`} className={`${styles.hint} text-style-caption`}>
          {footer}
        </p>
      ) : null}
    </fieldset>
  );
}

/* ---------- Resume upload: label = drop zone, native file input ---------- */
const kb = (n: number) => (n > 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1024))} KB`);
export function FileField(props: {
  id: string; label: string; value: File | null; onChange: (f: File | null) => void;
  onBlur?: () => void; error?: string; hero?: boolean; busy?: boolean; title?: string; help?: string;
}) {
  const { id, label, value, onChange, onBlur, error, hero, busy, title, help } = props;
  const [drag, setDrag] = useState(false);
  const pick = (f?: File | null) => f && onChange(f);
  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDrag(false);
    pick(e.dataTransfer.files?.[0]);
  };
  return (
    <div className={styles.field}>
      {!hero && <span className={styles.label}>{label}</span>}
      {value ? (
        <div className={styles.fileRow} data-invalid={error ? "" : undefined}>
          <span className={styles.fileIcon}><FileIcon /></span>
          <span className={styles.fileMeta}>
            <span className={styles.fileName} title={value.name}>{value.name}</span>
            <span className={styles.fileSize}>
              {busy ? "Reading resume…" : kb(value.size)}
            </span>
          </span>
          <button
            type="button"
            className={styles.iconBtn}
            aria-label={`Remove ${value.name}`}
            onClick={() => onChange(null)}
          >
            <XIcon />
          </button>
        </div>
      ) : (
        <label
          htmlFor={id}
          className={`${styles.drop} ${hero ? styles.dropHero : ""}`}
          data-drag={drag ? "" : undefined}
          data-invalid={error ? "" : undefined}
          onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={onDrop}
        >
          <input
            id={id}
            type="file"
            accept=".pdf,.doc,.docx"
            className={styles.srOnly}
            onChange={(e) => { pick(e.target.files?.[0]); e.target.value = ""; }}
            onBlur={onBlur}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy(id, error, help)}
          />
          <span className={styles.dropIcon}><UploadIcon size={hero ? 20 : 16} /></span>
          <span className={styles.dropText}>
            <span className={styles.dropTitle}>{title ?? "Upload resume"}</span>
            <span className={styles.dropHelp}>{help ?? "PDF or Word · up to 5 MB · or drop it here"}</span>
          </span>
        </label>
      )}
      <Msg id={`${id}-msg`} error={error} />
    </div>
  );
}

/* ---------- Textarea ---------- */
export function TextAreaField(props: {
  id: string; label: string; value: string; onChange: (v: string) => void;
  onBlur?: () => void; onSubmitShortcut?: () => void; optional?: boolean; placeholder?: string;
}) {
  const { id, label, value, onChange, onBlur, onSubmitShortcut, optional, placeholder } = props;
  const onKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      onSubmitShortcut?.();
    }
  };
  const hintId = useId();
  return (
    <Field id={id} label={label} optional={optional}>
      <textarea
        id={id}
        className={`${styles.input} ${styles.textarea}`}
        rows={4}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        onKeyDown={onKey}
        aria-describedby={hintId}
        maxLength={600}
      />
      <p id={hintId} className={styles.hint}>
        <span className={styles.count}>{value.length}/600</span>
      </p>
    </Field>
  );
}
