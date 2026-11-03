"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Logo, LogoMark } from "@/components/platform/logo";
import { ThemeToggle } from "@/components/platform/theme-toggle";
import { LanguageSelector } from "@/components/platform/language-selector";
import { Artifact, type ArtifactName } from "@/components/platform/medical-artifacts";
import { PRODUCT_FAMILIES } from "@/content/products";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/provider";
import type { Route } from "@/hooks/use-hash-route";

interface NavLink {
  href: string;
  key: keyof ReturnType<typeof navKeys>;
  /** Medical line-art that travels with the item in the mobile menu. */
  artifact: ArtifactName;
}

function navKeys(t: ReturnType<typeof useI18n>["t"]) {
  return {
    products: t.nav.products,
    capabilities: t.nav.capabilities,
    quality: t.nav.quality,
    industries: t.nav.industries,
    supply: t.nav.supply,
    sustainability: t.nav.sustainability,
    company: t.nav.company,
    leadership: t.nav.leadership,
    contact: t.nav.contact,
  };
}

function navAliases(t: ReturnType<typeof useI18n>["t"]) {
  return {
    products: t.nav.alias.products,
    capabilities: t.nav.alias.capabilities,
    quality: t.nav.alias.quality,
    industries: t.nav.alias.industries,
    supply: t.nav.alias.supply,
    sustainability: t.nav.alias.sustainability,
    company: t.nav.alias.company,
    leadership: t.nav.alias.leadership,
    contact: t.nav.alias.contact,
  };
}

function isActive(route: Route, href: string): boolean {
  const path = href.replace("#/", "").split("?")[0] || "";
  switch (route.view) {
    case "home":
      return path === "";
    case "product":
      return path === "products";
    case "contact":
    case "rfq":
      return path === "contact";
    case "notFound":
      return false;
    default:
      return route.view === path;
  }
}

/**
 * Page-title locator — resolves the current hash route to its display
 * title so the header can name the page the visitor is on (management
 * request: "according to the page title, add … on the header").
 * Returns null for 404, where no meaningful title exists.
 */
function pageTitle(route: Route, t: ReturnType<typeof useI18n>["t"]): string | null {
  switch (route.view) {
    case "home":
      // Management request: no "Home" under the logo — the wordmark itself
      // is the home affordance, so the locator chip stays silent here while
      // every other page still names itself.
      return null;
    case "products":
      return t.nav.products;
    case "product": {
      const family = PRODUCT_FAMILIES.find((p) => p.slug === route.slug);
      return family ? t.products.familyNames[family.key] : t.meta.productDetail;
    }
    case "capabilities":
      return t.nav.capabilities;
    case "quality":
      return t.nav.quality;
    case "industries":
      return t.nav.industries;
    case "supply":
      return t.nav.supply;
    case "sustainability":
      return t.nav.sustainability;
    case "company":
      return t.nav.company;
    case "leadership":
      return t.nav.leadership;
    case "investors":
      return t.footer.linkInvestors;
    case "vendors":
      return t.footer.linkVendors;
    case "rnd":
      return t.footer.linkRnd;
    case "careers":
      return t.meta.careers;
    case "aiTech":
      return t.footer.linkAiTech;
    case "contact":
      return t.nav.contact;
    case "rfq":
      return t.nav.rfq;
    case "privacy":
      return t.footer.privacy;
    case "terms":
      return t.footer.terms;
    default:
      return null;
  }
}

/**
 * Medical flip label — the resting face carries the house vocabulary
 * ("Repertoire"); on hover, focus or selection the word performs a
 * card-flip to its plain form ("Products") while a one-line ECG trace
 * draws itself beneath. Screen readers hear only the plain label.
 */
function FlipNavLabel({ alias, label }: { alias: string; label: string }) {
  return (
    <span className="nav-flip" aria-hidden="true">
      <svg viewBox="0 0 72 10" className="ecg-trace" focusable="false">
        <path
          className="ecg-path"
          d="M1 5h14l3.5-4 5 8 4.5-6.5 3 2.5H71"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
        />
      </svg>
      <span className="nav-flip-inner">
        <span className="nav-face nav-face-alias">{alias}</span>
        <span className="nav-face nav-face-real">{label}</span>
      </span>
    </span>
  );
}

