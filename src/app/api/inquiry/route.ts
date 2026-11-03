import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/lib/db";
import {
  inquirySchema,
  validateInquiryTokens,
  type InquiryFieldErrorCode,
  type InquiryInput,
  type InquiryTrackValue,
} from "@/lib/inquiry-schema";
import { INQUIRY_REFERENCE_PREFIX } from "@/content/inquiry";
import { checkRateLimit, rateLimitKeyForIp } from "@/lib/rate-limit";
import { verifyRecaptcha, recaptchaConfigured } from "@/lib/recaptcha";

/**
 * Page-level inquiry intake API — the four standalone modal portals:
 * - investor: Investors & Strategic Partners ("request an investor discussion")
 * - ai:       Technology & AI Posture ("discuss a collaboration")
 * - vendor:   Vendors & Suppliers ("start a supplier conversation", with the
 *             all-India states & union-territories dropdown)
 * - supply:   Global Supply (market identified by country + flag)
 *
 * Security controls (mirrors the RFQ / partnership / careers endpoints):
 * - POST-only; no public read path (GET/PUT/DELETE → 405).
 * - Same-origin enforcement on POSTs (cross-site forgeries rejected).
 * - Per-IP rate limiting (salted-hash keys, in-memory fixed window).
 * - Body-size cap BEFORE parsing (JSON endpoint, so the cap is small).
 * - Honeypot + minimum fill-time bot checks (silently accepted, never stored).
 * - Server-side schema validation (zod discriminated union) incl. the
 *   cross-field allow-list rules for focus / horizon / stage / state / market
 *   tokens — a client cannot invent option values.
 * - The optional link is validated as text only — never fetched or resolved
 *   server-side (no SSRF surface).
 * - Google reCAPTCHA v3 server verification when RECAPTCHA_SECRET_KEY is
 *   configured (score-gated, fail-closed); skipped gracefully when unset.
 * - Localized error codes, no echo of input; PII never logged.
 * - Text-only intake: no attachments, no filesystem surface at all.
 * - Enquiry + audit event written in a single database transaction with a
 *   collision-safe randomized, per-track-prefixed reference.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MIN_FILL_MS = 2500;
const MAX_BODY_BYTES = 64 * 1024; // JSON only — 64 KB is generous
const REFERENCE_ATTEMPTS = 3;

/** Restrained audit logging — never log form contents, emails, or IPs. */
function logInfo(action: string) {
  console.info(`[inquiry] ${action}`);
}
function logError(action: string, err?: unknown) {
  console.error(`[inquiry] ${action}`, err instanceof Error ? err.name : "unknown");
}

function makeReference(track: InquiryTrackValue): string {
  const year = new Date().getFullYear();
  const rand = crypto.randomBytes(3).toString("hex").toUpperCase();
  return `${INQUIRY_REFERENCE_PREFIX[track]}-${year}-${rand}`;
}

function fail(code: string, fields?: Record<string, InquiryFieldErrorCode>, status = 400) {
  return NextResponse.json({ ok: false, code, ...(fields ? { fields } : {}) }, { status });
}

/**
 * Enquiry + audit-event consistency: both records are written in a single
 * database transaction, so a failure can never leave a stored inquiry
 * without its audit trail — or an orphaned audit row. Reference collisions
 * (unique constraint) are retried with a fresh reference.
 */
async function createInquiryWithAudit(data: InquiryInput) {
  let lastError: unknown = new Error("reference_unavailable");
  for (let attempt = 0; attempt < REFERENCE_ATTEMPTS; attempt++) {
    const reference = makeReference(data.track);
    try {
      return await db.$transaction(async (tx) => {
        const base = {
          reference,
          track: data.track,
          organization: data.organization,
          contactName: data.contactName,
          email: data.email,
          phone: data.phone || null,
          country: data.track === "supply" ? null : data.country,
          state: data.track === "vendor" ? data.state : null,
          market: data.track === "supply" ? data.market : null,
          marketOther:
            data.track === "supply" && data.market === "other" ? data.marketOther : null,
          focus: data.focus,
          // investor stores its horizon token here; ai/vendor their stage.
          stage:
            data.track === "investor"
              ? data.horizon
              : data.track === "ai" || data.track === "vendor"
                ? data.stage
                : null,
          narrative: data.narrative,
          vision: data.vision || null,
          link: data.link || null,
          consent: data.consent,
          locale: data.locale,
        };
        const created = await tx.inquiryEnquiry.create({ data: base });
        await tx.inquiryAuditEvent.create({
          data: {
            inquiryId: created.id,
            action: "CREATED",
            detail: `Submitted via ${data.track} inquiry portal`,
          },
        });
        return created;
      });
    } catch (err) {
      lastError = err;
      // P2002 = unique-constraint violation → reference collision; retry.
      if ((err as { code?: string } | null)?.code !== "P2002") throw err;
      logInfo("reference collision — retrying");
    }
  }
  throw lastError;
}

