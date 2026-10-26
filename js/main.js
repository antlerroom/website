/**
 * Antler Room redesign mock-up.
 * Renders artists from ../data/artists.json, runs the demo form in console-only mode,
 * and drives grain and motion with a low-power fallback.
 */

const DATA_URL = 'data/artists.json';
const ARTWORK_DIR = 'media/artists/';

const params = new URLSearchParams(location.search);
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const conn = navigator.connection || {};
const detectedLowPower =
  reducedMotion ||
  conn.saveData === true ||
  (navigator.hardwareConcurrency > 0 && navigator.hardwareConcurrency <= 4) ||
  (navigator.deviceMemory > 0 && navigator.deviceMemory <= 4);
// ?lowpower=1 / ?lowpower=0 forces either mode for reviewing.
const lowPower = params.has('lowpower') ? params.get('lowpower') === '1' : detectedLowPower;
document.documentElement.classList.toggle('low-power', lowPower);

const SVG_NS = 'http://www.w3.org/2000/svg';

function sparkleIcon() {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('aria-hidden', 'true');
  const use = document.createElementNS(SVG_NS, 'use');
  use.setAttribute('href', '#sparkle');
  svg.appendChild(use);
  return svg;
}

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  return node;
}

/** Slug rule from REDESIGN.md: lowercase, spaces to hyphens, accents removed. */
function slugify(name) {
  return name
    .replace(/Ø/g, 'O').replace(/ø/g, 'o')
    .replace(/Æ/g, 'AE').replace(/æ/g, 'ae')
    .replace(/ß/g, 'ss')
    .normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

function placeholder() {
  const ph = el('div', 'art-placeholder');
  ph.setAttribute('aria-hidden', 'true');
  ph.appendChild(sparkleIcon());
  return ph;
}

/* Source JPEGs live in media/artists/<slug>.jpg; the page only loads the WebP renditions next to them. */
function artworkImage(name, { eager = false, sizes = '320px' } = {}) {
  const base = ARTWORK_DIR + slugify(name);
  const img = document.createElement('img');
  img.alt = '';
  img.decoding = 'async';
  img.loading = eager ? 'eager' : 'lazy';
  if (eager) img.fetchPriority = 'high';
  img.sizes = sizes;
  img.srcset = `${base}-320.webp 320w, ${base}-640.webp 640w`;
  img.src = `${base}-640.webp`;
  img.addEventListener('error', () => img.replaceWith(placeholder()), { once: true });
  return img;
}

function spotifyLink(className, href, label) {
  const a = el('a', className);
  a.href = href;
  a.target = '_blank';
  a.rel = 'noopener';
  a.setAttribute('aria-label', label);
  return a;
}

/* ---------- Cards (roster, worked with) ---------- */

function workOverlay(role, work) {
  const overlay = el('div', 'work-overlay');
  overlay.setAttribute('aria-hidden', 'true');
  overlay.appendChild(el('p', 'work-title', 'What we did'));
  if (role.length) overlay.appendChild(el('p', 'work-role', role.join(' · ')));
  if (work.length) {
    const list = el('ul', 'work-list');
    work.forEach(item => list.appendChild(el('li', null, item)));
    overlay.appendChild(list);
  }
  return overlay;
}

function mediaCard({ href, label, image, tag, name, stat, statLabel, highlight = '', role = [], work = [], feature = false, className = '' }) {
  const card = spotifyLink(('artist-card ' + className).trim(), href, label);
  if (feature) card.classList.add('artist-card--feature');

  const art = el('div', 'artist-art');
  art.appendChild(image);
  if (role.length || work.length) {
    card.classList.add('has-work');
    art.appendChild(workOverlay(role, work));
  }

  const pill = el('span', 'pill genre-tag');
  pill.append(sparkleIcon(), document.createTextNode(tag));
  art.appendChild(pill);

  const hint = el('span', 'spotify-hint');
  hint.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M7 17L17 7M9 7h8v8"/></svg>';
  art.appendChild(hint);

  const meta = el('div', 'artist-meta');
  meta.appendChild(el('h3', 'artist-name', name));
  const stats = el('p', 'artist-listeners');
  stats.append(el('strong', null, stat), document.createTextNode(statLabel));
  meta.appendChild(stats);
  if (highlight) meta.appendChild(el('p', 'artist-highlight', highlight));

  card.append(art, meta);
  return card;
}

/* Rendered widths per grid, so the browser picks the 320w or 640w artwork. */
const SIZES = {
  roster: '(max-width: 700px) calc(50vw - 26px), (max-width: 1200px) calc(25vw - 28px), 262px',
  rosterFeature: '(max-width: 700px) calc(100vw - 40px), (max-width: 1200px) calc(50vw - 40px), 548px',
  worked: '(max-width: 700px) calc(50vw - 26px), (max-width: 1199px) calc(25vw - 28px), 146px',
  workedFeature: '(max-width: 700px) calc(100vw - 40px), (max-width: 1199px) calc(50vw - 40px), 308px',
  laneTile: '(max-width: 700px) 29vw, 110px',
  laneSolo: '(max-width: 700px) 58vw, 220px',
  thumb: '34px',
};

function artistCard(artist, { feature = false, eager = false, sizes = SIZES.roster } = {}) {
  const role = artist.role || [];
  const work = artist.work || [];
  const card = mediaCard({
    href: artist.spotify,
    label: `${artist.name}, ${artist.listeners_display} monthly listeners, ${artist.genre}.` +
      (role.length ? ` What we did: ${role.join(', ')}.` : '') +
      (work.length ? ` ${work.join('; ')}.` : '') + ' Open on Spotify',
    image: artworkImage(artist.name, { eager, sizes }),
    tag: artist.genre,
    name: artist.name,
    stat: artist.listeners_display,
    statLabel: 'monthly listeners',
    highlight: artist.highlight || '',
    role,
    work,
    feature,
  });
  if (artist.lane) card.dataset.lane = artist.lane;
  return card;
}

function renderRoster(data) {
  const grid = document.getElementById('roster-grid');
  const laneOrder = new Map(data.lanes.map(l => [l.id, l.order]));
  const roster = [...data.antler_roster].sort((a, b) =>
    (laneOrder.get(a.lane) ?? 99) - (laneOrder.get(b.lane) ?? 99) ||
    b.monthly_listeners - a.monthly_listeners
  );

  const frag = document.createDocumentFragment();
  roster.forEach((artist, i) => {
    const feature = i === 0;
    frag.appendChild(artistCard(artist, { feature, eager: i < 4, sizes: feature ? SIZES.rosterFeature : SIZES.roster }));
  });
  grid.replaceChildren(frag);
}

/* ---------- Artists our team have worked with ---------- */

/* Shown first, in this order; everyone else follows by monthly listeners. */
const WORKED_PINNED = ['Øneheart', 'Cult Member'];

/* 26 artists: three 2x2 lead cards fill 7 columns exactly on desktop (12 + 23 = 35 cells),
   two fill 4 columns on tablet and 2 on mobile (8 + 24 = 32 cells). */
const wideWorkedGrid = window.matchMedia('(min-width: 1200px)');

function renderWorkedWith(data) {
  const pinRank = name => {
    const i = WORKED_PINNED.indexOf(name);
    return i === -1 ? WORKED_PINNED.length : i;
  };
  const worked = [...data.previously_worked_with]
    .sort((a, b) => pinRank(a.name) - pinRank(b.name) || b.monthly_listeners - a.monthly_listeners);
  const features = wideWorkedGrid.matches ? 3 : 2;

  const grid = document.getElementById('worked-grid');
  const frag = document.createDocumentFragment();
  worked.forEach((artist, i) => {
    const feature = i < features;
    frag.appendChild(artistCard(artist, { feature, sizes: feature ? SIZES.workedFeature : SIZES.worked }));
  });
  grid.replaceChildren(frag);
}

/* ---------- Lanes ---------- */

function laneCard(lane, artists) {
  const card = el('article', 'artist-card lane-card');

  const art = el('div', 'artist-art lane-mosaic');
  const shown = artists.slice(0, 4);
  art.dataset.count = shown.length;
  const sizes = shown.length === 1 ? SIZES.laneSolo : SIZES.laneTile;
  shown.forEach(a => art.appendChild(artworkImage(a.name, { sizes })));

  const n = artists.length;
  const pill = el('span', 'pill genre-tag');
  pill.append(sparkleIcon(), document.createTextNode(`${n} artist${n === 1 ? '' : 's'}`));
  art.appendChild(pill);

  const meta = el('div', 'artist-meta');
  meta.appendChild(el('h3', 'artist-name', lane.name));
  const names = el('ul', 'lane-artists');
  artists.forEach(a => {
    const li = el('li');
    const link = spotifyLink('lane-artist', a.spotify, `${a.name} on Spotify`);
    link.textContent = a.name;
    li.appendChild(link);
    names.appendChild(li);
  });
  meta.appendChild(names);

  card.append(art, meta);
  return card;
}

function renderLanes(data) {
  const grid = document.getElementById('lane-grid');
  if (!grid) return;
  const frag = document.createDocumentFragment();
  [...data.lanes].sort((a, b) => a.order - b.order).forEach(lane => {
    const artists = data.antler_roster
      .filter(a => a.lane === lane.id)
      .sort((a, b) => b.monthly_listeners - a.monthly_listeners);
    if (artists.length) frag.appendChild(laneCard(lane, artists));
  });
  grid.replaceChildren(frag);
}

async function loadArtists() {
  try {
    // Default fetch options so this reuses the <link rel="preload"> response in index.html.
    const res = await fetch(DATA_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    renderRoster(data);
    renderWorkedWith(data);
    wideWorkedGrid.addEventListener('change', () => renderWorkedWith(data));
    renderLanes(data);
    renderStatBacks(data);
  } catch (err) {
    console.error('[mock-up] Could not load artists.json', err);
    const status = document.querySelector('#roster-grid .data-status');
    if (status) {
      status.textContent = location.protocol === 'file:'
        ? 'Artists load from data/artists.json, which browsers block on file:// pages. Run "python3 -m http.server 8000" in the repo folder and open http://localhost:8000/mockup/.'
        : 'Could not load data/artists.json.';
    }
  }
}

/* ---------- Demo form (mock-up: never submits) ---------- */

function initDemoForm() {
  const form = document.querySelector('.demo-form');
  if (!form) return;

  const fields = form.querySelectorAll('input:not([name="website"]):not([type="radio"]):not([type="checkbox"]), textarea');
  const genrePicker = form.querySelector('.genre-picker');
  genrePicker.addEventListener('change', () => validateGenre(genrePicker));
  const rights = form.querySelector('#rights');
  rights.addEventListener('change', () => validateCheck(rights, 'Please confirm you have the rights to this music.'));
  const formLoadTime = Date.now();
  const minSubmitTime = 3000;

  const linkInput = form.querySelector('#link');
  linkInput.addEventListener('blur', () => {
    const v = linkInput.value.trim();
    if (v && !/^[a-z][a-z0-9+.-]*:\/\//i.test(v)) linkInput.value = 'https://' + v;
  });
  // Any link is accepted; a non-SoundCloud link just swaps the hint for a reminder about sharing settings.
  const linkHelp = form.querySelector('#link-help');
  const linkHelpDefault = linkHelp.textContent;
  const updateLinkHelp = () => {
    const v = linkInput.value.trim();
    const other = /^https?:\/\/[^/\s]+\.[^/\s]+/i.test(v) && !isSoundCloud(v);
    linkHelp.textContent = other ? 'Not SoundCloud? No problem. Make sure anyone with the link can listen.' : linkHelpDefault;
  };
  linkInput.addEventListener('input', updateLinkHelp);
  linkInput.addEventListener('blur', updateLinkHelp);

  fields.forEach(field => {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => {
      if (field.classList.contains('invalid')) validateField(field);
    });
  });

  form.addEventListener('submit', e => {
    e.preventDefault();

    const honeypot = form.querySelector('#website');
    if (honeypot && honeypot.value !== '') {
      console.warn('[mock-up] Honeypot filled: bot path, fake success shown, nothing logged as a submission.');
      showSuccess(form);
      return;
    }

    const timeSpent = Date.now() - formLoadTime;
    if (timeSpent < minSubmitTime) {
      console.warn(`[mock-up] Submitted after ${timeSpent}ms (< ${minSubmitTime}ms): bot path, fake success shown.`);
      showSuccess(form);
      return;
    }

    let valid = true;
    fields.forEach(f => { if (!validateField(f)) valid = false; });
    if (!validateGenre(genrePicker)) valid = false;
    if (!validateCheck(rights, 'Please confirm you have the rights to this music.')) valid = false;
    if (!valid) {
      const first = form.querySelector('.invalid');
      (first.matches('input, textarea') ? first : first.querySelector('input')).focus();
      return;
    }

    const value = id => form.querySelector('#' + id).value.trim();
    // Same keys as the live form's Apps Script (sheet columns); linkType and rightsConfirmed are new columns.
    const payload = {
      artistName: value('artist-name'),
      email: value('email'),
      releaseName: value('song-name'),
      listenLink: value('link'),
      linkType: isSoundCloud(value('link')) ? 'SoundCloud' : 'Other',
      genres: form.querySelector('input[name="genre"]:checked').value,
      notes: value('info'),
      rightsConfirmed: rights.checked ? 'Yes' : 'No',
      _timeSpent: Math.round(timeSpent / 1000)
    };

    console.log('[mock-up] Demo form payload (NOT sent anywhere):', payload);
    showSuccess(form, payload);
  });
}

function validateField(field) {
  const group = field.closest('.form-group');
  const error = group ? group.querySelector('.form-error') : null;

  if (!field.required && field.value.trim() === '') {
    field.classList.remove('invalid', 'valid');
    if (error) error.textContent = '';
    return true;
  }

  if (field.required && field.value.trim() === '') field.value = '';

  if (field.checkValidity()) {
    field.classList.remove('invalid');
    field.classList.add('valid');
    if (error) error.textContent = '';
    return true;
  }

  field.classList.add('invalid');
  field.classList.remove('valid');
  if (error) {
    const v = field.validity;
    if (v.valueMissing) error.textContent = 'This field is required.';
    else if (v.typeMismatch && field.type === 'email') error.textContent = 'Please enter a valid email address.';
    else if (v.typeMismatch && field.type === 'url') error.textContent = 'Please enter a valid link (https://...).';
    else if (v.customError) error.textContent = field.validationMessage;
    else error.textContent = 'Please check this field.';
  }
  return false;
}

function isSoundCloud(url) {
  try {
    const host = new URL(url).hostname.replace(/^www\./, '');
    return host === 'soundcloud.com' || host.endsWith('.soundcloud.com') || host === 'snd.sc';
  } catch {
    return false;
  }
}

function validateCheck(box, message) {
  const group = box.closest('.form-group');
  group.classList.toggle('invalid', !box.checked);
  group.querySelector(':scope > .form-error').textContent = box.checked ? '' : message;
  return box.checked;
}

function validateGenre(picker) {
  const checked = picker.querySelector('input:checked');
  picker.classList.toggle('invalid', !checked);
  picker.querySelector('.form-error').textContent = checked ? '' : 'Please choose a genre.';
  return Boolean(checked);
}

function showSuccess(form, payload) {
  const wrap = form.parentElement;
  form.hidden = true;

  const success = el('div', 'form-success');
  success.setAttribute('role', 'status');
  const canvas = document.createElement('canvas');
  canvas.className = 'form-success-grain';
  canvas.setAttribute('aria-hidden', 'true');
  canvas.width = 260;
  canvas.height = 150;
  success.append(canvas, el('h3', 'form-success-title', 'Demo received'));
  if (payload) {
    const recap = el('p', 'pill form-success-recap');
    recap.append(sparkleIcon(), document.createTextNode(`${payload.artistName} · ${payload.releaseName}`));
    success.appendChild(recap);
  }
  success.append(
    el('p', 'form-success-text', 'Thank you for your submission. Our team will review your music and get back to you as soon as we can.'),
    el('p', 'form-success-note', 'Please make sure your link stays active while we listen.')
  );

  const again = el('button', 'btn btn--ghost btn--small form-success-again', 'Send another demo');
  again.type = 'button';
  again.addEventListener('click', () => {
    success.remove();
    form.reset();
    form.querySelectorAll('.valid, .invalid').forEach(n => n.classList.remove('valid', 'invalid'));
    form.querySelectorAll('.form-error').forEach(n => (n.textContent = ''));
    form.querySelector('#link').dispatchEvent(new Event('input'));
    form.hidden = false;
    form.querySelector('input').focus();
  });
  success.appendChild(again);

  wrap.appendChild(success);
  success.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'center' });

  const ctx = canvas.getContext('2d');
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  const particles = Array.from({ length: 80 }, () => {
    const angle = Math.random() * Math.PI * 2;
    const dist = Math.random() * 90;
    return {
      x: cx, y: cy,
      tx: cx + Math.cos(angle) * dist,
      ty: cy + Math.sin(angle) * dist * 0.6,
      size: Math.random() * 2 + 0.5,
      alpha: 0,
      targetAlpha: Math.random() * 0.5 + 0.2,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.8 + 0.3
    };
  });

  let t = 0;
  let frames = 0;
  const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    t += 0.02;
    frames++;
    particles.forEach(p => {
      p.x += (p.tx - p.x) * 0.08;
      p.y += (p.ty - p.y) * 0.08;
      p.alpha += (p.targetAlpha - p.alpha) * 0.05;
      const dx = Math.sin(t * p.speed + p.phase) * 6;
      const dy = Math.cos(t * p.speed + p.phase) * 6;
      ctx.fillStyle = `rgba(197, 160, 89, ${p.alpha * (Math.sin(t * 2 + p.phase) * 0.15 + 0.85)})`;
      ctx.fillRect(p.x + dx, p.y + dy, p.size, p.size);
    });
    // Settle after ~8s so the canvas isn't animating forever.
    if (!lowPower && frames < 480 && !document.hidden) requestAnimationFrame(draw);
  };
  draw();
  if (lowPower) for (let i = 0; i < 60; i++) draw();
}

