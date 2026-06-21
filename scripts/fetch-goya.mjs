// Fetches the Goya line from okulary.pl WooCommerce and writes a normalized snapshot.
// Read-only. Run: node scripts/fetch-goya.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const envPath = path.join(ROOT, '.env.local');
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const m = line.match(/^([A-Z_]+)=(.*)$/);
    if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2].trim();
  }
}
const WC_URL = (process.env.WC_URL || '').replace(/\/$/, '');
const WC_KEY = process.env.WC_KEY;
const WC_SECRET = process.env.WC_SECRET;
if (!WC_URL || !WC_KEY || !WC_SECRET) {
  console.error('Missing WC_URL / WC_KEY / WC_SECRET in .env.local');
  process.exit(1);
}
const auth = 'Basic ' + Buffer.from(`${WC_KEY}:${WC_SECRET}`).toString('base64');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function wc(pathname, params = {}) {
  const url = new URL(`${WC_URL}/wp-json/wc/v3/${pathname}`);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  for (let attempt = 0; attempt < 5; attempt++) {
    const r = await fetch(url, { headers: { Authorization: auth } });
    if (r.status === 429 || r.status >= 500) { await sleep(2 ** attempt * 500); continue; }
    if (!r.ok) throw new Error(`${r.status} on ${pathname}`);
    return r;
  }
  throw new Error(`failed after retries: ${pathname}`);
}

async function paginate(pathname, params = {}) {
  const out = [];
  let page = 1;
  while (true) {
    const r = await wc(pathname, { ...params, per_page: 100, page });
    const items = await r.json();
    out.push(...items);
    const total = parseInt(r.headers.get('x-wp-totalpages') || '1', 10);
    if (page >= total || items.length === 0) break;
    page++;
    await sleep(250);
  }
  return out;
}

const attrOpt = (p, slug) => {
  const a = (p.attributes || []).find((x) => x.slug === slug);
  return a ? (a.options || []) : [];
};
const num = (v) => {
  const n = parseFloat(String(v ?? '').replace(',', '.'));
  return Number.isFinite(n) ? n : null;
};
const stripHtml = (html = '') =>
  html
    .replace(/<img[^>]*>/gi, ' ')
    .replace(/<(script|style)[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<\/(p|div|section|h\d|li|tr)>/gi, '\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&oacute;/gi, 'ó')
    .replace(/&quot;/gi, '"')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{2,}/g, '\n\n')
    .trim();
const cleanName = (name = '') => {
  let m = name.split(' - ').pop().trim();
  m = m.replace(/^GOYA\s+/i, '').trim();
  return m || name;
};

function normalize(p) {
  const cats = (p.categories || []).map((c) => c.name);
  const isOptical = cats.some((c) => /korekcyjne/i.test(c));
  const images = (p.images || []).map((im) => ({ src: im.src, alt: im.alt || p.name }));
  return {
    id: p.id,
    slug: p.slug,
    name: cleanName(p.name),
    fullName: p.name,
    type: p.type,
    category: isOptical ? 'optical' : 'sun',
    gender: attrOpt(p, 'pa_plec')[0] || null,
    shape: attrOpt(p, 'pa_rodzaj-oprawki')[0] || null,
    frameColors: attrOpt(p, 'pa_kolor-oprawki'),
    lensColors: attrOpt(p, 'pa_kolor-soczewki'),
    material: attrOpt(p, 'pa_material')[0] || null,
    polarized: /tak/i.test(attrOpt(p, 'pa_polaryzacja')[0] || ''),
    uv: attrOpt(p, 'pa_filtr-uv-400')[0] || null,
    dims: {
      lensHeight: num(attrOpt(p, 'pa_wysokosc-soczewki')[0]),
      frontWidth: num(attrOpt(p, 'pa_szerokosc-frontu')[0]),
      templeLength: num(attrOpt(p, 'pa_rozmiar-zausznika')[0]),
    },
    priceWoo: num(p.price),
    stockStatus: p.stock_status,
    totalSales: Number(p.total_sales) || 0,
    images,
    description: stripHtml(p.description).slice(0, 1100),
    variations: [],
  };
}

let products = [];
const attrs = await (await wc('products/attributes')).json();
const marka = attrs.find((a) => a.slug === 'pa_marka');
let termId = null;
if (marka) {
  const terms = await (await wc(`products/attributes/${marka.id}/terms`, { per_page: 100 })).json();
  termId = terms.find((x) => /goya/i.test(x.name))?.id ?? null;
}
if (marka && termId) {
  console.log(`Filtering by pa_marka term GOYA (#${termId})`);
  products = await paginate('products', { status: 'publish', attribute: 'pa_marka', attribute_term: String(termId) });
} else {
  console.log('Falling back to category search "goya"');
  const cats = await (await wc('products/categories', { search: 'goya', per_page: 100 })).json();
  const cat = cats.find((c) => /^goya$/i.test(c.name)) || cats[0];
  products = await paginate('products', { status: 'publish', category: String(cat.id) });
}
console.log(`Fetched ${products.length} Goya products`);

const normalized = [];
for (const p of products) {
  const n = normalize(p);
  if (p.type === 'variable' && (p.variations || []).length) {
    try {
      const vars = await paginate(`products/${p.id}/variations`, {});
      n.variations = vars.map((v) => ({
        id: v.id,
        sku: v.sku,
        price: num(v.price),
        image: v.image?.src || null,
        attributes: (v.attributes || []).map((a) => ({ name: a.name, option: a.option })),
        inStock: v.stock_status ? v.stock_status === 'instock' : true,
      }));
      await sleep(150);
    } catch (e) {
      console.warn(`variations failed for ${p.id}: ${e.message}`);
    }
  }
  normalized.push(n);
}

normalized.sort((a, b) => b.totalSales - a.totalSales);

const uniq = (arr) => [...new Set(arr.filter(Boolean))];
const woo = normalized.map((n) => n.priceWoo).filter((x) => x);
const facets = {
  count: normalized.length,
  sun: normalized.filter((n) => n.category === 'sun').length,
  optical: normalized.filter((n) => n.category === 'optical').length,
  genders: uniq(normalized.map((n) => n.gender)),
  shapes: uniq(normalized.flatMap((n) => (n.shape ? [n.shape] : []))),
  frameColors: uniq(normalized.flatMap((n) => n.frameColors)),
  priceWooRange: [Math.min(...woo), Math.max(...woo)],
  generatedAt: new Date().toISOString(),
};

fs.mkdirSync(path.join(ROOT, 'data'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'data', 'products.json'), JSON.stringify(normalized, null, 2));
fs.writeFileSync(path.join(ROOT, 'data', 'facets.json'), JSON.stringify(facets, null, 2));
console.log(`Wrote data/products.json (${normalized.length}) + data/facets.json`);
console.log(facets);
