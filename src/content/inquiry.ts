import type { FlagCode } from "@/components/platform/flags";

/**
 * Page-level inquiry portals — the four standalone modals added to the
 * Investors, Technology & AI, Vendors & Suppliers and Global Supply pages.
 * Both the client forms and the API route import these constants, so every
 * selectable value is validated against the same allow-list on both sides
 * (never trust the frontend).
 *
 * Values are opaque tokens (never user-visible) so translations can evolve
 * without touching stored data. Where a track mirrors a footer partnership
 * track (investors / aiTech / vendors), the tokens intentionally MATCH the
 * PARTNERSHIP_FOCUS vocabulary so internal triage stays consistent.
 *
 * Two reference datasets live here as well:
 * - INDIAN_REGIONS: all 28 Indian states + 8 union territories (official
 *   names) plus an "outside-india" escape token for international suppliers.
 *   Region names are official English proper nouns, shared across locales.
 * - MARKETS: the country/region selector for the Global Supply inquiry —
 *   every entry carries its flag artwork code; labels come from the flag
 *   module's international proper names (single source across locales).
 */

/* ---------------- Track discriminator ---------------- */

export const INQUIRY_TRACKS = ["investor", "ai", "vendor", "supply"] as const;
export type InquiryTrack = (typeof INQUIRY_TRACKS)[number];

export function isInquiryTrack(value: unknown): value is InquiryTrack {
  return typeof value === "string" && (INQUIRY_TRACKS as readonly string[]).includes(value);
}

/** Reference prefixes per track (internal triage at a glance). */
export const INQUIRY_REFERENCE_PREFIX: Record<InquiryTrack, string> = {
  investor: "INV",
  ai: "AIC",
  vendor: "VEN",
  supply: "GSP",
};

/* ---------------- Investor modal (Investors & Strategic Partners) ---------------- */

/** Mirrors PARTNERSHIP_FOCUS.investors for consistent internal triage. */
export const INQUIRY_INVESTOR_FOCUS: readonly string[] = [
  "institutional",
  "strategic",
  "family-office",
  "individual",
];

/** The horizon the enquirer is thinking in (stored in the stage column). */
export const INQUIRY_INVESTOR_HORIZON: readonly string[] = [
  "patient",
  "balanced",
  "venture",
  "steward",
];

/* ---------------- AI & Technology collaboration modal (Technology & AI Posture) ---------------- */

/** Mirrors PARTNERSHIP_FOCUS.aiTech plus an open "other" door. */
export const INQUIRY_AI_DOMAINS: readonly string[] = [
  "ai-analytics",
  "data-systems",
  "mfg-automation",
  "integrations",
  "other",
];

/** Where the collaboration stands today. */
export const INQUIRY_AI_STAGES: readonly string[] = [
  "exploring",
  "prototyping",
  "scaling",
  "integrating",
];

/* ---------------- Vendor & supplier modal (Vendors & Suppliers) ---------------- */

/** Mirrors PARTNERSHIP_FOCUS.vendors for consistent internal triage. */
export const INQUIRY_VENDOR_CATEGORIES: readonly string[] = [
  "finished",
  "materials",
  "packaging",
  "services",
];

/** Where the supplier's operation stands today. */
export const INQUIRY_VENDOR_STAGES: readonly string[] = [
  "established",
  "scaling",
  "emerging",
  "global",
];

/**
 * All 28 Indian states + 8 union territories (official names, in official
 * order) + the international-supplier escape token. The state value is
 * stored as the token below; "outside-india" is rendered with a localized
 * label from the dictionary.
 */
export const INQUIRY_VENDOR_STATES: readonly string[] = [
  // States (28)
  "andhra-pradesh",
  "arunachal-pradesh",
  "assam",
  "bihar",
  "chhattisgarh",
  "goa",
  "gujarat",
  "haryana",
  "himachal-pradesh",
  "jharkhand",
  "karnataka",
  "kerala",
  "madhya-pradesh",
  "maharashtra",
  "manipur",
  "meghalaya",
  "mizoram",
  "nagaland",
  "odisha",
  "punjab",
  "rajasthan",
  "sikkim",
  "tamil-nadu",
  "telangana",
  "tripura",
  "uttar-pradesh",
  "uttarakhand",
  "west-bengal",
  // Union territories (8)
  "andaman-nicobar",
  "chandigarh",
  "dadra-nagar-haveli-daman-diu",
  "delhi",
  "jammu-kashmir",
  "ladakh",
  "lakshadweep",
  "puducherry",
] as const;

