import { forwardRef, useState, useEffect } from "react";
import type { ChangeEvent, MouseEvent } from "react";
import { Input } from "@/components/shared/Input";
import type { InputProps } from "@/components/shared/Input";
import { SearchIcon, XIcon } from "@/components/shared/Icon";
import styles from "./SearchInput.module.css";

export interface SearchInputProps
  extends Omit<InputProps, "leadingIcon" | "trailingIcon" | "label" | "showLabel"> {
  /** Placeholder text. */
  placeholder?: string;
  /** Accessible label (defaults to "Search"). */
  ariaLabel?: string;
  /** Extra class for the wrapper. */
  className?: string;
  /** Callback fired when the clear (x) button is clicked. */
  onClear?: () => void;
}

/**
 * Search input — built with our standard Input component without label.
 * Includes a leading Lucide Search icon and a trailing Lucide X icon to clear text.
 */
export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  function SearchInput(
    {
      placeholder = "Search by name, company, role or keyword",
      ariaLabel = "Search",
      className,
      value: controlledValue,
      defaultValue,
      onChange,
      onClear,
      ...restProps
    },
    ref
  ) {
    const isControlled = controlledValue !== undefined;
    const [internalValue, setInternalValue] = useState<string>(
      controlledValue !== undefined
        ? String(controlledValue)
        : defaultValue !== undefined
        ? String(defaultValue)
        : ""
    );

    useEffect(() => {
      if (controlledValue !== undefined) {
        setInternalValue(String(controlledValue));
      }
    }, [controlledValue]);

    const currentValue = isControlled ? String(controlledValue ?? "") : internalValue;
    const hasValue = currentValue.length > 0;

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      if (!isControlled) {
        setInternalValue(e.target.value);
      }
      onChange?.(e);
    };

    const handleClear = (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();

      if (!isControlled) {
        setInternalValue("");
      }

      onClear?.();

      if (onChange) {
        const syntheticEvent = {
          target: { value: "" },
          currentTarget: { value: "" },
        } as ChangeEvent<HTMLInputElement>;
        onChange(syntheticEvent);
      }
    };

    return (
      <Input
        ref={ref}
        size="sm"
        type="search"
        className={[styles.searchRoot, className].filter(Boolean).join(" ")}
        placeholder={placeholder}
        aria-label={ariaLabel}
        value={isControlled ? controlledValue : internalValue}
        onChange={handleChange}
        leadingIcon={<SearchIcon size="sm" className={styles.searchIcon} />}
        trailingIcon={
          hasValue ? (
            <button
              type="button"
              className={styles.clearBtn}
              onClick={handleClear}
              aria-label="Clear search"
              title="Clear search"
            >
              <XIcon size="xs" />
            </button>
          ) : null
        }
        {...restProps}
      />
    );
  }
);

export default SearchInput;
