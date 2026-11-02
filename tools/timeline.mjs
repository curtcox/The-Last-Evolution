// timeline.mjs: a chapter laid out in time, from its voice.   npm run timeline -- 5
//   script/align/chNN.json    every line's words and when the voice says them (ElevenLabs forced alignment of the
//                             treated take, cached by the take's key: only a line voiced again is aligned again)
//   src/gen/chNN.js           CHAPTER for the studio: its length, each line's place and words in chapter time, every
//                             cue in the storyboard resolved, and cue() for the scene code (studio.html?chapter=N)
//   out/chNN/timeline.json    the same layout for the review tools, with each shot's board time
//   out/chNN/mix.mp3          the chapter's sound: the voice laid out, the theme and effects of script/sfx.yaml under
//                             it, ducked by the voice, at -14 LUFS and true peak -2 dBFS, under -1 once encoded (mix.wav beside it)
// The layout: the voice starts at the storyboard's voice_at, with the voice pass's silences between lines (0.35 s) and
// paragraphs (0.8 s) and 2.5 s at a scene break, plus the storyboard's holds, which add silence after a line or, before
// a word inside one, cut the line in the pause there. The chapter ends `outro` seconds after its last word.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { execFileSync, spawnSync } from 'node:child_process';
import { eleven } from './eleven.mjs';
import { PATHS, readYaml, respeller, TREAT } from './script_lib.mjs';

const GAP = { line: 0.35, para: 0.8, scene: 2.5 };
const n = +process.argv[2], NN = String(n).padStart(2, '0');
if (!(n >= 0)) { console.error('which chapter? e.g. npm run timeline -- 5'); process.exit(1); }
const script = readYaml(PATHS.script), brief = readYaml('script/casting.yaml'), say = respeller(readYaml(PATHS.pronounce));
const rep = JSON.parse(readFileSync('script/reports/voice.json', 'utf8'));
const board = readYaml(`script/boards/ch${NN}.yaml`), sfx = readYaml('script/sfx.yaml');
const chapter = script.chapters.find(c => c.n === n);
const AUDIO = 'out/review/round3/audio', OUT = `out/ch${NN}`, ALIGN = `script/align/ch${NN}.json`;
mkdirSync(OUT, { recursive: true }); mkdirSync('script/align', { recursive: true }); mkdirSync('src/gen', { recursive: true });

