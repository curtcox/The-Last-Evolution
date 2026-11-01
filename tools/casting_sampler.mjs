// casting_sampler.mjs: Round 3's casting sampler.   npm run casting
// For each role in script/casting.yaml, ElevenLabs Voice Design makes three new voices (A, B, C) from the role's
// description, each reading the role's own lines; each is heard raw and, where the role has one, with its treatment.
//   out/review/round3/              the listening page (http://localhost:8077/review/round3/), with a pick for each role
//                                   and the picks gathered into one line to paste back; published with the site (at
//                                   /review/round3/) by tools/publish_review.mjs
//   script/casting_candidates.json  each candidate's generated voice id, so a pick can be saved as a voice (they're
//                                   previews until then), what it read, and what speech-to-text heard it say: a
//                                   candidate that drops or garbles words is flagged on the page
//   --role=roal                     redo one role (new voices); otherwise only roles whose brief changed are redone
//   --dry                           says how many characters it would send, and sends nothing
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import YAML from 'yaml';
import { eleven } from './eleven.mjs';
import { PATHS, readYaml, respeller } from './script_lib.mjs';
import { publishReview } from './publish_review.mjs';

const OUT = 'out/review/round3', AUDIO = `${OUT}/audio`, CANDS = 'script/casting_candidates.json';
const MODEL = 'eleven_ttv_v3', KEYS = ['A', 'B', 'C'];
const args = Object.fromEntries(process.argv.slice(2).map(a => { const [k, v] = a.replace(/^--/, '').split('='); return [k, v ?? true]; }));
const brief = readYaml('script/casting.yaml'), cast = readYaml(PATHS.cast), script = readYaml(PATHS.script);
const say = respeller(readYaml(PATHS.pronounce));
const cands = existsSync(CANDS) ? JSON.parse(readFileSync(CANDS, 'utf8')) : {};
mkdirSync(AUDIO, { recursive: true });
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// the processing each treatment applies (ffmpeg filters)
const TREAT = {
  old: { label: 'old', af: 'asetrate=44100*0.97,aresample=44100,atempo=0.97,vibrato=f=4.5:d=0.04,highpass=f=120,lowpass=f=6500,aecho=0.8:0.6:35:0.12' },
  thought: { label: 'as thought', af: 'chorus=0.6:0.9:45|60:0.35|0.3:0.25|0.4:1.5|1.2,aecho=0.8:0.7:110|230:0.3|0.18,highpass=f=90' },
  machine: { label: 'machine', af: 'flanger=delay=1.5:depth=1.5:regen=20:width=60:speed=0.3,highpass=f=150,lowpass=f=7500,aecho=0.8:0.4:12:0.15' },
};

// what a role reads: its lines from the listed paragraphs, as the voice would be sent them, cut at a sentence to fit
const lines = script.chapters.flatMap(c => c.lines.filter(l => l.who));
function textOf(role, b) {
  const pick = (paras, who) => lines.filter(l => paras.includes(l.id.split('.')[0]) && l.who === who).map(l => say(l.text));
  let parts = role === 'narrator' ? [...pick(b.from, 'narrator'), ...pick(b.also || [], 'f2')] : pick(b.from, role);
  let t = parts.join(' ');
  if (t.length > 1000) t = t.slice(0, 1000).replace(/[^.!?]*$/, '');
  if (t.length < 100) { const one = t; while (t.length < 100) t += ` … ${one}`; }
  return t;
}
const hash = s => createHash('sha256').update(s).digest('hex').slice(0, 12);

const todo = Object.entries(brief).filter(([role, b]) => {
  const key = hash(`${MODEL}|${b.about}|${textOf(role, b)}`);
  return args.role ? args.role === role : !(cands[role]?.key === key && KEYS.every(k => existsSync(`${AUDIO}/${role}-${k}.mp3`)));
});
console.log(`${Object.keys(brief).length} roles; ${todo.length} to design (${todo.reduce((a, [r, b]) => a + textOf(r, b).length, 0).toLocaleString()} characters of lines)`);
if (args.dry) process.exit(0);

