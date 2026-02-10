import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const STORE_URL = 'https://serkanparlaotomotiv.sahibinden.com/';
const DATA_PATH = path.join(process.cwd(), 'data', 'sahibinden.json');

function loadCurrent() {
  try {
    const raw = fs.readFileSync(DATA_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return { updated_at: null, items: [] };
  }
}

function normalizePrice(text) {
  if (!text) return null;
  const digits = String(text).replace(/[^\d]/g, '');
  const n = Number(digits);
  return Number.isFinite(n) ? n : null;
}

function uniqueByUrl(items) {
  const seen = new Set();
  const out = [];
  for (const it of items) {
    if (it.url && !seen.has(it.url)) {
      seen.add(it.url);
      out.push(it);
    }
  }
  return out;
}

async function crawl() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36'
  });

  await page.goto(STORE_URL, { waitUntil: 'domcontentloaded', timeout: 120000 });
  try { await page.waitForLoadState('networkidle', { timeout: 30000 }); } catch {}

  const items = await page.evaluate(() => {
    function txt(el) { return (el?.textContent || '').trim(); }
    const anchors = Array.from(document.querySelectorAll('a')).filter(a => a.href.includes('/ilan/'));

    const list = anchors.map(a => {
      const url = a.href;
      const title = txt(a);
      const card = a.closest('div, li, article') || a.parentElement;
      const cardText = (card?.innerText || '').replace(/\s+/g, ' ').trim();

      const cityMatch = cardText.match(/\b(İstanbul|Ankara|İzmir|Bursa|Antalya|Adana|Konya|Kayseri|Gaziantep|Kocaeli)\b/i);
      const priceMatch = cardText.match(/(\d[\d\.\s]{3,})\s*TL/i);
      const yearMatch = cardText.match(/\b(20\d{2}|19\d{2})\b/);

      return {
        title: title || (cardText.split('\n')[0] || '').slice(0, 80),
        city: cityMatch ? cityMatch[0] : null,
        priceText: priceMatch ? priceMatch[1] : null,
        year: yearMatch ? Number(yearMatch[0]) : null,
        source: 'sahibinden',
        status: 'active',
        url
      };
    });

    return list.filter(x => x.url && x.title && x.title.length > 2);
  });

  await browser.close();

  for (const it of items) {
    it.price = normalizePrice(it.priceText);
    delete it.priceText;
  }

  return uniqueByUrl(items);
}

async function main() {
  const current = loadCurrent();
  const fresh = await crawl();

  const byUrlFresh = new Map(fresh.map(it => [it.url, it]));
  const byUrlCurrent = new Map((current.items || []).map(it => [it.url, it]));

  const merged = [];

  for (const it of fresh) {
    const prev = byUrlCurrent.get(it.url);
    merged.push({
      title: it.title || prev?.title || '-',
      city: it.city || prev?.city || null,
      price: typeof it.price === 'number' ? it.price : (typeof prev?.price === 'number' ? prev.price : null),
      year: it.year || prev?.year || null,
      status: 'active',
      source: 'sahibinden',
      url: it.url
    });
  }

  for (const prev of byUrlCurrent.values()) {
    if (!byUrlFresh.has(prev.url)) {
      merged.push({
        title: prev.title || '-',
        city: prev.city || null,
        price: typeof prev.price === 'number' ? prev.price : null,
        year: prev.year || null,
        status: 'closed',
        source: 'sahibinden',
        url: prev.url
      });
    }
  }

  const out = {
    updated_at: new Date().toISOString(),
    items: merged
  };

  fs.mkdirSync(path.dirname(DATA_PATH), { recursive: true });
  fs.writeFileSync(DATA_PATH, JSON.stringify(out, null, 2), 'utf-8');
  console.log(`Updated ${DATA_PATH} with ${out.items.length} items at ${out.updated_at}`);
}

main().catch(err => {
  console.error('Updater failed:', err);
  process.exit(1);
});
