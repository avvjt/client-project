# DISPO Global — Complete Website Blueprint & Build Specification
**Project:** Dispo-Concept Private Limited  
**Document date:** 13 October 2026  
**Purpose:** Copy-ready specification for building, refining, testing, and launching the corporate website from the supplied workspace.

---

## 1. Executive direction

The supplied workspace already contains a substantial Next.js website implementation. Treat this document as the build specification and improvement plan—not as a reason to discard the existing codebase.

The site should position Dispo-Concept Private Limited as a credible medical consumables manufacturing and supply partner for hospitals, surgical centres, distributors, OEMs, procurement teams, and technical stakeholders.

**Brand line:** “Because Your Life Matters™”

**Core promise:** Medical product manufacturing and supply supported by disciplined quality processes, technical collaboration, and reliable procurement engagement.

**Primary conversion:** Submit a qualified Request for Quotation (RFQ).  
**Secondary conversions:** Explore products, review capabilities and quality approach, contact the team, explore vendor or R&D collaboration, and review investor information.

### Principles
1. Evidence before claims.
2. Technical clarity before decorative marketing.
3. Product discovery before lead capture.
4. One consistent design system across all routes.
5. International readiness without pretending that every market, certification, or partnership is already secured.
6. Privacy and secure enquiry handling by design.
7. Accessibility, responsive behaviour, performance, and maintainability are release requirements.

---

## 2. Current workspace baseline

The supplied repository assessment documents this existing stack and architecture:

- Next.js 16 App Router, React 19, TypeScript 5 strict mode.
- Tailwind CSS 4 and CSS custom-property design tokens.
- Prisma 6 with SQLite.
- React Hook Form and Zod validation.
- Self-hosted Manrope, Inter, IBM Plex Mono, and Noto Sans Arabic fonts.
- Six locale dictionaries: English, French, German, Spanish, Dutch, and Arabic.
- Shared site components, a reusable platform-page renderer, light/dark themes, RTL support, and RFQ submission workflow.
- Existing routes include `/`, `/products`, `/capabilities`, `/quality`, `/industries`, `/network`, `/sustainability`, `/contact`, `/rnd`, `/vendors`, `/investors`, `/hospitals`, `/medical-facilities`, `/careers`, `/ai-tech`, `/terms`, and `/privacy`.
- `POST /api/rfq` is the documented public write endpoint; public GET access to RFQ records is intentionally not provided.
- Repository documents report a 147/147 QA pass in the assessed sandbox baseline. This is not a substitute for a fresh production build, dependency audit, deployment smoke test, or management approval.

### Preserve and improve
Do not replace the current implementation with a fresh generic template. First map every current component and route, preserve working behaviour, and make targeted changes. The repository's own `docs/` folder and source-of-truth register are binding references.

---

## 3. Audience and conversion architecture

### Primary audiences
1. **Hospital and surgical-centre procurement:** needs, specifications, availability, documentation, order quantities, and delivery requirements.
2. **Medical distributors and channel partners:** product breadth, supply continuity, commercial fit, and market-specific requirements.
3. **OEM and private-label partners:** technical requirements, product configuration, quality controls, and commercial scope.
4. **R&D and technical collaborators:** material, process, product-development, and testing discussions.
5. **Investors and strategic partners:** business model, execution capability, market expansion logic, and clearly labelled scenario analysis.
6. **Vendors and prospective employees:** structured engagement and relevant contact routes.

### Conversion hierarchy
- Primary CTA: **Submit an RFQ**
- Secondary CTA: **Explore Products**
- Tertiary CTA: **Discuss a Technical Requirement**
- Supporting CTA: **Contact Dispo-Concept**

Every page should have one clear main action. Avoid competing CTA buttons with indistinguishable importance.

---

## 4. Information architecture and route specification

### Public navigation
Use a concise global navigation with:
- Company
- Products
- Capabilities
- Quality
- Industries
- Network
- Sustainability
- Contact / Request a Quote

Put R&D, Vendors, Investors, Careers, AI & Technology, Legal, and other audience-specific routes in contextual links or the footer. On mobile, use an accessible drawer with visible focus and a clear close control.

