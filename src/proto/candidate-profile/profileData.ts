import type { CandidateDetail } from "@/proto/candidate-panel/data";

export interface WorkExperienceEntry {
  id: string;
  role: string;
  company: string;
  duration: string;
  tenure: string;
  location: string;
  current?: boolean;
  highlights: string[];
  skills: string[];
}

export interface EducationEntry {
  id: string;
  degree: string;
  institution: string;
  duration: string;
  grade: string;
  location: string;
}

export interface ProjectEntry {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  techStack: string[];
  link?: string;
}

export interface CertificationEntry {
  id: string;
  name: string;
  issuer: string;
  issuedDate: string;
  credentialId: string;
}

export interface ExternalLinkEntry {
  id: string;
  label: string;
  url: string;
  handle: string;
  verified?: boolean;
}

export interface SkillGroup {
  category: string;
  items: string[];
}

export interface CandidateProfileData {
  fullName: string;
  email: string;
  phone: string;
  linkedinUrl: string;
  linkedinVerified: boolean;
  location: string;
  preferredLocations: string;
  workModePreference: string;
  currentCtc: string;
  expectedCtc: string;
  noticePeriod: string;
  totalExperience: string;
  summary: string;
  resumeFileName: string;
  resumeUploadedAt: string;
  resumeFileSize: string;
  education: EducationEntry[];
  workExperience: WorkExperienceEntry[];
  projects: ProjectEntry[];
  certifications: CertificationEntry[];
  links: ExternalLinkEntry[];
  skills: string[];
  skillGroups: SkillGroup[];
}

export type ProfileSectionId =
  | "personal-info"
  | "resume"
  | "education"
  | "work-experience"
  | "projects"
  | "certifications"
  | "links"
  | "skills";

export interface ProfileTocItem {
  id: ProfileSectionId;
  label: string;
  shortLabel: string;
}

export const PROFILE_TOC_SECTIONS: ProfileTocItem[] = [
  { id: "personal-info", label: "Personal info", shortLabel: "Personal" },
  { id: "resume", label: "Resume", shortLabel: "Resume" },
  { id: "education", label: "Education", shortLabel: "Education" },
  { id: "work-experience", label: "Work experience", shortLabel: "Experience" },
  { id: "projects", label: "Projects", shortLabel: "Projects" },
  { id: "certifications", label: "Certifications", shortLabel: "Certifications" },
  { id: "links", label: "Links", shortLabel: "Links" },
  { id: "skills", label: "Skills", shortLabel: "Skills" },
];

