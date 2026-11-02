// check_links.mjs: the built site's own links.   npm run links   (after npm run site)
// Every href and src in site/public's pages that points into the site (relative, or /The-Last-Evolution/…) must reach a
// file, and a #fragment must be an id on that page. Outside addresses are npm run refs's job; #note= and #t= are the
// film's own addresses, read by its script. Exits 1 if any link is broken, so the Pages workflow stops before deploying.
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';

const root = resolve(process.argv[2] || 'site/public'), BASE = '/The-Last-Evolution/';
if (!existsSync(root)) { console.error(`no ${root}: run npm run site first`); process.exit(1); }
const files = [];
(function walk(d) { for (const f of readdirSync(d)) { const p = join(d, f); statSync(p).isDirectory() ? walk(p) : p.endsWith('.html') && files.push(p); } })(root);
const ids = {}, idsOf = f => ids[f] ??= new Set([...readFileSync(f, 'utf8').matchAll(/\sid=\\?"([^"\\]+)/g)].map(m => m[1]));
const film = /^(note=|t=)/;   // the film's own addresses

let bad = 0, n = 0;
for (const f of files) {
  for (const [, u] of readFileSync(f, 'utf8').matchAll(/(?:href|src)=\\?"([^"\\]+)/g)) {
    if (/^[a-z]+:/.test(u) || (u.startsWith('/') && !u.startsWith(BASE))) continue;
    const [path, hash] = u.split('#');
    if (!path && film.test(hash)) continue;
    n++;
    let t = !path ? f : path.startsWith(BASE) ? join(root, path.slice(BASE.length)) : resolve(dirname(f), path);
    if (path && (path.endsWith('/') || (existsSync(t) && statSync(t).isDirectory()))) t = join(t, 'index.html');
    if (!existsSync(t)) { bad++; console.log('missing   ', f.slice(root.length), u); continue; }
    if (hash && t.endsWith('.html') && !film.test(hash) && !idsOf(t).has(hash)) { bad++; console.log('no anchor ', f.slice(root.length), u); }
  }
}
console.log(`${n} links in ${files.length} pages, ${bad} broken`);
process.exit(bad ? 1 : 0);