### Routes

| Route | Purpose | Required content | Primary CTA |
|---|---|---|---|
| `/` | Corporate overview | Hero, product entry points, capabilities, quality gates, industry fit, network framing, leadership, RFQ | Submit an RFQ |
| `/products` | Product discovery | Product families, use context, options, technical enquiry links | Enquire about a product |
| `/capabilities` | Explain operational capability | Manufacturing/supply model, process discipline, technical review, order workflow | Discuss requirements |
| `/quality` | Explain quality approach | Quality system narrative, documentation, inspection, sterilisation where applicable, order-level confirmation | Request quality information |
| `/industries` | Segment the offering | Hospitals, surgical centres, distributors, OEMs, procurement teams | Find your pathway |
| `/network` | Explain market reach and corridors | Markets of interest, engagement model, supply-chain collaboration, clear status qualifiers | Discuss a market |
| `/sustainability` | Responsible operations | Six-pillar programme framing, waste/resource priorities, future measurement plan | Discuss responsible sourcing |
| `/contact` | Convert qualified demand | RFQ form, contact channels, response expectations only if approved | Submit RFQ |
| `/rnd` | Technical collaboration | Product development, materials, testing discussions, collaboration intake | Start a technical discussion |
| `/vendors` | Supplier engagement | Supplier fit, documentation expectations, onboarding enquiry | Become a supplier |
| `/investors` | Investor/strategic overview | Business narrative, scenario framework, risk framing, NDA-gated discussion | Request a discussion |
| `/hospitals` | Hospital-specific entry | Procurement needs, product families, technical review process | Hospital enquiry |
| `/medical-facilities` | Facility-specific entry | Relevant consumables, supply workflow, product enquiry | Discuss requirements |
| `/careers` | Talent engagement | Career/placement/internship information only as approved | Contact careers team |
| `/ai-tech` | Explain responsible technology posture | Human oversight, automation boundaries, practical applications | Discuss collaboration |
| `/terms` | Terms | Reviewed legal terms | None |
| `/privacy` | Privacy | Accurate data handling, RFQ information, retention and rights | Contact privacy team |

Use the existing shared `PageShell` and `PlatformClient` architecture for pages with common structure. Avoid duplicate one-off page layouts unless a page has a genuine unique need.

---

## 5. Homepage: exact section-by-section blueprint

The homepage should be a cinematic but practical narrative. It must tell the buyer what the company does before asking the buyer to admire the design.

### Section 01 — Hero
**Eyebrow:** MEDICAL CONSUMABLES · MANUFACTURING & SUPPLY  
**H1:** Medical essentials. Made and supplied with purpose.  
**Supporting copy:** Dispo-Concept works with healthcare procurement teams, distributors, surgical centres, and OEM partners on medical consumables and supply requirements—guided by technical clarity and disciplined quality processes.  
**Primary CTA:** Explore Products  
**Secondary CTA:** Submit an RFQ  
**Visual:** Authentic medical production, cleanroom, gown detail, packaging, or quality-inspection imagery. Use approved company imagery where possible. Do not use imagery that implies a factory, capacity, certification, or facility that has not been verified.  
**Interaction:** Restrained reveal; no forced audio; avoid distracting autoplay. Ensure text contrast over imagery and provide a static mobile fallback.

### Section 02 — Vitals / quick orientation
A compact band of verifiable business facts: product families, enquiry pathways, quality-process themes, and markets under discussion. Use no invented throughput, export volume, client count, or delivery-performance figures. If figures are not approved, use descriptive facts rather than numerical counters.

### Section 03 — Company
Explain the company, its customer groups, its product focus, and how it approaches supply. The writing should be specific enough to establish relevance but not claim capabilities absent from the source-of-truth register.

### Section 04 — Intelligence / human and technology
Describe practical use of technology as an enabler of repeatability, information organisation, and operational support. State that human judgement, safety, and review remain central. Do not claim autonomous manufacturing capability or proprietary AI unless evidence and management approval exist.

