import { forwardRef, useId } from "react";
import type { InputProps } from "./Input.types";
import styles from "./Input.module.css";

/**
 * Input component — Figma node 438:5522.
 * Includes label (text-style-label-2), 40px input with 1px strong border,
 * optional leading/trailing icons or text suffix, and error/hint messaging.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    id: explicitId,
    label,
    showLabel = Boolean(label),
    hint,
    error,
    leadingIcon,
    trailingIcon,
    suffix,
    size = "lg",
    className,
    style,
    ...inputProps
  },
  ref
) {
  const generatedId = useId();
  const inputId = explicitId ?? `input-${generatedId}`;
  const msgId = `${inputId}-msg`;
  const hasMsg = Boolean(error || hint);

  const paddingLeft = leadingIcon
    ? "calc(var(--space-3x) + var(--size-icon-sm) + var(--space-2x))"
    : undefined;
  const paddingRight = suffix
    ? `calc(${suffix.length}ch + var(--space-6x))`
    : trailingIcon
    ? "calc(var(--space-3x) + var(--size-icon-sm) + var(--space-2x))"
    : undefined;

  return (
    <div className={[styles.root, className].filter(Boolean).join(" ")}>
      {showLabel && label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
        </label>
      )}
      <div className={styles.control} data-invalid={error ? "" : undefined}>
        {leadingIcon && <span className={styles.leadingIcon}>{leadingIcon}</span>}
        <input
          ref={ref}
          id={inputId}
          className={[
            styles.input,
            size === "sm" ? styles.inputSm : "",
            size === "md" ? styles.inputMd : "",
          ].filter(Boolean).join(" ")}
          style={{
            ...style,
            paddingLeft,
            paddingRight,
          }}
          aria-invalid={error ? true : undefined}
          aria-describedby={hasMsg ? msgId : undefined}
          {...inputProps}
        />
        {trailingIcon && !suffix && (
          <span className={styles.trailingIcon}>{trailingIcon}</span>
        )}
        {suffix && <span className={styles.suffix}>{suffix}</span>}
      </div>
      {hasMsg && (
        <p
          id={msgId}
          className={`${styles.message} ${error ? styles.error : ""}`}
          aria-live="polite"
        >
          {error ?? hint}
        </p>
      )}
    </div>
  );
});

export default Input;
