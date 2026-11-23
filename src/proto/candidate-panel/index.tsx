import { useCallback, useEffect, useRef, useState } from "react";
import { Toaster } from "sonner";
import { SideNavbar } from "@/components/shared/SideNavbar";
import { PageHeader } from "@/components/shared/PageHeader";
import { CandidateCard } from "@/components/recruiter/CandidateCard";
import {
  CandidateSortFilterBar,
  type CandidateFilterState,
} from "@/components/recruiter/CandidateSortFilterBar";
import shell from "@/preview/RecruiterShellPreview.module.css";
import logo from "@/components/shared/SideNavbar/assets/logo.svg";
import {
  BriefcaseBusinessIcon,
  CircleCheckBigIcon,
  UsersRoundIcon,
} from "@/components/shared/Icon";
import avatar from "@/components/shared/SideNavbar/assets/avatar-sample.png";
import { buildDetail, PANEL_CANDIDATES } from "./data";
import VariantIntegratedSpine from "./Variant3Conversation";

const nav = [
  { id: "explore", label: "Explore", icon: BriefcaseBusinessIcon },
  { id: "claimed", label: "Claimed", icon: CircleCheckBigIcon },
  { id: "track", label: "Track", icon: UsersRoundIcon },
];

const params = () => new URLSearchParams(location.search);

const initialCandidate = () => {
  const c = parseInt(params().get("c") ?? "", 10);
  return PANEL_CANDIDATES.some((x) => x.id === c) ? c : 1;
};

export default function CandidatePanelProto() {
  const [selectedId, setSelectedId] = useState<number | null>(initialCandidate);
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<CandidateFilterState>({ status: [], company: [] });
  const [sort, setSort] = useState("newest");
  const trigger = useRef<HTMLElement | null>(null);

  const setParam = (k: string, v: string | null) => {
    const url = new URL(location.href);
    if (v === null) url.searchParams.delete(k);
    else url.searchParams.set(k, v);
    history.replaceState(null, "", url);
  };

  const open = (id: number) => {
    trigger.current = document.activeElement as HTMLElement | null;
    setSelectedId(id);
    setParam("c", String(id));
  };

  const close = useCallback(() => {
    setSelectedId(null);
    setParam("c", null);
    trigger.current?.focus();
  }, []);

  useEffect(() => {
    if (selectedId === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [selectedId, close]);

  const visibleCandidates = PANEL_CANDIDATES.filter((c) => {
    const q = query.trim().toLowerCase();
    if (q) {
      const hit =
        c.name.toLowerCase().includes(q) ||
        c.company.toLowerCase().includes(q) ||
        c.role.toLowerCase().includes(q) ||
        c.location.toLowerCase().includes(q) ||
        c.status.toLowerCase().includes(q);
      if (!hit) return false;
    }
    if (filters.status.length > 0 && !filters.status.includes(c.status)) return false;
    if (filters.company.length > 0 && !filters.company.includes(c.company)) return false;
    return true;
  });

  const selected = PANEL_CANDIDATES.find((c) => c.id === selectedId) ?? null;
  const isSplit = selected !== null;

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

      <main className={`${shell.content} ${isSplit ? shell.contentSplit : ""}`}>
        <div className={shell.leftCol}>
          <PageHeader
            title="Track candidates"
            search={{
              placeholder: "Search by candidate, company, or role",
              value: query,
              onChange: setQuery,
            }}
          />
          <CandidateSortFilterBar
            filters={filters}
            onFiltersChange={setFilters}
            sort={sort}
            onSortChange={setSort}
          />
          <div className={shell.body}>
            <section className={`${shell.cards} ${isSplit ? shell.cardsColumn : ""}`}>
              {visibleCandidates.map((c) => (
                <CandidateCard
                  key={c.id}
                  className={c.id === selectedId ? shell.cardSelected : undefined}
                  candidateName={c.name}
                  roleTitle={c.role}
                  company={c.company}
                  initials={c.initials}
                  location={c.location}
                  experience={c.experience}
                  currentCtc={c.currentCtc}
                  expectedCtc={c.expectedCtc}
                  ctcRange={c.ctcRange}
                  noticePeriod={c.noticePeriod}
                  status={c.status}
                  commission={c.commission}
                  earningModel={c.earningModel}
                  linkedinUrl={`https://linkedin.com/in/${c.name.toLowerCase().replace(/\s+/g, "")}`}
                  githubUrl={c.github}
                  resumeUrl="#"
                  onClick={() => open(c.id)}
                />
              ))}
            </section>
          </div>
        </div>

        {selected && (
          <aside className={shell.detail}>
            <VariantIntegratedSpine key={selected.id} detail={buildDetail(selected)} onClose={close} />
          </aside>
        )}
      </main>

      <Toaster position="top-right" duration={3000} />
    </div>
  );
}
