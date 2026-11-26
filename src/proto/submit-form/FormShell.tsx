import { Fragment, useRef, useState } from "react";
import type { ComponentType, FormEvent, ReactNode } from "react";
import { Badge } from "@/components/shared/Badge";
import { IconButton } from "@/components/shared/IconButton";
import { Tab as TabButton } from "@/components/shared/Tab";
import {
  BriefcaseBusinessIcon,
  IndianRupeeIcon,
  MapPinIcon,
  XIcon,
} from "@/components/shared/Icon";
import type { IconBaseProps } from "@/components/shared/Icon";
import { FileField } from "@/components/recruiter/SubmitCandidate/fields";
import { CheckIcon, SparklesIcon } from "@/components/recruiter/SubmitCandidate/icons";
import {
  buildParsedSample,
  focusFirstInvalid,
  useCandidateForm,
} from "@/components/recruiter/SubmitCandidate/useCandidateForm";
import type { CandidateForm } from "@/components/recruiter/SubmitCandidate/useCandidateForm";
import type { SubmitCandidateJob } from "@/components/recruiter/SubmitCandidate/SubmitCandidate.types";
import panel from "@/components/recruiter/SubmitCandidate/SubmitCandidate.module.css";

interface MetaEntry {
  key: string;
  icon?: ComponentType<IconBaseProps>;
  text: string;
  title?: string;
}

export function FormShell({
  job,
  onClose,
  renderForm,
}: {
  job: SubmitCandidateJob;
  onClose: () => void;
  renderForm: (ctx: {
    form: CandidateForm;
    requirements: string[];
    job: SubmitCandidateJob;
    onShortcutSubmit: () => void;
  }) => ReactNode;
}) {
  const requirements =
    job.requirements && job.requirements.length > 0
      ? job.requirements
      : Array.from(new Set([...(job.criteria || []), ...(job.skills || [])]));
  const form = useCandidateForm(requirements.length);
  const [tab, setTab] = useState<"submit" | "details">("submit");
  const [parsing, setParsing] = useState(false);
  const [prefilledCount, setPrefilledCount] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

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

  const handleResumeChange = (file: File | null) => {
    form.set("resume", file);
    form.touch("resume");
    setPrefilledCount(0);
    if (!file) return;
    setParsing(true);
    window.setTimeout(() => {
      const count = form.prefill(buildParsedSample());
      setPrefilledCount(count);
      setParsing(false);
    }, 700);
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

  return (
    <section className={panel.panel} aria-label={`Submit candidate for ${job.role}`}>
      <header className={panel.header}>
        <div className={panel.headMain}>
          <div className={panel.topRow}>
            <div className={panel.headerLeft}>
              <img className={panel.logo} src={job.companyLogoUrl} alt="" />
              <span className={panel.company}>{job.company}</span>
            </div>
            {job.badge && <Badge type={job.badge} className={panel.badge} />}
            <IconButton
              icon={<XIcon size="md" />}
              ariaLabel="Close submission panel"
              size="md"
              onClick={onClose}
            />
          </div>
          <div className={panel.headTitle}>
            <h2 className={panel.role} title={job.role}>
              {job.role}
            </h2>
            {metaEntries.length > 0 && (
              <div
                className={panel.meta}
                title={metaEntries.map((e) => e.title ?? e.text).join(" · ")}
              >
                {metaEntries.map((entry, i) => (
                  <Fragment key={entry.key}>
                    {i > 0 && (
                      <span className={panel.metaSeparator} aria-hidden="true">
                        ·
                      </span>
                    )}
                    <span className={panel.metaItem} title={entry.title}>
                      {entry.icon && <entry.icon size="sm" className={panel.iconSm} />}
                      <span className={panel.metaText}>{entry.text}</span>
                    </span>
                  </Fragment>
                ))}
              </div>
            )}
          </div>
        </div>
        {form.status !== "done" && (
          <nav className={panel.tabs} role="tablist">
            <TabButton label="Submit candidate" active={tab === "submit"} onClick={() => setTab("submit")} />
            <TabButton label="Job details" active={tab === "details"} onClick={() => setTab("details")} />
          </nav>
        )}
      </header>

      {form.status === "done" ? (
        <div className={panel.success} role="status">
          <span className={panel.successBadge}><CheckIcon size={24} /></span>
          <h3 className={panel.successTitle}>Candidate submitted</h3>
          <p className={panel.successText}>
            We've sent the profile to the hiring team. You'll see its status under Track.
          </p>
          <div className={panel.actions} style={{ marginLeft: 0 }}>
            <button
              type="button"
              className={`${panel.btn} ${panel.secondary}`}
              onClick={() => { form.reset(); setPrefilledCount(0); setTab("submit"); }}
            >
              Submit another
            </button>
            <button type="button" className={`${panel.btn} ${panel.primary}`} onClick={onClose}>
              Done
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className={panel.scroll} ref={scrollRef} role="tabpanel">
            <div className={panel.pane} hidden={tab !== "submit"}>
              <div className={panel.resumeBlock}>
                <FileField
                  id="cf-resume"
                  hero
                  label="Resume"
                  title="Start with the resume"
                  help="We'll prefill what we can. PDF or Word · up to 5 MB"
                  value={form.values.resume}
                  busy={parsing}
                  onChange={handleResumeChange}
                  onBlur={() => form.touch("resume")}
                  error={form.shown("resume")}
                />
                {prefilledCount > 0 && !parsing && (
                  <p className={panel.banner} role="status">
                    <SparklesIcon />
                    Prefilled {prefilledCount} fields from the resume — review before submitting.
                  </p>
                )}
              </div>
              <form id="proto-form" className={panel.form} noValidate onSubmit={handleSubmit}>
                {renderForm({ form, requirements, job, onShortcutSubmit: () => handleSubmit() })}
              </form>
            </div>

            {tab === "details" && (
              <>
                <div className={panel.block}>
                  <h3 className={panel.blockTitle}>Overview</h3>
                  <p className={panel.p}>{job.overview}</p>
                </div>
                <div className={panel.block}>
                  <h3 className={panel.blockTitle}>Must-have requirements</h3>
                  <ul className={panel.bullets}>
                    {requirements.map((r) => <li key={r}>{r}</li>)}
                  </ul>
                </div>
              </>
            )}
          </div>

          <footer className={panel.footer}>
            <span className={panel.footerNote}>
              Earn <strong>{job.commission}</strong> per shortlist
            </span>
            <div className={panel.actions}>
              {tab === "submit" ? (
                <button
                  type="submit"
                  form="proto-form"
                  className={`${panel.btn} ${panel.primary}`}
                  aria-disabled={form.status === "submitting" || parsing}
                >
                  {form.status === "submitting" && <span className={panel.spinner} aria-hidden="true" />}
                  {form.status === "submitting" ? "Submitting…" : "Submit candidate"}
                </button>
              ) : (
                <button
                  type="button"
                  className={`${panel.btn} ${panel.primary}`}
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
