# DISPO-CONCEPT — WORLD-CLASS AUDIT & PRODUCTION-GRADE REVENUE READINESS REPORT

**Date:** 14 October 2026 (audit executed against live workspace)
**Method:** Baseline gate runs + 4 independent parallel audit agents (claims governance · production engineering · SEO/AEO/conversion · i18n/UX), all read-only, all findings quoted with file:line evidence. Governing spec: `upload/DISPO_GLOBAL_COMPLETE_MASTER_BLUEPRINT_2026-10-14.md`.
**Stance:** Evidence-led. No code was changed in this pass. This report states what is required to make Dispo-Concept a production-grade, revenue-generating enterprise.

---

## 1. EXECUTIVE VERDICT

| Discipline | Score | One-line verdict |
|---|---|---|
| Production engineering | **58/100** | Build is RED (28 tsc errors); secrets tracked in git; otherwise well-engineered intake |
| Claims & content governance | **55/100** | Copy asserts "we manufacture" while all 7 families are `supplyRoleVerified:false`; SwissSeal legal risk HIGH |
| SEO / AEO | **65/100** | Strong skeleton (llms.txt, JSON-LD, FAQ alignment 10/10) undermined by wrong domain on every link |
| i18n / UX | **82/100** | Genuinely strong: 712 keys × 7 locales, 0 drift, 0 leftovers; touch-target + terminology polish remains |
| **Composite** | **~65/100** | **NOT launch-ready today — but every blocker has a known, low-risk fix.** |

**Go/No-Go:** NO-GO for public production launch in current state. After Wave 1 (§12) — roughly one focused working session — the platform becomes GO-candidate for a controlled launch. Nothing discovered requires architectural rework.

---

## 2. WHAT IS GENUINELY STRONG TODAY (keep and protect)

1. **i18n engine** — 712 leaf keys × 7 locales (en/fr/de/es/nl/ar/zh) at exact parity; 0 placeholder drift; 0 untranslated leftovers; three professional terminology passes already applied. This is rare quality for a company this size.
2. **Front-end engineering** — hydration-safe hash router, WCAG-grade carousel (pause/play, visibility-aware, reduced-motion), focus-trapped chat modal, Radix sheet with logical RTL side, localized skip link, zero `any` casts, zero raw `<img>`, zero eslint warnings, correct sticky-footer flex architecture.
3. **RFQ intake core** — server-side Zod before any filesystem write, same-origin check, honeypot with fake-201 bot bypass, salted-hash network keys (no raw IPs), UUID+0600 private attachments, PII-free logs, GET/PUT/DELETE → 405.
4. **SEO/AEO skeleton** — locale-aware metadata template, 5-block JSON-LD suite, FAQ schema mirroring visible FAQ 1:1 (verified), robots.txt with explicit AI-crawler welcomes, llms.txt + llms-full.txt, manifest + OG image + icons.
5. **Financial hygiene** — zero currency symbols, ₹, crore or revenue figures anywhere public. Verified across dictionaries, views, JSON-LD, llms files, chat prompt.
6. **Design system** — Swiss navy/teal/red tokens, glass morphism, 390px overflow clean, dark/light semantics, Noto Sans Arabic + SC typography rules.

---

## 3. P0 — SHIP BLOCKERS (must close before any production traffic)

### P0-1 · Build is red
- `bunx tsc --noEmit` → **28 errors in 27 files**: 26 dead shadcn/ui components (alert-dialog … tooltip) + `tailwind.config.ts` import npm deps removed in the Task-20 cleanup.
- `next.config.ts:40` sets `ignoreBuildErrors:false` → **`next build` aborts**; the standalone output (`bun start`) is never produced. Shipping this tree is impossible.
- **Fix (pure deletion, ~zero risk):** delete `tailwind.config.ts` (dead v3 config; Tailwind 4 is CSS-first via globals.css) + the 26 failing ui files. Only 12 ui modules are actually imported (accordion, badge, button, checkbox, dropdown-menu, input, label, select, separator, sheet, sonner, textarea). Recommended same-pass dead sweep: toaster.tsx, alert.tsx, breadcrumb.tsx, card.tsx, collapsible.tsx, dialog.tsx, pagination.tsx, sidebar.tsx, skeleton.tsx, table.tsx, use-toast.ts, src/content/company.ts (dead, stale `siteLocales:6`), public/logo.svg.