### Section 05 — Product elements / product explorer
Show product families with clear labels, short use-context descriptions, and links to `/products`. Existing families include:
- Surgical gowns, including named variants currently listed in company materials.
- Procedure kits: General, Delivery, Urology, Orthopaedic, and Cardiac.
- 2-ply and 3-ply masks.
- Caps and shoe covers.
- Sterilisation wraps.
- Custom packs.

The live product catalogue and order-specific specification must govern final descriptions. Avoid medical efficacy claims, clinical outcomes, or claims of universal suitability without substantiation.

### Section 06 — Quality gates
Use a clear process sequence, for example:
1. Requirement intake
2. Specification review
3. Product and process fit
4. Documentation confirmation
5. Order-level confirmation
6. Production/supply coordination
7. Dispatch and follow-through

This is a process narrative, not an automatic certification. Make clear that certification scope and documentation are confirmed for the relevant order. Any use of ISO or CE references must follow the approved claims register.

### Section 07 — Supply corridors
Present India and international regions as strategic corridors or markets of interest, with status confirmed per enquiry. Do not imply existing shipments, registrations, tenders, contracts, or export volumes unless verified in writing. Use neutral map graphics and accessible text; do not use official emblems in ways that imply endorsement.

### Section 08 — Network
Explain how the company collaborates with healthcare buyers, distributors, OEMs, suppliers, and technical stakeholders. Use a diagram of relationships rather than fabricated client logos.

### Section 09 — Corporate care / industry pathways
Provide separate cards for:
- Hospitals and surgical centres
- Medical procurement and institutional buyers
- Distributors and channel partners
- OEM and private-label partners
- Technical and R&D collaborators

Each card should explain why that audience might engage and lead to the most relevant page or RFQ category.

### Section 10 — Leadership
Use approved names, roles, and biographies only. If a profile or photograph has not been approved, use a neutral placeholder or omit it. Do not invent qualifications, board roles, or ownership percentages.

### Section 11 — Engage / RFQ
Introduce the RFQ as a structured technical and commercial conversation. Explain the information the buyer should prepare: organisation, contact, country/market, product category, specifications, estimated quantity, desired timeline, and optional technical attachment.

### Section 12 — Footer
Include brand line, main routes, audience routes, contact details approved by management, language and theme controls if appropriate, privacy and terms links, and a clear RFQ entry point. Keep contact information identical across footer, contact page, structured data, and relevant dictionaries.

---

## 6. Product catalogue blueprint

Each product family should use a consistent template:

1. Product-family name.
2. One-sentence overview.
3. Product variants currently supported by approved catalogue data.
4. Intended procurement context, described without unsubstantiated clinical claims.
5. Available specifications, sizes, materials, packaging, sterilisation, or configuration only when confirmed.
6. Documentation/quality note explaining that order-specific details are confirmed during technical review.
7. Related product families.
8. Product-specific RFQ CTA.

### Product data model for future expansion
Use a central typed content source rather than duplicating product copy in multiple components.

Suggested fields:
- `slug`
- `name`
- `category`
- `summary`
- `variants[]`
- `approvedSpecifications[]`
- `image`
- `alt`
- `industries[]`
- `documentationNote`
- `availabilityNote`
- `published`
- `reviewedAt`
- `owner`

Only publish approved data. A field being technically available in the CMS or code does not make the claim approved.

---

## 7. Visual design system

### Design direction
**Clinical Swiss:** restrained, precise, clean, editorial, engineered, and internationally legible. The interface should feel premium through proportion, typography, whitespace, hierarchy, and real product imagery—not ornamental gold, excessive glass effects, or a dashboard-like homepage.

### Fixed palette from the workspace design system