// the treated take, as tools/voice_pass.mjs makes it (made again from the master if it isn't here)
const treatment = l => l.mode === 'thought' ? 'thought' : l.who === 'narrator' ? 'old' : brief[l.who]?.treatment;
const seconds = f => +execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f], { encoding: 'utf8' });
const lines = chapter.lines.filter(l => l.who || l.shown === 'break').map(l => {
  if (!l.who) return { break: true };
  const r = rep[l.id], tr = treatment(l), file = `${AUDIO}/v-${r.file.replace('.mp3', '')}${tr ? '-' + tr : ''}.mp3`;
  if (!existsSync(file)) { mkdirSync(AUDIO, { recursive: true }); execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', `assets/voice/${r.file}`, ...(tr ? ['-af', TREAT[tr].af] : []), '-b:a', '160k', file]); }
  return { id: l.id, who: l.who, mode: l.mode, text: l.text, key: r.key, file, secs: seconds(file) };
});

// words: forced alignment of what the voice was sent
const align = existsSync(ALIGN) ? JSON.parse(readFileSync(ALIGN, 'utf8')) : {};
for (const l of lines.filter(l => !l.break && align[l.id]?.key !== l.key)) {
  const fd = new FormData();
  fd.append('file', new Blob([readFileSync(l.file)], { type: 'audio/mpeg' }), 'take.mp3'); fd.append('text', say(l.text));
  const r = await eleven('forced-alignment', { method: 'POST', body: fd });
  align[l.id] = { key: l.key, words: r.words.filter(w => w.text.trim()).map(w => [w.text.trim(), +w.start.toFixed(3), +w.end.toFixed(3)]) };
  console.log(`aligned ${l.id} (${align[l.id].words.length} words)`);
}
writeFileSync(ALIGN, JSON.stringify(align, null, 0).replace(/\],"/g, '],\n"') + '\n');

// cues against one line's own audio: its start, its end ($), or where a run of its words starts
const DIGITS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
const norm = s => s.toLowerCase().replace(/\d/g, d => ` ${DIGITS[d]} `).replace(/[^a-z' ]+/g, ' ').trim().split(/\s+/).filter(Boolean);   // "F-1" and the voice's "F one" alike
function wordAt(id, phrase) {
  const W = align[id].words, want = norm(phrase), tok = W.flatMap((w, i) => norm(w[0]).map(x => [x, i]));
  for (let i = 0; i + want.length <= tok.length; i++) if (want.every((w, k) => tok[i + k][0] === w)) return tok[i][1];
  throw new Error(`cue: no "${phrase}" in ${id} (it says: ${W.map(w => w[0]).join(' ')})`);
}

// the layout, with the holds: each line becomes one or more parts [chapter time, audio from, audio to]
const holdAfter = {}, holdBefore = {};
for (const h of board.holds || []) {
  const m = h.at.match(/^(p\d+\.\d+)(\$|:(.+))$/);
  if (m[2] === '$') holdAfter[m[1]] = h.s; else (holdBefore[m[1]] ||= []).push({ i: wordAt(m[1], m[3]), s: h.s });
}
let t = board.voice_at, prev = null;
for (const l of lines) {
  if (l.break) { t += GAP.scene; prev = null; continue; }
  const p = l.id.split('.')[0]; if (prev) t += prev === p ? GAP.line : GAP.para; prev = p;
  const W = align[l.id].words, cuts = (holdBefore[l.id] || []).sort((a, b) => a.i - b.i);
  l.parts = []; l.at = t; let a = 0;
  for (const c of cuts) { const cut = (W[c.i - 1][2] + W[c.i][1]) / 2; l.parts.push([t, a, cut]); t += cut - a + c.s; a = cut; }
  l.parts.push([t, a, l.secs]); t += l.secs - a;
  // each word in chapter time, through the part it falls in
  const toCh = x => { const pt = l.parts.findLast(q => x >= q[1] - 1e-6) || l.parts[0]; return pt[0] + x - pt[1]; };
  l.words = W.map(([w, s, e]) => [w, +toCh(s).toFixed(3), +toCh(e).toFixed(3)]);
  l.end = t; t += holdAfter[l.id] || 0;
}
const voiced = lines.filter(l => !l.break), byId = Object.fromEntries(voiced.map(l => [l.id, l]));
const duration = +(voiced.at(-1).end + (board.outro ?? 4)).toFixed(3);

// a cue in chapter time
function cue(c) {
  if (typeof c === 'number') return c;
  const m = String(c).match(/^(p\d+\.\d+)(\$)?(?::(.+?))?([+-]\d*\.?\d+)?$/);
  if (!m) { const off = String(c).match(/^([+-]\d*\.?\d+)$/); if (off) return null; throw new Error(`cue: can't read "${c}"`); }
  const l = byId[m[1]]; if (!l) throw new Error(`cue: ${m[1]} isn't in chapter ${n}`);
  const base = m[2] ? l.end : m[3] ? l.words[wordAt(m[1], m[3])][1] : l.at;
  return +(base + (m[4] ? +m[4] : 0)).toFixed(3);
}
const shots = board.shots.map((s, i) => ({ id: s.id, t0: cue(s.at) }));
shots.forEach((s, i) => { s.t1 = i + 1 < shots.length ? shots[i + 1].t0 : duration; if (s.t1 <= s.t0) throw new Error(`shot ${s.id} starts after shot ${shots[i + 1].id}`); });
board.shots.forEach((s, i) => { const b = s.board === undefined ? null : cue(s.board); shots[i].board = b ?? shots[i].t0 + (String(s.board || '').startsWith('+') ? +s.board : (shots[i].t1 - shots[i].t0) / 2); });
shots.forEach(s => { if (s.board < s.t0 || s.board > s.t1) throw new Error(`shot ${s.id}'s board falls outside it`); });
const cues = {};
for (const s of board.shots) for (const [c] of s.reads || []) if (typeof c === 'string' && c !== 'voice') cues[c] = cue(c);

writeFileSync(`src/gen/ch${NN}.js`, `// ch${NN}.js: written by tools/timeline.mjs from the voice and script/boards/ch${NN}.yaml. Don't edit it.
// CHAPTER.lines: each spoken line's place in chapter time, and its words [text, start, end]. cue() reads the
// storyboard's cue syntax (p060.1, p060.1$, 'p060.1:dull snap', with +/- seconds) against them.
const CHAPTER = ${JSON.stringify({ n, title: chapter.title, duration, shots: Object.fromEntries(shots.map(s => [s.id, [s.t0, s.t1]])),
  lines: voiced.map(l => ({ id: l.id, who: l.who, mode: l.mode, t0: +l.at.toFixed(3), t1: +l.end.toFixed(3), words: l.words })) })};
function cue(c) {
  if (typeof c === 'number') return c;
  const m = String(c).match(/^(p\\d+\\.\\d+)(\\$)?(?::(.+?))?([+-]\\d*\\.?\\d+)?$/), l = m && CHAPTER.lines.find(l => l.id === m[1]);
  if (!l) throw new Error('cue: ' + c);
  const D = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
  const norm = s => s.toLowerCase().replace(/\\d/g, d => ' ' + D[d] + ' ').replace(/[^a-z' ]+/g, ' ').trim().split(/\\s+/).filter(Boolean);
  let base = m[2] ? l.t1 : l.t0;
  if (m[3]) { const want = norm(m[3]), tok = l.words.flatMap((w, i) => norm(w[0]).map(x => [x, i])), i = tok.findIndex((_, i) => want.every((w, k) => tok[i + k] && tok[i + k][0] === w)); if (i < 0) throw new Error('cue: ' + c); base = l.words[tok[i][1]][1]; }
  return base + (m[4] ? +m[4] : 0);
}
`);

// the layout for the review tools (tools/storyboard.mjs): shots with their boards, and every line's words
writeFileSync(`${OUT}/timeline.json`, JSON.stringify({ n, title: chapter.title, duration, shots,
  lines: voiced.map(l => ({ id: l.id, who: l.who, mode: l.mode, text: l.text, t0: l.at, t1: l.end, words: l.words })) }));

// the mix
const parts = voiced.flatMap(l => l.parts.map(([at, a, b]) => ({ file: l.file, at, a, b })));
const fx = (sfx.chapters[n] || []).map(f => {
  const file = sfx.files[f.fx], len = seconds(file), at = cue(f.at), until = f.until !== undefined ? cue(f.until) : at + len;
  const [fi, fo] = Array.isArray(f.fade) ? f.fade : [f.fade ?? 0, f.fade ?? 0];
  return { file, at, dur: until - at, loop: until - at > len, gain: f.gain ?? 0, fi, fo };
});
const inputs = [...parts.map(p => ['-i', p.file]), ...fx.map(f => [...(f.loop ? ['-stream_loop', '-1'] : []), '-i', f.file])].flat();
const fmt = 'aformat=sample_rates=48000:channel_layouts=stereo';
const ms = s => Math.round(s * 1000);
const g = [
  ...parts.map((p, i) => `[${i}:a]atrim=${p.a.toFixed(3)}:${p.b.toFixed(3)},asetpts=PTS-STARTPTS,${fmt},adelay=${ms(p.at)}:all=1[v${i}]`),
  `${parts.map((_, i) => `[v${i}]`).join('')}amix=inputs=${parts.length}:normalize=0,apad=whole_dur=${duration}[voice]`,
  fx.length ? '[voice]asplit=2[vmix][vkey]' : '[voice]anull[vmix]',
  ...fx.map((f, i) => `[${parts.length + i}:a]atrim=0:${f.dur.toFixed(3)},asetpts=PTS-STARTPTS,${fmt},afade=t=in:d=${f.fi || .01},afade=t=out:st=${Math.max(0, f.dur - (f.fo || .01)).toFixed(3)}:d=${f.fo || .01},volume=${f.gain}dB,adelay=${ms(f.at)}:all=1[f${i}]`),
  fx.length ? `${fx.map((_, i) => `[f${i}]`).join('')}amix=inputs=${fx.length}:normalize=0,apad=whole_dur=${duration}[fx];[fx][vkey]sidechaincompress=threshold=0.02:ratio=5:attack=30:release=500[fxd];[vmix][fxd]amix=inputs=2:normalize=0[pre]` : '[vmix]anull[pre]',
  `[pre]atrim=0:${duration}[out]`,
];
execFileSync('ffmpeg', ['-v', 'error', '-y', ...inputs, '-filter_complex', g.join(';'), '-map', '[out]', `${OUT}/pre.wav`], { maxBuffer: 1e8 });
// loudness in two passes: measure, then a linear gain to -14 LUFS (with the limiter only where a peak needs it). The
// peak is held to -2 here so it's still under -1 dBTP after the MP3 and the draft's AAC, which each push it up a little
const LN = 'loudnorm=I=-14:TP=-2:LRA=20';
const m = JSON.parse(spawnSync('ffmpeg', ['-hide_banner', '-nostats', '-i', `${OUT}/pre.wav`, '-af', `${LN}:print_format=json`, '-f', 'null', '-'], { encoding: 'utf8' }).stderr.match(/\{[\s\S]*\}/)[0]);
execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', `${OUT}/pre.wav`, '-af', `${LN}:linear=true:measured_I=${m.input_i}:measured_TP=${m.input_tp}:measured_LRA=${m.input_lra}:measured_thresh=${m.input_thresh}:offset=${m.target_offset},${fmt}`, `${OUT}/mix.wav`]);
execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', `${OUT}/mix.wav`, '-b:a', '160k', `${OUT}/mix.mp3`]);
const loud = spawnSync('ffmpeg', ['-hide_banner', '-nostats', '-i', `${OUT}/mix.wav`, '-af', 'ebur128=peak=true', '-f', 'null', '-'], { encoding: 'utf8' }).stderr.split('Summary:')[1] || '';
const lufs = +(loud.match(/I:\s+(-?[\d.]+) LUFS/) || [])[1], peak = +(loud.match(/Peak:\s+(-?[\d.]+) dBFS/) || [])[1];
const mmss = s => { const d = Math.round(s * 10); return `${Math.floor(d / 600)}:${((d % 600) / 10).toFixed(1).padStart(4, '0')}`; };
console.log(`chapter ${n}, ${chapter.title}: ${mmss(duration)}, ${voiced.length} lines, ${shots.length} shots, ${fx.length} effects, ${lufs} LUFS, true peak ${peak} dBFS → src/gen/ch${NN}.js, ${OUT}/mix.mp3`);
for (const s of shots) console.log(`  ${s.id.padEnd(3)} ${mmss(s.t0)}  ${(s.t1 - s.t0).toFixed(1).padStart(5)} s   board at ${mmss(s.board)}`);
