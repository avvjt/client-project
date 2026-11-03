/**
 * DISPO-CONCEPT — COMPANY FACTS SOURCE OF TRUTH
 * Only facts supplied by management (the brief) are listed here.
 * Anything not stated by management is marked as requiring review and is
 * NOT published on the website.
 */
export const COMPANY = {
  name: "Dispo-Concept",
  tagline: "Medical Essentials. Made with Purpose. Supplied with Discipline.",
  hq: {
    city: "Bengaluru",
    state: "Karnataka",
    country: "India",
  },
  /**
   * Company-stated direction (management-provided, current directive).
   * Published only in qualitative form — no financial figures on the website.
   */
  ambition:
    "World-class medical-grade elements manufacturing & supply enterprise (stated direction, qualitative only)",
  /** Company-stated manufacturing methodology (not a Swiss certification or origin claim). */
  method: "Swiss-grade process discipline (company-stated methodology)",
  /** Export corridors of interest — activation confirmed per enquiry, not proof of operations. */
  corridorsOfInterest: [
    "Asia",
    "Middle East",
    "South America",
    "Africa",
    "Australia",
    "United Nations agencies",
    "European Union",
  ],
  focus: [
    "medical-grade products",
    "medical consumables",
    "surgical and procedural supplies",
    "product sourcing",
    "institutional supply",
  ],
  audiences: [
    "hospitals",
    "surgical-centres",
    "distributors",
    "procurement",
    "government",
    "oem",
    "wholesalers",
    "international",
  ],
  productFamilyCount: 7,
  exportCorridorCount: 7,
  siteLocales: 6,
} as const;

/**
 * Items that management must confirm before they can be published anywhere
 * on the website. Tracked here so the marketing surface stays honest.
 * (Rendered nowhere public; used for the management review register.)
 */
export const MANAGEMENT_REVIEW_ITEMS: string[] = [
  "Financial figures policy: no revenue, valuation or margin numbers are published on the website (management directive) — any future publication requires explicit written approval",
  "Whether each product family is manufactured in-house, sourced, or partner-produced",
  "Exact material composition, sizes, packaging and shelf-life per product/SKU",
  "Sterility status and sterilization method per product",
  "Certifications: holder entity, scope, issuing body, validity before any certificate is named",
  "Export markets served today and importer/distributor coverage — corridors of interest are clearly labelled as such",
  "Verified facility photography vs illustrative imagery policy",
  "Public contact channels (email, phone) and approved response-time service level",
  "Privacy policy and terms text review by qualified counsel",
  "Email notification and CRM integration approval for RFQ workflow",
  "Leadership: Praveen H C (Managing Director) and Prakash H C (Director) confirmed by management; six mandate roles published as open mandates until appointees are confirmed",
  "Approved careers listings before specific roles are advertised",
  "Sustainability baseline measurements before any environmental claim is published",
];
