# 🎨 Design System — My Beautiful World

Source of truth for anything printed: **📘 PRINT BOOK UPDATE — A4 Lock-In & Full Production Record** (Notion, 05 Docs). The book is finished and locked; this file describes it, it does not define it.

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
| Printed pages | 52 — title page + 49 content pages + closing + colophon |
| Words taught | 300 · Page titles 49 · Translations ~2,094 |
| Chapters | 6 |
| Languages | English, German, Romanian, Spanish, Italian, Sanskrit |
| Trim | A4 landscape — 297 × 210 mm (11.69 × 8.27 in) |
| PDF page | 303.53 × 216.24 mm = 11.94 × 8.51 in (trim + 0.125 in bleed all sides) |
| Pixels | 3582 × 2553 px at 300 PPI |
| Bleed | 0.125 in / 3.175 mm all four sides |
| Safe zone | 0.5 in from the PDF edge; 0.625 in on the binding edge |
| Binding edge | Alternates — right-hand pages bind left, left-hand pages bind right |
| Artwork | 4096 px wide, flat JPEG, **no alpha, no soft masks** |
| Print assembly | Interior printed in 4 parts of 13 sheets each |

Layout is baked into `book/part1/a4-locked.js`: 49 pages, 371 positioned elements, in raw A4 canvas coordinates. The print renderer reads those values verbatim and never re-scales them. That file lives with the book tool, not in this repo.

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
