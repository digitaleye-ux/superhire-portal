import { useState } from "react";
import { Toaster } from "sonner";
import { SideNavbar } from "@/components/shared/SideNavbar";
import { PageHeader } from "@/components/shared/PageHeader";
import { CandidateCard } from "@/components/recruiter/CandidateCard";
import {
  ArrowRightIcon,
  BriefcaseBusinessIcon,
  CircleCheckBigIcon,
  UsersRoundIcon,
} from "@/components/shared/Icon";
import avatar from "@/components/shared/SideNavbar/assets/avatar-sample.png";
import logo from "@/components/shared/SideNavbar/assets/logo.svg";
import { Picker } from "../submit-form/Picker";
import { SAMPLE_CANDIDATE } from "./data";
import s from "./variants.module.css";
import Variant1Drawer from "./Variant1Drawer";
import Variant2Sheet from "./Variant2Sheet";
import Variant3Diff from "./Variant3Diff";
import Variant4Batch from "./Variant4Batch";

interface VariantMeta {
  name: string;
  badge: string;
  headline: string;
  description: string;
  pros: string[];
  cons: string[];
}

const VARIANTS: VariantMeta[] = [
  {
    name: "1. Standard Split Drawer",
    badge: "Production Standard",
    headline: "Two-stage right drawer with candidate context and search",
    description:
      "Stage 1 presents candidate identity context alongside a scannable list of claimed roles with live search. Selecting a role slides into the prefilled submission form.",
    pros: ["Familiar drawer pattern", "Zero cognitive overload", "Retains candidate context"],
    cons: ["Requires 2 sequential steps before submission"],
  },
  {
    name: "2. Compact Modal Sheet",
    badge: "Centered Dialog",
    headline: "Centered modal sheet with inline dealbreakers",
    description:
      "Quick-action modal dialog with instant search, inline expandable dealbreaker checklist, and 1-click submit without navigating to a second screen.",
    pros: ["Fastest single-role submit", "Inline dealbreakers keep UI compact", "No page context switch"],
    cons: ["Less space for editing custom candidate notes"],
  },
  {
    name: "3. Requirement Comparison",
    badge: "Inline Diff",
    headline: "Side-by-side qualification comparison and quick pitch",
    description:
      "Compares candidate qualifications against role requirements in-place, allowing recruiters to confirm criteria and attach an optional pitch note in 1 step.",
    pros: ["1-step submission", "Clear qualification alignment", "Attach recruiter pitch note"],
    cons: ["Higher information density"],
  },
  {
    name: "4. Multi-Role Batch",
    badge: "Batch Syndicate",
    headline: "Select and submit candidate to multiple roles at once",
    description:
      "Recruiters can select multiple claimed roles simultaneously. Consolidates must-have requirements into one checklist with real-time bounty total.",
    pros: ["High recruiter velocity", "Total bounty calculation", "Consolidated dealbreaker checklist"],
    cons: ["Requires verifying requirements across multiple roles"],
  },
];

const NAV_ITEMS = [
  { id: "explore", label: "Explore", icon: BriefcaseBusinessIcon },
  { id: "claimed", label: "Claimed", icon: CircleCheckBigIcon },
  { id: "track", label: "Track", icon: UsersRoundIcon },
];

