// build_site.mjs: the companion site → site/public/ (published by .github/workflows/pages.yml).   npm run site
//   index.html   what this is and where it stands
//   read/        the story in full, from text/story.json: a printable page with an anchor per paragraph (#p001…), each
//                reading restored from the 1932 printing marked and listed (text/emendations.yaml)
//   about/       sources, credits, licences
//   img/         site/img/, copied as is (Morey's illustration, sized for the web from assets/ref/)
// Links are relative, so the same files work at http://localhost:8077/ and at curtcox.github.io/The-Last-Evolution/.
// Later phases add the film beside the synced text, the notes and the r/NAME/ forwarding pages (PLAN.md §7).
import { readFileSync, writeFileSync, mkdirSync, rmSync, cpSync } from 'node:fs';
import YAML from 'yaml';

const OUT = 'site/public';
const REPO = 'https://github.com/curtcox/The-Last-Evolution';
const story = JSON.parse(readFileSync('text/story.json', 'utf8'));
const emendations = YAML.parse(readFileSync('text/emendations.yaml', 'utf8'));
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
// the text as typeset: Gutenberg's "--" as an em dash and _x_ as italics. Only the page changes; the words don't.
const typeset = s => esc(s).replace(/--/g, '—').replace(/_([^_]+)_/g, '<i>$1</i>')
  .replace(/\[(\d)\]/g, (m, n) => `<sup><a href="#fn${n}" id="ref${n}">${n}</a></sup>`);

function page(depth, title, body, { wide = false } = {}) {
  const up = '../'.repeat(depth);
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<meta name="description" content="The Last Evolution, John W. Campbell, Jr.'s 1932 story, read in full: a voiced, painted film and its companion site.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Old+Standard+TT:ital,wght@0,400;0,700;1,400&family=Bebas+Neue&display=swap">
<link rel="stylesheet" href="${up}style.css">
</head>
<body>
<header class="mast"><a href="${up}" class="name">The Last Evolution</a>
<nav><a href="${up}read/">Read</a><a href="${up}about/">About</a><a href="${REPO}">Source</a></nav></header>
<main${wide ? ' class="wide"' : ''}>
${body}
</main>
<footer><p>A story from 1932, read in full. Text in the public domain in the US; this site's code is MIT.
<a href="${REPO}">Source on GitHub</a>.</p></footer>
</body>
</html>
`;
}

const blocks = story.blocks;

// a paragraph's restored 1932 readings, marked: the restored words highlighted, or, where 1932 simply lacks a word, a
// small mark after the phrase. Each links to its entry in the list at the foot of the page.
function emend(b, html) {
  for (const n of b.emended || []) {
    const e = emendations.find(e => e.n === n), phrase = typeset(e.first), i = html.indexOf(phrase);
    if (i < 0) throw new Error(`emendation ${n}: can't find its phrase in ${b.id}`);
    const tip = `Restored from the 1932 printing. Gutenberg (1961): ${esc(e.gutenberg)}`;
    const marked = e.mark
      ? phrase.replace(new RegExp(`(?<![\\w-])${typeset(e.mark).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![\\w-])`), m => `<a class="em" href="#em${n}" id="emr${n}" title="${tip}">${m}</a>`)
      : `${phrase}<a class="em-gap" href="#em${n}" id="emr${n}" title="${tip}">°</a>`;
    html = html.slice(0, i) + marked + html.slice(i + phrase.length);
  }
  return html;
}
const SCANS = `${REPO}/blob/main/assets/ref/1932`;
const by = k => blocks.find(b => b.kind === k).text;

const home = page(0, 'The Last Evolution', `
<p class="kicker">${esc(by('masthead'))}</p>
<h1>The Last Evolution</h1>
<p class="byline">${esc(by('byline'))}</p>
<p class="lede">A machine's memoir of the war in which mankind died and its machines inherited the Solar System: John W.
Campbell, Jr.'s story from 1932, voiced by a full cast and painted in the manner of the pulp magazine it first appeared
in. Every word of the story is in the film.</p>
<div class="status"><h2>In production</h2>
<p>The film isn't made yet. This site will hold it, the full text beside it as it plays, and notes on the 1932 science,
the ideas about machine succession the story anticipates, and Campbell and the pulps.
<a href="${REPO}/blob/main/PLAN.md">The plan</a> says how it's being made.</p>
<p>Meanwhile, the story itself is here: <a href="read/">read it</a> (${story.words.toLocaleString()} words, about half an hour).</p></div>
`);