### P0-2 · Secrets & database tracked in git
- `git ls-files` confirms **`.env` AND `db/custom.db` are tracked**, predating the `.gitignore` rules. Blueprint §27.1/§28 P0.
- **Fix:** `git rm --cached .env db/custom.db`; rotate `RFQ_IP_SALT`; purge history before any remote push; create the missing `.env.example` (code references it at rate-limit.ts:12).

### P0-3 · Canonical domain chaos
- `public/llms.txt` links (all 10) → `https://dispo-concept.com` — not the user's domain `dispoconceptpvtltd.com`.
- `layout.tsx:41` + `page.tsx:7` fall back to `http://localhost:3000` (`NEXT_PUBLIC_SITE_URL` unset in .env) → every canonical, OG URL and all 5 JSON-LD `@id`s currently collapse to a localhost URL.
- `public/sitemap.xml:4` → relative `<loc>/</loc>`; `robots.txt:42` → relative `Sitemap:` line.
- **Fix:** set `NEXT_PUBLIC_SITE_URL=https://dispoconceptpvtltd.com` in .env **and** harden the code fallback to the real domain; rewrite all llms.txt links; absolutize sitemap + robots; use E.164 phones in JSON-LD.

### P0-4 · Claims governance: the site says what the register cannot prove
All 7 product families: `supplyRoleVerified:false` (products.ts:56…156). Yet public copy states flat manufacture:
- en.ts:143 & en.ts:544 "**We manufacture and supply** medical-grade consumables…"
- en.ts:29 (meta description, → `<meta name=description>` via layout) "…medical-grade elements **manufacturer and supplier**…"
- en.ts:89 footer tagline "…elements **manufacturing and supply**…"; page.tsx:21–22 (JSON-LD description); manifest.webmanifest:2–3; llms.txt:1; llms-full.txt:3–4; chat prompt route.ts:48,55.
- "**Registered office**" label (en.ts:101 → footer; llms.txt:12; llms-full.txt:4) — legal status unconfirmed.
- JSON-LD `areaServed` (page.tsx:49–56) lists six corridors as `Place` coverage — implies active markets.
- Quality gates stated as operational fact (en.ts:183–199, llms files, chat route.ts:52) vs "proposed framework until SOPs approved".
- **Fix:** apply the compliant rewrites catalogued in §3 of the claims audit (harmonise to "medical-products business focused on…; supply role confirmed per order"), relabel address "Published address", delete `areaServed` or reduce to India, reframe gates as a framework. One en.ts edit pass → propagate via i18n checker to all 7 locales.

### P0-5 · Untrusted attachments not hostile-network-ready
- No malware scanning (self-documented route.ts:24–28); `dwg/dxf/step/stp/xlsx/docx` accepted by extension only (rfq-schema.ts:58–69); no request-body cap at Caddy or Next (App Router buffers whole multipart).
- **Fix (minimum viable):** add ZIP magic-byte check for xlsx/docx; cap body at proxy (`request_body max_size 11M`); **restrict public uploads to PDF/PNG/JPG until a scanner exists**, or integrate ClamAV. Blueprint §28 P0.

---

## 4. P1 — HIGH PRIORITY (close before or immediately after launch)

**Engineering**
1. Chat API: poisoned cached `ZAI.create()` promise (route.ts:65–69) — one failed init = permanent 502s until restart. Reset on catch + `AbortSignal.timeout(30s)`.
2. Rate limiter: `x-real-ip` trusted unconditionally (rate-limit.ts:51–59) → limiter bypass + unbounded Map growth if ever hit directly; default salt is a public constant; add max-entries cap + refuse-to-start without `RFQ_IP_SALT` in production.
3. RFQ: audit-event partial failure leaves orphan RFQ row + deleted file (route.ts:208–216) → wrap in transaction; reference collision (16.7M space) → retry on unique violation; add RFC `Allow: POST`; fix Zod email trim-order; bound `quantity`; phone format decision.
4. No HTTPS/HSTS anywhere (Caddyfile `:81`, no tls block) — production must serve TLS and add HSTS.
5. SQLite + in-memory limiter = single-node ceiling — staged PostgreSQL/Redis plan documented (do not migrate silently; blueprint §23.4).

