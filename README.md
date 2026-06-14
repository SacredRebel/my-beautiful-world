# 🌿 My Beautiful World

> A multilingual illustrated word book for children — in **English**, **German**, **Romanian**, **Spanish** & **Italian**.

---

## ✨ About

This is a handcrafted digital word book celebrating the beauty of the natural world through warm watercolor illustrations and five languages. Every page is a doorway into a word — felt, seen, and named across cultures.

**Live Book:** https://sacredrebel.github.io/my-beautiful-world/

---

## 📚 Chapters

| # | Chapter | Pages | Status |
|---|---------|-------|--------|
| 00 | Front Matter (Cover, Welcome) | 2 | 🔲 Pending |
| 01 | The Body | 3 | 🟡 In Progress |
| 02 | Nature | 5 | 🟡 In Progress |
| 03 | Farm Animals | 7 | 🔲 Pending |
| 04 | Forest Animals | 6 | 🔲 Pending |
| 05 | The Great Ones | 5 | 🔲 Pending |
| 06 | Ocean Life | 6 | 🔲 Pending |
| 07 | Small Creatures | 6 | 🔲 Pending |
| 08 | Sky & Weather | 5 | 🔲 Pending |
| 09 | Home & Hearth | 7 | 🔲 Pending |
| 10 | Feelings | 6 | 🔲 Pending |
| 11 | Sacred & Wonders | 5 | 🔲 Pending |

---

## 🗂️ Repository Structure

```
my-beautiful-world/
├── index.html              ← Book homepage / chapter navigator
├── README.md
├── design-system.md        ← Full visual style guide
├── master-word-list.md     ← All 480 words × 5 languages
├── production-log.md       ← Page-by-page build tracker
├── assets/
│   ├── css/
│   │   └── book.css        ← Shared styles
│   └── images/
│       ├── ch00-frontmatter/
│       ├── ch01-body/
│       ├── ch02-nature/
│       ├── ch03-farm-animals/
│       ├── ch04-forest-animals/
│       ├── ch05-great-ones/
│       ├── ch06-ocean/
│       ├── ch07-small-creatures/
│       ├── ch08-sky/
│       ├── ch09-home/
│       ├── ch10-feelings/
│       └── ch11-sacred/
└── pages/
    ├── ch01-body/
    ├── ch02-nature/
    ├── ch03-farm-animals/
    └── ...
```

---

## 🖼️ Image Workflow

1. **Generate** image in Magica (AI image tool)
2. **Download** to sandbox
3. **Commit** to `assets/images/chXX-name/` in this repo
4. **Reference** via GitHub raw URL in HTML pages
5. **GitHub Pages** serves everything live

---

## 🌐 Languages

| Language | Code |
|----------|------|
| English  | EN |
| German   | DE |
| Romanian | RO |
| Spanish  | ES |
| Italian  | IT |

---

## 📖 Design

See [`design-system.md`](./design-system.md) for the complete visual style guide — colors, typography, layout rules, and illustration style.

---

*Built with love, watercolors, and five languages. 🌿*
