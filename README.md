# 🌿 My Beautiful World

> A multilingual illustrated word book for children — in **English**, **German**, **Romanian**, **Spanish**, **Italian** & **Sanskrit**.

**Status: finished and locked.** Every card, dot, title, colour, size, spacing and text offset is frozen in a baked layout file. Nothing in the printed book moves again.

---

## ✨ About

This is a digital word book celebrating the beauty of the natural world through warm illustrations and six languages. Every page is a doorway into a word — felt, seen, and named across cultures.

**Buy / read:** https://library.edenverse.earth

---

## 📐 The locked specification

Source of truth: **📘 My Beautiful World — Release Update Log (Aug 5, 2026)** (Notion, 05 Docs). If anything below ever disagrees with that document, that document wins. It supersedes the July *PRINT BOOK UPDATE — A4 Lock-In* figures (300 words / 49 content pages), which are kept in the archive section at the bottom.

| | |
|---|---|
| Printed pages | **52** — p1 opener + p2–p51 word-bearing pages + p52 closer |
| Digital PDF | **54 pages** — the 52 interior pages plus front and back cover (`MBW-54pp-digital.pdf`). This is the file buyers receive. |
| Words taught | **305** |
| Word-bearing pages | **50** (p2–p51, including the new p51 Bedtime page) |
| Page titles | **50**, each in all six languages |
| Total translations | ~2,130 (355 label groups × 6 languages) — derived from 305 words + 50 titles |
| Chapters | **6** |
| Languages | 6 — English, German, Romanian, Spanish, Italian, Sanskrit |
| Trim size | A4 landscape — 297 × 210 mm (11.69 × 8.27 in) |
| PDF page size | 859.89 × 613.276 pt = 11.94 × 8.51 in (trim + 0.125 in bleed), TrimBox inset 9 pt |
| Final page images | 3438 × 2451 px JPEG q0.90, ≈288 PPI at A4 + bleed |
| Bleed | 0.125 in / 3.175 mm, all four sides |
| Safe zone | 0.5 in from the PDF edge; **0.625 in on the binding edge** |
| Binding edge | Alternates per page — right-hand pages bind left, left-hand pages bind right |
| Artwork | All illustrations 4096 px wide, flat JPEG, no alpha |
| Binding | Lulu **Hardcover Casewrap**, premium colour, 80# paper (coil is not offered in A4 landscape) |
| Signature check | 52 ÷ 4 = 13 ✅ (Lulu-friendly) |

There is no longer a separate title page or colophon — both were retired in the Aug 2026 pass. The front and back covers are separate files (`cover-front.jpg` / `cover-back.jpg`); Lulu casewrap takes its own wraparound file, and the digital PDF embeds them as pages 1 and 54.

**Fonts** — Fraunces (page titles, poetic lines) · Nunito 900 (the words a child reads) · Noto Serif italic (Sanskrit IAST) · Noto Serif Devanagari.

The layout is baked into two lock files that live with the book tool, not in this repo: `book/part1/a4-locked.js` (the print/A4 layer — the one that actually prints) and `book/part1/locked-positions.js` (the screen layer). Positions are held in raw A4 canvas coordinates that are never re-mapped or re-scaled at print time. Every browser edit is diffed against these files and baked, so nothing lives only in browser memory.

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

Kept because it records how the book started, not how it ended. The book shipped as **6 chapters / 50 word-bearing pages / 305 words / 6 languages**. The plan below was an early 11-chapter, 5-language sketch and was never built.

An intermediate July 2026 lock recorded **49 content pages / 300 words / 49 page titles / ~2,094 translations**, with a title page and a colophon. That was superseded on 5 Aug 2026 by the translation audit and the new p51 Bedtime page. The figures are kept here because they are what the July print tests and the first Pinterest batch were built against.

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
