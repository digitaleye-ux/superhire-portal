import { useState } from "react";
import type { CandidateDetail } from "./data";
import { CandidateOverviewHeader, type CandidatePanelTab } from "./shared";
import { HiringProgressTracker } from "@/proto/hiring-progress/HiringProgressTracker";
import { NotesPrivateScratchpad } from "@/proto/recruiter-notes/NotesPrivateScratchpad";
import { CandidateProfilePrototypeHarness } from "@/proto/candidate-profile/CandidateProfilePrototypeHarness";
import s from "./panel.module.css";

/**
 * Candidate Detail Side Panel — Two-Tab Layout (matching JobDetail)
 *
 * Tabs:
 *   1. "Candidate status": 6-Milestone Hiring progress (Seamless Spine) + Private Recruiter notes
 *   2. "Candidate profile": Candidate Resume & Profile with TOC navigation (/emil-prototype exploration)
 */
export default function VariantIntegratedSpine({
  detail,
  onClose,
}: {
  detail: CandidateDetail;
  onClose: () => void;
}) {
  const [activeTab, setActiveTab] = useState<CandidatePanelTab>("status");

  return (
    <aside className={s.panel} aria-label={`Candidate details for ${detail.name}`}>
      {/* 1. Candidate overview header + Two Tabs (Candidate status | Candidate profile) */}
      <CandidateOverviewHeader
        detail={detail}
        onClose={onClose}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {activeTab === "status" ? (
        <div className={s.scroll} role="tabpanel" aria-label="Candidate status">
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
      ) : (
        <div
          className={s.profileTabPanel}
          role="tabpanel"
          aria-label="Candidate profile"
        >
          {/* [EMIL-PROTOTYPE: candidate-profile-toc] */}
          <CandidateProfilePrototypeHarness detail={detail} />
        </div>
      )}
    </aside>
  );
}
