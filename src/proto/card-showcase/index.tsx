import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/shared/Badge";
import { KpiCard } from "@/components/shared/KpiCard";
import { PipelineFunnel } from "@/components/shared/PipelineFunnel";
import { JobCard } from "@/components/recruiter/JobCard";
import { CandidateCard } from "@/components/recruiter/CandidateCard";
import styles from "./showcase.module.css";

export default function CardShowcase() {
  const [activeTab, setActiveTab] = useState<"funnel" | "kpi" | "job" | "candidate">("funnel");
  const [selectedJobId, setSelectedJobId] = useState<string | null>("job-selected");
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>("cand-selected");
  const [selectedKpiId, setSelectedKpiId] = useState<string | null>("kpi-selected");
  const [selectedFunnelStageId, setSelectedFunnelStageId] = useState<string | null>("shortlisted");

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerTitleArea}>
          <span className={styles.badge}>Bolt Design System</span>
          <h1 className={styles.title}>Job & Candidate Card System</h1>
          <p className={styles.subtitle}>
            Production cards built on zero-hardcoded values: strictly consuming
            typography, spacing, borders, radius, shadows, icon sizes, and semantic color tokens.
          </p>
        </div>

        <nav className={styles.tabBar} aria-label="Showcase tabs">
          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === "funnel" ? styles.tabBtnActive : ""}`}
            onClick={() => setActiveTab("funnel")}
          >
            Pipeline Funnel (Requested)
          </button>
          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === "kpi" ? styles.tabBtnActive : ""}`}
            onClick={() => setActiveTab("kpi")}
          >
            KPI / Metric Cards
          </button>
          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === "job" ? styles.tabBtnActive : ""}`}
            onClick={() => setActiveTab("job")}
          >
            Job Card (Explore, Claimed, Closed)
          </button>
          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === "candidate" ? styles.tabBtnActive : ""}`}
            onClick={() => setActiveTab("candidate")}
          >
            Candidate Card (All 9 Statuses & States)
          </button>
        </nav>
      </header>

      <main className={styles.main}>
        {activeTab === "funnel" ? (
          <>
            {/* 1. Exact Match to Uploaded Screenshot */}
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>1. Production Funnel Component (Image Parity)</h2>
                <p className={styles.sectionDesc}>
                  Exact 1:1 match to reference: 6 horizontal connected stages with uppercase overline labels,
                  trailing action arrows, tabular bold counters, and explainable summary footer row.
                </p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6x)" }}>
                <div>
                  <div className={styles.cardLabel} style={{ marginBottom: "var(--space-2x)" }}>
                    <span>Candidate Pipeline Funnel</span>
                    <span className={styles.cardLabelTag}>exact reference match</span>
                  </div>
                  <PipelineFunnel
                    stages={[
                      { id: "submitted", label: "Submitted", count: 2, description: "Sourced and submitted profiles" },
                      { id: "profile-approved", label: "Profile approved", count: 2, description: "Vetted by SuperHire" },
                      { id: "shortlisted", label: "Shortlisted", count: 2, description: "Employer accepted profile" },
                      { id: "interview", label: "Interview", count: 2, description: "Active interviews with employer" },
                      { id: "offer", label: "Offer", count: 1, description: "Formal offer extended" },
                      { id: "joined", label: "Joined", count: 2, description: "Candidate joined employer" },
                    ]}
                    onStageSelect={(_id, stage) => toast.info(`Filtered candidates by ${stage.label}`)}
                    footerItems={[
                      { count: 11, label: "active in pipeline" },
                      { count: 1, label: "on hold", onClick: () => toast("Filter: on-hold candidates") },
                      { count: 1, label: "rejected", onClick: () => toast("Filter: rejected candidates") },
                      { count: 13, label: "total submissions", onClick: () => toast("Filter: all submissions") },
                    ]}
                  />
                </div>
              </div>
            </section>

            {/* 2. Interactive States & Filter Selection */}
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>2. Interactive States & Active Selection</h2>
                <p className={styles.sectionDesc}>
                  Click any stage cell to toggle an active filter (displays the brand indicator underline and background tint). Also demonstrates disabled and locked stages.
                </p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6x)" }}>
                <div>
                  <div className={styles.cardLabel} style={{ marginBottom: "var(--space-2x)" }}>
                    <span>Active Stage Filter (Selected: {selectedFunnelStageId ?? "None"})</span>
                    <span className={styles.cardLabelTag}>interactive filter</span>
                  </div>
                  <PipelineFunnel
                    selectedStageId={selectedFunnelStageId}
                    onStageSelect={(id) => {
                      setSelectedFunnelStageId((prev) => (prev === id ? null : id));
                      toast.success(`Filter switched to stage: ${id}`);
                    }}
                    stages={[
                      { id: "submitted", label: "Submitted", count: 5 },
                      { id: "profile-approved", label: "Profile approved", count: 3 },
                      { id: "shortlisted", label: "Shortlisted", count: 4 },
                      { id: "interview", label: "Interview", count: 2 },
                      { id: "offer", label: "Offer", count: 0 },
                      { id: "joined", label: "Joined", count: 1, disabled: true, description: "Archived milestone" },
                    ]}
                    footerItems={[
                      { count: 14, label: "active in pipeline" },
                      { count: 2, label: "on hold", onClick: () => toast("On hold") },
                      { count: 3, label: "rejected", onClick: () => toast("Rejected") },
                      { count: 19, label: "total submissions", onClick: () => toast("Total submissions") },
                    ]}
                  />
                </div>
              </div>
            </section>

            {/* 3. Surface Variants & Sizing */}
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>3. Surface Variants & Sizing</h2>
                <p className={styles.sectionDesc}>
                  Variant subtle (neutral background for toolbars/drawers) and compact size (size="sm").
                </p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6x)" }}>
                <div>
                  <div className={styles.cardLabel} style={{ marginBottom: "var(--space-2x)" }}>
                    <span>Subtle Variant (size="sm", 4 Stages)</span>
                    <span className={styles.cardLabelTag}>variant: "subtle"</span>
                  </div>
                  <PipelineFunnel
                    variant="subtle"
                    size="sm"
                    stages={[
                      { id: "sourced", label: "Sourced", count: 8 },
                      { id: "screening", label: "Screening", count: 4 },
                      { id: "interviews", label: "Client Interviews", count: 3 },
                      { id: "hired", label: "Hired", count: 1 },
                    ]}
                    onStageSelect={(_id, stage) => toast(`Selected ${stage.label}`)}
                    footerItems={[
                      { count: 15, label: "in screening" },
                      { count: 1, label: "archived", onClick: () => toast("Archived") },
                    ]}
                  />
                </div>
              </div>
            </section>

            {/* 4. Loading Skeleton State */}
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>4. Loading Skeleton State</h2>
                <p className={styles.sectionDesc}>
                  Animated shimmer placeholders preserving layout during async dashboard queries.
                </p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6x)" }}>
                <div>
                  <div className={styles.cardLabel} style={{ marginBottom: "var(--space-2x)" }}>
                    <span>Loading Skeleton</span>
                    <span className={styles.cardLabelTag}>loading: true</span>
                  </div>
                  <PipelineFunnel
                    loading
                    stages={[
                      { id: "s1", label: "Stage 1", count: 0 },
                      { id: "s2", label: "Stage 2", count: 0 },
                      { id: "s3", label: "Stage 3", count: 0 },
                      { id: "s4", label: "Stage 4", count: 0 },
                      { id: "s5", label: "Stage 5", count: 0 },
                      { id: "s6", label: "Stage 6", count: 0 },
                    ]}
                  />
                </div>
              </div>
            </section>
          </>
        ) : activeTab === "kpi" ? (
          <>
            {/* 1. Exact Match to Uploaded Screenshot */}
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>1. Production Metric Cards (Image Parity)</h2>
                <p className={styles.sectionDesc}>
                  Exact 1:1 match to the design reference: uppercase overline label, trailing arrow indicator, tabular bold metric, and optional secondary context notes.
                </p>
              </div>

              <div className={styles.grid}>
                {/* 1. Active roles */}
                <div className={styles.cardContainer}>
                  <div className={styles.cardLabel}>
                    <span>Active roles</span>
                    <span className={styles.cardLabelTag}>clean metric</span>
                  </div>
                  <KpiCard
                    label="Active roles"
                    value={11}
                    onClick={() => toast("View active roles")}
                    title="View my active roles"
                  />
                </div>

                {/* 2. Total submissions */}
                <div className={styles.cardContainer}>
                  <div className={styles.cardLabel}>
                    <span>Total submissions</span>
                    <span className={styles.cardLabelTag}>clean metric</span>
                  </div>
                  <KpiCard
                    label="Total submissions"
                    value={13}
                    onClick={() => toast("View all submissions")}
                    title="View all candidate submissions"
                  />
                </div>

                {/* 3. Shortlist rate */}
                <div className={styles.cardContainer}>
                  <div className={styles.cardLabel}>
                    <span>Shortlist rate</span>
                    <span className={styles.cardLabelTag}>with subtext note</span>
                  </div>
                  <KpiCard
                    label="Shortlist rate"
                    value="64%"
                    subtext="7 of 11 reviewed"
                    onClick={() => toast("View shortlisted candidates")}
                    title="7 shortlisted out of 11 reviewed submissions"
                  />
                </div>

                {/* 4. Candidates joined */}
                <div className={styles.cardContainer}>
                  <div className={styles.cardLabel}>
                    <span>Candidates joined</span>
                    <span className={styles.cardLabelTag}>with subtext note</span>
                  </div>
                  <KpiCard
                    label="Candidates joined"
                    value={2}
                    subtext="Started at employer"
                    onClick={() => toast("View joined candidates")}
                    title="Candidates who have joined"
                  />
                </div>
              </div>
            </section>

            {/* 2. Interactive States & Variants */}
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>2. Interactive States & Variants</h2>
                <p className={styles.sectionDesc}>
                  Interactive hover, selected active filter, disabled state, and loading skeleton.
                </p>
              </div>

              <div className={styles.grid}>
                {/* Default */}
                <div className={styles.cardContainer}>
                  <div className={styles.cardLabel}>
                    <span>Default Resting</span>
                    <span className={styles.cardLabelTag}>state: default</span>
                  </div>
                  <KpiCard
                    label="Interviews scheduled"
                    value={8}
                    subtext="Next: Today 3:00 PM"
                    onClick={() => toast("Open interviews")}
                  />
                </div>

                {/* Selected */}
                <div className={styles.cardContainer}>
                  <div className={styles.cardLabel}>
                    <span>Selected / Active Filter</span>
                    <span className={styles.cardLabelTag}>isSelected: true</span>
                  </div>
                  <KpiCard
                    label="Offers extended"
                    value={3}
                    subtext="Awaiting candidate decision"
                    isSelected={selectedKpiId === "kpi-selected"}
                    onClick={() => setSelectedKpiId((prev) => (prev ? null : "kpi-selected"))}
                  />
                </div>

                {/* Trend Up */}
                <div className={styles.cardContainer}>
                  <div className={styles.cardLabel}>
                    <span>With Trend Indicator (Up)</span>
                    <span className={styles.cardLabelTag}>trend: up</span>
                  </div>
                  <KpiCard
                    label="Potential earnings"
                    value="₹1,85,000"
                    trend={{ value: "+24%", direction: "up", label: "vs last month" }}
                    onClick={() => toast("View earnings breakdown")}
                  />
                </div>

                {/* Trend Down / Caution */}
                <div className={styles.cardContainer}>
                  <div className={styles.cardLabel}>
                    <span>With Trend Indicator (Down)</span>
                    <span className={styles.cardLabelTag}>trend: down</span>
                  </div>
                  <KpiCard
                    label="Avg. response time"
                    value="18 hrs"
                    trend={{ value: "+4 hrs", direction: "down", label: "slower" }}
                    onClick={() => toast("View response analytics")}
                  />
                </div>

                {/* Surface Variant: Brand */}
                <div className={styles.cardContainer}>
                  <div className={styles.cardLabel}>
                    <span>Brand Highlight Variant</span>
                    <span className={styles.cardLabelTag}>variant: brand</span>
                  </div>
                  <KpiCard
                    variant="brand"
                    label="SuperHire Vetted"
                    value="98%"
                    badge={<Badge type="spotlight">Top 2%</Badge>}
                    subtext="Quality verification rate"
                    onClick={() => toast("View vetted stats")}
                  />
                </div>

                {/* Disabled */}
                <div className={styles.cardContainer}>
                  <div className={styles.cardLabel}>
                    <span>Disabled State</span>
                    <span className={styles.cardLabelTag}>disabled: true</span>
                  </div>
                  <KpiCard
                    label="Archived pipelines"
                    value={0}
                    subtext="No archived records"
                    disabled
                  />
                </div>

                {/* Loading Skeleton */}
                <div className={styles.cardContainer}>
                  <div className={styles.cardLabel}>
                    <span>Loading Skeleton State</span>
                    <span className={styles.cardLabelTag}>loading: true</span>
                  </div>
                  <KpiCard
                    label="Loading metric"
                    value="0"
                    loading
                  />
                </div>
              </div>
            </section>
          </>
        ) : activeTab === "job" ? (
          <>
            {/* 1. Core States */}
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>1. Card Interactive States</h2>
                <p className={styles.sectionDesc}>
                  Default resting, hover trigger, selected in split-view, and disabled states.
                </p>
              </div>

              <div className={styles.grid}>
                <div className={styles.cardContainer}>
                  <div className={styles.cardLabel}>
                    <span>Default Resting</span>
                    <span className={styles.cardLabelTag}>state: default</span>
                  </div>
                  <JobCard
                    company="Google"
                    roleTitle="Senior Staff Software Engineer, Cloud Core Infrastructure"
                    packageLabel="₹65–85 LPA"
                    experience="8–12 yrs"
                    location="Bengaluru"
                    commission="₹2,500"
                    earningModel="shortlist"
                    badge="spotlight"
                    onClaim={() => toast.success("Claimed Google role")}
                    onClick={() => toast("Opening role details")}
                  />
                </div>

                <div className={styles.cardContainer}>
                  <div className={styles.cardLabel}>
                    <span>Selected State (Split-screen active)</span>
                    <span className={styles.cardLabelTag}>isSelected: true</span>
                  </div>
                  <JobCard
                    company="Stripe"
                    roleTitle="Staff Software Engineer, Platform Infrastructure"
                    packageLabel="₹65–90 LPA"
                    experience="10 yrs"
                    location="Remote"
                    commission="₹90,000"
                    earningModel="closure"
                    badge="priority"
                    isSelected={selectedJobId === "job-selected"}
                    onClaim={() => toast.success("Claimed Stripe role")}
                    onClick={() => setSelectedJobId((prev) => (prev ? null : "job-selected"))}
                  />
                </div>

                <div className={styles.cardContainer}>
                  <div className={styles.cardLabel}>
                    <span>Disabled State</span>
                    <span className={styles.cardLabelTag}>disabled: true</span>
                  </div>
                  <JobCard
                    company="Razorpay"
                    roleTitle="Lead Product Designer, Checkout Experiences"
                    packageLabel="₹35–50 LPA"
                    experience="6–8 yrs"
                    location="Bengaluru"
                    commission="₹2,000"
                    earningModel="shortlist"
                    disabled
                  />
                </div>
              </div>
            </section>

            {/* 2. Workflow Variants */}
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>2. Workflow Variants</h2>
                <p className={styles.sectionDesc}>
                  Explore role with claim action, Claimed role with kebab menu, and Closed role.
                </p>
              </div>

              <div className={styles.grid}>
                <div className={styles.cardContainer}>
                  <div className={styles.cardLabel}>
                    <span>Explore / Available</span>
                    <span className={styles.cardLabelTag}>variant: "explore"</span>
                  </div>
                  <JobCard
                    variant="explore"
                    company="Swiggy"
                    roleTitle="Engineering Manager, Consumer Growth & Discovery"
                    packageLabel="₹55–75 LPA"
                    experience="11 yrs"
                    location="Bengaluru"
                    commission="₹2,500"
                    earningModel="shortlist"
                    badge="trending"
                    onClaim={() => toast.success("Claim role triggered")}
                    onClick={() => toast("Open detail")}
                  />
                </div>

                <div className={styles.cardContainer}>
                  <div className={styles.cardLabel}>
                    <span>Claimed by Recruiter</span>
                    <span className={styles.cardLabelTag}>variant: "claimed"</span>
                  </div>
                  <JobCard
                    variant="claimed"
                    company="Notion"
                    roleTitle="Data Analyst, Core Product & Monetization"
                    packageLabel="₹14–19 LPA"
                    experience="2 yrs"
                    location="Hyderabad"
                    commission="₹1,500"
                    earningModel="shortlist"
                    badge="just-in"
                    actionLabel="Submit candidate"
                    onAction={() => toast.success("Submit candidate triggered")}
                    onUnclaim={() => toast.error("Unclaimed Notion role")}
                    onCopyLink={() => toast.success("Job link copied")}
                    onDownloadJd={() => toast.success("Job description downloaded")}
                    onClick={() => toast("Open detail")}
                  />
                </div>

                <div className={styles.cardContainer}>
                  <div className={styles.cardLabel}>
                    <span>Closed / Expired</span>
                    <span className={styles.cardLabelTag}>variant: "closed"</span>
                  </div>
                  <JobCard
                    variant="closed"
                    company="Zerodha"
                    roleTitle="DevOps Engineer, Core Trading Engine"
                    packageLabel="₹20–28 LPA"
                    experience="4 yrs"
                    location="Bengaluru"
                    commission="₹2,000"
                    earningModel="shortlist"
                  />
                </div>
              </div>
            </section>

            {/* 3. Edge Cases */}
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>3. Edge Cases & Formats</h2>
                <p className={styles.sectionDesc}>
                  Multi-location with hover tooltip, 2-line title clamping, and logo fallbacks.
                </p>
              </div>

              <div className={styles.grid}>
                <div className={styles.cardContainer}>
                  <div className={styles.cardLabel}>
                    <span>Multi-location (+3)</span>
                    <span className={styles.cardLabelTag}>locationFull tooltip</span>
                  </div>
                  <JobCard
                    company="Cred"
                    roleTitle="Senior iOS Engineer, Member Experience"
                    packageLabel="₹40–60 LPA"
                    experience="5 yrs"
                    location="Bengaluru +3"
                    locationFull="Bengaluru, Mumbai, Pune, Remote"
                    commission="₹50,000"
                    earningModel="closure"
                    onClaim={() => toast.success("Claimed Cred role")}
                    onClick={() => toast("Open detail")}
                  />
                </div>

                <div className={styles.cardContainer}>
                  <div className={styles.cardLabel}>
                    <span>Long Title (Clamped 2 lines)</span>
                    <span className={styles.cardLabelTag}>line-clamp: 2</span>
                  </div>
                  <JobCard
                    company="Flipkart"
                    roleTitle="Principal Architect & Senior Technical Director for High-Throughput Distributed Supply Chain Systems"
                    packageLabel="₹80–110 LPA"
                    experience="14 yrs"
                    location="Bengaluru"
                    commission="₹1,20,000"
                    earningModel="closure"
                    onClaim={() => toast.success("Claimed role")}
                    onClick={() => toast("Open detail")}
                  />
                </div>

                <div className={styles.cardContainer}>
                  <div className={styles.cardLabel}>
                    <span>Fallback Company Placeholder</span>
                    <span className={styles.cardLabelTag}>no companyLogoUrl</span>
                  </div>
                  <JobCard
                    company="Stealth AI Labs"
                    roleTitle="Founding LLM Systems Engineer"
                    packageLabel="₹60–90 LPA"
                    experience="3+ yrs"
                    location="San Francisco / Remote"
                    commission="₹1,00,000"
                    earningModel="closure"
                    onClaim={() => toast.success("Claimed Stealth role")}
                    onClick={() => toast("Open detail")}
                  />
                </div>
              </div>
            </section>
          </>
        ) : (
          <>
            {/* 1. All 9 Status Variants */}
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>1. All 9 Candidate Status Variants</h2>
                <p className={styles.sectionDesc}>
                  Status tag colors aligned to the reworked Bolt semantic token decisions.
                </p>
              </div>

              <div className={styles.grid}>
                {/* 1. Submitted: neutral */}
                <div className={styles.cardContainer}>
                  <div className={styles.cardLabel}>
                    <span>1. Submitted</span>
                    <span className={styles.cardLabelTag}>status: neutral</span>
                  </div>
                  <CandidateCard
                    candidateName="Aakash Sharma"
                    roleTitle="Full Stack Developer"
                    company="Razorpay"
                    experience="3 yrs"
                    ctcRange="18–24 LPA"
                    noticePeriod="15 days"
                    location="Bengaluru"
                    status="submitted"
                    commission="₹2,000"
                    onAction={() => toast("Add another role")}
                    onClick={() => toast("Open candidate panel")}
                  />
                </div>

                {/* 2. SuperHire review: brand */}
                <div className={styles.cardContainer}>
                  <div className={styles.cardLabel}>
                    <span>2. SuperHire review</span>
                    <span className={styles.cardLabelTag}>status: brand (purple)</span>
                  </div>
                  <CandidateCard
                    candidateName="Vikram Singh"
                    roleTitle="Engineering Manager, Consumer Growth"
                    company="Swiggy"
                    experience="11 yrs"
                    ctcRange="55–75 LPA"
                    noticePeriod="60 days"
                    location="Bengaluru"
                    status="superhire-review"
                    commission="₹2,500"
                    onAction={() => toast("Add another role")}
                    onClick={() => toast("Open candidate panel")}
                  />
                </div>

                {/* 3. Employer review: info */}
                <div className={styles.cardContainer}>
                  <div className={styles.cardLabel}>
                    <span>3. Employer review</span>
                    <span className={styles.cardLabelTag}>status: info (blue)</span>
                  </div>
                  <CandidateCard
                    candidateName="Arjun Kapoor"
                    roleTitle="Staff Software Engineer, Platform"
                    company="Stripe"
                    experience="10 yrs"
                    ctcRange="65–90 LPA"
                    noticePeriod="90 days"
                    location="Remote"
                    status="employer-review"
                    commission="₹90,000"
                    earningModel="closure"
                    onAction={() => toast("Add another role")}
                    onClick={() => toast("Open candidate panel")}
                  />
                </div>

                {/* 4. Shortlisted: info */}
                <div className={styles.cardContainer}>
                  <div className={styles.cardLabel}>
                    <span>4. Shortlisted</span>
                    <span className={styles.cardLabelTag}>status: info (blue)</span>
                  </div>
                  <CandidateCard
                    candidateName="Priya Nair"
                    roleTitle="Senior Backend Engineer, Payments"
                    company="Razorpay"
                    experience="7 yrs"
                    ctcRange="28–40 LPA"
                    noticePeriod="60 days"
                    location="Bengaluru"
                    status="shortlisted"
                    commission="₹2,000"
                    onAction={() => toast("Add another role")}
                    onClick={() => toast("Open candidate panel")}
                  />
                </div>

                {/* 5. Interview: info */}
                <div className={styles.cardContainer}>
                  <div className={styles.cardLabel}>
                    <span>5. Interview</span>
                    <span className={styles.cardLabelTag}>status: info (blue)</span>
                  </div>
                  <CandidateCard
                    candidateName="Rohan Mehta"
                    roleTitle="Senior Frontend Engineer"
                    company="Google"
                    experience="6 yrs"
                    ctcRange="32–45 LPA"
                    noticePeriod="30 days"
                    location="Bengaluru"
                    status="interview"
                    commission="₹2,000"
                    onAction={() => toast("Add another role")}
                    onClick={() => toast("Open candidate panel")}
                  />
                </div>

                {/* 6. Offer: success */}
                <div className={styles.cardContainer}>
                  <div className={styles.cardLabel}>
                    <span>6. Offer</span>
                    <span className={styles.cardLabelTag}>status: success (green)</span>
                  </div>
                  <CandidateCard
                    candidateName="Siddharth Rao"
                    roleTitle="Principal Architect"
                    company="PhonePe"
                    experience="12 yrs"
                    ctcRange="70–95 LPA"
                    noticePeriod="30 days"
                    location="Bengaluru"
                    status="offered"
                    commission="₹1,20,000"
                    earningModel="closure"
                    onAction={() => toast("Add another role")}
                    onClick={() => toast("Open candidate panel")}
                  />
                </div>

                {/* 7. Joined: success */}
                <div className={styles.cardContainer}>
                  <div className={styles.cardLabel}>
                    <span>7. Joined</span>
                    <span className={styles.cardLabelTag}>status: success (green)</span>
                  </div>
                  <CandidateCard
                    candidateName="Sneha Kulkarni"
                    roleTitle="Lead Data Scientist"
                    company="Microsoft"
                    experience="8 yrs"
                    ctcRange="50–65 LPA"
                    noticePeriod="Completed"
                    location="Hyderabad"
                    status="joined"
                    commission="₹80,000"
                    earningModel="closure"
                    onAction={() => toast("Add another role")}
                    onClick={() => toast("Open candidate panel")}
                  />
                </div>

                {/* 8. On hold: warning */}
                <div className={styles.cardContainer}>
                  <div className={styles.cardLabel}>
                    <span>8. On hold</span>
                    <span className={styles.cardLabelTag}>status: warning (yellow)</span>
                  </div>
                  <CandidateCard
                    candidateName="Meera Joshi"
                    roleTitle="Data Analyst, Core Product"
                    company="Notion"
                    experience="2 yrs"
                    ctcRange="14–19 LPA"
                    noticePeriod="15 days"
                    location="Hyderabad"
                    status="on-hold"
                    commission="₹1,500"
                    onAction={() => toast("Add another role")}
                    onClick={() => toast("Open candidate panel")}
                  />
                </div>

                {/* 9. Rejected: danger */}
                <div className={styles.cardContainer}>
                  <div className={styles.cardLabel}>
                    <span>9. Rejected / Closed</span>
                    <span className={styles.cardLabelTag}>status: danger (red)</span>
                  </div>
                  <CandidateCard
                    candidateName="Ananya Reddy"
                    roleTitle="DevOps Engineer"
                    company="Zerodha"
                    experience="4 yrs"
                    ctcRange="20–28 LPA"
                    noticePeriod="30 days"
                    location="Bengaluru"
                    status="rejected"
                    commission="₹2,000"
                    onAction={() => toast("Add another role")}
                    onClick={() => toast("Open candidate panel")}
                  />
                </div>
              </div>
            </section>

            {/* 2. Candidate Interactive States */}
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>2. Card Interactive States</h2>
                <p className={styles.sectionDesc}>
                  Default, Selected in split panel, and Disabled state representations.
                </p>
              </div>

              <div className={styles.grid}>
                <div className={styles.cardContainer}>
                  <div className={styles.cardLabel}>
                    <span>Default Resting</span>
                    <span className={styles.cardLabelTag}>state: default</span>
                  </div>
                  <CandidateCard
                    candidateName="Aditya Verma"
                    roleTitle="Senior iOS Engineer"
                    company="Cred"
                    experience="5 yrs"
                    ctcRange="40–60 LPA"
                    noticePeriod="30 days"
                    location="Bengaluru"
                    status="interview"
                    commission="₹50,000"
                    earningModel="closure"
                    onAction={() => toast("Add another role")}
                    onClick={() => toast("Open candidate panel")}
                  />
                </div>

                <div className={styles.cardContainer}>
                  <div className={styles.cardLabel}>
                    <span>Selected State (Panel Open)</span>
                    <span className={styles.cardLabelTag}>isSelected: true</span>
                  </div>
                  <CandidateCard
                    candidateName="Aditya Verma"
                    roleTitle="Senior iOS Engineer"
                    company="Cred"
                    experience="5 yrs"
                    ctcRange="40–60 LPA"
                    noticePeriod="30 days"
                    location="Bengaluru"
                    status="interview"
                    commission="₹50,000"
                    earningModel="closure"
                    isSelected={selectedCandidateId === "cand-selected"}
                    onAction={() => toast("Add another role")}
                    onClick={() => setSelectedCandidateId((prev) => (prev ? null : "cand-selected"))}
                  />
                </div>

                <div className={styles.cardContainer}>
                  <div className={styles.cardLabel}>
                    <span>Disabled State</span>
                    <span className={styles.cardLabelTag}>disabled: true</span>
                  </div>
                  <CandidateCard
                    candidateName="Aditya Verma"
                    roleTitle="Senior iOS Engineer"
                    company="Cred"
                    experience="5 yrs"
                    ctcRange="40–60 LPA"
                    noticePeriod="30 days"
                    location="Bengaluru"
                    status="interview"
                    commission="₹50,000"
                    earningModel="closure"
                    disabled
                  />
                </div>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