/* ---------- Background grain ---------- */

function initGrain() {
  const canvas = document.createElement('canvas');
  canvas.className = 'grain-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  // Drawn at half resolution and upscaled by CSS: chunkier film grain, a quarter of the pixels.
  const SCALE = 0.5;
  const TILE = 128;
  const tiles = Array.from({ length: 4 }, () => {
    const tile = document.createElement('canvas');
    tile.width = tile.height = TILE;
    const tctx = tile.getContext('2d');
    const img = tctx.createImageData(TILE, TILE);
    for (let i = 0; i < img.data.length; i += 4) {
      const v = Math.random() * 255;
      img.data[i] = v;
      img.data[i + 1] = v * 0.94;
      img.data[i + 2] = v * 0.86;
      img.data[i + 3] = 34;
    }
    tctx.putImageData(img, 0, 0);
    return ctx.createPattern(tile, 'repeat');
  });

  let frame = 0;
  const render = () => {
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    ctx.save();
    ctx.translate(-Math.random() * TILE, -Math.random() * TILE);
    ctx.fillStyle = tiles[frame++ % tiles.length];
    ctx.fillRect(0, 0, w + TILE, h + TILE);
    ctx.restore();
  };

  const resize = () => {
    canvas.width = Math.ceil(window.innerWidth * SCALE);
    canvas.height = Math.ceil(window.innerHeight * SCALE);
    render();
  };
  resize();
  window.addEventListener('resize', resize, { passive: true });

  if (lowPower) return;

  const INTERVAL = 80;
  let last = 0;
  let rafId = 0;
  const loop = ts => {
    if (ts - last > INTERVAL) { render(); last = ts; }
    rafId = requestAnimationFrame(loop);
  };
  const start = () => { if (!rafId) rafId = requestAnimationFrame(loop); };
  const stop = () => { cancelAnimationFrame(rafId); rafId = 0; };

  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
  start();
}

