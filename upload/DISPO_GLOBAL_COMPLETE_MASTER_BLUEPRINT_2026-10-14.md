# DISPO GLOBAL — MASTER WEBSITE & ENTERPRISE PLATFORM BLUEPRINT
## Dispo-Concept Private Limited | Copy-and-paste implementation specification
**Prepared:** 14 October 2026  
**Source basis:** Latest uploaded workspace archive, its source files and worklog, prior analysis of the published company website, and previously supplied DISPO Global blueprint.  
**Purpose:** One operational document for the website, content, design, product data, compliance gates, engineering, SEO, security, and staged enterprise growth.

---

# 0. READ THIS FIRST

This blueprint is intentionally evidence-led. It distinguishes what exists in the code, what the company has publicly stated, what management has supplied, and what still requires verification.

## Source precedence
When information conflicts, use this order:
1. Current signed/approved company, product, quality, regulatory and finance documents.
2. Current source-of-truth code/data and current repository files.
3. Current approved product catalogue, labels, technical files and certificates.
4. Public website content, treated as a published claim—not independent proof.
5. Historical worklog entries, treated as useful context but not necessarily a description of the exact uploaded archive.
6. Proposed copy in this blueprint.
7. Illustrative images and design references.

## Critical operating rules
- Do not invent manufacturing capacity, factories, staff, customers, testimonials, certifications, product specifications, export history, commercial performance or financial figures.
- Do not present the US$900 million ambition as current valuation, revenue, audited performance, a forecast, or a guaranteed outcome. The latest workspace's current management directive says no financial figures on the public website without explicit written approval. Keep numeric financial ambition out of public copy unless that directive is explicitly changed in writing.
- Do not say every listed product is manufactured in-house. The actual product register sets `supplyRoleVerified: false` for all seven families.
- Do not present the current generated/illustrative imagery as real facilities, employees, product photography, quality tests or manufacturing operations.
- Do not publish ISO 13485, CE, MDR, EO sterilisation, product-performance or regulatory-suitability claims without current product/entity/scope evidence and management approval.
- “Swiss-grade process discipline” is a company-stated methodology. It is not Swiss origin, Swiss certification, Swiss endorsement, or an independent quality accreditation.
- “Corridors of interest” do not prove exports, customers, contracts, regulatory approvals or established operations in those regions.
- A submitted RFQ is an enquiry, not an accepted order or a confirmed quotation.
- Treat all untrusted file uploads as potentially unsafe until malware scanning is implemented and verified.
- Do not call the platform enterprise-ready merely because it looks premium.

---

# 1. STRATEGIC BRIEF

## 1.1 Identity

**Legal/business name used in company materials:** Dispo-Concept Private Limited  
**Brand used by the current platform:** Dispo-Concept  
**Proposed platform descriptor:** DISPO Global (confirm the relationship between this brand and the legal entity before using it as a separate public-facing brand)  
**Current workspace tagline:** “Medical Essentials. Made with Purpose. Supplied with Discipline.”  
**Previously published tagline:** “Because Your Life Matters™”  
**Location stated in company materials:** Bengaluru, Karnataka, India  
**Website URL provided by the user:** `https://dispoconceptpvtltd.com/`  
**Business focus:** medical consumables, surgical and procedural products, product sourcing, institutional supply, and related product enquiries.

### Brand naming decision
The workspace currently uses “Dispo-Concept” in the logo, metadata, translations, structured data and assistant. Previous public content also uses “Because Your Life Matters™”. Decide whether:
- Dispo-Concept remains the corporate/product brand and DISPO Global is the platform descriptor; or
- DISPO Global becomes the approved outward-facing brand.

Do not alternate brand names arbitrarily across the logo, title tags, schema, domain, RFQ messages, policies, and email communications. Obtain management approval and apply the chosen naming system consistently.

## 1.2 Strategic positioning

**Positioning statement**

> Dispo-Concept helps healthcare buyers and institutional procurement teams explore medical consumable product families, communicate technical requirements, and initiate structured product and commercial enquiries.

**Brand promise**

> Medical essentials. Made with purpose. Supplied with discipline.

**Operating principle**

> Clear specifications. Documented decisions. Responsible claims.

The website should feel like a precise B2B medical-products platform—not a consumer e-commerce shop, a generic hospital website, or a company claiming capabilities it has not documented.

## 1.3 Long-term enterprise ambition

Management has discussed building a world-class medical-grade products manufacturing and supply enterprise. The earlier conversation referenced a US$900 million ambition; the latest workspace's source-of-truth directive is to publish no financial figures on the website without explicit written approval.

**Public-safe copy, if management approves qualitative vision:**

> Our ambition is to build a world-class medical-grade products manufacturing and supply enterprise from Bengaluru—developed discipline by discipline through product breadth, process rigour, documentation culture and market opportunities activated one verified step at a time.

Do not publish the US$900 million figure, fundraising amounts, margins, revenue, valuation or forecast numbers on the public website unless management changes the current written policy. If an internal strategy document retains the number, mark it “management-stated ambition—not current valuation, audited performance or forecast.”

---

# 2. WORKSPACE AUDIT — WHAT THE UPLOADED PROJECT CONTAINS

The latest archive contains a substantial Next.js application, not an empty template.

## 2.1 Technology stack observed
- Next.js 16 App Router.
- React 19.
- TypeScript 5.
- Tailwind CSS 4.
- shadcn/ui components and Radix UI primitives.
- Prisma 6.
- SQLite using a local database file in the current project.
- Zod validation.
- Framer Motion.
- `next-themes`.
- `next/image` and `sharp`.
- Bun package manager and scripts.
- A custom hash-based client-side router.
- Cookie-seeded locale selection and typed dictionaries.
- Public RFQ API and AI chat API.
- JSON-LD structured data, robots directives, sitemap, `llms.txt`, and `llms-full.txt`.

Do not replace this stack simply for visual reasons. Any architectural migration must include a reason, data migration plan, rollback plan, and tests.

## 2.2 Actual route architecture

The platform currently has one physical public page (`/`) and uses URL hashes for internal views. Examples:
- `/#/`
- `/#/products`
- `/#/products/surgical-gowns`
- `/#/capabilities`
- `/#/quality`
- `/#/industries`
- `/#/supply`
- `/#/sustainability`
- `/#/company`
- `/#/leadership`
- `/#/investors`
- `/#/vendors`
- `/#/rnd`
- `/#/careers`
- `/#/ai-tech`
- `/#/contact`
- `/#/rfq`
- `/#/rfq?product=surgical-gowns`
- `/#/privacy`
- `/#/terms`

The router is in `src/hooks/use-hash-route.ts`. The main renderer is `src/components/platform/platform.tsx`.

### SEO consequence
Hash views are not independent server-rendered pathname pages. Metadata and canonical tags currently describe the root URL; the sitemap only lists the root. Do not claim that each hash view is independently indexed like `/products` or `/quality`. A route-based SEO migration can be considered separately, with route mapping, canonical strategy, locale URLs, redirects, deep-link support, RFQ prefill, and regression testing.

## 2.3 Core project files

### App/configuration
- `src/app/page.tsx` — root application and JSON-LD.
- `src/app/layout.tsx` — global layout, locale cookie, fonts, metadata.
- `src/app/globals.css` — design tokens, theme rules, typography and animation.
- `next.config.ts` — Next.js settings and security headers.
- `package.json` and `bun.lock` — dependencies and scripts.
- `prisma/schema.prisma` — RFQ and audit models.
- `db/custom.db` — local SQLite database file (must never be published or committed with production data).
- `Caddyfile` — proxy/deployment configuration.
- `public/robots.txt`, `public/sitemap.xml`, `public/llms.txt`, `public/llms-full.txt`, `public/manifest.webmanifest`, `public/og-image.png`, icon assets.

### Content source files
- `src/content/products.ts` — product-family register, variants, unverified specification placeholders, related products, RFQ category types.
- `src/content/company.ts` — company facts and management review list. The uploaded archive contains this file, although the worklog also says it was removed as dead data in a cleanup pass. Verify actual imports and source-of-truth status before deleting or relying on it.
- `src/lib/i18n/config.ts` — locale list and labels.
- `src/lib/i18n/dictionaries/en.ts` — English source-of-truth dictionary.
- `src/lib/i18n/dictionaries/fr.ts`
- `src/lib/i18n/dictionaries/de.ts`
- `src/lib/i18n/dictionaries/es.ts`
- `src/lib/i18n/dictionaries/nl.ts`
- `src/lib/i18n/dictionaries/ar.ts`
- `src/lib/i18n/dictionaries/zh.ts`
- `src/lib/i18n/provider.tsx`
- `scripts/check-i18n.ts`

