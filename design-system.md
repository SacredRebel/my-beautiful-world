# 🎨 Design System — My Beautiful World

Source of truth for anything printed: **📘 My Beautiful World — Release Update Log (Aug 5, 2026)** (Notion, 05 Docs), which supersedes the earlier *PRINT BOOK UPDATE — A4 Lock-In & Full Production Record*. The book is finished and locked; this file describes it, it does not define it.

---

## Visual Style

**Core Aesthetic:** warm, illustrated, gentle
**Mood:** Gentle, wonder-filled, timeless
**Audience:** Children (ages 2–8) and families

Every content page is one full-bleed illustration with its parts labeled in all six languages, one colour per language, the same way on every page.

---

## Print specification (locked)

| | |
|---|---|
| Printed pages | 52 — p1 opener + p2–p51 word-bearing pages + p52 closer |
| Digital PDF | 54 pages — the 52 interior pages plus front and back cover (`MBW-54pp-digital.pdf`) |
| Words taught | 305 · Page titles 50 · Translations ~2,130 (derived: 355 label groups × 6) |
| Chapters | 6 |
| Languages | English, German, Romanian, Spanish, Italian, Sanskrit |
| Trim | A4 landscape — 297 × 210 mm (11.69 × 8.27 in) |
| PDF page | 859.89 × 613.276 pt = 11.94 × 8.51 in (trim + 0.125 in bleed), TrimBox inset 9 pt |
| Final page images | 3438 × 2451 px JPEG q0.90, ≈288 PPI at A4 + bleed |
| Bleed | 0.125 in / 3.175 mm all four sides |
| Safe zone | 0.5 in from the PDF edge; 0.625 in on the binding edge |
| Binding edge | Alternates — right-hand pages bind left, left-hand pages bind right |
| Artwork | 4096 px wide, flat JPEG, **no alpha, no soft masks** |
| Print assembly | Interior printed in 4 parts of 13 sheets each |
| Binding | Lulu Hardcover Casewrap, premium colour, 80# paper |

No title page and no colophon — both retired 5 Aug 2026. Covers are separate files (`cover-front.jpg` / `cover-back.jpg`).

**Devanagari rule (design-system wide):** inside a word card the Devanagari sits on its own line directly below the IAST word (`.plate .deva-mini{display:block}` in `tokens/base.css`), so the script never overflows the blob. Page titles keep it inline.

**Backdrop system:** every page title has the unified Backdrop menu — Auto glow or painted-brush backdrop, shared transparency slider, colour wheel, and a pick-from-image eyedropper. "Painted" here is the name of a procedural print-safe rendering mode; it is never public-facing copy.

*Superseded July 2026 figures, kept for reference: 52 pages as title page + 49 content pages + closing + colophon, 300 words, 49 page titles, ~2,094 translations, 3582 × 2553 px at 300 PPI.*

Layout is baked into two lock files in raw A4 canvas coordinates: `book/part1/a4-locked.js` (the print/A4 layer) and `book/part1/locked-positions.js` (the screen layer). The print renderer reads those values verbatim and never re-scales them. Both live with the book tool, not in this repo.

---

## Typography (the book)

- **Page titles and poetic lines:** Fraunces
- **The words a child reads:** Nunito 900
- **Sanskrit (IAST):** Noto Serif italic
- **Sanskrit (देवनागरी):** Noto Serif Devanagari, small and faint

Type sizes on the A4 canvas at 300 PPI: words 49.5 px · Sanskrit 47 px · labels 27.2 px — all far above the 8 pt print minimum. A card's text block is draggable inside the card, so one long word (e.g. *bāla-śaucapātram*) can no longer force the whole card to grow over the illustration.

---

## Colour Palette (site + early prototype)

| Role | Name | Hex |
|------|------|-----|
| Background | Warm Cream | `#FDF8F0` |
| Page border / accent | Soft Sage | `#8BAF7C` |
| Primary text | Warm Bark | `#3D2B1F` |
| Chapter headings | Forest Green | `#2E5E35` |
| Accent / highlight | Golden Sun | `#D4A843` |
| Secondary bg | Parchment | `#F5EDD8` |

Per-language label colours below are from the **early five-language web prototype**. The printed book uses six languages and its per-word colours live in the locked layout file — read them from there, never from this table.

| Word labels (prototype) | Hex |
|------|-----|
| EN — Deep Indigo | `#2C3E6B` |
| DE — Warm Amber | `#8B5E1A` |
| RO — Dusty Rose | `#8B3A4A` |
| ES — Terracotta | `#8B4513` |
| IT — Olive | `#556B2F` |

---

## Languages Reference

| Language | Code | Book Title |
|----------|------|------------|
| English | EN | My Beautiful World |
| German | DE | Meine schöne Welt |
| Romanian | RO | Lumea mea frumoasă |
| Spanish | ES | Mi mundo hermoso |
| Italian | IT | Il mio bel mondo |
| Sanskrit | SA | *(Devanagari + IAST; title set in the book file)* |

---

## File Naming

| Asset | Pattern | Example |
|-------|---------|--------|
| Page HTML | `[subject-slug].html` | `oak-tree.html` |
| Image | `[subject-slug].jpg` | `oak-tree.jpg` |
| Chapter folder | `chXX-[slug]/` | `ch02-nature/` |

JPEG, not PNG. Lulu flagged 140 images carrying alpha channels during the A4 conversion; all artwork is now flat JPEG.

---

## 🗃️ Archive — the original brief (superseded)

Kept as a record of how the look was first specified, not as current instruction.

The original brief called for a *"warm handcrafted watercolour"* aesthetic on a **4:3 canvas (1448 × 1086)** with a **Playfair Display** display face, transparent or light-cream backgrounds, and this AI prompt formula:

```
[subject], beautiful detailed watercolor illustration,
botanical art style, warm earth tones, soft natural light,
children's book illustration, white background,
highly detailed, [specific color notes]
```

What changed and why:

- **4:3 → A4 landscape.** A4 with bleed is ratio 1.403 against the original 1.333 — proportionally wider and shorter. Auto-scaling was tried three times and produced unusable results, so an A4 arranging mode was built into the book tool and all 49 pages were re-placed by hand.
- **Resolution.** Original illustrations were 2263 × 1698 px, only ~190 PPI at A4. Every one was re-upscaled to 4096 px wide and re-encoded as JPEG (q88–92).
- **Playfair Display → Fraunces**, and Nunito moved to weight 900 for the child-facing words.
- **Public copy no longer says "watercolour" or "painted."** The illustrations are described as illustrated. The book is not hand-painted and the copy does not claim it is.

The original page-layout sketch, for the record:

```
┌─────────────────────────────────┐
│  ← PREV  [Chapter Title]  NEXT →│  ← navigation bar
│─────────────────────────────────│
│                                 │
│      [FULL-WIDTH ILLUSTRATION]  │  ← 70–80% height
│                                 │
│─────────────────────────────────│
│  [ENGLISH WORD]                 │  ← primary label
│  de: Wort  ro: Cuvânt           │  ← secondary row
│  es: Palabra  it: Parola        │
│─────────────────────────────────│
│  ○ ○ ● ○ ○  (page dots)         │  ← chapter pagination
└─────────────────────────────────┘
```
