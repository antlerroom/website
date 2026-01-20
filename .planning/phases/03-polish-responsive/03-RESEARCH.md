# Phase 3 Research: Polish & Responsive

**Researched:** 2026-01-20
**Domain:** Mobile navigation, visual textures, responsive design, CSS effects
**Confidence:** HIGH

## Summary

This research covers the implementation approach for Phase 3 of the Antler Room website, focusing on mobile hamburger navigation (NAV-04), visual polish elements (VIS-05, VIS-06, VIS-07), and responsive design (RESP-01 through RESP-04). The phase builds on the established CSS custom properties, clamp() typography, and CSS Grid layouts from Phases 1 and 2.

The standard approach uses the **HTML Popover API** for the mobile menu (modern, accessible, no JavaScript required), **inline SVG with feTurbulence filter** for grain texture overlay (resolution-independent, lightweight), **inline SVG** for the sunburst divider motif (scalable, brandable), and **CSS animations with opacity/scale keyframes** for star/twinkle effects. Responsive design follows a **mobile-first** approach with standard breakpoints at 768px (tablet) and 1024px (desktop).

**Primary recommendation:** Use the Popover API for the hamburger menu as it provides built-in accessibility (light-dismiss, esc key handling, focus management) without JavaScript. Apply grain texture as a fixed overlay with `pointer-events: none` to avoid interaction blocking. Use three breakpoints: base (mobile), 768px (tablet), 1024px (desktop).

---

## Hamburger Menu (NAV-04)

### Recommended Approach: Popover API

The Popover API (Baseline 2024) provides native toggle functionality without JavaScript, with built-in accessibility features.

**Why Popover API over checkbox hack:**
- Built-in light-dismiss (clicking outside closes menu)
- Built-in esc key handling
- Automatic focus management
- Promotion to top layer (no z-index battles)
- Semantic HTML with proper ARIA support
- Works across all modern browsers (Chrome 114+, Safari 17+, Firefox 125+)

**HTML Structure:**

```html
<nav class="nav">
  <div class="nav-container">
    <a href="#" class="logo">...</a>

    <!-- Desktop nav links (hidden on mobile) -->
    <ul class="nav-links nav-links--desktop">
      <li><a href="#success">SUCCESS</a></li>
      <!-- ... other links -->
    </ul>

    <!-- Mobile menu button (hidden on desktop) -->
    <button
      class="nav-hamburger"
      popovertarget="mobile-menu"
      popovertargetaction="show"
      aria-label="Open navigation menu"
      aria-controls="mobile-menu"
    >
      <span class="hamburger-line"></span>
      <span class="hamburger-line"></span>
      <span class="hamburger-line"></span>
    </button>

    <!-- Desktop CTA (hidden on mobile) -->
    <a href="#submit-demos" class="nav-cta nav-cta--desktop">SUBMIT DEMOS</a>

    <!-- Mobile popover menu -->
    <nav id="mobile-menu" class="mobile-menu" popover>
      <button
        class="mobile-menu-close"
        popovertarget="mobile-menu"
        popovertargetaction="hide"
        aria-label="Close navigation menu"
        aria-controls="mobile-menu"
      >
        <span class="close-icon"></span>
      </button>
      <ul class="mobile-menu-links">
        <li><a href="#success">SUCCESS</a></li>
        <li><a href="#strategy">STRATEGY</a></li>
        <li><a href="#services">SERVICES</a></li>
        <li><a href="#team">TEAM</a></li>
        <li><a href="#genres">GENRES</a></li>
        <li><a href="#contact">CONTACT</a></li>
      </ul>
      <a href="#submit-demos" class="cta-button mobile-menu-cta">SUBMIT DEMOS</a>
    </nav>
  </div>
</nav>
```

**Key Popover Attributes:**