### Main platform components
- `src/components/platform/header.tsx`
- `src/components/platform/footer.tsx`
- `src/components/platform/platform.tsx`
- `src/components/platform/logo.tsx`
- `src/components/platform/language-selector.tsx`
- `src/components/platform/theme-toggle.tsx`
- `src/components/platform/rfq-form.tsx`
- `src/components/platform/product-card.tsx`
- `src/components/platform/elements-section.tsx`
- `src/components/platform/corridor-map.tsx`
- `src/components/platform/network-diagram.tsx`
- `src/components/platform/cinematic-carousel.tsx`
- `src/components/platform/dispo-inteligent.tsx`
- `src/components/platform/medical-artifacts.tsx`
- `src/components/platform/blocks.tsx`
- `src/components/platform/count-up.tsx`
- `src/components/platform/flags.tsx`

### Views
- `src/components/platform/views/home-view.tsx`
- `products-view.tsx`
- `product-detail-view.tsx`
- `capabilities-view.tsx`
- `quality-view.tsx`
- `industries-view.tsx`
- `supply-view.tsx`
- `sustainability-view.tsx`
- `company-view.tsx`
- `leadership-view.tsx`
- `investors-view.tsx`
- `vendors-view.tsx`
- `rnd-view.tsx`
- `careers-view.tsx`
- `ai-tech-view.tsx`
- `rfq-view.tsx`
- `legal-view.tsx`

### APIs
- `src/app/api/rfq/route.ts` — public write-only RFQ intake.
- `src/app/api/chat/route.ts` — grounded AI assistant endpoint.
- `src/lib/rfq-schema.ts` — shared form validation and upload limits.
- `src/lib/rate-limit.ts` — in-memory rate limiter.
- `src/lib/db.ts` — Prisma client setup.

## 2.4 Current language set

The current config has **seven locales**:
- English (`en`) — source of truth.
- French (`fr`).
- German (`de`).
- Spanish (`es`).
- Dutch (`nl`).
- Arabic (`ar`) — RTL.
- Simplified Chinese (`zh`).

The latest worklog reports dictionary parity across seven locales and 712 leaf keys after the latest audit. Re-run `bun scripts/check-i18n.ts` against the current tree to confirm. Earlier worklog sections refer to 711 keys, so treat the latest executable checker as authoritative.

**Known stale value:** `src/content/company.ts` still has `siteLocales: 6` even though the actual config contains seven locales. Correct or remove this field if it remains used. Avoid hardcoding locale counts in more than one place.

## 2.5 Current imagery in the archive

The uploaded archive includes these image families:
- `public/images/cinema-cleanroom.png`
- `public/images/cinema-gowns.png`
- `public/images/cinema-kits.png`
- `public/images/cinema-masks.png`
- `public/images/cinema-wraps.png`
- `public/images/cleanroom-production.png`
- `public/images/global-supply.png`
- `public/images/hero-manufacturing.png`
- `public/images/intel-automation.png`
- `public/images/intel-coordination.png`
- `public/images/intel-dispatch.png`
- `public/images/intel-inspection.png`
- `public/images/intel-testing.png`
- `public/images/packaging-supply.png`
- `public/images/product-caps.png`
- `public/images/product-custom-packs.png`
- `public/images/product-gowns.png`
- `public/images/product-masks.png`
- `public/images/product-procedure-kits.png`
- `public/images/product-shoe-covers.png`
- `public/images/product-sterilization-wrap.png`
- `public/images/quality-inspection.png`

The worklog states that generated/illustrative images were created for the brand. Unless each image is confirmed as an authentic company asset, label it as illustrative. The presence of a file named `cleanroom-production.png` or `quality-inspection.png` does not prove the company operates a cleanroom or performs that inspection process.

### Asset replacement policy
- Keep originals in a controlled archive.
- Replace generated hero, facility, production, product, and quality images with approved real photography when available.
- Store asset source, approval, product relation, date and usage.
- Use meaningful alt text for informational images.
- Use empty alt text for purely decorative images.
- Do not caption generated images as actual operations.
- The earlier `/gallery` URL returned 404 during review. Original gallery image URLs, filenames, captions and technical documents were not fully extracted. Do not claim that the gallery inventory is complete until the original assets are provided or the page becomes accessible.

---

# 3. VERIFIED / PUBLISHED COMPANY DATA

## 3.1 Company identity
- Name in the current code: Dispo-Concept.
- Legal name used in structured data and public content: Dispo-Concept Private Limited.
- Location: Bengaluru, Karnataka, India.
- Business area: medical consumables, surgical and procedural supplies, product sourcing and institutional supply.
- Current tagline in the platform: “Medical Essentials. Made with Purpose. Supplied with Discipline.”
- Previous public tagline: “Because Your Life Matters™.”
- Methodology language: “Swiss-grade process discipline,” explicitly a company-stated methodology, not Swiss certification, origin or endorsement.

## 3.2 Contact details collected from the public website
**Address published on the site:**
No. 103, Siddalingeshwara Complex, Kempapura Road, Chikkabanavara, Bangalore – 560 090, India.

**Telephone:**
- +91 7760319597
- +91 9901659444

**Email:**
- dispoconceptpvtltd@gmail.com

**Website provided by the user:**
- https://dispoconceptpvtltd.com/

Management must reconfirm these details and confirm whether the address is the registered office before the website uses that exact legal description. The current code/JSON-LD and the `llms.txt` file use different domain assumptions; see the critical issue register.

## 3.3 Leadership data in the current workspace
Management-confirmed in the company review register:
- Praveen H C — Managing Director.
- Prakash H C — Director.

The site currently has leadership narrative copy for both. Review all descriptive claims and biographies with the named individuals before publishing. Do not invent qualifications, employment history, certifications, board appointments, achievements or personal history.

Six additional executive mandates are presented as roles awaiting confirmed appointments:
1. Creative Director.
2. Business Director.
3. Overseas Director.
4. Regional Director.
5. General Manager.
6. Admin & Human Resources Officer.

These are mandate descriptions, not named people. Keep “appointment in progress” labels until the appointments are confirmed. Do not use invented faces or fake executive biographies.

## 3.4 Product and business audience register
Audiences stated in company content:
- Hospitals.
- Surgical centres.
- Distributors.
- Procurement teams.
- Government/institutional buyers.
- OEM and private-label partners.
- Wholesalers.
- International buyers.
- Technical and R&D collaborators.
- Vendors/suppliers.
- Strategic partners and investors.

## 3.5 Corridors of interest
Current company register:
- Asia.
- Middle East.
- South America.
- Africa.
- Australia.
- United Nations agency procurement frameworks.
- European Union.

These are **corridors of interest**, not proof of active export operations, contracts, regulatory approvals, customer relationships, local offices or distributor coverage. Use “areas of interest” in headings and explanatory copy. Do not treat United Nations agencies as a geographic region; describe them as a procurement framework/audience.

---

# 4. PRODUCT MASTER REGISTER — SEVEN PRODUCT FAMILIES

The actual source of truth is `src/content/products.ts`. Every family currently sets `supplyRoleVerified: false`. This means the public website must not claim in-house manufacturing for all products until management confirms each product's actual supply role.

## 4.1 Surgical Gowns
**Slug:** `surgical-gowns`  
**Image path:** `/images/product-gowns.png`  
**Listed variants:**
- Standard.
- Reinforced (BVB).
- Double-layer.

**Specifications currently unverified:** material, sizes, packaging, sterility, documentation, exact product performance, regulatory status, availability and manufacturing/supply role.

**Important:** The FAQ currently defines BVB as a second protective layer over the chest and sleeves. Confirm this exact construction and intended-use wording against the actual product technical file before publication.

## 4.2 Procedure Kits
**Slug:** `procedure-kits`  
**Image path:** `/images/product-procedure-kits.png`  
**Listed variants:**
- General.
- Delivery.
- Urology.
- Orthopaedic.
- Cardiac.

**Specifications currently unverified:** exact component list, dimensions, materials, packaging, sterility, documentation, availability and supply role.

## 4.3 Medical Face Masks
**Slug:** `face-masks`  
**Image path:** `/images/product-masks.png`  
**Listed variants:**
- 2-ply.
- 3-ply.

**Specifications currently unverified:** materials, intended use, performance, filtration, applicable standards, packaging, documentation, availability and supply role.

Do not infer medical efficacy or filtration performance from “2-ply” or “3-ply”.

## 4.4 Medical Caps
**Slug:** `medical-caps`  
**Image path:** `/images/product-caps.png`  
**Specifications currently unverified:** variants, material, dimensions/sizes, colours, packaging, documentation, availability and supply role.

## 4.5 Shoe Covers
**Slug:** `shoe-covers`  
**Image path:** `/images/product-shoe-covers.png`  
**Specifications currently unverified:** material, dimensions, grip properties, packaging, documentation, availability and supply role.

## 4.6 Sterilisation Wraps
**Slug:** `sterilization-wraps`  
**Image path:** `/images/product-sterilization-wrap.png`  
**Specifications currently unverified:** material, dimensions, sterilisation compatibility, packaging, documentation, availability and supply role.

Do not say that every wrap is compatible with every sterilisation method.