export const INQUIRY_OUTSIDE_INDIA = "outside-india";

/** Official English names for the regions above (same order). */
export const INDIAN_REGION_LABELS: readonly string[] = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman & Nicobar Islands",
  "Chandigarh",
  "Dadra & Nagar Haveli and Daman & Diu",
  "Delhi (NCT)",
  "Jammu & Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
];

export function isVendorState(value: string): boolean {
  return (
    value === INQUIRY_OUTSIDE_INDIA || (INQUIRY_VENDOR_STATES as readonly string[]).includes(value)
  );
}

/* ---------------- Global Supply modal (Global Supply) ---------------- */

/**
 * Sectors the supply coordination serves — healthcare facilities first,
 * then the medical-adjacent industries. Describes the ENQUIRER's context;
 * not a claim about active customers.
 */
export const INQUIRY_SUPPLY_SECTORS: readonly string[] = [
  "hospital",
  "distribution",
  "pharma",
  "laboratory",
  "public-sector",
  "industry",
  "other",
];

/**
 * The market selector: country name + flag for identifying the inquiry.
 * Order: origin & Swiss-grade reference first, then the corridor regions,
 * then corridor countries, then the wider trade world, then the two
 * institutional regions, then the open "other" door.
 */
export interface MarketOption {
  token: string;
  flag: FlagCode;
}

export const INQUIRY_MARKETS: readonly MarketOption[] = [
  { token: "in", flag: "in" }, // India — origin
  { token: "ch", flag: "ch" }, // Switzerland — grade reference
  // Corridor regions
  { token: "jp", flag: "jp" }, // Asia
  { token: "ae", flag: "ae" }, // Middle East
  { token: "sa", flag: "sa" },
  { token: "kw", flag: "kw" },
  { token: "eg", flag: "eg" },
  { token: "br", flag: "br" }, // South America
  { token: "ar", flag: "ar" },
  { token: "mx", flag: "mx" },
  { token: "co", flag: "co" },
  { token: "pe", flag: "pe" },
  { token: "cl", flag: "cl" },
  { token: "ng", flag: "ng" }, // Africa
  { token: "gh", flag: "gh" },
  { token: "ke", flag: "ke" },
  { token: "za", flag: "za" },
  { token: "au", flag: "au" }, // Australia
  { token: "ca", flag: "ca" }, // Canada
  // The wider trade world
  { token: "us", flag: "us" },
  { token: "gb", flag: "gb" },
  { token: "de", flag: "de" },
  { token: "fr", flag: "fr" },
  { token: "nl", flag: "nl" },
  { token: "es", flag: "es" },
  { token: "it", flag: "it" },
  { token: "se", flag: "se" },
  { token: "pl", flag: "pl" },
  { token: "gr", flag: "gr" },
  { token: "kr", flag: "kr" },
  { token: "cn", flag: "cn" },
  { token: "sg", flag: "sg" },
  { token: "my", flag: "my" },
  { token: "th", flag: "th" },
  { token: "vn", flag: "vn" },
  { token: "ph", flag: "ph" },
  { token: "id", flag: "id" },
  { token: "bd", flag: "bd" },
  { token: "pk", flag: "pk" },
  // Institutional procurement regions
  { token: "eu", flag: "eu" }, // European Union
  { token: "un", flag: "un" }, // United Nations (text-chip, per legal posture)
];

export const INQUIRY_MARKET_OTHER = "other";

export function isSupplyMarket(value: string): boolean {
  return (
    value === INQUIRY_MARKET_OTHER ||
    INQUIRY_MARKETS.some((m) => m.token === value)
  );
}
