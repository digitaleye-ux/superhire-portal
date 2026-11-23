import { NavItem } from "@/components/shared/NavItem";
import type { NavEntry, SideNavbarProps } from "./SideNavbar.types";
import styles from "./SideNavbar.module.css";

/**
 * Vertical side navigation rail — Figma node 361:24862.
 * 80px wide, full height, white with a right border. A top nav group and a
 * bottom footer group are pushed apart; an optional user avatar sits at the
 * very bottom. Data-driven so each portal can supply its own items.
 */
export function SideNavbar({
  logo,
  logoLabel = "Home",
  onLogoClick,
  items,
  footerItems = [],
  activeId,
  onSelect,
  user,
  className,
}: SideNavbarProps) {
  const renderItem = (entry: NavEntry) => (
    <NavItem
      key={entry.id}
      label={entry.label}
      icon={entry.icon}
      href={entry.href}
      active={entry.id === activeId}
      onClick={() => onSelect?.(entry.id)}
    />
  );

  return (
    <nav
      className={[styles.navbar, className].filter(Boolean).join(" ")}
      aria-label="Primary"
    >
      <div className={styles.top}>
        <button
          type="button"
          className={styles.logoTile}
          onClick={onLogoClick}
          aria-label={logoLabel}
        >
          <img className={styles.logo} src={logo} alt="" aria-hidden="true" />
        </button>

        <div className={styles.group}>{items.map(renderItem)}</div>
      </div>

      <div className={styles.footer}>
        {footerItems.length > 0 && (
          <div className={styles.group}>{footerItems.map(renderItem)}</div>
        )}

        {user && (
          <button
            type="button"
            className={styles.userTile}
            onClick={user.onClick}
            aria-label={user.name}
          >
            <img
              className={styles.avatar}
              src={user.avatarUrl}
              alt={user.name}
            />
          </button>
        )}
      </div>
    </nav>
  );
}

export default SideNavbar;
