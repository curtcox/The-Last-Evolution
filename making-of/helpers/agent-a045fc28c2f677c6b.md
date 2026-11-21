# Helper: Eleventh fresh-eyes review

Started in [2026-11-09](../parts/2026-11-09.md). [All parts](../README.md)

A helper is another copy of Claude, started with its own instructions for one job. It sees only what it's given.

#### Claude, to the helper · 12:02

You are doing a fresh-eyes quality review of an animated film and its companion website, in the repository at .. The film adapts John W. Campbell's 1932 story "The Last Evolution" as twelve chapters (ch00-ch11) in a pulp ink-and-wash style. You have no earlier context, and that is the point: judge it as a first-time viewer and a careful critic.

READ-ONLY: do not edit, commit, render, or publish anything, and do not run `npm run ask` or any paid model call. Write scratch files only under scratchpad/fresh11/.

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

#### The helper did · 12:02

- Ran: Survey repo, files, and video durations
- Ran: Read rubric and quality docs
- Ran: Look at PLAN headings and status record
- Ran: Read PLAN sections 5 and 6
- Ran: Make whole-chapter frame sheets for all chapters
- Ran: Inspect script structure and boards
- Ran: Inspect gen timing format and board format

#### The helper · 12:03

Let me write a helper that prints, per chapter, each shot with its time range, title, and the lines spoken with their times.

#### The helper did · 12:03

