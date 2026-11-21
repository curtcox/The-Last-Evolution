# Helper: Ninth fresh-eyes quality review

Started in [2026-11-08](../parts/2026-11-08.md). [All parts](../README.md)

A helper is another copy of Claude, started with its own instructions for one job. It sees only what it's given.

#### Claude, to the helper · 11:47

You are doing a fresh-eyes quality review of an animated film and its companion website, in the repository at .. The film adapts John W. Campbell's 1932 story "The Last Evolution" as twelve chapters (ch00-ch11) in a pulp ink-and-wash style. You have no earlier context, and that is the point: judge it as a first-time viewer and a careful critic.

READ-ONLY: do not edit, commit, render, or publish anything, and do not run `npm run ask` or any paid model call. Write scratch files only under scratchpad/fresh9/.

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

#### The helper did · 11:47

- Ran: List repo and video durations
- Read `QUALITY.md`
- Read `quality/rubric.yaml`
- Ran: Create whole-chapter frame sheets
- Ran: Read script start
- Ran: Read rest of script without voice respell lines
- Read `PLAN.md`
- Read `tool-results/bn455by2l.txt`
- Read `scratchpad/fresh9/ch00-all.jpg`
- Read `scratchpad/fresh9/ch01-all.jpg`
- Read `scratchpad/fresh9/ch02-all.jpg`
- Read `scratchpad/fresh9/ch03-all.jpg`
- Read `scratchpad/fresh9/ch04-all.jpg`
- Read `scratchpad/fresh9/ch05-all.jpg`
- Read `scratchpad/fresh9/ch06-all.jpg`
- Read `scratchpad/fresh9/ch07-all.jpg`
- Read `scratchpad/fresh9/ch08-all.jpg`
- Read `scratchpad/fresh9/ch09-all.jpg`
- Read `scratchpad/fresh9/ch10-all.jpg`
- Read `scratchpad/fresh9/ch11-all.jpg`
- Ran: Dump voice word timing per chapter
- Ran: Dump word times with python
- Ran: Closer sheets for chapters 0 and 1
- Read `scratchpad/fresh9/ch00-b.jpg`
- Read `scratchpad/fresh9/ch00-c.jpg`
- Read `scratchpad/fresh9/ch01-a.jpg`
- Read `scratchpad/fresh9/ch01-b.jpg`
- Read `scratchpad/fresh9/ch01-c.jpg`
- Ran: Read chapter 1 storyboard
- Ran: Generate 3-second-step sheets for every chapter
- Ran: Word times for ch03/04 and recent commits

#### The helper · 11:49

Now the sheets, chapter by chapter.

#### The helper did · 11:49

