/**
 * Server-side Google reCAPTCHA v3 verification.
 *
 * Design:
 * - Graceful disable: when RECAPTCHA_SECRET_KEY is not configured, verification
 *   is skipped and the endpoint relies on its existing controls (same-origin,
 *   rate limiting, honeypot + fill-time checks). This keeps local development
 *   and preview environments working without Google credentials.
 * - When configured, a missing, invalid or low-scoring token is a hard 403.
 * - Token integrity: the returned `action` must equal the endpoint's expected
 *   action (tokens minted for one endpoint cannot be replayed at another),
 *   and — when RECAPTCHA_EXPECTED_HOSTNAME is configured — the returned
 *   `hostname` must match, so tokens earned on a different origin are
 *   rejected (both checks are recorded as launch-gate requirements).
 * - Verification calls Google siteverify with a 10 s timeout so a slow third
 *   party can never stall intake.
 * - Tokens are single-use from Google's perspective; we never cache results.
 *
 * The site key (NEXT_PUBLIC_RECAPTCHA_SITE_KEY) is public by design; the
 * secret key must never leave the server and is referenced only here.
 * Detailed verdict reasons are logged server-side only — clients receive a
 * single generic failure code.
 */

const VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";
const MIN_SCORE = 0.5;
const TIMEOUT_MS = 10_000;

export type RecaptchaVerdict =
  | { ok: true; skipped: true }
  | { ok: true; score: number | null }
  | {
      ok: false;
      reason: "missing_token" | "rejected" | "action_mismatch" | "hostname_mismatch";
    };

export function recaptchaConfigured(): boolean {
  return Boolean(process.env.RECAPTCHA_SECRET_KEY);
}

export async function verifyRecaptcha(
  token: string | null | undefined,
  expectedAction: string
): Promise<RecaptchaVerdict> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) return { ok: true, skipped: true };
  if (!token || token.length > 2048) return { ok: false, reason: "missing_token" };

  try {
    const body = new URLSearchParams({ secret, response: token });
    const res = await fetch(VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: "no-store",
    });
    if (!res.ok) return { ok: false, reason: "rejected" };
    const data = (await res.json()) as {
      success?: boolean;
      score?: number;
      action?: string;
      hostname?: string;
    };
    if (data.success !== true) return { ok: false, reason: "rejected" };
    if (typeof data.score === "number" && data.score < MIN_SCORE) {
      return { ok: false, reason: "rejected" };
    }
    if (data.action !== expectedAction) {
      return { ok: false, reason: "action_mismatch" };
    }
    const expectedHostname = process.env.RECAPTCHA_EXPECTED_HOSTNAME;
    if (expectedHostname && data.hostname !== expectedHostname) {
      return { ok: false, reason: "hostname_mismatch" };
    }
    return { ok: true, score: data.score ?? null };
  } catch {
    // Network failure to Google: fail closed when the control is active —
    // a hard dependency that silently degrades is worse than a retry.
    return { ok: false, reason: "rejected" };
  }
}
