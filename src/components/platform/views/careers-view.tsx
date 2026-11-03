"use client";

import { BookOpenCheck, Briefcase, GraduationCap, Target } from "lucide-react";
import { CtaBand, PageHero, Reveal, VerifyNotice } from "@/components/platform/blocks";
import { CareersModal } from "@/components/platform/careers-modal";
import { useI18n } from "@/lib/i18n/provider";

export function CareersView() {
  const { t } = useI18n();

  const culture = [
    { icon: BookOpenCheck, body: t.careers.culture1 },
    { icon: Target, body: t.careers.culture2 },
    { icon: Briefcase, body: t.careers.culture3 },
    { icon: GraduationCap, body: t.careers.culture4 },
  ];

  return (
    <>
      <PageHero eyebrow={t.footer.headingPartners} title={t.careers.title} subtitle={t.careers.subtitle} intro={t.careers.intro} />

      <section className="bg-background py-14 lg:py-18">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <h2 className="text-fluid-h2 font-display font-extrabold">{t.careers.cultureTitle}</h2>
          </Reveal>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {culture.map((item, i) => (
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
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-2 lg:gap-10 lg:px-8">
          <Reveal>
            <div className="h-full rounded-xl border border-border bg-card p-6 sm:p-7">
              <h2 className="text-fluid-h2 font-display font-extrabold">{t.careers.openingsTitle}</h2>
              <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground sm:text-base">
                {t.careers.openingsBody}
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="h-full rounded-xl border border-border bg-card p-6 sm:p-7">
              <h2 className="text-fluid-h2 font-display font-extrabold">{t.careers.internTitle}</h2>
              <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground sm:text-base">
                {t.careers.internBody}
              </p>
            </div>
          </Reveal>
        </div>
        <div className="mx-auto mt-8 max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="flex flex-col items-start justify-between gap-4 rounded-xl border border-border bg-card p-6 sm:flex-row sm:items-center">
              <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
                {t.careers.contactNote}
              </p>
              <CareersModal />
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <VerifyNotice className="mt-6" />
          </Reveal>
        </div>
      </section>

      <CtaBand
        title={t.careers.cta}
        body={t.careers.intro}
        secondaryHref="#/company"
        secondaryLabel={t.nav.company}
      />
    </>
  );
}
