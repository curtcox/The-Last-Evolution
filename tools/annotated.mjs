// annotated.mjs: the film with its notes in the margin, a foreword above it and an afterword below.   npm run annotated
//   out/review/round7/annotated.html   the whole film in draft (Round 6's videos, played back to back as film.mjs does),
//                                      with each note of notes/annotations.yaml appearing beside the picture as its words
//                                      are spoken; notes/foreword.md above, notes/afterword.md below (scrolled to when the
//                                      film ends), and every note listed by chapter. Kinds can be turned off; Curt's own
//                                      notes pin to a moment, as on the film page. Captions (each chapter's track, made
//                                      in the page from the voice's word timings) can be turned on in the player.
//   notes/reports/annotations.md       each note's time, and the gaps that break Round 7's spacing rule
// Notes are anchored to words, not seconds, so re-timing the voice moves them with it. First: npm run film (Round 6).
import { readdirSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { readYaml, respeller, storyWords, PATHS } from './script_lib.mjs';
import { publishReview } from './publish_review.mjs';

const OUT = 'out/review/round7', REPO = 'https://github.com/curtcox/The-Last-Evolution', UP = '../../', GAP = 20;
const cast = readYaml('script/cast.yaml'), who = id => id === 'narrator' ? '' : (s => s[0].toUpperCase() + s.slice(1))(cast[id].name.split(',')[0]);
const say = respeller(readYaml(PATHS.pronounce)), refs = readYaml('notes/refs.yaml'), { kinds, notes } = readYaml('notes/annotations.yaml');
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const hms = s => { const d = Math.round(s), h = Math.floor(d / 3600), m = Math.floor(d % 3600 / 60); return (h ? h + ':' + String(m).padStart(2, '0') : m) + ':' + String(d % 60).padStart(2, '0'); };
// words compared as their letters and digits, split at anything else ("Sirius--Alpha", "X-5638", "don't"), the same way
// for the phrase and the voice, so a phrase matches however the voice's words were joined
const bits = s => s.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);

// Markdown, as much as the notes use: ## headings, paragraphs, - lists, *italic*, **bold**, [text][ref-id], [text](url).
// A link to /path is the site's own page, made relative to this one.
const inline = s => esc(s).replace(/\[([^\]]+)\]\[([a-z0-9-]+)\]/g, (m, t, id) => { if (!refs[id]) throw new Error(`unknown reference ${id}`); return `<a href="${esc(refs[id].url)}">${t}</a>`; })
  .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (m, t, u) => `<a href="${u.startsWith('/') ? UP + u.slice(1) : u}">${t}</a>`)
  .replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>').replace(/\*([^*]+)\*/g, '<i>$1</i>');
