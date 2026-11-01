// voice_pass.mjs: the full voice pass (PLAN.md §9, Phase 3): every spoken line of script/script.yaml, in the cast's
// saved voices (script/cast.yaml), in Eleven v4 (Round 3, 4.1).   npm run voice
//   assets/voice/                 the masters, one per line (<line id>-t<take>-<hash>.mp3), raw, as ElevenLabs made them.
//                                 Committed, since voicing them again costs credits and never comes out the same
//   script/reports/voice.json     each line's take: what speech-to-text heard it say, the words it missed, its length
//   script/reports/voice.md       the runtime from the cast's own voices, chapter by chapter, and the lines still flagged
//   out/review/round3/voice.html  the listening page, chapter by chapter with the treatments applied, published with the
//                                 site (at /review/round3/voice.html) by tools/publish_review.mjs
// Each take is checked by speech-to-text against the words it was sent. A take that drops or garbles words is voiced
// again, up to TAKES in all, and the take with the fewest misses is kept; any still missing words are flagged on the page.
//   --retake=p003.1,p044.1        voice those lines again (a new take each, kept only if it's no worse)
//   --dry                         says how many characters it would send, and sends nothing
import { existsSync, mkdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { eleven } from './eleven.mjs';
import { PATHS, readYaml, respeller, plain, words, TREAT, misses } from './script_lib.mjs';
import { publishReview } from './publish_review.mjs';

const MODEL = 'eleven_v4', TAKES = 3, MASTERS = 'assets/voice', REPORT = 'script/reports/voice.json';
const OUT = 'out/review/round3', AUDIO = `${OUT}/audio`;
const GAP = { line: 0.35, para: 0.8, scene: 2.5, chapter: 6 };   // as tools/scratch_voice.mjs times them
const args = Object.fromEntries(process.argv.slice(2).map(a => { const [k, v] = a.replace(/^--/, '').split('='); return [k, v ?? true]; }));
const cast = readYaml(PATHS.cast), brief = readYaml('script/casting.yaml'), script = readYaml(PATHS.script);
const say = respeller(readYaml(PATHS.pronounce));
mkdirSync(MASTERS, { recursive: true }); mkdirSync(AUDIO, { recursive: true });
const rep = existsSync(REPORT) ? JSON.parse(readFileSync(REPORT, 'utf8')) : {};
const saveRep = () => writeFileSync(REPORT, JSON.stringify(rep, null, 1) + '\n');
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const lines = script.chapters.flatMap(c => c.lines.filter(l => l.who).map(l => ({ ...l, ch: c.n, speech: say(l.text) })));
const treatment = l => l.mode === 'thought' ? 'thought' : l.who === 'narrator' ? 'old' : brief[l.who]?.treatment;
const keyOf = l => createHash('sha256').update(`${cast[l.who].voice}|${MODEL}|${l.speech}`).digest('hex').slice(0, 10);
// What a take missed: speech-to-text writes what it hears, which may be the story's spelling ("Deimos", "kilads", "2100")
// or the respelling it was sent ("Dye-mos", "kill-ads", "twenty-one hundred"), so the take is checked against both and
// the closer is kept. `real` is what's left of it once a number heard as digits is allowed for.
const check = (l, heard) => { const a = misses(l.speech, heard), b = misses(plain(l.text), heard); return a.missed.length <= b.missed.length ? a : b; };
const NUM = /^(zero|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety|hundred|thousand|and|oh)$/;
const real = m => m.filter(w => !NUM.test(w));
const seconds = f => +execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f], { encoding: 'utf8' });

for (const l of lines) if (!cast[l.who].voice) throw new Error(`${l.who} has no saved voice (npm run save-cast)`);
for (const l of lines) if (rep[l.id]?.heard) { const m = check(l, rep[l.id].heard); Object.assign(rep[l.id], { words: m.words, missed: m.missed, real: real(m.missed).length }); }   // the check, as it stands now
saveRep();
const retake = new Set(String(args.retake || '').split(',').filter(Boolean));
const todo = lines.filter(l => rep[l.id]?.key !== keyOf(l) || !existsSync(`${MASTERS}/${rep[l.id].file}`) || retake.has(l.id));
console.log(`${lines.length} lines; ${todo.length} to voice (${todo.reduce((a, l) => a + l.speech.length, 0).toLocaleString()} characters, before any retakes)`);
if (args.dry) process.exit(0);

