import { z } from "zod";
import { CAREERS_AREAS, CAREERS_PLACEMENTS, CAREERS_STAGES } from "@/content/careers";
import { LOCALES } from "@/lib/i18n/config";

/**
 * Shared careers-modal validation schema (client pre-check + server
 * authority). Mirrors the RFQ / partnership schema conventions:
 * - Field-level error codes (not messages) so the client can localize.
 * - Trim + bounded lengths on every free-text field.
 * - Cross-field rules: placement / area / stage must each belong to the
 *   shared allow-list — a client cannot invent tokens.
 * - The optional work link must look like an absolute http(s) URL; it is
 *   stored as text only (never fetched server-side).
 * Raw input is never echoed to logs.
 */
export const careersSchema = z
  .object({
    fullName: z.string().trim().min(2, "SHORT").max(120, "LONG"),
    email: z.string().trim().max(200, "LONG").pipe(z.email("EMAIL")),
    phone: z.string().trim().max(40, "LONG").optional().or(z.literal("")),
    country: z.string().trim().min(2, "SHORT").max(80, "LONG"),
    placement: z.string().trim().min(1, "REQUIRED").max(40, "LONG"),
    area: z.string().trim().min(1, "REQUIRED").max(40, "LONG"),
    stage: z.string().trim().min(1, "REQUIRED").max(40, "LONG"),
    spark: z.string().trim().min(20, "SHORT").max(3000, "LONG"),
    horizon: z.string().trim().max(2000, "LONG").optional().or(z.literal("")),
    link: z.preprocess(
      (v) => (typeof v === "string" ? v.trim() : ""),
      z
        .string()
        .max(300, "LONG")
        .refine((v) => v === "" || /^https?:\/\/\S+\.\S+/.test(v), "URL")
    ),
    consent: z.literal(true, { error: "CONSENT" }),
    locale: z.enum(LOCALES, { error: "CHOICE" }).default("en"),
  })
  .superRefine((data, ctx) => {
    if (!CAREERS_PLACEMENTS.includes(data.placement)) {
      ctx.addIssue({ code: "custom", path: ["placement"], message: "CHOICE" });
    }
    if (!CAREERS_AREAS.includes(data.area)) {
      ctx.addIssue({ code: "custom", path: ["area"], message: "CHOICE" });
    }
    if (!CAREERS_STAGES.includes(data.stage)) {
      ctx.addIssue({ code: "custom", path: ["stage"], message: "CHOICE" });
    }
  });

export type CareersInput = z.infer<typeof careersSchema>;

export type CareersFieldErrorCode =
  | "REQUIRED"
  | "SHORT"
  | "LONG"
  | "EMAIL"
  | "CHOICE"
  | "CONSENT"
  | "URL";

export type CareersErrorCode =
  | "VALIDATION"
  | "RATE_LIMITED"
  | "CAPTCHA"
  | "SERVER";

export interface CareersFailureResponse {
  ok: false;
  code: CareersErrorCode;
  fields?: Record<string, CareersFieldErrorCode>;
}

export interface CareersSuccessResponse {
  ok: true;
  reference: string;
}
