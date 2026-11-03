import { NextRequest, NextResponse } from "next/server";
import { mkdir, writeFile, unlink } from "fs/promises";
import path from "path";
import crypto from "crypto";
import { db } from "@/lib/db";
import { rfqSchema, fileExtensionOf, RFQ_UPLOAD, type RfqFieldErrorCode, type RfqInput } from "@/lib/rfq-schema";
import { checkRateLimit, rateLimitKeyForIp } from "@/lib/rate-limit";
import { verifyRecaptcha, recaptchaConfigured } from "@/lib/recaptcha";

/**
 * RFQ intake API — the ONLY write endpoint of this build.
 *
 * Security controls:
 * - POST-only; no public read path (GET/PUT/DELETE → 405).
 * - Same-origin enforcement on POSTs (cross-site forgeries rejected).
 * - Per-IP rate limiting (salted-hash keys, in-memory fixed window).
 * - Google reCAPTCHA v3 server verification when RECAPTCHA_SECRET_KEY is
 *   configured (score-gated, fail-closed); skipped gracefully when unset.
 * - Honeypot + minimum fill-time bot checks (silently accepted, never stored).
 * - Server-side schema validation (zod) BEFORE any filesystem write — failed
 *   or spam submissions can no longer leave orphaned attachment files.
 * - Localized error codes, no echo of input.
 * - Attachments: extension + magic-byte allow-list, 10 MB cap, stored OUTSIDE
 *   the public web root under randomized names (original filenames are
 *   discarded), mode 0600, never served by any route.
 *
 * Known limitation (documented, per brief): no malware-scanning daemon is
 * available in this environment. Until a scanner (e.g. ClamAV) is integrated,
 * attachments must be treated as untrusted: opened only in sandboxed viewers,
 * never executed, and never redistributed. This is recorded in the delivery
 * report as an open item for management.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const UPLOAD_DIR = path.join(process.cwd(), ".private-uploads");
const MIN_FILL_MS = 2500;

/** Restrained audit logging — never log form contents, emails, or filenames. */
function logInfo(action: string) {
  console.info(`[rfq] ${action}`);
}
function logError(action: string, err?: unknown) {
  console.error(`[rfq] ${action}`, err instanceof Error ? err.name : "unknown");
}

function makeReference(): string {
  const year = new Date().getFullYear();
  const rand = crypto.randomBytes(3).toString("hex").toUpperCase();
  return `RFQ-${year}-${rand}`;
}

/**
 * Reference uniqueness retry: the reference is randomly generated and
 * unique-constrained in the database. A collision (astronomically unlikely,
 * but a hard 500 if it ever happened) is retried with a fresh reference
 * instead of failing the submission.
 */
const REFERENCE_ATTEMPTS = 3;

/**
 * RFQ + audit-event consistency (release-blocker P1.7): both records are
 * written in a single database transaction, so a failure can never leave a
 * stored enquiry without its audit trail — or an orphaned audit row.
 */
