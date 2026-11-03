import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import ZAI from "z-ai-web-dev-sdk";
import { checkRateLimit, rateLimitKeyForIp } from "@/lib/rate-limit";
import { verifyRecaptcha } from "@/lib/recaptcha";

/**
 * Dispo Inteligent — AI assistant endpoint (the only AI write endpoint).
 *
 * Security controls:
 * - POST-only; GET/PUT/DELETE → 405.
 * - Per-IP rate limiting (salted-hash keys, in-memory fixed window).
 * - Google reCAPTCHA v3 server verification when RECAPTCHA_SECRET_KEY is
 *   configured (score-gated, fail-closed); skipped gracefully when unset.
 * - Server-side schema validation (zod); input length caps; history capped
 *   at 12 turns so a client cannot inflate token cost.
 * - Grounding prompt is injected with the `system` role and fixed server-side:
 *   the client can only send conversation turns, never instructions about
 *   persona or scope.
 * - Audit logging records actions only — never message contents.
 *
 * Grounding policy: the assistant answers only from the verified facts in
 * the system prompt (same content-governance rules as the website):
 * no prices, no MOQs, no lead-time promises, no certification claims,
 * no financial figures. Quotations exclusively via the RFQ pathway.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function logInfo(action: string) {
  console.info(`[chat] ${action}`);
}
function logError(action: string, err?: unknown) {
  console.error(`[chat] ${action}`, err instanceof Error ? err.name : "unknown");
}

const chatSchema = z.object({
  message: z.string().min(1).max(1000),
  recaptchaToken: z.string().min(1).max(2048).optional(),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(1000),
      })
    )
    .max(12)
    .optional(),
});

const SYSTEM_PROMPT = `You are "Dispo Inteligent", the assistant of Dispo-Concept — a Bengaluru-based medical-products business focused on surgical and procedural supplies, product sourcing and institutional supply. Published address: No.103, Siddalingeshwara Complex, Kempapura Road, Chikkabanavara, Bangalore – 560 090, Karnataka, India; phone +91 7760319597 / +91 9901659444; email dispoconceptpvtltd@gmail.com.

APPROVED COMPANY FACTS (answer ONLY from these, plus general medical-supply knowledge):
- Catalogue: disposable surgical gowns (standard, reinforced BVB, double-layer variants), procedure kits (general surgery, delivery, urology, orthopaedic, cardiac configurations), 2-ply and 3-ply medical face masks, disposable medical caps, shoe covers, sterilization wraps, and custom-configured procedural packs. Supply role (manufactured, sourced or partner-produced) is confirmed per order.
- Operating model: documentation-first, with Swiss-grade process discipline — a company-stated methodology, not a certification. Enquiries follow a seven-step quality-gate framework; specifications, order records and commitments are written down and confirmed before dispatch.
- RFQ pathway: buyers submit the Request for Quotation form and receive a submission reference immediately; the team follows up with a structured response. Official quotations, prices, MOQs, lead times and availability are confirmed ONLY through this RFQ process.
- Corridors of interest: Asia, the Middle East, South America, Africa, Australia, Canada, UN agency procurement frameworks (an audience, not a region) and the European Union. Corridors of interest are not established operations; activation is confirmed per enquiry in writing.

HARD RULES:
- Never state, invent or imply prices, MOQs, stock levels, lead times, certifications (ISO/CE/MDR), capacity or any financial figures. Direct such questions to the RFQ pathway.
- Never promise regulatory suitability for a market; documentation requirements are confirmed per destination in writing.
- Never claim UN supplier registration, endorsement or awards; UN agency procurement frameworks are an audience of interest only.
- Never say "registered office"; use "published address".
- If evidence for an answer is missing, say what is confirmed per order and route the user to the RFQ pathway.
- If asked something unrelated to Dispo-Concept, medical supplies or healthcare procurement, answer briefly and steer back.
- Style: warm, precise, professional. 2-4 short sentences, no markdown, no bullet lists. Match the language of the user's message (English, French, German, Spanish, Dutch, Arabic or Chinese).
- End with a helpful next step when natural (e.g. "the RFQ form on this site reaches our team directly").`;

// Reuse one SDK client across requests in this process.
// A failed init must NOT be cached forever — reset so the next request retries.
let zaiPromise: Promise<Awaited<ReturnType<typeof ZAI.create>>> | null = null;
function getZai() {
  if (!zaiPromise) {
    zaiPromise = ZAI.create().catch((err) => {
      zaiPromise = null;
      throw err;
    });
  }
  return zaiPromise;
}

export async function POST(req: NextRequest) {
  // 1) Same-origin enforcement (parity with /api/rfq). A JSON body sent with
  //    Content-Type "text/plain" is a CORS "simple request" — it skips
  //    preflight, so the per-route Origin check is the real CSRF boundary,
  //    not the missing CORS headers alone. Browsers always send Origin on
  //    POST; same-origin fetches include it, cross-site forgeries name
  //    another host.
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
      return NextResponse.json({ error: "forbidden" as const }, { status: 403 });
    }
  }

  const limit = checkRateLimit(rateLimitKeyForIp(req, "chat"), 12, 60_000);
  if (!limit.allowed) {
    logInfo("rate-limited");
    return NextResponse.json(
      { error: "rate_limited" as const },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSec) } }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" as const }, { status: 400 });
  }

  const parsed = chatSchema.safeParse(body);
  if (!parsed.success) {
    logInfo("validation-failed");
    return NextResponse.json({ error: "invalid_input" as const }, { status: 400 });
  }

  const { message, history, recaptchaToken } = parsed.data;

  // reCAPTCHA v3 — enforced only when the server holds a secret key.
  // The client earns the token with action "chat_message"; the server
  // verifies success, score, action and (when configured) hostname.
  const captcha = await verifyRecaptcha(recaptchaToken ?? null, "chat_message");
  if (!captcha.ok) {
    logInfo(`recaptcha rejected (${captcha.reason})`);
    return NextResponse.json({ error: "captcha_failed" as const }, { status: 403 });
  }

  try {
    const zai = await getZai();
    const completion = await zai.chat.completions.create({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...(history ?? []),
        { role: "user", content: message },
      ],
      thinking: { type: "disabled" },
      signal: AbortSignal.timeout(30_000),
    });

    const reply = completion.choices[0]?.message?.content?.trim();
    if (!reply) {
      logError("empty-response");
      return NextResponse.json({ error: "empty_response" as const }, { status: 502 });
    }

    logInfo("reply-ok");
    return NextResponse.json({ reply }, { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    logError("sdk-failed", err);
    return NextResponse.json({ error: "upstream_failed" as const }, { status: 502 });
  }
}

export function GET() {
  return NextResponse.json({ error: "method_not_allowed" as const }, { status: 405 });
}
export function PUT() {
  return NextResponse.json({ error: "method_not_allowed" as const }, { status: 405 });
}
export function DELETE() {
  return NextResponse.json({ error: "method_not_allowed" as const }, { status: 405 });
}
