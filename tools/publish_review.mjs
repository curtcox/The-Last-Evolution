// publish_review.mjs: a round's decision pages, put where the site publishes them.   npm run publish-review -- round3
// Copies out/review/<round>/*.html to site/review/<round>/ (committed; build_site.mjs serves it at /review/<round>/ on
// the site), with every audio file, image and video the pages use (in their audio/, img/ and video/ folders). Each file is
// renamed by its content (name-hash.ext), so a redone clip or frame never shows stale from a browser's cache; audio
// above 128 kbps is re-encoded (speech at 64 kbps mono, stereo at 128 kbps) to keep the repo small; and files no page
// uses any more are removed. The samplers call it when they finish,
// so a decision page is on the site as soon as it's pushed.
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync, copyFileSync, rmSync, statSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

export function publishReview(round) {
  const src = `out/review/${round}`, dst = `site/review/${round}`;
  const dirs = ['audio', 'img', 'video'].filter(d => existsSync(`${src}/${d}`));
  mkdirSync(dst, { recursive: true });
  for (const d of dirs) mkdirSync(`${dst}/${d}`, { recursive: true });
  const used = new Set(), pages = readdirSync(src).filter(f => f.endsWith('.html'));
  for (const page of pages) {
    const html = readFileSync(`${src}/${page}`, 'utf8').replace(/\b(audio|img|video)\/([\w.-]+?)\.(mp3|jpg|png|mp4)\b/g, (m, dir, name, ext) => {
      const from = `${src}/${dir}/${name}.${ext}`;
      if (!existsSync(from)) return m;
      const out = `${dir}/${name}-${createHash('sha256').update(readFileSync(from)).digest('hex').slice(0, 8)}.${ext}`;
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
  for (const d of dirs) for (const f of readdirSync(`${dst}/${d}`)) if (!used.has(`${d}/${f}`)) rmSync(`${dst}/${d}/${f}`);
  const bytes = [...used].reduce((a, f) => a + statSync(`${dst}/${f}`).size, 0);
  console.log(`${dst}: ${pages.join(', ')}, ${used.size} files (${(bytes / 1e6).toFixed(1)} MB), published with the site`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const rounds = process.argv.slice(2);
  if (!rounds.length) { console.error('which round? e.g. npm run publish-review -- round3'); process.exit(1); }
  for (const r of rounds) publishReview(r);
}
