import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import type { ComponentType, FormEvent, ReactNode } from "react";
import { Badge } from "@/components/shared/Badge";
import { Checkbox } from "@/components/shared/Checkbox";
import { Tab as TabButton } from "@/components/shared/Tab";
import {
  ArrowLeftIcon,
  BriefcaseBusinessIcon,
  IndianRupeeIcon,
  MapPinIcon,
  XIcon,
} from "@/components/shared/Icon";
import type { IconBaseProps } from "@/components/shared/Icon";
import { TocSectionIcon } from "@/proto/candidate-profile/ProfileShared";
import type { ProfileSectionId } from "@/proto/candidate-profile/profileData";
import {
  ChecklistGroup,
  FileField,
  PhoneField,
  SelectField,
  TextAreaField,
  TextField,
} from "./fields";
import { CheckIcon, MailIcon, SparklesIcon, XIcon as XCloseIcon } from "./icons";
import {
  NOTICE_OPTIONS,
  WORK_MODE_OPTIONS,
  YEAR_OPTIONS,
  buildParsedSample,
  createEmptyCertification,
  createEmptyEducation,
  createEmptyProject,
  createEmptyWorkExperience,
  focusFirstInvalid,
  useCandidateForm,
} from "./useCandidateForm";
import type {
  FormCertificationEntry,
  FormEducationEntry,
  FormProjectEntry,
  FormWorkExperienceEntry,
  SubmitCandidateProps,
} from "./SubmitCandidate.types";
import styles from "./SubmitCandidate.module.css";

type PanelTab = "submit" | "details";

export type SubmitTocSectionId =
  | "resume"
  | "personal-info"
  | "education"
  | "work-experience"
  | "projects"
  | "certifications"
  | "links"
  | "skills"
  | "requirements";

interface SubmitTocItem {
  id: SubmitTocSectionId;
  label: string;
}

const SUBMIT_TOC_SECTIONS: SubmitTocItem[] = [
  { id: "resume", label: "Resume" },
  { id: "personal-info", label: "Personal info" },
  { id: "education", label: "Education" },
  { id: "work-experience", label: "Work experience" },
  { id: "projects", label: "Projects" },
  { id: "certifications", label: "Certifications" },
  { id: "links", label: "Links" },
  { id: "skills", label: "Skills" },
  { id: "requirements", label: "Must-have requirements" },
];

function SubmitTocIcon({ id }: { id: SubmitTocSectionId }) {
  if (id === "requirements") {
    return (
      <svg
        width={16}
        height={16}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    );
  }
  return <TocSectionIcon id={id as ProfileSectionId} />;
}

