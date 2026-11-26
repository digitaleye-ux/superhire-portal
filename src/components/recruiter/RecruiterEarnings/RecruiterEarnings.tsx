import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Badge } from "@/components/shared/Badge";
import { Button } from "@/components/shared/Button";
import { Dropdown } from "@/components/shared/Dropdown";
import { IconButton } from "@/components/shared/IconButton";
import { SearchInput } from "@/components/shared/SearchInput";
import { SegmentedControl } from "@/components/shared/SegmentedControl";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpRightIcon,
  CheckIcon,
  ExternalLinkIcon,
  XIcon,
} from "@/components/shared/Icon";
import {
  BASE_PAYOUT_RECORDS,
  CURRENT_MONTH_PREFIX,
  buildCommissionRecords,
  buildEarningsChartSeries,
  companyLogoUrl,
  computeEarningsSummary,
  formatCompactInrAxis,
  formatInr,
  isDateInSelectedRange,
} from "./RecruiterEarnings.data";
import type {
  ChartGranularity,
  CommissionPaymentStatus,
  CommissionRecord,
  EarningEligibilityStatus,
  EarningsCommissionModel,
  EarningsDateRangePreset,
  PayoutRecord,
  PayoutRecordStatus,
  RecruiterEarningsProps,
} from "./RecruiterEarnings.types";
import s from "./RecruiterEarnings.module.css";

/* -------------------------------------------------------------------------- */
/* Distinct Status Badges (Never combine Earning & Payment dimensions)        */
/* Reuses standard Bolt Design System <Badge> component with semantic tokens  */
/* -------------------------------------------------------------------------- */

const EARNING_STATUS_LABELS: Record<EarningEligibilityStatus, string> = {
  earned: "Earned",
  potential: "Potential",
  ineligible: "Ineligible",
};

const PAYMENT_STATUS_LABELS: Record<CommissionPaymentStatus, string> = {
  "not-payable": "Not payable yet",
  pending: "Pending",
  processing: "Processing",
  paid: "Paid",
  failed: "Failed",
};

const PAYOUT_STATUS_LABELS: Record<PayoutRecordStatus, string> = {
  scheduled: "Scheduled",
  processing: "Processing",
  paid: "Paid",
  failed: "Failed",
  reversed: "Reversed",
};

function EarningStatusBadge({ status }: { status: EarningEligibilityStatus }) {
  const type =
    status === "earned"
      ? "success"
      : status === "potential"
        ? "spotlight"
        : "neutral";

  return (
    <Badge type={type} dot>
      {EARNING_STATUS_LABELS[status]}
    </Badge>
  );
}

function PaymentStatusBadge({ status }: { status: CommissionPaymentStatus }) {
  const type =
    status === "paid"
      ? "success"
      : status === "pending"
        ? "warning"
        : status === "processing"
          ? "info"
          : status === "failed"
            ? "error"
            : "neutral";

  return <Badge type={type}>{PAYMENT_STATUS_LABELS[status]}</Badge>;
}

function PayoutStatusBadge({ status }: { status: PayoutRecordStatus }) {
  const type =
    status === "paid"
      ? "success"
      : status === "scheduled" || status === "processing"
        ? "info"
        : "error";

  return <Badge type={type}>{PAYOUT_STATUS_LABELS[status]}</Badge>;
}

/* -------------------------------------------------------------------------- */
/* Filter Option Definitions                                                  */
/* -------------------------------------------------------------------------- */

const DATE_RANGE_OPTIONS: { value: EarningsDateRangePreset; label: string }[] = [
  { value: "this-year", label: "This year (2026)" },
  { value: "this-month", label: "This month (Nov 2026)" },
  { value: "last-month", label: "Last month (Oct 2026)" },
  { value: "all-time", label: "All time" },
  { value: "custom", label: "Custom range" },
];

const MODEL_FILTER_OPTIONS = [
  { value: "all", label: "All models" },
  { value: "shortlist", label: "Earn per shortlist" },
  { value: "closure", label: "Earn per closure" },
];

const PAYMENT_FILTER_OPTIONS: {
  value: CommissionPaymentStatus;
  label: string;
}[] = [
  { value: "pending", label: "Pending" },
  { value: "processing", label: "Processing" },
  { value: "paid", label: "Paid" },
  { value: "not-payable", label: "Not payable yet" },
  { value: "failed", label: "Failed" },
];

const LEDGER_MODEL_OPTIONS = [
  { value: "shortlist", label: "Earn per shortlist" },
  { value: "closure", label: "Earn per closure" },
];

/* -------------------------------------------------------------------------- */
/* Commission Detail Drawer (PRD §7.6 & §8.6)                                 */
/* -------------------------------------------------------------------------- */