- Ran: Write and run chapter dump script
- Ran: Remove stray file, fix import, dump all chapters
- Read `scratchpad/fresh11/whole00.jpg`
- Ran: Extract title page frames
- Read `scratchpad/fresh11/c00_9.jpg`
- Read `scratchpad/fresh11/c00_1.jpg`
- Ran: Show chapter 1 dump
- Read `scratchpad/fresh11/whole01.jpg`
- Ran: Look up word timings in chapter 1
- Ran: Close sheet of ch1 shot B and page crop
- Read `scratchpad/fresh11/c01_B.jpg`
- Read `scratchpad/fresh11/c01_page.jpg`
- Ran: Close sheet ch1 games shot
- Read `scratchpad/fresh11/c01_D.jpg`
- Ran: Check ch1 games frames at 62s
- Read `scratchpad/fresh11/c01_62.jpg`
- Ran: Show chapter 2 dump
- Read `scratchpad/fresh11/whole02.jpg`
- Ran: Close sheets of ch2 opening, power room, beam
- Read `scratchpad/fresh11/c02_a.jpg`
- Ran: Footnote hold duration in ch2
- Read `scratchpad/fresh11/c02_fn.jpg`
- Read `scratchpad/fresh11/c02_fn2.jpg`
- Read `scratchpad/fresh11/c02_j.jpg`
- Read `scratchpad/fresh11/c02_n.jpg`
- Ran: Check ch2 searching shot frames
- Read `scratchpad/fresh11/c02_m.jpg`
- Ran: Show chapter 3 dump
- Read `scratchpad/fresh11/whole03.jpg`
- Ran: Closer sheet of ch3 battle beyond Luna
- Read `scratchpad/fresh11/c03_g.jpg`
- Ran: Full-res frames ch3 torpedoes deflected
- Read `scratchpad/fresh11/c03_g2.jpg`
- Ran: Closer sheet ch3 Colorado settlement
- Read `scratchpad/fresh11/c03_k.jpg`
- Ran: Full frame ch3 at 3:29
- Read `scratchpad/fresh11/c03_209.jpg`
- Ran: Bottom-strip frames of ch3 people falling
- Read `scratchpad/fresh11/c03_fall.jpg`
- Ran: Closer sheets ch3 study and Roal speech
- Read `scratchpad/fresh11/c03_q.jpg`
- Read `scratchpad/fresh11/c03_u.jpg`
- Ran: Show chapter 4 dump
- Read `scratchpad/fresh11/whole04.jpg`
- Ran: Closer sheet ch4 induction beam test
- Read `scratchpad/fresh11/c04_c.jpg`
- Ran: Full frames ch4 at 0:10 and 1:55
- Read `scratchpad/fresh11/c04_10.jpg`
- Read `scratchpad/fresh11/c04_115.jpg`
- Ran: Close sheet ch4 X-6349, Trest, Kahsh
- Read `scratchpad/fresh11/c04_gi.jpg`
- Ran: Closer sheet ch4 construction of F-1
- Read `scratchpad/fresh11/c04_n.jpg`
- Ran: Show chapter 5 dump
- Read `scratchpad/fresh11/whole05.jpg`
- Ran: Closer sheet ch5 birth and F-1's fall
- Read `scratchpad/fresh11/c05_birth.jpg`
- Ran: Closer sheet ch5 C-R-U-1 and guinea pig
- Read `scratchpad/fresh11/c05_cru.jpg`
- Ran: Check guinea pig arrival and CRU1 lettering
- Read `scratchpad/fresh11/c05_gp.jpg`
- Read `scratchpad/fresh11/c05_cru1.jpg`
- Ran: Show chapter 6 dump
- Read `scratchpad/fresh11/whole06.jpg`
- Ran: Closer sheet ch6 screens colour progression
- Read `scratchpad/fresh11/c06_e.jpg`
- Ran: Closer sheet ch6 1:32-2:44
- Read `scratchpad/fresh11/c06_g.jpg`
- Ran: Frames ch6 at 1:41 and 2:40
- Read `scratchpad/fresh11/c06_101.jpg`
- Read `scratchpad/fresh11/c06_160.jpg`
- Ran: Show chapter 7 dump
- Read `scratchpad/fresh11/whole07.jpg`
- Ran: Closer sheet ch7 Roal's speech
- Read `scratchpad/fresh11/c07_d.jpg`
- Ran: Show chapter 8 dump
- Read `scratchpad/fresh11/whole08.jpg`
- Ran: Closer sheet ch8 ladder plate
- Read `scratchpad/fresh11/c08_e.jpg`
- Ran: Ch8 man fading from ladder
- Read `scratchpad/fresh11/c08_g.jpg`
- Ran: Show chapter 9 dump
- Read `scratchpad/fresh11/whole09.jpg`
- Ran: Closer sheet ch9 sunrise and golden sphere
- Read `scratchpad/fresh11/c09_jk.jpg`
- Ran: Closer sheet ch9 red beam fight
- Read `scratchpad/fresh11/c09_i.jpg`
- Ran: Fine sheet ch9 blue-white beam moment
- Read `scratchpad/fresh11/c09_bw.jpg`
- Ran: Show chapters 10 and 11 dumps
- Read `scratchpad/fresh11/whole10.jpg`
- Read `scratchpad/fresh11/whole11.jpg`
- Ran: Ch11 page dissolve and F-2 dimming
- Read `scratchpad/fresh11/c11_x.jpg`
- Read `scratchpad/fresh11/c11_g.jpg`
- Ran: Measure loudness and silences for all chapters
- Ran: Per-line loudness for dialogue chapters
- Ran: List screenshots and site pages
- Ran: List phone screenshots and watch pages
- Read `out/quality/phone/home.jpg`
- Ran: Extract text of key site pages
- Ran: Inspect watch page and annotated page size
- Ran: Extract annotated film page text
- Ran: Read rest of annotated page text
- Ran: Check sound config for music under voice
- Ran: Read theme usage and music policy
- Ran: Ch8 plant building with logic and intuition
- Read `scratchpad/fresh11/c08_kl.jpg`
- Ran: Check ch2 Deimos shot for footnote 2
- Read `scratchpad/fresh11/c02_e.jpg`
- Ran: Get phone screenshot sizes
- Read `out/quality/phone/watch.jpg`
- Read `out/quality/phone/review_quality.jpg`
- Ran: Extract text of quality scorecard page
- Ran: Read rest of scorecard prior findings
- Ran: Skim remaining past findings titles
- Ran: Search past findings for my candidate issues
- Ran: Search past findings for keywords
- Ran: Fetch live pages and compare to local build
- Ran: Compare live annotated/about/quality pages with local
- Ran: Diff live vs local scorecard; list video sources
- Ran: Check which draft videos the film page plays
- Ran: Match draft hashes and check release asset
- Ran: Crops of ch3 torpedo attack
- Read `scratchpad/fresh11/c03_107.jpg`
- Read `scratchpad/fresh11/c03_128.jpg`
- Ran: Crop listeners in ch4 during the demo
- Read `scratchpad/fresh11/c04_listen.jpg`
- Ran: Full frame ch4 at 0:28
- Read `scratchpad/fresh11/c04_28.jpg`
- Ran: Frames ch5 at 5:06 and 5:18
- Read `scratchpad/fresh11/c05_306.jpg`
- Read `scratchpad/fresh11/c05_318.jpg`
- Ran: Frame ch8 at 2:36
- Read `scratchpad/fresh11/c08_156.jpg`
- Ran: Check ch3 planets plate
- Read `scratchpad/fresh11/c03_pl.jpg`
- Read `out/quality/phone/read.jpg`
- Read `out/quality/desktop/watch.jpg`
- Browser: opened https://curtcox.github.io/The-Last-Evolution/review/round7/annotated.html#film
- Browser: resize window
- Browser: ran a script in the page
- Browser: ran a script in the page
- Browser: screenshot
- Browser: screenshot
- Browser: ran a script in the page
- Browser: resize window
- Ran: Ch7 dome struck sheet and word times
- Read `scratchpad/fresh11/c07_l.jpg`
- Ran: Ch7 violet beam timing sheet
- Read `scratchpad/fresh11/c07_m.jpg`
- Ran: Ch2 transport death sync sheet
- Read `scratchpad/fresh11/c02_d.jpg`
- Ran: Scan visitor pages for maker-facing words
- Ran: Read the Round 6 whole-film page
- Ran: Ch3 planets plate at 1s steps
- Read `scratchpad/fresh11/c03_pl2.jpg`
