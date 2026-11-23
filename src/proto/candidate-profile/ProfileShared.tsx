import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type {
  CandidateProfileData,
  ProfileSectionId,
} from "./profileData";
import { PROFILE_TOC_SECTIONS } from "./profileData";
import s from "./CandidateProfile.module.css";

/* --------------------------------------------------------------------------
   Section Icons matching the reference TOC screenshot (16x16 clean stroke)
   -------------------------------------------------------------------------- */

export function TocSectionIcon({
  id,
  className,
}: {
  id: ProfileSectionId;
  className?: string;
}) {
  const props = {
    width: 15,
    height: 15,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.9,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
    "aria-hidden": true as const,
  };

  switch (id) {
    case "personal-info":
      return (
        <svg {...props}>
          <circle cx="12" cy="8" r="4" />
          <path d="M5 20a7 7 0 0 1 14 0" />
        </svg>
      );
    case "resume":
      return (
        <svg {...props}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="8" y1="13" x2="16" y2="13" />
          <line x1="8" y1="17" x2="13" y2="17" />
        </svg>
      );
    case "education":
      return (
        <svg {...props}>
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5" />
        </svg>
      );
    case "work-experience":
      return (
        <svg {...props}>
          <rect x="2" y="7" width="20" height="14" rx="2" />
          <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
          <path d="M2 12h20" />
        </svg>
      );
    case "projects":
      return (
        <svg {...props}>
          <rect x="4" y="3" width="16" height="18" rx="2" />
          <path d="M9 7h6" />
          <path d="M9 11h6" />
          <path d="M9 15h4" />
        </svg>
      );
    case "certifications":
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="9" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      );
    case "links":
      return (
        <svg {...props}>
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
      );
    case "skills":
      return (
        <svg {...props}>
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
        </svg>
      );
  }
}

export function VerifiedCheckMiniIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12 2.3 2.3 4.7-4.7" />
    </svg>
  );
}

export function CopyMiniIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

export function ExternalMiniIcon({ className }: { className?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M7 17 17 7" />
      <path d="M7 7h10v10" />
    </svg>
  );
}

export function DownloadMiniIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

export function EyeMiniIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

/* --------------------------------------------------------------------------
   Scroll-Spy + Smooth Section Navigation Hook
   -------------------------------------------------------------------------- */