- Read `scratchpad/fresh9/w/ch02-00.jpg`
- Read `scratchpad/fresh9/w/ch02-01.jpg`
- Read `scratchpad/fresh9/w/ch02-02.jpg`
- Read `scratchpad/fresh9/w/ch02-03.jpg`
- Read `scratchpad/fresh9/w/ch03-00.jpg`
- Read `scratchpad/fresh9/w/ch03-01.jpg`
- Read `scratchpad/fresh9/w/ch03-02.jpg`
- Read `scratchpad/fresh9/w/ch03-03.jpg`
- Read `scratchpad/fresh9/w/ch03-04.jpg`
- Read `scratchpad/fresh9/w/ch03-05.jpg`
- Ran: Chapter 3 storyboard and detail frames
- Read `scratchpad/fresh9/ch03-names.jpg`
- Read `scratchpad/fresh9/ch03-209.jpg`
- Read `scratchpad/fresh9/ch03-302.jpg`
- Read `scratchpad/fresh9/ch03-350.jpg`
- Read `scratchpad/fresh9/w/ch04-00.jpg`
- Read `scratchpad/fresh9/w/ch04-01.jpg`
- Read `scratchpad/fresh9/w/ch04-02.jpg`
- Read `scratchpad/fresh9/w/ch04-03.jpg`
- Ran: Chapter 4 detail frames and storyboard
- Read `scratchpad/fresh9/w/ch05-00.jpg`
- Read `scratchpad/fresh9/w/ch05-01.jpg`
- Read `scratchpad/fresh9/w/ch05-02.jpg`
- Read `scratchpad/fresh9/w/ch05-03.jpg`
- Read `scratchpad/fresh9/w/ch05-04.jpg`
- Read `scratchpad/fresh9/w/ch05-05.jpg`
- Read `scratchpad/fresh9/w05.txt`
- Read `scratchpad/fresh9/w/ch06-00.jpg`
- Read `scratchpad/fresh9/w/ch06-01.jpg`
- Read `scratchpad/fresh9/w/ch06-02.jpg`
- Read `scratchpad/fresh9/w/ch06-03.jpg`
- Read `scratchpad/fresh9/w06.txt`
- Read `scratchpad/fresh9/w07.txt`
- Read `scratchpad/fresh9/w/ch07-00.jpg`
- Read `scratchpad/fresh9/w/ch07-01.jpg`
- Read `scratchpad/fresh9/w/ch07-02.jpg`
- Read `scratchpad/fresh9/w08.txt`
- Read `scratchpad/fresh9/w/ch08-00.jpg`
- Read `scratchpad/fresh9/w/ch08-01.jpg`
- Read `scratchpad/fresh9/w/ch08-02.jpg`
- Read `scratchpad/fresh9/w/ch08-03.jpg`
- Read `scratchpad/fresh9/w09.txt`
- Read `scratchpad/fresh9/w/ch09-00.jpg`
- Read `scratchpad/fresh9/w/ch09-01.jpg`
- Read `scratchpad/fresh9/w/ch09-02.jpg`
- Read `scratchpad/fresh9/w/ch09-03.jpg`
- Read `scratchpad/fresh9/w10.txt`
- Read `scratchpad/fresh9/w/ch10-00.jpg`
- Read `scratchpad/fresh9/w/ch10-01.jpg`
- Read `scratchpad/fresh9/w11.txt`
- Read `scratchpad/fresh9/w/ch11-00.jpg`
- Read `scratchpad/fresh9/w/ch11-01.jpg`
- Ran: Grab exact detail frames
- Read `scratchpad/fresh9/c9-280.jpg`
- Read `scratchpad/fresh9/c9-206.jpg`
- Read `scratchpad/fresh9/c9-262.jpg`
- Read `scratchpad/fresh9/c9-46.jpg`
- Read `scratchpad/fresh9/c9-34.jpg`
- Read `scratchpad/fresh9/c7-258.jpg`
- Read `scratchpad/fresh9/c6-258.jpg`
- Read `scratchpad/fresh9/c6-183.jpg`
- Read `scratchpad/fresh9/c8-283.jpg`
- Ran: Second round of targeted sheets
- Read `scratchpad/fresh9/d6-250.jpg`
- Read `scratchpad/fresh9/d6-178.jpg`
- Read `scratchpad/fresh9/d9-199.jpg`
- Read `scratchpad/fresh9/d2-139.jpg`
- Read `scratchpad/fresh9/d2-302.jpg`
- Read `scratchpad/fresh9/d3-209.jpg`
- Read `scratchpad/fresh9/d10-148.jpg`
- Read `scratchpad/fresh9/d8-278.jpg`
- Read `scratchpad/fresh9/c9-f2w.jpg`
- Read `scratchpad/fresh9/c6-7.jpg`
- Read `scratchpad/fresh9/c5-535.jpg`
- Read `scratchpad/fresh9/ch04-end.jpg`
- Read `scratchpad/fresh9/ch04-dome.jpg`
- Read `scratchpad/fresh9/ch04-kahsh.jpg`
- Ran: Detail frames and chapter loudness
- Read `scratchpad/fresh9/e6-181.jpg`
- Read `scratchpad/fresh9/e3-212.jpg`
- Read `scratchpad/fresh9/e5-216.jpg`
- Read `scratchpad/fresh9/e5-476.jpg`
- Read `scratchpad/fresh9/e5-250.jpg`
- Read `scratchpad/fresh9/e10-156.jpg`
- Read `scratchpad/fresh9/e7-137.jpg`
- Read `scratchpad/fresh9/e7-176.jpg`
- Read `scratchpad/fresh9/e2-121.jpg`
- Read `scratchpad/fresh9/e0-8.jpg`
- Read `scratchpad/fresh9/e1-218.jpg`
- Ran: Measure per-line levels, gaps and jumps
- Ran: Sync detail sheets and site listing
- Read `scratchpad/fresh9/f6-170.jpg`
- Read `scratchpad/fresh9/f6-72.jpg`
- Read `scratchpad/fresh9/f2-184.jpg`
- Read `scratchpad/fresh9/f9-52.jpg`
- Read `scratchpad/fresh9/f3-422.jpg`
- Read `scratchpad/fresh9/f3-210.jpg`
- Read `scratchpad/fresh9/f4-219.jpg`
- Ran: Extract site page text
- Ran: Extract site page text
- Read `notes/annotations.yaml`
- Ran: Inspect watch and annotated pages
- Ran: Check film page video sources and other pages
- Ran: Check scorecard, draft hashes and the live site
- Read `out/quality/phone/home.jpg`
- Read `out/quality/phone/review_round7_annotated.jpg`
- Read `out/quality/desktop/review_round7_annotated.jpg`
- Read `out/quality/phone/review_quality.jpg`
- Read `out/quality/phone/read.jpg`
- Read `out/quality/phone/review_round4_models.jpg`
- Browser: opened https://curtcox.github.io/The-Last-Evolution/review/round7/annotated.html#film
- Browser: resize window
- Ran: Read model sheet pages
- Browser: screenshot
- Ran: Check heading fonts across pages
- Browser: ran a script in the page
- Ran: Read afterword and captions of the film page
- Browser: ran a script in the page
- Ran: Check ch10 lock code, scorecard live, Read page and notes references
- Read `scratchpad/fresh9/ch04-endf.jpg`
- Ran: More detail sheets for chapter 4, 5 and 9
- Read `scratchpad/fresh9/g4-177.jpg`
- Read `scratchpad/fresh9/g4-315.jpg`
- Read `scratchpad/fresh9/g5-roal.jpg`
- Read `scratchpad/fresh9/g9-268.jpg`
- Read `scratchpad/fresh9/g9-251.jpg`
- Ran: Montage first and last frames
- Ran: Measure effect timing around cued events
- Read `scratchpad/fresh9/h4-181.jpg`
- Read `scratchpad/fresh9/h4-124.jpg`
- Read `scratchpad/fresh9/lasts.jpg`
- Ran: Fine strip of the council vanishing in ch04
- Read `scratchpad/fresh9/i4.jpg`
- Read `scratchpad/fresh9/i4b.jpg`
- Ran: See how ch04 clears the council from the floor
- Browser: resize window
