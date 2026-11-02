// film.mjs: the whole film in draft, as one page to watch and note.   npm run film
//   out/review/round6/film.html   every chapter's draft (round6/video/chNN-draft.mp4, and the pilot's from Round 5)
//                                 played in order as one film: a scrub bar for the whole film with its chapter marks,
//                                 the line being said under it, notes pinned to a moment (kept in the browser, copied out
//                                 as text with the chapter and shot), and the chapters listed, click to start there.
// The chapters stay separate files (no second copy of an hour of video in the repo); the page plays them back to back.
// First: each chapter's npm run draft -- N.
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { readYaml, respeller, storyWords, PATHS } from './script_lib.mjs';
import { publishReview } from './publish_review.mjs';

const OUT = 'out/review/round6', cast = readYaml('script/cast.yaml'), say = respeller(readYaml(PATHS.pronounce));
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const hms = s => { const d = Math.round(s), h = Math.floor(d / 3600), m = Math.floor(d % 3600 / 60); return (h ? h + ':' + String(m).padStart(2, '0') : m) + ':' + String(d % 60).padStart(2, '0'); };
const who = l => cast[l.who === 'narrator' ? 'narrator' : l.who].name + (l.mode === 'thought' ? ' (thought)' : '');
// the pilot's video is Round 5's, already on the site under its content-hashed name
const pilot = () => { const f = readdirSync('site/review/round5/video').find(f => /^ch05-draft-[0-9a-f]{8}\.mp4$/.test(f)); return f && `../round5/video/${f}`; };
let at = 0;
const chapters = [], missing = [];
for (let n = 0; n <= 11; n++) {
  const NN = String(n).padStart(2, '0'), TL = JSON.parse(readFileSync(`out/ch${NN}/timeline.json`, 'utf8')), board = readYaml(`script/boards/ch${NN}.yaml`);
  const src = n === 5 ? pilot() : existsSync(`${OUT}/video/ch${NN}-draft.mp4`) ? `video/ch${NN}-draft.mp4` : null;
  if (!src) { console.warn(`chapter ${n} has no draft yet (npm run draft -- ${n}); the page leaves it out`); missing.push(n); continue; }
  chapters.push({ n, title: TL.title, src, page: n === 5 ? '../round5/ch05-draft.html' : `ch${NN}-draft.html`, at, dur: TL.duration, logline: board.logline,
    shots: TL.shots.map((s, i) => ({ id: s.id, t0: s.t0, title: board.shots[i].title })), lines: TL.lines.map(l => ({ who: who(l), t0: l.t0, t1: l.t1, words: storyWords(l, say) })) });
  at += TL.duration;
}
const total = at;
writeFileSync(`${OUT}/film.html`, `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Round 6: the whole film</title><link rel="stylesheet" href="../../style.css"><style>
main{max-width:1100px} .player{position:sticky;top:0;background:var(--paper);padding:.5em 0;z-index:2;border-bottom:1px solid var(--rule)}
.player video{width:100%;height:auto;display:block;aspect-ratio:16/9;background:#2A221B}
.bar{position:relative;height:1.6em;margin:.4em 0 .2em} .bar input{width:100%;margin:0} .ticks{position:absolute;left:0;right:0;top:0;height:.5em;pointer-events:none}
.ticks span{position:absolute;top:0;width:1px;height:.5em;background:var(--ink2)} .time{display:flex;justify-content:space-between;font-size:.85em;color:var(--ink2);font-variant-numeric:tabular-nums}
.now{min-height:3.2em;font-size:.95em;margin:.3em 0 0} .now .who,.chnow{font-variant:small-caps;color:var(--ink2);margin-right:.5em}
.now .w{color:var(--ink2)} .now .w.said{color:var(--ink)}
.pin{display:flex;gap:.5em;margin-top:.3em} .pin input{flex:1;font:inherit;padding:.3em .5em;border:1px solid var(--rule);background:var(--paper2);color:var(--ink)}
.pin button,.notesbar button{font:inherit;padding:.3em .8em;border:1px solid var(--rule);background:var(--paper2);color:var(--ink);cursor:pointer}
ol.notes{padding-left:1.4em} ol.notes li{margin:.25em 0} ol.notes .at{cursor:pointer;color:var(--accent);margin-right:.5em;font-variant-numeric:tabular-nums}
ol.notes .x{cursor:pointer;color:var(--ink2);margin-left:.5em} .notesbar{display:flex;gap:.5em;align-items:center}
.ch{padding:.7em 0;border-top:1px solid var(--rule);cursor:pointer} .ch.on{background:var(--paper2)} .ch h3{margin:0 0 .2em} .ch p{margin:.2em 0} .t{color:var(--ink2);font-size:.85em}
</style></head><body><main>
<p class="kicker"><a href="../">Review</a> · Round 6 · the chapters</p><h1>The Last Evolution: the whole film, in draft</h1>
<p>Every chapter's draft, played back to back: ${hms(total)}, at 12 drawings a second, over the voice pass and the
effects. Chapter 5 is the pilot from Round 5; the other eleven are new, built the same way and left with the same
palette and the same boil, so the look can be judged as it stands (Round 5, §5). It's a draft: the figures' acting
is simple, and the painting is a blocking pass.${missing.length ? ` <b>Still rendering:</b> chapter${missing.length > 1 ? 's' : ''} ${missing.join(', ')}; ${missing.length > 1 ? 'they join' : 'it joins'} the film when ${missing.length > 1 ? 'they\'re' : 'it\'s'} done.` : ''}</p>
<p><b>Notes:</b> pause anywhere, type, and press Enter (or <i>Pin</i>) to pin a note to that moment of the film. They
stay in this browser. <i>Copy notes</i> puts them on the clipboard as text, with the chapter and the shot, for the
<a href="https://github.com/curtcox/The-Last-Evolution/blob/main/review/round6.md">decision sheet</a> or a message.</p>
<div class="player"><video id="v" controls preload="metadata" playsinline></video>
<div class="bar"><div class="ticks">${chapters.slice(1).map(c => `<span style="left:${(100 * c.at / total).toFixed(2)}%"></span>`).join('')}</div>
<input id="scrub" type="range" min="0" max="${total.toFixed(1)}" step="0.1" value="0" aria-label="the whole film"></div>
<div class="time"><span id="tnow">0:00</span><span>${hms(total)}</span></div>
<p class="now" id="now"></p>
<div class="pin"><input id="note" placeholder="A note at this moment…" aria-label="note"><button id="pinb">Pin</button></div></div>
<h2>Notes</h2><div class="notesbar"><button id="copy">Copy notes</button><button id="clear">Clear</button><span id="msg" class="t"></span></div>
<ol class="notes" id="notes"></ol>
<h2>The chapters</h2>
${chapters.map(c => `<div class="ch" id="ch-${c.n}" data-t="${c.at}"><h3>${c.n}. <i>${esc(c.title)}</i> <span class="t">${hms(c.at)} · ${hms(c.dur)} · <a href="${c.page}">its own page</a></span></h3>
<p>${esc(c.logline.trim())}</p></div>`).join('\n')}
<script>
const CH = ${JSON.stringify(chapters.map(({ logline, page, ...c }) => c))}, TOTAL = ${total}, KEY = 'tle-film-draft-notes';
const v = document.getElementById('v'), scrub = document.getElementById('scrub'), now = document.getElementById('now');
const hms = s => { s = Math.max(0, Math.round(s)); const h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60); return (h ? h + ':' + String(m).padStart(2, '0') : m) + ':' + String(s % 60).padStart(2, '0'); };
let cur = 0, want = null, scrubbing = false;
const chAt = T => { let i = 0; while (i + 1 < CH.length && T >= CH[i + 1].at) i++; return i; };
const filmTime = () => CH[cur].at + v.currentTime;
// play the film from T: load the chapter it falls in, seek inside it
function go(T, play = true) {
  const i = chAt(T), t = T - CH[i].at;
  if (i !== cur || !v.src) { cur = i; want = { t, play }; v.src = CH[i].src; v.load(); }
  else { v.currentTime = t; if (play) v.play(); }
}
v.addEventListener('loadedmetadata', () => { if (want) { v.currentTime = want.t; if (want.play) v.play(); want = null; } });
v.addEventListener('ended', () => { if (cur + 1 < CH.length) go(CH[cur + 1].at + .01); });
scrub.addEventListener('input', () => { scrubbing = true; document.getElementById('tnow').textContent = hms(+scrub.value); });
scrub.addEventListener('change', () => { scrubbing = false; go(+scrub.value, !v.paused || true); });
const shotAt = (c, t) => { let s = c.shots[0]; for (const x of c.shots) if (t >= x.t0) s = x; return s; };
let line = null, chOn = -1;
function tick() {
  const c = CH[cur], t = v.currentTime, T = c.at + t;
  if (!scrubbing) { scrub.value = T; document.getElementById('tnow').textContent = hms(T); }
  if (chOn !== cur) { chOn = cur; document.querySelectorAll('.ch.on').forEach(e => e.classList.remove('on')); document.getElementById('ch-' + c.n).classList.add('on'); }
  const L = c.lines.find(l => t >= l.t0 - .05 && t < l.t1 + .3), s = shotAt(c, t);
  const wi = L ? Math.max(0, L.words.findLastIndex(w => w[1] <= t)) : 0, a = Math.max(0, wi - 14), win = cur + ':' + s.id + ':' + (L ? L.t0 + ':' + a : '');
  if (win !== now.dataset.win) { now.dataset.win = win; now.innerHTML = '<span class="chnow">' + c.n + ' · ' + s.title.replace(/[<&]/g, '') + '</span>' + (!L ? '' : '<span class="who">' + L.who + '</span>' + (a ? '… ' : '') + L.words.slice(a, a + 34).map(w => '<span class="w" data-t="' + w[1] + '">' + w[0].replace(/[<&]/g, '') + '</span>').join(' ') + (a + 34 < L.words.length ? ' …' : '')); }
  if (L) now.querySelectorAll('.w').forEach(e => e.classList.toggle('said', +e.dataset.t <= t));
  requestAnimationFrame(tick);
}
go(0, false); requestAnimationFrame(tick);
const seek = T => { go(T); window.scrollTo({ top: 0, behavior: 'smooth' }); };
document.querySelectorAll('.ch').forEach(e => e.addEventListener('click', ev => { if (ev.target.tagName !== 'A') seek(+e.dataset.t + .01); }));
// notes, kept in this browser only
const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { return []; } };
const save = ns => { try { localStorage.setItem(KEY, JSON.stringify(ns)); } catch (e) {} };
let notes = load();
const where = T => { const i = chAt(T), c = CH[i], s = shotAt(c, T - c.at); return 'ch ' + c.n + ' · ' + s.id + ', ' + s.title; };
function show() {
  const ol = document.getElementById('notes'); ol.innerHTML = '';
  notes.forEach((n, i) => { const li = document.createElement('li'), at = document.createElement('span'), x = document.createElement('span');
    at.className = 'at'; at.textContent = hms(n.t) + ' (' + where(n.t) + ')'; at.onclick = () => seek(n.t);
    x.className = 'x'; x.textContent = '×'; x.title = 'remove'; x.onclick = () => { notes.splice(i, 1); save(notes); show(); };
    li.append(at, document.createTextNode(n.text), x); ol.append(li); });
}
function pin() { const box = document.getElementById('note'), text = box.value.trim(); if (!text) return;
  notes.push({ t: filmTime(), text }); notes.sort((a, b) => a.t - b.t); save(notes); show(); box.value = ''; }
document.getElementById('pinb').onclick = pin;
document.getElementById('note').addEventListener('keydown', e => { if (e.key === 'Enter') pin(); });
document.getElementById('copy').onclick = async () => {
  const txt = 'The whole film, draft notes\\n' + notes.map(n => '- ' + hms(n.t) + ' (' + where(n.t) + '): ' + n.text).join('\\n');
  try { await navigator.clipboard.writeText(txt); document.getElementById('msg').textContent = 'copied ' + notes.length + (notes.length === 1 ? ' note' : ' notes'); }
  catch (e) { prompt('Copy these notes:', txt); }
};
document.getElementById('clear').onclick = () => { if (notes.length && confirm('Remove all ' + notes.length + ' notes?')) { notes = []; save(notes); show(); } };
show();
</script>
</main></body></html>`);
console.log(`${OUT}/film.html: ${chapters.length} chapters, ${hms(total)}`);
publishReview('round6');
