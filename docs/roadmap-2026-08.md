<!-- Generated 2026-08-04 by a multi-agent research + codebase audit run.
     Claims were fact-checked; code references verified against the repo. -->

# GOYA — Prioritized Roadmap
**Date:** 2026-08-04 · **Status:** pre-launch, no payments, no analytics, site publicly crawlable

---

## 0. The verdict in one paragraph

Goya cannot sell anything today: `components/Checkout.tsx` collects an address, `app/api/order/route.ts` writes a Supabase row, and `/kasa/sukces` promises "odezwiemy się mailowo, aby potwierdzić szczegóły płatności". A grep for BLIK/Przelewy24/PayU/Stripe across the whole repo returns **one** hit — a sentence in `app/regulamin/page.tsx` promising three payment methods that do not exist. **Until a real gateway is live, every other item on this list is worth exactly zero złotych.** But there are two things that must happen *alongside* payments, not after: (1) the demo site is live and fully indexable right now (`app/robots.ts` returns `allow: "/"`, `app/layout.tsx` sets `index: true`) while carrying a fabricated 4.8 aggregate rating on all 168 PDPs and a synthetic ×1.33 strike-through — that is live UOKiK exposure, not a to-do; and (2) a set of decisions (URL structure, order model, price ledger, brand carve-out from okulary.pl) are free today and expensive in six months. Everything else waits.

Also: it is 4 August. The Polish sunglasses season ends in ~4 weeks. **Plan the launch as a September soft-open and a March 2027 scale-up.** Trying to hit August is how you ship the fake reviews and the dead Apple Pay button into a live market.

---

## A. BLOCKERS — nothing ships until these are done

Ordered by (impact / effort). Effort in person-days.

### A1. Take the demo site out of the index today — 0.5d
`app/robots.ts` allows every crawler; `app/layout.tsx` sets `robots: index:true`. Google is currently free to index fabricated reviews, fake discounts, placeholder Instagram links pointing at strangers' accounts, and a Regulamin that opens "To wersja pokazowa sklepu Goya - nie prowadzimy realnej sprzedaży". Gate indexing behind `NEXT_PUBLIC_ALLOW_INDEXING` and return `disallow: "/"` until launch.
**Effect:** removes live legal exposure and stops a throwaway `*.vercel.app` host accruing signals you will have to 301 away.

