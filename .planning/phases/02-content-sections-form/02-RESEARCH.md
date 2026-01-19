# Phase 2 Research: Content Sections & Form

**Researched:** 2026-01-19
**Domain:** CSS layouts, form validation, content section patterns
**Confidence:** HIGH

## Summary

This research covers the implementation approach for Phase 2 of the Antler Room website, focusing on content sections (Track Record, Strategy, Services, Team, Genres, Partners) and the demo submission form. The phase builds on the established CSS custom properties and typography from Phase 1.

The standard approach uses CSS Grid with `repeat(auto-fit, minmax())` for responsive card layouts, the HTML5 Constraint Validation API for form validation without frameworks, and CSS `appearance: none` with custom styling for form controls (checkboxes, selects) that match the dark theme with gold accents.

**Primary recommendation:** Use CSS Grid for all card-based layouts (stats, services, team cards) with `minmax()` for intrinsic responsiveness. Implement form validation using the native Constraint Validation API (`checkValidity()`, `setCustomValidity()`, `validity` object) rather than a third-party library, keeping the project dependency-free.

---

## Stats Grid

### CSS Approach for Large Metrics Display (VIS-08, TRACK-03)

The stats grid displays four large numbers: 10B+ Streams, 1T+ Social Views, 1B Streams on Snowfall, 100M Views Benchmark.

**Recommended Structure:**

```html
<div class="stats-grid">
  <div class="stat-item">
    <span class="stat-number">10B+</span>
    <span class="stat-label">Streams</span>
  </div>
  <!-- repeat for each stat -->
</div>
```

**CSS Implementation:**

```css
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-lg);
  text-align: center;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.stat-number {
  font-family: var(--font-sans);
  font-weight: var(--font-weight-bold);
  font-size: clamp(2.5rem, 8vw, 4rem); /* Large, responsive sizing */
  color: var(--color-gold);
  line-height: 1;
}

.stat-label {
  font-family: var(--font-sans);
  font-weight: var(--font-weight-medium);
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--color-text-primary);
}
```

**Key Techniques:**
- Use `clamp()` for responsive font sizing without media queries (matching Phase 1 hero pattern)
- `repeat(auto-fit, minmax(200px, 1fr))` creates 4 columns on desktop, 2 on tablet, 1 on mobile automatically
- Gold color for numbers creates visual hierarchy and brand consistency

