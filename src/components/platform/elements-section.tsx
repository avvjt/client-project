"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { Badge } from "@/components/ui/badge";
import { Eyebrow, Reveal } from "@/components/platform/blocks";
import { ProductCard } from "@/components/platform/product-card";
import { PRODUCT_FAMILIES } from "@/content/products";
import { useI18n } from "@/lib/i18n/provider";

export function ElementsSection() {
  const { t } = useI18n();

  return (
    <section className="bg-background py-16 lg:py-20" aria-labelledby="home-families">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <Eyebrow>{t.nav.alias.products}</Eyebrow>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 id="home-families" className="text-fluid-h2 font-display font-extrabold">
                {t.home.categoriesTitle}
              </h2>
              <p className="mt-2 max-w-2xl text-muted-foreground">{t.home.categoriesSubtitle}</p>
            </div>
            <a
              href="#/products"
              className="hidden min-h-11 items-center gap-1.5 rounded-md px-3 text-sm font-semibold text-primary hover:bg-accent sm:inline-flex"
            >
              {t.common.exploreProducts}
              <svg
                className="h-4 w-4 rtl:-scale-x-100"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </a>
          </div>
        </Reveal>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {PRODUCT_FAMILIES.map((p, i) => (
            <Reveal key={p.slug} delay={(i % 4) * 0.05}>
              <ProductCard product={p} familyLabel={t.products.familyNames[p.key]} priority={i === 0} />
            </Reveal>
          ))}
        </div>
        {/* Catalogue depth line */}
        <Reveal delay={0.1}>
          <div className="mt-8 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card px-5 py-4">
            <p className="tech-value text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{PRODUCT_FAMILIES.length}</span>{" "}
              {t.home.vital1Label}
            </p>
            <Badge variant="secondary" className="tech-value whitespace-normal text-[11px]">
              {t.common.specsOnRequest}
            </Badge>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/**
 * Full-bleed visual band: cleanroom imagery with a floating spec chip.
 * Used between the hero and product explorer for an immersive production feel.
 */
export function ProductionBand() {
  const { t } = useI18n();
  const reduceMotion = useReducedMotion();

  return (
    <section aria-hidden="true" className="relative h-[38vh] min-h-56 overflow-hidden lg:h-[46vh]">
      <Image
        src="/images/cleanroom-production.png"
        alt=""
        fill
        sizes="100vw"
        className={`object-cover ${reduceMotion ? "" : "motion-safe:animate-[kenburns_18s_ease-in-out_infinite_alternate]"}`}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-brand-navy/85 via-brand-navy/55 to-brand-navy/25" />
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-background to-transparent" />
      <div className="absolute inset-0 mx-auto flex max-w-7xl items-center px-4 sm:px-6 lg:px-8">
        <Badge
          variant="outline"
          className="tech-value max-w-full whitespace-normal border-white/25 bg-brand-navy/70 px-3 py-1.5 text-center text-[11px] font-semibold uppercase leading-relaxed tracking-[0.18em] text-brand-teal-pale backdrop-blur-sm"
        >
          {t.common.illustrativeImageNote}
        </Badge>
      </div>
    </section>
  );
}
