import type { ComponentType, HTMLAttributes, ReactNode } from "react";
import type { IconBaseProps } from "@/components/shared/Icon";

export type KpiCardSize = "sm" | "md" | "lg";
export type KpiCardVariant = "default" | "brand" | "subtle";
export type KpiTrendDirection = "up" | "down" | "neutral";

export interface KpiTrend {
  /** Trend value label (e.g. "+12%", "3.4%") */
  value: string;
  /** Direction of trend: "up" | "down" | "neutral" */
  direction?: KpiTrendDirection;
  /** Context suffix (e.g. "vs last month") */
  label?: string;
}

export interface KpiCardProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  /** Metric category label displayed in uppercase overline (e.g. "Active roles", "Shortlist rate") */
  label: ReactNode;
  /** Primary metric value (e.g. "11", "64%", "₹2,50,000") */
  value: ReactNode;
  /** Optional secondary context note (e.g. "7 of 11 reviewed", "Started at employer") */
  subtext?: ReactNode;
  /** Optional trend indicator (e.g. { value: "+12%", direction: "up" }) */
  trend?: KpiTrend;
  /** Card size: "sm" (compact), "md" (default 24px metric), "lg" (hero 32px metric) */
  size?: KpiCardSize;
  /** Surface style variant: "default" | "brand" | "subtle" */
  variant?: KpiCardVariant;
  /** Force interactive styling even if onClick is handled externally */
  interactive?: boolean;
  /** Whether to show the top-right arrow indicator. Defaults to true when onClick or href is present. */
  showArrow?: boolean;
  /** Custom icon component for the top-right indicator */
  icon?: ComponentType<IconBaseProps>;
  /** Optional trailing badge in the header */
  badge?: ReactNode;
  /** Click handler (renders as an accessible <button> unless href is provided) */
  onClick?: () => void;
  /** URL link (renders as an accessible <a> anchor) */
  href?: string;
  /** Whether the card is selected (active filter / view) */
  isSelected?: boolean;
  /** Whether the card is in a disabled state */
  disabled?: boolean;
  /** Whether the card is in a loading / skeleton state */
  loading?: boolean;
  /** Accessible title tooltip attribute */
  title?: string;
  /** Additional custom class names */
  className?: string;
}
