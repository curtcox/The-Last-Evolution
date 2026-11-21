# Helper: Fifteenth fresh-eyes review

Started in [2026-11-11](../parts/2026-11-11.md). [All parts](../README.md)

A helper is another copy of Claude, started with its own instructions for one job. It sees only what it's given.

#### Claude, to the helper · 04:30

You are doing a fresh-eyes quality review of an animated film and its companion website, in the repository at .. The film adapts John W. Campbell's 1932 story "The Last Evolution" as twelve chapters (ch00-ch11) in a pulp ink-and-wash style. You have no earlier context, and that is the point: judge it as a first-time viewer and a careful critic.

READ-ONLY: do not edit, commit, render, or publish anything, and do not run `npm run ask` or any paid model call. Write scratch files only under scratchpad/fresh15/.

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

#### The helper did · 04:30

- Ran: List repo and review material
- Ran: Read the rubric and quality guide
- Ran: List PLAN.md sections
- Ran: Read PLAN.md sections 5-6
- Ran: Get durations and list gen and boards
- Ran: Inspect generated timing file format

#### The helper · 04:31

Let me write a small dumper that prints each line's text with start times, plus shots, per chapter.

#### The helper did · 04:31

- Ran: Dump chapter word timings to text
- Ran: Make whole-chapter frame sheets
- Read `scratchpad/fresh15/w00.jpg`
- Ran: Read chapter 0 storyboard
- Read `scratchpad/fresh15/w01.jpg`
- Ran: Show chapter 1 text timing
- Read `scratchpad/fresh15/w02.jpg`
- Ran: Show chapter 2 text timing
- Read `scratchpad/fresh15/w03.jpg`
- Ran: Show chapter 3 text timing
- Read `scratchpad/fresh15/w04.jpg`
- Ran: Show chapter 4 text timing
- Read `scratchpad/fresh15/w05.jpg`
- Ran: Show chapter 5 text timing
- Read `scratchpad/fresh15/w06.jpg`
- Ran: Show chapter 6 text timing
- Read `scratchpad/fresh15/w07.jpg`
- Ran: Show chapter 7 text timing
- Read `scratchpad/fresh15/w08.jpg`
- Ran: Show chapter 8 text timing
- Read `scratchpad/fresh15/w09.jpg`
- Ran: Show chapter 9 text timing
- Read `scratchpad/fresh15/w10.jpg`
- Ran: Show chapters 10-11 text timing
- Read `scratchpad/fresh15/w11.jpg`
- Ran: Measure integrated loudness per chapter
- Ran: Make close-up frame sheets for suspect spots
- Read `scratchpad/fresh15/c02a.jpg`
- Read `scratchpad/fresh15/c00a.jpg`
- Read `scratchpad/fresh15/c04a.jpg`
- Read `scratchpad/fresh15/c05a.jpg`
- Ran: Show loudness results and F-1 fall sheet
- Read `scratchpad/fresh15/c05b.jpg`
- Ran: Look up word times for key cue words
- Read `scratchpad/fresh15/c06a.jpg`
- Ran: Make fine-step sheet of screen colours
- Read `scratchpad/fresh15/c06b.jpg`
- Read `scratchpad/fresh15/c09a.jpg`
- Ran: Sheets for ch09 sphere death and ch08 speech
- Read `scratchpad/fresh15/c09b.jpg`
- Read `scratchpad/fresh15/c08a.jpg`
- Ran: Read chapter 8 shot D storyboard
- Ran: Grab chapter title page crops at 3 s
- Read `scratchpad/fresh15/titlesA.png`
- Ran: Grab chapter title page frames at 4.5 s
- Read `scratchpad/fresh15/titlesA.png`
- Read `scratchpad/fresh15/titlesB.png`
- Ran: Make chapter 3 close sheets
- Read `scratchpad/fresh15/c03a.jpg`
- Ran: Extract full frames from chapter 3
- Read `scratchpad/fresh15/f03_22.png`
- Read `scratchpad/fresh15/c03b.jpg`
- Read `scratchpad/fresh15/c03c.jpg`
- Ran: Compare Earth and Moon globes
- Read `scratchpad/fresh15/globes.png`
- Read `scratchpad/fresh15/c03d.jpg`
- Ran: List site screenshots and built pages
- Ran: Extract text of key site pages
- Ran: Check quality status and scorecard
- Ran: Extract text from the annotated film page
- Ran: Check which draft videos the film page uses
- Ran: Locate the hashed draft video referenced
- Ran: Read more of the annotated page text
- Ran: Read the rest of the annotated page text
- Ran: Sheet of chapter 2 footnotes stretch
- Read `scratchpad/fresh15/c02b.jpg`
- Ran: Get phone screenshot dimensions
- Ran: Combine phone screenshots into strips
- Read `scratchpad/fresh15/phoneA.jpg`
- Read `scratchpad/fresh15/phoneB.jpg`
- Ran: Log short-term loudness for each chapter
- Ran: Check per-line loudness jumps and dips
- Ran: Look for audio stems in out
- Ran: Sheets for ch08 F-2 speech, ch07, ch10, ch01
- Read `scratchpad/fresh15/c08b.jpg`
- Read `scratchpad/fresh15/c07a.jpg`
- Read `scratchpad/fresh15/c10a.jpg`
- Ran: Crop the golden sphere frames in chapter 9
- Read `scratchpad/fresh15/golden.png`
- Read `scratchpad/fresh15/c01a.jpg`
- Ran: More close sheets for ch02, ch04, ch05
- Read `scratchpad/fresh15/c02c.jpg`
- Read `scratchpad/fresh15/c02d.jpg`
- Ran: Word times of projector line and fine sheet
- Read `scratchpad/fresh15/c02e.jpg`
- Read `scratchpad/fresh15/c05c.jpg`
- Read `scratchpad/fresh15/c05d.jpg`
- Ran: Extract CRU-1 lettering frame
- Read `scratchpad/fresh15/f05_472.png`
- Read `scratchpad/fresh15/c04b.jpg`
- Ran: Extract chapter 4 frame at 3:56
- Read `scratchpad/fresh15/f04_236.png`
- Ran: Sheets for ch10 ship twisting and ch11
- Read `scratchpad/fresh15/c10b.jpg`
- Read `scratchpad/fresh15/c11a.jpg`
- Loaded the skill `anthropic-skills:built-in-browser`
- Browser: opened https://curtcox.github.io/The-Last-Evolution/review/round7/annotated.html
- Browser: resize window
- Browser: ran a script in the page
- Browser: ran a script in the page
- Browser: ran a script in the page
- Browser: screenshot
- Browser: resize window
- Ran: Search site for stale or placeholder wording
- Ran: Search site for stale or placeholder wording
- Ran: Show context of matched placeholder words
- Ran: Show context of matched words
- Ran: Show context of matched words
- Ran: Extract chapter 7 frame during Trest line
- Read `scratchpad/fresh15/f07_26.png`
- Ran: Sheets for ch06 blank screens and ch09 appearance
- Read `scratchpad/fresh15/c06c.jpg`
- Read `scratchpad/fresh15/c09c.jpg`
- Ran: Frame of golden sphere reveal and its board
- Read `scratchpad/fresh15/f09_218.png`
- Ran: Check THE END timing against last words
- Read `scratchpad/fresh15/c11b.jpg`
- Ran: Compare live site pages with built pages
