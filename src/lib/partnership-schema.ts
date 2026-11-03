import { z } from "zod";
import { PARTNERSHIP_FOCUS, PARTNERSHIP_TRACKS } from "@/content/partnership";
import { LOCALES } from "@/lib/i18n/config";

/**
 * Shared partnership-modal validation schema (client pre-check + server
 * authority). Mirrors the RFQ schema's conventions:
 * - Field-level error codes (not messages) so the client can localize.
 * - Trim + bounded lengths on every free-text field.
 * - Cross-field rule: `focus` must belong to the submitted track's
 *   allow-list — a client cannot mix tracks and options.
 * Raw input is never echoed to logs.
 */
export const partnershipSchema = z
  .object({
    track: z.enum(PARTNERSHIP_TRACKS, { error: "CHOICE" }),
    organization: z.string().trim().min(2, "SHORT").max(160, "LONG"),
    contactName: z.string().trim().min(2, "SHORT").max(120, "LONG"),
    email: z.string().trim().max(200, "LONG").pipe(z.email("EMAIL")),
    phone: z.string().trim().max(40, "LONG").optional().or(z.literal("")),
    country: z.string().trim().min(2, "SHORT").max(80, "LONG"),
    focus: z.string().trim().min(1, "REQUIRED").max(40, "LONG"),
    message: z.string().trim().min(10, "SHORT").max(4000, "LONG"),
    consent: z.literal(true, { error: "CONSENT" }),
    locale: z.enum(LOCALES, { error: "CHOICE" }).default("en"),
  })
  .superRefine((data, ctx) => {
    const allowed = PARTNERSHIP_FOCUS[data.track] ?? [];
    if (!allowed.includes(data.focus)) {
      ctx.addIssue({ code: "custom", path: ["focus"], message: "CHOICE" });
    }
  });

export type PartnershipInput = z.infer<typeof partnershipSchema>;

export type PartnershipFieldErrorCode =
  | "REQUIRED"
  | "SHORT"
  | "LONG"
  | "EMAIL"
  | "CHOICE"
  | "CONSENT";

export type PartnershipErrorCode =
  | "VALIDATION"
  | "RATE_LIMITED"
  | "CAPTCHA"
  | "SERVER";

export interface PartnershipFailureResponse {
  ok: false;
  code: PartnershipErrorCode;
  fields?: Record<string, PartnershipFieldErrorCode>;
}

export interface PartnershipSuccessResponse {
  ok: true;
  reference: string;
}
