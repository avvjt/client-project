/**
 * Partnership tracks — the footer "Partner with us" column opens one
 * standalone modal portal per title. Both the client form and the API route
 * import these constants, so the focus options are validated against the
 * same allow-list on both sides (never trust the frontend).
 */

export const PARTNERSHIP_TRACKS = ["vendors", "rnd", "investors", "aiTech"] as const;
export type PartnershipTrack = (typeof PARTNERSHIP_TRACKS)[number];

/**
 * Per-track focus options, in display order. Values are opaque tokens
 * (never user-visible) so translations can evolve without touching data.
 */
export const PARTNERSHIP_FOCUS: Record<PartnershipTrack, readonly string[]> = {
  vendors: ["finished", "materials", "packaging", "services"],
  rnd: ["materials-rnd", "sterilization", "automation", "regulatory"],
  investors: ["institutional", "strategic", "family-office", "individual"],
  aiTech: ["ai-analytics", "data-systems", "mfg-automation", "integrations"],
};

export function isPartnershipTrack(value: unknown): value is PartnershipTrack {
  return typeof value === "string" && (PARTNERSHIP_TRACKS as readonly string[]).includes(value);
}

/** Footer hash routes for each track's full page (linked inside the modal). */
export const PARTNERSHIP_TRACK_ROUTES: Record<PartnershipTrack, string> = {
  vendors: "#/vendors",
  rnd: "#/rnd",
  investors: "#/investors",
  aiTech: "#/ai-tech",
};