**Source:** [MDN Card Layout Cookbook](https://developer.mozilla.org/en-US/docs/Web/CSS/How_to/Layout_cookbook/Card)

---

## Team Cards (TEAM-03, TEAM-04)

### Layout for Bio Cards

Two team member cards: Vova and Joey, each with role and bio text.

**Recommended Structure:**

```html
<div class="team-grid">
  <article class="team-card">
    <header class="team-card-header">
      <h3 class="team-card-name">VOVA</h3>
      <p class="team-card-role">CO-FOUNDER | MARKETING & TECHNOLOGY</p>
    </header>
    <div class="team-card-bio">
      <p>Bio text here...</p>
    </div>
  </article>
  <!-- Joey card -->
</div>
```

**CSS Implementation:**

```css
.team-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--space-xl);
}

.team-card {
  display: grid;
  grid-template-rows: max-content 1fr;
  gap: var(--space-md);
}

.team-card-header {
  border-bottom: 1px solid var(--color-gold);
  padding-bottom: var(--space-md);
}

.team-card-name {
  font-family: var(--font-sans);
  font-weight: var(--font-weight-bold);
  font-size: 1.5rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-white);
  margin-bottom: var(--space-xs);
}

.team-card-role {
  font-family: var(--font-sans);
  font-weight: var(--font-weight-medium);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-gold);
}

.team-card-bio {
  font-family: var(--font-sans);
  font-weight: var(--font-weight-regular);
  font-size: 0.9375rem;
  line-height: 1.7;
  color: var(--color-text-primary);
}
```

**Key Techniques:**
- `grid-template-rows: max-content 1fr` ensures header sizes to content, bio fills remaining space
- Two-column layout on desktop (2 cards), single column on mobile
- Gold accent on role text and border for brand consistency

**Source:** [MDN Card Layout](https://developer.mozilla.org/en-US/docs/Web/CSS/How_to/Layout_cookbook/Card), [CSS-Tricks Flexbox Cards](https://getflywheel.com/layout/flexbox-create-modern-card-design-layout/)

---

## Services Grid (SERV-03)

### Card Layout for Four Services

Four services displayed: Social Campaigns, Distribution Power, Personal Support, Cultural Success.

**Recommended Structure:**

```html
<div class="services-grid">
  <article class="service-card">
    <h3 class="service-title">SOCIAL CAMPAIGNS</h3>
    <p class="service-description">Description text...</p>
  </article>
  <!-- repeat for each service -->
</div>
```

**CSS Implementation:**

```css
.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--space-lg);
}

.service-card {
  padding: var(--space-lg);
  border: 1px solid rgba(197, 160, 89, 0.3); /* Subtle gold border */
  transition: border-color 0.2s ease;
}

.service-card:hover {
  border-color: var(--color-gold);
}

.service-title {
  font-family: var(--font-sans);
  font-weight: var(--font-weight-bold);
  font-size: 1.125rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-gold);
  margin-bottom: var(--space-md);
}

.service-description {
  font-family: var(--font-sans);
  font-weight: var(--font-weight-regular);
  font-size: 0.9375rem;
  line-height: 1.6;
  color: var(--color-text-primary);
}
```

**Key Techniques:**
- Same `minmax()` pattern for consistent responsive behavior across site
- Subtle border with hover enhancement for interactivity without being button-like
- 4 columns desktop, 2 columns tablet, 1 column mobile

---

## Strategy Pillars (STRAT-02)

### Four Strategy Pillars Layout

Similar to services grid but with different visual treatment.

**Recommended Structure:**

```html
<div class="strategy-grid">
  <article class="strategy-pillar">
    <h3 class="pillar-title">SOCIALS FIRST</h3>
    <p class="pillar-description">Description...</p>
  </article>
  <!-- repeat for 4 pillars -->
</div>
```

**CSS Implementation:**

```css
.strategy-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--space-xl);
}

.strategy-pillar {
  text-align: center;
}

.pillar-title {
  font-family: var(--font-sans);
  font-weight: var(--font-weight-bold);
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-gold);
  margin-bottom: var(--space-md);
}

.pillar-description {
  font-family: var(--font-sans);
  font-weight: var(--font-weight-regular);
  font-size: 0.875rem;
  line-height: 1.7;
  color: var(--color-text-primary);
}
```

---

## Genre Tags (GENRE-03)

### Badge/Pill Styling

Six genre tags: UK RAP, ALTERNATIVE, ELECTRONIC, AMBIENT, NEOCLASSICAL, POP.

**Recommended Structure:**

```html
<ul class="genre-tags">
  <li class="genre-tag">UK RAP</li>
  <li class="genre-tag">ALTERNATIVE</li>
  <li class="genre-tag">ELECTRONIC</li>
  <li class="genre-tag">AMBIENT</li>
  <li class="genre-tag">NEOCLASSICAL</li>
  <li class="genre-tag">POP</li>
</ul>
```

**CSS Implementation:**

```css
.genre-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
  justify-content: center;
}

.genre-tag {
  display: inline-block;
  padding: 0.5rem 1.25rem;
  border: 1px solid var(--color-gold);
  border-radius: 100px; /* Pill shape */
  font-family: var(--font-sans);
  font-weight: var(--font-weight-semibold);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-gold);
  transition: all 0.2s ease;
}

/* Optional hover state if tags become interactive later */
.genre-tag:hover {
  background-color: var(--color-gold);
  color: var(--color-bg);
}
```

**Key Techniques:**
- `border-radius: 100px` creates pill shape regardless of content length
- Flexbox with `flex-wrap: wrap` for natural flow
- Gold outline style for non-interactive display; fill on hover if made interactive

**Design Note:** Per [Smart Interface Design Patterns](https://smart-interface-design-patterns.com/articles/badges-chips-tags-pills/), these are static display tags (not interactive filters), so they should not look like buttons.

---

## Partners Section (PART-01, PART-02)

### Partner Display

Three partners: SoundOn, Downtown, Well Overdue with descriptions.

**Recommended Structure:**

```html
<div class="partners-grid">
  <article class="partner-card">
    <h3 class="partner-name">SOUNDON</h3>
    <p class="partner-description">Distribution</p>
  </article>
  <!-- repeat -->
</div>
```

**CSS Implementation:**

```css
.partners-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-lg);
  text-align: center;
}

.partner-name {
  font-family: var(--font-sans);
  font-weight: var(--font-weight-bold);
  font-size: 1.25rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-white);
  margin-bottom: var(--space-xs);
}

.partner-description {
  font-family: var(--font-sans);
  font-weight: var(--font-weight-regular);
  font-size: 0.875rem;
  color: var(--color-gold);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}
```

---

## Form Implementation

### HTML5 Constraint Validation API (FORM-03 through FORM-11)

**Do not use a third-party library.** The native browser Constraint Validation API provides everything needed.

**Key API Methods:**

| Method | Purpose |
|--------|---------|
| `element.checkValidity()` | Returns `true` if value meets all constraints |
| `element.reportValidity()` | Checks validity AND shows browser's built-in error message |
| `element.setCustomValidity(msg)` | Sets custom error message; pass empty string to clear |

**Key ValidityState Properties:**

```javascript
element.validity.valid          // true if all constraints met
element.validity.valueMissing   // true if required field is empty
element.validity.typeMismatch   // true if value doesn't match type (email, url)
element.validity.patternMismatch // true if value doesn't match pattern
element.validity.tooShort       // true if shorter than minlength
```

### Form HTML Structure

```html
<form class="demo-form" novalidate>
  <!-- novalidate disables browser's default messages, allowing custom styling -->

  <div class="form-group">
    <label for="artist-name">Artist Name *</label>
    <input type="text" id="artist-name" name="artist-name" required>
    <span class="form-error" aria-live="polite"></span>
  </div>

  <div class="form-group">
    <label for="email">Contact Email *</label>
    <input type="email" id="email" name="email" required>
    <span class="form-error" aria-live="polite"></span>
  </div>

  <div class="form-group">
    <label for="release-name">Release Name *</label>
    <input type="text" id="release-name" name="release-name" required>
    <span class="form-error" aria-live="polite"></span>
  </div>

  <div class="form-group">
    <label for="release-type">Release Type</label>
    <select id="release-type" name="release-type" required>
      <option value="">Select type...</option>
      <option value="single">Single</option>
      <option value="ep">EP</option>
      <option value="album">Album</option>
    </select>
    <span class="form-error" aria-live="polite"></span>
  </div>

  <div class="form-group">
    <label for="listen-link">Listen Link *</label>
    <input type="url" id="listen-link" name="listen-link" required
           placeholder="https://...">
    <span class="form-error" aria-live="polite"></span>
  </div>

  <fieldset class="form-group">
    <legend>Genre (select all that apply)</legend>
    <div class="checkbox-group">
      <label class="checkbox-label">
        <input type="checkbox" name="genre" value="uk-rap">
        <span class="checkbox-custom"></span>
        UK Rap
      </label>
      <!-- repeat for each genre -->
    </div>
  </fieldset>

  <div class="form-group">
    <label for="notes">Notes (optional)</label>
    <textarea id="notes" name="notes" rows="4"></textarea>
  </div>

  <button type="submit" class="cta-button">SEND TRANSMISSION</button>
</form>
```

### Form Validation JavaScript Pattern

```javascript
// form-validation.js
const form = document.querySelector('.demo-form');
const inputs = form.querySelectorAll('input, select, textarea');

// Real-time validation on blur
inputs.forEach(input => {
  input.addEventListener('blur', () => validateField(input));
  input.addEventListener('input', () => {
    // Clear error on input if previously invalid
    if (input.classList.contains('invalid')) {
      validateField(input);
    }
  });
});

// Submit validation
form.addEventListener('submit', (e) => {
  e.preventDefault();

  let isValid = true;
  inputs.forEach(input => {
    if (!validateField(input)) {
      isValid = false;
    }
  });

  if (isValid) {
    // Form is valid - handle submission
    console.log('Form valid, ready to submit');
    // In Phase 2, just show success message
    // Backend integration is v2 scope
  }
});

function validateField(field) {
  const errorSpan = field.parentElement.querySelector('.form-error');

  // Reset custom validity
  field.setCustomValidity('');

  // Check native validity
  if (!field.checkValidity()) {
    field.classList.add('invalid');
    field.classList.remove('valid');

    // Set custom error messages
    if (field.validity.valueMissing) {
      errorSpan.textContent = 'This field is required.';
    } else if (field.validity.typeMismatch) {
      if (field.type === 'email') {
        errorSpan.textContent = 'Please enter a valid email address.';
      } else if (field.type === 'url') {
        errorSpan.textContent = 'Please enter a valid URL (https://...).';
      }
    } else if (field.validity.patternMismatch) {
      errorSpan.textContent = field.dataset.errorMessage || 'Invalid format.';
    }

    return false;
  } else {
    field.classList.remove('invalid');
    field.classList.add('valid');
    errorSpan.textContent = '';
    return true;
  }
}
```

**Source:** [MDN Client-side Form Validation](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms/Form_validation)

### Form CSS Styling

```css
.demo-form {
  max-width: 600px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: var(--space-lg);
}

.form-group label,
.form-group legend {
  display: block;
  font-family: var(--font-sans);
  font-weight: var(--font-weight-semibold);
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-white);
  margin-bottom: var(--space-sm);
}

/* Input base styles */
.demo-form input[type="text"],
.demo-form input[type="email"],
.demo-form input[type="url"],
.demo-form select,
.demo-form textarea {
  width: 100%;
  padding: 0.875rem 1rem;
  background-color: transparent;
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: var(--color-white);
  font-family: var(--font-sans);
  font-size: 1rem;
  transition: border-color 0.2s ease, background-color 0.2s ease;
}

/* Focus state */
.demo-form input:focus,
.demo-form select:focus,
.demo-form textarea:focus {
  outline: none;
  border-color: var(--color-gold);
  background-color: rgba(197, 160, 89, 0.05);
}

/* Valid state */
.demo-form input.valid,
.demo-form select.valid,
.demo-form textarea.valid {
  border-color: var(--color-gold);
}

/* Invalid state */
.demo-form input.invalid,
.demo-form select.invalid,
.demo-form textarea.invalid {
  border-color: #e74c3c;
  background-color: rgba(231, 76, 60, 0.05);
}

/* Error message */
.form-error {
  display: block;
  font-family: var(--font-sans);
  font-size: 0.75rem;
  color: #e74c3c;
  margin-top: var(--space-xs);
  min-height: 1.2em; /* Prevents layout shift */
}

/* Placeholder styling */
.demo-form input::placeholder,
.demo-form textarea::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

/* Select dropdown styling */
.demo-form select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%23C5A059' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10l-5 5z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  padding-right: 2.5rem;
  cursor: pointer;
}

.demo-form select option {
  background-color: var(--color-bg);
  color: var(--color-white);
}
```

**Source:** [Modern CSS Form Styles](https://moderncss.dev/custom-css-styles-for-form-inputs-and-textareas/)

### Multi-Select Checkbox Styling (FORM-08)

Custom checkbox styling while maintaining accessibility:

```css
/* Hide native checkbox but keep accessible */
.checkbox-group input[type="checkbox"] {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.checkbox-label {
  display: inline-flex;
  align-items: center;
  gap: var(--space-sm);
  padding: 0.5rem 0;
  cursor: pointer;
  font-family: var(--font-sans);
  font-size: 0.875rem;
  color: var(--color-white);
  user-select: none;
}

.checkbox-custom {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.5);
  position: relative;
  transition: all 0.2s ease;
}

/* Focus state - visible for keyboard navigation */
.checkbox-group input[type="checkbox"]:focus + .checkbox-custom {
  outline: 2px solid var(--color-gold);
  outline-offset: 2px;
}

/* Checked state */
.checkbox-group input[type="checkbox"]:checked + .checkbox-custom {
  background-color: var(--color-gold);
  border-color: var(--color-gold);
}

/* Checkmark using clip-path */
.checkbox-group input[type="checkbox"]:checked + .checkbox-custom::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 6px;
  width: 5px;
  height: 10px;
  border: solid var(--color-bg);
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

/* Checkbox grid layout */
.checkbox-group {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: var(--space-sm);
}
```

**Key Accessibility Notes:**
- Never use `display: none` or `visibility: hidden` on the checkbox - it breaks screen reader and keyboard access
- Use `position: absolute; opacity: 0` to visually hide while keeping accessible
- Always maintain visible `:focus` state for keyboard users
- Use `aria-live="polite"` on error messages

**Source:** [Modern CSS Custom Checkbox](https://moderncss.dev/pure-css-custom-checkbox-style/), [Accessible Checkboxes](https://www.evinced.com/blog/creating-accessible-styled-checkboxes)

---

## Section Headers Pattern

Consistent pattern for all section headers:

```css
.section-header {
  font-family: var(--font-sans);
  font-weight: var(--font-weight-bold);
  font-size: clamp(1.75rem, 5vw, 2.5rem);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-white);
  margin-bottom: var(--space-lg);
  text-align: center;
}

.section-subheader {
  font-family: var(--font-sans);
  font-weight: var(--font-weight-regular);
  font-size: 1rem;
  color: var(--color-text-primary);
  max-width: 600px;
  margin: 0 auto var(--space-xl);
  text-align: center;
  line-height: 1.7;
}
```

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Form validation | Custom validation logic from scratch | HTML5 Constraint Validation API | Native browser support, accessible, handles edge cases |
| Email validation regex | Custom regex | `type="email"` + browser validation | Spec-compliant, handles international emails |
| URL validation | Custom URL parsing | `type="url"` + browser validation | Handles all valid URL formats |
| Responsive grids | Media query breakpoints for each | `repeat(auto-fit, minmax())` | Intrinsically responsive, less code |

---

## Common Pitfalls

### Pitfall 1: Using display:none on Checkboxes
**What goes wrong:** Screen readers and keyboards can't access the checkbox
**Why it happens:** Developers want to hide the native checkbox to show custom styling
**How to avoid:** Use `position: absolute; opacity: 0;` instead - hides visually but keeps accessible
**Warning signs:** Can't tab to checkboxes, screen reader doesn't announce them

### Pitfall 2: Forgetting to Reset Custom Validity
**What goes wrong:** Field stays invalid even after user fixes the error
**Why it happens:** `setCustomValidity()` with a non-empty string makes field permanently invalid
**How to avoid:** Always call `setCustomValidity('')` before checking validity
**Warning signs:** Valid-looking inputs still showing as invalid

### Pitfall 3: No Focus States on Form Inputs
**What goes wrong:** Keyboard users can't see which field is active
**Why it happens:** Removed `outline: none` without replacement
**How to avoid:** Always provide visible `:focus` styling with sufficient contrast (3:1 minimum)
**Warning signs:** Tabbing through form with no visual indication

### Pitfall 4: Layout Shift from Error Messages
**What goes wrong:** Page jumps when error messages appear
**Why it happens:** Error elements have no reserved space
**How to avoid:** Set `min-height` on error containers (e.g., `min-height: 1.2em`)
**Warning signs:** Content below form shifts up/down during validation

### Pitfall 5: Missing novalidate Attribute
**What goes wrong:** Browser shows its own ugly error messages alongside custom ones
**Why it happens:** Browser's built-in validation still fires without `novalidate`
**How to avoid:** Add `novalidate` to `<form>` when using custom validation UI
**Warning signs:** Two sets of error messages appearing

---

## Key Implementation Notes

### CSS Pattern Consistency
All grid layouts use the same responsive pattern:
```css
grid-template-columns: repeat(auto-fit, minmax(XXXpx, 1fr));
```
Only the `minmax` value changes based on content type:
- Stats: 200px (smaller items)
- Team/Services: 250-300px (medium content)
- Checkboxes: 150px (compact items)

### Form Accessibility Checklist
- [ ] `novalidate` on form element
- [ ] `aria-live="polite"` on error message containers
- [ ] Labels associated with inputs via `for` attribute
- [ ] `required` attribute on mandatory fields
- [ ] Visible focus states on all interactive elements
- [ ] Custom checkboxes remain keyboard navigable
- [ ] Error messages announce via screen reader

### Color Variables to Add
The form introduces an error state color. Add to `:root`:
```css
--color-error: #e74c3c;
--color-error-bg: rgba(231, 76, 60, 0.05);
```

### JavaScript File
Form validation script goes in `/js/main.js` (already linked in index.html).

---

## Sources

### Primary (HIGH confidence)
- [MDN: Client-side Form Validation](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms/Form_validation) - Complete validation API reference
- [MDN: Card Layout Cookbook](https://developer.mozilla.org/en-US/docs/Web/CSS/How_to/Layout_cookbook/Card) - Grid card patterns
- [Modern CSS: Custom Checkbox Style](https://moderncss.dev/pure-css-custom-checkbox-style/) - Accessible checkbox styling
- [Modern CSS: Form Input Styles](https://moderncss.dev/custom-css-styles-for-form-inputs-and-textareas/) - Form styling patterns

### Secondary (MEDIUM confidence)
- [CSS-Tricks: Flexbox Card Layout](https://getflywheel.com/layout/flexbox-create-modern-card-design-layout/) - Card layout patterns
- [Bootstrap: Badge/Pill Documentation](https://getbootstrap.com/docs/5.3/components/badge/) - Pill styling reference
- [Smart Interface Design Patterns](https://smart-interface-design-patterns.com/articles/badges-chips-tags-pills/) - Badge vs tag distinction
- [Strapi: Vanilla JS Form Handling](https://strapi.io/blog/vanilla-javascript-form-handling-guide) - No-framework approach
- [LogRocket: accent-color](https://blog.logrocket.com/simplify-form-styles-using-css-accent-color/) - Form accent styling

### Tertiary (LOW confidence - community patterns)
- [Frontend Tools Tech: CSS Grid 2025](https://www.frontendtools.tech/blog/mastering-css-grid-2025) - Modern grid practices
- [Evinced: Accessible Checkboxes](https://www.evinced.com/blog/creating-accessible-styled-checkboxes) - Accessibility patterns

---

## Metadata

**Confidence breakdown:**
- Stats grid layout: HIGH - Standard CSS Grid pattern, well-documented
- Team/Services cards: HIGH - MDN cookbook patterns
- Genre tags: HIGH - Standard pill/badge pattern
- Form validation: HIGH - Native browser API, MDN documentation
- Custom checkboxes: HIGH - Well-established accessible pattern
- Form styling: MEDIUM - Dark theme specifics based on general patterns

**Research date:** 2026-01-19
**Valid until:** 2026-03-19 (60 days - stable CSS/JS patterns)
