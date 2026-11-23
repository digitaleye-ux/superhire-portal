/**
 * Format a list of job locations into a compact label: the first location
 * plus a "+N" rollup for the rest. e.g. ["Bengaluru","Pune","Remote"] →
 * "Bengaluru +2". Remote is treated like any other location (no special case).
 *
 * The full list is still available to show in a tooltip — see `locationsTitle`.
 */

/** Compact label for the meta row. */
export function formatLocations(locations: string[]): string {
  const clean = locations.map((l) => l.trim()).filter(Boolean);
  if (clean.length === 0) return "";
  if (clean.length === 1) return clean[0];
  return `${clean[0]} +${clean.length - 1}`;
}

/** Full, human-readable list for a title/tooltip: "Bengaluru, Pune, Remote". */
export function locationsTitle(locations: string[]): string {
  return locations
    .map((l) => l.trim())
    .filter(Boolean)
    .join(", ");
}
