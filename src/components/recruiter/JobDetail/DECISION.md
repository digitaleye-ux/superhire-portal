# Job detail panel — Editorial Format Specification

**Chosen Structure: Tabbed (two tabs) with Editorial Content Structure.**

A compact header (logo, role, meta in `text-style-label-2`, CTC), two clear tabs (**Job details** and **Company details**), and a sticky footer with recruiter commission and primary claim/submit action.

The design combines the best practices of:
- **Ashby**: Narrative, engaging introductory prose explaining role context, purpose, and impact.
- **Glassdoor**: Clear, familiar bulleted sections that recruiters can scan in seconds.
- **The Ladders**: Strict focus on role expectations and requirements without repeating boilerplate company info.

---

## 1. Content Structure

### Tab 1: Job details
Readable paragraphs where context matters; crisp bullet points where recruiters need to scan.

| Order | Section | Content | Required? |
| :--- | :--- | :--- | :--- |
| **1** | **About the role** | Narrative introduction explaining why the role exists, what the team is building, and expected impact. | Required |
| **2** | **What you'll do** | 4–6 scannable bullet points detailing main responsibilities and deliverables. | Required |
| **3** | **What we're looking for** | Essential experience, core qualifications, and mandatory technical skills. | Required |
| **4** | **Nice to have** | Beneficial but non-essential qualifications, bonus competencies, or tools. | Optional |
| **5** | **Role expectations** | 2-column Spec Sheet with subtle hairlines (Experience, Employment, Work mode, Location, Package range, Notice period), followed by an optional disclaimer footnote. | Required |
| **6** | **Compensation and benefits** | Role-specific compensation breakdown, equity/bonus details, and perks. | Optional |

> **Key Rule**: Avoid separate card containers or tag clouds for responsibilities, skills, or qualifications. Present them as cleanly titled content sections using consistent typography and spatial tokens.

### Tab 2: Company details
Company-level information maintained once on the employer's profile:
1. **About the company** — Overview paragraph describing company mission, scale, and customer base.
2. **Snapshot Spec Sheet** — 2-column structured facts: Industry, Company size, Headquarters, Website, Open jobs, and Valuation (rendered using the Spec Sheet component).
3. **Company culture** — Core operating values and work principles.
4. **Company perks & benefits** — Company-wide benefits (health, insurance, leave, wellness).

---

## 2. Fixed vs. Editable Matrix

| Information | Source | Scope |
| :--- | :--- | :--- |
| Company name & logo | Employer profile | Universal |
| About the company | Employer profile | Universal |
| Industry, size & headquarters | Employer profile | Universal |
| Job title | Individual job | Job-specific |
| Salary / CTC range | Individual job | Job-specific |
| Experience & notice period | Individual job | Job-specific |
| Location & work mode | Individual job | Job-specific |
| About the role | Individual job | Job-specific |
| Responsibilities | Individual job | Job-specific |
| Requirements & Nice-to-have | Individual job | Job-specific |
| Company-wide perks | Employer profile | Universal default |
| Role-specific compensation & perks | Individual job | Optional job override |
| Recruiter commission | SuperHire config | Platform-governed |

---

## 3. Component Decisions

### Role Expectations Layout (decided via `/emil-prototype`)
- **Direction:** Spec Sheet (Variant 3) — Density & Information Hierarchy
- **Architecture:** 2-column key-value rows separated by delicate hairline dividers (`var(--semantics-divider-subtle)`), with `gap: 0 var(--space-8x)`.
- **Typography:**
  - Label: `text-style-label-2` (14px / 20px, Medium), `var(--semantics-text-tertiary)`
  - Value: `text-style-label-2` (14px / 20px, Medium), `var(--semantics-text-primary)`, `font-variant-numeric: tabular-nums`
- **Why it won:** Minimal vertical footprint, removes redundant card borders inside the panel, aligns metrics into an effortless scan path.
- **Rejected Alternatives:**
  - *Variant 1 (Enclosed Grid):* Heavy visual box inside an already bordered panel; created unnecessary visual boundaries.
  - *Variant 2 (Inset Tiles):* Tinted micro-tiles looked modern but introduced too much surface contrast across 6 elements.
  - *Variant 4 (Icon Chips):* Fluid badges lacked structured tabular alignment and took more vertical space.

