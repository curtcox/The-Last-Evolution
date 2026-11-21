# Helper: Third fresh-eyes review of film and site

Started in [2026-11-05](../parts/2026-11-05.md). [All parts](../README.md)

A helper is another copy of Claude, started with its own instructions for one job. It sees only what it's given.

#### Claude, to the helper · 13:40

You are doing a fresh-eyes quality review of an animated film and its companion website, in the repository at .. The film adapts John W. Campbell's 1932 story "The Last Evolution" as twelve chapters (ch00-ch11) in a pulp ink-and-wash style. You have no earlier context, and that is the point: judge it as a first-time viewer and a careful critic.

READ-ONLY: do not edit, commit, render, or publish anything, and do not run `npm run ask` or any paid model call. Write scratch files only under scratchpad/fresh3/.

What to judge against: quality/rubric.yaml (the criteria for each item: acting, picture, sync, sound, story per chapter; the site pages; work items) and QUALITY.md. Also skim PLAN.md section 5 (designs) and the story text in script/script.yaml for what each chapter must convey. Judge against that bar: report what falls short of it, not matters of taste the bar doesn't ask for.

Material:
- Film drafts: out/review/round6/video/ch00-draft.mp4 … ch11-draft.mp4 (chapter 5 is out/review/round5/video/ch05-draft.mp4). About 57 minutes in all.
- Storyboards: script/boards/chNN.yaml; scene code src/scenes/chNN.js; voice word timing in src/gen/chNN.js (CHAPTER.lines[].words as [word, start, end] in chapter seconds; use these, not guesses, when you judge sync).
- The site: built pages under site/public/ (the film page is site/review/round7/annotated.html; notes source in notes/annotations.yaml; model sheets site/review/round4/). Phone and desktop screenshots in out/quality/phone and out/quality/desktop. The live site is https://curtcox.github.io/The-Last-Evolution/ (use a generic User-Agent if you fetch it).

Tools and tips:
- ffmpeg is installed but has no drawtext filter. Frame sheets: `ffmpeg -v error -y -ss START -i VIDEO -vf "fps=1/STEP,scale=320:-1,tile=6x4" -frames:v 1 OUT.jpg`, then view with the Read tool; tile k is at about START + k*STEP. Crop full-size frames for detail: `ffmpeg -ss T -i V -frames:v 1 -vf crop=960:540:X:Y out.jpg`.
- Loudness: `ffmpeg -hide_banner -ss A -t D -i V -vn -af ebur128 -f null - 2>&1 | grep -E '^\s+I:'` (target about -14.5 LUFS). Levels: `-af astats` and grep 'RMS level dB' (head -1).
- The shell is zsh: `set -- $var` does not word-split; pass arguments explicitly.
- Transcripts with words lost/extra may exist in out/ask/chNN/hear.json.
- The `yaml` npm package resolves only when node runs from the repo directory.

Do a real watch: for every chapter, at least one whole-chapter sheet (step about duration/24), then closer sheets (step 1-5 s) wherever something looks off or the story has a key beat. Look for: figures overlapping or hidden, things appearing or vanishing without a cut, illegible or too-dark shots, bare paper at frame edges, staging that contradicts the narration, characters frozen while others speak, repeated gestures that read as loops, continuity breaks between shots and chapters, sound level jumps or dropouts, sync of cuts to words (check against the word times), story beats that don't land, lettering errors; and on the site: wrong or stale wording, pages contradicting each other, broken layout at phone width, links, anything addressed to the makers instead of visitors.

Report back (as your final message, plain text) a list of findings, most serious first. For each: chapter or page, timestamp (m:ss) or element, what is wrong, why it matters, severity (major / minor / nit), and the evidence (which sheet or measurement). If you find nothing wrong in an area, say what you checked. Be concrete and honest: don't invent problems to fill the list, and don't pass over real ones. Keep the report under about 1200 words.

#### The helper did · 13:40

