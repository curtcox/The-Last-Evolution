// storyboard.mjs: a chapter's storyboard, as a page to watch and read.   npm run board -- 5
//   out/review/round5/chNN.html   the boards laid over the chapter's sound: each shot's board shows while its stretch
//                                 plays, the words light up as they're said, and every shot is listed with what's seen,
//                                 its event, its camera and its reads, timed, click to seek. Published with the site
//                                 (at /review/round5/chNN.html) by tools/publish_review.mjs.
//   out/review/round5/img/        a board per shot (a still of src/scenes/chNN.js at the board's cue, or with
//                                 --from-frames the draft's frame there) and a contact sheet
// Run tools/timeline.mjs first: it lays the chapter out and mixes its sound (out/chNN/timeline.json, mix.mp3).
import { copyFileSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { readYaml, respeller, storyWords as storyWordsOf, PATHS } from './script_lib.mjs';
import { publishReview } from './publish_review.mjs';

const n = +process.argv[2], NN = String(n).padStart(2, '0');
if (!(n >= 0)) { console.error('which chapter? e.g. npm run board -- 5'); process.exit(1); }
const TL = JSON.parse(readFileSync(`out/ch${NN}/timeline.json`, 'utf8')), board = readYaml(`script/boards/ch${NN}.yaml`), cast = readYaml('script/cast.yaml');
const OUT = 'out/review/round5', IMG = `${OUT}/img`, AUD = `${OUT}/audio`, TMP = `out/check/board${NN}`;
mkdirSync(IMG, { recursive: true }); mkdirSync(AUD, { recursive: true }); rmSync(TMP, { recursive: true, force: true });
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const mmss = s => { const d = Math.round(s); return `${Math.floor(d / 60)}:${String(d % 60).padStart(2, '0')}`; };

// the boards: one still per shot at its board time, then a contact sheet of them all. --from-frames takes each from the
// draft's rendered frames (out/frames, 12 a second) instead of rendering it
if (!process.argv.includes('--page')) {
  const fromFrames = process.argv.includes('--from-frames'), still = s => fromFrames ? `out/frames/f${String(Math.round(s.board * 12)).padStart(5, '0')}.jpg` : `${TMP}/t${s.board.toFixed(2).replace('.', '_')}.png`;
  if (!fromFrames) execFileSync('node', ['render.mjs', `--chapter=${n}`, `--stills=${TL.shots.map(s => s.board.toFixed(3)).join(',')}`, `--out=${TMP}`], { stdio: ['ignore', 'pipe', 'inherit'] });
  TL.shots.forEach(s => execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', still(s), '-vf', 'scale=1280:-1', '-q:v', '4', `${IMG}/ch${NN}-${s.id}.jpg`]));
  const cols = 6, rows = Math.ceil(TL.shots.length / cols);
  execFileSync('ffmpeg', ['-v', 'error', '-y', ...TL.shots.flatMap(s => ['-i', `${IMG}/ch${NN}-${s.id}.jpg`]), '-filter_complex',
    `${TL.shots.map((s, i) => `[${i}]scale=320:-1[s${i}]`).join(';')};${TL.shots.map((s, i) => `[s${i}]`).join('')}xstack=inputs=${TL.shots.length}:layout=${TL.shots.map((s, i) => `${(i % cols) * 320}_${Math.floor(i / cols) * 180}`).join('|')}:fill=black`,
    '-q:v', '4', `${IMG}/ch${NN}-sheet.jpg`]);
  rmSync(TMP, { recursive: true, force: true });
  console.log(`rendered ${TL.shots.length} boards (${rows} rows on the sheet)`);
}
copyFileSync(`out/ch${NN}/mix.mp3`, `${AUD}/ch${NN}-mix.mp3`);

// the page
const shots = board.shots.map((s, i) => ({ ...s, ...TL.shots[i] }));
// the words as the story spells them, timed by the voice's
const say = respeller(readYaml(PATHS.pronounce)), storyWords = l => storyWordsOf(l, say);
const who = l => cast[l.who === 'narrator' ? 'narrator' : l.who].name + (l.mode === 'thought' ? ' (thought)' : '');
const data = { shots: shots.map(s => ({ id: s.id, t0: s.t0, t1: s.t1 })), lines: TL.lines.map(l => ({ who: who(l), t0: l.t0, t1: l.t1, words: storyWords(l) })) };
const readAt = r => r[0] === 0 ? 'at once' : r[0] === 'voice' ? 'with the voice' : esc(String(r[0]).replace(/^p\d+\.\d+:/, '"').replace(/^(".+?)([+-][\d.]+)?$/, '$1"$2').replace(/^p\d+\.\d+\$$/, 'at the line\'s end').replace(/^p\d+\.\d+$/, 'with the line'));
writeFileSync(`${OUT}/ch${NN}.html`, `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Round 5: chapter ${n}'s storyboard</title><link rel="stylesheet" href="../../style.css"><style>
main{max-width:1100px} .player{position:sticky;top:0;background:var(--paper);padding:.5em 0;z-index:2;border-bottom:1px solid var(--rule)}
.player img{width:100%;height:auto;display:block;aspect-ratio:16/9;border:1px solid var(--rule);background:#2A221B}
.player audio{width:100%;margin-top:.4em} .now{min-height:3.2em;font-size:.95em;margin:.3em 0 0} .now .who{font-variant:small-caps;color:var(--ink2);margin-right:.5em}
.now .w.said{color:var(--ink)} .now .w{color:var(--ink2)} .now .w.cur{color:var(--accent)} .shotid{font-variant:small-caps;color:var(--ink2)}
dl.about{display:grid;grid-template-columns:7em 1fr;gap:.3em 1em} dl.about dt{font-variant:small-caps;color:var(--ink2)} dl.about dd{margin:0}
.shot{display:grid;grid-template-columns:minmax(0,360px) 1fr;gap:1em;padding:1em 0;border-top:1px solid var(--rule);cursor:pointer}
.shot.on{background:var(--paper2)} .shot img{width:100%;height:auto;border:1px solid var(--rule)} .shot h3{margin:0 0 .2em} .shot p{margin:.2em 0}
.shot .k{font-variant:small-caps;color:var(--ink2);margin-right:.4em} .shot ol{margin:.3em 0;padding-left:1.4em} .t{color:var(--ink2);font-size:.85em}
@media (max-width:700px){.shot{grid-template-columns:1fr} dl.about{grid-template-columns:1fr}}
</style></head><body><main>
<p class="kicker"><a href="../">Review</a> · Round 5 · the pilot</p><h1>Chapter ${n}: <i>${esc(TL.title)}</i>, the storyboard</h1>
<p>A board for each of the chapter's ${shots.length} shots, laid over its sound: the cast's voices as voiced in Round 3,
with the holds the pictures need, the theme's first phrase at the head, and the effects under the voice (${mmss(TL.duration)} in all).
Each board is a still of the <a href="ch${NN}-draft.html">draft</a> at the shot's key moment; the draft has the
motion. Play it through, or click any shot below to start there. The questions are in the
<a href="https://github.com/curtcox/The-Last-Evolution/blob/main/review/round5.md">decision sheet</a>.</p>
<div class="player"><img id="board" src="img/ch${NN}-${shots[0].id}.jpg" alt="the current board">
<p class="now" id="now"></p><audio id="au" controls preload="metadata" src="audio/ch${NN}-mix.mp3"></audio></div>
<h2>The chapter</h2><dl class="about">
${['logline', 'world', 'colour', 'motif', 'arc'].map(k => `<dt>${k}</dt><dd>${esc(board[k])}</dd>`).join('\n')}
</dl>
<p><a href="img/ch${NN}-sheet.jpg">All the boards on one sheet.</a></p>
<h2>The shots</h2>
${shots.map(s => `<div class="shot" id="shot-${s.id}" data-t="${s.t0}"><img src="img/ch${NN}-${s.id}.jpg" alt="shot ${s.id}" loading="lazy"><div>
<h3><span class="shotid">${s.id}</span> ${esc(s.title)} <span class="t">${mmss(s.t0)}–${mmss(s.t1)} · ${(s.t1 - s.t0).toFixed(1)} s</span></h3>
${s.in ? `<p><span class="k">in</span>${esc(s.in)}</p>` : ''}<p><span class="k">seen</span>${esc(s.seen)}</p><p><span class="k">event</span>${esc(s.event)}</p>
<p><span class="k">camera</span>${esc(s.camera)}</p>
<p><span class="k">reads</span></p><ol>${(s.reads || []).map(r => `<li><span class="t">${readAt(r)}:</span> ${esc(r[1])}</li>`).join('')}</ol>
${s.out ? `<p><span class="k">out</span>${esc(s.out)}</p>` : ''}</div></div>`).join('\n')}
<script>
const D = ${JSON.stringify(data)}, au = document.getElementById('au'), img = document.getElementById('board'), now = document.getElementById('now');
let shot = -1, line = -1;
function tick() {
  const t = au.currentTime, si = D.shots.findIndex(s => t >= s.t0 && t < s.t1), li = D.lines.findIndex(l => t >= l.t0 - .05 && t < l.t1 + .3);
  if (si !== shot && si >= 0) { shot = si; const s = D.shots[si]; img.src = 'img/ch${NN}-' + s.id + '.jpg'; document.querySelectorAll('.shot.on').forEach(e => e.classList.remove('on')); document.getElementById('shot-' + s.id).classList.add('on'); }
  // the line being said, a window of it around the word being said, the words lit as they're said
  const L = D.lines[li], wi = L ? Math.max(0, L.words.findLastIndex(w => w[1] <= t)) : 0, a = Math.max(0, wi - 14), win = L ? a + ':' + Math.min(L.words.length, a + 34) : '';
  if (li !== line || win !== now.dataset.win) { line = li; now.dataset.win = win; now.innerHTML = !L ? '' : '<span class="who">' + L.who + '</span>' + (a ? '… ' : '') + L.words.slice(a, a + 34).map(w => '<span class="w" data-t="' + w[1] + '">' + w[0].replace(/[<&]/g, '') + '</span>').join(' ') + (a + 34 < L.words.length ? ' …' : ''); }
  if (L) now.querySelectorAll('.w').forEach(e => e.classList.toggle('said', +e.dataset.t <= t));
  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);
document.querySelectorAll('.shot').forEach(e => e.addEventListener('click', () => { au.currentTime = +e.dataset.t + .01; au.play(); window.scrollTo({ top: 0, behavior: 'smooth' }); }));
</script>
</main></body></html>`);
console.log(`${OUT}/ch${NN}.html: ${shots.length} shots over ${mmss(TL.duration)}`);
publishReview('round5');
