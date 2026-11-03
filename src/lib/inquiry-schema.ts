import { z } from "zod";
import { LOCALES } from "@/lib/i18n/config";
import {
  INQUIRY_AI_DOMAINS,
  INQUIRY_AI_STAGES,
  INQUIRY_INVESTOR_FOCUS,
  INQUIRY_INVESTOR_HORIZON,
  INQUIRY_MARKET_OTHER,
  INQUIRY_OUTSIDE_INDIA,
  INQUIRY_SUPPLY_SECTORS,
  INQUIRY_VENDOR_CATEGORIES,
  INQUIRY_VENDOR_STAGES,
  isSupplyMarket,
  isVendorState,
} from "@/content/inquiry";

/**
 * Shared inquiry validation schema (client pre-check + server authority)
 * for the four page-level standalone modal portals:
 * - investor: Investors & Strategic Partners — "request an investor discussion"
 * - ai:       Technology & AI Posture — "discuss a collaboration"
 * - vendor:   Vendors & Suppliers — "start a supplier conversation" (state
 *             dropdown covering all Indian states & union territories)
 * - supply:   Global Supply — market identified by country + flag
 *
 * Conventions mirror the RFQ / partnership / careers schemas:
 * - Field-level error codes (not messages) so the client can localize.
 * - Trim + bounded lengths on every free-text field.
 * - Cross-field rules: focus / horizon / stage / state / market tokens must
 *   each belong to the shared allow-lists — a client cannot invent tokens;
 *   market "other" requires the free-text marketOther name.
 * - The optional link must look like an absolute http(s) URL; stored as
 *   text only (never fetched server-side — no SSRF surface).
 * Raw input is never echoed to logs.
 */

const linkField = z.preprocess(
  (v) => (typeof v === "string" ? v.trim() : ""),
  z
    .string()
    .max(300, "LONG")
    .refine((v) => v === "" || /^https?:\/\/\S+\.\S+/.test(v), "URL")
);

const sharedIdentity = {
  organization: z.string().trim().min(2, "SHORT").max(160, "LONG"),
  contactName: z.string().trim().min(2, "SHORT").max(120, "LONG"),
  email: z.string().trim().max(200, "LONG").pipe(z.email("EMAIL")),
  phone: z.string().trim().max(40, "LONG").optional().or(z.literal("")),
  country: z.string().trim().min(2, "SHORT").max(80, "LONG"),
  narrative: z.string().trim().min(20, "SHORT").max(3000, "LONG"),
  vision: z.string().trim().max(2000, "LONG").optional().or(z.literal("")),
  link: linkField,
  consent: z.literal(true, { error: "CONSENT" }),
  locale: z.enum(LOCALES, { error: "CHOICE" }).default("en"),
};

export const investorInquirySchema = z.object({
  track: z.literal("investor", { error: "CHOICE" }),
  ...sharedIdentity,
  focus: z.string().trim().min(1, "REQUIRED").max(40, "LONG"),
  horizon: z.string().trim().min(1, "REQUIRED").max(40, "LONG"),
});

export const aiInquirySchema = z.object({
  track: z.literal("ai", { error: "CHOICE" }),
  ...sharedIdentity,
  focus: z.string().trim().min(1, "REQUIRED").max(40, "LONG"),
  stage: z.string().trim().min(1, "REQUIRED").max(40, "LONG"),
});

export const vendorInquirySchema = z.object({
  track: z.literal("vendor", { error: "CHOICE" }),
  ...sharedIdentity,
  focus: z.string().trim().min(1, "REQUIRED").max(40, "LONG"),
  state: z.string().trim().min(1, "REQUIRED").max(40, "LONG"),
  stage: z.string().trim().min(1, "REQUIRED").max(40, "LONG"),
});

export const supplyInquirySchema = z
  .object({
    track: z.literal("supply", { error: "CHOICE" }),
    organization: sharedIdentity.organization,
    contactName: sharedIdentity.contactName,
    email: sharedIdentity.email,
    phone: sharedIdentity.phone,
    focus: z.string().trim().min(1, "REQUIRED").max(40, "LONG"),
    market: z.string().trim().min(1, "REQUIRED").max(40, "LONG"),
    marketOther: z.preprocess(
      (v) => (typeof v === "string" ? v.trim() : ""),
      z.string().max(80, "LONG")
    ),
    narrative: sharedIdentity.narrative,
    vision: sharedIdentity.vision,
    link: linkField,
    consent: sharedIdentity.consent,
    locale: sharedIdentity.locale,
  })
  .superRefine((data, ctx) => {
    if (data.market === INQUIRY_MARKET_OTHER && data.marketOther.length < 2) {
      ctx.addIssue({ code: "custom", path: ["marketOther"], message: "REQUIRED" });
    }
  });

export const inquirySchema = z.discriminatedUnion("track", [
  investorInquirySchema,
  aiInquirySchema,
  vendorInquirySchema,
  supplyInquirySchema,
]);

/** Allow-list cross-checks applied after the union shape parsed. */
export function validateInquiryTokens(
  data: z.infer<typeof inquirySchema>
): Record<string, "CHOICE"> | null {
  const bad: Record<string, "CHOICE"> = {};
  if (data.track === "investor") {
    if (!INQUIRY_INVESTOR_FOCUS.includes(data.focus)) bad.focus = "CHOICE";
    if (!INQUIRY_INVESTOR_HORIZON.includes(data.horizon)) bad.horizon = "CHOICE";
  } else if (data.track === "ai") {
    if (!INQUIRY_AI_DOMAINS.includes(data.focus)) bad.focus = "CHOICE";
    if (!INQUIRY_AI_STAGES.includes(data.stage)) bad.stage = "CHOICE";
  } else if (data.track === "vendor") {
    if (!INQUIRY_VENDOR_CATEGORIES.includes(data.focus)) bad.focus = "CHOICE";
    if (!isVendorState(data.state)) bad.state = "CHOICE";
    if (!INQUIRY_VENDOR_STAGES.includes(data.stage)) bad.stage = "CHOICE";
  } else if (data.track === "supply") {
    if (!INQUIRY_SUPPLY_SECTORS.includes(data.focus)) bad.focus = "CHOICE";
    if (!isSupplyMarket(data.market)) bad.market = "CHOICE";
    if (data.market === INQUIRY_MARKET_OTHER) {
      // Name is free text — only bound-check already done by the schema.
    }
  }
  return Object.keys(bad).length > 0 ? bad : null;
}

export type InquiryInput = z.infer<typeof inquirySchema>;
export type InquiryTrackValue = InquiryInput["track"];

export type InquiryFieldErrorCode =
  | "REQUIRED"
  | "SHORT"
  | "LONG"
  | "EMAIL"
  | "CHOICE"
  | "CONSENT"
  | "URL";

export type InquiryErrorCode = "VALIDATION" | "RATE_LIMITED" | "CAPTCHA" | "SERVER";

export interface InquiryFailureResponse {
  ok: false;
  code: InquiryErrorCode;
  fields?: Record<string, InquiryFieldErrorCode>;
}

export interface InquirySuccessResponse {
  ok: true;
  reference: string;
}
