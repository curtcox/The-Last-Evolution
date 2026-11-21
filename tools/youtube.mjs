// youtube.mjs: everything the upload needs, in youtube/ (git-ignored).   node tools/youtube.mjs [--no-video]
//   the-last-evolution.mp4        the twelve chapters' current drafts joined end to end (stream copy, no re-encode)
//   captions.en.vtt, .srt         the whole film's captions, from the voice's word timings, the speaker named, as the
//                                 annotated film's player makes them per chapter (tools/annotated.mjs)
//   thumbnail-*.jpg               1280×720 options, each under YouTube's 2 MB
//   title.txt, description.txt, tags.txt, chapters.txt
//   README.md                     the upload's settings, and what's still a draft
// Chapter times come from the videos' own durations, so the markers and captions match the joined file.
import { readFileSync, writeFileSync, mkdirSync, existsSync, statSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import puppeteer from 'puppeteer-core';
import { readYaml, respeller, storyWords, PATHS } from './script_lib.mjs';

const OUT = 'youtube', SITE = 'https://curtcox.github.io/The-Last-Evolution/', REPO = 'https://github.com/curtcox/The-Last-Evolution';
const noVideo = process.argv.includes('--no-video');
mkdirSync(OUT, { recursive: true });
const cast = readYaml('script/cast.yaml'), say = respeller(readYaml(PATHS.pronounce));
const who = id => id === 'narrator' ? '' : (s => s[0].toUpperCase() + s.slice(1))(cast[id].name.split(',')[0]);
const video = n => n === 5 ? 'out/review/round5/video/ch05-draft.mp4' : `out/review/round6/video/ch${String(n).padStart(2, '0')}-draft.mp4`;
const probe = f => +execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f], { encoding: 'utf8' });

// the chapters, each at the time it starts in the joined file
let at = 0;
const chapters = [];
for (let n = 0; n <= 11; n++) {
  const NN = String(n).padStart(2, '0'), TL = JSON.parse(readFileSync(`out/ch${NN}/timeline.json`, 'utf8')), f = video(n);
  if (!existsSync(f)) throw new Error(`chapter ${n} has no draft video at ${f}`);
  const dur = probe(f);
  chapters.push({ n, title: TL.title, at, dur, file: f, lines: TL.lines.map(l => ({ who: who(l.who), words: storyWords(l, say) })) });
  at += dur;
}
const total = at;
const hms = s => { const d = Math.floor(s), h = Math.floor(d / 3600), m = Math.floor(d % 3600 / 60); return (h ? h + ':' + String(m).padStart(2, '0') : m) + ':' + String(d % 60).padStart(2, '0'); };

