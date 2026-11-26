export interface DropdownOption {
  /** Stable value stored in selection. */
  value: string;
  /** Visible label. */
  label: string;
}

export interface DropdownProps {
  /** Trigger label shown when nothing is selected. */
  label: string;
  /** Options to show in the menu. */
  options: DropdownOption[];
  /**
   * Selected values. Multi-select uses checkboxes; single-select uses radios.
   * Always an array for a consistent API (single-select holds 0 or 1 value).
   */
  selected: string[];
  /** Called with the next selection array when the user changes it. */
  onChange: (next: string[]) => void;
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
  /**
   * Which edge the menu is anchored to. "left" (default) opens rightward;
   * "right" anchors the menu's right edge to the trigger so it opens leftward
   * — use for triggers near the right edge of the screen.
   */
  align?: "left" | "right";
  /** Disable opening and changing options. */
  disabled?: boolean;
  /** Marks the trigger as invalid (error border). */
  invalid?: boolean;
  className?: string;
  triggerClassName?: string;
  menuClassName?: string;
}
