/**
 * Antler Room demo form → Releases_DB "Demos" tab.
 *
 * The site's demo form (js/main.js) POSTs url-encoded fields here.
 * Deploy as a web app: Execute as "Me", Who has access "Anyone".
 * Set RELEASES_DB_ID before deploying; it is left out of the repo because the repo is public.
 */

const RELEASES_DB_ID = 'PASTE_RELEASES_DB_ID_HERE';
const SHEET_NAME = 'Demos';
const MIN_SECONDS_ON_FORM = 3;
const MAX_FIELD_LENGTH = 5000;

function doPost(e) {
  const p = (e && e.parameter) || {};

  // Bots that hit the endpoint directly: answer OK so they learn nothing, but don't write a row.
  if (p.website || Number(p._timeSpent) < MIN_SECONDS_ON_FORM) return reply({ ok: true });
  if (!p.artistName || !p.email || !p.listenLink) return reply({ ok: false, error: 'Missing required fields' });

  const row = {
    'Submitted': new Date(),
    'Status': 'New',
    'Artist': clean(p.artistName),
    'Email': clean(p.email),
    'Release': clean(p.releaseName),
    'Release type': clean(p.releaseType),
    'Link': clean(p.listenLink),
    'Link type': clean(p.linkType),
    'Genre': clean(p.genres),
    'Artist notes': clean(p.notes),
    'Rights confirmed': clean(p.rightsConfirmed),
    'Seconds on form': Number(p._timeSpent) || '',
  };

  // The site only shows "Demo received" for { ok: true }; anything else keeps the form filled and offers email instead.
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    const sheet = SpreadsheetApp.openById(RELEASES_DB_ID).getSheetByName(SHEET_NAME);
    if (!sheet) throw new Error('No "' + SHEET_NAME + '" tab in Releases_DB');
    // Columns are matched by header text, so the tab can be reordered or extended without touching this script.
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    sheet.appendRow(headers.map(h => (h in row ? row[h] : '')));
  } catch (err) {
    console.error(err);
    return reply({ ok: false, error: 'Could not save the demo' });
  } finally {
    lock.releaseLock();
  }
  return reply({ ok: true });
}

function clean(value) {
  const text = String(value == null ? '' : value).trim().slice(0, MAX_FIELD_LENGTH);
  // A leading = + - @ would make Sheets treat public input as a formula.
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function reply(body) {
  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(ContentService.MimeType.JSON);
}
