# Helper: Fresh-eyes review round 18

Started in [2026-11-12](../parts/2026-11-12.md). [All parts](../README.md)

A helper is another copy of Claude, started with its own instructions for one job. It sees only what it's given.

#### Claude, to the helper · 06:10

You are doing a fresh-eyes quality review of an animated film and its companion website, in the repository at .. The film adapts John W. Campbell's 1932 story "The Last Evolution" as twelve chapters (ch00-ch11) in a pulp ink-and-wash style. You have no earlier context, and that is the point: judge it as a first-time viewer and a careful critic.

READ-ONLY: do not edit, commit, render, or publish anything, and do not run `npm run ask` or any paid model call. Write scratch files only under scratchpad/fresh18/.

What to judge against: quality/rubric.yaml (the criteria for each item: acting, picture, sync, sound, story per chapter; the site pages; work items) and QUALITY.md. Also skim PLAN.md section 5 (designs) and the story text in script/script.yaml for what each chapter must convey. Judge against that bar: report what falls short of it, not matters of taste the bar doesn't ask for. Severity matters: "major" means a viewer would be confused or misled, or the text is contradicted; "minor" means it noticeably weakens a beat; "nit" is polish. The look's direction (how designs such as the beings of force are drawn) and voicing by ear are the producer's calls, not yours: don't report them.

Material:
- Film drafts: out/review/round6/video/ch00-draft.mp4 … ch11-draft.mp4 (chapter 5 is out/review/round5/video/ch05-draft.mp4). About 57 minutes in all.
- Storyboards: script/boards/chNN.yaml; scene code src/scenes/chNN.js; voice word timing in src/gen/chNN.js (CHAPTER.lines[].words as [word, start, end] in chapter seconds; use these, not guesses, when you judge sync).
- The site: built pages under site/public/ (the film page is site/review/round7/annotated.html; notes source in notes/annotations.yaml; model sheets site/review/round4/). Phone and desktop screenshots in out/quality/phone and out/quality/desktop (fresh today). The live site is https://curtcox.github.io/The-Last-Evolution/ (use a generic User-Agent if you fetch it). A deploy may still be in progress when you start; if the live site lags the local build by a deploy, note it but don't count it as a finding.

Tools and tips:
- ffmpeg is installed but has no drawtext filter. Frame sheets: `ffmpeg -v error -y -ss START -i VIDEO -vf "fps=1/STEP,scale=320:-1,tile=6x4" -frames:v 1 OUT.jpg`, then view with the Read tool; tile k is at about START + (k+0.5)*STEP. For exact times use single frames with -ss. Crop full-size frames for detail: `ffmpeg -ss T -i V -frames:v 1 -vf crop=640:360:X:Y out.jpg` (the drafts are 1280x720).
- Loudness: `ffmpeg -hide_banner -ss A -t D -i V -vn -af ebur128 -f null - 2>&1 | grep -E '^\s+I:'` (target about -14.5 LUFS). Levels: `-af astats` and grep 'RMS level dB' (head -1).
- The shell is zsh: `set -- $var` does not word-split; pass arguments explicitly.
- The `yaml` npm package resolves only when node runs from the repo directory.

Do a real watch: for every chapter, at least one whole-chapter sheet (step about duration/24), then closer sheets (step 1-5 s) wherever something looks off or the story has a key beat. Look for: figures overlapping or hidden, things appearing or vanishing without a cut, illegible or too-dark shots, bare paper at frame edges, staging that contradicts the narration, characters frozen while others speak, repeated gestures that read as loops, continuity breaks between shots and chapters, sound level jumps or dropouts, sync of beats to words (check against the word times), story beats that don't land, lettering errors; and on the site: wrong or stale wording, pages contradicting each other or the film, broken layout at phone width, links, anything addressed to the makers instead of visitors.

Report back (as your final message, plain text) a list of findings, most serious first. For each: chapter or page, timestamp (m:ss) or element, what is wrong, why it matters, severity (major / minor / nit), and the evidence (which sheet or measurement). If you find nothing wrong in an area, say what you checked. Be concrete and honest: don't invent problems to fill the list, and don't pass over real ones. Keep the report under about 1200 words.

#### The helper did · 06:10