| Token | Value | Use |
|---|---|---|
| Midnight Navy / `--ink` | `#0B1726` | Primary headings, dark-theme paper |
| Deep Navy / `--ink-2` | `#14283D` | Secondary headings and dark surfaces |
| Engineering Blue | `#243D54` | Diagrams and deep accents |
| Clinical Teal / `--teal` | `#087E8B` | Primary accent, links, keylines |
| Signal Teal / `--teal-deep` | `#11A6A0` | Interactive states |
| Pale Teal / `--teal-bright` | `#73D8CD` | Dark-theme accents and focus glow |
| Clinical Background | `#F5F8FA` | Light-theme panels |
| White | `#FFFFFF` | Light cards and clean surfaces |
| Border Neutral / `--line-2` | `#E4EBF0` | Hairline borders |
| Precision Steel / `--mute` | `#66788A` | Secondary copy and metadata |
| Graphite | `#344454` | Dark-theme secondary text |
| Champagne Titanium / `--gold` | `#B89A62` | Limited keyline/label accents only |

Do not hardcode palette values inside components. Use semantic CSS variables. Maintain WCAG AA contrast for body text; do not use champagne as ordinary text on light backgrounds.

### Typography
- **Manrope:** display and headings.
- **Inter:** body copy, labels, controls, navigation.
- **IBM Plex Mono:** technical labels, references, numerical values, RFQ references.
- **Noto Sans Arabic:** Arabic glyph coverage and RTL interface.

Use fluid `clamp()` sizing, restrained negative tracking for large headings, generous line height for body copy, and readable line lengths. Avoid overly small all-caps paragraphs.

### Layout rules
- Use a consistent centred content container and responsive gutters.
- Alternate large visual sections with compact information sections.
- Use hairline dividers and quiet surfaces.
- Use a consistent card radius and spacing scale.
- Avoid horizontal overflow at 390px, 768px, and desktop widths.
- Do not let decorative animations delay access to content.
- Use real approved photography with meaningful alt text; decorative imagery should have empty alt text.

### Motion
Keep the existing restrained reveal, count-up, ticker, and ambience only where they improve understanding. Every animation must respect `prefers-reduced-motion`. Do not animate essential copy continuously. Avoid autoplaying audio.

### Themes
Keep light and dark themes. Persist user choice and prevent theme flash on initial paint. Validate both themes route-by-route, including forms, menus, modals, tables, and error states.

---

## 8. Navigation and shared components

Reuse existing components where possible:
- `Nav`
- `Footer`
- `Hero` / `HeroSlideshow`
- `Vitals`
- `Company`
- `Intelligence`
- `Elements` / `ElementsExplorer`
- `Quality`
- `Corridors`
- `Network`
- `CorporateCare`
- `Leadership`
- `Engage`
- `PageShell`
- `PlatformClient`
- `RfqForm`
- `ScenarioTable`
- `Reveal`
- `ModalPortal`

### Component contracts
- `Nav`: accessible desktop navigation, mobile menu, locale control, theme toggle, RFQ CTA.
- `PageShell`: shared page layout, consistent hero and footer, optional breadcrumb and CTA.
- `PlatformClient`: renders route content from typed dictionaries/content objects.
- `RfqForm`: client-side UX validation mirrored by server-authoritative Zod validation.
- `ModalPortal`: escape-key support, backdrop close, scroll lock, focus management, focus return, and mobile bottom-sheet behaviour.
- `ScenarioTable`: clearly labelled illustrative scenarios, not promises or forecasts.
- `Reveal`: gracefully renders content without JavaScript and honours reduced-motion preferences.

---

## 9. Internationalisation

Current locale set:
- English (`en`) — source of truth
- French (`fr`)
- German (`de`)
- Spanish (`es`)
- Dutch (`nl`)
- Arabic (`ar`) — right-to-left

### Rules
1. Do not mix untranslated English fragments into translated pages without an explicit fallback strategy.
2. Keep dictionary shapes type-checked against English.
3. Run `bun scripts/check_i18n.ts` after copy changes.
4. Native-speaker review is required before describing translations as professionally reviewed.
5. Arabic requires correct `dir="rtl"`, logical CSS properties, mirrored directional icons where appropriate, and visual QA.
6. Locale query parameters and persistence are the current architecture; do not publish false locale-specific SEO URLs or hreflang links until route-based localisation is implemented.
7. Localise number/currency formatting when it materially improves comprehension, but do not silently change financial assumptions.

