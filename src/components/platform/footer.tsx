"use client";

import { useEffect, useState } from "react";
import { Facebook, Instagram, Linkedin, MapPin } from "lucide-react";
import { LogoMark } from "@/components/platform/logo";
import { Separator } from "@/components/ui/separator";
import { PartnerModal } from "@/components/platform/partner-modal";
import { useI18n } from "@/lib/i18n/provider";
import { PRODUCT_FAMILIES } from "@/content/products";
import type { PartnershipTrack } from "@/content/partnership";

/**
 * WhatsApp brand glyph — lucide ships no WhatsApp mark; this is the
 * standard community glyph (simple-icons, CC0) inlined to keep the
 * icon set self-contained. Decorative: the link carries the aria-label.
 */
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true" focusable="false">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

export function Footer() {
  const { t } = useI18n();
  // Rendered after mount so server and client markup always match (no year-
  // boundary hydration mismatch).
  const [year, setYear] = useState<number | null>(null);
  useEffect(() => {
    const id = window.setTimeout(() => setYear(new Date().getFullYear()), 0);
    return () => window.clearTimeout(id);
  }, []);

  const familyLinks = PRODUCT_FAMILIES.map((p) => ({
    href: `#/products/${p.slug}`,
    label: t.products.familyNames[p.key],
  }));

  const companyLinks = [
    { href: "#/capabilities", label: t.nav.capabilities },
    { href: "#/quality", label: t.nav.quality },
    { href: "#/industries", label: t.nav.industries },
    { href: "#/supply", label: t.nav.supply },
    { href: "#/sustainability", label: t.nav.sustainability },
    { href: "#/company", label: t.nav.company },
    { href: "#/leadership", label: t.nav.leadership },
    { href: "#/careers", label: t.meta.careers },
  ];

  /**
   * "Partner with us" column — each title opens its own standalone modal
   * portal (createPortal into document.body) with a per-track application
   * form and submit. The full pages remain reachable inside each modal.
   */
  const partnerLinks: Array<{ track: PartnershipTrack; label: string }> = [
    { track: "vendors", label: t.footer.linkVendors },
    { track: "rnd", label: t.footer.linkRnd },
    { track: "investors", label: t.footer.linkInvestors },
    { track: "aiTech", label: t.footer.linkAiTech },
  ];

  const supportLinks = [
    { href: "#/contact", label: t.nav.contact },
    { href: "#/privacy", label: t.footer.privacy },
    { href: "#/terms", label: t.footer.terms },
  ];

  /**
   * Published channels. LinkedIn & Facebook are the company's verified
   * profiles; Instagram points at the platform keyword search until an
   * official handle is confirmed (never fabricate a profile URL);
   * WhatsApp / Maps are built from the published phone number & address.
   */
  const socialLinks = [
    {
      href: "https://www.linkedin.com/company/dispo-concept-pvt-ltd",
      aria: t.footer.socialLinkedinAria,
      Icon: Linkedin,
    },
    {
      href: "https://www.instagram.com/explore/search/keyword/?q=dispoconcept",
      aria: t.footer.socialInstagramAria,
      Icon: Instagram,
    },
    {
      href: "https://www.facebook.com/dispoconcept",
      aria: t.footer.socialFacebookAria,
      Icon: Facebook,
    },
    {
      href:
        "https://www.google.com/maps/search/?api=1&query=" +
        encodeURIComponent(
          "Dispo-Concept Private Limited, No.103 Siddalingeshwara Complex, Kempapura Road, Chikkabanavara, Bangalore 560090, India"
        ),
      aria: t.footer.socialMapsAria,
      Icon: MapPin,
    },
    {
      href: "https://wa.me/917760319597",
      aria: t.footer.socialWhatsappAria,
      Icon: WhatsAppIcon,
    },
  ];

  return (
    <footer className="mt-auto bg-brand-navy text-[#c7d4e0]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.35fr_0.85fr_1fr_0.95fr_0.85fr]">
          <div>
            <a href="#/" className="inline-flex items-center gap-2.5 rounded-md focus-visible:outline-2 focus-visible:outline-ring" aria-label={t.a11y.homeLink}>
              <LogoMark className="h-9 w-9" />
              <span className="font-display text-[15px] font-extrabold tracking-[0.08em] text-white">
                DISPO<span className="text-brand-swiss">-</span>CONCEPT
              </span>
            </a>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-[#a9bac9]">
              {t.footer.tagline}
            </p>
            <div className="mt-5 max-w-sm rounded-xl border border-white/10 bg-white/[0.04] p-4">
              <p className="tech-value text-[10px] font-semibold uppercase tracking-[0.22em] text-brand-teal-pale">
                {t.footer.addressLabel}
              </p>
              <address
                className="mt-1.5 text-[13px] not-italic leading-relaxed text-[#c7d4e0]"
                data-allow-copy
              >
                No.103, Siddalingeshwara Complex,
                <br />
                Kempapura Road, Chikkabanavara,
                <br />
                Bangalore - 560 090, India
              </address>
              <p className="tech-value mt-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-brand-teal-pale">
                {t.footer.phoneLabel}
              </p>
              <div className="mt-1.5 space-y-0.5 text-[13px] leading-relaxed" data-allow-copy>
                <a
                  href="tel:+917760319597"
                  className="block text-[#c7d4e0] transition-colors hover:text-brand-teal-pale focus-visible:outline-2 focus-visible:outline-ring"
                >
                  +91 77603 19597
                </a>
                <a
                  href="tel:+919901659444"
                  className="block text-[#c7d4e0] transition-colors hover:text-brand-teal-pale focus-visible:outline-2 focus-visible:outline-ring"
                >
                  +91 99016 59444
                </a>
              </div>
              <p className="tech-value mt-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-brand-teal-pale">
                {t.footer.emailLabel}
              </p>
              <a
                href="mailto:dispoconceptpvtltd@gmail.com"
                data-allow-copy
                className="mt-1.5 inline-block break-all text-[13px] text-[#c7d4e0] transition-colors hover:text-brand-teal-pale focus-visible:outline-2 focus-visible:outline-ring"
              >
                dispoconceptpvtltd@gmail.com
              </a>
            </div>

            {/* Published channels — LinkedIn / Instagram / Facebook / Maps / WhatsApp */}
            <div className="mt-5">
              <p className="tech-value text-[10px] font-semibold uppercase tracking-[0.22em] text-brand-teal-pale">
                {t.footer.socialLabel}
              </p>
              <ul className="mt-2.5 flex flex-wrap items-center gap-2">
                {socialLinks.map(({ href, aria, Icon }) => (
                  <li key={href}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={aria}
                      title={aria}
                      className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-white/10 bg-white/[0.05] text-[#c7d4e0] transition-all hover:-translate-y-0.5 hover:border-brand-teal/60 hover:bg-brand-teal/10 hover:text-brand-teal-pale focus-visible:outline-2 focus-visible:outline-ring motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                    >
                      <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <nav aria-label={t.footer.headingFamilies}>
            <h2 className="font-display text-sm font-bold uppercase tracking-wider text-white">
              {t.footer.headingFamilies}
            </h2>
            <ul className="mt-4 space-y-2.5">
              {familyLinks.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="text-sm text-[#a9bac9] transition-colors hover:text-brand-teal-pale focus-visible:outline-2 focus-visible:outline-ring"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label={t.footer.headingCompany}>
            <h2 className="font-display text-sm font-bold uppercase tracking-wider text-white">
              {t.footer.headingCompany}
            </h2>
            <ul className="mt-4 space-y-2.5">
              {companyLinks.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="text-sm text-[#a9bac9] transition-colors hover:text-brand-teal-pale focus-visible:outline-2 focus-visible:outline-ring"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label={t.footer.headingPartners}>
            <h2 className="font-display text-sm font-bold uppercase tracking-wider text-white">
              {t.footer.headingPartners}
            </h2>
            <ul className="mt-4 space-y-2.5">
              {partnerLinks.map((l) => (
                <li key={l.track}>
                  <PartnerModal track={l.track} label={l.label} />
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label={t.footer.headingSupport}>
            <h2 className="font-display text-sm font-bold uppercase tracking-wider text-white">
              {t.footer.headingSupport}
            </h2>
            <ul className="mt-4 space-y-2.5">
              {supportLinks.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="text-sm text-[#a9bac9] transition-colors hover:text-brand-teal-pale focus-visible:outline-2 focus-visible:outline-ring"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white">
                {t.footer.contactTitle}
              </h3>
              <p className="mt-2 max-w-xs text-sm leading-relaxed text-[#a9bac9]">
                {t.footer.contactBody}
              </p>
            </div>
          </nav>
        </div>

        <Separator className="my-8 bg-white/10" />

        <div className="flex flex-col gap-3 text-xs leading-relaxed text-[#8ba0b2] md:flex-row md:items-start md:justify-between">
          <div className="max-w-xl">
            <p>© {year ?? ""} Dispo-Concept. {t.footer.rights}</p>
            <p className="mt-1.5">{t.footer.protectionNote}</p>
          </div>
          <p className="max-w-xl md:text-end">{t.footer.illustrativeNote}</p>
        </div>
      </div>
    </footer>
  );
}
