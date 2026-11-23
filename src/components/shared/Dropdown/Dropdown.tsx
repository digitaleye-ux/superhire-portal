import { useEffect, useId, useRef, useState } from "react";
import { ChevronDownIcon, ChevronUpIcon, XIcon } from "@/components/shared/Icon";
import { Checkbox } from "@/components/shared/Checkbox";
import { Radio } from "@/components/shared/Radio";
import type { DropdownProps } from "./Dropdown.types";
import styles from "./Dropdown.module.css";

/**
 * Dropdown — Figma nodes 422:2570 (container), 422:2468 (item).
 * A filter/sort control: a trigger button that opens a menu of checkbox
 * (multi-select) or radio (single-select) options. Controlled via
 * `selected` / `onChange`. When a multi-select has selections, the trigger
 * shows a counter badge and a clear (×) affordance.
 */
export function Dropdown({
  label,
  options,
  selected,
  onChange,
  multiple = true,
  singleShowsValue = false,
  align = "left",
  className,
  triggerClassName,
  menuClassName,
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const radioName = useId();

  const hasSelection = selected.length > 0;

  // Close on outside click.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
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
    if (multiple) {
      onChange(
        selected.includes(value)
          ? selected.filter((v) => v !== value)
          : [...selected, value]
      );
    } else {
      onChange([value]);
      setOpen(false);
    }
  };

  const clear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange([]);
  };

  // Trigger label: selected state is "filter with counter" by default, or the
  // chosen option's label for single-select value style.
  const selectedState = hasSelection && (multiple || !singleShowsValue);
  const triggerLabel =
    !multiple && singleShowsValue && hasSelection
      ? options.find((o) => o.value === selected[0])?.label ?? label
      : label;

  const wrapperClass = [
    styles.wrapper,
    open ? styles.open : "",
    selectedState ? styles.selected : "",
    triggerClassName,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={[styles.root, className].filter(Boolean).join(" ")}
      ref={rootRef}
    >
      <div
        className={wrapperClass}
        data-empty={!hasSelection ? "" : undefined}
        role="button"
        tabIndex={0}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => {
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

        {selectedState ? (
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

      {open && (
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
          {options.map((opt) => (
            <div key={opt.value} className={styles.item}>
              {multiple ? (
                <Checkbox
                  label={opt.label}
                  checked={selected.includes(opt.value)}
                  onChange={() => toggleValue(opt.value)}
                />
              ) : (
                <Radio
                  name={radioName}
                  label={opt.label}
                  checked={selected.includes(opt.value)}
                  onChange={() => toggleValue(opt.value)}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dropdown;
