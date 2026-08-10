# CLAUDE.md — My Beautiful World

**Read this before touching anything. Then read Notion, not local files.**

Source of truth, in order:

1. Notion → `📁 Project Vaults - Folder System` → `Children's Books` → `01 Strategy` → **📊 PROJECT STATE & MARKETING BRIEF (v5+)**
2. Notion → **📘 My Beautiful World — Release Update Log (Aug 5, 2026)** (book spec)
3. Notion → **🤖 Claude Working State — My Beautiful World** (running log)
4. `origin/main` of this repo — **never the local working copy, it goes stale**

## Settled — do not reopen

- **Public word count is "300+". Never "305".** 305 is the internal count. Page 52 of the printed book says "three hundred", so 300+ is true and does not contradict the artifact. Decided.
- **p43 The Car stays as it is.** The PDF is published. Closed.
- **Already-posted pins stay as they are**, including any carrying old figures. Closed.
- **The p47 cockpit / p27 baño / back-cover Sanskrit fixes shipped 6–7 Aug 2026.** `deliverables/BOOK-review-honest.md` predates them. Do not re-flag from it.
- **Free-sample PDF was rebuilt from the final pages** (commit `f0d7579`). Correct.
- **Spanish/Italian verification, the Sanskrit collisions, author name on cover, Lulu spine dimensions and the AI-disclosure question have all been dealt with. Do not raise them.**
- Copy standard: **"illustrated", never "painted"/"watercolour"**. No father/daughter framing, no "one little girl" in public copy.
- **TikTok is retired** (6 Aug 2026). Do not link, promote or plan for it.
- Dead stacks: Gumroad, Paddle, Mailchimp, Etsy, Amazon KDP. Do not propose returning.

## Canonical facts

Book: 52 printed pages · 50 word-bearing · 305 words (public: **300+**) · 6 chapters · 6 languages (EN/DE/RO/ES/IT/Sanskrit) · A4 landscape · ages 0–5.

Chapters: My Body 2–8 · Nature & Plants 9–15 · Animals 16–22 · My Home 23–35 · Sky & Weather 36–42 · My World 43–51.

Files: `MBW-interior-52pp-lulu-hardcover.pdf` (52pp, Lulu) · `MBW-54pp-digital.pdf` (54pp incl. covers, what buyers receive).

Funnel: Pinterest → library.edenverse.earth → free 3-page sample by email (Resend) → Whop checkout $12 (→$15) → delivery email → thank-you page (print + series waitlists).

Live: landing `library.edenverse.earth` · checkout `whop.com/checkout/plan_vcHU3P33oWwsa/` · Pinterest tag `2613187513702` · Conversions API server-side from the Whop webhook.

## Pinterest operating rules

- Pins post via the Zapier `create_pin` action, which exposes **only** title, board, image_url, source_url, description. **No alt text. No tagged topics.** Both are Pinterest-UI-only.
- **PATCH against live pins does not work through this connection** — returns empty, changes nothing. Verified three times. Live pins are edit-in-UI-only.
- Always verify a pin is not already live before posting.
- All scheduled triggers are **disabled**. The owner says when to post. Never re-enable unasked.

## Repo notes

`index.html` is ~134 KB of fully self-contained HTML — no external JS or CSS, and the `DICT` i18n object is a single ~50 KB line. Any change must be committed as the whole file. Extracting the inline JS to `assets/js/` would make future edits far cheaper.

## Landing page — state as of 9 Aug 2026

`index.html` is a single self-contained 140 KB file. No build step, no external JS or CSS.

Verified in headless Chromium: five-language switcher (EN/DE/RO/ES/IT) with zero English
leaks across 236 visible strings; both email capture forms posting; every buy button
resolving to the Whop checkout URL; Pinterest `addtocart` firing on checkout click.

Two email captures now exist. `.capture` is the class; each carries a `data-source`
(`landing-early`, `landing-offer`) that reaches Resend, so the two can be told apart.
The capture JS wires **every** `.capture` on the page, scoped to itself — do not go back
to `getElementById('capForm')`.

`wireBuy()` rewrites every `a[href="#offer"]` to `CHECKOUT_URL`. **Any link that should
not become a checkout link must not use `#offer`.** Free-sample links use `#sample`, and
a click handler sends them to whichever `.capture` is nearest rather than to a fixed
anchor. `wireBuy()` also runs on DOMContentLoaded, because markup below its `<script>`
(the peek-inside lightbox CTA) is not parsed when the script first executes — that
button was a dead in-page anchor from launch until 9 Aug.

New user-visible strings must be added to `DICT` (plain text, keyed by the normalised
English string) or `HDICT` (strings containing markup, keyed by `data-i18n-html`).
A string in neither will silently stay English for DE/RO/ES/IT visitors.