| Attribute | Purpose |
|-----------|---------|
| `popover` | Marks element as a popover (auto dismissable) |
| `popovertarget` | ID of the popover element to control |
| `popovertargetaction` | `show`, `hide`, or `toggle` |

**CSS Implementation:**

```css
/* Mobile menu button - hidden on desktop */
.nav-hamburger {
  display: none;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  width: 44px;
  height: 44px;
  padding: 10px;
  background: transparent;
  border: none;
  cursor: pointer;
}

.hamburger-line {
  display: block;
  width: 24px;
  height: 2px;
  background-color: var(--color-white);
  transition: transform 0.3s ease, opacity 0.3s ease;
}

/* Mobile menu popover */
#mobile-menu {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  max-width: 100%;
  max-height: 100%;
  background-color: var(--color-bg);
  border: none;
  padding: var(--space-xl) var(--space-lg);
  display: flex;
  flex-direction: column;
  opacity: 0;
  transform: translateX(100%);
  transition: opacity 0.3s ease, transform 0.3s ease, display 0.3s ease allow-discrete;
}

#mobile-menu:popover-open {
  opacity: 1;
  transform: translateX(0);
}

/* Starting state for entry animation */
@starting-style {
  #mobile-menu:popover-open {
    opacity: 0;
    transform: translateX(100%);
  }
}

#mobile-menu::backdrop {
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
  transition: opacity 0.3s ease;
}

#mobile-menu:popover-open::backdrop {
  opacity: 1;
}

/* Close button */
.mobile-menu-close {
  align-self: flex-end;
  width: 44px;
  height: 44px;
  background: transparent;
  border: none;
  cursor: pointer;
  margin-bottom: var(--space-xl);
}

.close-icon {
  display: block;
  width: 24px;
  height: 24px;
  position: relative;
}

.close-icon::before,
.close-icon::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 2px;
  background-color: var(--color-white);
  top: 50%;
  left: 0;
}

.close-icon::before {
  transform: rotate(45deg);
}

.close-icon::after {
  transform: rotate(-45deg);
}

/* Mobile menu links */
.mobile-menu-links {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
  flex: 1;
}

.mobile-menu-links a {
  font-family: var(--font-sans);
  font-weight: var(--font-weight-semibold);
  font-size: 1.25rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-white);
  padding: var(--space-sm) 0;
}

.mobile-menu-links a:hover,
.mobile-menu-links a:focus {
  color: var(--color-gold);
}

.mobile-menu-cta {
  margin-top: auto;
  text-align: center;
}

/* Responsive: Show hamburger on mobile, hide desktop nav */
@media (max-width: 767px) {
  .nav-links--desktop,
  .nav-cta--desktop {
    display: none;
  }

  .nav-hamburger {
    display: flex;
  }
}

@media (min-width: 768px) {
  .nav-hamburger {
    display: none;
  }
}
```

### Accessibility Requirements

| Requirement | Implementation |
|-------------|----------------|
| Keyboard accessible | Popover API handles esc key automatically |
| Focus trap | Popover promotes to top layer |
| aria-label | On open/close buttons |
| aria-controls | Links button to menu ID |
| Touch target | 44x44px minimum on buttons |
| Focus visible | Outline on :focus-visible |

### JavaScript Enhancement (Optional)

The Popover API handles most functionality natively. Optional JS for closing menu on link click:

```javascript
// Close mobile menu when clicking a link
document.querySelectorAll('#mobile-menu a').forEach(link => {
  link.addEventListener('click', () => {
    document.getElementById('mobile-menu').hidePopover();
  });
});
```

