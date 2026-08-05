/**
 * Goya — order + newsletter intake for Google Sheets.
 *
 * Paste this into the spreadsheet "Goya — Zamówienia i newsletter":
 *   Rozszerzenia → Apps Script → replace everything with this file → Zapisz
 *   Wdróż → Nowe wdrożenie → typ: Aplikacja internetowa
 *     - "Wykonaj jako": Ja
 *     - "Kto ma dostęp": Wszyscy    <-- required, the shop posts anonymously
 *   Copy the /exec URL and set it in Vercel as GOYA_SHEETS_WEBHOOK_URL.
 *
 * Re-deploy ("Zarządzaj wdrożeniami" → edit → Nowa wersja) after any edit,
 * otherwise the old code keeps serving.
 */

// Must match GOYA_SHEETS_WEBHOOK_SECRET in Vercel.
// This repo is public — paste the real value here in the Apps Script editor only,
// never commit it. Without a match every POST is rejected.
var SECRET = 'REPLACE_WITH_THE_SECRET_FROM_VERCEL';

var TABS = {
  order: {
    name: 'Zamówienia',
    headers: ['Data', 'E-mail', 'Imię', 'Nazwisko', 'Ulica i numer', 'Kod',
              'Miasto', 'Telefon', 'Dostawa', 'Paczkomat', 'Produkty',
              'Suma (zł)', 'Status'],
  },
  newsletter: {
    name: 'Newsletter',
    headers: ['Data', 'E-mail'],
  },
};

function reply(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function sheetFor(kind) {
  var cfg = TABS[kind];
  var ss = SpreadsheetApp.getActive();
  var sh = ss.getSheetByName(cfg.name);
  if (!sh) {
    sh = ss.insertSheet(cfg.name);
  }
  if (sh.getLastRow() === 0) {
    sh.appendRow(cfg.headers);
    sh.getRange(1, 1, 1, cfg.headers.length).setFontWeight('bold')
      .setBackground('#B85C38').setFontColor('#FFFFFF');
    sh.setFrozenRows(1);
  }
  return sh;
}

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) return reply({ ok: false, error: 'no body' });
    var body = JSON.parse(e.postData.contents);
    if (body.secret !== SECRET) return reply({ ok: false, error: 'unauthorized' });

    var stamp = Utilities.formatDate(new Date(), 'Europe/Warsaw', 'yyyy-MM-dd HH:mm:ss');

    if (body.kind === 'newsletter') {
      sheetFor('newsletter').appendRow([stamp, String(body.email || '')]);
      return reply({ ok: true });
    }

    var items = (body.items || []).map(function (i) {
      return i.qty + '× ' + i.name + (i.variant ? ' (' + i.variant + ')' : '') + ' — ' + i.price + ' zł';
    }).join('\n');

    sheetFor('order').appendRow([
      stamp,
      String(body.email || ''),
      String(body.firstName || ''),
      String(body.lastName || ''),
      String(body.street || ''),
      String(body.postalCode || ''),
      String(body.city || ''),
      String(body.phone || ''),
      body.delivery === 'kurier' ? 'Kurier' : 'Paczkomat InPost',
      String(body.lockerCode || ''),
      items,
      Number(body.subtotal || 0),
      'nowe',
    ]);
    return reply({ ok: true });
  } catch (err) {
    return reply({ ok: false, error: String(err) });
  }
}

// ---------------------------------------------------------------------------
// Catalogue feed — the website reads live prices/stock from the sheet.
// ---------------------------------------------------------------------------

// The product tab. First match wins; falls back to the first sheet in the file.
var CATALOG_TABS = ['Katalog', 'Model reference', 'goya-model-reference-google-sheets'];

// ONLY these columns are ever returned. old_regular_price / old_live_price are
// deliberately absent: they are okulary.pl's cost/selling prices and must never
// leave the spreadsheet, even if this URL is discovered.
var PUBLIC_FIELDS = [
  'product_id', 'new_name', 'collection', 'new_regular_price', 'new_live_price',
  'lowest_price_30d', 'stock_status', 'category',
];

function catalogSheet() {
  var ss = SpreadsheetApp.getActive();
  for (var i = 0; i < CATALOG_TABS.length; i++) {
    var sh = ss.getSheetByName(CATALOG_TABS[i]);
    if (sh) return sh;
  }
  return ss.getSheets()[0];
}

function readCatalog() {
  var sh = catalogSheet();
  var values = sh.getDataRange().getValues();
  if (values.length < 2) return [];
  // Map by header NAME so re-ordering or inserting columns can't shift the data.
  var header = values[0].map(function (h) { return String(h).trim(); });
  var idx = {};
  PUBLIC_FIELDS.forEach(function (f) { idx[f] = header.indexOf(f); });
  if (idx.product_id < 0) return [];

  var out = [];
  for (var r = 1; r < values.length; r++) {
    var row = values[r];
    var id = parseInt(row[idx.product_id], 10);
    if (!id) continue;
    var rec = { product_id: id };
    PUBLIC_FIELDS.forEach(function (f) {
      if (f === 'product_id' || idx[f] < 0) return;
      var v = row[idx[f]];
      rec[f] = v === '' || v === null ? null : v;
    });
    out.push(rec);
  }
  return out;
}

/**
 * GET ?secret=…            → {ok, count, rows:[…]}  the catalogue feed
 * GET (no params)          → {ok, service}          deployment sanity check
 */
function doGet(e) {
  try {
    var p = (e && e.parameter) || {};
    if (!p.secret) return reply({ ok: true, service: 'goya-intake' });
    if (p.secret !== SECRET) return reply({ ok: false, error: 'unauthorized' });
    var rows = readCatalog();
    return reply({ ok: true, count: rows.length, rows: rows });
  } catch (err) {
    return reply({ ok: false, error: String(err) });
  }
}
