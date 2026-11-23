import { useState, useCallback, useEffect } from "react";
import type { CandidateDetail } from "@/proto/candidate-panel/data";
import { Picker } from "./Picker";
import { ProgressSeamlessSpine } from "./ProgressSeamlessSpine";
import { ProgressPhaseSplit } from "./ProgressPhaseSplit";
import { ProgressFocusStepper } from "./ProgressFocusStepper";

export const PROGRESS_VARIANTS = [
  {
    name: "Seamless Spine",
    axis: "Linear Continuous Timeline",
    Comp: ProgressSeamlessSpine,
  },
  {
    name: "Phase Split",
    axis: "Two-Phase Operational Architecture",
    Comp: ProgressPhaseSplit,
  },
  {
    name: "Focus Stepper",
    axis: "Segmented Bar + Active Spotlight",
    Comp: ProgressFocusStepper,
  },
];

const getInitialVariant = () => {
  if (typeof window === "undefined") return 0;
  const p = new URLSearchParams(window.location.search).get("hp");
  const val = p ? parseInt(p, 10) : 1;
  return val >= 1 && val <= PROGRESS_VARIANTS.length ? val - 1 : 0;
};

export function HiringProgressPrototypeHarness({
  detail,
}: {
  detail: CandidateDetail;
}) {
  const [currentIdx, setCurrentIdx] = useState(getInitialVariant);

  const setVariant = useCallback((index: number) => {
    setCurrentIdx(index);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("hp", String(index + 1));
      window.history.replaceState(null, "", url.toString());
    }
  }, []);

  // Listen to popstate if user navigates back/forward
  useEffect(() => {
    const handlePopState = () => {
      setCurrentIdx(getInitialVariant());
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const ActiveComp = PROGRESS_VARIANTS[currentIdx].Comp;

  return (
    <>
      <ActiveComp key={currentIdx} detail={detail} />

      {/* Floating Dark Glass Picker from Emil Kowalski PICKER.md */}
      <Picker
        variants={PROGRESS_VARIANTS}
        current={currentIdx}
        onChange={setVariant}
      />
    </>
  );
}
