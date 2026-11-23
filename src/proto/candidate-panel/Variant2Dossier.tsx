import type { CandidateDetail } from "./data";
import {
  ActivityHistoryList,
  CandidateOverviewHeader,
  HiringTimeline,
  LatestUpdateSection,
  NotesSection,
} from "./shared";
import s from "./panel.module.css";

/**
 * Variant 2 — "Update First"
 * Axis: Status-first triage — places Latest Update & Next Action immediately below Job Details,
 * followed by the 6-stage vertical Hiring Progress timeline and Activity History.
 */
export default function VariantUpdateFirst({
  detail,
  onClose,
}: {
  detail: CandidateDetail;
  onClose: () => void;
}) {
  return (
    <aside className={s.panel} aria-label={`Candidate details for ${detail.name}`}>
      {/* 1. Candidate overview */}
      <CandidateOverviewHeader detail={detail} onClose={onClose} showJobInline />

      <div className={s.scroll}>
        {/* 2. Latest update (promoted to top for instant triage) */}
        <section className={s.section} aria-label="Latest update">
          <div className={s.sectionHead}>
            <h3 className={s.sectionTitle}>Latest update</h3>
          </div>
          <LatestUpdateSection latest={detail.latest} />
        </section>

        <hr className={s.divider} />

        {/* 3. Hiring progress */}
        <section className={s.section} aria-label="Hiring progress">
          <div className={s.sectionHead}>
            <h3 className={s.sectionTitle}>Hiring progress</h3>
            <span className={s.sectionHint}>{detail.item.submitted}</span>
          </div>
          <HiringTimeline stages={detail.stages} />
        </section>

        <hr className={s.divider} />

        {/* 5. Activity history */}
        <section className={s.section} aria-label="Activity history">
          <div className={s.sectionHead}>
            <h3 className={s.sectionTitle}>Activity history</h3>
          </div>
          <ActivityHistoryList activities={detail.activities} />
        </section>

        <hr className={s.divider} />

        {/* 6. Recruiter & employer notes */}
        <section className={s.section} aria-label="Notes">
          <NotesSection
            recruiterNotes={detail.recruiterNotes}
            employerNotes={detail.employerNotes}
          />
        </section>
      </div>
    </aside>
  );
}
