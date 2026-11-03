/**
 * Dispo-Concept i18n configuration — single source of truth for locales.
 * Locales: en, fr, de, es, nl, zh (Simplified Chinese), ar (Arabic = RTL).
 * Display order is intentional: Arabic renders last — directly below Chinese.
 */
export const LOCALES = ["en", "fr", "de", "es", "nl", "zh", "ar"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";
export const LOCALE_COOKIE = "dc_locale";

export const LOCALE_LABELS: Record<Locale, { native: string; english: string; short: string }> = {
  en: { native: "English", english: "English", short: "EN" },
  fr: { native: "Français", english: "French", short: "FR" },
  de: { native: "Deutsch", english: "German", short: "DE" },
  es: { native: "Español", english: "Spanish", short: "ES" },
  nl: { native: "Nederlands", english: "Dutch", short: "NL" },
  ar: { native: "العربية", english: "Arabic", short: "AR" },
  zh: { native: "中文", english: "Chinese", short: "ZH" },
};

export const RTL_LOCALES: ReadonlySet<Locale> = new Set(["ar"]);

export function isRtl(locale: Locale): boolean {
  return RTL_LOCALES.has(locale);
}

export function dirFor(locale: Locale): "ltr" | "rtl" {
  return isRtl(locale) ? "rtl" : "ltr";
}

/** Parse an unknown value into a supported locale, else default. */
export function toLocale(value: string | undefined | null): Locale {
  return value && (LOCALES as readonly string[]).includes(value) ? (value as Locale) : DEFAULT_LOCALE;
}
