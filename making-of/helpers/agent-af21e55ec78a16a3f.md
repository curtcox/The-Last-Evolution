# Helper: Fresh-eyes review of film and site

Started in [2026-11-04](../parts/2026-11-04.md). [All parts](../README.md)

A helper is another copy of Claude, started with its own instructions for one job. It sees only what it's given.

#### Claude, to the helper · 14:11

You are doing a fresh-eyes quality review of an animated film and its companion website, in the repository at .. The film adapts John W. Campbell's 1932 story "The Last Evolution" as twelve chapters (ch00-ch11) in a pulp ink-and-wash style. You have no earlier context, and that is the point: judge it as a first-time viewer and a careful critic.

READ-ONLY: do not edit, commit, render, or publish anything, and do not run `npm run ask` or any paid model call. Write scratch files only under scratchpad/fresh/.

What to judge against: quality/rubric.yaml (the criteria for each item: acting, picture, sync, sound, story per chapter; the site pages; work items) and QUALITY.md. Also skim PLAN.md section 5 (designs) and the story text in script/ for what each chapter must convey.

Material:
- Film drafts: out/review/round6/video/ch00-draft.mp4 … ch11-draft.mp4 (chapter 5 is out/review/round5/video/ch05-draft.mp4). About 57 minutes in all.
- Storyboards and shot lists: src/scenes/chNN.js and the boards/align files they reference; captions and transcripts if present under out/ or site/.
- The site: built pages under site/ (the film page is site/review/round7/annotated.html; others are listed by the links in site/index.html). Phone and desktop screenshots are in out/quality/phone and out/quality/desktop.

Tools and tips:
- ffmpeg is installed but has no drawtext filter. Make frame sheets like: `ffmpeg -v error -y -ss START -i VIDEO -vf "fps=1/STEP,scale=320:-1,tile=6x4" -frames:v 1 OUT.jpg`, then look at them with the Read tool. Know the spacing so you can map a tile to a time (tile k is at START + k*STEP, roughly). Crop full-size frames to inspect detail: `ffmpeg -ss T -i V -frames:v 1 -vf crop=960:540:X:Y out.jpg`.
- Loudness: `ffmpeg -hide_banner -ss A -t D -i V -vn -af ebur128 -f null - 2>&1 | grep -E '^\s+I:'`. The film targets about -14.5 LUFS.
- To hear the words, there may be existing transcripts in out/ask/chNN/hear.json (words lost/extra versus the script, timing offsets). Reading those is fine.
- The `yaml` npm package resolves only when node runs from the repo directory.

Do a real watch: for every chapter, at least one whole-chapter sheet (step about duration/24), then closer sheets (step 2-5 s) wherever something looks off or the story has a key beat. Look for: figures overlapping or hidden, things appearing or vanishing without a cut, illegible or too-dark shots, staging that contradicts the narration, continuity breaks between shots and chapters, sound level jumps, sync of cuts to words, story beats that don't land, and on the site: wrong or stale wording, broken layout at phone width, links, anything addressed to the makers instead of visitors.

Report back (as your final message, plain text) a list of findings, most serious first. For each: chapter or page, timestamp (m:ss) or element, what is wrong, why it matters, severity (major / minor / nit), and the evidence (which sheet or measurement). If you find nothing wrong in an area, say what you checked. Be concrete and honest: don't invent problems to fill the list, and don't pass over real ones. Keep the report under about 1200 words.

#### The helper did · 14:11

