import { useState } from "react";
import type { ActionsRequiredVariantProps } from "./ActionsRequiredVariants.types";
import { ArrowRightIcon, CheckIcon } from "@/components/shared/Icon";
import { AlertTriangle, ChevronRight, X } from "lucide-react";
import s from "./ActionsRequiredVariants.module.css";

/**
 * VARIANT 4: Compact Banner
 * Axis: Collapsible Notice - Minimalist Alert Bar
 * Takes minimal vertical footprint. Surfaces urgent count badge and inline clickable
 * candidate chips. Clicking a chip expands an immediate inline resolution drawer.
 */
export function Variant4CompactBanner({
  actions,
  onEditCandidate,
  onDismissAction,
}: ActionsRequiredVariantProps) {
  const [selectedId, setSelectedId] = useState<string | null>(actions[0]?.id ?? null);

  if (actions.length === 0) return null;

  const activeAction = actions.find((a) => a.id === selectedId) || null;

  return (
    <div className={s.sectionRoot}>
      <div className={s.v4BannerRoot}>
        <div className={s.v4Bar}>
          <div className={s.v4Left}>
            <div className={s.v4LabelGroup}>
              <div className={s.v4WarningIconBadge}>
                <AlertTriangle size={13} />
              </div>
              <span className={s.v4Heading}>Action required</span>
              <span className={s.countPill}>{actions.length}</span>
            </div>

            <div className={s.v4ChipsGroup}>
              {actions.map((act) => {
                const isActive = activeAction?.id === act.id;
                return (
                  <button
                    key={act.id}
                    type="button"
                    className={s.v4Chip}
                    data-active={isActive ? "true" : undefined}
                    onClick={() => setSelectedId(isActive ? null : act.id)}
                  >
                    <span className={s.v4ChipAvatar}>{act.initials}</span>
                    <span>{act.candidateName}</span>
                    <span style={{ opacity: 0.6 }}>· {act.company}</span>
                    <span className={s.v4ChipIssue}>({act.badgeLabel})</span>
                    <ChevronRight size={12} style={{ opacity: 0.6 }} />
                  </button>
                );
              })}
            </div>
          </div>

          <span style={{ fontSize: 12, color: "var(--semantics-text-tertiary)" }}>
            Select an item to resolve
          </span>
        </div>

        {/* Expanded Drawer for Selected Action */}
        {activeAction && (
          <div className={s.v4ExpandedDrawer}>
            <div className={s.v4DrawerContent}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span className={s.v4DrawerTitle}>
                  {activeAction.candidateName} — {activeAction.roleTitle} ({activeAction.company})
                </span>
                <span style={{ fontSize: 11, color: "var(--semantics-text-tertiary)" }}>
                  {activeAction.requestedAt}
                </span>
              </div>
              <p className={s.v4DrawerDesc}>{activeAction.description}</p>
            </div>

            <div className={s.v4DrawerActions}>
              <button
                type="button"
                className={s.btnPrimary}
                onClick={() => onEditCandidate(activeAction.candidateId, activeAction.title)}
              >
                <span>{activeAction.ctaLabel}</span>
                <ArrowRightIcon size="sm" />
              </button>

              <button
                type="button"
                className={s.btnSecondary}
                onClick={() => {
                  onDismissAction(activeAction.id);
                  setSelectedId(null);
                }}
              >
                <CheckIcon size="sm" />
                <span>Mark done</span>
              </button>

              <button
                type="button"
                className={s.btnSecondary}
                style={{ padding: "6px 8px" }}
                onClick={() => setSelectedId(null)}
                aria-label="Collapse drawer"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export default Variant4CompactBanner;