**Source:** [MDN Popover API](https://developer.mozilla.org/en-US/docs/Web/API/Popover_API), [Create a Mobile Menu with the Popover API](https://johndalesandro.com/blog/create-a-mobile-menu-with-the-popover-api-and-no-javascript/)

---

## Grain Texture Overlay (VIS-07)

### Recommended Approach: SVG feTurbulence Filter

Use an inline SVG with `feTurbulence` filter applied as a fixed overlay. This is resolution-independent and more performant than loading image files.

**HTML Structure (add before closing body tag):**

```html
<!-- Grain texture overlay - positioned fixed over entire page -->
<div class="grain-overlay" aria-hidden="true"></div>

<!-- SVG filter definition (zero-size, just for reference) -->
<svg class="sr-only">
  <filter id="grain-filter">
    <feTurbulence
      type="fractalNoise"
      baseFrequency="0.65"
      numOctaves="3"
      stitchTiles="stitch"
    />
  </filter>
</svg>
```

**CSS Implementation:**

```css
/* Grain overlay */
.grain-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 9999;
  opacity: 0.08;
  mix-blend-mode: overlay;
}

.grain-overlay::before {
  content: '';
  position: absolute;
  inset: 0;
  background: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  background-repeat: repeat;
}
```

**Alternative: Base64 PNG (simpler, slightly larger file):**

```css
.grain-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 9999;
  background-image: url('data:image/png;base64,...'); /* tiny noise PNG */
  background-repeat: repeat;
  opacity: 0.05;
  mix-blend-mode: overlay;
}
```

### Performance Considerations

| Aspect | Recommendation |
|--------|----------------|
| Opacity | Keep between 0.03-0.1 (subtle) |
| z-index | High (9999) to overlay all content |
| pointer-events | `none` critical - allows clicking through |
| mix-blend-mode | `overlay` or `soft-light` for lo-fi effect |
| Will-change | Avoid - can cause memory issues |
| Animation | Avoid animating grain - performance hit |

### Custom Property for Adjustability

```css
:root {
  --grain-opacity: 0.08;
}

.grain-overlay {
  opacity: var(--grain-opacity);
}

/* Reduce grain on mobile for performance */
@media (max-width: 767px) {
  :root {
    --grain-opacity: 0.05;
  }
}
```

**Source:** [CSS-Tricks: Grainy Gradients](https://css-tricks.com/grainy-gradients/), [Creating Grainy Backgrounds with CSS](https://ibelick.com/blog/create-grainy-backgrounds-with-css)

---

## Sunburst Dividers (VIS-05)

### Recommended Approach: Inline SVG

Create a reusable SVG component showing radiating gold lines from center. Use as section divider between major sections.

**SVG Sunburst Pattern:**

```html
<div class="section-divider" aria-hidden="true">
  <svg class="sunburst" viewBox="0 0 200 100" preserveAspectRatio="xMidYMid slice">
    <defs>
      <linearGradient id="gold-fade" x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stop-color="var(--color-gold, #C5A059)" stop-opacity="0.8"/>
        <stop offset="100%" stop-color="var(--color-gold, #C5A059)" stop-opacity="0"/>
      </linearGradient>
    </defs>
    <g transform="translate(100, 100)">
      <!-- 24 rays, 15 degrees apart -->
      <line x1="0" y1="0" x2="0" y2="-100" stroke="url(#gold-fade)" stroke-width="1" transform="rotate(0)"/>
      <line x1="0" y1="0" x2="0" y2="-100" stroke="url(#gold-fade)" stroke-width="1" transform="rotate(15)"/>
      <line x1="0" y1="0" x2="0" y2="-100" stroke="url(#gold-fade)" stroke-width="1" transform="rotate(30)"/>
      <line x1="0" y1="0" x2="0" y2="-100" stroke="url(#gold-fade)" stroke-width="1" transform="rotate(45)"/>
      <line x1="0" y1="0" x2="0" y2="-100" stroke="url(#gold-fade)" stroke-width="1" transform="rotate(60)"/>
      <line x1="0" y1="0" x2="0" y2="-100" stroke="url(#gold-fade)" stroke-width="1" transform="rotate(75)"/>
      <line x1="0" y1="0" x2="0" y2="-100" stroke="url(#gold-fade)" stroke-width="1" transform="rotate(90)"/>
      <line x1="0" y1="0" x2="0" y2="-100" stroke="url(#gold-fade)" stroke-width="1" transform="rotate(105)"/>
      <line x1="0" y1="0" x2="0" y2="-100" stroke="url(#gold-fade)" stroke-width="1" transform="rotate(120)"/>
      <line x1="0" y1="0" x2="0" y2="-100" stroke="url(#gold-fade)" stroke-width="1" transform="rotate(135)"/>
      <line x1="0" y1="0" x2="0" y2="-100" stroke="url(#gold-fade)" stroke-width="1" transform="rotate(150)"/>
      <line x1="0" y1="0" x2="0" y2="-100" stroke="url(#gold-fade)" stroke-width="1" transform="rotate(165)"/>
      <line x1="0" y1="0" x2="0" y2="-100" stroke="url(#gold-fade)" stroke-width="1" transform="rotate(180)"/>
    </g>
  </svg>
</div>
```

**Alternative: CSS Conic Gradient (simpler but less control):**

```css
.sunburst-divider {
  width: 100%;
  height: 80px;
  background: conic-gradient(
    from 0deg at 50% 100%,
    transparent 0deg,
    var(--color-gold) 5deg,
    transparent 10deg,
    transparent 15deg,
    var(--color-gold) 20deg,
    transparent 25deg
    /* repeat pattern */
  );
  opacity: 0.3;
  mask-image: linear-gradient(to top, black, transparent);
}
```

**CSS for SVG Sunburst:**

```css
.section-divider {
  width: 100%;
  height: 60px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  margin: var(--space-xl) 0;
}

.sunburst {
  width: 100%;
  max-width: 800px;
  height: auto;
  opacity: 0.4;
}

/* Responsive sizing */
@media (min-width: 768px) {
  .section-divider {
    height: 80px;
  }
}
```

### Placement

Insert sunburst dividers between major sections:
- After Hero (before Track Record)
- Between Strategy and Services
- Before Contact section

**Source:** [CSS-Tricks: SVG Patterns](https://css-tricks.com/snippets/svg/svg-patterns/), [Codrops: Separator Styles](https://tympanus.net/codrops/2013/10/03/a-collection-of-separator-styles/)

---

## Star/Twinkle Effects (VIS-06)

### Recommended Approach: CSS Animation with SVG Stars

Use small SVG stars with staggered CSS animations for opacity/scale. Apply sparingly in footer or as accent elements.

**HTML Structure:**

```html
<div class="stars-container" aria-hidden="true">
  <svg class="star star--1" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
  </svg>
  <svg class="star star--2" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
  </svg>
  <svg class="star star--3" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
  </svg>
  <!-- Add more stars as needed -->
</div>
```

**CSS Animation:**

```css
.stars-container {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.star {
  position: absolute;
  color: var(--color-gold);
  opacity: 0;
  animation: twinkle 4s ease-in-out infinite;
}

.star--1 {
  width: 8px;
  height: 8px;
  top: 20%;
  left: 10%;
  animation-delay: 0s;
}

.star--2 {
  width: 6px;
  height: 6px;
  top: 40%;
  right: 15%;
  animation-delay: 1.5s;
}

.star--3 {
  width: 10px;
  height: 10px;
  bottom: 30%;
  left: 25%;
  animation-delay: 3s;
}

@keyframes twinkle {
  0%, 100% {
    opacity: 0.2;
    transform: scale(0.8);
  }
  50% {
    opacity: 1;
    transform: scale(1);
  }
}

/* Reduce motion for accessibility */
@media (prefers-reduced-motion: reduce) {
  .star {
    animation: none;
    opacity: 0.5;
  }
}
```

### Alternative: Pure CSS Stars (no SVG)

```css
.star {
  width: 6px;
  height: 6px;
  background: var(--color-gold);
  border-radius: 50%;
  box-shadow: 0 0 6px 2px var(--color-gold);
}
```

### Placement Recommendations

- Footer background (subtle, non-distracting)
- Hero section (optional, behind content)
- Avoid near text or interactive elements

**Source:** [CodePen: CSS Twinkling Stars](https://codepen.io/agoodwin/pen/NMJoER), [SVG Genie: SVG Animations Guide 2025](https://www.svggenie.com/blog/svg-animations-complete-guide)

---

## Responsive Breakpoints (RESP-01, RESP-02, RESP-03)

### Standard Mobile-First Breakpoints

```css
:root {
  /* Breakpoint values (for reference - cannot use in media queries) */
  --breakpoint-tablet: 768px;
  --breakpoint-desktop: 1024px;
  --breakpoint-wide: 1200px;
}

/* Base styles: Mobile (320px - 767px) */
/* No media query needed - this is the default */

/* Tablet (768px and up) */
@media (min-width: 768px) {
  /* Tablet-specific styles */
}

/* Desktop (1024px and up) */
@media (min-width: 1024px) {
  /* Desktop-specific styles */
}

/* Wide screens (1200px and up) - optional */
@media (min-width: 1200px) {
  /* Wide screen enhancements */
}
```

### Existing Responsive Patterns (Already in Place)

The site already uses these responsive patterns from Phases 1 & 2:

| Pattern | How It Works |
|---------|--------------|
| `clamp()` typography | Hero and stats scale automatically |
| `repeat(auto-fit, minmax())` | Grids adapt column count automatically |
| Relative units | `rem`, `%`, `vw` for fluid sizing |

### What Needs Mobile-Specific CSS

| Element | Mobile Adjustment |
|---------|-------------------|
| Navigation | Hamburger menu, hide desktop nav |
| Section padding | Reduce `--space-2xl` to `--space-xl` |
| Container padding | Increase side padding slightly |
| Stats grid | May need smaller minmax value |
| Team cards | Stack vertically |

### Mobile-First CSS Additions

```css
/* Base (mobile) styles */
.section {
  padding: var(--space-xl) 0;
}

.container {
  padding: 0 var(--space-md);
}

.hero-title-antler,
.hero-title-room {
  font-size: clamp(2.5rem, 12vw, 6rem);
}

/* Tablet and up */
@media (min-width: 768px) {
  .section {
    padding: var(--space-2xl) 0;
  }

  .container {
    padding: 0 var(--space-lg);
  }
}

/* Desktop and up */
@media (min-width: 1024px) {
  /* Most desktop styles already handled by clamp() and auto-fit */
}
```

**Source:** [BrowserStack: Responsive Design Breakpoints 2025](https://www.browserstack.com/guide/responsive-design-breakpoints), [Bootstrap 5 Breakpoints](https://getbootstrap.com/docs/5.0/layout/breakpoints/)

---

## Touch Target Sizes (RESP-04)

### WCAG 2.5.8 Requirements (Level AA)

| Requirement | Minimum Size | Recommended |
|-------------|--------------|-------------|
| WCAG 2.5.8 (AA) | 24x24 CSS pixels | - |
| WCAG 2.5.5 (AAA) | 44x44 CSS pixels | Preferred |
| Apple HIG | 44x44 points | - |
| Material Design | 48x48 dp | - |

**Recommendation:** Target **44x44 pixels minimum** for all interactive elements on mobile.

### Elements Requiring Touch Target Review

| Element | Current State | Fix Required |
|---------|---------------|--------------|
| Nav links | Inline text | Add padding on mobile |
| Nav CTA button | Has padding | Verify 44px height |
| Hamburger button | N/A | Create at 44x44 |
| Form inputs | Full width | Already touch-friendly |
| Checkboxes | Custom styled | Verify label tap area |
| Footer links | Small | Add padding |
| Genre tags | Pill styled | Verify tap area |

### CSS Implementation

```css
/* Ensure minimum touch targets on mobile */
@media (max-width: 767px) {
  /* Make nav links tappable */
  .mobile-menu-links a {
    display: block;
    min-height: 44px;
    padding: var(--space-sm) 0;
  }

  /* Enlarge checkbox tap targets */
  .checkbox-label {
    min-height: 44px;
    padding: var(--space-sm) 0;
  }

  /* Genre tags */
  .genre-tag {
    min-height: 44px;
    padding: 0.75rem 1.5rem;
  }

  /* Footer email links */
  .contact-email {
    display: inline-block;
    min-height: 44px;
    padding: var(--space-sm) 0;
  }

  /* CTA buttons */
  .cta-button,
  .nav-cta {
    min-height: 44px;
    padding: 0.875rem 1.75rem;
  }
}
```

### Spacing Exception

Per WCAG 2.5.8, undersized targets are acceptable if there's sufficient spacing (24px diameter circle around each target doesn't overlap other targets).

**Source:** [WCAG 2.5.8 Target Size Minimum](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html), [CSS-Tricks: WCAG 2.5.5](https://css-tricks.com/looking-at-wcag-2-5-5-for-better-target-sizes/)

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Mobile menu toggle | Checkbox hack | Popover API | Built-in accessibility, light-dismiss, esc handling |
| Noise/grain texture | Canvas animation | SVG feTurbulence | Resolution-independent, better performance |
| Responsive breakpoints | Many specific breakpoints | 3 breakpoints + clamp() | Site already uses intrinsic responsiveness |
| Touch targets | Guessing sizes | 44x44px minimum | WCAG compliance, platform guidelines |
| Star animations | Complex JS animation | CSS @keyframes | Simple transforms are GPU-accelerated |

---

## Common Pitfalls

### Pitfall 1: Forgetting pointer-events on Overlays
**What goes wrong:** Grain overlay blocks all clicks/taps
**Why it happens:** Fixed overlay covers entire viewport
**How to avoid:** Always add `pointer-events: none` to decorative overlays
**Warning signs:** Nothing on page is clickable

### Pitfall 2: High z-index Stacking Conflicts
**What goes wrong:** Elements overlap incorrectly, menu under overlay
**Why it happens:** Multiple elements competing for top layer
**How to avoid:** Use Popover API (promotes to top layer) for menus; keep grain overlay at high z-index but with pointer-events: none
**Warning signs:** Menu appears behind other elements

### Pitfall 3: Animation Performance on Mobile
**What goes wrong:** Janky animations, battery drain
**Why it happens:** Animating non-compositable properties (margin, top, left)
**How to avoid:** Only animate `transform` and `opacity`; use `prefers-reduced-motion` media query
**Warning signs:** Choppy scrolling, hot device

### Pitfall 4: Undersized Touch Targets
**What goes wrong:** Users mis-tap, frustration, accessibility failures
**Why it happens:** Desktop-first design with small clickable areas
**How to avoid:** Verify 44x44px minimum on all interactive elements
**Warning signs:** High tap error rates, user complaints

### Pitfall 5: Missing prefers-reduced-motion
**What goes wrong:** Animations cause vestibular issues for some users
**Why it happens:** Forgetting accessibility preferences
**How to avoid:** Wrap all animations in `@media (prefers-reduced-motion: no-preference)` or provide reduced/no animation alternative
**Warning signs:** Accessibility audit failures

### Pitfall 6: Popover Browser Support
**What goes wrong:** Menu doesn't work in older browsers
**Why it happens:** Popover API is Baseline 2024
**How to avoid:** Test in target browsers; consider fallback for older browsers if needed
**Warning signs:** Menu button does nothing in older Firefox/Safari versions

---

## Code Examples

### Complete Hamburger Menu Implementation

```html
<!-- In nav element -->
<button
  class="nav-hamburger"
  popovertarget="mobile-menu"
  aria-label="Open menu"
>
  <span class="hamburger-line"></span>
  <span class="hamburger-line"></span>
  <span class="hamburger-line"></span>
</button>

<nav id="mobile-menu" class="mobile-menu" popover>
  <button
    class="mobile-menu-close"
    popovertarget="mobile-menu"
    popovertargetaction="hide"
    aria-label="Close menu"
  >
    <span class="sr-only">Close</span>
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  </button>
  <ul class="mobile-menu-links">
    <li><a href="#success">SUCCESS</a></li>
    <li><a href="#strategy">STRATEGY</a></li>
    <li><a href="#services">SERVICES</a></li>
    <li><a href="#team">TEAM</a></li>
    <li><a href="#genres">GENRES</a></li>
    <li><a href="#contact">CONTACT</a></li>
  </ul>
  <a href="#submit-demos" class="cta-button">SUBMIT DEMOS</a>
</nav>
```

### Complete Grain Overlay

```html
<!-- Before closing </body> -->
<div class="grain-overlay" aria-hidden="true"></div>
```

```css
.grain-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 9999;
  opacity: var(--grain-opacity, 0.08);
  mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
}
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Checkbox hack for menus | Popover API | 2024 (Baseline) | Built-in accessibility |
| JavaScript menu toggles | Popover API | 2024 | No JS required |
| PNG noise textures | SVG feTurbulence | 2020+ | Resolution-independent |
| Many media queries | clamp() + auto-fit | 2020+ | Intrinsic responsiveness |
| 320px mobile target | Content-based breakpoints | 2023+ | Design to content, not devices |

---

## Open Questions

1. **Popover API animation support**
   - What we know: Transitions work with `allow-discrete`, `@starting-style` is newish
   - What's unclear: Browser consistency for animation timing
   - Recommendation: Test slide animation in Safari/Firefox; have fallback instant show/hide

2. **Grain overlay performance on older devices**
   - What we know: SVG feTurbulence can be heavy on low-end devices
   - What's unclear: Exact performance threshold
   - Recommendation: Use low opacity (0.05), test on real devices, consider CSS variable to disable

---

## Sources

### Primary (HIGH confidence)
- [MDN: Popover API](https://developer.mozilla.org/en-US/docs/Web/API/Popover_API) - Complete API reference
- [WCAG 2.5.8: Target Size Minimum](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html) - Official accessibility standard
- [MDN: Media query fundamentals](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Media_queries) - Responsive CSS reference

### Secondary (MEDIUM confidence)
- [John Dalesandro: Popover API Menu Tutorial](https://johndalesandro.com/blog/create-a-mobile-menu-with-the-popover-api-and-no-javascript/) - Practical implementation guide
- [CSS-Tricks: Grainy Gradients](https://css-tricks.com/grainy-gradients/) - SVG noise technique
- [BrowserStack: Responsive Breakpoints 2025](https://www.browserstack.com/guide/responsive-design-breakpoints) - Current breakpoint standards
- [UnusedCSS: CSS-Only Hamburger Menu](https://unused-css.com/blog/css-only-hamburger-menu/) - Accessibility patterns
- [a11ymatters: Mobile Navigation](https://a11ymatters.com/pattern/mobile-nav/) - ARIA requirements

### Tertiary (LOW confidence)
- CodePen examples for star animations and sunburst patterns
- Community CSS pattern resources

---

## Metadata

**Confidence breakdown:**
- Hamburger menu (Popover API): HIGH - MDN documentation, Baseline 2024
- Grain texture: HIGH - Established SVG technique, CSS-Tricks reference
- Sunburst dividers: MEDIUM - Custom implementation based on SVG patterns
- Star animations: HIGH - Standard CSS keyframes
- Responsive breakpoints: HIGH - Industry-standard patterns
- Touch targets: HIGH - WCAG official specification

**Research date:** 2026-01-20
**Valid until:** 2026-03-20 (60 days - Popover API is now stable)
