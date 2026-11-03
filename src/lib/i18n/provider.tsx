"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { dirFor, LOCALE_COOKIE, type Locale } from "./config";
import { DICTIONARIES, type Dictionary } from ".";

interface I18nContextValue {
  locale: Locale;
  dir: "ltr" | "rtl";
  t: Dictionary;
  setLocale: (locale: Locale) => void;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function LocaleProvider({
  initialLocale,
  children,
}: {
  initialLocale: Locale;
  children: React.ReactNode;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  const setLocale = useCallback((next: Locale) => {
    const secure = typeof window !== "undefined" && window.location.protocol === "https:";
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax${
      secure ? "; secure" : ""
    }`;
    // Keep <html lang/dir> in sync for a11y, fonts and RTL layout.
    document.documentElement.lang = next;
    document.documentElement.dir = dirFor(next);
    setLocaleState(next);
  }, []);

  const value = useMemo<I18nContextValue>(
    () => ({ locale, dir: dirFor(locale), t: DICTIONARIES[locale], setLocale }),
    [locale, setLocale]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within LocaleProvider");
  return ctx;
}
