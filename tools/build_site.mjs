// build_site.mjs: the companion site → site/public/ (published by .github/workflows/pages.yml).   npm run site
//   index.html   what this is and where it stands
//   watch/       the film's lasting address: for now it forwards to the annotated draft (Round 7), keeping any #note= or
//                #t= link, so links shared today still work when the watch page takes its place (Phase 7)
//   read/        the story in full, from text/story.json: a printable page with an anchor per paragraph (#p001…), each
//                reading restored from the 1932 printing marked and listed (text/emendations.yaml)
//   notes/       the longer notes (notes/science.md, succession.md, history.md, factcheck.md), a page each, so the film's
//                "More" links and the About page stay on the site (tools/notes_md.mjs)
//   about/       sources, credits, licences
//   review/      each review round: its decision sheet (review/roundN.md, on GitHub) and its decision pages, copied from
//                site/review/ (put there by tools/publish_review.mjs, with their audio)
//   img/         site/img/, copied as is (Morey's illustration, sized for the web from assets/ref/)
//   404.html     for a mistyped or outdated link; favicon.svg, the tab's icon
// Links are relative, so the same files work at http://localhost:8077/ and at curtcox.github.io/The-Last-Evolution/.
// Later phases add the film beside the synced text and the r/NAME/ forwarding pages (PLAN.md §7).
import { readFileSync, writeFileSync, mkdirSync, rmSync, cpSync, existsSync, readdirSync } from 'node:fs';
import YAML from 'yaml';
import { markdown, NOTES, SITE } from './notes_md.mjs';

const OUT = 'site/public';
const REPO = 'https://github.com/curtcox/The-Last-Evolution';
const WATCH = 'review/round7/annotated.html';   // what watch/ forwards to, until the watch page is built
const story = JSON.parse(readFileSync('text/story.json', 'utf8'));
const emendations = YAML.parse(readFileSync('text/emendations.yaml', 'utf8'));
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
// the text as typeset: Gutenberg's "--" as an em dash and _x_ as italics. Only the page changes; the words don't.
const typeset = s => esc(s).replace(/--/g, '—').replace(/_([^_]+)_/g, '<i>$1</i>')
  .replace(/\[(\d)\]/g, (m, n) => `<sup><a href="#fn${n}" id="ref${n}">${n}</a></sup>`);