## 4.7 Custom Procedural Packs
**Slug:** `custom-packs`  
**Image path:** `/images/product-custom-packs.png`  
**Specifications currently unverified:** available configurations, component lists, materials, packaging, sterility, documentation, availability and supply role.

Custom configuration should be described as subject to feasibility, specification, packaging, validation and order review—not as an unconditional promise to meet any requested configuration.

## 4.8 Product data model
For every SKU or variant, collect:
- Internal SKU / product code.
- Approved public name.
- Product family and variant.
- Actual supply role: manufactured in-house / partner-produced / sourced / distributed / other.
- Material and construction.
- Dimensions and sizes.
- Packaging quantity and configuration.
- Sterile/non-sterile status.
- Sterilisation method and product-specific evidence, if applicable.
- Intended use and regulatory classification, reviewed by qualified personnel.
- Applicable standards and test reports.
- Storage and shelf-life, where applicable.
- Approved product photographs.
- Markets in which the product may be supplied.
- Minimum order quantity and lead time, internal only unless approved.
- Documentation owner, approval date and revision.
- Availability state and last review date.

Never fill null values with guesses. In the UI, render “Confirm with our team” or a translated equivalent for unverified fields.

---

# 5. BUYER JOURNEYS AND CONVERSION GOALS

## 5.1 Hospital / surgical centre
Needs: product fit, procedure pack contents, technical specifications, packaging, sterility, documents, quantities, delivery and commercial terms.
Path: Home → Products → Product detail → RFQ.

## 5.2 Institutional procurement
Needs: accurate catalogue, legal entity information, documentation, supplier onboarding and structured quotations.
Path: Home → Capabilities / Quality → Products → RFQ.

## 5.3 Distributor / wholesaler
Needs: product range, supply role, commercial fit, market eligibility, documentation and availability.
Path: Home → Products → Global Supply → RFQ.

## 5.4 OEM / private label
Needs: technical review, product configuration, confidentiality, ownership, feasibility, quality agreement and commercial scope.
Path: Home → Capabilities → R&D → RFQ.

## 5.5 Government / tender buyer
Needs: legal entity records, product eligibility, certificates, technical compliance, supply capacity and tender documents.
Path: Company / Quality → RFQ. Do not claim tender eligibility or previous awards without evidence.

## 5.6 Vendor / supplier
Needs: supplier expectations, onboarding, documentation and a clear contact route.
Path: Vendors → Supplier enquiry.

## 5.7 Strategic partner / investor
Needs: business model, execution priorities, governance, risks and approved information.
Path: Company / Investors → approved contact route. No financial claims, solicitation or guarantees on the public site.

## 5.8 Primary website conversions
1. **Explore Products**.
2. **Submit an RFQ**.
3. **Request Product Documentation**.
4. **Discuss a Custom Requirement**.
5. **Contact the Team**.

Every view should have one clear primary action. Avoid multiple competing buttons with equal visual priority.

---

# 6. INFORMATION ARCHITECTURE

| View | Current hash route | Purpose | Main action |
|---|---|---|---|
| Home | `/#/` | Brand and catalogue orientation | Explore products / RFQ |
| Products | `/#/products` | Search/filter seven families | View product |
| Product detail | `/#/products/{slug}` | Variants, specs, related products | Request quotation |
| Capabilities | `/#/capabilities` | Actual manufacturing/supply/sourcing model | Discuss requirements |
| Quality | `/#/quality` | Quality processes and documents | Request documentation |
| Industries | `/#/industries` | Buyer-specific routes | Find your pathway |
| Global Supply | `/#/supply` | Corridors of interest and market enquiry | Discuss a market |
| Sustainability | `/#/sustainability` | Responsible-operations programme | Discuss requirements |
| Company | `/#/company` | Identity, method and direction | Contact |
| Leadership | `/#/leadership` | Named leaders and open mandates | Learn about governance |
| Investors | `/#/investors` | Public-safe strategic narrative | Request a discussion |
| Vendors | `/#/vendors` | Supplier fit and onboarding | Supplier enquiry |
| R&D | `/#/rnd` | Technical collaboration | Discuss a project |
| Careers | `/#/careers` | Approved roles only | Careers enquiry |
| AI & Technology | `/#/ai-tech` | Responsible technology posture | Learn more |
| Contact | `/#/contact` | Contact pathways | Contact team |
| RFQ | `/#/rfq` | Structured quotation request | Submit RFQ |
| RFQ with product | `/#/rfq?product={slug}` | Prefilled product enquiry | Submit RFQ |
| Privacy | `/#/privacy` | Privacy notice | Contact privacy owner |
| Terms | `/#/terms` | Terms | None |

---

# 7. NAVIGATION AND SHARED COMPONENTS

## Header
- Brand/logo.
- Main links: Company, Products, Capabilities, Quality, Industries, Global Supply, Sustainability.
- Visible RFQ CTA.
- Seven-language selector.
- Light/dark theme toggle.
- Accessible mobile sheet/drawer.
- Active state and visible keyboard focus.
- No hover-only interaction.

## Footer
- Approved brand name and tagline.
- Short factual company description.
- Product family links.
- Company/capabilities/quality/supply links.
- Leadership, Vendors, R&D, Investors, Careers, AI & Technology links.
- Approved contact details.
- Privacy and Terms.
- Image disclaimer while illustrative images remain.
- Legal entity identity.

## Shared components already present
Preserve and improve:
- `Header`
- `Footer`
- `Platform`
- `Logo`
- `LanguageSelector`
- `ThemeToggle`
- `RfqForm`
- `ProductCard`
- `ElementsSection`
- `CorridorMap`
- `NetworkDiagram`
- `CinematicHeroCarousel`
- `DispoInteligent`
- `MedicalArtifacts`
- `Blocks`
- `CountUp`
- `Flags`

Do not create duplicate implementations of components that already work.

---

# 8. HOMEPAGE — COPY-READY CONTENT BLUEPRINT

The homepage should tell a qualified buyer what the company does, which products are listed, what information is confirmed, and how to enquire.

## Section 1 — Cinematic hero

**Eyebrow:** MEDICAL-GRADE ELEMENTS · MANUFACTURING & SUPPLY · BENGALURU, INDIA

**Headline:**
Medical essentials.  
Made with purpose.  
Supplied with discipline.

**Supporting copy:**
Dispo-Concept is building a medical-grade products and supply enterprise from Bengaluru. Explore our listed surgical and procedural product families, review available information, and share your requirements for technical and commercial review.

**Primary CTA:** Explore Products  
**Secondary CTA:** Submit an RFQ  
**Tertiary text link:** Discover the process methodology

**Visual:** Use a restrained cinematic carousel. Every generated image must retain an “Illustrative image — not a photograph of company facilities” label. Add pause/play control, keyboard access, and reduced-motion support. Do not imply that generated people, equipment or premises are real company assets.

## Section 2 — Vitals / orientation

Use four truthful orientation facts:
- 7 product families listed in the current catalogue register.
- 7 strategic corridors of interest.
- 7 proposed/defined quality gates in the current website narrative (confirm they are implemented SOPs before describing them as operationally verified).
- 7 platform languages.

Label them as catalogue/platform facts, not production output, revenue, customer count, certification count, or export performance.

**Heading:** The essentials, at a glance.  
**Note:** Verifiable facts about our catalogue, platform and process—stated plainly because they can be checked.

## Section 3 — Company introduction

**Heading:** A manufacturing enterprise in the making.

**Copy:**
Dispo-Concept Private Limited is a Bengaluru-based medical-products business focused on medical consumables, surgical and procedural supplies, product sourcing and institutional supply. Our digital platform is designed to make product discovery, specification questions and commercial enquiries easier to navigate.

**CTA:** Discover the Company

Do not say “we manufacture every listed product” until the supply role has been verified family by family.

## Section 4 — Product explorer

**Heading:** Products & Elements  
**Intro:** Explore the seven product families currently listed in our catalogue. Technical specifications, supply role, documentation, availability and order requirements are confirmed for the product and enquiry.

Cards:
1. Surgical Gowns.
2. Procedure Kits.
3. Medical Face Masks.
4. Medical Caps.
5. Shoe Covers.
6. Sterilisation Wraps.
7. Custom Procedural Packs.

Each card contains:
- Approved family name.
- Short factual description.
- Authentic approved product image or explicit illustrative label.
- “View details” CTA.
- No invented material, dimensions, performance or sterility values.

## Section 5 — Human judgement and technology

**Heading:** Human judgement, supported by technology.

**Copy:**
Technology can support repeatability, information organisation and operational coordination. It does not replace human judgement, safety review, product-specific documentation or accountable decision-making.

**CTA:** Our Technology Posture

## Section 6 — Quality gates

**Heading:** Quality is a process, not a badge.

The current site narrative has seven gates:
1. Requirement intake.
2. Specification review.
3. Supply-role and feasibility confirmation.
4. Documentation review.
5. Order-specific confirmation.
6. Supply and packaging coordination.
7. Dispatch and follow-through.

