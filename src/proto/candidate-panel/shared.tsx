import { Fragment } from "react";
import { toast } from "sonner";
import { Tab as TabButton } from "@/components/shared/Tab";
import {
  BriefcaseBusinessIcon,
  Icon,
  IndianRupeeIcon,
  LinkedinIcon,
  MapPinIcon,
  XIcon,
} from "@/components/shared/Icon";
import type { IconName } from "@/components/shared/Icon";
import type { CandidateStatus } from "@/components/recruiter/CandidateCard";
import { formatCandidateCtc } from "@/components/recruiter/CandidateCard";
import type {
  ActivityEntry,
  CandidateDetail,
  CandidateNote,
  LatestUpdateInfo,
  TimelineStage,
} from "./data";
import s from "./panel.module.css";

/* ------------------------------ Minimal Icons ------------------------------ */

export function Ic({ name, size = 16 }: { name: "x" | "check" | "file" | "pause" | "arrowUpRight"; size?: number }) {
  const iconNameMap: Record<string, IconName> = {
    x: "x",
    check: "check",
    file: "file",
    pause: "pause",
    arrowUpRight: "arrow-up-right",
  };
  return <Icon name={iconNameMap[name]} size={size} className={s.icon} />;
}

/* ------------------------------ Minimal Status Badge ------------------------------ */

export const STATUS_LABEL: Record<CandidateStatus, string> = {
  submitted: "Submitted",
  "under-review": "Under review",
  shortlisted: "Shortlisted",
  interview: "Interview",
  offered: "Offered",
  joined: "Joined",
  "on-hold": "On hold",
  rejected: "Rejected",
};

const STATUS_CLASS: Record<CandidateStatus, string> = {
  submitted: s.statusNeutral,
  "under-review": s.statusInfo,
  shortlisted: s.statusBrand,
  interview: s.statusWarning,
  offered: s.statusSuccess,
  joined: s.statusSuccess,
  "on-hold": s.statusNeutral,
  rejected: s.statusDanger,
};

export function StatusTag({ status, label }: { status: CandidateStatus; label?: string }) {
  return <span className={`${s.status} ${STATUS_CLASS[status]}`}>{label ?? STATUS_LABEL[status]}</span>;
}

/* ------------------------------ 1. Candidate Overview Header ------------------------------ */

export type CandidatePanelTab = "status" | "profile";

export function CandidateOverviewHeader({
  detail,
  onClose,
  showJobInline = true,
  activeTab,
  onTabChange,
}: {
  detail: CandidateDetail;
  onClose: () => void;
  showJobInline?: boolean;
  activeTab?: CandidatePanelTab;
  onTabChange?: (tab: CandidatePanelTab) => void;
}) {
  const ctcText = formatCandidateCtc(
    detail.item.ctcRange,
    detail.currentCtc,
    detail.expectedCtc
  );
  const noticeText = detail.noticePeriod?.trim()
    ? detail.noticePeriod.toLowerCase().includes("notice")
      ? detail.noticePeriod.trim()
      : `${detail.noticePeriod.trim()} notice`
    : "";

  const metaItems = [
    ctcText ? { key: "ctc", icon: IndianRupeeIcon, text: ctcText } : null,
    detail.experience?.trim() ? { key: "exp", icon: BriefcaseBusinessIcon, text: detail.experience.trim() } : null,
    noticeText ? { key: "notice", text: noticeText } : null,
    detail.location?.trim() ? { key: "loc", icon: MapPinIcon, text: detail.location.trim() } : null,
  ].filter(Boolean) as { key: string; icon?: typeof IndianRupeeIcon; text: string }[];

  const hasTabs = Boolean(activeTab && onTabChange);

  return (
    <header className={`${s.header} ${hasTabs ? s.headerWithTabs : ""}`}>
      <div className={s.headMain}>
        {/* Top row: Candidate Name + LinkedIn on left | Status tag + Close button on right */}
        <div className={s.topRow}>
          <div className={s.candidateRow}>
            <h2 className={s.candidateTitle} title={detail.name}>
              {detail.name}
            </h2>
            <div className={s.headerActions}>
              <button
                type="button"
                className={s.headerActionBtn}
                aria-label={`View ${detail.name}'s LinkedIn profile`}
                title="View LinkedIn profile"
                onClick={(e) => {
                  e.stopPropagation();
                  toast("Opening LinkedIn", {
                    description: `${detail.name}'s profile`,
                  });
                }}
              >
                <LinkedinIcon size="sm" />
              </button>
            </div>
          </div>

          <div className={s.topRowRight}>
            <StatusTag status={detail.item.status} />
            <button
              type="button"
              className={s.close}
              aria-label="Close candidate panel"
              onClick={onClose}
            >
              <XIcon size="md" />
            </button>
          </div>
        </div>

        {/* Subtitle: for Role at Company & Meta row matching CandidateCard */}
        <div className={s.headTitle}>
          {showJobInline && (
            <p
              className={s.roleAndCompany}
              title={`Applied for ${detail.jobTitle} at ${detail.company}`}
            >
              <span className={s.conjunction}>for </span>
              <span className={s.entityText}>{detail.jobTitle}</span>
              <span className={s.conjunction}> at </span>
              <span className={s.entityText}>{detail.company}</span>
            </p>
          )}

          {metaItems.length > 0 && (
            <div
              className={s.meta}
              title={metaItems.map((m) => m.text).join(" · ")}
            >
              {metaItems.map((m, i) => (
                <Fragment key={m.key}>
                  {i > 0 && (
                    <span className={s.metaSeparator} aria-hidden="true">
                      ·
                    </span>
                  )}
                  <span className={s.metaItem}>
                    {m.icon && <m.icon size="sm" className={s.iconSm} />}
                    <span className={s.metaText}>{m.text}</span>
                  </span>
                </Fragment>
              ))}
            </div>
          )}
        </div>
      </div>

      {activeTab && onTabChange && (
        <nav
          className={s.tabs}
          role="tablist"
          aria-label="Candidate status and profile"
        >
          <TabButton
            label="Candidate status"
            active={activeTab === "status"}
            onClick={() => onTabChange("status")}
          />
          <TabButton
            label="Candidate profile"
            active={activeTab === "profile"}
            onClick={() => onTabChange("profile")}
          />
        </nav>
      )}
    </header>
  );
}

