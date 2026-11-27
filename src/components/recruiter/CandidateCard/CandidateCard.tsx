import { Fragment, useEffect, useRef, useState } from "react";
import type { ComponentType } from "react";
import {
  BookmarkXIcon,
  BriefcaseBusinessIcon,
  EyeIcon,
  HandCoinsIcon,
  IndianRupeeIcon,
  LinkedinIcon,
  MapPinIcon,
  MoreVerticalIcon,
  SquarePenIcon,
} from "@/components/shared/Icon";
import type { IconBaseProps } from "@/components/shared/Icon";
import { IconButton } from "@/components/shared/IconButton";
import { LinkButton } from "@/components/shared/LinkButton";
import { Tag } from "@/components/shared/Tag";
import type { TagVariant } from "@/components/shared/Tag";
import type { CandidateCardProps, CandidateStatus } from "./CandidateCard.types";
import styles from "./CandidateCard.module.css";

const STATUS_LABEL: Record<CandidateStatus, string> = {
  submitted: "Submitted",
  "superhire-review": "SuperHire review",
  "employer-review": "Employer review",
  "under-review": "Employer review",
  shortlisted: "Shortlisted",
  interview: "Interview",
  offered: "Offer",
  joined: "Joined",
  "on-hold": "On hold",
  rejected: "Rejected",
};

const STATUS_TAG_VARIANT: Record<CandidateStatus, TagVariant> = {
  submitted: "neutral",
  "superhire-review": "brand",
  "employer-review": "info",
  "under-review": "info",
  shortlisted: "info",
  interview: "info",
  offered: "success",
  joined: "success",
  "on-hold": "warning",
  rejected: "danger",
};

/**
 * Formats a candidate's CTC or CTC range for the card meta row.
 * Handles explicit `ctcRange`, or combines `currentCtc` and `expectedCtc`
 * (e.g. "32 LPA" + "45 LPA" -> "32–45 LPA"), falling back to single CTC value.
 */
export function formatCandidateCtc(
  ctcRange?: string,
  currentCtc?: string,
  expectedCtc?: string
): string {
  if (ctcRange?.trim()) {
    return ctcRange.trim().replace(/^₹\s*/, "");
  }

  const cur = currentCtc?.trim().replace(/^₹\s*/, "") ?? "";
  const exp = expectedCtc?.trim().replace(/^₹\s*/, "") ?? "";

  if (cur && exp) {
    const curNum = cur.match(/[\d.]+/)?.[0];
    const expNum = exp.match(/[\d.]+/)?.[0];
    if (curNum && expNum && curNum !== expNum) {
      const unit = exp.includes("LPA") || cur.includes("LPA") ? "LPA" : "L";
      return `${curNum}–${expNum} ${unit}`;
    }
    return exp || cur;
  }

  return exp || cur;
}

