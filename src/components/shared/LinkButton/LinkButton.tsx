import { forwardRef } from "react";
import type { ElementRef } from "react";
import { ArrowRightIcon } from "@/components/shared/Icon";
import type { IconSizeToken } from "@/components/shared/Icon";
import type {
  LinkButtonProps,
  LinkButtonSize,
} from "./LinkButton.types";
import styles from "./LinkButton.module.css";

const ICON_SIZE_BY_BUTTON_SIZE: Record<LinkButtonSize, IconSizeToken> = {
  sm: "xs",
  md: "sm",
  lg: "md",
};

/**
 * LinkButton — SuperHire Design System
 *
 * Lightweight, inline text-link action component.
 * Replaces bespoke card action buttons (.claim, .action) with tokenized typography,
 * seamless hover color transitions, and an animated directional arrow.
 */
export const LinkButton = forwardRef<
  ElementRef<"button"> | ElementRef<"a">,
  LinkButtonProps
>(function LinkButton(props, ref) {
  const {
    variant = "brand",
    size = "md",
    underline = "none",
    arrow = false,
    leadingIcon,
    trailingIcon,
    disabled = false,
    children,
    className,
    ...rest
  } = props;

  const iconSizeToken = ICON_SIZE_BY_BUTTON_SIZE[size];

  const resolvedTrailingIcon =
    trailingIcon ?? (arrow ? <ArrowRightIcon size={iconSizeToken} /> : null);

  const underlineClass =
    underline === "hover"
      ? styles.underlineHover
      : underline === "always"
        ? styles.underlineAlways
        : "";

  const classes = [
    styles.linkButton,
    styles[variant],
    styles[size],
    underlineClass,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if ("as" in rest && rest.as === "a") {
    const { as: _as, href, ...anchorProps } = rest as Extract<
      LinkButtonProps,
      { as: "a" }
    >;
    return (
      <a
        ref={ref as React.ForwardedRef<HTMLAnchorElement>}
        href={disabled ? undefined : href}
        aria-disabled={disabled || undefined}
        className={classes}
        {...anchorProps}
      >
        {leadingIcon && <span className={styles.iconSlot}>{leadingIcon}</span>}
        <span className={styles.label}>{children}</span>
        {resolvedTrailingIcon && (
          <span className={`${styles.iconSlot} ${styles.trailingIcon}`}>
            {resolvedTrailingIcon}
          </span>
        )}
      </a>
    );
  }

  const { as: _as, type = "button", ...buttonProps } = rest as Extract<
    LinkButtonProps,
    { as?: "button" }
  >;

  return (
    <button
      ref={ref as React.ForwardedRef<HTMLButtonElement>}
      type={type}
      disabled={disabled}
      className={classes}
      {...buttonProps}
    >
      {leadingIcon && <span className={styles.iconSlot}>{leadingIcon}</span>}
      <span className={styles.label}>{children}</span>
      {resolvedTrailingIcon && (
        <span className={`${styles.iconSlot} ${styles.trailingIcon}`}>
          {resolvedTrailingIcon}
        </span>
      )}
    </button>
  );
});

export default LinkButton;