for (const [role, b] of todo) {
  const text = textOf(role, b);
  const r = await eleven('text-to-voice/design', { method: 'POST', body: { voice_description: b.about.replace(/\s+/g, ' '), model_id: MODEL, text } });
  cands[role] = { key: hash(`${MODEL}|${b.about}|${text}`), model: MODEL, text, made: new Date().toISOString(), candidates: {} };
  r.previews.slice(0, 3).forEach((p, i) => {
    writeFileSync(`${AUDIO}/${role}-${KEYS[i]}.mp3`, Buffer.from(p.audio_base_64, 'base64'));
    cands[role].candidates[KEYS[i]] = { generated_voice_id: p.generated_voice_id, seconds: +p.duration_secs.toFixed(1) };
  });
  writeFileSync(CANDS, JSON.stringify(cands, null, 1) + '\n');   // after each role, so a failure keeps what's done
  console.log(`designed ${role}: ${Object.values(cands[role].candidates).map(c => c.seconds + ' s').join(', ')}`);
}

// what each candidate actually said: ElevenLabs speech-to-text, compared word by word with what it was given
// Spelling that differs only in form isn't a miss: hyphens, digits for number words ("F-2" for "F two"), Gutenberg's
// "reenforcements", and "Roal" heard as the one-syllable "Roll" that Round 1 chose.
const DIGITS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
const SAME = { reenforcements: 'reinforcements', roll: 'roal', role: 'roal', rol: 'roal', mentatype: 'menta type', forcescreen: 'force screen' };
const norm = s => s.toLowerCase().replace(/([a-z])-?(\d)/g, '$1 $2').replace(/\d/g, d => ` ${DIGITS[d]} `)
  .replace(/[^a-z' ]+/g, ' ').split(/\s+/).filter(Boolean).flatMap(w => (SAME[w] || w).split(' '));
function misses(want, got) {   // the words of `want` that a word-level edit alignment doesn't find in `got`
  const a = norm(want), b = norm(got), d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++)
    d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  const out = []; let i = a.length, j = b.length;
  while (i > 0) { if (j > 0 && d[i][j] === d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)) { if (a[i - 1] !== b[j - 1]) out.unshift(a[i - 1]); i--; j--; }
    else if (d[i][j] === d[i - 1][j] + 1) { out.unshift(a[i - 1]); i--; } else j--; }
  return { words: a.length, missed: out };
}
for (const [role] of Object.entries(brief)) for (const k of KEYS) {
  const c = cands[role]?.candidates[k];
  if (!c) continue;
  if (!c.heard) {
    const fd = new FormData();
    fd.append('file', new Blob([readFileSync(`${AUDIO}/${role}-${k}.mp3`)], { type: 'audio/mpeg' }), `${role}-${k}.mp3`);
    fd.append('model_id', 'scribe_v2');
    c.heard = (await eleven('speech-to-text', { method: 'POST', body: fd })).text;
  }
  Object.assign(c, misses(cands[role].text, c.heard));
  writeFileSync(CANDS, JSON.stringify(cands, null, 1) + '\n');
}

// the treatments, made from each raw candidate
for (const [role, b] of Object.entries(brief)) if (b.treatment) for (const k of KEYS) {
  const src = `${AUDIO}/${role}-${k}.mp3`, dst = `${AUDIO}/${role}-${k}-${b.treatment}.mp3`;
  if (existsSync(src) && (!existsSync(dst) || todo.some(([r]) => r === role)))
    execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', src, '-af', TREAT[b.treatment].af, '-b:a', '160k', dst]);
}

