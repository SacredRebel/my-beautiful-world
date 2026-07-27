# 🌿 My Beautiful World

> A multilingual illustrated word book for children — in **English**, **German**, **Romanian**, **Spanish**, **Italian** & **Sanskrit**.

**Status: finished and locked.** Every card, dot, title, colour, size, spacing and text offset is frozen in a baked layout file. Nothing in the printed book moves again.

---

## ✨ About

This is a digital word book celebrating the beauty of the natural world through warm illustrations and six languages. Every page is a doorway into a word — felt, seen, and named across cultures.

**Buy / read:** https://library.edenverse.earth

---

## 📐 The locked specification

Source of truth: **📘 PRINT BOOK UPDATE — A4 Lock-In & Full Production Record** (Notion, 05 Docs). If anything below ever disagrees with that document, that document wins.

| | |
|---|---|
| Printed pages | **52** — title page + 49 content pages + closing + colophon |
| Words taught | **300** |
| Page titles | **49**, each in all six languages |
| Total translations | ~2,094 (349 label groups × 6 languages) |
| Chapters | **6** |
| Languages | 6 — English, German, Romanian, Spanish, Italian, Sanskrit |
| Trim size | A4 landscape — 297 × 210 mm (11.69 × 8.27 in) |
| PDF page size | 303.53 × 216.24 mm = 11.94 × 8.51 in (trim + 0.125 in bleed all sides) |
| Pixel size | 3582 × 2553 px at 300 PPI |
| Bleed | 0.125 in / 3.175 mm, all four sides |
| Safe zone | 0.5 in from the PDF edge; **0.625 in on the binding edge** |
| Binding edge | Alternates per page — right-hand pages bind left, left-hand pages bind right |
| Artwork | All illustrations 4096 px wide, flat JPEG, no alpha |
| Signature check | 52 ÷ 4 = 13 ✅ (Lulu-friendly) |

**Fonts** — Fraunces (page titles, poetic lines) · Nunito 900 (the words a child reads) · Noto Serif italic (Sanskrit IAST) · Noto Serif Devanagari.

The layout is baked into `book/part1/a4-locked.js` — **49 pages, 371 positioned elements**, in raw A4 canvas coordinates that are never re-mapped or re-scaled at print time. That file lives with the book tool, not in this repo.

---

## 🌐 Languages

| Language | Code |
|----------|------|
| English  | EN |
| German   | DE |
| Romanian | RO |
| Spanish  | ES |
| Italian  | IT |
| Sanskrit | SA |

---

## 🗂️ What is in this repo

This repo is the **public site and delivery layer**, not the book source. The book itself is produced in the book tool and delivered as a PDF through Whop.

```
my-beautiful-world/
├── index.html          ← the landing page (library.edenverse.earth), 5-language i18n via DICT
├── thank-you.html      ← post-purchase page + print / series hand-raise forms
├── book-viewer.html    ← in-browser page viewer
├── api/                ← Vercel serverless functions
│   ├── _resend.js        shared Resend helper
│   ├── _emails.js        transactional email bodies
│   ├── _pinterest.js     Pinterest conversions API
│   ├── subscribe.js      free-sample capture
│   ├── waitlist.js       print / series hand-raise
│   ├── whop-webhook.js   purchase → file buyer + deliver book
│   ├── download.js, config.js
├── assets/             ← cover, sample PDF, real page images
├── pages/              ← early hand-built HTML page prototypes (historical)
├── RESEND.md           ← the whole email setup, in one place
├── design-system.md    ← visual style guide
├── master-word-list.md ← superseded, kept as a record (see the file)
└── production-log.md   ← superseded, kept as a record (see the file)
```

---

## 📖 Design

See [`design-system.md`](./design-system.md) for the visual style guide and [`RESEND.md`](./RESEND.md) for the complete email/capture setup.

---

## 🗃️ Archive — the original plan (superseded)

Kept because it records how the book started, not how it ended. The book shipped as **6 chapters / 49 content pages / 300 words / 6 languages**. The plan below was an early 11-chapter, 5-language sketch and was never built.

| # | Chapter (original plan) | Pages | Status at the time |
|---|---------|-------|--------|
| 00 | Front Matter (Cover, Welcome) | 2 | pending |
| 01 | The Body | 3 | in progress |
| 02 | Nature | 5 | in progress |
| 03 | Farm Animals | 7 | pending |
| 04 | Forest Animals | 6 | pending |
| 05 | The Great Ones | 5 | pending |
| 06 | Ocean Life | 6 | pending |
| 07 | Small Creatures | 6 | pending |
| 08 | Sky & Weather | 5 | pending |
| 09 | Home & Hearth | 7 | pending |
| 10 | Feelings | 6 | pending |
| 11 | Sacred & Wonders | 5 | pending |

The original image workflow (generate in Magica → commit to `assets/images/chXX-name/` → serve via GitHub Pages) was also replaced: artwork is now produced at 4096 px and assembled in the book tool, and the site is served from Vercel at library.edenverse.earth rather than GitHub Pages.

---

*Built with love, illustrations, and six languages. 🌿*
