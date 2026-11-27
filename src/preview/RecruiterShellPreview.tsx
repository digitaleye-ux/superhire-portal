import { useEffect, useState } from "react";
import { toast } from "sonner";
import { SideNavbar } from "@/components/shared/SideNavbar";
import type { NavEntry } from "@/components/shared/SideNavbar";
import { Button } from "@/components/shared/Button";
import { PageHeader } from "@/components/shared/PageHeader";
import { JobCard } from "@/components/recruiter/JobCard";
import { JobDetail } from "@/components/recruiter/JobDetail";
import { SubmitCandidate } from "@/components/recruiter/SubmitCandidate";
import type { JobDetailData } from "@/components/recruiter/JobDetail";
import { CandidateCard } from "@/components/recruiter/CandidateCard";
import { CandidateSortFilterBar } from "@/components/recruiter/CandidateSortFilterBar";
import type { CandidateFilterState } from "@/components/recruiter/CandidateSortFilterBar";
import { SelectRoleForCandidate } from "@/components/recruiter/SelectRoleForCandidate";
import type { ClaimedRoleItem } from "@/components/recruiter/SelectRoleForCandidate";
import type { CandidateFormValues } from "@/components/recruiter/SubmitCandidate";
import type { CandidateItem } from "@/proto/candidate-cards/data";
import { DUMMY_CANDIDATE_ITEMS } from "@/proto/candidate-cards/data";
import { buildDetail } from "@/proto/candidate-panel/data";
import {
  buildCandidateProfile,
  saveSubmittedCandidateProfile,
} from "@/proto/candidate-profile/profileData";
import VariantIntegratedSpine from "@/proto/candidate-panel/Variant3Conversation";
import { SortFilterBar } from "@/components/recruiter/SortFilterBar";
import type { FilterState } from "@/components/recruiter/SortFilterBar";
import {
  formatPackage,
  formatLocations,
  locationsTitle,
} from "@/lib/format";
import styles from "./RecruiterShellPreview.module.css";

import logo from "@/components/shared/SideNavbar/assets/logo.svg";
import {
  BriefcaseBusinessIcon,
  CircleCheckBigIcon,
  UsersRoundIcon,
  BookOpenIcon,
  CircleHelpIcon,
  LayoutGridIcon,
  HandCoinsIcon,
} from "@/components/shared/Icon";
import avatar from "@/components/shared/SideNavbar/assets/avatar-sample.png";
import { RecruiterDashboard } from "@/components/recruiter/RecruiterDashboard";
import { RecruiterEarnings } from "@/components/recruiter/RecruiterEarnings";
import type { EarningsNavigationPreset } from "@/components/recruiter/RecruiterEarnings";

const navItems: NavEntry[] = [
  { id: "dashboard", label: "Overview", icon: LayoutGridIcon },
  { id: "explore", label: "Explore", icon: BriefcaseBusinessIcon },
  { id: "claimed", label: "Claimed", icon: CircleCheckBigIcon },
  { id: "track", label: "Track", icon: UsersRoundIcon },
  { id: "earnings", label: "Earnings", icon: HandCoinsIcon },
];

const footerItems: NavEntry[] = [
  { id: "blog", label: "Blog", icon: BookOpenIcon },
  { id: "help", label: "Help", icon: CircleHelpIcon },
];

const emptyFilters: FilterState = {
  commission: [],
  experience: [],
  location: [],
};

const emptyCandidateFilters: CandidateFilterState = {
  status: [],
  company: [],
};

function parseExperienceYears(exp: string): number {
  const match = exp.match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
}

function parseCtcLpa(ctc: string): number {
  const match = ctc.match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
}

function parseCommissionAmount(comm: string): number {
  const clean = comm.replace(/[^\d]/g, "");
  return clean ? parseInt(clean, 10) : 0;
}

function parseSubmittedDays(sub: string): number {
  const lower = sub.toLowerCase();
  if (lower.includes("today") || lower.includes("hour") || lower.includes("h ago")) return 0;
  if (lower.includes("yesterday")) return 1;
  const daysMatch = lower.match(/(\d+)\s*d/);
  if (daysMatch) return parseInt(daysMatch[1], 10);
  const weeksMatch = lower.match(/(\d+)\s*w/);
  if (weeksMatch) return parseInt(weeksMatch[1], 10) * 7;
  return 999;
}

type BadgeKind = "trending" | "priority" | "spotlight" | "just-in" | "closed";

interface DummyJob {
  id: number;
  company: string;
  /** Company domain — used to fetch the real logo. */
  domain: string;
  role: string;
  pkg: { min: number; max: number };
  experience: string;
  locations: string[];
  mode: string;
  jobType: string;
  commission: string;
  earningModel?: "shortlist" | "closure";
  badge?: BadgeKind;
}

/** Real company logo by domain (Google favicon service; falls back in-card). */
function logoUrl(domain: string): string {
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
}

