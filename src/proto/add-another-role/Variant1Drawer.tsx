import { useState } from "react";
import { toast } from "sonner";
import { SelectRoleForCandidate } from "@/components/recruiter/SelectRoleForCandidate";
import { SubmitCandidate } from "@/components/recruiter/SubmitCandidate";
import type { CandidateItem } from "@/proto/candidate-cards/data";
import type { PrototypeJob } from "./data";
import { PROTOTYPE_CLAIMED_JOBS, SAMPLE_CANDIDATE } from "./data";

export default function Variant1Drawer({
  candidate = SAMPLE_CANDIDATE,
  onComplete,
}: {
  candidate?: CandidateItem;
  onComplete?: (role: string, company: string) => void;
}) {
  const [selectedJob, setSelectedJob] = useState<PrototypeJob | null>(null);

  const claimedJobs = PROTOTYPE_CLAIMED_JOBS.map((j) => ({
    id: j.id,
    company: j.company,
    domain: j.domain,
    role: j.role,
    packageLabel: j.packageLabel,
    experience: j.experience,
    location: j.location,
    commission: j.commission,
    badge: j.badge,
    matchScore: j.matchScore,
    matchReason: j.matchReason,
    mustHaves: j.mustHaves,
  }));

  const mockSubmitCandidateJob = selectedJob
    ? {
        id: selectedJob.id,
        company: selectedJob.company,
        companyLogoUrl: `https://www.google.com/s2/favicons?domain=${selectedJob.domain}&sz=64`,
        role: selectedJob.role,
        packageLabel: selectedJob.packageLabel,
        commission: selectedJob.commission,
        experience: selectedJob.experience,
        location: selectedJob.location,
        mode: selectedJob.mode,
        jobType: selectedJob.jobType,
        noticePeriod: "30 days",
        openings: 2,
        requirements: selectedJob.mustHaves,
        overview: `${selectedJob.company} is hiring a ${selectedJob.role}.`,
        responsibilities: ["Build scalable software", "Collaborate with cross-functional teams"],
        skills: ["React", "TypeScript", "Node.js"],
        criteria: selectedJob.mustHaves,
        companyInfo: {
          openJobs: "10+",
          domain: "Technology",
          businessModel: "B2B",
          employees: "500-1000",
          valuation: "$1B+",
          established: "2015",
          about: `${selectedJob.company} builds market-leading financial and tech infrastructure.`,
          culture: ["Customer first", "High ownership"],
          perks: ["Health insurance", "Learning stipend"],
        },
      }
    : null;

  return (
    <div style={{ width: "100%", height: "100%" }}>
      {selectedJob && mockSubmitCandidateJob ? (
        <SubmitCandidate
          job={mockSubmitCandidateJob}
          initialValues={{
            name: candidate.name,
            email: `${candidate.name.toLowerCase().replace(/\s+/g, ".")}@gmail.com`,
            phone: "9845061834",
            experience: candidate.experience.replace(/[^\d.]/g, ""),
            currentCtc: candidate.currentCtc.replace(/[^\d.]/g, ""),
            expectedCtc: candidate.expectedCtc.replace(/[^\d.]/g, ""),
            notice: candidate.noticePeriod || "30 days",
            resume: new File(["Sample Resume Content"], `${candidate.name.replace(/\s+/g, "_")}_Resume.pdf`, {
              type: "application/pdf",
            }),
            linkedin: `linkedin.com/in/${candidate.name.toLowerCase().replace(/\s+/g, "")}`,
            github: candidate.github ? candidate.github.replace(/^https?:\/\//, "") : "",
          }}
          prefillSourceLabel={`Prefilled profile & resume from ${candidate.name}'s application for ${candidate.role} at ${candidate.company}.`}
          onBack={() => setSelectedJob(null)}
          onClose={() => setSelectedJob(null)}
          onSubmit={async () => {
            toast.success(`Submitted ${candidate.name} to ${selectedJob.company}`, {
              description: `Added to ${selectedJob.role}.`,
            });
            onComplete?.(selectedJob.role, selectedJob.company);
          }}
        />
      ) : (
        <SelectRoleForCandidate
          candidate={candidate}
          claimedJobs={claimedJobs}
          existingSubmissions={[{ company: candidate.company, role: candidate.role }]}
          onSelectJob={(job) => {
            const found = PROTOTYPE_CLAIMED_JOBS.find((j) => j.id === job.id);
            if (found) setSelectedJob(found);
          }}
          onExploreJobs={() => {
            toast.info("Explore roles clicked");
          }}
          onClose={() => {
            toast.info("Drawer closed");
          }}
        />
      )}
    </div>
  );
}
