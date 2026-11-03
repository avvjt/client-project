import { createHash, randomBytes } from "crypto";
import type { NextRequest } from "next/server";

/**
 * In-memory fixed-window rate limiter.
 *
 * LIMITATION (documented): state lives in a single process. If the app is
 * ever scaled to multiple runtime instances, replace with a shared store
 * (e.g. Redis) — otherwise limits are enforced per instance only.
 *
 * Privacy: keys are salted SHA-256 hashes of the client IP — raw IPs are
 * never stored. Salt comes from RFQ_IP_SALT (see .env.example).
 *
 * Proxy trust: the gateway (Caddy) OVERWRITES x-real-ip with the actual
 * remote host (header_up X-Real-IP {remote_host}), so the value cannot be
 * spoofed through the trusted hop. Direct-to-app callers bypassing the
 * gateway are out of threat scope (host-internal only). If x-real-ip is
 * absent, the LAST x-forwarded-for hop is used — clients can prepend
 * arbitrary values to that header, so the rightmost entry (added by the
 * nearest trusted proxy) is the only trustworthy one.
 */
const buckets = new Map<string, { count: number; resetAt: number }>();

let saltWarned = false;

/**
 * Fallback salt: a high-entropy random value generated once per process at
 * boot. The previous publicly-known constant fallback was removed per the
 * security review — an attacker who knows the constant could precompute
 * hash keys. A per-boot random salt keeps keys unguessable and uncorrelated
 * across restarts; set RFQ_IP_SALT in .env for keys that survive restarts
 * (required when multiple instances share a durable limiter).
 */
const BOOT_SALT = randomBytes(32).toString("hex");

export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): { allowed: boolean; retryAfterSec: number } {
  const now = Date.now();

  // Opportunistic cleanup to bound memory.
  if (buckets.size > 5000) {
    for (const [k, v] of buckets) {
      if (v.resetAt < now) buckets.delete(k);
    }
  }

  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterSec: 0 };
  }

  bucket.count += 1;
  if (bucket.count > limit) {
    return { allowed: false, retryAfterSec: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)) };
  }
  return { allowed: true, retryAfterSec: 0 };
}

/** Salted hash of the client IP — never store or log the raw value. */
export function rateLimitKeyForIp(req: NextRequest, scope: string): string {
  // Prefer the platform-injected x-real-ip (set by the trusted gateway).
  // Fall back to the LAST hop of x-forwarded-for: clients can prepend
  // arbitrary values to that header, so the first entry is spoofable —
  // the rightmost entry is the one added by the nearest trusted proxy.
  const realIp = req.headers.get("x-real-ip");
  let ip: string;
  if (realIp) {
    ip = realIp.trim();
  } else {
    const forwarded = req.headers.get("x-forwarded-for");
    const hops = forwarded ? forwarded.split(",").map((h) => h.trim()).filter(Boolean) : [];
    ip = hops.length > 0 ? hops[hops.length - 1] : "unknown";
  }
  const salt = process.env.RFQ_IP_SALT;
  if (!salt && !saltWarned) {
    saltWarned = true;
    console.warn("[rate-limit] RFQ_IP_SALT is not set — using a per-boot random salt. Set it in .env for production.");
  }
  const effectiveSalt = salt ?? BOOT_SALT;
  const hashed = createHash("sha256").update(`${effectiveSalt}:${ip}`).digest("hex").slice(0, 32);
  return `${scope}:${hashed}`;
}
