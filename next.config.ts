import type { NextConfig } from "next";

/**
 * Security headers applied to every route.
 * CSP note: 'unsafe-inline' in script-src is required by the Next.js runtime
 * (inline hydration payload) and the theme pre-hydration script; upgrading to
 * a nonce-based CSP via middleware is documented as a production launch task.
 * 'unsafe-eval' is required by the dev runtime (HMR / React refresh) ONLY —
 * it is compiled out of the policy in production. The google.com/gstatic.com
 * allowances serve Google reCAPTCHA v3, which is enforced on the RFQ and chat
 * endpoints whenever server keys are configured.
 */
const isProduction = process.env.NODE_ENV === "production";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      `script-src 'self' 'unsafe-inline'${isProduction ? "" : " 'unsafe-eval'"} https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/ https://apis.google.com/`,
      "style-src 'self' 'unsafe-inline' https://www.gstatic.com/recaptcha/",
      "img-src 'self' data: blob: https://www.google.com https://www.gstatic.com",
      "font-src 'self' data:",
      "connect-src 'self' https://www.google.com https://www.gstatic.com",
      "frame-src https://www.google.com/recaptcha/ https://recaptcha.google.com/recaptcha/",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "object-src 'none'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  // The preview gateway serves the app from a *.space-z.ai host while the
  // dev server runs on localhost; without this, Next logs a cross-origin
  // warning for /_next/* asset loads (dev-only concern).
  allowedDevOrigins: ["*.space-z.ai"],
  // Type errors fail the build (tsc is clean; regressions must surface early).
  typescript: {
    ignoreBuildErrors: false,
  },
  // Surface effect/impurity bugs in dev; components with proper cleanup are
  // unaffected by double-invocation.
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