const body = blocks.map(b => {
  switch (b.kind) {
    case 'masthead': return `<p class="kicker">${esc(b.text)}</p>`;
    case 'title': return `<h1>${typeset(b.text)}</h1>`;
    case 'byline': return `<p class="byline">${esc(b.text)}</p>`;
    case 'para': return `<p id="${b.id}"><a class="pid" href="#${b.id}" aria-label="paragraph ${+b.id.slice(1)}">${+b.id.slice(1)}</a>${emend(b, typeset(b.text))}</p>`;
    case 'break': return `<p class="break" id="${b.id}" aria-hidden="true">*&nbsp;&nbsp;&nbsp;*&nbsp;&nbsp;&nbsp;*</p>`;
    case 'illustration': return `<figure id="illustration" class="illus"><a href="../img/morey_1932_p415.jpg"><img
src="../img/morey_1932_p415.jpg" width="1200" height="1665" loading="lazy" alt="Leo Morey's illustration: a great domed machine
with goggle eyes and tentacles holds a small glowing torpedo of metal in a burst of light, while a man in a tunic shields
his face"></a><figcaption>"An enormous aura of white light surrounded the small torpedo of metal, and it was shot through
with crackling streamers of blue lightning." Illustration by Leo Morey, <i>Amazing Stories</i>, August 1932, page 415
(<a href="https://archive.org/details/Amazing_Stories_v07n05_1932-08_Missing_ibcbc_cape1736">scan</a>). Public domain
in the US.</figcaption></figure>`;
    case 'end': return `<p class="end">THE END</p><h2 class="notes-h">Footnotes</h2>`;
    case 'footnote': { const n = b.id.slice(2); return `<p class="fn" id="${b.id}">${typeset(b.text.replace(/^\[\d\]\s*/, ''))
      .replace(/^/, `<a href="#ref${n}">[${n}]</a> `)}</p>`; }
  }
}).join('\n');
const restored = `<h2 class="notes-h" id="restored">Restored from the first printing</h2>
<p class="fn">The 1961 reprint that Project Gutenberg transcribed lost words that are in the 1932 first printing. These are
put back, as marked above (<a href="${REPO}/blob/main/text/comparison_1932.md">the comparison</a>).</p>
<ul class="fn em-list">${[...emendations].sort((a, b) => a.para.localeCompare(b.para)).map(e => `<li id="em${e.n}"><a href="#emr${e.n}">¶${+e.para.slice(1)}</a>
1932: “${typeset(e.first)}” · Gutenberg: “${typeset(e.gutenberg)}” · <a href="${SCANS}/${e.scan}.jpg">scan</a></li>`).join('\n')}</ul>`;
const read = page(1, 'Read: The Last Evolution', `<article class="story">${body}${restored}</article>
<p class="src">Text: <a href="https://www.gutenberg.org/ebooks/27462">Project Gutenberg eBook #27462</a>, transcribed from
<i>Amazing Stories</i>, March 1961, with ${emendations.length} readings restored from the first printing, <i>Amazing
Stories</i>, August 1932 (<a href="#restored">listed above</a>). Typeset here with em dashes and italics; otherwise the
words are Gutenberg's.</p>`);

const about = page(1, 'About: The Last Evolution', `
<h1>About</h1>
<h2>The story</h2>
<p><i>The Last Evolution</i> by John W. Campbell, Jr. was first published in <i>Amazing Stories</i> in August 1932, and
reprinted there in March 1961. The text comes from <a href="https://www.gutenberg.org/ebooks/27462">Project Gutenberg
eBook #27462</a>, whose transcribers found no evidence that its US copyright was renewed, so it is in the public domain
in the United States. The repository keeps the Gutenberg file unmodified, with its licence and a checksum.</p>
<p>Gutenberg transcribed the 1961 reprint, whose typesetter lost words that are in the 1932 first printing: a 24-word
clause, two negatives, and a dozen smaller words. This site and the film restore those ${emendations.length} readings from
the 1932 scan, and the <a href="../read/#restored">Read page</a> marks each one
(<a href="${REPO}/blob/main/text/comparison_1932.md">the comparison</a>).</p>
<h2>The adaptation</h2>
<p>A film of the whole story, word for word, voiced with AI-generated voices (ElevenLabs) and painted in code with
<a href="https://p5js.org">p5.js</a> and <a href="https://github.com/acamposuribe/p5.brush">p5.brush</a>, on John
Heibel's <a href="https://github.com/JohnHeibel/ClaudeAnimationBase">Claude Animation Base</a> (MIT). It's being made by
Curt Cox with Claude, Anthropic's AI model, in Claude Code.</p>
<p>The voices, sound effects and music in the film are AI-generated, and every on-screen design is original.</p>
<h2>The code</h2>
<p>Everything is on <a href="${REPO}">GitHub</a> under the MIT licence.</p>
`);

