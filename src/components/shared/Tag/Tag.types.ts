import type { ComponentType, HTMLAttributes, ReactNode } from "react";
import type { IconBaseProps } from "@/components/shared/Icon";

export type TagVariant =
  | "neutral"
  | "brand"
  | "success"
  | "warning"
  | "danger"
  | "info";

export type TagSize = "sm" | "md";

export interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  /** Semantic color variant: "neutral" | "brand" | "success" | "warning" | "danger" | "info" */
  variant?: TagVariant;
  /** Size variant: "sm" (compact 20px) | "md" (default 24px) */
  size?: TagSize;
  /** Optional leading status dot */
  dot?: boolean;
  /** Optional leading icon component */
  icon?: ComponentType<IconBaseProps>;
  /** Optional dismiss/remove handler for editable tags */
  onRemove?: () => void;
  /** Accessible label for the remove button when onRemove is provided */
  removeAriaLabel?: string;
  /** Tag content / label */
  children: ReactNode;
}