**Important:** These are a proposed process framework until management provides the approved SOPs and evidence that each gate is implemented. Do not call them certified procedures or a validated quality management system without proof.

**Creative note:** “Every gate closes with a record. Nothing moves on memory—if it is not documented, it did not happen.” Publish this as an operating principle only if management confirms it accurately describes practice.

## Section 7 — Strategic corridors

**Heading:** Seven corridors of interest. One disciplined approach.

List:
- Asia.
- Middle East.
- South America.
- Africa.
- Australia.
- UN agency procurement frameworks.
- European Union.

**Copy:**
These are strategic corridors of interest, not a statement of established exports, contracts or market approvals. Product eligibility, documentation, distribution and supply feasibility are confirmed for each enquiry.

**CTA:** Discuss a Market

## Section 8 — Network

**Heading:** Built around the right working relationships.

Show a conceptual network connecting:
- Hospitals and surgical centres.
- Institutional procurement.
- Distributors and wholesalers.
- OEM/private-label partners.
- Suppliers.
- Technical collaborators.

Do not use customer logos or named partners without written permission and evidence of the relationship.

## Section 9 — Buyer pathways

Five cards:
- Hospitals & Surgical Centres.
- Institutional Procurement.
- Distributors & Wholesalers.
- OEM & Private Label.
- R&D & Technical Collaboration.

Each explains what information to prepare and routes to the appropriate enquiry path.

## Section 10 — Methodology

**Heading:** Swiss-grade process discipline—as a methodology.

**Copy:**
Our stated methodology emphasises structured requirements, disciplined documentation and clear confirmation before commitments are made. “Swiss-grade” describes a company-stated method; it does not claim Swiss origin, Swiss certification or endorsement by a Swiss organisation.

Avoid Swiss flags, official-looking certification seals or design that implies independent accreditation.

## Section 11 — FAQ

The current home view includes an eight-question FAQ. Keep answers aligned to verified content and review them against the product register:
1. Do you publish prices, MOQs or lead times?
2. How does the quotation process work?
3. Which products do you manufacture and supply?
4. What does reinforced (BVB) mean for surgical gowns?
5. Do you hold ISO 13485 or CE certification?
6. Which markets do you serve?
7. Can you configure custom procedure packs?
8. Where are you located and how can we reach you?

**Required correction:** The current English FAQ contains claims that need review:
- “Which products do you manufacture and supply?” says the company manufactures and supplies, while every product family currently has `supplyRoleVerified: false`.
- The BVB construction definition must match the actual product technical file.
- “Seven quality gates” should be described as a verified operating process only after approved SOPs are available.
- The custom-pack answer promises a configuration pathway; clarify that feasibility, validation, materials, packaging, regulatory status, MOQ and lead time are confirmed before commitment.
- Certification answers must remain cautious and document-led.
- The address must not be labelled “registered office” until verified.

## Section 12 — RFQ band

**Heading:** Start with the requirement.

**Copy:**
Tell us your organisation, product category, destination market, estimated quantity and technical or packaging requirements. The team can review the enquiry and confirm the information needed for the next step.

**Primary CTA:** Submit an RFQ  
**Secondary CTA:** Explore Products

## Section 13 — Footer

Keep the contact, brand, product links, legal links and language/theme controls consistent. Include the illustrative-image disclaimer until approved real photography replaces generated assets.

---

# 9. PRODUCT DETAIL PAGE TEMPLATE

Use one reusable template for every product family.

1. Breadcrumb.
2. Product family title.
3. One-paragraph summary.
4. Approved product image, with accurate alt text and illustrative label if needed.
5. Listed variants.
6. Specification table.
7. Documentation note.
8. Availability and supply-role note.
9. Related product families.
10. Product-specific RFQ CTA.
11. Clear statement that an enquiry is not an order or confirmed quotation.

**Reusable specification note:**

> Specifications shown here are limited to currently approved information. Material, dimensions, packaging, sterility, documentation, supply role and availability must be confirmed for the specific product and order.

**CTA:** Request a Quotation

**RFQ note:**

> Submitting an RFQ starts a review. It does not constitute order acceptance, a confirmed quotation, regulatory approval or a guarantee of availability.

---

# 10. CAPABILITIES PAGE

**Title:** Capability begins with clarity.

**Intro:**
Medical product requirements may involve product selection, specifications, sourcing, customisation, documentation, packaging, delivery and destination-market considerations. Our enquiry process is designed to clarify the requirement and identify what must be reviewed before a commitment is made.

Suggested content areas:
- Product supply and sourcing model.
- Catalogue and specification review.
- Custom-pack requirements.
- Documentation coordination.
- Institutional procurement engagement.
- Order and delivery coordination.
- Technical collaboration.

**Management evidence required:**
- Which activities are performed in-house.
- Which activities are outsourced or partner-delivered.
- Verified facilities and processes.
- Actual manufacturing equipment and capability.
- Production capacity and lead times, if approved.
- Quality controls and their documented SOPs.
- Sterilisation and packaging arrangements.
- Minimum quantities and markets, if approved for public use.

Do not publish a factory tour, capacity metric or process diagram that depicts an operation not verified to exist.

---

# 11. QUALITY & CONFORMITY PAGE

**Title:** Quality & Conformity

**Intro:**
Medical-product procurement depends on accurate specifications and appropriate documentation. Requirements vary by product, intended use, destination market and order. Relevant product documentation and conformity information should be confirmed against the item being considered.

Suggested sections:
1. Product specifications.
2. Incoming materials and supplier controls—only if documented.
3. In-process checks—only if documented.
4. Finished-product inspection—only if documented.
5. Document control and traceability—only if implemented.
6. Product-specific sterility status.
7. Complaints and corrective action—only if implemented.
8. Certificates and regulatory statements, only after verification.
9. Customer documentation requests.

## Certification publication gate
Before publishing ISO 13485, CE, MDR, EO sterilisation or other regulatory statements, confirm:
- Certificate holder.
- Legal entity and facility covered.
- Exact scope.
- Issuing/conformity-assessment body.
- Validity dates.
- Product coverage.
- Applicable markets and intended use.
- Permission to use any logo/seal.
- Exact wording approved by management and qualified regulatory counsel.

A certificate for one entity, facility or product does not prove that every product is covered. Never use expired or out-of-scope documents.

---

# 12. INDUSTRIES PAGE

**Title:** Product enquiries for different procurement contexts.

Create separate pathways for:
- Hospitals and surgical centres.
- Institutional and group procurement.
- Distributors and wholesalers.
- OEM/private-label partners.
- Government and tender buyers.
- International buyers.
- Technical collaborators.

For each pathway, describe the information a buyer should prepare. Do not claim tender eligibility, procurement awards, market access, existing customers or regulatory suitability without evidence.

---

# 13. GLOBAL SUPPLY / NETWORK PAGE

**Title:** A disciplined approach to market enquiries.

**Copy:**
Dispo-Concept identifies Asia, the Middle East, South America, Africa, Australia, UN agency procurement frameworks and the European Union as strategic areas of interest. Product availability, import requirements, regulatory eligibility, distribution arrangements and delivery feasibility must be confirmed for each opportunity.

Show:
- A conceptual map labelled “corridors of interest.”
- A market-enquiry checklist.
- Destination-country documentation review.
- Importer/distributor enquiry pathway.
- Product-specific feasibility review.

Never imply:
- Current exports to all listed regions.
- UN supplier registration, endorsement or awards without proof.
- EU market authorisation without applicable evidence.
- Existing contracts, warehouses, local offices, inventory or distributors without proof.

**Structured-data warning:** The current JSON-LD uses `areaServed` for corridor areas of interest. This can imply current service coverage. Replace it with a more accurate description or omit unverified regions until actual coverage is confirmed.

---

# 14. SUSTAINABILITY PAGE

**Title:** Responsible operations, measured honestly.

Use six pillars as a proposed framework, not as claims of achieved results:
1. Material efficiency.
2. Waste reduction.
3. Packaging review.
4. Energy and resource awareness.
5. Responsible supplier engagement.
6. Measurement and improvement.

**Copy:**
Environmental claims should be supported by evidence. Priorities, baselines, measurement methods, responsibilities and targets should be documented before quantified claims are made.

Do not claim carbon neutrality, zero waste, verified emissions reductions, formal ESG certification or environmental benefits without measurements and supporting evidence.

---

# 15. COMPANY PAGE

**Title:** Dispo-Concept Private Limited

**Copy:**
Dispo-Concept is a Bengaluru-based medical-products business focused on medical consumables, surgical and procedural supplies, product sourcing and institutional supply. The DISPO platform brings product discovery and structured commercial enquiries together in one place.

**Our focus**
- Medical-grade products and consumables.
- Surgical and procedural supplies.
- Product sourcing and institutional supply.
- Long-term B2B supply relationships.

