import type { CandidateDetail } from "./data";
import { CandidateOverviewHeader } from "./shared";
import { HiringProgressTracker } from "@/proto/hiring-progress/HiringProgressTracker";
import { NotesPrivateScratchpad } from "@/proto/recruiter-notes/NotesPrivateScratchpad";
import s from "./panel.module.css";

/**
 * Candidate Detail Side Panel — Seamless Spine + Private Scratchpad Recruiter Notes
 *
 * Hierarchy:
 *   1. Candidate overview header
 *   2. 6-Milestone Hiring progress (Seamless Spine)
 *   3. Private Recruiter notes (Scratchpad)
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

        {/* 3. Private Recruiter notes (Scratchpad) */}
        <section className={s.section} aria-label="Recruiter notes">
          <NotesPrivateScratchpad detail={detail} />
        </section>
      </div>
    </aside>
  );
}
