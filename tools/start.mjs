// start.mjs: the one command for a fresh clone.   npm start
//   1. checks what's needed (Node 20+, and for the film ffmpeg and Chrome) and says how to get what's missing
//   2. installs the packages if they aren't yet (npm ci)
//   3. extracts the story, builds the script and checks it word for word, builds the companion site, serves it and opens
//      it in your browser
// Later phases add step 4, making the film, as axol-f's start.mjs does.
//   npm start -- --no-open     don't open the browser
import { spawn, spawnSync } from 'node:child_process';
import { existsSync, statSync, openSync, mkdirSync } from 'node:fs';

const args = process.argv.slice(2), has = k => args.includes(`--${k}`);
const PORT = +(process.env.PORT || 8077), URL_ = `http://localhost:${PORT}/`;
const on = cmd => spawnSync(process.platform === 'win32' ? 'where' : 'which', [cmd], { stdio: 'ignore' }).status === 0;
const say = s => console.log(`\n▶ ${s}`);
const node = (script, a = []) => spawnSync(process.execPath, [script, ...a], { stdio: 'inherit' }).status === 0;

// ---- 1. what's needed ----
const later = [];
if (+process.versions.node.split('.')[0] < 20) { console.error(`Needed first: Node.js 20 or newer (this is ${process.version}): https://nodejs.org/`); process.exit(1); }
if (!on('ffmpeg') || !on('ffprobe')) later.push(`ffmpeg, to make the videos: ${process.platform === 'darwin' ? 'brew install ffmpeg' : 'https://ffmpeg.org/download.html'}`);
const chrome = [process.env.CHROME_PATH, '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser'].find(p => p && existsSync(p));
if (!chrome) later.push('Google Chrome, which paints the film: https://www.google.com/chrome/ (or set CHROME_PATH to a Chrome or Chromium)');
if (later.length) console.log('The site will work, but the film needs:\n  ' + later.join('\n  '));

// ---- 2. packages ----
const lock = 'package-lock.json', stamp = 'node_modules/.package-lock.json';
if (!existsSync(stamp) || statSync(stamp).mtimeMs < statSync(lock).mtimeMs) {
  say('installing packages (npm ci)');
  if (spawnSync(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['ci', '--no-audit', '--no-fund'], { stdio: 'inherit', shell: process.platform === 'win32' }).status !== 0) process.exit(1);
}

// ---- 3. the site, served and opened ----
say('extracting the story, building the script and checking it, and building the companion site');
if (!['extract_story', 'build_script', 'verbatim_check', 'build_site'].every(t => node(`tools/${t}.mjs`))) process.exit(1);
let up = false; try { up = (await fetch(URL_, { signal: AbortSignal.timeout(2000) })).ok; } catch { }
if (!up) {
  mkdirSync('out', { recursive: true });
  const log = openSync('out/serve.log', 'a');
  spawn(process.execPath, ['tools/serve.mjs'], { detached: true, stdio: ['ignore', log, log] }).unref();
  for (let i = 0; i < 50 && !up; i++) { await new Promise(r => setTimeout(r, 200)); try { up = (await fetch(URL_)).ok; } catch { } }
  if (!up) { console.error('the site server didn\'t start; see out/serve.log'); process.exit(1); }
}
console.log(`the site: ${URL_}   the studio: ${URL_}studio/${existsSync('out/review/round1/index.html') ? `   Round 1's listening page: ${URL_}review/round1/` : ''}`);
if (!has('no-open')) {
  const [cmd, a] = process.platform === 'darwin' ? ['open', [URL_]] : process.platform === 'win32' ? ['cmd', ['/c', 'start', '', URL_]] : ['xdg-open', [URL_]];
  spawn(cmd, a, { stdio: 'ignore', detached: true }).unref();
}
