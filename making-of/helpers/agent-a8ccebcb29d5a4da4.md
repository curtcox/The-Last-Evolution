# Helper: Fourth fresh-eyes review of film and site

Started in [2026-11-06](../parts/2026-11-06.md). [All parts](../README.md)

A helper is another copy of Claude, started with its own instructions for one job. It sees only what it's given.

#### Claude, to the helper · 01:29

You are doing a fresh-eyes quality review of an animated film and its companion website, in the repository at .. The film adapts John W. Campbell's 1932 story "The Last Evolution" as twelve chapters (ch00-ch11) in a pulp ink-and-wash style. You have no earlier context, and that is the point: judge it as a first-time viewer and a careful critic.

READ-ONLY: do not edit, commit, render, or publish anything, and do not run `npm run ask` or any paid model call. Write scratch files only under scratchpad/fresh4/.

What to judge against: quality/rubric.yaml (the criteria for each item: acting, picture, sync, sound, story per chapter; the site pages; work items) and QUALITY.md. Also skim PLAN.md section 5 (designs) and the story text in script/script.yaml for what each chapter must convey. Judge against that bar: report what falls short of it, not matters of taste the bar doesn't ask for. Severity matters: "major" means a viewer would be confused or misled, or the text is contradicted; "minor" means it noticeably weakens a beat; "nit" is polish.

Material:
- Film drafts: out/review/round6/video/ch00-draft.mp4 … ch11-draft.mp4 (chapter 5 is out/review/round5/video/ch05-draft.mp4). About 57 minutes in all.
- Storyboards: script/boards/chNN.yaml; scene code src/scenes/chNN.js; voice word timing in src/gen/chNN.js (CHAPTER.lines[].words as [word, start, end] in chapter seconds; use these, not guesses, when you judge sync).
- The site: built pages under site/public/ (the film page is site/review/round7/annotated.html; notes source in notes/annotations.yaml; model sheets site/review/round4/). Phone and desktop screenshots in out/quality/phone and out/quality/desktop. The live site is https://curtcox.github.io/The-Last-Evolution/ (use a generic User-Agent if you fetch it).

Tools and tips:
- ffmpeg is installed but has no drawtext filter. Frame sheets: `ffmpeg -v error -y -ss START -i VIDEO -vf "fps=1/STEP,scale=320:-1,tile=6x4" -frames:v 1 OUT.jpg`, then view with the Read tool; tile k is at about START + k*STEP. Crop full-size frames for detail: `ffmpeg -ss T -i V -frames:v 1 -vf crop=960:540:X:Y out.jpg`.
- Loudness: `ffmpeg -hide_banner -ss A -t D -i V -vn -af ebur128 -f null - 2>&1 | grep -E '^\s+I:'` (target about -14.5 LUFS). Levels: `-af astats` and grep 'RMS level dB' (head -1).
- The shell is zsh: `set -- $var` does not word-split; pass arguments explicitly.
- Transcripts with words lost/extra may exist in out/ask/chNN/hear.json. Voicing by ear is the producer's call, not yours: don't report how lines sound.
- The `yaml` npm package resolves only when node runs from the repo directory.

Do a real watch: for every chapter, at least one whole-chapter sheet (step about duration/24), then closer sheets (step 1-5 s) wherever something looks off or the story has a key beat. Look for: figures overlapping or hidden, things appearing or vanishing without a cut, illegible or too-dark shots, bare paper at frame edges, staging that contradicts the narration, characters frozen while others speak, repeated gestures that read as loops, continuity breaks between shots and chapters, sound level jumps or dropouts, sync of beats to words (check against the word times), story beats that don't land, lettering errors; and on the site: wrong or stale wording, pages contradicting each other or the film, broken layout at phone width, links, anything addressed to the makers instead of visitors.

Report back (as your final message, plain text) a list of findings, most serious first. For each: chapter or page, timestamp (m:ss) or element, what is wrong, why it matters, severity (major / minor / nit), and the evidence (which sheet or measurement). If you find nothing wrong in an area, say what you checked. Be concrete and honest: don't invent problems to fill the list, and don't pass over real ones. Keep the report under about 1200 words.

#### The helper did · 01:29

