// look_sampler.mjs: Round 4's style frames, from src/scenes/lookdev.js.   npm run look
//   out/review/round4/index.html   the page (http://localhost:8077/review/round4/): each frame as a still, the halftone
//                                  at three strengths, and the birth of F-2 moving, so the boil and the lightning show;
//                                  published with the site (at /review/round4/) by tools/publish_review.mjs
// Each frame is rendered by render.mjs (headless Chrome) at full size and kept as a JPEG in out/review/round4/img/.
import { mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { publishReview } from './publish_review.mjs';

const OUT = 'out/review/round4', IMG = `${OUT}/img`, TMP = 'out/check/look';
mkdirSync(IMG, { recursive: true });
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const render = (...a) => execFileSync('node', ['render.mjs', ...a], { stdio: ['ignore', 'pipe', 'inherit'] });

// the frames, in the order of the colour arc (PLAN.md §5)
const FRAMES = [
  ['look1', '1 · 2538', 'Chapter 1. The world in grey: a terrace above the city of the machines, with Roal and Trest at the rail. No colour at all.'],
  ['look2', '2 · The Outsiders', 'Chapter 3. Green death spreading across the grey: the Outsiders\' beams, "faintly greenish", "pale green".'],
  ['look3', '3 · The screens', 'Chapter 6. A force-screen under fire, which "flamed gradually violet, then blue, orange—red". Here the sequence runs outward from each hit, red where the fire is and violet where it hasn\'t reached.'],
  ['look4', '4 · F-1 and F-2', 'Chapter 5. "An enormous aura of white light … shot through with crackling streamers of blue lightning." F-1 above, the newborn F-2 in the light, a man shielding his face.'],
  ['look5', '5 · Pure force', 'Chapter 9. "An irregular globe of golden light, a faint halo about it of deep violet", over the 500-foot power plant, with "a tiny ruby flame" within. The first warm colour that isn\'t a weapon.'],
  ['look6', '6 · The frame', 'Chapter 11. 125,000 years on, F-2, worn by time and oxidation, under a System of beings of pure force. The only scene in full colour.'],
  ['lookTitle', 'The chapter-title page', 'Chapter 1\'s opening, set as the magazine would: the running head over a double rule, the chapter\'s title, and a drop cap.'],
];
const HALFTONE = [['look2ht0', 'none'], ['look2', 'light (the frames above)'], ['look2ht6', 'strong']];
const PAGE_ONLY = process.argv.includes('--page'); // rewrite the page from the frames already in out/review/round4/img

for (const [loop] of PAGE_ONLY ? [] : [...FRAMES, ...HALFTONE]) {
  render(`--loop=${loop}`, '--stills=1', `--out=${TMP}`);
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', `${TMP}/t1_00.png`, '-q:v', '4', `${IMG}/${loop}.jpg`]);
  console.log(`rendered ${loop}`);
}
// F-2's birth, moving: two seconds at 24 fps, 1280 wide
if (!PAGE_ONLY) render('--loop=look4', '--clip', `--out=${TMP}/look4.mp4`);
if (!PAGE_ONLY) execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', `${TMP}/look4.mp4`, '-vf', 'scale=1280:-2', '-c:v', 'libx264', '-crf', '24', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-an', `${IMG}/look4.mp4`]);
rmSync(TMP, { recursive: true, force: true });

const fig = (f, cap, alt = cap.replace(/<[^>]+>/g, '')) => `<figure><a href="img/${f}.jpg"><img src="img/${f}.jpg" alt="${alt}" loading="lazy"></a><figcaption>${cap}</figcaption></figure>`;
writeFileSync(`${OUT}/index.html`, `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Round 4: the look</title><link rel="stylesheet" href="../../style.css"><style>
main{max-width:1100px} figure{margin:1.4em 0} figure img,video{width:100%;height:auto;display:block;border:1px solid var(--rule)}
figcaption{color:var(--ink2);font-size:.9em;margin-top:.4em} .ht{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:12px}
.ht figure{margin:.4em 0}
</style></head><body><main>
<p class="kicker"><a href="../">Review</a> · Round 4 · the look</p><h1>The look</h1>
<p>Style frames for the plan's one rule: the world in ink wash on aged pulp paper, and colour only for energy, in the
colours the text names. They test the medium, not the designs: the ships, machines and people are placeholders, drawn before
their <a href="models.html">model sheets</a>. Each still links to the full-size frame. The questions are in
the <a href="https://github.com/curtcox/The-Last-Evolution/blob/main/review/round4.md">decision sheet</a>.</p>
<h2>The colour arc</h2>
${FRAMES.slice(0, 6).map(([f, t, c]) => fig(f, `<b>${esc(t)}.</b> ${esc(c)}`)).join('\n')}
<h2>Moving</h2>
<figure><video src="img/look4.mp4" autoplay loop muted playsinline></video><figcaption>Frame 4 over its two seconds: the ink
boils at 12 drawings a second, as hand-drawn animation does, and the lightning re-forks with every drawing.</figcaption></figure>
<h2>The halftone</h2>
<p>The magazine printed its washes through a coarse screen of dots. How strongly should the film show it?</p>
<div class="ht">${HALFTONE.map(([f, t]) => fig(f, esc(t), `The Outsiders frame with ${t === 'none' ? 'no halftone' : `a ${t.replace(' (the frames above)', '')} halftone`}`)).join('')}</div>
<h2>The chapter-title page</h2>
${fig(FRAMES[6][0], `<b>${esc(FRAMES[6][1])}.</b> ${esc(FRAMES[6][2])}`)}
</main></body></html>`);
console.log(`${OUT}/index.html: ${FRAMES.length} frames, ${HALFTONE.length} halftones, 1 clip`);
publishReview('round4');