**How we work**
- Enquiries receive a submission reference.
- Product specifications, availability and supply roles are confirmed per order.
- Customer drawings, pricing and records are treated as confidential business information, subject to the actual implemented privacy and security controls.

Use only approved company history, ownership, facility, leadership and capability facts.

---

# 16. LEADERSHIP & GOVERNANCE PAGE

**Title:** The people behind the discipline.

### Named leaders
- **Mr. Praveen H C — Managing Director.** Focus in current content: strategy, product direction and partnerships.
- **Mr. Prakash H C — Director.** Focus in current content: operations, supply coordination and execution.

Management has marked the names/roles as confirmed. The detailed bios in `en.ts` include broad operational claims and should be reviewed by each named person before public release. Do not publish invented qualifications or achievements.

### Six open mandates
- Creative Director.
- Business Director.
- Overseas Director.
- Regional Director.
- General Manager.
- Admin & Human Resources Officer.

Use “Executive appointment in progress” for unfilled roles. These are mandates, not people. Do not invent names, photographs, credentials or biographies.

### Governance principles
The current page uses themes such as precision, documentation, accountability and human oversight. Present them as company principles, not third-party certifications.

**Visual caution:** The leadership view imports a `SwissSeal` component. Audit the rendered artwork so it cannot be mistaken for an official Swiss certification, government seal, accreditation or endorsement.

---

# 17. INVESTORS & STRATEGIC PARTNERS PAGE

The existing workspace has an investor view. Keep it high-level, evidence-led and non-promissory.

## Public-safe content
- Business focus and catalogue.
- Long-term qualitative ambition.
- Execution priorities.
- Strategic risks.
- Governance principles.
- Controlled engagement process.

## Five execution pillars
1. Product and technical evidence.
2. Manufacturing/sourcing and quality capability.
3. Institutional customer development.
4. Market and regulatory readiness.
5. Governance, systems and capital discipline.

## Public content restrictions
- No prices, MOQs, stock levels, lead-time promises or financial figures.
- No unapproved ₹20 crore fundraising content.
- No valuation, margin, revenue, EBITDA, forecasts, returns or investment promises.
- No financial scenarios unless a separate written approval explicitly changes the current policy.
- Any confidential investor materials must use a management-approved controlled sharing process and appropriate legal review.

**Disclaimer:**
Information on the website is general, may be incomplete and is not an offer to sell securities, a solicitation to invest, a forecast or a guarantee of return.

---

# 18. VENDORS & SUPPLIERS PAGE

**Title:** Supplier and vendor engagement.

**Copy:**
We welcome relevant supplier enquiries where products, materials, services, documentation and operating practices fit the company's requirements. Submission of an enquiry does not constitute supplier approval.

Suggested supplier intake:
- Legal entity and contact.
- Product/service category.
- Country and operating location.
- Product specifications.
- Quality and conformity documents, where applicable.
- Capacity and lead-time evidence, if relevant.
- Traceability and change-control information, where applicable.
- References where appropriate and consented.

**CTA:** Submit a Supplier Enquiry

---

# 19. R&D & TECHNICAL COLLABORATION PAGE

**Title:** Technical requirements. Structured collaboration.

**Copy:**
Technical discussions may cover product configuration, materials, packaging, documentation and potential development requirements. Each collaboration begins with a clear description of the requirement, technical constraints, evidence needs, ownership and confidentiality.

Suggested workflow:
1. Define the problem and intended application.
2. Share available specifications or drawings through an approved secure channel.
3. Confirm feasibility, confidentiality and ownership.
4. Agree review and validation steps before commitment.

Do not claim proprietary laboratories, validated testing capabilities, patents or clinical evidence unless documented.

---

# 20. CAREERS PAGE

Publish only management-approved roles.

Include:
- Company overview.
- Working principles.
- Approved vacancies.
- Internship/placement opportunities only when available.
- Application contact.
- Privacy notice.

Do not invent headcount, employee benefits, culture awards, hiring status or employment promises.

---

# 21. TECHNOLOGY & AI PAGE

**Title:** Technology with human accountability.

Describe only real, approved uses. Suitable themes may include information organisation, workflow support and enquiry coordination if actually used.

State boundaries clearly:
- Technology does not replace clinical judgement.
- No claim of autonomous medical decision-making.
- No patient-data processing claim unless that processing occurs and is governed.
- No proprietary AI claim without evidence.
- Human review remains accountable for consequential decisions.

---

# 22. DISPO INTELIGENT — AI ASSISTANT

The current workspace includes:
- UI component: `src/components/platform/dispo-inteligent.tsx`.
- API endpoint: `POST /api/chat`.
- Z-AI SDK integration.
- Server-side system prompt.
- Input schema: message up to 1,000 characters; history up to 12 user/assistant turns.
- In-memory rate limit documented as 12 requests per minute per network key.
- GET/PUT/DELETE return 405.
- Error responses avoid exposing internal SDK details.
- Assistant should answer in English, French, German, Spanish, Dutch, Arabic or Chinese.
- It should not quote prices, MOQs, stock, lead times, certifications, capacity or financial figures.
- It should route official quotations to the RFQ process.
- Chat UI is intended to be a modal dialog with focus trap, Escape handling, focus restoration and reduced-motion support.
- The fact bubble appears on an interval while the panel is closed; it should stop after user dismissal/opening and not run while the browser tab is hidden.

## AI content-governance issues to fix
The current system prompt calls several facts “verified” while also saying the company manufactures and supplies, has a documentation-first operating model, and has seven defined quality gates. These are not all proven by the current product register:
- Every product family has `supplyRoleVerified: false`.
- The seven quality gates appear in website content but must be backed by approved SOPs before being described as verified operational practice.
- The current system prompt repeats contact information and market claims; these must match the approved contact/source-of-truth record.
- The prompt says “medical-grade elements manufacturing and supplying enterprise” as a fact; use a more careful “medical-products business focused on…” formulation until management evidence supports stronger wording.

## AI security and privacy requirements
- Keep the system prompt server-side; never accept persona/system instructions from the client.
- Keep input and history limits.
- Rate-limit using shared infrastructure before scaling beyond one runtime instance.
- Consider an explicit request-body size limit and abuse monitoring.
- Ensure the privacy notice discloses that messages are sent to the configured AI provider, if applicable.
- Do not send customer RFQ attachments, confidential drawings or personal data to the assistant unless an approved data-processing and privacy design explicitly allows it.
- Do not log chat content or personal data.
- Ensure rate-limit errors are localised.
- Keep the assistant's response grounded and direct users to RFQ for commercial commitments.

---

# 23. RFQ FORM, DATABASE AND COMMERCIAL WORKFLOW

## 23.1 Existing fields
The RFQ form/schema includes:
- Organisation.
- Contact name.
- Email.
- Optional phone.
- Country.
- Buyer type.
- Product category.
- Optional product code.
- Quantity.
- Technical requirements.
- Optional packaging requirements.
- Delivery timeframe.
- Optional attachment.
- Consent.
- Locale.

Buyer types:
- Hospital.
- Distributor.
- Group.
- OEM.
- Wholesaler.
- International.
- Other.

Product category values:
- gowns.
- kits.
- masks.
- caps.
- shoeCovers.
- wraps.
- customPacks.
- other.

Delivery options in the code:
- Discuss.
- 4 weeks.
- 1–3 months.
- Project-based.

These are form options, not promises that any delivery timeframe is feasible.

## 23.2 Current API behaviour documented in code
- `POST /api/rfq` is the public write endpoint.
- GET, PUT and DELETE return 405.
- Server-side Zod validation is authoritative.
- Same-origin `Origin` check rejects cross-origin submissions.
- In-memory rate limit: 5 submissions per hour per network key.
- Salted SHA-256 key; raw IP is not intentionally stored.
- Honeypot and minimum fill-time checks; bot submissions are silently dropped with a fake success response.
- Schema validation occurs before filesystem write.
- Attachment cap is 10 MB.
- Allowed extensions include PDF, PNG, JPG/JPEG, DWG, DXF, STEP/STP, XLSX and DOCX.
- Magic-byte checks exist for PDF, PNG, JPG/JPEG; several other allowed types are accepted by extension only.
- Attachments are stored outside the public web root under randomized UUID filenames and file mode 0600 where supported.
- Original filename is discarded.
- RFQ and audit events are stored in Prisma.
- Database-write failure triggers removal of the just-written attachment.
- Operational logs avoid form contents and filenames.
- No public RFQ read endpoint exists.
- Status pipeline in schema comments: `NEW → QUALIFICATION → TECHNICAL_REVIEW → QUOTATION → NEGOTIATION → WON/LOST`, with `FOLLOW_UP` as needed.

