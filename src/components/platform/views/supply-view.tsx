"use client";

import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import { CtaBand, Eyebrow, PageHero, Reveal } from "@/components/platform/blocks";
import { CorridorLegend } from "@/components/platform/corridor-map";
import { CorridorGlobe } from "@/components/platform/corridor-globe";
import { CorridorFacts } from "@/components/platform/corridor-facts";
import { SupplyModal } from "@/components/platform/inquiry-modals";
import { useI18n } from "@/lib/i18n/provider";

export function SupplyView() {
  const { t } = useI18n();
  const steps = [
    { title: t.supply.step1Title, body: t.supply.step1Body },
    { title: t.supply.step2Title, body: t.supply.step2Body },
    { title: t.supply.step3Title, body: t.supply.step3Body },
    { title: t.supply.step4Title, body: t.supply.step4Body },
  ];
  const provide = [t.supply.provide1, t.supply.provide2, t.supply.provide3, t.supply.provide4];

  return (
    <>
      <PageHero
        eyebrow={t.nav.alias.supply}
        title={t.supply.title}
        subtitle={t.supply.subtitle}
        intro={t.supply.intro}
      />

      {/* Export corridors — markets of interest, activation confirmed per enquiry */}
      <section className="border-b border-border bg-secondary/50 py-14 lg:py-18" aria-labelledby="supply-corridors">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <Eyebrow>{t.nav.alias.supply}</Eyebrow>
            <h2 id="supply-corridors" className="text-fluid-h2 font-display font-extrabold">
              {t.supply.corridorsTitle}
            </h2>
            <p className="mt-3 max-w-3xl text-muted-foreground">{t.supply.corridorsIntro}</p>
          </Reveal>
          {/* 3D corridor globe — same eight corridors of interest + Bengaluru
              hub as the wireframe map, rendered as a draggable WebGL sphere */}
          <Reveal delay={0.06} className="mt-10 flex justify-center">
            <CorridorGlobe className="w-full max-w-md lg:max-w-lg" />
          </Reveal>
          <Reveal delay={0.08} className="mt-8">
            <CorridorLegend />
          </Reveal>
          <Reveal delay={0.12} className="mt-8 max-w-3xl">
            {/* Five market-orientation notes per corridor (flag-tab rail) */}
            <CorridorFacts />
          </Reveal>
        </div>
      </section>

      <section className="bg-background py-14 lg:py-18">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Process steps */}
          <h2 className="text-fluid-h2 font-display font-extrabold">{t.supply.stepsTitle}</h2>
          <ol className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {steps.map((step, i) => (
              <Reveal key={step.title} delay={i * 0.05}>
                <li className="relative flex h-full flex-col rounded-lg border border-border bg-card p-6">
                  <span
                    className="tech-value inline-flex h-9 w-9 items-center justify-center rounded-md bg-primary text-sm font-semibold text-primary-foreground"
                    aria-hidden="true"
                  >
                    {i + 1}
                  </span>
                  <h3 className="text-fluid-h3 mt-4 font-display font-bold leading-snug">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* What we coordinate */}
      <section className="border-y border-border bg-secondary/50 py-14 lg:py-18">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-14 lg:px-8">
          <Reveal>
            <h2 className="text-fluid-h2 font-display font-extrabold">{t.supply.provideTitle}</h2>
            <ul className="mt-6 space-y-3.5">
              {provide.map((point) => (
                <li key={point} className="flex items-start gap-3 text-sm leading-relaxed sm:text-[15px]">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <SupplyModal />
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="relative aspect-[16/11] overflow-hidden rounded-xl border border-border shadow-lg">
              <Image
                src="/images/packaging-supply.png"
                alt={t.supply.corridorImageAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 48vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Honest coverage note */}
      <section className="bg-background py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="rounded-xl border border-brand-champagne/50 bg-card p-6 sm:p-8">
              <p className="text-sm leading-relaxed text-foreground sm:text-[15px]">
                {t.supply.honestNote}
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <CtaBand
        title={t.home.rfqBandTitle}
        body={t.home.rfqBandBody}
        secondaryHref="#/industries"
        secondaryLabel={t.nav.industries}
      />
    </>
  );
}
