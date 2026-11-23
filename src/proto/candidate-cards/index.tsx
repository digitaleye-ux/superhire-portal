import { useCallback, useState } from "react";
import { toast } from "sonner";
import { SideNavbar } from "@/components/shared/SideNavbar";
import { PageHeader } from "@/components/shared/PageHeader";
import shell from "@/preview/RecruiterShellPreview.module.css";
import logo from "@/components/shared/SideNavbar/assets/logo.svg";
import {
  BriefcaseBusinessIcon,
  CircleCheckBigIcon,
  UsersRoundIcon,
} from "@/components/shared/Icon";
import avatar from "@/components/shared/SideNavbar/assets/avatar-sample.png";
import { Picker } from "@/proto/submit-form/Picker";
import { DUMMY_CANDIDATE_ITEMS } from "./data";
import Variant1Identity from "./Variant1Identity";
import Variant2Earnings from "./Variant2Earnings";
import Variant3Velocity from "./Variant3Velocity";
import Variant4Evaluation from "./Variant4Evaluation";

export const CANDIDATE_VARIANTS = [
  {
    id: "applied-subtitle",
    name: "1. 'for Role' 2-Line Title (Selected)",
    badge: "Selected Design",
    description:
      "Header has Company Logo + Name & Status Tag. In the 2-line title area: Line 1 is Candidate Name (16px), Line 2 explicitly states 'for Role Title' (14px). Eliminates any ambiguity about where they work!",
    structure: "Header: [Logo] Company + Status | Title: Candidate Name + 'for Role' | Meta: Exp · Notice · Loc",
    Comp: Variant2Earnings,
  },
  {
    id: "strict-twin",
    name: "2. Role in Meta (1:1 Twin)",
    badge: "Strict JobCard Layout",
    description:
      "Exact 1:1 match to Explore/Claimed JobCard. Header has Company Logo + Name & Status Tag. Title is Candidate Name. Meta description holds: Role · Experience · Notice · Location.",
    structure: "Header: [Logo] Company + Status | Title: Candidate Name | Meta: Role · Exp · Notice · Loc",
    Comp: Variant1Identity,
  },
  {
    id: "role-hero",
    name: "3. Role as Hero",
    badge: "Role-Anchored",
    description:
      "Header has Company Logo + Name & Status Tag. The Role Title is the 16px hero title (matching Claimed roles), with Candidate Name prominently featured in the meta row.",
    structure: "Header: [Logo] Company + Status | Title: Role Title | Meta: Candidate Name · Exp · Notice",
    Comp: Variant3Velocity,
  },
  {
    id: "role-icon-meta",
    name: "4. Role with Icon in Meta",
    badge: "Briefcase Icon Meta",
    description:
      "Header has Company Logo + Name & Status Tag. Candidate Name is the 16px hero title. Meta description leads with the target Role Title (with briefcase icon), followed by Notice & Location.",
    structure: "Header: [Logo] Company + Status | Title: Candidate Name | Meta: [Icon] Role · Notice · Loc",
    Comp: Variant4Evaluation,
  },
];

const nav = [
  { id: "explore", label: "Explore", icon: BriefcaseBusinessIcon },
  { id: "claimed", label: "Claimed", icon: CircleCheckBigIcon },
  { id: "track", label: "Track", icon: UsersRoundIcon },
];

const initial = () => {
  const v = parseInt(new URLSearchParams(location.search).get("v") ?? "", 10);
  return v >= 1 && v <= CANDIDATE_VARIANTS.length ? v - 1 : 0;
};