- Ran: List repo, rubric sizes, video durations
- Ran: Read rubric and quality doc
- Ran: PLAN headings
- Ran: Read PLAN sections 5-6
- Ran: Make whole-chapter frame sheets
- Read `scratchpad/fresh3/whole00.jpg`
- Read `scratchpad/fresh3/whole01.jpg`
- Read `scratchpad/fresh3/whole02.jpg`
- Read `scratchpad/fresh3/whole03.jpg`
- Read `scratchpad/fresh3/whole04.jpg`
- Read `scratchpad/fresh3/whole05.jpg`
- Read `scratchpad/fresh3/whole06.jpg`
- Read `scratchpad/fresh3/whole07.jpg`
- Read `scratchpad/fresh3/whole08.jpg`
- Read `scratchpad/fresh3/whole09.jpg`
- Read `scratchpad/fresh3/whole10.jpg`
- Read `scratchpad/fresh3/whole11.jpg`
- Ran: Inspect script structure
- Ran: Look at gen and board format
- Ran: Dump word timings per chapter
- Ran: Crop title page and fine sheet
- Read `scratchpad/fresh3/c00title.jpg`
- Read `scratchpad/fresh3/c00b.jpg`
- Ran: Board summary ch01 and words
- Ran: Run board dump from repo dir
- Ran: Dump all boards
- Ran: Fine sheets ch01 opening
- Read `scratchpad/fresh3/c01a.jpg`
- Read `scratchpad/fresh3/c01b.jpg`
- Ran: Full frame and sheet ch01 games
- Read `scratchpad/fresh3/f01_70.jpg`
- Read `scratchpad/fresh3/c01c.jpg`
- Ran: Search runners in ch01 scene
- Ran: Read ch01 scene C/D code
- Ran: Sheets ch01 numbers and ending
- Read `scratchpad/fresh3/c01d.jpg`
- Read `scratchpad/fresh3/c01e.jpg`
- Ran: Board and words ch02
- Ran: Sheet ch02 power room
- Read `scratchpad/fresh3/c02j.jpg`
- Ran: Sheets ch02 Outsiders and blow
- Read `scratchpad/fresh3/c02g.jpg`
- Read `scratchpad/fresh3/c02h.jpg`
- Ran: Sheet ch02 2:26-2:38
- Read `scratchpad/fresh3/c02i.jpg`
- Ran: Sheets ch02 M and N
- Read `scratchpad/fresh3/c02m.jpg`
- Read `scratchpad/fresh3/c02n.jpg`
- Ran: Full frames ch02 M, N, O
- Read `scratchpad/fresh3/f02_250.jpg`
- Read `scratchpad/fresh3/f02_286.jpg`
- Read `scratchpad/fresh3/f02_300.jpg`
- Ran: Full frame ch02 beam
- Read `scratchpad/fresh3/f02_285.jpg`
- Ran: Beam frames ch02 crop sheet
- Read `scratchpad/fresh3/c02beam.jpg`
- Ran: Grep beam and hiding in ch02 scene
- Ran: Read ch02 hide/beam code
- Ran: Board and words ch03
- Ran: Sheets ch03 weapons and screen
- Read `scratchpad/fresh3/c03e.jpg`
- Ran: Full frame ch03 at 80s
- Read `scratchpad/fresh3/f03_80.jpg`
- Read `scratchpad/fresh3/c03ij.jpg`
- Ran: Sheet ch03 Colorado
- Read `scratchpad/fresh3/c03k.jpg`
- Ran: Full frames ch03 K and L
- Read `scratchpad/fresh3/f03_211.jpg`
- Read `scratchpad/fresh3/f03_230.jpg`
- Ran: Sheets ch03 Roal's speech
- Read `scratchpad/fresh3/c03s.jpg`
- Read `scratchpad/fresh3/c03u.jpg`
- Ran: Look for periodic gestures in ch03
- Ran: Board and words ch04
- Ran: Full frames ch04
- Read `scratchpad/fresh3/f04_145.jpg`
- Read `scratchpad/fresh3/f04_8.jpg`
- Ran: Board and words ch05
- Ran: Sheet ch05 birth and Morey page
- Read `scratchpad/fresh3/c05u.jpg`
- Ran: Sheet ch05 F-1 falls
- Read `scratchpad/fresh3/c05x.jpg`
- Ran: Board and words ch06
- Ran: Sheet ch06 screens colour
- Read `scratchpad/fresh3/c06e.jpg`
- Ran: Fine sheet violet moment
- Read `scratchpad/fresh3/c06v.jpg`
- Ran: Sheet ch06 F generator
- Read `scratchpad/fresh3/c06f.jpg`
- Read `scratchpad/fresh3/f06_120.jpg`
- Ran: Check Outsiders' motion ch06
- Read `scratchpad/fresh3/c06g.jpg`
- Ran: Board and words ch07
- Ran: Sheets ch07 dome and speech
- Read `scratchpad/fresh3/c07j.jpg`
- Ran: Fine sheet ch07 2:54-3:18
- Read `scratchpad/fresh3/c07l.jpg`
- Ran: Full frames ch07 cutaway and dome
- Read `scratchpad/fresh3/f07_207.jpg`
- Read `scratchpad/fresh3/f07_168.jpg`
- Ran: Board and words ch08
- Ran: Frames ch08 inside dome
- Read `scratchpad/fresh3/f08_15.jpg`
- Read `scratchpad/fresh3/f08_200.jpg`
- Read `scratchpad/fresh3/c08d.jpg`
- Ran: Sheet ch08 power plant growth
- Read `scratchpad/fresh3/c08k.jpg`
- Ran: Board and words ch09
- Ran: Sheets ch09 red beam and golden sphere
- Read `scratchpad/fresh3/c09i.jpg`
- Ran: Fine sheet ch09 2:18-2:30
- Read `scratchpad/fresh3/c09i2.jpg`
- Read `scratchpad/fresh3/c09k.jpg`
- Ran: Sheet ch09 sphere growth and exit
- Read `scratchpad/fresh3/c09n.jpg`
- Ran: Board and words ch10
- Ran: Sheet ch10 flagship
- Read `scratchpad/fresh3/c10f.jpg`
- Ran: Board and words ch11
- Ran: Check who narrates closing paragraphs
- Ran: Crop ch11 text page
- Read `scratchpad/fresh3/f11_110.jpg`
- Read `scratchpad/fresh3/f11_116.jpg`
- Ran: Measure loudness for all chapters
- Ran: Log momentary loudness per chapter
- Ran: Inspect ebur128 log format
- Ran: Find ebur128 frame lines
- Ran: Log momentary loudness with verbose
- Ran: Analyse line levels, dropouts
- Ran: List hear transcripts
- Ran: Summarise transcript losses
- Ran: List site pages and screenshots
- Ran: Extract home page text
- Ran: Extract watch page text
- Ran: Inspect watch redirect and annotated page
- Ran: Read remaining annotations
- Ran: Extract About and Review page text
- Ran: Extract Review page text
- Ran: Find video sources on film page
- Ran: Compare draft hashes to film page
- Ran: Look at captions on film page
- Ran: Search for captions/track logic
- Ran: Find vtt references
- Ran: Locate caption code in film page
- Ran: List phone screenshots and sizes
- Read `out/quality/phone/review_round7_annotated.jpg`
- Read `out/quality/phone/review_round6_film.jpg`
- Ran: Check round6 pages' videos and text
- Ran: Compare live site to built pages
- Ran: Check internal links and a video URL
- Ran: Read page text and restored markers
- Ran: Grep pages for stale or maker-facing text
- Ran: Extract quality scorecard text
- Ran: Frame of kilads footnote
- Read `scratchpad/fresh3/f02_31.jpg`
- Ran: Read ch02 footnote code
- Ran: Sheet of footnote hold
- Read `scratchpad/fresh3/c02fn.jpg`
- Ran: Sheet ch03 nothing living and torpedoes
- Read `scratchpad/fresh3/c03m.jpg`
- Ran: Full frames ch03 M
- Read `scratchpad/fresh3/f03_256.jpg`
- Read `scratchpad/fresh3/f03_266.jpg`
- Read `out/quality/phone/notes_factcheck.jpg`
- Read `out/quality/phone/read.jpg`
- Ran: Check notes edit dates
- Ran: Frame of CRU-1 lettering
- Read `scratchpad/fresh3/f05_472.jpg`