export async function POST(req: NextRequest) {
  try {
    // 1) Same-origin enforcement: browsers always send Origin on POST —
    //    reject only when it names another site.
    const origin = req.headers.get("origin");
    if (origin) {
      const host = req.headers.get("host");
      let originHost: string | null = null;
      try {
        originHost = new URL(origin).host;
      } catch {
        originHost = null;
      }
      if (!host || originHost !== host) {
        logInfo("cross-origin submission rejected");
        return fail("ORIGIN", undefined, 403);
      }
    }

    // 2) Rate limit (3 submissions per hour per network).
    const rl = checkRateLimit(rateLimitKeyForIp(req, "inquiry"), 3, 60 * 60 * 1000);
    if (!rl.allowed) {
      logInfo("rate limited");
      return NextResponse.json(
        { ok: false, code: "RATE_LIMITED" },
        { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } }
      );
    }

    // 3) Reject oversized bodies BEFORE parsing (JSON endpoint — small cap).
    const contentLength = Number(req.headers.get("content-length") ?? 0);
    if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
      logInfo("rejected oversized body");
      return fail("SERVER", undefined, 413);
    }

    // 4) Parse JSON body.
    let body: Record<string, unknown>;
    try {
      body = (await req.json()) as Record<string, unknown>;
    } catch {
      logInfo("malformed JSON body");
      return fail("VALIDATION");
    }

    // 5) Bot checks — honeypot field + minimum fill time. Pretend success.
    //    A missing or non-positive startedAt is treated as a bot signal: the
    //    real form always stamps its mount time.
    const honeypot = String(body.company_website ?? "").trim();
    const startedAt = Number(body.startedAt ?? 0);
    if (
      honeypot.length > 0 ||
      !Number.isFinite(startedAt) ||
      startedAt <= 0 ||
      Date.now() - startedAt < MIN_FILL_MS
    ) {
      logInfo("bot submission dropped");
      return NextResponse.json(
        { ok: true, reference: makeReference("supply") },
        { status: 201 }
      );
    }

    // 6) Server-side schema validation (discriminated by track).
    const parsed = inquirySchema.safeParse({
      track: body.track ?? "",
      organization: body.organization ?? "",
      contactName: body.contactName ?? "",
      email: body.email ?? "",
      phone: body.phone ?? "",
      country: body.country ?? "",
      focus: body.focus ?? "",
      horizon: body.horizon ?? "",
      state: body.state ?? "",
      stage: body.stage ?? "",
      market: body.market ?? "",
      marketOther: typeof body.marketOther === "string" ? body.marketOther : "",
      narrative: body.narrative ?? "",
      vision: body.vision ?? "",
      link: typeof body.link === "string" ? body.link : "",
      consent: body.consent === true,
      locale: body.locale ?? "en",
    });

    if (!parsed.success) {
      const fields: Record<string, InquiryFieldErrorCode> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] ?? "form");
        const code = String(issue.message) as InquiryFieldErrorCode;
        if (!fields[key]) fields[key] = code;
      }
      logInfo("validation failed");
      return fail("VALIDATION", fields);
    }

    // 6b) Allow-list cross-checks (focus / horizon / stage / state / market).
    const tokenErrors = validateInquiryTokens(parsed.data);
    if (tokenErrors) {
      logInfo("unknown option token rejected");
      return fail("VALIDATION", tokenErrors);
    }

    // 7) reCAPTCHA v3 — enforced only when the server holds a secret key.
    //     The client earns the token with action "inquiry_submit".
    const captcha = await verifyRecaptcha(
      typeof body.recaptchaToken === "string" ? body.recaptchaToken : "",
      "inquiry_submit"
    );
    if (!captcha.ok) {
      logInfo(`recaptcha rejected (${captcha.reason})`);
      return fail("CAPTCHA", undefined, 403);
    }
    if (captcha.ok && !recaptchaConfigured()) {
      logInfo("recaptcha not configured — skipped");
    }

    // 8) Persist privately + audit trail (single transaction).
    const created = await createInquiryWithAudit(parsed.data);
    logInfo(`submission accepted (${parsed.data.track})`);
    return NextResponse.json({ ok: true, reference: created.reference }, { status: 201 });
  } catch (err) {
    logError("submission failed", err);
    return fail("SERVER", undefined, 500);
  }
}

// No public read path for inquiry data — by design.
export async function GET() {
  return NextResponse.json({ ok: false, code: "METHOD" }, { status: 405, headers: { Allow: "POST" } });
}

export async function PUT() {
  return NextResponse.json({ ok: false, code: "METHOD" }, { status: 405, headers: { Allow: "POST" } });
}

export async function DELETE() {
  return NextResponse.json({ ok: false, code: "METHOD" }, { status: 405, headers: { Allow: "POST" } });
}
