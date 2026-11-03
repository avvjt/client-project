"use client";

import { MapPin } from "lucide-react";
import { PageHero } from "@/components/platform/blocks";
import { RfqForm } from "@/components/platform/rfq-form";
import { useI18n } from "@/lib/i18n/provider";

export function RfqView({ prefillSlug, intent }: { prefillSlug?: string; intent?: string }) {
  const { t } = useI18n();

  return (
    <>
      <PageHero
        eyebrow={t.nav.alias.contact}
        title={t.rfq.title}
        subtitle={t.rfq.subtitle}
        intro={t.rfq.intro}
      />

      <section className="bg-background py-12 lg:py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.38fr_0.62fr] lg:px-8">
          {/* Aside — contact pathways */}
          <aside className="space-y-6">
            <div className="rounded-xl border border-border bg-card p-6">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-md bg-accent">
                <MapPin className="h-5 w-5 text-primary" aria-hidden="true" />
              </span>
              <h2 className="text-fluid-h3 mt-4 font-display font-bold">{t.rfq.asideTitle}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t.rfq.asideBody}</p>
            </div>

            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="font-display text-base font-bold">{t.rfq.asideLocationTitle}</h2>
              <p className="tech-value mt-2 text-sm text-foreground">{t.rfq.asideLocationBody}</p>
              <p className="tech-value mt-1 text-xs text-muted-foreground">{t.common.location}</p>
            </div>

            <div className="rounded-xl border border-brand-teal/30 bg-accent p-6">
              <h2 className="font-display text-base font-bold">{t.common.verificationNotice}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t.rfq.responseNote}</p>
            </div>
          </aside>

          {/* Form */}
          <div>
            <RfqForm prefillSlug={prefillSlug} intent={intent} />
          </div>
        </div>
      </section>
    </>
  );
}
