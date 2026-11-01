// publish_review.mjs: a round's decision pages, put where the site publishes them.   npm run publish-review -- round3
// Copies out/review/<round>/*.html to site/review/<round>/ (committed; build_site.mjs serves it at /review/<round>/ on
// the site), with every audio file the pages play. Each file is renamed by its content (name-hash.mp3), so a redone clip
// never plays stale from a browser's cache; anything above 128 kbps is re-encoded (speech at 64 kbps mono, stereo at
// 128 kbps) to keep the repo small; and files no page plays any more are removed. The samplers call it when they finish,
// so a decision page is on the site as soon as it's pushed.
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync, copyFileSync, rmSync, statSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

export function publishReview(round) {
  const src = `out/review/${round}`, dst = `site/review/${round}`;
  mkdirSync(`${dst}/audio`, { recursive: true });
  const used = new Set(), pages = readdirSync(src).filter(f => f.endsWith('.html'));
  for (const page of pages) {
    const html = readFileSync(`${src}/${page}`, 'utf8').replace(/audio\/([\w.-]+)\.mp3/g, (m, name) => {
      const from = `${src}/audio/${name}.mp3`;
      if (!existsSync(from)) return m;
      const out = `${name}-${createHash('sha256').update(readFileSync(from)).digest('hex').slice(0, 8)}.mp3`;
      used.add(out);
      if (!existsSync(`${dst}/audio/${out}`)) {
        const [ch, rate] = execFileSync('ffprobe', ['-v', 'error', '-select_streams', 'a:0', '-show_entries', 'stream=channels,bit_rate', '-of', 'csv=p=0', from])
          .toString().trim().split(',').map(Number);
        if (rate > 128000) execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', from, '-ac', String(ch), '-b:a', ch === 1 ? '64k' : '128k', `${dst}/audio/${out}`]);
        else copyFileSync(from, `${dst}/audio/${out}`);
      }
      return `audio/${out}`;
    });
    writeFileSync(`${dst}/${page}`, html);
  }
  for (const f of readdirSync(`${dst}/audio`)) if (!used.has(f)) rmSync(`${dst}/audio/${f}`);
  const bytes = [...used].reduce((a, f) => a + statSync(`${dst}/audio/${f}`).size, 0);
  console.log(`${dst}: ${pages.join(', ')}, ${used.size} audio files (${(bytes / 1e6).toFixed(1)} MB), published with the site`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const rounds = process.argv.slice(2);
  if (!rounds.length) { console.error('which round? e.g. npm run publish-review -- round3'); process.exit(1); }
  for (const r of rounds) publishReview(r);
}
