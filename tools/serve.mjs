// serve.mjs: the local server.   npm run serve   → http://localhost:8077/
//   /           the companion site (site/public/, built by tools/build_site.mjs)
//   /studio/    studio.html and the repo's files beside it, for scrubbing scenes in a browser
//   /review/    the review pages: the working copies the tools write into out/review/ (Round 1's listening page is
//               /review/round1/), else the published ones in site/public/review/, with the index of rounds
// The review pages and their notes API (axol-f's tools/serve.mjs) arrive with the first drafts, in Phase 5.
import { createServer } from 'node:http';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { extname, join, normalize, resolve } from 'node:path';

const PORT = +(process.env.PORT || 8077);
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.mjs': 'text/javascript',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp',
  '.mp4': 'video/mp4', '.mp3': 'audio/mpeg', '.wav': 'audio/wav', '.vtt': 'text/vtt', '.txt': 'text/plain; charset=utf-8' };
const SITE = resolve('site/public'), REPO = resolve('.'), REVIEW = resolve('out/review');

function file(root, rel) {
  const p = normalize(join(root, decodeURIComponent(rel)));
  if (!p.startsWith(root)) return null;                       // nothing outside its root
  if (existsSync(p) && statSync(p).isDirectory()) return existsSync(join(p, 'index.html')) ? join(p, 'index.html') : null;
  return existsSync(p) ? p : null;
}

createServer((req, res) => {
  const url = new URL(req.url, 'http://x');
  if (url.pathname === '/studio') { res.writeHead(302, { Location: '/studio/' }); return res.end(); }
  const [root, rel] = url.pathname.startsWith('/studio/') ? [REPO, url.pathname === '/studio/' ? 'studio.html' : url.pathname.slice(8)]
    : url.pathname.startsWith('/review/') && file(REVIEW, url.pathname.slice(8)) ? [REVIEW, url.pathname.slice(8)]
    : [SITE, url.pathname];
  const p = file(root, rel);
  if (!p) { res.writeHead(404, { 'Content-Type': 'text/plain' }); return res.end('not found'); }
  // a directory asked for without its slash: redirect, so the page's relative links resolve
  if (!url.pathname.endsWith('/') && !extname(url.pathname) && p.endsWith('index.html')) {
    res.writeHead(301, { Location: url.pathname + '/' }); return res.end();
  }
  res.writeHead(200, { 'Content-Type': TYPES[extname(p)] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
  createReadStream(p).pipe(res);
}).listen(PORT, () => console.log(`serving the site at http://localhost:${PORT}/ and the studio at http://localhost:${PORT}/studio/`));
