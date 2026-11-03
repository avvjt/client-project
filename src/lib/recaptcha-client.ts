"use client";

/**
 * Client-side Google reCAPTCHA v3 token acquisition.
 *
 * - No-op (returns null) when NEXT_PUBLIC_RECAPTCHA_SITE_KEY is absent — the
 *   server skips verification in that mode, so nothing breaks locally.
 * - The script is injected once; tokens are requested per submission with a
 *   distinct action name per endpoint ("rfq_submit" / "chat_message").
 * - Never throws: a failure yields null, and the server decides whether a
 *   missing token is acceptable (it is not when reCAPTCHA is enforced there).
 */

const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
const SCRIPT_ID = "dc-recaptcha-v3";

type Grecaptcha = {
  ready: (cb: () => void) => void;
  execute: (siteKey: string, opts: { action: string }) => Promise<string>;
};

declare global {
  interface Window {
    grecaptcha?: Grecaptcha;
  }
}

let scriptLoading: Promise<void> | null = null;

function loadScript(): Promise<void> {
  if (!SITE_KEY) return Promise.resolve();
  if (typeof window === "undefined") return Promise.resolve();
  if (window.grecaptcha) return Promise.resolve();
  if (scriptLoading) return scriptLoading;

  scriptLoading = new Promise<void>((resolve, reject) => {
    const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    const script = existing ?? document.createElement("script");
    if (!existing) {
      script.id = SCRIPT_ID;
      script.src = `https://www.google.com/recaptcha/api.js?render=${SITE_KEY}`;
      script.async = true;
      document.head.appendChild(script);
    }
    const done = () => resolve();
    script.addEventListener("load", done, { once: true });
    script.addEventListener("error", () => reject(new Error("recaptcha-load-failed")), { once: true });
    // Safety net: resolve anyway if the script has already executed.
    window.setTimeout(() => (window.grecaptcha ? resolve() : undefined), 3000);
  });
  return scriptLoading;
}

export async function getRecaptchaToken(action: string): Promise<string | null> {
  if (!SITE_KEY) return null;
  try {
    await loadScript();
    if (!window.grecaptcha) return null;
    return await new Promise<string | null>((resolve) => {
      window.grecaptcha!.ready(() => {
        window
          .grecaptcha!.execute(SITE_KEY, { action })
          .then((token) => resolve(token))
          .catch(() => resolve(null));
      });
      // Hard cap so a stuck widget never blocks submission UI.
      window.setTimeout(() => resolve(null), 5000);
    });
  } catch {
    return null;
  }
}
