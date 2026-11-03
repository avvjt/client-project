"use client";

import { ClipboardList, FileSearch, Handshake, Layers, PackageSearch, ShieldCheck } from "lucide-react";
import { CtaBand, PageHero, Reveal, VerifyNotice } from "@/components/platform/blocks";
import { VendorModal } from "@/components/platform/inquiry-modals";
import { useI18n } from "@/lib/i18n/provider";

export function VendorsView() {
  const { t } = useI18n();

  const fits = [
    { icon: Layers, body: t.vendors.fit1 },
    { icon: PackageSearch, body: t.vendors.fit2 },
    { icon: ShieldCheck, body: t.vendors.fit3 },
    { icon: FileSearch, body: t.vendors.fit4 },
  ];
  const expectations = [t.vendors.expect1, t.vendors.expect2, t.vendors.expect3, t.vendors.expect4];
  const steps = [
    { icon: ClipboardList, body: t.vendors.vendorStep1 },
    { icon: FileSearch, body: t.vendors.vendorStep2 },
    { icon: Handshake, body: t.vendors.vendorStep3 },
    { icon: ShieldCheck, body: t.vendors.vendorStep4 },
  ];

  return (
    <>
      <PageHero eyebrow={t.footer.headingPartners} title={t.vendors.title} subtitle={t.vendors.subtitle} intro={t.vendors.intro} />

      <section className="bg-background py-14 lg:py-18">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <h2 className="text-fluid-h2 font-display font-extrabold">{t.vendors.fitTitle}</h2>
          </Reveal>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {fits.map((fit, i) => (
              <Reveal key={fit.body} delay={i * 0.05}>
                <div className="h-full rounded-lg border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-brand-teal/40 hover:shadow-md">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-accent">
                    <fit.icon className="h-5 w-5 text-primary" aria-hidden="true" />
                  </span>
                  <p className="mt-4 text-sm leading-relaxed">{fit.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-secondary/50 py-14 lg:py-18">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-14 lg:px-8">
          <Reveal>
            <h2 className="text-fluid-h2 font-display font-extrabold">{t.vendors.expectationsTitle}</h2>
            <ul className="mt-6 space-y-3.5">
              {expectations.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm leading-relaxed sm:text-[15px]">
                  <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="tech-value mt-6 rounded-lg border border-brand-champagne/40 bg-card px-4 py-3 text-xs leading-relaxed text-muted-foreground">
              {t.vendors.note}
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="text-fluid-h2 font-display font-extrabold">{t.vendors.processTitle}</h2>
            <ol className="mt-6 space-y-4">
              {steps.map((step, i) => (
                <li key={step.body} className="flex items-start gap-4 rounded-lg border border-border bg-card p-4">
                  <span className="tech-value inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary text-sm font-semibold text-primary-foreground">
                    {i + 1}
                  </span>
                  <div className="flex items-start gap-3">
                    <step.icon className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                    <span className="text-sm leading-relaxed">{step.body}</span>
                  </div>
                </li>
              ))}
            </ol>
            <VendorModal />
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
        title={t.vendors.cta}
        body={t.vendors.intro}
        secondaryHref="#/products"
        secondaryLabel={t.nav.products}
      />
    </>
  );
}
