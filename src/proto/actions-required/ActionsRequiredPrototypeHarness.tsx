import { useEffect, useState } from "react";
import type { ActionRequiredItem } from "@/components/recruiter/RecruiterDashboard/RecruiterDashboard.types";
import { Picker } from "./Picker";
import { Variant1RefinedCards } from "./Variant1RefinedCards";
import { Variant2InboxStack } from "./Variant2InboxStack";
import { Variant3SplitCallout } from "./Variant3SplitCallout";
import { Variant4CompactBanner } from "./Variant4CompactBanner";

export interface ActionsRequiredHarnessProps {
  actions: ActionRequiredItem[];
  onEditCandidate: (candidateId: number, reasonLabel?: string) => void;
  onDismissAction: (actionId: string) => void;
  /** Whether to show the floating picker. Defaults to true in dev */
  showPicker?: boolean;
}

const VARIANTS = [
  { name: "Refined Cards", axis: "Clean Elevated Cards" },
  { name: "Inbox Stack", axis: "Streamlined Task Queue" },
  { name: "Split Callout", axis: "Contextual Resolution Bay" },
  { name: "Compact Banner", axis: "Minimal Alert Bar" },
];

/**
 * Harness for the 4 Emil Kowalski Action Required prototypes.
 * Synchronizes with URL query param `?act=1..4` and keyboard shortcuts (1-4, Left/Right).
 */
export function ActionsRequiredPrototypeHarness({
  actions,
  onEditCandidate,
  onDismissAction,
  showPicker = true,
}: ActionsRequiredHarnessProps) {
  const [index, setIndex] = useState<number>(() => {
    if (typeof window === "undefined") return 0;
    const param = new URLSearchParams(window.location.search).get("act");
    const parsed = param ? parseInt(param, 10) - 1 : 0;
    return parsed >= 0 && parsed < VARIANTS.length ? parsed : 0;
  });

  const handleChange = (newIndex: number) => {
    setIndex(newIndex);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("act", String(newIndex + 1));
      window.history.replaceState({}, "", url.toString());
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      const param = new URLSearchParams(window.location.search).get("act");
      const parsed = param ? parseInt(param, 10) - 1 : 0;
      if (parsed >= 0 && parsed < VARIANTS.length) {
        setIndex(parsed);
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  return (
    <>
      {index === 0 && (
        <Variant1RefinedCards
          actions={actions}
          onEditCandidate={onEditCandidate}
          onDismissAction={onDismissAction}
        />
      )}
      {index === 1 && (
        <Variant2InboxStack
          actions={actions}
          onEditCandidate={onEditCandidate}
          onDismissAction={onDismissAction}
        />
      )}
      {index === 2 && (
        <Variant3SplitCallout
          actions={actions}
          onEditCandidate={onEditCandidate}
          onDismissAction={onDismissAction}
        />
      )}
      {index === 3 && (
        <Variant4CompactBanner
          actions={actions}
          onEditCandidate={onEditCandidate}
          onDismissAction={onDismissAction}
        />
      )}

      {showPicker && (
        <Picker
          variants={VARIANTS}
          current={index}
          onChange={handleChange}
        />
      )}
    </>
  );
}
export default ActionsRequiredPrototypeHarness;
