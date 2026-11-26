import { isValidElement } from "react";
import type { ComponentType, ReactNode } from "react";
import { Icon } from "@/components/shared/Icon";
import type { IconName } from "@/components/shared/Icon";
import styles from "./NavItem.module.css";

export interface NavItemProps {
  /** Label shown under the icon. */
  label: string;
  /** Imported SVG asset URL, Lucide icon component, ReactNode, or icon name. */
  icon: string | ReactNode | ComponentType<any>;
  /** Whether this item is the active/selected one. */
  active?: boolean;
  /** Disable navigation interaction. */
  disabled?: boolean;
  /** Click handler. */
  onClick?: () => void;
  /** Optional href — renders an anchor instead of a button when provided. */
  href?: string;
  className?: string;
}

function renderNavIcon(icon: NavItemProps["icon"]) {
  if (!icon) return null;

  if (typeof icon === "string") {
    if (icon.includes("/") || icon.endsWith(".svg")) {
      return <Icon src={icon} size="md" className={styles.icon} />;
    }
    return <Icon name={icon as IconName} size="md" className={styles.icon} />;
  }

  if (isValidElement(icon)) {
    return icon;
  }

  if (
    typeof icon === "function" ||
    (typeof icon === "object" && icon !== null && "$$typeof" in icon)
  ) {
    const IconComponent = icon as ComponentType<{ size?: number; className?: string }>;
    return <IconComponent size={20} className={styles.icon} />;
  }

  return null;
}

/**
 * Sidebar navigation item — an 80x80 tile with a centered icon + label.
 * Figma node 360:23986 (Inactive / Hover / Active / Focus / Disabled states).
 */
export function NavItem({
  label,
  icon,
  active = false,
  disabled = false,
  onClick,
  href,
  className,
}: NavItemProps) {
  const classes = [
    styles.item,
    active ? styles.active : "",
    disabled ? styles.disabled : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const content = (
    <span className={styles.content}>
      {renderNavIcon(icon)}
      <span className={styles.label}>{label}</span>
    </span>
  );

  if (href && !disabled) {
    return (
      <a
        href={href}
        className={classes}
        aria-current={active ? "page" : undefined}
        onClick={onClick}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type="button"
      disabled={disabled}
      className={classes}
      aria-current={active ? "page" : undefined}
      onClick={disabled ? undefined : onClick}
    >
      {content}
    </button>
  );
}

export default NavItem;