---

## 10. RFQ and lead intake

### Form fields
- Company / organisation
- Contact name
- Business email
- Country / market
- Product category
- Technical/material requirements (optional, with a useful minimum when provided)
- Estimated quantity
- Delivery timeline
- Optional attachment (PDF, PNG, JPEG, maximum 10 MB)
- Explicit consent

### User experience
- Explain why each required field is needed.
- Use correct input types and autocomplete.
- Display accessible field-level validation.
- Preserve entered values when safe after validation failures.
- Show a success state with a human-readable reference number.
- Never display internal lead data, database details, or server stack traces.
- Never imply that submitting a form is a confirmed order or quote.

### Existing server-side protections documented in the workspace
- `POST /api/rfq` is the public write endpoint; GET should return 405.
- Server-side Zod validation is authoritative.
- Rate limiting, honeypot, and timing heuristic.
- MIME allow-list and non-public attachment storage with UUID filenames.
- Salted hash for IP data rather than storing the raw IP.
- RFQ submission and audit event persisted transactionally.
- Coarse error codes rather than echoed payloads or server internals.
- Status progression: `NEW → QUALIFICATION → TECHNICAL_REVIEW → QUOTATION → NEGOTIATION → WON/LOST`, with `FOLLOW_UP` as needed.

### Explicit security limitation
Malware scanning for attachments is documented as not yet active. Keep the attachment feature disabled or restricted if the operating environment requires malware scanning before files are accepted. Implement and test the scanning step before treating the workflow as fully hardened.

### Do not build a public RFQ admin page
Internal RFQ records require real authentication, role-based authorisation, audit trails, and secure deployment. There is no public lead-read endpoint. Any future internal console must be separately designed and security-reviewed.

---

## 11. Investor page and financial communication

The investor route should explain the operating model and strategic logic without presenting illustrative assumptions as actual audited performance.

- Clearly label Conservative, Base, and Upside cases as illustrative scenarios.
- Distinguish revenue, gross margin, EBITDA, EBIT, net profit, enterprise value, and equity value.
- Do not imply an investment return or guaranteed outcome.
- Keep sensitive financial details in approved, access-controlled investor materials.
- The workspace records a management directive excluding fundraising-specific ₹20 Cr content from the public website.
- The operating narrative mentions ₹50 Cr annual revenue and 20% profit, but the meaning of “profit” is unresolved. Do not present the 20% as a definitive margin until management confirms whether it means gross margin, EBITDA, EBIT, or net profit.
- Do not publish historical audited financials, shareholding percentages, or unapproved investor claims on the public site.

---

## 12. Content governance: facts that must not be invented

Use `docs/content-source-of-truth.md` as the final authority for claim approval.

### Safe publishing rules
- ISO 13485 and CE wording must be limited to approved company-published wording and order-specific confirmation; do not invent certificate numbers, scopes, expiry dates, or universal compliance.
- Do not invent plant addresses, production lines, capacity, staff numbers, named clients, testimonials, export volume, shipment history, or customer logos.
- Strategic corridors are not proof of established commercial operations in those regions.
- Simplified emblems must not imply affiliation, certification, endorsement, or approval by an organisation.
- Sustainability content must not imply measured emissions reductions, formal ESG compliance, or verified targets without data.
- Careers pages must not advertise unapproved roles, salaries, or HR policies.
- Do not claim regulatory registration, tender participation, or market authorisation without written evidence.
- Keep the company's contact details verbatim and synchronised across the site.

### Approval workflow
For every material claim, record:
1. Exact proposed wording.
2. Evidence source.
3. Evidence owner.
4. Approval date.
5. Where the claim appears.
6. Expiry/review date, if applicable.

If evidence is missing, rewrite the claim as a clearly labelled aspiration or remove it.

---

## 13. Search, metadata, and performance