export function buildCandidateProfile(detail: CandidateDetail): CandidateProfileData {
  const slug = detail.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  const [currentRolePart, currentCompanyPart] = detail.designation.includes(" at ")
    ? detail.designation.split(" at ")
    : [detail.designation, "Zeta"];

  const id = detail.item.id;

  // Customize realistic engineering/product backgrounds by candidate ID
  if (id === 1) {
    return {
      fullName: detail.name,
      email: detail.email,
      phone: "+91 98450 61834",
      linkedinUrl: `https://linkedin.com/in/${slug}`,
      linkedinVerified: true,
      location: `${detail.location}, India`,
      preferredLocations: "Bengaluru, Remote",
      workModePreference: "Hybrid / Remote",
      currentCtc: `${detail.currentCtc} LPA`,
      expectedCtc: `${detail.expectedCtc} LPA`,
      noticePeriod: detail.noticePeriod,
      totalExperience: detail.experience,
      summary:
        "Senior Frontend Architect with 6+ years building high-throughput web applications, design systems, and real-time observability dashboards.",
      resumeFileName: `cv-${slug}.pdf`,
      resumeUploadedAt: "14/11/26",
      resumeFileSize: detail.resumeSize,
      education: [
        {
          id: "edu-1",
          degree: "B.Tech in Computer Science & Engineering",
          institution: "National Institute of Technology Karnataka (NITK), Surathkal",
          duration: "2016 – 2020",
          grade: "8.9 CGPA · First Class with Distinction",
          location: "Mangaluru",
        },
      ],
      workExperience: [
        {
          id: "exp-1",
          role: currentRolePart,
          company: currentCompanyPart,
          duration: "Apr 2023 – Present",
          tenure: "3 yrs 7 mos",
          location: "Bengaluru · Hybrid",
          current: true,
          highlights: [
            "Architected the core card-issuing console in React 18 & TypeScript used by 40+ enterprise banking partners.",
            "Led migration to a token-driven design system, cutting feature delivery cycle time by 34% across 6 squads.",
            "Reduced P95 Largest Contentful Paint (LCP) from 2.8s to 1.1s via code-splitting and streaming SSR.",
          ],
          skills: ["React", "TypeScript", "Next.js", "Design Systems", "GraphQL"],
        },
        {
          id: "exp-2",
          role: "Software Engineer II (Frontend)",
          company: "Razorpay",
          duration: "Jul 2020 – Mar 2023",
          tenure: "2 yrs 9 mos",
          location: "Bengaluru",
          highlights: [
            "Built merchant settlement and reconciliation workflows processing ₹1,200+ Cr in monthly volume.",
            "Authored accessible table virtualization primitives handling 50k+ transaction rows at 60 FPS.",
          ],
          skills: ["React", "TypeScript", "Redux Toolkit", "Web Performance"],
        },
      ],
      projects: [
        {
          id: "proj-1",
          title: "Bolt UI Primitives & Token Engine",
          subtitle: "Core Maintainer · 2025",
          description:
            "Zero-runtime CSS token compiler and accessible keyboard-first React component primitives with WAI-ARIA compliance.",
          techStack: ["TypeScript", "CSS Variables", "React 19", "Playwright"],
          link: `https://github.com/${slug}/bolt-primitives`,
        },
        {
          id: "proj-2",
          title: "TraceLens Web Vitals Telemetry",
          subtitle: "Creator · 2024",
          description:
            "LightweightRUM collector and flamegraph visualizer for long animation frames (LoAF) and INP attribution.",
          techStack: ["Web Performance API", "Canvas 2D", "TypeScript"],
          link: `https://github.com/${slug}/tracelens`,
        },
      ],
      certifications: [
        {
          id: "cert-1",
          name: "Google Cloud Certified — Professional Cloud Developer",
          issuer: "Google Cloud",
          issuedDate: "Aug 2025",
          credentialId: "GCP-PCD-994182",
        },
        {
          id: "cert-2",
          name: "W3C Web Accessibility Specialist (WAS)",
          issuer: "IAAP / W3C",
          issuedDate: "Jan 2024",
          credentialId: "IAAP-WAS-41029",
        },
      ],
      links: [
        {
          id: "lnk-1",
          label: "LinkedIn",
          url: `https://linkedin.com/in/${slug}`,
          handle: `linkedin.com/in/${slug}`,
          verified: true,
        },
        {
          id: "lnk-2",
          label: "GitHub",
          url: `https://github.com/${slug}`,
          handle: `github.com/${slug}`,
          verified: true,
        },
        {
          id: "lnk-3",
          label: "Portfolio",
          url: `https://${slug}.dev`,
          handle: `${slug}.dev`,
        },
      ],
      skills: [
        "TypeScript",
        "React 18/19",
        "Next.js",
        "JavaScript (ES2024)",
        "HTML5 / CSS Architecture",
        "Design Systems",
        "GraphQL & Apollo",
        "Core Web Vitals (LCP / INP)",
        "Accessibility (WCAG 2.2 AA)",
        "Playwright & Vitest",
        "Node.js",
        "Webpack / Vite",
      ],
      skillGroups: [
        {
          category: "Core Frontend",
          items: ["TypeScript", "React 18/19", "Next.js", "JavaScript (ES2024)", "HTML5 & Modern CSS"],
        },
        {
          category: "Architecture & Craft",
          items: ["Design Systems", "Core Web Vitals (LCP / INP)", "WCAG 2.2 Accessibility", "State Machines"],
        },
        {
          category: "Data & Tooling",
          items: ["GraphQL", "REST APIs", "Vite", "Playwright", "Vitest", "Git / CI"],
        },
      ],
    };
  }

  // Generic realistic profile for all other candidates
  return {
    fullName: detail.name,
    email: detail.email,
    phone: detail.phone,
    linkedinUrl: `https://linkedin.com/in/${slug}`,
    linkedinVerified: true,
    location: `${detail.location}, India`,
    preferredLocations: `${detail.location}, Remote`,
    workModePreference: "Hybrid / Remote",
    currentCtc: `${detail.currentCtc} LPA`,
    expectedCtc: `${detail.expectedCtc} LPA`,
    noticePeriod: detail.noticePeriod,
    totalExperience: detail.experience,
    summary: `Experienced ${currentRolePart} with ${detail.experience} of track record delivering scalable production systems, mentoring teams, and driving high-impact product outcomes.`,
    resumeFileName: `cv-${slug}.pdf`,
    resumeUploadedAt: "11/11/26",
    resumeFileSize: detail.resumeSize,
    education: [
      {
        id: "edu-1",
        degree: "B.Tech in Computer Science & Engineering",
        institution: "Indian Institute of Information Technology (IIIT), Hyderabad",
        duration: "2014 – 2018",
        grade: "8.7 CGPA · Honours",
        location: "Hyderabad",
      },
    ],
    workExperience: [
      {
        id: "exp-1",
        role: currentRolePart,
        company: currentCompanyPart,
        duration: "Jan 2022 – Present",
        tenure: "4 yrs 10 mos",
        location: `${detail.location} · Hybrid`,
        current: true,
        highlights: [
          `Spearheaded core architecture and end-to-end delivery for flagship ${detail.jobTitle.toLowerCase()} initiatives at ${currentCompanyPart}.`,
          "Improved service reliability to 99.98% SLA while reducing infrastructure and latency overhead by 28%.",
          "Partnered closely with product, design, and platform leadership to mentor 5+ engineers.",
        ],
        skills: ["System Design", "Distributed Systems", "TypeScript", "Cloud Architecture"],
      },
      {
        id: "exp-2",
        role: "Senior Software Engineer",
        company: "Flipkart",
        duration: "Jun 2018 – Dec 2021",
        tenure: "3 yrs 7 mos",
        location: "Bengaluru",
        highlights: [
          "Designed and scaled high-concurrency microservices supporting peak festive sale traffic of 120k+ RPS.",
          "Automated CI/CD canary rollouts and observability dashboards across 14 production services.",
        ],
        skills: ["Microservices", "Kubernetes", "PostgreSQL", "Kafka", "Observability"],
      },
    ],
    projects: [
      {
        id: "proj-1",
        title: "Distributed Rate Limiter & Edge Gateway",
        subtitle: "Lead Author · 2025",
        description:
          "Low-latency token-bucket rate limiter using Redis Lua scripts with sub-2ms P99 overhead across multi-region clusters.",
        techStack: ["Go", "Redis", "gRPC", "Prometheus"],
        link: `https://github.com/${slug}/edge-limiter`,
      },
      {
        id: "proj-2",
        title: "SchemaFlow Declarative Data Pipeline",
        subtitle: "Creator · 2024",
        description:
          "Type-safe schema validation and real-time event routing engine for high-volume webhook ingestion.",
        techStack: ["TypeScript", "Kafka", "PostgreSQL", "Docker"],
        link: `https://github.com/${slug}/schemaflow`,
      },
    ],
    certifications: [
      {
        id: "cert-1",
        name: "AWS Certified Solutions Architect — Professional",
        issuer: "Amazon Web Services",
        issuedDate: "May 2025",
        credentialId: "AWS-SAP-773819",
      },
      {
        id: "cert-2",
        name: "Certified Kubernetes Application Developer (CKAD)",
        issuer: "Cloud Native Computing Foundation (CNCF)",
        issuedDate: "Sep 2023",
        credentialId: "LF-CKAD-30194",
      },
    ],
    links: [
      {
        id: "lnk-1",
        label: "LinkedIn",
        url: `https://linkedin.com/in/${slug}`,
        handle: `linkedin.com/in/${slug}`,
        verified: true,
      },
      {
        id: "lnk-2",
        label: "GitHub",
        url: `https://github.com/${slug}`,
        handle: `github.com/${slug}`,
        verified: true,
      },
      {
        id: "lnk-3",
        label: "Personal Website",
        url: `https://${slug}.io`,
        handle: `${slug}.io`,
      },
    ],
    skills: [
      "System Design",
      "TypeScript",
      "React",
      "Node.js",
      "Go",
      "PostgreSQL",
      "Redis",
      "Kafka",
      "Kubernetes",
      "AWS / GCP",
      "GraphQL",
      "CI/CD & Observability",
    ],
    skillGroups: [
      {
        category: "Languages & Frameworks",
        items: ["TypeScript", "Go", "Node.js", "React", "GraphQL"],
      },
      {
        category: "Systems & Data",
        items: ["System Design", "PostgreSQL", "Redis", "Apache Kafka", "Microservices"],
      },
      {
        category: "Cloud & Infrastructure",
        items: ["AWS / GCP", "Kubernetes", "Docker", "Terraform", "OpenTelemetry"],
      },
    ],
  };
}