export default function CandidateCardsProto() {
  const [current, setCurrent] = useState(initial);
  const [query, setQuery] = useState("");
  const [isCompareMode, setIsCompareMode] = useState(false);

  const change = useCallback((i: number) => {
    setCurrent(i);
    const url = new URL(location.href);
    url.searchParams.set("v", String(i + 1));
    history.replaceState(null, "", url);
  }, []);

  const variant = CANDIDATE_VARIANTS[current];
  const { Comp } = variant;

  const filtered = DUMMY_CANDIDATE_ITEMS.filter((c) => {
    const q = query.trim().toLowerCase();
    return (
      !q ||
      c.name.toLowerCase().includes(q) ||
      c.company.toLowerCase().includes(q) ||
      c.role.toLowerCase().includes(q) ||
      c.status.toLowerCase().includes(q)
    );
  });

  const handleAction = (name: string, role: string) => {
    toast.success(`Add another role triggered for ${name}`, {
      description: `Opens candidate submission drawer for ${role}.`,
    });
  };

  return (
    <div className={shell.shell}>
      <SideNavbar
        logo={logo}
        items={nav}
        footerItems={[]}
        activeId="track"
        onSelect={(id) => {
          if (id !== "track") {
            const url = new URL(location.href);
            url.searchParams.delete("proto");
            url.searchParams.set("tab", id);
            location.href = url.toString();
          }
        }}
        user={{ avatarUrl: avatar, name: "Aisha Khan" }}
      />

      <main className={shell.content}>
        <div className={shell.leftCol}>
          <PageHeader
            title="Track candidates"
            search={{
              placeholder: "Search by candidate, company, role, or status",
              value: query,
              onChange: setQuery,
            }}
          />

          {/* Prototype Guidance & Spec Bar */}
          <div
            style={{
              padding: "16px 32px 0 32px",
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 16px",
                background: "var(--semantics-surface-secondary)",
                border: "1px solid var(--semantics-border-default)",
                borderRadius: "var(--radius-md)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span
                  style={{
                    padding: "2px 8px",
                    background: "var(--semantics-badge-spotlight-bg)",
                    color: "var(--semantics-badge-spotlight-text)",
                    borderRadius: "var(--radius-pill)",
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  {variant.badge}
                </span>
                <span
                  style={{
                    fontSize: 13,
                    color: "var(--semantics-text-secondary)",
                    lineHeight: 1.4,
                  }}
                >
                  <strong>{variant.name}:</strong> {variant.description}
                </span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <button
                  type="button"
                  onClick={() => setIsCompareMode((prev) => !prev)}
                  style={{
                    padding: "6px 12px",
                    background: isCompareMode
                      ? "var(--semantics-surface-brand-subtle)"
                      : "var(--semantics-surface-primary)",
                    border: `1px solid ${isCompareMode
                        ? "var(--semantics-border-interactive)"
                        : "var(--semantics-border-strong)"
                      }`,
                    borderRadius: "var(--radius-md)",
                    fontSize: 13,
                    fontWeight: 500,
                    color: isCompareMode
                      ? "var(--semantics-text-link)"
                      : "var(--semantics-text-primary)",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                  }}
                >
                  {isCompareMode ? "Exit Side-by-Side" : "Compare 4 Variants"}
                </button>
              </div>
            </div>
          </div>

          <div className={shell.body} style={{ paddingTop: 20 }}>
            {isCompareMode ? (
              /* Side-by-Side Comparison across all 4 variants */
              <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <h3
                    style={{
                      margin: 0,
                      fontSize: 16,
                      fontWeight: 600,
                      color: "var(--semantics-text-primary)",
                    }}
                  >
                    Side-by-Side Spec Comparison — Company Header Preserved
                  </h3>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 13,
                      color: "var(--semantics-text-tertiary)",
                    }}
                  >
                    Every variant has Company Logo + Status Tag in the Header, hand-coins commission in the Footer, and exactly 191px height.
                  </p>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                    gap: 16,
                  }}
                >
                  {CANDIDATE_VARIANTS.map((v) => {
                    const SingleComp = v.Comp;
                    return (
                      <div
                        key={v.id}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 10,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <span
                            style={{
                              fontSize: 13,
                              fontWeight: 600,
                              color: "var(--semantics-text-primary)",
                            }}
                          >
                            {v.name}
                          </span>
                          <span
                            style={{
                              fontSize: 11,
                              padding: "2px 6px",
                              borderRadius: "var(--radius-pill)",
                              background: "var(--semantics-badge-neutral-bg)",
                              color: "var(--semantics-badge-neutral-text)",
                            }}
                          >
                            {v.badge}
                          </span>
                        </div>
                        <SingleComp
                          candidate={DUMMY_CANDIDATE_ITEMS[0]}
                          onAction={() =>
                            handleAction(
                              DUMMY_CANDIDATE_ITEMS[0].name,
                              DUMMY_CANDIDATE_ITEMS[0].role
                            )
                          }
                        />
                        <div
                          style={{
                            fontSize: 12,
                            color: "var(--semantics-text-tertiary)",
                            lineHeight: 1.4,
                          }}
                        >
                          <div>
                            <span style={{ color: "var(--semantics-text-link)" }}>
                              Anatomy:
                            </span>{" "}
                            {v.structure}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* Full Grid of candidates for currently selected variant */
              <section className={shell.cards}>
                {filtered.map((candidate) => (
                  <Comp
                    key={candidate.id}
                    candidate={candidate}
                    onAction={() => handleAction(candidate.name, candidate.role)}
                  />
                ))}
              </section>
            )}
          </div>
        </div>
      </main>

      {/* Emil Kowalski Floating Switcher Pill */}
      <Picker
        names={CANDIDATE_VARIANTS.map((x) => x.name)}
        current={current}
        onChange={change}
      />
    </div>
  );
}
