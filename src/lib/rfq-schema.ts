import { z } from "zod";
import { RFQ_BUYER_TYPES, RFQ_CATEGORIES, RFQ_DELIVERY_OPTIONS } from "@/content/products";
import { LOCALES } from "@/lib/i18n/config";

/**
 * Shared RFQ validation schema (client pre-check + server authority).
 * Field-level error codes are returned to the client so messages can be
 * localized; raw input is never echoed to logs.
 */
export const rfqSchema = z.object({
  organization: z.string().trim().min(2, "SHORT").max(160, "LONG"),
  contactName: z.string().trim().min(2, "SHORT").max(120, "LONG"),
  email: z.string().trim().max(200, "LONG").pipe(z.email("EMAIL")),
  phone: z.string().trim().max(40, "LONG").optional().or(z.literal("")),
  country: z.string().trim().min(2, "SHORT").max(80, "LONG"),
  buyerType: z.enum(RFQ_BUYER_TYPES, { error: "CHOICE" }),
  productCategory: z.enum(RFQ_CATEGORIES, { error: "CHOICE" }),
  productCode: z.string().trim().max(120, "LONG").optional().or(z.literal("")),
  quantity: z.string().trim().min(1, "REQUIRED").max(120, "LONG"),
  technicalRequirements: z.string().trim().min(10, "SHORT").max(4000, "LONG"),
  packagingRequirements: z.string().trim().max(400, "LONG").optional().or(z.literal("")),
  deliveryTimeframe: z.enum(RFQ_DELIVERY_OPTIONS, { error: "CHOICE" }),
  consent: z.literal(true, { error: "CONSENT" }),
  locale: z.enum(LOCALES, { error: "CHOICE" }).default("en"),
});

export type RfqInput = z.infer<typeof rfqSchema>;

export type RfqFieldErrorCode =
  | "REQUIRED"
  | "SHORT"
  | "LONG"
  | "EMAIL"
  | "CHOICE"
  | "CONSENT";

export type RfqErrorCode =
  | "VALIDATION"
  | "FILE_TYPE"
  | "FILE_TOO_LARGE"
  | "RATE_LIMITED"
  | "CAPTCHA"
  | "SERVER";

export interface RfqFailureResponse {
  ok: false;
  code: RfqErrorCode;
  fields?: Record<string, RfqFieldErrorCode>;
}

export interface RfqSuccessResponse {
  ok: true;
  reference: string;
}

/** Upload constraints (mirrored client-side for fast feedback). */
export const RFQ_UPLOAD = {
  maxBytes: 10 * 1024 * 1024,
  allowedExtensions: [
    "pdf",
    "png",
    "jpg",
    "jpeg",
    "dwg",
    "dxf",
    "step",
    "stp",
    "xlsx",
    "docx",
  ] as readonly string[],
} as const;

export function fileExtensionOf(name: string): string {
  const parts = name.split(".");
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : "";
}
