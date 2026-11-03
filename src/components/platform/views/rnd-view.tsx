"use client";

import { FlaskConical, ListChecks, Package, TestTube2, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CtaBand, PageHero, Reveal, VerifyNotice } from "@/components/platform/blocks";
import { useI18n } from "@/lib/i18n/provider";

export function RndView() {
  const { t } = useI18n();

  const collabs = [
    { icon: FlaskConical, body: t.rnd.collab1 },
    { icon: Package, body: t.rnd.collab2 },
    { icon: TestTube2, body: t.rnd.collab3 },
    { icon: ListChecks, body: t.rnd.collab4 },
  ];
  const steps = [t.rnd.rndStep1, t.rnd.rndStep2, t.rnd.rndStep3, t.rnd.rndStep4];

  return (
    <>
      <PageHero eyebrow={t.footer.headingPartners} title={t.rnd.title} subtitle={t.rnd.subtitle} intro={t.rnd.intro} />

      <section className="bg-background py-14 lg:py-18">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <h2 className="text-fluid-h2 font-display font-extrabold">{t.rnd.collabTitle}</h2>
          </Reveal>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {collabs.map((collab, i) => (
              <Reveal key={collab.body} delay={i * 0.05}>
                <div className="h-full rounded-lg border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-brand-teal/40 hover:shadow-md">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-accent">
                    <collab.icon className="h-5 w-5 text-primary" aria-hidden="true" />
                  </span>
                  <p className="mt-4 text-sm leading-relaxed">{collab.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-secondary/50 py-14 lg:py-18">
        <div className="mx-auto grid max-w-7xl items-start gap-10 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:px-8">
          <Reveal>
            <h2 className="text-fluid-h2 font-display font-extrabold">{t.rnd.processTitle}</h2>
            <ol className="relative mt-8 space-y-6">
              {steps.map((step, i) => (
                <li key={step} className="flex items-start gap-4">
                  <span className="tech-value z-10 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-brand-teal/40 bg-card text-sm font-semibold text-primary shadow-sm">
                    {i + 1}
                  </span>
                  <div className="flex-1 rounded-lg border border-border bg-card p-4 sm:p-5">
                    <p className="text-sm leading-relaxed">{step}</p>
                  </div>
                </li>
              ))}
            </ol>
            <Button asChild variant="cta" size="lg" className="mt-8 min-h-12">
              <a href="#/rfq">{t.rnd.cta}</a>
            </Button>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="rounded-xl border border-border bg-card p-6 sm:p-7">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-md bg-accent">
                <UserCheck className="h-5 w-5 text-primary" aria-hidden="true" />
              </span>
              <h3 className="mt-4 font-display text-lg font-bold leading-snug">{t.aiTech.postureTitle}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t.rnd.note}</p>
              <div className="mt-5 space-y-2.5 border-t border-border pt-5">
                <p className="text-sm leading-relaxed">{t.aiTech.boundary1}</p>
                <p className="text-sm leading-relaxed">{t.aiTech.boundary2}</p>
              </div>
            </div>
            <VerifyNotice className="mt-6" />
          </Reveal>
        </div>
      </section>

      <CtaBand
        title={t.rnd.cta}
        body={t.rnd.intro}
        secondaryHref="#/capabilities"
        secondaryLabel={t.nav.capabilities}
      />
    </>
  );
}
