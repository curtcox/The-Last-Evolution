// script_lib.mjs: what the script and voice tools share: the files, the split of a
// paragraph at its quotation marks, the words a line sends to the voice, the treatments that colour a voice, and the
// check of what a voice said.
import { readFileSync } from 'node:fs';
import YAML from 'yaml';

export const PATHS = {
  story: 'text/story.json', cast: 'script/cast.yaml', speakers: 'script/speakers.yaml', chapters: 'script/chapters.yaml',
  pronounce: 'script/pronounce.yaml', script: 'script/script.yaml', attribution: 'script/reports/attribution.md',
  verbatim: 'script/reports/verbatim.md', runtime: 'script/reports/runtime.md',
};
export const readYaml = p => YAML.parse(readFileSync(p, 'utf8'));
export const readStory = () => JSON.parse(readFileSync(PATHS.story, 'utf8'));
// words as text/story.json counts them (tools/extract_story.mjs): runs of non-space with a letter or digit in them
export const words = s => s.split(/\s+/).filter(w => /\w/.test(w)).length;

// A paragraph split at its double quotation marks, trimmed: [{ quoted, text }]. A quoted piece runs from its opening mark
// to its closing one, or, when the paragraph leaves it open (a speech running on into the next paragraph), to the end.
// The pieces joined with single spaces are the paragraph again; verbatim_check.mjs holds the script to that.
export function split(text) {
  const out = [];
  let i = 0;
  while (i < text.length) {
    const open = text.indexOf('"', i);
    if (open < 0) { out.push({ quoted: false, text: text.slice(i) }); break; }
    if (open > i) out.push({ quoted: false, text: text.slice(i, open) });
    const close = text.indexOf('"', open + 1);
    const end = close < 0 ? text.length : close + 1;
    out.push({ quoted: true, text: text.slice(open, end), open: close < 0 });
    i = end;
  }
  return out.map(p => ({ ...p, text: p.text.trim() })).filter(p => p.text);
}

// "f2 thought" → { who: 'f2', mode: 'thought' }; a bare id is spoken aloud
export function parseWho(s) {
  const [who, mode = 'voice'] = s.trim().split(/\s+/);
  return { who, mode };
}

// The words a line sends to the voice: the line without its quotation marks or footnote markers, with Gutenberg's "--"
// as a dash, and each respelling in pronounce.yaml applied (the longest first, so "Kahsh-256799" wins over "Kahsh").
export function plain(text) {
  return text.replace(/"/g, '').replace(/\[\d\]/g, '').replace(/\s*--\s*/g, ' — ').replace(/_([^_]+)_/g, '$1')
    .replace(/\s+/g, ' ').replace(/ — $/, '—').trim();
}
export function respeller(pronounce) {
  const rules = [...pronounce].sort((a, b) => b.text.length - a.text.length)
    .map(r => ({ re: new RegExp(`(?<![\\w-])${r.text.replace(/[.*+?^${}()|[\]\\-]/g, '\\$&')}(?![\\w-])`, 'g'), say: r.say }));
  return text => {
    // each rule replaces with a placeholder first, so one respelling's output is never respelled by another
    const said = [];
    let t = plain(text);
    for (const r of rules) t = t.replace(r.re, () => `\u0000${said.push(r.say) - 1}\u0000`);
    return t.replace(/\u0000(\d+)\u0000/g, (m, n) => said[n]);
  };
}

// A voiced line's words as the story spells them, timed by the voice's: each word of the text takes as many of the
// voice's words as its respelling has ("F-1" takes "F one"); if the counts don't tally, the two are aligned. Always the
// text's words. line: a timeline line ({ text, words: [[word, start, end], ...] }); say: a respeller(). → [[word, start]]
export function storyWords(line, say) {
  // the text's words, and its dashes, which the voice's timings count as words too
  const tw = plain(line.text).split(/\s+/).filter(w => /\w|—/.test(w)), k = tw.map(w => say(w).split(/\s+/).filter(x => /\w/.test(x)).length);
  if (k.reduce((a, b) => a + b, 0) === line.words.length) { let i = 0; return tw.map((w, j) => { const at = line.words[i][1]; i += k[j]; return [w, at]; }); }
  // the voice split its words otherwise ("twenty-five" as one): align the respelt words with the voice's by edit
  // distance, and give each of the text's words the time of the first voice word matched to it
  const key = s => s.toLowerCase().replace(/[^a-z0-9]/g, ''), E = [], V = line.words.map(w => key(w[0]));
  tw.forEach((w, j) => { const xs = say(w).split(/\s+/).filter(x => /\w/.test(x)); (xs.length ? xs : [w]).forEach(x => E.push([key(x), j])); });
  const d = Array.from({ length: E.length + 1 }, (_, i) => Array.from({ length: V.length + 1 }, (_, j) => i + j));
  for (let i = 1; i <= E.length; i++) for (let j = 1; j <= V.length; j++)
    d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (E[i - 1][0] === V[j - 1] ? 0 : 1));
  const at = Array(tw.length).fill(null);
  for (let i = E.length, j = V.length; i > 0;) {
    if (j > 0 && d[i][j] === d[i - 1][j - 1] + (E[i - 1][0] === V[j - 1] ? 0 : 1)) { at[E[i - 1][1]] = line.words[j - 1][1]; i--; j--; }
    else if (d[i][j] === d[i - 1][j] + 1) i--; else j--;
  }
  let last = line.words[0][1];
  return tw.map((w, j) => [w, last = at[j] ?? last]);
}

