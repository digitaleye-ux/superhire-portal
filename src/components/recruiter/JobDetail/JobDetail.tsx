import { Fragment, useEffect, useRef, useState } from "react";
import type { ComponentType } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/shared/Badge";
import { Button } from "@/components/shared/Button";
import { IconButton } from "@/components/shared/IconButton";
import { Tab as TabButton } from "@/components/shared/Tab";
import { Tag } from "@/components/shared/Tag";
import {
  BookmarkXIcon,
  BriefcaseBusinessIcon,
  DownloadIcon,
  IndianRupeeIcon,
  LinkIcon,
  MapPinIcon,
  MoreVerticalIcon,
  XIcon,
} from "@/components/shared/Icon";
import type { IconBaseProps } from "@/components/shared/Icon";
import type { JobDetailProps } from "./JobDetail.types";
import styles from "./JobDetail.module.css";

type Tab = "job" | "company";

interface MetaEntry {
  key: string;
  icon?: ComponentType<IconBaseProps>;
  text: string;
  title?: string;
}

/**
 * Job detail panel — the "Tabbed" direction (see DECISION.md).
 * Compact header, two tabs (Job details / Company details), sticky claim footer.
 * Presentational: all data comes in via `job`.
 */
export function JobDetail({
  job,
  onClose,
  onClaim,
  onUnclaim,
  onCopyLink,
  onDownloadJd,
  unclaimLabel = "Unclaim role",
  actionLabel = "Claim role",
  className,
}: JobDetailProps) {
  const [tab, setTab] = useState<Tab>("job");
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

  const c = job.companyInfo;

  // Resolve editorial content with backwards-compatible fallbacks
  const skills = job.skills || [];
  const aboutRole = job.aboutRole || job.overview || "";
  const responsibilities = job.responsibilities || [];
  const requirements =
    job.requirements && job.requirements.length > 0
      ? job.requirements
      : Array.from(new Set([...(job.criteria || []), ...(job.skills || [])]));
  const niceToHave = job.niceToHave || [];
  const compAndBenefits = job.compensationAndBenefits;
  const disclaimer = job.disclaimer;

  const expectations = [
    { label: "Experience", value: job.roleExpectations?.experience || job.experience },
    { label: "Employment", value: job.roleExpectations?.employment || job.jobType },
    { label: "Work mode", value: job.roleExpectations?.workMode || job.mode },
    { label: "Location", value: job.roleExpectations?.location || job.locationFull || job.location },
    { label: "Package", value: job.packageLabel },
    (job.roleExpectations?.noticePeriod || job.noticePeriod)
      ? { label: "Notice period", value: job.roleExpectations?.noticePeriod || job.noticePeriod }
      : null,
  ].filter(Boolean) as { label: string; value: string }[];

  // Exact same meta row as JobCard: package · experience · location · mode
  const locationText = job.location?.trim() ?? "";
  const modeText = job.mode?.trim() ?? "";
  const modeDuplicatesLocation =
    locationText.toLowerCase() === modeText.toLowerCase();

  const metaEntries: MetaEntry[] = [
    {
      key: "package",
      icon: IndianRupeeIcon,
      // Drop the leading ₹ — the rupee icon conveys it, avoiding a double ₹.
      text: (job.packageLabel?.trim() ?? "").replace(/^₹\s*/, ""),
    },
    { key: "experience", icon: BriefcaseBusinessIcon, text: job.experience?.trim() ?? "" },
    {
      key: "location",
      icon: MapPinIcon,
      text: locationText,
      // Full location list on hover tooltip
      title: job.locationFull?.trim() || locationText,
    },
    { key: "mode", text: modeDuplicatesLocation ? "" : modeText },
  ].filter((entry) => entry.text.length > 0);

  return (
    <section
      className={[styles.panel, className].filter(Boolean).join(" ")}
      aria-label={`Details for ${job.role} at ${job.company}`}
    >
      <header className={styles.header}>
        <div className={styles.headMain}>
          <div className={styles.topRow}>
            <div className={styles.headerLeft}>
              {job.companyLogoUrl && !logoFailed ? (
                <img
                  className={styles.logo}
                  src={job.companyLogoUrl}
                  alt={`${job.company} logo`}
                  onError={() => setLogoFailed(true)}
                />
              ) : (
                <span className={styles.logoFallback} aria-hidden="true" />
              )}
              <span className={styles.company} title={job.company}>
                {job.company}
              </span>
            </div>
            {job.badge && <Badge type={job.badge} className={styles.badge} />}
            <div className={styles.headerActions}>
              <div className={styles.menuContainer} ref={menuRef}>
                <IconButton
                  icon={<MoreVerticalIcon size="md" />}
                  ariaLabel="Job options"
                  size="md"
                  active={menuOpen}
                  aria-expanded={menuOpen}
                  onClick={() => setMenuOpen((prev) => !prev)}
                />
                {menuOpen && (
                  <div
                    className={styles.dropdown}
                    role="menu"
                    aria-orientation="vertical"
                  >
                    <button
                      type="button"
                      role="menuitem"
                      className={styles.dropdownItem}
                      onClick={() => {
                        setMenuOpen(false);
                        if (onCopyLink) {
                          onCopyLink();
                        } else {
                          navigator.clipboard?.writeText(window.location.href);
                          toast.success("Job link copied to clipboard");
                        }
                      }}
                    >
                      <LinkIcon size={16} />
                      <span>Copy job link</span>
                    </button>

                    <button
                      type="button"
                      role="menuitem"
                      className={styles.dropdownItem}
                      onClick={() => {
                        setMenuOpen(false);
                        if (onDownloadJd) {
                          onDownloadJd();
                        } else {
                          toast.success(`Downloaded job details for ${job.role}`);
                        }
                      }}
                    >
                      <DownloadIcon size={16} />
                      <span>Download job details</span>
                    </button>

                    {onUnclaim && (
                      <>
                        <hr className={styles.dropdownDivider} />
                        <button
                          type="button"
                          role="menuitem"
                          className={`${styles.dropdownItem} ${styles.dropdownItemDanger}`}
                          onClick={() => {
                            setMenuOpen(false);
                            onUnclaim(job.id);
                          }}
                        >
                          <BookmarkXIcon size={16} />
                          <span>{unclaimLabel}</span>
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
              <IconButton
                icon={<XIcon size="md" />}
                ariaLabel="Close job details"
                title="Close"
                size="md"
                onClick={onClose}
              />
            </div>
          </div>
          <div className={styles.headTitle}>
            <h2 className={styles.role} title={job.role}>
              {job.role}
            </h2>
            {metaEntries.length > 0 && (
              <div
                className={styles.meta}
                title={metaEntries.map((e) => e.title ?? e.text).join(" · ")}
              >
                {metaEntries.map((entry, i) => (
                  <Fragment key={entry.key}>
                    {i > 0 && (
                      <span className={styles.metaSeparator} aria-hidden="true">
                        ·
                      </span>
                    )}
                    <span className={styles.metaItem} title={entry.title}>
                      {entry.icon && <entry.icon size="sm" className={styles.iconSm} />}
                      <span className={styles.metaText}>{entry.text}</span>
                    </span>
                  </Fragment>
                ))}
              </div>
            )}
          </div>
        </div>
        <nav className={styles.tabs} role="tablist" aria-label="Job and company">
          <TabButton
            label="Job details"
            active={tab === "job"}
            onClick={() => setTab("job")}
          />
          <TabButton
            label="Company details"
            active={tab === "company"}
            onClick={() => setTab("company")}
          />
        </nav>
      </header>
      <div className={styles.scroll} role="tabpanel">
        {tab === "job" ? (
          <>
            {/* Skills */}
            {skills.length > 0 && (
              <Block title="Skills">
                <div className={styles.chips}>
                  {skills.map((skill, i) => (
                    <Tag key={i}>{skill}</Tag>
                  ))}
                </div>
              </Block>
            )}

            {/* 1. About the role */}
            {aboutRole && (
              <Block title="About the role">
                <p className={styles.p}>{aboutRole}</p>
              </Block>
            )}

            {/* 2. What you'll do */}
            {responsibilities.length > 0 && (
              <Block title="What you'll do">
                <ul className={styles.bullets}>
                  {responsibilities.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </Block>
            )}

            {/* 3. What we're looking for */}
            {requirements.length > 0 && (
              <Block title="What we're looking for">
                <ul className={styles.bullets}>
                  {requirements.map((req, i) => (
                    <li key={i}>{req}</li>
                  ))}
                </ul>
              </Block>
            )}

            {/* 4. Nice to have (optional) */}
            {niceToHave.length > 0 && (
              <Block title="Nice to have">
                <ul className={styles.bullets}>
                  {niceToHave.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </Block>
            )}

            {/* 5. Role expectations — Spec Sheet layout */}
            <Block title="Role expectations">
              <SpecSheet items={expectations} />
              {disclaimer && <p className={styles.disclaimer}>{disclaimer}</p>}
            </Block>

            {/* 6. Compensation and benefits (optional) */}
            {compAndBenefits && (
              <Block title="Compensation and benefits">
                {Array.isArray(compAndBenefits) ? (
                  <ul className={styles.bullets}>
                    {compAndBenefits.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p className={styles.p}>{compAndBenefits}</p>
                )}
              </Block>
            )}
          </>
        ) : (
          <>
            {/* 1. About the company */}
            <Block title={`About ${job.company}`}>
              <p className={styles.p}>{c.about}</p>
            </Block>

            {/* 2. Industry, company size, headquarters, website, open jobs, valuation */}
            <SpecSheet
              items={[
                { label: "Industry", value: c.domain },
                { label: "Company size", value: c.employees },
                { label: "Headquarters", value: c.headquarters || "Global" },
                {
                  label: "Website",
                  value: c.website || `${job.company.toLowerCase().replace(/\s+/g, "")}.com`,
                },
                { label: "Open jobs", value: c.openJobs },
                { label: "Valuation", value: c.valuation },
              ].filter((item) => Boolean(item.value))}
            />

            {/* 3. Company culture */}
            {c.culture && c.culture.length > 0 && (
              <Block title="Company culture">
                <ul className={styles.bullets}>
                  {c.culture.map((x, i) => (
                    <li key={i}>{x}</li>
                  ))}
                </ul>
              </Block>
            )}

            {/* 4. Company perks & benefits */}
            {c.perks && c.perks.length > 0 && (
              <Block title="Company perks &amp; benefits">
                <ul className={styles.bullets}>
                  {c.perks.map((x, i) => (
                    <li key={i}>{x}</li>
                  ))}
                </ul>
              </Block>
            )}
          </>
        )}
      </div>

      <footer className={styles.footer}>
        <span
          className={styles.earn}
          title={
            job.earningModel === "closure"
              ? "Earn per closure · Paid when candidate joins and completes one month"
              : "Earn per shortlist · Paid when candidate is shortlisted by employer"
          }
        >
          Earn <strong>{job.commission}</strong> {job.earningModel === "closure" ? "per closure" : "per shortlist"}
        </span>
        <div className={styles.footerActions}>
          {onUnclaim && (
            <Button
              variant="secondary"
              size="md"
              onClick={() => onUnclaim(job.id)}
            >
              {unclaimLabel}
            </Button>
          )}
          <Button
            variant="primary"
            size="md"
            onClick={() => onClaim?.(job.id)}
          >
            {actionLabel}
          </Button>
        </div>
      </footer>
    </section>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className={styles.block}>
      <h3 className={`${styles.blockTitle} text-style-heading-4`}>{title}</h3>
      {children}
    </div>
  );
}

interface SpecItem {
  label: string;
  value: string;
}

function SpecSheet({ items }: { items: SpecItem[] }) {
  const mid = Math.ceil(items.length / 2);
  const col1 = items.slice(0, mid);
  const col2 = items.slice(mid);

  return (
    <div className={styles.specSheet}>
      <div className={styles.specColumn}>
        {col1.map((item) => (
          <div key={item.label} className={styles.specRow}>
            <span className={`${styles.specLabel} text-style-label-2`}>{item.label}</span>
            <span className={`${styles.specValue} text-style-label-2`} title={item.value}>
              {item.value}
            </span>
          </div>
        ))}
      </div>
      <div className={styles.specColumn}>
        {col2.map((item) => (
          <div key={item.label} className={styles.specRow}>
            <span className={`${styles.specLabel} text-style-label-2`}>{item.label}</span>
            <span className={`${styles.specValue} text-style-label-2`} title={item.value}>
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default JobDetail;
