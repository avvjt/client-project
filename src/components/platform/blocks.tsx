"use client";

import { motion } from "motion/react";
import { ShieldCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionArtifactField } from "@/components/platform/medical-artifacts";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/provider";

/** Section reveal — subtle, respects prefers-reduced-motion via MotionConfig. */
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, ease: "easeOut", delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Word-stagger entrance for hero titles — reading order preserved, RTL-safe
 *  (inline-block spans follow the writing direction), and transform-free under
 *  MotionConfig reducedMotion="user" (opacity-only fade). */
function StaggerWords({ text, className }: { text: string; className?: string }) {
  const words = text.split(" ");
  return (
    <h1 className={className}>
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          className="inline-block"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.55,
            ease: [0.22, 1, 0.36, 1],
            delay: 0.05 + i * 0.05,
          }}
        >
          {word}
          {i < words.length - 1 ? "\u00A0" : ""}
        </motion.span>
      ))}
    </h1>
  );
}

/** Page hero for inner views — cinematic navy band with artifact depth. */
export function PageHero({
  eyebrow,
  title,
  subtitle,
  intro,
  artifact = "molecule",
}: {
  eyebrow?: string;
  title: string;
  subtitle: string;
  intro?: string;
  artifact?: "molecule" | "gown" | "pack" | "capsule" | "cross" | "pulse" | "glove" | "syringe";
}) {
  return (
    <section className="relative overflow-hidden border-b border-border bg-brand-navy bg-blueprint-dark text-white">
      <SectionArtifactField tone="dark" far={artifact} near="cross" />
      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        {eyebrow && (
          <p className="tech-value mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-brand-teal-pale">
            {eyebrow}
          </p>
        )}
        <StaggerWords
          text={title}
          className="text-fluid-h2 max-w-3xl font-display font-extrabold"
        />
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-[#a9bac9] sm:text-lg">
          {subtitle}
        </p>
        {intro && (
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[#8ba0b2] sm:text-base">{intro}</p>
        )}
      </div>
    </section>
  );
}

/** Verified-information notice used across content-bearing views. */
export function VerifyNotice({ className }: { className?: string }) {
  const { t } = useI18n();
  return (
    <aside
      className={cn(
        "flex items-start gap-3 rounded-lg border border-brand-teal/30 bg-accent px-4 py-3.5",
        className
      )}
      role="note"
    >
      <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
      <div>
        <p className="text-sm font-semibold text-foreground">{t.common.verificationNotice}</p>
        <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">
          {t.common.verificationNoticeBody}
        </p>
      </div>
    </aside>
  );
}

/** Call-to-action band before the footer. */
export function CtaBand({
  title,
  body,
  secondaryHref,
  secondaryLabel,
}: {
  title: string;
  body: string;
  secondaryHref?: string;
  secondaryLabel?: string;
}) {
  const { t } = useI18n();
  return (
    <section className="border-t border-brand-teal/25 bg-brand-navy-2 bg-blueprint-dark">
      <div className="mx-auto flex max-w-7xl flex-col items-start gap-6 px-4 py-12 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="max-w-2xl">
          <h2 className="text-fluid-h3 font-display font-bold text-white">{title}</h2>
          <p className="mt-2 text-sm leading-relaxed text-[#a9bac9] sm:text-base">{body}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button asChild variant="cta" size="lg" className="min-h-11">
            <a href="#/rfq">{t.common.requestQuotation}</a>
          </Button>
          {secondaryHref && secondaryLabel && (
            <Button
              asChild
              size="lg"
              variant="outline"
              className="min-h-11 border-white/25 bg-transparent text-white hover:bg-white/10 hover:text-white"
            >
              <a href={secondaryHref}>
                {secondaryLabel}
                <ArrowRight className="h-4 w-4 rtl:-scale-x-100" aria-hidden="true" />
              </a>
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}

/** Small eyebrow label above section headings. */
export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="tech-value mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-primary">
      {children}
    </p>
  );
}
