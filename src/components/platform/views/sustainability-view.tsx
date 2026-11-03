"use client";

import { Droplets, Factory, Leaf, Package, Recycle, Ruler } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CtaBand, PageHero, Reveal, VerifyNotice } from "@/components/platform/blocks";
import { useI18n } from "@/lib/i18n/provider";

export function SustainabilityView() {
  const { t } = useI18n();

  const pillars = [
    { icon: Recycle, title: t.sustainability.pillar1Title, body: t.sustainability.pillar1Body },
    { icon: Droplets, title: t.sustainability.pillar2Title, body: t.sustainability.pillar2Body },
    { icon: Leaf, title: t.sustainability.pillar3Title, body: t.sustainability.pillar3Body },
    { icon: Package, title: t.sustainability.pillar4Title, body: t.sustainability.pillar4Body },
    { icon: Factory, title: t.sustainability.pillar5Title, body: t.sustainability.pillar5Body },
    { icon: Ruler, title: t.sustainability.pillar6Title, body: t.sustainability.pillar6Body },
  ];

  return (
    <>
      <PageHero
        eyebrow={t.nav.alias.sustainability}
        title={t.sustainability.title}
        subtitle={t.sustainability.subtitle}
        intro={t.sustainability.intro}
      />

      <section className="bg-background py-14 lg:py-18">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <h2 className="text-fluid-h2 font-display font-extrabold">{t.sustainability.pillarsTitle}</h2>
          </Reveal>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pillars.map((pillar, i) => (
              <Reveal key={pillar.title} delay={(i % 3) * 0.05}>
                <div className="h-full rounded-lg border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-brand-teal/40 hover:shadow-md">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-accent">
                    <pillar.icon className="h-5 w-5 text-primary" aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 font-display text-base font-bold leading-snug">{pillar.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{pillar.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-secondary/50 py-14 lg:py-18">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="rounded-xl border border-brand-champagne/50 bg-card p-6 sm:p-8">
              <h2 className="text-fluid-h2 font-display font-extrabold">
                {t.sustainability.measurementTitle}
              </h2>
              <p className="mt-4 max-w-3xl text-[15px] leading-relaxed text-muted-foreground sm:text-base">
                {t.sustainability.measurementBody}
              </p>
              <p className="tech-value mt-5 border-t border-border pt-4 text-xs leading-relaxed text-muted-foreground">
                {t.sustainability.honestNote}
              </p>
              <Button asChild variant="cta" className="mt-6 min-h-11">
                <a href="#/rfq">{t.sustainability.cta}</a>
              </Button>
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <VerifyNotice className="mt-6" />
          </Reveal>
        </div>
      </section>

      <CtaBand
        title={t.sustainability.cta}
        body={t.sustainability.intro}
        secondaryHref="#/quality"
        secondaryLabel={t.nav.quality}
      />
    </>
  );
}
