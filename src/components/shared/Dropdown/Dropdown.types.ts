import type { ReactNode } from "react";

export type DropdownVariant = "filter" | "form" | "plain";
export type DropdownSize = "sm" | "md" | "lg";
export type DropdownAlign = "left" | "right";

export interface DropdownOption {
  /** Stable value stored in selection. */
  value: string;
  /** Visible label. */
  label: string;
  /** Optional secondary description or caption. */
  description?: string;
  /** Optional badge or counter text. */
  badge?: string;
  /** Whether this option is disabled. */
  disabled?: boolean;
}

export interface DropdownProps {
  /** Trigger label shown when nothing is selected. */
  label: string;
  /** Options to show in the menu. */
  options: DropdownOption[];
  /**
   * Selected values. Multi-select uses checkboxes; single-select uses radios or checkmarks.
   * Always an array for a consistent API (single-select holds 0 or 1 value).
   */
  selected: string[];
  /** Called with the next selection array when the user changes it. */
  onChange: (next: string[]) => void;
  /**
   * Visual variant:
   * - "filter" (default) — toolbar filter button with active brand tint, counter pill, and clear button
   * - "form" — standard input field selector with clean border, placeholder, and chevron
   * - "plain" — borderless compact dropdown for dense table headers and inline actions
   */
  variant?: DropdownVariant;
  /**
   * Size token:
   * - "sm" (32px, default) — compact toolbars, table filters
   * - "md" (36px) — standard dialogs, filters
   * - "lg" (40px) — primary form fields (matches Input size="lg")
   */
  size?: DropdownSize;
  /** Multi-select (checkboxes) vs single-select (radios). Defaults to true. */
  multiple?: boolean;
  /**
   * For single-select: the label to show on the trigger reflects the chosen
   * option instead of a counter. Defaults to false (filter style with counter).
   */
  singleShowsValue?: boolean;
  /**
   * For single-select with an explicit default/all option (e.g. "both"):
   * value considered default (unfiltered). When selected or cleared, the trigger
   * stays in the neutral unselected state with the default label.
   */
  defaultValue?: string;
  /**
   * For single-select: allow clicking the currently selected option in the menu
   * to deselect/clear it. Defaults to false.
   */
  allowDeselect?: boolean;
  /** Optional placeholder when no option is selected (variant="form"). */
  placeholder?: string;
  /** Optional leading icon element (e.g. FilterIcon, CalendarIcon). */
  leadingIcon?: ReactNode;
  /** Whether the dropdown expands to fill 100% of the parent width. */
  fullWidth?: boolean;
  /**
   * Which edge the menu is anchored to. "left" (default) opens rightward;
   * "right" anchors the menu's right edge to the trigger so it opens leftward.
   */
  align?: DropdownAlign;
  /** Disable opening and changing options. */
  disabled?: boolean;
  /** Marks the trigger as invalid (error border & focus ring). */
  invalid?: boolean;
  /** Optional helper text or error message for forms. */
  error?: string;
  className?: string;
  triggerClassName?: string;
  menuClassName?: string;
}
