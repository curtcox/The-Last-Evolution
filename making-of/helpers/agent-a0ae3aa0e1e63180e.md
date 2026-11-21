# Helper: Eighth fresh-eyes review

Started in [2026-11-08](../parts/2026-11-08.md). [All parts](../README.md)

A helper is another copy of Claude, started with its own instructions for one job. It sees only what it's given.

#### Claude, to the helper · 03:18

You are doing a fresh-eyes quality review of an animated film and its companion website, in the repository at .. The film adapts John W. Campbell's 1932 story "The Last Evolution" as twelve chapters (ch00-ch11) in a pulp ink-and-wash style. You have no earlier context, and that is the point: judge it as a first-time viewer and a careful critic.

READ-ONLY: do not edit, commit, render, or publish anything, and do not run `npm run ask` or any paid model call. Write scratch files only under scratchpad/fresh8/.

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

#### The helper did · 03:18

- Ran: Survey repo, files and video durations
- Ran: Read rubric and quality doc
- Ran: List review drafts on site and out
- Ran: List site review rounds and public dir
- Ran: List PLAN.md headings
- Ran: Read PLAN sections 4-6
- Ran: Make whole-chapter frame sheets for all chapters
- Ran: Inspect generated timing file format
- Ran: Dump each chapter's shots and spoken lines with times
- Ran: Show remaining line timings
- Read `scratchpad/fresh8/ch00-whole.jpg`
- Read `scratchpad/fresh8/ch01-whole.jpg`
- Ran: Closer sheets of ch01 and its board
- Read `scratchpad/fresh8/ch01-a.jpg`
- Read `scratchpad/fresh8/ch01-end.jpg`
- Ran: Grab ch01 transition frames
- Read `scratchpad/fresh8/ch01-30.jpg`
- Read `scratchpad/fresh8/ch01-28.jpg`
- Read `scratchpad/fresh8/ch02-whole.jpg`
- Ran: ch02 end and 60s sheets, last line words
- Read `scratchpad/fresh8/ch02-end.jpg`
- Ran: ch02 frame at 298s and shot O board
- Read `scratchpad/fresh8/ch02-298.jpg`
- Read `scratchpad/fresh8/ch02-60.jpg`
- Read `scratchpad/fresh8/ch03-whole.jpg`
- Ran: ch03 6:40-8:06 sheet and board tail
- Read `scratchpad/fresh8/ch03-400.jpg`
- Ran: ch03 7:51-8:06 half-second sheet
- Read `scratchpad/fresh8/ch03-471.jpg`
- Read `scratchpad/fresh8/ch04-whole.jpg`
- Ran: ch04 ending sheet, last line words and board tail
- Read `scratchpad/fresh8/ch04-end.jpg`
- Read `scratchpad/fresh8/ch05-whole.jpg`
- Ran: ch05 ending sheet, words, board tail
- Read `scratchpad/fresh8/ch05-end.jpg`
- Ran: ch05 first minute sheet
- Read `scratchpad/fresh8/ch05-0.jpg`
- Read `scratchpad/fresh8/ch06-whole.jpg`
- Ran: Word times for ch06 battle lines
- Ran: ch06 1:00-1:30 one-second sheet
- Read `scratchpad/fresh8/ch06-60.jpg`
- Ran: ch06 2:48-4:48 sheet and word times
- Read `scratchpad/fresh8/ch06-168.jpg`
- Ran: Grab ch06 frames at 3:17 and 3:32
- Read `scratchpad/fresh8/ch06-197.jpg`
- Read `scratchpad/fresh8/ch06-212.jpg`
- Ran: Read ch06 board shots I-J
- Ran: ch06 3:25-3:41 per-second sheet
- Read `scratchpad/fresh8/ch06-205.jpg`
- Read `scratchpad/fresh8/ch07-whole.jpg`
- Ran: ch07 ending sheet, words and board
- Read `scratchpad/fresh8/ch07-236.jpg`
- Ran: ch07 1:58-2:58 sheet and frame at 2:20
- Read `scratchpad/fresh8/ch07-118.jpg`
- Read `scratchpad/fresh8/ch07-140.jpg`
- Read `scratchpad/fresh8/ch08-whole.jpg`
- Ran: ch08 livid-beam sheet, words, frame at 0:30
- Read `scratchpad/fresh8/ch08-296.jpg`
- Read `scratchpad/fresh8/ch08-30.jpg`
- Ran: ch08 0:04-0:40 per-second sheet
- Read `scratchpad/fresh8/ch08-4.jpg`
- Read `scratchpad/fresh8/ch09-whole.jpg`
- Ran: ch09 ending sheet, words, board tail
- Read `scratchpad/fresh8/ch09-293.jpg`
- Ran: Read ch09 board header and look rule references
- Ran: ch09 2:18-2:54 per-second sheet
- Read `scratchpad/fresh8/ch09-138.jpg`
- Read `scratchpad/fresh8/ch10-whole.jpg`
- Ran: ch10 words and board summary
- Ran: ch10 1:28-2:40 two-second sheet
- Read `scratchpad/fresh8/ch10-88.jpg`
- Read `scratchpad/fresh8/ch11-whole.jpg`
- Ran: ch11 words and ending sheet
- Read `scratchpad/fresh8/ch11-125.jpg`
- Ran: Measure integrated loudness and true peak per chapter
- Ran: Measure loudness per spoken line across chapters
- Ran: Fix script and rerun per-line loudness
- Ran: ch05 3:56-5:08 sheet and words
- Read `scratchpad/fresh8/ch05-236.jpg`
- Ran: ch00 per-second sheet, words and board
- Read `scratchpad/fresh8/ch00-12.jpg`
- Ran: ch04 1:28-2:04 sheet and board G-J
- Read `scratchpad/fresh8/ch04-88.jpg`
- Ran: Crop machine labels in ch04
- Read `scratchpad/fresh8/ch04-crop20.jpg`
- Ran: List site screenshots and built pages
- Ran: List phone screenshots with sizes
- Ran: Stack phone screenshots side by side
- Read `scratchpad/fresh8/phone1.jpg`
- Ran: Check menta-type spelling across sources
- Read `scratchpad/fresh8/phone2.jpg`
- Ran: Extract home page text
- Ran: Check paragraph coverage and watch page text
- Ran: Inspect watch page and story.json structure
- Ran: Check every story block appears in film lines
- Ran: Extract annotated film page text
- Ran: Find memory mentions in the story
- Ran: Read rest of annotated page text
- Ran: List video sources used on film page
- Ran: Hash local drafts to compare with published names
- Ran: Extract About and Review page text
- Ran: Extract Review and Where-it-stands text
- Ran: Check desktop screenshot sizes
- Read `out/quality/desktop/watch.jpg`
- Loaded the skill `anthropic-skills:built-in-browser`
- Browser: opened https://curtcox.github.io/The-Last-Evolution/review/round7/annotated.html#film
- Browser: did several steps
- Browser: ran a script in the page
- Browser: ran a script in the page
- Browser: did several steps
- Browser: ran a script in the page
- Browser: resize window
- Ran: ch08 3:46-4:58 sheet and words
- Read `scratchpad/fresh8/ch08-226.jpg`
- Ran: ch01 opening word times
- Ran: ch07 board shots H-J and cloud line words
- Ran: Grab ch07 frame at 2:26
- Read `scratchpad/fresh8/ch07-146.jpg`
- Ran: Crop ch07 figures at several times
- Read `scratchpad/fresh8/c7-strip.jpg`