// a note file: its title and the italic line under it are for the repo, not the page; so are the link definitions
function md(file) {
  const src = readFileSync(file, 'utf8').replace(/<!-- refs:[\s\S]*?<!-- \/refs -->/, '');
  const blocks = src.split(/\n\s*\n/).map(b => b.trim()).filter(Boolean);
  const title = blocks.shift().replace(/^#\s*/, '');
  if (/^\*[^*]/.test(blocks[0])) blocks.shift();
  return { title, html: blocks.map(b => b.startsWith('## ') ? `<h3>${inline(b.slice(3))}</h3>`
    : b.startsWith('- ') ? `<ul>${b.split(/\n(?=- )/).map(li => `<li>${inline(li.slice(2).replace(/\s*\n\s*/g, ' '))}</li>`).join('')}</ul>`
    : `<p>${inline(b.replace(/\s*\n\s*/g, ' '))}</p>`).join('\n') };
}

// the chapters, as the film page plays them: Round 6's published drafts, and the pilot's from Round 5
const published = dir => readdirSync(`site/review/${dir}/video`);
let at = 0;
const chapters = [];
for (let n = 0; n <= 11; n++) {
  const NN = String(n).padStart(2, '0'), TL = JSON.parse(readFileSync(`out/ch${NN}/timeline.json`, 'utf8'));
  const round = n === 5 ? 'round5' : 'round6', file = published(round).find(f => new RegExp(`^ch${NN}-draft-[0-9a-f]{8}\\.mp4$`).test(f));
  if (!file) throw new Error(`chapter ${n} has no published draft; run npm run film first`);
  chapters.push({ n, title: TL.title, src: `../${round}/video/${file}`, at, dur: TL.duration, shots: TL.shots.map(s => ({ id: s.id, t0: s.t0 })),
    lines: TL.lines.map(l => ({ id: l.id, who: who(l.who), t0: l.t0, t1: l.t1, words: storyWords(l, say) })) });
  at += TL.duration;
}
const total = at;

// each note's moment: the first word of its phrase, which must occur once (within `at`'s paragraph, if given)
const timed = notes.map(note => {
  if (!kinds[note.kind]) throw new Error(`${note.id}: unknown kind ${note.kind}`);
  if (note.shot) {
    const [n, id] = note.shot.split('.'), c = chapters[+n], s = c?.shots.find(s => s.id === id);
    if (!s) throw new Error(`${note.id}: no shot ${note.shot}`);
    return { ...note, ch: c.n, T: c.at + s.t0 };
  }
  // the line's words are the text's (storyWords), so a phrase is matched as printed
  const wants = [bits(note.on)], hits = [];
  for (const c of chapters) for (const l of c.lines) {
    if (note.at && !l.id.startsWith(note.at + '.')) continue;
    const ws = l.words.flatMap(w => bits(w[0]).map(b => [b, w[1]]));
    for (const want of wants) for (let i = 0; i + want.length <= ws.length; i++) if (want.every((w, j) => ws[i + j][0] === w)) hits.push({ ch: c.n, T: c.at + ws[i][1], line: l.id });
  }
  if (hits.length !== 1) throw new Error(`${note.id}: "${note.on}" is spoken ${hits.length} times${hits.length ? ` (${hits.map(h => h.line).join(', ')}); give its paragraph as at:` : ''}`);
  return { ...note, ...hits[0] };
}).sort((a, b) => a.T - b.T);

// the report: every note's time, and where two come closer than the rule allows
const close = timed.filter((x, i) => i && x.T - timed[i - 1].T < GAP);
mkdirSync('notes/reports', { recursive: true });
writeFileSync('notes/reports/annotations.md', ['# The margin notes', '', `Written by \`tools/annotated.mjs\` on ${new Date().toISOString().slice(0, 10)}: ${timed.length} notes over ${hms(total)}, about one every ${Math.round(total / timed.length)} s. ` +
  (close.length ? `**${close.length} closer than ${GAP} s to the one before** (marked).` : `None closer than ${GAP} s.`), '',
  '| at | ch | note | kind | gap |', '|---|---|---|---|---|',
  ...timed.map((x, i) => `| ${hms(x.T)} | ${x.ch} | ${x.title.replace(/\|/g, '/')} (\`${x.id}\`) | ${kinds[x.kind]} | ${i ? Math.round(x.T - timed[i - 1].T) + ' s' + (x.T - timed[i - 1].T < GAP ? ' ⚠' : '') : ''} |`), ''].join('\n'));

const fore = md('notes/foreword.md'), after = md('notes/afterword.md');
const paras = s => s.trim().split(/\n+/).map(p => `<p>${inline(p)}</p>`).join('');   // a blank line in a body starts a new paragraph
const noteHtml = x => `<h4>${inline(x.title)}</h4>${paras(x.body)}${x.more ? `<p class="more"><a href="${REPO}/blob/main/notes/${x.more}">More</a></p>` : ''}`;
const DATA = JSON.stringify({ CH: chapters.map(({ shots, ...c }) => ({ ...c, lines: c.lines.map(({ id, ...l }) => l) })), TOTAL: total,
  NOTES: timed.map(x => ({ id: x.id, T: +x.T.toFixed(2), kind: x.kind, ch: x.ch, html: noteHtml(x) })) }).replace(/</g, '\\u003c');

mkdirSync(OUT, { recursive: true });
writeFileSync(`${OUT}/annotated.html`, `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>The Last Evolution, annotated (draft)</title>
<meta name="description" content="John W. Campbell, Jr.'s 1932 story The Last Evolution, read in full by a cast of voices over ink-wash paintings, with notes in the margin on its science, its text and its ideas. A draft.">
<meta property="og:title" content="The Last Evolution, annotated (draft)"><meta property="og:type" content="video.other">
<meta property="og:description" content="Campbell's 1932 story of the machines that inherited the Earth, read in full and painted, with notes as it plays.">
<meta property="og:image" content="https://curtcox.github.io/The-Last-Evolution/img/morey_1932_p415.jpg">
<link rel="icon" href="${UP}favicon.svg">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Old+Standard+TT:ital,wght@0,400;0,700;1,400&family=Bebas+Neue&display=swap">
<link rel="stylesheet" href="${UP}style.css"><style>
main{max-width:1240px} .read{max-width:38em;margin:0 auto} .read h3{font:1.25em/1.2 "Bebas Neue",Impact,sans-serif;letter-spacing:.04em;margin:1.4em 0 .2em}
.draft{border:1px solid var(--rule);background:var(--paper2);padding:.4em 1em;font-size:.9em}
.begin{font:inherit;padding:.4em 1.2em;border:1px solid var(--accent);background:var(--paper2);color:var(--ink);cursor:pointer;margin:.5em 0 1em}
.film{display:grid;grid-template-columns:minmax(0,1fr) 21em;gap:1.4em;align-items:start;margin-top:1em}
.player{position:sticky;top:0;background:var(--paper);padding:.5em 0;z-index:2}
.player video{width:100%;height:auto;display:block;aspect-ratio:16/9;background:#2A221B}
.bar{position:relative;height:1.6em;margin:.4em 0 .2em} .bar input{width:100%;margin:0} .ticks{position:absolute;left:0;right:0;top:0;height:.5em;pointer-events:none}
.ticks span{position:absolute;top:0;width:1px;height:.5em;background:var(--ink2)} .ticks i{position:absolute;top:.7em;width:5px;height:5px;margin-left:-2px;border-radius:50%;background:var(--accent);opacity:.7}
.time{display:flex;justify-content:space-between;font-size:.85em;color:var(--ink2);font-variant-numeric:tabular-nums}
.now{min-height:3.2em;font-size:.95em;margin:.3em 0 0} .now .who,.chnow{font-variant:small-caps;color:var(--ink2);margin-right:.5em}
.now .who{font-variant:normal;font-style:italic;color:var(--ink)} .now .w{color:var(--ink2)} .now .w.said{color:var(--ink)}
.kinds{display:flex;flex-wrap:wrap;gap:.35em;margin:.4em 0;font-size:.82em} .kinds button{font:inherit;padding:.15em .6em;border:1px solid var(--rule);background:none;color:var(--ink2);cursor:pointer;border-radius:1em}
.kinds button[aria-pressed=true]{background:var(--paper2);color:var(--ink);border-color:var(--accent)}
.margin{position:sticky;top:0;max-height:100vh;overflow-y:auto;padding:.5em 0 30vh;font-size:.88em;line-height:1.45}
.margin .empty{color:var(--ink2);font-style:italic}
.note{border-left:3px solid var(--rule);padding:.1em 0 .1em .8em;margin:0 0 1em;opacity:.55;transition:opacity .4s}
.note.on{opacity:1;border-color:var(--accent)} .note h4{margin:0;font-size:1em} .note h4 .k{font-weight:400;font-variant:small-caps;color:var(--ink2);margin-right:.4em}
.note h4 a.nl{color:inherit;text-decoration:none} .note h4 a.nl:hover{text-decoration:underline}
.note p{margin:.2em 0} .note .more{font-size:.9em}
.card{display:none} .gone{display:none!important} .sr{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)}
@media (max-width:60em){.film{grid-template-columns:1fr}.player{position:static}.margin{display:none}.card{display:block;min-height:5.5em;font-size:.85em;line-height:1.4;border-top:1px solid var(--rule);padding-top:.3em}.card .note{opacity:1;margin:0}}
.pin{display:flex;gap:.5em;margin-top:.3em} .pin input{flex:1;font:inherit;padding:.3em .5em;border:1px solid var(--rule);background:var(--paper2);color:var(--ink)}
.pin button,.notesbar button{font:inherit;padding:.3em .8em;border:1px solid var(--rule);background:var(--paper2);color:var(--ink);cursor:pointer}
ol.pins{padding-left:1.4em} ol.pins li{margin:.25em 0} .at{cursor:pointer;color:var(--accent);margin-right:.5em;font-variant-numeric:tabular-nums;text-decoration:none}
ol.pins .x{cursor:pointer;color:var(--ink2);margin-left:.5em} .notesbar{display:flex;gap:.5em;align-items:center} .t{color:var(--ink2);font-size:.85em}
.index h3{margin:1.2em 0 .3em} .index .note{opacity:1}
</style></head><body><main>
<p class="kicker"><a href="${UP}">The Last Evolution</a> · <a href="../">Review</a> · Round 7</p><h1>The Last Evolution, annotated</h1>
<div class="read">
<p class="draft"><b>A draft.</b> Every word of the story is here, voiced, but the paintings are still rough: the finished
film will be painted again in full. The notes are being reviewed too (<a href="${REPO}/blob/main/review/round7.md">Round
7</a>); if you spot a mistake, <a href="${REPO}/issues">say so on GitHub</a>.
<a href="#film" id="skip">Skip to the film</a> or read on.</p>
<h2 id="foreword">${esc(fore.title)}</h2>
${fore.html}
<button class="begin" id="begin">Begin the film</button>
</div>
<div class="film" id="film"><div>
<div class="player"><video id="v" controls preload="metadata" playsinline aria-label="the film"></video>
<div class="bar"><div class="ticks">${chapters.slice(1).map(c => `<span style="left:${(100 * c.at / total).toFixed(2)}%"></span>`).join('')}${timed.map(x => `<i data-k="${x.kind}" style="left:${(100 * x.T / total).toFixed(2)}%"></i>`).join('')}</div>
<input id="scrub" type="range" min="0" max="${total.toFixed(1)}" step="0.1" value="0" aria-label="the whole film"></div>
<div class="time"><span id="tnow">0:00</span><span>the whole film, ${hms(total)}</span></div>
<p class="now" id="now"></p>
<div class="card" id="card"></div><p class="sr" id="say" aria-live="polite"></p>
<div class="kinds" id="kinds"><span class="t">Notes:</span>${Object.entries(kinds).map(([k, label]) => `<button data-k="${k}" aria-pressed="true">${esc(label)}</button>`).join('')}<button id="none" aria-pressed="false">None</button></div>
<div class="pin"><input id="pin" placeholder="Your own note at this moment…" aria-label="your note"><button id="pinb">Pin</button></div></div>
<h3>Your notes</h3><p class="t">Kept in this browser only. <i>Copy</i> puts them on the clipboard, with their times.</p><div class="notesbar"><button id="copy">Copy</button><button id="clear">Clear</button><span id="msg" class="t"></span></div>
<ol class="pins" id="pins"></ol>
</div>
<aside class="margin" id="margin" aria-label="notes"><p class="empty">Notes appear here as the film reaches them.</p></aside></div>
<div class="read">
<h2 id="afterword">${esc(after.title)}</h2>
${after.html}
<h2 id="all">All the notes</h2><div class="index">
${chapters.map(c => { const ns = timed.filter(x => x.ch === c.n); return `<h3>${c.n}. <i>${esc(c.title)}</i></h3>` + ns.map(x => `<div class="note" data-k="${x.kind}"><h4><a class="at" href="#t=${Math.round(x.T)}" data-t="${x.T.toFixed(2)}">${hms(x.T)}</a><span class="k">${esc(kinds[x.kind])}</span><a class="nl" href="#note=${x.id}" title="a link to this note in the film">${inline(x.title)}</a></h4>${paras(x.body)}</div>`).join('\n'); }).join('\n')}
</div></div>
<script>
const { CH, TOTAL, NOTES } = ${DATA}, KINDS = ${JSON.stringify(kinds)}, KEY = 'tle-annotated-notes', SHOWN = 'tle-annotated-kinds';
const v = document.getElementById('v'), scrub = document.getElementById('scrub'), now = document.getElementById('now'), margin = document.getElementById('margin'), card = document.getElementById('card');
const hms = s => { s = Math.max(0, Math.round(s)); const h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60); return (h ? h + ':' + String(m).padStart(2, '0') : m) + ':' + String(s % 60).padStart(2, '0'); };
let cur = 0, want = null, scrubbing = false;
const chAt = T => { let i = 0; while (i + 1 < CH.length && T >= CH[i + 1].at) i++; return i; };
const filmTime = () => CH[cur].at + v.currentTime;
const play = () => v.play().catch(() => {});  // refused until the viewer has touched the page
// captions: each chapter's words in cues of a line or two, broken at a sentence's end or when long, the speaker named
const vtt = c => { const ts = s => new Date(s * 1000).toISOString().slice(11, 23), cues = [];
  for (const l of c.lines) { let cue = [];
    const flush = (end) => { if (!cue.length) return; cues.push({ t0: cue[0][1], t1: end, text: (cues.at(-1)?.l === l || !l.who ? '' : l.who + ': ') + cue.map(w => w[0]).join(' '), l }); cue = []; };
    l.words.forEach((w, j) => { const len = cue.reduce((a, x) => a + x[0].length + 1, 0);
      if (cue.length && (len + w[0].length > 74 || (/[.?!]["”’]*$/.test(cue.at(-1)[0]) && len > 20) || (/[,;:—-]$/.test(cue.at(-1)[0]) && len > 50))) flush(w[1]);
      cue.push(w); });
    flush(l.t1 + .3); }
  cues.forEach((q, i) => { if (cues[i + 1] && q.t1 > cues[i + 1].t0) q.t1 = cues[i + 1].t0; if (q.t1 <= q.t0) q.t1 = q.t0 + .5; });
  return 'WEBVTT\\n\\n' + cues.map(q => ts(q.t0) + ' --> ' + ts(q.t1) + '\\n' + q.text.replace(/--/g, '—').replace(/&/g, '&amp;').replace(/</g, '&lt;')).join('\\n\\n') + '\\n'; };
let ccMode = 'disabled';
function captions(i) {
  const old = v.querySelector('track'); if (old) { ccMode = old.track.mode; URL.revokeObjectURL(old.src); old.remove(); }
  const tr = document.createElement('track'); tr.kind = 'captions'; tr.srclang = 'en'; tr.label = 'English';
  tr.src = URL.createObjectURL(new Blob([vtt(CH[i])], { type: 'text/vtt' })); v.append(tr); tr.track.mode = ccMode;
}
function go(T, andPlay = true) {
  const i = chAt(T), t = T - CH[i].at;
  if (i !== cur || !v.src) { cur = i; want = { t, play: andPlay }; v.src = CH[i].src; captions(i); v.load(); }
  else if (want) want = { t, play: andPlay };  // still loading: the latest seek wins
  else { v.currentTime = t; if (andPlay) play(); }
}
v.addEventListener('loadedmetadata', () => { if (want) { v.currentTime = want.t; if (want.play) play(); want = null; } });
v.addEventListener('ended', () => { if (cur + 1 < CH.length) go(CH[cur + 1].at + .01); else document.getElementById('afterword').scrollIntoView({ behavior: 'smooth' }); });
scrub.addEventListener('input', () => { scrubbing = true; document.getElementById('tnow').textContent = hms(+scrub.value); });
scrub.addEventListener('change', () => { scrubbing = false; go(+scrub.value); });
// which kinds are shown, remembered in this browser
let shown; try { shown = new Set(JSON.parse(localStorage.getItem(SHOWN))); } catch (e) {}
if (!shown || !localStorage.getItem(SHOWN)) shown = new Set(Object.keys(KINDS));
function kindsChanged() {
  try { localStorage.setItem(SHOWN, JSON.stringify([...shown])); } catch (e) {}
  document.querySelectorAll('#kinds button[data-k]').forEach(b => b.setAttribute('aria-pressed', shown.has(b.dataset.k)));
  document.getElementById('none').setAttribute('aria-pressed', !shown.size);
  document.querySelectorAll('.ticks i').forEach(e => e.classList.toggle('gone', !shown.has(e.dataset.k)));
  upto = -2;
}
document.querySelectorAll('#kinds button[data-k]').forEach(b => b.onclick = () => { shown.has(b.dataset.k) ? shown.delete(b.dataset.k) : shown.add(b.dataset.k); kindsChanged(); });
document.getElementById('none').onclick = () => { shown = shown.size ? new Set() : new Set(Object.keys(KINDS)); kindsChanged(); };
// the margin: every shown note up to now, the latest lit while it's fresh; nothing ahead of the film is shown
const noteEl = n => { const d = document.createElement('div'); d.className = 'note'; d.dataset.i = n; d.innerHTML = NOTES[n].html;
  d.querySelector('h4').insertAdjacentHTML('afterbegin', '<a class="at" href="#note=' + NOTES[n].id + '" data-t="' + NOTES[n].T + '">' + hms(NOTES[n].T) + '</a><span class="k">' + KINDS[NOTES[n].kind] + '</span>'); return d; };
let upto = -2, lit = null;
function margins(T) {
  let k = -1; for (let i = 0; i < NOTES.length && NOTES[i].T <= T; i++) if (shown.has(NOTES[i].kind)) k = i;
  if (k !== upto) {
    // a screen reader hears only the newest note's kind and title, as the film reaches it
    if (k > upto && upto >= -1 && k >= 0 && !v.paused) document.getElementById('say').textContent = KINDS[NOTES[k].kind] + ' note: ' + NOTES[k].html.match(/<h4>(.*?)<\\/h4>/)[1].replace(/<[^>]+>/g, '');
    upto = k; margin.innerHTML = ''; card.innerHTML = '';
    const list = NOTES.map((n, i) => i).filter(i => i <= k && shown.has(NOTES[i].kind));
    if (!list.length) margin.innerHTML = '<p class="empty">' + (shown.size ? 'Notes appear here as the film reaches them.' : 'Notes are off.') + '</p>';
    list.forEach(i => margin.append(noteEl(i)));
    if (k >= 0) { card.append(noteEl(k)); margin.scrollTop = margin.scrollHeight; }
    lit = null;
  }
  const fresh = k >= 0 && T - NOTES[k].T < 45 ? k : null;
  if (fresh !== lit) { lit = fresh; margin.querySelectorAll('.note').forEach(e => e.classList.toggle('on', +e.dataset.i === fresh)); card.classList.toggle('gone', fresh === null); }
}
let chOn = -1;
function tick() {
  const c = CH[cur], t = v.currentTime, T = c.at + t;
  if (!scrubbing) { scrub.value = T; document.getElementById('tnow').textContent = hms(T); }
  const L = c.lines.find(l => t >= l.t0 - .05 && t < l.t1 + .3);
  const wi = L ? Math.max(0, L.words.findLastIndex(w => w[1] <= t)) : 0, a = Math.max(0, wi - 14), win = cur + ':' + (L ? L.t0 + ':' + a : '');
  if (win !== now.dataset.win) { now.dataset.win = win; now.innerHTML = '<span class="chnow">' + c.n + ' · ' + c.title.replace(/[<&]/g, '') + '</span>' + (L && L.who ? '<span class="who">' + L.who.replace(/[<&]/g, '') + ':</span> ' : '') + (!L ? '' : (a ? '… ' : '') + L.words.slice(a, a + 34).map(w => '<span class="w" data-t="' + w[1] + '">' + w[0].replace(/[<&]/g, '') + '</span>').join(' ') + (a + 34 < L.words.length ? ' …' : '')); }
  if (L) now.querySelectorAll('.w').forEach(e => e.classList.toggle('said', +e.dataset.t <= t));
  margins(T);
  requestAnimationFrame(tick);
}
addEventListener('resize', () => { upto = -2; });  // the margin is hidden on a phone, so it's laid out again when it shows
// links into the film: #t=957 or #t=15:57 for a moment, #note=bacteria for a note (what a QR code would open)
function fromHash() {
  const h = decodeURIComponent(location.hash.slice(1)), m = h.match(/^t=(?:(\\d+):)?(\\d+(?:\\.\\d+)?)$/);
  const n = h.startsWith('note=') && NOTES.find(x => x.id === h.slice(5));
  if (n && !shown.has(n.kind)) { shown.add(n.kind); kindsChanged(); }
  const T = n ? n.T + .05 : m ? 60 * (m[1] || 0) + +m[2] : null;
  if (T === null) return;
  go(Math.min(T, TOTAL - .1), false); document.getElementById('film').scrollIntoView();
}
addEventListener('hashchange', fromHash);
kindsChanged(); go(0, false); fromHash(); requestAnimationFrame(tick);
const seek = T => { go(Math.max(0, T - 1)); document.getElementById('film').scrollIntoView({ behavior: 'smooth' }); };
document.getElementById('begin').onclick = () => seek(1);
document.addEventListener('click', e => { const a = e.target.closest('.at[data-t]'); if (!a) return;
  e.preventDefault(); seek(+a.dataset.t); if (a.hash) history.replaceState(null, '', a.hash); });
// your notes, kept in this browser only
const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { return []; } };
const save = ns => { try { localStorage.setItem(KEY, JSON.stringify(ns)); } catch (e) {} };
let pins = load();
const near = T => { let n = null; for (const x of NOTES) if (x.T <= T + 5) n = x; return n && T - n.T < 60 ? ', after the note "' + n.id + '"' : ''; };
const where = T => 'ch ' + CH[chAt(T)].n + near(T);
function show() {
  const ol = document.getElementById('pins'); ol.innerHTML = '';
  pins.forEach((n, i) => { const li = document.createElement('li'), at = document.createElement('a'), x = document.createElement('span');
    at.className = 'at'; at.href = '#t=' + Math.round(n.t); at.dataset.t = n.t + 1; at.textContent = hms(n.t) + ' (' + where(n.t) + ')';
    x.className = 'x'; x.textContent = '×'; x.title = 'remove'; x.onclick = () => { pins.splice(i, 1); save(pins); show(); };
    li.append(at, document.createTextNode(n.text), x); ol.append(li); });
}
function pin() { const box = document.getElementById('pin'), text = box.value.trim(); if (!text) return;
  pins.push({ t: filmTime(), text }); pins.sort((a, b) => a.t - b.t); save(pins); show(); box.value = ''; }
document.getElementById('pinb').onclick = pin;
document.getElementById('pin').addEventListener('keydown', e => { if (e.key === 'Enter') pin(); });
document.getElementById('copy').onclick = async () => {
  const txt = 'The annotated film, notes\\n' + pins.map(n => '- ' + hms(n.t) + ' (' + where(n.t) + '): ' + n.text).join('\\n');
  try { await navigator.clipboard.writeText(txt); document.getElementById('msg').textContent = 'copied ' + pins.length + (pins.length === 1 ? ' note' : ' notes'); }
  catch (e) { prompt('Copy these notes:', txt); }
};
document.getElementById('clear').onclick = () => { if (pins.length && confirm('Remove all ' + pins.length + ' notes?')) { pins = []; save(pins); show(); } };
show();
</script>
</main></body></html>`);
console.log(`${OUT}/annotated.html: ${timed.length} notes over ${hms(total)}${close.length ? `, ${close.length} closer than ${GAP} s (notes/reports/annotations.md)` : ''}`);
publishReview('round7');
