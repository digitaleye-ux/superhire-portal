import { forwardRef } from "react";
import { ArrowRightIcon } from "@/components/shared/Icon";
import type { KpiCardProps, KpiCardSize, KpiCardVariant } from "./KpiCard.types";
import styles from "./KpiCard.module.css";

const SIZE_CLASS_MAP: Record<KpiCardSize, string> = {
  sm: styles.sizeSm,
  md: styles.sizeMd,
  lg: styles.sizeLg,
};

const VARIANT_CLASS_MAP: Record<KpiCardVariant, string> = {
  default: styles.variantDefault,
  brand: styles.variantBrand,
  subtle: styles.variantSubtle,
};

export const KpiCard = forwardRef<HTMLElement, KpiCardProps>(function KpiCard(
  {
    label,
    value,
    subtext,
    trend,
    size = "md",
    variant = "default",
    interactive,
    showArrow,
    icon: CustomIcon,
    badge,
    onClick,
    href,
    isSelected = false,
    disabled = false,
    loading = false,
    title,
    className,
    children,
    ...rest
  },
  ref
) {
  const isClickable = !disabled && (typeof onClick === "function" || Boolean(href) || interactive);
  const shouldShowArrow = showArrow ?? Boolean(isClickable && !disabled);

  const cardClassName = [
    styles.card,
    SIZE_CLASS_MAP[size],
    VARIANT_CLASS_MAP[variant],
    isClickable ? styles.interactive : "",
    isSelected ? styles.selected : "",
    disabled ? styles.disabled : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const headerContent = (
    <div className={styles.topRow}>
      <div className={styles.labelArea}>
        {loading ? (
          <div className={styles.skeletonLabel} aria-hidden="true" />
        ) : (
          <span className={styles.label}>{label}</span>
        )}
      </div>

      <div className={styles.topActions}>
        {badge}
        {shouldShowArrow &&
          (CustomIcon ? (
            <CustomIcon size="sm" className={styles.arrow} />
          ) : (
            <ArrowRightIcon size="sm" className={styles.arrow} />
          ))}
      </div>
    </div>
  );

  const trendNode = trend && !loading && (
    <span
      className={`${styles.trend} ${
        trend.direction === "down"
          ? styles.trendDown
          : trend.direction === "neutral"
          ? styles.trendNeutral
          : styles.trendUp
      }`}
    >
      <span>{trend.value}</span>
      {trend.label && <span>{trend.label}</span>}
    </span>
  );

  const bodyContent = (
    <div className={styles.valueRow}>
      {loading ? (
        <div className={styles.skeletonValue} aria-hidden="true" />
      ) : (
        <span className={styles.value}>{value}</span>
      )}

      {trendNode ?? (subtext && <span className={styles.subtext}>{subtext}</span>)}
    </div>
  );

  if (href && !disabled) {
    return (
      <a
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        className={cardClassName}
        title={title}
        aria-selected={isSelected ? "true" : undefined}
        {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {headerContent}
        {bodyContent}
        {children}
      </a>
    );
  }

  if (isClickable) {
    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        type="button"
        className={cardClassName}
        onClick={onClick}
        title={title}
        disabled={disabled}
        aria-selected={isSelected ? "true" : undefined}
        {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        {headerContent}
        {bodyContent}
        {children}
      </button>
    );
  }

  return (
    <div
      ref={ref as React.Ref<HTMLDivElement>}
      className={cardClassName}
      title={title}
      aria-disabled={disabled ? "true" : undefined}
      {...(rest as React.HTMLAttributes<HTMLDivElement>)}
    >
      {headerContent}
      {bodyContent}
      {children}
    </div>
  );
});

export default KpiCard;
