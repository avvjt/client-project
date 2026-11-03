"use client";

import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CtaBand, PageHero, Reveal } from "@/components/platform/blocks";
import { useI18n } from "@/lib/i18n/provider";

type IndustryItems = ReturnType<typeof useI18n>["t"]["industries"]["items"];

export function IndustriesView() {
  const { t } = useI18n();
  const entries = Object.entries(t.industries.items) as Array<
    [keyof IndustryItems, IndustryItems[keyof IndustryItems]]
  >;

  return (
    <>
      <PageHero
        eyebrow={t.nav.alias.industries}
        title={t.industries.title}
        subtitle={t.industries.subtitle}
        intro={t.industries.intro}
      />

      <section className="bg-background py-14 lg:py-18">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {entries.map(([key, item], i) => (
              <Reveal key={key} delay={i * 0.04}>
                <article className="group flex h-full flex-col rounded-lg border border-border bg-card p-6 shadow-xs transition-all hover:-translate-y-0.5 hover:border-brand-teal/40 hover:shadow-md">
                  <span className="tech-value text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h2 className="text-fluid-h3 mt-3 font-display font-bold leading-snug">
                    {item.title}
                  </h2>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {item.body}
                  </p>
                  <a
                    href="#/rfq"
                    className="mt-5 inline-flex min-h-11 items-center gap-1.5 rounded-md text-sm font-semibold text-primary transition-colors hover:text-accent-foreground focus-visible:outline-2 focus-visible:outline-ring"
                  >
                    {t.industries.cta}
                    <ArrowRight
                      className="h-4 w-4 transition-transform group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5"
                      aria-hidden="true"
                    />
                  </a>
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-10 flex flex-wrap items-center gap-4">
            <Button asChild variant="cta" size="lg" className="min-h-12">
              <a href="#/rfq">{t.common.requestQuotation}</a>
            </Button>
            <Button asChild variant="outline" size="lg" className="min-h-12">
              <a href="#/supply">{t.nav.supply}</a>
            </Button>
          </Reveal>
        </div>
      </section>

      <CtaBand
        title={t.home.rfqBandTitle}
        body={t.home.rfqBandBody}
        secondaryHref="#/quality"
        secondaryLabel={t.nav.quality}
      />
    </>
  );
}