/* ---------- Cursor grain cloud (fine pointers only) ---------- */

function initCursorGrain() {
  if (lowPower || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  const canvas = document.createElement('canvas');
  canvas.className = 'cursor-grain';
  canvas.width = canvas.height = 200;
  canvas.setAttribute('aria-hidden', 'true');
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  const grains = Array.from({ length: 360 }, () => {
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * 75;
    return {
      bx: Math.cos(angle) * distance,
      by: Math.sin(angle) * distance,
      size: Math.random() * 1.5 + 0.5,
      alpha: Math.random() * 0.45 + 0.1,
      r: Math.random() * 20 + 8,
      sx: Math.random() * 1.5 + 0.5,
      sy: Math.random() * 1.5 + 0.5,
      px: Math.random() * Math.PI * 2,
      py: Math.random() * Math.PI * 2,
      fs: Math.random() * 2 + 1,
      fp: Math.random() * Math.PI * 2,
      w: Math.random() * 0.3 + 0.7
    };
  });

  let mx = -300, my = -300, cx = -300, cy = -300, vx = 0, vy = 0, t = 0;
  let lastMove = 0;
  let rafId = 0;

  const tick = now => {
    vx = Math.max(-50, Math.min(50, (vx + (mx - cx) * 0.8) * 0.6));
    vy = Math.max(-50, Math.min(50, (vy + (my - cy) * 0.8) * 0.6));
    cx += vx;
    cy += vy;
    canvas.style.transform = `translate(${cx - 100}px, ${cy - 100}px)`;

    ctx.clearRect(0, 0, 200, 200);
    t += 0.016;
    const stretch = Math.min(Math.hypot(vx, vy) / 15, 1);
    for (const g of grains) {
      const x = 100 + g.bx + Math.sin(t * g.sx + g.px) * g.r - vx * (1 - g.w) * 0.5;
      const y = 100 + g.by + Math.cos(t * g.sy + g.py) * g.r - vy * (1 - g.w) * 0.5;
      const dist = Math.hypot(g.bx, g.by);
      const a = g.alpha * (1 - dist / 90) * (Math.sin(t * g.fs + g.fp) * (0.25 + stretch * 0.1) + 0.75);
      if (a > 0) {
        ctx.fillStyle = `rgba(170, 140, 100, ${a})`;
        ctx.fillRect(x, y, g.size, g.size);
      }
    }

    // Idle after 2s without mouse movement so it costs nothing at rest.
    if (now - lastMove < 2000 && !document.hidden) {
      rafId = requestAnimationFrame(tick);
    } else {
      rafId = 0;
      canvas.style.opacity = '0';
    }
  };

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    lastMove = performance.now();
    canvas.style.opacity = '1';
    if (!rafId) rafId = requestAnimationFrame(tick);
  }, { passive: true });
}

