# DISPO-CONCEPT — DEPLOYMENT READINESS + GLOBAL POWERHOUSE BLUEPRINT
**Audit date:** 14 October 2026  
**Source inspected:** newly uploaded `workspace-39f0d408-d573-48a9-bb46-eb0b0fef6539(1).tar`, plus its included audit report, code, configuration and worklog.  
**Decision:** **NO-GO for unrestricted public production launch.** Conditional candidate for controlled launch after the blocking gates below are closed and independently tested. This is a source-code/static audit, **not** a verified live deployment test or successful production build.

## 1. What is already present
- Next.js 16 / React 19 / TypeScript / Tailwind 4 / standalone deployment configuration.
- Seven locales: English, French, German, Spanish, Dutch, Arabic and Simplified Chinese. The worklog reports 790 translation keys in the updated edition; independently rerun the parity script before shipping.
- Full-bleed five-scene immersive hero with pause and reduced-motion behaviour (`src/components/platform/immersive-hero.tsx`).
- Seven product families and product-specific FAQs (`src/content/products.ts`, product detail view).
- Eight corridors of interest, including Canada (`src/components/platform/corridor-map.tsx`); these must not imply established exports, approval or active service coverage.
- Product-specific documentation-request intent in the RFQ form.
- RFQ endpoint with Zod validation, same-origin check, honeypot, rate limit, private storage and partial magic-byte checks.
- reCAPTCHA v3 client/server integration, **conditionally active only when correctly configured**.
- Canonical URL fallback and absolute sitemap currently point to `https://dispoconceptpvtltd.com/`.
- Revised teal instrument-style `SwissSeal` replaces a red Swiss flag-like seal; nevertheless the name and 'Swiss-grade' marketing theme should undergo legal/brand review.
- An existing internal audit report dated 14 October 2026 says an earlier state was not launch-ready. Several of its findings have been addressed in the newly uploaded tree, so it is not a reliable current pass/fail certificate.

## 2. Current evidence-limited deployment verdict
| Gate | Observation in uploaded code | Verdict |
|---|---|---|
| Successful dependency install, TypeScript, lint, production build | Dependencies are not installed in this audit environment; no new build/test execution was possible | **UNVERIFIED / BLOCK** |
| Real HTTPS deployment and DNS | Caddyfile binds `:81`; Next adds HSTS header, but this does not establish real TLS or reverse-proxy security | **UNVERIFIED / BLOCK** |
| Manufacturing truth | All seven families still have `supplyRoleVerified: false` | **BLOCK for blanket manufacturing claims** |
| Product regulatory/quality proof | No current certificate/technical-file inventory was independently authenticated | **BLOCK for claims requiring proof** |
| RFQ security | No malware scanner; CAD files are extension-checked only; local upload storage | **BLOCK for untrusted attachments in public production** |
| CAPTCHA | Present, but bypassed when server secret unset; site key/secret and production hostname must be configured and tested | **CONDITIONAL** |
| CAPTCHA token integrity | Server verifies success/score, but does not compare returned action and hostname to expected values | **FIX before launch** |
| IP abuse controls | In-memory limiter; trusts `x-real-ip` if present; built-in fallback salt | **FIX or constrain at trusted proxy** |
| International site | Seven locales and Canada interest corridor; source search found no `ABRIC` label | **PARTIAL** |
| SEO | Canonical fallback and absolute sitemap improved; hash routes still obstruct independently crawlable product pages | **P1 growth blocker** |
| Brand imagery | Five hero assets named `cinema-*`; illustrative imagery needs clear provenance and must not represent real factories as factual | **APPROVAL REQUIRED** |
| Sales operations | API writes enquiries; live notification, CRM ownership, retention and response SLA not verified | **BLOCK for operational launch** |
| Public financial claims | Current public copy appears to avoid publishing financial performance figures | **KEEP** |

**Do not confuse “code exists” with “feature works in production.”** This audit did not test external DNS, hosting, Google CAPTCHA credentials, live form delivery, malware scanning, real email/CRM handoff or current product regulatory status.

## 3. P0 release-blocking action list