## 23.3 Residual RFQ risks
- No malware-scanning daemon is currently available in the documented environment.
- Some allowed attachment types have no reliable magic-byte validation.
- In-memory rate limiting does not coordinate across instances and resets on restart.
- SQLite is not ideal for high-concurrency, multi-instance production.
- Email/CRM notifications are not assumed to exist; management approval is required.
- Internal RFQ review needs authentication, role-based authorisation, audit trails, secure attachment access and retention controls before any admin console is created.
- Production success message/response reference must never be shown before the server confirms a stored submission.
- Same-origin logic must be verified behind the actual production proxy.
- Check request body size limits at the reverse proxy and application layer.

## 23.4 Recommended staged production hardening
Before material scale:
1. Managed PostgreSQL.
2. Shared rate limiting (e.g., managed Redis or equivalent).
3. Private object storage with malware scanning and strict access control.
4. Authenticated internal RFQ console or approved CRM integration.
5. Role-based access, audit trails and record-retention rules.
6. Monitoring, alerting, backups and restore drills.
7. Documented email/CRM integration and privacy approval.
8. Tested disaster recovery.

Do not silently replace SQLite or migrate data. Make a written migration plan and verify data integrity.

---

# 24. DESIGN SYSTEM

The current CSS establishes a clinical, technical and premium visual system. Use semantic CSS variables rather than hardcoded colours in components.

## 24.1 Palette

| Token | Value | Purpose |
|---|---|---|
| Brand Navy | `#0B1726` | Deep brand surfaces/headings |
| Deep Navy 2 | `#14283D` | Secondary dark surfaces |
| Engineering Blue | `#243D54` | Technical diagrams and accents |
| Clinical Teal | `#087E8B` | Primary accent |
| Signal Teal | `#11A6A0` | Interaction emphasis |
| Pale Teal | `#73D8CD` | Highlight/focus accent |
| Steel | `#66788A` | Secondary metadata |
| Graphite | `#344454` | Secondary body text |
| Champagne Titanium | `#B89A62` | Sparse decorative accent only |
| Light Background | `#F5F8FA` | Light page surface |
| Border | `#E4EBF0` | Hairline borders |
| Swiss accent token | `#DA291C` | Must not imply official Swiss accreditation or certification |

The dark theme uses overrides in `src/app/globals.css`. Preserve them. Champagne is not a default body-text colour; maintain WCAG AA contrast.

## 24.2 Typography
Current font setup:
- Manrope — display/headings.
- Inter — body and controls.
- IBM Plex Mono — technical labels and data-like text.
- Noto Sans Arabic — Arabic.
- Noto Sans SC — Simplified Chinese.

Do not add extra fonts without a strong brand/performance reason.

## 24.3 Visual language
- Clinical precision.
- Editorial hierarchy.
- Structured grids.
- Generous whitespace.
- Restrained glass effects.
- Hairline borders.
- Consistent card radius.
- Authentic product imagery.
- Quiet, useful motion.
- No fake trust marks.
- No fake client logos.
- No unverified statistics.
- No decorative effects that reduce product clarity.

## 24.4 Motion and accessibility
- Respect `prefers-reduced-motion`.
- Provide carousel pause/play.
- Do not animate essential text continuously.
- Avoid autoplay audio.
- Make every action keyboard accessible.
- Ensure focus is visible.
- Support touch targets around 44×44 CSS pixels where practical.
- Test RTL icon direction and logical layout.
- Avoid horizontal overflow at 390, 768, 1024 and 1440 pixels.

---

# 25. INTERNATIONALISATION

Seven locale dictionaries are present:
- `en`
- `fr`
- `de`
- `es`
- `nl`
- `ar`
- `zh`

Rules:
1. English dictionary is the source of truth.
2. Use `bun scripts/check-i18n.ts` after changes.
3. Check exact key parity, empty strings, duplicate keys and placeholder token drift.
4. Preserve protected product terms such as BVB, 2-ply, 3-ply, ISO 13485, CE and RFQ where required by the approved terminology guide.
5. Arabic requires `lang="ar"`, `dir="rtl"`, logical CSS properties, correct punctuation direction and real mobile testing.
6. Simplified Chinese requires the Noto Sans SC font and natural business/medical terminology.
7. Review French, German, Spanish, Dutch, Arabic and Chinese with qualified reviewers before claiming professional/native review.
8. Do not publish false locale-specific SEO URLs or `hreflang` links while all content is served through hash routes and a locale cookie.
9. Fix `siteLocales: 6` in `src/content/company.ts` if retained, because current locale config contains seven.
10. Ensure product names and RFQ categories use the same terminology across all seven dictionaries.

---

# 26. SEO, AI SEARCH AND STRUCTURED DATA

## 26.1 Current features in the archive
- Locale-aware `generateMetadata()` in `src/app/layout.tsx`.
- Canonical metadata currently points to the root URL.
- Open Graph and Twitter card metadata.
- Googlebot preview directives.
- Organization JSON-LD.
- WebSite JSON-LD.
- Product-family ItemList JSON-LD.
- FAQPage JSON-LD.
- Leadership/person ItemList JSON-LD.
- `robots.txt` with AI crawler directives.
- `llms.txt`.
- `llms-full.txt`.
- `sitemap.xml`.
- `manifest.webmanifest`.
- `og-image.png` and icon assets.

## 26.2 Critical domain mismatch
The user-provided website is `https://dispoconceptpvtltd.com/`. The current `public/llms.txt` contains links to `https://dispo-concept.com/`, and the JSON-LD uses `NEXT_PUBLIC_SITE_URL` with a local development fallback. These must not be mixed in production.

**Required fix:**
1. Management confirms the single canonical production domain.
2. Set `NEXT_PUBLIC_SITE_URL` to that exact HTTPS domain in production.
3. Update all `llms.txt` and `llms-full.txt` links.
4. Use absolute canonical URLs and absolute sitemap locations.
5. Verify Open Graph URLs and JSON-LD URLs.
6. Redirect any secondary domain only if management controls it and the redirect strategy is approved.
7. Do not invent a domain or assume that `dispo-concept.com` belongs to the company.

## 26.3 Sitemap issue
The current `public/sitemap.xml` contains a relative `<loc>/</loc>`. Sitemap URL locations should be absolute. Fix the sitemap to use the approved absolute canonical domain. While the site remains hash-routed, list only URLs that represent actual crawlable documents; do not pretend each hash route is a separate pathname.

## 26.4 Robots issue
The current `robots.txt` allows a number of AI crawlers and points to `/sitemap.xml`. Review the exact production sitemap URL and ensure `Disallow: /api/` is appropriate. `robots.txt` is not access control; private endpoints must remain protected by the application.

## 26.5 JSON-LD issues
- Organization structured data uses legal name, address, phone/email, languages and `areaServed`.
- Product list uses product names/descriptions and image paths.
- FAQ schema mirrors the visible FAQ.
- Person/leadership data appears in an ItemList.

Before production:
- Ensure organization name/legal name are approved.
- Confirm the address before marking it as registered office.
- Do not use `areaServed` for regions that are merely areas of interest; use accurate descriptive language or omit unverified coverage.
- Do not describe the company as a manufacturer for every family while `supplyRoleVerified` is false.
- Ensure all product descriptions are accurate and do not contain unverified performance/sterility claims.
- Keep the FAQ JSON-LD identical in substance to visible content.
- Remove unsupported or misleading person data and do not invent biographies.
- Confirm that the logo URL and image URLs resolve on the production domain.
- Ensure all canonical, Open Graph and JSON-LD URLs use the same approved host.

## 26.6 Hash-routing SEO limitation
The current SPA can be shareable, but `/#/products` is not equivalent to a separately rendered `/products` page. The sitemap contains only the root. For a future route-based SEO upgrade:
- Implement true App Router paths.
- Add per-page server metadata.
- Add locale-specific route strategy.
- Define canonical and `hreflang` correctly.
- Add valid sitemap entries.
- Preserve product-specific RFQ prefill.
- Preserve theme/language behaviour.
- Add redirects and regression tests.
Do this as a planned migration, not a quick rewrite.

---

# 27. PRIVACY, SECURITY AND DEPLOYMENT

## 27.1 Git and secrets
The worklog reports that `.env` was historically tracked in Git. The current archive contains an `.env` file. Never expose its values in logs, prompts, screenshots or the public repository.

Before remote push/launch:
- Check whether `.env` is currently tracked.
- Inspect Git history for exposed secrets without printing them.
- Rotate any credential or salt that may have been exposed.
- Keep `.env` ignored.
- Keep `.env.example` placeholders only.
- Never commit `db/custom.db`, production RFQ records, private uploads or customer attachments.

## 27.2 Production environment
- Use a unique, high-entropy `RFQ_IP_SALT`.
- Set `DATABASE_URL` to the actual production database.
- Keep attachments outside public web root or use private object storage.
- Use HTTPS.
- Verify security headers on the deployed host.
- Apply least-privilege file/database permissions.
- Ensure logs do not contain RFQ bodies, chat content, email addresses or original filenames.
- Encrypt backups where appropriate and perform a restore drill.
- Define retention/deletion procedures.
- Review third-party AI and storage processors.
- Ensure the privacy policy describes the actual processing.

