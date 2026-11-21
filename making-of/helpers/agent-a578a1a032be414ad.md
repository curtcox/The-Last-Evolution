# Helper: Fresh-eyes site review

Started in [2026-11-02](../parts/2026-11-02.md). [All parts](../README.md)

A helper is another copy of Claude, started with its own instructions for one job. It sees only what it's given.

#### Claude, to the helper · 17:37

You are a fresh-eyes reviewer for a small static website. Bring no assumptions; judge only what you see. Do NOT edit any files and do not run git commands that change anything: this is a read-only review.

The site is the companion site for a film adaptation of John W. Campbell, Jr.'s 1932 story "The Last Evolution". It's built into site/public/ and served locally at http://localhost:8077/ (the live copy is https://curtcox.github.io/The-Last-Evolution/). Screenshots of every page at phone width (375 px) and desktop width (1280 px) are in out/quality/phone/ and out/quality/desktop/ (JPEGs, one per page; they show the first screen only).

Review these pages (paths under site/public): index.html (home), read/index.html, notes/index.html, notes/science/index.html, notes/succession/index.html, notes/history/index.html, notes/factcheck/index.html, about/index.html, review/index.html, review/round7/annotated.html (the film page: an annotated draft of the film with notes beside it), and review/quality/index.html (a progress scorecard).

Judge each page against these two criteria:
1. What it says: true, current and complete for what the page promises; claims sourced or linked to sources; tells a visitor what they need next; no stale status, broken promises, contradictions between pages, typos, or wrong facts you can verify from the page itself or the story text (read/index.html has the full story). Plain and warm in tone.
2. How it looks and works: on phone and desktop nothing overflows, crowds or hides; type is readable; controls work by touch and keyboard; images and video have text alternatives. Use the screenshots, and read the HTML/CSS (site/public/style.css) where useful. You may open pages in a headless browser if you have one, but the screenshots and source are enough.

Be concrete and skeptical: look especially for things a first-time visitor would trip on, inconsistencies between pages (dates, counts, names, durations), and anything that reads as written for the makers rather than visitors. Don't report matters of taste as defects unless they hurt a visitor.

Report findings as a list. For each: the page, a severity (major / minor / nit), what's wrong with a quote or exact location, and a suggested fix. End with the count of major and minor findings. If you find nothing above nit, say so plainly. Keep the report under 700 words.

#### The helper did · 17:37

- Ran: List site files and screenshots
- Ran: Read small pages and stylesheet
- Ran: Read quality page text and watch page
- Ran: Inspect watch page and check live URLs
- Ran: Read head of annotated film page
- Ran: Read middle and end of annotated page
- Ran: Inspect the annotated page script
- Ran: Read player logic and video sources
- Read `out/quality/phone/home.jpg`
- Read `out/quality/phone/review_round7_annotated.jpg`
- Read `out/quality/desktop/review_round7_annotated.jpg`
- Read `out/quality/phone/review_quality.jpg`
- Ran: Inspect quality page film table markup
- Ran: Show film table markup
- Ran: Read top and restored list of Read page
- Ran: Check Great Year and illustration in story
- Ran: Check illustration alt text
- Read `site/public/img/morey_1932_p415.jpg`
- Ran: Read notes pages text with links
- Ran: Read fact-check list and acceleration lines
- Read `out/quality/phone/notes_factcheck.jpg`
- Read `out/quality/desktop/home.jpg`
- Read `out/quality/phone/read.jpg`