### P0-A — reproducible release build
1. Install dependencies using the project's lockfile and approved runtime.
2. Run `bun scripts/check-i18n.ts` (or the script's documented invocation), `npx tsc --noEmit`, `npm run lint`, and `npm run build` in a clean CI runner.
3. Start the standalone output with production environment variables; test HTTP routes, images, translations, forms and error pages.
4. Record actual command output, commit SHA, test date, runtime version, deployment target and approver. Do not claim pass based on the old audit report.

### P0-B — security, privacy and abuse resistance
1. Use actual HTTPS and trusted-proxy configuration. Verify redirect from HTTP, certificates, HSTS and proxy headers; the included `:81` Caddyfile is not proof of TLS.
2. Configure both reCAPTCHA keys for the correct domain, and reject missing/invalid tokens when enabled. Verify `hostname` and expected `action` returned by Google, not just score/success. Confirm the privacy policy and required disclosure are approved.
3. Restrict proxy trust: do not trust arbitrary client-supplied `x-real-ip`; enforce known trusted proxy hops or use hosting-provided trusted IP metadata.
4. Require a high-entropy `RFQ_IP_SALT` in production; remove the built-in fallback for production; move rate limits to shared durable storage when scaling.
5. Disable CAD/Office file uploads in public production until malware scanning and safe processing are operational; preferably accept PDF/PNG/JPEG only as a temporary policy, with scanning and quarantine. Magic bytes alone are insufficient.
6. Ensure upload directories are outside the web root, non-executable, backed up only where appropriate, access controlled, and subject to retention/deletion.
7. Use an authenticated, role-limited RFQ console or a secure operational handoff; ensure no unauthorised staff can access buyer documents.
8. Audit Git history for secrets and customer data; do not infer safety merely because the current tar omits `.env` or `db/custom.db`. Rotate anything previously exposed.
9. Verify database migrations, backups, restoration, error alerts, logging minimisation and incident response.

### P0-C — truth and regulated-product review
1. Approve manufacturing/supplier role by product, SKU, site and legal entity. Seven `supplyRoleVerified:false` values remain in source.
2. Approve product claims, intended uses, sterility, test results, packaging, shelf life, certificates, regulatory registrations and destination-market suitability with qualified regulatory/quality reviewers.
3. Do not claim ISO 13485, CE marking, EO sterilisation, approvals, exports, government/UN supplier status, facility capability or customers without evidence of holder, product/site scope and validity.
4. Review 'Swiss-grade' and `SwissSeal` naming to prevent Swiss origin, government, certification or independent endorsement confusion.
5. Confirm whether the public Bengaluru address is a registered office or simply a contact address.
6. Verify the company identity and approved relationship between DISPO-CONCEPT, Dispo-Concept Private Limited and DISPO Global.
7. Maintain a controlled claim register with evidence link, owner, approval, expiry and public-use status.

### P0-D — live conversion operations
1. Route RFQs to named, accountable human owners with alerting and fallback.
2. Verify genuine receipt and reference number, email/CRM notification, duplicate handling, failure states and response escalation.
3. Exercise malicious, oversized, malformed, cross-origin, bot, missing CAPTCHA and duplicate submission tests.
4. Confirm the privacy/retention policy for RFQ attachments, chat messages, analytics and third-party providers.
5. Establish a measurable response SLA before advertising one.

## 4. P1 launch-growth fixes
- Move from hash navigation (`/#/products/...`) to true Next.js product and market routes with canonical URLs, sitemap entries, locale/hreflang mapping and redirects.
- Resolve all illustrative product/facility imagery provenance; invest in authentic approved product and process photography.
- Add an evidence room with approved product datasheets, quality documents and a buyer qualification checklist.
- Separate distributor, hospital, OEM/private label, documentation, institutional tender, investor and vendor enquiry paths.
- Implement meaningful CRM attribution: source, buyer type, market, family, qualified/unqualified, next action, owner, follow-up and conversion.
- Audit all translations for technical/regulatory terminology; maintain seven-locale parity and proper Arabic RTL.
- If still desired, implement the `ABRIC` label directly below the Chinese language option **only after its meaning and purpose are specified**. It was not found in this upload.
- Make the eight interest corridors clearly labelled **prospective / interest**, not current export operations. Use flags only as geographic indicators, not certification or partnership proof.
- Replace `SwissSeal` internal naming and 'Swiss-grade' creative shorthand if legal/brand review identifies residual ambiguity.
- Tighten CSP: current script policy contains `'unsafe-inline'` and `'unsafe-eval'`; validate production compatibility with a stricter nonce/hash approach.

## 5. The real global-powerhouse strategy

**Strategic goal:** become a difficult-to-replace B2B medical consumables partner because buying, qualifying, documenting, configuring and replenishing products through DISPO-CONCEPT is more dependable and less burdensome than alternatives.

### The four defensible capabilities to build
**1. Evidence advantage:** verified specs, controlled document versions, traceability, quality/complaint handling and accurate market status.  
**2. Procurement advantage:** a buyer-facing workspace for RFQs, approved document packs, quote revisions, sampling status, account ownership and reorder assistance.  
**3. Supply advantage:** qualify suppliers/manufacturing partners; build in-house capacity only where demand, quality economics, regulation and financing justify it.  
**4. Data advantage:** learn from product-family demand, destination-market requests, RFQ disqualification reasons, conversion rates, on-time fulfilment and repeat orders—without leaking confidential buyer data.

### Six high-impact creative programmes
**A. “Confidence, Made Visible.”** The hero brand campaign. Cinematic product macro and actual approved process evidence. The goal is to make supplier competence tangible, not to simulate certifications.  
**B. “The Evidence Room.”** An approved, versioned technical document and supplier qualification experience. Access may be tiered by legitimate confidentiality requirements.  
**C. “The Procurement Brief.”** A free buyer checklist that helps buyers specify variants, intended use, target market, packaging and documentation. It becomes a high-intent lead magnet without withholding essential safety information.  
**D. “From Requirement to Replenishment.”** A process-led buyer story that connects qualification, documentation, supply coordination, post-delivery support and repeat ordering; publish only stages the company can actually perform.  
**E. “One Product. One Evidence Record.”** A signature design and operating principle: each product/SKU has a controlled information sheet with owner, revision, applicable market and proof status.  
**F. “Built for the Buyer’s Market.”** Destination-market landing experiences that explain what must be checked locally, not falsely claim regulatory approvals. Begin with markets where operational readiness is confirmed.

### Psychological levers (ethical)
- **Risk reduction:** proof before purchase, transparent qualifications, visible escalation paths.
- **Cognitive fluency:** easy-to-scan product and documentation pages.
- **Competence:** exact terminology, coherent interface, honest caveats and timely human follow-up.
- **Buyer control:** choose documentation, quote, distribution or OEM path without a forced sales call.
- **Reciprocity:** provide genuinely useful procurement templates and checklists.
- **Specificity:** verified details beat “world-class quality” adjectives.
- **Authentic social proof:** only with real customer permission and documented results.
- **Continuity:** make reordering and issue resolution easy; don't rely on one-off lead acquisition.

### Commercial engine
1. **Acquire:** high-intent product SEO, targeted LinkedIn, carefully researched distributors/importers, qualified trade events and referrals.
2. **Qualify:** market, application, product specification, evidence requirements, demand profile, buyer authority and timing.
3. **Convert:** technical/commercial review, approved document pack, sample or validation path when supported, clear commercial terms.
4. **Fulfil:** approved suppliers/manufacturing, documented quality, logistics and customer updates.
5. **Retain:** complaint resolution, account reviews, demand planning, repeat-order support and controlled product-change notices.
6. **Expand:** add SKUs, markets and manufacturing capacity only when repeatable demand and compliance readiness support the investment.

### Enterprise KPI dashboard
- Qualified RFQs / total RFQs.
- RFQ-to-quote and quote-to-order conversion.
- Median time to first human review.
- Documentation completeness by product family.
- Active qualified buyers by market.
- Repeat-order rate and customer retention.
- On-time in-full delivery (define measurement precisely).
- Complaints, nonconformances and CAPA closure.
- Contribution margin by product family and corridor (internal only).
- Cash conversion, working capital and customer concentration (internal only).

## 6. Suggested 90-day launch sequence
**Days 1–15 — Stop-the-line gates:** CI build, TLS, CAPTCHA verification hardening, RFQ operational handoff, uploads, secret history, claims register, management sign-off.  
**Days 16–30 — Controlled pilot:** invite a small number of known B2B buyers, monitor real RFQs, measure response time and failure rates, validate documentation workflow and translation accuracy.  
**Days 31–60 — Brand and evidence:** approved product imagery, evidence room, buyer-path landing pages, SEO route plan, company profile and distributor pack.  
**Days 61–90 — Targeted international growth:** two evidence-ready product/market combinations, account-based outreach, procurement content, CRM reporting, buyer feedback and measured iteration.

**Launch decision gates:**
- **Internal preview:** allowed for design and functional review with no public regulated claims.
- **Private buyer pilot:** only after security, privacy, claims and RFQ operational gates pass.
- **Public production launch:** only after build/test/TLS/security verification, legal/quality sign-off and accountable sales operations.
- **Global paid promotion:** only after initial qualified enquiries can be handled reliably and each advertised market/product claim is substantiated.

## 7. COPY-AND-PASTE IMPLEMENTATION PROMPT

```text
ROLE: You are a cross-functional release team: CTO, application-security engineer, DevOps engineer, medical-device regulatory/quality reviewer, enterprise UX director, global B2B growth strategist, localisation lead and commercial operations owner.

PROJECT: Dispo-Concept Private Limited / DISPO-CONCEPT, India-based medical consumables business. Work on the uploaded EXISTING Next.js application. Do not replace working functionality or invent operational claims.

MISSION: Make the application technically deployable and commercially credible, then build a differentiated global B2B demand-generation experience. The creative platform is “CONFIDENCE, MADE VISIBLE.” The operating rule is PROOF BEFORE PROMISE.

FIRST: READ AND AUDIT THE ACTUAL CURRENT CODE. Inspect package.json, lockfile, Next configuration, all locale dictionaries, product source of truth, immersive hero, quality pages, RFQ/chat APIs, CAPTCHA, security headers, Caddyfile, SEO/JSON-LD, imagery and worklog. Treat old audit reports as historical only. Produce current file:line findings.

RELEASE GATES (MUST BE GREEN BEFORE PUBLIC DEPLOYMENT):
1. Clean dependency install, TypeScript check, lint, locale parity, production build and standalone smoke test; report real output and commit SHA.
2. Confirm production DNS, HTTPS, trusted proxy, CSP, HSTS and monitoring. Do not mistake a header for a TLS deployment.
3. Review every product family and SKU: all seven families currently have supplyRoleVerified=false. Block unsupported manufacturing, quality, sterilisation, certificate, capacity, export and market-access claims. Obtain human approval and controlled evidence.
4. Configure Google reCAPTCHA keys for the real hostname, verify server-side success, score, action and hostname; test missing/invalid tokens. Review privacy disclosure and provider data flows.
5. Remove the production fallback IP-hash salt; trust only validated proxy IP headers; use shared rate limiting when scaled.
6. Quarantine or disable unsafe uploads until malware scanning is active. Use strict size/type limits and private storage; review CAD/Office formats and safe viewing.
7. Verify RFQ storage, real reference generation, notifications, human owner, escalation, backups, retention and failure handling. No fake response-time promises.
8. Audit .env, Git history, database files and credentials. Rotate any exposed secret. Never print secrets.
9. Review legal/privacy, company identity, product regulatory claims, Swiss-grade language, image provenance and target-market wording with responsible reviewers.

GROWTH EXPERIENCE:
- Preserve the five-scene full-bleed immersive hero and improve it only where tests or buyer feedback justify it. Use genuine/clearly illustrative images, reduced motion, accessible contrast and performance budgets.
- Build distinct buyer paths: hospital, distributor/importer, OEM/private label, institutional procurement, documentation request and supplier qualification.
- Create the “Evidence Room” with verified controlled documents and clear public/confidential access rules.
- Build “One Product. One Evidence Record.” with specification revision, verified supply role, applicable markets and document status.
- Make RFQ easy: prefilled product and buyer intent, transparent data requests, truthful acknowledgement and accountable human follow-up.
- Maintain seven locales (en/fr/de/es/nl/ar/zh), Arabic RTL and accurate regulated terminology.
- Keep Canada as a MARKET OF INTEREST, not proof of export/registration. Do not use flags, UN motifs or animated routes to imply partnerships or regulatory status.
- The prior design brief requested ABRIC below Chinese; the current uploaded source search found no ABRIC. Do not invent its purpose. Request management definition before implementing any function.
- Plan real Next.js pathname product pages, absolute canonicals/sitemap, structured-data accuracy and correct locale alternatives. Do not pretend hash routes are independently indexable.
- Create approved content campaigns: Confidence Made Visible, The Evidence Room, The Procurement Brief, From Requirement to Replenishment, and Built for the Buyer's Market.
- Integrate privacy-respecting attribution and CRM pipeline reporting; prioritise qualified buyers, repeat orders and documentation completeness over vanity traffic.

DELIVERABLES:
A. Current deployment gate table: PASS/FAIL/UNVERIFIED, with evidence and owner.
B. Minimal-risk code changes as reviewable diffs; no blind rebuild.
C. Actual CI/build/security/form/locale test outputs and reproducible commands.
D. Product-by-product claim/evidence matrix, with management sign-off requirements.
E. Real production deployment runbook, backup/rollback plan and monitoring checklist.
F. Premium brand/website upgrades and a 90-day targeted global go-to-market plan.
G. Post-launch KPI dashboard and weekly review cadence.

DEFINITION OF DONE: A serious international procurement buyer can identify a product, distinguish facts from claims awaiting confirmation, inspect approved evidence, submit a secure product-specific RFQ, receive a real reference and timely human handling, and return for repeat procurement. The website passes real deployment gates, not just a visual review.
```

## 8. Final management recommendation
**Do not approve unrestricted deployment from this tar alone.** Approve a focused release-hardening sprint and a controlled buyer pilot after the technical and evidence gates pass. Then invest in brand campaigns and international acquisition. The greatest long-term competitive advantage will be an integrated evidence, procurement, fulfilment and customer-retention system—not merely more dramatic marketing.
