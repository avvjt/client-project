import Platform from "@/components/platform/platform";
import { cookies } from "next/headers";
import { LOCALE_COOKIE, toLocale } from "@/lib/i18n/config";
import { PRODUCT_FAMILIES } from "@/content/products";
import en from "@/lib/i18n/dictionaries/en";

/** Canonical production origin — localhost must never ship to structured data. */
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://dispoconceptpvtltd.com";

/**
 * Structured data — built ONLY from management-confirmed facts
 * (src/content/products.ts + the English source-of-truth dictionary).
 * Governance: no prices, no MOQs, no certification claims, no financial figures.
 */

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: "Dispo-Concept",
  legalName: "Dispo-Concept Private Limited",
  description:
    "Medical-products business focused on surgical and procedural supplies, product sourcing and institutional supply — surgical gowns (standard, reinforced BVB, double-layer), procedure kits, 2-ply & 3-ply medical face masks, medical caps, shoe covers, sterilization wraps and custom-configured packs. Supply roles confirmed per order.",
  url: SITE_URL,
  logo: `${SITE_URL}/icon-512.png`,
  address: {
    "@type": "PostalAddress",
    streetAddress: "No.103, Siddalingeshwara Complex, Kempapura Road, Chikkabanavara",
    addressLocality: "Bangalore",
    postalCode: "560 090",
    addressRegion: "Karnataka",
    addressCountry: "IN",
  },
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "sales",
      telephone: "+917760319597",
      email: "dispoconceptpvtltd@gmail.com",
      availableLanguage: ["en", "fr", "de", "es", "nl", "ar", "zh"],
    },
    {
      "@type": "ContactPoint",
      contactType: "customer service",
      telephone: "+919901659444",
      email: "dispoconceptpvtltd@gmail.com",
      availableLanguage: ["en", "fr", "de", "es", "nl", "ar", "zh"],
    },
  ],
  // Corridors of interest (Asia, Middle East, South America, Africa, Australia,
  // UN agency procurement frameworks, European Union) are NOT service coverage
  // and must not be published as areaServed (blueprint §13/§26.5).
  areaServed: { "@type": "Country", name: "India" },
  knowsLanguage: ["en", "fr", "de", "es", "nl", "ar", "zh"],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Dispo-Concept",
  alternateName: "Dispo-Concept Private Limited",
  url: SITE_URL,
  inLanguage: ["en", "fr", "de", "es", "nl", "ar", "zh"],
  publisher: { "@id": `${SITE_URL}/#organization` },
};

/** Product catalogue — names/descriptions come from the verified English copy. */
const productListJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Dispo-Concept product families",
  itemListElement: PRODUCT_FAMILIES.map((family, i) => {
    const item = en.products.items[family.key];
    return {
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Product",
        name: item.name,
        description: item.short,
        url: `${SITE_URL}/#/products/${family.slug}`,
        image: `${SITE_URL}${family.image}`,
        brand: { "@type": "Brand", name: "Dispo-Concept" },
        category: "Medical consumables",
      },
    };
  }),
};

/** FAQ — mirrors the visible FAQ accordion on the homepage (en source of truth). */
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { question: en.faq.q1, answer: en.faq.a1 },
    { question: en.faq.q2, answer: en.faq.a2 },
    { question: en.faq.q3, answer: en.faq.a3 },
    { question: en.faq.q4, answer: en.faq.a4 },
    { question: en.faq.q5, answer: en.faq.a5 },
    { question: en.faq.q6, answer: en.faq.a6 },
    { question: en.faq.q7, answer: en.faq.a7 },
    { question: en.faq.q8, answer: en.faq.a8 },
  ].map(({ question, answer }) => ({
    "@type": "Question",
    name: question,
    acceptedAnswer: { "@type": "Answer", text: answer },
  })),
};

/** Named leadership — real people confirmed by management. */
const leadershipJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      item: {
        "@type": "Person",
        name: "Praveen H C",
        jobTitle: "Managing Director",
        worksFor: { "@id": `${SITE_URL}/#organization` },
      },
    },
    {
      "@type": "ListItem",
      position: 2,
      item: {
        "@type": "Person",
        name: "Prakash H C",
        jobTitle: "Director",
        worksFor: { "@id": `${SITE_URL}/#organization` },
      },
    },
  ],
};

export default async function Home() {
  const cookieStore = await cookies();
  const locale = toLocale(cookieStore.get(LOCALE_COOKIE)?.value);

  return (
    <>
      {[
        organizationJsonLd,
        websiteJsonLd,
        productListJsonLd,
        faqJsonLd,
        leadershipJsonLd,
      ].map((jsonLd, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            // "<" is escaped so no "</script>" sequence inside a string value
            // can break out of the JSON-LD block (defence-in-depth; the
            // payload is server-constructed data, never user input).
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
      ))}
      <Platform initialLocale={locale} />
    </>
  );
}
