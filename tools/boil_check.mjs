// boil_check.mjs: how much of the picture boils. For each chapter, at evenly spaced moments, renders the frame twice,
// as one boil drawing and the next (same moment, same camera), and counts the pixels that change: in the whole frame,
// and in the halftone's darks. What's still should hold; only figures and energy should move.
//   node tools/boil_check.mjs [--chapters=0,3,6] [--n=6] [--out=out/check/boil]   writes a table and a diff image per chapter
import puppeteer from 'puppeteer-core';
import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const args = Object.fromEntries(process.argv.slice(2).map(a => { const [k, v] = a.replace(/^--/, '').split('='); return [k, v ?? true]; }));
const CHROME = [args.chrome, process.env.CHROME_PATH, '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/chromium'].find(p => p && existsSync(p));
if (!CHROME) { console.error('Chrome not found: pass --chrome=<path> or set CHROME_PATH'); process.exit(1); }
const chapters = args.chapters ? String(args.chapters).split(',').map(Number) : [...Array(12).keys()], n = +(args.n || 6), out = args.out || 'out/check/boil';
mkdirSync(out, { recursive: true });
const gpu = process.platform === 'darwin' ? ['--use-angle=metal'] : ['--use-gl=angle'];
const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, protocolTimeout: 0,
  args: ['--allow-file-access-from-files', '--ignore-gpu-blocklist', ...gpu, '--enable-gpu-rasterization', '--window-size=1920,1080'] });
const rows = [];
for (const ch of chapters) {
  const page = await browser.newPage();
  page.on('pageerror', e => console.log(`[ch${ch} page error]`, e.message));
  await page.goto(pathToFileURL(resolve('studio.html')).href + `?render&chapter=${ch}`, { waitUntil: 'networkidle0' });
  await page.waitForFunction('window.ready === true', { timeout: 60000 });
  const r = await page.evaluate(async (n) => {
    const grab = async (t, shift) => { BOIL_SHIFT = shift; await window.renderAt(t); BOIL_SHIFT = 0; return outX.getImageData(0, 0, W, H).data; };
    const res = [], heat = new Float32Array(W * H);
    for (let i = 0; i < n; i++) {
      const t = DUR * (i + .5) / n, a = await grab(t, 0), b = await grab(t, 1);
      let moved = 0, dark = 0, darkMoved = 0;
      for (let p = 0, q = 0; p < a.length; p += 4, q++) {
        const d = Math.max(Math.abs(a[p] - b[p]), Math.abs(a[p + 1] - b[p + 1]), Math.abs(a[p + 2] - b[p + 2])), isDark = a[p] * .3 + a[p + 1] * .59 + a[p + 2] * .11 < 150;
        if (d > 24) { moved++; heat[q]++; }
        if (isDark) { dark++; if (d > 24) darkMoved++; }
      }
      res.push({ t, moved: moved / (W * H), darkMoved: dark ? darkMoved / dark : 0 });
    }
    // a map of where it boils: white where a pixel changed at any of the moments, over a dim copy of the last frame
    const c = document.createElement('canvas'); c.width = W / 2; c.height = H / 2; const x = c.getContext('2d');
    x.globalAlpha = .35; x.drawImage(outC, 0, 0, W / 2, H / 2); x.globalAlpha = 1;
    const id = x.getImageData(0, 0, W / 2, H / 2), d = id.data;
    for (let y = 0; y < H / 2; y++) for (let xx = 0; xx < W / 2; xx++) { const h = heat[(y * 2) * W + xx * 2]; if (h) { const k = (y * W / 2 + xx) * 4; d[k] = 255; d[k + 1] = 80 + 175 * (1 - h / n); d[k + 2] = 40; } }
    x.putImageData(id, 0, 0);
    return { res, map: c.toDataURL('image/jpeg', .85) };
  }, n);
  writeFileSync(`${out}/ch${String(ch).padStart(2, '0')}.jpg`, Buffer.from(r.map.split(',')[1], 'base64'));
  const mean = k => r.res.reduce((s, x) => s + x[k], 0) / r.res.length;
  rows.push({ ch, moved: mean('moved'), darkMoved: mean('darkMoved') });
  console.log(`ch${ch}: ${(100 * mean('moved')).toFixed(1)}% of the frame changes between drawings; ${(100 * mean('darkMoved')).toFixed(1)}% of its darks  (` + r.res.map(x => `${x.t.toFixed(0)}s ${(100 * x.moved).toFixed(0)}%`).join(', ') + ')');
  await page.close();
}
await browser.close();
const all = k => rows.reduce((s, x) => s + x[k], 0) / rows.length;
console.log(`all: ${(100 * all('moved')).toFixed(1)}% of the frame, ${(100 * all('darkMoved')).toFixed(1)}% of the darks`);
writeFileSync(`${out}/boil.json`, JSON.stringify(rows, null, 1));
