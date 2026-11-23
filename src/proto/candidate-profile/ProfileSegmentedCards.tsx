import { useEffect, useRef } from "react";
import type { CandidateDetail } from "@/proto/candidate-panel/data";
import {
  buildCandidateProfile,
  PROFILE_TOC_SECTIONS,
} from "./profileData";
import {
  CandidateProfileSections,
  TocSectionIcon,
  useProfileScrollSpy,
} from "./ProfileShared";
import s from "./CandidateProfile.module.css";

/**
 * Variant 4 — Segmented Dossier Cards
 * Axis: Tinted Sticky Chip Strip + Contained Surface Cards per Resume Section
 *
 * Groups each resume section into its own elevated white surface card on a subtle
 * neutral canvas, paired with high-contrast filled brand pill chips at the top.
 */
export function ProfileSegmentedCards({
  detail,
}: {
  detail: CandidateDetail;
}) {
  const profile = buildCandidateProfile(detail);
  const {
    activeSection,
    scrollContainerRef,
    registerSection,
    scrollToSection,
  } = useProfileScrollSpy();

  const chipRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  useEffect(() => {
    const activeBtn = chipRefs.current[activeSection];
    if (activeBtn) {
      activeBtn.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [activeSection]);

  return (
    <div className={s.profileRoot}>
      <div className={s.segmentedBarWrap}>
        <nav
          className={s.segmentedTrack}
          aria-label="Candidate profile sections"
        >
          {PROFILE_TOC_SECTIONS.map((sec) => {
            const isActive = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                ref={(el) => {
                  chipRefs.current[sec.id] = el;
                }}
                type="button"
                className={`${s.segmentChip} ${
                  isActive ? s.segmentChipActive : ""
                }`}
                aria-current={isActive ? "location" : undefined}
                onClick={() => scrollToSection(sec.id)}
              >
                <TocSectionIcon id={sec.id} />
                <span>{sec.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div ref={scrollContainerRef} className={s.cardsScrollArea}>
        <CandidateProfileSections
          profile={profile}
          registerSection={registerSection}
          variant="cards"
        />
      </div>
    </div>
  );
}
