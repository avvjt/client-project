"use client";

import { AlertTriangle, Handshake, Scale } from "lucide-react";
import { CtaBand, PageHero, Reveal } from "@/components/platform/blocks";
import { SectionArtifactField } from "@/components/platform/medical-artifacts";
import { InvestorModal } from "@/components/platform/inquiry-modals";
import { useI18n } from "@/lib/i18n/provider";

export function InvestorsView() {
  const { t } = useI18n();

  const pillars = [
    { title: t.investors.pillar1Title, body: t.investors.pillar1Body },
    { title: t.investors.pillar2Title, body: t.investors.pillar2Body },
    { title: t.investors.pillar3Title, body: t.investors.pillar3Body },
    { title: t.investors.pillar4Title, body: t.investors.pillar4Body },
    { title: t.investors.pillar5Title, body: t.investors.pillar5Body },
  ];
  const risks = [t.investors.risk1, t.investors.risk2, t.investors.risk3, t.investors.risk4];
  const engagementSteps = [
    t.investors.engagementStep1,
    t.investors.engagementStep2,
    t.investors.engagementStep3,
    t.investors.engagementStep4,
  ];

  return (
    <>
      <PageHero
        eyebrow={t.nav.alias.company}
        title={t.investors.title}
        subtitle={t.investors.subtitle}
        intro={t.investors.intro}
      />

      {/* Operating narrative */}
      <section className="relative overflow-hidden bg-background py-14 lg:py-18">
        <SectionArtifactField far="molecule" near="cross" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:px-8">
          <Reveal>
            <h2 className="text-fluid-h2 font-display font-extrabold">{t.investors.narrativeTitle}</h2>
            <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground sm:text-base">
              {t.investors.narrativeBody1}
            </p>
            <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground sm:text-base">
              {t.investors.narrativeBody2}
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="rounded-xl border border-border bg-card p-6">
              <p className="tech-value text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                {t.company.visionEyebrow}
              </p>
              <h3 className="mt-3 font-display text-lg font-extrabold leading-snug sm:text-xl">
                {t.company.visionTitle}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {t.company.visionBody}
              </p>
              <p className="tech-value mt-3 border-t border-border pt-3 text-xs leading-relaxed text-muted-foreground">
                {t.company.visionNote}
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Pillars */}
      <section className="border-y border-border bg-secondary/50 py-14 lg:py-18">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <h2 className="text-fluid-h2 font-display font-extrabold">{t.investors.pillarsTitle}</h2>
          </Reveal>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {pillars.map((pillar, i) => (
              <Reveal key={pillar.title} delay={i * 0.05}>
                <div className="h-full rounded-lg border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-brand-teal/40 hover:shadow-md">
                  <span className="tech-value text-xs font-semibold text-brand-champagne" aria-hidden="true">0{i + 1}</span>
                  <h3 className="mt-2 font-display text-base font-bold leading-snug">{pillar.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{pillar.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Risks + engagement */}
      <section className="border-t border-border bg-secondary/50 py-14 lg:py-18">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-14 lg:px-8">
          <Reveal>
            <div className="flex items-start gap-4">
              <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-accent">
                <Scale className="h-5 w-5 text-primary" aria-hidden="true" />
              </span>
              <div>
                <h2 className="text-fluid-h2 font-display font-extrabold">{t.investors.riskTitle}</h2>
                <ul className="mt-5 space-y-3.5">
                  {risks.map((risk) => (
                    <li key={risk} className="flex items-start gap-3 text-sm leading-relaxed sm:text-[15px]">
                      <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-brand-champagne" aria-hidden="true" />
                      <span>{risk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="flex items-start gap-4">
              <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-accent">
                <Handshake className="h-5 w-5 text-primary" aria-hidden="true" />
              </span>
              <div>
                <h2 className="text-fluid-h2 font-display font-extrabold">{t.investors.engagementTitle}</h2>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
                  {t.investors.engagementBody}
                </p>
                <ol className="mt-5 space-y-3">
                  {engagementSteps.map((step, i) => (
                    <li key={step} className="flex items-start gap-3 text-sm leading-relaxed">
                      <span className="tech-value mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground">
                        {i + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
                <InvestorModal />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="bg-background py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <p className="text-xs leading-relaxed text-muted-foreground">{t.investors.disclaimer}</p>
          </Reveal>
        </div>
      </section>

      <CtaBand
        title={t.investors.cta}
        body={t.investors.engagementBody}
        secondaryHref="#/company"
        secondaryLabel={t.nav.company}
      />
    </>
  );
}
