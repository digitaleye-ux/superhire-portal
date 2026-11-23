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
 * Variant 2 — Vertical Left Sidebar TOC
 * Axis: 2-Column Split (172px Sticky Left Sidebar + Read-Only Form & Resume Stream)
 *
 * Mirrors the uploaded reference screenshot: a dedicated vertical TOC rail on the left
 * with soft purple active pills, paired with read-only field boxes and resume card on the right.
 */
export function ProfileVerticalSidebar({
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

  return (
    <div className={s.splitRoot}>
      <aside
        className={s.verticalSidebar}
        aria-label="Candidate profile table of contents"
      >
        <div className={s.sidebarHeader}>
          <h4 className={s.sidebarTitle}>Resume</h4>
          <p className={s.sidebarSubtitle}>
            Candidate profile shared for employer review
          </p>
        </div>

        <nav className={s.sidebarNav} aria-label="Profile sections">
          {PROFILE_TOC_SECTIONS.map((sec) => {
            const isActive = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                type="button"
                className={`${s.sidebarItem} ${
                  isActive ? s.sidebarItemActive : ""
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
      </aside>

      <div ref={scrollContainerRef} className={s.splitContentScroll}>
        <CandidateProfileSections
          profile={profile}
          registerSection={registerSection}
          variant="form-readonly"
        />
      </div>
    </div>
  );
}