async function take(l, n) {
  const file = `${l.id}-t${n}-${keyOf(l)}.mp3`;
  writeFileSync(`${MASTERS}/${file}`, await eleven(`text-to-speech/${cast[l.who].voice}?output_format=mp3_44100_128`, { method: 'POST', raw: true, body: { text: l.speech, model_id: MODEL } }));
  const fd = new FormData();
  fd.append('file', new Blob([readFileSync(`${MASTERS}/${file}`)], { type: 'audio/mpeg' }), file); fd.append('model_id', 'scribe_v2');
  const heard = (await eleven('speech-to-text', { method: 'POST', body: fd })).text, m = check(l, heard);
  return { key: keyOf(l), take: n, file, heard, words: m.words, missed: m.missed, real: real(m.missed).length, seconds: +seconds(`${MASTERS}/${file}`).toFixed(2) };
}
async function voice(l) {
  const old = rep[l.id]?.key === keyOf(l) && existsSync(`${MASTERS}/${rep[l.id].file}`) ? rep[l.id] : null;
  let best = old, n = old ? old.take : 0;
  for (let i = 0; i < (old ? 1 : TAKES); i++) {
    const t = await take(l, ++n);
    if (!best || t.real < best.real || (t.real === best.real && t.missed.length < best.missed.length)) { if (best && best !== old) rmSync(`${MASTERS}/${best.file}`, { force: true }); best = t; }
    else rmSync(`${MASTERS}/${t.file}`, { force: true });
    if (!best.real && !old) break;
  }
  if (old && best !== old) rmSync(`${MASTERS}/${old.file}`, { force: true });
  rep[l.id] = best; saveRep();
  return best;
}
let done = 0;
for (let i = 0; i < todo.length; i += 3) {
  await Promise.all(todo.slice(i, i + 3).map(async l => { const b = await voice(l); if (++done % 10 === 0 || done === todo.length || b.real) console.log(`${done}/${todo.length} ${l.id} t${b.take}${b.real ? ` still missing: ${real(b.missed).join(', ')}` : ''}`); }));
}

// the treated copies, for the page and the edit (free to make again from the masters)
const treated = l => { const r = rep[l.id], tr = treatment(l), out = `v-${r.file.replace('.mp3', '')}${tr ? '-' + tr : ''}.mp3`;
  if (!existsSync(`${AUDIO}/${out}`)) execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', `${MASTERS}/${r.file}`, ...(tr ? ['-af', TREAT[tr].af] : []), '-b:a', '160k', `${AUDIO}/${out}`]);
  return out; };
for (const l of lines) { l.file = treated(l); l.secs = seconds(`${AUDIO}/${l.file}`); }

// the runtime, from the cast's own voices (treatments on)
const rate = { narrator: { w: 0, s: 0 }, dialogue: { w: 0, s: 0 } };
for (const l of lines) { const r = rate[l.who === 'narrator' ? 'narrator' : 'dialogue']; r.w += words(l.text); r.s += l.secs; }
const wpm = k => rate[k].w / rate[k].s * 60, mmss = s => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, '0')}`;
const chapters = script.chapters.map(c => {
  let t = GAP.chapter, prev = null;
  for (const cl of c.lines) {
    if (cl.shown === 'break') { t += GAP.scene; prev = null; continue; }
    if (!cl.who) continue;
    const p = cl.id.split('.')[0]; if (prev) t += prev === p ? GAP.line : GAP.para; prev = p;
    t += lines.find(l => l.id === cl.id).secs;
  }
  return { n: c.n, title: c.title, words: c.words, seconds: t };
});
const total = chapters.reduce((a, c) => a + c.seconds, 0), flagged = lines.filter(l => rep[l.id].real);
writeFileSync('script/reports/voice.md', ['# The voice pass', '',
  `Written by \`tools/voice_pass.mjs\`: every line in the cast's saved voices (${MODEL}), with the treatments on, timed from the`,
  `audio. Silences: ${GAP.line} s between lines of a paragraph, ${GAP.para} s between paragraphs, ${GAP.scene} s at a scene break, ${GAP.chapter} s for each`,
  `chapter's title. No holds for pictures yet.`, '',
  `- narrator: **${wpm('narrator').toFixed(0)} words a minute** (${rate.narrator.w} words in ${mmss(rate.narrator.s)}); Round 3 aimed for 135`,
  `- dialogue: **${wpm('dialogue').toFixed(0)} words a minute** (${rate.dialogue.w} words in ${mmss(rate.dialogue.s)})`,
  `- the film: **about ${Math.round(total / 60)} minutes** (${mmss(total)})`,
  `- takes: ${lines.filter(l => rep[l.id].take === 1).length} lines right first time, ${lines.filter(l => rep[l.id].take > 1).length} voiced again; ${flagged.length} still flagged`, '',
  '| # | title | words | length |', '|---:|---|---:|---:|',
  ...chapters.map(c => `| ${c.n} | ${c.title} | ${c.words} | ${mmss(c.seconds)} |`),
  `| | | **${script.words.toLocaleString()}** | **${mmss(total)}** |`, '',
  '## Still flagged', '',
  ...(flagged.length ? flagged.map(l => `- **${l.id}** (${l.who}): missed ${real(rep[l.id].missed).join(', ')}. Heard: "${rep[l.id].heard}"`) : ['None: speech-to-text found every word of every line.']), ''].join('\n'));