// the page
const player = (f, label) => `<button class="play" data-src="audio/${f}">${esc(label)}</button>`;
const roles = Object.entries(brief).map(([role, b]) => `<section class="role" data-role="${role}" data-key="${cands[role]?.key || ''}">
<h2>${esc(cast[role].name)}</h2><p class="about">${esc(b.about)}</p>
<details><summary>What they read</summary><p class="text">${esc(cands[role]?.text || '')}</p></details>
<div class="cands">${KEYS.map(k => { const c = cands[role]?.candidates[k] || {}, ok = c.words ? Math.round(100 * (1 - c.missed.length / c.words)) : null;
  return `<div class="cand"><label><input type="radio" name="${role}" value="${k}"> <b>${k}</b></label>
${player(`${role}-${k}.mp3`, b.treatment === 'old' ? 'young (raw)' : 'raw')}${b.treatment ? player(`${role}-${k}-${b.treatment}.mp3`, TREAT[b.treatment].label) : ''}
${ok == null ? '' : `<span class="heard${ok < 97 ? ' bad' : ''}" title="speech-to-text heard: ${esc(c.heard)}">${ok}% of words${c.missed.length ? `; missed: ${esc(c.missed.slice(0, 6).join(', '))}${c.missed.length > 6 ? '…' : ''}` : ''}</span>`}</div>`; }).join('')}
<label class="none"><input type="radio" name="${role}" value="none"> none of these</label></div></section>`).join('\n');
writeFileSync(`${OUT}/index.html`, `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Round 3: casting</title><link rel="stylesheet" href="../../style.css"><style>
.play{font:inherit;font-size:.85em;padding:.25em .7em;margin:.15em .3em .15em 0;border:1px solid var(--rule);background:var(--paper2);color:var(--ink);border-radius:4px;cursor:pointer}
.play.on{background:var(--accent);color:var(--paper)} .role{border-top:1px solid var(--rule);padding:.4em 0 .8em}
.about{color:var(--ink2);font-size:.9em} .text{font-size:.85em;color:var(--ink2)} .cands{display:flex;flex-wrap:wrap;gap:.4em 1.6em;align-items:center}
.cand label{margin-right:.3em} .heard{font-size:.75em;color:var(--ink2);display:block} .heard.bad{color:#B4442C} .none{font-size:.85em;color:var(--ink2)}
#picks{position:sticky;bottom:0;background:var(--paper2);border-top:3px double var(--rule);padding:.3em 0;margin-top:1em;display:flex;gap:.6em;align-items:center;font-size:.85em}
#picks textarea{flex:1;font:inherit;font-size:.85em;background:var(--paper);color:var(--ink);border:1px solid var(--rule)}
</style></head><body><main>
<p class="kicker"><a href="../">Review</a> · Round 3 · casting</p><h1>Casting</h1>
<p>Three new voices for each role, designed by ElevenLabs from the description, reading that role's own lines. The
narrator is heard young (raw: F-2 in the scenes) and old (the narrator's treatment). The machines and the beings of
force are heard raw and treated. Pick one per role (or "none of these" and say why), then paste the line at the
bottom into chat. The motif and effects are on <a href="sound.html">the sound page</a>.</p>
${roles}
<div id="picks"><b>Your picks</b> <textarea id="answer" rows="1" readonly placeholder="pick one voice per role"></textarea></div>
</main><script>
const audio = new Audio(); let cur = null;
document.addEventListener('click', e => { const b = e.target.closest('.play'); if (!b) return;
  if (b === cur && !audio.paused) { audio.pause(); b.classList.remove('on'); return; }
  cur?.classList.remove('on'); audio.src = b.dataset.src; audio.play(); (cur = b).classList.add('on'); });
audio.onended = () => cur?.classList.remove('on');
// picks are kept in this browser, each with its role's candidate set, so a role that's been redesigned starts unpicked
// (picks saved before sets were recorded keep their voices, but not "none", which asked for the redesign)
const store = (() => { try { return localStorage; } catch { return null; } })();
const roleEls = [...document.querySelectorAll('.role')];
function update() { const picks = roleEls.map(r => { const v = r.querySelector('input:checked')?.value; return v ? [r.dataset.role, v, r.dataset.key] : null; }).filter(Boolean);
  document.getElementById('answer').value = picks.length ? 'Round 3 picks: ' + picks.map(p => p[0] + ' ' + p[1]).join(', ') : ''; try { store?.setItem('round3', JSON.stringify(picks)); } catch {} }
try { for (const p of JSON.parse(store?.getItem('round3') || '[]')) { const [r, v, key] = Array.isArray(p) ? p : [...p.split(' '), null];
  const el = roleEls.find(e => e.dataset.role === r); if (!el || (key ? key !== el.dataset.key : v === 'none')) continue;
  const i = el.querySelector('input[value="' + v + '"]'); if (i) i.checked = true; } } catch {}
document.addEventListener('change', update); update();
</script></body></html>`);
console.log(`${OUT}/index.html: ${Object.keys(brief).length} roles × 3 candidates`);
publishReview('round3');
