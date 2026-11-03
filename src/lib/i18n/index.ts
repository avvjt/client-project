import en, { type Dictionary } from "./dictionaries/en";
import fr from "./dictionaries/fr";
import de from "./dictionaries/de";
import es from "./dictionaries/es";
import nl from "./dictionaries/nl";
import ar from "./dictionaries/ar";
import zh from "./dictionaries/zh";
import type { Locale } from "./config";

export const DICTIONARIES: Record<Locale, Dictionary> = { en, fr, de, es, nl, ar, zh };

export function getDictionary(locale: Locale): Dictionary {
  return DICTIONARIES[locale];
}

export type { Dictionary };
export { default as en } from "./dictionaries/en";
