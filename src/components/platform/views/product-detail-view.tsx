"use client";

import Image from "next/image";
import { ArrowLeft, ArrowRight, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Reveal, VerifyNotice } from "@/components/platform/blocks";
import { ProductCard } from "@/components/platform/product-card";
import { getProduct, PRODUCT_FAMILIES } from "@/content/products";
import { useI18n } from "@/lib/i18n/provider";

type FamilyKey = keyof ReturnType<typeof useI18n>["t"]["products"]["familyNames"];

export function ProductDetailView({ slug }: { slug: string }) {
  const { t } = useI18n();
  const product = getProduct(slug);
  const item = product ? t.products.items[product.key] : undefined;

  if (!product || !item) {
    return (
      <section className="mx-auto flex max-w-3xl flex-col items-center px-4 py-24 text-center">
        <p className="tech-value text-5xl font-semibold text-primary">404</p>
        <h1 className="text-fluid-h3 mt-4 font-display font-bold">{t.common.notFoundTitle}</h1>
        <p className="mt-2 text-muted-foreground">{t.common.notFoundBody}</p>
        <Button asChild variant="cta" className="mt-6 min-h-11">
          <a href="#/products">{t.common.backToProducts}</a>
        </Button>
      </section>
    );
  }

  const rfqHref = `#/rfq?product=${product.slug}`;
  // Documentation intent lands in the RFQ form pre-tagged as a docs request —
  // the two CTAs no longer point at the identical URL (Wave 2, P1-15).
  const docsHref = `#/rfq?product=${product.slug}&intent=docs`;
  const familyFaq = t.products.familyFaq[product.key];

  return (
    <>
      {/* Product hero */}
      <section className="border-b border-border bg-brand-navy bg-blueprint-dark text-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <nav aria-label={t.a11y.breadcrumbLabel}>
            <a
              href="#/products"
              className="inline-flex min-h-11 items-center gap-1.5 rounded-md px-2 text-sm font-medium text-[#c2d0dd] transition-colors hover:text-brand-teal-pale focus-visible:outline-2 focus-visible:outline-ring"
            >
              <ArrowLeft className="h-4 w-4 rtl:-scale-x-100" aria-hidden="true" />
              {t.common.backToProducts}
            </a>
          </nav>
          <div className="mt-6 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-12">
            <div className="relative aspect-square overflow-hidden rounded-xl border border-white/10 shadow-2xl">
              <Image
                src={product.image}
                alt={item.alt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover"
              />
              <p className="tech-value absolute bottom-3 start-3 rounded-md bg-brand-navy/80 px-2.5 py-1.5 text-[11px] text-[#9fb2c4]">
                {t.common.illustrativeImageNote}
              </p>
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="tech-value bg-brand-teal/20 text-[11px] font-semibold text-brand-teal-pale hover:bg-brand-teal/20">
                  {t.products.familyNames[product.key]}
                </Badge>
                <Badge
                  variant="outline"
                  className="tech-value border-white/20 bg-transparent text-[11px] text-[#a9bac9]"
                >
                  {t.products.supplyRolePending}
                </Badge>
              </div>
              <h1 className="text-fluid-h2 mt-4 font-display font-extrabold">{item.name}</h1>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#b6c5d4]">{item.long}</p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Button asChild variant="cta" size="lg" className="min-h-12 px-6">
                  <a href={rfqHref}>
                    {t.products.detailCtaRfq}
                    <ArrowRight className="h-4 w-4 rtl:-scale-x-100" aria-hidden="true" />
                  </a>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="min-h-12 border-white/25 bg-transparent text-white hover:bg-white/10 hover:text-white"
                >
                  <a href={docsHref}>
                    <FileText className="h-4 w-4" aria-hidden="true" />
                    {t.products.detailCtaDocs}
                  </a>
                </Button>
                {/* Custom packs are the engineering-led anchor family — surface the
                    dedicated custom-requirement pathway (dead key wiring, Wave 2) */}
                {product.slug === "custom-packs" && (
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="min-h-12 border-white/25 bg-transparent text-white hover:bg-white/10 hover:text-white"
                  >
                    <a href="#/rnd">{t.common.discussCustom}</a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Specs */}
      <section className="bg-background py-12 lg:py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:px-8">
          <Reveal>
            <h2 className="text-fluid-h3 font-display font-bold">{t.products.specTableTitle}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{t.products.specsIntro}</p>
            <div className="mt-5 overflow-x-auto rounded-lg border border-border bg-card scroll-slim">
              <table className="w-full min-w-[480px] border-collapse text-sm">
                <caption className="sr-only">{`${t.products.specTableTitle} — ${item.name}`}</caption>
                <tbody>
                  {product.specs.map((row, i) => (
                    <tr key={row.label} className={i % 2 === 0 ? "bg-transparent" : "bg-secondary/40"}>
                      <th
                        scope="row"
                        className="w-56 border-b border-border px-4 py-3.5 text-start align-top font-semibold text-foreground"
                      >
                        {t.products.specLabels[row.label]}
                      </th>
                      <td className="border-b border-border px-4 py-3.5 align-top">
                        {row.value ? (
                          <span className="tech-value text-foreground">{row.value}</span>
                        ) : (
                          <span className="text-muted-foreground">{t.products.specPending}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <th scope="row" className="px-4 py-3.5 text-start align-top font-semibold">
                      {t.products.specLabels.availability}
                    </th>
                    <td className="px-4 py-3.5 align-top text-muted-foreground">
                      {t.common.confirmAvailability}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <VerifyNotice className="mt-6" />
          </Reveal>

          <Reveal delay={0.08}>
            <h2 className="text-fluid-h3 font-display font-bold">{t.products.variantsLabel}</h2>
            {product.variants.length > 0 ? (
              <>
                <ul className="mt-4 space-y-2.5">
                  {product.variants.map((v) => (
                    <li
                      key={v.name}
                      className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card px-4 py-3"
                    >
                      <span className="text-sm font-medium">{v.name}</span>
                      <span className="tech-value text-xs text-muted-foreground">
                        {t.common.confirmAvailability}
                      </span>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <p className="mt-4 rounded-lg border border-dashed border-border bg-card px-4 py-5 text-sm text-muted-foreground">
                {t.products.variantsEmpty}
              </p>
            )}

            <Separator className="my-7" />

            <h3 className="font-display text-base font-bold">{t.rfq.asideTitle}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t.rfq.asideBody}</p>
            <Button asChild variant="cta" className="mt-4 min-h-11">
              <a href={rfqHref}>{t.common.requestQuotation}</a>
            </Button>
          </Reveal>
        </div>
      </section>

      {/* Per-family FAQ — objection handling + AEO surface (Wave 2, P1-15) */}
      <section className="border-t border-border bg-secondary/40 py-12 lg:py-16" aria-labelledby="product-faq">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <h2 id="product-faq" className="text-fluid-h3 font-display font-bold">{t.products.faqTitle}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{item.name}</p>
          </Reveal>
          <Reveal delay={0.08} className="mt-6">
            <Accordion type="single" collapsible className="rounded-xl border border-border bg-card px-6">
              <AccordionItem value="fq-1">
                <AccordionTrigger className="text-start text-[15px] font-semibold leading-snug hover:no-underline">
                  {familyFaq.q1}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                  {familyFaq.a1}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="fq-2">
                <AccordionTrigger className="text-start text-[15px] font-semibold leading-snug hover:no-underline">
                  {familyFaq.q2}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                  {familyFaq.a2}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </Reveal>
        </div>
      </section>

      {/* Related products */}
      <section className="border-t border-border bg-secondary/40 py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-fluid-h3 font-display font-bold">{t.common.relatedProducts}</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {product.related
              .map((slug) => PRODUCT_FAMILIES.find((p) => p.slug === slug))
              .filter((p): p is NonNullable<typeof p> => Boolean(p))
              .map((p) => (
                <ProductCard
                  key={p.slug}
                  product={p}
                  familyLabel={t.products.familyNames[p.key]}
                />
              ))}
          </div>
        </div>
      </section>
    </>
  );
}