/** Dummy jobs to fill the Explore grid. */
const DUMMY_JOBS: DummyJob[] = [
  // 1-line title
  { id: 1, company: "Google", domain: "google.com", role: "Senior Frontend Engineer", pkg: { min: 3200000, max: 4800000 }, experience: "5–8 yrs", locations: ["Bengaluru"], mode: "On-site", jobType: "Full-time", commission: "₹2,000", earningModel: "shortlist", badge: "trending" },
  // 2-line title
  { id: 2, company: "Razorpay", domain: "razorpay.com", role: "Senior Backend Engineer, Payments Platform", pkg: { min: 2800000, max: 4200000 }, experience: "5–8 yrs", locations: ["Bengaluru", "Hyderabad", "Pune", "Remote"], mode: "Hybrid", jobType: "Full-time", commission: "₹2,000", earningModel: "shortlist", badge: "spotlight" },
  // long title — overflows 2 lines, should truncate with ellipsis
  { id: 3, company: "Stripe", domain: "stripe.com", role: "Staff Software Engineer, Payments Reliability & Developer Experience Platform", pkg: { min: 6000000, max: 8000000 }, experience: "9+ yrs", locations: ["Remote"], mode: "Remote", jobType: "Full-time", commission: "₹90,000", earningModel: "closure", badge: "priority" },
  { id: 4, company: "Atlassian", domain: "atlassian.com", role: "Product Designer, Design Systems & Core Workflows", pkg: { min: 2400000, max: 3600000 }, experience: "3–5 yrs", locations: ["Remote"], mode: "Remote", jobType: "Contract", commission: "₹39,000", earningModel: "closure" },
  // 2-line title
  { id: 5, company: "Swiggy", domain: "swiggy.com", role: "Engineering Manager, Consumer Growth", pkg: { min: 5500000, max: 7500000 }, experience: "9+ yrs", locations: ["Bengaluru"], mode: "On-site", jobType: "Full-time", commission: "₹2,500", earningModel: "shortlist", badge: "just-in" },
  { id: 6, company: "Zerodha", domain: "zerodha.com", role: "DevOps Engineer", pkg: { min: 2000000, max: 2800000 }, experience: "3–5 yrs", locations: ["Bengaluru", "Remote"], mode: "Hybrid", jobType: "Full-time", commission: "₹2,000", earningModel: "shortlist" },
  { id: 7, company: "Notion", domain: "notion.so", role: "Data Analyst, Core Product", pkg: { min: 1400000, max: 2000000 }, experience: "1–2 yrs", locations: ["Hyderabad"], mode: "On-site", jobType: "Full-time", commission: "₹1,800", earningModel: "shortlist" },
  { id: 8, company: "Figma", domain: "figma.com", role: "Design Systems Engineer", pkg: { min: 3500000, max: 5000000 }, experience: "6–8 yrs", locations: ["Remote"], mode: "Remote", jobType: "Full-time", commission: "₹55,000", earningModel: "closure", badge: "trending" },
  // 2-line title
  { id: 9, company: "Linear", domain: "linear.app", role: "Senior Full-Stack Product Engineer", pkg: { min: 2600000, max: 3800000 }, experience: "3–5 yrs", locations: ["Remote", "Bengaluru"], mode: "Hybrid", jobType: "Full-time", commission: "₹42,000", earningModel: "closure", badge: "spotlight" },
  { id: 10, company: "Freshworks", domain: "freshworks.com", role: "QA Automation Engineer", pkg: { min: 1200000, max: 1800000 }, experience: "1–2 yrs", locations: ["Chennai"], mode: "On-site", jobType: "Full-time", commission: "₹1,500", earningModel: "shortlist" },
  { id: 11, company: "Postman", domain: "postman.com", role: "Developer Advocate", pkg: { min: 2200000, max: 3000000 }, experience: "3–5 yrs", locations: ["Bengaluru", "Remote"], mode: "Hybrid", jobType: "Full-time", commission: "₹2,000", earningModel: "shortlist" },
  { id: 12, company: "Cred", domain: "cred.club", role: "iOS Engineer", pkg: { min: 3000000, max: 4500000 }, experience: "5–8 yrs", locations: ["Bengaluru"], mode: "On-site", jobType: "Full-time", commission: "₹50,000", earningModel: "closure", badge: "priority" },
  // 2-line title
  { id: 13, company: "Meesho", domain: "meesho.com", role: "Machine Learning Engineer, Recommendations", pkg: { min: 2800000, max: 4200000 }, experience: "4–7 yrs", locations: ["Bengaluru", "Remote"], mode: "Hybrid", jobType: "Full-time", commission: "₹2,000", earningModel: "shortlist", badge: "just-in" },
  { id: 14, company: "Groww", domain: "groww.in", role: "Backend Engineer", pkg: { min: 2400000, max: 3400000 }, experience: "3–5 yrs", locations: ["Bengaluru"], mode: "On-site", jobType: "Full-time", commission: "₹2,000", earningModel: "shortlist" },
  { id: 15, company: "Zomato", domain: "zomato.com", role: "Product Manager", pkg: { min: 4000000, max: 6000000 }, experience: "6–8 yrs", locations: ["Gurugram"], mode: "On-site", jobType: "Full-time", commission: "₹65,000", earningModel: "closure" },
  { id: 16, company: "PhonePe", domain: "phonepe.com", role: "Site Reliability Engineer", pkg: { min: 3200000, max: 4600000 }, experience: "5–8 yrs", locations: ["Bengaluru", "Pune"], mode: "Hybrid", jobType: "Full-time", commission: "₹2,000", earningModel: "shortlist", badge: "trending" },
  { id: 17, company: "Dunzo", domain: "dunzo.in", role: "Frontend Engineer", pkg: { min: 1600000, max: 2400000 }, experience: "1–2 yrs", locations: ["Remote"], mode: "Remote", jobType: "Contract", commission: "₹1,800", earningModel: "shortlist" },
  { id: 18, company: "BrowserStack", domain: "browserstack.com", role: "Technical Writer", pkg: { min: 1200000, max: 1600000 }, experience: "1–2 yrs", locations: ["Remote"], mode: "Remote", jobType: "Part-time", commission: "₹1,500", earningModel: "shortlist", badge: "closed" },
];

function defaultSkillsForRole(role: string): string[] {
  const r = role.toLowerCase();
  if (r.includes("frontend") || r.includes("full-stack") || r.includes("design systems engineer")) {
    return [
      "React",
      "TypeScript",
      "JavaScript",
      "Frontend Architecture",
      "Performance Optimization",
      "Web Accessibility (a11y)",
      "State Management",
      "REST / GraphQL",
      "Design Systems",
      "Testing & CI/CD",
    ];
  }
  if (r.includes("backend") || r.includes("platform")) {
    return [
      "Node.js / Go / Java",
      "Distributed Systems",
      "PostgreSQL",
      "Kafka / Event Streaming",
      "Microservices Architecture",
      "REST & gRPC APIs",
      "High Concurrency",
      "Redis / Caching",
      "System Design",
      "Docker & Kubernetes",
    ];
  }
  if (r.includes("designer") || r.includes("design")) {
    return [
      "Figma",
      "Design Systems",
      "User Research",
      "Interaction Design",
      "Rapid Prototyping",
      "Visual Design",
      "Wireframing",
      "Usability Testing",
      "Design Review Leadership",
      "Product Strategy",
    ];
  }
  if (r.includes("product manager") || r.includes("pm")) {
    return [
      "Product Strategy",
      "Roadmap Planning",
      "Data Analytics & SQL",
      "User Research",
      "A/B Testing",
      "Growth Metrics",
      "Cross-Functional Leadership",
      "Stakeholder Management",
      "Agile / Scrum",
    ];
  }
  if (r.includes("devops") || r.includes("infrastructure") || r.includes("reliability") || r.includes("sre")) {
    return [
      "Kubernetes",
      "Terraform / IaC",
      "AWS / GCP",
      "CI/CD Pipelines",
      "Docker",
      "Prometheus & Grafana",
      "Site Reliability (SRE)",
      "Linux Systems",
      "Incident Management",
      "Networking & Security",
    ];
  }
  if (r.includes("ios") || r.includes("android") || r.includes("mobile")) {
    return [
      "Swift / Kotlin",
      "Mobile Architecture",
      "Jetpack Compose / SwiftUI",
      "Coroutines & Concurrency",
      "Performance Profiling",
      "REST APIs",
      "Offline Storage",
      "Unit & UI Testing",
      "App Store / Play Store Deployment",
    ];
  }
  if (r.includes("machine learning") || r.includes("data") || r.includes("ai")) {
    return [
      "Python",
      "Machine Learning",
      "SQL",
      "Feature Engineering",
      "Data Modeling",
      "Deep Learning",
      "Apache Spark",
      "Recommendation Systems",
      "A/B Testing",
      "Statistical Analysis",
    ];
  }
  if (r.includes("qa") || r.includes("test")) {
    return [
      "Test Automation",
      "Selenium / Playwright",
      "Cypress",
      "API Testing (Postman)",
      "CI/CD Integration",
      "Performance Testing",
      "Regression Testing",
      "Bug Tracking & Triage",
    ];
  }
  return [
    "Technical Communication",
    "System Design",
    "Problem Solving",
    "Critical Thinking",
    "Initiative and Independent Work",
    "Design Review Leadership",
    "Agile / Scrum",
    "Code Quality & Testing",
  ];
}

