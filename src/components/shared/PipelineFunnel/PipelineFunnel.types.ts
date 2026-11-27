/**
 * PipelineFunnel (Candidate & Role Pipeline Funnel Card)
 * Bolt Design System — strictly typed interfaces.
 */

import type { ReactNode } from "react";

export type PipelineFunnelVariant = "default" | "subtle";
export type PipelineFunnelSize = "sm" | "md" | "lg";

export interface PipelineFunnelStage {
  /** Unique stage identifier (e.g. 'submitted', 'interview', 'joined') */
  id: string;
  /** Primary label displayed in uppercase overline style */
  label: string;
  /** Quantitative value or count for the stage */
  count: number | string;
  /** Optional hover title or tooltip description */
  description?: string;
  /** Whether this stage is currently selected as an active filter */
  isSelected?: boolean;
  /** Whether this stage cell is disabled */
  disabled?: boolean;
  /** Optional link navigation URL */
  href?: string;
  /** Optional click handler for this specific stage */
  onClick?: () => void;
  /** Optional custom icon or indicator */
  icon?: ReactNode;
  /** Optional aria-label */
  ariaLabel?: string;
}

export interface PipelineFunnelFooterItem {
  /** Optional item identifier */
  id?: string;
  /** Number or count to emphasize (e.g. 11, 1, 13) */
  count?: number | string;
  /** Descriptive label text (e.g. 'active in pipeline', 'on hold', 'rejected') */
  label: string;
  /** Optional click handler if this item serves as a filter shortcut */
  onClick?: () => void;
  /** Optional URL */
  href?: string;
  /** Tooltip or title text */
  title?: string;
  /** Disabled state */
  disabled?: boolean;
}

export interface PipelineFunnelProps {
  /** Array of active funnel stages */
  stages: PipelineFunnelStage[];
  /** Controlled currently selected stage ID */
  selectedStageId?: string | null;
  /** Callback fired when a stage cell is clicked */
  onStageSelect?: (stageId: string, stage: PipelineFunnelStage) => void;
  /** Explainable footer summary items */
  footerItems?: PipelineFunnelFooterItem[];
  /** Optional custom footer element if replacing the standard meta row */
  footerNode?: ReactNode;
  /** Visual surface variant (default: 'default') */
  variant?: PipelineFunnelVariant;
  /** Sizing mode (default: 'md') */
  size?: PipelineFunnelSize;
  /** Loading skeleton state */
  loading?: boolean;
  /** Custom additional CSS class name */
  className?: string;
  /** Accessible label for the section or region */
  ariaLabel?: string;
}