const DESCRIPTION = "The Last Evolution, John W. Campbell, Jr.'s 1932 story, read in full: a voiced, painted film and its companion site.";
function page(depth, title, body, { wide = false, abs = false, description = DESCRIPTION } = {}) {
  const up = abs ? '/The-Last-Evolution/' : '../'.repeat(depth);
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<meta name="description" content="${description}">
<meta property="og:title" content="${title}"><meta property="og:description" content="${description}">
<meta property="og:image" content="${SITE}img/morey_1932_p415.jpg">
<link rel="icon" href="${up}favicon.svg">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Old+Standard+TT:ital,wght@0,400;0,700;1,400&family=Bebas+Neue&display=swap">
<link rel="stylesheet" href="${up}style.css">
</head>
<body>
<header class="mast"><a href="${up}" class="name">The Last Evolution</a>
<nav><a href="${up}watch/">Watch</a><a href="${up}read/">Read</a><a href="${up}notes/">Notes</a><a href="${up}about/">About</a><a href="${up}review/">Review</a><a href="${REPO}">Source</a></nav></header>
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
<p class="kicker">From <i>Amazing Stories</i>, August 1932</p>
<h1>The Last Evolution</h1>
<p class="byline">${esc(by('byline'))}</p>
<p class="lede">A machine's memoir of the war in which mankind died and its machines inherited the Solar System: John W.
Campbell, Jr.'s story from 1932, voiced by a full cast and painted in the manner of the pulp magazine it first appeared
in. Every word of the story is in the film.</p>
<ul class="ways">
<li><a href="watch/"><b>Watch</b></a> the whole film, about an hour, with notes beside it as it plays: on the 1932
science, the text, and the idea at its heart, that machines might inherit from us. It's a draft: the whole story is voiced
(its two footnotes lettered on screen) and every chapter acted, and fresh reviews go on looking for faults in the drafts until two in a row find none.</li>
<li><a href="read/"><b>Read</b></a> the story (${story.words.toLocaleString()} words, about half an hour), with the
words the 1961 reprint lost put back from the first printing.</li>
<li><a href="notes/"><b>Read the notes</b></a>: the science of 1932, machines as heirs, Campbell and the pulps, each
claim with its source.</li>
<li><a href="review/"><b>See how it's made</b></a>, round by round: every choice, and why.</li>
</ul>
<div class="status"><h2>In production</h2>
<p>The whole film is drafted, and every chapter has been acted and painted to its finished designs. Each draft has met
its bar, and now fresh reviewers watch the whole film round after round, and what they find is fixed, until two rounds in
a row find nothing; then the film is rendered in full and posted to YouTube with captions.
<a href="review/quality/">Where it stands</a> shows every chapter and page against the bar it has to meet, and
<a href="${REPO}/blob/main/PLAN.md">the plan</a> says how.</p></div>
`);

const body = blocks.map(b => {
  switch (b.kind) {
    // the reprint's own header ('A Classic Reprint from …, 1932') would pair 1961's words with 1932's date: say both plainly
    case 'masthead': return `<p class="kicker">From <i>Amazing Stories</i>, August 1932 · the 1961 reprint's text, 16 readings from 1932 restored</p>`;
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
<p class="src">Hear it read: <a href="../watch/">the film</a>, in draft, with notes.</p>
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
<p>Gutenberg transcribed the 1961 reprint, whose typesetter lost a 24-word clause and two negatives that are in the 1932
first printing, and made thirteen smaller slips: dropped words, stray ones, a wrong digit. This site and the film restore
those ${emendations.length} readings from
the 1932 scan, and the <a href="../read/#restored">Read page</a> marks each one
(<a href="${REPO}/blob/main/text/comparison_1932.md">the comparison</a>).</p>
<p>Leo Morey's illustration for the story, from the August 1932 issue, is on the <a href="../read/#illustration">Read
page</a>. It is in the public domain in the US too.</p>
<h2>The adaptation</h2>
<p>A film of the whole story, word for word, voiced with AI-generated voices (ElevenLabs) and painted in code with
<a href="https://p5js.org">p5.js</a> and <a href="https://github.com/acamposuribe/p5.brush">p5.brush</a>, on John
Heibel's <a href="https://github.com/JohnHeibel/ClaudeAnimationBase">Claude Animation Base</a> (MIT). It's being made by
Curt Cox with Claude, Anthropic's AI model, in Claude Code. <a href="../watch/">The draft</a> can be watched now.</p>
<p>The voices, sound effects and music in the film are AI-generated. Each voice was designed for its part, and none is a
real person's. Every on-screen design is original, except Leo Morey's illustration for the story in the August 1932
<i>Amazing Stories</i>, which chapter 5 shows as it was printed.</p>
<h2>The notes</h2>
<p>The notes beside the film, and the longer ones on <a href="../notes/science/">the science of 1932</a>,
<a href="../notes/succession/">machines as heirs</a> and <a href="../notes/history/">Campbell and the pulps</a>, cite
their sources. Each claim was checked in its source, or worked out from the story's own numbers, as
<a href="../notes/factcheck/">the fact-check list</a> records.</p>
<h2>Corrections</h2>
<p>If you find a mistake in the text, the film or the notes, please <a href="${REPO}/issues">open an issue on
GitHub</a>.</p>
<h2>The code</h2>
<p>Everything is on <a href="${REPO}">GitHub</a> under the MIT licence.</p>
`);

// notes/: a page for each longer note, and a page listing them
const ABOUT = { science: 'What Campbell knew in 1932, the year the atom came apart, and what became of it.',
  succession: 'The idea at the story\'s heart, that machines might inherit from us: before Campbell, and since.',
  history: 'The magazine, the young writer who became the field\'s great editor, the illustrator, and the text.',
  factcheck: 'Every claim in the notes, the source it rests on, and how it was checked.' };
const notes = NOTES.map(name => ({ name, ...markdown(`notes/${name}.md`, { up: '../../' }) }));
const notePages = notes.map((n, i) => [n.name, page(2, `${esc(n.title)}: The Last Evolution`, `
<p class="kicker"><a href="../">Notes</a></p>
<h1>${esc(n.title)}</h1>
<div class="prose">${n.html}</div>
<p class="src">${n.name === 'factcheck' ? '' : `Each claim's source and check: <a href="../factcheck/">the fact-check list</a>. `}Found a
mistake? <a href="${REPO}/issues">Say so on GitHub</a>.</p>
<p class="next">${notes[i + 1] ? `Next: <a href="../${notes[i + 1].name}/">${esc(notes[i + 1].title)}</a>`
  : `Back to <a href="../../watch/">the film</a>`}</p>`, { description: ABOUT[n.name] })]);
const notesIndex = page(1, 'Notes: The Last Evolution', `
<p class="kicker">Beside the story</p>
<h1>Notes</h1>
<p class="lede">The short notes appear beside <a href="../watch/">the film</a> as it reaches the words they're about.
These are the longer ones, with their sources.</p>
<ul class="ways">${notes.map(n => `<li><a href="${n.name}/"><b>${esc(n.title)}</b></a>. ${ABOUT[n.name]}</li>`).join('\n')}</ul>
`);

// watch/: forwards to the film, with any #note= or #t= link kept
const watch = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>The Last Evolution: watch</title>
<link rel="canonical" href="${SITE}${WATCH}"><meta http-equiv="refresh" content="0; url=../${WATCH}">
<script>location.replace('../${WATCH}' + location.hash)</script></head>
<body><p><a href="../${WATCH}">The film, annotated</a></p></body></html>
`;
const notFound = page(0, 'Not found: The Last Evolution', `
<h1>Not found</h1>
<p>There's no page at this address. It may have moved while the film is being made.</p>
<p><a href="/The-Last-Evolution/watch/">Watch the film</a>, <a href="/The-Last-Evolution/read/">read the story</a>, or
start from <a href="/The-Last-Evolution/">the front page</a>.</p>
`, { abs: true });
// the tab's icon: a sepia "E" on pulp paper
const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="4" fill="#F1E8D3"/><rect x="2" y="2" width="28" height="28" rx="3" fill="none" stroke="#2B2233" stroke-width="1.5"/><text x="16" y="25" font-family="Georgia,serif" font-size="22" font-weight="bold" text-anchor="middle" fill="#2B2233">E</text></svg>
`;

const css = `:root { --paper: #F1E8D3; --paper2: #E6DABF; --ink: #2B2233; --ink2: #5B5148; --accent: #3F8F55; --rule: #CDBF9F; color-scheme: light; }
@media (prefers-color-scheme: dark) { :root { --paper: #1C1A17; --paper2: #26231F; --ink: #E8DFCC; --ink2: #B3A893; --accent: #8FD9A0; --rule: #4A4339; color-scheme: dark; } }
* { box-sizing: border-box; }
html { background: var(--paper); color: var(--ink); }
body { margin: 0; font: 19px/1.6 "Old Standard TT", Georgia, serif; }
a { color: inherit; text-decoration-color: var(--accent); text-underline-offset: .15em; }
a:hover { color: var(--accent); }
.mast { display: flex; flex-wrap: wrap; gap: .5em 1.5em; align-items: baseline; justify-content: space-between; padding: .8em 16px; border-bottom: 3px double var(--rule); background: var(--paper2); }
.mast .name { font: 1.6em/1 "Bebas Neue", Impact, sans-serif; letter-spacing: .04em; text-decoration: none; }
.mast nav { display: flex; flex-wrap: wrap; gap: .2em 1.2em; font-size: .9em; }
@media (max-width: 30em) { .mast nav { gap: .2em .7em; } }   /* the six links on one line at a phone's width */
main { max-width: 38em; margin: 0 auto; padding: 1.5em 16px 3em; }
h1 { font: 3.2em/1 "Bebas Neue", Impact, sans-serif; letter-spacing: .03em; margin: .2em 0 .1em; }
h1 i { font-style: normal; }
h2 { font: 1.6em/1.1 "Bebas Neue", Impact, sans-serif; letter-spacing: .04em; margin: 1.6em 0 .3em; }
.kicker, .story p.kicker { font-variant: small-caps; letter-spacing: .06em; color: var(--ink2); margin: 0; text-align: left; hyphens: none; }   /* (.story p's justify and hyphens won over plain .kicker: 'read-ings' at 375) */
.byline { font-variant: small-caps; letter-spacing: .05em; margin: 0 0 1.5em; }
.lede { font-size: 1.15em; }
.ways { padding-left: 1.2em; } .ways li { margin: 0 0 .7em; }
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
.prose h2[id], .prose h3[id] { scroll-margin-top: 1em; }
.prose blockquote { margin: 1em 1.5em; font-style: italic; color: var(--ink2); }
.prose code { font-size: .85em; }
.where { font-size: .85em; color: var(--ink2); margin-top: -.2em; }
.tbl { overflow-x: auto; margin: 1em 0; position: relative; }   /* relative: keeps the .sr labels inside it */
.tbl table { border-collapse: collapse; font-size: .8em; line-height: 1.4; min-width: 30em; }
.tbl th, .tbl td { border-bottom: 1px solid var(--rule); padding: .35em .5em; text-align: left; vertical-align: top; }
.tbl th { font-variant: small-caps; letter-spacing: .04em; }
@media (max-width: 30em) { .tbl table { min-width: 0; } .tbl td { overflow-wrap: anywhere; } .tbl th, .tbl td { padding: .35em .25em; } .tbl th { letter-spacing: 0; } }   /* a phone gets every column, wrapped, not a sideways scroll */
.sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
.makers { margin-top: 2em; } .makers summary { cursor: pointer; }
.q-pass { color: var(--accent); } .q-stale, .q-curt, .q-fail { color: #B4442C; font-weight: bold; } .q-open, .q-later { color: var(--ink2); }
.src, footer { font-size: .85em; color: var(--ink2); }
.next { margin-top: 2em; }
footer { border-top: 3px double var(--rule); padding: .5em 16px 2em; text-align: center; }
`;

// the quality loop's scorecard (QUALITY.md; tools/quality.mjs writes quality/scorecard.json): where everything stands
const card = existsSync('quality/scorecard.json') && JSON.parse(readFileSync('quality/scorecard.json', 'utf8'));

// the review rounds: each sheet, whether it's open, and the pages to listen and pick on
const rounds = readdirSync('review').map(f => f.match(/^round(\d+)\.md$/)?.[1]).filter(Boolean).map(Number).sort((a, b) => a - b).map(n => {
  const md = readFileSync(`review/round${n}.md`, 'utf8'), dir = `site/review/round${n}`;
  const pages = existsSync(dir) ? readdirSync(dir).filter(f => f.endsWith('.html')).sort()
    .map(f => ({ href: `round${n}/${f === 'index.html' ? '' : f}`, title: readFileSync(`${dir}/${f}`, 'utf8').match(/<title>(.*?)<\/title>/)[1] })) : [];
  return { n, title: md.match(/^# (.*)$/m)[1], closed: md.match(/^\*\*Closed ([\d-]+)/m)?.[1], pages };
});
const review = page(1, 'Review: The Last Evolution', `
<p class="kicker">How it's being made</p>
<h1>Review</h1>
<p class="lede">The film is made in rounds. Each round ends at a review gate: a decision sheet of questions, each with a
recommendation, and where the choice is by ear or eye, a page to listen or look and pick on. Nothing goes ahead until
both Curt Cox, who is making it, and Claude, the AI model helping, are satisfied (<a href="${REPO}/blob/main/PLAN.md">the plan</a>, §2); every decision is logged in
<a href="${REPO}/blob/main/DECISIONS.md">DECISIONS.md</a>.</p>
${card ? '<p><a href="quality/"><b>Where it stands</b></a>: every item of the film and the site against the quality rubric.</p>' : ''}
${rounds.slice().reverse().map(r => `<div class="round"><h2>${esc(r.title)}</h2>
<p>${r.closed ? `Closed ${r.closed}.` : '<b>Open.</b>'} <a href="${REPO}/blob/main/review/round${r.n}.md">The decision sheet</a>.</p>
${r.pages.length ? `<ul>${r.pages.map(p => `<li><a href="${p.href}">${esc(p.title)}</a></li>`).join('')}</ul>` : ''}</div>`).join('\n')}
`);

// the scorecard's page
const MARK = { pass: ['✓', 'done'], fail: ['✗', 'failing'], stale: ['↻', 'changed: to check again'], open: ['·', 'not yet'], curt: ['?', 'waiting on Curt'], later: ['–', 'later'] };
// each mark says its state in words too, for touch and for screen readers; the judgment's note is in the makers' list
const mark = i => i ? `<span class="q-${i.state}" aria-hidden="true">${MARK[i.state][0]}</span><span class="sr">${MARK[i.state][1]}</span>` : '';
const grid = (rows, cols, cell, head = cols, corner = '') => `<div class="tbl"><table><thead><tr><th>${corner}</th>${head.map(c => `<th>${c}</th>`).join('')}</tr></thead><tbody>${
  rows.map(([label, key]) => `<tr><th>${label}</th>${cols.map(c => `<td>${mark(cell(key, c))}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
const cap = s => s[0].toUpperCase() + s.slice(1);
const quality = card && (() => {
  const by = Object.fromEntries(card.items.map(i => [i.id, i]));
  const film = ['acting', 'picture', 'sync', 'sound', 'story', 'draft'], site = [...new Set(card.items.filter(i => i.area === 'site').map(i => i.id.split('.')[1]))];
  const done = area => { const L = card.items.filter(i => i.area === area); return [L.filter(i => i.state === 'pass').length, L.length]; };
  const [fd, fn] = done('film'), [sd, sn] = done('site');
  const curtIds = new Set(card.curt.map(c => c.id)), other = card.items.filter(i => ['finding', 'voice', 'work', 'later'].includes(i.area) && !curtIds.has(i.id));
  const judged = card.items.filter(i => i.note && ['film', 'site'].includes(i.area) && !/^ch\d\d\.draft$/.test(i.id));
  const checksOk = Object.values(card.checks).filter(c => c.state === 'pass').length;
  // what's next, with a shared "Chapter 5:" said once
  const N = card.next || [], pre = N.length && N.every(t => t.split(': ')[0] === N[0].split(': ')[0]) ? N[0].split(': ')[0] : null;
  const next = !N.length ? '' : pre ? `${pre}: ${N.map(t => t.split(': ').slice(1).join(': ')).join(', ')}` : N.join('; ');
  return page(2, 'Where it stands: The Last Evolution', `
<p class="kicker"><a href="../">How it's made</a></p>
<h1>Where it stands</h1>
<p class="lede">The whole film is drafted, and every chapter has been acted and painted to its finished designs. Now every
chapter and every page of this site is checked against a written bar before it's called done.</p>
<ul>
<li><b>The film:</b> ${fd} of its ${fn} checks done (six for each of its twelve chapters).</li>
<li><b>This site:</b> ${sd} of its ${sn} checks done (what each page says, and how it looks and works).</li>
${next ? `<li><b>Next:</b> ${esc(next)}.</li>` : ''}
</ul>
<p>A check done isn't the last word: every so often a fresh reviewer, new to the work, watches the whole film and reads
the site, and what they find reopens its check. The film is finished when two reviews in a row find nothing${card.fresh?.length ? `; the latest found ${card.fresh.at(-1).found}` : ''}.</p>
${card.satisfied ? '<p><b>Everything is done.</b></p>' : ''}
<h2>The film, chapter by chapter</h2>
<p>Each chapter is checked for its <b>acting</b> (do the figures act their lines?), its <b>picture</b> (does each shot show
what's said, and read on a phone?), its <b>sync</b> (do things happen on their words?), its <b>sound</b> (is every word
clear?), whether it works as a <b>story</b> for someone new to it, and whether its <b>draft</b> is up to date and at the
right loudness.</p>
${grid(Array.from({ length: 12 }, (_, n) => [String(n), String(n).padStart(2, '0')]), film, (nn, c) => by[`ch${nn}.${c}`])}
<h2>This site</h2>
${grid(site.map(k => [esc(by[`site.${k}.content`].title.split(':')[0]), k]), ['content', 'look'], (k, c) => by[`site.${k}.${c}`], ['what it says', 'how it looks'])}
<p class="src">${Object.values(MARK).map(([m, t]) => `${m} ${t}`).join(' · ')}</p>
<details class="makers"><summary><b>For the makers</b>: Curt's questions, the checks, and every judgment with its reason</summary>
<p>Claude judges each item against <a href="${REPO}/blob/main/quality/rubric.yaml">the rubric</a> and keeps working until
none of its items is open; a judgment goes stale when what was judged changes (<a href="${REPO}/blob/main/QUALITY.md">how
the loop works</a>).</p>
${card.curt.length ? `<h3>Curt's calls</h3><ul>${card.curt.map(c => `<li><b>${esc(cap(c.title))}${/[.?!]$/.test(c.title) ? '' : '.'}</b> ${esc(c.ask)}</li>`).join('')}</ul>` : ''}
${other.length ? `<h3>Other items</h3><ul>${other.map(i => `<li>${mark(i)} ${esc(cap(i.title))}${i.note ? ` <span class="src">${esc(i.note)}</span>` : ''}</li>`).join('')}</ul>` : ''}
<h3>The checks: ${checksOk} of ${Object.keys(card.checks).length} pass</h3>
<ul>${Object.entries(card.checks).map(([n, c]) => `<li>${mark({ state: ['pass', 'fail', 'stale'].includes(c.state) ? c.state : 'open' })} <b>${n}</b>: ${c.state}${c.detail ? ` <span class="src">${esc(c.detail)}</span>` : ''}</li>`).join('')}</ul>
${card.fresh.length ? `<h3>Fresh-eyes rounds</h3><ul>${card.fresh.map(f => `<li>${f.when}: ${f.found} found. ${esc(f.note)}</li>`).join('')}</ul>` : ''}
${judged.length ? `<h3>Every judgment</h3><ul>${judged.map(i => `<li>${mark(i)} <b>${esc(cap(i.title))}</b> <span class="src">${esc(i.note)}</span></li>`).join('')}</ul>` : ''}
</details>
`, { description: 'Where the film and its site stand: every chapter and page checked against a written bar before it is called done.' });
})();

rmSync(OUT, { recursive: true, force: true });
for (const d of ['', 'watch', 'read', 'about', 'review', ...NOTES.map(n => `notes/${n}`)]) mkdirSync(`${OUT}/${d}`, { recursive: true });
writeFileSync(`${OUT}/index.html`, home);
writeFileSync(`${OUT}/watch/index.html`, watch);
writeFileSync(`${OUT}/404.html`, notFound);
writeFileSync(`${OUT}/favicon.svg`, favicon);
writeFileSync(`${OUT}/read/index.html`, read);
writeFileSync(`${OUT}/about/index.html`, about);
writeFileSync(`${OUT}/notes/index.html`, notesIndex);
for (const [name, html] of notePages) writeFileSync(`${OUT}/notes/${name}/index.html`, html);
if (existsSync('site/review')) { cpSync('site/review', `${OUT}/review`, { recursive: true });
  // the review pages share the site's stylesheet, and so its fonts (without them, headings fall back to a heavy grotesque)
  const FONTS = '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Old+Standard+TT:ital,wght@0,400;0,700;1,400&family=Bebas+Neue&display=swap">';
  for (const f of readdirSync(`${OUT}/review`, { recursive: true }).filter(f => f.endsWith('.html'))) { const p = `${OUT}/review/${f}`, h = readFileSync(p, 'utf8'); if (!h.includes('fonts.googleapis') && h.includes('style.css')) writeFileSync(p, h.replace(/<link rel="stylesheet" href="[^"]*style\.css">/, m => FONTS + m)); } }
  // and its masthead and nav, so a visitor on a review round's page can get back to the film and the story (they had
  // only a breadcrumb)
  for (const f of readdirSync(`${OUT}/review`, { recursive: true }).filter(f => f.endsWith('.html'))) { const p = `${OUT}/review/${f}`, h = readFileSync(p, 'utf8'), up = '../'.repeat(1 + f.split('/').length - 1);
    if (!h.includes('class="mast"') && /<body[^>]*>/.test(h)) writeFileSync(p, h.replace(/<body[^>]*>/, m => `${m}\n<header class="mast"><a href="${up}" class="name">The Last Evolution</a>\n<nav><a href="${up}watch/">Watch</a><a href="${up}read/">Read</a><a href="${up}notes/">Notes</a><a href="${up}about/">About</a><a href="${up}review/">Review</a><a href="${REPO}">Source</a></nav></header>`)); }
writeFileSync(`${OUT}/review/index.html`, review);
if (quality) { mkdirSync(`${OUT}/review/quality`, { recursive: true }); writeFileSync(`${OUT}/review/quality/index.html`, quality); }
writeFileSync(`${OUT}/style.css`, css);
writeFileSync(`${OUT}/.nojekyll`, '');
cpSync('site/img', `${OUT}/img`, { recursive: true });
console.log(`${OUT}: home, read (${blocks.filter(b => b.kind === 'para').length} paragraphs), notes (${notes.length}), about, review (${rounds.length} rounds, ${rounds.reduce((a, r) => a + r.pages.length, 0)} pages)`);