/** Build a populated JobDetailData from a dummy job (editorial demo content). */
function detailFor(job: DummyJob): JobDetailData {
  const isGoogle = job.id === 1;

  if (isGoogle) {
    return {
      id: job.id,
      company: job.company,
      companyLogoUrl: logoUrl(job.domain),
      role: job.role,
      packageLabel: formatPackage(job.pkg),
      commission: job.commission,
      earningModel: job.earningModel,
      jobType: job.jobType,
      mode: job.mode,
      location: formatLocations(job.locations),
      locationFull: locationsTitle(job.locations),
      experience: job.experience,
      noticePeriod: "Immediate – 30 days",
      openings: 3,
      skills: [
        "React",
        "TypeScript",
        "JavaScript",
        "Frontend Architecture",
        "Performance Optimization",
        "Web Accessibility (a11y)",
        "State Management",
        "REST / GraphQL",
        "Design Systems",
        "Testing & CI/CD",
      ],
      aboutRole:
        "We're looking for a Senior Frontend Engineer to help build reliable, high-performance products used by millions of people. You'll work closely with engineering, product, and design teams to turn complex problems into intuitive experiences.",
      responsibilities: [
        "Lead the development of scalable frontend applications.",
        "Build and maintain reusable UI components and architecture.",
        "Collaborate with product and design teams to deliver new features.",
        "Improve application performance, accessibility, and code quality.",
        "Mentor engineers and contribute to technical decisions.",
      ],
      requirements: [
        "5+ years of experience in frontend development.",
        "Strong proficiency in React, JavaScript, and TypeScript.",
        "Experience building and maintaining production-grade web applications.",
        "Understanding of frontend architecture, testing, and performance optimization.",
        "Strong problem-solving and collaboration skills.",
      ],
      niceToHave: [
        "Experience with Node.js.",
        "Familiarity with cloud platforms and CI/CD.",
        "Experience working on large-scale consumer products.",
      ],
      compensationAndBenefits: [
        `Base package: ${formatPackage(job.pkg)} with performance-linked annual bonus.`,
        "Google equity units (GSUs) vesting over 4 years.",
        "Comprehensive health, dental, and life coverage for candidate and family.",
        "Annual learning stipend, wellness allowance, and home-office equipment grant.",
      ],
      companyInfo: {
        openJobs: "1,200+",
        domain: "Technology, Internet, AI",
        businessModel: "B2C & B2B",
        employees: "150,000+",
        valuation: "~$2.1T USD",
        established: "1998",
        headquarters: "Mountain View, CA",
        website: "google.com",
        about:
          "Google's mission is to organize the world's information and make it universally accessible and useful. We build products used by billions across Search, Maps, Cloud, Android, and Gemini AI.",
        culture: [
          "User-first thinking with high agency and curiosity",
          "Open, collaborative culture focused on solving hard scale problems",
          "Strong psychological safety and peer mentorship",
          "High standard for technical craftsmanship and reliability",
        ],
        perks: [
          "Industry-leading compensation and equity",
          "Comprehensive health & parental benefits",
          "Gourmet meals, barista bars, and micro-kitchens",
          "Generous learning, conference, and wellness budgets",
        ],
      },
    };
  }

  // Generic editorial content generator for other roles
  return {
    id: job.id,
    company: job.company,
    companyLogoUrl: logoUrl(job.domain),
    role: job.role,
    packageLabel: formatPackage(job.pkg),
    commission: job.commission,
    earningModel: job.earningModel,
    jobType: job.jobType,
    mode: job.mode,
    location: formatLocations(job.locations),
    locationFull: locationsTitle(job.locations),
    experience: job.experience,
    noticePeriod: "Immediate – 30 days",
    openings: 2,
    skills: defaultSkillsForRole(job.role),
    aboutRole: `We're looking for a ${job.role} at ${job.company} to design, build, and scale core systems. You'll partner with engineering, product, and design to ship reliable, high-impact features used by thousands of customers daily.`,
    responsibilities: [
      `Own and ship core features for the ${job.role.toLowerCase()} roadmap end to end.`,
      "Collaborate across product, design, and infrastructure teams to scope and sequence work.",
      "Raise the bar on software reliability, testing, documentation, and operational excellence.",
      "Mentor team members and contribute to technical architectural choices.",
    ],
    requirements: [
      `${job.experience} of relevant industry experience in software engineering or design.`,
      `Demonstrated proficiency in modern software engineering principles and core technologies.`,
      "Track record of designing, delivering, and maintaining production systems.",
      "Strong problem-solving, analytical, and cross-functional communication skills.",
    ],
    niceToHave: [
      "Experience working in high-growth B2B SaaS or fintech environments.",
      "Familiarity with distributed systems, modern cloud infrastructure, and CI/CD pipelines.",
      "Contributions to open-source software or engineering blogs.",
    ],
    compensationAndBenefits: [
      `Competitive compensation: ${formatPackage(job.pkg)}.`,
      `Recruiter placement commission: ${job.commission} upon candidate onboarding.`,
      "Comprehensive medical insurance for candidate and dependents.",
      "Flexible working hours and annual professional development stipend.",
    ],
    companyInfo: {
      openJobs: "850+",
      domain: "Technology, SaaS, Internet",
      businessModel: "B2B & B2C",
      employees: "2,500+",
      valuation: "~$4.5B USD",
      established: "2015",
      headquarters:
        job.company === "Atlassian"
          ? "Sydney, Australia"
          : job.company === "Stripe"
          ? "San Francisco, CA"
          : job.company === "Figma"
          ? "San Francisco, CA"
          : job.company === "Notion"
          ? "San Francisco, CA"
          : "Bengaluru, India",
      website: job.domain,
      about: `${job.company} builds products used by millions of people, with a high-ownership engineering culture and a focus on solving complex problems at scale.`,
      culture: [
        "Data-driven, customer-obsessed decision making",
        "High autonomy with extreme ownership",
        "Fast feedback loops and high speed of iteration",
        "Collaborative, respectful cross-functional teams",
      ],
      perks: [
        "Competitive compensation + equity grants",
        "Comprehensive health & parental insurance",
        "Flexible hybrid work policy",
        "Annual learning, conference & wellness stipend",
      ],
    },
  };
}