export function CandidateCard({
  isSelected = false,
  disabled = false,
  candidateName,
  roleTitle,
  company,
  location,
  experience,
  currentCtc,
  expectedCtc,
  ctcRange,
  noticePeriod,
  status,
  commission = "₹2,000",
  earningModel = "shortlist",
  linkedinUrl,
  onViewLinkedin,
  resumeUrl,
  onViewResume,
  actionLabel = "Add another role",
  onAction,
  onClick,
  onEditCandidate,
  onCopyLink,
  onWithdraw,
  className,
}: CandidateCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const hasAction = !disabled && typeof onAction === "function";
  const isClickable = !disabled && typeof onClick === "function";
  const isInteractive = !disabled && (hasAction || isClickable);

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

  const cardClassName = [
    styles.card,
    isInteractive ? styles.interactive : "",
    isClickable ? styles.clickable : "",
    isSelected ? styles.selected : "",
    disabled ? styles.disabled : "",
    menuOpen ? styles.cardMenuOpen : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  // Format CTC range or fallback to single CTC value without duplicate leading ₹
  const ctcText = formatCandidateCtc(ctcRange, currentCtc, expectedCtc);

  const metaItems = [
    ctcText ? { key: "ctc", icon: IndianRupeeIcon, text: ctcText } : null,
    experience?.trim() ? { key: "exp", icon: BriefcaseBusinessIcon, text: experience.trim() } : null,
    noticePeriod?.trim() ? { key: "notice", text: `${noticePeriod.trim()} notice` } : null,
    location?.trim() ? { key: "loc", icon: MapPinIcon, text: location.trim() } : null,
  ].filter(Boolean) as { key: string; icon?: ComponentType<IconBaseProps>; text: string }[];

  return (
    <div
      className={cardClassName}
      tabIndex={isInteractive ? 0 : undefined}
      role={isClickable ? "button" : isInteractive ? "group" : undefined}
      aria-label={isInteractive ? `${candidateName}, applied for ${roleTitle} at ${company}` : undefined}
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
      {/* Header: Candidate Name on left + LinkedIn & Resume icons | Status Tag & Kebab menu on right */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.candidateHeaderName} title={candidateName}>
            {candidateName}
          </span>
          <div className={styles.headerActions}>
            <button
              type="button"
              className={styles.headerActionBtn}
              aria-label={`View ${candidateName}'s LinkedIn profile`}
              title="View LinkedIn profile"
              onClick={(e) => {
                e.stopPropagation();
                if (onViewLinkedin) {
                  onViewLinkedin();
                } else if (linkedinUrl) {
                  window.open(linkedinUrl, "_blank", "noopener,noreferrer");
                }
              }}
            >
              <LinkedinIcon size="sm" />
            </button>
          </div>
        </div>

        <div className={styles.headerRight}>
          <Tag variant={STATUS_TAG_VARIANT[status]}>
            {STATUS_LABEL[status]}
          </Tag>

          <div className={styles.menuContainer} ref={menuRef}>
            <IconButton
              icon={<MoreVerticalIcon size="sm" />}
              ariaLabel={`Options for ${candidateName}`}
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
                <button
                  type="button"
                  role="menuitem"
                  className={styles.dropdownItem}
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpen(false);
                    if (onViewResume) {
                      onViewResume();
                    } else if (resumeUrl) {
                      window.open(resumeUrl, "_blank", "noopener,noreferrer");
                    }
                  }}
                >
                  <EyeIcon size={16} />
                  <span>View resume</span>
                </button>

                {hasAction && (
                  <button
                    type="button"
                    role="menuitem"
                    className={styles.dropdownItem}
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuOpen(false);
                      onAction?.();
                    }}
                  >
                    <BriefcaseBusinessIcon size={16} />
                    <span>{actionLabel}</span>
                  </button>
                )}

                {(onEditCandidate || onCopyLink) && (
                  <button
                    type="button"
                    role="menuitem"
                    className={styles.dropdownItem}
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuOpen(false);
                      if (onEditCandidate) {
                        onEditCandidate();
                      } else if (onCopyLink) {
                        onCopyLink();
                      }
                    }}
                  >
                    <SquarePenIcon size={16} />
                    <span>Edit candidate details</span>
                  </button>
                )}

                {onWithdraw && (
                  <>
                    <hr className={styles.dropdownDivider} />
                    <button
                      type="button"
                      role="menuitem"
                      className={`${styles.dropdownItem} ${styles.dropdownItemDanger}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setMenuOpen(false);
                        onWithdraw?.();
                      }}
                    >
                      <BookmarkXIcon size={16} />
                      <span>Withdraw candidate</span>
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Body:
          1. Role and company details (text-style-label-2):
             "for {role} at {company}" ('for'/'at' tertiary, 'role'/'company' primary)
          2. Meta description with 8px gap:
             Expected CTC (with Rupee icon) · Experience · Notice · Location */}
      <div className={styles.body}>
        <div className={styles.main}>
          <p
            className={styles.roleAndCompany}
            title={`Applied for ${roleTitle} at ${company}`}
          >
            <span className={styles.conjunction}>for </span>
            <span className={styles.entityText}>{roleTitle}</span>
            <span className={styles.conjunction}> at </span>
            <span className={styles.entityText}>{company}</span>
          </p>

          {metaItems.length > 0 && (
            <div
              className={styles.meta}
              title={metaItems.map((m) => m.text).join(" · ")}
            >
              {metaItems.map((m, i) => (
                <Fragment key={m.key}>
                  {i > 0 && (
                    <span className={styles.metaSeparator} aria-hidden="true">
                      ·
                    </span>
                  )}
                  <span className={styles.metaItem}>
                    {m.icon && <m.icon size="sm" className={styles.icon} />}
                    <span className={styles.metaText}>{m.text}</span>
                  </span>
                </Fragment>
              ))}
            </div>
          )}
        </div>

        <hr className={styles.divider} />

        {/* Footer: Hand-Coins Commission + Hover "Add another role" */}
        <div className={styles.footer}>
          <span
            className={styles.commission}
            title={
              earningModel === "closure"
                ? "Earn per closure · Paid when candidate joins and completes one month"
                : "Earn per shortlist · Paid when candidate is shortlisted by employer"
            }
          >
            <HandCoinsIcon size="sm" className={styles.icon} />
            <span className={styles.commissionAmount}>{commission}</span>
            <span className={styles.commissionUnit}>
              {earningModel === "closure" ? "per closure" : "per shortlist"}
            </span>
          </span>
          {hasAction && (
            <LinkButton
              variant="brand"
              size="md"
              arrow
              className={styles.action}
              onClick={(e) => {
                e.stopPropagation();
                onAction?.();
              }}
            >
              {actionLabel}
            </LinkButton>
          )}
        </div>
      </div>
    </div>
  );
}

export default CandidateCard;
