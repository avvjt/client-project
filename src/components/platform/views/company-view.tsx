"use client";

import { ArrowRight, CheckCircle2, MapPin, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Eyebrow, PageHero, Reveal, VerifyNotice } from "@/components/platform/blocks";
import { SectionArtifactField, SwissSeal } from "@/components/platform/medical-artifacts";
import { useI18n } from "@/lib/i18n/provider";

export function CompanyView() {
  const { t } = useI18n();
  const focus = [t.company.focus1, t.company.focus2, t.company.focus3, t.company.focus4];
  const approach = [t.company.approach1, t.company.approach2, t.company.approach3];

  return (
    <>
      <PageHero
        eyebrow={t.nav.alias.company}
        title={t.company.title}
        subtitle={t.company.subtitle}
      />

      <section className="bg-background py-14 lg:py-18">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
          <Reveal>
            <h2 className="text-fluid-h2 font-display font-extrabold">{t.company.aboutTitle}</h2>
            <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground sm:text-base">
              {t.company.aboutBody1}
            </p>
            <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground sm:text-base">
              {t.company.aboutBody2}
            </p>

            <h3 className="text-fluid-h3 mt-10 font-display font-bold">{t.company.focusTitle}</h3>
            <ul className="mt-4 space-y-3">
              {focus.map((point) => (
                <li key={point} className="flex items-start gap-3 text-sm leading-relaxed sm:text-[15px]">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>

            <h3 className="text-fluid-h3 mt-10 font-display font-bold">{t.company.approachTitle}</h3>
            <ul className="mt-4 space-y-3">
              {approach.map((point) => (
                <li key={point} className="flex items-start gap-3 text-sm leading-relaxed sm:text-[15px]">
                  <span
                    className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-brand-champagne"
                    aria-hidden="true"
                  />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.08}>
            {/* Stated direction — qualitative, no financial figures */}
            <div className="relative overflow-hidden rounded-xl border border-border bg-card p-6">
              <SectionArtifactField far="molecule" near="pulse" className="opacity-80" />
              <div className="relative">
                <div className="flex items-start justify-between gap-4">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-md bg-accent">
                    <Target className="h-5 w-5 text-primary" aria-hidden="true" />
                  </span>
                  <SwissSeal className="h-10 w-10 shrink-0" />
                </div>
                <p className="tech-value mt-4 text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                  {t.company.visionEyebrow}
                </p>
                <h3 className="mt-2 font-display text-xl font-extrabold leading-snug">
                  {t.company.visionTitle}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{t.company.visionBody}</p>
                <p className="tech-value mt-4 text-xs leading-relaxed text-muted-foreground/90">
                  {t.company.visionNote}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button asChild variant="outline" className="min-h-11 text-primary hover:bg-accent hover:text-accent-foreground">
                    <a href="#/leadership">
                      {t.nav.leadership}
                      <ArrowRight className="h-4 w-4 rtl:-scale-x-100" aria-hidden="true" />
                    </a>
                  </Button>
                  <Button asChild variant="ghost" className="min-h-11 text-primary hover:bg-accent hover:text-accent-foreground">
                    <a href="#/investors">{t.meta.investors}</a>
                  </Button>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-xl border border-border bg-card p-6">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-md bg-accent">
                <MapPin className="h-5 w-5 text-primary" aria-hidden="true" />
              </span>
              <h3 className="text-fluid-h3 mt-4 font-display font-bold">{t.company.locationTitle}</h3>
              <p className="tech-value mt-2 rounded-md bg-secondary px-3 py-2 text-sm text-foreground">
                {t.company.locationBody}
              </p>
              <Button asChild variant="cta" className="mt-6 min-h-11 w-full">
                <a href="#/rfq">{t.company.cta}</a>
              </Button>
            </div>
            <VerifyNotice className="mt-6" />
            <p className="mt-4 text-xs leading-relaxed text-muted-foreground">{t.company.reviewNote}</p>
          </Reveal>
        </div>
      </section>

      {/* Swiss-grade method */}
      <section className="border-t border-border bg-secondary/50 py-14 lg:py-18" aria-labelledby="company-method">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <Eyebrow>{t.method.eyebrow}</Eyebrow>
            <h2 id="company-method" className="text-fluid-h2 font-display font-extrabold">
              {t.method.title}
            </h2>
            <p className="mt-3 max-w-3xl text-muted-foreground">{t.method.subtitle}</p>
          </Reveal>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: t.method.p1Title, body: t.method.p1Body },
              { title: t.method.p2Title, body: t.method.p2Body },
              { title: t.method.p3Title, body: t.method.p3Body },
              { title: t.method.p4Title, body: t.method.p4Body },
            ].map((pillar, i) => (
              <Reveal key={pillar.title} delay={i * 0.05}>
                <div className="h-full rounded-lg border border-border bg-card p-5">
                  <span className="tech-value text-xs font-semibold text-brand-champagne" aria-hidden="true">0{i + 1}</span>
                  <h3 className="mt-2 font-display text-base font-bold leading-snug">{pillar.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{pillar.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.15}>
            <p className="tech-value mt-5 rounded-lg border border-border bg-background px-4 py-3 text-xs leading-relaxed text-muted-foreground">
              {t.method.note}
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
