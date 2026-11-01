// sound_sampler.mjs: Round 3's sound sketches, from script/sound.yaml.   npm run sound
//   out/review/round3/sound.html   the page (http://localhost:8077/review/round3/sound.html): the chosen direction's
//                                  theme, with its title and chapter-head cuts; the three motif directions, each also
//                                  under a line of narration as it would sit at a chapter's head; one sketch of each
//                                  effect; published with the site (at /review/round3/sound.html) by
//                                  tools/publish_review.mjs
// Each sketch is cached by its prompt in out/review/round3/audio/, so a rerun makes only what's new or changed.
//   --dry   says what it would make, and makes nothing
import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { eleven } from './eleven.mjs';
import { readYaml } from './script_lib.mjs';
import { publishReview } from './publish_review.mjs';

const OUT = 'out/review/round3', AUDIO = `${OUT}/audio`;
const sound = readYaml('script/sound.yaml');
mkdirSync(AUDIO, { recursive: true });
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const file = (kind, id, s) => `${kind}-${id}-${createHash('sha256').update(`${s.prompt}|${s.seconds}`).digest('hex').slice(0, 8)}.mp3`;

const jobs = [
  ...Object.entries(sound.motif).map(([id, s]) => ({ kind: 'motif', id, s, file: file('motif', id, s),
    make: () => eleven('music', { method: 'POST', raw: true, body: { prompt: s.prompt.replace(/\s+/g, ' '), music_length_ms: s.seconds * 1000 } }) })),
  { kind: 'theme', id: sound.chosen, s: sound.theme, file: file('theme', sound.chosen, sound.theme),
    make: () => eleven('music', { method: 'POST', raw: true, body: { prompt: sound.theme.prompt.replace(/\s+/g, ' '), music_length_ms: sound.theme.seconds * 1000 } }) },
  ...Object.entries(sound.effects).map(([id, s]) => ({ kind: 'sfx', id, s, file: file('sfx', id, s),
    make: () => eleven('sound-generation', { method: 'POST', raw: true, body: { text: s.prompt.replace(/\s+/g, ' '), duration_seconds: s.seconds } }) })),
];
const todo = jobs.filter(j => !existsSync(`${AUDIO}/${j.file}`));
console.log(`${jobs.length} sketches; ${todo.length} to make`);
if (process.argv.includes('--dry')) process.exit(0);
const failed = {};
for (const j of todo) {
  try { writeFileSync(`${AUDIO}/${j.file}`, await j.make()); console.log(`made ${j.kind} ${j.id}`); }
  catch (e) { failed[j.file] = e.message.slice(0, 200); console.error(`${j.kind} ${j.id}: ${failed[j.file]}`); }
}

// each motif under the opening narration, as a chapter head would have it: the cue, then the voice entering as it fades
const narr = (() => {   // the scratch narrator's first line from Round 1, if it's there
  try { const html = readFileSync('out/review/round1/index.html', 'utf8'); return html.match(/class="line" data-src="audio\/([0-9a-f]+\.mp3)"/)[1]; } catch { return null; }
})();
for (const j of jobs.filter(j => j.kind === 'motif' && existsSync(`${AUDIO}/${j.file}`))) {
  j.under = j.file.replace('.mp3', '-head.mp3');
  if (narr && !existsSync(`${AUDIO}/${j.under}`)) {
    const len = j.s.seconds - 4;
    execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', `${AUDIO}/${j.file}`, '-i', `out/review/round1/audio/${narr}`, '-filter_complex',
      `[0]afade=t=out:st=${len}:d=4,volume=0.6[m];[1]adelay=${len * 1000}|${len * 1000}[v];[m][v]amix=inputs=2:normalize=0[a]`, '-map', '[a]', '-b:a', '160k', `${AUDIO}/${j.under}`]);
  }
}

// the cuts of the theme: its opening for the title, its first phrase for a chapter's head, each faded out
const theme = jobs.find(j => j.kind === 'theme'), cuts = {};
if (existsSync(`${AUDIO}/${theme.file}`)) for (const [k, sec] of Object.entries(sound.theme.cuts)) {
  cuts[k] = theme.file.replace('.mp3', `-${k}.mp3`);
  if (!existsSync(`${AUDIO}/${cuts[k]}`)) execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', `${AUDIO}/${theme.file}`, '-t', String(sec), '-af', `afade=t=out:st=${sec - (k === 'head' ? 3 : 5)}:d=${k === 'head' ? 3 : 5}`, '-b:a', '160k', `${AUDIO}/${cuts[k]}`]);
}

const player = (f, label) => existsSync(`${AUDIO}/${f}`) ? `<button class="play" data-src="audio/${f}">${esc(label)}</button>` : `<span class="fail">not made: ${esc(failed[f] || 'missing')}</span>`;
writeFileSync(`${OUT}/sound.html`, `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Round 3: sound</title><link rel="stylesheet" href="../../style.css"><style>
.play{font:inherit;font-size:.85em;padding:.25em .7em;margin:.15em .3em .15em 0;border:1px solid var(--rule);background:var(--paper2);color:var(--ink);border-radius:4px;cursor:pointer}
.play.on{background:var(--accent);color:var(--paper)} .item{border-top:1px solid var(--rule);padding:.5em 0} .prompt{color:var(--ink2);font-size:.85em;margin:.2em 0} .fail{color:#B4442C;font-size:.85em}
</style></head><body><main>
<p class="kicker"><a href="../">Review</a> · Round 3 · sound</p><h1>Sound</h1>
<p>Sketches, all generated by ElevenLabs from the prompts shown. The motif goes at each chapter's head and under the
title and credits; "at a chapter's head" plays it with the scratch narrator coming in as it fades. The effects are the
story's own sounds. <a href="./">Back to casting</a>.</p>
<h2>The theme</h2>
<p>Round 3 chose direction ${esc(sound.chosen)}. One long piece in its manner, with the title and the chapter heads cut from it, so the
film keeps one tune. ${player(theme.file, '▶ the credits (whole)')}${cuts.title ? player(cuts.title, '▶ the title') : ''}${cuts.head ? player(cuts.head, '▶ a chapter\'s head') : ''}</p>
<p class="prompt">${esc(sound.theme.prompt)}</p>
<h2>The motif: the three directions</h2>
${jobs.filter(j => j.kind === 'motif').map(j => `<div class="item"><b>${j.id}: ${esc(j.s.name)}</b> ${player(j.file, '▶ the cue')}${j.under && existsSync(`${AUDIO}/${j.under}`) ? player(j.under, '▶ at a chapter\'s head') : ''}<p class="prompt">${esc(j.s.prompt)}</p></div>`).join('\n')}
<h2>Effects</h2>
${jobs.filter(j => j.kind === 'sfx').map(j => `<div class="item"><b>${esc(j.id)}</b> <small>(${j.s.where})</small> ${player(j.file, '▶')}<p class="prompt">${esc(j.s.prompt)}</p></div>`).join('\n')}
</main><script>
const audio = new Audio(); let cur = null;
document.addEventListener('click', e => { const b = e.target.closest('.play'); if (!b) return;
  if (b === cur && !audio.paused) { audio.pause(); b.classList.remove('on'); return; }
  cur?.classList.remove('on'); audio.src = b.dataset.src; audio.play(); (cur = b).classList.add('on'); });
audio.onended = () => cur?.classList.remove('on');
</script></body></html>`);
console.log(`${OUT}/sound.html: ${jobs.filter(j => existsSync(`${AUDIO}/${j.file}`)).length} of ${jobs.length} sketches`);
publishReview('round3');
