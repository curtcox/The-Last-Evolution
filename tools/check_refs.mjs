// check_refs.mjs: the notes' sources.   npm run refs
//   1. every [text][id] in notes/*.md has its id in notes/refs.yaml, and every entry there is used
//   2. every URL answers (2xx or 3xx), fetched with a browser's user agent, since some sites turn tools away
//   3. each note's link definitions are rewritten at its foot, between markers, so the notes render on GitHub
// Writes notes/reports/links.md, and exits 1 if an id is missing or a link is dead.
//   --offline     skip step 2
import { readFileSync, writeFileSync, readdirSync, mkdirSync } from 'node:fs';
import YAML from 'yaml';

const refs = YAML.parse(readFileSync('notes/refs.yaml', 'utf8'));
const notes = readdirSync('notes').filter(f => f.endsWith('.md'));
const START = '<!-- refs: written by tools/check_refs.mjs -->', END = '<!-- /refs -->';
const fails = [], used = new Map();

for (const f of notes) {
  let md = readFileSync(`notes/${f}`, 'utf8');
  md = md.replace(new RegExp(`\\n*${START}[\\s\\S]*?${END}\\n?`), '\n');
  const ids = [...new Set([...md.matchAll(/\]\[([a-z0-9-]+)\]/g)].map(m => m[1]))];
  for (const id of ids) { if (!refs[id]) fails.push(`${f}: unknown reference "${id}"`); else used.set(id, [...(used.get(id) || []), f]); }
  const defs = ids.filter(id => refs[id]).map(id => `[${id}]: ${refs[id].url.replace(/ /g, '%20')}`);
  writeFileSync(`notes/${f}`, md.trimEnd() + (defs.length ? `\n\n${START}\n${defs.join('\n')}\n${END}\n` : '\n'));
}
for (const id of Object.keys(refs)) if (!used.has(id)) fails.push(`refs.yaml: "${id}" isn't cited by any note`);

const rows = [];
if (!process.argv.includes('--offline')) {
  const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Safari/537.36';
  await Promise.all(Object.entries(refs).map(async ([id, r]) => {
    let status;
    try { status = (await fetch(r.url, { headers: { 'User-Agent': UA }, redirect: 'follow', signal: AbortSignal.timeout(20000) })).status; }
    catch (e) { status = e.name === 'TimeoutError' ? 'timeout' : e.message; }
    if (!(status >= 200 && status < 400)) fails.push(`${id}: ${r.url} → ${status}`);
    rows.push({ id, status, ...r });
  }));
}
rows.sort((a, b) => a.id.localeCompare(b.id));
mkdirSync('notes/reports', { recursive: true });
writeFileSync('notes/reports/links.md', ['# Links', '', `Written by \`tools/check_refs.mjs\` on ${new Date().toISOString().slice(0, 10)}. ${fails.length ? `**${fails.length} problem(s).**` : '**All good.**'}`, '',
  ...(fails.length ? [...fails.map(f => `- ${f}`), ''] : []),
  '| id | status | kind | cited in | title |', '|---|---|---|---|---|',
  ...rows.map(r => `| ${r.id} | ${r.status} | ${r.kind} | ${(used.get(r.id) || []).join(', ')} | [${r.title}](${r.url}) |`), ''].join('\n'));
if (fails.length) { console.error(fails.join('\n')); process.exit(1); }
console.log(`refs: ${Object.keys(refs).length} sources, all cited${rows.length ? ', all answering' : ''}; definitions written into ${notes.length} notes`);