// the processing each treatment applies (ffmpeg filters)
export const TREAT = {
  old: { label: 'old', af: 'asetrate=44100*0.97,aresample=44100,atempo=0.97,vibrato=f=4.5:d=0.04,highpass=f=120,lowpass=f=6500,aecho=0.8:0.6:35:0.12' },
  thought: { label: 'as thought', af: 'chorus=0.6:0.9:45|60:0.35|0.3:0.25|0.4:1.5|1.2,aecho=0.8:0.7:110|230:0.3|0.18,highpass=f=90' },
  machine: { label: 'machine', af: 'flanger=delay=1.5:depth=1.5:regen=20:width=60:speed=0.3,highpass=f=150,lowpass=f=7500,aecho=0.8:0.4:12:0.15' },
};

// What a voice said against what it was given: ElevenLabs speech-to-text, compared word by word.
// Spelling that differs only in form isn't a miss: hyphens, digits for number words ("F-2" for "F two"), Gutenberg's
// "reenforcements", "Roal" heard as the one-syllable "Roll" that Round 1 chose, British spellings heard as American,
// compounds heard whole or apart, and the single quotation marks inside a speech.
const DIGITS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
const SAME = { reenforcements: 'reinforcements', roll: 'roal', role: 'roal', rol: 'roal', mentatype: 'menta type', forcescreen: 'force screen',
  scoutline: 'scout line', cru: 'c r u', cr: 'c r', mx: 'm x', "roll's": "roal's", rohl: 'roal', "rohl's": "roal's", whir: 'whirr',
  reestablished: 're established', horsepower: 'horse power', submicroscopic: 'sub microscopic', molding: 'moulding' };
const norm = s => s.toLowerCase().replace(/([a-z])-?(\d)/g, '$1 $2').replace(/\d/g, d => ` ${DIGITS[d]} `)
  .replace(/[^a-z' ]+/g, ' ').split(/\s+/).map(w => w.replace(/^'+|'+$/g, '')).filter(Boolean).flatMap(w => (SAME[w] || w).split(' '));
export function misses(want, got) {   // the words of `want` that a word-level edit alignment doesn't find in `got`
  const a = norm(want), b = norm(got), d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++)
    d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  const out = []; let i = a.length, j = b.length;
  while (i > 0) { if (j > 0 && d[i][j] === d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)) { if (a[i - 1] !== b[j - 1]) out.unshift(a[i - 1]); i--; j--; }
    else if (d[i][j] === d[i - 1][j] + 1) { out.unshift(a[i - 1]); i--; } else j--; }
  return { words: a.length, missed: out };
}
