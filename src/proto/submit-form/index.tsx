import { useCallback, useState } from "react";
import { SideNavbar } from "@/components/shared/SideNavbar";
import { PageHeader } from "@/components/shared/PageHeader";
import { JobCard } from "@/components/recruiter/JobCard";
import type { JobDetailData } from "@/components/recruiter/JobDetail";
import shell from "@/preview/RecruiterShellPreview.module.css";
import logo from "@/components/shared/SideNavbar/assets/logo.svg";
import {
  BriefcaseBusinessIcon,
  CircleCheckBigIcon,
  UsersRoundIcon,
} from "@/components/shared/Icon";
import avatar from "@/components/shared/SideNavbar/assets/avatar-sample.png";
import { Picker } from "./Picker";
import { FormShell } from "./FormShell";
import VariantAiry from "./VariantAiry";
import VariantGuided from "./VariantGuided";
import VariantSheet from "./VariantSheet";
import VariantBuilt from "./VariantBuilt";

const VARIANTS = [
  { name: "Tidy (current)", Comp: VariantAiry },
  { name: "Guided cards", Comp: VariantGuided },
  { name: "Spec sheet", Comp: VariantSheet },
  { name: "Purpose-built", Comp: VariantBuilt },
];

const SAMPLE_JOB: JobDetailData = {
  id: 1,
  company: "Google",
  companyLogoUrl: "https://www.google.com/s2/favicons?domain=google.com&sz=64",
  role: "Senior Frontend Engineer",
  packageLabel: "₹32–48 L",
  commission: "₹25,000",
  jobType: "Full-time",
  mode: "On-site",
  location: "Bengaluru",
  experience: "5–8 yrs",
  noticePeriod: "Immediate – 30 days",
  openings: 3,
  overview:
    "Google is hiring a Senior Frontend Engineer to ship high-ownership web experiences used at scale.",
  responsibilities: [
    "Own and ship features end to end.",
    "Collaborate with product and design.",
  ],
  skills: ["React", "TypeScript", "Node.js", "System Design"],
  criteria: [
    "3+ years building high-throughput product interfaces or APIs",
    "Product company experience",
  ],
  companyInfo: {
    openJobs: "1,000+",
    domain: "Technology",
    businessModel: "B2B & B2C",
    employees: "10,000+",
    valuation: "$2T+",
    established: "1998",
    about: "Google builds products used by billions.",
    culture: ["Engineering excellence"],
    perks: ["Health insurance", "Hybrid work"],
  },
};

const nav = [
  { id: "explore", label: "Explore", icon: BriefcaseBusinessIcon },
  { id: "claimed", label: "Claimed", icon: CircleCheckBigIcon },
  { id: "track", label: "Track", icon: UsersRoundIcon },
];

const initial = () => {
  const v = parseInt(new URLSearchParams(location.search).get("v") ?? "", 10);
  return v >= 1 && v <= VARIANTS.length ? v - 1 : 0;
};

export default function SubmitFormProto() {
  const [current, setCurrent] = useState(initial);
  const [open, setOpen] = useState(true);

  const change = useCallback((i: number) => {
    setCurrent(i);
    setOpen(true);
    const url = new URL(location.href);
    url.searchParams.set("v", String(i + 1));
    history.replaceState(null, "", url);
  }, []);

  const { Comp } = VARIANTS[current];

  return (
    <div className={shell.shell}>
      <SideNavbar
        logo={logo}
        items={nav}
        footerItems={[]}
        activeId="claimed"
        onSelect={() => {}}
        user={{ avatarUrl: avatar, name: "Aisha Khan" }}
      />
      <main className={`${shell.content} ${shell.contentSplit}`}>
        <div className={shell.leftCol}>
          <PageHeader title="Claimed roles" />
          <div className={shell.body}>
            <section className={`${shell.cards} ${shell.cardsColumn}`}>
              <JobCard
                className={shell.cardSelected}
                company={SAMPLE_JOB.company}
                companyLogoUrl={SAMPLE_JOB.companyLogoUrl}
                roleTitle={SAMPLE_JOB.role}
                packageLabel={SAMPLE_JOB.packageLabel}
                experience={SAMPLE_JOB.experience}
                location={SAMPLE_JOB.location}
                mode={SAMPLE_JOB.mode}
                commission={SAMPLE_JOB.commission}
                actionLabel="Submit candidate"
                onClick={() => setOpen(true)}
                onAction={() => setOpen(true)}
              />
            </section>
          </div>
        </div>
        {open && (
          <aside className={shell.detail}>
            <FormShell
              key={current}
              job={SAMPLE_JOB}
              onClose={() => setOpen(false)}
              renderForm={(ctx) => <Comp {...ctx} />}
            />
          </aside>
        )}
      </main>
      <Picker names={VARIANTS.map((x) => x.name)} current={current} onChange={change} />
    </div>
  );
}
