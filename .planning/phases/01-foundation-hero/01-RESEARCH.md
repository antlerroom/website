# Phase 1 Research: Foundation & Hero

**Researched:** 2026-01-19
**Domain:** Static site foundation, typography, navigation
**Confidence:** HIGH

## Summary

This research covers the technical implementation approach for Phase 1 of the Antler Room website. The phase establishes the project structure, CSS foundation, navigation, and hero section using static HTML/CSS/JS without framework dependencies.

The standard approach uses Google Fonts for typography (Montserrat Bold for geometric headers, a classic serif italic like Cormorant Garamond or Lora for the elegant "Room" treatment), CSS custom properties for the color system, and native browser APIs (`scrollIntoView` with `scroll-behavior: smooth`) for navigation.

**Primary recommendation:** Use Montserrat Bold (700) paired with Cormorant Garamond Italic for the dual-font logo treatment. Implement fixed navigation with CSS `position: fixed` and native smooth scrolling via `scroll-behavior: smooth` CSS property with `scroll-padding-top` to account for the fixed header.

---

## Fonts

### Recommended Font Pairing

| Purpose | Font | Weight/Style | Why |
|---------|------|--------------|-----|
| "ANTLER" + Headers | Montserrat | 700 (Bold) | Geometric sans-serif, tight letter spacing, excellent for all-caps display text |
| "Room" in logo | Cormorant Garamond | 400 Italic | Classic Garamond-inspired serif, elegant italic, pairs beautifully with Montserrat |
| Body text | Montserrat | 400 (Regular) | Clean, readable, consistent with header font family |

### Alternative for "Room"

| Font | Character | Use If |
|------|-----------|--------|
| Lora Italic | Warmer, more humanist feel | Want slightly softer, more approachable vibe |
| Libre Baskerville Italic | Traditional book serif | Want more classic editorial feel |

### Google Fonts Load Syntax

**HTML `<link>` method (recommended for performance):**
```html
<head>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;1,400&family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>
```

**CSS `@import` method (alternative):**
```css
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;1,400&family=Montserrat:wght@400;500;600;700&display=swap');
```

**CSS usage:**
```css
/* Headers and "ANTLER" */
font-family: 'Montserrat', sans-serif;
font-weight: 700;

/* "Room" in logo */
font-family: 'Cormorant Garamond', serif;
font-style: italic;
font-weight: 400;

/* Body text */
font-family: 'Montserrat', sans-serif;
font-weight: 400;
```

### Why These Fonts

- **Montserrat** is a geometric sans-serif inspired by urban signage in Buenos Aires. It's one of the most widely used Google Fonts, works excellently in all-caps at various sizes, and has excellent weight range (9 weights available).
- **Cormorant Garamond** is inspired by 16th century Claude Garamond types. It was designed as a display face with elegant italics, making it perfect for the sophisticated "Room" treatment. It pairs harmoniously with Montserrat's geometric forms.

---

## Logo Implementation

### CSS Approach for Dual-Font Baseline Alignment

The logo displays "ANTLER" (Montserrat Bold, white) and "Room" (Cormorant Garamond Italic, gold) on the same baseline with an intentional narrow gap.

**HTML Structure:**
```html
<div class="logo">
  <span class="logo-antler">ANTLER</span>
  <span class="logo-room">Room</span>
</div>
```

**CSS Implementation:**
```css
.logo {
  display: inline-flex;
  align-items: baseline; /* Key: aligns text baselines */
  gap: 0.15em; /* Narrow gap between words */
}

.logo-antler {
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  font-size: 2rem;
  text-transform: uppercase;
  letter-spacing: 0.05em; /* Tight tracking */
  color: #FFFFFF;
}

.logo-room {
  font-family: 'Cormorant Garamond', serif;
  font-style: italic;
  font-weight: 400;
  font-size: 2rem; /* Same size for baseline alignment */
  color: #C5A059;
}
```

### Key Alignment Considerations

1. **Use `align-items: baseline`** on the flex container - this ensures both spans align to the alphabetic baseline regardless of different font metrics.

