import { forwardRef, useEffect, useId, useRef, useState } from "react";
import { ChevronDownIcon, XIcon } from "@/components/shared/Icon";
import { Checkbox } from "@/components/shared/Checkbox";
import { Radio } from "@/components/shared/Radio";
import type { DropdownProps } from "./Dropdown.types";
import styles from "./Dropdown.module.css";

const VARIANT_CLASS_MAP = {
  filter: styles.variantFilter,
  form: styles.variantForm,
  plain: styles.variantPlain,
} as const;

const SIZE_CLASS_MAP = {
  sm: styles.sm,
  md: styles.md,
  lg: styles.lg,
} as const;

/**
 * Dropdown — SuperHire Design System (Figma nodes 422:2570 container, 422:2468 item).
 *
 * Variants:
 * - `filter`: Toolbar filter button with active brand tint, counter pill, and clear button.
 * - `form`: Standard input field selector with clean border, placeholder, and chevron.
 * - `plain`: Borderless compact dropdown for dense table headers and inline actions.
 *
 * Sizes:
 * - `sm` (32px, default)
 * - `md` (36px)
 * - `lg` (40px)
 *
 * Supports all 6 interactive states, keyboard navigation, outside click dismiss,
 * and custom leading icons.
 */
export const Dropdown = forwardRef<HTMLDivElement, DropdownProps>(
  function Dropdown(
    {
      label,
      options,
      selected,
      onChange,
      variant = "filter",
      size = "sm",
      multiple = true,
      singleShowsValue = false,
      defaultValue,
      allowDeselect = false,
      placeholder,
      leadingIcon,
      fullWidth = false,
      align = "left",
      disabled = false,
      invalid = false,
      error,
      className,
      triggerClassName,
      menuClassName,
    },
    forwardedRef
  ) {
    const [open, setOpen] = useState(false);
    const localRef = useRef<HTMLDivElement | null>(null);
    const menuId = useId();
    const radioName = useId();

    const isInvalid = Boolean(invalid || error);

    const setRefs = (node: HTMLDivElement | null) => {
      localRef.current = node;
      if (typeof forwardedRef === "function") {
        forwardedRef(node);
      } else if (forwardedRef) {
        forwardedRef.current = node;
      }
    };

    const isEffectivelySelected = defaultValue
      ? selected.length > 0 && !selected.includes(defaultValue)
      : selected.length > 0;
    const hasSelection = selected.length > 0;

    // Close when disabled becomes true.
    useEffect(() => {
      if (disabled && open) setOpen(false);
    }, [disabled, open]);

    // Close on outside pointer click.
    useEffect(() => {
      if (!open) return;
      const onPointerDown = (e: PointerEvent) => {
        if (localRef.current && !localRef.current.contains(e.target as Node)) {
          setOpen(false);
        }
      };
      document.addEventListener("pointerdown", onPointerDown);
      return () => document.removeEventListener("pointerdown", onPointerDown);
    }, [open]);

    // Close on Escape.
    useEffect(() => {
      if (!open) return;
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") setOpen(false);
      };
      document.addEventListener("keydown", onKey);
      return () => document.removeEventListener("keydown", onKey);
    }, [open]);

    const toggleValue = (value: string, optDisabled?: boolean) => {
      if (disabled || optDisabled) return;
      if (multiple) {
        onChange(
          selected.includes(value)
            ? selected.filter((v) => v !== value)
            : [...selected, value]
        );
      } else {
        if (allowDeselect && selected.includes(value)) {
          onChange([]);
        } else {
          onChange([value]);
        }
        setOpen(false);
      }
    };

    const clear = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (disabled) return;
      onChange(defaultValue ? [defaultValue] : []);
    };

    const isFilterSelection = multiple || !singleShowsValue || allowDeselect;
    const selectedState = isEffectivelySelected && isFilterSelection;

    // Resolve trigger text
    const selectedOption = !multiple
      ? options.find((o) => o.value === selected[0])
      : undefined;

    let triggerText = label;
    let isShowingPlaceholder = false;

    if (variant === "form") {
      if (selectedOption) {
        triggerText = selectedOption.label;
      } else if (placeholder) {
        triggerText = placeholder;
        isShowingPlaceholder = true;
      } else {
        triggerText = label;
      }
    } else {
      // Filter & plain variants
      if (!multiple && singleShowsValue && isEffectivelySelected && selectedOption) {
        triggerText = selectedOption.label;
      } else {
        triggerText = label;
      }
    }

    const wrapperClass = [
      styles.wrapper,
      SIZE_CLASS_MAP[size],
      VARIANT_CLASS_MAP[variant],
      open ? styles.open : "",
      selectedState ? styles.selected : "",
      isShowingPlaceholder ? styles.isPlaceholder : "",
      disabled ? styles.disabled : "",
      isInvalid ? styles.invalid : "",
      triggerClassName,
    ]
      .filter(Boolean)
      .join(" ");

    const rootClass = [
      styles.root,
      fullWidth ? styles.fullWidth : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div className={rootClass} ref={setRefs}>
        <div
          className={wrapperClass}
          data-empty={!hasSelection ? "" : undefined}
          data-invalid={isInvalid ? "" : undefined}
          role="button"
          tabIndex={disabled ? -1 : 0}
          aria-disabled={disabled || undefined}
          aria-invalid={isInvalid || undefined}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={menuId}
          onClick={() => {
            if (!disabled) setOpen((o) => !o);
          }}
          onKeyDown={(e) => {
            if (disabled) return;
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setOpen((o) => !o);
            }
          }}
        >
          <div className={styles.triggerBody}>
            {leadingIcon && (
              <span className={styles.leadingIcon}>{leadingIcon}</span>
            )}
            <span className={styles.label}>{triggerText}</span>
          </div>

          <div className={styles.trailingControls}>
            {variant === "filter" && selectedState && selected.length >= 2 && (
              <span className={styles.counter}>{selected.length}</span>
            )}

            {variant === "filter" && selectedState && !disabled ? (
              <button
                type="button"
                className={styles.clear}
                aria-label={`Clear ${label}`}
                onClick={clear}
              >
                <XIcon size="sm" />
              </button>
            ) : (
              <ChevronDownIcon size="sm" className={styles.chevron} />
            )}
          </div>
        </div>

        {error && <span className={styles.errorText}>{error}</span>}

        {open && !disabled && (
          <div
            className={[
              styles.menu,
              align === "right" ? styles.alignRight : "",
              menuClassName,
            ]
              .filter(Boolean)
              .join(" ")}
            id={menuId}
            role="listbox"
          >
            {options.map((opt) => {
              const isChecked =
                selected.length > 0
                  ? selected.includes(opt.value)
                  : defaultValue === opt.value;
              const isOptDisabled = Boolean(opt.disabled);

              return (
                <div
                  key={opt.value}
                  className={[
                    styles.item,
                    isOptDisabled ? styles.itemDisabled : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  onClick={() => toggleValue(opt.value, isOptDisabled)}
                >
                  {multiple ? (
                    <Checkbox
                      label={opt.label}
                      checked={isChecked}
                      disabled={isOptDisabled}
                      onChange={() => toggleValue(opt.value, isOptDisabled)}
                    />
                  ) : (
                    <Radio
                      name={radioName}
                      label={opt.label}
                      checked={isChecked}
                      disabled={isOptDisabled}
                      onChange={() => toggleValue(opt.value, isOptDisabled)}
                    />
                  )}

                  {(opt.badge || opt.description) && (
                    <div className={styles.itemMeta}>
                      {opt.badge && (
                        <span className={styles.itemBadge}>{opt.badge}</span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }
);

export default Dropdown;
