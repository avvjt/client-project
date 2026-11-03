"use client";

import { PageHero, Reveal } from "@/components/platform/blocks";
import { useI18n } from "@/lib/i18n/provider";

/** Privacy Policy / Terms & Conditions — honest baseline drafts flagged for counsel review. */
export function LegalView({ kind }: { kind: "privacy" | "terms" }) {
  const { t } = useI18n();

  if (kind === "privacy") {
    const sections = [
      { title: t.legal.p1Title, body: t.legal.p1Body },
      { title: t.legal.p2Title, body: t.legal.p2Body },
      { title: t.legal.p3Title, body: t.legal.p3Body },
      { title: t.legal.p4Title, body: t.legal.p4Body },
      { title: t.legal.p5Title, body: t.legal.p5Body },
    ];
    return (
      <LegalShell
        eyebrow={t.footer.privacy}
        title={t.legal.privacyTitle}
        status={t.legal.privacyUpdated}
        intro={t.legal.privacyIntro}
        sections={sections}
        contact={t.legal.privacyContact}
      />
    );
  }

  const sections = [
    { title: t.legal.t1Title, body: t.legal.t1Body },
    { title: t.legal.t2Title, body: t.legal.t2Body },
    { title: t.legal.t3Title, body: t.legal.t3Body },
    { title: t.legal.t4Title, body: t.legal.t4Body },
  ];
  return (
    <LegalShell
      eyebrow={t.footer.terms}
      title={t.legal.termsTitle}
      status={t.legal.termsUpdated}
      intro={t.legal.termsIntro}
      sections={sections}
      contact={t.legal.termsContact}
    />
  );
}

function LegalShell({
  eyebrow,
  title,
  status,
  intro,
  sections,
  contact,
}: {
  eyebrow: string;
  title: string;
  status: string;
  intro: string;
  sections: Array<{ title: string; body: string }>;
  contact: string;
}) {
  return (
    <>
      <PageHero eyebrow={eyebrow} title={title} subtitle={status} intro={intro} />
      <section className="bg-background py-12 lg:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="space-y-8">
              {sections.map((s, i) => (
                <div key={s.title} className="rounded-lg border border-border bg-card p-6">
                  <h2 className="text-fluid-h3 font-display font-bold">
                    <span className="tech-value me-2 text-primary">{String(i + 1).padStart(2, "0")}</span>
                    {s.title}
                  </h2>
                  <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
                    {s.body}
                  </p>
                </div>
              ))}
            </div>
            <p className="mt-8 rounded-lg border border-dashed border-border bg-secondary/50 px-4 py-3.5 text-sm text-muted-foreground">
              {contact}
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
