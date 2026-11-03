"use client";

import {
  ClipboardList,
  FileCheck2,
  Globe2,
  PackageCheck,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CtaBand, Eyebrow, PageHero, Reveal, VerifyNotice } from "@/components/platform/blocks";
import { useI18n } from "@/lib/i18n/provider";

const SECTION_ICONS = [PackageCheck, ClipboardList, Search, FileCheck2, Globe2] as const;

export function CapabilitiesView() {
  const { t } = useI18n();
  const sections = [
    t.capabilities.sections.supply,
    t.capabilities.sections.packs,
    t.capabilities.sections.sourcing,
    t.capabilities.sections.qualityDocs,
    t.capabilities.sections.coordination,
  ];

  return (
    <>
      <PageHero
        eyebrow={t.nav.alias.capabilities}
        title={t.capabilities.title}
        subtitle={t.capabilities.subtitle}
        intro={t.capabilities.intro}
      />

      <section className="bg-background py-14 lg:py-18">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {sections.map((section, i) => {
              const Icon = SECTION_ICONS[i % SECTION_ICONS.length];
              return (
                <Reveal key={section.title} delay={i * 0.05}>
                  <article className="flex h-full flex-col rounded-lg border border-border bg-card p-6 shadow-xs transition-shadow hover:shadow-md">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-md bg-accent">
                      <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                    </span>
                    <h2 className="text-fluid-h3 mt-4 font-display font-bold leading-snug">
                      {section.title}
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{section.body}</p>
                    <ul className="mt-4 flex-1 space-y-2.5 border-t border-border pt-4">
                      {section.points.map((point) => (
                        <li key={point} className="flex items-start gap-2.5 text-sm leading-relaxed">
                          <span
                            className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-brand-teal-signal"
                            aria-hidden="true"
                          />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </article>
                </Reveal>
              );
            })}
          </div>

          <Reveal className="mt-10">
            <VerifyNotice />
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button asChild variant="cta" size="lg" className="min-h-12">
                <a href="#/rfq">{t.capabilities.cta}</a>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      <CtaBand
        title={t.home.rfqBandTitle}
        body={t.home.rfqBandBody}
        secondaryHref="#/products"
        secondaryLabel={t.common.exploreProducts}
      />
    </>
  );
}
