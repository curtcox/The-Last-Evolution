// notes_md.mjs: the notes' Markdown as HTML, for the film page (tools/annotated.mjs) and the site's notes pages
// (tools/build_site.mjs). As much as the notes use: ## headings, with GitHub's anchors so a link into a section works on
// both; paragraphs; - lists; > quotes; | tables; *italic*, **bold**, `code`; [text][ref-id] (notes/refs.yaml) and
// [text](url). Links are made to work from a page `up` from the site's root: the site's own address (or /path) is a
// relative link, another note (science.md#…) is that note's page on the site, and any other file in the repository is
// shown on GitHub. The notes write the site's full address, so the link works on GitHub too.
import { readFileSync } from 'node:fs';
import YAML from 'yaml';

export const REPO = 'https://github.com/curtcox/The-Last-Evolution', SITE = 'https://curtcox.github.io/The-Last-Evolution/';
export const NOTES = ['science', 'succession', 'history', 'factcheck'];   // the notes with pages of their own: notes/NAME/
const refs = YAML.parse(readFileSync('notes/refs.yaml', 'utf8'));
export const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
// a heading's anchor, as GitHub makes it: lower case, punctuation dropped, spaces as hyphens
export const slug = s => s.toLowerCase().replace(/[^\p{L}\p{N}_\s-]/gu, '').trim().replace(/\s/g, '-');

const note = new RegExp(`^(?:${REPO}/blob/main/notes/)?(${NOTES.join('|')})\\.md(#.*)?$`);
export function link(u, up) {
  const m = u.match(note);
  if (m) return `${up}notes/${m[1]}/${m[2] || ''}`;
  if (u.startsWith(SITE)) return up + u.slice(SITE.length);
  if (/^[a-z]+:/.test(u)) return u;
  if (u.startsWith('/')) return up + u.slice(1);
  const at = new URL(u, 'https://repo/notes/');   // a file in the repository, as GitHub shows it
  return `${REPO}/blob/main${at.pathname}${at.hash}`;
}
export const inline = (s, up) => esc(s).replace(/`([^`]+)`/g, '<code>$1</code>')
  .replace(/\[([^\]]+)\]\[([a-z0-9-]+)\]/g, (m, t, id) => { if (!refs[id]) throw new Error(`unknown reference ${id}`); return `<a href="${esc(refs[id].url)}">${t}</a>`; })
  .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (m, t, u) => `<a href="${link(u, up)}">${t}</a>`)
  .replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>').replace(/\*([^*]+)\*/g, '<i>$1</i>');

// a table: its header row, then the rows; a reference id in a cell (the fact-check list's sources) links to its source
function table(rows, up) {
  const cells = r => r.replace(/^\|/, '').replace(/\|$/, '').split('|').map(c => c.trim());
  let inA = false;   // only text outside tags and links
  const cell = c => inline(c, up).split(/(<[^>]+>)/).map(t => t.startsWith('<') ? (inA = /^<a\b/.test(t) || (inA && !/^<\/a>/.test(t)), t)
    : inA ? t : t.replace(/\b[a-z0-9]+(?:-[a-z0-9]+)*\b/g, id => refs[id] ? `<a href="${esc(refs[id].url)}">${id}</a>` : id)).join('');
  const [head, , ...body] = rows.map(cells);
  return `<div class="tbl"><table><thead><tr>${head.map(c => `<th>${inline(c, up)}</th>`).join('')}</tr></thead><tbody>${
    body.map(r => `<tr>${r.map(c => `<td>${cell(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
}

// a note file → { title, html }. Its title, the italic line under it and the link definitions are for the repository,
// not the page. `h` is the level a ## heading takes on the page. A line of paragraph ids under a heading
// ("*p015, p041 · chapters 2, 4*") links each to its paragraph on the Read page.
export function markdown(file, { up, h = 2 }) {
  const src = readFileSync(file, 'utf8').replace(/<!-- refs:[\s\S]*?<!-- \/refs -->/, '');
  const blocks = src.split(/\n\s*\n/).map(b => b.trim()).filter(Boolean);
  const title = blocks.shift().replace(/^#\s*/, '');
  if (/^\*[^*]/.test(blocks[0])) blocks.shift();
  const out = [], starts = /^(#{2,} |- |> |\|)/;
  for (const b of blocks) {
    const lines = b.split('\n');
    for (let i = 0; i < lines.length;) {
      const l = lines[i];
      if (/^#{2,} /.test(l)) {
        const n = l.match(/^#+/)[0].length + h - 2, t = l.replace(/^#+\s*/, '');
        out.push(`<h${n} id="${slug(t)}">${inline(t, up)}</h${n}>`); i++;
      } else if (l.startsWith('|')) {
        const rows = []; while (i < lines.length && lines[i].startsWith('|')) rows.push(lines[i++]);
        out.push(table(rows, up));
      } else if (l.startsWith('> ')) {
        const q = []; while (i < lines.length && lines[i].startsWith('>')) q.push(lines[i++].replace(/^>\s?/, ''));
        out.push(`<blockquote><p>${inline(q.join(' '), up)}</p></blockquote>`);
      } else if (l.startsWith('- ')) {
        const items = []; while (i < lines.length && !/^(#{2,} |> |\|)/.test(lines[i]))
          lines[i].startsWith('- ') ? items.push(lines[i++].slice(2)) : items[items.length - 1] += ' ' + lines[i++].trim();
        out.push(`<ul>${items.map(li => `<li>${inline(li, up)}</li>`).join('')}</ul>`);
      } else {
        const p = []; while (i < lines.length && (!p.length || !starts.test(lines[i]))) p.push(lines[i++].trim());
        const text = p.join(' ');
        out.push(/^\*p\d{3}\b[^*]*\*$/.test(text)
          ? `<p class="where">${inline(text, up).replace(/\bp(\d{3})\b/g, (m, n) => `<a href="${up}read/#p${n}">¶${+n}</a>`)}</p>`
          : `<p>${inline(text, up)}</p>`);
      }
    }
  }
  return { title, html: out.join('\n') };
}
