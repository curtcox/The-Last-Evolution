// publish_review.mjs: a round's decision pages, put where the site publishes them.   npm run publish-review -- round3
// Copies out/review/<round>/*.html to site/review/<round>/ (committed; build_site.mjs serves it at /review/<round>/ on
// the site), with every audio file, image and video the pages use (in their audio/, img/ and video/ folders). Each file is
// renamed by its content (name-hash.ext), so a redone clip or frame never shows stale from a browser's cache; audio
// above 128 kbps is re-encoded (speech at 64 kbps mono, stereo at 128 kbps) to keep the repo small; and files no page
// uses any more are removed. The samplers call it when they finish,
// so a decision page is on the site as soon as it's pushed.
// The chapter drafts (video/*.mp4) aren't committed: they're files on the repo's "drafts" release, which the pages play
// from there (GitHub serves them as octet-stream, so each player names the type: <source type="video/mp4">, or Safari
// won't play them). An upload that fails is only a warning; the next publish uploads whatever a page names and the
// release lacks.
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync, copyFileSync, rmSync, statSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { REPO } from './notes_md.mjs';

export const RELEASE = 'drafts', VIDEOS = `${REPO}/releases/download/${RELEASE}/`;
// where a chapter's published draft is: the address its page plays, or undefined if it has none yet
export function publishedVideo(round, NN) {
  const page = `site/review/${round}/ch${NN}-draft.html`;
  return existsSync(page) ? readFileSync(page, 'utf8').match(/src="([^"]*ch\d\d-draft-[0-9a-f]{8}\.mp4)"/)?.[1] : undefined;
}

// put files on the release under their published names, skipping those already there
function upload(files) {
  if (!files.size) return 0;
  let have;
  try { have = new Set(execFileSync('gh', ['release', 'view', RELEASE, '--json', 'assets', '--jq', '.assets[].name']).toString().split('\n')); }
  catch (e) { console.warn(`couldn't list the ${RELEASE} release (${e.message.split('\n')[0]}): its videos aren't uploaded; publish again`); return 0; }
  let n = 0;
  mkdirSync('out/upload', { recursive: true });
  for (const [name, from] of files) {
    if (have.has(name)) continue;
    const tmp = `out/upload/${name}`;
    copyFileSync(from, tmp);
    for (let tries = 1; ; tries++) {
      try { execFileSync('gh', ['release', 'upload', RELEASE, tmp, '--clobber'], { stdio: ['ignore', 'ignore', 'pipe'] }); n++; break; }
      catch (e) { if (tries < 3) continue; console.warn(`${name} didn't upload (${e.message.split('\n')[0]}): publish again`); break; }
    }
    rmSync(tmp);
  }
  return n;
}

export function publishReview(round) {
  const src = `out/review/${round}`, dst = `site/review/${round}`;
  const dirs = ['audio', 'img', 'video'].filter(d => existsSync(`${src}/${d}`));
  mkdirSync(dst, { recursive: true });
  for (const d of dirs) mkdirSync(`${dst}/${d}`, { recursive: true });
  const used = new Set(), videos = new Map(), pages = readdirSync(src).filter(f => f.endsWith('.html'));
  for (const page of pages) {
    const html = readFileSync(`${src}/${page}`, 'utf8').replace(/\b(audio|img|video)\/([\w.-]+?)\.(mp3|jpg|png|mp4)\b/g, (m, dir, name, ext) => {
      const from = `${src}/${dir}/${name}.${ext}`;
      if (!existsSync(from)) return m;
      const out = `${dir}/${name}-${createHash('sha256').update(readFileSync(from)).digest('hex').slice(0, 8)}.${ext}`;
      if (dir === 'video' && ext === 'mp4') { videos.set(out.slice(6), from); return VIDEOS + out.slice(6); }
      if (used.has(out)) return out;
      used.add(out);
      if (ext !== 'mp3') { if (!existsSync(`${dst}/${out}`)) copyFileSync(from, `${dst}/${out}`); }
      else if (!existsSync(`${dst}/${out}`)) {
        const [ch, rate] = execFileSync('ffprobe', ['-v', 'error', '-select_streams', 'a:0', '-show_entries', 'stream=channels,bit_rate', '-of', 'csv=p=0', from])
          .toString().trim().split(',').map(Number);
        if (rate > 128000) execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', from, '-ac', String(ch), '-b:a', ch === 1 ? '64k' : '128k', `${dst}/${out}`]);
        else copyFileSync(from, `${dst}/${out}`);
      }
      return out;
    });
    writeFileSync(`${dst}/${page}`, html);
  }
  for (const d of dirs) { for (const f of readdirSync(`${dst}/${d}`)) if (!used.has(`${d}/${f}`)) rmSync(`${dst}/${d}/${f}`); if (!readdirSync(`${dst}/${d}`).length) rmSync(`${dst}/${d}`, { recursive: true }); }
  const bytes = [...used].reduce((a, f) => a + statSync(`${dst}/${f}`).size, 0), sent = upload(videos);
  console.log(`${dst}: ${pages.join(', ')}, ${used.size} files (${(bytes / 1e6).toFixed(1)} MB), published with the site` +
    (videos.size ? `; ${videos.size} videos on the ${RELEASE} release (${sent} uploaded)` : ''));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const rounds = process.argv.slice(2);
  if (!rounds.length) { console.error('which round? e.g. npm run publish-review -- round3'); process.exit(1); }
  for (const r of rounds) publishReview(r);
}
