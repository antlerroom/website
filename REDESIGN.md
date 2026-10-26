# Antler Room website redesign plan

Brief for Cursor / Claude Code. Repo: antlerroom/website (static HTML/CSS/JS, GitHub Pages, CNAME antlerroom.co.uk).

## Working rules

- Work only on the branch `redesign`. Never commit to `main`, never push.
- Show a plan of the new page structure and wait for Joey's OK before editing any file.
- Leave the current `index.html` and `info/index.html` working on `main` until Joey approves.
- Preview locally with `python3 -m http.server 8000`, or drag the folder into Netlify Drop for a phone preview link.
- Go live only by merging `redesign` into `main` after sign-off.

## Keep

- Static site, no framework
- Brand: charcoal #120E0B, gold #C5A059, "ANTLER" bold sans + "Room" italic serif, grain, sunburst and star motifs
- Existing demo form submit (Apps Script) and anti-bot timer
- 10B+ streams / 1T+ social views stats
- Team section (Joey and Vova bios from /info)
- Partners: SoundOn, Downtown, Well Overdue
- From /info: case studies, Songs We've Worked, How We Promote Your Music, Deal Philosophy

## Remove

- The password gate (the `ar-gate` script, styles and `ar-locked` class in index.html). The site is fully public.
- Every email address and mailto link, and the contact section
- Any deal terms
- Duplicate content between the home page and /info (merge into one page)

## Page order

1. **Header + short hero.** Logo, one line ("Independent digital record label"), two buttons: "Our artists" (scrolls) and "Send a demo" (scrolls). Hero must be short so the artists sit in the first screen on desktop and just below it on mobile.
2. **Antler Room artists (the headline section).** Lane tabs or stacked lane blocks in this order: Outsider House, Ambient & Dreamscape, UK Rap, Jazz House, Neo-classical. Within each lane, artists sorted by monthly listeners, biggest first. Card: large square artwork, name, monthly listeners, genre; the whole card links to the artist's Spotify page (new tab). Large cards, high on the page, the most visual part of the site.
3. **Demo form.** Moved up from the bottom. Six fields, all required except Info:
    - Artist name
    - Song name
    - Link (helper text: "SoundCloud preferred, private links fine")
    - Email
    - Genre (dropdown: Outsider House, Ambient & Dreamscape, UK Rap, Jazz House, Neo-classical, Other)
    - Info (free text, optional)
   Keep the existing Apps Script submit and anti-bot timer; update the Apps Script field names to match. Drop the old Website, Release Type and genre checkbox fields.
4. **Stats.** 10B+ streams, 1T+ social views.
5. **Artists our team has worked with.** Smaller, lighter tiles than the roster (name, listener stat), so it reads as a separate section. Sits with the case studies (Øneheart, Flawed Mangoes, .diedlonely, Cult Member).
6. **Songs we've worked.** From /info.
7. **How we promote your music.** From /info, shortened.
8. **Deal philosophy.** "Artist-first splits. Better contracts. Record by record." No terms.
9. **Team.** Joey and Vova.
10. **Genres.** Match the lane list above.
11. **Partners.** SoundOn, Downtown, Well Overdue.
12. **Footer.** Logo, social links, copyright. No emails.

## Data

- Artists come from `data/artists.json`; the page renders from it so Joey can edit without touching HTML.
- `antler_roster` = Antler Room artists; `previously_worked_with` = team track record. Never mix the two.
- Artwork in `media/artists/<slug>.jpg` (slug = lowercase name, spaces to hyphens, accents removed). Show a gold placeholder tile if missing.
- Listener counts were read from live Spotify pages on 25 Oct 2026; refresh them the day the site goes live, and add a monthly refresh to the bots' routine.
- Antler roster cut-off: about 50K monthly listeners. Previously worked with: 500K+ or outsider house.

## Design notes

- Tighter than /info today: shorter copy blocks, more whitespace, no section longer than one screen on mobile.
- Artist cards in the joeyschoen.com style: artwork, bold name, bold listener figure.
- Keep grain and motion but make sure they don't slow mobile (pause the grain canvas when off screen or on low-power devices).
- After approval, `/info` redirects to `/`.

## Open decisions for Joey

- [x] Password gate: removed, site public
- [x] Demo form fields: artist name, song name, link, email, genre, info
- [x] GG Magree: not on the site
- [x] Neo-classical: Teesa only
- [x] Genres set; Raban, Adam Dodson, Junior RCE, Yere and Elijah Lee left out

## How to run it safely (mock-up first)

The new design is built as a separate mock-up next to the live site. The live files are never touched until Joey approves.

1. In Terminal, from the repo folder:
   ```
   git checkout -b redesign
   mkdir -p data && cp ~/Downloads/artists.json data/
   cp ~/Downloads/REDESIGN.md .
   ```
2. Open the folder in Cursor, Agent mode, and paste:
   ```
   Read REDESIGN.md and data/artists.json.

   Build the redesign as a MOCK-UP ONLY, inside a new folder /mockup (mockup/index.html, mockup/css, mockup/js). Copy any assets you need into /mockup or reference them with ../media paths.

   Hard rules:
   - Do not edit, move or delete index.html, info/, css/, js/ or anything outside /mockup and /data.
   - Do not commit and do not push. I review everything first.
   - The demo form in the mock-up must NOT submit to the live Apps Script. Show the success state on submit and log the payload to the console.
   - Before writing any code, show me the section-by-section plan and wait for "go".
   ```
3. Preview: run `python3 -m http.server 8000` in the repo folder and open http://localhost:8000/mockup/ . The live site stays at http://localhost:8000/ for side-by-side comparison. For a phone preview, drag the repo folder into app.netlify.com/drop and open /mockup on the link it gives.
4. Give feedback in Cursor until it's right. Each round: "change X in /mockup only".
5. When approved, paste:
   ```
   The mock-up is approved. Replace the live site with it: move mockup/index.html to index.html, merge mockup css/js into css/ and js/, switch the demo form back to the live Apps Script with the new field names, make /info redirect to /, delete /mockup. Show me the diff before committing.
   ```
6. Check http://localhost:8000/ once more, then commit on `redesign`, merge to `main` and push. GitHub Pages updates antlerroom.co.uk within a few minutes.
7. If anything looks wrong after it goes live: `git revert` the merge commit and push, and the old site is back.
