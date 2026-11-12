// model_sheets.mjs: Round 4's model sheets, from src/scenes/models.js (the designs are in src/designs.js).   npm run models
//   out/review/round4/models.html   the page (http://localhost:8077/review/round4/models.html): each sheet as a still,
//                                   linked to the full-size frame; published with the site (at /review/round4/models.html)
//                                   by tools/publish_review.mjs, beside the style frames
// Each sheet is rendered by render.mjs (headless Chrome) at full size and kept as a JPEG in out/review/round4/img/.
import { mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { publishReview } from './publish_review.mjs';

const OUT = 'out/review/round4', IMG = `${OUT}/img`, TMP = 'out/check/models';
mkdirSync(IMG, { recursive: true });
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const SHEETS = [
  ['model1', 'The people of 2538', 'Roal, Trest, Kahsh and a citizen, front view, six feet tall, with the heads of Roal and Trest larger. Tunics, belts, boots and the standing collar of the pulps\' futures; Roal in a long robe and a white beard; Kahsh in a ruler\'s mantle and a tall collar, with a disc of office.'],
  ['model2', 'The machines of 2538', 'One family, from p048: every machine a dome-case on a lifting disc, with tentacles hung from the framework between. X-5638, X-6349, X-6621 and C-R-21, the four who speak in the council, each told by its build and stencilled with its designation; F-1, the shining cylinder, vast beside them. A man for scale.'],
  ['model3', 'F-2, and C-R-U-1', 'F-2 from the side, the front and above: a small torpedo of bluish metal with three thin tentacles. Newborn in its aura; old and oxidised, as the narrator is. C-R-U-1, the family form with neither disc nor tentacles, its name in dully glowing gold.'],
  ['model4', 'The Outsiders', 'Front and side, in the suit: short, squat, four-limbed, armoured in horny brown plates, three eyes on turrets around the crown, a third of a turn apart. The crown from above, and one beside a man.'],
  ['model5', 'Ships, investigators and motes', 'A torpedo of the void, with its projector turrets and drive bells, and from ahead. An investigator, three inches across. The motes, ten thousand tiny machine-ships: the family form on its side.'],
  ['model6', 'The places', 'The power plant at five hundred feet, with a man at its foot; the black dome cut away, with Roal and Trest under it and the violet beam that holds it; the Denver laboratory\'s hall of screens.'],
  ['model7', 'Roal and Trest acting, and the pilot\'s props', 'Made for the pilot: Roal talking with Trest, who listens, and Trest side-on in his mid-thigh tunic; Roal in profile as chapter 5 needs him, lying on his couch, sitting up, standing, and with his arm thrown up across his face as in Morey\'s page; his eyes, very close, for the match cut to F-1\'s lens; the guinea pig in its cage.'],
];
for (const [loop] of SHEETS) {
  execFileSync('node', ['render.mjs', `--loop=${loop}`, '--stills=1', `--out=${TMP}`], { stdio: ['ignore', 'pipe', 'inherit'] });
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', `${TMP}/t1_00.png`, '-q:v', '4', `${IMG}/${loop}.jpg`]);
  console.log(`rendered ${loop}`);
}
rmSync(TMP, { recursive: true, force: true });

writeFileSync(`${OUT}/models.html`, `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Round 4: model sheets</title><link rel="stylesheet" href="../../style.css"><style>
main{max-width:1100px} figure{margin:1.4em 0} figure img{width:100%;height:auto;display:block;border:1px solid var(--rule)}
figcaption{color:var(--ink2);font-size:.9em;margin-top:.4em}
</style></head><body><main>
<p class="kicker"><a href="../">Review</a> · Round 4 · model sheets</p><h1>Model sheets</h1>
<p>Every design in the plan, each built from the text, whose words are on the sheet beside it, and drawn in the medium of
<a href="./">the style frames</a>. Each still links to the full-size sheet. The round's questions are in section 5 of its
<a href="https://github.com/curtcox/The-Last-Evolution/blob/main/review/round4.md">decision sheet</a>.</p>
${SHEETS.map(([f, t, c]) => `<figure><a href="img/${f}.jpg"><img src="img/${f}.jpg" alt="${esc(t)}" loading="lazy"></a><figcaption><b>${esc(t)}.</b> ${esc(c)}</figcaption></figure>`).join('\n')}
</main></body></html>`);
console.log(`${OUT}/models.html: ${SHEETS.length} sheets`);
publishReview('round4');
