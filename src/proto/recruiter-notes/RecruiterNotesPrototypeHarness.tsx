import { useState, useCallback, useEffect } from "react";
import type { CandidateDetail } from "@/proto/candidate-panel/data";
import { Picker } from "@/proto/hiring-progress/Picker";
import { NotesQuietStream } from "./NotesQuietStream";
import { NotesPrivateScratchpad } from "./NotesPrivateScratchpad";
import { NotesGuidedCards } from "./NotesGuidedCards";

export const RECRUITER_NOTES_VARIANTS = [
  {
    name: "Quiet Stream",
    axis: "Borderless Typographic List + Progressive Bottom Trigger",
    Comp: NotesQuietStream,
  },
  {
    name: "Private Scratchpad",
    axis: "Tinted Dossier Surface + Always-Ready Quick Input",
    Comp: NotesPrivateScratchpad,
  },
  {
    name: "Guided Cards",
    axis: "Contained Note Cards + 1-Click Starter Prompt Chips",
    Comp: NotesGuidedCards,
  },
];

const getInitialVariant = () => {
  if (typeof window === "undefined") return 0;
  const p = new URLSearchParams(window.location.search).get("rn");
  const val = p ? parseInt(p, 10) : 1;
  return val >= 1 && val <= RECRUITER_NOTES_VARIANTS.length ? val - 1 : 0;
};

export function RecruiterNotesPrototypeHarness({
  detail,
}: {
  detail: CandidateDetail;
}) {
  const [currentIdx, setCurrentIdx] = useState(getInitialVariant);

  const setVariant = useCallback((index: number) => {
    setCurrentIdx(index);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("rn", String(index + 1));
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

  const ActiveComp = RECRUITER_NOTES_VARIANTS[currentIdx].Comp;

  return (
    <>
      <ActiveComp key={currentIdx} detail={detail} />

      {/* Floating Dark Glass Picker from Emil Kowalski PICKER.md */}
      <Picker
        variants={RECRUITER_NOTES_VARIANTS}
        current={currentIdx}
        onChange={setVariant}
      />
    </>
  );
}
