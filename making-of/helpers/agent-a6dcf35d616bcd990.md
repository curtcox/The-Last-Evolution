# Helper: Sixth fresh-eyes review of film and site

Started in [2026-11-07](../parts/2026-11-07.md). [All parts](../README.md)

A helper is another copy of Claude, started with its own instructions for one job. It sees only what it's given.

#### Claude, to the helper · 02:24

You are doing a fresh-eyes quality review of an animated film and its companion website, in the repository at .. The film adapts John W. Campbell's 1932 story "The Last Evolution" as twelve chapters (ch00-ch11) in a pulp ink-and-wash style. You have no earlier context, and that is the point: judge it as a first-time viewer and a careful critic.

READ-ONLY: do not edit, commit, render, or publish anything, and do not run `npm run ask` or any paid model call. Write scratch files only under scratchpad/fresh6/.

What to judge against: quality/rubric.yaml (the criteria for each item: acting, picture, sync, sound, story per chapter; the site pages; work items) and QUALITY.md. Also skim PLAN.md section 5 (designs) and the story text in script/script.yaml for what each chapter must convey. Judge against that bar: report what falls short of it, not matters of taste the bar doesn't ask for. Severity matters: "major" means a viewer would be confused or misled, or the text is contradicted; "minor" means it noticeably weakens a beat; "nit" is polish. The look's direction (how designs such as the beings of force are drawn) and voicing by ear are the producer's calls, not yours: don't report them.

Material:
- Film drafts: out/review/round6/video/ch00-draft.mp4 … ch11-draft.mp4 (chapter 5 is out/review/round5/video/ch05-draft.mp4). About 57 minutes in all.
- Storyboards: script/boards/chNN.yaml; scene code src/scenes/chNN.js; voice word timing in src/gen/chNN.js (CHAPTER.lines[].words as [word, start, end] in chapter seconds; use these, not guesses, when you judge sync).
- The site: built pages under site/public/ (the film page is site/review/round7/annotated.html; notes source in notes/annotations.yaml; model sheets site/review/round4/). Phone and desktop screenshots in out/quality/phone and out/quality/desktop (fresh today). The live site is https://curtcox.github.io/The-Last-Evolution/ (use a generic User-Agent if you fetch it).

Tools and tips:
- ffmpeg is installed but has no drawtext filter. Frame sheets: `ffmpeg -v error -y -ss START -i VIDEO -vf "fps=1/STEP,scale=320:-1,tile=6x4" -frames:v 1 OUT.jpg`, then view with the Read tool; tile k is at about START + k*STEP. Crop full-size frames for detail: `ffmpeg -ss T -i V -frames:v 1 -vf crop=960:540:X:Y out.jpg`.
- Loudness: `ffmpeg -hide_banner -ss A -t D -i V -vn -af ebur128 -f null - 2>&1 | grep -E '^\s+I:'` (target about -14.5 LUFS). Levels: `-af astats` and grep 'RMS level dB' (head -1).
- The shell is zsh: `set -- $var` does not word-split; pass arguments explicitly.
- The `yaml` npm package resolves only when node runs from the repo directory.

Do a real watch: for every chapter, at least one whole-chapter sheet (step about duration/24), then closer sheets (step 1-5 s) wherever something looks off or the story has a key beat. Look for: figures overlapping or hidden, things appearing or vanishing without a cut, illegible or too-dark shots, bare paper at frame edges, staging that contradicts the narration, characters frozen while others speak, repeated gestures that read as loops, continuity breaks between shots and chapters, sound level jumps or dropouts, sync of beats to words (check against the word times), story beats that don't land, lettering errors; and on the site: wrong or stale wording, pages contradicting each other or the film, broken layout at phone width, links, anything addressed to the makers instead of visitors.

Report back (as your final message, plain text) a list of findings, most serious first. For each: chapter or page, timestamp (m:ss) or element, what is wrong, why it matters, severity (major / minor / nit), and the evidence (which sheet or measurement). If you find nothing wrong in an area, say what you checked. Be concrete and honest: don't invent problems to fill the list, and don't pass over real ones. Keep the report under about 1200 words.

#### The helper did · 02:24

