"use client";

/**
 * DISPO-CONCEPT — LEADERSHIP VIEW
 *
 * Named leadership (management-confirmed) + six executive mandates.
 * Honesty rule: mandates without a confirmed appointee are presented as
 * mandates — never as people. No invented biographies, no fabricated
 * credentials, no photographs of unnamed executives.
 */

import { motion } from "motion/react";
import {
  ArrowRight,
  ClipboardList,
  Globe2,
  Lightbulb,
  MapPin,
  TrendingUp,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CtaBand, PageHero, Reveal } from "@/components/platform/blocks";
import { Artifact, SectionArtifactField, SwissSeal } from "@/components/platform/medical-artifacts";
import { useI18n } from "@/lib/i18n/provider";

/** Monogram avatar — gradient ring, engraved initials. */
function LeaderMonogram({
  initials,
  tone,
  className,
}: {
  initials: string;
  tone: "teal" | "champagne";
  className?: string;
}) {
  return (
    <span
      className={
        "relative inline-flex h-20 w-20 shrink-0 items-center justify-center rounded-full p-[2px] " +
        (tone === "teal"
          ? "bg-gradient-to-br from-brand-teal-signal via-brand-teal-pale to-brand-champagne"
          : "bg-gradient-to-br from-brand-champagne via-brand-teal-pale to-brand-teal-signal") +
        " " +
        (className ?? "")
      }
      aria-hidden="true"
    >
      <span className="flex h-full w-full items-center justify-center rounded-full bg-brand-navy">
        <span className="font-display text-xl font-extrabold tracking-[0.08em] text-brand-teal-pale">
          {initials}
        </span>
      </span>
      <span className="absolute inset-0 rounded-full ring-1 ring-white/15" />
    </span>
  );
}