function PlusSmIcon() {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

interface MetaEntry {
  key: string;
  icon?: ComponentType<IconBaseProps>;
  text: string;
  title?: string;
}

/**
 * Submit Candidate side panel — Horizontal Pill TOC navigation + Full Profile Sections
 * matching the Candidate Track Panel (Personal info, Resume, Education, Work experience,
 * Projects, Certifications, Links, Skills) + Must-have requirements verification.
 */
export function SubmitCandidate({
  job,
  onClose,
  onSubmit,
  className,
  initialValues,
  prefillSourceLabel,
  onBack,
}: SubmitCandidateProps) {
  const requirements =
    job.requirements && job.requirements.length > 0
      ? job.requirements
      : Array.from(new Set([...(job.criteria || []), ...(job.skills || [])]));
  const skills = job.skills || [];
  const form = useCandidateForm(
    requirements.length,
    (vals) => onSubmit?.(vals, job.id),
    initialValues
  );
  const responsibilities = job.responsibilities || [];
  const aboutRole = job.aboutRole || job.overview || "";
  const [tab, setTab] = useState<PanelTab>("submit");
  const [logoFailed, setLogoFailed] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [prefilledCount, setPrefilledCount] = useState(0);
  const [showGithub, setShowGithub] = useState(() => Boolean(form.values.github));
  const [showPortfolio, setShowPortfolio] = useState(() => Boolean(form.values.portfolio));
  const [skillDraft, setSkillDraft] = useState("");

  // Scroll-spy & TOC state
  const [activeSection, setActiveSection] = useState<SubmitTocSectionId>("resume");
  const scrollRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const pillRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const isProgrammaticScroll = useRef(false);
  const scrollTimeoutRef = useRef<number | null>(null);

  const registerSection = useCallback(
    (id: SubmitTocSectionId) => (el: HTMLElement | null) => {
      sectionRefs.current[id] = el;
    },
    []
  );

  const scrollToSection = useCallback((id: SubmitTocSectionId) => {
    const container = scrollRef.current;
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
    const container = scrollRef.current;
    if (!container || tab !== "submit") return;

    const handleScroll = () => {
      if (isProgrammaticScroll.current) return;
      const { scrollTop, scrollHeight, clientHeight } = container;

      if (scrollTop + clientHeight >= scrollHeight - 16) {
        setActiveSection(SUBMIT_TOC_SECTIONS[SUBMIT_TOC_SECTIONS.length - 1].id);
        return;
      }

      const containerTop = container.getBoundingClientRect().top;
      let currentId: SubmitTocSectionId = SUBMIT_TOC_SECTIONS[0].id;

      for (const sec of SUBMIT_TOC_SECTIONS) {
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
  }, [tab]);

  // Keep active pill visible inside horizontal TOC bar
  useEffect(() => {
    if (tab !== "submit") return;
    const activeBtn = pillRefs.current[activeSection];
    if (activeBtn) {
      activeBtn.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [activeSection, tab]);

  // Exact same meta row as JobCard and JobDetail: package · experience · location · mode
  const locationText = job.location?.trim() ?? "";
  const modeText = job.mode?.trim() ?? "";
  const modeDuplicatesLocation =
    locationText.toLowerCase() === modeText.toLowerCase();

  const metaEntries: MetaEntry[] = [
    {
      key: "package",
      icon: IndianRupeeIcon,
      text: (job.packageLabel?.trim() ?? "").replace(/^₹\s*/, ""),
    },
    { key: "experience", icon: BriefcaseBusinessIcon, text: job.experience?.trim() ?? "" },
    {
      key: "location",
      icon: MapPinIcon,
      text: locationText,
      title: job.locationFull?.trim() || locationText,
    },
    { key: "mode", text: modeDuplicatesLocation ? "" : modeText },
  ].filter((entry) => entry.text.length > 0);

  const { values, set, bind, touch, shown } = form;
  const working = values.working !== "No";
  const showNegotiable = values.notice !== "" && values.notice !== "Immediately";

  useEffect(() => {
    if (values.github) setShowGithub(true);
  }, [values.github]);

  useEffect(() => {
    if (values.portfolio) setShowPortfolio(true);
  }, [values.portfolio]);

  const handleResumeChange = (file: File | null) => {
    set("resume", file);
    touch("resume");
    setPrefilledCount(0);
    if (!file) return;
    setParsing(true);
    window.setTimeout(() => {
      const sample = buildParsedSample();
      const count = form.prefill(sample);
      if (sample.github) setShowGithub(true);
      if (sample.portfolio) setShowPortfolio(true);
      setPrefilledCount(count);
      setParsing(false);
    }, 650);
  };

  // Repeatable Education handlers
  const updateEducation = (idx: number, field: keyof FormEducationEntry, val: string) => {
    const next = values.educationList.map((item, i) =>
      i === idx ? { ...item, [field]: val } : item
    );
    set("educationList", next);
  };

  const addEducation = () => {
    set("educationList", [
      ...values.educationList,
      createEmptyEducation(`edu-${Date.now()}`),
    ]);
  };

  const removeEducation = (idx: number) => {
    if (values.educationList.length <= 1) {
      set("educationList", [createEmptyEducation("edu-1")]);
      return;
    }
    set(
      "educationList",
      values.educationList.filter((_, i) => i !== idx)
    );
  };

  // Repeatable Work Experience handlers
  const updateWorkExperience = (
    idx: number,
    field: keyof FormWorkExperienceEntry,
    val: string
  ) => {
    const next = values.workExperienceList.map((item, i) =>
      i === idx ? { ...item, [field]: val } : item
    );
    set("workExperienceList", next);
    if (idx === 0 && field === "company") {
      set("company", val);
    }
  };

  const addWorkExperience = () => {
    set("workExperienceList", [
      ...values.workExperienceList,
      createEmptyWorkExperience(`exp-${Date.now()}`),
    ]);
  };

  const removeWorkExperience = (idx: number) => {
    if (values.workExperienceList.length <= 1) {
      set("workExperienceList", [createEmptyWorkExperience("exp-1")]);
      return;
    }
    set(
      "workExperienceList",
      values.workExperienceList.filter((_, i) => i !== idx)
    );
  };

  // Repeatable Projects handlers
  const updateProject = (idx: number, field: keyof FormProjectEntry, val: string) => {
    const next = values.projectsList.map((item, i) =>
      i === idx ? { ...item, [field]: val } : item
    );
    set("projectsList", next);
  };

  const addProject = () => {
    set("projectsList", [
      ...values.projectsList,
      createEmptyProject(`proj-${Date.now()}`),
    ]);
  };

  const removeProject = (idx: number) => {
    if (values.projectsList.length <= 1) {
      set("projectsList", [createEmptyProject("proj-1")]);
      return;
    }
    set(
      "projectsList",
      values.projectsList.filter((_, i) => i !== idx)
    );
  };

  // Repeatable Certifications handlers
  const updateCertification = (
    idx: number,
    field: keyof FormCertificationEntry,
    val: string
  ) => {
    const next = values.certificationsList.map((item, i) =>
      i === idx ? { ...item, [field]: val } : item
    );
    set("certificationsList", next);
  };

  const addCertification = () => {
    set("certificationsList", [
      ...values.certificationsList,
      createEmptyCertification(`cert-${Date.now()}`),
    ]);
  };

  const removeCertification = (idx: number) => {
    if (values.certificationsList.length <= 1) {
      set("certificationsList", [createEmptyCertification("cert-1")]);
      return;
    }
    set(
      "certificationsList",
      values.certificationsList.filter((_, i) => i !== idx)
    );
  };

  // Skills handlers
  const addSkill = (rawSkill?: string) => {
    const clean = (rawSkill ?? skillDraft).trim();
    if (!clean) return;
    if (!values.skillsList.some((s) => s.toLowerCase() === clean.toLowerCase())) {
      set("skillsList", [...values.skillsList, clean]);
    }
    if (rawSkill === undefined) setSkillDraft("");
  };

  const removeSkill = (skillToRemove: string) => {
    set(
      "skillsList",
      values.skillsList.filter((s) => s !== skillToRemove)
    );
  };

  const suggestedSkills = skills.filter(
    (sk) => !values.skillsList.some((existing) => existing.toLowerCase() === sk.toLowerCase())
  );

  const handleSubmit = async (e?: FormEvent) => {
    e?.preventDefault();
    if (form.status === "submitting" || parsing) return;
    if (tab !== "submit") {
      setTab("submit");
      return;
    }
    const ok = await form.submit();
    if (!ok) focusFirstInvalid(scrollRef.current);
  };

  const handleReset = () => {
    form.reset();
    setPrefilledCount(0);
    setTab("submit");
    setActiveSection("resume");
  };

  return (
    <section
      className={[styles.panel, className].filter(Boolean).join(" ")}
      aria-label={`Submit candidate for ${job.role} at ${job.company}`}
    >
      <header className={styles.header}>
        <div className={styles.headMain}>
          <div className={styles.topRow}>
            <div className={styles.headerLeft}>
              {onBack && (
                <button
                  type="button"
                  className={styles.backBtn}
                  onClick={onBack}
                  title="Change role"
                  aria-label="Change role"
                >
                  <ArrowLeftIcon size="sm" />
                  <span>Change role</span>
                </button>
              )}
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
            <button type="button" className={styles.close} aria-label="Close" onClick={onClose}>
              <XIcon size="md" />
            </button>
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

        {form.status !== "done" && (
          <nav className={styles.tabs} role="tablist" aria-label="Submit candidate and job details">
            <TabButton
              label="Submit candidate"
              active={tab === "submit"}
              onClick={() => setTab("submit")}
            />
            <TabButton
              label="Job details"
              active={tab === "details"}
              onClick={() => setTab("details")}
            />
          </nav>
        )}
      </header>

      {/* Sticky Horizontal Pill Table of Contents (TOC) matching Candidate Track Panel */}
      {form.status !== "done" && tab === "submit" && (
        <nav
          className={styles.horizontalTocBar}
          aria-label="Candidate submission sections"
        >
          {SUBMIT_TOC_SECTIONS.map((sec) => {
            const isActive = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                ref={(el) => {
                  pillRefs.current[sec.id] = el;
                }}
                type="button"
                className={`${styles.tocPill} ${isActive ? styles.tocPillActive : ""}`}
                aria-current={isActive ? "location" : undefined}
                onClick={() => scrollToSection(sec.id)}
              >
                <SubmitTocIcon id={sec.id} />
                <span>{sec.label}</span>
              </button>
            );
          })}
        </nav>
      )}

      {form.status === "done" ? (
        <div className={styles.success} role="status">
          <span className={styles.successBadge}>
            <CheckIcon size={24} />
          </span>
          <h3 className={styles.successTitle}>Candidate submitted</h3>
          <p className={styles.successText}>
            We've sent the profile to the hiring team. You'll see its status under Track.
          </p>
          <div className={styles.successActions}>
            <button
              type="button"
              className={`${styles.btn} ${styles.secondary}`}
              onClick={handleReset}
            >
              Submit another
            </button>
            <button
              type="button"
              className={`${styles.btn} ${styles.primary}`}
              onClick={onClose}
            >
              Done
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className={styles.scroll} ref={scrollRef} role="tabpanel">
            <div className={styles.pane} hidden={tab !== "submit"}>
              {/* 1. RESUME (Prefills all profile sections below) */}
              <section
                ref={registerSection("resume")}
                id="sc-sec-resume"
                className={styles.section}
                aria-labelledby="sc-heading-resume"
              >
                <div className={styles.sectionHead}>
                  <h3 id="sc-heading-resume" className={`${styles.sectionTitle} text-style-heading-4`}>
                    Resume
                  </h3>
                </div>
                <div className={styles.resumeBlock}>
                  <FileField
                    id="cf-resume"
                    hero
                    label="Resume"
                    title="Start with the resume"
                    help="We'll prefill Personal info, Education, Work experience, Projects, Certifications, Links & Skills. PDF or Word · up to 5 MB"
                    value={values.resume}
                    busy={parsing}
                    onChange={handleResumeChange}
                    onBlur={() => touch("resume")}
                    error={shown("resume")}
                  />
                  {(prefillSourceLabel || (prefilledCount > 0 && !parsing)) && (
                    <p className={styles.banner} role="status">
                      <SparklesIcon />
                      {prefillSourceLabel ||
                        "Prefilled candidate profile, education, work experience, projects, and skills from resume — review before submitting."}
                    </p>
                  )}
                </div>
              </section>

              <hr className={styles.divider} />

              <form id="submit-candidate-form" className={styles.form} noValidate onSubmit={handleSubmit}>
                {/* 2. PERSONAL INFO (Matches Track Candidate Panel Personal info + Employment details) */}
                <section
                  ref={registerSection("personal-info")}
                  id="sc-sec-personal-info"
                  className={styles.section}
                  aria-labelledby="sc-heading-personal"
                >
                  <h3 id="sc-heading-personal" className={`${styles.sectionTitle} text-style-heading-4`}>
                    Personal info
                  </h3>
                  <div className={styles.grid}>
                    <div className={styles.full}>
                      <TextField
                        {...bind("name")}
                        label="Full legal name"
                        autoComplete="name"
                        placeholder="Rohan Mehta"
                        autoFocus
                      />
                    </div>
                    <TextField
                      {...bind("email")}
                      label="Email address"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      placeholder="rohan.mehta@gmail.com"
                      prefix={<MailIcon />}
                    />
                    <PhoneField
                      {...bind("phone")}
                      label="Phone number"
                      code={values.phoneCode}
                      onCode={(c) => set("phoneCode", c)}
                    />
                    <TextField
                      {...bind("location")}
                      label="Location"
                      placeholder="Bengaluru, India"
                    />
                    <SelectField
                      {...bind("workModePreference")}
                      label="Work mode preference"
                      options={WORK_MODE_OPTIONS}
                      placeholder="Select work mode"
                    />
                    <TextField
                      {...bind("experience")}
                      label="Total experience"
                      numeric
                      suffix="Years"
                      placeholder="6"
                    />
                    <SelectField
                      {...bind("notice")}
                      label="Notice period"
                      options={NOTICE_OPTIONS}
                    />
                    {showNegotiable && (
                      <div className={`${styles.full} ${styles.checkboxRow}`}>
                        <Checkbox
                          label="Notice period is negotiable / buyout possible"
                          checked={values.noticeNegotiable === "Yes"}
                          onChange={(e) => set("noticeNegotiable", e.target.checked ? "Yes" : "No")}
                        />
                      </div>
                    )}
                    <div className={`${styles.full} ${styles.checkboxRow}`}>
                      <Checkbox
                        label="Candidate is not currently employed / on a career break"
                        checked={values.working === "No"}
                        onChange={(e) => set("working", e.target.checked ? "No" : "Yes")}
                      />
                    </div>
                    {working && (
                      <TextField
                        {...bind("currentCtc")}
                        label="Current CTC"
                        numeric
                        suffix="Lakhs"
                        placeholder="32"
                      />
                    )}
                    <TextField
                      {...bind("expectedCtc")}
                      label="Expected CTC"
                      numeric
                      suffix="Lakhs"
                      placeholder="45"
                    />
                  </div>
                </section>

                <hr className={styles.divider} />

                {/* 3. EDUCATION */}
                <section
                  ref={registerSection("education")}
                  id="sc-sec-education"
                  className={styles.section}
                  aria-labelledby="sc-heading-education"
                >
                  <div className={styles.sectionHead}>
                    <h3 id="sc-heading-education" className={`${styles.sectionTitle} text-style-heading-4`}>
                      Education
                    </h3>
                    <button
                      type="button"
                      className={styles.addSectionBtn}
                      onClick={addEducation}
                    >
                      <PlusSmIcon />
                      <span>Add education</span>
                    </button>
                  </div>

                  <div className={styles.repeatableStack}>
                    {values.educationList.map((edu, idx) => {
                      const headingText =
                        edu.degree.trim() && edu.institution.trim()
                          ? `${edu.degree.trim()} from ${edu.institution.trim()}`
                          : edu.degree.trim() || edu.institution.trim() || `Education #${idx + 1}`;

                      return (
                        <div key={edu.id} className={styles.repeatableItem}>
                          <div className={styles.entryHeaderRow}>
                            <h4 className={styles.entryHeading} title={headingText}>
                              {headingText}
                            </h4>
                            <button
                              type="button"
                              className={styles.removeEntryBtn}
                              onClick={() => removeEducation(idx)}
                              aria-label={`Remove ${headingText}`}
                            >
                              <XCloseIcon size={12} />
                              <span>Remove</span>
                            </button>
                          </div>

                          <div className={styles.grid}>
                            <TextField
                              id={`cf-edu-school-${edu.id}`}
                              label="School / College"
                              value={edu.institution}
                              onChange={(v) => updateEducation(idx, "institution", v)}
                              placeholder="National Institute of Technology Karnataka (NITK)"
                            />
                            <TextField
                              id={`cf-edu-degree-${edu.id}`}
                              label="Degree"
                              value={edu.degree}
                              onChange={(v) => updateEducation(idx, "degree", v)}
                              placeholder="B.Tech in Computer Science & Engineering"
                            />
                            <SelectField
                              id={`cf-edu-start-${edu.id}`}
                              label="Start year"
                              value={edu.startYear}
                              options={YEAR_OPTIONS}
                              onChange={(v) => updateEducation(idx, "startYear", v)}
                              placeholder="Select start year"
                            />
                            <SelectField
                              id={`cf-edu-end-${edu.id}`}
                              label="End year"
                              value={edu.endYear}
                              options={YEAR_OPTIONS}
                              onChange={(v) => updateEducation(idx, "endYear", v)}
                              placeholder="Select end year"
                            />
                            <TextField
                              id={`cf-edu-loc-${edu.id}`}
                              label="Location"
                              value={edu.location}
                              onChange={(v) => updateEducation(idx, "location", v)}
                              placeholder="Mangaluru"
                            />
                            <TextField
                              id={`cf-edu-grade-${edu.id}`}
                              label="CGPA / Grade"
                              optional
                              value={edu.grade}
                              onChange={(v) => updateEducation(idx, "grade", v)}
                              placeholder="8.9 CGPA · First Class with Distinction"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>

                <hr className={styles.divider} />

                {/* 4. WORK EXPERIENCE */}
                <section
                  ref={registerSection("work-experience")}
                  id="sc-sec-work-experience"
                  className={styles.section}
                  aria-labelledby="sc-heading-experience"
                >
                  <div className={styles.sectionHead}>
                    <h3 id="sc-heading-experience" className={`${styles.sectionTitle} text-style-heading-4`}>
                      Work experience
                    </h3>
                    <button
                      type="button"
                      className={styles.addSectionBtn}
                      onClick={addWorkExperience}
                    >
                      <PlusSmIcon />
                      <span>Add work experience</span>
                    </button>
                  </div>

                  <div className={styles.repeatableStack}>
                    {values.workExperienceList.map((exp, idx) => {
                      const headingText =
                        exp.role.trim() && exp.company.trim()
                          ? `${exp.role.trim()} at ${exp.company.trim()}`
                          : exp.role.trim() || exp.company.trim() || `Role #${idx + 1}`;

                      return (
                        <div key={exp.id} className={styles.repeatableItem}>
                          <div className={styles.entryHeaderRow}>
                            <h4 className={styles.entryHeading} title={headingText}>
                              {headingText}
                            </h4>
                            <button
                              type="button"
                              className={styles.removeEntryBtn}
                              onClick={() => removeWorkExperience(idx)}
                              aria-label={`Remove ${headingText}`}
                            >
                              <XCloseIcon size={12} />
                              <span>Remove</span>
                            </button>
                          </div>

                          <div className={styles.grid}>
                            <TextField
                              id={`cf-exp-company-${exp.id}`}
                              label="Company"
                              value={exp.company}
                              onChange={(v) => updateWorkExperience(idx, "company", v)}
                              placeholder="Zeta"
                            />
                            <TextField
                              id={`cf-exp-role-${exp.id}`}
                              label="Role"
                              value={exp.role}
                              onChange={(v) => updateWorkExperience(idx, "role", v)}
                              placeholder="Senior Frontend Engineer"
                            />
                            <TextField
                              id={`cf-exp-start-${exp.id}`}
                              label="Start date"
                              value={exp.startDate}
                              onChange={(v) => updateWorkExperience(idx, "startDate", v)}
                              placeholder="Apr 2023"
                            />
                            <TextField
                              id={`cf-exp-end-${exp.id}`}
                              label="End date"
                              value={exp.endDate}
                              onChange={(v) => updateWorkExperience(idx, "endDate", v)}
                              placeholder="Present"
                            />
                            <div className={styles.full}>
                              <TextField
                                id={`cf-exp-loc-${exp.id}`}
                                label="Location & work mode"
                                value={exp.location}
                                onChange={(v) => updateWorkExperience(idx, "location", v)}
                                placeholder="Bengaluru · Hybrid"
                              />
                            </div>
                            <div className={styles.full}>
                              <TextAreaField
                                id={`cf-exp-highlights-${exp.id}`}
                                label="Key highlights & achievements (one bullet per line)"
                                optional
                                value={exp.highlightsText}
                                onChange={(v) => updateWorkExperience(idx, "highlightsText", v)}
                                placeholder="Architected the core card-issuing console in React 18 & TypeScript...&#10;Led migration to a token-driven design system..."
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>

                <hr className={styles.divider} />

                {/* 5. PROJECTS */}
                <section
                  ref={registerSection("projects")}
                  id="sc-sec-projects"
                  className={styles.section}
                  aria-labelledby="sc-heading-projects"
                >
                  <div className={styles.sectionHead}>
                    <h3 id="sc-heading-projects" className={`${styles.sectionTitle} text-style-heading-4`}>
                      Projects
                    </h3>
                    <button
                      type="button"
                      className={styles.addSectionBtn}
                      onClick={addProject}
                    >
                      <PlusSmIcon />
                      <span>Add project</span>
                    </button>
                  </div>

                  <div className={styles.repeatableStack}>
                    {values.projectsList.map((proj, idx) => {
                      const headingText = proj.title.trim() || `Project #${idx + 1}`;
                      return (
                        <div key={proj.id} className={styles.repeatableItem}>
                          <div className={styles.entryHeaderRow}>
                            <h4 className={styles.entryHeading} title={headingText}>
                              {headingText}
                            </h4>
                            <button
                              type="button"
                              className={styles.removeEntryBtn}
                              onClick={() => removeProject(idx)}
                              aria-label={`Remove ${headingText}`}
                            >
                              <XCloseIcon size={12} />
                              <span>Remove</span>
                            </button>
                          </div>

                          <div className={styles.grid}>
                            <TextField
                              id={`cf-proj-title-${proj.id}`}
                              label="Project title"
                              value={proj.title}
                              onChange={(v) => updateProject(idx, "title", v)}
                              placeholder="Bolt UI — Multi-Brand Design Token Engine"
                            />
                            <TextField
                              id={`cf-proj-sub-${proj.id}`}
                              label="Role & year"
                              optional
                              value={proj.subtitle}
                              onChange={(v) => updateProject(idx, "subtitle", v)}
                              placeholder="Lead Author · 2025"
                            />
                            <div className={styles.full}>
                              <TextAreaField
                                id={`cf-proj-desc-${proj.id}`}
                                label="Project details"
                                optional
                                value={proj.description}
                                onChange={(v) => updateProject(idx, "description", v)}
                                placeholder="Zero-runtime CSS token pipeline and accessible React primitive library..."
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>

                <hr className={styles.divider} />

                {/* 6. CERTIFICATIONS */}
                <section
                  ref={registerSection("certifications")}
                  id="sc-sec-certifications"
                  className={styles.section}
                  aria-labelledby="sc-heading-certifications"
                >
                  <div className={styles.sectionHead}>
                    <h3 id="sc-heading-certifications" className={`${styles.sectionTitle} text-style-heading-4`}>
                      Certifications
                    </h3>
                    <button
                      type="button"
                      className={styles.addSectionBtn}
                      onClick={addCertification}
                    >
                      <PlusSmIcon />
                      <span>Add certification</span>
                    </button>
                  </div>

                  <div className={styles.repeatableStack}>
                    {values.certificationsList.map((cert, idx) => {
                      const headingText = cert.name.trim() || `Certification #${idx + 1}`;
                      return (
                        <div key={cert.id} className={styles.repeatableItem}>
                          <div className={styles.entryHeaderRow}>
                            <h4 className={styles.entryHeading} title={headingText}>
                              {headingText}
                            </h4>
                            <button
                              type="button"
                              className={styles.removeEntryBtn}
                              onClick={() => removeCertification(idx)}
                              aria-label={`Remove ${headingText}`}
                            >
                              <XCloseIcon size={12} />
                              <span>Remove</span>
                            </button>
                          </div>

                          <div className={styles.grid}>
                            <TextField
                              id={`cf-cert-name-${cert.id}`}
                              label="Certification name"
                              value={cert.name}
                              onChange={(v) => updateCertification(idx, "name", v)}
                              placeholder="Google Cloud Certified — Professional Cloud Developer"
                            />
                            <TextField
                              id={`cf-cert-issuer-${cert.id}`}
                              label="Issuing organization"
                              value={cert.issuer}
                              onChange={(v) => updateCertification(idx, "issuer", v)}
                              placeholder="Google Cloud"
                            />
                            <TextField
                              id={`cf-cert-date-${cert.id}`}
                              label="Issue date"
                              value={cert.issuedDate}
                              onChange={(v) => updateCertification(idx, "issuedDate", v)}
                              placeholder="Aug 2025"
                            />
                            <TextField
                              id={`cf-cert-id-${cert.id}`}
                              label="Credential ID"
                              optional
                              value={cert.credentialId}
                              onChange={(v) => updateCertification(idx, "credentialId", v)}
                              placeholder="GCP-PCD-994182"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>

                <hr className={styles.divider} />

                {/* 7. LINKS */}
                <section
                  ref={registerSection("links")}
                  id="sc-sec-links"
                  className={styles.section}
                  aria-labelledby="sc-heading-links"
                >
                  <h3 id="sc-heading-links" className={`${styles.sectionTitle} text-style-heading-4`}>
                    Links
                  </h3>
                  <div className={styles.grid}>
                    <div className={styles.full}>
                      <TextField
                        {...bind("linkedin")}
                        label="LinkedIn"
                        type="url"
                        inputMode="url"
                        placeholder="linkedin.com/in/rohan-mehta"
                      />
                    </div>

                    {showGithub && (
                      <div className={styles.full}>
                        <div className={styles.closableField}>
                          <div className={styles.closableInput}>
                            <TextField
                              {...bind("github")}
                              label="GitHub"
                              type="url"
                              inputMode="url"
                              optional
                              placeholder="github.com/rohan-mehta"
                            />
                          </div>
                          <button
                            type="button"
                            className={styles.removeLinkBtn}
                            onClick={() => {
                              set("github", "");
                              setShowGithub(false);
                            }}
                            title="Remove GitHub"
                            aria-label="Remove GitHub"
                          >
                            <XCloseIcon size={14} />
                          </button>
                        </div>
                      </div>
                    )}

                    {showPortfolio && (
                      <div className={styles.full}>
                        <div className={styles.closableField}>
                          <div className={styles.closableInput}>
                            <TextField
                              {...bind("portfolio")}
                              label="Portfolio"
                              type="url"
                              inputMode="url"
                              optional
                              placeholder="rohan-mehta.dev"
                            />
                          </div>
                          <button
                            type="button"
                            className={styles.removeLinkBtn}
                            onClick={() => {
                              set("portfolio", "");
                              setShowPortfolio(false);
                            }}
                            title="Remove Portfolio"
                            aria-label="Remove Portfolio"
                          >
                            <XCloseIcon size={14} />
                          </button>
                        </div>
                      </div>
                    )}

                    {(!showGithub || !showPortfolio) && (
                      <div className={`${styles.full} ${styles.linkButtons}`}>
                        {!showGithub && (
                          <button
                            type="button"
                            className={styles.addLinkBtn}
                            onClick={() => setShowGithub(true)}
                          >
                            + Add GitHub
                          </button>
                        )}
                        {!showPortfolio && (
                          <button
                            type="button"
                            className={styles.addLinkBtn}
                            onClick={() => setShowPortfolio(true)}
                          >
                            + Add Portfolio
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </section>

                <hr className={styles.divider} />

                {/* 8. SKILLS */}
                <section
                  ref={registerSection("skills")}
                  id="sc-sec-skills"
                  className={styles.section}
                  aria-labelledby="sc-heading-skills"
                >
                  <h3 id="sc-heading-skills" className={`${styles.sectionTitle} text-style-heading-4`}>
                    Skills
                  </h3>
                  <div className={styles.skillsEditor}>
                    {values.skillsList.length > 0 && (
                      <div className={styles.skillChipsWrap}>
                        {values.skillsList.map((skill) => (
                          <span key={skill} className={styles.skillTagPill}>
                            <span>{skill}</span>
                            <button
                              type="button"
                              className={styles.skillRemoveBtn}
                              onClick={() => removeSkill(skill)}
                              aria-label={`Remove ${skill}`}
                            >
                              <XCloseIcon size={12} />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}

                    <div className={styles.skillInputRow}>
                      <div
                        className={styles.skillInputFieldWrap}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addSkill();
                          }
                        }}
                      >
                        <TextField
                          id="cf-add-skill"
                          label="Add skills"
                          optional
                          value={skillDraft}
                          onChange={setSkillDraft}
                          placeholder="Type a skill (e.g. TypeScript, System Design) and press Enter"
                        />
                      </div>
                      <button
                        type="button"
                        className={styles.skillAddBtn}
                        onClick={() => addSkill()}
                      >
                        Add
                      </button>
                    </div>

                    {suggestedSkills.length > 0 && (
                      <div className={styles.suggestedSkillsBlock}>
                        <span className={styles.suggestedSkillsLabel}>
                          Suggested from job requirements:
                        </span>
                        <div className={styles.skillChipsWrap}>
                          {suggestedSkills.map((sk) => (
                            <button
                              key={sk}
                              type="button"
                              className={styles.suggestedSkillChip}
                              onClick={() => addSkill(sk)}
                            >
                              <span>+ {sk}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </section>

                <hr className={styles.divider} />

                {/* 9. MUST-HAVE REQUIREMENTS (Recruiter verification checklist + Additional remarks) */}
                <section
                  ref={registerSection("requirements")}
                  id="sc-sec-requirements"
                  className={styles.section}
                  aria-labelledby="sc-requirements"
                >
                  <div className={styles.sectionHead}>
                    <h3 id="sc-requirements" className={`${styles.sectionTitle} text-style-heading-4`}>
                      Must-have requirements
                    </h3>
                    {requirements.length > 0 && (
                      <span
                        className={styles.sectionMetaPill}
                        data-all-verified={
                          values.verifiedRequirements.length === requirements.length ? "" : undefined
                        }
                      >
                        {values.verifiedRequirements.length === requirements.length ? (
                          <>
                            <CheckIcon size={12} />
                            All {requirements.length} verified
                          </>
                        ) : (
                          `${values.verifiedRequirements.length}/${requirements.length} verified`
                        )}
                      </span>
                    )}
                  </div>

                  {requirements.length > 0 && (
                    <ChecklistGroup
                      id="cf-requirements"
                      options={requirements}
                      values={values.verifiedRequirements}
                      onChange={(v) => set("verifiedRequirements", v)}
                      onBlur={() => touch("verifiedRequirements")}
                      error={shown("verifiedRequirements")}
                      footer="Confirm the candidate meets all dealbreakers before submitting."
                    />
                  )}

                  <div className={styles.remarksWrapper}>
                    <TextAreaField
                      id="cf-remarks"
                      label="Additional remarks"
                      optional
                      value={values.remarks}
                      onChange={(v) => set("remarks", v)}
                      onBlur={bind("remarks").onBlur}
                      onSubmitShortcut={() => handleSubmit()}
                      placeholder="Anything the hiring team should know about this candidate"
                    />
                  </div>
                </section>
              </form>
            </div>

            {tab === "details" && (
              <>
                {skills.length > 0 && (
                  <Block title="Skills">
                    <div className={styles.chips}>
                      {skills.map((skill, i) => (
                        <span key={i} className={`${styles.chip} text-style-label-3`}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  </Block>
                )}
                {aboutRole && (
                  <Block title="About the role">
                    <p className={styles.p}>{aboutRole}</p>
                  </Block>
                )}
                {responsibilities.length > 0 && (
                  <Block title="What you'll do">
                    <ul className={styles.bullets}>
                      {responsibilities.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </Block>
                )}
                <Block title="Experience">
                  <p className={styles.p}>
                    {job.experience} · Notice: {job.noticePeriod} · {job.openings}{" "}
                    {job.openings === 1 ? "opening" : "openings"}
                  </p>
                </Block>
                {requirements.length > 0 && (
                  <Block title="Must-have requirements">
                    <ul className={styles.bullets}>
                      {requirements.map((req) => (
                        <li key={req}>{req}</li>
                      ))}
                    </ul>
                  </Block>
                )}
              </>
            )}
          </div>

          <footer className={styles.footer}>
            <span
              className={styles.footerNote}
              title={
                job.earningModel === "closure"
                  ? "Earn per closure · Paid when candidate joins and completes one month"
                  : "Earn per shortlist · Paid when candidate is shortlisted by employer"
              }
            >
              Earn <strong>{job.commission}</strong>{" "}
              {job.earningModel === "closure" ? "per closure" : "per shortlist"}
            </span>
            <div className={styles.actions}>
              {tab === "submit" ? (
                <button
                  type="submit"
                  form="submit-candidate-form"
                  className={`${styles.btn} ${styles.primary}`}
                  aria-disabled={form.status === "submitting" || parsing}
                  onClick={(e) => (form.status === "submitting" || parsing) && e.preventDefault()}
                >
                  {form.status === "submitting" && (
                    <span className={styles.spinner} aria-hidden="true" />
                  )}
                  {form.status === "submitting" ? "Submitting…" : "Submit candidate"}
                </button>
              ) : (
                <button
                  type="button"
                  className={`${styles.btn} ${styles.primary}`}
                  onClick={() => setTab("submit")}
                >
                  Submit candidate
                </button>
              )}
            </div>
          </footer>
        </>
      )}
    </section>
  );
}

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className={styles.block}>
      <h3 className={`${styles.blockTitle} text-style-heading-4`}>{title}</h3>
      {children}
    </div>
  );
}

export default SubmitCandidate;
