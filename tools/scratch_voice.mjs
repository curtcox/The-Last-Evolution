// scratch_voice.mjs: Round 1's listening page and runtime, in stock ElevenLabs voices (script/cast.yaml's `scratch`).
// These aren't the film's voices (Phase 3 casts those); they're for hearing the words and timing them.   npm run scratch
//   out/review/round1/          the listening page (http://localhost:8077/review/round1/):
//                                 each respelling in script/pronounce.yaml, in the sentence it first appears in, read
//                                 as the story spells it and as each option would say it;
//                                 the sample chapters, line by line, played in order
//   script/reports/runtime.md   words a minute for the narrator and for dialogue, measured on the sample chapters, and
//                               the film's length estimated from them, chapter by chapter
//   --dry                       says how many characters it would send, and sends nothing
// Each clip is cached by voice, model and words in out/review/round1/audio/, so a rerun sends only what's new.
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { eleven } from './eleven.mjs';
import { PATHS, readYaml, plain, respeller, words } from './script_lib.mjs';

const SAMPLE = [0, 4];                       // chapters voiced whole: the opening narration, and the council's dialogue
const MODEL = 'eleven_multilingual_v2';
const OUT = 'out/review/round1', AUDIO = `${OUT}/audio`;
const GAP = { line: 0.35, para: 0.8, scene: 2.5, chapter: 6 };   // silences between lines, paragraphs, scenes; a chapter's title
const dry = process.argv.includes('--dry');
const cast = readYaml(PATHS.cast), script = readYaml(PATHS.script), pronounce = readYaml(PATHS.pronounce);
const say = respeller(pronounce);
mkdirSync(AUDIO, { recursive: true });
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// the clips wanted: { file, voice, text }
const clips = new Map();
function clip(who, text) {
  const voice = cast[who].scratch;
  const file = `${createHash('sha256').update(`${voice}|${MODEL}|${text}`).digest('hex').slice(0, 16)}.mp3`;
  clips.set(file, { file, voice, text });
  return file;
}

// 1. the respellings, each in the sentence it first appears in
const lines = script.chapters.flatMap(c => c.lines.filter(l => l.who).map(l => ({ ...l, ch: c.n })));
const sentenceOf = (text, word) => {
  const t = plain(text), i = t.search(new RegExp(`(?<![\\w-])${word.replace(/[-]/g, '\\-')}(?![\\w-])`));
  const s = t.slice(0, i).search(/[^.!?]*$/), e = t.slice(i).search(/[.!?](\s|$)/);
  return t.slice(s, e < 0 ? t.length : i + e + 1).trim();
};
const entries = pronounce.map(p => {
  const line = lines.find(l => new RegExp(`(?<![\\w-])${p.text.replace(/[-]/g, '\\-')}(?![\\w-])`).test(plain(l.text)));
  const sentence = sentenceOf(line.text, p.text);
  const asIs = sentence;
  const opts = Object.entries(p.options || { chosen: p.say }).map(([k, v]) => {
    const one = respeller([{ text: p.text, say: v }]);
    return { key: k, say: v, text: one(sentence), file: clip(line.who, one(sentence)), chosen: v === p.say };
  });
  return { ...p, line: line.id, who: line.who, sentence, asIs: { text: asIs, file: clip(line.who, asIs) }, opts };
});

// 2. the sample chapters, line by line, as the film would send them
const sample = script.chapters.filter(c => SAMPLE.includes(c.n)).map(c => ({ ...c,
  lines: c.lines.filter(l => l.who).map(l => { const text = say(l.text); return { ...l, speech: text, file: clip(l.who, text) }; }) }));

const todo = [...clips.values()].filter(c => !existsSync(`${AUDIO}/${c.file}`));
const chars = todo.reduce((a, c) => a + c.text.length, 0);
console.log(`${clips.size} clips; ${todo.length} to voice (${chars.toLocaleString()} characters)`);
if (dry) process.exit(0);
let done = 0;
for (let i = 0; i < todo.length; i += 3) {
  await Promise.all(todo.slice(i, i + 3).map(async c => {
    const mp3 = await eleven(`text-to-speech/${c.voice}?output_format=mp3_44100_128`, { method: 'POST', body: { text: c.text, model_id: MODEL }, raw: true });
    writeFileSync(`${AUDIO}/${c.file}`, mp3);
    if (++done % 10 === 0 || done === todo.length) console.log(`voiced ${done}/${todo.length}`);
  }));
}
const seconds = f => +execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', `${AUDIO}/${f}`], { encoding: 'utf8' });

// 3. the runtime: words a minute measured on the samples, narrator and dialogue apart, then the whole film estimated
const rate = { narrator: { w: 0, s: 0 }, dialogue: { w: 0, s: 0 } };
for (const c of sample) for (const l of c.lines) { const r = rate[l.who === 'narrator' ? 'narrator' : 'dialogue'];
  l.seconds = seconds(l.file); r.w += words(l.text); r.s += l.seconds; }
