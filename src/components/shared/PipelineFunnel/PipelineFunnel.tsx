import React from "react";
import { ArrowRightIcon } from "@/components/shared/Icon";
import type {
  PipelineFunnelProps,
  PipelineFunnelStage,
  PipelineFunnelFooterItem,
} from "./PipelineFunnel.types";
import styles from "./PipelineFunnel.module.css";

export const PipelineFunnel: React.FC<PipelineFunnelProps> = ({
  stages,
  selectedStageId,
  onStageSelect,
  footerItems,
  footerNode,
  variant = "default",
  size = "md",
  loading = false,
  className = "",
  ariaLabel = "Candidate pipeline stages",
}) => {
  const containerClasses = [
    styles.container,
    variant === "subtle" ? styles.variantSubtle : styles.variantDefault,
    size === "sm" ? styles.sizeSm : size === "lg" ? styles.sizeLg : styles.sizeMd,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const handleStageClick = (stage: PipelineFunnelStage) => {
    if (stage.disabled || loading) return;
    if (stage.onClick) {
      stage.onClick();
    }
    if (onStageSelect) {
      onStageSelect(stage.id, stage);
    }
  };

  const renderStageCell = (stage: PipelineFunnelStage, index: number) => {
    const isSelected = selectedStageId != null ? selectedStageId === stage.id : Boolean(stage.isSelected);
    const isClickable = Boolean(!stage.disabled && (stage.onClick || onStageSelect || stage.href));

    const cellClasses = [
      styles.stageCell,
      isSelected ? styles.selected : "",
      stage.disabled ? styles.disabled : "",
      !isClickable ? styles.readOnly : "",
    ]
      .filter(Boolean)
      .join(" ");

    const content = (
      <>
        <div className={styles.stageHeader}>
          {loading ? (
            <div className={styles.skeletonLabel} aria-hidden="true" />
          ) : (
            <span className={styles.stageLabel} title={stage.label}>
              {stage.label}
            </span>
          )}
          {!loading && isClickable && (
            <ArrowRightIcon size="xs" className={styles.arrow} aria-hidden="true" />
          )}
        </div>

        {loading ? (
          <div className={styles.skeletonCount} aria-hidden="true" />
        ) : (
          <span className={styles.stageCount}>{stage.count}</span>
        )}
      </>
    );

    if (stage.href && !stage.disabled) {
      return (
        <a
          key={stage.id || index}
          href={stage.href}
          className={cellClasses}
          title={stage.description || stage.label}
          aria-label={stage.ariaLabel || `${stage.label}: ${stage.count}`}
          aria-selected={isSelected ? "true" : undefined}
        >
          {content}
        </a>
      );
    }

    if (isClickable) {
      return (
        <button
          key={stage.id || index}
          type="button"
          className={cellClasses}
          onClick={() => handleStageClick(stage)}
          title={stage.description || stage.label}
          disabled={stage.disabled}
          aria-label={stage.ariaLabel || `${stage.label}: ${stage.count}`}
          aria-selected={isSelected ? "true" : undefined}
        >
          {content}
        </button>
      );
    }

    return (
      <div
        key={stage.id || index}
        className={cellClasses}
        title={stage.description || stage.label}
        aria-label={stage.ariaLabel || `${stage.label}: ${stage.count}`}
      >
        {content}
      </div>
    );
  };

  const renderFooterItem = (item: PipelineFunnelFooterItem, idx: number, arr: PipelineFunnelFooterItem[]) => {
    const isLast = idx === arr.length - 1;

    let node: React.ReactNode;

    if (item.href) {
      node = (
        <a
          key={item.id || idx}
          href={item.href}
          className={styles.footerBtn}
          title={item.title}
        >
          {item.count !== undefined && <strong className={styles.footerCount}>{item.count}</strong>}
          <span className={styles.footerLabel}>{item.label}</span>
        </a>
      );
    } else if (item.onClick) {
      node = (
        <button
          key={item.id || idx}
          type="button"
          className={styles.footerBtn}
          onClick={item.onClick}
          title={item.title}
          disabled={item.disabled}
        >
          {item.count !== undefined && <strong className={styles.footerCount}>{item.count}</strong>}
          <span className={styles.footerLabel}>{item.label}</span>
        </button>
      );
    } else {
      node = (
        <span key={item.id || idx} className={styles.footerItem} title={item.title}>
          {item.count !== undefined && <strong className={styles.footerCount}>{item.count}</strong>}
          <span className={styles.footerLabel}>{item.label}</span>
        </span>
      );
    }

    return (
      <React.Fragment key={item.id || idx}>
        {node}
        {!isLast && <span className={styles.footerDot} aria-hidden="true">·</span>}
      </React.Fragment>
    );
  };

  return (
    <div
      className={containerClasses}
      role="region"
      aria-label={ariaLabel}
      style={{ "--stage-count": stages.length } as React.CSSProperties}
    >
      {/* Top connected stage cells */}
      <div className={styles.stagesGrid}>
        {stages.map((stage, idx) => renderStageCell(stage, idx))}
      </div>

      {/* Optional bottom meta row */}
      {footerNode ? (
        <div className={styles.footerRow}>{footerNode}</div>
      ) : loading ? (
        <div className={styles.footerRow}>
          <div className={styles.skeletonFooter} aria-hidden="true" />
        </div>
      ) : footerItems && footerItems.length > 0 ? (
        <div className={styles.footerRow}>
          {footerItems.map((item, idx) => renderFooterItem(item, idx, footerItems))}
        </div>
      ) : null}
    </div>
  );
};

export default PipelineFunnel;