export function useProfileScrollSpy() {
  const [activeSection, setActiveSection] =
    useState<ProfileSectionId>("personal-info");
  const [scrollProgress, setScrollProgress] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const isProgrammaticScroll = useRef(false);
  const scrollTimeoutRef = useRef<number | null>(null);

  const registerSection = useCallback(
    (id: ProfileSectionId) => (el: HTMLElement | null) => {
      sectionRefs.current[id] = el;
    },
    []
  );

  const scrollToSection = useCallback((id: ProfileSectionId) => {
    const container = scrollContainerRef.current;
    const target = sectionRefs.current[id];
    if (!container || !target) return;

    setActiveSection(id);
    isProgrammaticScroll.current = true;

    if (scrollTimeoutRef.current) {
      window.clearTimeout(scrollTimeoutRef.current);
    }

    const containerRect = container.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    const offset = targetRect.top - containerRect.top + container.scrollTop - 16;

    container.scrollTo({
      top: Math.max(0, offset),
      behavior: "smooth",
    });

    scrollTimeoutRef.current = window.setTimeout(() => {
      isProgrammaticScroll.current = false;
    }, 520);
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const maxScroll = Math.max(1, scrollHeight - clientHeight);
      setScrollProgress(Math.min(1, Math.max(0, scrollTop / maxScroll)));

      if (isProgrammaticScroll.current) return;

      // If scrolled to the very bottom, activate the last section
      if (scrollTop + clientHeight >= scrollHeight - 16) {
        setActiveSection(
          PROFILE_TOC_SECTIONS[PROFILE_TOC_SECTIONS.length - 1].id
        );
        return;
      }

      const containerTop = container.getBoundingClientRect().top;
      let currentId: ProfileSectionId = PROFILE_TOC_SECTIONS[0].id;

      for (const sec of PROFILE_TOC_SECTIONS) {
        const el = sectionRefs.current[sec.id];
        if (!el) continue;
        const relTop = el.getBoundingClientRect().top - containerTop;
        if (relTop <= 84) {
          currentId = sec.id;
        }
      }
      setActiveSection(currentId);
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      container.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutRef.current) {
        window.clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  return {
    activeSection,
    scrollProgress,
    scrollContainerRef,
    registerSection,
    scrollToSection,
  };
}

/* --------------------------------------------------------------------------
   Shared Candidate Profile Section Content Stream
   -------------------------------------------------------------------------- */

function formatCtc(val: string): string {
  if (!val) return "";
  const cleaned = val.replace(/₹/g, "").replace(/LPA/gi, "").trim();
  return `₹${cleaned} LPA`;
}

export function CandidateProfileSections({
  profile,
  registerSection,
  variant = "editorial",
}: {
  profile: CandidateProfileData;
  registerSection: (id: ProfileSectionId) => (el: HTMLElement | null) => void;
  variant?: "editorial" | "form-readonly" | "cards";
}) {
  const copyValue = (label: string, val: string) => {
    navigator.clipboard?.writeText(val);
    toast.success(`${label} copied`, { description: val });
  };

  const wrapClass =
    variant === "cards"
      ? s.sectionCard
      : variant === "form-readonly"
        ? s.sectionFormBlock
        : s.sectionEditorial;

  return (
    <div
      className={
        variant === "cards" ? s.sectionsStreamCards : s.sectionsStream
      }
    >
      {/* 1. PERSONAL INFO */}
      <section
        ref={registerSection("personal-info")}
        id="section-personal-info"
        className={wrapClass}
        aria-label="Personal info"
      >
        <div className={s.sectionHeader}>
          <h3 className={s.sectionTitle}>Personal info</h3>
        </div>

        {variant === "form-readonly" ? (
          /* Matches uploaded screenshot's clean read-only field boxes */
          <div className={s.readonlyFormGrid}>
            <div className={s.readonlyFieldFull}>
              <span className={s.readonlyLabel}>Full legal name</span>
              <div className={s.readonlyInputBox}>{profile.fullName}</div>
            </div>

            <div className={s.readonlyField}>
              <span className={s.readonlyLabel}>Email</span>
              <div className={s.readonlyInputBox}>
                <span className={s.truncateText}>{profile.email}</span>
                <button
                  type="button"
                  className={s.inlineCopyBtn}
                  onClick={() => copyValue("Email", profile.email)}
                  title="Copy email"
                  aria-label="Copy email"
                >
                  <CopyMiniIcon />
                </button>
              </div>
            </div>

            <div className={s.readonlyField}>
              <span className={s.readonlyLabel}>Phone number</span>
              <div className={s.readonlyInputBox}>
                <span>{profile.phone}</span>
                <button
                  type="button"
                  className={s.inlineCopyBtn}
                  onClick={() => copyValue("Phone", profile.phone)}
                  title="Copy phone number"
                  aria-label="Copy phone number"
                >
                  <CopyMiniIcon />
                </button>
              </div>
            </div>

            <div className={s.readonlyField}>
              <span className={s.readonlyLabel}>LinkedIn URL</span>
              <div className={s.readonlyInputBox}>
                <span className={s.truncateText}>{profile.linkedinUrl}</span>
              </div>
            </div>

            <div className={s.readonlyField}>
              <span className={s.readonlyLabel}>Location & preference</span>
              <div className={s.readonlyInputBox}>
                <span>
                  {profile.location} · {profile.workModePreference}
                </span>
              </div>
            </div>
          </div>
        ) : (
          /* Clean 2-column recruiter attribute grid */
          <div className={s.kvGrid}>
            <div className={s.kvItem}>
              <span className={s.kvLabel}>Full legal name</span>
              <span className={s.kvValue}>{profile.fullName}</span>
            </div>
            <div className={s.kvItem}>
              <span className={s.kvLabel}>Location</span>
              <span className={s.kvValue}>
                {profile.location} ({profile.workModePreference})
              </span>
            </div>
            <div className={s.kvItem}>
              <span className={s.kvLabel}>Email address</span>
              <button
                type="button"
                className={s.kvCopyValue}
                onClick={() => copyValue("Email", profile.email)}
              >
                <span className={s.truncateText}>{profile.email}</span>
                <CopyMiniIcon />
              </button>
            </div>
            <div className={s.kvItem}>
              <span className={s.kvLabel}>Phone number</span>
              <button
                type="button"
                className={s.kvCopyValue}
                onClick={() => copyValue("Phone", profile.phone)}
              >
                <span>{profile.phone}</span>
                <CopyMiniIcon />
              </button>
            </div>
            <div className={s.kvItem}>
              <span className={s.kvLabel}>Current / Expected CTC</span>
              <span className={s.kvValue}>
                {formatCtc(profile.currentCtc)} / {formatCtc(profile.expectedCtc)}
              </span>
            </div>
            <div className={s.kvItem}>
              <span className={s.kvLabel}>Notice period</span>
              <span className={s.kvValue}>{profile.noticePeriod}</span>
            </div>
          </div>
        )}
      </section>

      {variant !== "cards" && <hr className={s.sectionDivider} />}

      {/* 2. RESUME */}
      <section
        ref={registerSection("resume")}
        id="section-resume"
        className={wrapClass}
        aria-label="Resume"
      >
        <div className={s.sectionHeader}>
          <h3 className={s.sectionTitle}>Resume</h3>
        </div>

        <div className={s.resumeDropCard}>
          <div className={s.resumeFileBadge} aria-hidden="true">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <div className={s.resumeFileMeta}>
            <span className={s.resumeFileName}>{profile.resumeFileName}</span>
            <span className={s.resumeSubMeta}>
              Uploaded on {profile.resumeUploadedAt} · {profile.resumeFileSize}
            </span>
          </div>
          <div className={s.resumeActions}>
            <button
              type="button"
              className={s.resumeBtnSecondary}
              onClick={() =>
                toast("Opening resume preview", {
                  description: profile.resumeFileName,
                })
              }
            >
              <EyeMiniIcon />
              <span>Preview</span>
            </button>
            <button
              type="button"
              className={s.resumeBtnSecondary}
              onClick={() =>
                toast.success("Downloading resume", {
                  description: profile.resumeFileName,
                })
              }
            >
              <DownloadMiniIcon />
              <span>Download</span>
            </button>
          </div>
        </div>
      </section>

      {variant !== "cards" && <hr className={s.sectionDivider} />}

      {/* 3. EDUCATION */}
      <section
        ref={registerSection("education")}
        id="section-education"
        className={wrapClass}
        aria-label="Education"
      >
        <div className={s.sectionHeader}>
          <h3 className={s.sectionTitle}>Education</h3>
        </div>
        <div className={s.entryList}>
          {profile.education.map((edu) => (
            <div key={edu.id} className={s.entryBlock}>
              <div className={s.entryTopRow}>
                <div className={s.eduGroup}>
                  <h4 className={s.entryTitle}>{edu.degree}</h4>
                  <p className={s.entrySub}>
                    {edu.institution} · {edu.location}
                  </p>
                </div>
                <span className={s.entryDate}>{edu.duration}</span>
              </div>
              <p className={s.entryGrade}>{edu.grade}</p>
            </div>
          ))}
        </div>
      </section>

      {variant !== "cards" && <hr className={s.sectionDivider} />}

      {/* 4. WORK EXPERIENCE */}
      <section
        ref={registerSection("work-experience")}
        id="section-work-experience"
        className={wrapClass}
        aria-label="Work experience"
      >
        <div className={s.sectionHeader}>
          <h3 className={s.sectionTitle}>Work experience</h3>
          <span className={s.sectionCountBadge}>
            {profile.totalExperience} total
          </span>
        </div>
        <div className={s.experienceList}>
          {profile.workExperience.map((exp) => (
            <div key={exp.id} className={s.experienceItem}>
              <div className={s.entryTopRow}>
                <div className={s.expRoleGroup}>
                  <h4 className={s.entryTitle}>{exp.role}</h4>
                  <span className={s.expCompanyLine}>
                    {exp.company} · {exp.location}
                  </span>
                </div>
                <div className={s.expDurationRight}>
                  <span className={s.entryDate}>{exp.duration}</span>
                </div>
              </div>
              <ul className={s.bulletList}>
                {exp.highlights.map((h, idx) => (
                  <li key={idx}>{h}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {variant !== "cards" && <hr className={s.sectionDivider} />}

      {/* 5. PROJECTS */}
      <section
        ref={registerSection("projects")}
        id="section-projects"
        className={wrapClass}
        aria-label="Projects"
      >
        <div className={s.sectionHeader}>
          <h3 className={s.sectionTitle}>Projects</h3>
        </div>
        <div className={s.entryList}>
          {profile.projects.map((proj) => (
            <div key={proj.id} className={s.projectItem}>
              <div className={s.entryTopRow}>
                <h4 className={s.entryTitle}>{proj.title}</h4>
                <span className={s.entryDate}>{proj.subtitle}</span>
              </div>
              <p className={s.projectDesc}>{proj.description}</p>
            </div>
          ))}
        </div>
      </section>

      {variant !== "cards" && <hr className={s.sectionDivider} />}

      {/* 6. CERTIFICATIONS */}
      <section
        ref={registerSection("certifications")}
        id="section-certifications"
        className={wrapClass}
        aria-label="Certifications"
      >
        <div className={s.sectionHeader}>
          <h3 className={s.sectionTitle}>Certifications</h3>
        </div>
        <div className={s.entryList}>
          {profile.certifications.map((cert) => (
            <div key={cert.id} className={s.certRow}>
              <div className={s.certMain}>
                <h4 className={s.entryTitle}>{cert.name}</h4>
                <span className={s.entrySub}>
                  {cert.issuer} · ID: {cert.credentialId}
                </span>
              </div>
              <span className={s.entryDate}>{cert.issuedDate}</span>
            </div>
          ))}
        </div>
      </section>

      {variant !== "cards" && <hr className={s.sectionDivider} />}

      {/* 7. LINKS */}
      <section
        ref={registerSection("links")}
        id="section-links"
        className={wrapClass}
        aria-label="Links"
      >
        <div className={s.sectionHeader}>
          <h3 className={s.sectionTitle}>Links</h3>
        </div>
        <div className={s.linksGrid}>
          {profile.links.map((lnk) => (
            <button
              key={lnk.id}
              type="button"
              className={s.linkCard}
              onClick={() =>
                toast(`Opening ${lnk.label}`, { description: lnk.url })
              }
            >
              <div className={s.linkCardLeft}>
                <span className={s.linkLabel}>{lnk.label}</span>
                <span className={s.linkHandle}>{lnk.handle}</span>
              </div>
              <ExternalMiniIcon />
            </button>
          ))}
        </div>
      </section>

      {variant !== "cards" && <hr className={s.sectionDivider} />}

      {/* 8. SKILLS */}
      <section
        ref={registerSection("skills")}
        id="section-skills"
        className={wrapClass}
        aria-label="Skills"
      >
        <div className={s.sectionHeader}>
          <h3 className={s.sectionTitle}>Skills</h3>
        </div>
        <div className={s.skillChipsWrap}>
          {profile.skills.map((skill) => (
            <span key={skill} className={s.skillChip}>
              {skill}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}