/* ------------------------------ 2. Job Details ------------------------------ */

export function JobDetailsRow({ detail }: { detail: CandidateDetail }) {
  return (
    <div className={s.jobDetailsRow}>
      <div className={s.jobCell}>
        <span className={s.metaLabel}>Company</span>
        <span className={s.metaValue}>{detail.company}</span>
      </div>
      <div className={s.jobCell}>
        <span className={s.metaLabel}>Job title</span>
        <span className={s.metaValue} title={detail.jobTitle}>
          {detail.jobTitle}
        </span>
      </div>
      <div className={s.jobCellRight}>
        <span className={s.metaLabel}>Commission</span>
        <span className={s.commissionValue}>{detail.commission}</span>
        {detail.commissionNote && (
          <span className={s.commissionNote}>{detail.commissionNote}</span>
        )}
      </div>
    </div>
  );
}

/* ------------------------------ 3. Hiring Progress (6-Stage Vertical Timeline) ------------------------------ */

export function HiringTimeline({
  stages,
  embeddedLatest,
}: {
  stages: TimelineStage[];
  embeddedLatest?: LatestUpdateInfo;
}) {
  return (
    <ol className={s.vTimeline} aria-label="Hiring progress">
      {stages.map((st, idx) => {
        const isLast = idx === stages.length - 1;
        const isDone = st.state === "done";
        const isCurrent = st.state === "current";
        const isRejected =
          st.state === "interview-unsuccessful" ||
          st.state === "not-approved" ||
          st.state === "not-shortlisted" ||
          st.state === "offer-declined" ||
          st.state === "withdrawn" ||
          (st.state as string) === "rejected";
        const isHold = st.state === "on-hold";
        const isUpcoming = st.state === "upcoming";
        const isActiveNode = isCurrent || isRejected || isHold;

        return (
          <li
            key={st.key}
            className={`${s.vStep} ${isDone ? s.vStepDone : ""} ${
              isCurrent ? s.vStepCurrent : ""
            } ${isRejected ? s.vStepRejected : ""} ${isHold ? s.vStepHold : ""} ${
              isUpcoming ? s.vStepUpcoming : ""
            } ${isLast ? s.vStepLast : ""}`}
          >
            <div className={s.vRail}>
              <span className={s.vDot}>
                {isDone && <Ic name="check" size={11} />}
                {isRejected && <Ic name="x" size={11} />}
                {isHold && <Ic name="pause" size={9} />}
              </span>
              {!isLast && <span className={s.vLine} aria-hidden="true" />}
            </div>

            <div className={s.vContent}>
              <div className={s.vHead}>
                <span className={s.vLabel}>{st.label}</span>
                {st.date && <span className={s.vDate}>{st.date}</span>}
              </div>

              {st.update && !embeddedLatest && <p className={s.vUpdate}>{st.update}</p>}

              {embeddedLatest && isDone && st.update && (
                <p className={s.vUpdate}>{st.update}</p>
              )}

              {embeddedLatest && isActiveNode && (
                <div className={s.embeddedUpdateBox}>
                  <div className={s.embeddedUpdateHead}>
                    <span className={s.embeddedStatus}>{embeddedLatest.statusLabel}</span>
                    <span
                      className={`${s.durationText} ${
                        embeddedLatest.isOverdue ? s.durationOverdue : ""
                      }`}
                    >
                      {embeddedLatest.waitingDuration}
                    </span>
                  </div>
                  <p className={s.embeddedBody}>{embeddedLatest.updateText}</p>
                  {embeddedLatest.nextAction && (
                    <p className={s.embeddedNext}>
                      <span className={s.nextPrefix}>Next: </span>
                      {embeddedLatest.nextAction}
                    </p>
                  )}
                </div>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

/* ------------------------------ 4. Latest Update ------------------------------ */

export function LatestUpdateSection({ latest }: { latest: LatestUpdateInfo }) {
  return (
    <div className={`${s.latestBox} ${latest.isOverdue ? s.latestBoxOverdue : ""}`}>
      <div className={s.latestHead}>
        <span className={s.latestStatus}>{latest.statusLabel}</span>
        <span className={`${s.durationText} ${latest.isOverdue ? s.durationOverdue : ""}`}>
          {latest.waitingDuration}
        </span>
      </div>
      <p className={s.latestBody}>{latest.updateText}</p>
      {latest.nextAction && (
        <div className={s.latestNextRow}>
          <span className={s.nextPrefix}>Next step</span>
          <span className={s.nextText}>{latest.nextAction}</span>
        </div>
      )}
    </div>
  );
}

/* ------------------------------ 5. Activity History ------------------------------ */

export function ActivityHistoryList({ activities }: { activities: ActivityEntry[] }) {
  return (
    <ul className={s.activityList} aria-label="Activity history">
      {activities.map((a) => (
        <li key={a.id} className={s.activityItem}>
          <div className={s.activityTop}>
            <span className={s.activityTitle}>{a.title}</span>
            <span className={s.activityDate}>
              {a.date} · {a.time}
            </span>
          </div>
          <p className={s.activityDetail}>{a.detail}</p>
        </li>
      ))}
    </ul>
  );
}

/* ------------------------------ 6. Recruiter & Employer Notes ------------------------------ */

function NoteGroup({
  notes,
  role,
}: {
  notes: CandidateNote[];
  role: "recruiter" | "employer";
}) {
  const badgeClass =
    role === "recruiter" ? s.noteBadgeRecruiter : s.noteBadgeEmployer;
  const label = role === "recruiter" ? "Recruiter notes" : "Employer notes";
  if (notes.length === 0) {
    return (
      <div className={s.noteGroupEmpty}>
        <span className={s.noteGroupLabel}>{label}</span>
        <span className={s.noteGroupHint}>No notes yet</span>
      </div>
    );
  }
  return (
    <div className={s.noteGroup}>
      <span className={s.noteGroupLabel}>
        <span className={badgeClass} aria-hidden="true" />
        {label}
      </span>
      <ul className={s.noteList}>
        {notes.map((n) => (
          <li key={n.id} className={s.noteItem}>
            <div className={s.noteHead}>
              <span className={s.noteAuthor}>{n.author}</span>
              <span className={s.noteDate}>{n.date}</span>
            </div>
            <p className={s.noteBody}>{n.text}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function NotesSection({
  recruiterNotes,
  employerNotes,
}: {
  recruiterNotes: CandidateNote[];
  employerNotes: CandidateNote[];
}) {
  return (
    <div className={s.notesSection}>
      <div className={s.notesSectionHead}>
        <h3 className={s.notesSectionTitle}>Notes</h3>
        <span className={s.notesSectionHint}>
          {recruiterNotes.length + employerNotes.length}
        </span>
      </div>
      <NoteGroup notes={recruiterNotes} role="recruiter" />
      <NoteGroup notes={employerNotes} role="employer" />
    </div>
  );
}
