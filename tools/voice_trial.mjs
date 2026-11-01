// voice_trial.mjs: the trial before the full voice pass (Round 3, 4.1 and 4.2), in the cast's saved voices.
//   npm run trial
//   out/review/round3/trial.html   two passages, each voiced in Eleven v3 and Eleven v4, with the treatments applied:
//                                    the chapter-title paragraph (p003), the narrator alone, at each model's own pace,
//                                    and slowed where that's well over the 135 words a minute recommended (4.2);
//                                    part of the council (p037–p041 and p046): the narrator, Roal and two machines
//                                  published with the site (at /review/round3/trial.html) by tools/publish_review.mjs
// Each clip is cached by voice, model, speed and words, so a rerun sends only what's new.
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { eleven } from './eleven.mjs';
import { PATHS, readYaml, respeller, words, TREAT } from './script_lib.mjs';
import { publishReview } from './publish_review.mjs';

const OUT = 'out/review/round3', AUDIO = `${OUT}/audio`, TARGET = 135;
const MODELS = { eleven_v3: 'Eleven v3', eleven_v4: 'Eleven v4' };
const cast = readYaml(PATHS.cast), brief = readYaml('script/casting.yaml'), script = readYaml(PATHS.script);
const say = respeller(readYaml(PATHS.pronounce));
mkdirSync(AUDIO, { recursive: true });
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const all = script.chapters.flatMap(c => c.lines.filter(l => l.who));
const passage = paras => all.filter(l => paras.includes(l.id.split('.')[0]));
const treatment = l => l.mode === 'thought' ? 'thought' : l.who === 'narrator' ? 'old' : brief[l.who]?.treatment;

// one line, voiced and treated: the file of the treated clip (or the raw one, for a voice with no treatment)
async function voice(l, model, speed = 1) {
  const v = cast[l.who].voice, text = say(l.text);
  if (!v) throw new Error(`${l.who} has no saved voice yet`);
  const base = createHash('sha256').update(`${v}|${model}|${speed}|${text}`).digest('hex').slice(0, 16), raw = `${base}.mp3`;
  if (!existsSync(`${AUDIO}/${raw}`)) writeFileSync(`${AUDIO}/${raw}`, await eleven(`text-to-speech/${v}?output_format=mp3_44100_128`,
    { method: 'POST', body: { text, model_id: model, ...(speed !== 1 ? { voice_settings: { speed } } : {}) }, raw: true }));
  const tr = treatment(l); if (!tr) return raw;
  const out = `${base}-${tr}.mp3`;
  if (!existsSync(`${AUDIO}/${out}`)) execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', `${AUDIO}/${raw}`, '-af', TREAT[tr].af, '-b:a', '160k', `${AUDIO}/${out}`]);
  return out;
}
const seconds = f => +execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', `${AUDIO}/${f}`], { encoding: 'utf8' });
const wpm = (l, f) => words(l.text) / seconds(f) * 60;

// 1. the chapter-title paragraph: each model at its own pace, timed with the old treatment on (it slows the voice a little)
const [p003] = passage(['p003']);
const narr = [];
for (const m of Object.keys(MODELS)) {
  const f = await voice(p003, m), rate = wpm(p003, f);
  narr.push({ m, label: `${MODELS[m]}, its own pace`, f, rate });
  // too fast once treated: ask the model for a slower read (v4 has been seen to ignore speed; the rate shows if it did)
  if (rate > TARGET * 1.04) { const speed = +Math.max(.7, TARGET / rate).toFixed(2), g = await voice(p003, m, speed);
    narr.push({ m, label: `${MODELS[m]}, slowed (speed ${speed})`, f: g, rate: wpm(p003, g) }); }
  console.log(`${m}: ${rate.toFixed(0)} wpm treated`);
}

// 2. the council: the lines in order, in each model
const council = passage(['p037', 'p038', 'p039', 'p040', 'p041', 'p046']);
const scene = {};
for (const m of Object.keys(MODELS)) { scene[m] = []; for (const l of council) scene[m].push({ ...l, f: await voice(l, m) }); }

