// draft.mjs: a chapter's draft, as a page to watch and note.   npm run draft -- 5   (--page: the page only)
//   out/review/roundN/video/chNN-draft.mp4   the frames render.mjs made (out/frames/chNN, at 12 a second) with the chapter's
//                                             mix, 1280 wide
//   out/review/roundN/chNN-draft.html        the video with the line being said under it, words lit as they're said;
//                                             notes pinned to a moment (kept in the browser, copied out as text for the
//                                             decision sheet); and the storyboard's shots, timed, click to seek.
//                                             Published with the site by tools/publish_review.mjs.
// First: npm run timeline -- 5, then node render.mjs --chapter=5 --frames --fps=12 --workers=6.
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync, statSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { readYaml, respeller, storyWords, PATHS } from './script_lib.mjs';
import { publishReview } from './publish_review.mjs';

const n = +process.argv[2], NN = String(n).padStart(2, '0');
if (!(n >= 0)) { console.error('which chapter? e.g. npm run draft -- 5'); process.exit(1); }
const TL = JSON.parse(readFileSync(`out/ch${NN}/timeline.json`, 'utf8')), board = readYaml(`script/boards/ch${NN}.yaml`), cast = readYaml('script/cast.yaml');
const RN = n === 5 ? 5 : 6, ROUND = `round${RN}`, STAGE = n === 5 ? 'the pilot' : 'the chapters', FRAMES = `out/frames/ch${NN}`;
const OUT = `out/review/${ROUND}`, VID = `${OUT}/video/ch${NN}-draft.mp4`, FPS = 12;
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const mmss = s => { const d = Math.round(s); return `${Math.floor(d / 60)}:${String(d % 60).padStart(2, '0')}`; };

// the video: every frame, scaled to 1280, with the mix
if (!process.argv.includes('--page')) {
  const frames = readdirSync(FRAMES).filter(f => /^f\d+\.jpg$/.test(f)).length, want = Math.round(TL.duration * FPS);
  if (frames < want) { console.error(`${FRAMES} has ${frames} of ${want} frames: render them first`); process.exit(1); }
  mkdirSync(`${OUT}/video`, { recursive: true });
  execFileSync('ffmpeg', ['-v', 'error', '-stats', '-y', '-framerate', String(FPS), '-i', `${FRAMES}/f%05d.jpg`, '-i', `out/ch${NN}/mix.mp3`,
    '-map', '0:v', '-map', '1:a', '-vf', 'scale=1280:-2:flags=lanczos', '-c:v', 'libx264', '-preset', 'slow', '-crf', '31', '-tune', 'animation', '-pix_fmt', 'yuv420p',
    '-c:a', 'aac', '-b:a', '128k', '-shortest', '-movflags', '+faststart', VID], { stdio: 'inherit' });
  console.log(`${VID}: ${(statSync(VID).size / 1e6).toFixed(1)} MB`);
}

