"use client";

import { motion } from "motion/react";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  Cpu,
  FileCheck2,
  Globe2,
  Handshake,
  PackageCheck,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CtaBand, Eyebrow, Reveal } from "@/components/platform/blocks";
import { CountUp } from "@/components/platform/count-up";
import { CorridorMap } from "@/components/platform/corridor-map";
import { CorridorFacts } from "@/components/platform/corridor-facts";
import { NetworkDiagram, NetworkList } from "@/components/platform/network-diagram";
import { ElementsSection, ProductionBand } from "@/components/platform/elements-section";
import {
  Artifact,
  SectionArtifactField,
  SwissSeal,
} from "@/components/platform/medical-artifacts";
import { CORRIDOR_FLAGS, Flag } from "@/components/platform/flags";
import { CinematicHeroCarousel, type HeroSlide } from "@/components/platform/cinematic-carousel";
import { ImmersiveHero } from "@/components/platform/immersive-hero";
import { useI18n } from "@/lib/i18n/provider";

export function HomeView() {
  const { t } = useI18n();

  const trustItems = [t.home.trust1, t.home.trust2, t.home.trust3, t.home.trust4];
  const vitals = [
    { value: 7, label: t.home.vital1Label },
    { value: 8, label: t.home.vital2Label },
    { value: 7, label: t.home.vital3Label },
    { value: 7, label: t.home.vital4Label },
  ];
  const faqItems = [
    { q: t.faq.q1, a: t.faq.a1 },
    { q: t.faq.q2, a: t.faq.a2 },
    { q: t.faq.q3, a: t.faq.a3 },
    { q: t.faq.q4, a: t.faq.a4 },
    { q: t.faq.q5, a: t.faq.a5 },
    { q: t.faq.q6, a: t.faq.a6 },
    { q: t.faq.q7, a: t.faq.a7 },
    { q: t.faq.q8, a: t.faq.a8 },
  ];
  const gates = [
    { title: t.home.gate1Title, body: t.home.gate1Body },
    { title: t.home.gate2Title, body: t.home.gate2Body },
    { title: t.home.gate3Title, body: t.home.gate3Body },
    { title: t.home.gate4Title, body: t.home.gate4Body },
    { title: t.home.gate5Title, body: t.home.gate5Body },
    { title: t.home.gate6Title, body: t.home.gate6Body },
    { title: t.home.gate7Title, body: t.home.gate7Body },
  ];
  const methodPillars = [
    { title: t.method.p1Title, body: t.method.p1Body },
    { title: t.method.p2Title, body: t.method.p2Body },
    { title: t.method.p3Title, body: t.method.p3Body },
    { title: t.method.p4Title, body: t.method.p4Body },
  ];
  const intelPoints = [t.home.intelPoint1, t.home.intelPoint2, t.home.intelPoint3];
  const engageChecks = [
    t.home.engageCheck1,
    t.home.engageCheck2,
    t.home.engageCheck3,
    t.home.engageCheck4,
    t.home.engageCheck5,
    t.home.engageCheck6,
    t.home.engageCheck7,
    t.home.engageCheck8,
  ];
  const pathwayCards = [
    { title: t.home.pathwayHospitalsTitle, body: t.home.pathwayHospitalsBody, cta: t.home.pathwayHospitalsCta, href: "#/industries" },
    { title: t.home.pathwayProcurementTitle, body: t.home.pathwayProcurementBody, cta: t.home.pathwayProcurementCta, href: "#/rfq" },
    { title: t.home.pathwayDistributorsTitle, body: t.home.pathwayDistributorsBody, cta: t.home.pathwayDistributorsCta, href: "#/industries" },
    { title: t.home.pathwayOemTitle, body: t.home.pathwayOemBody, cta: t.home.pathwayOemCta, href: "#/rnd" },
    { title: t.home.pathwayRndTitle, body: t.home.pathwayRndBody, cta: t.home.pathwayRndCta, href: "#/rnd" },
  ];
  const tickerItems = CORRIDOR_FLAGS.map((c) => ({
    ...c,
    name: t.home[`corridor${c.key}` as keyof typeof t.home] as string,
  }));

  // Cinematic hero film loop — five ultra-realistic frames, Indian + Western,
  // with dedicated translated alt text for the new imagery (i18n parity).
  const heroSlides: HeroSlide[] = [
    { src: "/images/cinema-gowns.png", alt: t.home.heroSlide1Alt },
    { src: "/images/cinema-masks.png", alt: t.home.heroSlide2Alt },
    { src: "/images/cinema-kits.png", alt: t.home.heroSlide3Alt },
    { src: "/images/cinema-wraps.png", alt: t.home.heroSlide4Alt },
    { src: "/images/cinema-cleanroom.png", alt: t.home.heroSlide5Alt },
  ];

  // "Human judgement, supported by technology" — five frames of people + process.
  const intelSlides: HeroSlide[] = [
    { src: "/images/intel-inspection.png", alt: t.home.intelSlide1Alt },
    { src: "/images/intel-coordination.png", alt: t.home.intelSlide2Alt },
    { src: "/images/intel-automation.png", alt: t.home.intelSlide3Alt },
    { src: "/images/intel-testing.png", alt: t.home.intelSlide4Alt },
    { src: "/images/intel-dispatch.png", alt: t.home.intelSlide5Alt },
  ];

  const gateArtifacts = ["cross", "gown", "mask", "kit", "wrap", "capsule", "pulse"] as const;

  return (
    <>
      {/* ═══ 01 · HERO — immersive full-bleed film with glass headline panel ═══ */}
      <ImmersiveHero slides={heroSlides} />

      {/* ═══ 02 · VITALS + CORRIDOR TICKER ═══ */}
      <section className="border-b border-border bg-background py-14 lg:py-16" aria-labelledby="home-vitals">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <Eyebrow>{t.home.vitalsLabel}</Eyebrow>
            <div className="flex flex-wrap items-end justify-between gap-3">
              <h2 id="home-vitals" className="text-fluid-h2 font-display font-extrabold">
                {t.home.vitalsTitle}
              </h2>
              <p className="max-w-md text-sm leading-relaxed text-muted-foreground">{t.home.vitalsNote}</p>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            {/* Orientation vitals — each stat rests on a fluted glass morph panel */}
            <dl className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              {vitals.map((vital, i) => (
                <div key={vital.label} className="fluted-glass flex flex-col-reverse rounded-xl px-5 py-6 lg:px-7 lg:py-8">
                  <dt className="mt-2 text-sm font-medium text-muted-foreground">{vital.label}</dt>
                  <dd className="tech-value text-4xl font-semibold tracking-tight text-primary lg:text-5xl">
                    <CountUp value={vital.value} duration={900 + i * 200} />
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
        {/* Corridor ticker — markets of interest with flags, slow drift, paused on hover */}
        <div className="group mt-10 overflow-hidden border-y border-border bg-secondary/60 py-3" aria-hidden="true">
          <div className="flex w-max animate-[ticker_42s_linear_infinite] gap-8 group-hover:[animation-play-state:paused]">
            {[0, 1].map((copy) => (
              <div key={copy} className="flex shrink-0 items-center gap-8">
                {tickerItems.map((item) => (
                  <span key={`${copy}-${item.key}`} className="flex items-center gap-8 whitespace-nowrap">
                    <span className="flex items-center gap-2.5">
                      <Flag code={item.flag} className="h-3.5 w-5" />
                      <span className="tech-value text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                        {item.name}
                      </span>
                    </span>
                    <span className="h-1 w-1 rounded-full bg-brand-champagne" />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 03 · COMPANY + VISION + SWISS-GRADE METHOD ═══ */}
      <section className="bg-background py-16 lg:py-20" aria-labelledby="home-company">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start lg:gap-14">
            <Reveal>
              <Eyebrow>{t.nav.alias.company}</Eyebrow>
              <h2 id="home-company" className="text-fluid-h2 font-display font-extrabold">
                {t.home.companyTitle}
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground sm:text-base">
                {t.home.companyBody}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild variant="outline" className="min-h-11">
                  <a href="#/company">
                    {t.nav.company}
                    <ArrowRight className="h-4 w-4 rtl:-scale-x-100" aria-hidden="true" />
                  </a>
                </Button>
                <Button asChild variant="ghost" className="min-h-11 text-primary hover:bg-accent hover:text-accent-foreground">
                  <a href="#/investors">{t.meta.investors}</a>
                </Button>
              </div>
            </Reveal>

            {/* Swiss-grade operating discipline — the house method, with precision seal */}
            <Reveal delay={0.1}>
              <div className="relative overflow-hidden rounded-xl border border-border bg-card p-6 sm:p-7">
                <SectionArtifactField far="molecule" near="pulse" className="opacity-90" />
                <div className="relative">
                  <div className="flex items-start justify-between gap-4">
                    <p className="tech-value text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                      {t.method.eyebrow}
                    </p>
                    <SwissSeal className="h-11 w-11 shrink-0" />
                  </div>
                  <h3 className="mt-3 font-display text-xl font-extrabold leading-snug sm:text-2xl">
                    {t.company.visionTitle}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{t.company.visionBody}</p>
                  <p className="tech-value mt-4 text-xs leading-relaxed text-muted-foreground/90">
                    {t.company.visionNote}
                  </p>
                </div>
              </div>
            </Reveal>
          </div>

            {/* Swiss-grade method grid */}
          <div className="mt-14 relative">
            <SectionArtifactField far="capsule" near="cross" />
            <div className="relative">
            <Reveal>
              <Eyebrow>{t.method.eyebrow}</Eyebrow>
              <h2 className="text-fluid-h2 font-display font-extrabold">{t.method.title}</h2>
              <p className="mt-3 max-w-3xl text-muted-foreground">{t.method.subtitle}</p>
            </Reveal>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {methodPillars.map((pillar, i) => (
                <Reveal key={pillar.title} delay={i * 0.06}>
                  <div className="h-full rounded-lg border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-brand-teal/40 hover:shadow-md">
                    <span className="tech-value text-xs font-semibold text-brand-champagne" aria-hidden="true">
                      0{i + 1}
                    </span>
                    <h4 className="mt-2 font-display text-base font-bold leading-snug">{pillar.title}</h4>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{pillar.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal delay={0.15}>
              <p className="tech-value mt-5 rounded-lg border border-border bg-secondary/60 px-4 py-3 text-xs leading-relaxed text-muted-foreground">
                {t.method.note}
              </p>
            </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 04 · INTELLIGENCE / HUMAN + TECHNOLOGY ═══ */}
      <section className="border-y border-border bg-secondary/50 py-16 lg:py-20" aria-labelledby="home-intel">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-14 lg:px-8">
          <Reveal>
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-md bg-accent">
              <Cpu className="h-5 w-5 text-primary" aria-hidden="true" />
            </span>
            <h2 id="home-intel" className="text-fluid-h2 mt-4 font-display font-extrabold">
              {t.home.intelTitle}
            </h2>
            <p className="mt-3 max-w-xl text-muted-foreground">{t.home.intelBody}</p>
            <ul className="mt-6 space-y-3">
              {intelPoints.map((point) => (
                <li key={point} className="flex items-start gap-3 text-sm leading-relaxed sm:text-[15px]">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
            <Button asChild variant="outline" className="mt-7 min-h-11">
              <a href="#/ai-tech">
                {t.home.intelCta}
                <ArrowRight className="h-4 w-4 rtl:-scale-x-100" aria-hidden="true" />
              </a>
            </Button>
          </Reveal>
          <Reveal delay={0.1}>
            <CinematicHeroCarousel
              tone="light"
              slides={intelSlides}
              slideLabel={t.home.heroSlideLabel}
              className="rounded-xl"
            >
              <div
                className="absolute inset-0 bg-gradient-to-t from-brand-navy/60 via-transparent to-transparent"
                aria-hidden="true"
              />
              <p className="tech-value absolute bottom-10 start-4 rounded-md bg-brand-navy/80 px-2.5 py-1.5 text-[11px] text-[#9fb2c4]">
                {t.common.illustrativeImageNote}
              </p>
            </CinematicHeroCarousel>
          </Reveal>
        </div>
      </section>

      {/* ═══ 05 · PRODUCT ELEMENTS ═══ */}
      <ElementsSection />

      {/* Cinematic production band */}
      <ProductionBand />

      {/* ═══ 06 · QUALITY GATES ═══ */}
      <section className="bg-background py-16 lg:py-20" aria-labelledby="home-gates">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <Eyebrow>{t.home.gatesEyebrow}</Eyebrow>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 id="home-gates" className="text-fluid-h2 font-display font-extrabold">
                  {t.home.gatesTitle}
                </h2>
                <p className="mt-2 max-w-2xl text-muted-foreground">{t.home.gatesSubtitle}</p>
              </div>
              <a
                href="#/quality"
                className="inline-flex min-h-11 items-center gap-1.5 rounded-md px-3 text-sm font-semibold text-primary hover:bg-accent"
              >
                {t.nav.quality}
                <ArrowRight className="h-4 w-4 rtl:-scale-x-100" aria-hidden="true" />
              </a>
            </div>
          </Reveal>

          <ol className="relative mt-10 space-y-6 lg:space-y-0">
            {/* animated connector */}
            <motion.div
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 1.4, ease: "easeOut" }}
              className="absolute bottom-4 start-[19px] top-4 w-px origin-top bg-gradient-to-b from-brand-teal via-brand-teal/50 to-brand-champagne/60 max-lg:hidden"
              aria-hidden="true"
            />
            {gates.map((gate, i) => (
              <Reveal key={gate.title} delay={Math.min(i * 0.05, 0.25)}>
                <li className="group relative flex items-start gap-4 lg:gap-6 lg:pb-8">
                  <span
                    className="tech-value z-10 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-brand-teal/40 bg-card text-sm font-semibold text-primary shadow-sm transition-colors duration-300 group-hover:border-brand-swiss/60 group-hover:text-brand-swiss"
                    aria-hidden="true"
                  >
                    {i + 1}
                  </span>
                  <div className="flex-1 rounded-lg border border-border bg-card p-4 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:border-brand-teal/40 group-hover:shadow-md sm:p-5">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-display text-base font-bold leading-snug">{gate.title}</h3>
                      <Artifact
                        name={gateArtifacts[i]}
                        animated
                        delay={i * 0.12}
                        className="h-7 w-7 shrink-0 text-brand-teal-signal opacity-80 transition-opacity group-hover:opacity-100"
                      />
                    </div>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{gate.body}</p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>

          {/* Process-discipline record strip — the gate philosophy in one line */}
          <Reveal delay={0.1}>
            <div className="mt-4 flex items-start gap-4 rounded-lg border border-dashed border-brand-swiss/40 bg-card p-4 sm:p-5">
              <SwissSeal className="h-9 w-9 shrink-0" />
              <p className="tech-value text-xs leading-relaxed text-muted-foreground">
                {t.home.gatesCreativeNote}
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ 07 · SUPPLY CORRIDORS ═══ */}
      <section className="border-y border-border bg-secondary/50 py-16 lg:py-20" aria-labelledby="home-corridors">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <Eyebrow>{t.nav.alias.supply}</Eyebrow>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 id="home-corridors" className="text-fluid-h2 font-display font-extrabold">
                  {t.home.corridorsTitle}
                </h2>
                <p className="mt-2 max-w-2xl text-muted-foreground">{t.home.corridorsSubtitle}</p>
              </div>
              <Button asChild variant="outline" className="min-h-11">
                <a href="#/supply">
                  {t.home.corridorsCta}
                  <ArrowRight className="h-4 w-4 rtl:-scale-x-100" aria-hidden="true" />
                </a>
              </Button>
            </div>
          </Reveal>

          <div className="mt-10 grid items-start gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <Reveal>
              <div className="relative rounded-xl border border-border bg-card p-4 shadow-sm sm:p-6">
                {/* Origin chip — pulsing source marker */}
                <p className="tech-value absolute start-6 top-6 z-20 inline-flex items-center gap-2 rounded-md border border-border bg-card/95 px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-foreground shadow-sm">
                  <span className="relative flex h-2 w-2" aria-hidden="true">
                    <span className="absolute inline-flex h-full w-full motion-safe:animate-ping rounded-full bg-brand-swiss opacity-70" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-swiss" />
                  </span>
                  {t.home.corridorsOriginLabel}
                </p>
                <CorridorMap />
                {/* Mobile legend for corridor names (chips hidden on small screens) */}
                <div className="mt-4 flex flex-wrap gap-2 sm:hidden">
                  {tickerItems.map((item) => (
                    <span
                      key={item.key}
                      className="inline-flex items-center gap-1.5 rounded-md border border-border bg-secondary px-2 py-1"
                    >
                      <Flag code={item.flag} className="h-3 w-4.5" />
                      <span className="text-[11px] font-semibold">{item.name}</span>
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              {/* Five market-orientation notes per corridor — flag-tab rail,
                  motion-blur crossfade between corridors (Wave 2) */}
              <CorridorFacts />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══ 08 · NETWORK ═══ */}
      <section className="bg-background py-16 lg:py-20" aria-labelledby="home-network">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <Eyebrow>{t.nav.alias.company}</Eyebrow>
            <h2 id="home-network" className="text-fluid-h2 max-w-3xl font-display font-extrabold">
              {t.home.networkTitle}
            </h2>
            <p className="mt-3 max-w-2xl text-muted-foreground">{t.home.networkSubtitle}</p>
          </Reveal>
          <Reveal delay={0.08} className="mt-12">
            <NetworkDiagram />
            <NetworkList />
          </Reveal>
        </div>
      </section>

      {/* ═══ 09 · PATHWAYS (corporate care) ═══ */}
      <section className="border-y border-border bg-secondary/50 py-16 lg:py-20" aria-labelledby="home-pathways">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <Eyebrow>{t.nav.alias.industries}</Eyebrow>
            <h2 id="home-pathways" className="text-fluid-h2 font-display font-extrabold">
              {t.home.pathwaysTitle}
            </h2>
            <p className="mt-2 max-w-2xl text-muted-foreground">{t.home.pathwaysSubtitle}</p>
          </Reveal>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {pathwayCards.map((card, i) => (
              <Reveal key={card.title} delay={i * 0.05}>
                <a
                  href={card.href}
                  className="group flex h-full flex-col rounded-lg border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-brand-teal/40 hover:shadow-md focus-visible:outline-2 focus-visible:outline-ring"
                >
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-accent">
                    {i === 0 && <ShieldCheck className="h-5 w-5 text-primary" aria-hidden="true" />}
                    {i === 1 && <ClipboardCheck className="h-5 w-5 text-primary" aria-hidden="true" />}
                    {i === 2 && <Globe2 className="h-5 w-5 text-primary" aria-hidden="true" />}
                    {i === 3 && <PackageCheck className="h-5 w-5 text-primary" aria-hidden="true" />}
                    {i === 4 && <FileCheck2 className="h-5 w-5 text-primary" aria-hidden="true" />}
                  </span>
                  <h3 className="mt-4 font-display text-[15px] font-bold leading-snug">{card.title}</h3>
                  <p className="mt-1.5 flex-1 text-sm leading-relaxed text-muted-foreground">{card.body}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                    {card.cta}
                    <ArrowRight
                      className="h-4 w-4 transition-transform group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5"
                      aria-hidden="true"
                    />
                  </span>
                </a>
              </Reveal>
            ))}
          </div>

          {/* Vendor band — honest invitation */}
          <Reveal delay={0.1}>
            <div className="mt-10 flex flex-col items-start justify-between gap-4 rounded-xl border border-border bg-card p-6 sm:flex-row sm:items-center">
              <div className="flex items-start gap-4">
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-accent">
                  <Handshake className="h-5 w-5 text-primary" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="font-display text-base font-bold">{t.vendors.title}</h3>
                  <p className="mt-1 max-w-xl text-sm text-muted-foreground">{t.vendors.subtitle}</p>
                </div>
              </div>
              <Button asChild variant="outline" className="min-h-11 shrink-0">
                <a href="#/vendors">
                  {t.vendors.cta}
                  <ArrowRight className="h-4 w-4 rtl:-scale-x-100" aria-hidden="true" />
                </a>
              </Button>
              <Button
                asChild
                variant="ghost"
                className="min-h-11 shrink-0 text-primary hover:bg-accent hover:text-accent-foreground"
              >
                <a href="#/vendors">{t.common.becomePartner}</a>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ 09b · FAQ — procurement answers grounded in verified content (GEO) ═══ */}
      <section className="bg-background pb-16 pt-4 lg:pb-20 lg:pt-6" aria-labelledby="home-faq">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center">
              <div className="flex justify-center">
                <Eyebrow>{t.home.faqEyebrow}</Eyebrow>
              </div>
              <h2 id="home-faq" className="text-fluid-h2 font-display font-extrabold">
                {t.home.faqTitle}
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">{t.home.faqSubtitle}</p>
            </div>
          </Reveal>
          <Reveal delay={0.08} className="mt-10">
            <Accordion
              type="single"
              collapsible
              className="scroll-slim max-h-[34rem] overflow-y-auto rounded-xl border border-border bg-card px-6"
            >
              {faqItems.map((item, i) => (
                <AccordionItem key={item.q} value={`faq-${i}`}>
                  <AccordionTrigger className="text-start text-[15px] font-semibold leading-snug hover:no-underline">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </div>
      </section>

      {/* ═══ 10 · ENGAGE / RFQ ═══ */}
      <section className="bg-background py-16 lg:py-20" aria-labelledby="home-engage">
        <div className="mx-auto grid max-w-7xl items-start gap-10 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:px-8">
          <Reveal>
            <Eyebrow>{t.nav.rfq}</Eyebrow>
            <h2 id="home-engage" className="text-fluid-h2 font-display font-extrabold">
              {t.home.engageTitle}
            </h2>
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted-foreground sm:text-base">
              {t.home.engageBody}
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Button asChild variant="cta" size="lg" className="min-h-12 px-6">
                <a href="#/rfq">
                  {t.home.engagePrimary}
                  <ArrowRight className="h-4 w-4 rtl:-scale-x-100" aria-hidden="true" />
                </a>
              </Button>
              <Button asChild variant="outline" size="lg" className="min-h-12 px-6">
                <a href="#/products">{t.home.engageSecondary}</a>
              </Button>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="rounded-xl border border-border bg-card p-6 sm:p-7">
              <h3 className="tech-value text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                {t.home.engageChecklistTitle}
              </h3>
              <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
                {engageChecks.map((check, i) => (
                  <li key={check} className="flex items-start gap-2.5 text-sm leading-snug">
                    <span
                      className="tech-value mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent text-[10px] font-semibold text-accent-foreground"
                      aria-hidden="true"
                    >
                      {i + 1}
                    </span>
                    <span>{check}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ 11 · RFQ CTA BAND ═══ */}
      <CtaBand
        title={t.home.rfqBandTitle}
        body={t.home.rfqBandBody}
        secondaryHref="#/industries"
        secondaryLabel={t.nav.industries}
      />
    </>
  );
}