**Trust & legal**
6. **SwissSeal legal risk HIGH** (medical-artifacts.tsx:315–334): exact Swiss-flag red #DA291C + white cross as a bare "seal" beside the MD's credentials (leadership-view.tsx:120), vision cards, gates strip — reads as Swiss endorsement; Wappenschutz exposure. Fix: remove bare placements; recolor to teal / replace cross with crosshair; keep red cross only inside the brand logo.
7. Privacy policy says "We collect **only** the information you provide in the quotation form" (en.ts:663–665) while chat messages go to a third-party AI provider → add AI-processing clause before launch (blueprint §22).
8. RFQ page lacks the mandated "an enquiry is not an order or a confirmed quotation" statement → add to rfq.intro.
9. BVB construction ("second protective layer over chest and sleeves") + 3-ply efficacy wording stated as fact in 3+ surfaces → soften to "confirmed against the product technical file during quotation" until validated.
10. Per-country flags for corridors (flags.tsx:175–183: Japan/UAE/Brazil/Nigeria) + animated flowing shipment arcs (corridor-map.tsx:106–119) imply operations without proof → neutral glyphs/legend, static arcs; UN = legend item, not a map node.

**Metadata/SEO**
11. `og:locale` invalid format ("en" → "en_US" etc., layout.tsx:99).
12. Meta `keywords` array contains unsupported claims ("cleanroom apparel India", "Swiss-grade medical manufacturing") → delete tag or trim to on-page-supported terms.
13. No GSC/Bing verification tags; lone `x-default` hreflang is a no-op (correct to have no language pairs while hash-routed — do not add false ones).

**Conversion (revenue-critical)**
14. Five buyer journeys funnel into ONE undifferentiated RFQ form: vendors land in a procurement form (vendors-view.tsx:80–82), investors too (investors-view.tsx:129–131) → add `?intent=supplier|investor` and `?buyer=` prefill modes reusing the existing `?product=` mechanism.
15. Product detail: "Request a Quotation" and "Request Documentation" point to the identical URL (product-detail-view.tsx:79,90) → differentiate docs intent; spec table is 100% "Confirm with our team" with no per-family FAQ → add FAQ accordion per family (AEO + objection handling).
16. Mobile-hidden revenue CTAs: corridors "Discuss a Market" is `hidden sm:inline-flex` (home-view.tsx:502); gates Quality link hidden (home-view.tsx:432–434); chat FAB can overlap CTA bands at 390px.
17. Dead CTA keys never wired: `becomePartner` (en.ts:38), `discussCustom` (en.ts:37) — distributor and custom-pack CTAs from blueprint §5.8 don't exist in UI.

**i18n**
18. Stale "**six-language**/six langues/sechs Sprachen/seis idiomas/zes talen/بست لغات/六语种" in `investors.pillar5Body` + `aiTech.app3` ×14 strings — a factual error on the investor page.
19. Terminology collisions: de `Masken` vs `Gesichtsmasken`; de `Prozedur-/Verfahrensspezifische Kits`; ar أطقم مخصصة حسب الإجراء (injects "custom"); fr `packs personnalisés` vs `kits procéduraux personnalisés`; nl `poorten` drift.
20. ar.ts:569 suspected truncated passive "تُشار" → "تُشارَك"; ar transliteration split (بنغالورو vs Latin Bengaluru) needs one policy.

---

## 5. P2 — QUALITY BACKLOG (post-launch polish)