const wpm = k => rate[k].w / rate[k].s * 60;
const est = script.chapters.map(c => {
  let t = GAP.chapter, prev = null, measured = SAMPLE.includes(c.n);
  for (const l of c.lines) {
    if (l.shown === 'break') { t += GAP.scene; prev = null; continue; }
    if (!l.who) continue;
    const p = l.id.split('.')[0];
    if (prev) t += prev === p ? GAP.line : GAP.para;
    prev = p;
    t += measured ? sample.find(s => s.n === c.n).lines.find(m => m.id === l.id).seconds
      : words(l.text) / wpm(l.who === 'narrator' ? 'narrator' : 'dialogue') * 60;
  }
  return { n: c.n, title: c.title, words: c.words, seconds: t, measured };
});
const total = est.reduce((a, c) => a + c.seconds, 0);
const mmss = s => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, '0')}`;
writeFileSync(PATHS.runtime, ['# Runtime', '',
  `Written by \`tools/scratch_voice.mjs\`, from stock ElevenLabs voices (${MODEL}), not the film's cast. Chapters ${SAMPLE.join(' and ')} were`,
  `voiced whole and measured; the rest are estimated from their rates. Silences: ${GAP.line} s between lines of a paragraph,`,
  `${GAP.para} s between paragraphs, ${GAP.scene} s at a scene break, ${GAP.chapter} s for each chapter's title. No holds for pictures yet.`, '',
  `- narrator: **${wpm('narrator').toFixed(0)} words a minute** (${rate.narrator.w} words in ${mmss(rate.narrator.s)})`,
  `- dialogue: **${wpm('dialogue').toFixed(0)} words a minute** (${rate.dialogue.w} words in ${mmss(rate.dialogue.s)})`,
  `- the film: **about ${Math.round(total / 60)} minutes** (${mmss(total)}), against the plan's estimate of 52`, '',
  '| # | title | words | length | |', '|---:|---|---:|---:|---|',
  ...est.map(c => `| ${c.n} | ${c.title} | ${c.words} | ${mmss(c.seconds)} | ${c.measured ? 'measured' : 'estimated'} |`),
  `| | | **${script.words.toLocaleString()}** | **${mmss(total)}** | |`, ''].join('\n'));
console.log(`narrator ${wpm('narrator').toFixed(0)} wpm, dialogue ${wpm('dialogue').toFixed(0)} wpm; the film ≈ ${mmss(total)}`);

// 4. the page
const groups = [...new Set(entries.map(e => e.group))];
const player = (f, label) => `<button class="play" data-src="audio/${f}">${esc(label)}</button>`;
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Round 1: listen</title><link rel="stylesheet" href="/style.css"><style>
.play{font:inherit;font-size:.85em;padding:.25em .7em;margin:.15em .3em .15em 0;border:1px solid var(--rule);background:var(--paper2);color:var(--ink);border-radius:4px;cursor:pointer}
.play.on{background:var(--accent);color:var(--paper)} .rec{font-weight:700} .rec::after{content:" ✓ recommended"}
.entry{border-top:1px solid var(--rule);padding:.6em 0} .ctx{color:var(--ink2);font-size:.9em;margin:.2em 0}
.line{margin:.25em 0;padding:.2em .4em;border-left:3px solid transparent} .line.now{border-color:var(--accent);background:var(--paper2)}
.who{font-variant:small-caps;color:var(--ink2);margin-right:.5em} .say{color:var(--ink2);font-size:.85em}
</style></head><body><main>
<p class="kicker">Round 1 · scratch voices, not the cast</p><h1>Listen</h1>
<p>Stock ElevenLabs voices, for hearing the words and timing them. The cast comes in Phase 3. The decisions these belong
to are in <a href="https://github.com/curtcox/The-Last-Evolution/blob/main/review/round1.md">review/round1.md</a>.</p>
<h2>How the words are said</h2>
${groups.map(g => `<h3>${esc(g)}</h3>` + entries.filter(e => e.group === g).map(e => `<div class="entry"><b>${esc(e.text)}</b>
<p class="ctx">${esc(e.line)} · ${esc(cast[e.who].name)}: “${esc(e.sentence)}”</p>
${player(e.asIs.file, 'as spelled')}${e.opts.map(o => `<span class="${o.chosen && e.options ? 'rec' : ''}">${player(o.file, e.options ? `${o.key}: ${o.say}` : o.say)}</span>`).join('')}</div>`).join('')).join('\n')}
${sample.map(c => `<h2>Chapter ${c.n}: ${esc(c.title)}</h2><p>${player(c.lines[0].file, '▶ play the chapter')}</p>
<div class="chapter" data-n="${c.n}">${c.lines.map(l => `<p class="line" data-src="audio/${l.file}"><span class="who">${esc(cast[l.who].name)}${l.mode ? ` (${l.mode})` : ''}</span>${esc(l.text)}${l.say ? `<br><span class="say">says: ${esc(l.speech)}</span>` : ''}</p>`).join('')}</div>`).join('\n')}
</main><script>
const audio = new Audio(); let queue = [], cur = null;
function play(src, btn, q = []) { queue = q; audio.src = src; audio.play(); document.querySelectorAll('.on,.now').forEach(e => e.classList.remove('on', 'now')); (cur = btn)?.classList.add(btn.classList.contains('line') ? 'now' : 'on'); }
audio.onended = () => { if (cur) cur.classList.remove('on', 'now'); const next = queue.shift(); if (next) setTimeout(() => play(next.dataset.src, next, queue), 350); };
document.addEventListener('click', e => {
  const b = e.target.closest('.play, .line'); if (!b) return;
  if (b === cur && !audio.paused) { audio.pause(); return; }
  const ch = b.closest('h2 + p')?.nextElementSibling;
  if (ch?.classList.contains('chapter')) { const ls = [...ch.querySelectorAll('.line')]; return play(ls[0].dataset.src, ls[0], ls.slice(1)); }
  if (b.classList.contains('line')) { const ls = [...b.parentNode.querySelectorAll('.line')]; return play(b.dataset.src, b, ls.slice(ls.indexOf(b) + 1)); }
  play(b.dataset.src, b);
});
</script></body></html>`;
writeFileSync(`${OUT}/index.html`, html);
console.log(`${OUT}/index.html: ${entries.length} respellings, chapters ${SAMPLE.join(' and ')}`);
