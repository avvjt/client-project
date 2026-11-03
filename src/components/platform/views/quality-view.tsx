"use client";

import { FileSearch, Import, PackageCheck, ScrollText, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CtaBand, PageHero, Reveal, VerifyNotice } from "@/components/platform/blocks";
import { useI18n } from "@/lib/i18n/provider";

const SECTION_ICONS = [Import, Wrench, PackageCheck, ScrollText, FileSearch] as const;

export function QualityView() {
  const { t } = useI18n();
  const sections = [
    t.quality.sections.incoming,
    t.quality.sections.process,
    t.quality.sections.release,
    t.quality.sections.docs,
    t.quality.sections.complaints,
  ];

  return (
    <>
      <PageHero
        eyebrow={t.nav.alias.quality}
        title={t.quality.title}
        subtitle={t.quality.subtitle}
        intro={t.quality.intro}
      />

      <section className="bg-background py-14 lg:py-18">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Certification statement — prominent, honest */}
          <Reveal>
            <div className="rounded-xl border border-brand-teal/30 bg-gradient-to-br from-accent to-card p-6 sm:p-8">
              <h2 className="text-fluid-h3 font-display font-bold">
                {t.quality.certificationTitle}
              </h2>
              <p className="mt-3 max-w-4xl text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
                {t.quality.certificationBody}
              </p>
              <Button asChild variant="cta" className="mt-5 min-h-11">
                <a href="#/rfq">{t.quality.docsCta}</a>
              </Button>
            </div>
          </Reveal>

          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {sections.map((section, i) => {
              const Icon = SECTION_ICONS[i % SECTION_ICONS.length];
              return (
                <Reveal key={section.title} delay={i * 0.05}>
                  <article className="flex h-full flex-col rounded-lg border border-border bg-card p-6 shadow-xs transition-shadow hover:shadow-md">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-md bg-secondary">
                      <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                    </span>
                    <h3 className="text-fluid-h3 mt-4 font-display font-bold leading-snug">
                      {section.title}
                    </h3>
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
          </Reveal>
        </div>
      </section>

      <CtaBand
        title={t.home.rfqBandTitle}
        body={t.home.rfqBandBody}
        secondaryHref="#/capabilities"
        secondaryLabel={t.common.exploreCapabilities}
      />
    </>
  );
}
