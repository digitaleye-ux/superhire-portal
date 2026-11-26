import { forwardRef, useEffect, useId, useRef, useState } from "react";
import { ChevronDownIcon, ChevronUpIcon, XIcon } from "@/components/shared/Icon";
import { Checkbox } from "@/components/shared/Checkbox";
import { Radio } from "@/components/shared/Radio";
import type { DropdownProps } from "./Dropdown.types";
import styles from "./Dropdown.module.css";

/**
 * Dropdown — Figma nodes 422:2570 (container), 422:2468 (item).
 * A filter/sort control: a trigger button that opens a menu of checkbox
 * (multi-select) or radio (single-select) options. Controlled via
 * `selected` / `onChange`.
 */
export const Dropdown = forwardRef<HTMLDivElement, DropdownProps>(
  function Dropdown(
    {
      label,
      options,
      selected,
      onChange,
      multiple = true,
      singleShowsValue = false,
      defaultValue,
      allowDeselect = false,
      align = "left",
      disabled = false,
      invalid = false,
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

    // Close on outside click.
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

    const toggleValue = (value: string) => {
      if (disabled) return;
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
    const triggerLabel =
      !multiple && singleShowsValue && isEffectivelySelected
        ? options.find((o) => o.value === selected[0])?.label ?? label
        : label;

    const wrapperClass = [
      styles.wrapper,
      open ? styles.open : "",
      selectedState ? styles.selected : "",
      disabled ? styles.disabled : "",
      invalid ? styles.invalid : "",
      triggerClassName,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div
        className={[styles.root, className].filter(Boolean).join(" ")}
        ref={setRefs}
      >
        <div
          className={wrapperClass}
          data-empty={!hasSelection ? "" : undefined}
          data-invalid={invalid ? "" : undefined}
          role="button"
          tabIndex={disabled ? -1 : 0}
          aria-disabled={disabled || undefined}
          aria-invalid={invalid || undefined}
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
          <span className={styles.label}>{triggerLabel}</span>

          {selectedState && selected.length >= 2 && (
            <span className={styles.counter}>{selected.length}</span>
          )}

          {selectedState && !disabled ? (
            <button
              type="button"
              className={styles.clear}
              aria-label={`Clear ${label}`}
              onClick={clear}
            >
              <XIcon size="sm" className={styles.chevron} />
            </button>
          ) : open ? (
            <ChevronUpIcon size="sm" className={styles.chevron} />
          ) : (
            <ChevronDownIcon size="sm" className={styles.chevron} />
          )}
        </div>

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
              return (
                <div key={opt.value} className={styles.item}>
                  {multiple ? (
                    <Checkbox
                      label={opt.label}
                      checked={isChecked}
                      onChange={() => toggleValue(opt.value)}
                    />
                  ) : (
                    <Radio
                      name={radioName}
                      label={opt.label}
                      checked={isChecked}
                      onChange={() => toggleValue(opt.value)}
                    />
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