/* ---------- Motion ---------- */

function initReveal() {
  const items = document.querySelectorAll('.fade-in');
  if (!('IntersectionObserver' in window) || reducedMotion) {
    items.forEach(i => i.classList.add('is-visible'));
    return;
  }
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
  items.forEach(i => io.observe(i));
}

/* Back of each stat card: the records behind the number, from team_stats in artists.json. */
function renderStatBacks(data) {
  const stats = data.team_stats || {};
  document.querySelectorAll('.stat[data-stat]').forEach(card => {
    const stat = stats[card.dataset.stat];
    const back = card.querySelector('.stat-back');
    if (!stat || !back) return;

    const head = el('div', 'stat-back-head');
    head.append(
      el('p', 'stat-back-title', stat.title),
      el('p', 'stat-back-total', card.querySelector('.stat-number').textContent + ' ' + card.querySelector('.stat-label').textContent)
    );
    const list = el('ol', 'stat-list');
    stat.items.forEach((item, i) => {
      const li = el('li', 'stat-item');
      li.style.setProperty('--i', i);
      const name = el('span', 'stat-item-name', item.artist);
      name.appendChild(el('small', null, item.detail));
      li.append(artworkImage(item.artist, { sizes: SIZES.thumb }), name, el('span', 'stat-item-value', item.display));
      list.appendChild(li);
    });
    back.replaceChildren(head, list);
  });
}

