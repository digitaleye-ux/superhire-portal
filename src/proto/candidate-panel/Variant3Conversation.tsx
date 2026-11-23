import type { CandidateDetail } from "./data";
import {
  CandidateOverviewHeader,
  NotesSection,
} from "./shared";
import { HiringProgressTracker } from "@/proto/hiring-progress/HiringProgressTracker";
import s from "./panel.module.css";

/**
 * Candidate Detail Side Panel — Seamless Spine
 *
 * Hierarchy:
 *   1. Candidate overview header (tightened, tag next to close button, details pushed up)
 *   2. 6-Milestone Hiring progress (Seamless Spine, 16px heading, 14px body descriptions)
 *   3. Notes (Recruiter & Employer)
 */
export default function VariantIntegratedSpine({
  detail,
  onClose,
}: {
  detail: CandidateDetail;
  onClose: () => void;
}) {
  return (
    <aside className={s.panel} aria-label={`Candidate details for ${detail.name}`}>
      {/* 1. Candidate overview header */}
      <CandidateOverviewHeader detail={detail} onClose={onClose} />

      <div className={s.scroll}>
        {/* 2. Hiring journey tracker (Seamless Spine) */}
        <section className={s.section} aria-label="Hiring progress">
          <HiringProgressTracker detail={detail} />
        </section>

        <hr className={s.divider} />

        {/* 3. Recruiter & employer notes */}
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