// the page
const player = (f, label) => `<button class="play" data-src="audio/${f}">${esc(label)}</button>`;
writeFileSync(`${OUT}/trial.html`, `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Round 3: voice trial</title><link rel="stylesheet" href="../../style.css"><style>
.play{font:inherit;font-size:.85em;padding:.25em .7em;margin:.15em .3em .15em 0;border:1px solid var(--rule);background:var(--paper2);color:var(--ink);border-radius:4px;cursor:pointer}
.play.on{background:var(--accent);color:var(--paper)} .rate{font-size:.8em;color:var(--ink2)} .text{font-size:.9em;color:var(--ink2)}
.line{margin:.25em 0;padding:.2em .4em;border-left:3px solid transparent;cursor:pointer} .line.now{border-color:var(--accent);background:var(--paper2)}
.who{font-variant:small-caps;color:var(--ink2);margin-right:.5em} .scene{display:none} .scene.show{display:block}
</style></head><body><main>
<p class="kicker"><a href="../">Review</a> · Round 3 · voice trial</p><h1>Voice trial</h1>
<p>The cast's saved voices, with their treatments, before the full voice pass. Two questions from the
<a href="https://github.com/curtcox/The-Last-Evolution/blob/main/review/round3.md">decision sheet</a>: which model
(4.1), and the narrator's pace (4.2). The recommendation is Eleven v4, with the narrator near ${TARGET} words a minute.</p>
<h2>The narrator: chapter 1's opening</h2>
<p>The paragraph the chapter-title page shows. Old treatment on.</p>
${narr.map(n => `<p>${player(n.f, n.label)} <span class="rate">${n.rate.toFixed(0)} words a minute</span></p>`).join('\n')}
<details><summary>The words</summary><p class="text">${esc(p003.text)}</p></details>
<h2>The council (p037–p041, p046)</h2>
<p>The narrator, X-5638, Roal and C-R-21, line by line. ${Object.entries(MODELS).map(([m, n]) => player('', `▶ ${n}`).replace('data-src="audio/"', `data-scene="${m}"`)).join('')}</p>
${Object.keys(MODELS).map(m => `<div class="scene" id="${m}">${scene[m].map(l => `<p class="line" data-src="audio/${l.f}"><span class="who">${esc(cast[l.who].name)}</span>${esc(l.text)}</p>`).join('')}</div>`).join('\n')}
</main><script>
const audio = new Audio(); let queue = [], cur = null;
function play(src, el, q = []) { queue = q; audio.src = src; audio.play(); document.querySelectorAll('.on,.now').forEach(e => e.classList.remove('on', 'now')); (cur = el)?.classList.add(el.classList.contains('line') ? 'now' : 'on'); }
audio.onended = () => { cur?.classList.remove('on', 'now'); const next = queue.shift(); if (next) setTimeout(() => play(next.dataset.src, next, queue), next.dataset.src && cur?.parentNode === next.parentNode ? 350 : 0); };
document.addEventListener('click', e => {
  const b = e.target.closest('.play, .line'); if (!b) return;
  if (b === cur && !audio.paused) { audio.pause(); return; }
  if (b.dataset.scene) { document.querySelectorAll('.scene').forEach(s => s.classList.toggle('show', s.id === b.dataset.scene));
    const ls = [...document.getElementById(b.dataset.scene).querySelectorAll('.line')]; return play(ls[0].dataset.src, ls[0], ls.slice(1)); }
  if (b.classList.contains('line')) { const ls = [...b.parentNode.querySelectorAll('.line')]; return play(b.dataset.src, b, ls.slice(ls.indexOf(b) + 1)); }
  play(b.dataset.src, b);
});
</script></body></html>`);
console.log(`${OUT}/trial.html: ${narr.length} narrator takes, the council in ${Object.keys(MODELS).length} models`);
publishReview('round3');
