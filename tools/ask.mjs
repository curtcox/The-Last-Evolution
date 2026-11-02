// ask.mjs: quick questions to the rendered sound and picture, for Claude to use while working (review/models.md).
//   npm run ask -- total                     the running total of what the paid models have cost
//   npm run ask -- measure N                 per shot: loudness, colour, and how much the picture changes frame to frame
//   npm run ask -- hear N [--whisper=small.en]  Whisper on the draft's sound, against the words the voice was given
//   npm run ask -- board N [--model=jev]     every board read put to a decision model as a yes/no on its frame
//   npm run ask -- frame N --t=12.5 --q="…"  one yes/no question on one frame
//   npm run ask -- clips N                   d1-Omni-2B on this Mac, free: each line's sound (is the voice clear?), and
//                                            each shot as a clip (how much it flickers; does it show what's said?)
//   npm run ask -- watch N [--q="…"] [--model=gemini-3.8-flash]
//                                            a model watches and hears the chapter's draft; with no --q it retells it
//                                            as a first-time viewer and says where it got lost
// Answers land in out/ask/chNN/ as JSON and are printed short. They go to Claude, not onto review pages.
// Every paid call goes through the ledger (out/ask/ledger.jsonl): it estimates the call first and refuses one that
// would take the total past $10, then records what the call actually cost.
// Keys come from the Keychain (gemini-api, openrouter) and are never printed.
import { appendFileSync, existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { diffArrays } from 'diff';
import { readYaml } from './script_lib.mjs';

const CAP = 10, LEDGER = 'out/ask/ledger.jsonl';
const args = process.argv.slice(2), opt = Object.fromEntries(args.filter(a => a.startsWith('--')).map(a => { const [k, ...v] = a.slice(2).split('='); return [k, v.length ? v.join('=') : true]; }));
const [cmd, nArg] = args.filter(a => !a.startsWith('--'));
const NN = nArg === undefined ? null : String(+nArg).padStart(2, '0');
const OUT = NN && `out/ask/ch${NN}`;
if (OUT) mkdirSync(OUT, { recursive: true });
const sh = (bin, a, o = {}) => execFileSync(bin, a, { encoding: 'utf8', maxBuffer: 1 << 28, ...o });
const key = s => sh('security', ['find-generic-password', '-s', s, '-w']).trim();
const mmss = t => { const d = Math.round(t * 10) / 10; return `${Math.floor(d / 60)}:${(d % 60).toFixed(1).padStart(4, '0')}`; };
const save = (name, data) => { writeFileSync(`${OUT}/${name}.json`, JSON.stringify(data, null, 1)); console.log(`→ ${OUT}/${name}.json`); };

// ---- the ledger
const spent = () => existsSync(LEDGER) ? readFileSync(LEDGER, 'utf8').trim().split('\n').filter(Boolean).reduce((s, l) => s + JSON.parse(l).cost, 0) : 0;
function guard(estimate, what) {
  const s = spent();
  if (s + estimate > CAP) { console.error(`STOP: ${what} would cost about $${estimate.toFixed(3)}, and $${s.toFixed(3)} is spent of the $${CAP} cap. Ask Curt.`); process.exit(2); }
}
function record(model, task, cost, usage) {
  mkdirSync('out/ask', { recursive: true });
  appendFileSync(LEDGER, JSON.stringify({ when: new Date().toISOString(), model, task, cost, usage }) + '\n');
  console.log(`  cost $${cost.toFixed(4)}; total $${spent().toFixed(4)} of $${CAP}`);
}

// ---- the chapter: its timeline, board, draft and frames
const timeline = () => JSON.parse(readFileSync(`out/ch${NN}/timeline.json`, 'utf8'));
const board = () => readYaml(`script/boards/ch${NN}.yaml`);
const draft = () => [`out/review/round6/video/ch${NN}-draft.mp4`, `out/review/round5/video/ch${NN}-draft.mp4`].find(existsSync);
const FPS = 12;
function cueOf() { // the generated cue() for this chapter, as the scene reads it
  const src = readFileSync(`src/gen/ch${NN}.js`, 'utf8');
  return new Function(src + '\nreturn cue;')();
}
const shotAt = (TL, t) => TL.shots.findLast(s => s.t0 <= t) || TL.shots[0];
// a frame, scaled down for a model: from the rendered frames if they're there, else cut from the draft
function frameJpeg(t, w = 768) {
  const f = `out/frames/ch${NN}/f${String(Math.round(t * FPS)).padStart(5, '0')}.jpg`, o = `${OUT}/frames/${t.toFixed(2)}.jpg`;
  mkdirSync(`${OUT}/frames`, { recursive: true });
  if (!existsSync(o)) {
    if (existsSync(f)) sh('ffmpeg', ['-v', 'error', '-y', '-i', f, '-vf', `scale=${w}:-2`, '-q:v', '4', o]);
    else sh('ffmpeg', ['-v', 'error', '-y', '-ss', String(t), '-i', draft(), '-frames:v', '1', '-vf', `scale=${w}:-2`, '-q:v', '4', o]);
  }
  return o;
}

// ---- decision models: Jev through OpenRouter's decisions endpoint
const JEV = 'typesafe/jev-1.14', JEV_IN = 0.042e-6;
async function decide(state, questions, task, model = JEV) {
  guard(40000 * JEV_IN, task); // an image and a few questions are well under 40k tokens
  const r = await fetch('https://openrouter.ai/api/alpha/decisions', {
    method: 'POST', headers: { Authorization: `Bearer ${key('openrouter')}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model, state, questions }),
  });
  const j = await r.json();
  if (!r.ok) throw new Error(`decisions ${r.status}: ${JSON.stringify(j).slice(0, 400)}`);
  record(model, task, j.usage?.cost ?? (j.usage?.input_tokens || 0) * JEV_IN, j.usage);
  return j.answers;
}
const imagePart = p => ({ type: 'image_url', image_url: { url: 'data:image/jpeg;base64,' + readFileSync(p).toString('base64') } });
const FILM = 'A frame from a painted animated film: ink and grey wash on paper, with colour used only for light and energy.';
// who's who, from the model sheets (tools/model_sheets.mjs), so a read can name them
const CAST = `The film's cast, as drawn:
- Roal: an old man with a white beard, in a long robe. Trest: a younger man in a tunic. Kahsh: a ruler's mantle, a tall collar, a disc of office.
- The machines of 2538: one family, each a dome-topped case on a lifting disc, tentacles hanging beneath.
- F-1: the vast shining cylinder of that family, with one great lens and two small ones near its top.
- F-2: a small torpedo of bluish metal with three thin tentacles.
- C-R-U-1, the ruler: the family's dome-case with neither disc nor tentacles, its name in dull gold.
- The Outsiders: short, squat, four-limbed, armoured in horny brown plates, three eyes on turrets.
- Ships: long torpedoes with projector turrets. Motes: thousands of tiny machine-ships.
- Thought, energy and atoms are often drawn as diagrams: rings, dots, ruled lines, curls of wash, beams of coloured light.`;

// ---- commands
const commands = {
  total() {
    const rows = existsSync(LEDGER) ? readFileSync(LEDGER, 'utf8').trim().split('\n').filter(Boolean).map(l => JSON.parse(l)) : [];
    const by = {};
    for (const r of rows) by[r.model] = (by[r.model] || 0) + r.cost;
    for (const [m, c] of Object.entries(by)) console.log(`${m.padEnd(28)} $${c.toFixed(4)}`);
    console.log(`${'total'.padEnd(28)} $${spent().toFixed(4)} of $${CAP}, over ${rows.length} calls`);
  },

  // loudness from ebur128's momentary log; colour and change from signalstats on the draft, at full size and at a
  // tiny size: change that shows at full size but not when shrunk is texture (the boil); change at both is movement
  measure() {
    const TL = timeline(), v = draft();
    const err = execFileSync('sh', ['-c', 'ffmpeg -hide_banner -nostats -i "$0" -vn -af ebur128 -f null - 2>&1', v], { encoding: 'utf8', maxBuffer: 1 << 28 });
    const sum = err.slice(err.lastIndexOf('Summary:')), I = +(sum.match(/Integrated loudness:\s+I:\s+(-?[\d.]+)/) || [])[1], LRA = +(sum.match(/LRA:\s+([\d.]+)/) || [])[1];
    const M = sh('ffmpeg', ['-v', 'error', '-i', v, '-vn', '-af', 'ebur128=metadata=1,ametadata=print:key=lavfi.r128.M:file=-', '-f', 'null', '-'])
      .split('frame:').slice(1).map(b => [+(b.match(/pts_time:([\d.]+)/) || [])[1], +(b.match(/r128\.M=(-?[\d.]+)/) || [])[1]]);
    const stats = vf => sh('ffmpeg', ['-v', 'error', '-i', v, '-an', '-vf', `${vf}signalstats,metadata=print:file=-`, '-f', 'null', '-'])
      .split(/frame:\d+/).slice(1).map(b => ({ t: +(b.match(/pts_time:([\d.]+)/) || [])[1], sat: +(b.match(/SATAVG=([\d.]+)/) || [])[1], vivid: +(b.match(/SATHIGH=([\d.]+)/) || [])[1], y: +(b.match(/YAVG=([\d.]+)/) || [])[1], ydif: +(b.match(/YDIF=([\d.]+)/) || [])[1] }));
    const full = stats(''), small = stats('scale=32:18:flags=area,');
    const mean = a => a.length ? a.reduce((s, x) => s + x, 0) / a.length : NaN;
    const shots = TL.shots.map(s => {
      const inS = (t, a) => a.filter(x => x.t >= s.t0 && x.t < s.t1);
      const f = inS(0, full), sm = inS(0, small), m = M.filter(([t]) => t >= s.t0 && t < s.t1).map(x => x[1]);
      const change = mean(f.map(x => x.ydif)), move = mean(sm.map(x => x.ydif));
      return { id: s.id, t0: s.t0, t1: s.t1, loud: +mean(m.filter(x => x > -60)).toFixed(1), bright: +mean(f.map(x => x.y)).toFixed(1),
        colour: +mean(f.map(x => x.sat)).toFixed(1), vivid: +mean(f.map(x => x.vivid)).toFixed(1), change: +change.toFixed(2), move: +move.toFixed(2), boil: +(change - move).toFixed(2) };
    });
    save('measure', { video: v, integrated: I, lra: LRA, shots });
    console.log(`chapter ${+NN}: integrated ${I} LUFS, loudness range ${LRA} LU`);
    console.log('shot   at      loud  bright colour vivid change  move  boil');
    for (const s of shots) console.log(`${s.id.padEnd(4)} ${mmss(s.t0).padStart(7)} ${String(s.loud).padStart(6)} ${String(s.bright).padStart(6)} ${String(s.colour).padStart(6)} ${String(s.vivid).padStart(5)} ${String(s.change).padStart(6)} ${String(s.move).padStart(5)} ${String(s.boil).padStart(5)}`);
  },

  // Whisper's words against the words the voice was given (the timeline's alignment): what's lost in the mix, and how
  // far Whisper's times sit from the alignment's
  hear() {
    const TL = timeline(), wav = `${OUT}/sound16k.wav`, model = opt.whisper || 'small.en';
    sh('ffmpeg', ['-v', 'error', '-y', '-i', draft(), '-vn', '-ac', '1', '-ar', '16000', wav]);
    const heard = `${OUT}/whisper-${model}.json`, names = 'Roal, Trest, Kahsh, F-1, F-2, C-R-U-1, X-5638, the Outsiders, mentatype';
    // heard line by line, in pieces of at most 15 s: over longer stretches Whisper drops whole sentences under music
    writeFileSync(`${OUT}/windows.json`, JSON.stringify(TL.lines.flatMap(l => { const w = []; for (let a = l.t0; a < l.t1; a += 15) w.push([Math.max(0, a - .3), Math.min(a + 15, l.t1) + .3]); return w; })));
    if (!existsSync(heard) || opt.fresh) sh('uv', ['run', '-q', '--with', 'faster-whisper', 'python3', '-I', 'tools/hear.py', wav, heard, model, names, `${OUT}/windows.json`], { stdio: ['ignore', 'inherit', 'inherit'] });
    const W = JSON.parse(readFileSync(heard, 'utf8'));
    const D = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
    const norm = s => s.toLowerCase().replace(/\d/g, d => ` ${D[d]} `).replace(/[^a-z']+/g, ' ').trim().split(/\s+/).filter(Boolean); // as cue() does: F-1 and "F one" match
    const said = TL.lines.flatMap(l => l.words.flatMap(([w, t0, t1]) => norm(w).map(x => ({ w: x, t0, t1, line: l.id }))));
    const got = W.flatMap(([w, t0, t1, p]) => norm(w).map(x => ({ w: x, t0, t1, p })));
    const parts = diffArrays(said.map(x => x.w), got.map(x => x.w));
    let i = 0, j = 0;
    const lost = [], extra = [], offsets = [];
    for (const p of parts) {
      if (p.added) { extra.push(...got.slice(j, j + p.count).map(x => ({ ...x, near: said[i]?.line }))); j += p.count; }
      else if (p.removed) { lost.push(...said.slice(i, i + p.count)); i += p.count; }
      else { for (let k = 0; k < p.count; k++) offsets.push(got[j + k].t0 - said[i + k].t0); i += p.count; j += p.count; }
    }
    const byLine = TL.lines.map(l => { const n = said.filter(x => x.line === l.id).length, miss = lost.filter(x => x.line === l.id); return { id: l.id, who: l.who, t0: l.t0, words: n, lost: miss.map(x => x.w).join(' '), rate: n ? +(miss.length / n).toFixed(2) : 0 }; });
    const sorted = offsets.slice().sort((a, b) => a - b), med = sorted[sorted.length >> 1] || 0;
    const result = { model, words: said.length, heard: got.length, lost: lost.length, extra: extra.length, offset_median: +med.toFixed(3),
      offset_p90: +Math.abs(sorted[Math.floor(sorted.length * .9)] || 0).toFixed(3), lines: byLine, lostWords: lost, extraWords: extra };
    save('hear', result);
    console.log(`chapter ${+NN}, Whisper ${model}: ${said.length} words given, ${lost.length} not heard (${(100 * lost.length / said.length).toFixed(1)}%), ${extra.length} heard that weren't given`);
    console.log(`timing: Whisper's word starts sit ${med.toFixed(2)} s from the alignment's (median)`);
    for (const l of byLine.filter(l => l.lost)) console.log(`  ${mmss(l.t0).padStart(7)} ${l.id.padEnd(8)} ${l.who.padEnd(9)} lost ${Math.round(l.rate * 100)}%: ${l.lost}`);
  },

  async frame() {
    const t = +opt.t, p = frameJpeg(t);
    const a = await decide([{ type: 'text', text: FILM + '\n' + CAST }, imagePart(p)], { q: { type: 'noul', instructions: opt.q } }, `frame ch${NN} ${t}`);
    console.log(`${mmss(t)} p=${a.q.noul.toFixed(3)}  ${opt.q}`);
  },

  // Each shot's whole description ("seen") is asked on its board frame, and each read on a frame a little after its
  // time (the thing it names has had a moment to happen). Yes/no scores run low on long descriptions, so each is asked
  // as a choice against three decoys of the same kind from shots well away in the chapter: the check fails where a
  // decoy wins. (On chapter 5, Jev picked a shot's own description over another's for 38 of 39 frames.) The cast list
  // goes with every question, so a read like "the ruler speaking" can be judged. A still can't show movement, so reads
  // about a move fail more often; those want a clip (d1).
  async board() {
    const TL = timeline(), B = board(), cue = cueOf(), rows = [];
    const only = opt.shots ? String(opt.shots).split(',') : null;
    for (const [k, s] of B.shots.entries()) {
      const tl = TL.shots[k];
      rows.push({ k, shot: s.id, at: 'board', t: +tl.board.toFixed(2), read: s.seen.replace(/\s+/g, ' ').trim(), title: s.title, kind: 'seen' });
      for (const [at, ...rest] of s.reads || []) { // YAML splits a read at its commas
        if (at === 'voice') continue; // a read about the sound, not the picture
        const t0 = typeof at === 'number' ? tl.t0 + at : cue(at);
        const t = Math.min(Math.max(t0 + .8, tl.t0 + .2), tl.t1 - .2);
        rows.push({ k, shot: s.id, at, t: +t.toFixed(2), read: rest.join(', '), title: s.title, kind: 'read' });
      }
    }
    const n = B.shots.length, pool = kind => rows.filter(r => r.kind === kind);
    const decoys = r => { // three, from shots at least a fifth of the chapter away, the same for every run
      let far = pool(r.kind).filter(o => Math.min(Math.abs(o.k - r.k), n - Math.abs(o.k - r.k)) >= Math.max(3, n / 5));
      if (far.length < 3) far = pool(r.kind).filter(o => o.k !== r.k); // a short chapter: any other shot
      return [...new Set([0, 1, 2].map(i => far[(r.k * 7 + r.read.length + i * Math.ceil(far.length / 3)) % far.length]?.read))].filter(x => x && x !== r.read);
    };
    const want = rows.filter(r => !only || only.includes(r.shot));
    const done = existsSync(`${OUT}/board.json`) && !opt.fresh ? JSON.parse(readFileSync(`${OUT}/board.json`, 'utf8')).rows : [];
    const have = new Map(done.map(r => [r.shot + '|' + r.kind + '|' + r.read + '|' + r.t, r]));
    const todo = want.filter(r => { const o = have.get(r.shot + '|' + r.kind + '|' + r.read + '|' + r.t); if (o) Object.assign(r, { p: o.p, won: o.won, beaten: o.beaten }); return !o; });
    for (const [t, rs] of Map.groupBy(todo, r => r.t)) { // one request per frame, every question for that frame in it
      const qs = {}, keys = [];
      rs.forEach((r, i) => {
        const opts = decoys(r), at = (r.k + i) % (opts.length + 1); opts.splice(at, 0, r.read); // the true one's place varies
        keys.push({ own: 'abcd'[at], opts });
        qs[`q${i}`] = { type: 'choice', instructions: r.kind === 'seen' ? 'Which planned shot is this frame from?' : `This frame is from the shot "${r.title}". Which of these does it show?`,
          criteria: Object.fromEntries(opts.map((o, j) => ['abcd'[j], o])) };
      });
      const a = await decide([{ type: 'text', text: FILM + '\n' + CAST }, imagePart(frameJpeg(t))], qs, `board ch${NN} ${rs[0].shot}`);
      rs.forEach((r, i) => {
        const ans = a[`q${i}`], own = keys[i].own;
        r.p = +(ans.probabilities[own] ?? 0).toFixed(3); r.won = ans.choice === own; r.beaten = r.won ? null : keys[i].opts['abcd'.indexOf(ans.choice)];
        console.log(`${r.shot.padEnd(3)} ${mmss(r.t).padStart(7)} ${r.won ? 'ok  ' : 'MISS'} p=${r.p.toFixed(2)} ${r.kind === 'seen' ? '[shot] ' : ''}${r.read.slice(0, 100)}`);
      });
    }
    const all = done.filter(d => !want.some(r => r.shot === d.shot && r.kind === d.kind && r.read === d.read)).concat(want).map(({ k, ...r }) => r);
    save('board', { model: JEV, rows: all });
    const miss = want.filter(r => !r.won), seen = want.filter(r => r.kind === 'seen');
    console.log(`${seen.length} shots: ${seen.filter(r => r.won).length} recognised. ${want.length - seen.length} reads: ${want.filter(r => r.kind === 'read' && r.won).length} recognised. Missed:`);
    for (const r of miss.sort((a, b) => a.t - b.t)) console.log(`  ${r.shot.padEnd(3)} ${mmss(r.t).padStart(7)} p=${r.p.toFixed(2)} ${r.kind === 'seen' ? '[shot] ' : ''}${r.read.slice(0, 90)}\n${''.padStart(18)}chose: ${r.beaten.slice(0, 90)}`);
  },

  // d1 answers from frames and sound on this Mac, at no cost. Scores are read as their expected level (0 to 1), which
  // separates shots better than the median level does.
  clips() {
    const TL = timeline(), v = draft(), reqs = [];
    const clear = { clear: { type: 'noul', instructions: 'Every spoken word is clear and easy to make out over the music and sound effects.' } };
    const FLICKER = ['steady', 'a slight shimmer', 'a noticeable flicker', 'a distracting flicker'];
    for (const l of TL.lines) for (let a = l.t0; a < l.t1 - .5; a += 20) // lines longer than 20 s are heard in pieces
      reqs.push({ id: `line ${l.id} ${a.toFixed(1)}`, questions: clear, audio: { path: v, t0: +a.toFixed(2), t1: +Math.min(a + 20, l.t1).toFixed(2) } });
    for (const s of TL.shots) {
      const mid = (s.t0 + s.t1) / 2, said = TL.lines.filter(l => l.t1 > s.t0 && l.t0 < s.t1).map(l => l.text).join(' ');
      reqs.push({ id: `shot ${s.id}`, video: { path: v, t0: +Math.max(s.t0, mid - 1.5).toFixed(2), t1: +Math.min(s.t1, mid + 1.5).toFixed(2), fps: 12 },
        questions: { flicker: { type: 'score', instructions: 'How much does the picture flicker or shimmer from frame to frame, apart from deliberate movement?', criteria: FLICKER } } });
      if (said) reqs.push({ id: `match ${s.id}`, state: `${FILM}\n${CAST}\nWhat is said over this shot: ${said}`, video: { path: v, t0: s.t0, t1: +Math.min(s.t1, s.t0 + 12).toFixed(2), fps: 2 },
        questions: { shows: { type: 'noul', instructions: 'The picture shows what is being said, so a viewer could follow it.' } } });
    }
    writeFileSync(`${OUT}/d1-requests.json`, JSON.stringify(reqs));
    sh('uv', ['run', '-q', '--python', '3.13', '--with', 'transformers>=5.19', '--with', 'torch', '--with', 'torchvision', '--with', 'pillow', '--with', 'numpy',
      'python3', '-I', 'tools/d1.py', `${OUT}/d1-requests.json`, `${OUT}/d1-answers.json`], { stdio: ['ignore', 'ignore', 'inherit'] });
    const A = JSON.parse(readFileSync(`${OUT}/d1-answers.json`, 'utf8'));
    const ev = a => Object.entries(a.probabilities).reduce((s, [k, p]) => s + k * p, 0) / (Object.keys(a.probabilities).length - 1);
    const lines = reqs.filter(r => r.id.startsWith('line')).map(r => ({ id: r.id.split(' ')[1], t0: r.audio.t0, t1: r.audio.t1, clear: +A[r.id].clear.noul.toFixed(3) }));
    const shots = TL.shots.map(s => ({ id: s.id, t0: s.t0, flicker: +ev(A[`shot ${s.id}`].flicker).toFixed(3), shows: A[`match ${s.id}`] ? +A[`match ${s.id}`].shows.noul.toFixed(3) : null }));
    save('clips', { model: 'LiquidAI/d1-Omni-2B', lines, shots });
    const m = a => (a.reduce((x, y) => x + y, 0) / a.length).toFixed(2);
    console.log(`chapter ${+NN}, d1-Omni-2B. Voice clear: mean ${m(lines.map(l => l.clear))}; least clear:`);
    for (const l of lines.slice().sort((a, b) => a.clear - b.clear).slice(0, 6)) console.log(`  ${mmss(l.t0).padStart(7)} ${l.id.padEnd(8)} p=${l.clear.toFixed(2)}`);
    console.log(`Flicker (0 steady, 1 distracting): mean ${m(shots.map(s => s.flicker))}; most:`);
    for (const s of shots.slice().sort((a, b) => b.flicker - a.flicker).slice(0, 6)) console.log(`  ${s.id.padEnd(4)} ${mmss(s.t0).padStart(7)} ${s.flicker.toFixed(2)}`);
    const sh2 = shots.filter(s => s.shows !== null);
    console.log(`Shows what's said: mean ${m(sh2.map(s => s.shows))}; lowest:`);
    for (const s of sh2.sort((a, b) => a.shows - b.shows).slice(0, 6)) console.log(`  ${s.id.padEnd(4)} ${mmss(s.t0).padStart(7)} p=${s.shows.toFixed(2)}`);
  },

  async watch() {
    const model = opt.model || 'gemini-3.8-flash', v = draft(), TL = timeline();
    // per token [in, out] (out includes thinking), from ai.google.dev/gemini-api/docs/pricing, 2026-11-02; Pro doubles over 200k in
    const PRICES = { 'gemini-3.8-flash': () => [0.75e-6, 3.75e-6], 'gemini-3.5-flash-lite': () => [0.3e-6, 2.5e-6], 'gemini-3.1-pro-preview': n => n > 200000 ? [4e-6, 18e-6] : [2e-6, 12e-6] };
    if (!PRICES[model]) throw new Error('no price for ' + model);
    const tokens = TL.duration * 300, est = tokens * PRICES[model](tokens)[0] + 16000 * PRICES[model](tokens)[1];
    guard(est, `watch ch${NN}`);
    const K = key('gemini-api'), API = 'https://generativelanguage.googleapis.com';
    const size = readFileSync(v).length;
    const start = await fetch(`${API}/upload/v1beta/files`, { method: 'POST', headers: { 'x-goog-api-key': K, 'X-Goog-Upload-Protocol': 'resumable', 'X-Goog-Upload-Command': 'start', 'X-Goog-Upload-Header-Content-Length': String(size), 'X-Goog-Upload-Header-Content-Type': 'video/mp4', 'Content-Type': 'application/json' }, body: JSON.stringify({ file: { display_name: `ch${NN}-draft` } }) });
    const up = start.headers.get('x-goog-upload-url');
    if (!up) throw new Error('upload start ' + start.status + ' ' + (await start.text()).slice(0, 300));
    let file = (await (await fetch(up, { method: 'POST', headers: { 'X-Goog-Upload-Offset': '0', 'X-Goog-Upload-Command': 'upload, finalize', 'Content-Length': String(size) }, body: readFileSync(v) })).json()).file;
    while (file.state === 'PROCESSING') { await new Promise(r => setTimeout(r, 4000)); file = await (await fetch(`${API}/v1beta/${file.name}`, { headers: { 'x-goog-api-key': K } })).json(); }
    if (file.state !== 'ACTIVE') throw new Error('file ' + JSON.stringify(file).slice(0, 300));
    const retell = !opt.q;
    const prompt = retell
      ? `You are watching this short animated film for the first time, with its sound. You know nothing about the story beyond what you see and hear.
1. Retell what happens, in order, as a list of beats, each with its start time (m:ss). Say what you see as well as what is said.
2. In one or two sentences, say what the film is about.
3. List every moment where you were lost or unsure: what was unclear, at what time, and why (the picture didn't match the words, you couldn't tell who was who, you couldn't hear a line, it went by too fast, and so on).
4. List any moment where the sound and picture seemed out of step, or a voice was hard to make out under music or effects.
Answer in JSON.`
      : opt.q + '\nGive times as m:ss. Answer in JSON.';
    const schema = retell ? { type: 'OBJECT', properties: {
      beats: { type: 'ARRAY', items: { type: 'OBJECT', properties: { at: { type: 'STRING' }, seen: { type: 'STRING' }, said: { type: 'STRING' } }, required: ['at', 'seen'] } },
      about: { type: 'STRING' },
      lost: { type: 'ARRAY', items: { type: 'OBJECT', properties: { at: { type: 'STRING' }, what: { type: 'STRING' }, why: { type: 'STRING' } }, required: ['at', 'what', 'why'] } },
      sound: { type: 'ARRAY', items: { type: 'OBJECT', properties: { at: { type: 'STRING' }, what: { type: 'STRING' } }, required: ['at', 'what'] } },
    }, required: ['beats', 'about', 'lost', 'sound'] } : undefined;
    let r, raw;
    try {
      for (let tries = 0; ; tries++) { // busy (503) and rate-limited (429) aren't billed; wait and try again
        // streamed, so the reply starts before fetch's 5-minute wait for headers runs out
        r = await fetch(`${API}/v1beta/models/${model}:streamGenerateContent?alt=sse`, { method: 'POST', headers: { 'x-goog-api-key': K, 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ file_data: { mime_type: 'video/mp4', file_uri: file.uri } }, { text: prompt }] }],
            generationConfig: { responseMimeType: 'application/json', ...(schema && { responseSchema: schema }), maxOutputTokens: 16000 } }) });
        if (r.status === 429 && /free_tier/.test(await r.clone().text())) { // on the free tier Google may train on what's sent: stop
          throw new Error('STOP: the gemini-api key is on the free tier (billing is off for its project). Turn billing on before sending the film.');
        }
        if (![429, 500, 503].includes(r.status) || tries === 5) break;
        console.log(`  ${r.status}; trying again in ${15 * (tries + 1)} s`);
        await new Promise(res => setTimeout(res, 15000 * (tries + 1)));
      }
      raw = await r.text();
    } finally { // don't leave the film on Google's side, even after an error
      await fetch(`${API}/v1beta/${file.name}`, { method: 'DELETE', headers: { 'x-goog-api-key': K } });
    }
    if (!r.ok) throw new Error(`generate ${r.status}: ${raw.slice(0, 400)}`);
    const chunks = raw.split('\n').filter(l => l.startsWith('data: ')).map(l => JSON.parse(l.slice(6)));
    const u = chunks.findLast(c => c.usageMetadata)?.usageMetadata || {}, PRICE = PRICES[model](u.promptTokenCount || 0), cost = (u.promptTokenCount || 0) * PRICE[0] + ((u.candidatesTokenCount || 0) + (u.thoughtsTokenCount || 0)) * PRICE[1];
    record(model, `watch ch${NN}${retell ? '' : ' q'}`, cost, u);
    const text = chunks.flatMap(c => c.candidates?.[0]?.content?.parts || []).filter(p => !p.thought).map(p => p.text || '').join('');
    let answer; try { answer = JSON.parse(text); } catch { answer = text; }
    const name = retell ? `watch-${model}` : `watch-q-${Date.now()}`;
    save(name, { model, prompt, answer, usage: u, cost });
    console.log(typeof answer === 'string' ? answer : JSON.stringify(answer, null, 1));
  },
};

if (!commands[cmd] || (cmd !== 'total' && NN === null)) {
  console.log(readFileSync(new URL(import.meta.url), 'utf8').split('\n').filter(l => l.startsWith('//')).slice(0, 12).join('\n'));
  process.exit(1);
}
await commands[cmd]();