- Touch targets < 44px ×6 (carousel pause 32px, chat close 28px, chat toggle 32px, theme 36px, lang 36px, filter chips 36px).
- ~32 off-token hex grays in 10 shades (footer, chat, home, blocks, flags) — migrate to semantic vars; one real contrast risk: breadcrumb `text-[#a9bac9]` on page background (product-detail-view.tsx:43) ≈ 2.6:1 in light mode.
- English source sweep: "Two-ply and three-ply" → protected "2-ply and 3-ply" (en.ts:302–303); AmE `organizations`/`operating-room` vs BrE corpus; apostrophe style mix; footer heading case; CTA casing rule; address dash drift ("Bangalore 560 090" vs "Bangalore – 560 090"); phone display grouping (footer.tsx:81,87).
- Leadership monograms "PR"/"PK" don't match Praveen/Prakash H C initials.
- rfq-form focus-move misses 3 fields (ids `rfq-category`/`rfq-technical`/`rfq-delivery` vs key-based lookup).
- supply-view image alt says "world map" but image shows packaged boxes on a conveyor.
- AEO depth: 6/7 product links missing from llms.txt; no per-family Q&As in llms-full; "OT procedure kits", "surgical gown manufacturer", "custom procedure packs India", "sterilization wrap supplier" phrases absent on-page (see §6).
- Chat modal: background DOM not `inert` (SR virtual cursor can wander); history turns forwarded verbatim (injection surface mitigated — no innerHTML, grounded system role).
- Noto Sans SC ships latin subset only (framework maximum); spot-check CJK slices on production build.

---

## 6. KEYWORD & AEO REVENUE PLAN (evidence-checked; no invented claims)

**Blocked keywords (do NOT target without evidence):** EU MDR ready medical textiles (0 mentions — would imply unverified regulatory readiness), ISO 13485 manufacturer, CE certified supplier (certificates unverified), surgical drapes (not a listed family), cleanroom apparel (illustrative image only).

**P0 commercial phrases to earn on-page (all map to real families):**
| Phrase | Target | Today |
|---|---|---|
| surgical gown manufacturer India / Bangalore | /#/products/surgical-gowns | phrase absent |
| BVB reinforced surgical gown | gowns detail + FAQ | present — maintain |
| OT procedure kits supplier | /#/products/procedure-kits | "OT" absent |
| custom procedure packs India | /#/products/custom-packs | partial |
| 2-ply 3-ply face mask supplier | /#/products/face-masks | present — maintain |
| sterilization wrap supplier | /#/products/sterilization-wraps | partial |
| medical consumables manufacturer Bangalore | /#/ + capabilities | partial |
| UN procurement medical supplies supplier | /#/supply + industries | present — maintain |

**P1:** disposable surgical gowns supplier · double-layer gown · delivery/urology/orthopaedic/cardiac kit · surgical cap manufacturer · disposable shoe covers bulk · hospital supplies exporter India · OEM private label surgical products · wholesale medical distributor India · tender-driven supply (cautious framing).
**P2 informational (AEO):** what is BVB surgical gown · OT pack contents · 2-ply vs 3-ply difference · sterilization wrap vs rigid container · how to import medical supplies from India · MOQ/lead-time process (answer: via RFQ — compliant, no figures).

**Highest-leverage SEO/AEO actions:** (1) domain fix everywhere; (2) complete llms.txt catalogue links (6 missing product pages); (3) fix Organization JSON-LD (India-only areaServed, icon-512 logo, E.164); (4) harmonise manufacture claims (entity trust); (5) earn P0 phrases in hero/detail/meta copy; (6) per-family FAQ accordions + docs-intent CTA; (7) route-aware RFQ prefill; (8) llms-full hardening (canonical line, ADDRESS label, Swiss-grade caveat, per-family Q&As); (9) mobile CTA repair; (10) plan the pathname-route migration (§26.6) as the next structural SEO step.

---

## 7. WHAT "PRODUCTION-GRADE REVENUE GENERATION" ACTUALLY REQUIRES

The website is one organ of a revenue organism. Five layers, in dependency order:

**Layer 1 — License to operate (Week 1).** Green build (P0-1), clean git history (P0-2), one canonical domain (P0-3), TLS/HSTS. Without these, nothing else matters: the site cannot ship, and trust signals collapse.

