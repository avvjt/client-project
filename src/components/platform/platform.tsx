"use client";

import { useEffect } from "react";
import { MotionConfig, motion } from "motion/react";
import { LocaleProvider, useI18n } from "@/lib/i18n/provider";
import { CopyProtection } from "@/components/platform/copy-protection";
import { toLocale } from "@/lib/i18n/config";
import { useHashRoute, type Route } from "@/hooks/use-hash-route";
import { Header } from "@/components/platform/header";
import { Footer } from "@/components/platform/footer";
import { HomeView } from "@/components/platform/views/home-view";
import { ProductsView } from "@/components/platform/views/products-view";
import { ProductDetailView } from "@/components/platform/views/product-detail-view";
import { CapabilitiesView } from "@/components/platform/views/capabilities-view";
import { QualityView } from "@/components/platform/views/quality-view";
import { IndustriesView } from "@/components/platform/views/industries-view";
import { SupplyView } from "@/components/platform/views/supply-view";
import { SustainabilityView } from "@/components/platform/views/sustainability-view";
import { CompanyView } from "@/components/platform/views/company-view";
import { LeadershipView } from "@/components/platform/views/leadership-view";
import { InvestorsView } from "@/components/platform/views/investors-view";
import { VendorsView } from "@/components/platform/views/vendors-view";
import { RndView } from "@/components/platform/views/rnd-view";
import { CareersView } from "@/components/platform/views/careers-view";
import { AiTechView } from "@/components/platform/views/ai-tech-view";
import { RfqView } from "@/components/platform/views/rfq-view";
import { PRODUCT_FAMILIES } from "@/content/products";
import { LegalView } from "@/components/platform/views/legal-view";
import { DispoInteligent } from "@/components/platform/dispo-inteligent";

function viewTitle(route: Route, t: ReturnType<typeof useI18n>["t"]): string {
  switch (route.view) {
    case "home":
      return t.meta.home;
    case "products":
      return t.meta.products;
    case "product": {
      const fam = PRODUCT_FAMILIES.find((p) => p.slug === route.slug);
      const name = fam ? t.products.items[fam.key]?.name : undefined;
      return name ?? t.meta.productDetail;
    }
    case "capabilities":
      return t.meta.capabilities;
    case "quality":
      return t.meta.quality;
    case "industries":
      return t.meta.industries;
    case "supply":
      return t.meta.supply;
    case "sustainability":
      return t.meta.sustainability;
    case "company":
      return t.meta.company;
    case "leadership":
      return t.meta.leadership;
    case "investors":
      return t.meta.investors;
    case "vendors":
      return t.meta.vendors;
    case "rnd":
      return t.meta.rnd;
    case "careers":
      return t.meta.careers;
    case "aiTech":
      return t.meta.aiTech;
    case "contact":
      return t.meta.contact;
    case "rfq":
      return t.meta.rfq;
    case "privacy":
      return t.meta.privacy;
    case "terms":
      return t.meta.terms;
    default:
      return t.meta.notFound;
  }
}

function renderView(route: Route) {
  switch (route.view) {
    case "home":
      return <HomeView />;
    case "products":
      return <ProductsView />;
    case "product":
      return <ProductDetailView slug={route.slug} />;
    case "capabilities":
      return <CapabilitiesView />;
    case "quality":
      return <QualityView />;
    case "industries":
      return <IndustriesView />;
    case "supply":
      return <SupplyView />;
    case "sustainability":
      return <SustainabilityView />;
    case "company":
      return <CompanyView />;
    case "leadership":
      return <LeadershipView />;
    case "investors":
      return <InvestorsView />;
    case "vendors":
      return <VendorsView />;
    case "rnd":
      return <RndView />;
    case "careers":
      return <CareersView />;
    case "aiTech":
      return <AiTechView />;
    case "contact":
    case "rfq":
      return <RfqView prefillSlug={route.view === "rfq" ? route.product : undefined} intent={route.view === "rfq" ? route.intent : undefined} />;
    case "privacy":
      return <LegalView kind="privacy" />;
    case "terms":
      return <LegalView kind="terms" />;
    default:
      return <NotFoundView />;
  }
}

function NotFoundView() {
  const { t } = useI18n();
  return (
    <section className="mx-auto flex max-w-3xl flex-col items-center px-4 py-24 text-center">
      <p className="tech-value text-5xl font-semibold text-primary">404</p>
      <h1 className="text-fluid-h3 mt-4 font-display font-bold">{t.common.notFoundTitle}</h1>
      <p className="mt-2 text-muted-foreground">{t.common.notFoundBody}</p>
      <a
        href="#/"
        className="mt-6 inline-flex min-h-11 items-center rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
      >
        {t.common.backHome}
      </a>
    </section>
  );
}

function PlatformShell() {
  const { t } = useI18n();
  const { route, key } = useHashRoute();

  // Keep document title in sync with the active view.
  useEffect(() => {
    document.title = `${viewTitle(route, t)} | Dispo-Concept`;
  }, [route, t]);

  // Move focus to <main> and scroll to top on navigation (SPA a11y).
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const main = document.getElementById("main-content");
    main?.focus({ preventScroll: true });
  }, [key]);

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-primary-foreground"
      >
        {t.a11y.skipToMain}
      </a>
      <Header route={route} />
      <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
        <motion.div
          key={key}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
        >
          {renderView(route)}
        </motion.div>
      </main>
      <Footer />
      {/* Conversion pages mute the assistant's auto-bubble so it can never
          float over the RFQ form's controls (browser-audit finding 31-a). */}
      <DispoInteligent
        suppressAutoTrigger={route.view === "rfq" || route.view === "contact"}
      />
      {/* Site-wide copyright shield (context menu / copy / drag / print) —
          mounted inside LocaleProvider so notices follow the active locale. */}
      <CopyProtection />
    </div>
  );
}

export default function Platform({ initialLocale }: { initialLocale: string }) {
  // initialLocale arrives pre-validated from the server (cookie-based); the
  // locale list lives in ONE place — src/lib/i18n/config.ts.
  const safeLocale = toLocale(initialLocale);

  return (
    <MotionConfig reducedMotion="user">
      <LocaleProvider initialLocale={safeLocale}>
        <PlatformShell />
      </LocaleProvider>
    </MotionConfig>
  );
}
