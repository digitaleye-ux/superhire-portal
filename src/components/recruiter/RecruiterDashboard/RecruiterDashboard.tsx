import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/shared/Badge";
import { KpiCard } from "@/components/shared/KpiCard";
import { LinkButton } from "@/components/shared/LinkButton";
import { PipelineFunnel } from "@/components/shared/PipelineFunnel";
import { SegmentedControl } from "@/components/shared/SegmentedControl";
import {
  ArrowUpRightIcon,
  XIcon,
} from "@/components/shared/Icon";
import {
  ACTIVE_PIPELINE_STAGES,
  buildDashboardSnapshot,
  companyLogoUrl,
  formatInr,
  mapStageToTrackStatuses,
} from "./RecruiterDashboard.data";
import { ActionsRequiredPrototypeHarness } from "@/proto/actions-required/ActionsRequiredPrototypeHarness";
import type {
  ActiveRoleSummary,
  DashboardSnapshot,
  EarningsFilterCategory,
  RecruiterDashboardProps,
  SubmissionRecord,
  SubmissionStageId,
} from "./RecruiterDashboard.types";
import s from "./RecruiterDashboard.module.css";

const STAGE_LABELS: Record<SubmissionStageId, string> = {
  submitted: "Submitted",
  "profile-approved": "Profile approved",
  shortlisted: "Shortlisted",
  interview: "Interview",
  offer: "Offer",
  joined: "Joined",
  "on-hold": "On hold",
  unsuccessful: "Rejected",
};

function StagePill({
  stage,
  count,
}: {
  stage: SubmissionStageId;
  count?: number;
}) {
  const label = STAGE_LABELS[stage] || stage;
  const text = count && count > 1 ? `${count} ${label}` : label;

  const type =
    stage === "joined"
      ? "success"
      : stage === "offer"
        ? "spotlight"
        : stage === "interview"
          ? "info"
          : stage === "shortlisted"
            ? "spotlight"
            : stage === "profile-approved"
              ? "info"
              : stage === "on-hold"
                ? "warning"
                : stage === "unsuccessful"
                  ? "error"
                  : "neutral";

  return <Badge type={type}>{text}</Badge>;
}

const STAGE_ORDER: {
  key: keyof ActiveRoleSummary["stageBreakdown"];
  stage: SubmissionStageId;
}[] = [
  { key: "joined", stage: "joined" },
  { key: "offer", stage: "offer" },
  { key: "interview", stage: "interview" },
  { key: "shortlisted", stage: "shortlisted" },
  { key: "approved", stage: "profile-approved" },
  { key: "submitted", stage: "submitted" },
  { key: "on-hold", stage: "on-hold" },
  { key: "unsuccessful", stage: "unsuccessful" },
];