- Ran: List repo, sizes, and video durations
- Ran: Read rubric and quality doc
- Ran: PLAN.md headings
- Ran: Read PLAN sections 5 and 6
- Ran: Make whole-chapter frame sheets
- Ran: Inspect gen file format
- Ran: Dump line timings per chapter
- Ran: Chapter durations and ch00 board
- Read `scratchpad/fresh6/ch00-whole.jpg`
- Ran: Grab full frames ch00
- Read `scratchpad/fresh6/c00-30.jpg`
- Ran: ch01 words and board shots
- Read `scratchpad/fresh6/ch01-whole.jpg`
- Ran: Closer sheet ch01 50-98s
- Read `scratchpad/fresh6/c01-50.jpg`
- Ran: Word time lookup tool
- Ran: ch02 words and shots
- Read `scratchpad/fresh6/ch02-whole.jpg`
- Ran: ch02 closer sheets
- Read `scratchpad/fresh6/c02-170.jpg`
- Read `scratchpad/fresh6/c02-0.jpg`
- Ran: Word times around explosion
- Ran: Quarter-second sheet 182-186s
- Read `scratchpad/fresh6/c02-182.jpg`
- Ran: Find plunger cue in scene code
- Ran: Read plunger scene code
- Ran: ch03 words and shots
- Read `scratchpad/fresh6/ch03-whole.jpg`
- Ran: ch03 closer sheets
- Read `scratchpad/fresh6/c03-370.jpg`
- Ran: Full frame ch03 6:40
- Read `scratchpad/fresh6/c03-400.jpg`
- Ran: Crop screen detail
- Read `scratchpad/fresh6/c03-400crop.jpg`
- Read `scratchpad/fresh6/c03-0.jpg`
- Ran: ch03 board B-D and p018.1 text
- Ran: Closer sheet of Roal pose 26-62s
- Read `scratchpad/fresh6/c03-26.jpg`
- Ran: Frame ch03 0:54
- Read `scratchpad/fresh6/c03-54.jpg`
- Ran: ch04 words and shots
- Read `scratchpad/fresh6/ch04-whole.jpg`
- Ran: ch04 closer sheet end and board
- Read `scratchpad/fresh6/c04-244.jpg`
- Ran: ch04 sheet 36-132s
- Read `scratchpad/fresh6/c04-36.jpg`
- Ran: ch05 words and shots
- Read `scratchpad/fresh6/ch05-whole.jpg`
- Ran: ch05 closer sheet 7:00-8:36
- Read `scratchpad/fresh6/c05-420.jpg`
- Ran: Crop CRU1 lettering
- Read `scratchpad/fresh6/c05-471.jpg`
- Ran: ch05 birth sequence sheet
- Read `scratchpad/fresh6/c05-255.jpg`
- Ran: F-1 fall half-second sheet
- Read `scratchpad/fresh6/c05-284.jpg`
- Ran: ch06 words and shots
- Read `scratchpad/fresh6/ch06-whole.jpg`
- Ran: ch06 word times for colours and last charge
- Ran: ch06 closer sheets
- Read `scratchpad/fresh6/c06-230.jpg`
- Read `scratchpad/fresh6/c06-68.jpg`
- Ran: ch07 words and shots
- Read `scratchpad/fresh6/ch07-whole.jpg`
- Ran: ch07 ending sheet
- Read `scratchpad/fresh6/c07-250.jpg`
- Read `scratchpad/fresh6/c07-258.jpg`
- Ran: ch07 sheet 1:20-2:08 and board E-H
- Read `scratchpad/fresh6/c07-80.jpg`
- Ran: Frame ch07 1:26
- Read `scratchpad/fresh6/c07-86.jpg`
- Ran: ch08 words and shots
- Read `scratchpad/fresh6/ch08-whole.jpg`
- Ran: ch08 closer sheets
- Read `scratchpad/fresh6/c08-0.jpg`
- Read `scratchpad/fresh6/c08-160.jpg`
- Ran: ch09 words and shots
- Read `scratchpad/fresh6/ch09-whole.jpg`
- Ran: ch09 sphere fight sheet and words
- Read `scratchpad/fresh6/c09-136.jpg`
- Ran: Quarter-second sheet for blue-white beam
- Read `scratchpad/fresh6/c09-139.jpg`
- Ran: ch09 ending and sunrise sheets
- Read `scratchpad/fresh6/c09-297.jpg`
- Read `scratchpad/fresh6/c09-180.jpg`
- Ran: Sample storm 174-190 every 2/3 s
- Read `scratchpad/fresh6/c09-174.jpg`
- Ran: ch09 board J and lightning code
- Ran: Frame ch09 3:08
- Read `scratchpad/fresh6/c09-188.jpg`
- Ran: ch10/11 words and shots
- Read `scratchpad/fresh6/ch10-whole.jpg`
- Ran: ch10 p134.1 text and board F-G
- Read `scratchpad/fresh6/ch11-whole.jpg`
- Ran: Loudness and short-term loudness per chapter
- Ran: Per-line short-term loudness and quiet gaps
- Ran: List screenshots and site pages
- Ran: Phone screenshot list and sizes
- Ran: Montage phone screenshots
- Read `scratchpad/fresh6/phone-montage.jpg`
- Ran: Extract text of home and watch pages
- Ran: Watch redirect and annotated page text
- Ran: Rest of annotated page text
- Ran: Check note facts against story text
- Ran: Locate source lines for notes
- Ran: Search for Roal's age source
- Ran: Search for Roal age anywhere
- Ran: All 'hundred' occurrences in story text
- Ran: About and Review page text
- Ran: Check annotated page video sources and captions
- Ran: Inspect video and caption references
- Ran: Compare local draft hashes with page names
- Ran: Check live site pages and a video link
- Ran: Check image alt text
- Ran: Check image alt text
- Ran: Find pages with escaped HTML in alt text
- Ran: Read page text start and end
- Ran: Inspect Read page figure markup
- Ran: Print figure markup on Read page
- Read `scratchpad/fresh6/c00-10.jpg`
- Ran: ch01 machine-history sync sheet
- Read `scratchpad/fresh6/c01-11.jpg`
- Ran: ch02 sheet 0:34-1:22 and boards D-F
- Read `scratchpad/fresh6/c02-34.jpg`
- Ran: Chapter pages for ch04, ch05, ch09
- Read `scratchpad/fresh6/pages.jpg`
- Ran: Read F-2's memory lines
- Ran: Montage desktop screenshots
- Read `scratchpad/fresh6/desk.jpg`
- Ran: Frame ch04 4:25
- Read `scratchpad/fresh6/c04-265.jpg`
