// extract_story.mjs: the Gutenberg file → the story, as numbered blocks.   npm run story
//   text/source/pg27462.txt   the Gutenberg file, unmodified (its SHA-256 is checked against pg27462.txt.sha256 first)
//   text/story.json           every block in order: { id, kind, text }. kind is one of
//                             masthead · title · byline · para · break · illustration · end · footnote
//   text/story.md             the same, readable, with each block's id in a comment
// Only 'para' blocks are spoken (PLAN.md §3); the rest are shown. Lines are unwrapped into paragraphs, and nothing else
// in the text is changed: spelling, dashes and the italics' underscores stay as Gutenberg has them.
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const SRC = 'text/source/pg27462.txt';
const raw = readFileSync(SRC);
const want = readFileSync(SRC + '.sha256', 'utf8').split(/\s/)[0];
const got = createHash('sha256').update(raw).digest('hex');
if (got !== want) { console.error(`${SRC} has changed: its SHA-256 is ${got}, not ${want}`); process.exit(1); }

const lines = raw.toString('utf8').replace(/\r\n/g, '\n').split('\n');
const at = (s, from = 0) => { const i = lines.findIndex((l, k) => k >= from && l.trim().startsWith(s)); if (i < 0) throw new Error(`not found: ${s}`); return i; };
const start = at('A Classic Reprint'), end = at('THE END', start), notes = at('FOOTNOTES:', end), stop = at("Transcriber's Note:", notes);

// paragraphs: runs of non-blank lines, joined with single spaces
function paras(a, b) {
  const out = []; let cur = [];
  for (let i = a; i <= b; i++) {
    const l = lines[i].trim();
    if (l) cur.push(l); else if (cur.length) { out.push(cur.join(' ')); cur = []; }
  }
  if (cur.length) out.push(cur.join(' '));
  return out;
}

const blocks = [];
let n = 0, nb = 0;
const add = (kind, text, id) => blocks.push({ id, kind, text });
const head = paras(start, at('I am the last', start) - 1);   // masthead, title, byline
add('masthead', head[0], 'masthead'); add('title', head[1], 'title'); add('byline', head[2], 'byline');
for (const p of paras(at('I am the last', start), end - 1)) {
  if (/^\*(\s+\*)+$/.test(p)) add('break', p, `break${String(++nb).padStart(2, '0')}`);
  else if (/^\[Illustration/.test(p)) add('illustration', p, 'illustration');
  else add('para', p, `p${String(++n).padStart(3, '0')}`);
}
add('end', 'THE END', 'end');
for (const p of paras(notes + 1, stop - 1)) add('footnote', p, `fn${p.match(/^\[(\d+)\]/)[1]}`);

const spoken = blocks.filter(b => b.kind === 'para');
const words = spoken.reduce((s, b) => s + b.text.split(/\s+/).filter(w => /[\w]/.test(w)).length, 0);
writeFileSync('text/story.json', JSON.stringify({ source: SRC, sha256: got, words, blocks }, null, 1) + '\n');
writeFileSync('text/story.md', `# ${head[1].replace(/_/g, '')}\n\nExtracted from \`${SRC}\` by \`tools/extract_story.mjs\`; don't edit. `
  + `${spoken.length} spoken paragraphs, ${words} words.\n\n`
  + blocks.map(b => `<!-- ${b.id} (${b.kind}) -->\n${b.kind === 'break' ? '\\* \\* \\*' : b.text}\n`).join('\n'));
console.log(`text/story.json: ${blocks.length} blocks, ${spoken.length} spoken paragraphs, ${words} words, ${nb} scene breaks`);