function createRfqWithAudit(data: RfqInput, attachment: {
  path: string | null;
  type: string | null;
  size: number | null;
}) {
  let lastError: unknown = new Error("reference_unavailable");
  for (let attempt = 0; attempt < REFERENCE_ATTEMPTS; attempt++) {
    const reference = makeReference();
    try {
      return db.$transaction(async (tx) => {
        const created = await tx.rfq.create({
          data: {
            reference,
            organization: data.organization,
            contactName: data.contactName,
            email: data.email,
            phone: data.phone || null,
            country: data.country,
            buyerType: data.buyerType,
            productCategory: data.productCategory,
            productCode: data.productCode || null,
            quantity: data.quantity,
            technicalRequirements: data.technicalRequirements,
            packagingRequirements: data.packagingRequirements || null,
            deliveryTimeframe: data.deliveryTimeframe,
            attachmentPath: attachment.path,
            attachmentType: attachment.type,
            attachmentSize: attachment.size,
            consent: data.consent,
            locale: data.locale,
          },
        });
        await tx.auditEvent.create({
          data: { rfqId: created.id, action: "CREATED", detail: "Submitted via public RFQ form" },
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

/** Basic magic-byte verification for formats where a signature is checkable. */
function magicBytesOk(buf: Buffer, ext: string): boolean {
  if (buf.length < 4) return false;
  switch (ext) {
    case "pdf":
      return buf.subarray(0, 5).toString("latin1") === "%PDF-";
    case "png":
      return buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47;
    case "jpg":
    case "jpeg":
      return buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff;
    case "xlsx":
    case "docx":
      // Office formats are ZIP containers — verify the PK signature so a
      // renamed executable cannot pass by extension alone.
      return buf[0] === 0x50 && buf[1] === 0x4b && (buf[2] === 0x03 || buf[2] === 0x05 || buf[2] === 0x07) && buf[3] === 0x04;
    default:
      // DWG/DXF/STEP: no reliable header check implemented —
      // accepted by extension only (see documented limitation above).
      return true;
  }
}

function fail(code: string, fields?: Record<string, RfqFieldErrorCode>, status = 400) {
  return NextResponse.json({ ok: false, code, ...(fields ? { fields } : {}) }, { status });
}

export async function POST(req: NextRequest) {
  try {
    // 1) Same-origin enforcement: multipart POSTs are CORS "simple requests",
    //    so a cross-site form post would otherwise execute. Browsers always
    //    send Origin on POST — reject only when it names another site.
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

    // 2) Rate limit (5 submissions per hour per network).
    const rl = checkRateLimit(rateLimitKeyForIp(req, "rfq"), 5, 60 * 60 * 1000);
    if (!rl.allowed) {
      logInfo("rate limited");
      return NextResponse.json(
        { ok: false, code: "RATE_LIMITED" },
        { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } }
      );
    }

    // 2b) Reject oversized request bodies BEFORE buffering the multipart
    //     payload in memory (App Router has no default body-size limit).
    //     Slack covers the form fields around the 10 MB attachment cap.
    const contentLength = Number(req.headers.get("content-length") ?? 0);
    if (Number.isFinite(contentLength) && contentLength > RFQ_UPLOAD.maxBytes + 2 * 1024 * 1024) {
      logInfo("rejected oversized body");
      return fail("FILE_TOO_LARGE", undefined, 413);
    }

    const form = await req.formData();

    // 3) Bot checks — honeypot field + minimum fill time. Pretend success.
    //    A missing or non-positive startedAt is treated as a bot signal: the
    //    real form always stamps its mount time, so "0" means the field was
    //    fabricated by a script (previously a bypass).
    const honeypot = String(form.get("company_website") ?? "").trim();
    const startedAt = Number(form.get("startedAt") ?? 0);
    if (
      honeypot.length > 0 ||
      !Number.isFinite(startedAt) ||
      startedAt <= 0 ||
      Date.now() - startedAt < MIN_FILL_MS
    ) {
      logInfo("bot submission dropped");
      return NextResponse.json({ ok: true, reference: makeReference() }, { status: 201 });
    }

    // 4) Server-side schema validation BEFORE any filesystem write.
    const parsed = rfqSchema.safeParse({
      organization: form.get("organization") ?? "",
      contactName: form.get("contactName") ?? "",
      email: form.get("email") ?? "",
      phone: form.get("phone") ?? "",
      country: form.get("country") ?? "",
      buyerType: form.get("buyerType") ?? "",
      productCategory: form.get("productCategory") ?? "",
      productCode: form.get("productCode") ?? "",
      quantity: form.get("quantity") ?? "",
      technicalRequirements: form.get("technicalRequirements") ?? "",
      packagingRequirements: form.get("packagingRequirements") ?? "",
      deliveryTimeframe: form.get("deliveryTimeframe") ?? "",
      consent: form.get("consent") === "true",
      locale: form.get("locale") ?? "en",
    });

    if (!parsed.success) {
      const fields: Record<string, RfqFieldErrorCode> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] ?? "form");
        const code = String(issue.message) as RfqFieldErrorCode;
        if (!fields[key]) fields[key] = code;
      }
      logInfo("validation failed");
      return fail("VALIDATION", fields);
    }

    const data = parsed.data;

    // 4b) reCAPTCHA v3 — enforced only when the server holds a secret key.
    //      The client earns the token with action "rfq_submit"; the server
    //      verifies success, score, action and (when configured) hostname.
    const captcha = await verifyRecaptcha(String(form.get("recaptchaToken") ?? ""), "rfq_submit");
    if (!captcha.ok) {
      logInfo(`recaptcha rejected (${captcha.reason})`);
      return fail("CAPTCHA", undefined, 403);
    }
    if (captcha.ok && !recaptchaConfigured()) {
      logInfo("recaptcha not configured — skipped");
    }

    // 5) Optional attachment — validated in memory BEFORE the file is written.
    let attachmentPath: string | null = null;
    let attachmentType: string | null = null;
    let attachmentSize: number | null = null;
    const fileEntry = form.get("attachment");

    if (fileEntry && typeof fileEntry !== "string" && fileEntry.size > 0) {
      const ext = fileExtensionOf(fileEntry.name);
      if (!RFQ_UPLOAD.allowedExtensions.includes(ext)) {
        logInfo("rejected attachment type");
        return fail("FILE_TYPE");
      }
      if (fileEntry.size > RFQ_UPLOAD.maxBytes) {
        logInfo("rejected attachment size");
        return fail("FILE_TOO_LARGE", undefined, 413);
      }
      const buffer = Buffer.from(await fileEntry.arrayBuffer());
      if (!magicBytesOk(buffer, ext)) {
        logInfo("rejected attachment magic bytes");
        return fail("FILE_TYPE");
      }
      await mkdir(UPLOAD_DIR, { recursive: true, mode: 0o700 });
      // Randomized name; original filename intentionally discarded.
      const storedName = `${crypto.randomUUID()}.${ext}`;
      await writeFile(path.join(UPLOAD_DIR, storedName), buffer, { mode: 0o600 });
      attachmentPath = storedName;
      attachmentType = ext;
      attachmentSize = fileEntry.size;
    }

    // 6) Persist privately + audit trail (single transaction, collision-safe).
    //    If the DB write fails after the attachment has been stored, remove
    //    the orphan file before returning.
    try {
      const created = await createRfqWithAudit(data, {
        path: attachmentPath,
        type: attachmentType,
        size: attachmentSize,
      });
      const reference = created.reference;
      logInfo("submission accepted");
      return NextResponse.json({ ok: true, reference }, { status: 201 });
    } catch (dbErr) {
      if (attachmentPath) {
        await unlink(path.join(UPLOAD_DIR, attachmentPath)).catch(() => undefined);
      }
      throw dbErr;
    }
  } catch (err) {
    logError("submission failed", err);
    return fail("SERVER", undefined, 500);
  }
}

// No public read path for enquiry data — by design.
export async function GET() {
  return NextResponse.json({ ok: false, code: "METHOD" }, { status: 405, headers: { Allow: "POST" } });
}

export async function PUT() {
  return NextResponse.json({ ok: false, code: "METHOD" }, { status: 405, headers: { Allow: "POST" } });
}

export async function DELETE() {
  return NextResponse.json({ ok: false, code: "METHOD" }, { status: 405, headers: { Allow: "POST" } });
}
