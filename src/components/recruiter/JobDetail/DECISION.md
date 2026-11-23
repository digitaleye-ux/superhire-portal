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
| **5** | **Role expectations** | 3-column structured metadata grid (Experience, Employment, Work mode, Location, Openings, Notice period) identical in styling to the Company details grid, followed by an illustrative disclaimer footnote. | Required |
| **6** | **Compensation and benefits** | Role-specific compensation breakdown, equity/bonus details, and perks. | Optional |

> **Key Rule**: Avoid separate card containers or tag clouds for responsibilities, skills, or qualifications. Present them as cleanly titled content sections using consistent typography and spatial tokens.

### Tab 2: Company details
Company-level information maintained once on the employer's profile:
1. **About the company** — Overview paragraph describing company mission, scale, and customer base.
2. **Snapshot Grid** — 3-column structured facts: Industry, Company size, Headquarters, Website, Open jobs, and Valuation.
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
