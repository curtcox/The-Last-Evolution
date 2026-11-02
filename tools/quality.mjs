// quality.mjs: the quality loop (QUALITY.md): what's left before Claude is satisfied with the film and the site.
//   npm run quality                              runs the quick checks, prints the queue, writes quality/scorecard.json
//   npm run quality -- --full                    also runs the slow checks (refs, phone, live); --check=NAME one
//   npm run quality -- pass ID --note="…"        records a judgment: why it's right (--evidence=path, optional)
//   npm run quality -- open ID --note="…"        what's still wrong (a new ID, e.g. find.ch05-eyes, with --title, is a finding)
//   npm run quality -- curt ID --note="…"        hands it to Curt, with the question
//   npm run quality -- later ID --note="…"       not yet: waits on an earlier phase
//   npm run quality -- fresh --found=N --note="…"   logs a fresh-eyes round
//   npm run quality -- loop on [--cap=40] | loop off   the Stop hook's flag (.quality-loop, not committed)
//   npm run quality -- --hook                    the Stop hook (.claude/settings.json): keeps the turn going while one of
//                                                Claude's items is open, handing over the top one
// The items are quality/rubric.yaml's; the judgments are kept in quality/status.yaml, each with a fingerprint of what was
// judged (a chapter's latest draft, a built page, a work item's inputs), and go stale when it changes.
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, statSync, rmSync } from 'node:fs';
import { execFileSync, spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { createServer } from 'node:http';
import { join, extname } from 'node:path';
import YAML from 'yaml';
import { readYaml } from './script_lib.mjs';
import { SITE } from './notes_md.mjs';

const RUBRIC = 'quality/rubric.yaml', STATUS = 'quality/status.yaml', CARD = 'quality/scorecard.json';
const FLAG = '.quality-loop', LOOP = 'out/quality/loop.json', SLOW = 'out/quality/checks.json', PUB = 'site/public';
const CAP = 10, NEAR = 9.5, EVERY = 8, STUCK = 3;
const args = process.argv.slice(2), opt = Object.fromEntries(args.filter(a => a.startsWith('--')).map(a => { const [k, ...v] = a.slice(2).split('='); return [k, v.length ? v.join('=') : true]; }));
const [cmd, id] = args.filter(a => !a.startsWith('--'));
const NN = n => String(n).padStart(2, '0'), now = () => new Date().toISOString().slice(0, 16).replace('T', ' ');
const sha = s => createHash('sha256').update(s).digest('hex').slice(0, 12);
const sh = (bin, a) => execFileSync(bin, a, { encoding: 'utf8', maxBuffer: 1 << 26, stdio: ['ignore', 'pipe', 'pipe'] });
const run = (bin, a) => { try { return { ok: true, out: sh(bin, a) }; } catch (e) { return { ok: false, out: `${e.stdout || ''}${e.stderr || ''}` }; } };
const last = s => s.trim().split('\n').pop();
const readJson = (f, d) => existsSync(f) ? JSON.parse(readFileSync(f, 'utf8')) : d;
const status = existsSync(STATUS) ? YAML.parse(readFileSync(STATUS, 'utf8')) : {};
status.items ??= {}; status.fresh ??= []; status.since_fresh ??= 0;
const saveStatus = () => writeFileSync(STATUS, '# The quality loop\'s judgments (tools/quality.mjs writes this; QUALITY.md says how it works)\n' + YAML.stringify(status, { lineWidth: 0 }));

// ---- the items
const R = readYaml(RUBRIC), items = [];
for (const n of R.film.order) {
  for (const c of R.film.criteria) items.push({ id: `ch${NN(n)}.${c.key}`, area: 'film', chapter: n, owner: 'claude', title: `Chapter ${n}: ${c.title}`, criteria: c.criteria });
  items.push({ id: `ch${NN(n)}.draft`, area: 'film', chapter: n, owner: 'claude', auto: true, title: `Chapter ${n}: its draft is current and at the right loudness`, criteria: 'The draft is newer than its sources and made from frames that are too; -14 LUFS (±1), peaks under -1 dBTP. npm run timeline -- N; delete out/frames/chNN; node render.mjs --chapter=N --frames --fps=12 --workers=6; npm run draft -- N' });
}
for (const w of R.work) items.push({ ...w, area: 'work', owner: 'claude' });
for (const p of R.site.pages) for (const c of R.site.criteria) items.push({ id: `site.${p.key}.${c.key}`, area: 'site', file: p.file, owner: 'claude', title: `${p.title[0].toUpperCase() + p.title.slice(1)}: ${c.title}`, criteria: c.criteria });
for (const g of R.gates) items.push({ ...g, area: 'gate', owner: 'curt', criteria: g.ask });
for (const l of R.later) items.push({ ...l, area: 'later', owner: 'claude', later: true });
// a line speech-to-text still flags (script/reports/voice.md) is an item: listen, and pass it if the voice is right
const voice = readJson('script/reports/voice.json', {});
for (const [lid, v] of Object.entries(voice)) if (v.real) items.push({ id: `voice.${lid}`, area: 'voice', owner: 'claude', key: v.key, title: `Line ${lid}: speech-to-text missed "${v.missed.join(' ')}"`, criteria: `Listen to the line (assets/voice/${v.file}; npm run ask -- hear N for a second opinion). Pass it if every word is said right; if not, voice it again (npm run voice).` });
const known = new Set(items.map(i => i.id));
for (const [fid, r] of Object.entries(status.items)) if (!known.has(fid) && fid.startsWith('find.')) items.push({ id: fid, area: 'finding', owner: 'claude', title: r.title || fid, criteria: r.title || '' });
const byId = Object.fromEntries(items.map(i => [i.id, i]));

// ---- fingerprints: what a judgment was made on
const draftOf = n => {   // a chapter's latest published draft
  for (const r of readdirSync('site/review').map(d => +d.match(/^round(\d+)$/)?.[1]).filter(Boolean).sort((a, b) => b - a)) {
    const dir = `site/review/round${r}/video`, f = existsSync(dir) && readdirSync(dir).find(f => f.startsWith(`ch${NN(n)}-draft-`));
    if (f) return `${dir}/${f}`;
  }
};
const files = list => list.flatMap(p => p.includes('*') ? (d => existsSync(d) ? readdirSync(d).filter(f => new RegExp(`^${p.split('/').pop().replace(/\./g, '\\.').replace('*', '.*')}$`).test(f)).map(f => `${d}/${f}`) : [])(p.split('/').slice(0, -1).join('/')) : existsSync(p) ? [p] : []);
const fp = i => i.area === 'film' ? draftOf(i.chapter)?.split('/').pop() ?? null
  : i.area === 'site' ? existsSync(`${PUB}/${i.file}`) ? sha(readFileSync(`${PUB}/${i.file}`)) : null
  : i.area === 'voice' ? i.key
  : i.area === 'work' ? sha(files(i.inputs).map(f => f + sha(readFileSync(f))).join()) : undefined;

// when a file last changed: its commit, or the disk if it has changes not committed
const dirty = new Set(sh('git', ['status', '--porcelain', '-uall']).split('\n').filter(Boolean).map(l => l.slice(3).split(' -> ').pop()));
const when = {}, changed = f => when[f] ??= dirty.has(f) ? statSync(f).mtimeMs / 1000 : +sh('git', ['log', '-1', '--format=%ct', '--', f]).trim() || statSync(f).mtimeMs / 1000;
const SHARED = ['src/core.js', 'src/kit.js', 'src/pulp.js', 'src/energy.js', 'src/designs.js', 'src/config.js', 'src/timeline.js', 'script/sfx.yaml', 'render.mjs', 'studio.html'];
const sources = n => [`src/scenes/ch${NN(n)}.js`, `src/gen/ch${NN(n)}.js`, `script/boards/ch${NN(n)}.yaml`, `script/align/ch${NN(n)}.json`, ...SHARED].filter(existsSync);
// a chapter's draft: newer than its sources, made from frames that are too (render.mjs --frames skips frames already on
// disk, so frames left from before a change would pass for new), and at -14 LUFS (±1) with peaks under -1 dBTP
const LOUD = 'out/quality/loudness.json', loudCache = readJson(LOUD, {});
function loud(d) {
  const name = d.split('/').pop();
  if (!loudCache[name]) {
    const e = spawnSync('ffmpeg', ['-nostats', '-hide_banner', '-i', d, '-vn', '-af', 'ebur128=peak=true', '-f', 'null', '-'], { encoding: 'utf8', maxBuffer: 1 << 26 }).stderr;   // the summary is on stderr
    loudCache[name] = { I: +[...e.matchAll(/I:\s+(-?[\d.]+) LUFS/g)].pop()?.[1], P: +[...e.matchAll(/Peak:\s+(-?[\d.]+) dBFS/g)].pop()?.[1] };
    mkdirSync('out/quality', { recursive: true }); writeFileSync(LOUD, JSON.stringify(loudCache, null, 1));
  }
  return loudCache[name];
}
function draftCheck(n) {
  const d = draftOf(n); if (!d) return { ok: false, detail: 'no draft yet' };
  const src = sources(n), newer = src.filter(f => changed(f) > changed(d));
  if (newer.length) return { ok: false, detail: `older than ${newer.join(', ')}` };
  const F = `out/frames/ch${NN(n)}`, frames = existsSync(F) ? readdirSync(F).filter(f => f.endsWith('.jpg')) : [];
  const oldest = Math.min(...frames.map(f => statSync(`${F}/${f}`).mtimeMs / 1000)), behind = frames.length ? src.filter(f => changed(f) > oldest) : [];
  if (behind.length) return { ok: false, detail: `made from frames older than ${behind.join(', ')}: delete ${F} and render again` };
  const { I, P } = loud(d);
  if (!(Math.abs(I + 14) <= 1) || !(P <= -1)) return { ok: false, detail: `${I} LUFS, peak ${P} dBTP: wants -14 ±1 and under -1 (npm run timeline -- ${n}, then the draft)` };
  return { ok: true, detail: `${d.split('/').pop()}, ${I} LUFS, peak ${P} dBTP` };
}

// ---- the checks: quick ones every run, slow ones on request (their results kept with the fingerprint of their inputs)
function quick() {
  const c = {};
  let r = run('node', ['tools/verbatim_check.mjs']); c.verbatim = { ok: r.ok, detail: last(r.out) };
  r = run('node', ['tools/build_site.mjs']);
  if (r.ok) r = run('node', ['tools/check_links.mjs']);
  c.links = { ok: r.ok, detail: r.ok ? last(r.out) : r.out.trim().split('\n').slice(-6).join(' · ') };
  const A = 'site/review/round7/annotated.html', before = existsSync(A) && sha(readFileSync(A));
  r = run('node', ['tools/annotated.mjs']);
  c.annotated = { ok: r.ok, detail: !r.ok ? last(r.out) : before === sha(readFileSync(A)) ? 'current' : 'had fallen behind; rebuilt now' };
  const flagged = items.filter(i => i.area === 'voice' && !(status.items[i.id]?.state === 'pass' && status.items[i.id].at === i.key)).map(i => i.id.slice(6));
  c.voice = { ok: !flagged.length, detail: flagged.length ? `still flagged, not yet heard: ${flagged.join(', ')}` : 'every flagged line heard and right' };
  const script = readYaml('script/script.yaml'), gaps = [];
  for (const ch of script.chapters) {
    const al = readJson(`script/align/ch${NN(ch.n)}.json`, {});
    for (const l of ch.lines) if (l.who && !al[l.id]?.words?.length) gaps.push(l.id);
  }
  c.captions = { ok: !gaps.length, detail: gaps.length ? `no timed words for ${gaps.slice(0, 8).join(', ')}${gaps.length > 8 ? ` and ${gaps.length - 8} more` : ''}` : 'every spoken line has timed words' };
  const led = 'out/ask/ledger.jsonl', spent = existsSync(led) ? readFileSync(led, 'utf8').trim().split('\n').filter(Boolean).reduce((s, l) => s + JSON.parse(l).cost, 0) : 0;
  c.spend = { ok: spent < NEAR, detail: `$${spent.toFixed(2)} of $${CAP}`, spent };
  return c;
}

const pages = (d = PUB) => readdirSync(d).flatMap(f => { const p = join(d, f); return statSync(p).isDirectory() ? pages(p) : p.endsWith('.html') ? [p.slice(PUB.length + 1)] : []; }).sort();
const hashAll = list => sha(list.map(f => f + sha(readFileSync(f))).join());
const SLOWS = {
  refs: { fp: () => hashAll(files(['notes/*.md', 'notes/refs.yaml', 'notes/annotations.yaml'])), run: () => { const r = run('node', ['tools/check_refs.mjs']); return { ok: r.ok, detail: last(r.out) }; } },
  phone: { fp: () => hashAll([...pages().filter(p => !p.startsWith('review/quality/')).map(p => `${PUB}/${p}`), `${PUB}/style.css`]), run: phone },   // not the scorecard, which changes with every judgment
  live: { fp: () => sh('git', ['rev-parse', 'HEAD']).trim().slice(0, 12), run: live, end: true },   // after the push
};

// every page at phone (375) and desktop (1280) width: nothing wider than the screen; screenshots for Claude to look at
async function phone() {
  const { default: puppeteer } = await import('puppeteer-core');
  const chrome = [process.env.CHROME_PATH, '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/chromium'].find(p => p && existsSync(p));
  if (!chrome) return { ok: false, detail: 'Chrome not found: set CHROME_PATH' };
  const BASE = '/The-Last-Evolution/', types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.png': 'image/png', '.mp4': 'video/mp4', '.mp3': 'audio/mpeg', '.json': 'application/json' };
  const server = createServer((q, s) => {
    let p = decodeURIComponent(q.url.split(/[?#]/)[0]); p = p.startsWith(BASE) ? p.slice(BASE.length) : p.slice(1);
    let f = join(PUB, p); if (existsSync(f) && statSync(f).isDirectory()) f = join(f, 'index.html');
    if (!existsSync(f)) { s.writeHead(404); return s.end(); }
    s.writeHead(200, { 'content-type': types[extname(f)] || 'application/octet-stream' }); s.end(readFileSync(f));
  }).listen(0);
  const port = server.address().port, browser = await puppeteer.launch({ executablePath: chrome, headless: true, args: ['--no-sandbox'] });
  const bad = [], list = pages();
  for (const w of ['phone', 'desktop']) mkdirSync(`out/quality/${w}`, { recursive: true });
  try {
    for (const p of list) {
      const page = await browser.newPage(), name = p.replace(/\/?index\.html$/, '').replace(/\.html$/, '').replace(/\//g, '_') || 'home';
      for (const [w, width, height] of [['phone', 375, 812], ['desktop', 1280, 800]]) {
        await page.setViewport({ width, height });
        await page.goto(`http://localhost:${port}${BASE}${p}`, { waitUntil: 'load', timeout: 30000 }).catch(() => {});
        if (w === 'phone') {
          const over = await page.evaluate(() => { const W = innerWidth, wide = [...document.querySelectorAll('body *')].filter(e => e.getBoundingClientRect().right > W + 1 && getComputedStyle(e).position !== 'fixed');
            return document.documentElement.scrollWidth > W + 1 ? wide.slice(0, 3).map(e => e.tagName.toLowerCase() + (e.className && typeof e.className === 'string' ? '.' + e.className.split(' ')[0] : '')) : null; });
          if (over) bad.push(`${p} (${over.join(', ') || 'something'})`);
        }
        await page.screenshot({ path: `out/quality/${w}/${name}.jpg`, type: 'jpeg', quality: 70 });
      }
      await page.close();
    }
  } finally { await browser.close(); server.close(); }
  return { ok: !bad.length, detail: bad.length ? `wider than a phone: ${bad.join('; ')}` : `${list.length} pages fit a phone; screenshots in out/quality/phone and desktop` };
}

// the live site: every page answers; and once HEAD is pushed and its deploy has landed, the home page is this build's
async function live() {
  const UA = { 'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36' };
  const bad = [], list = pages().filter(p => p !== '404.html');
  for (const p of list) { const r = await fetch(SITE + p.replace(/index\.html$/, ''), { headers: UA }).catch(e => ({ status: e.message })); if (r.status !== 200) bad.push(`${p} (${r.status})`); }
  const pushed = !dirty.size && run('git', ['rev-parse', 'HEAD']).out === run('git', ['rev-parse', 'origin/main']).out;
  if (pushed && !bad.length) {
    const home = await (await fetch(SITE, { headers: UA })).text();
    if (home !== readFileSync(`${PUB}/index.html`, 'utf8')) bad.push('the home page isn\'t this build yet (the deploy may still be running)');
  }
  return { ok: !bad.length, detail: bad.length ? bad.join('; ') : `${list.length} pages live${pushed ? ', the deploy is this commit' : ' (not compared: HEAD has changes not pushed)'}` };
}

// ---- where everything stands
async function evaluate({ slow = [] } = {}) {
  const checks = quick(), slowRes = readJson(SLOW, {});
  for (const name of slow) { slowRes[name] = { ...(await SLOWS[name].run()), fp: SLOWS[name].fp(), when: now() }; }
  if (slow.length) { mkdirSync('out/quality', { recursive: true }); writeFileSync(SLOW, JSON.stringify(slowRes, null, 1)); }
  const slowState = Object.fromEntries(Object.keys(SLOWS).map(n => { const r = slowRes[n];
    return [n, !r ? { state: 'never run' } : r.fp !== SLOWS[n].fp() ? { state: 'stale', detail: r.detail } : { state: r.ok ? 'pass' : 'fail', detail: r.detail }]; }));
  const draft = Object.fromEntries(R.film.order.map(n => [n, draftCheck(n)]));
  const state = i => {
    if (i.auto) return draft[i.chapter].ok ? { state: 'pass', note: draft[i.chapter].detail } : { state: 'open', note: draft[i.chapter].detail };
    const r = status.items[i.id], f = fp(i);
    if (!r) return { state: i.later ? 'later' : i.owner === 'curt' ? 'curt' : 'open', note: i.ask || '' };
    if (r.state === 'pass' && r.at !== undefined && r.at !== f) return { state: 'stale', note: `passed on ${r.at}; changed since. ${r.note}` };
    return { state: r.state === 'curt' || (i.owner === 'curt' && r.state !== 'pass') ? 'curt' : r.state, note: r.note };
  };
  for (const i of items) Object.assign(i, state(i));
  const whole = sha(items.filter(i => !i.auto).map(i => `${i.id}:${fp(i)}`).join());
  const lastTwo = status.fresh.slice(-2), satisfied = lastTwo.length === 2 && lastTwo.every(f => f.found === 0 && f.state === whole);
  const queue = [];
  for (const [n, c] of Object.entries(checks)) if (!c.ok && n !== 'voice') queue.push({ id: `check.${n}`, title: `the ${n} check fails`, why: c.detail, kind: 'check' });
  for (const [n, s] of Object.entries(slowState)) if (s.state !== 'pass' && !SLOWS[n].end) queue.push({ id: `check.${n}`, title: `the ${n} check: ${s.state}`, why: s.detail || '', kind: 'slow', run: `npm run quality -- --check=${n}` });
  const mine = items.filter(i => i.owner === 'claude' && ['open', 'stale'].includes(i.state));
  const order = ['finding', 'voice', 'film', 'work', 'site'], sorted = mine.sort((a, b) => order.indexOf(a.area) - order.indexOf(b.area));
  const freshDue = status.since_fresh >= EVERY || (!queue.length && !sorted.length && !satisfied);
  if (freshDue && status.since_fresh >= EVERY) queue.push({ id: 'fresh', kind: 'fresh', title: `a fresh-eyes round (${status.since_fresh} passes since the last)` });
  for (const i of sorted) queue.push({ id: i.id, kind: 'item', title: i.title, why: i.note, criteria: i.criteria });
  for (const [n, s] of Object.entries(slowState)) if (s.state !== 'pass' && SLOWS[n].end && !queue.length) queue.push({ id: `check.${n}`, title: `the ${n} check: ${s.state}`, why: s.detail || '', kind: 'slow', run: `npm run quality -- --check=${n}` });
  if (freshDue && !queue.length) queue.push({ id: 'fresh', kind: 'fresh', title: 'a fresh-eyes round: the queue is empty, and two rounds in a row must find nothing' });
  const curt = items.filter(i => i.state === 'curt');
  const card = {
    summary: Object.fromEntries(['pass', 'stale', 'open', 'curt', 'later'].map(s => [s, items.filter(i => i.state === s).length])),
    satisfied, checks: { ...Object.fromEntries(Object.entries(checks).map(([n, c]) => [n, { state: c.ok ? 'pass' : 'fail', detail: c.detail }])), ...slowState },
    curt: curt.map(i => ({ id: i.id, title: i.title, ask: i.note || i.ask || '' })),
    items: items.filter(i => i.area !== 'gate').map(i => ({ id: i.id, area: i.area, title: i.title, state: i.state, note: i.note || '' })),
    fresh: status.fresh.slice(-3).map(({ when, found, note }) => ({ when, found, note })),
  };
  const before = existsSync(CARD) && readFileSync(CARD, 'utf8'), text = JSON.stringify(card, null, 1) + '\n';
  if (before !== text) { writeFileSync(CARD, text); run('node', ['tools/build_site.mjs']); }   // the scorecard page
  return { checks, slowState, queue, curt, card, whole, satisfied };
}

// ---- the commands
const note = () => { if (typeof opt.note !== 'string' || !opt.note.trim()) { console.error('say why: --note="…"'); process.exit(1); } return opt.note.trim(); };
async function record(state) {
  const ids = String(id || '').split(',').filter(Boolean);
  if (!ids.length) { console.error(`which item? e.g. npm run quality -- ${state} ch05.acting --note="…"`); process.exit(1); }
  const n = note();
  for (const i of ids) {
    let item = byId[i];
    if (!item) {
      if (!/^find\./.test(i)) { console.error(`${i} isn't in quality/rubric.yaml (or a flagged voice line); a new finding's ID starts with find.`); process.exit(1); }
      if (state === 'pass' || typeof opt.title !== 'string') { if (state === 'pass') { console.error(`${i} isn't recorded yet`); process.exit(1); } console.error('a new finding needs --title="…"'); process.exit(1); }
      item = { id: i, area: 'finding', owner: 'claude' };
    }
    if (item.auto) { console.error(`${i} is measured, not judged: npm run quality says whether it passes`); process.exit(1); }
    if (state === 'pass' && item.area === 'film' && !draftCheck(item.chapter).ok) { console.error(`chapter ${item.chapter}'s draft is out of date (${draftCheck(item.chapter).detail}): render it, watch it, then judge it`); process.exit(1); }
    status.items[i] = { state, note: n, ...(opt.title ? { title: opt.title } : status.items[i]?.title ? { title: status.items[i].title } : {}), ...(opt.evidence ? { evidence: opt.evidence } : {}), ...(state === 'pass' && fp(item) !== undefined ? { at: fp(item) } : {}), when: now() };
    if (state === 'pass') status.since_fresh++;
    console.log(`${i}: ${state}`);
  }
  saveStatus();
}

function print({ checks, slowState, queue, curt, card, satisfied }) {
  const s = card.summary;
  console.log(`items: ${s.pass} pass, ${s.stale} stale, ${s.open} open, ${s.curt} Curt's, ${s.later} later${satisfied ? ' · satisfied' : ''}`);
  console.log('checks: ' + [...Object.entries(checks).map(([n, c]) => `${n} ${c.ok ? 'pass' : 'FAIL'}`), ...Object.entries(slowState).map(([n, c]) => `${n} ${c.state === 'pass' ? 'pass' : c.state === 'fail' ? 'FAIL' : c.state}`)].join(', '));
  console.log(`\nnext (${queue.length} for Claude):`);
  for (const q of queue.slice(0, 12)) console.log(`  ${q.id.padEnd(22)} ${q.title}${q.why ? ` · ${q.why}` : ''}`.slice(0, 200));
  if (curt.length) { console.log(`\nCurt's (${curt.length}):`); for (const c of curt) console.log(`  ${c.id.padEnd(22)} ${c.note || c.ask}`.slice(0, 200)); }
}

function instructions(q, left) {
  const how = q.kind === 'check' ? `Fix what makes it fail, then run npm run quality.`
    : q.kind === 'slow' ? (q.title.endsWith('fail') ? `Fix what it reports, then run ${q.run} again.` : `Run ${q.run}, then fix what it finds.`)
    : q.kind === 'fresh' ? `Start a subagent with none of this session's context. Have it review the film's drafts and the site's pages against quality/rubric.yaml, using the screenshots in out/quality/ and the published pages. Record each finding with npm run quality -- open find.<slug> --title="…" --note="…", then log the round with npm run quality -- fresh --found=N --note="…".`
    : `Look first (render.mjs --chapter=N --sheet/--strip, npm run ask, the screenshots in out/quality/), then fix it. Record it: npm run quality -- pass ${q.id} --note="why it's right", or open ${q.id} --note="what's still wrong", or curt ${q.id} --note="the question" if it's Curt's call.`;
  return [`Quality loop: ${left} item${left === 1 ? '' : 's'} left for you. Next: ${q.id}, ${q.title}.`,
    q.why && `Where it stands: ${q.why}`, q.criteria && `The bar: ${q.criteria}`, how,
    'Then commit and push to main, one commit per item, saying what was wrong and why it\'s right now. QUALITY.md has the rest. To stop: npm run quality -- loop off.'].filter(Boolean).join('\n');
}

async function hook() {
  if (!existsSync(FLAG)) return;
  const flag = (() => { try { return JSON.parse(readFileSync(FLAG, 'utf8')); } catch { return {}; } })();
  const loop = readJson(LOOP, { blocks: 0 }), stop = why => { rmSync(FLAG, { force: true }); console.log(JSON.stringify({ systemMessage: `Quality loop stopped: ${why}` })); };
  let r = await evaluate();
  if (r.checks.spend.spent >= NEAR) return stop(`model spend is ${r.checks.spend.detail}; that's Curt's call.`);
  if (r.satisfied && !r.queue.length) return stop('satisfied. Claude has nothing open, and two fresh-eyes rounds in a row found nothing.');
  if (!r.queue.length) return stop(`only Curt's items are left (${r.curt.length}): see /review/quality/.`);
  if (loop.blocks >= (flag.cap || 40)) return stop(`the loop kept ${loop.blocks} turns going, its limit; npm run quality -- loop on to go again.`);
  const key = sha(sh('git', ['rev-parse', 'HEAD']) + sh('git', ['status', '--porcelain', '-uall']) + sh('git', ['diff']));
  let q = r.queue[0];
  loop.count = loop.top === q.id && loop.key === key ? (loop.count || 0) + 1 : 1;
  if (loop.count >= STUCK) {
    if (q.kind !== 'item') { writeFileSync(LOOP, JSON.stringify({ blocks: 0 })); return stop(`stuck on ${q.id}: handed out ${STUCK} times with nothing changed.`); }
    status.items[q.id] = { ...(status.items[q.id] || {}), state: 'curt', note: `Stuck: handed out ${STUCK} times with nothing in the repository changing. ${q.why || ''}`.trim(), when: now() }; saveStatus();
    r = await evaluate(); q = r.queue[0]; loop.count = 1;
    if (!q) return stop(`only Curt's items are left (${r.curt.length}).`);
  }
  Object.assign(loop, { blocks: loop.blocks + 1, top: q.id, key });
  mkdirSync('out/quality', { recursive: true }); writeFileSync(LOOP, JSON.stringify(loop));
  console.log(JSON.stringify({ decision: 'block', reason: instructions(q, r.queue.length) }));
}

if (opt.hook) await hook();
else if (['pass', 'open', 'curt', 'later'].includes(cmd)) await record(cmd);
else if (cmd === 'fresh') {
  const found = +opt.found; if (!(found >= 0)) { console.error('how many findings? --found=N'); process.exit(1); }
  const r = await evaluate();
  status.fresh.push({ when: now(), found, note: note(), state: r.whole }); status.since_fresh = 0; saveStatus();
  console.log(`fresh-eyes round logged: ${found} found`);
} else if (cmd === 'loop') {
  if (id === 'on') { writeFileSync(FLAG, JSON.stringify({ cap: +opt.cap || 40, since: now() })); mkdirSync('out/quality', { recursive: true }); writeFileSync(LOOP, JSON.stringify({ blocks: 0 })); console.log(`the loop is on: the Stop hook keeps going while Claude has items open (up to ${+opt.cap || 40} turns)`); }
  else if (id === 'off') { rmSync(FLAG, { force: true }); console.log('the loop is off'); }
  else { console.log(existsSync(FLAG) ? `on: ${readFileSync(FLAG, 'utf8')}` : 'off'); }
} else {
  const slow = opt.full ? Object.keys(SLOWS) : opt.check ? String(opt.check).split(',') : [];
  for (const s of slow) if (!SLOWS[s]) { console.error(`no check ${s}: one of ${Object.keys(SLOWS).join(', ')}`); process.exit(1); }
  print(await evaluate({ slow }));
}
