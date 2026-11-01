// verbatim_check.mjs: proves script/script.yaml is the story, word for word (PLAN.md §3).   npm run check
// It reads the Gutenberg file itself, not just text/story.json, so neither the extractor nor the script builder is taken
// on trust:
//   1. the source file's SHA-256 is the one recorded, and story.json was extracted from it
//   2. every paragraph of the story is in the script, once, in order, and nothing else is: its lines joined with single
//      spaces are the paragraph exactly, and each paragraph is found in the source file as is (line breaks aside)
//   3. every other block (masthead, title, byline, scene breaks, illustration, THE END, footnotes) is a shown line,
//      never a spoken one
//   4. narration has no quotation marks in it; a quoted line starts with one and ends with one, unless its speech runs on
//      into the next paragraph; every speaker is in script/cast.yaml
//      and each quoted line's speaker is the one script/speakers.yaml names (so a hand edit to script.yaml shows)
//   5. the spoken words add up to the story's count
// Writes script/reports/verbatim.md, and exits 1 if anything fails.
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { PATHS, readYaml, readStory, words, parseWho } from './script_lib.mjs';

const story = readStory(), script = readYaml(PATHS.script), cast = readYaml(PATHS.cast), speakers = readYaml(PATHS.speakers);
const fails = [], notes = [];
const fail = m => fails.push(m);

// 1. the source
const raw = readFileSync(story.source);
const sha = createHash('sha256').update(raw).digest('hex');
const recorded = readFileSync(story.source + '.sha256', 'utf8').trim().split(/\s+/)[0];
if (sha !== recorded) fail(`${story.source}: SHA-256 ${sha} isn't the recorded ${recorded}`);
if (story.sha256 !== sha || script.sha256 !== sha) fail('story.json or script.yaml was made from a different source file; run npm run story and npm run script');
const flat = raw.toString('utf8').replace(/\r\n/g, '\n').replace(/\s*\n\s*/g, ' ');   // the source with its lines rejoined

// 2–4. the blocks, in order
const lines = script.chapters.flatMap(c => c.lines);
const groups = [];
for (const l of lines) {
  const id = l.id.split('.')[0];
  if (groups.at(-1)?.id === id) groups.at(-1).lines.push(l); else groups.push({ id, lines: [l] });
}
if (groups.length !== story.blocks.length) fail(`the script has ${groups.length} blocks; the story has ${story.blocks.length}`);
let spokenWords = 0, open = false;
story.blocks.forEach((b, i) => {
  const g = groups[i];
  if (!g || g.id !== b.id) return fail(`block ${i + 1}: expected ${b.id}, found ${g?.id ?? 'nothing'}`);
  if (b.kind !== 'para') {
    if (g.lines.length !== 1 || g.lines[0].who || g.lines[0].text !== b.text) fail(`${b.id}: should be one shown line, exactly "${b.text}"`);
    return;
  }
  if (g.lines.some(l => !l.who)) fail(`${b.id}: a paragraph of the story isn't spoken`);
  const joined = g.lines.map(l => l.text).join(' ');
  if (joined !== b.text) fail(`${b.id}: the script's lines don't make the paragraph:\n    script: ${joined}\n    story:  ${b.text}`);
  if (!flat.includes(b.text)) fail(`${b.id}: not found word for word in ${story.source}`);
  const named = (s => (Array.isArray(s) ? s : s?.who) || [])(speakers[b.id]).map(w => parseWho(w).who);
  const given = g.lines.filter(l => l.who !== 'narrator').map(l => l.who);
  if (named.join() !== given.join()) fail(`${b.id}: speakers.yaml names [${named}], the script has [${given}]; run npm run script`);
  g.lines.forEach((l, j) => {
    if (!cast[l.who]) fail(`${l.id}: unknown speaker "${l.who}"`);
    const quoted = l.text.startsWith('"');
    if (l.who === 'narrator' && l.text.includes('"')) fail(`${l.id}: narration with a quotation mark in it`);
    if (l.who !== 'narrator' && !quoted) fail(`${l.id}: given to ${l.who}, but it isn't a quotation`);
    if (l.who !== 'narrator') {
      const closes = l.text.length > 1 && l.text.endsWith('"');
      if (!closes && j !== g.lines.length - 1) fail(`${l.id}: a quotation left open mid-paragraph`);
      if (j === 0 && open && !l.continues) fail(`${l.id}: continues the last paragraph's speech but isn't marked so`);
      open = !closes;
    } else if (j === 0 && open) fail(`${l.id}: the last paragraph's speech was left open`);
    spokenWords += words(l.text);
  });
});

// 5. the count
if (spokenWords !== story.words) fail(`${spokenWords} words spoken; the story has ${story.words}`);
const quoted = lines.filter(l => l.who && l.who !== 'narrator').length;
notes.push(`${story.blocks.filter(b => b.kind === 'para').length} paragraphs, ${spokenWords.toLocaleString()} words, all spoken, in order`,
  `${lines.filter(l => l.who).length} spoken lines: ${quoted} quoted, ${lines.filter(l => l.who === 'narrator').length} the narrator's`,
  `${lines.filter(l => l.shown).length} shown lines (masthead, title, byline, scene breaks, illustration, THE END, footnotes)`,
  `${lines.filter(l => l.say).length} lines where the voice is sent a respelling (script/pronounce.yaml)`,
  `source ${story.source}, SHA-256 ${sha.slice(0, 16)}…, as recorded`);

const md = ['# Verbatim check', '', `Written by \`tools/verbatim_check.mjs\`. ${fails.length ? `**FAILED: ${fails.length} problem(s).**` : '**Passed.**'}`, '',
  ...notes.map(n => `- ${n}`), '', ...(fails.length ? ['## Problems', '', ...fails.map(f => `- ${f}`), ''] : [])];
writeFileSync(PATHS.verbatim, md.join('\n'));
if (fails.length) { console.error(fails.join('\n')); console.error(`verbatim check FAILED: ${fails.length} problem(s)`); process.exit(1); }
console.log(`verbatim check passed: ${notes[0]}; ${notes[1]}`);