// captions: cues of a line or two, broken at a sentence's end or when long; the speaker named when the voice changes
const cues = [];
let speaking = '';   // the speaker is named when the voice changes, not on every line of the same speech
for (const c of chapters) for (const l of c.lines) {
  let cue = [];
  const flush = end => { if (!cue.length) return; cues.push({ t0: c.at + cue[0][1], t1: c.at + end, text: (l.who && l.who !== speaking ? l.who + ': ' : '') + cue.map(w => w[0]).join(' ') }); speaking = l.who; cue = []; };
  l.words.forEach(w => { const len = cue.reduce((a, x) => a + x[0].length + 1, 0);
    if (cue.length && (len + w[0].length > 74 || (/[.?!]["”’]*$/.test(cue.at(-1)[0]) && len > 20) || (/[,;:—-]$/.test(cue.at(-1)[0]) && len > 50))) flush(w[1]);
    cue.push(w); });
  const last = l.words.at(-1); flush(last ? last[1] + .9 : 0);
}
cues.forEach((q, i) => { if (cues[i + 1] && q.t1 > cues[i + 1].t0) q.t1 = cues[i + 1].t0; if (q.t1 <= q.t0) q.t1 = q.t0 + .5; });
const clean = s => s.replace(/--/g, '—').replace(/_([^_]+)_/g, '$1');
const ts = (s, sep) => new Date(s * 1000).toISOString().slice(11, 23).replace('.', sep);
writeFileSync(`${OUT}/captions.en.vtt`, 'WEBVTT\n\n' + cues.map(q => `${ts(q.t0, '.')} --> ${ts(q.t1, '.')}\n${clean(q.text)}`).join('\n\n') + '\n');
writeFileSync(`${OUT}/captions.en.srt`, cues.map((q, i) => `${i + 1}\n${ts(q.t0, ',')} --> ${ts(q.t1, ',')}\n${clean(q.text)}`).join('\n\n') + '\n');

// the text
const TITLE = 'The Last Evolution (1932) by John W. Campbell, Jr.: the full story, voiced and painted';   // DECISIONS.md, Round 1
const chapterList = chapters.map(c => `${hms(c.at)} ${c.n}. ${c.title}`).join('\n');
const description = `John W. Campbell, Jr.'s "The Last Evolution", from Amazing Stories for August 1932, read in full. Every word of it is in the film, in order, spoken by a cast of voices over paintings in the manner of the magazine's own ink illustrations.

The story is a machine's memoir. Its first line tells you the machine is the last of its kind; the rest tells how it came to be, and what came after mankind. Campbell was 22 when it appeared. That year the neutron was found, the atom was first split by a machine, and the positron was photographed. There was no electronic computer anywhere.

Watch it with notes beside the picture (the 1932 science, the story's two printings, and the idea of machines as our heirs, before Campbell and since), with a foreword and an afterword:
${SITE}watch/

Read the story, with its footnotes and Leo Morey's 1932 illustration: ${SITE}read/
How it was made, round by round: ${SITE}review/
The artistic choices, and how sure we are of each: ${SITE}notes/choices/

CHAPTERS
${chapterList}

THE TEXT
The 1961 reprint, as transcribed by Project Gutenberg (eBook #27462), with the 1932 readings restored wherever 1961 lost or changed words; the Read page marks each one. The story keeps its 1932 language. Neither printing's copyright was renewed, so the story and Morey's illustration are in the public domain in the US.

WHO MADE THIS
Made by Curt Cox with Claude, an AI model made by Anthropic. The voices, music and sound effects are AI-generated with ElevenLabs; each voice was designed for its part, and none is a real person's. The pictures are painted in code with p5.js and p5.brush. Every design is original, except Leo Morey's illustration, which chapter 5 shows as it was printed. An AI helping to tell a 1932 story about machines inheriting the Earth is an irony we'd rather name than hide.

Source, and corrections welcome: ${REPO}

#ScienceFiction #Audiobook #ClassicSciFi
`;
const tags = ['The Last Evolution', 'John W. Campbell', 'John W. Campbell Jr.', 'Amazing Stories', '1932', 'science fiction',
  'classic science fiction', 'pulp science fiction', 'golden age science fiction', 'sci-fi short story', 'full cast audiobook',
  'audio drama', 'public domain', 'animated story', 'ink wash animation', 'artificial intelligence', 'machines', 'robots',
  'AI succession', 'Leo Morey', 'Don A. Stuart', 'Twilight', 'pulp magazine', 'old time sci-fi'];
const tagsText = tags.join(', ');
for (const [what, len, max] of [['title', TITLE.length, 100], ['description', description.length, 5000], ['tags', tagsText.length, 500]])
  if (len > max) throw new Error(`the ${what} is ${len} characters, over YouTube's ${max}`);
if (/[<>]/.test(description + tagsText + TITLE)) throw new Error('YouTube refuses < and > in the title, description and tags');
writeFileSync(`${OUT}/title.txt`, TITLE + '\n');
writeFileSync(`${OUT}/description.txt`, description);
writeFileSync(`${OUT}/tags.txt`, tagsText + '\n');
writeFileSync(`${OUT}/chapters.txt`, chapterList + '\n');

// the thumbnails: a frame from the film (or Morey's page) beside the title, lettered as the chapter pages are
const frame = (n, t, name) => { execFileSync('ffmpeg', ['-v', 'error', '-y', '-ss', String(t), '-i', video(n), '-frames:v', '1', '-q:v', '2', `${OUT}/.${name}.jpg`]); return `.${name}.jpg`; };
const THUMBS = [
  { name: 'birth', img: frame(5, 273, 'birth'), note: "chapter 5, F-2's birth: F-1 towering, the newborn in its aura, Roal's arm up (Morey's composition)",
    w: 820, css: 'background-size: 1280px 720px; background-position: -205px 0', side: 'right' },
  { name: 'morey', img: '../site/img/morey_1932_p415.jpg', note: "Leo Morey's illustration for the story, Amazing Stories, August 1932 (public domain in the US)",
    w: 600, css: 'background-size: 560px auto; background-position: center 18%', side: 'right', paper: true },
  { name: 'beam', img: frame(9, 150, 'beam'), note: 'chapter 9, the red beam that kills the globe of force, on the black of the storm',
    w: 0, full: 'background: #120F0C url(".beam.jpg") no-repeat 360px 0 / 1280px 720px', side: 'right', dark: true },
];
const page = t => `<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Old+Standard+TT:ital,wght@0,400;0,700;1,400&family=Bebas+Neue&display=block">
<style>
html,body{margin:0;width:1280px;height:720px;overflow:hidden}
.t{position:relative;width:1280px;height:720px;display:flex;flex-direction:row-reverse;justify-content:flex-end;${t.full || 'background:#E9DFC9'}}
.pic{flex:0 0 ${t.w}px;${t.full ? '' : `background:#2A221B url("${t.img}") no-repeat;${t.css}`}}
.txt{flex:${t.full ? '0 0 520px' : '1'};box-sizing:border-box;min-width:0;display:flex;flex-direction:column;justify-content:center;padding:0 ${t.w > 700 ? 38 : 52}px;
  background:${t.full ? 'transparent' : 'radial-gradient(ellipse at 40% 40%, #F1E7D2, #DCCDAE)'};color:${t.dark ? '#EFE4CC' : '#2A1F16'}}
.k{font:italic ${t.w > 700 ? 22 : 30}px "Old Standard TT";white-space:nowrap;opacity:.85;margin-bottom:10px}
h1{font:400 ${t.w > 700 ? 98 : 120}px/0.88 "Bebas Neue";letter-spacing:2px;margin:0;color:${t.dark ? '#F5EAD2' : '#241A12'}}
.rule{height:0;border-top:3px double currentColor;border-bottom:1px solid currentColor;padding-top:3px;margin:22px 0 18px;width:88%;opacity:.7}
.by{font:700 ${t.w > 700 ? 27 : 34}px "Old Standard TT";letter-spacing:1px;white-space:nowrap}
.sub{font:italic ${t.w > 700 ? 22 : 30}px "Old Standard TT";margin-top:14px;white-space:nowrap;color:${t.dark ? '#F08A5D' : '#7A3B1E'}}
</style></head><body><div class="t"><div class="pic"></div><div class="txt">
<div class="k">Amazing Stories · August 1932</div><h1>The Last<br>Evolution</h1><div class="rule"></div>
<div class="by">John W. Campbell, Jr.</div><div class="sub">The full story, voiced and painted</div></div></div></body></html>`;
const CHROME = [process.env.CHROME_PATH, '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/chromium'].find(p => p && existsSync(p));
const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ['--allow-file-access-from-files'] });
const tab = await browser.newPage();
await tab.setViewport({ width: 1280, height: 720 });
for (const t of THUMBS) {
  writeFileSync(`${OUT}/.thumb.html`, page(t));
  await tab.goto(pathToFileURL(resolve(`${OUT}/.thumb.html`)).href, { waitUntil: 'networkidle0' });
  await tab.evaluate(() => document.fonts.ready);
  await tab.screenshot({ path: `${OUT}/thumbnail-${t.name}.jpg`, type: 'jpeg', quality: 90 });
  if (statSync(`${OUT}/thumbnail-${t.name}.jpg`).size > 2e6) throw new Error(`thumbnail-${t.name}.jpg is over 2 MB`);
}
await browser.close();

// the film
if (!noVideo) {
  writeFileSync(`${OUT}/.concat.txt`, chapters.map(c => `file '${resolve(c.file)}'`).join('\n') + '\n');
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', `${OUT}/.concat.txt`, '-c', 'copy', '-movflags', '+faststart', `${OUT}/the-last-evolution.mp4`]);
}

for (const f of ['.thumb.html', '.birth.jpg', '.beam.jpg', '.concat.txt']) rmSync(`${OUT}/${f}`, { force: true });
const mb = f => existsSync(f) ? (statSync(f).size / 1e6).toFixed(0) + ' MB' : 'not built';
writeFileSync(`${OUT}/README.md`, `# The YouTube upload

Built ${new Date().toLocaleDateString("en-CA")} by \`node tools/youtube.mjs\`. This folder is git-ignored; run the tool again to rebuild it.

## What's here

| file | what |
|---|---|
| the-last-evolution.mp4 | the film, ${hms(total)}, ${mb(`${OUT}/the-last-evolution.mp4`)} |
| title.txt | the title (${TITLE.length} of 100 characters), as decided in Round 1 |
| description.txt | the description (${description.length} of 5,000), with the chapter markers |
| tags.txt | the tags (${tagsText.length} of 500 characters) |
| chapters.txt | the chapter markers alone, also in the description |
| captions.en.vtt, captions.en.srt | English captions, ${cues.length} cues, the speaker named; upload either |
${THUMBS.map(t => `| thumbnail-${t.name}.jpg | ${t.note} |`).join('\n')}

## It's the draft

The film is the twelve chapters' current drafts, joined: 1280×720 at 12 drawings a second, each chapter mixed to about
−14 LUFS. Phase 8's final render (24 frames a second) hasn't been made, and the release gates are still open: the voices,
the look, the pilot, the chapters and the site (\`npm run quality\`). Rebuild this folder after the final render.

## Upload settings

- **Title, description, tags:** paste from the files. The description's chapter list makes YouTube's chapter markers.
- **Thumbnail:** pick one of the three (1280×720, each under 2 MB). A custom thumbnail needs a verified channel.
- **Subtitles:** upload captions.en.vtt as English, "with timing".
- **Audience:** not made for kids.
- **Altered or synthetic content:** the voices, music and effects are AI-generated. YouTube asks this for realistic
  content; this is plainly a painted, voiced story, but saying yes is the cautious answer. Curt's call.
- **Category:** Film & Animation. **Language:** English. **Licence:** standard YouTube licence, or Creative Commons; the
  story is public domain in the US, the voices and music are generated under the ElevenLabs plan's terms.
- **Before release:** check the ElevenLabs plan's terms for commercial use of generated music and effects
  (DECISIONS.md, Round 3, "Music rights").
- **After upload:** send the URL, and it goes on the site and in the README (PLAN.md §9, Phase 10).
`);
console.log(`${OUT}/: the film ${hms(total)} (${mb(`${OUT}/the-last-evolution.mp4`)}), ${cues.length} caption cues, ${THUMBS.length} thumbnails, title ${TITLE.length}, description ${description.length}, tags ${tagsText.length} characters`);
