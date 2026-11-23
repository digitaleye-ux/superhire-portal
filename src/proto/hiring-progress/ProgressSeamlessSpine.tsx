import type { CandidateDetail } from "@/proto/candidate-panel/data";
import { HiringProgressTracker } from "./HiringProgressTracker";

/**
 * Direction 1 — "Seamless Spine"
 * Axis: Linear Continuous Spine
 *
 * Single uninterrupted vertical timeline with clean 18px nodes.
 * Milestone titles, timestamps, and detailed description notes render
 * directly along the spine with zero card borders.
 */
export function ProgressSeamlessSpine({ detail }: { detail: CandidateDetail }) {
  return <HiringProgressTracker detail={detail} />;
}
