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

// Lets you sanity-check the deployment in a browser — visiting the /exec URL
// should show {"ok":true,"service":"goya-intake"}.
//
// NOTE: this script handles ORDERS and NEWSLETTER only. The product catalogue
// lives in Supabase (goya_products / goya_product_images / goya_product_variations)
// because images and variations are one-to-many and cannot fit in a flat sheet.
function doGet() {
  return reply({ ok: true, service: 'goya-intake' });
}
