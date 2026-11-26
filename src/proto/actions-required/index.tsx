import { useState } from "react";
import { toast } from "sonner";
import { BASE_ACTIONS_REQUIRED } from "@/components/recruiter/RecruiterDashboard/RecruiterDashboard.data";
import type { ActionRequiredItem } from "@/components/recruiter/RecruiterDashboard/RecruiterDashboard.types";
import { ActionsRequiredPrototypeHarness } from "./ActionsRequiredPrototypeHarness";
import "@/index.css";

export default function ActionsRequiredProtoStandalone() {
  const [actions, setActions] = useState<ActionRequiredItem[]>(BASE_ACTIONS_REQUIRED);

  const handleEditCandidate = (candidateId: number, reasonLabel?: string) => {
    const act = actions.find((a) => a.candidateId === candidateId);
    toast.success(`Opening edit drawer for ${act?.candidateName || "Candidate"}`, {
      description: reasonLabel || act?.title || "Resolving vetting requirement",
    });
  };

  const handleDismissAction = (actionId: string) => {
    const act = actions.find((a) => a.id === actionId);
    setActions((prev) => prev.filter((a) => a.id !== actionId));
    toast.info(`Marked "${act?.badgeLabel}" as resolved`, {
      description: `${act?.candidateName} (${act?.company}) moved forward`,
    });
  };

  const handleReset = () => {
    setActions(BASE_ACTIONS_REQUIRED);
    toast.info("Mock actions reset to initial state");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--semantics-surface-page)",
        padding: "48px 24px 120px 24px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div style={{ width: "100%", maxWidth: 1040, display: "flex", flexDirection: "column", gap: 32 }}>
        {/* Prototype Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  padding: "2px 8px",
                  borderRadius: 999,
                  background: "var(--semantics-badge-spotlight-bg)",
                  color: "var(--semantics-badge-spotlight-text)",
                  border: "1px solid var(--semantics-badge-spotlight-border)",
                }}
              >
                Emil Kowalski Craft Prototype
              </span>
              <span style={{ fontSize: 13, color: "var(--semantics-text-tertiary)" }}>
                Use 1–4 keys or bottom floating dock to switch
              </span>
            </div>
            <h1
              style={{
                fontSize: 24,
                fontWeight: 600,
                color: "var(--semantics-text-primary)",
                margin: 0,
              }}
            >
              Action Required Variations
            </h1>
          </div>

          {actions.length < BASE_ACTIONS_REQUIRED.length && (
            <button
              type="button"
              onClick={handleReset}
              style={{
                padding: "6px 12px",
                borderRadius: 6,
                border: "1px solid var(--semantics-border-default)",
                background: "var(--semantics-surface-primary)",
                color: "var(--semantics-text-primary)",
                fontSize: 13,
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              Reset dismissed actions
            </button>
          )}
        </div>

        {/* Prototype Harness */}
        <main style={{ width: "100%" }}>
          <ActionsRequiredPrototypeHarness
            actions={actions}
            onEditCandidate={handleEditCandidate}
            onDismissAction={handleDismissAction}
            showPicker={true}
          />
        </main>
      </div>
    </div>
  );
}
