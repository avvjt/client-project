/**
 * DISPO-CONCEPT — PRODUCT CATALOGUE SOURCE OF TRUTH
 *
 * GOVERNANCE RULES (per master brief):
 * - This file is the single source of truth for catalogue structure.
 * - Human-readable strings live in translation dictionaries (products.items.*).
 * - Spec values that are NOT publicly verified are `null` and render as
 *   "Confirm with our team" — never invent materials, dimensions, sterility
 *   claims, standards, packing data, or availability promises.
 * - `supplyRoleVerified: false` means whether the item is manufactured
 *   in-house or sourced/distributed must be confirmed by management before
 *   any public claim is made.
 * - Variant names marked `listed: true` come from the company's existing
 *   catalogue register; their exact intended-use wording still requires
 *   management confirmation before regulatory-adjacent wording is published.
 */

export type SpecLabelKey =
  | "material"
  | "construction"
  | "sizes"
  | "variants"
  | "packaging"
  | "sterility"
  | "documentation"
  | "availability";

export interface SpecRow {
  label: SpecLabelKey;
  /** null → not publicly verified → renders "Confirm with our team". */
  value: string | null;
}

export interface ProductVariant {
  name: string;
  /** true = name comes from the company catalogue register (still confirm intended use) */
  listed?: boolean;
}

export interface ProductFamily {
  slug: string;
  /** Dictionary key shared by products.items.* / familyNames.* / rfq.categories.* */
  key: "gowns" | "kits" | "masks" | "caps" | "shoeCovers" | "wraps" | "customPacks";
  image: string;
  supplyRoleVerified: boolean;
  variants: ProductVariant[];
  specs: SpecRow[];
  related: string[];
}

export const PRODUCT_FAMILIES: ProductFamily[] = [
  {
    slug: "surgical-gowns",
    key: "gowns",
    image: "/images/product-gowns.png",
    supplyRoleVerified: false,
    variants: [
      { name: "Standard", listed: true },
      { name: "Reinforced (BVB)", listed: true },
      { name: "Double-layer", listed: true },
    ],
    specs: [
      { label: "variants", value: "Standard · Reinforced (BVB) · Double-layer" },
      { label: "material", value: null },
      { label: "sizes", value: null },
      { label: "packaging", value: null },
      { label: "sterility", value: null },
      { label: "documentation", value: null },
    ],
    related: ["procedure-kits", "medical-caps", "custom-packs"],
  },
  {
    slug: "procedure-kits",
    key: "kits",
    image: "/images/product-procedure-kits.png",
    supplyRoleVerified: false,
    variants: [
      { name: "General", listed: true },
      { name: "Delivery", listed: true },
      { name: "Urology", listed: true },
      { name: "Orthopaedic", listed: true },
      { name: "Cardiac", listed: true },
    ],
    specs: [
      { label: "variants", value: "General · Delivery · Urology · Orthopaedic · Cardiac" },
      { label: "construction", value: null },
      { label: "packaging", value: null },
      { label: "sterility", value: null },
      { label: "documentation", value: null },
    ],
    related: ["surgical-gowns", "custom-packs", "sterilization-wraps"],
  },
  {
    slug: "face-masks",
    key: "masks",
    image: "/images/product-masks.png",
    supplyRoleVerified: false,
    variants: [
      { name: "2-ply", listed: true },
      { name: "3-ply", listed: true },
    ],
    specs: [
      { label: "variants", value: "2-ply · 3-ply" },
      { label: "material", value: null },
      { label: "packaging", value: null },
      { label: "documentation", value: null },
    ],
    related: ["medical-caps", "shoe-covers", "surgical-gowns"],
  },
  {
    slug: "medical-caps",
    key: "caps",
    image: "/images/product-caps.png",
    supplyRoleVerified: false,
    variants: [],
    specs: [
      { label: "material", value: null },
      { label: "sizes", value: null },
      { label: "packaging", value: null },
      { label: "documentation", value: null },
    ],
    related: ["face-masks", "shoe-covers", "surgical-gowns"],
  },
  {
    slug: "shoe-covers",
    key: "shoeCovers",
    image: "/images/product-shoe-covers.png",
    supplyRoleVerified: false,
    variants: [],
    specs: [
      { label: "material", value: null },
      { label: "sizes", value: null },
      { label: "packaging", value: null },
      { label: "documentation", value: null },
    ],
    related: ["medical-caps", "face-masks", "surgical-gowns"],
  },
  {
    slug: "sterilization-wraps",
    key: "wraps",
    image: "/images/product-sterilization-wrap.png",
    supplyRoleVerified: false,
    variants: [],
    specs: [
      { label: "material", value: null },
      { label: "sizes", value: null },
      { label: "packaging", value: null },
      { label: "documentation", value: null },
    ],
    related: ["procedure-kits", "custom-packs", "surgical-gowns"],
  },
  {
    slug: "custom-packs",
    key: "customPacks",
    image: "/images/product-custom-packs.png",
    supplyRoleVerified: false,
    variants: [],
    specs: [
      { label: "construction", value: null },
      { label: "variants", value: null },
      { label: "packaging", value: null },
      { label: "sterility", value: null },
      { label: "documentation", value: null },
    ],
    related: ["procedure-kits", "surgical-gowns", "sterilization-wraps"],
  },
];

export function getProduct(slug: string): ProductFamily | undefined {
  return PRODUCT_FAMILIES.find((p) => p.slug === slug);
}

/** Category options used by the RFQ form (dictionary keys + "other"). */
export const RFQ_CATEGORIES = [
  ...PRODUCT_FAMILIES.map((p) => p.key),
  "other",
] as const;
export type RfqCategory = (typeof RFQ_CATEGORIES)[number];

/** Buyer types used by the RFQ form. */
export const RFQ_BUYER_TYPES = [
  "hospital",
  "distributor",
  "group",
  "oem",
  "wholesaler",
  "international",
  "other",
] as const;
export type RfqBuyerType = (typeof RFQ_BUYER_TYPES)[number];

/** Delivery timeframe options used by the RFQ form. */
export const RFQ_DELIVERY_OPTIONS = ["discuss", "weeks4", "months13", "project"] as const;
export type RfqDeliveryOption = (typeof RFQ_DELIVERY_OPTIONS)[number];
