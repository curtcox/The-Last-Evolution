// making_of.mjs: the conversation in which Claude made this film, exported from Claude Code's session log → making-of/
//   Adapted from axol-f's (MIT), the project PLAN.md names as this one's model for the making-of.
//   node tools/making_of.mjs [--session=ID]     (npm run making-of)   default: every session of this project
// Claude Code keeps each session as JSON lines in ~/.claude/projects/<this folder, slashes as dashes>/. Only this
// computer has them, so the export is committed.
// What's kept (Curt, 2026-09-29): every message Curt typed, every reply Claude wrote, Claude's visible reasoning, one line
// for each thing Claude did (a command, an edit, a page read), the questions Claude asked and Curt's answers, and the
// helper agents Claude ran, each on a page of its own. What's left out: command output, images, and the notices the app
// adds for Claude (reminders, context summaries); a context summary shows as one line where it happened.
// Scrubbed: Curt's email address, the home folder (→ ~), Claude's scratch folder (→ scratchpad/), Claude Code's folder
// for the project (→ memory/, tool-results/), and anything shaped like an API key or token.
// Output, plain Markdown (each event starts with an `#### Who · time` line, which the site's build splits on):
//   making-of/README.md                  the index
//   making-of/parts/YYYY-MM-DD[-N].md    the conversation, a day at a time (split near 300 KB so GitHub shows each)
//   making-of/helpers/<agent id>.md      each helper agent's own conversation
import { createReadStream, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createInterface } from 'node:readline';
import { homedir } from 'node:os';

const args = Object.fromEntries(process.argv.slice(2).map(a => { const [k, v] = a.replace(/^--/, '').split('='); return [k, v ?? true]; }));
const ROOT = process.cwd(), HOME = homedir(), DIR = `${HOME}/.claude/projects/${ROOT.replace(/[/.]/g, '-')}`, OUT = 'making-of';
const PART_MAX = 300_000;
// on another computer (a fresh clone) there's no session to read: the committed export stands
if (!existsSync(DIR)) { console.log(`no Claude Code sessions for this folder here (${DIR.replace(HOME, '~')}); ${OUT}/ left as it is`); process.exit(0); }
const sessions = args.session ? [args.session] : readdirSync(DIR).filter(f => f.endsWith('.jsonl')).map(f => f.slice(0, -6));