const css = `:root { --paper: #F1E8D3; --paper2: #E6DABF; --ink: #2B2233; --ink2: #5B5148; --accent: #3F8F55; --rule: #CDBF9F; color-scheme: light; }
@media (prefers-color-scheme: dark) { :root { --paper: #1C1A17; --paper2: #26231F; --ink: #E8DFCC; --ink2: #B3A893; --accent: #8FD9A0; --rule: #4A4339; color-scheme: dark; } }
* { box-sizing: border-box; }
html { background: var(--paper); color: var(--ink); }
body { margin: 0; font: 19px/1.6 "Old Standard TT", Georgia, serif; }
a { color: inherit; text-decoration-color: var(--accent); text-underline-offset: .15em; }
a:hover { color: var(--accent); }
.mast { display: flex; flex-wrap: wrap; gap: .5em 1.5em; align-items: baseline; justify-content: space-between; padding: .8em 16px; border-bottom: 3px double var(--rule); background: var(--paper2); }
.mast .name { font: 1.6em/1 "Bebas Neue", Impact, sans-serif; letter-spacing: .04em; text-decoration: none; }
.mast nav { display: flex; gap: 1.2em; font-size: .9em; }
main { max-width: 38em; margin: 0 auto; padding: 1.5em 16px 3em; }
h1 { font: 3.2em/1 "Bebas Neue", Impact, sans-serif; letter-spacing: .03em; margin: .2em 0 .1em; }
h1 i { font-style: normal; }
h2 { font: 1.6em/1.1 "Bebas Neue", Impact, sans-serif; letter-spacing: .04em; margin: 1.6em 0 .3em; }
.kicker { font-variant: small-caps; letter-spacing: .06em; color: var(--ink2); margin: 0; }
.byline { font-variant: small-caps; letter-spacing: .05em; margin: 0 0 1.5em; }
.lede { font-size: 1.15em; }
.status { border: 1px solid var(--rule); background: var(--paper2); padding: .2em 1.2em 1em; margin-top: 2em; }
.status h2 { margin-top: .6em; }
.story p { margin: 0 0 .9em; text-align: justify; hyphens: auto; position: relative; }
.story p:target { background: color-mix(in srgb, var(--accent) 14%, transparent); }
.pid { position: absolute; left: -2.6em; width: 2em; text-align: right; font-size: .62em; line-height: 2.6; color: var(--ink2); text-decoration: none; opacity: .55; }
@media (max-width: 52em) { .pid { display: none; } }
.break, .end { text-align: center; letter-spacing: .3em; margin: 1.6em 0 !important; text-align: center !important; }
.end { font-variant: small-caps; }
.illus { margin: 2em 0; text-align: center; font-size: .85em; color: var(--ink2); }
.illus img { width: 100%; max-width: 30em; height: auto; border: 1px solid var(--rule); filter: sepia(.25); }
.illus figcaption { margin-top: .5em; text-align: left; }
.fn { font-size: .9em; }
.em { text-decoration: underline dotted var(--accent); text-underline-offset: .2em; }
.em-gap { font-size: .7em; vertical-align: super; text-decoration: none; color: var(--accent); }
.em-list li { margin-bottom: .4em; }
.notes-h { font-size: 1.2em; }
sup a { text-decoration: none; color: var(--accent); }
.src, footer { font-size: .85em; color: var(--ink2); }
footer { border-top: 3px double var(--rule); padding: .5em 16px 2em; text-align: center; }
`;

rmSync(OUT, { recursive: true, force: true });
for (const d of ['', 'read', 'about']) mkdirSync(`${OUT}/${d}`, { recursive: true });
writeFileSync(`${OUT}/index.html`, home);
writeFileSync(`${OUT}/read/index.html`, read);
writeFileSync(`${OUT}/about/index.html`, about);
writeFileSync(`${OUT}/style.css`, css);
writeFileSync(`${OUT}/.nojekyll`, '');
cpSync('site/img', `${OUT}/img`, { recursive: true });
console.log(`${OUT}: home, read (${blocks.filter(b => b.kind === 'para').length} paragraphs), about`);
