"use client";

import { Bot, Eye, ShieldAlert, Workflow } from "lucide-react";
import { CtaBand, PageHero, Reveal, VerifyNotice } from "@/components/platform/blocks";
import { AiCollabModal } from "@/components/platform/inquiry-modals";
import { useI18n } from "@/lib/i18n/provider";

export function AiTechView() {
  const { t } = useI18n();

  const posture = [
    { icon: Eye, body: t.aiTech.posture1 },
    { icon: Workflow, body: t.aiTech.posture2 },
    { icon: ShieldAlert, body: t.aiTech.posture3 },
    { icon: Bot, body: t.aiTech.posture4 },
  ];
  const applications = [t.aiTech.app1, t.aiTech.app2, t.aiTech.app3];
  const boundaries = [t.aiTech.boundary1, t.aiTech.boundary2, t.aiTech.boundary3];

  return (
    <>
      <PageHero eyebrow={t.nav.alias.company} title={t.aiTech.title} subtitle={t.aiTech.subtitle} intro={t.aiTech.intro} />

      <section className="bg-background py-14 lg:py-18">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <h2 className="text-fluid-h2 font-display font-extrabold">{t.aiTech.postureTitle}</h2>
          </Reveal>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {posture.map((item, i) => (
              <Reveal key={item.body} delay={i * 0.05}>
                <div className="h-full rounded-lg border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-brand-teal/40 hover:shadow-md">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-accent">
                    <item.icon className="h-5 w-5 text-primary" aria-hidden="true" />
                  </span>
                  <p className="mt-4 text-sm leading-relaxed">{item.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-secondary/50 py-14 lg:py-18">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-14 lg:px-8">
          <Reveal>
            <h2 className="text-fluid-h2 font-display font-extrabold">{t.aiTech.applicationsTitle}</h2>
            <ul className="mt-6 space-y-3.5">
              {applications.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm leading-relaxed sm:text-[15px]">
                  <Workflow className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="text-fluid-h2 font-display font-extrabold">{t.aiTech.boundariesTitle}</h2>
            <ul className="mt-6 space-y-3.5">
              {boundaries.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm leading-relaxed sm:text-[15px]">
                  <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-brand-champagne" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <AiCollabModal />
          </Reveal>
        </div>
      </section>

      <section className="bg-background py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <VerifyNotice />
          </Reveal>
        </div>
      </section>

      <CtaBand
        title={t.aiTech.cta}
        body={t.aiTech.intro}
        secondaryHref="#/rnd"
        secondaryLabel={t.meta.rnd}
      />
    </>
  );
}