- Ran `cd .; mkdir -p scratchpad/fresh18; ls; wc -l quality/rubric.yaml QUALITY.md PLAN.md script/script.yaml; for f in out/review/round6/video/ch…`
- Read `quality/rubric.yaml`
- Read `QUALITY.md`
- Ran `cd .; grep -n '^#' PLAN.md | head -60; ls quality notes site/public site/review 2>/dev/null | head -60`
- Ran `cd .; sed -n 161,246p PLAN.md`
- Ran `cd .; wc -l quality/status.yaml; grep -n 'fresh' quality/status.yaml | tail -5; ls script/boards src/scenes src/gen | head -50`
- Ran `cd .; sed -n 1467,1540p quality/status.yaml | cut -c1-600`
- Ran `cd .; S=scratchpad/fresh18; for n in 00 01 02 03 04 05 06 07 08 09 10 11; do if [ $n = 05 ]; then V=out/review/round5/video/ch05-draft.mp4;…`
- Read `scratchpad/fresh18/w00.jpg`
- Ran `cd .; head -c 1500 src/gen/ch00.js; echo; cat > scratchpad/fresh18/lines.mjs <<'EOF' const n = process.argv[2]; const m = await import('src…`
- Ran `cd .; tail -c 300 src/gen/ch00.js`
- Ran `cd .; S=scratchpad/fresh18; cat > $S/lines.mjs <<'EOF' import fs from 'fs'; const n = process.argv[2]; const src = fs.readFileSync('src/gen…`
- Ran `cat scratchpad/fresh18/lines01.txt`
- Read `scratchpad/fresh18/w01.jpg`
- Ran `cd .; S=scratchpad/fresh18; V=out/review/round6/video/ch01-draft.mp4; ffmpeg -v error -y -ss 11 -i $V -vf "fps=1/1,scale=320:-1,tile=6x4" -…`
- Read `scratchpad/fresh18/c01a.jpg`
- Ran `cd .; S=scratchpad/fresh18; V=out/review/round6/video/ch01-draft.mp4; ffmpeg -v error -y -ss 53 -i $V -vf "fps=1/2,scale=320:-1,tile=6x4" -…`
- Read `scratchpad/fresh18/c01b.jpg`
- Ran `cd .; S=scratchpad/fresh18; V=out/review/round6/video/ch01-draft.mp4; ffmpeg -v error -y -ss 63 -i $V -frames:v 1 $S/f01_63.jpg; ffmpeg -v …`
- Read `scratchpad/fresh18/f01_63.jpg`
- Read `scratchpad/fresh18/f01_71.jpg`
- Ran `cd .; grep -n -A12 '^ D:\|id: D\|^- *shot: D\|D:' script/boards/ch01.yaml | head -60`
- Ran `cd .; grep -o '\["mock",[0-9.]*,[0-9.]*\]\|\["games,",[0-9.]*,[0-9.]*\]\|\["But",[0-9.]*,[0-9.]*\]' src/gen/ch01.js; S=scratchpad/fresh18; …`
- Read `scratchpad/fresh18/c01d.jpg`
- Ran `cd .; S=scratchpad/fresh18; V=out/review/round6/video/ch01-draft.mp4; ffmpeg -v error -y -ss 82 -i $V -vf "fps=4,crop=1280:300:0:400,scale=…`
- Read `scratchpad/fresh18/c01e.jpg`
- Read `scratchpad/fresh18/c01c.jpg`
- Ran `cat scratchpad/fresh18/lines02.txt`
- Read `scratchpad/fresh18/w02.jpg`
- Ran `cd .; grep -n -i 'kilad' script/script.yaml text/* 2>/dev/null | head; ls text`
- Ran `cd .; S=scratchpad/fresh18; V=out/review/round6/video/ch02-draft.mp4; ffmpeg -v error -y -ss 160 -i $V -vf "fps=1/1.5,scale=320:-1,tile=6x4…`
- Read `scratchpad/fresh18/c02a.jpg`
- Ran `cd .; for w in snapped Instantly released destroyed. plungers shot; do grep -o "\[\"$w\",[0-9.]*,[0-9.]*\]" src/gen/ch02.js; done; S=scratc…`
- Read `scratchpad/fresh18/c02b.jpg`
- Ran `cd .; S=scratchpad/fresh18; V=out/review/round6/video/ch02-draft.mp4; ffmpeg -v error -y -ss 86 -i $V -vf "fps=1/3,scale=320:-1,tile=6x4" -…`
- Read `scratchpad/fresh18/c02c.jpg`
- Ran `cd .; for w in bluish snapped blank. projector; do grep -o "\[\"$w\",[0-9.]*,[0-9.]*\]" src/gen/ch02.js; done; S=scratchpad/fresh18; V=out/…`
- Read `scratchpad/fresh18/c02d.jpg`
- Ran `cat scratchpad/fresh18/lines03.txt`
- Read `scratchpad/fresh18/w03.jpg`
- Ran `cd .; S=scratchpad/fresh18; V=out/review/round6/video/ch03-draft.mp4; ffmpeg -v error -y -ss 268 -i $V -vf "fps=1/1.5,scale=320:-1,tile=6x4…`
- Read `scratchpad/fresh18/c03a.jpg`
- Ran `cd .; S=scratchpad/fresh18; V=out/review/round6/video/ch03-draft.mp4; ffmpeg -v error -y -ss 296 -i $V -vf "fps=3,scale=320:-1,tile=6x4" -f…`
- Read `scratchpad/fresh18/c03b.jpg`
- Ran `cd .; S=scratchpad/fresh18; V=out/review/round6/video/ch03-draft.mp4; ffmpeg -v error -y -ss 371 -i $V -vf "fps=1/5,scale=320:-1,tile=6x4" …`
- Read `scratchpad/fresh18/c03c.jpg`
- Ran `cd .; for w in Pluto Mercury home-world chuckle Attack; do grep -o "\[\"$w\",[0-9.]*,[0-9.]*\]" src/gen/ch03.js; done; S=scratchpad/fresh18…`
- Read `scratchpad/fresh18/c03d.jpg`
- Ran `cd .; S=scratchpad/fresh18; V=out/review/round6/video/ch03-draft.mp4; ffmpeg -v error -y -ss 471 -i $V -vf "fps=2,scale=320:-1,tile=6x3" -f…`
- Read `scratchpad/fresh18/c03e.jpg`
- Ran `cd .; S=scratchpad/fresh18; V=out/review/round6/video/ch03-draft.mp4; ffmpeg -v error -y -ss 107 -i $V -vf "fps=1/2.5,scale=320:-1,tile=6x4…`
- Read `scratchpad/fresh18/c03f.jpg`
- Ran `cat scratchpad/fresh18/lines04.txt`
- Read `scratchpad/fresh18/w04.jpg`
- Ran `cd .; grep -n -i 'kahsh' script/script.yaml text/source/pg27462.txt | head; grep -n -i 'Kahsh\|label' src/scenes/ch04.js | head -20`
- Ran `cd .; S=scratchpad/fresh18; V=out/review/round6/video/ch04-draft.mp4; ffmpeg -v error -y -ss 280 -i $V -vf "fps=1/1.5,scale=320:-1,tile=6x4…`
- Read `scratchpad/fresh18/c04a.jpg`
- Ran `cat scratchpad/fresh18/lines05.txt`
- Read `scratchpad/fresh18/w05.jpg`
- Ran `cd .; S=scratchpad/fresh18; V=out/review/round5/video/ch05-draft.mp4; ffmpeg -v error -y -ss 262 -i $V -vf "fps=1/2,scale=320:-1,tile=6x5" …`
- Read `scratchpad/fresh18/c05a.jpg`
- Ran `cd .; S=scratchpad/fresh18; V=out/review/round5/video/ch05-draft.mp4; ffmpeg -v error -y -ss 330 -i $V -vf "fps=1/1.5,scale=320:-1,tile=6x4…`
- Read `scratchpad/fresh18/c05b.jpg`
- Ran `cd .; for w in golden appeared cage, guinea pale-green dead.; do grep -o "\[\"$w\",[0-9.]*,[0-9.]*\]" src/gen/ch05.js; done; S=scratchpad/f…`
- Read `scratchpad/fresh18/c05c.jpg`
- Ran `cd .; S=scratchpad/fresh18; V=out/review/round5/video/ch05-draft.mp4; ffmpeg -v error -y -ss 478 -i $V -vf "fps=1,scale=320:-1,tile=6x4" -f…`
- Read `scratchpad/fresh18/c05d.jpg`
- Read `scratchpad/fresh18/c05e.jpg`
- Ran `cat scratchpad/fresh18/lines06.txt`
- Read `scratchpad/fresh18/w06.jpg`
- Ran `cd .; for w in violet, blue, orange red flamed; do grep -o "\[\"$w\",[0-9.]*,[0-9.]*\]" src/gen/ch06.js; done; S=scratchpad/fresh18; V=out/…`
- Read `scratchpad/fresh18/c06a.jpg`
- Ran `cd .; S=scratchpad/fresh18; V=out/review/round6/video/ch06-draft.mp4; ffmpeg -v error -y -ss 92 -i $V -vf "fps=1/2.5,scale=320:-1,tile=6x4"…`
- Read `scratchpad/fresh18/c06b.jpg`
- Ran `cd .; for w in darted disappear, blank. Half nine majestically; do grep -o "\[\"$w\",[0-9.]*,[0-9.]*\]" src/gen/ch06.js; done; S=scratchpad…`
- Read `scratchpad/fresh18/c06c.jpg`
- Ran `cat scratchpad/fresh18/lines07.txt`
- Read `scratchpad/fresh18/w07.jpg`
- Ran `cd .; S=scratchpad/fresh18; V=out/review/round6/video/ch07-draft.mp4; ffmpeg -v error -y -ss 31 -i $V -vf "fps=1/2,crop=900:500:190:200,sca…`
- Read `scratchpad/fresh18/c07a.jpg`
- Ran `cd .; S=scratchpad/fresh18; V=out/review/round6/video/ch07-draft.mp4; ffmpeg -v error -y -ss 86 -i $V -vf "fps=1,scale=320:-1,tile=6x4" -fr…`
- Read `scratchpad/fresh18/c07b.jpg`
- Ran `cd .; S=scratchpad/fresh18; V=out/review/round6/video/ch07-draft.mp4; ffmpeg -v error -y -ss 184 -i $V -vf "fps=1/1.5,scale=320:-1,tile=6x6…`
- Read `scratchpad/fresh18/c07c.jpg`
- Ran `cat scratchpad/fresh18/lines08.txt`
- Read `scratchpad/fresh18/w08.jpg`
- Ran `cd .; S=scratchpad/fresh18; V=out/review/round6/video/ch08-draft.mp4; ffmpeg -v error -y -ss 40 -i $V -vf "fps=1/1.5,scale=320:-1,tile=6x4"…`
- Read `scratchpad/fresh18/c08a.jpg`
- Ran `cd .; sed -n '/id: D/,/id: F/p' script/boards/ch08.yaml; grep -n -i 'ribbon\|wisp\|thought\|dream' src/scenes/ch08.js | head -20`
- Ran `cat scratchpad/fresh18/lines09.txt`
- Read `scratchpad/fresh18/w09.jpg`
- Ran `cd .; S=scratchpad/fresh18; V=out/review/round6/video/ch09-draft.mp4; ffmpeg -v error -y -ss 190 -i $V -vf "fps=1/1.5,scale=320:-1,tile=6x5…`
- Read `scratchpad/fresh18/c09a.jpg`
- Ran `cd .; grep -n -i 'ruddy\|red glory\|sunrise\|dawn' script/boards/ch09.yaml PLAN.md DECISIONS.md notes/annotations.yaml | head -20`
- Ran `cd .; grep -n -i 'sunrise\|maroon\|red sky\|ruddy' quality/status.yaml notes/annotations.yaml | cut -c1-400 | head`
- Ran `cd .; S=scratchpad/fresh18; V=out/review/round6/video/ch09-draft.mp4; ffmpeg -v error -y -ss 232 -i $V -frames:v 1 $S/f09_232.jpg; ffmpeg -…`
- Read `scratchpad/fresh18/f09_232.jpg`
- Ran `cd .; S=scratchpad/fresh18; V=out/review/round6/video/ch09-draft.mp4; ffmpeg -v error -y -ss 138 -i $V -vf "fps=1/1.2,scale=320:-1,tile=6x5…`
- Read `scratchpad/fresh18/c09b.jpg`
- Ran `cat scratchpad/fresh18/lines10.txt scratchpad/fresh18/lines11.txt`
- Read `scratchpad/fresh18/w10.jpg`
- Ran `cd .; for w in showering swung Instantly, rays Unmoved,; do grep -o "\[\"$w\",[0-9.]*,[0-9.]*\]" src/gen/ch10.js; done; S=scratchpad/fresh1…`
- Read `scratchpad/fresh18/c10a.jpg`
- Read `scratchpad/fresh18/w11.jpg`
- Ran `cd .; for n in 00 01 02 03 04 05 06 07 08 09 10 11; do if [ $n = 05 ]; then V=out/review/round5/video/ch05-draft.mp4; else V=out/review/rou…`
- Ran `cd .; S=scratchpad/fresh18; cat > $S/seg.mjs <<'EOF' import fs from 'fs'; const n = process.argv[2]; const src = fs.readFileSync('src/gen/c…`
- Ran `cd .; S=scratchpad/fresh18; sort -k5 -n $S/lineloud.txt | head -4; sort -k5 -n $S/lineloud.txt | tail -4`
- Ran `cd .; for n in 00 01 02 03 04 05 06 07 08 09 10 11; do if [ $n = 05 ]; then V=out/review/round5/video/ch05-draft.mp4; else V=out/review/rou…`
- Ran `cd .; V=out/review/round6/video/ch01-draft.mp4; for s in 114 115 116 116.5 117 117.5 118 118.5 119 120; do echo "$s $(ffmpeg -hide_banner -…`
- Ran `cd .; V=out/review/round6/video/ch01-draft.mp4; for s in 91.5 92 92.5 93 210.5 211 211.5; do echo "$s $(ffmpeg -hide_banner -ss $s -t 0.5 -…`
- Ran `cd .; S=scratchpad/fresh18; V=out/review/round6/video/ch08-draft.mp4; ffmpeg -v error -y -ss 163 -i $V -vf "fps=1/2.5,scale=320:-1,tile=6x4…`
- Read `scratchpad/fresh18/c08b.jpg`
- Ran `cd .; ls out/quality/phone out/quality/desktop; find site/public -name '*.html' | head -50`
- Ran `cd .; S=scratchpad/fresh18; cat > $S/txt.py <<'EOF' import sys,re,html s=open(sys.argv[1]).read() s=re.sub(r'<script.*?</script>','',s,flag…`
- Ran `cd .; S=scratchpad/fresh18; python3 -I $S/txt.py site/public/review/round7/annotated.html > $S/annot.txt; wc -c $S/annot.txt; head -c 6000 …`
- Ran `cd .; S=scratchpad/fresh18; tail -c +6000 $S/annot.txt | head -c 16000`
- Ran `cd .; grep -n '\[2\]' script/script.yaml text/source/pg27462.txt | head; grep -n -i 'footnote' src/scenes/ch02.js | head`
- Ran `cd .; S=scratchpad/fresh18; V=out/review/round6/video/ch08-draft.mp4; ffmpeg -v error -y -ss 236 -i $V -vf "fps=1,scale=320:-1,tile=6x5" -f…`
- Read `scratchpad/fresh18/c08c.jpg`
- Ran `cd .; S=scratchpad/fresh18; for p in about review notes watch; do echo "=== $p"; python3 -I $S/txt.py site/public/$p/index.html | head -80;…`
- Ran `cd .; ls -la out/quality/phone | head -5; for f in home review_round7_annotated read review_quality notes_science; do python3 -I -c " impor…`
- Ran `cd .; S=scratchpad/fresh18; ffmpeg -v error -y -i out/quality/phone/home.jpg -i out/quality/phone/review_round7_annotated.jpg -i out/qualit…`
- Read `scratchpad/fresh18/phone1.jpg`
- Ran `cd .; S=scratchpad/fresh18; python3 -I $S/txt.py site/public/review/quality/index.html | head -70`
- Ran `cd .; S=scratchpad/fresh18; mkdir -p $S/live; for p in "" review/round7/annotated.html review/quality/ read/; do f=$S/live/$(echo "x$p" | t…`
- Ran `cd .; grep -o 'ch[0-9][0-9]-draft-[0-9a-f]*\.mp4' site/public/review/round7/annotated.html | sort -u; ls site/review/round*/video/ 2>/dev/n…`
- Ran `cd .; S=scratchpad/fresh18; python3 -I $S/txt.py site/public/review/round4/models.html | head -60; ls site/public/review/round4/`
- Read `out/quality/desktop/review_round7_annotated.jpg`
- Read `scratchpad/fresh18/phone2.jpg`
- Ran `cd .; S=scratchpad/fresh18; V=out/review/round5/video/ch05-draft.mp4; ffmpeg -v error -y -ss 5 -i $V -vf "fps=1/5,scale=320:-1,tile=6x6" -f…`
- Read `scratchpad/fresh18/c05f.jpg`
- Ran `cd .; S=scratchpad/fresh18; V=out/review/round5/video/ch05-draft.mp4; ffmpeg -v error -y -ss 139 -i $V -vf "fps=2,scale=320:-1,tile=6x3" -f…`
- Read `scratchpad/fresh18/c05g.jpg`
- Ran `cd .; S=scratchpad/fresh18; V=out/review/round6/video/ch04-draft.mp4; ffmpeg -v error -y -ss 14 -i $V -vf "fps=1/2.5,scale=320:-1,tile=6x5"…`
- Read `scratchpad/fresh18/c04b.jpg`
- Ran `cd .; S=scratchpad/fresh18; V=out/review/round6/video/ch02-draft.mp4; ffmpeg -v error -y -ss 35 -i $V -vf "fps=1/2,scale=320:-1,tile=6x4" -…`
- Read `scratchpad/fresh18/c02e.jpg`
- Ran `cd .; S=scratchpad/fresh18; V=out/review/round6/video/ch02-draft.mp4; ffmpeg -v error -y -ss 62 -i $V -frames:v 1 $S/f02_62.jpg; ffmpeg -v …`
- Read `scratchpad/fresh18/f02_62.jpg`
- Ran `cd .; S=scratchpad/fresh18; V=out/review/round6/video/ch03-draft.mp4; ffmpeg -v error -y -ss 23 -i $V -frames:v 1 $S/f03_23.jpg`
- Read `scratchpad/fresh18/f03_23.jpg`
- Ran `cd .; grep -n 'Roal' text/source/pg27462.txt | head -3; grep -n 'Roal 2\|Roal-2' script/script.yaml | head`
- Ran `cd .; S=scratchpad/fresh18; V=out/review/round6/video/ch04-draft.mp4; ffmpeg -v error -y -ss 112 -i $V -frames:v 1 $S/f04_112.jpg; ffmpeg -…`
- Read `scratchpad/fresh18/f04_112.jpg`
- Read `scratchpad/fresh18/c04c.jpg`
- Ran `cd .; ls site/public/review/round4/img/ | head -30`
- Read `site/public/review/round4/img/model1-1d403e08.jpg`
- Ran `cd .; for f in $(find site/public -name '*.html'); do n=$(grep -o '<img[^>]*>' $f | grep -vc 'alt='); v=$(grep -o '<video[^>]*>' $f | wc -l…`
- Ran `cd .; grep -o -i '[^ ]\{0,60\}\(vtt\|caption\|transcript\|addTextTrack\|track\)[^ ]\{0,60\}' site/public/review/round7/annotated.html | sor…`
- Ran `cd .; python3 -I -c " import re for f in ['site/public/review/round7/annotated.html','site/public/review/round6/ch03-draft.html']: s=open(f…`
- Browser: opened https://curtcox.github.io/The-Last-Evolution/review/round7/annotated.html
- Browser: ran a script in the page
- Browser: resize window
- Browser: ran a script in the page
- Browser: ran a script in the page
- Browser: screenshot
- Browser: resize window
- Ran `cd .; S=scratchpad/fresh18; V=out/review/round6/video/ch03-draft.mp4; ffmpeg -v error -y -ss 303 -i $V -vf "fps=1/3,scale=320:-1,tile=6x4" …`
- Read `scratchpad/fresh18/c03g.jpg`
- Ran `cd .; S=scratchpad/fresh18; V=out/review/round6/video/ch03-draft.mp4; ffmpeg -v error -y -ss 326 -i $V -frames:v 1 $S/f03_326.jpg; sed -n '…`
- Read `scratchpad/fresh18/f03_326.jpg`
- Ran `cd .; for w in Tiny wormed transports human; do grep -o "\[\"$w\",[0-9.]*,[0-9.]*\]" src/gen/ch03.js; done; S=scratchpad/fresh18; V=out/rev…`
- Read `scratchpad/fresh18/c03h.jpg`
- Ran `cd .; S=scratchpad/fresh18; V=out/review/round6/video/ch03-draft.mp4; ffmpeg -v error -y -ss 331 -i $V -frames:v 1 -vf crop=640:360:320:340…`
- Read `scratchpad/fresh18/f03_331c.jpg`
- Ran `cd .; S=scratchpad/fresh18; V=out/review/round6/video/ch07-draft.mp4; ffmpeg -v error -y -ss 97 -i $V -vf "fps=1,scale=320:-1,tile=6x4" -fr…`
- Read `scratchpad/fresh18/c07d.jpg`
- Ran `cd .; S=scratchpad/fresh18; V=out/review/round6/video/ch07-draft.mp4; ffmpeg -v error -y -ss 104.3 -i $V -frames:v 1 $S/f07_104.jpg; grep -…`
- Read `scratchpad/fresh18/f07_104.jpg`
- Ran `cd .; V=out/review/round6/video/ch07-draft.mp4; for t in 96 98.5 101 104.3 112 121 147; do echo "$t $(ffmpeg -v error -ss $t -i $V -frames:…`
- Ran `cd .; V=out/review/round6/video/ch07-draft.mp4; for t in 98.5 101 104.3 112 121 147; do ffmpeg -v error -ss $t -i $V -frames:v 1 -vf "crop=…`
- Ran `cd .; S=scratchpad/fresh18; V=out/review/round5/video/ch05-draft.mp4; ffmpeg -v error -y -ss 453 -i $V -vf "fps=2,crop=640:400:500:100,scal…`
- Read `scratchpad/fresh18/c05h.jpg`
- Ran `cd .; S=scratchpad/fresh18; mkdir -p $S/edge; for n in 00 01 02 03 04 05 06 07 08 09 10 11; do if [ $n = 05 ]; then V=out/review/round5/vid…`
- Ran `cd .; S=scratchpad/fresh18; ffmpeg -v error -y -ss 203 -i out/review/round6/video/ch01-draft.mp4 -vf "fps=2,scale=320:-1,tile=6x2" -frames:…`
- Read `scratchpad/fresh18/c01f.jpg`
- Read `scratchpad/fresh18/c05i.jpg`
- Read `scratchpad/fresh18/c06d.jpg`
- Ran `cd .; S=scratchpad/fresh18; ffmpeg -v error -y -ss 9 -i out/review/round6/video/ch00-draft.mp4 -frames:v 1 -vf scale=480:-1 $S/f00_9.jpg; f…`
- Read `scratchpad/fresh18/f00_9.jpg`
- Read `scratchpad/fresh18/f00_53.jpg`
- Ran `cd .; S=scratchpad/fresh18; python3 -I $S/txt.py site/public/read/index.html > $S/read.txt; head -c 1500 $S/read.txt; echo; echo ----; grep…`
- Ran `cd .; grep -o 'poorer type[s]*' scratchpad/fresh18/read.txt text/source/pg27462.txt script/script.yaml; grep -c . /dev/null`
- Ran `cd .; for w in ruby twice vanished. gone,; do grep -o "\[\"$w\",[0-9.]*,[0-9.]*\]" src/gen/ch09.js; done; S=scratchpad/fresh18; V=out/revie…`
- Read `scratchpad/fresh18/c09c.jpg`
- Ran `cd .; S=scratchpad/fresh18; ffmpeg -v error -y -ss 77 -i out/review/round6/video/ch01-draft.mp4 -frames:v 1 -vf crop=560:300:720:380 $S/f01…`
- Read `scratchpad/fresh18/f01_77c.jpg`
- Ran `cd .; S=scratchpad/fresh18; ffmpeg -v error -y -ss 8 -i out/review/round6/video/ch07-draft.mp4 -vf "fps=1/2.5,scale=320:-1,tile=4x2" -frame…`
- Read `scratchpad/fresh18/c07e.jpg`
- Read `scratchpad/fresh18/c07f.jpg`
- Ran `cd .; S=scratchpad/fresh18; ffmpeg -v error -y -ss 85.5 -i out/review/round6/video/ch07-draft.mp4 -frames:v 1 $S/f07_85.jpg; ffmpeg -v erro…`
- Read `scratchpad/fresh18/f07_85.jpg`
- Read `scratchpad/fresh18/f07_15c.jpg`
- Ran `cd .; S=scratchpad/fresh18; ffmpeg -v error -y -ss 113 -i out/review/round6/video/ch04-draft.mp4 -frames:v 1 -vf crop=300:400:300:240 $S/f0…`
- Read `scratchpad/fresh18/f04_kahsh.jpg`
