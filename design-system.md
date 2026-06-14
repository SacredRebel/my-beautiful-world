# 🎨 Design System — My Beautiful World

## Visual Style

**Core Aesthetic:** Warm handcrafted watercolor  
**Mood:** Gentle, wonder-filled, timeless  
**Audience:** Children (ages 2–8) and families

---

## Color Palette

| Role | Name | Hex |
|------|------|-----|
| Background | Warm Cream | `#FDF8F0` |
| Page border / accent | Soft Sage | `#8BAF7C` |
| Primary text | Warm Bark | `#3D2B1F` |
| Chapter headings | Forest Green | `#2E5E35` |
| Word labels (EN) | Deep Indigo | `#2C3E6B` |
| Word labels (DE) | Warm Amber | `#8B5E1A` |
| Word labels (RO) | Dusty Rose | `#8B3A4A` |
| Word labels (ES) | Terracotta | `#8B4513` |
| Word labels (IT) | Olive | `#556B2F` |
| Accent / highlight | Golden Sun | `#D4A843` |
| Secondary bg | Parchment | `#F5EDD8` |

---

## Typography

### Fonts
- **Display / Chapter titles:** Playfair Display (serif) — Google Fonts
- **Word labels & UI:** Nunito (sans-serif, rounded) — Google Fonts
- **Language codes:** Nunito, bold, uppercase

### Sizes (base 16px)
| Element | Size | Weight |
|---------|------|--------|
| Book title | 2.5rem | 700 |
| Chapter title | 1.8rem | 700 |
| Word (English) | 1.4rem | 700 |
| Word (other langs) | 1.1rem | 500 |
| Language code badge | 0.65rem | 700 |
| Body / captions | 0.9rem | 400 |

---

## Page Layout

### Word Page (single subject)
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
│  ○ ○ ● ○ ○  (page dots)        │  ← chapter pagination
└─────────────────────────────────┘
```

---

## Illustration Style

**Medium:** Watercolor, loose and expressive  
**Palette:** Warm naturals — greens, ochres, earth tones, sky blues  
**Detail level:** High — botanical / nature-study quality  
**Background:** Transparent or very light cream wash  

### AI Image Prompt Formula
```
[subject], beautiful detailed watercolor illustration,
botanical art style, warm earth tones, soft natural light,
children's book illustration, white background,
highly detailed, [specific color notes]
```

---

## Languages Reference

| Language | Code | Book Title |
|----------|------|------------|
| English | EN | My Beautiful World |
| German | DE | Meine schöne Welt |
| Romanian | RO | Lumea mea frumoasă |
| Spanish | ES | Mi mundo hermoso |
| Italian | IT | Il mio bel mondo |

---

## File Naming

| Asset | Pattern | Example |
|-------|---------|--------|
| Page HTML | `[subject-slug].html` | `oak-tree.html` |
| Image PNG | `[subject-slug].png` | `oak-tree.png` |
| Chapter folder | `chXX-[slug]/` | `ch02-nature/` |
