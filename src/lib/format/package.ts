/**
 * Format a compensation range into a short, display-ready label.
 *
 * Rules (decided for the recruiter portal):
 *  - Values are annual amounts in rupees.
 *  - Units are pure magnitudes: "L" (lakh) and "Cr" (crore). "Per annum" is
 *    implied by context — they are consistent with each other (1 Cr = 100 L),
 *    unlike mixing "LPA" (which bakes in per-annum) with a bare "Cr".
 *  - One consistent unit for the whole range.
 *  - Cr is used only when the ENTIRE range is at/above ₹1 crore (100 L); a
 *    range that straddles the boundary stays in L. The unit is chosen from the
 *    min (lower) end, so a sub-crore value never reads as "0.9 Cr".
 *      90–110 L  → "₹90–110 L"   (min < 1 Cr → L)
 *      120–180 L → "₹1.2–1.8 Cr" (both ends ≥ 1 Cr)
 *      100 L     → "₹1 Cr"
 *  - A range whose ends are equal collapses to a single value: "₹18 L".
 *
 * Keeping this here (not in the card) means the LPA/Cr rule lives in one place
 * and the card stays presentational.
 */

const LAKH = 100_000;
const CRORE = 10_000_000;

/** Trim a number to at most one decimal, dropping a trailing ".0". */
function trim(value: number): string {
  return Number(value.toFixed(1)).toString();
}

export interface PackageRange {
  /** Minimum annual compensation, in rupees. */
  min: number;
  /** Maximum annual compensation, in rupees. */
  max: number;
}

export function formatPackage({ min, max }: PackageRange): string {
  // Guard against a reversed range.
  const lo = Math.min(min, max);
  const hi = Math.max(min, max);

  // Use Cr only when the whole range is at/above ₹1 Cr (chosen from the lower
  // end), so a straddling range stays in LPA and nothing reads as "0.9 Cr".
  const useCrore = lo >= CRORE;
  const unit = useCrore ? "Cr" : "L";
  const divisor = useCrore ? CRORE : LAKH;

  const loLabel = trim(lo / divisor);
  const hiLabel = trim(hi / divisor);

  if (loLabel === hiLabel) {
    return `₹${hiLabel} ${unit}`;
  }
  return `₹${loLabel}–${hiLabel} ${unit}`;
}
