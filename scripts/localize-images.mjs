// Mirrors every remote product image into public/products/ and rewrites
// data/products.json to point at the local copies.
//
// Why: the catalog snapshot comes from okulary.pl, and hotlinking its uploads
// made every product photo on this site depend on that server staying up.
//
// Idempotent — run it after scripts/fetch-goya.mjs:
//   node scripts/fetch-goya.mjs && node scripts/localize-images.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = path.join(ROOT, 'public', 'products');
const DATA = path.join(ROOT, 'data', 'products.json');
const CONCURRENCY = 8;

fs.mkdirSync(OUT_DIR, { recursive: true });
const products = JSON.parse(fs.readFileSync(DATA, 'utf8'));

const isRemote = (u) => typeof u === 'string' && /^https?:\/\//i.test(u);

// Collect every remote URL, then assign each a stable local filename.
const remote = new Set();
for (const p of products) {
  for (const im of p.images ?? []) if (isRemote(im.src)) remote.add(im.src);
  for (const v of p.variations ?? []) if (isRemote(v.image)) remote.add(v.image);
}

const localName = new Map();
const taken = new Map();
for (const url of [...remote].sort()) {
  const segs = new URL(url).pathname.replace(/^\/+/, '').split('/');
  let base = segs[segs.length - 1];
  // Basenames can repeat across upload months — disambiguate with /YYYY/MM/.
  if (taken.has(base) && taken.get(base) !== url) base = `${segs.slice(-3, -1).join('-')}-${base}`;
  taken.set(base, url);
  localName.set(url, base);
}

async function download(url, dest) {
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (goya-asset-mirror)' } });
  if (!res.ok) throw new Error(`${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 1000) throw new Error(`too small (${buf.length}b)`);
  fs.writeFileSync(dest, buf);
}

const queue = [...localName.entries()].filter(([, name]) => {
  const dest = path.join(OUT_DIR, name);
  return !fs.existsSync(dest) || fs.statSync(dest).size <= 1000;
});
console.log(`${remote.size} remote images referenced, ${queue.length} to download`);

let done = 0;
const failures = [];
await Promise.all(
  Array.from({ length: Math.min(CONCURRENCY, queue.length) }, async () => {
    while (queue.length) {
      const [url, name] = queue.shift();
      try {
        await download(url, path.join(OUT_DIR, name));
        done++;
      } catch (e) {
        failures.push(`${url} -> ${e.message}`);
      }
    }
  }),
);
console.log(`downloaded ${done}, failed ${failures.length}`);
for (const f of failures.slice(0, 10)) console.warn('  FAIL', f);

// Only rewrite a URL once its file is actually on disk, so a failed download
// can never leave the catalog pointing at a 404.
const toLocal = (url) => {
  if (!isRemote(url)) return url;
  const name = localName.get(url);
  return name && fs.existsSync(path.join(OUT_DIR, name)) ? `/products/${name}` : url;
};

let rewritten = 0;
for (const p of products) {
  for (const im of p.images ?? []) {
    const next = toLocal(im.src);
    if (next !== im.src) { im.src = next; rewritten++; }
  }
  for (const v of p.variations ?? []) {
    const next = toLocal(v.image);
    if (next !== v.image) { v.image = next; rewritten++; }
  }
}
fs.writeFileSync(DATA, JSON.stringify(products, null, 2));

const stillRemote = products.flatMap((p) => [
  ...(p.images ?? []).map((i) => i.src),
  ...(p.variations ?? []).map((v) => v.image),
]).filter(isRemote);
console.log(`rewrote ${rewritten} references; ${stillRemote.length} still remote`);