## 27.3 Headers
The worklog documents CSP, X-Frame-Options DENY, nosniff, Referrer-Policy, Permissions-Policy and `poweredByHeader` disabled. Test actual response headers on the production host. Tune CSP for actual scripts, images, fonts, APIs and providers; do not assume local settings equal production behaviour.

## 27.4 Legal documents
The legal view itself flags management/counsel review. Have qualified counsel review:
- Privacy policy.
- Terms.
- Consent language.
- AI provider disclosure.
- Retention/deletion.
- International data transfers, if any.
- Product claims and regulatory language.
- Supplier and investor enquiry language.

Do not use generic legal copy that misrepresents the deployed system.

---

# 28. CRITICAL ISSUE REGISTER — FIX BEFORE PUBLIC LAUNCH

| Priority | Issue | Evidence / why it matters | Required action |
|---|---|---|---|
| P0 | Production domain mismatch | User provided `dispoconceptpvtltd.com`; `llms.txt` links to `dispo-concept.com`; metadata can fall back to localhost | Confirm one canonical domain and update environment, llms files, sitemap, OG and JSON-LD |
| P0 | Product supply role not verified | All seven product families set `supplyRoleVerified: false`, but some public copy says “we manufacture” | Confirm manufacturing/sourcing/distribution role for every family and adjust copy |
| P0 | Financial publishing rule | Latest source-of-truth says no financial figures without written approval | Keep all financial numbers off the public site unless approved in writing |
| P0 | Historical `.env` exposure | Worklog says `.env` was tracked; current archive includes `.env` | Verify Git tracking/history, rotate exposed values, ignore file and remove secrets from history as needed |
| P0 | Attachment malware scanning absent | RFQ accepts some document formats without malware scanner | Add scanning before production acceptance of untrusted attachments, or disable/restrict uploads |
| P1 | Company locale count stale | `company.ts` says six; config includes seven locales | Derive count from config or update to seven |
| P1 | Certification claims | Old public site claims ISO 13485/CE/EO; current rules require proof | Audit every page/FAQ/schema/chat answer against valid documents |
| P1 | Quality-gate status | Seven gates are in site narrative and chat system prompt; operational SOP evidence not confirmed | Either provide approved SOP evidence or describe them as proposed process framework |
| P1 | BVB definition | FAQ currently gives a specific construction explanation | Validate against actual product technical file |
| P1 | Contact address label | Current content/schema uses “registered office”; management still needs to confirm legal status | Verify and correct wording |
| P1 | `areaServed` implies active markets | JSON-LD lists corridors of interest as service coverage | Replace with accurate interest language or remove unverified regions |
| P1 | Sitemap relative URL | `sitemap.xml` uses `<loc>/</loc>` | Use absolute canonical URL and test it |
| P1 | AI prompt overstates verified facts | Chat prompt says company manufactures/supplies and quality gates are defined | Align prompt with verified company/product data and review FAQ consistency |
| P1 | Swiss visual seal risk | Leadership view imports `SwissSeal`; methodology is not certification | Audit visual and remove any implication of official Swiss certification |
| P1 | Gallery not extracted | `/gallery` returned 404 during prior review | Do not claim full gallery asset collection; obtain original images or repair route |
| P2 | Hash routes limit SEO | Product views are not independent server routes | Plan a controlled route-based SEO migration |
| P2 | SQLite scale limits | Current DB is SQLite and rate limiter is in-memory | Plan managed PostgreSQL/shared rate limit as traffic and write volume grow |
| P2 | Translation quality | Seven dictionaries exist; automated parity is not native-speaker review | Complete native/professional review and route-by-route QA |
| P2 | Worklog/files mismatch | Worklog says some files/assets were removed, but archive still contains them | Verify actual imports, git diff and filesystem; update stale worklog after cleanup |

---

# 29. IMPLEMENTATION PLAN

## Phase 1 — Baseline and source-of-truth reconciliation
1. Read `worklog.md`.
2. Inspect current `src/content/products.ts`, `src/content/company.ts`, `src/lib/i18n/config.ts`, `src/lib/i18n/dictionaries/en.ts`, router, APIs, metadata and all views.
3. Confirm canonical domain.
4. Re-run i18n checker and source checks.
5. Compare worklog claims to actual files.
6. Create a list of management decisions and evidence gaps.
7. Do not rewrite code before baseline is recorded.

## Phase 2 — Claims and product governance
1. Confirm supply role for all seven product families.
2. Validate BVB construction description.
3. Collect SKU/specification data.
4. Validate certification and sterilisation claims.
5. Confirm contact details and address status.
6. Approve leadership bios.
7. Keep financial numbers out of public copy under the current directive.
8. Review quality gates and whether they correspond to actual SOPs.

## Phase 3 — Website content and UX
1. Refine hero copy to avoid unsupported manufacturing claims.
2. Make the seven product families clear.
3. Standardise product detail pages.
4. Ensure every product page links to a prefilled RFQ.
5. Correct the FAQ against verified facts.
6. Ensure AI assistant answers match the same facts.
7. Keep imagery explicitly illustrative until authentic assets are approved.
8. Preserve responsive layout, themes, carousel controls and keyboard access.

## Phase 4 — SEO and domain hygiene
1. Set canonical production domain.
2. Correct `llms.txt` and `llms-full.txt`.
3. Fix sitemap absolute URLs.
4. Review `robots.txt`.
5. Correct Organization/Website/Product/FAQ/Person JSON-LD.
6. Remove unsupported `areaServed` and manufacturer claims.
7. Decide whether and when to migrate to pathname routes.
8. Verify metadata and image URLs on production.

## Phase 5 — Security and commercial operations
1. Resolve `.env`/Git-history handling.
2. Rotate exposed secrets.
3. Set production salt and database config.
4. Add malware scanning or restrict attachments.
5. Plan PostgreSQL and shared rate limiting for scale.
6. Define authenticated internal RFQ handling.
7. Confirm email/CRM notification process.
8. Define retention, deletion and backup restoration.
9. Review privacy disclosures for RFQ and AI chat.

## Phase 6 — Verification and release
1. Run lint.
2. Run TypeScript.
3. Run i18n parity checker.
4. Run approved production build process.
5. Test all routes and RFQ paths.
6. Test seven languages and Arabic RTL.
7. Test light/dark themes.
8. Test 390/768/1024/1440 px widths.
9. Test keyboard access, reduced motion, dialog focus and carousel controls.
10. Test actual production headers, domain, sitemap, JSON-LD and llms files.
11. Run dependency/security audit.
12. Restore a backup in a test environment.
13. Obtain management sign-off for content and release blockers.

---

# 30. BUILD COMMANDS AND TEST NOTES

The repository uses Bun. Start from the project root.

```bash
bun install --frozen-lockfile
bunx prisma generate
bun run dev
```

The package scripts include lint and database commands. The worklog records these checks:
```bash
bun run lint
bunx tsc --noEmit
bun scripts/check-i18n.ts
```

A production build script exists in `package.json`, but the worklog says build was prohibited in the original environment. Follow the current environment's execution rules; do not run prohibited build commands. Run the production build in an approved CI or deployment environment.

**Important:** The worklog contains historical test results, including RFQ/API/browser checks. Re-run tests after any change and in the target environment. Do not represent historical sandbox success as proof of current production readiness.

Avoid destructive commands such as database reset or `db push --accept-data-loss` against production.

---

# 31. RELEASE ACCEPTANCE CHECKLIST

## Company and claims
- [ ] Legal entity and DISPO Global naming relationship approved.
- [ ] Canonical production domain approved.
- [ ] Address and phone/email confirmed.
- [ ] “Registered office” label verified.
- [ ] All seven product families confirmed current.
- [ ] Manufacturing/sourcing role confirmed for each family.
- [ ] Product specifications approved.
- [ ] BVB definition verified.
- [ ] Sterility/EO claims verified product by product.
- [ ] ISO/CE/MDR claims verified and scope confirmed.
- [ ] Quality gates backed by SOPs or described as a framework.
- [ ] All images identified as authentic or illustrative.
- [ ] Leadership bios approved.
- [ ] No unapproved financial figures.
- [ ] No unsupported export, customer, tender or partner claims.
- [ ] Privacy and Terms reviewed by qualified counsel.
- [ ] Sustainability claims supported by evidence.

## Engineering and security
- [ ] All hash routes resolve correctly.
- [ ] Product search/filter and related-product links work.
- [ ] RFQ prefill works.
- [ ] Server-side validation remains authoritative.
- [ ] GET/PUT/DELETE `/api/rfq` return 405.
- [ ] No public read path exists for RFQs or attachments.
- [ ] `.env` tracking/history reviewed; exposed values rotated.
- [ ] Production `RFQ_IP_SALT` set.
- [ ] Attachment malware-scanning decision resolved.
- [ ] Rate limiting strategy appropriate to deployment topology.
- [ ] Database access is least-privilege.
- [ ] Backup restore drill passes.
- [ ] Production headers verified.
- [ ] Logs do not contain PII or chat contents.
- [ ] Dependency/security audit completed.
- [ ] RFQ internal workflow and access controls defined.
- [ ] AI-provider privacy disclosure approved.

