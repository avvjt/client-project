import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/lib/db";
import {
  careersSchema,
  type CareersFieldErrorCode,
  type CareersInput,
} from "@/lib/careers-schema";
import { checkRateLimit, rateLimitKeyForIp } from "@/lib/rate-limit";
import { verifyRecaptcha, recaptchaConfigured } from "@/lib/recaptcha";

/**
 * Careers intake API — the careers page "contact the careers team" modal
 * portal (job-placement & experience questionnaire).
 *
 * Security controls (mirrors the RFQ / partnership endpoints — the third
 * and last write endpoint of this build):
 * - POST-only; no public read path (GET/PUT/DELETE → 405).
 * - Same-origin enforcement on POSTs (cross-site forgeries rejected).
 * - Per-IP rate limiting (salted-hash keys, in-memory fixed window) —
 *   applications are rare events; the tight limit keeps the queue human.
 * - Body-size cap BEFORE parsing (JSON endpoint, so the cap is small).
 * - Honeypot + minimum fill-time bot checks (silently accepted, never stored).
 * - Server-side schema validation (zod) incl. the cross-field rule that
 *   placement / area / stage belong to the shared allow-lists.
 * - The optional work link is validated as text only — never fetched or
 *   resolved server-side (no SSRF surface).
 * - Google reCAPTCHA v3 server verification when RECAPTCHA_SECRET_KEY is
 *   configured (score-gated, fail-closed); skipped gracefully when unset.
 * - Localized error codes, no echo of input; PII never logged.
 * - Text-only intake: no attachments, no filesystem surface at all.
 * - Enquiry + audit event written in a single database transaction with a
 *   collision-safe randomized reference.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MIN_FILL_MS = 2500;
const MAX_BODY_BYTES = 64 * 1024; // JSON only — 64 KB is generous
const REFERENCE_ATTEMPTS = 3;

/** Restrained audit logging — never log form contents, emails, or IPs. */
function logInfo(action: string) {
  console.info(`[careers] ${action}`);
}
function logError(action: string, err?: unknown) {
  console.error(`[careers] ${action}`, err instanceof Error ? err.name : "unknown");
}

function makeReference(): string {
  const year = new Date().getFullYear();
  const rand = crypto.randomBytes(3).toString("hex").toUpperCase();
  return `CAR-${year}-${rand}`;
}

function fail(code: string, fields?: Record<string, CareersFieldErrorCode>, status = 400) {
  return NextResponse.json({ ok: false, code, ...(fields ? { fields } : {}) }, { status });
}

/**
 * Enquiry + audit-event consistency: both records are written in a single
 * database transaction, so a failure can never leave a stored application
 * without its audit trail — or an orphaned audit row. Reference collisions
 * (unique constraint) are retried with a fresh reference.
 */
async function createCareersWithAudit(data: CareersInput) {
  let lastError: unknown = new Error("reference_unavailable");
  for (let attempt = 0; attempt < REFERENCE_ATTEMPTS; attempt++) {
    const reference = makeReference();
    try {
      return await db.$transaction(async (tx) => {
        const created = await tx.careersEnquiry.create({
          data: {
            reference,
            fullName: data.fullName,
            email: data.email,
            phone: data.phone || null,
            country: data.country,
            placement: data.placement,
            area: data.area,
            stage: data.stage,
            spark: data.spark,
            horizon: data.horizon || null,
            link: data.link || null,
            consent: data.consent,
            locale: data.locale,
          },
        });
        await tx.careersAuditEvent.create({
          data: {
            careersId: created.id,
            action: "CREATED",
            detail: "Submitted via careers portal",
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
    const rl = checkRateLimit(rateLimitKeyForIp(req, "careers"), 3, 60 * 60 * 1000);
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
      return NextResponse.json({ ok: true, reference: makeReference() }, { status: 201 });
    }

    // 6) Server-side schema validation.
    const parsed = careersSchema.safeParse({
      fullName: body.fullName ?? "",
      email: body.email ?? "",
      phone: body.phone ?? "",
      country: body.country ?? "",
      placement: body.placement ?? "",
      area: body.area ?? "",
      stage: body.stage ?? "",
      spark: body.spark ?? "",
      horizon: body.horizon ?? "",
      link: typeof body.link === "string" ? body.link : "",
      consent: body.consent === true,
      locale: body.locale ?? "en",
    });

    if (!parsed.success) {
      const fields: Record<string, CareersFieldErrorCode> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] ?? "form");
        const code = String(issue.message) as CareersFieldErrorCode;
        if (!fields[key]) fields[key] = code;
      }
      logInfo("validation failed");
      return fail("VALIDATION", fields);
    }

    // 7) reCAPTCHA v3 — enforced only when the server holds a secret key.
    //     The client earns the token with action "careers_submit".
    const captcha = await verifyRecaptcha(
      typeof body.recaptchaToken === "string" ? body.recaptchaToken : "",
      "careers_submit"
    );
    if (!captcha.ok) {
      logInfo(`recaptcha rejected (${captcha.reason})`);
      return fail("CAPTCHA", undefined, 403);
    }
    if (captcha.ok && !recaptchaConfigured()) {
      logInfo("recaptcha not configured — skipped");
    }

    // 8) Persist privately + audit trail (single transaction).
    const created = await createCareersWithAudit(parsed.data);
    logInfo("submission accepted");
    return NextResponse.json({ ok: true, reference: created.reference }, { status: 201 });
  } catch (err) {
    logError("submission failed", err);
    return fail("SERVER", undefined, 500);
  }
}

// No public read path for recruitment data — by design.
export async function GET() {
  return NextResponse.json({ ok: false, code: "METHOD" }, { status: 405, headers: { Allow: "POST" } });
}

export async function PUT() {
  return NextResponse.json({ ok: false, code: "METHOD" }, { status: 405, headers: { Allow: "POST" } });
}

export async function DELETE() {
  return NextResponse.json({ ok: false, code: "METHOD" }, { status: 405, headers: { Allow: "POST" } });
}