- Ran: Survey files and video durations
- Ran: Read rubric and quality doc
- Ran: List PLAN.md sections
- Ran: Read PLAN sections 5-6
- Ran: Make whole-chapter frame sheets
- Read `scratchpad/fresh4/ch00-all.jpg`
- Ran: Peek at script structure
- Ran: Look at ch00 board and gen format
- Ran: Make shot/line timing helper
- Ran: Close sheets for ch00
- Read `scratchpad/fresh4/ch00-a.jpg`
- Read `scratchpad/fresh4/ch00-b.jpg`
- Ran: Crop title masthead full size
- Ran: Crop title masthead
- Read `scratchpad/fresh4/ch00-mast.jpg`
- Read `scratchpad/fresh4/ch01-all.jpg`
- Ran: Ch01 shots and board
- Read `scratchpad/fresh4/ch02-all.jpg`
- Ran: Ch02 shots and board titles
- Ran: Close sheets ch02 opening and power room
- Read `scratchpad/fresh4/ch02-a.jpg`
- Read `scratchpad/fresh4/ch02-b.jpg`
- Ran: Word timings ch02 p013
- Read `scratchpad/fresh4/ch03-all.jpg`
- Ran: Ch03 shots and titles
- Ran: Close sheets ch03
- Read `scratchpad/fresh4/ch03-a.jpg`
- Read `scratchpad/fresh4/ch03-b.jpg`
- Ran: Crop approaching fleet, words
- Read `scratchpad/fresh4/ch03-fleet.jpg`
- Read `scratchpad/fresh4/ch04-all.jpg`
- Ran: Ch04 shots and titles
- Ran: Full frames ch04 labels
- Read `scratchpad/fresh4/ch04-20.jpg`
- Read `scratchpad/fresh4/ch05-all.jpg`
- Ran: Ch05 shots, titles, dates
- Ran: Close sheets ch05 birth and CRU1
- Read `scratchpad/fresh4/ch05-a.jpg`
- Read `scratchpad/fresh4/ch05-b.jpg`
- Ran: Full frame CRU-1 lettering
- Read `scratchpad/fresh4/ch05-471.jpg`
- Read `scratchpad/fresh4/ch06-all.jpg`
- Ran: Ch06 shots and titles
- Ran: Close sheets ch06
- Read `scratchpad/fresh4/ch06-b.jpg`
- Read `scratchpad/fresh4/ch06-a.jpg`
- Read `scratchpad/fresh4/ch06-c.jpg`
- Ran: Ch06 ending words and board
- Read `scratchpad/fresh4/ch07-all.jpg`
- Ran: Ch07 shots and titles
- Ran: Ch07 ending sheet and board
- Read `scratchpad/fresh4/ch07-a.jpg`
- Ran: Full frame ch07 final shot
- Read `scratchpad/fresh4/ch07-259.jpg`
- Read `scratchpad/fresh4/ch08-all.jpg`
- Ran: Ch08 shots and titles
- Ran: Ch08 F-2 speech acting sheet
- Read `scratchpad/fresh4/ch08-a.jpg`
- Read `scratchpad/fresh4/ch09-all.jpg`
- Ran: Ch09 shots and titles
- Ran: Ch09 force-sphere death sheet
- Read `scratchpad/fresh4/ch09-a.jpg`
- Ran: Ch09 blue-white beam detail
- Read `scratchpad/fresh4/ch09-b.jpg`
- Read `scratchpad/fresh4/ch09-157.jpg`
- Read `scratchpad/fresh4/ch10-all.jpg`
- Ran: Ch10/11 shots and titles
- Read `scratchpad/fresh4/ch11-all.jpg`
- Ran: Measure loudness of every chapter
- Ran: Find dropouts and level jumps
- Ran: Inspect quiet gaps finely
- Ran: Read sound design plan
- Ran: Sync sheets for F-1 fall and sphere vanish
- Read `scratchpad/fresh4/ch05-c.jpg`
- Read `scratchpad/fresh4/ch09-c.jpg`
- Ran: Crop chapter pages ch01, ch04
- Read `scratchpad/fresh4/pages.jpg`
- Ran: Frame ch08 figures, board notes
- Read `scratchpad/fresh4/ch08-33.jpg`
- Ran: List site pages and screenshots
- Ran: Extract text of key site pages
- Ran: Inspect annotated film page
- Ran: Find video sources and page text
- Ran: Compare draft file hashes with site
- Ran: Peek at annotations structure
- Ran: Dump making and who notes
- Ran: Locate note anchor phrases
- Ran: Check curl and logic-intuition shots
- Read `scratchpad/fresh4/ch07-curl.jpg`
- Read `scratchpad/fresh4/ch08-logic.jpg`
- Ran: Closer look at logic-intuition beat
- Read `scratchpad/fresh4/ch08-logic2.jpg`
- Ran: List phone screenshots and sizes
- Ran: Combine phone screenshots
- Read `scratchpad/fresh4/phone6.jpg`
- Ran: Read quality page text
- Ran: Compare live site with built pages
- Ran: Check ch02 bluish beam sync
- Read `scratchpad/fresh4/ch02-c.jpg`
- Ran: Ch03 weapons shot check
- Read `scratchpad/fresh4/ch03-c.jpg`
- Ran: Crop torpedoes over figures
- Read `scratchpad/fresh4/ch03-d.jpg`
- Ran: Ch10 flagship sequence words and sheet
- Read `scratchpad/fresh4/ch10-a.jpg`
- Ran: Frame Outsider description shot
- Read `scratchpad/fresh4/ch02-118.jpg`
- Ran: Frame ch00 beings of force
- Read `scratchpad/fresh4/ch00-38.jpg`
- Ran: Search notes for beings of force
- Ran: Search site for stale wording
- Ran: Show stale-word context in annotated page
- Ran: Show context of matches
- Ran: Show context of matches via python
- Ran: Read rest of annotated page text
- Ran: Check footnote text in source
- Ran: Crop ch02 footnote
- Read `scratchpad/fresh4/ch02-fn.jpg`
- Ran: Summarize hear.json transcripts
- Ran: Check Roal and Trest appearance ch09
- Ran: Sheet of Roal and Trest emerging
- Read `scratchpad/fresh4/ch09-d.jpg`
- Read `scratchpad/fresh4/ch09-205.jpg`
- Ran: Ch06 last charge sheet
- Read `scratchpad/fresh4/ch06-d.jpg`