**Layer 2 — License to be believed (Week 1–2).** Claims governance (P0-4): every sentence must be true at the register level. This is not bureaucracy — in medical B2B, procurement teams verify claims before shortlisting, and AI answer engines penalize contradictory entities. SwissSeal fix, privacy/AI disclosure, enquiry≠order disclaimers, evidence-gated certification language. A medical buyer's first question is "can I trust this spec sheet?" — the platform must make the honest answer ("confirmed per order, here is the process") look like the strength it is.

**Layer 3 — The demand-capture machine (Week 2–4).** Conversion architecture (§4.14–17): every journey lands in a form that already knows who they are; every product page answers the three questions buyers ask (construction, documentation, process); every corridor page gives one clear next step; mobile CTAs reachable. Plus AEO so ChatGPT/Perplexity/Google AI answer "who makes surgical gowns in Bangalore" with Dispo-Concept — llms.txt completeness is today's highest-leverage move because hash routing makes it the only machine-readable product surface.

**Layer 4 — The ability to handle the revenue (Month 1–2).** The RFQ console: authenticated internal review with status pipeline (NEW→…→WON/LOST), audit events on transitions, attachment access control, retention rules. Email/CRM notification on submission (currently none — an enquiry can sit unseen). PostgreSQL + shared rate limiting when volume justifies. Backups + restore drill. Monitoring/alerting with a named owner. Analytics (privacy-respecting) to answer: which corridor, keyword and journey produces RFQs? A revenue engine without instrumentation is a furnace without a thermostat.

**Layer 5 — Compounding systems (Quarter 1+).** Evidence pipeline: each verified certificate/SOP/spec unlocks copy, keywords and JSON-LD claims — management evidence is the true SEO budget. Native-speaker review of 6 dictionaries (parity ≠ professional review). Content ops: one grounded article per family per quarter (BVB explained, wrap selection, OT pack design) feeding AEO. Route-based SEO migration when content volume justifies. Leadership build-out: the six open mandates map exactly to revenue functions (Business, Overseas, Regional directors).

---

## 8. THE PATH TO $900M — STRATEGIC NARRATIVE (internal strategy document; nothing below is website copy)

**The prize.** Global medical consumables is a structurally growing, fragmentation-rich market. Buyers — hospitals, UN agencies, EU/CCASIA institutional distributors — are actively de-risking away from single-source geographies. An Indian manufacturer with documentation discipline, corridor strategy and a digital demand-capture head start is riding three tailwinds at once: cost base, China+1 diversification, and procurement digitisation.

**Why the ambition is credible.** The scarce asset in this market is not stitching capacity — it is *verified documentation and trust*. Dispo-Concept's founding obsession (evidence-led claims, quality gates, traceable enquiries) is precisely the asset that takes competitors a decade to fake. The platform already speaks 7 languages, captures structured enquiries, and publishes machine-readable truth for AI procurement research. That is a 2010s-grade manufacturing business wearing 2020s-grade distribution infrastructure.

