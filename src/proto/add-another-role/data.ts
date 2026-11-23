import type { CandidateItem } from "@/proto/candidate-cards/data";
import { DUMMY_CANDIDATE_ITEMS } from "@/proto/candidate-cards/data";

export interface PrototypeJob {
  id: number;
  company: string;
  domain: string;
  role: string;
  packageLabel: string;
  experience: string;
  location: string;
  mode: string;
  jobType: string;
  commission: string;
  matchScore: string;
  matchReason?: string;
  mustHaves: string[];
  badge?: "trending" | "priority" | "spotlight" | "just-in" | "closed";
}

export const SAMPLE_CANDIDATE: CandidateItem = DUMMY_CANDIDATE_ITEMS[0]; // Rohan Mehta

export const PROTOTYPE_CLAIMED_JOBS: PrototypeJob[] = [
  {
    id: 2,
    company: "Razorpay",
    domain: "razorpay.com",
    role: "Senior Backend Engineer, Payments",
    packageLabel: "₹28–42 LPA",
    experience: "5–8 yrs",
    location: "Bengaluru, Hybrid",
    mode: "Hybrid",
    jobType: "Full-time",
    commission: "₹28,000",
    matchScore: "95% fit",
    matchReason: "Direct experience & notice alignment",
    mustHaves: [
      "5+ years backend engineering in high-throughput systems",
      "Proficient in Go, Java, or Node.js with distributed caching",
      "Experience with payments, fintech, or ledger architectures",
    ],
    badge: "spotlight",
  },
  {
    id: 8,
    company: "Figma",
    domain: "figma.com",
    role: "Design Systems Engineer",
    packageLabel: "₹35–50 LPA",
    experience: "6–8 yrs",
    location: "Remote",
    mode: "Remote",
    jobType: "Full-time",
    commission: "₹30,000",
    matchScore: "98% fit",
    matchReason: "Strong React & TypeScript foundations",
    mustHaves: [
      "Extensive experience building reusable component systems",
      "Deep mastery of TypeScript, modern CSS, and accessibility",
      "Cross-functional collaboration with product design teams",
    ],
    badge: "trending",
  },
  {
    id: 12,
    company: "Cred",
    domain: "cred.club",
    role: "iOS Engineer",
    packageLabel: "₹30–45 LPA",
    experience: "5–8 yrs",
    location: "Bengaluru",
    mode: "On-site",
    jobType: "Full-time",
    commission: "₹27,000",
    matchScore: "82% fit",
    matchReason: "Requires native Swift/iOS background",
    mustHaves: [
      "4+ years building production iOS applications in Swift",
      "Experience with CoreAnimation and fluid custom gesture systems",
    ],
    badge: "priority",
  },
  {
    id: 3,
    company: "Stripe",
    domain: "stripe.com",
    role: "Staff Software Engineer, Platform",
    packageLabel: "₹65–90 LPA",
    experience: "9+ yrs",
    location: "Remote",
    mode: "Remote",
    jobType: "Full-time",
    commission: "₹3,50,000",
    matchScore: "91% fit",
    matchReason: "CTC and seniority stretch opportunity",
    mustHaves: [
      "8+ years software architecture and systems engineering",
      "Demonstrated technical leadership across multiple engineering squads",
      "Experience with financial compliance and 99.999% uptime systems",
    ],
    badge: "priority",
  },
  {
    id: 1,
    company: "Google",
    domain: "google.com",
    role: "Senior Frontend Engineer",
    packageLabel: "₹32–48 LPA",
    experience: "5–8 yrs",
    location: "Bengaluru",
    mode: "On-site",
    jobType: "Full-time",
    commission: "₹25,000",
    matchScore: "Current Application",
    mustHaves: ["React", "TypeScript", "Performance"],
    badge: "trending",
  },
];