export function LeadershipView() {
  const { t } = useI18n();

  const mandates = [
    { icon: Lightbulb, role: t.leadership.m1Role, body: t.leadership.m1Body },
    { icon: TrendingUp, role: t.leadership.m2Role, body: t.leadership.m2Body },
    { icon: Globe2, role: t.leadership.m3Role, body: t.leadership.m3Body },
    { icon: MapPin, role: t.leadership.m4Role, body: t.leadership.m4Body },
    { icon: ClipboardList, role: t.leadership.m5Role, body: t.leadership.m5Body },
    { icon: Users, role: t.leadership.m6Role, body: t.leadership.m6Body },
  ];

  const principles = [
    { artifact: "cross" as const, title: t.leadership.p1Title, body: t.leadership.p1Body },
    { artifact: "pack" as const, title: t.leadership.p2Title, body: t.leadership.p2Body },
    { artifact: "pulse" as const, title: t.leadership.p3Title, body: t.leadership.p3Body },
    { artifact: "molecule" as const, title: t.leadership.p4Title, body: t.leadership.p4Body },
  ];

  return (
    <>
      <PageHero
        eyebrow={t.nav.alias.company}
        title={t.leadership.title}
        subtitle={t.leadership.subtitle}
        artifact="gown"
      />

      {/* ── Named leadership ─────────────────────────────────────────── */}
      <section className="bg-background py-14 lg:py-18" aria-labelledby="leadership-named">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <p className="tech-value mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-primary">
              {t.leadership.eyebrow}
            </p>
            <h2 id="leadership-named" className="sr-only">
              {t.leadership.eyebrow}
            </h2>
          </Reveal>

          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            {/* Managing Director */}
            <Reveal>
              <motion.article
                whileHover={{ y: -4 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="glass-card relative flex h-full flex-col rounded-2xl p-6 sm:p-8"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-center gap-5">
                    <LeaderMonogram initials="PR" tone="teal" />
                    <div>
                      <h3 className="font-display text-xl font-extrabold leading-snug sm:text-2xl">
                        {t.leadership.mdName}
                      </h3>
                      <p className="tech-value mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                        {t.leadership.mdRole}
                      </p>
                    </div>
                  </div>
                  <SwissSeal className="h-10 w-10 shrink-0" />
                </div>
                <p className="tech-value mt-5 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  {t.leadership.mdFocus}
                </p>
                <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
                  {t.leadership.mdBio1}
                </p>
                <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
                  {t.leadership.mdBio2}
                </p>
                <Artifact
                  name="gown"
                  className="pointer-events-none absolute -end-6 -top-6 h-28 w-28 text-brand-teal opacity-[0.07]"
                  aria-hidden="true"
                />
              </motion.article>
            </Reveal>

            {/* Director */}
            <Reveal delay={0.08}>
              <motion.article
                whileHover={{ y: -4 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="glass-card relative flex h-full flex-col rounded-2xl p-6 sm:p-8"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-center gap-5">
                    <LeaderMonogram initials="PK" tone="champagne" />
                    <div>
                      <h3 className="font-display text-xl font-extrabold leading-snug sm:text-2xl">
                        {t.leadership.dirName}
                      </h3>
                      <p className="tech-value mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                        {t.leadership.dirRole}
                      </p>
                    </div>
                  </div>
                  <Artifact
                    name="cross"
                    className="h-10 w-10 shrink-0 text-brand-teal opacity-30"
                    aria-hidden="true"
                  />
                </div>
                <p className="tech-value mt-5 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  {t.leadership.dirFocus}
                </p>
                <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
                  {t.leadership.dirBio1}
                </p>
                <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
                  {t.leadership.dirBio2}
                </p>
              </motion.article>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Six executive mandates ───────────────────────────────────── */}
      <section className="relative overflow-hidden border-y border-border bg-secondary/50 py-14 lg:py-18" aria-labelledby="leadership-mandates">
        <SectionArtifactField far="molecule" near="capsule" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <p className="tech-value mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-primary">
              {t.leadership.mandatesEyebrow}
            </p>
            <h2 id="leadership-mandates" className="text-fluid-h2 max-w-3xl font-display font-extrabold">
              {t.leadership.mandatesTitle}
            </h2>
            <p className="mt-3 max-w-3xl text-muted-foreground">{t.leadership.mandatesSubtitle}</p>
          </Reveal>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {mandates.map((m, i) => (
              <Reveal key={m.role} delay={i * 0.05}>
                <article className="flex h-full flex-col rounded-xl border border-border bg-card p-6 transition-all hover:-translate-y-0.5 hover:border-brand-teal/40 hover:shadow-md">
                  <div className="flex items-center justify-between gap-3">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-md bg-accent">
                      <m.icon className="h-5 w-5 text-primary" aria-hidden="true" />
                    </span>
                    <span className="tech-value text-xs font-semibold text-brand-champagne" aria-hidden="true">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="mt-4 font-display text-lg font-bold leading-snug">{m.role}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{m.body}</p>
                  <p className="mt-4 inline-flex w-fit items-center gap-1.5 rounded-full border border-border bg-secondary/70 px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                    <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-champagne opacity-60 motion-reduce:animate-none" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand-champagne" />
                    </span>
                    {t.leadership.appointmentPending}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.1}>
            <p className="tech-value mt-6 rounded-lg border border-border bg-card px-4 py-3 text-xs leading-relaxed text-muted-foreground">
              {t.leadership.appointmentNote}
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── Leadership principles ────────────────────────────────────── */}
      <section className="bg-background py-14 lg:py-18" aria-labelledby="leadership-principles">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <p className="tech-value mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-primary">
              {t.leadership.principlesEyebrow}
            </p>
            <h2 id="leadership-principles" className="text-fluid-h2 max-w-3xl font-display font-extrabold">
              {t.leadership.principlesTitle}
            </h2>
          </Reveal>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {principles.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.06}>
                <div className="group h-full rounded-xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-brand-teal/40 hover:shadow-md">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-secondary text-primary transition-colors group-hover:bg-accent">
                    <Artifact name={p.artifact} animated className="h-7 w-7" />
                  </span>
                  <h3 className="mt-4 font-display text-base font-bold leading-snug">{p.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Careers bridge ───────────────────────────────────────────── */}
      <section className="border-t border-border bg-secondary/50 py-12">
        <div className="mx-auto flex max-w-7xl flex-col items-start gap-5 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="max-w-2xl">
            <Badge variant="secondary" className="tech-value text-[11px] font-semibold uppercase tracking-widest">
              {t.leadership.eyebrow}
            </Badge>
            <h2 className="text-fluid-h3 mt-3 font-display font-bold">{t.leadership.ctaTitle}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
              {t.leadership.ctaBody}
            </p>
          </div>
          <Button asChild variant="cta" size="lg" className="min-h-11 shrink-0">
            <a href="#/careers">
              {t.meta.careers}
              <ArrowRight className="h-4 w-4 rtl:-scale-x-100" aria-hidden="true" />
            </a>
          </Button>
        </div>
      </section>

      <CtaBand
        title={t.home.rfqBandTitle}
        body={t.home.rfqBandBody}
        secondaryHref="#/company"
        secondaryLabel={t.nav.company}
      />
    </>
  );
}
