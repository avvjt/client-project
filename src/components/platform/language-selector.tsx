"use client";

import { Check, Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LOCALES, LOCALE_LABELS, type Locale } from "@/lib/i18n/config";
import { useI18n } from "@/lib/i18n/provider";

/** Six-language selector; preserves the current hash view on switch. */
export function LanguageSelector() {
  const { locale, setLocale, t } = useI18n();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={t.a11y.languageToggleLabel}
        title={t.a11y.languageToggleLabel}
        className="inline-flex h-11 items-center gap-1.5 rounded-md px-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
      >
        <Globe className="h-[18px] w-[18px]" aria-hidden="true" />
        <span className="tech-value font-semibold">{LOCALE_LABELS[locale].short}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-44">
        <DropdownMenuLabel>{t.common.language}</DropdownMenuLabel>
        {LOCALES.map((loc: Locale) => (
          <DropdownMenuItem
            key={loc}
            lang={loc}
            onClick={() => setLocale(loc)}
            className="flex items-center justify-between gap-3"
          >
            <span>{LOCALE_LABELS[loc].native}</span>
            {loc === locale && <Check className="h-4 w-4 text-primary" aria-hidden="true" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
