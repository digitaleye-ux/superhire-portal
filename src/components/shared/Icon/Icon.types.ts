import type { ComponentType, CSSProperties, MouseEvent } from "react";
import type { LucideProps } from "lucide-react";

/** Standard design token icon sizes mapped to pixels */
export type IconSizeToken = "xs" | "sm" | "md" | "lg";
export type IconSize = IconSizeToken | number;

/** Recognized design system icon names (kebab-case with common semantic aliases) */
export type IconName =
  | "arrow-left"
  | "arrow-right"
  | "arrow-up-right"
  | "book-open"
  | "bookmark-x"
  | "briefcase"
  | "briefcase-business"
  | "check"
  | "chevron-down"
  | "chevron-up"
  | "circle-check"
  | "circle-check-big"
  | "circle-help"
  | "close"
  | "commission"
  | "download"
  | "external-link"
  | "eye"
  | "file"
  | "file-text"
  | "github"
  | "hand-coins"
  | "help"
  | "indian-rupee"
  | "link"
  | "link-2"
  | "linkedin"
  | "location"
  | "mail"
  | "map-pin"
  | "more-vertical"
  | "pause"
  | "resume"
  | "rupee"
  | "search"
  | "sparkles"
  | "unclaim"
  | "upload"
  | "users"
  | "users-round"
  | "x";

export interface IconBaseProps {
  /** Size token ("xs"=12, "sm"=16, "md"=20, "lg"=24) or explicit pixel number. Defaults to "md" (20px). */
  size?: IconSize;
  /** Stroke or fill color. Defaults to "currentColor". */
  color?: string;
  /** Stroke width in pixels. Defaults to 2. */
  strokeWidth?: number;
  /** Accessible label for screen readers. When omitted, icon is marked aria-hidden="true". */
  label?: string;
  className?: string;
  style?: CSSProperties;
  onClick?: (event: MouseEvent<SVGElement | HTMLSpanElement>) => void;
}

export interface IconProps extends IconBaseProps {
  /** Name of the icon from the design system icon registry. */
  name?: IconName;
  /** Direct Lucide icon component or React SVG component. */
  icon?: ComponentType<LucideProps>;
  /** Legacy mask SVG URL for backward compatibility. */
  src?: string;
}