2. **Same `font-size`** for both spans keeps baselines aligned. Different font families may have different x-heights, but the alphabetic baseline alignment handles this.

3. **Use `gap` for spacing** instead of margins - more maintainable and works naturally with flexbox.

4. **Fine-tuning may be needed:** Different fonts have different metrics. If visual baseline appears off, minor `position: relative` with `top` adjustments (1-2px) can fine-tune, but `align-items: baseline` typically handles this well.

### Alternative: Pure Inline Approach
```css
.logo {
  /* Parent sets baseline context */
}

.logo-antler,
.logo-room {
  display: inline;
  vertical-align: baseline; /* Default, but explicit */
}

.logo-antler {
  margin-right: 0.15em; /* Gap between words */
}
```

---

## Navigation

### Fixed Navigation CSS

```css
.nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background-color: var(--color-bg);
  padding: 1rem 2rem;
}

/* Account for fixed nav height when scrolling to sections */
html {
  scroll-behavior: smooth;
  scroll-padding-top: 80px; /* Adjust to nav height */
}
```

### Best Practices for Fixed Navigation

1. **Keep it slim:** Include only essential items - logo, primary nav links, and CTA button. Avoid cramming secondary content.

2. **High z-index:** Use `z-index: 1000` or higher to ensure nav stays above all content.

3. **Use `position: fixed`** (not `sticky`) for always-visible navigation that must remain at viewport top.

4. **Set `scroll-padding-top`** on `html` to account for fixed header height when scrolling to anchor sections.

### Smooth Scroll Implementation

**CSS-Only Approach (recommended for simplicity):**
```css
html {
  scroll-behavior: smooth;
}
```

**Vanilla JavaScript with `scrollIntoView` (for more control):**
```javascript
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    const targetElement = document.querySelector(targetId);

    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});
```

### scrollIntoView Options

| Property | Values | Default | Use |
|----------|--------|---------|-----|
| `behavior` | `'smooth'`, `'instant'`, `'auto'` | `'auto'` | Animation style |
| `block` | `'start'`, `'center'`, `'end'`, `'nearest'` | `'start'` | Vertical alignment |
| `inline` | `'start'`, `'center'`, `'end'`, `'nearest'` | `'nearest'` | Horizontal alignment |

**Browser Support:** Widely available since January 2020 across all major browsers.

### Handling Fixed Header Offset with JavaScript

If CSS `scroll-padding-top` doesn't work for your use case:

```javascript
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    const headerHeight = document.querySelector('.nav').offsetHeight;

    if (targetElement) {
      const targetPosition = targetElement.offsetTop - headerHeight;
      window.scroll({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});
```

### Alternative: scroll-margin-top on Sections

```css
section[id] {
  scroll-margin-top: 80px; /* Accounts for fixed header */
}
```

---

## Color System

### CSS Custom Properties Setup

```css
:root {
  /* Core Brand Colors */
  --color-bg: #120E0B;
  --color-white: #FFFFFF;
  --color-gold: #C5A059;

  /* Semantic Color Aliases */
  --color-text-primary: var(--color-white);
  --color-text-accent: var(--color-gold);
  --color-surface: var(--color-bg);
  --color-cta-bg: var(--color-gold);
  --color-cta-text: var(--color-bg);

  /* Typography Scale */
  --font-sans: 'Montserrat', sans-serif;
  --font-serif: 'Cormorant Garamond', serif;

  /* Font Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Spacing Scale */
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 2rem;
  --space-xl: 4rem;
  --space-2xl: 8rem;

  /* Layout */
  --nav-height: 80px;
  --max-width: 1200px;
}
```

### Usage Pattern

```css
body {
  background-color: var(--color-bg);
  color: var(--color-text-primary);
  font-family: var(--font-sans);
}

.cta-button {
  background-color: var(--color-cta-bg);
  color: var(--color-cta-text);
}

.accent-text {
  color: var(--color-text-accent);
}

h1, h2, h3 {
  font-family: var(--font-sans);
  font-weight: var(--font-weight-bold);
  text-transform: uppercase;
}
```