console.log(`narrator ${wpm('narrator').toFixed(0)} wpm, dialogue ${wpm('dialogue').toFixed(0)} wpm; the film ≈ ${mmss(total)}; ${flagged.length} flagged`);

// the page
writeFileSync(`${OUT}/voice.html`, `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Round 3: the voice pass</title><link rel="stylesheet" href="../../style.css"><style>
.play{font:inherit;font-size:.85em;padding:.25em .7em;margin:.15em .3em .15em 0;border:1px solid var(--rule);background:var(--paper2);color:var(--ink);border-radius:4px;cursor:pointer}
.play.on{background:var(--accent);color:var(--paper)} .line{margin:.25em 0;padding:.2em .4em;border-left:3px solid transparent;cursor:pointer}
.line.now{border-color:var(--accent);background:var(--paper2)} .who{font-variant:small-caps;color:var(--ink2);margin-right:.5em}
.flag{color:#B4442C;font-size:.8em;display:block} .len{color:var(--ink2);font-size:.85em}
</style></head><body><main>
<p class="kicker"><a href="../">Review</a> · Round 3 · the voice pass</p><h1>The voice pass</h1>
<p>The whole story in the cast's voices: Eleven v4, with the narrator's age, the machines' colour and thought-speech
applied. About ${Math.round(total / 60)} minutes; the narrator at ${wpm('narrator').toFixed(0)} words a minute. Each line was checked by speech-to-text and
voiced again if it dropped words; ${flagged.length ? `${flagged.length} still ${flagged.length === 1 ? 'is' : 'are'} flagged in red` : 'none is still flagged'}. Play a chapter, or click any
line to start there. Say which lines to redo, and how.</p>
${script.chapters.map(c => { const ls = lines.filter(l => l.ch === c.n), ch = chapters.find(x => x.n === c.n);
  return `<h2>Chapter ${c.n}: ${esc(c.title)}</h2><p><button class="play" data-ch="${c.n}">▶ play the chapter</button> <span class="len">${mmss(ch.seconds)}</span></p>
<div class="chapter" id="ch${c.n}">${ls.map(l => `<p class="line" data-src="audio/${l.file}" data-gap="${l.id.split('.')[1] === '1' ? GAP.para : GAP.line}"><span class="who">${esc(cast[l.who].name)}${l.mode === 'thought' ? ' (thought)' : ''}</span>${esc(l.text)}${rep[l.id].real ? `<span class="flag">speech-to-text missed: ${esc(real(rep[l.id].missed).join(', '))}</span>` : ''}</p>`).join('')}</div>`; }).join('\n')}
</main><script>
const audio = new Audio(); let queue = [], cur = null;
function play(el, q = []) { queue = q; audio.src = el.dataset.src; audio.play(); document.querySelectorAll('.on,.now').forEach(e => e.classList.remove('on', 'now')); (cur = el).classList.add('now'); el.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }
audio.onended = () => { cur?.classList.remove('now'); const next = queue.shift(); if (next) setTimeout(() => play(next, queue), 1000 * +next.dataset.gap); };
document.addEventListener('click', e => {
  const b = e.target.closest('.play, .line'); if (!b) return;
  if (!audio.paused && (b === cur || b.classList.contains('play'))) { audio.pause(); queue = []; return; }
  const ls = b.dataset.ch != null ? [...document.querySelectorAll('#ch' + b.dataset.ch + ' .line')] : [...b.parentNode.querySelectorAll('.line')];
  const from = b.dataset.ch != null ? 0 : ls.indexOf(b); play(ls[from], ls.slice(from + 1));
});
</script></body></html>`);
console.log(`${OUT}/voice.html: ${script.chapters.length} chapters, ${lines.length} lines`);
publishReview('round3');
