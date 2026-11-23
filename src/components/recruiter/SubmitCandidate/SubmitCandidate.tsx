import { Fragment, useEffect, useRef, useState } from "react";
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
  buildParsedSample,
  focusFirstInvalid,
  useCandidateForm,
} from "./useCandidateForm";
import type { SubmitCandidateProps } from "./SubmitCandidate.types";
import styles from "./SubmitCandidate.module.css";

type PanelTab = "submit" | "details";

interface MetaEntry {
  key: string;
  icon?: ComponentType<IconBaseProps>;
  text: string;
  title?: string;
}

/**
 * Submit Candidate side panel — One scroll layout with Resume-first prefill
 * and a "Job details" reference tab. Matches JobDetail's spacing and tabbed chrome.
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
  const scrollRef = useRef<HTMLDivElement>(null);

  // Exact same meta row as JobCard and JobDetail: package · experience · location · mode
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
    }, 750);
  };

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
              <div className={styles.resumeBlock}>
                <FileField
                  id="cf-resume"
                  hero
                  label="Resume"
                  title="Start with the resume"
                  help="We'll prefill what we can. PDF or Word · up to 5 MB"
                  value={values.resume}
                  busy={parsing}
                  onChange={handleResumeChange}
                  onBlur={() => touch("resume")}
                  error={shown("resume")}
                />
                {(prefillSourceLabel || (prefilledCount > 0 && !parsing)) && (
                  <p className={styles.banner} role="status">
                    <SparklesIcon />
                    {prefillSourceLabel || `Prefilled ${prefilledCount} fields from the resume — review before submitting.`}
                  </p>
                )}
              </div>

              <hr className={styles.divider} />

              <form id="submit-candidate-form" className={styles.form} noValidate onSubmit={handleSubmit}>
                <section className={styles.section} aria-labelledby="sc-basic">
                  <h3 id="sc-basic" className={`${styles.sectionTitle} text-style-heading-4`}>
                    Basic information
                  </h3>
                  <div className={styles.grid}>
                    <div className={styles.full}>
                      <TextField
                        {...bind("name")}
                        label="Name"
                        autoComplete="name"
                        placeholder="Sam Smith"
                        autoFocus
                      />
                    </div>
                    <TextField
                      {...bind("email")}
                      label="Email"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      placeholder="name@company.com"
                      prefix={<MailIcon />}
                    />
                    <PhoneField
                      {...bind("phone")}
                      label="Phone number"
                      code={values.phoneCode}
                      onCode={(c) => set("phoneCode", c)}
                    />
                  </div>
                </section>

                <hr className={styles.divider} />

                <section className={styles.section} aria-labelledby="sc-employment">
                  <h3 id="sc-employment" className={`${styles.sectionTitle} text-style-heading-4`}>
                    Employment details
                  </h3>
                  <div className={styles.grid}>
                    <TextField
                      {...bind("experience")}
                      label="Total experience"
                      numeric
                      suffix="Years"
                      placeholder="4"
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
                      <div className={styles.full}>
                        <TextField
                          {...bind("company")}
                          label="Current company"
                          autoComplete="organization"
                          placeholder="Amazon"
                        />
                      </div>
                    )}
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
                      placeholder="40"
                    />
                  </div>
                </section>

                <hr className={styles.divider} />

                <section className={styles.section} aria-labelledby="sc-links">
                  <h3 id="sc-links" className={`${styles.sectionTitle} text-style-heading-4`}>
                    Web links
                  </h3>
                  <div className={styles.grid}>
                    <div className={styles.full}>
                      <TextField
                        {...bind("linkedin")}
                        label="LinkedIn"
                        type="url"
                        inputMode="url"
                        placeholder="linkedin.com/in/samsmith"
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
                              placeholder="github.com/samsmith"
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
                              label="Portfolio / website"
                              type="url"
                              inputMode="url"
                              optional
                              placeholder="samsmith.dev"
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
                            + Add Portfolio / Website
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </section>

                <hr className={styles.divider} />

                <section className={styles.section} aria-labelledby="sc-requirements">
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
