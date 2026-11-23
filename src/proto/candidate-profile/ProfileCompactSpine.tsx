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
 * Variant 3 — Compact Underline Spine
 * Axis: High-Density Sticky Underline Jump Bar + Continuous Scroll Progress Hairline
 *
 * Ultra-low vertical footprint (38px) with compact labels and a live scroll progress
 * bar so recruiters can jump between sections with maximum reading area.
 */
export function ProfileCompactSpine({
  detail,
}: {
  detail: CandidateDetail;
}) {
  const profile = buildCandidateProfile(detail);
  const {
    activeSection,
    scrollProgress,
    scrollContainerRef,
    registerSection,
    scrollToSection,
  } = useProfileScrollSpy();

  const itemRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  useEffect(() => {
    const activeBtn = itemRefs.current[activeSection];
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
      <div className={s.spineBarWrap}>
        <nav className={s.spineBar} aria-label="Candidate profile sections">
          {PROFILE_TOC_SECTIONS.map((sec) => {
            const isActive = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                ref={(el) => {
                  itemRefs.current[sec.id] = el;
                }}
                type="button"
                className={`${s.spineTab} ${isActive ? s.spineTabActive : ""}`}
                aria-current={isActive ? "location" : undefined}
                onClick={() => scrollToSection(sec.id)}
              >
                <TocSectionIcon id={sec.id} />
                <span>{sec.shortLabel}</span>
              </button>
            );
          })}
        </nav>
        <div className={s.spineProgressTrack} aria-hidden="true">
          <div
            className={s.spineProgressFill}
            style={{ transform: `scaleX(${scrollProgress})` }}
          />
        </div>
      </div>

      <div ref={scrollContainerRef} className={s.tocScrollArea}>
        <CandidateProfileSections
          profile={profile}
          registerSection={registerSection}
          variant="editorial"
        />
      </div>
    </div>
  );
}