### SEO
- One unique title and meta description per route.
- One clear H1 per page.
- Canonical URL based on the approved production domain.
- XML sitemap includes only intended public routes.
- `robots.txt` blocks genuinely private paths, not public product pages.
- Add appropriate Organization, Product, and Breadcrumb structured data only where data is accurate and supported.
- Do not add client reviews or star ratings without genuine eligible evidence.
- Do not emit false `hreflang` tags for locales that do not have distinct crawlable URLs.
- Write useful, descriptive image alt text and stable filenames.

### Performance
- Prefer Next.js image optimisation and correctly sized responsive images.
- Use modern image formats where practical.
- Lazy-load below-the-fold imagery.
- Keep hero media appropriately compressed and provide a mobile fallback.
- Self-host the current fonts and preload only essential fonts.
- Avoid unnecessary client components and heavy animation dependencies.
- Set explicit image dimensions or aspect ratios to reduce layout shift.
- Test Core Web Vitals on a production build, not only in development.

### Analytics
No analytics provider is currently approved in the workspace. Do not install tracking pixels or third-party analytics until privacy governance approves the provider, purpose, retention, consent model, and policy wording.

---

## 14. Accessibility requirements

- Semantic header, nav, main, and footer landmarks.
- One H1 per page and logical heading hierarchy.
- Keyboard-operable navigation, dialogs, dropdowns, forms, and theme/locale controls.
- Visible focus indicators.
- Minimum touch target around 44 × 44 CSS pixels where practical.
- Accessible names for icon-only buttons.
- Inline form errors announced to assistive technology and linked to their fields.
- Correct focus management in dialogs and mobile menus.
- Text contrast meeting WCAG AA.
- Meaningful alt text for informational images.
- Decorative SVGs hidden from assistive technology.
- Reduced-motion support.
- Arabic RTL testing and no horizontal overflow.

---

## 15. Security and privacy baseline

### Environment
Use `.env.example` as a placeholder template only. Production environment variables should be provisioned by the hosting operator.

Example shape (replace placeholders; never commit actual values):

```dotenv
DATABASE_URL="file:/var/lib/dispo/data/app.db"
RFQ_IP_SALT="<generate-a-unique-random-secret>"
NEXT_PUBLIC_SITE_URL="https://www.example-approved-domain.com"
NODE_ENV="production"
```

Do not commit credentials, production salts, customer data, database files, or RFQ attachments.

### Required launch controls
- Decide how to handle the historical `.env` in Git history; purge history or create a clean repository as appropriate before pushing to a remote.
- Rotate any secret that may have been committed.
- Provision a unique production `RFQ_IP_SALT`.
- Store the database and uploads outside the public web root.
- Run a dependency/security audit.
- Configure HTTPS and security headers at the reverse proxy.
- Use least-privilege filesystem and database permissions.
- Create encrypted backups where appropriate and execute a restore drill.
- Document retention and deletion procedures.
- Verify that application logs never contain RFQ content or attachment contents.

Suggested reverse-proxy headers, reviewed against actual deployment requirements:
- Strict-Transport-Security
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin
- X-Frame-Options: DENY
- Permissions-Policy disabling unused camera, microphone, and geolocation features

Do not copy a production domain or infrastructure setting without management/engineering confirmation.

---

## 16. Suggested repository organisation

Preserve the actual current paths where they already exist. For future additions, use a predictable organisation:

```text
src/
  app/
    page.tsx
    products/
    capabilities/
    quality/
    industries/
    network/
    sustainability/
    contact/
    rnd/
    vendors/
    investors/
    hospitals/
    medical-facilities/
    careers/
    ai-tech/
    terms/
    privacy/
    api/
      rfq/
  components/
    site/
    ui/
  lib/
    i18n/
    db.ts
    finance.ts
    validation/
    security/
  content/
    products.ts
    company.ts
    quality.ts
    industries.ts
public/
  fonts/
  images/
  files/
prisma/
  schema.prisma
scripts/
docs/
```

This is a conceptual organisation, not an instruction to move files blindly. Keep current import aliases and established components working.

---

## 17. Build and development workflow

The repository uses Bun. Start from the repository root.

```bash
bun install --frozen-lockfile
bunx prisma generate
bun run dev
```

Useful checks:

