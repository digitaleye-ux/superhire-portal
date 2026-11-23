import type { ComponentType, ReactNode } from "react";

export interface NavEntry {
  /** Unique key for the item. */
  id: string;
  /** Label shown under the icon. */
  label: string;
  /** Lucide icon component, icon name, ReactNode, or asset URL. */
  icon: string | ReactNode | ComponentType<any>;
  /** Optional href for the item. */
  href?: string;
}

export interface SideNavbarUser {
  /** Avatar image URL. */
  avatarUrl: string;
  /** Accessible name for the avatar (e.g. the user's name). */
  name: string;
  /** Optional click handler for the avatar tile. */
  onClick?: () => void;
}

export interface SideNavbarProps {
  /** Imported SVG asset URL for the brand logo. */
  logo: string;
  /** Accessible label for the logo (defaults to "Home"). */
  logoLabel?: string;
  /** Optional click handler for the logo tile. */
  onLogoClick?: () => void;
  /** Primary navigation items (top group). */
  items: NavEntry[];
  /** Secondary navigation items (bottom group, above the user avatar). */
  footerItems?: NavEntry[];
  /** The id of the currently active item. */
  activeId?: string;
  /** Called when a nav item is selected, with its id. */
  onSelect?: (id: string) => void;
  /** Optional user shown at the very bottom. */
  user?: SideNavbarUser;
  className?: string;
}
