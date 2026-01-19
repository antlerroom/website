# Antler Room Website

## What This Is

A single-page website for Antler Room, an independent digital record label. The site showcases their track record (10B+ streams, 1T+ social views), explains their strategy and services, introduces the team, and provides a demo submission form for artists. Built with a dark, lo-fi aesthetic featuring gold accents and grain textures.

## Core Value

Artists can discover Antler Room's credibility through their track record and submit finished tracks through a professional, on-brand experience.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Hero section with brand name, tagline, and CTA
- [ ] Track Record section with prominent stats grid (10B+ streams, 1T+ views, etc.)
- [ ] Strategy section explaining their approach (Socials First, In-House Infrastructure, etc.)
- [ ] Services section with four service offerings
- [ ] Team section with Vova and Joey bios
- [ ] Genres section listing their focus areas
- [ ] Partnerships section (SoundOn, Downtown, Well Overdue)
- [ ] Demo submission form with validation (Artist Name, Email, Release Name, Type, Link, Genre, Notes)
- [ ] Contact/Footer section with email links
- [ ] Navigation menu with smooth scrolling
- [ ] Dark aesthetic with gold/beige accents
- [ ] Responsive design for mobile/tablet/desktop
- [ ] Visual motifs: sunburst dividers, star patterns, grain textures

### Out of Scope

- Backend form submission handling — frontend only, can wire later
- CMS or content management — static site
- Blog or news section — not in brief
- Artist portal or dashboard — just public-facing site

## Context

**Brand Guidelines (from pitch deck):**
- Primary palette: Deep charcoal/black backgrounds with gold, beige, earthy brown accents
- Typography: Clean, all-caps sans-serif headers; minimalist sans-serif body
- Visual motifs: Circular sunburst (gold/beige radiating lines), star/twinkle patterns
- Photography style: High-grain, low-exposure, "digitally native" lo-fi aesthetic
- Data presentation: Large, bolded stats

**Logo Specification:**
- "ANTLER" — Geometric sans-serif (Inter Bold, Franklin Gothic Heavy, or Montserrat Bold), uppercase, bold/extra-bold, tight letter spacing, solid white (#FFFFFF)
- "Room" — Classic serif italic (Times New Roman Italic, Garamond Italic, or Minion Pro Italic), sentence case, regular weight, muted gold (#C5A059)
- Both words on same baseline with intentional narrow gap between them
- Background: Deep charcoal (#120E0B)
- Visual contrast between heavy modern sans-serif and delicate traditional italic serif is intentional

**Copy:** All copy provided in brief — headers, body text, team bios, form labels

**Navigation items:** SUCCESS, STRATEGY, SERVICES, TEAM, GENRES, CONTACT, plus CTA button "SUBMIT DEMOS"

## Constraints

- **Tech stack**: Static HTML/CSS/JS — no framework dependencies, fast load times
- **Form**: Frontend validation only; backend integration deferred
- **Assets**: Will need to create or source grain textures, sunburst/star SVGs
- **Fonts**: Montserrat Bold for "ANTLER" + headers, serif italic for "Room", clean sans-serif for body

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Static HTML/CSS/JS over framework | Simple site, no dynamic content needed, faster delivery | — Pending |
| Single-page with smooth scroll | Matches brief structure, modern feel | — Pending |
| Frontend-only form | Backend can be wired later (Formspree, Netlify Forms, etc.) | — Pending |

---
*Last updated: 2026-01-19 after initialization*
