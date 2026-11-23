import { useState } from "react";
import { Toaster, toast } from "sonner";
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
import Variant3Popover from "./Variant3Popover";
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
    name: "1. Split Drawer (Sequential)",
    badge: "Approved Baseline",
    headline: "Two-stage right drawer with zero cognitive overload",
    description:
      "Stage 1 presents a clean claimed-roles list. Upon selecting a role, stage 2 slides directly into the full candidate submission form prefilled with the candidate's existing resume and contact info.",
    pros: ["Zero cognitive load", "Preserves full dealbreaker validation", "Familiar drawer pattern"],
    cons: ["Requires 2 sequential steps before submission"],
  },
  {
    name: "2. Quick-Match Sheet",
    badge: "Emil Kowalski Sheet",
    headline: "Centered modal sheet with spring physics & accordion criteria",
    description:
      "A quick-action modal inspired by Emil Kowalski's micro-interaction design: spring scale-up, top smart match score badge, expanding dealbreaker accordions, and 1-click submit without navigating away.",
    pros: ["Fastest single-role submit", "Accordion dealbreakers keep UI compact", "Satisfying micro-interactions"],
    cons: ["Less space for editing long candidate notes"],
  },
  {
    name: "3. In-Place Card Flyout",
    badge: "Contextual Popover",
    headline: "Flyout popover anchored directly to the candidate card",
    description:
      "Zero layout shift. Clicking 'Add another role' pops out a floating micro-panel directly from the candidate card footer. Recruiter picks the target role and confirms must-haves in a 2-step stepper right on the card.",
    pros: ["Zero background dimming or context switch", "Extremely lightweight", "Direct spatial relationship"],
    cons: ["Compact space requires condensed text"],
  },
  {
    name: "4. Multi-Role Batch",
    badge: "Syndicate Matrix",
    headline: "Multi-select syndicate submitting 1 candidate to N roles at once",
    description:
      "Recruiters can select multiple claimed roles simultaneously. Dynamically aggregates and de-duplicates must-have requirements into one consolidated checklist, with real-time bounty potential accumulation.",
    pros: ["10x recruiter velocity for versatile talent", "Real-time accumulated bounty calculation", "Consolidated dealbreaker checklist"],
    cons: ["Higher risk of accidental mismatch if not careful"],
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
  const [batchOpen, setBatchOpen] = useState(false);

  const meta = VARIANTS[currentIdx];

  const handleCardAction = () => {
    if (currentIdx === 0) setDrawerOpen(true);
    else if (currentIdx === 1) setSheetOpen(true);
    else if (currentIdx === 2) {
      // Handled internally inside Variant3Popover
    } else if (currentIdx === 3) setBatchOpen(true);
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
                    color: "var(--semantics-text-interactive, #4f46e5)",
                    background: "#eef2ff",
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

              {currentIdx !== 2 && (
                <button
                  type="button"
                  onClick={handleCardAction}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "8px 14px",
                    borderRadius: 8,
                    background: "var(--semantics-button-primary-background, #111827)",
                    color: "#fff",
                    fontSize: 13,
                    fontWeight: 500,
                    border: 0,
                    cursor: "pointer",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  }}
                >
                  <ArrowRightIcon size={14} />
                  Trigger Flow
                </button>
              )}
            </div>

            <p style={{ margin: "0 0 16px", fontSize: 14, color: "var(--semantics-text-secondary)", lineHeight: 1.5 }}>
              {meta.description}
            </p>

            <div style={{ display: "flex", gap: 32, fontSize: 13, borderTop: "1px solid #f1f5f9", paddingTop: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontWeight: 600, color: "#16a34a" }}>Key Pros:</span>
                <span style={{ color: "var(--semantics-text-secondary)" }}>{meta.pros.join(" · ")}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontWeight: 600, color: "#d97706" }}>Trade-off:</span>
                <span style={{ color: "var(--semantics-text-secondary)" }}>{meta.cons.join(" · ")}</span>
              </div>
            </div>
          </div>

          {/* Interactive Playground Section */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "var(--semantics-text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Interactive Track Card Demo
              </span>
              <span style={{ fontSize: 12, color: "var(--semantics-text-tertiary)" }}>
                Hover the card below and click <strong>"Add another role"</strong> to activate
              </span>
            </div>

            {/* Variant 1: Split Drawer */}
            {currentIdx === 0 && (
              <div>
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
                  onAction={() => setDrawerOpen(true)}
                  actionLabel="Add another role"
                />

                {drawerOpen && (
                  <div className={s.drawerBackdrop} onClick={() => setDrawerOpen(false)}>
                    <div className={s.drawerPanel} onClick={(e) => e.stopPropagation()}>
                      <Variant1Drawer
                        candidate={SAMPLE_CANDIDATE}
                        onComplete={(role, company) => {
                          toast.success(`Candidate submitted for ${role} at ${company}!`);
                          setDrawerOpen(false);
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Variant 2: Quick-Match Sheet */}
            {currentIdx === 1 && (
              <div>
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
                  onAction={() => setSheetOpen(true)}
                  actionLabel="Add another role"
                />

                {sheetOpen && (
                  <Variant2Sheet
                    candidate={SAMPLE_CANDIDATE}
                    onClose={() => setSheetOpen(false)}
                    onComplete={() => setSheetOpen(false)}
                  />
                )}
              </div>
            )}

            {/* Variant 3: In-Place Card Flyout Popover */}
            {currentIdx === 2 && (
              <div>
                <Variant3Popover
                  candidate={SAMPLE_CANDIDATE}
                  onComplete={(role, company) => {
                    toast.success(`Quick submitted for ${role} at ${company}!`);
                  }}
                />
              </div>
            )}

            {/* Variant 4: Multi-Role Batch Syndicate */}
            {currentIdx === 3 && (
              <div>
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
                  onAction={() => setBatchOpen(true)}
                  actionLabel="Batch add to roles"
                />

                {batchOpen && (
                  <div className={s.drawerBackdrop} onClick={() => setBatchOpen(false)}>
                    <div className={s.drawerPanel} onClick={(e) => e.stopPropagation()}>
                      <Variant4Batch
                        candidate={SAMPLE_CANDIDATE}
                        onClose={() => setBatchOpen(false)}
                        onComplete={() => setBatchOpen(false)}
                      />
                    </div>
                  </div>
                )}
              </div>
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
            setBatchOpen(false);
          }}
        />

        <Toaster position="top-right" duration={3000} />
      </main>
    </div>
  );
}