export default function AddAnotherRolePrototypes() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [diffOpen, setDiffOpen] = useState(false);
  const [batchOpen, setBatchOpen] = useState(false);

  const meta = VARIANTS[currentIdx];

  const handleCardAction = () => {
    if (currentIdx === 0) setDrawerOpen(true);
    else if (currentIdx === 1) setSheetOpen(true);
    else if (currentIdx === 2) setDiffOpen(true);
    else if (currentIdx === 3) setBatchOpen(true);
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc" }}>
      {/* Side Navigation */}
      <SideNavbar
        logo={logo}
        items={NAV_ITEMS}
        activeId="track"
        onSelect={() => {}}
        user={{
          name: "Ashik T",
          avatarUrl: avatar,
        }}
      />

      {/* Main Container */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflowY: "auto" }}>
        <PageHeader
          title="Add Another Role Prototypes"
          actions={
            <div style={{ fontSize: 13, color: "var(--semantics-text-secondary)" }}>
              Use <kbd style={{ padding: "2px 6px", background: "#e2e8f0", borderRadius: 4 }}>1</kbd>–
              <kbd style={{ padding: "2px 6px", background: "#e2e8f0", borderRadius: 4 }}>4</kbd> keys to switch variants
            </div>
          }
        />

        <div style={{ padding: "24px 32px 100px", maxWidth: 1200, width: "100%", margin: "0 auto", boxSizing: "border-box" }}>
          {/* Paradigm Explanation Header Card */}
          <div
            style={{
              background: "#fff",
              border: "1px solid var(--semantics-border-default)",
              borderRadius: 12,
              padding: "20px 24px",
              marginBottom: 24,
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    color: "var(--semantics-text-brand)",
                    background: "var(--semantics-surface-brand-subtle)",
                    padding: "3px 8px",
                    borderRadius: 6,
                  }}
                >
                  {meta.badge}
                </span>
                <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: "var(--semantics-text-primary)" }}>
                  {meta.headline}
                </h2>
              </div>

              <button
                type="button"
                onClick={handleCardAction}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "8px 14px",
                  borderRadius: 8,
                  background: "var(--button-primary-background)",
                  color: "#fff",
                  fontSize: 13,
                  fontWeight: 500,
                  border: 0,
                  cursor: "pointer",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                <ArrowRightIcon size="sm" />
                <span>Trigger Flow</span>
              </button>
            </div>

            <p style={{ margin: "0 0 16px", fontSize: 14, color: "var(--semantics-text-secondary)", lineHeight: 1.5 }}>
              {meta.description}
            </p>

            <div style={{ display: "flex", gap: 24, fontSize: 13, borderTop: "1px solid var(--semantics-border-default)", paddingTop: 12 }}>
              <div>
                <strong style={{ color: "var(--semantics-text-success, #16a34a)" }}>Key Pros:</strong>{" "}
                <span style={{ color: "var(--semantics-text-secondary)" }}>{meta.pros.join(" · ")}</span>
              </div>
              <div>
                <strong style={{ color: "var(--semantics-text-warning, #d97706)" }}>Trade-off:</strong>{" "}
                <span style={{ color: "var(--semantics-text-secondary)" }}>{meta.cons.join(" · ")}</span>
              </div>
            </div>
          </div>

          {/* Interactive Candidate Card Context */}
          <div
            style={{
              background: "#fff",
              border: "1px solid var(--semantics-border-default)",
              borderRadius: 12,
              padding: 24,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <div>
                <span style={{ fontSize: 14, fontWeight: 600, color: "var(--semantics-text-primary)" }}>
                  Interactive Track Card Demo
                </span>
                <span style={{ display: "block", fontSize: 12, color: "var(--semantics-text-tertiary)" }}>
                  Click <strong>"Add another role →"</strong> on the candidate card below to test the current flow.
                </span>
              </div>
            </div>

            {/* Candidate Card Triggering Active Variant */}
            <CandidateCard
              candidateName={SAMPLE_CANDIDATE.name}
              roleTitle={SAMPLE_CANDIDATE.role}
              company={SAMPLE_CANDIDATE.company}
              experience={SAMPLE_CANDIDATE.experience}
              noticePeriod={SAMPLE_CANDIDATE.noticePeriod}
              location={SAMPLE_CANDIDATE.location}
              currentCtc={SAMPLE_CANDIDATE.currentCtc}
              expectedCtc={SAMPLE_CANDIDATE.expectedCtc}
              status={SAMPLE_CANDIDATE.status}
              commission={SAMPLE_CANDIDATE.commission}
              onAction={handleCardAction}
              actionLabel={currentIdx === 3 ? "Batch add to roles" : "Add another role"}
            />

            {/* Variant 1: Executive Dossier Drawer */}
            {currentIdx === 0 && drawerOpen && (
              <div className={s.drawerBackdrop} onClick={() => setDrawerOpen(false)}>
                <div className={s.drawerPanel} onClick={(e) => e.stopPropagation()}>
                  <Variant1Drawer
                    candidate={SAMPLE_CANDIDATE}
                    onComplete={() => setDrawerOpen(false)}
                  />
                </div>
              </div>
            )}

            {/* Variant 2: Quick-Match Command Sheet */}
            {currentIdx === 1 && sheetOpen && (
              <Variant2Sheet
                candidate={SAMPLE_CANDIDATE}
                onClose={() => setSheetOpen(false)}
                onComplete={() => setSheetOpen(false)}
              />
            )}

            {/* Variant 3: Requirement Diff & Quick Pitch */}
            {currentIdx === 2 && diffOpen && (
              <Variant3Diff
                candidate={SAMPLE_CANDIDATE}
                onClose={() => setDiffOpen(false)}
                onComplete={() => setDiffOpen(false)}
              />
            )}

            {/* Variant 4: Multi-Role Batch Syndicate */}
            {currentIdx === 3 && batchOpen && (
              <Variant4Batch
                candidate={SAMPLE_CANDIDATE}
                onClose={() => setBatchOpen(false)}
                onComplete={() => setBatchOpen(false)}
              />
            )}
          </div>
        </div>

        {/* Emil-style Floating Switcher Bar */}
        <Picker
          names={VARIANTS.map((v) => v.name)}
          current={currentIdx}
          onChange={(idx) => {
            setCurrentIdx(idx);
            setDrawerOpen(false);
            setSheetOpen(false);
            setDiffOpen(false);
            setBatchOpen(false);
          }}
        />

        <Toaster position="top-right" duration={3000} />
      </main>
    </div>
  );
}