### Best Practices

1. **Define variables under `:root`** for global availability.
2. **Use semantic aliases** (e.g., `--color-cta-bg`) rather than raw colors throughout the codebase for maintainability.
3. **Group related variables** (colors, typography, spacing) for organization.
4. **Include fallback values** in browsers that need them (though CSS custom properties have excellent modern browser support).

---

## File Structure

### Recommended Project Structure

```
/Website AR
├── index.html              # Main/only HTML file (single page)
├── /assets
│   ├── /css
│   │   ├── variables.css   # CSS custom properties, reset
│   │   ├── main.css        # Primary styles
│   │   └── components.css  # Button, nav component styles (optional)
│   ├── /js
│   │   └── main.js         # Smooth scroll, any interactions
│   └── /images
│       └── (future images)
└── /docs                   # Optional: design specs, notes
```

### For Simple Single-Page Site

A minimal structure for this project:

```
/Website AR
├── index.html
├── /css
│   └── styles.css          # All CSS in one file
├── /js
│   └── main.js             # Minimal JS for smooth scroll
└── /images
```

### File Naming Best Practices

- Use lowercase and hyphens: `main-styles.css` not `MainStyles.css`
- Avoid spaces: use hyphens instead
- Keep names short and descriptive
- `index.html` must be named exactly this (browsers look for it by default)

### CSS File Organization (within single file)

```css
/* =================================
   1. CSS RESET / NORMALIZE
   ================================= */

/* =================================
   2. CSS CUSTOM PROPERTIES
   ================================= */

/* =================================
   3. BASE STYLES
   ================================= */

/* =================================
   4. TYPOGRAPHY
   ================================= */

/* =================================
   5. LAYOUT / STRUCTURE
   ================================= */

/* =================================
   6. NAVIGATION
   ================================= */

/* =================================
   7. HERO SECTION
   ================================= */

/* =================================
   8. COMPONENTS (Buttons, etc.)
   ================================= */

/* =================================
   9. UTILITIES
   ================================= */
```

---

## Key Implementation Notes

### Gotchas to Avoid

1. **Font loading flash (FOUT):** Use `display=swap` in Google Fonts URL to show fallback text immediately, preventing invisible text during load.

2. **Fixed nav covering content:** Always set `scroll-padding-top` on `html` or `scroll-margin-top` on sections to account for fixed header height.

3. **Baseline alignment issues:** Different fonts have different metrics. Use `align-items: baseline` in flexbox rather than trying to manually calculate positions.

4. **CSS custom properties in media queries:** You cannot use CSS variables in media query conditions (e.g., `@media (min-width: var(--breakpoint))`). Use hardcoded values for breakpoints.

5. **All-caps letter-spacing:** When using `text-transform: uppercase`, add slight `letter-spacing` (0.05em - 0.1em) for better readability.

### Performance Tips

1. **Preconnect to Google Fonts:** Include both `preconnect` links before the font stylesheet link for faster font loading.

2. **Load only needed weights:** Request only `400`, `500`, `600`, `700` for Montserrat, not all 9 weights.

3. **CSS before JS:** Link stylesheets in `<head>`, scripts before `</body>` (or use `defer`).

4. **Minimal JS:** For smooth scroll, prefer CSS `scroll-behavior: smooth` over JavaScript when possible.

### Accessibility Considerations

