import { Fragment, useEffect, useRef, useState } from "react";
import type { ComponentType } from "react";
import {
  ArrowRightIcon,
  BookmarkXIcon,
  BriefcaseBusinessIcon,
  CheckIcon,
  DownloadIcon,
  HandCoinsIcon,
  IndianRupeeIcon,
  LinkIcon,
  MapPinIcon,
  MoreVerticalIcon,
  UploadIcon,
} from "@/components/shared/Icon";
import type { IconBaseProps } from "@/components/shared/Icon";
import { Badge } from "@/components/shared/Badge";
import { IconButton } from "@/components/shared/IconButton";
import type { JobCardProps } from "./JobCard.types";
import styles from "./JobCard.module.css";

/** A single meta entry; icon is optional (job type has none). */
interface MetaEntry {
  key: string;
  icon?: ComponentType<IconBaseProps>;
  text: string;
  /** Full value for the hover tooltip, when `text` may be rolled up/truncated. */
  title?: string;
}

export function JobCard({
  company,
  companyLogoUrl,
  roleTitle,
  packageLabel,
  experience,
  location,
  // jobType is accepted on the props (for a future detail view) but not shown
  // in the meta row — see the meta ordering note below.
  commission,
  earningModel = "shortlist",
  badge,
  showMetaIcons = true,
  locationFull,
  mode,
  actionLabel = "Claim role",
  onClaim,
  onAction,
  onClick,
  isClaimed = false,
  onUnclaim,
  onSubmitCandidate,
  onCopyLink,
  onDownloadJd,
  className,
}: JobCardProps) {
  const handleAction = onAction ?? onClaim;
  const hasAction = typeof handleAction === "function";
  const handleClaim = onClaim ?? (!isClaimed ? handleAction : undefined);
  const handleSubmitCandidate = onSubmitCandidate ?? (isClaimed ? handleAction : undefined);
  const isClickable = typeof onClick === "function";
  const isInteractive = hasAction || isClickable;
  const [logoFailed, setLogoFailed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close kebab dropdown when clicking outside or pressing Escape
  useEffect(() => {
    if (!menuOpen) return;
    const handleDown = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("mousedown", handleDown);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleDown);
      document.removeEventListener("keydown", handleKey);
    };
  }, [menuOpen]);

  const hasMenu = Boolean(
    (!isClaimed && handleClaim) ||
    (isClaimed && handleSubmitCandidate) ||
    isClaimed ||
    onUnclaim ||
    onCopyLink ||
    onDownloadJd
  );

  const cardClassName = [
    styles.card,
    isInteractive ? styles.interactive : "",
    isClickable ? styles.clickable : "",
    menuOpen ? styles.cardMenuOpen : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  // Build the meta row from only the values that are present, so a missing
  // field never leaves a dangling separator.
  // Drop the mode when it only repeats the location — a fully-remote job has
  // location "Remote" and mode "Remote", which would read as "Remote · Remote".
  const locationText = location?.trim() ?? "";
  const modeText = mode?.trim() ?? "";
  const modeDuplicatesLocation =
    locationText.toLowerCase() === modeText.toLowerCase();

  // Meta order: package · experience · location · mode.
  // Job type is intentionally not shown here (weak discriminator) — it stays on
  // the props for a future detail view.
  const metaEntries: MetaEntry[] = [
    {
      key: "package",
      icon: IndianRupeeIcon,
      // Drop the leading ₹ — the rupee icon conveys it, avoiding a double ₹.
      text: (packageLabel?.trim() ?? "").replace(/^₹\s*/, ""),
    },
    { key: "experience", icon: BriefcaseBusinessIcon, text: experience?.trim() ?? "" },
    {
      key: "location",
      icon: MapPinIcon,
      text: locationText,
      // Show the full location list on hover when the label is a "+N" rollup.
      title: locationFull?.trim() || locationText,
    },
    { key: "mode", text: modeDuplicatesLocation ? "" : modeText },
  ].filter((entry) => entry.text.length > 0);

  const showLogo = Boolean(companyLogoUrl) && !logoFailed;
  const hasCommission = Boolean(commission?.trim());

  return (
    <div
      className={cardClassName}
      tabIndex={isInteractive ? 0 : undefined}
      role={isClickable ? "button" : isInteractive ? "group" : undefined}
      aria-label={isInteractive ? `${roleTitle} at ${company}` : undefined}
      onClick={isClickable ? () => onClick?.() : undefined}
      onKeyDown={
        isClickable
          ? (e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onClick?.();
            }
          }
          : undefined
      }
    >
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          {showLogo ? (
            <img
              className={styles.companyLogo}
              src={companyLogoUrl}
              alt={`${company} logo`}
              onError={() => setLogoFailed(true)}
            />
          ) : (
            <span className={styles.companyLogoFallback} aria-hidden="true" />
          )}
          <span className={styles.company} title={company}>
            {company}
          </span>
        </div>

        <div className={styles.headerRight}>
          {badge && <Badge type={badge} className={styles.badge} />}

          {hasMenu && (
            <div className={styles.menuContainer} ref={menuRef}>
              <IconButton
                icon={<MoreVerticalIcon size="sm" />}
                ariaLabel="Job options"
                size="sm"
                active={menuOpen}
                aria-expanded={menuOpen}
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen((prev) => !prev);
                }}
              />

              {menuOpen && (
                <div
                  className={styles.dropdown}
                  role="menu"
                  aria-orientation="vertical"
                  onClick={(e) => e.stopPropagation()}
                >
                  {!isClaimed && handleClaim && (
                    <button
                      type="button"
                      role="menuitem"
                      className={styles.dropdownItem}
                      onClick={(e) => {
                        e.stopPropagation();
                        setMenuOpen(false);
                        handleClaim();
                      }}
                    >
                      <CheckIcon size={16} />
                      <span>Claim role</span>
                    </button>
                  )}

                  {isClaimed && handleSubmitCandidate && (
                    <button
                      type="button"
                      role="menuitem"
                      className={styles.dropdownItem}
                      onClick={(e) => {
                        e.stopPropagation();
                        setMenuOpen(false);
                        handleSubmitCandidate();
                      }}
                    >
                      <UploadIcon size={16} />
                      <span>Submit candidate</span>
                    </button>
                  )}

                  <button
                    type="button"
                    role="menuitem"
                    className={styles.dropdownItem}
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuOpen(false);
                      onCopyLink?.();
                    }}
                  >
                    <LinkIcon size={16} />
                    <span>Copy job link</span>
                  </button>

                  <button
                    type="button"
                    role="menuitem"
                    className={styles.dropdownItem}
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuOpen(false);
                      onDownloadJd?.();
                    }}
                  >
                    <DownloadIcon size={16} />
                    <span>Download job details</span>
                  </button>

                  {(onUnclaim || isClaimed) && (
                    <>
                      <hr className={styles.dropdownDivider} />
                      <button
                        type="button"
                        role="menuitem"
                        className={`${styles.dropdownItem} ${styles.dropdownItemDanger}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setMenuOpen(false);
                          onUnclaim?.();
                        }}
                      >
                        <BookmarkXIcon size={16} />
                        <span>Unclaim role</span>
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Body */}
      <div className={styles.body}>
        <div className={styles.main}>
          <p className={styles.roleTitle} title={roleTitle}>
            {roleTitle}
          </p>

          {metaEntries.length > 0 && (
            <div
              className={styles.meta}
              // Full meta on hover, so the single-line clip never hides data.
              title={metaEntries
                .map((e) => e.title ?? e.text)
                .join(" · ")}
            >
              {metaEntries.map((entry, i) => (
                <Fragment key={entry.key}>
                  {i > 0 && (
                    <span className={styles.metaSeparator} aria-hidden="true">
                      ·
                    </span>
                  )}
                  <span className={styles.metaItem} title={entry.title}>
                    {showMetaIcons && entry.icon && (
                      <entry.icon size="sm" className={`${styles.icon} ${styles.iconSm}`} />
                    )}
                    <span className={styles.metaText}>{entry.text}</span>
                  </span>
                </Fragment>
              ))}
            </div>
          )}
        </div>

        {/* Footer region is always rendered so every card is the same height,
            even when there is no commission. Commission content only shows
            when present. */}
        <hr className={styles.divider} />

        <div className={styles.footer}>
          {hasCommission && (
            <span
              className={styles.commission}
              title={
                earningModel === "closure"
                  ? "Earn per closure · Paid when candidate joins and completes one month"
                  : "Earn per shortlist · Paid when candidate is shortlisted by employer"
              }
            >
              <HandCoinsIcon size="sm" className={styles.iconSm} />
              <span className={styles.commissionAmount}>{commission}</span>
              <span className={styles.commissionUnit}>
                {earningModel === "closure" ? "per closure" : "per shortlist"}
              </span>
            </span>
          )}

          {hasAction && (
            <button
              type="button"
              className={styles.claim}
              onClick={(e) => {
                // Don't let an action click also open the card's detail.
                e.stopPropagation();
                handleAction?.();
              }}
            >
              <span className={styles.claimLabel}>{actionLabel}</span>
              <ArrowRightIcon size="sm" className={styles.iconSm} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default JobCard;