export function Header({ route }: { route: Route }) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  // Header organisation — management-specified title order:
  // House — Vanguard - Repertoire - Paragon - Domains - Faculty -
  // Perpetuity - Conduit - Overture. Each title stays bound to its
  // section (alias vocabulary lives in the dictionaries); only the
  // display order changed.
  const links: NavLink[] = [
    { href: "#/company", key: "company", artifact: "vial" },
    { href: "#/leadership", key: "leadership", artifact: "cap" },
    { href: "#/products", key: "products", artifact: "kit" },
    { href: "#/quality", key: "quality", artifact: "cross" },
    { href: "#/industries", key: "industries", artifact: "pack" },
    { href: "#/capabilities", key: "capabilities", artifact: "molecule" },
    { href: "#/sustainability", key: "sustainability", artifact: "capsule" },
    { href: "#/supply", key: "supply", artifact: "case" },
    { href: "#/contact", key: "contact", artifact: "pulse" },
  ];
  const labels = navKeys(t);
  const aliases = navAliases(t);
  const currentTitle = pageTitle(route, t);
  // Keyed by route so the chip re-runs its entrance animation on navigation.
  const chipKey = route.view + ("slug" in route ? `:${route.slug}` : "");

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-background/85 backdrop-blur-md supports-[backdrop-filter]:bg-background/75">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-2 px-4 sm:px-6 lg:px-8">
        <a
          href="#/"
          className="flex shrink-0 items-center gap-2.5 rounded-md focus-visible:outline-2 focus-visible:outline-ring"
          aria-label={t.a11y.homeLink}
        >
          <LogoMark />
          <span className="flex min-w-0 flex-col leading-none">
            <span className="font-display text-[15px] font-extrabold tracking-[0.08em] text-foreground">
              DISPO<span className="text-brand-swiss">-</span>CONCEPT
            </span>
            {/* Page-title locator — names the page the visitor is on,
                stacked as a micro-line beneath the wordmark (management
                request: "according to the page title, add … on the header") */}
            {currentTitle && (
              <span key={chipKey} className="page-title-chip mt-1 flex min-w-0 items-center gap-1.5">
                <span className="sr-only">{t.a11y.currentPage.replace("{page}", currentTitle)}</span>
                <span aria-hidden="true" className="flex min-w-0 items-center gap-1.5">
                  <span className="h-1 w-1 shrink-0 rounded-[1px] bg-brand-swiss" />
                  {/* max-w caps the chip's contribution to the wordmark width:
                      long page titles ellipsize instead of widening the logo
                      anchor (which is shrink-0) and pushing the desktop nav
                      cluster past the viewport on title-heavy routes. */}
                  <span className="tech-value max-w-[10rem] truncate text-[9px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    {currentTitle}
                  </span>
                </span>
              </span>
            )}
          </span>
        </a>

        {/* Desktop navigation — medical vocabulary with the flip interaction */}
        <nav aria-label={t.a11y.mainNavLabel} className="ms-auto hidden items-center lg:flex">
          {links.map((link) => {
            const active = isActive(route, link.href);
            return (
              <a
                key={link.href}
                href={link.href}
                data-active={active ? "true" : "false"}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "nav-link rounded-md px-2 py-2 text-[12.5px] font-medium text-muted-foreground transition-colors hover:bg-secondary/70 focus-visible:outline-2 focus-visible:outline-ring xl:px-2 xl:text-[13px]",
                  active && "text-brand-swiss"
                )}
              >
                <span className="sr-only">{labels[link.key]}</span>
                <FlipNavLabel alias={aliases[link.key]} label={labels[link.key]} />
              </a>
            );
          })}
        </nav>

        <div className="ms-auto flex items-center gap-1 lg:ms-3">
          <LanguageSelector />
          <ThemeToggle />
          <Button asChild variant="cta" className="hidden sm:inline-flex">
            <a href="#/rfq">{t.nav.rfq}</a>
          </Button>

          {/* Mobile menu — alias word carried by its medical artifact */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                aria-label={t.a11y.mobileMenuLabel}
              >
                <Menu className="h-5 w-5" aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent side="end" closeLabel={t.common.close} className="w-80 overflow-y-auto">
              <SheetHeader>
                <SheetTitle asChild>
                  <div>
                    <Logo />
                  </div>
                </SheetTitle>
                <SheetDescription className="sr-only">{t.a11y.mainNavLabel}</SheetDescription>
              </SheetHeader>
              <nav aria-label={t.a11y.mainNavLabel} className="mt-2 flex flex-col gap-1 px-2 pb-6">
                {links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    aria-current={isActive(route, link.href) ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2.5 transition-colors",
                      isActive(route, link.href)
                        ? "bg-accent text-accent-foreground"
                        : "text-foreground hover:bg-secondary"
                    )}
                  >
                    <span
                      className={cn(
                        "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md",
                        isActive(route, link.href) ? "bg-brand-swiss/10 text-brand-swiss" : "bg-accent text-primary"
                      )}
                      aria-hidden="true"
                    >
                      <Artifact name={link.artifact} className="h-5 w-5" />
                    </span>
                    <span className="flex min-w-0 flex-col leading-tight">
                      <span className="text-[15px] font-semibold">{aliases[link.key]}</span>
                      <span className="mt-0.5 text-xs text-muted-foreground">{labels[link.key]}</span>
                    </span>
                  </a>
                ))}
                <Button asChild variant="cta" className="mt-3 w-full">
                  <a href="#/rfq" onClick={() => setOpen(false)}>
                    {t.nav.rfq}
                  </a>
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
