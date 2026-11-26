import { forwardRef } from "react";
import type { IconButtonProps } from "./IconButton.types";
import styles from "./IconButton.module.css";

const SIZE_CLASS_MAP = {
  xs: styles.sizeXs,
  sm: styles.sizeSm,
  md: styles.sizeMd,
  lg: styles.sizeLg,
} as const;

const VARIANT_CLASS_MAP = {
  default: styles.variantDefault,
  bordered: styles.variantBordered,
  ghost: styles.variantGhost,
} as const;

/**
 * IconButton component — circular action button for single-icon triggers
 * (modal/drawer close buttons, kebab overflow menus, navigation arrows, dismissals).
 *
 * Micro-states & tokens:
 * - Default: fill `--icon-button-background` (white), icon `--icon-button-color` (slate-600)
 * - Hover: fill `--icon-button-background-hover` (slate-50), icon `--icon-button-color-hover` (slate-900)
 * - Active: fill `--icon-button-background-active` (slate-100), scale 0.96
 * - Focus-visible: outline `--icon-button-focus-ring` (electric violet)
 * - Disabled: `--icon-button-background-disabled`, `cursor: not-allowed`
 */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton(
    {
      icon,
      ariaLabel,
      size = "sm",
      variant = "default",
      active = false,
      type = "button",
      className,
      title,
      children,
      ...buttonProps
    },
    ref
  ) {
    const classNames = [
      styles.button,
      SIZE_CLASS_MAP[size],
      VARIANT_CLASS_MAP[variant],
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <button
        ref={ref}
        type={type}
        className={classNames}
        aria-label={ariaLabel}
        title={title ?? ariaLabel}
        data-active={active ? "true" : undefined}
        {...buttonProps}
      >
        {icon ?? children}
      </button>
    );
  }
);

export default IconButton;