const EMAIL = /[\w.+-]+@gmail\.com/g;
// Claude's scratch folder (the app keeps it under the system's temp folder, named for the user, the project's folder and
// the session) → scratchpad/
const SCRATCH = /(?:\/private)?\/tmp\/claude-\d+\/[^/\s`'"]+\/[0-9a-f-]{36}\/(scratchpad|tasks)\b/g;
// and Claude Code's own folder for this project (its memory, and long command output it set aside) → memory/, tool-results/
const CC = /(?:~|\/Users\/[^/\s]+)\/\.claude\/projects\/[^/\s`'"]+\/(?:[0-9a-f-]{36}\/)?(memory|tool-results|subagents)\b/g;
const USERDIR = HOME.replace(/[/.]/g, '-');   // the home folder as Claude Code spells it in folder names
const scrub = s => String(s).replace(SCRATCH, '$1').replace(CC, '$1').replace(/(?:\/private)?\/tmp\/claude-\d+\/[^\s`'")]*/g, 'scratchpad')
  .replaceAll(USERDIR, '-~').replaceAll(ROOT + '/', '').replaceAll(ROOT, '.').replaceAll(HOME, '~').replace(EMAIL, '[email]')
  .replace(/\b(sk|pk|rk)_[A-Za-z0-9]{20,}/g, '[key]').replace(/\b(ghp|gho|ghs|github_pat)_[A-Za-z0-9_]{20,}/g, '[token]')
  .replace(/\bsk-(ant-|or-v1-|proj-)?[A-Za-z0-9_-]{20,}/g, '[key]').replace(/\bAIza[0-9A-Za-z_-]{30,}/g, '[key]').replace(/(Bearer|xi-api-key:?)\s+[A-Za-z0-9._-]{20,}/gi, '$1 [key]');
// a line of the event's own text that looks like the split marker is pushed down a level, so it can't split the event;
// a link to a file in the repo ([x](tools/x.mjs:12)) goes to that file on GitHub, so it works from anywhere
const REPO = 'https://github.com/curtcox/The-Last-Evolution';
const toRepo = s => !REPO ? s : s.replace(/\]\((?!https?:|mailto:|#|\.\.\/|\/)([^)\s]+?)(?::(\d+))?\)/g, (_, f, n) => `](${REPO}/blob/main/${f.replace(/^\.\//, '')}${n ? '#L' + n : ''})`);
const body = s => toRepo(scrub(s)).replace(/^#### /gm, '##### ').trim();
const oneLine = (s, n = 160) => { s = scrub(String(s ?? '')).replace(/\s+/g, ' ').trim(); return s.length > n ? s.slice(0, n - 1) + '…' : s; };
const code = s => '`' + oneLine(s, 140).replace(/`/g, "'") + '`';
const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
const local = (iso, o) => new Date(iso).toLocaleString('en-GB', { timeZone: tz, ...o });
const dayOf = iso => { const d = new Date(iso); return new Date(d.toLocaleString('en-US', { timeZone: tz })).toLocaleDateString('sv'); };
const clock = iso => local(iso, { hour: '2-digit', minute: '2-digit', hour12: false });
const longDay = iso => local(iso, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

// ---- one line for each thing Claude did ----
const helperFor = new Map();   // the Agent call's id → the helper's id (its .meta.json names the call)
function action(b) {
  const i = b.input || {}, n = b.name;
  const mcp = n.match(/^mcp__(.+?)__(.+)$/);
  switch (n) {
    case 'Bash': return i.description ? `Ran: ${oneLine(i.description)}` : `Ran ${code(i.command)}`;
    case 'Read': return `Read ${code(i.file_path)}`;
    case 'Edit': case 'MultiEdit': return `Edited ${code(i.file_path)}`;
    case 'Write': return `Wrote ${code(i.file_path)}`;
    case 'NotebookEdit': return `Edited ${code(i.notebook_path)}`;
    case 'Grep': return `Searched the files for ${code(i.pattern)}`;
    case 'Glob': return `Listed ${code(i.pattern)}`;
    case 'WebSearch': return `Searched the web: ${oneLine(i.query)}`;
    case 'WebFetch': return `Read the web page ${i.url}`;
    case 'Agent': case 'Task': { const h = helperFor.get(b.id); return `Started a helper: ${h ? `[${oneLine(i.description)}](../helpers/${h}.md)` : oneLine(i.description)}`; }
    case 'ScheduleWakeup': return `Set a check-in for ${Math.round((i.delaySeconds || 0) / 60)} min later: ${oneLine(i.reason)}`;
    case 'TaskStop': case 'KillShell': return 'Stopped a background job';
    case 'TodoWrite': return 'Updated its to-do list';
    case 'Skill': return `Loaded the skill ${code(i.skill)}`;
    case 'ToolSearch': case 'SubagentHandback': return null;
    case 'Artifact': return `Artifact: ${i.action || 'publish'} ${oneLine(i.file_path || i.url || '')}`;
    case 'SendUserFile': return `Sent Curt ${(i.files || []).map(code).join(', ')}`;
  }
  if (mcp) {
    const [, server, tool] = mcp, where = /Browser|chrome/i.test(server) ? 'Browser' : /computer-use/.test(server) ? 'Computer' : /Simulator/.test(server) ? 'Simulator' : server.replace(/^ccd_/, '');
    const verb = { javascript_tool: 'ran a script in the page', browser_batch: 'did several steps', get_page_text: 'read the page', read_page: 'read the page',
      navigate: 'opened', preview_start: 'opened', tabs_close: 'closed a tab', tabs_close_mcp: 'closed a tab', computer: i.action, find: 'looked for' }[tool] ?? tool.replace(/^app_/, '').replace(/_/g, ' ');
    const what = ['javascript_tool', 'browser_batch', 'computer'].includes(tool) ? '' : i.url || i.query || i.name || '';
    return `${where}: ${verb}${what ? ' ' + oneLine(what, 100) : ''}`;
  }
  return `${n}${Object.values(i).find(v => typeof v === 'string') ? ': ' + oneLine(Object.values(i).find(v => typeof v === 'string'), 100) : ''}`;
}
// what Curt typed: the app's notices taken out, and pasted text shown as pasted
const typed = c => c.replace(/<system-reminder>[\s\S]*?<\/system-reminder>/g, '')
  .replace(/<pasted_content[^>]*>\n?([\s\S]*?)\n?<\/pasted_content[^>]*>/g, (_, p) => `\n*Pasted:*\n\n\`\`\`\n${p.replace(/```/g, "'''")}\n\`\`\`\n`).trim();
const resultText = c => typeof c === 'string' ? c : Array.isArray(c) ? c.filter(x => x.type === 'text').map(x => x.text).join('\n') : '';

// ---- a session log → events: { who, t, text } or { who: 'did', t, items } ----
async function eventsOf(file, helper) {
  const ev = [], seen = new Set(), asks = new Map();
  const push = (who, t, text) => { if (text && text.trim()) ev.push({ who, t, text }); };
  const did = (t, line) => { if (!line) return; const e = ev.at(-1); if (e && e.who === 'did') e.items.push(line); else ev.push({ who: 'did', t, items: [line] }); };
  for await (const line of createInterface({ input: createReadStream(file), crlfDelay: Infinity })) {
    if (!line.trim()) continue;
    let o; try { o = JSON.parse(line); } catch { continue; }
    if (o.uuid) { if (seen.has(o.uuid)) continue; seen.add(o.uuid); }
    const t = o.timestamp, c = o.message?.content;
    if (o.type === 'user') {
      if (o.isCompactSummary) { push('note', t, "Claude's working memory filled up here, and was replaced by a summary of the conversation so far."); continue; }
      if (typeof c === 'string') {
        if (o.isMeta) continue;
        if (c.startsWith('<command-name>')) { push('note', t, `Curt ran ${c.match(/<command-name>(.*?)<\/command-name>/)?.[1]}`); continue; }
        if (c.startsWith('<task-notification>')) { did(t, oneLine(c.match(/<summary>([\s\S]*?)<\/summary>/)?.[1] || 'A background job finished')); continue; }
        if (c.startsWith('<') || c.startsWith('This session is being continued from a previous conversation')) continue;
        push(helper ? 'asker' : 'curt', t, body(typed(c)));
      } else if (Array.isArray(c)) for (const b of c) {
        if (b.type === 'text' && !o.isMeta && !b.text.startsWith('<')) push(helper ? 'asker' : 'curt', t, body(typed(b.text)));
        if (b.type !== 'tool_result') continue;
        const r = resultText(b.content);
        if (asks.has(b.tool_use_id)) push('answer', t, body(r.replace(/^User has answered your questions:\s*/, '').replace(/\. You can now continue.*$/s, '')));
        // a refused tool call, with what Curt typed instead (not just any output that mentions the words)
        const said = r.match(/^The user doesn't want to proceed[\s\S]*?the user said:\s*([\s\S]+)$/i);
        if (said) push('curt', t, body(said[1]));
      }
    } else if (o.type === 'assistant' && Array.isArray(c)) for (const b of c) {
      if (b.type === 'text') push('claude', t, body(b.text));
      else if (b.type === 'thinking' && b.thinking?.trim()) push('thinking', t, body(b.thinking));
      else if (b.type === 'tool_use' && b.name === 'AskUserQuestion') {
        asks.set(b.id, 1);
        push('ask', t, (b.input.questions || []).map(q => `**${scrub(q.question)}**\n${q.options.map(x => `- ${scrub(x.label)}: ${scrub(x.description)}`).join('\n')}`).join('\n\n'));
      } else if (b.type === 'tool_use') did(t, action(b));
    }
  }
  return ev;
}
const WHO = { curt: 'Curt', claude: 'Claude', thinking: "Claude's reasoning", did: 'Claude did', ask: 'Claude asked', answer: 'Curt answered', note: 'Note', asker: 'Claude, to the helper' };
const helperWho = { ...WHO, claude: 'The helper', thinking: "The helper's reasoning", did: 'The helper did' };
const md = (e, who = WHO) => `#### ${who[e.who]} · ${clock(e.t)}\n\n${e.who === 'did' ? e.items.map(x => `- ${x}`).join('\n') : e.text}\n`;

// ---- write ----
if (existsSync(OUT)) for (const d of ['parts', 'helpers']) rmSync(`${OUT}/${d}`, { recursive: true, force: true });
mkdirSync(`${OUT}/parts`, { recursive: true }); mkdirSync(`${OUT}/helpers`, { recursive: true });
const helpers = [];
for (const s of sessions) {
  const sub = `${DIR}/${s}/subagents`;
  if (existsSync(sub)) for (const f of readdirSync(sub).filter(f => f.endsWith('.meta.json'))) {
    const meta = JSON.parse(readFileSync(`${sub}/${f}`, 'utf8')), id = f.replace('.meta.json', '');
    helperFor.set(meta.toolUseId, id);
    helpers.push({ id, file: `${sub}/${id}.jsonl`, description: meta.description || id });
  }
}
const all = [];
// a session continued from another carries copies of the last messages, with new ids: each is kept once
const once = new Set();
for (const s of sessions) for (const e of await eventsOf(`${DIR}/${s}.jsonl`, false)) {
  const k = e.who + e.t + (e.text ?? e.items.join('\n'));
  if (!once.has(k)) { once.add(k); all.push(e); }
}
all.sort((a, b) => a.t < b.t ? -1 : a.t > b.t ? 1 : 0);

// a part: one day, or a slice of one; a new slice starts only at something Curt said
const parts = [];
for (const e of all) {
  const day = dayOf(e.t); let p = parts.at(-1);
  if (!p || p.day !== day || (p.size > PART_MAX && e.who === 'curt')) parts.push(p = { day, events: [], size: 0 });
  p.events.push(e); p.size += md(e).length;
}
parts.forEach((p, i) => { const same = parts.filter(q => q.day === p.day); p.name = same.length > 1 ? `${p.day}-${same.indexOf(p) + 1}` : p.day; p.i = i; });
const TITLE = 'Making "The Last Evolution"';
for (const p of parts) {
  const prev = parts[p.i - 1], next = parts[p.i + 1], same = parts.filter(q => q.day === p.day);
  const nav = [prev && `[← ${prev.name}](${prev.name}.md)`, '[All parts](../README.md)', next && `[${next.name} →](${next.name}.md)`].filter(Boolean).join(' · ');
  const head = `# ${TITLE}, part ${p.i + 1} of ${parts.length}: ${longDay(p.events[0].t)}${same.length > 1 ? ` (${same.indexOf(p) + 1} of ${same.length})` : ''}\n\n${nav}\n\nTimes are ${tz.replace('_', ' ')} time.\n\n`;
  writeFileSync(`${OUT}/parts/${p.name}.md`, head + p.events.map(e => md(e)).join('\n') + `\n---\n\n${nav}\n`);
}
for (const h of helpers) {
  if (!existsSync(h.file)) continue;
  const ev = await eventsOf(h.file, true);
  h.t = ev[0]?.t; h.part = h.t && parts.find(p => p.events.some(e => e.t >= h.t))?.name;
  writeFileSync(`${OUT}/helpers/${h.id}.md`, `# Helper: ${scrub(h.description)}\n\n${h.part ? `Started in [${h.part}](../parts/${h.part}.md). ` : ''}[All parts](../README.md)\n\nA helper is another copy of Claude, started with its own instructions for one job. It sees only what it's given.\n\n` + ev.map(e => md(e, helperWho)).join('\n'));
}
const count = w => all.filter(e => e.who === w).length;
const first = p => p.events.find(e => e.who === 'curt');
writeFileSync(`${OUT}/README.md`, `# ${TITLE}: the whole conversation

The film was made in conversation: Curt asked, and Claude, in Claude Code, planned it, wrote the code that draws, voices
and assembles it, built the site, and ran the review rounds and the quality loop. This is that conversation, from Claude
Code's own record of each session, a day at a time. The decisions it reached are in [DECISIONS.md](../DECISIONS.md).

It has every message Curt typed (${count('curt')}), every reply Claude wrote (${count('claude')}), Claude's visible reasoning (${count('thinking')} notes), and one
line for each thing Claude did: each command, file edit and page read (${all.filter(e => e.who === 'did').reduce((n, e) => n + e.items.length, 0)} in all). It leaves out what those
commands printed, the images, and the notices the app adds for Claude. When Claude's working memory filled up, it was
replaced by a summary; a one-line note marks each place (${all.filter(e => e.who === 'note' && e.text.startsWith("Claude's")).length} times). Curt's email address and the home folder are
removed. Times are ${tz.replace('_', ' ')} time.

Made by \`npm run making-of\` (tools/making_of.mjs).

## The parts

| part | day | from | Curt's first request |
|---|---|---|---|
${parts.map(p => { const f = first(p); return `| [${p.i + 1}](parts/${p.name}.md) | ${longDay(p.events[0].t)} | ${clock(p.events[0].t)} | ${f ? oneLine(f.text.replace(/\|/g, '/'), 90) : ''} |`; }).join('\n')}

## The helpers

Claude sometimes started a helper: another copy of itself with its own instructions, for one job (say, describing frames
it has never seen, to check that the pictures read without the words).

${helpers.filter(h => existsSync(`${OUT}/helpers/${h.id}.md`)).sort((a, b) => (a.t || '') < (b.t || '') ? -1 : 1).map(h => `- [${oneLine(h.description)}](helpers/${h.id}.md)${h.t ? ` (${longDay(h.t)}, ${clock(h.t)})` : ''}`).join('\n')}
`);
console.log(`${OUT}/: ${parts.length} parts, ${helpers.length} helpers; ${count('curt')} of Curt's messages, ${count('claude')} of Claude's replies`);
