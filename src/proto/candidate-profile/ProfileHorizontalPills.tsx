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
 * Variant 1 — Horizontal Pill TOC
 * Axis: Space-Saving Sticky Top Pill Bar + Full-Width Editorial Dossier
 *
 * Preserves 100% of the side panel's horizontal width while giving recruiters
 * 1-click jump navigation and live scroll-spy across all 8 resume sections.
 */
export function ProfileHorizontalPills({
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

  const pillRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  // Keep active pill visible inside the horizontal TOC rail as user scrolls
  useEffect(() => {
    const activeBtn = pillRefs.current[activeSection];
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
      <nav
        className={s.horizontalTocBar}
        aria-label="Candidate profile sections"
      >
        {PROFILE_TOC_SECTIONS.map((sec) => {
          const isActive = activeSection === sec.id;
          return (
            <button
              key={sec.id}
              ref={(el) => {
                pillRefs.current[sec.id] = el;
              }}
              type="button"
              className={`${s.tocPill} ${isActive ? s.tocPillActive : ""}`}
              aria-current={isActive ? "location" : undefined}
              onClick={() => scrollToSection(sec.id)}
            >
              <TocSectionIcon id={sec.id} />
              <span>{sec.label}</span>
            </button>
          );
        })}
      </nav>

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