1. **Color contrast:** Gold (#C5A059) on dark charcoal (#120E0B) meets WCAG AA for large text. Verify with a contrast checker for body text.

2. **Skip link:** Consider adding a "Skip to content" link for keyboard users to bypass navigation.

3. **Focus states:** Ensure all interactive elements (links, buttons) have visible focus states.

4. **Semantic HTML:** Use `<nav>`, `<header>`, `<main>`, `<section>` elements appropriately.

---

## Code Examples

### Complete Navigation HTML Structure

```html
<nav class="nav">
  <div class="nav-container">
    <a href="#" class="logo">
      <span class="logo-antler">ANTLER</span>
      <span class="logo-room">Room</span>
    </a>

    <ul class="nav-links">
      <li><a href="#success">SUCCESS</a></li>
      <li><a href="#strategy">STRATEGY</a></li>
      <li><a href="#services">SERVICES</a></li>
      <li><a href="#team">TEAM</a></li>
      <li><a href="#genres">GENRES</a></li>
      <li><a href="#contact">CONTACT</a></li>
    </ul>

    <a href="#submit-demos" class="nav-cta">SUBMIT DEMOS</a>
  </div>
</nav>
```

### Complete Hero Section HTML Structure

```html
<header class="hero" id="hero">
  <div class="hero-content">
    <h1 class="hero-title">
      <span class="hero-title-antler">ANTLER</span>
      <span class="hero-title-room">Room</span>
    </h1>
    <p class="hero-subtitle">INDEPENDENT DIGITAL RECORD LABEL SHAPING GLOBAL CULTURE</p>
    <p class="hero-tagline">BUILT FOR DIGITALLY NATIVE AUDIENCES</p>
    <a href="#submit-demos" class="cta-button">SUBMIT YOUR DEMO</a>
  </div>
</header>
```

### CTA Button Styles

```css
.cta-button,
.nav-cta {
  display: inline-block;
  background-color: var(--color-gold);
  color: var(--color-bg);
  font-family: var(--font-sans);
  font-weight: var(--font-weight-bold);
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  padding: 0.875rem 1.75rem;
  text-decoration: none;
  transition: opacity 0.2s ease;
}

.cta-button:hover,
.nav-cta:hover {
  opacity: 0.9;
}

.cta-button:focus,
.nav-cta:focus {
  outline: 2px solid var(--color-gold);
  outline-offset: 2px;
}
```

---

## Sources

### Primary (HIGH confidence)
- [MDN: scrollIntoView()](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView) - Complete API reference
- [Montserrat on Google Fonts](https://fonts.google.com/specimen/Montserrat) - Official font page
- [Cormorant on Google Fonts](https://fonts.google.com/specimen/Cormorant) - Official font page
- [MDN: Dealing with files](https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Environment_setup/Dealing_with_files) - File structure guidance

### Secondary (MEDIUM confidence)
- [Chroma Creator: CSS Color Variables Guide 2025](https://chromacreator.com/blog/css-color-variables-guide) - Custom properties best practices
- [Typewolf: Montserrat](https://www.typewolf.com/montserrat) - Font pairing recommendations
- [CSS-Tricks: Smooth Scrolling](https://css-tricks.com/snippets/jquery/smooth-scrolling/) - Implementation patterns
- [NN/G: Sticky Headers Best Practices](https://www.nngroup.com/articles/sticky-headers/) - UX recommendations
- [LogRocket: Sticky vs Fixed Navigation](https://blog.logrocket.com/ux-design/sticky-vs-fixed-navigation/) - Implementation comparison
- [SitePoint: Smooth Scrolling Vanilla JavaScript](https://www.sitepoint.com/smooth-scrolling-vanilla-javascript/) - JS implementation
- [Vincent De Oliveira: Font Metrics Deep Dive](https://iamvdo.me/en/blog/css-font-metrics-line-height-and-vertical-align) - Baseline alignment

### Tertiary (LOW confidence - WebSearch only)
- General font pairing recommendations from multiple blog sources
- Community file structure conventions

---

## Metadata

**Confidence breakdown:**
- Fonts/Typography: HIGH - Official Google Fonts documentation and widely-used pairings
- Logo CSS: HIGH - Standard CSS flexbox/baseline alignment, well-documented
- Navigation: HIGH - Native browser APIs with excellent support
- Color System: HIGH - CSS custom properties are well-established
- File Structure: MEDIUM - Best practices are conventional, not authoritative

**Research date:** 2026-01-19
**Valid until:** 2026-03-19 (60 days - stable technologies)
