// compare_printings.mjs: the two printings of the story against the text we voice (Gutenberg's), word by word.
//   node tools/compare_printings.mjs
//   in:  assets/ref/amazing_1932-08_ocr_story.txt   archive.org's OCR of the first printing (August 1932), story only
//        assets/ref/amazing_1961-03_ocr_story.txt   and of the reprint Gutenberg transcribed (March 1961)
//        text/story.json
//   out: text/compare_1932_raw.md, text/compare_1961_raw.md   every place the words differ, with context
// Most differences are OCR noise ("idlcnes s", "ivas"); the real ones are picked out, checked against the page scans and
// explained in text/comparison_1932.md. Only words are compared: case and punctuation aren't.
import { readFileSync, writeFileSync } from 'node:fs';
import { diffArrays } from 'diff';

const story = JSON.parse(readFileSync('text/story.json', 'utf8'));
const gut = story.blocks.filter(b => b.kind === 'para').map(b => b.text).join(' ');
const tok = s => s.toLowerCase().match(/[a-z0-9]+(?:'[a-z]+)?/g);
const a = tok(gut);

// which paragraph each 1961 word is in
const paraOf = [];
for (const p of story.blocks.filter(b => b.kind === 'para')) for (const _ of tok(p.text)) paraOf.push(p.id);

for (const [year, file] of [['1932', 'assets/ref/amazing_1932-08_ocr_story.txt'], ['1961', 'assets/ref/amazing_1961-03_ocr_story.txt']]) {
  const ocr = readFileSync(file, 'utf8')
    .replace(/\n\s*THE LAST EVOLUTION\s*\n\s*\d+\s*\n/g, '\n')   // running heads and page numbers
    .replace(/\n\s*\d+\s*\n\s*AMAZING STORIES\s*\n/g, '\n')
    .replace(/ {2,}/g, ' ')
    .replace(/-\s*\n\s*/g, '')                                   // words broken at line ends
    .replace(/[“”]/g, '"').replace(/[‘’]/g, "'");
  const b = tok(ocr);
  const out = [`# ${year} against Gutenberg, word by word`, '', 'Written by `tools/compare_printings.mjs`. Every place the words differ, OCR noise included;',
    'the real differences are in [comparison_1932.md](comparison_1932.md).', '', `| para | before | Gutenberg | ${year} (OCR) |`, '|---|---|---|---|'];
  let i = 0, n = 0;
  const parts = diffArrays(a, b);
  for (let k = 0; k < parts.length; k++) {
    const p = parts[k];
    if (!p.added && !p.removed) { i += p.count; continue; }
    const del = p.removed ? p.value : [], next = parts[k + 1];
    const ins = p.added ? p.value : next?.added && p.removed ? (k++, next.value) : [];
    out.push(`| ${paraOf[Math.min(i, paraOf.length - 1)]} | ${a.slice(Math.max(0, i - 5), i).join(' ')} | ${del.join(' ')} | ${ins.join(' ')} |`);
    i += del.length; n++;
  }
  writeFileSync(`text/compare_${year}_raw.md`, out.join('\n') + '\n');
  console.log(`text/compare_${year}_raw.md: ${n} differences in ${a.length} words (most of them OCR noise)`);
}