**The eight value-creation levers (sequenced):**
1. **Evidence ladder first (moat).** Convert management's pending evidence — supply roles per family, BVB technical file, mask standards, certificate inventory — into public, verifiable claims. Each verified document unlocks: bolder copy, more keywords, richer JSON-LD, and institutional trust. Budget = documents, not ad spend.
2. **Anchor family: Custom Procedural Packs.** Commodity gowns are a price war; custom packs are specification-driven, stickier, higher-margin, and force an engineering relationship (feasibility → validation → contract). Win 20 hospital groups with tailored packs and the gown/mask/wrap volumes follow as line extensions. This is the wedge.
3. **Supply-role climb.** Sourced today for likely most families → partner-produced → in-house lines for the highest-margin SKUs (gowns, custom packs). Each step captures margin and becomes an investable milestone. Do not claim in-house before it is true; do claim it loudly the day it is.
4. **Corridor sequencing.** Asia + Middle East first (proximity, documentation familiarity, UN procurement hubs in Amman/Dubai/Copenhagen) → Africa via UN/tender frameworks (where a disciplined RFQ pipeline beats incumbents' relationships) → EU as certificates mature (MDR-ready documentation is the gate) → Australia/LatAm opportunistically. UN agency frameworks are the credibility catalyst: one UN supply record unlocks a decade of institutional trust.
5. **OEM/private label flywheel.** Partner brands bring volume and specification learning without brand-building cost; the R&D view and supplier-intent RFQ mode (P1-14) are the intake valves. Every OEM contract is also a quality-system education paid for by the client.
6. **Platform flywheel.** RFQ data compounds into pricing power: enquiry volume by family/corridor/buyer-type tells the company where demand is real before committing capacity. No competitor of comparable size is instrumented this way. The chat assistant and per-family FAQs convert anonymous researchers into identified enquiries at near-zero marginal cost.
7. **Leadership completion.** The six open mandates (Business, Overseas, Regional, GM, etc.) are the execution chassis. Each hire should own a revenue P&L question, not a function: "which corridor do we open next?", "which family gets the in-house line?".
8. **Capital discipline.** Every investment round is gated by evidence milestones (certificate → corridor activation → line commissioning), keeping the story honest by construction. The website's zero-financial-figures policy is an asset: it forces capital conversations into controlled, documented channels where they belong.

**The narrative in one sentence:** *A Bengaluru medical-products enterprise that wins because its claims are verifiable — climbing from disciplined sourcing to in-house manufacturing, corridor by corridor, with a digital platform that captures, qualifies and documents every demand signal on the way to becoming a world-class medical-grade enterprise.*

**What management must build next (non-website):** supply-role register sign-off → certificate inventory with scopes → RFQ console + notification → analytics baseline → first corridor activation plan (Middle East or UN framework) → custom-pack anchor-client programme.

---

## 9. MANAGEMENT DECISIONS REGISTER (evidence only management can supply)

1. Supply role per family (manufactured / partner / sourced) — unlocks ~15 copy fixes + keyword targets.
2. Registered-office status of the Chikkabanavara address.
3. Approved SOPs for the seven gates (or accept "framework" phrasing).
4. BVB technical-file validation; mask performance wording limits.
5. Certificate inventory (holder/scope/body/validity) — governs ISO/CE/MDR language forever after.
6. Corridor activation status (any live exports?) — governs areaServed, flags, animated arcs.
7. Named-leader bio sign-off (both MDs) + monogram initials.
8. AI-provider privacy clause approval.
9. Canonical domain ratification (`dispoconceptpvtltd.com`).
10. Attachment policy: restrict-to-PDF/PNG/JPG vs scanner procurement.

---

## 10. EXECUTION SEQUENCE (proposed, pending management go)

**Wave 1 — Ship-blocker remediation (one session, zero management dependency):**
delete 26 ui files + tailwind.config.ts + dead sweep → tsc/build green; untrack .env/db + .env.example; domain fix (env + fallback + llms.txt×10 + sitemap + robots); P0-4 copy harmonisation in en.ts → parity sweep to 7 locales; manifest wording; JSON-LD (areaServed→India, description, E.164, icon); chat prompt rewrite + poisoned-promise fix + timeout; ZIP magic check + proxy body cap; privacy AI clause; RFQ disclaimer; og:locale fix; stale six→seven ×14; GSC placeholder.

**Wave 2 — Trust + conversion (second session):**
SwissSeal redesign; flags/arcs neutralisation; per-family FAQ accordions; docs-intent CTA; `?buyer=`/`?intent=` prefill; mobile CTA un-hide + FAB overlap; dead CTA key wiring; terminology collisions (de/fr/ar/nl); touch targets ≥44px; breadcrumb contrast; focus-move ids; monograms; address/dash sweep.

**Wave 3 — Growth infrastructure (third session + management inputs):**
llms.txt catalogue completion + per-family Q&As; P0 keyword phrases on-page; analytics; RFQ console spec; PostgreSQL/Redis staging plan; route-migration design doc; native-review scheduling for 6 dictionaries.

**Verification after every wave:** lint 0 · tsc 0 · parity 712×7 · dev.log clean · agent-browser desktop/mobile/RTL sweep · RFQ API happy/cross-origin/bot paths · JSON-LD snapshot.

---

*Prepared by the orchestrator from four independent read-only audits. Every finding above is quoted from the live tree; none are projections. The next action belongs to management: ratify the decisions register, then authorise Wave 1.*