```bash
bun run lint
bunx tsc --noEmit
bun scripts/check_i18n.ts
```

Database commands in the repository include `db:push`, `db:generate`, `db:migrate`, and `db:reset`. Treat reset commands as destructive. Never use `db push --accept-data-loss` against production.

Production build:

```bash
bun install --frozen-lockfile
bunx prisma generate
bun run build
```

Then test the actual standalone output and deployment environment. Do not infer production readiness merely because the development server runs.

---

## 18. QA and release acceptance criteria

### Functional
- Every public route loads successfully.
- Navigation links resolve correctly.
- Product cards route to the right product detail or enquiry path.
- RFQ happy path and invalid submissions work correctly.
- Server rejects invalid payloads regardless of client-side validation.
- GET `/api/rfq` returns 405.
- No RFQ or attachment data can be read through a public endpoint.
- Theme and language preferences persist.
- Arabic layout is genuinely RTL.
- Dialogs and mobile menus manage focus correctly.

### Visual/responsive
Test at 390px, 768px, 1024px, and 1440px widths.
- No horizontal overflow.
- No clipped buttons or headings.
- No hero text collision with navigation.
- No inaccessible overlays.
- Forms fit mobile screens.
- Tables remain readable.
- Light and dark themes work on all routes.

### Quality
- TypeScript clean.
- ESLint clean.
- Translation completeness check passes.
- Production build succeeds.
- Dependency audit completed.
- Security headers verified on the deployed host.
- Backup and restore drill completed.
- Content claims checked against the source-of-truth register.
- No secret, private database, or customer data is tracked in Git.
- Privacy policy accurately reflects deployed processing.

### Release gate
The existing workspace's go/no-go document recommends a conditional soft launch, not an unconditional public launch. Clear all documented gates before public launch:
1. Git history/secret handling and production secret rotation.
2. Management confirmation of certification wording and financial margin definition.
3. Production infrastructure, least-privilege database access, backup/restore proof, and dependency audit.

---

## 19. Implementation sequence

### Phase 1 — Repository audit
- Read `docs/repository-assessment.md`, `docs/content-source-of-truth.md`, `docs/security-findings.md`, `docs/known-limitations.md`, and `docs/go-no-go.md`.
- Run the existing checks before editing.
- Capture baseline screenshots and note existing route behaviour.
- Make a list of approved content gaps.

### Phase 2 — Content and conversion
- Make the hero instantly explain the business.
- Ensure product families and buyer pathways are obvious.
- Give every route one clear CTA.
- Standardise product summaries and RFQ context.
- Remove unsupported claims and replace placeholder copy only when approved content is available.

### Phase 3 — Design refinement
- Apply semantic tokens consistently.
- Refine responsive spacing, image crops, typography, and card hierarchy.
- Verify the navigation, footer, modal, and forms across themes and languages.
- Retain restrained motion and reduce-motion support.

### Phase 4 — Technical and security hardening
- Validate RFQ server-side behaviour and attachment restrictions.
- Add malware scanning before enabling attachments in a production environment that requires it.
- Add automated accessibility and dependency checks to CI.
- Review security headers, logs, retention, and backups.
- Keep internal RFQ records inaccessible from public routes.

### Phase 5 — Verification and launch
- Run lint, TypeScript, i18n checks, production build, route smoke tests, and responsive QA.
- Test RFQ submissions using test data.
- Complete production configuration and backup/restore drill.
- Obtain management sign-off for all claims and investor wording.
- Soft launch to a limited audience, fix issues, then approve public launch.

---

## 20. Master prompt for an AI website-building agent

Copy the following prompt into your coding agent while the supplied repository is open. It instructs the agent to work on the existing project rather than generate an unrelated new website.