- Ran: List repo, quality files, and draft videos
- Ran: Read rubric and quality docs
- Ran: Read PLAN sections 5-6 and chapters
- Ran: Video durations and folder listing
- Ran: Make whole-chapter frame sheets
- Read `scratchpad/fresh/ch00-whole.jpg`
- Read `scratchpad/fresh/ch01-whole.jpg`
- Ran: Scene file sizes and board listing
- Read `scratchpad/fresh/ch02-whole.jpg`
- Read `scratchpad/fresh/ch03-whole.jpg`
- Read `scratchpad/fresh/ch04-whole.jpg`
- Read `scratchpad/fresh/ch05-whole.jpg`
- Read `scratchpad/fresh/ch06-whole.jpg`
- Read `scratchpad/fresh/ch07-whole.jpg`
- Read `scratchpad/fresh/ch08-whole.jpg`
- Read `scratchpad/fresh/ch09-whole.jpg`
- Read `scratchpad/fresh/ch10-whole.jpg`
- Read `scratchpad/fresh/ch11-whole.jpg`
- Ran: Check transcript freshness and structure
- Ran: Summarize transcript word losses per chapter
- Ran: Inspect extra and lost words
- Ran: Measure integrated loudness for each chapter
- Ran: Find loud momentary spikes per chapter
- Ran: Find timeline files and round7 site files
- Ran: Inspect chapter output folders
- Ran: Inspect timeline.json structure
- Ran: Build per-chapter shot and line digests
- Ran: Read digests for chapters 0-2
- Ran: Close sheet of ch02 power room shot
- Read `scratchpad/fresh/ch02-160.jpg`
- Ran: Grab ch02 Outsiders frames
- Read `scratchpad/fresh/ch02-88.jpg`
- Read `scratchpad/fresh/ch02-110.jpg`
- Ran: Read ch02 board shots G and H
- Ran: Read digests for chapters 3-4
- Ran: Close sheets for ch03 opening and Roal's speech
- Read `scratchpad/fresh/ch03-366.jpg`
- Read `scratchpad/fresh/ch03-0.jpg`
- Ran: Read selected board shots for ch03, ch04, ch08
- Ran: 1-second sheet of ch03 50-74s, lines
- Read `scratchpad/fresh/ch03-50.jpg`
- Ran: Sheets for ch03 battle and wreck study
- Read `scratchpad/fresh/ch03-280.jpg`
- Ran: Sheets for ch04 building of F-1
- Read `scratchpad/fresh/ch04-196.jpg`
- Ran: Grab ch04 frame at 268s
- Read `scratchpad/fresh/ch04-268.jpg`
- Read `scratchpad/fresh/ch04-300.jpg`
- Ran: Search script and scenes for F-1 and MX-3401
- Ran: Quad frames ch04 and code near label
- Read `scratchpad/fresh/ch04-quad.jpg`
- Ran: Quad frames ch04 council
- Read `scratchpad/fresh/ch04-quad2.jpg`
- Ran: Read ch05 digest
- Ran: Sheets for ch05 birth and ruler
- Read `scratchpad/fresh/ch05-236.jpg`
- Ran: 1-s sheet ch05 286-310 and lines
- Read `scratchpad/fresh/ch05-286.jpg`
- Ran: 2-s sheet ch05 310-358
- Read `scratchpad/fresh/ch05-310.jpg`
- Read `scratchpad/fresh/ch05-420.jpg`
- Ran: Crop ch05 C-R-U-1 lettering
- Read `scratchpad/fresh/ch05-470crop.jpg`
- Ran: Read ch06 and ch07 digests
- Ran: 2-s sheet ch06 232-280 and lines
- Read `scratchpad/fresh/ch06-232.jpg`
- Ran: Line text and board for ch06 J-L
- Ran: Read ch08 and ch09 digests
- Ran: Sheets for ch09 golden sphere
- Read `scratchpad/fresh/ch09-196.jpg`
- Read `scratchpad/fresh/ch09-230.jpg`
- Ran: Word timings and board for ch09 J-N
- Ran: Quad frames ch09 golden sphere beats
- Read `scratchpad/fresh/ch09-quad.jpg`
- Ran: Half-second crops of ch09 ruby flame
- Read `scratchpad/fresh/ch09-247.jpg`
- Ran: Crop ruby flame frames and grep code
- Read `scratchpad/fresh/ch09-ruby.jpg`
- Ran: Sheet of ch08 F-2 speech; brightness samples
- Read `scratchpad/fresh/ch08-163.jpg`
- Ran: Measure figure motion in ch08 F-2 speech
- Ran: Read ch10, ch11, ch00 digests
- Ran: Frames of ch11 end pages
- Read `scratchpad/fresh/ch11-end.jpg`
- Ran: Quad frames ch00
- Read `scratchpad/fresh/ch00-quad.jpg`
- Ran: 2-s sheet ch01 93-140 and lines
- Read `scratchpad/fresh/ch01-93.jpg`
- Ran: Frame ch01 113s and board E
- Read `scratchpad/fresh/ch01-113.jpg`
- Ran: Sheet ch07 150-210
- Read `scratchpad/fresh/ch07-150.jpg`
- Ran: Sheet ch10 86-155 and lines
- Read `scratchpad/fresh/ch10-86.jpg`
- Ran: List site pages and screenshots
- Ran: Extract home page text
- Ran: Extract watch and annotated page text
- Ran: Show watch page source and annotated text
- Ran: Find video and caption references
- Ran: Check captions on film page and hashes
- Ran: Check draft hashes and rest of film page
- Ran: 2-s sheet ch02 20-68
- Read `scratchpad/fresh/ch02-20.jpg`
- Ran: Find kilads timing and footnote in ch02
- Ran: Check ch02 opening lines and kilads in script
- Ran: Search source for footnote drawing
- Ran: Inspect footnote references
- Ran: Check footnote handling in film page
- Ran: Full frames ch02 at 31 and 63s
- Read `scratchpad/fresh/ch02-31.jpg`
- Ran: Get phone screenshot dimensions
- Ran: Combine phone screenshots
- Read `scratchpad/fresh/phone4.jpg`
- Read `scratchpad/fresh/phone4b.jpg`
- Ran: Quality page text and files
- Ran: Check relative links across current site pages
- Ran: Review and About page text
- Ran: 1-s sheet ch03 283-306 and words
- Read `scratchpad/fresh/ch03-283.jpg`
- Ran: Find silences and loudness jumps
- Ran: Momentary loudness around silences
- Ran: Search sound design for intended silences
- Ran: Read hold definitions in boards
- Ran: Confirm digital silence levels
- Read `out/quality/desktop/review_round7_annotated.jpg`
- Ran: List note headings with timestamps
- Ran: Search pages for stale or maker-facing wording
- Ran: 2-s sheet ch07 84-132
- Read `scratchpad/fresh/ch07-84.jpg`
- Ran: Frames ch07 machines ring
- Read `scratchpad/fresh/ch07-ring.jpg`
- Ran: Sheet ch04 induction beam and words
- Read `scratchpad/fresh/ch04-12.jpg`
- Ran: Crop ch04 ray-machine near Roal
- Read `scratchpad/fresh/ch04-30crop.jpg`
- Ran: Crops ch09 203-210 men emerging
- Read `scratchpad/fresh/ch09-203.jpg`
- Ran: Third-second crops ch09 201-207
- Read `scratchpad/fresh/ch09-201f.jpg`