function EarningsLedgerModal({
  snapshot,
  activeCategory,
  onCategoryChange,
  onClose,
  onSelectCandidate,
}: {
  snapshot: DashboardSnapshot;
  activeCategory: EarningsFilterCategory;
  onCategoryChange: (cat: EarningsFilterCategory) => void;
  onClose: () => void;
  onSelectCandidate: (candidateId: number, submission: SubmissionRecord) => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const categories: {
    id: EarningsFilterCategory;
    label: string;
    amount: number;
  }[] = [
      {
        id: "earned",
        label: "Total earned",
        amount: snapshot.earnings.totalEarned,
      },
      {
        id: "payment-pending",
        label: "Payment pending",
        amount: snapshot.earnings.paymentPending,
      },
      {
        id: "paid",
        label: "Paid",
        amount: snapshot.earnings.paid,
      },
      {
        id: "potential",
        label: "Potential (conditional)",
        amount: snapshot.earnings.potentialCommission,
      },
    ];

  const rows = snapshot.submissions.filter((sub) => {
    if (sub.earningEligibility === "none") return false;
    if (activeCategory === "earned") return sub.earningEligibility === "earned";
    if (activeCategory === "payment-pending")
      return (
        sub.earningEligibility === "earned" &&
        sub.payoutStatus === "payment-pending"
      );
    if (activeCategory === "paid")
      return sub.earningEligibility === "earned" && sub.payoutStatus === "paid";
    if (activeCategory === "potential")
      return sub.earningEligibility === "potential";
    return true;
  });

  return (
    <div
      className={s.modalBackdrop}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Earnings and commission ledger"
    >
      <div className={s.modalSheet} onClick={(e) => e.stopPropagation()}>
        <div className={s.modalHeader}>
          <h2 className={s.sectionTitle}>Commission &amp; payouts ledger</h2>
          <button
            type="button"
            className={s.secondaryBtn}
            onClick={onClose}
            aria-label="Close earnings ledger"
          >
            <XIcon size="sm" />
            <span>Close</span>
          </button>
        </div>

        <div className={s.modalTabs}>
          <SegmentedControl<EarningsFilterCategory>
            size="sm"
            ariaLabel="Financial categories"
            value={activeCategory}
            onChange={(cat) => onCategoryChange(cat)}
            options={categories.map((cat) => ({
              value: cat.id,
              label: cat.label,
              count: formatInr(cat.amount),
            }))}
          />
        </div>

        <div className={s.modalBody}>
          <table className={s.table}>
            <thead>
              <tr>
                <th>Submission</th>
                <th>Model</th>
                <th>Current stage</th>
                <th>Earning condition</th>
                <th className={s.numCol}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={5} className={s.emptyCell}>
                    No submissions in this financial category yet.
                  </td>
                </tr>
              ) : (
                rows.map((sub) => (
                  <tr
                    key={sub.id}
                    className={s.tableRowInteractive}
                    onClick={() => {
                      onClose();
                      onSelectCandidate(sub.candidateId, sub);
                    }}
                  >
                    <td>
                      <div className={s.roleCell}>
                        <img
                          src={companyLogoUrl(sub.domain)}
                          alt=""
                          width={20}
                          height={20}
                          className={s.companyFavicon}
                        />
                        <div className={s.candidateTextCol}>
                          <span className={s.roleTitleText}>
                            {sub.candidateName}
                          </span>
                          <span className={s.roleCompanyText}>
                            {sub.roleTitle} · {sub.company}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={s.modelPill}>
                        {sub.commissionModel === "closure"
                          ? "Per closure"
                          : "Per shortlist"}
                      </span>
                    </td>
                    <td>
                      <StagePill stage={sub.stage} />
                    </td>
                    <td>
                      <span className={s.sectionHint}>
                        {sub.earningConditionNote}
                      </span>
                    </td>
                    <td className={s.numCol}>
                      <strong className={s.roleTitleText}>
                        {sub.commissionFormatted}
                      </strong>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/**
 * SuperHire Recruiter Dashboard — Decided from /proto/recruiter-dashboard
 *
 * Architecture decision:
 * - Direction: Linear Spine (Single-Column Controlled Hierarchy, Sections 1 → 6)
 *   enriched with the 1-month post-join closure retention line item inside
 *   Potential Commission.
 * - Rejected:
 *   - Split Workbench: in-place stage filtering duplicated the Track Candidates
 *     mental model on the home screen.
 *   - Ledger First (standalone): placing a full-width financial hero above the
 *     pipeline pushed candidate progress and active roles too far below the fold.
 *   - Triage & Velocity: leading with Action Required above performance metrics
 *     framed the recruiter experience around chores rather than sourcing outcomes.
 */
export function RecruiterDashboard({
  liveCandidates,
  selectedCandidateId,
  onNavigateToCandidates,
  onSelectCandidate,
  onEditCandidate,
  onSelectRole,
  onExploreJobs,
  onNavigateToEarnings,
}: RecruiterDashboardProps) {
  const [dismissedActions, setDismissedActions] = useState<string[]>([]);
  const [ledgerCategory, setLedgerCategory] =
    useState<EarningsFilterCategory | null>(null);

  const snapshot = buildDashboardSnapshot(dismissedActions, liveCandidates);
  const { earnings } = snapshot;

  const handleDismissAction = (actionId: string) => {
    setDismissedActions((prev) => [...prev, actionId]);
    toast.success("Action marked as completed", {
      description:
        "When all pending items are resolved, the Action Required section automatically hides.",
    });
  };

  return (
    <div className={s.page}>
      <div className={s.container}>
        {/* Section 01 — Performance Overview */}
        <section className={s.section} aria-labelledby="rd-sec-overview">
          <div className={s.sectionHeader}>
            <h2 id="rd-sec-overview" className={s.sectionTitle}>
              Performance overview
            </h2>
          </div>

          <div className={s.kpiGrid}>
            {/* 1. Active roles */}
            <KpiCard
              label="Active roles"
              value={snapshot.activeRoles.length}
              onClick={() => {
                const el = document.getElementById("rd-sec-roles");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              title="View my active roles"
            />

            {/* 2. Total submissions */}
            <KpiCard
              label="Total submissions"
              value={snapshot.totalSubmissionsCount}
              onClick={() =>
                onNavigateToCandidates(undefined, "All candidate submissions")
              }
              title="View all candidate submissions"
            />

            {/* 3. Shortlist rate */}
            <KpiCard
              label="Shortlist rate"
              value={`${snapshot.shortlistRate}%`}
              subtext={`${snapshot.employerShortlistedCount} of ${snapshot.reviewedSubmissionsCount} reviewed`}
              onClick={() =>
                onNavigateToCandidates(
                  ["shortlisted", "interview", "offered", "joined"],
                  `Employer shortlisted submissions (${snapshot.employerShortlistedCount} of ${snapshot.reviewedSubmissionsCount} reviewed)`
                )
              }
              title={`${snapshot.employerShortlistedCount} shortlisted out of ${snapshot.reviewedSubmissionsCount} reviewed submissions (excluding 2 in initial SuperHire vetting)`}
            />

            {/* 4. Candidates joined */}
            <KpiCard
              label="Candidates joined"
              value={snapshot.pipelineCounts.joined ?? 0}
              subtext="Started at employer"
              onClick={() =>
                onNavigateToCandidates(["joined"], "Candidates joined")
              }
              title={`Candidates who have started working at the employer (${snapshot.pipelineCounts.joined} joined)`}
            />
          </div>
        </section>

        {/* Section 02 — Candidate Pipeline */}
        <section className={s.section} aria-labelledby="rd-sec-pipeline">
          <div className={s.sectionHeader}>
            <h2 id="rd-sec-pipeline" className={s.sectionTitle}>
              Candidate pipeline
            </h2>
            <LinkButton
              size="sm"
              arrow
              onClick={() =>
                onNavigateToCandidates(undefined, "All submissions")
              }
            >
              View all submissions
            </LinkButton>
          </div>

          <PipelineFunnel
            stages={ACTIVE_PIPELINE_STAGES.map((stage) => ({
              id: stage.id,
              label: stage.label,
              count: snapshot.pipelineCounts[stage.id],
              description: stage.description,
              onClick: () =>
                onNavigateToCandidates(
                  mapStageToTrackStatuses(stage.id),
                  `Stage: ${stage.label}`
                ),
            }))}
            footerItems={[
              {
                count:
                  snapshot.pipelineCounts.submitted +
                  snapshot.pipelineCounts["profile-approved"] +
                  snapshot.pipelineCounts.shortlisted +
                  snapshot.pipelineCounts.interview +
                  snapshot.pipelineCounts.offer +
                  snapshot.pipelineCounts.joined,
                label: "active in pipeline",
              },
              {
                count: snapshot.onHoldCount,
                label: "on hold",
                onClick: () =>
                  onNavigateToCandidates(["on-hold"], "Submissions on hold"),
                title: "View submissions currently on hold",
              },
              {
                count: snapshot.unsuccessfulCount,
                label: "rejected",
                onClick: () =>
                  onNavigateToCandidates(
                    ["rejected"],
                    "Unsuccessful submissions"
                  ),
                title: "View unsuccessful submissions",
              },
              {
                count: snapshot.totalSubmissionsCount,
                label: "total submissions",
                onClick: () =>
                  onNavigateToCandidates(undefined, "All submissions"),
                title: "View all 13 candidate submissions",
              },
            ]}
          />
        </section>

        {/* Section 03 (Earnings) + Section 04 (Recent Candidate Progress) */}
        <div className={s.twoColSplit}>
          {/* Section 03 — Earnings */}
          <section
            className={`${s.section} ${s.earningsSection}`}
            aria-labelledby="rd-sec-earnings"
          >
            <div className={s.sectionHeader}>
              <h2 id="rd-sec-earnings" className={s.sectionTitle}>
                Earnings
              </h2>
              <LinkButton
                size="sm"
                trailingIcon={<ArrowUpRightIcon size="xs" />}
                onClick={() =>
                  onNavigateToEarnings
                    ? onNavigateToEarnings({ earningStatus: "all" })
                    : setLedgerCategory("all")
                }
              >
                Open ledger
              </LinkButton>
            </div>

            {(() => {
              const totalPipeline =
                earnings.totalEarned + earnings.potentialCommission;
              const earnedPct =
                totalPipeline > 0
                  ? Math.round((earnings.totalEarned / totalPipeline) * 100)
                  : 0;
              const potentialPct = Math.max(0, 100 - earnedPct);

              return (
                <div className={`${s.surfaceCard} ${s.earningsSurfaceCard}`}>
                  <div className={s.earningsRoot}>
                    {/* Top Header Summary */}
                    <div className={s.earningsHeader}>
                      <div className={s.earningsTotalGroup}>
                        <span className={s.kpiLabel}>Total commission value</span>
                        <div className={s.earningsTotalRow}>
                          <span className={s.earningsTotalValue}>
                            {formatInr(totalPipeline)}
                          </span>
                          <span className={s.earningsBadgeEarned}>
                            {formatInr(earnings.totalEarned)} earned ({earnedPct}%)
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Visual Progress Funnel Bar (Two Clean Segments: Earned vs Potential) */}
                    <div
                      className={s.earningsProgressBar}
                      title={`Earned: ${earnedPct}% | Potential: ${potentialPct}%`}
                    >
                      <div
                        className={s.earningsBarEarned}
                        style={{ width: `${earnedPct}%` }}
                      />
                      <div
                        className={s.earningsBarPotential}
                        style={{ width: `${potentialPct}%` }}
                      />
                    </div>

                    {/* Clickable Breakdown Cards with Horizontal & Vertical Separators */}
                    <div className={s.earningsCardsGrid}>
                      {/* Earned card */}
                      <button
                        type="button"
                        className={s.earningsSubCard}
                        onClick={() =>
                          onNavigateToEarnings
                            ? onNavigateToEarnings({ earningStatus: "earned" })
                            : setLedgerCategory("earned")
                        }
                      >
                        <div className={s.earningsCardHead}>
                          <span className={s.kpiLabel}>
                            <span className={s.legendDotPaid} />
                            Earned
                          </span>
                          <ArrowUpRightIcon size="sm" className={s.kpiArrow} />
                        </div>
                        <span className={s.earningsCardAmount}>
                          {formatInr(earnings.totalEarned)}
                        </span>

                        {/* Horizontal separator */}
                        <div className={s.cardHorizontalDivider} />

                        {/* Split with vertical separator */}
                        <div className={s.splitRow}>
                          <div className={s.splitCol}>
                            <span className={s.splitLabel}>Paid</span>
                            <span className={s.splitValue}>
                              {formatInr(earnings.paid)}
                            </span>
                          </div>
                          <div className={s.verticalDivider} />
                          <div className={s.splitCol}>
                            <span className={s.splitLabel}>Pending</span>
                            <span className={s.splitValue}>
                              {formatInr(earnings.paymentPending)}
                            </span>
                          </div>
                        </div>
                      </button>

                      {/* Potential card */}
                      <button
                        type="button"
                        className={s.earningsSubCard}
                        onClick={() =>
                          onNavigateToEarnings
                            ? onNavigateToEarnings({
                                earningStatus: "potential",
                              })
                            : setLedgerCategory("potential")
                        }
                      >
                        <div className={s.earningsCardHead}>
                          <span className={s.kpiLabel}>
                            <span className={s.legendDotPipeline} />
                            Potential
                          </span>
                          <ArrowUpRightIcon size="sm" className={s.kpiArrow} />
                        </div>
                        <span className={s.earningsCardAmount}>
                          {formatInr(earnings.potentialCommission)}
                        </span>

                        {/* Horizontal separator */}
                        <div className={s.cardHorizontalDivider} />

                        {/* Split with vertical separator */}
                        <div className={s.splitRow}>
                          <div className={s.splitCol}>
                            <span className={s.splitLabel}>Shortlist</span>
                            <span className={s.splitValue}>
                              {formatInr(earnings.shortlistModelPotential)}
                            </span>
                          </div>
                          <div className={s.verticalDivider} />
                          <div className={s.splitCol}>
                            <span className={s.splitLabel}>Closure</span>
                            <span className={s.splitValue}>
                              {formatInr(earnings.closureModelPotential)}
                            </span>
                          </div>
                        </div>
                      </button>
                    </div>

                    {/* Bottom Payout Schedule Meta Strip (only shown when a payout is actually scheduled) */}
                    {earnings.paymentPending > 0 && Boolean(earnings.nextPayoutDate) && (
                      <div className={s.payoutMetaBanner}>
                        <div className={s.payoutMetaLeft}>
                          <span className={s.payoutMetaDot} />
                          <span className={s.payoutMetaText}>
                            Next scheduled payout:{" "}
                            <strong>{earnings.nextPayoutDate}</strong> (
                            {formatInr(earnings.paymentPending)} pending disbursement)
                          </span>
                        </div>
                        <LinkButton
                          size="sm"
                          trailingIcon={<ArrowUpRightIcon size="xs" />}
                          onClick={() =>
                            onNavigateToEarnings
                              ? onNavigateToEarnings({ openPayoutId: "po-3" })
                              : setLedgerCategory("payment-pending")
                          }
                        >
                          View schedule
                        </LinkButton>
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}
          </section>

          {/* Section 04 — Recent Candidate Progress */}
          <section className={s.section} aria-labelledby="rd-sec-recent">
            <div className={s.sectionHeader}>
              <h2 id="rd-sec-recent" className={s.sectionTitle}>
                Recent candidate progress
              </h2>
              <LinkButton
                size="sm"
                arrow
                onClick={() =>
                  onNavigateToCandidates(undefined, "All submissions")
                }
              >
                View all submissions
              </LinkButton>
            </div>

            <div className={s.surfaceCard}>
              <div className={s.listStack}>
                {snapshot.recentProgress.slice(0, 6).map((sub) => {
                  const isSelected = selectedCandidateId === sub.candidateId;
                  return (
                    <button
                      key={sub.id}
                      type="button"
                      className={`${s.progressRow} ${isSelected ? s.progressRowSelected : ""
                        }`}
                      onClick={() => onSelectCandidate(sub.candidateId, sub)}
                    >
                      <div className={s.candidateIdentity}>
                        <div className={s.candidateTextCol}>
                          <span
                            className={s.candidateName}
                            title={sub.candidateName}
                          >
                            {sub.candidateName}
                          </span>
                          <span
                            className={s.candidateRoleLine}
                            title={`${sub.roleTitle} · ${sub.company}`}
                          >
                            {sub.roleTitle} · {sub.company}
                          </span>
                        </div>
                      </div>

                      <StagePill stage={sub.stage} />

                      <div className={s.progressRightMeta}>
                        <span className={s.timestamp}>
                          {sub.lastUpdatedLabel}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>
        </div>

        {/* Section 05 — My Active Roles */}
        <section className={s.section} aria-labelledby="rd-sec-roles">
          <div className={s.sectionHeader}>
            <h2 id="rd-sec-roles" className={s.sectionTitle}>
              My active roles
            </h2>
            <LinkButton
              size="sm"
              arrow
              onClick={onExploreJobs}
            >
              Explore jobs
            </LinkButton>
          </div>

          <div className={s.surfaceCard}>
            <div className={s.tableWrap}>
              <table className={`${s.table} ${s.rolesTable}`}>
                <thead>
                  <tr>
                    <th className={s.colRole}>Role</th>
                    <th className={s.colModel}>Commission model</th>
                    <th className={`${s.colAmount} ${s.numCol}`}>
                      Commission / candidate
                    </th>
                    <th className={s.colSubmissions}>Candidates</th>
                    <th className={s.colProgress}>Progress</th>
                  </tr>
                </thead>
                <tbody>
                  {snapshot.activeRoles.map((role) => {
                    const activeStages = STAGE_ORDER.filter(
                      ({ key }) => (role.stageBreakdown[key] ?? 0) > 0
                    );

                    return (
                      <tr
                        key={role.jobId}
                        className={s.tableRowInteractive}
                        tabIndex={0}
                        onClick={() => onSelectRole(role.jobId)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            onSelectRole(role.jobId);
                          }
                        }}
                      >
                        <td className={s.colRole}>
                          <div className={s.roleCell}>
                            <img
                              src={companyLogoUrl(role.domain)}
                              alt=""
                              width={24}
                              height={24}
                              className={s.companyFavicon}
                            />
                            <div className={s.candidateTextCol}>
                              <span
                                className={s.roleTitleText}
                                title={role.roleTitle}
                              >
                                {role.roleTitle}
                              </span>
                              <span
                                className={s.roleCompanyText}
                                title={role.company}
                              >
                                {role.company}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className={s.colModel}>
                          <span className={s.modelPill}>
                            {role.commissionModel === "closure"
                              ? "Earn per closure"
                              : "Earn per shortlist"}
                          </span>
                        </td>
                        <td className={`${s.colAmount} ${s.numCol}`}>
                          <span className={s.numCell}>
                            {role.commissionFormatted}
                          </span>
                        </td>
                        <td className={s.colSubmissions}>
                          <span className={s.candidateCountCell}>
                            {role.totalSubmitted}
                          </span>
                        </td>
                        <td className={s.colProgress}>
                          {role.totalSubmitted === 1 ? (
                            <div className={s.progressBadgeGroup}>
                              <StagePill
                                stage={activeStages[0]?.stage ?? "submitted"}
                              />
                            </div>
                          ) : (
                            <div
                              className={s.progressMultiSummary}
                              title={role.progressSummary}
                            >
                              <span className={s.progressSummaryText}>
                                {role.progressSummary}
                              </span>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Section 06 — Action Required (Hidden for now) */}
        {false && snapshot.actionsRequired.length > 0 && (
          <section className={s.actionSection} aria-labelledby="rd-sec-actions">
            {/* >>> EMIL PROTOTYPE: Action required section variations >>> */}
            <ActionsRequiredPrototypeHarness
              actions={snapshot.actionsRequired}
              onEditCandidate={onEditCandidate}
              onDismissAction={handleDismissAction}
            />
            {/* <<< EMIL PROTOTYPE <<< */}
          </section>
        )}
      </div>

      {ledgerCategory !== null && (
        <EarningsLedgerModal
          snapshot={snapshot}
          activeCategory={ledgerCategory}
          onCategoryChange={setLedgerCategory}
          onClose={() => setLedgerCategory(null)}
          onSelectCandidate={(candidateId, sub) =>
            onSelectCandidate(candidateId, sub)
          }
        />
      )}
    </div>
  );
}

export default RecruiterDashboard;