> **ROLE:** Act as a senior full-stack engineer, design systems architect, UX strategist, accessibility specialist, and security-minded release engineer.
>
> **PROJECT:** Improve the existing DISPO Global corporate website for Dispo-Concept Private Limited. The repository already uses Next.js 16 App Router, React 19, strict TypeScript, Tailwind CSS 4, Prisma 6 with SQLite, typed six-language dictionaries, shared site components, light/dark themes, and a secure-by-design RFQ intake workflow.
>
> **FIRST ACTION:** Inspect the repository and read `docs/repository-assessment.md`, `docs/design-system.md`, `docs/content-source-of-truth.md`, `docs/known-limitations.md`, `docs/security-findings.md`, `docs/rfq-workflow.md`, `docs/deployment.md`, and `docs/go-no-go.md`. Run baseline lint, TypeScript, i18n, and build checks where the environment permits. Report the current state before editing.
>
> **NON-NEGOTIABLES:**
> 1. Do not rebuild from scratch or replace the current stack without a demonstrated technical reason.
> 2. Preserve all existing working routes and components unless a documented change is justified.
> 3. Do not invent company facts, certifications, clients, capacity, factory details, export history, financial performance, or regulatory approvals.
> 4. Use `docs/content-source-of-truth.md` as the claims gate. Escalate pending management questions rather than guessing.
> 5. Keep the fixed Clinical Swiss design palette in `docs/design-system.md`; components must use semantic tokens instead of hardcoded palette values.
> 6. Preserve English, French, German, Spanish, Dutch, and Arabic. Keep dictionary shapes type-safe and verify RTL.
> 7. Keep server-side RFQ validation authoritative. Do not expose submitted leads, uploaded files, database records, secrets, or internal error details through public routes.
> 8. Do not create a public admin console. Any future internal console requires separately approved authentication and authorisation.
> 9. Respect reduced motion, semantic HTML, keyboard navigation, focus management, and WCAG AA contrast.
> 10. Do not install analytics or third-party tracking without privacy approval.
>
> **DESIGN GOAL:** Build a premium, editorial, clinical-corporate website with clear product discovery, real approved imagery, restrained motion, excellent mobile behaviour, and obvious buyer pathways. The hero must state what the company does, who it serves, and how to enquire. Prioritise credibility and usability over decorative effects.
>
> **ROUTES TO VERIFY:** `/`, `/products`, `/capabilities`, `/quality`, `/industries`, `/network`, `/sustainability`, `/contact`, `/rnd`, `/vendors`, `/investors`, `/hospitals`, `/medical-facilities`, `/careers`, `/ai-tech`, `/terms`, and `/privacy`.
>
> **CONVERSION:** Use “Explore Products” and “Submit an RFQ” as the primary homepage actions. Route product enquiries with useful context. Explain that an RFQ is an enquiry, not a confirmed order or quotation.
>
> **WORK METHOD:** Make small, reviewable changes. For each change, explain the user/business problem, files changed, risk, and test performed. Do not overwrite working code merely to match a proposed design. Keep copy centralised and translated. Avoid duplicate page implementations.
>
> **VALIDATION:** Run `bun run lint`, `bunx tsc --noEmit`, `bun scripts/check_i18n.ts`, and `bun run build` as appropriate. Test 390px, 768px, 1024px, and 1440px widths, both themes, all six languages, Arabic RTL, modal keyboard behaviour, and RFQ success/error paths. Confirm GET `/api/rfq` returns 405 and that no public read path exists.
>
> **SECURITY/LAUNCH:** Resolve historical secret handling before any remote push, provision a unique production `RFQ_IP_SALT`, complete dependency audit, use least-privilege database permissions, configure HTTPS/security headers, and execute a backup/restore drill. Do not claim production readiness until the launch gates in `docs/go-no-go.md` are cleared.
>
> **DELIVERABLE:** Provide a concise implementation report listing completed changes, checks and results, remaining blockers, and management decisions required. Never report a check as passing unless it was actually run and passed.

---

## 21. Final definition of success

The website is successful when a qualified buyer can quickly understand the company, find a relevant product family, assess the company's quality and technical approach without being misled, and submit a useful enquiry with confidence.

The engineering outcome should be a maintainable, multilingual, accessible, secure, responsive corporate platform—not simply a visually impressive homepage. Public launch must remain conditional on the workspace's documented management and infrastructure gates.