### A2. Delete the fabricated social proof — 0.5d, highest legal-risk-per-hour on the list
Three code sites, all confirmed:
- `lib/seo.ts:147` — `aggregateRating: {ratingValue: "4.8", reviewCount: String(60 + (p.id % 200))}` on every PDP.
- `components/ProductView.tsx:32` — `rating = 4.6 + (product.id % 4) * 0.1`, rendered as "4.8 · 143 opinii" under the H1, linking to nothing (there is no review section on the page at all).
- `components/pdp/TrustBand.tsx` + `content/site.ts` — four invented reviews with "Zweryfikowane" badges rendered on `#00B67A` (**Trustpilot's brand green**), plus "12 000+ zadowolonych klientów", "5 000+ opinii", "od 2019 na rynku".

**Why:** Poland's Omnibus transposition makes presenting reviews as coming from actual purchasers, without proportionate verification, a blacklisted unfair practice; UOKiK has fined review brokers (Best-Review 35 000 zł, SeoSem24 50 618 zł, Opinie.pro 40 000 zł) and the merchant ceiling is 10% of turnover. Google's review-snippet policy (updated 24 July 2026) bans fake **and undisclosed incentivized** reviews in page content *and* structured data, penalty = a manual action that strips rich results **site-wide**, including the Product price/availability snippets that currently work. And a shop that has never processed an order claiming 12 000 customers is exactly what a payment-gateway reviewer sees when they open your site during verification.
**Replace with what is actually true:** CE / PN-EN ISO 12312-1 conformity, 30-day return, free shipping and free return, the parent shop's real trading history. `aggregateRating` is a *Recommended*, never required, property for merchant listings — dropping it costs zero eligibility.

### A3. Delete the ×1.33 compare-at price — 0.5d
`lib/pricing.ts:16` → `Math.round((premium * 1.33) / 10) * 10 - 1`. Rendered in `ProductCard.tsx`, `ProductView.tsx` (three places), `CartDrawer.tsx`. Because it is a fixed multiplier, **every one of the 168 SKUs shows the same −24%**, which reads as decoration, not a deal.
**Why:** the Polish Omnibus rule (ustawa o informowaniu o cenach, in force 1 Jan 2023) requires any announced reduction to show the lowest price of the preceding 30 days. A price never charged cannot satisfy that. On 12 Jan 2026 UOKiK fined Zalando SE 30 945 000 EUR and Temu's Whaleco 5 910 900 EUR for exactly this class of conduct including omitting the reference price on listing tiles; AzaGroup (Renee/Born2Be) took 14 910 599 zł in May 2025.
**Strategically it is also self-defeating:** a permanent discount badge tells a 35-45 buyer the 449 zł is not real — the precise opposite of the repositioning. Ship one clean price. Replace the savings badge with a "Co dostajesz w cenie" block (polaryzacja, UV400 kat. 3, etui, ściereczka, gwarancja 24 mies., darmowa dostawa i zwrot).
Also delete the *"lub 3× X zł z PayPo"* line at `ProductView.tsx:295` — Goya has no PayPo contract, and the instalment is computed off the fake anchor. Naming a consumer-credit product the customer cannot use is a separate exposure from the strike-through.

### A4. Publish the seller identity — 1d, and it gates payment activation
Confirmed by grep: **no NIP, no REGON, no KRS/CEIDG, no legal entity name, no registered address anywhere in `app/`, `content/` or `components/`.** The only contact is a `mailto:kontakt@goya.pl` in the footer. There is no `/kontakt` route.
**Three separate reasons this is a blocker:** (1) ustawa o świadczeniu usług drogą elektroniczną art. 5 requires this to be permanently accessible; the regulamin's mandatory §1 is seller identification. (2) Every Polish PSP verifies seller name/address/NIP against the account plus a compliant regulamin and privacy policy — Goya would be rejected on submission today. (3) Google Merchant Center requires a reachable contact page with two contact methods.
**Do:** rewrite `app/regulamin/page.tsx` (delete the demo disclaimer, add real entity, statutory 14-day withdrawal alongside the 30-day policy, complaints procedure with a 14-day response commitment, ODR link), add `/kontakt`, add the block to the footer, add `telephone`/`vatID`/`address`/`contactPoint` to `organizationLd()` in `lib/seo.ts`.

### A5. Fix the returns clause — 0.25d
`app/zwroty/page.tsx` promises 30 days "bez pytań" but conditions the return on returning the goods "w stanie nienaruszonym wraz z etui". Under Polish consumer law the buyer may inspect and try goods as in a shop; the seller may only deduct for diminished value, not refuse. A blanket "nienaruszony" condition is a textbook klauzula abuzywna *and* it contradicts "bez pytań" on the same site.
**Rewrite:** "30 dni na zwrot bez podania przyczyny. Możesz przymierzyć okulary jak w salonie. Zwrot opłacamy my." Add a prepaid InPost return label. Put the line directly under the add-to-cart button, not only on `/zwroty`.

### A6. Fix the false product claims — 0.5d
- `components/Header.tsx:68` announces "Polaryzacja w każdej parze". **77 of 168 live products are optical frames with zero polarisation**, and 3 sunglasses have `polarized: false`.
- `app/okulary/[slug]/page.tsx` titles every sun product "…z polaryzacją" unconditionally.
- `ProductView.tsx:307` shows a pulsing "Wysyłka jutro przy zamówieniu do 14:00" badge — hardcoded, so it says the same thing at 6pm Saturday — while the accordion 160 lines below says "1-2 dni robocze". A shopper who reads both learns the urgency is theatre, which taints every other claim.
- `content/site.ts` SOCIALS point at `instagram.com/goya` and `tiktok.com/@goya` — **live accounts Goya does not own** — and these are fed into Organization `sameAs`. Remove SOCIALS and `sameAs` entirely until real accounts exist.
- `/okulary` says "177 modeli", `/o-marce` says "177 modeli", the homepage says "98 z polaryzacją / 79 oprawek". The live filtered catalogue is **168 / 91 / 77** (`facets.json` is generated pre-filter). Derive counts from `lib/products.ts`.

### A7. Wire Przelewy24 (or PayU) with a correct order lifecycle — 5-8d
**This is the whole project.** Sign one contract covering BLIK + Visa/Mastercard + Google/Apple Pay + PayPo.

*Which gateway.* Przelewy24's public commission table is quoted at 1.29% + 0.30 zł across transfers/BLIK/cards/wallets with no monthly fee; PayU's own offer page advertises a uniform 1.1% + 0.30 zł with activation at 29 zł (the 199 zł often quoted is the struck-through list price); Tpay's published 2026 tariff is Starter 0 zł/mo + 99 zł activation at 1.59% + 0.39 zł, or Business 99 zł/mo at 0.99% — break-even between the two is roughly 10 000-16 500 zł/month depending on AOV, which Goya will not reach for months. **Do not make Stripe primary:** its Polish price list is BLIK 1.6% + 1.00 zł and it has no PayPo. At ~400 zł AOV the spread between P24 and PayU is ~1 zł per order on a frame bought in at 79-199 zł — **optimise for method coverage and speed of verification, not for 0.3pp.** Either P24 or PayU is fine; pick whichever verifies you faster. *(Caveat: several activation-fee and verification-SLA figures circulating in secondary Polish blogs did not survive fact-checking. Confirm fees and timelines directly with the provider before budgeting.)*

*Why BLIK-first.* NBP data for Q4 2025 (via cashless.pl): BLIK was **70.8% of Polish e-commerce transactions by count** (393m) vs cards 21.3% (118m), and 62.8% by value. Gemius "E-commerce w Polsce 2025" (CAWI, n=1 629, fieldwork July 2025) has BLIK at 72% usage / 56% most-often-used, fast transfers 64%, cards 43%. BLIK closed 2025 at 2.9bn transactions / 441.5bn zł / 20.7m active users.

*But do not launch BLIK-only.* Average BLIK online ticket in Q4 2025 was ~158 zł and cards ~161 zł — **Goya's 349-499 zł basket is 2-3× that.** The repositioning turns an impulse buy into a considered one, so ship BLIK + cards + PayPo on day one rather than phasing BNPL later. Polish BNPL is real: CRIF counts 34.5m BNPL transactions in 2025, ~2.1m active users, ~9.6bn zł financed, average ticket 277 zł; BIK reports 3.3m Poles have used deferred payments. *(PayPo's "44.3% vs Klarna 22.9%" market-share figure is from PayPo's own n=350 consumer survey — treat as vendor marketing, not market data.)*

*The architecture matters more than the vendor.* Today `Checkout.tsx` calls `clear()` and pushes to `/kasa/sukces` the moment `/api/order` returns 201. Bolting a gateway onto that shape produces: cart emptied, order row written, payment abandoned, no retry path, and an orders table that cannot tell paid from unpaid. Restructure now, while it's free:
1. `/api/order` creates a **`pending`** order with a **server-computed total**. Confirmed hole: line 29-31 reads `price: Number(i.price)` and `subtotal: Number(body.subtotal)` straight from the request body, and the route never imports the catalogue. The cart is in localStorage. Anyone can order a 499 zł frame for 1 zł. Accept only `{slug, variantId, qty}` and price server-side.
2. Generate an order number (`GOYA-260904-A7F3K2`), return it, render it on `/kasa/sukces`.
3. Redirect to the PSP; flip to **`paid`** only from the webhook, with signature verification and an idempotency key.
4. Clear the cart on the success page after confirming status; keep it on failure/cancel.
5. Reject out-of-stock variants server-side.

### A8. Delete the fake Apple Pay / Google Pay buttons — 0.25d
`components/pdp/ExpressPay.tsx` is a UA sniffer plus an icon. In `ProductView.tsx` (~338 desktop, ~489 mobile sticky bar) the express button's `onClick` is **`addToBag`** — byte-identical to the button next to it. In `CartDrawer.tsx:231` it's a plain `<Link href="/kasa">`. A shopper taps Apple Pay expecting Face ID and gets a blank address form. On the mobile sticky bar it eats 30% of the width of the only buy control on the page. It is also the wrong express rail for Poland (wallets are the minority; BLIK is 70.8%). Delete now; bring back a single **"Kup teraz — BLIK"** once P24 is live.

### A9. Add delivery-method choice with an InPost Paczkomat picker — 3d
`Checkout.tsx` collects street/postal/city and hardcodes shipping to "Gratis". There is no way to choose a locker, while the PDP, `/zwroty` and `/regulamin` all promise "kurierem lub do paczkomatu". **Parcel lockers are the most frequently chosen delivery method in Poland at 83%, with InPost Paczkomat named by 87%** (Gemius 2025). Phone is currently marked "(opcjonalnie)" — InPost sends the pickup code by SMS, so a locker order without a phone cannot be collected.
**Do it so it *shortens* checkout:** radio step above the address block, Paczkomat pre-selected, Geowidget for locker choice, and when Paczkomat is selected **hide street/postal/city entirely** — collect locker code + phone only. Target 4 fields on the locker path, 6 on courier. Baymard's current benchmark is ~11.3 fields average against a ~8-field optimum; today's 7-field form is already good, and this is how you keep it good while adding a step.
Also: remove the "za pobraniem" promise from the regulamin rather than building COD. Gemius 2024 has 39% of online shoppers using COD, but it concentrates in the 50+ courier-to-door segment, not Goya's BLIK-native 35-45 target, and it carries non-collection loss on a 400 zł parcel.

### A10. Order confirmation email + a fulfilment path — 1d
There is no `resend`/`nodemailer`/`sendgrid` in `package.json`, no admin route, no webhook, no notification. Orders would accumulate in a Supabase table **nobody reads**, and the customer walks away from 449 zł with no reference number. Wire Resend: one email to the shop with the full order, one to the customer with the order number. Half a day, and it is the difference between a shop and a form.

### A11. Cookie banner + Consent Mode v2 — 2d (blocks all measurement, and it is law)
Poland's PKE has been in force since 10 Nov 2024; art. 399 requires prior granular consent for non-essential storage, with UKE able to fine, and art. 399(3) exempts cart/session (so the localStorage cart is fine). `/polityka-prywatnosci` currently claims "technically necessary cookies only" — false the moment a tag lands. Consent Mode v2 has been mandatory for EEA advertisers since 6 March 2024 and Google began disabling ad features on non-compliant accounts from 21 July 2025; Clarity has enforced `consentv2` for EEA visitors since 31 Oct 2025.
Note the free CMP tiers do **not** fit 230+ URLs (Cookiebot free caps at 50 subpages; CookieYes free disables the banner above 5 000 monthly pageviews). Budget ~$30/mo or build it in-house (~150 lines: `gtag('consent','default',{...denied})` before any tag, `update` on accept, all four v2 signals).

### A12. Make the newsletter list legally mailable — 0.5d
`app/api/newsletter/route.ts` stores `{email}` and nothing else. No consent timestamp, no source URL, no consent-text version, no double opt-in, no dedupe, no unsubscribe token, and the footer form has no checkbox — only a sentence. GDPR Art. 7(1) requires you to *demonstrate* consent; you cannot, from a table of bare strings. Cheapest fix: post straight to the ESP with double opt-in and let it own consent proof, dedupe and unsubscribe. Add a separate unticked marketing checkbox at checkout, distinct from terms — PKE art. 398 requires **per-channel** consent, so one "marketing" box does not cover SMS.

### A13. Rate-limit and secure the two API routes — 0.5d
No `middleware.ts`, no rate limiting, no honeypot, no origin check on either route. Once confirmation email exists, an open `/api/order` is a way to send mail from your domain to arbitrary addresses. Add an IP limiter (5 orders / 3 signups per hour) plus hidden honeypot fields before the domain is public.

### A14. Move the Supabase credentials and verify RLS — 0.5d
`lib/supabase.ts:6-9` hardcodes the project URL and the anon JWT as committed fallbacks. The code comment claims "RLS allows INSERT only — nothing can be read back", but a live `GET /rest/v1/goya_orders` with that key returns **HTTP 200 `[]`** (a nonexistent table returns 404), so the table is reachable for SELECT and the claim is unproven — it is empty today only because no orders exist. The tables also live inside a Supabase project shared with an unrelated "KingsCup" app, which is a GDPR segregation problem once real names, addresses and phone numbers land. Rotate the key (it's in git history), move to env vars, give Goya its own project.

### A15. Fix the two cart/stock bugs that produce wrong orders — 0.5d
- **Duplicate cart lines on 87 SKUs.** `ProductCard.tsx` calls `add()` with no key, so `lib/cart.tsx:70` falls back to `slug`. `ProductView.tsx:105` builds `${slug}-${selected?.id ?? "x"}`. For the 87 products with zero variations the keys differ (`slug` vs `slug-x`), so adding the same pair from a grid tile and from its PDP creates **two lines, "2 produkty", and a doubled subtotal** the stepper cannot merge. One-line fix: `key: selected ? \`${slug}-${selected.id}\` : slug`.
- **Sold-out variants are sellable.** `Variation.inStock` is declared in `lib/types.ts:7`, populated by the fetch script, and **referenced nowhere else in the codebase** (confirmed by grep). 25 out-of-stock variations across 22 products are selectable, and `ProductView.tsx:40` auto-selects `variantOptions[0]` with no stock check, so on several products the pre-selected default is the sold-out colour. Disable OOS swatches, initialise to the first in-stock variant, and swap the CTA to "Powiadom o dostępności".

### A16. Pull the 19 products whose only photos are an empty case — 0.5d
Verified by hashing every referenced file: `public/products/575_5.jpg` and `575_6.jpg` (a closed case, and an open case with pouch) are shared by 21 products, and for **19 of them these are the only two images in the gallery** — no photo of the frame anywhere. Those 19 render a black lozenge as the catalog thumbnail, the PDP hero, the OG share image and the JSON-LD primary image. That is 11% of the catalogue asking 349-499 zł for a product the customer cannot see. Suppress them from listings and the sitemap until they are shot.

### A17. Free-now-expensive-later: URLs, price ledger, order fields — 2d
Do these in the same sprint because the site is not indexed yet and there is no migration cost:
- **URLs.** `lib/products.ts` swaps `p.name` to the new model names but leaves `p.slug` untouched. **Zero of 168 slugs contain the Goya model name; 160 contain an okulary.pl SKU fragment.** "Amapola" lives at `/okulary/goya-g-15217-cz-okulary-przeciwsloneczne-kocie-oczy-z-filtrem-polaryzacyjnym`. Every canonical, sitemap entry, OG url and JSON-LD `url` carries the parent shop's SKU. Move to `/okulary/<model-name>` now. Also remove the "Kod modelu" spec row from the PDP — it publishes the exact search key that finds the same frame on okulary.pl.
- **Freeze prices.** `lib/pricing.ts` derives retail from `p.priceWoo` at render time via bands (≤109→349, ≤139→399, ≤169→449, else 499). The snapshot is from 2026-06-20 and 175 of 177 wholesale prices have already moved. The next `fetch-goya.mjs` run silently reprices the storefront. Commit an explicit `price` field, and start a `price_history(product_id, price, effective_from)` ledger on day one — you need 30 days of it before you can legally show any reduction.
- **Order table fields.** Add now so they exist when tracking is wired: `order_number`, `status`, `ga_client_id`, `fbp`, `fbc`, `event_id`, `consent_ad_user_data`, `consent_ad_personalization`, `utm_source/medium/campaign`.
- **Canonical bug.** `app/layout.tsx:32` sets `alternates: {canonical: "/"}` at the root, and `/regulamin`, `/zwroty`, `/polityka-prywatnosci` all inherit it — three sitemap'd pages canonicalising to the homepage. Set canonicals per page and remove the root default so a missing one becomes a visible absence.

### A18. Resolve the okulary.pl brand collision — 3-5d of decision + execution
See §3. This is a blocker because Merchant Center, the Meta catalogue and your own brand-name SERP all depend on it, and because the decision changes what you shoot, feed and delist.

---

## B. HIGH-LEVERAGE AFTER LAUNCH

### B1. GA4 + Clarity + a consent-free first-party event log — 3d
There is no `gtag`, `dataLayer`, `gtm` or `fbq` anywhere in `app/`, `components/` or `lib/` (confirmed by grep). Three things, in this order:
- **GA4 ecommerce** wired at the three code seams that already exist: `lib/cart.tsx` (one provider covering `add_to_cart`, `remove_from_cart`, `add_to_wishlist`, `view_cart`), `Catalog.tsx`/`ProductGrid.tsx` (`view_item_list`, `select_item`, with `item_list_id` = collection slug so the City/Coast/Drive/Weekend collections become measurable), `ProductView.tsx` (`view_item`), `/api/order` (`begin_checkout`, `purchase`). `purchase` requires `transaction_id` — that is why A7 generates an order number.
- **A cookieless server-side funnel log** as the source of truth. With a compliant equal-prominence banner, roughly half of EU visitors reject, so GA4 will show you ~40% of reality — and **Goya is structurally ineligible for GA4's behavioural modelling** to fill the gap (it needs 1 000 daily denied events for 7 days *plus* 1 000 daily consented users for 7 of the prior 28 — i.e. ~30 000 consented users/month). Add `app/api/track/route.ts` writing `{event, path, slug, session hash, ts}` with no persisted identifier. This is also why you should **not** buy server-side GTM (Stape $19-99/mo, Cloud Run ~$90/mo floor): it exists to feed a modelling feature you don't qualify for. The one server-side event worth building is `purchase`, fired from the payment webhook via plain `fetch()` to Meta CAPI + GA4 Measurement Protocol.
- **Microsoft Clarity** (free, no session cap) behind the banner with the `consentv2` call. **A/B testing is mathematically impossible for Goya for about a year** — detecting a 20% relative lift on a 1.5% baseline needs ~26 000 users per arm, ~10 months at 5 000 sessions/month. Watching 30-50 session replays needs no statistical power at all. Deprioritise any CRO agency proposing split tests until ~500 orders/month.

Fire `purchase` **only from the payment webhook**, never from form submit — otherwise you feed Meta and Google a "converter" definition that includes everyone who typed an address and never paid. Gate CAPI on `ad_user_data`/`ad_personalization`: server-side is not a consent workaround, hashing an email server-side is still processing personal data.

One free advantage worth exploiting: `/api/order` already captures email, first name, last name, street, postal code, city and phone — that is `em, ph, fn, ln, ct, zp, country`, essentially every high-value Meta matching parameter, with zero additional collection. Normalise + SHA-256 them in the webhook and you get a top-decile Event Match Quality on day one for the cost of a `crypto` helper (Meta's average advertiser sits at 4-6 out of 10; the ideal band for Purchase is 8.8-9.3).

### B2. Real reviews, on a 3-6 month runway — 2d setup, then patience
Reviews are the direct replacement for what A2 deletes, and they are gated behind orders, so start the clock immediately. Google Product Ratings need **50 reviews across all products and 3 per product** before any star shows, plus up to 2 weeks onboarding. Sequence: payments → order store with email → automated invite at delivery+7-14 days → Google Customer Reviews via Merchant Center (free, also feeds Seller Ratings, which need 100 unique reviews in 12 months at ≥3.5 stars).

Three things that make this work faster:
- **Concentrate the catalogue.** Putting 10 reviews on each of 177 SKUs needs ~1 770 reviews. Launch with 24-30 hero SKUs indexed and display reviews at three levels — shop-wide, model-family (all aviators share fit feedback), SKU — so a new product is never naked.
- **Seed legally.** Giving a free product for an *unconditional, disclosed* review is permitted; paying for reviews, conditioning on positivity, or hiding the incentive is not. Run a 60-100 person tester cohort across face shapes, publish every review with a visible machine-readable label ("Tester Goya — otrzymał produkt bezpłatnie, opinia niezależna") mirrored in `Review` markup. This doubles as the first real UGC and the first Instagram grid.
- **Do not target 4.8.** Spiegel/PowerReviews found purchase likelihood peaks around **4.2-4.7 and declines in the 4.7-5.0 band** — near-perfect ratings read as fake, more so on expensive items. Publish 1-3 star reviews, reply publicly, show the distribution bar. Selective publishing is itself an unfair practice under Omnibus.
- **Photo reviews with fit tags** are the format that matters for eyewear: ask for a photo plus face shape and "noszę okulary korekcyjne tak/nie", then add a PDP filter "Pokaż opinie osób o podobnej twarzy". `components/LookbookFeed.tsx` already has the rendering pattern — it's currently fed by AI imagery instead of customers.

*Careful with migrating okulary.pl reviews for identical SKUs:* it is genuinely tempting and the SKUs really are the same physical frame, but it only stays legal with explicit, unmissable provenance ("Opinia klienta sklepu okulary.pl, który kupił ten model"). Get it reviewed before shipping.

### B3. Make the category pages actually contain products — 3d, the single biggest organic-traffic bug
`app/okulary/page.tsx`, `/przeciwsloneczne` and `/korekcyjne` wrap a client `<Catalog>` (which calls `useSearchParams()`) in `<Suspense>`, so Next bails out of prerendering. Measured on the build output: **`/okulary` is a 380 KB HTML file containing 753 characters of visible text, no `<h1>`, and zero links to any of the 168 PDPs** — while the ItemList JSON-LD in the same file claims 168 items. These three URLs target the highest-volume Polish head terms, carry sitemap priority 0.9, and are the primary internal-link path to every product. `/kolekcje/[slug]` renders fine server-side (88 PDP links, 9.4k chars), which proves the fix is the Suspense/`useSearchParams` boundary, not client components. Render the default grid server-side and let the client Catalog hydrate over it. Verify: `grep -c 'href="/okulary/' .next/server/app/okulary.html` must go 0 → >24.

While you're there: **paginate at 24-36 with real `<Link>` anchors** (`/kolekcje/okulary-czarne` is currently 745 KB of HTML mounting 88 client-component cart subscribers), and convert `ProductCard` to a server component with a tiny client island for the heart and the add button.

### B4. Photograph the top 30 SKUs — one photographer day
Sales are extraordinarily concentrated in Goya's own data: **top 10 SKUs = 37.3% of the 1 070 units ever sold, top 20 = 53.7%, top 30 = 65.4%, top 50 = 81.1%**, median SKU = 2 units, 50 SKUs at zero. Meanwhile 49 of 177 SKUs have exactly one image, 103 have ≤2, and **24 of the top 30 have ≤2**. This turns an unaffordable 177-SKU project into a one-day 30-SKU shoot. Fixed 6-frame shot list: front packshot, 3/4 hero, full side showing temple + hinge, folded flat, on-model front at *consistent framing so widths compare across models*, and a scale shot. Note all 30 top sellers are sunglasses — zero optical frames appear in the top 30.

Also fix alt text while the shoot is being planned: **540 product images resolve to only 11 distinct alt stems, and 143 of 168 products still carry the retired WooCommerce SKU in their alt** ("G 55004" on a page whose H1 says "Nerja"). Generate alts from structured fields at render time — zero new data required.

### B5. Answer "will these fit my face" — 3d, and Goya has 176/177 of the data
The blocking objection in online eyewear is fit, and Goya already owns the best answer without a camera or a vendor: `templeLength` on 176/177 SKUs, `frontWidth` + `lensHeight` on 100/177, with **only 2 of the top-30 sellers missing `frontWidth`** — the data is densest exactly where sales are. Build:
- The mm spec in standard `52□18-140` notation with a labelled diagram.
- **"Porównaj ze swoimi okularami"**: the shopper types the three numbers printed on their current temple arm and gets "3 mm szersze niż Twoje obecne — nieco większe". This converts a subjective question into an objective one.
- A 1:1 scale strip calibrated against a payment card or dowód osobisty (both ISO/IEC 7810 ID-1, 85.6 mm).
- Promote the existing Wąskie/Uniwersalne/Szerokie fit scale **out of the closed `<details>` accordion** at `ProductView.tsx:428` and above the buy row. Currently the accordion that opens by default is "Opis produktu" — the least decision-relevant block on the page.

Backfill `frontWidth` for the 77 SKUs missing it, at minimum for the top 30. Ace & Tate — the usual European DTC benchmark — publishes only small/regular/large/XL and two soft heuristics. This is a gap to beat, not copy.

### B6. Wire the face-shape guides into a recommender — 2d, all the data already exists
Three disconnected islands: `lib/guides.ts` has five face-shape articles, `lib/collections.ts` has nine shape collections, and all 177 products carry a `shape` field (Prostokątne 46, Aviator 37, Kocie 28, Nerdy 14, Okrągłe 12, Muchy 10…). Nothing connects them. Three cheap links: (a) a PDP badge "Dobre do twarzy: okrągłej, kwadratowej" linking to the guide; (b) a live product rail at the end of each guide, filtered to recommended shapes and sorted by `totalSales`, so SEO traffic lands on buyable product instead of dead-ending; (c) a 4-question finder resolving to a `/kolekcje` result. Frame it as style, not optical advice.

### B7. Own the driver cluster instead of chasing head terms — 4d
"okulary przeciwsłoneczne (polaryzacyjne)" returns Allegro, Ceneo, Kodano, Fielmann, Vision Express, Ray-Ban — unwinnable for a new domain (Ahrefs 2025: ~5.7% of new pages reach the top 10 within a year). But **"okulary polaryzacyjne dla kierowców" surfaces thin affiliate "ranking 2026" pages** (rankingpro.pl, ekamienpomorski.pl, czerwonakartka.pl) with no real retailer in the top results. That is a weak SERP a brand with 177 real SKUs can take, it carries explicit purchase intent, and it is **counter-seasonal** — low winter sun and wet roads are a genuine Q4/Q1 use case.

Make `/kolekcje/drive` a real hub, not a filter view: original photography shot through a windscreen, why polarisation kills wet-asphalt glare, the filter-category vs UV400 distinction (constantly conflated), the "kategoria 4 jest niedozwolona do jazdy" warning, an internal-linked grid. Then clone the pattern for "na ryby", "lenonki damskie polaryzacyjne", "kocie oko", "aviatory męskie".

Note two collections currently share an **identical filter function** — `okulary-polaryzacyjne` and `okulary-dla-kierowcow` both use `and(isSun, p => p.polarized)`, returning the same 88 products, and 88 of 91 sun products are polarized so `/przeciwsloneczne` is a third near-identical grid. Differentiate the *sets*, not just the prose: make the driver page a curated 24-30 model subset (category 3, larger front width, non-mirrored lenses, aviator/prostokątne/sportowe).

Also: `app/robots.ts` currently leaves every facet query URL crawlable. Add `Disallow: /*?*` and promote 15-25 demand-backed combinations to static `/kolekcje/<slug>` routes with ≥8 products and 150-250 words of specific copy each.

### B8. Rewrite the product copy — 4d, and it is a brand problem more than an SEO one
Replicating the PDP transform over the live catalogue yields **30 distinct description bodies for 168 products**. The largest group — **58 products** — reads: *"Produkt nowy - posiadają oryginalne zabezpieczenia, metkę oraz instrukcję użytkowania…"*. That is marketplace copy about security tags, written to prove goods are not stolen, on a page asking 449 zł from a design-conscious buyer. 76 of 168 open with the same shouty line, which `productLd()` then feeds to Google and AI assistants as the product description. And **89 of 168 are exactly 1 100 characters ending mid-word** (`fetch-goya.mjs:108` does an unconditional `.slice(0, 1100)`) — real endings include *"...pozwala na bardziej komfortowe widzen"*.

Write ~15 reusable blocks keyed on shape × category × lens colour plus one hand-written line per model tied to its Spanish name. Store in `content/product-copy.ts` alongside `content/model-names.ts` so re-scraping never overwrites it. Same pass fixes the meta descriptions: `productMetaDescription()` appends `cleanText()` without applying the `humanizeCaps()` helper that already exists, so **all 168 contain an ALL-CAPS run and average 201 chars** (truncated in every SERP), and 7 read "okulary inne przeciwsłoneczne".

### B9. Email capture and abandoned cart — 3d, the largest addressable leak
Polish e-commerce cart abandonment is **82%** (e-Izba "Omni-commerce. Kupuję wygodnie 2025", n=2 418, up 7pp YoY). The leading stated reasons are delivery method/cost (~15%), unclear returns policy (15%) and no preferred payment method (~12%) — which is exactly what A7/A9/A5 fix. *(A widely-repeated "39% abandon because checkout takes too long" is a misreading: in that report 39% is the share who **finalise on a smartphone** — which is its own instruction: checkout must be mobile-first.)*

Today there is nobody to email: `Checkout.tsx` posts the whole form once and email is requested only at the end. Capture email as field one and POST a `checkout_started` row on blur. Then a 3-email sequence at 1h / 24h / 72h (three-email sequences recover ~40% more than single emails; Klaviyo benchmarks put abandoned-cart flows at ~50.5% open, 6.25% click, 3.33% placed-order). Rough model: 5 000 sessions → ~550 add-to-cart → ~410 abandoned → ~250 reachable → 8-19 recovered orders/month at ~400 zł. The tool is free to 250 contacts.

**Do not use a discount popup for the capture.** The generic advice (2.4% vs 1.7%) is actively harmful here: stacking "-10% na start" on top of the compare-at problem creates a second price-claim violation, and it teaches the customer the 449 zł is not real — the exact failure mode of the whole repositioning. Use the `/poradnik` fit guide, early access, or the tester programme as the value exchange.

### B10. Google Merchant Center free listings — 4d, and it is free
The only way a zero-authority domain reaches transactional queries in month one. Prerequisites, in order: custom domain → payments live → **self-hosted images** → domain claim → shipping + 30-day returns configured *in Merchant Center* (not just JSON-LD) → feed generated from the same data as `app/sitemap.ts`.

Getting the identifiers right matters because sunglasses is one of the four apparel sub-categories where Google **requires GTIN or MPN**. Currently `productLd()` sets `sku: p.slug` (a 50-char URL slug) and `mpn: String(p.id)` (the WooCommerce post ID) — both wrong, and the real SKUs are sitting in `p.variations[0].sku` and `p.code`. Set `brand=Goya`, mint your own MPNs from the new model names (`GOYA-AMAPOLA-CZ`, never the G-code), and **never reuse the parent's identifiers for the same frame** — a matching identifier is the strongest clustering key Google has, and it will merge your 449 zł offer with okulary.pl's 111 zł one. Also: 81 of 168 products are variable with 22 having out-of-stock variations while availability is computed only from the parent `stockStatus` — an availability mismatch is a documented suspension trigger. Emit `ProductGroup` + `hasVariant` with per-variation availability.

### B11. Package inserts in okulary.pl parcels — 1d, the cheapest compliant acquisition channel
No consent gate, no auction, perfectly qualified audience: every recipient just bought eyewear. QR to a dedicated landing page, a unique code, and email capture as the *primary* CTA so you build a consented list rather than chasing one sale. Third-party insert programmes average 0.35% conversion, but those place unrelated brands in unrelated parcels — the relevance here is total. Print cost is the whole cost. This is also how you seed the pixel with real purchase events before spending anything on ads.

### B12. Meta: Reels-only, manual, small — 5 000-8 000 zł creative + 2 500 zł/mo
Polish 2026 placement benchmarks split hard: Reels CPM 8-22 zł at 1.5-3.0% CTR vs Feed CPM 18-45 zł at 0.9-1.5%. At midpoints that's ~0.68 zł vs ~2.50 zł per click — roughly 45 zł vs 167 zł CAC at a 1.5% site conversion rate. **Do not launch static catalogue images into Feed.** Commission 12-15 vertical UGC videos first (Polish UGC creators: 200-400 zł beginner, 500-1 000 zł portfolio, 1 500-2 000 zł experienced — negotiate paid usage rights up front and buy raw files). Two angles the data already validates: the polarisation demo and fit-on-face for the top 6 shapes.

Structure: one manual CBO campaign, one broad ad set (PL, 30-50, no interest stacking), Reels + Stories only, Feed for retargeting. **Optimise on `begin_checkout`, not `purchase`, until you exceed ~50 purchases/week** — Meta's Advantage+ threshold is 25 conversions/week (lowered from 50 in April 2026) and below ~15 it is the wrong tool; at a 120 zł CAC, 25/week is ~13 000 zł/month. Google PMax is worse at this stage: it recaptures demand, and there is no demand for a brand nobody has heard of. Meta creates it; Google harvests it later.

**Hard gate before any spend:** a real 400 zł test order must produce a matching `paid` row, a GA4 `purchase` with the right `transaction_id` and PLN value, and a CAPI event showing both Browser and Server sources in Events Manager.

### B13. Unit economics guardrails — 0.5d, do it before the first złoty
Modelled on 399 zł: net of VAT 324 zł, minus ~60 zł COGS (inferred from the parent's retail — verify against actual invoices), ~15 zł packaging, ~12-18 zł InPost, ~1.2% payment fee, and a 15% return rate at ~25 zł each → **~229 zł contribution before marketing, 1.74× break-even ROAS, 133 zł allowable CAC at a 3× target.** At 349 zł it's ~189 zł / 1.85×; at 499 zł ~309 zł / 1.62×. **That headroom is entirely a product of the repositioning** — at okulary.pl's 149 zł the same frame has ~45 zł of contribution and cannot fund a single Polish Meta click at scale. Set target CAC 130 zł, hard stop 180 zł, and track contribution per order, not revenue. *(The InPost figure needs verifying against the current business cennik — the number circulating in research did not survive fact-checking, and business rates are volume-tiered and quoted net of VAT.)*

### B14. Build the polarisation demo — 1d, Goya's only demonstrable premium justification
95 of 177 SKUs are polarized, and polarisation is the rare eyewear attribute you can *show*: an interactive before/after slider on wet asphalt or water, reused on `/poradnik/polaryzacja-czy-uv400` and as paid-social creative. Pair it with "how to verify it yourself" (rotate the glasses 90° against a phone screen — it darkens), which turns a claim into something the customer tests on arrival. Add a compact ISO 12312-1 / CE / filter-category chip near the price and publish the actual declaration of conformity on a `/jakosc` page — sunglasses are Category I PPE under EU Reg. 2016/425 and the paperwork is a hard prerequisite for marketplaces anyway. **Style photography cannot carry a 3× markup when the shopper can see it's the same frame; a demonstrable filter can.**
*(A striking 2023 Inspekcja Handlowa statistic about the share of non-compliant sunglasses in Poland circulates in the research. It would make excellent campaign copy — but verify it against the original UOKiK/IH publication before putting it in an ad. Using an unverified market statistic in advertising is itself an unfair-practice risk, which would be an ironic way to lose this argument.)*

### B15. Retention primitives that fit a 2-year replacement cycle — 3d
Eyeglasses replace every ~2.2 years, so any post-purchase flow measured on 90-day repeat purchase will read as a failure and get killed. Three levers that actually fit: **referral** (median ecommerce referral CVR 3-5%, referral CAC ~$45 vs ~$74 paid search; share rate rises from 12-15% to 25-30% with 3+ reminders), **optical upsell** (Goya has `/korekcyjne` and the parent is a real optical shop that can fit prescription lenses — a day-30 "te same oprawki w wersji korekcyjnej" offer is a genuine second purchase no pure DTC competitor can match), and **second pair by use case** (City/Coast/Drive/Weekend is literally a multi-pair merchandising story). Flow: day 7 care + polarisation explainer, day 10 review request, day 21 referral, day 30 optical, day 45 complementary collection. Measure on 24-month LTV and referred-order share.
Add cross-sell to the cart — `CartDrawer.tsx` currently has free-shipping reassurance and a gifts block but **zero revenue mechanics**, and `getRelated`/`getBestsellers` already exist in `lib/products.ts`.

---

## C. LATER / OPTIONAL

- **TikTok Shop Poland** — launched 15 June 2026, 2% commission for the first 90 days then 9%, BLIK and InPost as defaults, and crucially **no unified competing-seller product cards**, so your listing is not stacked against okulary.pl's 89 zł version. Register the seller account early so the 2% window overlaps a push rather than expiring unused; set affiliate commission at 15-20% (60-80 zł per sale, cheaper than Feed CAC and paid only on conversion). Requires the CE/GPSR documentation from B14. *Genuinely time-sensitive — but only after payments and legal are done.*
- **A 2D try-on built in-house** with MediaPipe FaceLandmarker (Apache-2.0, client-side, no per-use cost, no image leaves the device — a clean GDPR story), restricted to the top 30 sunglasses, with both webcam and photo-upload modes. **Do not buy 3D VTO:** vendor quotes run €22-250 per frame (Fittingbox), from $35/SKU (Auglio), $99-349/SKU + ~$99/colorway/year (Ello) — €3 900 to €44 000+ for 177 SKUs against a catalogue that has sold 1 070 units total. Reach is also limited (5-15% of PDP visitors in real implementations); photos reach 100%.
- **The 79 optical frames (45% of the catalogue, zero demonstrated demand).** Decide: build a real prescription-lens configurator (PD capture, index, coatings, a lab partner — significant scope, but the parent is an actual optical shop) or reposition them explicitly as fashion/zero-power/blue-light frames needing no prescription. Do not leave them in the ambiguous middle where they are today, sold as bare frames next to sunglasses.
- **SMS** — economics are trivially positive (SMSAPI ~165 zł per 1 000; at 400 zł AOV, 1 000 abandoned-cart SMS break even at 0.41 orders) but the constraint is consent, not cost. Checkout currently collects phone as a *delivery* field; using it for marketing is a clean PKE violation. Needs a separate unticked checkbox, E.164 storage, and an alphanumeric GOYA sender. Highest-intent moments only (+4h abandoned checkout, shipping notifications), never campaigns.
- **A paid review platform** (TrustMate ~$23-103/mo, Trusted Shops ~119 zł/mo with Ochrona Kupującego up to 10 000 zł — the strongest signal available for an unknown brand asking 400 zł). Defer Ceneo Zaufane Opinie specifically while the price gap exists, because it pulls you into the comparison ecosystem.
- **PDP OpenGraph cards** (`app/okulary/[slug]/opengraph-image.tsx`) — currently PDPs share a raw white packshot that renders as a sliver of frame at 1.91:1. The pattern already exists for guides and the homepage. Load the latin-ext font subset so Polish diacritics survive.
- **Search Console + Bing + IndexNow** — no `verification` block exists in `app/layout.tsx`; the sitemap stamps all 198 catalogue URLs with one frozen `lastmod` (2026-06-20), which Google discounts. Register against the real domain on day one.
- **Deduplicate the image pipeline** — `public/products` holds 669 committed files / 59.5 MB with 6 byte-identical pairs because `localize-images.mjs` keys on URL not content hash. Move to Blob/Cloudinary eventually.
- **Drop the generic `faqPageLd()` from all 168 PDPs** — Google restricted FAQ rich results to government/health sites in Aug 2023, so it's 168 copies of identical structured data earning nothing. Keep the bespoke per-collection FAQs; those get extracted by AI answer engines.

---

## 1. Explicitly rejected — do not revisit

| Rejected | Why |
|---|---|
| **Allegro** | Unified product cards for "Goya" already exist at 76-179 zł. You cannot win a buy box against your own parent's listing on the same card. Moda commission is ~11.5%/7.5% plus a new Smart! seller fee of 7.99-9.99 zł on 150+ zł orders from 2 March 2026. Revisit only with genuinely distinct products and own GTINs, after 12 months. |
| **Ceneo CPC** | Ranking is price-ordered, ~70% of clicks go to TOP3, CPC 0.27-1.03 zł prepaid with a 375 zł minimum deposit. You would pay for clicks from the single most price-sensitive audience in Poland to land on a 3-4× priced identical product. The cheapest possible way to buy a 0% conversion rate. |
| **Server-side GTM** | Exists to recover data via GA4 behavioural modelling, which needs ~30 000 consented users/month. Goya is structurally ineligible for years. $19-99/mo (Stape) or ~$90/mo (Cloud Run) for a feature that won't turn on. |
| **Home try-on** | Warby Parker — which invented it and told investors it "pays for itself" — is sunsetting it. In Poland, Muscat's Domowa Przymierzalnia (5 frames, free both ways, card deposit) already owns the niche. Shipping 5 × 349-499 zł round-trip per prospect, on a site that cannot even take the deposit. Spend the risk-reversal budget on a prepaid return label instead: ~10-15 zł, and it only fires on the minority who return. |
| **Discount / welcome-code popup** | Compounds the Omnibus problem and teaches the customer the price isn't real. |
| **A free-shipping threshold** | With a 349 zł entry price every order clears any sensible threshold, so a threshold adds a hesitation point and a number to compute for zero economic gain. A rare case where the standard "set it 10-20% above AOV" advice is simply wrong. |
| **`llms.txt`** | Google's Mueller (June 2025): no AI system currently uses it; Illyes confirmed no Google support and no plans. No major provider reads it in production. The existing AI-crawler allowlist in `app/robots.ts` is the thing that actually works — keep it, and verify no Vercel WAF rule silently blocks those user agents. |
| **A/B testing tools** | ~26 000 users per arm for a 20% lift on a 1.5% baseline. Ten months per test. Use Clarity replays. |
| **Advantage+ / PMax at launch** | Both starve below their conversion thresholds and burn budget in permanent learning. |

**Numbers that did not survive fact-checking — do not reuse them:** "52% of Poles motivated by multiple payment methods" (not in the Gemius report); "lockers = 50% of orders vs courier 38%, courier preferred by 50+" (a misread of declared-preference data; lockers actually lead in *every* age group, strongest among the youngest); "39% of Poles abandon because checkout is slow" (that 39% is the share who *finalise on a smartphone*); "P24 activation 1.50 zł / 2-5 day verification" and "PayU 199 zł activation / 0.99% / 1-2 day verification" (unverified or superseded by the providers' own pages); "InPost 14.55 zł gabaryt A" (unverifiable — check the current cennik and note whether it is net or gross); "InPost Pay 10m+ users of 15m app users" (actual: ~8.5m registered InPost Pay, ~13-14m app); "Baymard 7-8 fields vs 14.88 average" (current Baymard figures are ~8 optimum vs ~11.3 average); the IMAS/Rzetelna Firma percentage battery (84% delivery / 82% contact / 45% reviews / 86% for 45-54 / 83-74-59 for 18-24 — none traceable to a primary release; only the *directional* finding that the 35-54 bracket is most willing to try unknown shops holds, and the ~40% figure is the all-Poles headline, not a youth sub-figure); the "ASOS 12 images → 18% mobile conversion" and "66% of Warby Parker home-try-on users purchase" claims (both trace to SEO blogs and a hobbyist Medium post with invented numbers).

---

## 2. Does Goya need a database (Supabase) right now?

**Yes — but a much smaller one than it has, and for exactly three reasons. Payment provider + email + spreadsheet is not enough.**

The honest test is: what breaks without a database? Three things, and all three are load-bearing:

1. **Webhook idempotency.** A payment webhook can fire twice. Without a durable, uniquely-keyed row you cannot tell a retry from a second order, and you will double-ship or double-count revenue. A spreadsheet cannot enforce a unique constraint under concurrent writes.
2. **The pending→paid transition.** The order has to exist *before* the customer reaches the payment page (with a server-computed total, per A7) and be flipped *after* the webhook. That is a two-phase write to shared state. The PSP dashboard holds the money record, but it does not hold your line items, variant IDs, or locker code.
3. **The Omnibus price ledger.** You need 30 days of real price history per SKU before you can legally display any reduction, and you need it queryable. This is the item people forget, and it is the one that becomes unrecoverable if you skip it — you cannot backfill a price history you never recorded.

Everything else that people reach for a database for, **do not build**: no admin panel, no CMS, no customer accounts, no order-status page, no analytics warehouse. The catalogue stays in git.

**Concrete recommendation:**
- **Keep Postgres, three tables:** `orders` (with `status`, `order_number`, `psp_reference`, an idempotency key, and the attribution/consent columns from A17), `order_items`, `price_history`. That's it.
- **Move it to its own project** with env-only credentials — today it shares a project with an unrelated "KingsCup" app and the anon key is committed to git with an unverified RLS posture (A14). Customer names, street addresses and phone numbers must not sit in another product's blast radius.
- **Pay for it, or move it.** Supabase free-tier projects are documented to auto-pause after roughly a week of inactivity — and a pre-launch shop is by definition inactive, so your only order path can be dead on the morning of your first real sale. Either upgrade to the paid tier (~$25/mo, trivial against a 229 zł contribution per order) or move to Vercel Postgres/Neon, which keeps everything on one vendor. Verify the current auto-pause policy before deciding.
- **The email list lives in the ESP, not in Postgres.** The ESP owns double opt-in, consent proof, dedupe, unsubscribe and deliverability — all things `goya_newsletter` currently fails at (A12). Delete that table.
- **The money record lives at the PSP.** Amount, buyer email, timestamp, status, refunds, and a searchable dashboard, for free.
- **Fulfilment: push orders into okulary.pl's WooCommerce** via `POST /wp-json/wc/v3/orders` — `scripts/fetch-goya.mjs` already authenticates against that API with credentials you hold, and WooCommerce line items accept an explicit `total`, so you can post 449 zł against a frame Woo lists at 104.30. That buys you pick lists mapped to the SKUs already in `code`, stock decrement, invoicing, courier integration and returns, for a day of work. **Only if Goya is the same legal entity** — if it is separate, VAT and invoicing make this wrong, and you use email + a Sheets append instead.

**Do not build a spreadsheet-only order flow.** It fails the idempotency test and the price-ledger test, and it is more work to migrate off in three months than to do correctly now, while the correct version is still a two-hour schema.

---

## 3. The okulary.pl question — the asset and the trap

**The situation, verified live:** `okulary.pl/product-category/marki/goya/` returns "Wyświetlanie 1-36 z 150 wyników", prices **76.30-179 zł**, all showing a permanent "-30%". Goya's own `data/products.json` carries the parent's exact slugs — `goya-eight.vercel.app/okulary/goya-g-15217-cz-…` sells "Amapola" at 349 zł while `okulary.pl/product/goya-g-15217-cz-…` sells the same G 15217 at 109 zł. Median multiple across the catalogue is ~3-4×. "Goya" is also already a brand facet on Allegro and indexed on Ceneo. Product images are still hotlinked from okulary.pl (`next.config.ts` allow-lists the domain).

So: **same brand name, same photographs, same URL slug, same model code printed on the PDP, one quarter of the price, on a site with thirty years of authority.** The Spanish model renaming protects against text-level duplicate content and does nothing about any of that.

### The risk, stated precisely
- **Brand-entity cannibalisation.** The one query class a new DTC site can realistically win in year one is its own name, and "okulary Goya" currently resolves to the parent.
- **Google Shopping clustering.** Offers are grouped partly by image and by identifier. Byte-identical photos make it trivial for the price-comparison module to put the 449 zł offer next to the 111 zł one, with a "compare prices" link.
- **Merchant Center misrepresentation.** One legal entity operating two sites selling the same products at 3× different prices, with images hosted on a domain the merchant does not own, is a plausible account-level suspension — which would kill Shopping before you ever start.
- **Trust collapse.** ~71-88% of Polish shoppers compare prices before buying. A 3-4× gap on the same brand name and the same photo does not read as a premium repositioning; it reads as a scam. And the fake 599 zł anchor (A3) makes it worse: the shopper who finds 109 zł elsewhere sees an invented anchor *and* a real price at the same moment.

### The doctrine — decide this before spending anything on SEO or ads
**Carve out an exclusive SKU set.** Use `totalSales`, already in the repo, to pick the 25-30 sun SKUs that carry 65% of demand. **Delist exactly those from okulary.pl, Ceneo and Allegro**, and sell them only under Goya. Leave the long tail on okulary.pl under a different house label (Polariss/Joker already exist there) — that turns the overlap from a conflict into clean channel separation. If the parent will not delist, the fallback is to rename the okulary.pl-facing line so **"Goya" resolves to exactly one price point.** Do not launch with both live under the same name.

Alongside that, in the same sprint:
- Move to `/okulary/<model-name>` slugs and remove the "Kod modelu" row (A17) — this closes the discovery path.
- **Self-host every image, and re-crop or re-light rather than re-uploading the same files** so the assets are not perceptually identical. Then remove `okulary.pl` from `next.config.ts` `remotePatterns` so it cannot regress.
- Mint your own MPNs/EANs and **never reuse the parent's identifiers for the same frame** (B10).

### The opportunity — which is genuinely larger than the risk
Goya's real problem is not that okulary.pl exists; it is that Goya is pretending it does not. Declared openly, the parent supplies on day one everything a new DTC brand normally spends a year buying:

1. **A verifiable legal identity and thirty years of trading history.** "Goya to marka własna okulary.pl — polskiego sklepu optycznego" solves A4's trust problem and makes the price difference *explainable as a different product configuration* rather than a caught-out markup. Replace the unverifiable "od 2019" with something true and stronger.
2. **1 070 units of real Polish demand data**, already in the repo, which most brands would pay an agency to guess at. It should drive the SKU carve-out, the launch feed (a sparse feed of proven sellers trains Meta faster than 177 items with no conversion history), the shot list, the homepage ordering, and the default catalogue sort.
3. **A compliant email channel.** You cannot export the parent's list into a Goya ESP — PKE art. 398 requires prior, per-channel, purpose-specific consent, and UODO fined Fortum 4 911 732 zł over a mishandled marketing database. But promoting Goya *inside okulary.pl's own newsletter* is that controller's own-product marketing, with a double-opt-in CTA to a separate Goya list. That migrates the willing with no transfer. Have the parent's consent wording reviewed first.
4. **Package inserts** (B11) — no consent gate at all, perfectly qualified audience, print cost only.
5. **Fulfilment infrastructure** via the WooCommerce API you already have credentials for (§2).
6. **Real reviews for identical SKUs**, if and only if provenance is labelled unmissably (B2).
7. **A measurable answer to the only question that matters.** Add okulary.pl to GA4 cross-domain measurement and the referral exclusion list, tag every parent-store link with UTMs, and persist them on the order row. Then build **one report: add-to-cart and bounce rate for okulary.pl-referred sessions vs everything else.** If cross-store visitors convert materially worse, the repositioning has a price-anchoring problem that no amount of ad spend will fix — and you will know it in week two instead of month nine.

---

## 4. Sequence

| Window | Focus |
|---|---|
| **Aug 2026** | A1-A8 (noindex, legal deletions, seller identity, gateway signed, order lifecycle rebuilt). A17 free-now fixes. The okulary.pl carve-out decision. |
| **Sep 2026** | A9-A18 complete. B1 (analytics + consent). B3 (category pages render). B4 photo shoot. Soft launch on the real .pl domain. TikTok Shop seller registration. First real reviews via the tester cohort. |
| **Oct-Dec 2026** | Zero prospecting scale — sunglasses demand is at its annual floor while Polish Q4 CPMs inflate. Sell **polarised driving glasses** and optical frames as the Q4 story (B7). Retargeting only. B5, B6, B8, B9, B14 ship. Build the creative bank. |
| **Jan-Feb 2027** | B10 Merchant Center. B11 inserts at volume. B12 creator seeding and the 12-15 UGC videos. Owned channels target: ≥25% of revenue. |
| **1 March 2027** | Open the taps. Peak spend April-July. |

**Budget the year backwards from March 2027**, not forwards from August 2026. The trough is build time, and Goya has enough to build that it should be grateful for it.