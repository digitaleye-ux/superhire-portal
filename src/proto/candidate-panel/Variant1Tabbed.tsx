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
 * Variant 1 — "Linear Flow"
 * Axis: Exact 5-part structure separated by subtle hairline dividers — zero cards or tabs.
 *
 * 1. Candidate overview (Name, designation, experience, location, resume link)
 * 2. Job details (Company name, job title, recruiter commission)
 * 3. Hiring progress (6-stage vertical timeline)
 * 4. Latest update (Current status, waiting duration, latest update, next action)
 * 5. Activity history (Chronological list of application updates)
 */
export default function VariantLinearFlow({
  detail,
  onClose,
}: {
  detail: CandidateDetail;
  onClose: () => void;
}) {
  return (
    <aside className={s.panel} aria-label={`Candidate details for ${detail.name}`}>
      {/* 1. Candidate overview */}
      <CandidateOverviewHeader detail={detail} onClose={onClose} />

      <div className={s.scroll}>
        {/* 2. Hiring progress */}
        <section className={s.section} aria-label="Hiring progress">
          <div className={s.sectionHead}>
            <h3 className={s.sectionTitle}>Hiring progress</h3>
            <span className={s.sectionHint}>{detail.item.submitted}</span>
          </div>
          <HiringTimeline stages={detail.stages} />
        </section>

        <hr className={s.divider} />

        {/* 4. Latest update */}
        <section className={s.section} aria-label="Latest update">
          <div className={s.sectionHead}>
            <h3 className={s.sectionTitle}>Latest update</h3>
          </div>
          <LatestUpdateSection latest={detail.latest} />
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
