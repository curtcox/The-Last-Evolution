// script_lib.mjs: what build_script.mjs, verbatim_check.mjs and scratch_voice.mjs share: the files, the split of a
// paragraph at its quotation marks, and the words a line sends to the voice.
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
