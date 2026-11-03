/**
 * Careers portal — the careers page "contact the careers team" modal.
 * Both the client form and the API route import these constants, so the
 * placement / area / stage options are validated against the same
 * allow-list on both sides (never trust the frontend).
 *
 * Unlike the partnership tracks (which fan out into four modals), careers
 * is ONE modal with three choice dimensions describing the applicant:
 * - placement: what kind of placement they are exploring
 * - area: where they would want to contribute
 * - stage: where their journey currently is
 *
 * Values are opaque tokens (never user-visible) so translations can evolve
 * without touching stored data. Options describe the APPLICANT's intent —
 * they are not company claims about open roles.
 */

export const CAREERS_PLACEMENTS: readonly string[] = [
  "full-time",
  "internship",
  "early-career",
  "project",
  "introduction",
];

export const CAREERS_AREAS: readonly string[] = [
  "production",
  "quality",
  "development",
  "supply",
  "commercial",
  "technology",
  "other",
];

export const CAREERS_STAGES: readonly string[] = [
  "student",
  "starting",
  "building",
  "seasoned",
  "returning",
];