function buildInitialCandidateValues(c: CandidateItem): Partial<CandidateFormValues> {
  const detail = buildDetail(c);
  const profile = buildCandidateProfile(detail);
  const expMatch = c.experience.match(/[\d.]+/);
  const curCtcMatch = c.currentCtc.match(/[\d.]+/);
  const expCtcMatch = c.expectedCtc.match(/[\d.]+/);
  const mockResume =
    typeof File !== "undefined"
      ? new File(
          ["Candidate resume on file"],
          profile.resumeFileName || detail.resumeName || `${c.name.replace(/\s+/g, "_")}_Resume.pdf`,
          { type: "application/pdf" }
        )
      : null;

  const portfolioLink = profile.links.find((l) => l.label.toLowerCase() === "portfolio");

  return {
    name: c.name,
    email: detail.email || `${c.name.toLowerCase().replace(/\s+/g, ".")}@gmail.com`,
    phoneCode: "+91",
    phone: detail.phone.replace(/[^\d]/g, "").slice(-10) || "9845061834",
    location: profile.location || `${c.location}, India`,
    workModePreference: profile.workModePreference || "Any",
    experience: expMatch ? expMatch[0] : "5",
    working: "Yes",
    company: detail.designation.includes(" at ") ? detail.designation.split(" at ")[1] : "Zeta",
    currentCtc: curCtcMatch ? curCtcMatch[0] : "32",
    expectedCtc: expCtcMatch ? expCtcMatch[0] : "45",
    notice: c.noticePeriod || "30 days",
    noticeNegotiable: "Yes",
    education: "BE/B.Tech from Tier 1 College (IIT, BITS, NIT, DTU etc)",
    educationList: profile.education.map((edu) => {
      const [startYear = "2016", endYear = "2020"] = edu.duration.split(/\s*[–-]\s*/);
      return {
        id: edu.id,
        degree: edu.degree,
        institution: edu.institution,
        startYear: startYear.trim(),
        endYear: endYear.trim(),
        location: edu.location,
        grade: edu.grade,
      };
    }),
    workExperienceList: profile.workExperience.map((exp) => {
      const [startDate = "Jan 2022", endDate = "Present"] = exp.duration.split(/\s*[–-]\s*/);
      return {
        id: exp.id,
        role: exp.role,
        company: exp.company,
        startDate: startDate.trim(),
        endDate: endDate.trim(),
        location: exp.location,
        workMode: "Hybrid",
        isCurrent: Boolean(exp.current) || endDate.trim().toLowerCase() === "present",
        highlightsText: exp.highlights.join("\n"),
      };
    }),
    projectsList: profile.projects.map((proj) => ({
      id: proj.id,
      title: proj.title,
      subtitle: proj.subtitle,
      description: proj.description,
    })),
    certificationsList: profile.certifications.map((cert) => ({
      id: cert.id,
      name: cert.name,
      issuer: cert.issuer,
      issuedDate: cert.issuedDate,
      credentialId: cert.credentialId,
    })),
    skillsList: profile.skills,
    linkedin: `linkedin.com/in/${c.name.toLowerCase().replace(/\s+/g, "-")}`,
    github: c.github ? c.github.replace(/^https?:\/\//, "") : `github.com/${c.name.toLowerCase().replace(/\s+/g, "-")}`,
    portfolio: portfolioLink ? portfolioLink.handle : `${c.name.toLowerCase().replace(/\s+/g, "-")}.dev`,
    resume: mockResume,
    verifiedRequirements: [],
    remarks: "",
  };
}

const DEFAULT_CLAIMED_JOB_IDS = [2, 4, 8, 12];

export function RecruiterShellPreview({
  initialTab,
}: {
  initialTab?:
    | "dashboard"
    | "overview"
    | "explore"
    | "claimed"
    | "track"
    | "earnings";
} = {}) {
  const [candidates, setCandidates] = useState<CandidateItem[]>(DUMMY_CANDIDATE_ITEMS);
  const [addRoleCandidate, setAddRoleCandidate] = useState<CandidateItem | null>(null);
  const [addRoleJob, setAddRoleJob] = useState<DummyJob | null>(null);
  const [editingCandidate, setEditingCandidate] = useState<CandidateItem | null>(null);
  const [earningsPreset, setEarningsPreset] =
    useState<EarningsNavigationPreset | null>(null);
  const [active, setActive] = useState<string>(() => {
    if (initialTab) return initialTab === "overview" ? "dashboard" : initialTab;
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get("tab") || params.get("page");
      if (
        tab === "dashboard" ||
        tab === "overview" ||
        tab === "claimed" ||
        tab === "explore" ||
        tab === "track" ||
        tab === "earnings"
      )
        return tab === "overview" ? "dashboard" : tab;
    }
    return "dashboard";
  });
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<FilterState>(emptyFilters);
  const [sort, setSort] = useState("recommended");
  const [candidateFilters, setCandidateFilters] = useState<CandidateFilterState>(emptyCandidateFilters);
  const [candidateSort, setCandidateSort] = useState("newest");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [panelMode, setPanelMode] = useState<"detail" | "submit">("detail");
  const [claimedJobIds, setClaimedJobIds] = useState<number[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("claimedJobIds");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch {
        // ignore
      }
    }
    return DEFAULT_CLAIMED_JOB_IDS;
  });

  // Load claimed job IDs from localStorage on mount (seed defaults if empty)
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("claimedJobIds");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setClaimedJobIds(parsed);
            return;
          }
        }
        localStorage.setItem("claimedJobIds", JSON.stringify(DEFAULT_CLAIMED_JOB_IDS));
        setClaimedJobIds(DEFAULT_CLAIMED_JOB_IDS);
      } catch {
        setClaimedJobIds(DEFAULT_CLAIMED_JOB_IDS);
      }
    }
  }, []);

  // Persist claimed job IDs whenever they change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("claimedJobIds", JSON.stringify(claimedJobIds));
    }
  }, [claimedJobIds]);

  // Close Add Another Role overlay on Escape
  useEffect(() => {
    if (!addRoleCandidate) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setAddRoleCandidate(null);
        setAddRoleJob(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [addRoleCandidate]);

  const isDashboard = active === "dashboard";
  const isEarnings = active === "earnings";
  const isClaimed = active === "claimed";
  const isTrack = active === "track";

  const pageTitle = isTrack ? "Track candidates" : isClaimed ? "Claimed roles" : "Explore roles";
  const actionLabel = isClaimed ? "Submit candidate" : "Claim role";

  const handleNavSelect = (id: string) => {
    setActive(id);
    setSelectedId(null);
    setAddRoleCandidate(null);
    setAddRoleJob(null);
    setEditingCandidate(null);
    setPanelMode("detail");
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("tab", id);
      window.history.replaceState({}, "", url.toString());
    }
  };

  const navigateToEarnings = (preset?: EarningsNavigationPreset) => {
    setEarningsPreset(preset ?? null);
    setActive("earnings");
    setSelectedId(null);
    setAddRoleCandidate(null);
    setAddRoleJob(null);
    setEditingCandidate(null);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("tab", "earnings");
      window.history.replaceState({}, "", url.toString());
    }
  };

  /** Never open side panel on overview; always route directly to relevant section */
  const navigateToCandidate = (
    candidateId: number,
    editCand: CandidateItem | null = null
  ) => {
    setActive("track");
    setSelectedId(candidateId);
    setEditingCandidate(editCand);
    setAddRoleCandidate(null);
    setAddRoleJob(null);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("tab", "track");
      window.history.replaceState({}, "", url.toString());
    }
  };

  const navigateToJob = (jobId: number) => {
    setActive("explore");
    setSelectedId(jobId);
    setPanelMode("detail");
    setEditingCandidate(null);
    setAddRoleCandidate(null);
    setAddRoleJob(null);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("tab", "explore");
      window.history.replaceState({}, "", url.toString());
    }
  };

  function findJobForCandidate(candidate: CandidateItem): DummyJob {
    const byExact = DUMMY_JOBS.find(
      (j) =>
        j.company.toLowerCase() === candidate.company.toLowerCase() &&
        j.role.toLowerCase() === candidate.role.toLowerCase()
    );
    if (byExact) return byExact;
    const byCompany = DUMMY_JOBS.find(
      (j) => j.company.toLowerCase() === candidate.company.toLowerCase()
    );
    if (byCompany) return byCompany;
    return DUMMY_JOBS[0];
  }

  const handleEditCandidate = (c: CandidateItem) => {
    setEditingCandidate(c);
    setSelectedId(c.id);
    setAddRoleCandidate(null);
    setAddRoleJob(null);
  };

  const handleUpdateCandidate = (
    candidateId: number,
    values: CandidateFormValues
  ) => {
    const expClean = values.experience?.trim() || "5";
    const expFormatted = expClean.includes("yr") ? expClean : `${expClean} yrs`;
    const candidateName = values.name?.trim() || "Candidate";
    const initials =
      candidateName
        .split(/\s+/)
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    setCandidates((prev) =>
      prev.map((item) => {
        if (item.id !== candidateId) return item;
        return {
          ...item,
          name: candidateName,
          initials,
          experience: expFormatted,
          noticePeriod: values.notice || item.noticePeriod,
          location: values.location?.split(",")[0]?.trim() || item.location,
          currentCtc: values.currentCtc ? `₹${values.currentCtc} LPA` : item.currentCtc,
          expectedCtc: values.expectedCtc ? `₹${values.expectedCtc} LPA` : item.expectedCtc,
          topSkills:
            values.skillsList && values.skillsList.length > 0
              ? values.skillsList.slice(0, 4)
              : item.topSkills,
          github: values.github
            ? values.github.startsWith("http")
              ? values.github
              : `https://${values.github}`
            : item.github,
        };
      })
    );

    saveSubmittedCandidateProfile(candidateId, values);
    toast.success(`Candidate details updated`, {
      description: `Saved changes to ${candidateName}'s profile.`,
    });
  };

  const isSplit = !isDashboard && !isEarnings && selectedId !== null;
  const selectedJob =
    !isDashboard && !isEarnings && !isTrack
      ? DUMMY_JOBS.find((j) => j.id === selectedId) ?? null
      : null;
  const selectedCandidate =
    !isDashboard && !isEarnings && isTrack
      ? candidates.find((c) => c.id === selectedId) ?? null
      : null;

  // In "claimed" mode, filter to only show jobs that have been claimed
  const claimedJobsList: ClaimedRoleItem[] = DUMMY_JOBS
    .filter((j) => claimedJobIds.includes(j.id))
    .map((j) => ({
      id: j.id,
      company: j.company,
      domain: j.domain,
      role: j.role,
      packageLabel: formatPackage(j.pkg),
      experience: j.experience,
      location: formatLocations(j.locations),
      mode: j.mode,
      jobType: j.jobType,
      commission: j.commission,
      earningModel: j.earningModel,
      badge: j.badge,
    }));

  const handleCreateCandidateSubmission = (
    values: CandidateFormValues,
    sourceCandidate: CandidateItem | null,
    targetJob: DummyJob
  ) => {
    const expClean = values.experience?.trim() || sourceCandidate?.experience || "5";
    const expFormatted = expClean.includes("yr") ? expClean : `${expClean} yrs`;
    const candidateName = values.name?.trim() || sourceCandidate?.name || "Candidate";
    const initials =
      sourceCandidate?.initials ||
      candidateName
        .split(/\s+/)
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    const newCandidate: CandidateItem = {
      id: Date.now(),
      name: candidateName,
      initials,
      company: targetJob.company,
      domain: targetJob.domain,
      role: targetJob.role,
      experience: expFormatted,
      noticePeriod: values.notice || sourceCandidate?.noticePeriod || "30 days",
      location: values.location?.split(",")[0]?.trim() || formatLocations(targetJob.locations),
      currentCtc: values.currentCtc ? `₹${values.currentCtc} LPA` : sourceCandidate?.currentCtc || "₹30 LPA",
      expectedCtc: values.expectedCtc ? `₹${values.expectedCtc} LPA` : sourceCandidate?.expectedCtc || "₹42 LPA",
      status: "submitted",
      stageName: "Application Dispatched",
      stageSubtext: "Pending employer acknowledgment",
      stageDuration: "Submitted just now",
      commission: targetJob.commission,
      commissionLabel: targetJob.earningModel === "closure" ? "closure payout on joining + 1 mo" : "shortlist payout",
      earningModel: targetJob.earningModel,
      submitted: "Submitted today",
      matchScore: sourceCandidate?.matchScore || "94% Match",
      topSkills:
        values.skillsList && values.skillsList.length > 0
          ? values.skillsList.slice(0, 4)
          : sourceCandidate?.topSkills || ["TypeScript", "React", "System Design"],
      github: values.github
        ? values.github.startsWith("http")
          ? values.github
          : `https://${values.github}`
        : sourceCandidate?.github,
    };

    saveSubmittedCandidateProfile(newCandidate.id, values);
    setCandidates((prev) => [newCandidate, ...prev]);

    if (sourceCandidate) {
      toast.success(`Candidate submitted for ${targetJob.role}`, {
        description: `Submitted ${candidateName} to ${targetJob.company}. Tracking application on Track page.`,
      });
      setAddRoleCandidate(null);
      setAddRoleJob(null);
      setSelectedId(newCandidate.id);
    } else {
      toast.success(`Submitted ${candidateName} to ${targetJob.company}`, {
        description: `Profile saved — view full details under Track candidates.`,
      });
    }
  };

  const visibleJobs = DUMMY_JOBS.filter((job) => {
    if (isClaimed) {
      // Only show jobs in the claimed list
      if (!claimedJobIds.includes(job.id)) return false;
    } else {
      // In explore mode, exclude jobs that have already been claimed
      if (claimedJobIds.includes(job.id)) return false;
    }

    if (query.trim()) {
      const q = query.toLowerCase();
      const matches =
        job.role.toLowerCase().includes(q) ||
        job.company.toLowerCase().includes(q) ||
        job.locations.some((l) => l.toLowerCase().includes(q)) ||
        job.mode.toLowerCase().includes(q);
      if (!matches) return false;
    }

    // Commission filter: empty = all models; "shortlist" or "closure" isolates model
    if (filters.commission.length > 0) {
      const wantShortlist = filters.commission.includes("shortlist");
      const wantClosure = filters.commission.includes("closure");
      const model = job.earningModel || "shortlist";
      if (wantShortlist && model !== "shortlist") return false;
      if (wantClosure && model !== "closure") return false;
    }

    // Experience filter
    if (filters.experience.length > 0) {
      const expYears = parseExperienceYears(job.experience);
      const matchesExp = filters.experience.some((range) => {
        if (range === "0") return expYears === 0;
        if (range === "1-2") return expYears >= 1 && expYears <= 2;
        if (range === "3-5") return expYears >= 3 && expYears <= 5;
        if (range === "6-8") return expYears >= 6 && expYears <= 8;
        if (range === "9+") return expYears >= 9;
        return true;
      });
      if (!matchesExp) return false;
    }

    // Location filter
    if (filters.location.length > 0) {
      const matchesLoc = filters.location.some((loc) => {
        if (loc === "remote") {
          return (
            job.mode.toLowerCase() === "remote" ||
            job.locations.some((l) => l.toLowerCase() === "remote")
          );
        }
        return job.locations.some((l) => l.toLowerCase().includes(loc));
      });
      if (!matchesLoc) return false;
    }

    return true;
  }).sort((a, b) => {
    switch (sort) {
      case "newest":
        return b.id - a.id;
      case "oldest":
        return a.id - b.id;
      case "highest-commission":
        return parseCommissionAmount(b.commission) - parseCommissionAmount(a.commission);
      case "highest-salary":
        return b.pkg.max - a.pkg.max;
      case "recommended":
      default:
        return 0;
    }
  });

  // Visible candidates filtered by query and candidateFilters, sorted by candidateSort
  const visibleCandidates = candidates.filter((c) => {
    // 1. Search query
    const q = query.trim().toLowerCase();
    if (q) {
      const matchesSearch =
        c.name.toLowerCase().includes(q) ||
        c.company.toLowerCase().includes(q) ||
        c.role.toLowerCase().includes(q) ||
        c.location.toLowerCase().includes(q) ||
        c.status.toLowerCase().includes(q) ||
        c.topSkills.some((s) => s.toLowerCase().includes(q));
      if (!matchesSearch) return false;
    }

    // 2. Status filter
    if (candidateFilters.status.length > 0) {
      const match = candidateFilters.status.some((st) => {
        if (st === "employer-review" && (c.status === "employer-review" || c.status === "under-review")) return true;
        return c.status === st;
      });
      if (!match) return false;
    }

    // 3. Company filter
    if (candidateFilters.company.length > 0) {
      if (!candidateFilters.company.includes(c.company)) return false;
    }

    return true;
  }).sort((a, b) => {
    switch (candidateSort) {
      case "newest":
        return parseSubmittedDays(a.submitted) - parseSubmittedDays(b.submitted);
      case "oldest":
        return parseSubmittedDays(b.submitted) - parseSubmittedDays(a.submitted);
      case "name-asc":
        return a.name.localeCompare(b.name);
      case "name-desc":
        return b.name.localeCompare(a.name);
      case "ctc-desc":
        return parseCtcLpa(b.expectedCtc) - parseCtcLpa(a.expectedCtc);
      case "ctc-asc":
        return parseCtcLpa(a.expectedCtc) - parseCtcLpa(b.expectedCtc);
      case "exp-desc":
        return parseExperienceYears(b.experience) - parseExperienceYears(a.experience);
      case "commission-desc":
        return parseCommissionAmount(b.commission) - parseCommissionAmount(a.commission);
      default:
        return 0;
    }
  });

  // Claim or unclaim a job
  const claimJob = (job: DummyJob) => {
    if (!claimedJobIds.includes(job.id)) {
      // Add to claimed list (simulating a claim)
      setClaimedJobIds((prev: number[]) => [...new Set([...prev, job.id])]);
      toast.success(`Claimed: ${job.role}`, { duration: 3000 });
    } else {
      // Remove from claimed list (unclaim)
      setClaimedJobIds((prev: number[]) => prev.filter(id => id !== job.id));
      toast.error(`Unclaimed: ${job.role} - Return to Explore roles page to re-claim`, { duration: 3000 });
    }
  };

  const unclaimJob = (job: DummyJob) => {
    setClaimedJobIds((prev: number[]) => prev.filter((id) => id !== job.id));
    if (selectedId === job.id) setSelectedId(null);
    toast(`Unclaimed: ${job.role}`, {
      description: `Moved back to Explore roles.`,
      action: {
        label: "Undo",
        onClick: () => {
          setClaimedJobIds((prev: number[]) => [...new Set([...prev, job.id])]);
          toast.success(`Re-claimed: ${job.role}`);
        },
      },
    });
  };

  const copyJobLink = (job: DummyJob) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://superhire.com";
    const path = typeof window !== "undefined" ? window.location.pathname : "";
    const url = `${origin}${path}?tab=explore&job=${job.id}`;
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(url).catch(() => {});
    }
    toast.success("Job link copied", {
      description: `${job.role} at ${job.company} link copied to clipboard.`,
    });
  };

  const downloadJobDescription = (job: DummyJob) => {
    const detail = detailFor(job);
    const content = [
      `JOB DESCRIPTION: ${detail.role}`,
      `Company: ${detail.company}`,
      `Package: ${detail.packageLabel}`,
      `Experience: ${detail.experience}`,
      `Location: ${detail.locationFull || detail.location} (${detail.mode})`,
      `Openings: ${detail.openings}`,
      "",
      ...(detail.skills && detail.skills.length > 0
        ? ["SKILLS:", ...detail.skills.map((s) => `• ${s}`), ""]
        : []),
      "ABOUT THE ROLE:",
      detail.aboutRole || detail.overview || "",
      "",
      "WHAT YOU'LL DO:",
      ...(detail.responsibilities || []).map((r) => `• ${r}`),
      "",
      "WHAT WE'RE LOOKING FOR:",
      ...(detail.requirements || []).map((req) => `• ${req}`),
      "",
      "ROLE EXPECTATIONS:",
      `• Experience: ${detail.experience}`,
      `• Employment: ${detail.jobType}`,
      `• Work mode: ${detail.mode}`,
      `• Location: ${detail.locationFull || detail.location}`,
      `• Openings: ${detail.openings}`,
      ...(detail.disclaimer ? ["", detail.disclaimer] : []),
    ].join("\n").trim();

    if (typeof window !== "undefined") {
      const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${job.company.replace(/[^a-z0-9]/gi, "_")}_${job.role.replace(/[^a-z0-9]/gi, "_")}_JD.txt`;
      link.click();
      URL.revokeObjectURL(link.href);
    }

    toast.success("Job details downloaded", {
      description: `${job.company} - ${job.role} saved.`,
    });
  };

  // Close the detail panel on Escape.
  useEffect(() => {
    if (!isSplit) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedId(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isSplit]);

  return (
    <div className={styles.shell}>
      <SideNavbar
        logo={logo}
        items={navItems}
        footerItems={footerItems}
        activeId={active}
        onSelect={handleNavSelect}
        user={{ avatarUrl: avatar, name: "Aisha Khan" }}
      />

      <main className={`${styles.content} ${isSplit ? styles.contentSplit : ""}`}>
        {/* Left column: header + filter bar + card list. In split view this
            column narrows; the detail panel sits beside it at full height. */}
        <div className={styles.leftCol}>
          {isDashboard ? (
            <RecruiterDashboard
              liveCandidates={candidates}
              selectedCandidateId={null}
              onNavigateToCandidates={(statuses, label) => {
                setCandidateFilters({
                  status: statuses ?? [],
                  company: [],
                });
                handleNavSelect("track");
                if (label) {
                  toast.info(`Filtered candidate list: ${label}`);
                }
              }}
              onSelectCandidate={(candidateId) => {
                navigateToCandidate(candidateId);
              }}
              onEditCandidate={(candidateId, reason) => {
                const cand =
                  candidates.find((c) => c.id === candidateId) ?? candidates[0];
                navigateToCandidate(cand.id, cand);
                if (reason) {
                  toast.info(`Editing ${cand.name}`, {
                    description: reason,
                  });
                }
              }}
              onSelectRole={(jobId) => {
                navigateToJob(jobId);
              }}
              onExploreJobs={() => {
                handleNavSelect("explore");
              }}
              onNavigateToEarnings={(preset) => {
                navigateToEarnings(preset);
              }}
            />
          ) : isEarnings ? (
            <RecruiterEarnings
              liveCandidates={candidates}
              initialPreset={earningsPreset}
              onConsumePreset={() => setEarningsPreset(null)}
              onNavigateToCandidate={(candidateId) => {
                navigateToCandidate(candidateId);
              }}
              onNavigateToJob={(jobId) => {
                navigateToJob(jobId);
              }}
            />
          ) : (
            <>
          <PageHeader
            title={pageTitle}
            search={{
              placeholder: isTrack
                ? "Search by candidate, role, or company"
                : "Search by role, company, or keyword",
              value: query,
              onChange: setQuery,
            }}
          />

          {isTrack ? (
            <CandidateSortFilterBar
              filters={candidateFilters}
              onFiltersChange={setCandidateFilters}
              sort={candidateSort}
              onSortChange={setCandidateSort}
            />
          ) : (
            <SortFilterBar
              filters={filters}
              onFiltersChange={setFilters}
              sort={sort}
              onSortChange={setSort}
            />
          )}

          <div className={styles.body}>
            {isTrack ? (
              visibleCandidates.length === 0 ? (
                <div className={styles.emptyState}>
                  <p className={styles.emptyTitle}>No candidates found</p>
                  <p className={styles.emptyBody}>
                    Try adjusting your filters or search query to find candidates.
                  </p>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setCandidateFilters(emptyCandidateFilters);
                      setQuery("");
                    }}
                  >
                    Clear all filters
                  </Button>
                </div>
              ) : (
                <section className={`${styles.cards} ${isSplit ? styles.cardsColumn : ""}`}>
                  {visibleCandidates.map((c) => (
                    <CandidateCard
                      key={c.id}
                      className={c.id === selectedId ? styles.cardSelected : undefined}
                      candidateName={c.name}
                      roleTitle={c.role}
                      company={c.company}
                      initials={c.initials}
                      location={c.location}
                      experience={c.experience}
                      currentCtc={c.currentCtc}
                      expectedCtc={c.expectedCtc}
                      ctcRange={c.ctcRange}
                      noticePeriod={c.noticePeriod}
                      status={c.status}
                      commission={c.commission}
                      earningModel={c.earningModel}
                      linkedinUrl={`https://linkedin.com/in/${c.name.toLowerCase().replace(/\s+/g, "")}`}
                      githubUrl={c.github}
                      resumeUrl="#"
                      onViewLinkedin={() => {
                        toast.info(`LinkedIn: ${c.name}`, {
                          description: `Opening LinkedIn profile for ${c.name}.`,
                        });
                      }}
                      onViewGithub={
                        c.github
                          ? () => {
                              toast.info(`GitHub: ${c.name}`, {
                                description: `Opening GitHub profile for ${c.name}.`,
                              });
                            }
                          : undefined
                      }
                      onViewResume={() => {
                        toast.info(`Resume: ${c.name}`, {
                          description: `Viewing submitted resume for ${c.role}.`,
                        });
                      }}
                      onEditCandidate={() => handleEditCandidate(c)}
                      onWithdraw={() => {
                        toast.warning(`Candidate withdrawn`, {
                          description: `${c.name} (${c.role}) submission has been withdrawn.`,
                        });
                      }}
                      onClick={() => {
                        setSelectedId(c.id);
                        setEditingCandidate(null);
                        setAddRoleCandidate(null);
                        setAddRoleJob(null);
                      }}
                      actionLabel="Add another role"
                      onAction={
                        c.status !== "joined"
                          ? () => {
                              setAddRoleCandidate(c);
                              setAddRoleJob(null);
                            }
                          : undefined
                      }
                    />
                  ))}
                </section>
              )
            ) : visibleJobs.length === 0 ? (
              <div className={styles.emptyState}>
                <p className={styles.emptyTitle}>
                  {isClaimed ? "No claimed roles yet" : "No roles found"}
                </p>
                <p className={styles.emptyBody}>
                  {isClaimed
                    ? "Claim roles from the Explore page to start submitting candidates and earning commissions."
                    : "Try adjusting your search keywords or filters to find openings."}
                </p>
                {isClaimed && (
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => handleNavSelect("explore")}
                  >
                    Explore open roles
                  </Button>
                )}
              </div>
            ) : (
              <section
                className={`${styles.cards} ${isSplit ? styles.cardsColumn : ""}`}
              >
                {visibleJobs.map((job) => (
                  <JobCard
                    key={job.id}
                    className={
                      job.id === selectedId ? styles.cardSelected : undefined
                    }
                    company={job.company}
                    companyLogoUrl={logoUrl(job.domain)}
                    roleTitle={job.role}
                    packageLabel={formatPackage(job.pkg)}
                    experience={job.experience}
                    location={formatLocations(job.locations)}
                    locationFull={locationsTitle(job.locations)}
                    mode={job.mode}
                    jobType={job.jobType}
                    commission={job.commission}
                    earningModel={job.earningModel}
                    actionLabel={actionLabel}
                    isClaimed={isClaimed}
                    onClaim={!isClaimed && job.badge !== "closed" ? () => claimJob(job) : undefined}
                    onSubmitCandidate={isClaimed && job.badge !== "closed" ? () => { setSelectedId(job.id); setPanelMode("submit"); } : undefined}
                    onUnclaim={isClaimed ? () => unclaimJob(job) : undefined}
                    onCopyLink={() => copyJobLink(job)}
                    onDownloadJd={() => downloadJobDescription(job)}
                    onClick={() => {
                      if (isClaimed) {
                        setSelectedId(job.id);
                        setPanelMode("detail");
                      } else {
                        setSelectedId(job.id);
                        setPanelMode("detail");
                      }
                    }}
                    onAction={
                      job.badge === "closed"
                        ? () => { } // No action for closed jobs
                        : isClaimed
                          ? () => { setSelectedId(job.id); setPanelMode("submit"); }
                          : () => claimJob(job) // Claim the job
                    }
                  />
                ))}
              </section>
            )}
          </div>
            </>
          )}
        </div>

        {isSplit && selectedCandidate && (
          <aside className={styles.detail}>
            {editingCandidate && editingCandidate.id === selectedCandidate.id ? (
              <SubmitCandidate
                key={`edit-${editingCandidate.id}`}
                job={detailFor(findJobForCandidate(editingCandidate))}
                initialValues={buildInitialCandidateValues(editingCandidate)}
                submitLabel="Edit candidate"
                onClose={() => {
                  setEditingCandidate(null);
                  setSelectedId(null);
                }}
                onSubmit={async (values) => {
                  handleUpdateCandidate(editingCandidate.id, values);
                  setEditingCandidate(null);
                }}
              />
            ) : (
              <VariantIntegratedSpine
                key={selectedCandidate.id}
                detail={buildDetail(selectedCandidate)}
                onClose={() => {
                  setSelectedId(null);
                  setEditingCandidate(null);
                }}
              />
            )}
          </aside>
        )}

        {isSplit && selectedJob && (
          <aside className={styles.detail}>
            {panelMode === "submit" ? (
              <SubmitCandidate
                key={selectedJob.id}
                job={detailFor(selectedJob)}
                onClose={() => setSelectedId(null)}
                onSubmit={(values) => {
                  handleCreateCandidateSubmission(values, null, selectedJob);
                }}
              />
            ) : (
              <JobDetail
                job={detailFor(selectedJob)}
                actionLabel={isClaimed ? "Submit candidate" : "Claim role"}
                onClose={() => setSelectedId(null)}
                unclaimLabel="Unclaim role"
                onUnclaim={isClaimed ? () => unclaimJob(selectedJob) : undefined}
                onClaim={() => {
                  if (isClaimed) {
                    setPanelMode("submit");
                  } else {
                    claimJob(selectedJob);
                    setSelectedId(null);
                    setPanelMode("detail");
                  }
                }}
                onCopyLink={() => {
                  navigator.clipboard?.writeText(window.location.href);
                  toast.success("Job link copied to clipboard");
                }}
                onDownloadJd={() => {
                  toast.success(`Downloaded job details for ${selectedJob.role}`);
                }}
              />
            )}
          </aside>
        )}
      </main>

      {/* Focused Overlay Drawer for Add Candidate to Another Role Flow */}
      {isTrack && addRoleCandidate && (
        <div
          className={styles.overlayBackdrop}
          onClick={() => {
            setAddRoleCandidate(null);
            setAddRoleJob(null);
          }}
        >
          <div
            className={styles.overlayDrawer}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={`Submit ${addRoleCandidate.name} to another role`}
          >
            {addRoleJob ? (
              <SubmitCandidate
                key={`${addRoleCandidate.id}-${addRoleJob.id}`}
                job={detailFor(addRoleJob)}
                initialValues={buildInitialCandidateValues(addRoleCandidate)}
                prefillSourceLabel={`Prefilled profile and resume from ${addRoleCandidate.name}'s application for ${addRoleCandidate.role} — verify must-have requirements before submitting.`}
                onBack={() => setAddRoleJob(null)}
                onClose={() => {
                  setAddRoleCandidate(null);
                  setAddRoleJob(null);
                }}
                onSubmit={async (values) => {
                  handleCreateCandidateSubmission(values, addRoleCandidate, addRoleJob);
                  setAddRoleCandidate(null);
                  setAddRoleJob(null);
                }}
              />
            ) : (
              <SelectRoleForCandidate
                candidate={addRoleCandidate}
                claimedJobs={claimedJobsList}
                existingSubmissions={candidates
                  .filter((item) => item.name.toLowerCase() === addRoleCandidate.name.toLowerCase())
                  .map((item) => ({ company: item.company, role: item.role }))}
                onSelectJob={(roleItem) => {
                  const fullJob = DUMMY_JOBS.find((j) => j.id === roleItem.id);
                  if (fullJob) setAddRoleJob(fullJob);
                }}
                onExploreJobs={() => {
                  setAddRoleCandidate(null);
                  setAddRoleJob(null);
                  handleNavSelect("explore");
                }}
                onClose={() => {
                  setAddRoleCandidate(null);
                  setAddRoleJob(null);
                }}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default RecruiterShellPreview;