## SEO and platform
- [ ] Metadata uses the canonical domain.
- [ ] llms links use the canonical domain.
- [ ] Sitemap contains absolute URLs.
- [ ] JSON-LD matches approved facts.
- [ ] Corridors are not falsely represented as current service coverage.
- [ ] Hash-route SEO limitation documented or migration planned.
- [ ] Seven locales pass automated parity.
- [ ] Native/professional translation review completed or accurately labelled pending.
- [ ] Arabic RTL tested.
- [ ] Chinese typography tested.
- [ ] Light/dark themes tested.
- [ ] Responsive checks pass at 390/768/1024/1440 px.
- [ ] Accessibility and reduced-motion checks pass.
- [ ] Monitoring and incident owner assigned.

---

# 32. MASTER CODING-AGENT PROMPT — COPY AND PASTE

```text
ROLE
Act as a senior full-stack engineer, B2B medical-products UX strategist, design-system architect, accessibility specialist, security engineer, SEO architect, content-governance analyst and release manager.

PROJECT
Improve the existing Dispo-Concept website in the uploaded repository. The current stack is Next.js 16, React 19, TypeScript 5, Tailwind CSS 4, Prisma 6 with SQLite, a hash-based SPA router, seven product families, seven locale dictionaries, light/dark themes, RFQ intake and a grounded AI chat endpoint.

SOURCE OF TRUTH
Before editing, inspect:
- worklog.md
- src/content/products.ts
- src/content/company.ts (verify whether it is used and whether it conflicts with the worklog)
- src/lib/i18n/config.ts
- src/lib/i18n/dictionaries/en.ts
- all six non-English dictionaries
- src/hooks/use-hash-route.ts
- src/app/page.tsx
- src/app/layout.tsx
- src/app/globals.css
- src/components/platform/platform.tsx
- all files under src/components/platform/views/
- src/components/platform/dispo-inteligent.tsx
- src/app/api/rfq/route.ts
- src/app/api/chat/route.ts
- src/lib/rfq-schema.ts
- src/lib/rate-limit.ts
- src/lib/db.ts
- prisma/schema.prisma
- next.config.ts
- public/robots.txt
- public/sitemap.xml
- public/llms.txt
- public/llms-full.txt
- package.json

Report current architecture, test state, discrepancies and blockers before changing code.

NON-NEGOTIABLE CONTENT RULES
1. Do not invent manufacturing capability, factories, equipment, capacity, staff, customers, testimonials, export history, product specifications, certificates, regulatory suitability, revenue, margins, valuation or investment returns.
2. The actual product register has seven families and `supplyRoleVerified: false` for every family. Do not claim in-house manufacture for a family until management verifies its supply role.
3. The current company-content directive says no financial figures are published on the website without explicit written approval. Do not publish US$900 million, fundraising amounts, revenue, margins, valuations or forecasts unless the directive is changed in writing.
4. Treat ISO 13485, CE, MDR and EO sterilisation claims from old public content as claims awaiting evidence review.
5. Verify the current BVB construction description against the actual technical file.
6. Treat seven quality gates as a framework until management provides approved SOP evidence.
7. “Swiss-grade process discipline” is a methodology phrase, not Swiss origin, certification or endorsement. Audit `SwissSeal` artwork to ensure it does not imply official accreditation.
8. The seven corridors are areas of interest, not proof of exports or service coverage.
9. Treat all current generated imagery as illustrative unless an asset is explicitly verified as authentic.
10. The supplied `/gallery` page returned 404 in the earlier review; do not claim that original gallery assets were extracted.
11. Confirm the current address and whether it is the registered office before publishing that label.
12. Keep the privacy policy accurate to actual RFQ and AI processing.

ARCHITECTURE
The current website is hash-routed under `/`, with views such as `/#/products` and `/#/quality`. Preserve the working router unless a separate route-based SEO migration is approved. Do not claim hash routes are independent server-rendered pathname pages.

CRITICAL DISCREPANCIES TO ADDRESS
- User-provided domain is `https://dispoconceptpvtltd.com/`, while public `llms.txt` links to `https://dispo-concept.com/`. Confirm one canonical domain and update metadata, JSON-LD, sitemap and llms files.
- `public/sitemap.xml` uses a relative `<loc>/</loc>`; use absolute canonical URLs.
- `src/content/company.ts` has `siteLocales: 6`, while locale config contains seven locales.
- JSON-LD `areaServed` must not treat corridors of interest as confirmed service coverage.
- Some copy/FAQ/chat text claims manufacture and seven implemented quality gates despite unresolved product supply roles and SOP evidence.
- Worklog says some files/assets were removed, but the uploaded archive still contains them. Verify actual imports and update stale worklog claims.
- `.env` was historically tracked according to the worklog and is present in the archive. Never print its values. Review Git history, rotate exposed secrets and resolve before remote push.
- Attachment malware scanning is not implemented. Add scanning before accepting untrusted attachments in production or restrict uploads until it is.
- SQLite and in-memory rate limiting have scaling limitations. Do not silently migrate; create a tested staged plan.

DESIGN
Preserve the current Clinical Swiss visual system and semantic tokens in `src/app/globals.css`:
navy #0B1726, deep navy #14283D, engineering blue #243D54, clinical teal #087E8B, signal teal #11A6A0, pale teal #73D8CD, steel #66788A, graphite #344454, champagne #B89A62 (sparse accent only), light background #F5F8FA.
Use existing typography and semantic CSS variables. Ensure WCAG AA contrast.

PRODUCT FAMILIES
Preserve these catalogue entries and slugs:
- Surgical Gowns: Standard, Reinforced (BVB), Double-layer.
- Procedure Kits: General, Delivery, Urology, Orthopaedic, Cardiac.
- Medical Face Masks: 2-ply, 3-ply.
- Medical Caps.
- Shoe Covers.
- Sterilisation Wraps.
- Custom Procedural Packs.

Null specifications must remain visibly unverified. Do not infer material, dimensions, performance, sterility, packaging or standards from images.

LOCALISATION
Preserve en, fr, de, es, nl, ar and zh. English dictionary is the source of truth. Run `bun scripts/check-i18n.ts`. Test Arabic RTL and Chinese typography. Do not claim native-speaker review without evidence. Correct duplicated/stale locale counts.

RFQ AND AI
Preserve server-side validation, origin checks, rate limiting, private file storage, PII-free logs, no public read API and the grounded chat system prompt. Do not log chat or RFQ contents. Make AI-provider data processing clear in privacy wording. Review system prompt claims against verified source data. No prices, MOQs, stock, lead times, certifications, capacity or financial figures in AI answers; route commercial requests to RFQ.
Plan shared rate limiting, managed PostgreSQL, private object storage, malware scanning and authenticated internal review as staged production upgrades.

SEO
Use the confirmed production domain for canonical, Open Graph, JSON-LD, sitemap and llms links. Fix relative sitemap URLs. Correct structured data so it does not overstate manufacturer status, current markets, registered office, certifications or product claims. Do not add false hreflang links while the app remains hash-routed.

IMPLEMENTATION METHOD
Make small reviewable changes. For each change, state the issue, files changed, risk and tests performed. Do not overwrite working code merely to match a proposed design. Do not report checks as passing unless actually run.

VALIDATION
Run when permitted:
- `bun run lint`
- `bunx tsc --noEmit`
- `bun scripts/check-i18n.ts`
- approved production build in the intended CI/deployment environment

Test all views, product filtering, RFQ prefill, validation, API method restrictions, cross-origin behaviour, bot controls, attachment handling, AI chat grounding, all seven locales, RTL, themes, carousel pause/play, accessibility, and widths 390/768/1024/1440 px. Verify actual production headers, domain, JSON-LD, sitemap, robots and llms files.

DELIVERABLE
Return:
1. Current-state assessment.
2. Prioritised implementation plan.
3. Files changed and reasons.
4. Claims and product-data gaps.
5. Security/privacy risks and remediation.
6. Test results that were actually observed.
7. Management decisions needed.
8. Explicit go/no-go launch verdict.
Do not call the platform enterprise-ready just because it looks premium. Accuracy, quality governance, privacy, security and operational follow-through are part of the product.
```

---

# 33. FINAL PRINCIPLE

A world-class medical-products enterprise is not built by the website alone. The digital platform must grow alongside verified product master data, technical documentation, supply-role clarity, regulatory evidence, supplier controls, quality governance, secure customer handling, operational reporting and accountable leadership.

The objective is a credible, maintainable commercial platform that can scale with the company—not a site that implies the future has already been achieved.

**The standard: precise claims, documented capability, responsible design, secure enquiries, and measurable execution.**
