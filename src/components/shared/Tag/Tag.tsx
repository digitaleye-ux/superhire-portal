import { forwardRef } from "react";
import { XIcon } from "@/components/shared/Icon";
import type { TagProps } from "./Tag.types";
import styles from "./Tag.module.css";

const VARIANT_CLASS: Record<NonNullable<TagProps["variant"]>, string> = {
  neutral: styles.variantNeutral,
  brand: styles.variantBrand,
  success: styles.variantSuccess,
  warning: styles.variantWarning,
  danger: styles.variantDanger,
  info: styles.variantInfo,
};

export const Tag = forwardRef<HTMLSpanElement, TagProps>(function Tag(
  {
    variant = "neutral",
    size = "md",
    dot = false,
    icon: IconComponent,
    onRemove,
    removeAriaLabel,
    children,
    className,
    ...rest
  },
  ref
) {
  const sizeClass = size === "sm" ? styles.sizeSm : styles.sizeMd;
  const variantClass = VARIANT_CLASS[variant] ?? styles.variantNeutral;

  return (
    <span
      ref={ref}
      className={`${styles.tag} ${variantClass} ${sizeClass} ${className ?? ""}`}
      {...rest}
    >
      {dot && <span className={styles.dot} aria-hidden="true" />}
      {IconComponent && (
        <span className={styles.icon} aria-hidden="true">
          <IconComponent size="xs" />
        </span>
      )}
      <span>{children}</span>
      {onRemove && (
        <button
          type="button"
          className={styles.removeBtn}
          aria-label={removeAriaLabel ?? `Remove ${typeof children === "string" ? children : "tag"}`}
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
        >
          <XIcon size="xs" />
        </button>
      )}
    </span>
  );
});

export default Tag;
