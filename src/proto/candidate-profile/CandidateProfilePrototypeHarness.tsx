import { useState, useCallback, useEffect } from "react";
import type { CandidateDetail } from "@/proto/candidate-panel/data";
import { Picker } from "@/proto/hiring-progress/Picker";
import { ProfileHorizontalPills } from "./ProfileHorizontalPills";
import { ProfileVerticalSidebar } from "./ProfileVerticalSidebar";
import { ProfileCompactSpine } from "./ProfileCompactSpine";
import { ProfileSegmentedCards } from "./ProfileSegmentedCards";

export const CANDIDATE_PROFILE_VARIANTS = [
  {
    name: "Horizontal Pill TOC",
    axis: "Space-Saving Sticky Top Pill Bar + Full-Width Editorial Dossier",
    Comp: ProfileHorizontalPills,
  },
  {
    name: "Left Sidebar TOC",
    axis: "2-Column Split (172px Vertical TOC Rail + Read-Only Form Boxes)",
    Comp: ProfileVerticalSidebar,
  },
  {
    name: "Compact Underline TOC",
    axis: "High-Density Sticky Underline Bar + Live Scroll Progress Line",
    Comp: ProfileCompactSpine,
  },
  {
    name: "Segmented Card TOC",
    axis: "Tinted Sticky Chip Strip + Contained Surface Cards per Section",
    Comp: ProfileSegmentedCards,
  },
];

const getInitialVariant = () => {
  if (typeof window === "undefined") return 0;
  const p = new URLSearchParams(window.location.search).get("cp");
  const val = p ? parseInt(p, 10) : 1;
  return val >= 1 && val <= CANDIDATE_PROFILE_VARIANTS.length ? val - 1 : 0;
};

export function CandidateProfilePrototypeHarness({
  detail,
}: {
  detail: CandidateDetail;
}) {
  const [currentIdx, setCurrentIdx] = useState(getInitialVariant);

  const setVariant = useCallback((index: number) => {
    setCurrentIdx(index);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("cp", String(index + 1));
      window.history.replaceState(null, "", url.toString());
    }
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentIdx(getInitialVariant());
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const ActiveComp = CANDIDATE_PROFILE_VARIANTS[currentIdx].Comp;

  return (
    <>
      <ActiveComp key={currentIdx} detail={detail} />

      {/* Floating Dark Glass Picker from Emil Kowalski PICKER.md */}
      <Picker
        variants={CANDIDATE_PROFILE_VARIANTS}
        current={currentIdx}
        onChange={setVariant}
      />
    </>
  );
}
