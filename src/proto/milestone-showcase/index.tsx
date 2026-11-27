import { useState } from "react";
import { Milestone, MilestoneTimeline } from "@/components/shared/Milestone";
import { Tag } from "@/components/shared/Tag";
import { LinkButton } from "@/components/shared/LinkButton";
import styles from "./showcase.module.css";

export default function MilestoneShowcase() {
  const [activeTab, setActiveTab] = useState<"pipeline" | "variants">("pipeline");

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerTitleArea}>
          <span className={styles.badge}>Bolt Design System</span>
          <h1 className={styles.title}>Milestone Component</h1>
          <p className={styles.subtitle}>
            Progression spine timeline with semantic node variants, connectors,
            Inter typography scale, and accessible milestone tracking.
          </p>
        </div>

        <div className={styles.tabBar}>
          <button
            type="button"
            className={`${styles.tabBtn} ${
              activeTab === "pipeline" ? styles.tabBtnActive : ""
            }`}
            onClick={() => setActiveTab("pipeline")}
          >
            Lifecycle Pipeline (Image Match)
          </button>
          <button
            type="button"
            className={`${styles.tabBtn} ${
              activeTab === "variants" ? styles.tabBtnActive : ""
            }`}
            onClick={() => setActiveTab("variants")}
          >
            All Variants & Edge Cases
          </button>
        </div>
      </header>

      <main className={styles.main}>
        {activeTab === "pipeline" ? (
          <section className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>Hiring journey progression</h2>
              <Tag variant="info" size="md">
                Interview
              </Tag>
            </div>

            <div className={styles.timelineWrapper}>
              <MilestoneTimeline>
                <Milestone
                  step={1}
                  title="Submitted"
                  variant="completed"
                  date="10 Nov"
                  outcome="Profile and verified resume submitted by recruiter."
                  connectorDone
                />
                <Milestone
                  step={2}
                  title="SuperHire review"
                  variant="completed"
                  date="11 Nov"
                  outcome="Vetted by SuperHire and forwarded to Google."
                  connectorDone
                />
                <Milestone
                  step={3}
                  title="Employer review"
                  variant="completed"
                  date="12 Nov"
                  outcome="Shortlisted by Google hiring team."
                  connectorDone
                />
                <Milestone
                  step={4}
                  title="Interviews"
                  variant="current"
                  date="13 Nov · 3:00 PM"
                  description="Cleared Round 1 (Data Structures). Round 2 (System Design) scheduled for Thu, 3:00 PM."
                  connectorDone={false}
                >
                  <div className={styles.actionRow}>
                    <LinkButton variant="brand" size="sm" arrow>
                      View meeting invite
                    </LinkButton>
                  </div>
                </Milestone>
                <Milestone
                  step={5}
                  title="Offer"
                  variant="upcoming"
                  connectorDone={false}
                />
                <Milestone
                  step={6}
                  title="Joined"
                  variant="upcoming"
                  isLast
                />
              </MilestoneTimeline>
            </div>
          </section>
        ) : (
          <div className={styles.grid}>
            {/* Variant 1: All 5 Node States */}
            <section className={styles.card}>
              <h2 className={styles.cardTitle}>1. Semantic Node Variants</h2>
              <p className={styles.cardDesc}>
                5 distinct node states with tokenized colors, strokes, and halos.
              </p>

              <MilestoneTimeline>
                <Milestone
                  step={1}
                  title="Completed milestone"
                  variant="completed"
                  date="Passed"
                  outcome="Solid purple surface with white checkmark icon."
                  connectorDone
                />
                <Milestone
                  step={2}
                  title="Active / Current milestone"
                  variant="current"
                  date="In progress"
                  description="Double-ring bullseye dot with soft lavender halo."
                  connectorDone={false}
                />
                <Milestone
                  step={3}
                  title="Paused / On-hold milestone"
                  variant="warning"
                  badge={<Tag variant="warning" size="sm">On hold</Tag>}
                  date="On hold"
                  description="Amber bullseye node with soft halo ring. Tag explains the outcome."
                  connectorDone={false}
                />
                <Milestone
                  step={4}
                  title="Unsuccessful / Terminal milestone"
                  variant="danger"
                  badge={<Tag variant="danger" size="sm">Application closed</Tag>}
                  date="Closed"
                  description="Danger red bullseye node with soft halo ring. Tag explains the outcome."
                  connectorDone={false}
                />
                <Milestone
                  step={5}
                  title="Upcoming milestone"
                  variant="upcoming"
                  date="Future"
                  isLast
                />
              </MilestoneTimeline>
            </section>

            {/* Variant 2: SuperHire Review active */}
            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>2. SuperHire review in progress</h2>
                <Tag variant="brand" size="md">
                  SuperHire review
                </Tag>
              </div>

              <MilestoneTimeline>
                <Milestone
                  step={1}
                  title="Submitted"
                  variant="completed"
                  date="Today · 9:15 AM"
                  outcome="Profile and verified resume submitted."
                  connectorDone
                />
                <Milestone
                  step={2}
                  title="SuperHire review"
                  variant="current"
                  date="Today · 9:15 AM"
                  description="Under review by SuperHire talent team. Verification completes within 4 hours."
                  connectorDone={false}
                />
                <Milestone
                  step={3}
                  title="Employer review"
                  variant="upcoming"
                  connectorDone={false}
                />
                <Milestone
                  step={4}
                  title="Interviews"
                  variant="upcoming"
                  connectorDone={false}
                />
                <Milestone
                  step={5}
                  title="Offer"
                  variant="upcoming"
                  connectorDone={false}
                />
                <Milestone
                  step={6}
                  title="Joined"
                  variant="upcoming"
                  isLast
                />
              </MilestoneTimeline>
            </section>

            {/* Variant 3: Employer review active */}
            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>3. Employer review in progress</h2>
                <Tag variant="info" size="md">
                  Employer review
                </Tag>
              </div>

              <MilestoneTimeline>
                <Milestone
                  step={1}
                  title="Submitted"
                  variant="completed"
                  date="17 Nov"
                  outcome="Profile and verified resume submitted."
                  connectorDone
                />
                <Milestone
                  step={2}
                  title="SuperHire review"
                  variant="completed"
                  date="17 Nov"
                  outcome="Vetted by SuperHire and forwarded to Stripe."
                  connectorDone
                />
                <Milestone
                  step={3}
                  title="Employer review"
                  variant="current"
                  date="17 Nov · 3:30 PM"
                  description="Under review with Stripe platform team. Shortlist decision expected in 2 business days."
                  connectorDone={false}
                />
                <Milestone
                  step={4}
                  title="Interviews"
                  variant="upcoming"
                  connectorDone={false}
                />
                <Milestone
                  step={5}
                  title="Offer"
                  variant="upcoming"
                  connectorDone={false}
                />
                <Milestone
                  step={6}
                  title="Joined"
                  variant="upcoming"
                  isLast
                />
              </MilestoneTimeline>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