// the page
const shots = board.shots.map((s, i) => ({ ...s, ...TL.shots[i] }));
const say = respeller(readYaml(PATHS.pronounce));
const who = l => cast[l.who === 'narrator' ? 'narrator' : l.who].name + (l.mode === 'thought' ? ' (thought)' : '');
const data = { shots: shots.map(s => ({ id: s.id, title: s.title, t0: s.t0, t1: s.t1 })), lines: TL.lines.map(l => ({ who: who(l), t0: l.t0, t1: l.t1, words: storyWords(l, say) })) };
writeFileSync(`${OUT}/ch${NN}-draft.html`, `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Round ${RN}: chapter ${n}'s draft</title><link rel="stylesheet" href="../../style.css"><style>
main{max-width:1100px} .player{position:sticky;top:0;background:var(--paper);padding:.5em 0;z-index:2;border-bottom:1px solid var(--rule)}
.player video{width:100%;height:auto;display:block;aspect-ratio:16/9;background:#2A221B}
.now{min-height:3.2em;font-size:.95em;margin:.3em 0 0} .now .who,.shotnow{font-variant:small-caps;color:var(--ink2);margin-right:.5em}
.now .w{color:var(--ink2)} .now .w.said{color:var(--ink)}
.pin{display:flex;gap:.5em;margin-top:.3em} .pin input{flex:1;font:inherit;padding:.3em .5em;border:1px solid var(--rule);background:var(--paper2);color:var(--ink)}
.pin button,.notesbar button{font:inherit;padding:.3em .8em;border:1px solid var(--rule);background:var(--paper2);color:var(--ink);cursor:pointer}
ol.notes{padding-left:1.4em} ol.notes li{margin:.25em 0} ol.notes .at{cursor:pointer;color:var(--accent);margin-right:.5em;font-variant-numeric:tabular-nums}
ol.notes .x{cursor:pointer;color:var(--ink2);margin-left:.5em} .notesbar{display:flex;gap:.5em;align-items:center}
.shot{display:grid;grid-template-columns:minmax(0,240px) 1fr;gap:1em;padding:.8em 0;border-top:1px solid var(--rule);cursor:pointer}
.shot.on{background:var(--paper2)} .shot img{width:100%;height:auto;border:1px solid var(--rule)} .shot h3{margin:0 0 .2em} .shot p{margin:.2em 0}
.shot .k{font-variant:small-caps;color:var(--ink2);margin-right:.4em} .t{color:var(--ink2);font-size:.85em}
@media (max-width:700px){.shot{grid-template-columns:1fr}}
</style></head><body><main>
<p class="kicker"><a href="../">Review</a> · Round ${RN} · ${STAGE}${RN === 6 ? ' · <a href="film.html">the whole film</a>' : ''}</p><h1>Chapter ${n}: <i>${esc(TL.title)}</i>, the draft</h1>
<p>The first pass with motion, ${mmss(TL.duration)} at 12 drawings a second, over the same sound as the
${existsSync(`${OUT}/ch${NN}.html`) ? `<a href="ch${NN}.html">storyboard</a>` : 'storyboard'}.${board.draft ? ' ' + esc(board.draft.trim()) : ''}</p>
<p><b>Notes:</b> pause anywhere, type, and press Enter (or <i>Pin</i>) to pin a note to that moment. They stay in this
browser. <i>Copy notes</i> puts them on the clipboard as text, timed and with their shot, for the
<a href="https://github.com/curtcox/The-Last-Evolution/blob/main/review/${ROUND}.md">decision sheet</a> or a message.</p>
<div class="player"><video id="v" controls preload="metadata" playsinline src="video/ch${NN}-draft.mp4"></video>
<p class="now" id="now"></p>
<div class="pin"><input id="note" placeholder="A note at this moment…" aria-label="note"><button id="pinb">Pin</button></div></div>
<h2>Notes</h2><div class="notesbar"><button id="copy">Copy notes</button><button id="clear">Clear</button><span id="msg" class="t"></span></div>
<ol class="notes" id="notes"></ol>
<h2>The shots</h2>
${shots.map(s => `<div class="shot" id="shot-${s.id}" data-t="${s.t0}"><img src="img/ch${NN}-${s.id}.jpg" alt="shot ${s.id}" loading="lazy"><div>
<h3><span class="shotnow">${s.id}</span> ${esc(s.title)} <span class="t">${mmss(s.t0)}–${mmss(s.t1)}</span></h3>
<p><span class="k">seen</span>${esc(s.seen)}</p><p><span class="k">camera</span>${esc(s.camera)}</p></div></div>`).join('\n')}
<script>
const D = ${JSON.stringify(data)}, v = document.getElementById('v'), now = document.getElementById('now'), KEY = 'tle-ch${NN}-draft-notes';
const mmss = s => Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0');
const shotAt = t => D.shots.find(s => t >= s.t0 && t < s.t1) || D.shots[D.shots.length - 1];
let shot = null, line = -1;
function tick() {
  const t = v.currentTime, s = shotAt(t), li = D.lines.findIndex(l => t >= l.t0 - .05 && t < l.t1 + .3);
  if (s !== shot) { shot = s; document.querySelectorAll('.shot.on').forEach(e => e.classList.remove('on')); document.getElementById('shot-' + s.id).classList.add('on'); }
  const L = D.lines[li], wi = L ? Math.max(0, L.words.findLastIndex(w => w[1] <= t)) : 0, a = Math.max(0, wi - 14), win = (L ? a : -1) + ':' + s.id;
  if (li !== line || win !== now.dataset.win) { line = li; now.dataset.win = win; now.innerHTML = '<span class="shotnow">' + s.id + ' · ' + s.title.replace(/[<&]/g, '') + '</span>' + (!L ? '' : '<span class="who">' + L.who + '</span>' + (a ? '… ' : '') + L.words.slice(a, a + 34).map(w => '<span class="w" data-t="' + w[1] + '">' + w[0].replace(/[<&]/g, '') + '</span>').join(' ') + (a + 34 < L.words.length ? ' …' : '')); }
  if (L) now.querySelectorAll('.w').forEach(e => e.classList.toggle('said', +e.dataset.t <= t));
  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);
const seek = t => { v.currentTime = t; v.play(); window.scrollTo({ top: 0, behavior: 'smooth' }); };
document.querySelectorAll('.shot').forEach(e => e.addEventListener('click', () => seek(+e.dataset.t + .01)));
// notes, kept in this browser only
const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { return []; } };
const save = ns => { try { localStorage.setItem(KEY, JSON.stringify(ns)); } catch (e) {} };
let notes = load();
function show() {
  const ol = document.getElementById('notes'); ol.innerHTML = '';
  notes.forEach((n, i) => { const li = document.createElement('li'), at = document.createElement('span'), x = document.createElement('span');
    at.className = 'at'; at.textContent = mmss(n.t) + ' ' + n.shot; at.onclick = () => seek(n.t);
    x.className = 'x'; x.textContent = '×'; x.title = 'remove'; x.onclick = () => { notes.splice(i, 1); save(notes); show(); };
    li.append(at, document.createTextNode(n.text), x); ol.append(li); });
}
function pin() { const box = document.getElementById('note'), text = box.value.trim(); if (!text) return; const t = v.currentTime;
  notes.push({ t, shot: shotAt(t).id, text }); notes.sort((a, b) => a.t - b.t); save(notes); show(); box.value = ''; }
document.getElementById('pinb').onclick = pin;
document.getElementById('note').addEventListener('keydown', e => { if (e.key === 'Enter') pin(); });
document.getElementById('copy').onclick = async () => {
  const txt = 'Chapter ${n} draft notes\\n' + notes.map(n => '- ' + mmss(n.t) + ' (' + n.shot + ', ' + shotAt(n.t).title + '): ' + n.text).join('\\n');
  try { await navigator.clipboard.writeText(txt); document.getElementById('msg').textContent = 'copied ' + notes.length + (notes.length === 1 ? ' note' : ' notes'); }
  catch (e) { prompt('Copy these notes:', txt); }
};
document.getElementById('clear').onclick = () => { if (notes.length && confirm('Remove all ' + notes.length + ' notes?')) { notes = []; save(notes); show(); } };
show();
</script>
</main></body></html>`);
console.log(`${OUT}/ch${NN}-draft.html: ${shots.length} shots over ${mmss(TL.duration)}`);
publishReview(ROUND);
