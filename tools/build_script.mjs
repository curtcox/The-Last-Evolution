// build_script.mjs: the film's script, from the story (text/story.json) and who speaks each quotation
// (script/speakers.yaml), cut into chapters (script/chapters.yaml).   npm run script
//   script/script.yaml               every block of the story in order, as lines: each paragraph split at its quotation
//                                    marks, the quoted pieces given to their speakers and the rest to the narrator; the
//                                    masthead, title, scene breaks, illustration and footnotes as lines that are shown,
//                                    not spoken. A line's `say` is what the voice is sent, where pronounce.yaml changes it
//   script/reports/attribution.md    every quoted line and who has it, with the open questions first, and each
//                                    chapter's length
// It stops on anything it can't place: a quotation with no speaker, a speaker with no quotation, an unknown id, a speech
// that runs on into a paragraph given to someone else. tools/verbatim_check.mjs then proves the script is the story.
import { writeFileSync, mkdirSync } from 'node:fs';
import YAML from 'yaml';
import { PATHS, readYaml, readStory, split, parseWho, plain, respeller, words } from './script_lib.mjs';

const story = readStory(), cast = readYaml(PATHS.cast), speakers = readYaml(PATHS.speakers);
const chapters = readYaml(PATHS.chapters), say = respeller(readYaml(PATHS.pronounce));
const errors = [];
const fail = m => errors.push(m);

for (const [id, s] of Object.entries(speakers)) {
  const e = Array.isArray(s) ? { who: s } : s;
  for (const k of Object.keys(e)) if (!['who', 'sure', 'why'].includes(k)) fail(`speakers.yaml ${id}: unknown key "${k}"`);
  for (const w of e.who || []) { const { who, mode } = parseWho(w); if (!cast[who] || who === 'narrator') fail(`speakers.yaml ${id}: unknown speaker "${who}"`);
    if (!['voice', 'thought'].includes(mode)) fail(`speakers.yaml ${id}: unknown mode "${mode}"`); }
  speakers[id] = { who: e.who || [], sure: e.sure !== 'no' && e.sure !== false, why: e.why || '' };
}

// which chapter each block falls in: a chapter starts at its `from` paragraph; the title page belongs to chapter 0
const starts = new Map(chapters.map(c => [c.from, c]));
let ch = chapters[0], openSpeaker = null;
const used = new Set(), byChapter = new Map(chapters.map(c => [c.n, { ...c, lines: [] }]));
for (const b of story.blocks) {
  if (starts.has(b.id)) {
    if (openSpeaker) fail(`${b.id}: a chapter starts inside ${openSpeaker.id}'s open speech`);
    ch = starts.get(b.id);
  }
  const lines = byChapter.get(ch.n).lines;
  if (b.kind !== 'para') { lines.push({ id: b.id, shown: b.kind, text: b.text }); continue; }
  const pieces = split(b.text), quoted = pieces.filter(p => p.quoted), s = speakers[b.id];
  if (quoted.length && !s) { fail(`${b.id}: ${quoted.length} quotation(s), but no entry in speakers.yaml`); continue; }
  if (s) used.add(b.id);
  if (s && s.who.length !== quoted.length) fail(`${b.id}: ${quoted.length} quotation(s), but speakers.yaml names ${s.who.length}`);
  let q = 0;
  pieces.forEach((p, i) => {
    const line = { id: `${b.id}.${i + 1}`, who: 'narrator', text: p.text };
    if (p.quoted) {
      const { who, mode } = parseWho(s.who[q++] || '?');
      line.who = who;
      if (mode !== 'voice') line.mode = mode;
      // a quotation that opens the paragraph while the last one's speech is still open continues it: same speaker
      if (i === 0 && openSpeaker && openSpeaker.who !== who) fail(`${b.id}: continues ${openSpeaker.id}'s speech (${openSpeaker.who}) but is given to ${who}`);
      if (i === 0 && openSpeaker) line.continues = true;
      openSpeaker = p.open ? { id: b.id, who } : null;
      if (s.sure === false && q === 1) line.question = true;
    } else if (i === 0 && openSpeaker) fail(`${b.id}: ${openSpeaker.id}'s speech was left open, but this paragraph opens without a quotation mark`);
    const spoken = say(p.text);
    if (spoken !== plain(p.text)) line.say = spoken;
    lines.push(line);
  });
}
for (const id of Object.keys(speakers)) if (!used.has(id)) fail(`speakers.yaml ${id}: no such paragraph with a quotation`);
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }

const out = [...byChapter.values()].map(c => {
  const paras = c.lines.filter(l => l.who).map(l => l.id.split('.')[0]);
  const spoken = c.lines.filter(l => l.who);
  return { n: c.n, title: String(c.title), paras: `${paras[0]}–${paras.at(-1)}`, words: spoken.reduce((a, l) => a + words(l.text), 0), lines: c.lines };
});
mkdirSync('script/reports', { recursive: true });
const head = `# script.yaml: written by tools/build_script.mjs from text/story.json and script/speakers.yaml. Don't edit it;
# edit those, and run npm run script. Each line is one piece of a paragraph (p033.2 is p033's second piece): \`who\` speaks
# it (the narrator is F-2, narrating), \`mode: thought\` is heard as thought, \`continues\` carries on the last paragraph's
# speech, \`question\` is an attribution for Round 1, \`say\` is what the voice is sent where pronounce.yaml changes it.
# Lines with \`shown\` instead of \`who\` are on screen, not spoken.
`;
writeFileSync(PATHS.script, head + YAML.stringify({ source: story.source, sha256: story.sha256, words: story.words, chapters: out }, { lineWidth: 0 }));

// the attribution report
const md = [];
const q = out.flatMap(c => c.lines.filter(l => l.who && l.who !== 'narrator').map(l => ({ ...l, ch: c.n })));
const short = t => t.length > 90 ? t.slice(0, 87).replace(/\s+\S*$/, '') + '…"' : t;
md.push('# Who speaks each line', '', `Written by \`tools/build_script.mjs\` from \`script/speakers.yaml\`. Everything outside quotation marks is the`,
  `narrator's (F-2, narrating). ${q.length} quoted lines across ${new Set(q.map(l => l.id.split('.')[0])).size} paragraphs.`, '');
md.push('## Open questions', '');
if (!q.some(l => l.question)) md.push('None.');
for (const l of q.filter(l => l.question)) { const p = l.id.split('.')[0];
  md.push(`- **${p}** (chapter ${l.ch}) → **${cast[l.who].name}**${l.mode ? ` (${l.mode})` : ''}: ${short(l.text)}`, `  ${speakers[p].why}`); }
md.push('', '## Speakers', '', '| speaker | lines | words |', '|---|---:|---:|');
const tally = {};
for (const c of out) for (const l of c.lines) if (l.who) { const t = tally[l.who] ||= { lines: 0, words: 0 }; t.lines++; t.words += words(l.text); }
for (const [who, t] of Object.entries(tally).sort((a, b) => b[1].words - a[1].words)) md.push(`| ${cast[who].name} | ${t.lines} | ${t.words.toLocaleString()} |`);
md.push('', '## Chapters', '', '| # | title | paragraphs | words | opens at a scene break |', '|---:|---|---|---:|---|');
const kinds = story.blocks.map(b => b.kind);
for (const c of out) { const i = story.blocks.findIndex(b => b.id === c.paras.split('–')[0]);
  md.push(`| ${c.n} | ${c.title} | ${c.paras} | ${c.words.toLocaleString()} | ${c.n === 0 ? 'the start' : kinds[i - 1] === 'break' ? 'yes' : 'no'} |`); }
const inner = out.flatMap(c => c.lines.filter((l, i) => l.shown === 'break' && c.lines.slice(i + 1).some(m => m.who)).map(l => `${l.id} (chapter ${c.n}, after ${c.lines[c.lines.indexOf(l) - 1].id.split('.')[0]})`));
md.push('', `Scene breaks inside chapters, which become transitions: ${inner.join(', ')}.`);
md.push('', '## Every quoted line', '');
for (const c of out) {
  md.push(`### ${c.n}. ${c.title}`, '', '| line | speaker | words | why |', '|---|---|---|---|');
  for (const l of q.filter(l => l.ch === c.n)) { const p = l.id.split('.')[0];
    md.push(`| ${l.id}${l.question ? ' ❓' : ''} | ${cast[l.who].name}${l.mode ? ` (${l.mode})` : ''}${l.continues ? ', continued' : ''} | ${short(l.text).replace(/\|/g, '\\|')} | ${speakers[p].why.replace(/\|/g, '\\|')} |`); }
  md.push('');
}
writeFileSync(PATHS.attribution, md.join('\n'));
console.log(`${PATHS.script}: ${out.length} chapters, ${out.reduce((a, c) => a + c.lines.filter(l => l.who).length, 0)} spoken lines (${q.length} quoted), ${errors.length} errors; ${q.filter(l => l.question).length} open attribution questions in ${PATHS.attribution}`);
