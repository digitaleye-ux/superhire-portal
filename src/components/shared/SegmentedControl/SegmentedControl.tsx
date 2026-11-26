import { forwardRef, useRef } from "react";
import type { ForwardedRef, KeyboardEvent, ReactElement } from "react";
import type {
  SegmentedControlProps,
} from "./SegmentedControl.types";
import styles from "./SegmentedControl.module.css";

function SegmentedControlInner<T = string>(
  {
    options,
    value,
    onChange,
    size = "sm",
    fullWidth = false,
    ariaLabel = "Options",
    className,
    disabled = false,
  }: SegmentedControlProps<T>,
  ref: ForwardedRef<HTMLDivElement>
) {
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (disabled || options.length === 0) return;

    const enabledIndices = options
      .map((opt, idx) => (!opt.disabled ? idx : null))
      .filter((idx): idx is number => idx !== null);

    if (enabledIndices.length === 0) return;

    const currentIdx = options.findIndex((opt) => opt.value === value);
    let nextIdx = currentIdx;

    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      const currentPos = enabledIndices.indexOf(currentIdx);
      const nextPos = (currentPos + 1) % enabledIndices.length;
      nextIdx = enabledIndices[nextPos];
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      const currentPos = enabledIndices.indexOf(currentIdx);
      const prevPos =
        (currentPos - 1 + enabledIndices.length) % enabledIndices.length;
      nextIdx = enabledIndices[prevPos];
    } else if (e.key === "Home") {
      e.preventDefault();
      nextIdx = enabledIndices[0];
    } else if (e.key === "End") {
      e.preventDefault();
      nextIdx = enabledIndices[enabledIndices.length - 1];
    }

    if (nextIdx !== currentIdx && nextIdx >= 0) {
      const nextOption = options[nextIdx];
      if (nextOption && !nextOption.disabled) {
        onChange(nextOption.value);
        buttonRefs.current[nextIdx]?.focus();
      }
    }
  };

  return (
    <div
      ref={ref}
      role="radiogroup"
      aria-label={ariaLabel}
      aria-disabled={disabled}
      className={[
        styles.track,
        styles[size],
        fullWidth ? styles.fullWidth : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      onKeyDown={handleKeyDown}
    >
      {options.map((opt, index) => {
        const isSelected = opt.value === value;
        const isDisabled = disabled || Boolean(opt.disabled);

        return (
          <button
            key={String(opt.value)}
            ref={(el) => {
              buttonRefs.current[index] = el;
            }}
            type="button"
            role="radio"
            aria-checked={isSelected}
            disabled={isDisabled}
            tabIndex={isSelected ? 0 : -1}
            className={[styles.segment, isSelected ? styles.active : ""]
              .filter(Boolean)
              .join(" ")}
            onClick={() => {
              if (!isDisabled && !isSelected) {
                onChange(opt.value);
              }
            }}
          >
            {opt.icon && <span className={styles.iconSlot}>{opt.icon}</span>}
            <span>{opt.label}</span>
            {opt.count !== undefined && (
              <span className={styles.count}>{opt.count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/**
 * SegmentedControl — Bolt Design System.
 * Compact, mutually exclusive parameter and mode switchers.
 * Built with full WAI-ARIA radio group keyboard accessibility.
 */
export const SegmentedControl = forwardRef(SegmentedControlInner) as <
  T = string,
>(
  props: SegmentedControlProps<T> & { ref?: ForwardedRef<HTMLDivElement> }
) => ReactElement;

export default SegmentedControl;
