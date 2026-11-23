import { forwardRef } from "react";
import { Icon } from "@/components/shared/Icon";
import placeholderIcon from "./assets/placeholder-icon.svg";
import type { ButtonProps, ButtonSize } from "./Button.types";
import styles from "./Button.module.css";

const ICON_SIZE_PX: Record<ButtonSize, number> = {
  xs: 12,
  sm: 12,
  md: 16,
  lg: 20,
};

/**
 * Button — Figma node 97:563 (Bolt | Design System).
 *
 * Variants: `primary` | `secondary` | `tertiary`
 * Sizes:    `xs` (28px) | `sm` (32px) | `md` (36px) | `lg` (40px)
 * States:   `default` | `hover` | `focus` | `disabled`
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = "primary",
    size = "md",
    state,
    label = "Button",
    leadingIcon,
    trailingIcon,
    showLeadingIcon = Boolean(leadingIcon),
    showTrailingIcon = Boolean(trailingIcon),
    disabled,
    className,
    type = "button",
    children,
    ...rest
  },
  ref
) {
  const isDisabled = disabled || state === "disabled";
  const iconPx = ICON_SIZE_PX[size];

  const classes = [
    styles.button,
    styles[variant],
    styles[size],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      ref={ref}
      type={type}
      disabled={isDisabled}
      data-state={state}
      className={classes}
      {...rest}
    >
      {showLeadingIcon && (
        <span className={styles.iconSlot} aria-hidden="true">
          {leadingIcon ?? <Icon src={placeholderIcon} size={iconPx} />}
        </span>
      )}
      <span className={styles.label}>{children ?? label}</span>
      {showTrailingIcon && (
        <span className={styles.iconSlot} aria-hidden="true">
          {trailingIcon ?? <Icon src={placeholderIcon} size={iconPx} />}
        </span>
      )}
    </button>
  );
});

export default Button;