function initStatCards() {
  document.querySelectorAll('.stat[data-stat]').forEach(card => {
    const toggle = card.querySelector('.stat-toggle');
    const back = card.querySelector('.stat-back');
    back.setAttribute('aria-hidden', 'true');
    toggle.addEventListener('click', () => {
      const flipped = card.classList.toggle('is-flipped');
      toggle.setAttribute('aria-expanded', String(flipped));
      back.setAttribute('aria-hidden', String(!flipped));
      // Flipping before the count-up has run would hide it, so finish it now.
      card.closest('.stats-row').classList.add('is-counted');
    });
    card.addEventListener('pointermove', e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - r.left}px`);
      card.style.setProperty('--my', `${e.clientY - r.top}px`);
    }, { passive: true });
  });
}

function initStats() {
  const row = document.querySelector('.stats-row');
  if (!row) return;
  initStatCards();
  if (reducedMotion || !('IntersectionObserver' in window)) {
    row.classList.add('is-counted');
    return;
  }

  const countUp = node => {
    const target = parseFloat(node.dataset.countTo);
    const suffix = node.dataset.suffix || '';
    const finalText = node.textContent;
    const duration = 1400;
    const t0 = performance.now();
    const step = now => {
      const p = Math.min((now - t0) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      if (p < 1) {
        node.textContent = Math.max(1, Math.round(target * eased)) + suffix;
        requestAnimationFrame(step);
      } else {
        node.textContent = finalText;
      }
    };
    requestAnimationFrame(step);
  };

  const io = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return;
    if (row.classList.contains('is-counted')) return io.disconnect();
    row.classList.add('is-counted');
    row.querySelectorAll('[data-count-to]').forEach(countUp);
    io.disconnect();
  }, { threshold: 0.5 });
  io.observe(row);
}

/* The poster <img> is the first paint; the video is fetched only after the load event and fades in once playing.
   Reduced motion, Save-Data and 2G/3G connections keep the poster only. */
function initHeroVideo() {
  const video = document.querySelector('.hero-video');
  if (!video) return;
  const slowNetwork = /^(slow-2g|2g|3g)$/.test(conn.effectiveType || '');
  if (reducedMotion || conn.saveData || slowNetwork) return;

  const attach = () => {
    const small = window.matchMedia('(max-width: 700px)').matches;
    video.muted = true;
    video.src = small ? video.dataset.srcSmall : video.dataset.src;
    video.addEventListener('playing', () => video.classList.add('is-playing'), { once: true });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      }).observe(video);
    } else {
      video.play().catch(() => {});
    }
  };
  if (document.readyState === 'complete') attach();
  else window.addEventListener('load', attach, { once: true });
}

function initMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  const opener = document.querySelector('.nav-hamburger');
  if (!menu || !opener) return;

  if (typeof menu.showPopover === 'function') {
    menu.addEventListener('toggle', e => opener.setAttribute('aria-expanded', String(e.newState === 'open')));
    menu.querySelectorAll('a[href^="#"]').forEach(link => link.addEventListener('click', () => menu.hidePopover()));
    return;
  }

  // No Popover API (iOS Safari < 17). The nav's backdrop-filter would trap a fixed child, so the menu moves to <body>.
  document.body.appendChild(menu);
  const setOpen = open => {
    menu.classList.toggle('is-open', open);
    opener.setAttribute('aria-expanded', String(open));
    if (open) menu.querySelector('.mobile-menu-close').focus();
  };
  opener.addEventListener('click', () => setOpen(true));
  menu.querySelector('.mobile-menu-close').addEventListener('click', () => { setOpen(false); opener.focus(); });
  menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setOpen(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && menu.classList.contains('is-open')) setOpen(false); });
}

document.addEventListener('DOMContentLoaded', () => {
  loadArtists();
  initDemoForm();
  initGrain();
  initCursorGrain();
  initReveal();
  initStats();
  initHeroVideo();
  initMobileMenu();
});