function CommissionDetailDrawer({
  record,
  returnPayout,
  onBackToPayout,
  onOpenPayout,
  onNavigateToCandidate,
  onClose,
}: {
  record: CommissionRecord;
  returnPayout: PayoutRecord | null;
  onBackToPayout: () => void;
  onOpenPayout: (payoutId: string) => void;
  onNavigateToCandidate: (candidateId: number) => void;
  onClose: () => void;
}) {
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeBtnRef.current?.focus();
  }, [record.id]);

  return (
    <div className={s.drawerInner}>
      {/* Sticky Drawer Header */}
      <div className={s.drawerHeader}>
        {returnPayout && (
          <Button
            variant="tertiary"
            size="sm"
            leadingIcon={<ArrowLeftIcon size="xs" />}
            onClick={onBackToPayout}
          >
            Back to payout {returnPayout.reference}
          </Button>
        )}

        <div className={s.drawerTopRow}>
          <div className={s.drawerTitleGroup}>
            <span className={s.drawerEyebrow}>
              Commission detail · {record.id}
            </span>
            <h2 className={s.drawerTitle}>{record.candidateName}</h2>
          </div>

          <IconButton
            ref={closeBtnRef}
            icon={<XIcon size="md" />}
            size="md"
            onClick={onClose}
            ariaLabel="Close commission detail"
          />
        </div>

        <div className={s.drawerRoleRow}>
          <img
            src={companyLogoUrl(record.domain)}
            alt=""
            width={20}
            height={20}
            className={s.companyLogoSm}
          />
          <span className={s.drawerRoleText}>
            {record.roleTitle} · <strong>{record.employer}</strong>
          </span>
        </div>

        <Button
          variant="secondary"
          size="sm"
          trailingIcon={<ExternalLinkIcon size="xs" />}
          onClick={() => onNavigateToCandidate(record.candidateId)}
        >
          Open candidate application in Track
        </Button>
      </div>

      {/* Scrollable Drawer Body */}
      <div className={s.drawerBody}>
        {/* 1. Commission Amount & Dual Status Dimensions */}
        <section className={s.drawerSection} aria-label="Commission summary">
          <div className={s.amountHeroBox}>
            <div className={s.amountHeroTop}>
              <span className={s.metaLabel}>Agreed commission</span>
              <span className={s.modelTag}>
                {record.commissionModel === "closure"
                  ? "Earn per closure"
                  : "Earn per shortlist"}
              </span>
            </div>
            <div className={s.amountHeroValue}>
              {formatInr(record.commissionAmount)}
              <span className={s.currencyCode}>{record.currency}</span>
            </div>
            <p className={s.conditionRuleText}>
              <strong>Earning condition:</strong>{" "}
              {record.earningConditionSummary}
            </p>
          </div>

          <div className={s.dualStatusGrid}>
            <div className={s.dualStatusBox}>
              <span className={s.metaLabel}>Earning eligibility</span>
              <EarningStatusBadge status={record.earningStatus} />
            </div>
            <div className={s.dualStatusBox}>
              <span className={s.metaLabel}>Payment status</span>
              <PaymentStatusBadge status={record.paymentStatus} />
            </div>
          </div>
        </section>

        {/* 2. Plain-Language Status Explanation & Milestones */}
        <section
          className={s.drawerSection}
          aria-label="Eligibility explanation and milestones"
        >
          <h3 className={s.drawerSubheading}>Progress &amp; explanation</h3>

          <div
            className={`${s.explanationCallout} ${
              record.earningStatus === "earned"
                ? s.calloutEarned
                : record.earningStatus === "ineligible"
                  ? s.calloutIneligible
                  : s.calloutPotential
            }`}
          >
            <p className={s.explanationText}>{record.statusExplanation}</p>
          </div>

          <ol className={s.milestoneList}>
            {record.milestones.map((ms) => (
              <li
                key={ms.id}
                className={`${s.milestoneItem} ${
                  ms.state === "completed"
                    ? s.msCompleted
                    : ms.state === "current"
                      ? s.msCurrent
                      : ms.state === "ineligible"
                        ? s.msIneligible
                        : s.msUpcoming
                }`}
              >
                <span className={s.msIndicator} aria-hidden="true">
                  {ms.state === "completed" ? <CheckIcon size="xs" /> : null}
                </span>
                <div className={s.msContent}>
                  <div className={s.msHeaderRow}>
                    <span className={s.msLabel}>{ms.label}</span>
                    {ms.isEarningTrigger && (
                      <span className={s.msTriggerTag}>Earning condition</span>
                    )}
                  </div>
                  <span className={s.msDate}>{ms.dateLabel}</span>
                  {ms.note && <span className={s.msNote}>{ms.note}</span>}
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* 3. Payment & Payout Traceability */}
        <section className={s.drawerSection} aria-label="Payment details">
          <h3 className={s.drawerSubheading}>Payment details</h3>

          {record.payoutId && record.payoutReference ? (
            <div className={s.kvList}>
              <div className={s.kvRow}>
                <span className={s.kvKey}>Payout batch</span>
                <button
                  type="button"
                  className={s.inlineRefBtn}
                  onClick={() => onOpenPayout(record.payoutId!)}
                >
                  <span>{record.payoutReference}</span>
                  <ArrowUpRightIcon size="xs" />
                </button>
              </div>
              {record.earnedDateLabel && (
                <div className={s.kvRow}>
                  <span className={s.kvKey}>Earned date</span>
                  <span className={s.kvVal}>{record.earnedDateLabel}</span>
                </div>
              )}
              {record.paidDateLabel ? (
                <div className={s.kvRow}>
                  <span className={s.kvKey}>Payment date</span>
                  <span className={s.kvVal}>{record.paidDateLabel}</span>
                </div>
              ) : (
                <div className={s.kvRow}>
                  <span className={s.kvKey}>Expected disbursement</span>
                  <span className={s.kvVal}>28 Nov 2026</span>
                </div>
              )}
              {record.transactionReference && (
                <div className={s.kvRow}>
                  <span className={s.kvKey}>Transaction reference</span>
                  <span className={`${s.kvVal} ${s.monoText}`}>
                    {record.transactionReference}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <p className={s.emptyPaymentNote}>
              {record.earningStatus === "ineligible"
                ? "No payout applies because this submission did not meet its commission condition."
                : "Payout reference and settlement details are assigned once this commission becomes earned."}
            </p>
          )}
        </section>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Payout Detail Drawer (PRD §7.7 & §8.7)                                     */
/* -------------------------------------------------------------------------- */

function PayoutDetailDrawer({
  payout,
  allCommissions,
  onSelectCommission,
  onClose,
}: {
  payout: PayoutRecord;
  allCommissions: CommissionRecord[];
  onSelectCommission: (commissionId: string) => void;
  onClose: () => void;
}) {
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeBtnRef.current?.focus();
  }, [payout.id]);

  const includedEntries = useMemo(
    () =>
      payout.includedCommissionIds
        .map((id) => allCommissions.find((c) => c.id === id))
        .filter((c): c is CommissionRecord => Boolean(c)),
    [payout.includedCommissionIds, allCommissions]
  );

  const entriesSubtotal = includedEntries.reduce(
    (sum, item) => sum + item.commissionAmount,
    0
  );

  return (
    <div className={s.drawerInner}>
      <div className={s.drawerHeader}>
        <div className={s.drawerTopRow}>
          <div className={s.drawerTitleGroup}>
            <span className={s.drawerEyebrow}>Payout detail</span>
            <h2 className={`${s.drawerTitle} ${s.monoText}`}>
              {payout.reference}
            </h2>
          </div>

          <IconButton
            ref={closeBtnRef}
            icon={<XIcon size="md" />}
            size="md"
            onClick={onClose}
            ariaLabel="Close payout detail"
          />
        </div>

        <div className={s.payoutDrawerMetaRow}>
          <PayoutStatusBadge status={payout.status} />
          <span className={s.drawerDateSub}>
            {payout.paidDateTimeLabel
              ? `Disbursed ${payout.paidDateTimeLabel}`
              : payout.scheduledDateLabel
                ? `Scheduled for ${payout.scheduledDateLabel}`
                : ""}
          </span>
        </div>
      </div>

      <div className={s.drawerBody}>
        {/* 1. Payout Amount & Settlement Metadata */}
        <section className={s.drawerSection} aria-label="Payout summary">
          <div className={s.amountHeroBox}>
            <div className={s.amountHeroTop}>
              <span className={s.metaLabel}>Total payout amount</span>
              <span className={s.modelTag}>
                {includedEntries.length}{" "}
                {includedEntries.length === 1 ? "commission" : "commissions"}
              </span>
            </div>
            <div className={s.amountHeroValue}>
              {formatInr(payout.amount)}
              <span className={s.currencyCode}>{payout.currency}</span>
            </div>
            {payout.statusNote && (
              <p className={s.conditionRuleText}>{payout.statusNote}</p>
            )}
          </div>

          <div className={s.kvList}>
            <div className={s.kvRow}>
              <span className={s.kvKey}>Payout reference</span>
              <span className={`${s.kvVal} ${s.monoText}`}>
                {payout.reference}
              </span>
            </div>
            {payout.scheduledDateLabel && (
              <div className={s.kvRow}>
                <span className={s.kvKey}>Scheduled date</span>
                <span className={s.kvVal}>{payout.scheduledDateLabel}</span>
              </div>
            )}
            {payout.paidDateLabel && (
              <div className={s.kvRow}>
                <span className={s.kvKey}>Paid date</span>
                <span className={s.kvVal}>{payout.paidDateLabel}</span>
              </div>
            )}
            {payout.paymentMethod && (
              <div className={s.kvRow}>
                <span className={s.kvKey}>Payment method</span>
                <span className={s.kvVal}>{payout.paymentMethod}</span>
              </div>
            )}
            <div className={s.kvRow}>
              <span className={s.kvKey}>Transaction reference</span>
              <span className={`${s.kvVal} ${s.monoText}`}>
                {payout.transactionReference ?? "Assigned upon settlement"}
              </span>
            </div>
          </div>
        </section>

        {/* 2. Included Commission Entries + Reconciliation */}
        <section
          className={s.drawerSection}
          aria-label="Included commission entries"
        >
          <h3 className={s.drawerSubheading}>
            Commissions included ({includedEntries.length})
          </h3>

          <div className={s.includedList}>
            {includedEntries.map((entry) => (
              <button
                key={entry.id}
                type="button"
                className={s.includedCardBtn}
                onClick={() => onSelectCommission(entry.id)}
              >
                <div className={s.includedLeft}>
                  <span className={s.includedCandidate}>
                    {entry.candidateName}
                  </span>
                  <span className={s.includedRole}>
                    {entry.roleTitle} · {entry.employer}
                  </span>
                  <span className={s.includedMeta}>
                    {entry.commissionModel === "closure"
                      ? "Earn per closure"
                      : "Earn per shortlist"}
                    {entry.earnedDateLabel
                      ? ` · Earned ${entry.earnedDateLabel}`
                      : ""}
                  </span>
                </div>
                <div className={s.includedRight}>
                  <span className={s.includedAmount}>
                    {formatInr(entry.commissionAmount)}
                  </span>
                  <ArrowRightIcon size="xs" className={s.includedArrow} />
                </div>
              </button>
            ))}
          </div>

          <div className={s.reconcileBox}>
            <div className={s.reconcileRow}>
              <span>
                Commissions subtotal ({includedEntries.length})
              </span>
              <span className={s.tabular}>{formatInr(entriesSubtotal)}</span>
            </div>
            {payout.adjustmentAmount !== 0 && (
              <div className={s.reconcileRow}>
                <span>{payout.adjustmentNote ?? "Adjustments"}</span>
                <span className={s.tabular}>
                  {formatInr(payout.adjustmentAmount)}
                </span>
              </div>
            )}
            <div className={`${s.reconcileRow} ${s.reconcileTotal}`}>
              <span>Total payout</span>
              <span className={s.tabular}>{formatInr(payout.amount)}</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Main Recruiter Earnings Workspace (PRD §1–§21)                             */
/* -------------------------------------------------------------------------- */

export function RecruiterEarnings({
  liveCandidates,
  initialPreset,
  onConsumePreset,
  onNavigateToCandidate,
}: RecruiterEarningsProps) {
  const customStartId = useId();
  const customEndId = useId();
  const chartTitleId = useId();

  // Chart & period state (PRD §7.1, §7.3, §8.3)
  const [datePreset, setDatePreset] =
    useState<EarningsDateRangePreset>("this-year");
  const [customStart, setCustomStart] = useState("2026-09-01");
  const [customEnd, setCustomEnd] = useState("2026-11-30");
  const [granularity, setGranularity] = useState<ChartGranularity>("monthly");
  const [chartModel, setChartModel] = useState<
    EarningsCommissionModel | "all"
  >("all");
  const [hoveredBucketKey, setHoveredBucketKey] = useState<string | null>(null);

  // Ledger filter & search state (PRD §7.5, §12)
  const [ledgerEarningTab, setLedgerEarningTab] = useState<
    "all" | EarningEligibilityStatus
  >("all");
  const [ledgerPaymentFilter, setLedgerPaymentFilter] = useState<
    CommissionPaymentStatus[]
  >([]);
  const [ledgerModelFilter, setLedgerModelFilter] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [applyDateToLedger, setApplyDateToLedger] = useState(false);

  // Payout history filter state (for "Paid this month" card interaction)
  const [payoutMonthOnly, setPayoutMonthOnly] = useState(false);

  // Right-side detail drawer state (Commission Detail OR Payout Detail)
  const [activeDrawer, setActiveDrawer] = useState<
    | { kind: "commission"; id: string; fromPayoutId?: string }
    | { kind: "payout"; id: string }
    | null
  >(null);

  const records = useMemo(
    () => buildCommissionRecords(liveCandidates),
    [liveCandidates]
  );
  const payouts = BASE_PAYOUT_RECORDS;

  const summary = useMemo(
    () => computeEarningsSummary(records, payouts),
    [records, payouts]
  );

  // Apply cross-navigation preset when arriving from Overview
  useEffect(() => {
    if (!initialPreset) return;
    if (initialPreset.earningStatus) {
      setLedgerEarningTab(initialPreset.earningStatus);
    }
    if (initialPreset.paymentStatus) {
      setLedgerPaymentFilter(initialPreset.paymentStatus);
    }
    if (initialPreset.model && initialPreset.model !== "all") {
      setLedgerModelFilter([initialPreset.model]);
    } else if (initialPreset.model === "all") {
      setLedgerModelFilter([]);
    }
    if (initialPreset.openPayoutId) {
      setActiveDrawer({ kind: "payout", id: initialPreset.openPayoutId });
    } else if (initialPreset.openCommissionId) {
      setActiveDrawer({
        kind: "commission",
        id: initialPreset.openCommissionId,
      });
    }
    onConsumePreset?.();
  }, [initialPreset, onConsumePreset]);

  // Close drawer on Escape
  useEffect(() => {
    if (!activeDrawer) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveDrawer(null);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeDrawer]);

  // Chart buckets & selected-period earned total (strictly earnedDateIso, excludes potential)
  const chartBuckets = useMemo(
    () =>
      buildEarningsChartSeries(
        records,
        datePreset,
        granularity,
        chartModel,
        customStart,
        customEnd
      ),
    [records, datePreset, granularity, chartModel, customStart, customEnd]
  );

  const earnedInSelectedPeriod = useMemo(
    () => chartBuckets.reduce((sum, b) => sum + b.earnedAmount, 0),
    [chartBuckets]
  );

  const maxBucketAmount = useMemo(() => {
    const rawMax = Math.max(0, ...chartBuckets.map((b) => b.earnedAmount));
    if (rawMax <= 0) return 60000;
    // Clean rounded ceiling for readable currency gridlines
    const step = rawMax > 50000 ? 20000 : rawMax > 10000 ? 5000 : 1000;
    return Math.ceil(rawMax / step) * step;
  }, [chartBuckets]);

  // Counts for segmented Earning Status tabs
  const statusCounts = useMemo(() => {
    const counts = {
      all: records.length,
      earned: 0,
      potential: 0,
      ineligible: 0,
    };
    records.forEach((r) => {
      counts[r.earningStatus] += 1;
    });
    return counts;
  }, [records]);

  // Filtered Commission Ledger rows (PRD §12)
  const filteredLedgerRows = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return records.filter((r) => {
      if (ledgerEarningTab !== "all" && r.earningStatus !== ledgerEarningTab) {
        return false;
      }
      if (
        ledgerPaymentFilter.length > 0 &&
        !ledgerPaymentFilter.includes(r.paymentStatus)
      ) {
        return false;
      }
      if (
        ledgerModelFilter.length > 0 &&
        !ledgerModelFilter.includes(r.commissionModel)
      ) {
        return false;
      }
      if (applyDateToLedger && datePreset !== "all-time") {
        const basisDate = r.earnedDateIso ?? r.updatedDateIso;
        if (
          !isDateInSelectedRange(basisDate, datePreset, customStart, customEnd)
        ) {
          return false;
        }
      }
      if (q) {
        const hay =
          `${r.candidateName} ${r.roleTitle} ${r.employer} ${r.id}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [
    records,
    ledgerEarningTab,
    ledgerPaymentFilter,
    ledgerModelFilter,
    applyDateToLedger,
    datePreset,
    customStart,
    customEnd,
    searchQuery,
  ]);

  const hasActiveLedgerFilters =
    ledgerEarningTab !== "all" ||
    ledgerPaymentFilter.length > 0 ||
    ledgerModelFilter.length > 0 ||
    applyDateToLedger ||
    searchQuery.trim().length > 0;

  const clearAllLedgerFilters = () => {
    setLedgerEarningTab("all");
    setLedgerPaymentFilter([]);
    setLedgerModelFilter([]);
    setApplyDateToLedger(false);
    setSearchQuery("");
  };

  // Filtered Payout History rows
  const visiblePayouts = useMemo(() => {
    if (!payoutMonthOnly) return payouts;
    return payouts.filter(
      (p) =>
        p.status === "paid" && p.paidDateIso?.startsWith(CURRENT_MONTH_PREFIX)
    );
  }, [payouts, payoutMonthOnly]);

  const isPendingFilterActive =
    ledgerEarningTab === "earned" &&
    ledgerPaymentFilter.length === 1 &&
    ledgerPaymentFilter[0] === "pending";

  const selectedCommission =
    activeDrawer?.kind === "commission"
      ? records.find((r) => r.id === activeDrawer.id) ?? null
      : null;

  const returnPayout =
    activeDrawer?.kind === "commission" && activeDrawer.fromPayoutId
      ? payouts.find((p) => p.id === activeDrawer.fromPayoutId) ?? null
      : null;

  const selectedPayout =
    activeDrawer?.kind === "payout"
      ? payouts.find((p) => p.id === activeDrawer.id) ?? null
      : null;

  const activeBucket =
    chartBuckets.find((b) => b.key === hoveredBucketKey) ?? null;

  const showGranularityControl =
    datePreset === "this-year" ||
    datePreset === "all-time" ||
    datePreset === "custom";

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className={s.workspaceSplit}>
      {/* Left Main Financial Workspace */}
      <div className={s.pageScroll}>
        <div className={s.container}>
          {/* ================================================================
              1. Page Header & Lifetime Total Earned (PRD §6.3, §7.1, §8.1)
             ================================================================ */}
          <header className={s.pageHeader}>
            <div className={s.headerTitleBlock}>
              <h1 className={s.pageTitle}>Earnings</h1>
              <p className={s.pageSubtitle}>
                Your commission earnings and payout history.
              </p>
            </div>

            <div className={s.lifetimeBox}>
              <div className={s.lifetimeLabelRow}>
                <span className={s.overlineLabel}>Total earned to date</span>
                <Badge type="spotlight">Lifetime</Badge>
              </div>
              <span className={s.lifetimeValue}>
                {formatInr(summary.lifetimeEarned)}
              </span>
              <span className={s.lifetimeBreakdown}>
                {formatInr(summary.lifetimePaid)} paid ·{" "}
                {formatInr(summary.paymentPending)} pending
                {summary.paymentProcessing > 0
                  ? ` · ${formatInr(summary.paymentProcessing)} processing`
                  : ""}
              </span>
            </div>
          </header>

          {/* ================================================================
              2. Payout Summary Cards (PRD §6.3, §7.2, §8.2)
             ================================================================ */}
          <section aria-label="Payout summary" className={s.section}>
            <div className={s.summaryGrid}>
              {/* Card 1: Payment pending */}
              <button
                type="button"
                className={`${s.summaryCard} ${
                  isPendingFilterActive ? s.summaryCardActive : ""
                }`}
                onClick={() => {
                  setLedgerEarningTab("earned");
                  setLedgerPaymentFilter(["pending"]);
                  scrollToSection("er-sec-ledger");
                }}
              >
                <div className={s.cardTopRow}>
                  <span className={s.overlineLabel}>Payment pending</span>
                  <ArrowRightIcon size="sm" className={s.cardArrow} />
                </div>
                <span className={s.summaryValue}>
                  {formatInr(summary.paymentPending)}
                </span>
                <span className={s.summaryMeta}>
                  {summary.paymentPending > 0
                    ? `Earned across ${summary.pendingSubmissionsCount} ${
                        summary.pendingSubmissionsCount === 1
                          ? "submission"
                          : "submissions"
                      }, awaiting payment`
                    : "All earned commissions disbursed"}
                </span>
              </button>

              {/* Card 2: Next payout (confirmed scheduled only — never invent dates) */}
              {summary.nextScheduledPayout ? (
                <button
                  type="button"
                  className={`${s.summaryCard} ${
                    activeDrawer?.kind === "payout" &&
                    activeDrawer.id === summary.nextScheduledPayout.id
                      ? s.summaryCardActive
                      : ""
                  }`}
                  onClick={() =>
                    setActiveDrawer({
                      kind: "payout",
                      id: summary.nextScheduledPayout!.id,
                    })
                  }
                >
                  <div className={s.cardTopRow}>
                    <span className={s.overlineLabel}>Next payout</span>
                    <div className={s.cardTopRight}>
                      <PayoutStatusBadge
                        status={summary.nextScheduledPayout.status}
                      />
                      <ArrowUpRightIcon size="sm" className={s.cardArrow} />
                    </div>
                  </div>
                  <span className={s.summaryValue}>
                    {formatInr(summary.nextScheduledPayout.amount)}
                  </span>
                  <span className={s.summaryMeta}>
                    Expected {summary.nextScheduledPayout.scheduledDateLabel} ·{" "}
                    {summary.nextScheduledPayout.reference}
                  </span>
                </button>
              ) : (
                <div className={`${s.summaryCard} ${s.summaryCardStatic}`}>
                  <div className={s.cardTopRow}>
                    <span className={s.overlineLabel}>Next payout</span>
                  </div>
                  <span className={s.summaryEmptyTitle}>
                    No payout scheduled
                  </span>
                  <span className={s.summaryMeta}>
                    Scheduled once pending commissions are batched
                  </span>
                </div>
              )}

              {/* Card 3: Paid this month */}
              <button
                type="button"
                className={`${s.summaryCard} ${
                  payoutMonthOnly ? s.summaryCardActive : ""
                }`}
                onClick={() => {
                  setPayoutMonthOnly(true);
                  scrollToSection("er-sec-payouts");
                }}
              >
                <div className={s.cardTopRow}>
                  <span className={s.overlineLabel}>Paid this month</span>
                  <ArrowRightIcon size="sm" className={s.cardArrow} />
                </div>
                <span className={s.summaryValue}>
                  {formatInr(summary.paidThisMonth)}
                </span>
                <span className={s.summaryMeta}>
                  {summary.paidThisMonthPayoutCount > 0
                    ? `${summary.paidThisMonthPayoutCount} ${
                        summary.paidThisMonthPayoutCount === 1
                          ? "payout"
                          : "payouts"
                      } settled in Nov 2026`
                    : "No payouts settled this month yet"}
                </span>
              </button>
            </div>
          </section>

          {/* ================================================================
              3. Earnings Over Time Chart (PRD §6.3, §7.3, §8.3)
             ================================================================ */}
          <section className={s.section} aria-labelledby={chartTitleId}>
            <div className={s.surfaceCard}>
              <div className={s.chartHeader}>
                <div className={s.chartTitleGroup}>
                  <h2 id={chartTitleId} className={s.sectionTitle}>
                    Earnings over time
                  </h2>
                  <div className={s.periodTotalRow}>
                    <span className={s.periodTotalLabel}>
                      Earned in selected period:
                    </span>
                    <strong className={s.periodTotalValue}>
                      {formatInr(earnedInSelectedPeriod)}
                    </strong>
                  </div>
                </div>

                <div className={s.chartControls}>
                  {showGranularityControl && (
                    <SegmentedControl<ChartGranularity>
                      size="sm"
                      ariaLabel="Chart grouping"
                      value={granularity}
                      onChange={(next) => setGranularity(next)}
                      options={[
                        { value: "monthly", label: "Monthly" },
                        { value: "quarterly", label: "Quarterly" },
                      ]}
                    />
                  )}

                  <Dropdown
                    label="Model"
                    options={MODEL_FILTER_OPTIONS}
                    selected={[chartModel]}
                    multiple={false}
                    singleShowsValue
                    defaultValue="all"
                    align="right"
                    onChange={(vals) => {
                      const next =
                        (vals[0] as EarningsCommissionModel | "all") || "all";
                      setChartModel(next);
                    }}
                  />

                  <Dropdown
                    label="Period"
                    options={DATE_RANGE_OPTIONS}
                    selected={[datePreset]}
                    multiple={false}
                    singleShowsValue
                    defaultValue="all-time"
                    align="right"
                    onChange={(vals) => {
                      const next =
                        (vals[0] as EarningsDateRangePreset) || "this-year";
                      setDatePreset(next);
                      setApplyDateToLedger(
                        next !== "this-year" && next !== "all-time"
                      );
                    }}
                  />
                </div>
              </div>

              {datePreset === "custom" && (
                <div className={s.customDateBar}>
                  <div className={s.dateFieldGroup}>
                    <label htmlFor={customStartId} className={s.dateLabel}>
                      From
                    </label>
                    <input
                      id={customStartId}
                      type="date"
                      className={s.dateInput}
                      value={customStart}
                      onChange={(e) => {
                        setCustomStart(e.target.value);
                        setApplyDateToLedger(true);
                      }}
                    />
                  </div>
                  <div className={s.dateFieldGroup}>
                    <label htmlFor={customEndId} className={s.dateLabel}>
                      To
                    </label>
                    <input
                      id={customEndId}
                      type="date"
                      className={s.dateInput}
                      value={customEnd}
                      onChange={(e) => {
                        setCustomEnd(e.target.value);
                        setApplyDateToLedger(true);
                      }}
                    />
                  </div>
                </div>
              )}

              {earnedInSelectedPeriod === 0 ? (
                <div className={s.emptyChartState}>
                  <p className={s.emptyStateTitle}>
                    No commission became earned in this period
                  </p>
                  <p className={s.emptyStateBody}>
                    Only commissions whose earning condition has been verified
                    appear here. Potential commissions are excluded.
                  </p>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setDatePreset("this-year");
                      setChartModel("all");
                      setApplyDateToLedger(false);
                    }}
                  >
                    Reset to This year (All models)
                  </Button>
                </div>
              ) : (
                <figure className={s.chartFigure}>
                  {/* Interactive Hover/Focus Readout Pill */}
                  <div className={s.chartReadoutRow} aria-live="polite">
                    {activeBucket ? (
                      <span className={s.chartTooltipInline}>
                        <strong>{activeBucket.label}:</strong>{" "}
                        {formatInr(activeBucket.earnedAmount)} earned
                        {activeBucket.earnedCount > 0
                          ? ` (${activeBucket.earnedCount} ${
                              activeBucket.earnedCount === 1
                                ? "commission"
                                : "commissions"
                            })`
                          : " (No earned commissions)"}
                      </span>
                    ) : (
                      <span className={s.chartHintText}>
                        Hover or focus a period bar to inspect earned commission
                      </span>
                    )}
                  </div>

                  <div className={s.chartPlotGrid}>
                    {/* Y-axis ticks */}
                    <div className={s.yAxisCol} aria-hidden="true">
                      <span>{formatCompactInrAxis(maxBucketAmount)}</span>
                      <span>
                        {formatCompactInrAxis(Math.round(maxBucketAmount / 2))}
                      </span>
                      <span>₹0</span>
                    </div>

                    {/* Discrete Bar Columns (Zero interpolation across ₹0 periods) */}
                    <div className={s.barsArea}>
                      <div className={s.gridLineTop} aria-hidden="true" />
                      <div className={s.gridLineMid} aria-hidden="true" />
                      <div className={s.gridLineBase} aria-hidden="true" />

                      <div
                        className={s.barsColumns}
                        style={{
                          gridTemplateColumns: `repeat(${chartBuckets.length}, minmax(0, 1fr))`,
                        }}
                      >
                        {chartBuckets.map((bucket) => {
                          const heightPct =
                            bucket.earnedAmount > 0
                              ? Math.max(
                                  6,
                                  Math.round(
                                    (bucket.earnedAmount / maxBucketAmount) *
                                      100
                                  )
                                )
                              : 0;
                          const isHovered = hoveredBucketKey === bucket.key;

                          return (
                            <button
                              key={bucket.key}
                              type="button"
                              className={`${s.barColumnBtn} ${
                                isHovered ? s.barColumnActive : ""
                              }`}
                              onMouseEnter={() =>
                                setHoveredBucketKey(bucket.key)
                              }
                              onMouseLeave={() => setHoveredBucketKey(null)}
                              onFocus={() => setHoveredBucketKey(bucket.key)}
                              onBlur={() => setHoveredBucketKey(null)}
                              onClick={() => {
                                setLedgerEarningTab("earned");
                                scrollToSection("er-sec-ledger");
                              }}
                              aria-label={`${bucket.label}: ${formatInr(
                                bucket.earnedAmount
                              )} earned (${bucket.earnedCount} ${
                                bucket.earnedCount === 1
                                  ? "commission"
                                  : "commissions"
                              })`}
                            >
                              <div className={s.barTrack}>
                                {bucket.earnedAmount > 0 ? (
                                  <div
                                    className={s.barFill}
                                    style={{ height: `${heightPct}%` }}
                                  />
                                ) : (
                                  <div className={s.barZeroTick} />
                                )}
                              </div>
                              <span className={s.xAxisLabel}>
                                {bucket.shortLabel}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Screen-reader data table alternative (modern-web-guidance accessibility §6) */}
                  <table className={s.visuallyHidden}>
                    <caption>
                      Earned commission by period in selected date range
                    </caption>
                    <thead>
                      <tr>
                        <th scope="col">Period</th>
                        <th scope="col">Earned amount</th>
                        <th scope="col">Earned commissions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {chartBuckets.map((b) => (
                        <tr key={b.key}>
                          <th scope="row">{b.label}</th>
                          <td>{formatInr(b.earnedAmount)}</td>
                          <td>{b.earnedCount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <figcaption className={s.chartFooterCaption}>
                    <span>
                      Grouped by verified commission earned date · Excludes{" "}
                      {formatInr(summary.potentialTotal)} potential commission
                    </span>
                  </figcaption>
                </figure>
              )}
            </div>
          </section>

          {/* ================================================================
              4. Commission Breakdown by Model (PRD §6.3, §7.4, §8.4)
             ================================================================ */}
          <section
            className={s.section}
            aria-labelledby="er-sec-models"
          >
            <div className={s.sectionHeader}>
              <h2 id="er-sec-models" className={s.sectionTitle}>
                Commission breakdown by model
              </h2>
            </div>

            <div className={s.modelsGrid}>
              {summary.models.map((m) => {
                const isModelFiltered =
                  ledgerModelFilter.length === 1 &&
                  ledgerModelFilter[0] === m.model;

                return (
                  <div
                    key={m.model}
                    className={`${s.surfaceCard} ${s.modelCard} ${
                      isModelFiltered ? s.modelCardSelected : ""
                    }`}
                  >
                    <div className={s.modelCardHeader}>
                      <div className={s.modelHeaderText}>
                        <h3 className={s.modelTitle}>{m.label}</h3>
                        <p className={s.modelCondition}>{m.conditionText}</p>
                      </div>

                      <button
                        type="button"
                        className={s.textActionBtn}
                        onClick={() => {
                          if (isModelFiltered) {
                            setLedgerModelFilter([]);
                          } else {
                            setLedgerModelFilter([m.model]);
                            scrollToSection("er-sec-ledger");
                          }
                        }}
                      >
                        <span>
                          {isModelFiltered ? "Showing in ledger" : "Filter ledger"}
                        </span>
                        <ArrowRightIcon size="xs" />
                      </button>
                    </div>

                    <div className={s.modelMetricsRow}>
                      <div className={s.modelMetricCol}>
                        <span className={s.overlineLabel}>Earned</span>
                        <span className={s.modelAmountEarned}>
                          {formatInr(m.earnedAmount)}
                        </span>
                        <span className={s.modelSubCount}>
                          {m.earnedCount}{" "}
                          {m.earnedCount === 1
                            ? "earned submission"
                            : "earned submissions"}
                        </span>
                      </div>

                      <div className={s.modelVerticalDivider} />

                      <div className={s.modelMetricCol}>
                        <span className={s.overlineLabel}>Potential</span>
                        <span className={s.modelAmountPotential}>
                          {formatInr(m.potentialAmount)}
                        </span>
                        <span className={s.modelSubCount}>
                          {m.potentialCount}{" "}
                          {m.potentialCount === 1
                            ? "progressing submission"
                            : "progressing submissions"}
                        </span>
                      </div>
                    </div>

                    {m.footnote && (
                      <p className={s.modelFootnote}>{m.footnote}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* ================================================================
              5. Commission Ledger (PRD §6.3, §7.5, §8.5, §12)
             ================================================================ */}
          <section
            id="er-sec-ledger"
            className={s.section}
            aria-labelledby="er-ledger-heading"
          >
            <div className={s.sectionHeader}>
              <h2 id="er-ledger-heading" className={s.sectionTitle}>
                Commission ledger
              </h2>

              {hasActiveLedgerFilters && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={clearAllLedgerFilters}
                >
                  Clear filters
                </Button>
              )}
            </div>

            <div className={s.surfaceCard}>
              {/* Compact Ledger Filter & Search Bar */}
              <div className={s.ledgerToolbar}>
                <SegmentedControl<"all" | EarningEligibilityStatus>
                  size="sm"
                  ariaLabel="Filter by earning eligibility"
                  value={ledgerEarningTab}
                  onChange={(tab) => setLedgerEarningTab(tab)}
                  options={[
                    { value: "all", label: "All", count: statusCounts.all },
                    {
                      value: "earned",
                      label: "Earned",
                      count: statusCounts.earned,
                    },
                    {
                      value: "potential",
                      label: "Potential",
                      count: statusCounts.potential,
                    },
                    {
                      value: "ineligible",
                      label: "Ineligible",
                      count: statusCounts.ineligible,
                    },
                  ]}
                />

                <div className={s.ledgerRightControls}>
                  <Dropdown
                    label="Payment status"
                    options={PAYMENT_FILTER_OPTIONS}
                    selected={ledgerPaymentFilter}
                    onChange={(next) =>
                      setLedgerPaymentFilter(next as CommissionPaymentStatus[])
                    }
                  />

                  <Dropdown
                    label="Model"
                    options={LEDGER_MODEL_OPTIONS}
                    selected={ledgerModelFilter}
                    onChange={setLedgerModelFilter}
                  />

                  <SearchInput
                    className={s.ledgerSearch}
                    placeholder="Search candidate, role, or employer"
                    ariaLabel="Search commission ledger"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onClear={() => setSearchQuery("")}
                  />
                </div>
              </div>

              {filteredLedgerRows.length === 0 ? (
                <div className={s.emptyTableState}>
                  <p className={s.emptyStateTitle}>
                    No commission records match your current filters
                  </p>
                  <p className={s.emptyStateBody}>
                    Try clearing one or more filters or broadening your search
                    query.
                  </p>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={clearAllLedgerFilters}
                  >
                    Clear all filters
                  </Button>
                </div>
              ) : (
                <div
                  tabIndex={0}
                  role="region"
                  aria-labelledby="er-ledger-heading"
                  className={s.tableRegion}
                >
                  <table className={`${s.dataTable} ${s.ledgerTable}`}>
                    <caption className={s.visuallyHidden}>
                      Candidate-job submission commission records
                    </caption>
                    <thead>
                      <tr>
                        <th scope="col" className={s.colCandidate}>
                          Candidate
                        </th>
                        <th scope="col" className={s.colRole}>
                          Role / Employer
                        </th>
                        <th scope="col" className={s.colModel}>
                          Commission model
                        </th>
                        <th
                          scope="col"
                          className={`${s.colAmount} ${s.alignRight}`}
                        >
                          Commission amount
                        </th>
                        <th scope="col" className={s.colEarning}>
                          Earning status
                        </th>
                        <th scope="col" className={s.colPayment}>
                          Payment status
                        </th>
                        <th
                          scope="col"
                          className={`${s.colUpdated} ${s.alignRight}`}
                        >
                          Updated
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredLedgerRows.map((row) => {
                        const isSelected =
                          activeDrawer?.kind === "commission" &&
                          activeDrawer.id === row.id;

                        return (
                          <tr
                            key={row.id}
                            className={`${s.interactiveRow} ${
                              isSelected ? s.rowSelected : ""
                            }`}
                            onClick={() =>
                              setActiveDrawer({
                                kind: "commission",
                                id: row.id,
                              })
                            }
                          >
                            <th scope="row" className={s.colCandidate}>
                              <div className={s.candidateCell}>
                                <span
                                  className={s.avatarCircle}
                                  aria-hidden="true"
                                >
                                  {row.initials}
                                </span>
                                <div className={s.candidateTextStack}>
                                  <button
                                    type="button"
                                    className={s.rowPrimaryBtn}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setActiveDrawer({
                                        kind: "commission",
                                        id: row.id,
                                      });
                                    }}
                                  >
                                    {row.candidateName}
                                  </button>
                                  <span className={s.stageHintText}>
                                    {row.hiringStageLabel}
                                  </span>
                                </div>
                              </div>
                            </th>

                            <td className={s.colRole}>
                              <div className={s.roleEmployerCell}>
                                <span
                                  className={s.roleTitleTruncate}
                                  title={row.roleTitle}
                                >
                                  {row.roleTitle}
                                </span>
                                <span className={s.employerLine}>
                                  <img
                                    src={companyLogoUrl(row.domain)}
                                    alt=""
                                    width={14}
                                    height={14}
                                    className={s.companyLogoXs}
                                  />
                                  <span>{row.employer}</span>
                                </span>
                              </div>
                            </td>

                            <td className={s.colModel}>
                              <span className={s.modelInlineText}>
                                {row.commissionModel === "closure"
                                  ? "Earn per closure"
                                  : "Earn per shortlist"}
                              </span>
                            </td>

                            <td className={`${s.colAmount} ${s.alignRight}`}>
                              <span className={s.amountCellText}>
                                {formatInr(row.commissionAmount)}
                              </span>
                            </td>

                            <td className={s.colEarning}>
                              <EarningStatusBadge status={row.earningStatus} />
                            </td>

                            <td className={s.colPayment}>
                              <PaymentStatusBadge status={row.paymentStatus} />
                            </td>

                            <td className={`${s.colUpdated} ${s.alignRight}`}>
                              <span
                                className={s.updatedText}
                                title={row.updatedDateLabel}
                              >
                                {row.updatedRelativeLabel}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </section>

          {/* ================================================================
              6. Payout History (PRD §6.3, §7.7, §8.7)
             ================================================================ */}
          <section
            id="er-sec-payouts"
            className={s.section}
            aria-labelledby="er-payouts-heading"
          >
            <div className={s.sectionHeader}>
              <div className={s.headingWithCount}>
                <h2 id="er-payouts-heading" className={s.sectionTitle}>
                  Payout history
                </h2>
                {payoutMonthOnly && (
                  <span className={s.countChip}>Nov 2026 only</span>
                )}
              </div>

              {payoutMonthOnly && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setPayoutMonthOnly(false)}
                >
                  Show all payouts
                </Button>
              )}
            </div>

            <div className={s.surfaceCard}>
              {visiblePayouts.length === 0 ? (
                <div className={s.emptyTableState}>
                  <p className={s.emptyStateTitle}>No payout records found</p>
                  <p className={s.emptyStateBody}>
                    Completed and scheduled disbursements will appear here once
                    commissions are batched.
                  </p>
                </div>
              ) : (
                <div
                  tabIndex={0}
                  role="region"
                  aria-labelledby="er-payouts-heading"
                  className={s.tableRegion}
                >
                  <table className={`${s.dataTable} ${s.payoutsTable}`}>
                    <caption className={s.visuallyHidden}>
                      Scheduled and completed recruiter payouts
                    </caption>
                    <thead>
                      <tr>
                        <th scope="col" className={s.pColDate}>
                          Payout date
                        </th>
                        <th scope="col" className={s.pColRef}>
                          Payout reference
                        </th>
                        <th scope="col" className={s.pColCount}>
                          Commissions included
                        </th>
                        <th
                          scope="col"
                          className={`${s.pColAmount} ${s.alignRight}`}
                        >
                          Amount
                        </th>
                        <th scope="col" className={s.pColStatus}>
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {visiblePayouts.map((po) => {
                        const isSelected =
                          activeDrawer?.kind === "payout" &&
                          activeDrawer.id === po.id;
                        const count = po.includedCommissionIds.length;

                        return (
                          <tr
                            key={po.id}
                            className={`${s.interactiveRow} ${
                              isSelected ? s.rowSelected : ""
                            }`}
                            onClick={() =>
                              setActiveDrawer({ kind: "payout", id: po.id })
                            }
                          >
                            <th scope="row" className={s.pColDate}>
                              <button
                                type="button"
                                className={s.rowPrimaryBtn}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveDrawer({
                                    kind: "payout",
                                    id: po.id,
                                  });
                                }}
                              >
                                {po.paidDateLabel ??
                                  `${po.scheduledDateLabel} (Expected)`}
                              </button>
                            </th>

                            <td className={s.pColRef}>
                              <span className={s.monoRefText}>
                                {po.reference}
                              </span>
                            </td>

                            <td className={s.pColCount}>
                              <span className={s.countInlineText}>
                                {count}{" "}
                                {count === 1 ? "commission" : "commissions"}
                              </span>
                            </td>

                            <td className={`${s.pColAmount} ${s.alignRight}`}>
                              <span className={s.amountCellText}>
                                {formatInr(po.amount)}
                              </span>
                            </td>

                            <td className={s.pColStatus}>
                              <PayoutStatusBadge status={po.status} />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>

      {/* ====================================================================
          Right-Side Detail Drawer (Desktop Side Drawer / Mobile Full-Screen)
         ==================================================================== */}
      {(selectedCommission || selectedPayout) && (
        <aside
          className={s.detailDrawer}
          aria-label={
            selectedCommission ? "Commission details" : "Payout details"
          }
        >
          {selectedCommission && (
            <CommissionDetailDrawer
              record={selectedCommission}
              returnPayout={returnPayout}
              onBackToPayout={() => {
                if (returnPayout) {
                  setActiveDrawer({ kind: "payout", id: returnPayout.id });
                }
              }}
              onOpenPayout={(payoutId) =>
                setActiveDrawer({ kind: "payout", id: payoutId })
              }
              onNavigateToCandidate={onNavigateToCandidate}
              onClose={() => setActiveDrawer(null)}
            />
          )}

          {selectedPayout && (
            <PayoutDetailDrawer
              payout={selectedPayout}
              allCommissions={records}
              onSelectCommission={(commissionId) =>
                setActiveDrawer({
                  kind: "commission",
                  id: commissionId,
                  fromPayoutId: selectedPayout.id,
                })
              }
              onClose={() => setActiveDrawer(null)}
            />
          )}
        </aside>
      )}
    </div>
  );
}

export default RecruiterEarnings;
