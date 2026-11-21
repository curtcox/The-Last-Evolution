# Helper: Fifth fresh-eyes review of film and site

Started in [2026-11-06](../parts/2026-11-06.md). [All parts](../README.md)

A helper is another copy of Claude, started with its own instructions for one job. It sees only what it's given.

#### Claude, to the helper · 13:25

You are doing a fresh-eyes quality review of an animated film and its companion website, in the repository at .. The film adapts John W. Campbell's 1932 story "The Last Evolution" as twelve chapters (ch00-ch11) in a pulp ink-and-wash style. You have no earlier context, and that is the point: judge it as a first-time viewer and a careful critic.

READ-ONLY: do not edit, commit, render, or publish anything, and do not run `npm run ask` or any paid model call. Write scratch files only under scratchpad/fresh5/.

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

#### The helper did · 13:25

- Ran: List repo and video durations
- Ran: Read rubric and quality doc
- Ran: Read PLAN sections 5-6
- Ran: Peek at script and boards
- Ran: Inspect gen file format
- Ran: Dump word timings per chapter
- Ran: Generate whole-chapter frame sheets
- Read `scratchpad/fresh5/whole00.jpg`
- Read `script/boards/ch00.yaml`
- Ran: Closer frames chapter 0
- Read `scratchpad/fresh5/c00_30.jpg`
- Read `scratchpad/fresh5/c00_44.jpg`
- Ran: Sheet ch0 33-45s
- Read `scratchpad/fresh5/c00_33.jpg`
- Read `scratchpad/fresh5/whole01.jpg`
- Ran: Words and shot list ch1
- Ran: Closer sheets ch1
- Read `scratchpad/fresh5/c01_53.jpg`
- Ran: Read ch1 board shots C-J
- Ran: Sheet ch1 60-69s
- Read `scratchpad/fresh5/c01_60.jpg`
- Read `scratchpad/fresh5/c01_115.jpg`
- Ran: Frame ch1 2:04
- Read `scratchpad/fresh5/c01_124.jpg`
- Read `scratchpad/fresh5/whole02.jpg`
- Ran: Words and shots ch2
- Ran: Sheets ch2 opening and D-G
- Read `scratchpad/fresh5/c02_0.jpg`
- Read `scratchpad/fresh5/c02_34.jpg`
- Ran: Sheet ch2 1:40-2:28
- Read `scratchpad/fresh5/c02_100.jpg`
- Ran: Frame ch2 2:02
- Read `scratchpad/fresh5/c02_122.jpg`
- Ran: Sheet ch2 explosion
- Read `scratchpad/fresh5/c02_176.jpg`
- Ran: Sheet ch2 4:30-4:54 and key words
- Read `scratchpad/fresh5/c02_270.jpg`
- Ran: Sheet ch2 3:32-4:32
- Read `scratchpad/fresh5/c02_212.jpg`
- Ran: Frame ch2 4:15
- Read `scratchpad/fresh5/c02_255.jpg`
- Read `scratchpad/fresh5/whole03.jpg`
- Ran: Words and shots ch3
- Ran: Sheets ch3 start and D-E
- Read `scratchpad/fresh5/c03_0.jpg`
- Read `scratchpad/fresh5/c03_56.jpg`
- Ran: Frame ch3 1:12
- Read `scratchpad/fresh5/c03_72.jpg`
- Ran: Sheet ch3 2:30-3:18
- Read `scratchpad/fresh5/c03_150.jpg`
- Ran: Sheet ch3 3:12-4:00
- Read `scratchpad/fresh5/c03_192.jpg`
- Ran: Full frame ch3 3:29
- Read `scratchpad/fresh5/c03_209.jpg`
- Ran: Bottom strip sheet ch3 3:29-3:37
- Read `scratchpad/fresh5/c03_209s.jpg`
- Read `scratchpad/fresh5/c03_191.jpg`
- Ran: Sheet ch3 4:04-5:16 and board
- Read `scratchpad/fresh5/c03_244.jpg`
- Ran: Half-second sheet ch3 4:18-4:24
- Read `scratchpad/fresh5/c03_258.jpg`
- Ran: Sheets ch3 5:00-8:06
- Read `scratchpad/fresh5/c03_300.jpg`
- Ran: Frame ch3 6:02
- Read `scratchpad/fresh5/c03_362.jpg`
- Read `scratchpad/fresh5/c03_372.jpg`
- Ran: Measure loudness per chapter
- Read `scratchpad/fresh5/whole04.jpg`
- Ran: Words and shots ch4
- Ran: Designations in text and frames
- Read `scratchpad/fresh5/c04_15.jpg`
- Read `scratchpad/fresh5/c04_96.jpg`
- Ran: Sheet ch4 0:14-1:02
- Read `scratchpad/fresh5/c04_14.jpg`
- Ran: Board ch4 B-E and crop
- Read `scratchpad/fresh5/c04_59.jpg`
- Ran: Show loudness results
- Ran: Log momentary loudness per chapter
- Ran: Per-line loudness outliers and silences
- Ran: Sheet ch4 2:20-3:20 and board
- Read `scratchpad/fresh5/c04_140.jpg`
- Ran: Frames ch4 2:52 and 3:14
- Read `scratchpad/fresh5/c04_pair.jpg`
- Ran: Sheet ch4 2:57-3:21 at 1s
- Read `scratchpad/fresh5/c04_177.jpg`
- Ran: Sheet ch4 3:20-5:16 and board
- Read `scratchpad/fresh5/c04_200.jpg`
- Read `scratchpad/fresh5/whole05.jpg`
- Ran: Words and shots ch5
- Ran: Sheet ch5 4:10-4:58
- Read `scratchpad/fresh5/c05_250.jpg`
- Ran: Check the quiet gaps in ch5 and ch11
- Ran: Ch11 words and silence intent
- Ran: Ch5 holds and shots X-Y
- Ran: Sheet ch5 7:25-9:00 and C-R-U-1 frame
- Read `scratchpad/fresh5/c05_445.jpg`
- Read `scratchpad/fresh5/c05_470.jpg`
- Read `scratchpad/fresh5/whole06.jpg`
- Ran: Words and shots ch6
- Ran: Sheet ch6 colour beat and word times
- Read `scratchpad/fresh5/c06_62.jpg`
- Ran: Sheet ch6 3:54-4:18
- Read `scratchpad/fresh5/c06_234.jpg`
- Ran: Sheet ch6 1:33-2:45
- Read `scratchpad/fresh5/c06_93.jpg`
- Read `scratchpad/fresh5/whole07.jpg`
- Ran: Words and shots ch7
- Ran: Ch7 ending frames
- Read `scratchpad/fresh5/c07_246.jpg`
- Read `scratchpad/fresh5/c07_258.jpg`
- Ran: Sheet ch7 2:00-3:00
- Read `scratchpad/fresh5/c07_120.jpg`
- Ran: Frames of the cloud of blankness
- Read `scratchpad/fresh5/c07_cloud.jpg`
- Read `scratchpad/fresh5/c07_160.jpg`
- Read `scratchpad/fresh5/whole08.jpg`
- Ran: Words and shots ch8
- Ran: Sheet ch8 3:34-3:52
- Read `scratchpad/fresh5/c08_214.jpg`
- Ran: Zoom F-2 inside and outside
- Read `scratchpad/fresh5/c08_f2.jpg`
- Ran: Zoom F-2 again
- Read `scratchpad/fresh5/c08_f2.jpg`
- Ran: Sheet ch8 1:06-2:38
- Read `scratchpad/fresh5/c08_66.jpg`
- Ran: Frame ch8 1:40 and brightness
- Read `scratchpad/fresh5/c08_100.jpg`
- Read `scratchpad/fresh5/whole09.jpg`
- Ran: Words and shots ch9
- Ran: Sheet ch9 2:17-2:53
- Read `scratchpad/fresh5/c09_137.jpg`
- Ran: Word times for ch9/10 colour beats
- Ran: Half-second sheet ch9 2:40-2:52
- Read `scratchpad/fresh5/c09_160.jpg`
- Ran: Sheet ch9 3:02-3:38
- Read `scratchpad/fresh5/c09_182.jpg`
- Read `scratchpad/fresh5/whole10.jpg`
- Ran: Words and shots ch10
- Read `scratchpad/fresh5/whole11.jpg`
- Ran: Shots ch11
- Ran: Zoom closing pages ch11
- Read `scratchpad/fresh5/c11_p1.jpg`
- Read `scratchpad/fresh5/c11_p3.jpg`
- Ran: Who speaks the closing frame
- Ran: Check decisions on closing frame voice
- Ran: List site build and screenshots
- Read `out/quality/phone/home.jpg`
- Ran: Convert key pages to text
- Ran: Read About, Review, Watch, Notes text
- Ran: Read Review, Watch, Notes text
- Ran: Find video sources in annotated page
- Ran: Compare draft hashes
- Ran: Check video refs on round pages
- Ran: Read annotated page text start
- Ran: List 'making' notes
- Ran: Sheet ch8 4:14-4:26
- Read `scratchpad/fresh5/c08_254.jpg`
- Read `out/quality/phone/review_round7_annotated.jpg`
- Ran: Screenshot dimensions
- Loaded the skill `anthropic-skills:built-in-browser`
- Browser: opened https://curtcox.github.io/The-Last-Evolution/review/round7/annotated.html
- Browser: resize window
- Browser: ran a script in the page
- Browser: ran a script in the page
- Browser: screenshot
- Browser: ran a script in the page
- Browser: zoom
- Browser: ran a script in the page
- Browser: opened https://curtcox.github.io/The-Last-Evolution/review/quality/
- Browser: read the page
- Browser: resize window
