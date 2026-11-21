# Helper: Fresh-eyes review round 12

Started in [2026-11-09](../parts/2026-11-09.md). [All parts](../README.md)

A helper is another copy of Claude, started with its own instructions for one job. It sees only what it's given.

#### Claude, to the helper · 23:03

You are doing a fresh-eyes quality review of an animated film and its companion website, in the repository at .. The film adapts John W. Campbell's 1932 story "The Last Evolution" as twelve chapters (ch00-ch11) in a pulp ink-and-wash style. You have no earlier context, and that is the point: judge it as a first-time viewer and a careful critic.

READ-ONLY: do not edit, commit, render, or publish anything, and do not run `npm run ask` or any paid model call. Write scratch files only under scratchpad/fresh12/.

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

#### The helper did · 23:03

- Ran `mkdir -p scratchpad/fresh12 && ls && wc -l quality/rubric.yaml QUALITY.md PLAN.md script/script.yaml && ls out/review/round6/video out/revi…`
- Ran `cat quality/rubric.yaml QUALITY.md`
- Ran `grep -n '^#' PLAN.md | head -50`
- Ran `sed -n 161,246p PLAN.md`
- Ran `head -60 script/script.yaml; ls script/boards src/scenes src/gen | head -60`
- Ran `head -c 1500 src/gen/ch00.js; echo; grep -o 'lines' src/gen/ch00.js | head -2`

#### The helper · 23:03

Let me write a helper to dump a timed transcript per chapter (shots + lines with word times compressed into phrases).

#### The helper did · 23:03

- Ran `cat > scratchpad/fresh12/tx.mjs <<'EOF' import fs from 'fs'; const n = process.argv[2].padStart(2,'0'); const src = fs.readFileSync('src/ge…`
- Ran `S=scratchpad/fresh12; for i in 00 01 02 03 04 05 06 07 08 09 10 11; do V=out/review/round6/video/ch$i-draft.mp4; [ $i = 05 ] && V=out/revie…`
- Read `scratchpad/fresh12/whole00.jpg`
- Read `scratchpad/fresh12/whole01.jpg`
- Ran `cat scratchpad/fresh12/tx1.txt | head -60; cd . && grep -nE '^\s*-?\s*(id|shot|what|picture|desc):' script/boards/ch01.yaml | head -40`
- Read `scratchpad/fresh12/whole02.jpg`
- Ran `cat scratchpad/fresh12/tx2.txt`
- Ran `S=scratchpad/fresh12; V=out/review/round6/video/ch02-draft.mp4; ffmpeg -v error -y -ss 268 -i $V -vf "fps=1/1.5,scale=320:-1,tile=6x4" -fra…`
- Read `scratchpad/fresh12/c02a.jpg`
- Ran `cat > scratchpad/fresh12/w.mjs <<'EOF' import fs from 'fs'; const n = process.argv[2].padStart(2,'0'); const re = new RegExp(process.argv[3…`
- Read `scratchpad/fresh12/c02b.jpg`
- Read `scratchpad/fresh12/whole03.jpg`
- Ran `cat scratchpad/fresh12/tx3.txt | awk 'length>0' | cut -c1-90`
- Ran `S=scratchpad/fresh12; V=out/review/round6/video/ch03-draft.mp4; ffmpeg -v error -y -ss 166 -i $V -vf "fps=1/2,scale=320:-1,tile=6x4" -frame…`
- Read `scratchpad/fresh12/c03a.jpg`
- Ran `grep -n -A12 ' - id: J' script/boards/ch03.yaml | head -30; grep -n -A12 ' - id: K' script/boards/ch03.yaml | head -20`
- Ran `S=scratchpad/fresh12; V=out/review/round6/video/ch03-draft.mp4; ffmpeg -v error -y -ss 176 -i $V -vf "fps=2,scale=320:-1,tile=6x4" -frames:…`
- Read `scratchpad/fresh12/c03c.jpg`
- Ran `S=scratchpad/fresh12; V=out/review/round6/video/ch03-draft.mp4; ffprobe -v error -select_streams v -show_entries stream=r_frame_rate,start_…`
- Read `scratchpad/fresh12/fstack.jpg`
- Ran `cat > scratchpad/fresh12/sheet.sh <<'EOF' #!/bin/zsh # sheet.sh CH START STEP OUT [cols rows] cd . CH=$1; V=out/review/round6/video/ch$CH-d…`
- Read `scratchpad/fresh12/test03.jpg`
- Ran `S=scratchpad/fresh12; V=out/review/round6/video/ch03-draft.mp4; ffmpeg -v error -y -i $V -ss 180 -frames:v 1 -vf scale=320:-1 $S/g1.jpg; ff…`
- Read `scratchpad/fresh12/gstack.jpg`
- Ran `V=out/review/round6/video/ch03-draft.mp4; ffmpeg -hide_banner -ss 166 -i $V -vf "select='isnan(prev_selected_t)+gte(t-prev_selected_t\,1.99…`
- Ran `S=scratchpad/fresh12; V=out/review/round6/video/ch03-draft.mp4; ffmpeg -v error -y -ss 166 -i $V -vf "select='isnan(prev_selected_t)+gte(t-…`
- Read `scratchpad/fresh12/row.jpg`
- Ran `S=scratchpad/fresh12; for p in "00 2.4" "01 9.25" "02 13" "03 20.25" "04 13.2" "05 22.6" "06 11.7" "07 11" "08 13.25" "09 12.85" "10 6.6" "…`
- Read `scratchpad/fresh12/whole03.jpg`
- Ran `S=scratchpad/fresh12; $S/sheet.sh 03 14 2.5 c03d; cd .; ffmpeg -v error -y -ss 61 -i out/review/round6/video/ch03-draft.mp4 -frames:v 1 $S/…`
- Read `scratchpad/fresh12/c03d.jpg`
- Read `scratchpad/fresh12/c03_61.jpg`
- Ran `sed -n 1,80p script/boards/ch03.yaml`
- Ran `S=scratchpad/fresh12; ffmpeg -v error -y -ss 23.5 -i out/review/round6/video/ch03-draft.mp4 -frames:v 1 $S/c03_23.jpg; node $S/w.mjs 3 'Roa…`
- Read `scratchpad/fresh12/c03_23.jpg`
- Read `scratchpad/fresh12/whole04.jpg`
- Ran `cat scratchpad/fresh12/tx4.txt | awk 'length>0' | cut -c1-90`
- Ran `S=scratchpad/fresh12; $S/sheet.sh 04 86 2 c04a`
- Read `scratchpad/fresh12/c04a.jpg`
- Ran `grep -n -iE 'kahsh|25374|35429' script/script.yaml | cut -c1-200; grep -rn -E 'Kahsh-|Roal 2|Trest 3|Kahsh 2' src/scenes/*.js | head`
- Read `scratchpad/fresh12/whole05.jpg`
- Ran `cat scratchpad/fresh12/tx5.txt | awk 'length>0' | cut -c1-90`
- Ran `S=scratchpad/fresh12; $S/sheet.sh 05 262 1.5 c05a; $S/sheet.sh 05 452 1.2 c05b`
- Read `scratchpad/fresh12/c05a.jpg`
- Read `scratchpad/fresh12/c05b.jpg`
- Ran `S=scratchpad/fresh12; ffmpeg -v error -y -ss 470 -i out/review/round5/video/ch05-draft.mp4 -frames:v 1 $S/c05_470.jpg`
- Read `scratchpad/fresh12/c05_470.jpg`
- Read `scratchpad/fresh12/whole06.jpg`
- Ran `cat scratchpad/fresh12/tx6.txt | awk 'length>0' | cut -c1-90`
- Ran `S=scratchpad/fresh12; $S/sheet.sh 06 64 1 c06a; node $S/w.mjs 6 'violet|blue,|orange|red|black'`
- Read `scratchpad/fresh12/c06a.jpg`
- Ran `S=scratchpad/fresh12; ffmpeg -v error -y -ss 72.7 -i out/review/round6/video/ch06-draft.mp4 -frames:v 1 -vf "crop=640:360:320:180" $S/c06_7…`
- Read `scratchpad/fresh12/c06_72.jpg`
- Read `scratchpad/fresh12/whole07.jpg`
- Ran `cat scratchpad/fresh12/tx7.txt | awk 'length>0' | cut -c1-90`
- Ran `S=scratchpad/fresh12; $S/sheet.sh 07 88 2 c07a`
- Read `scratchpad/fresh12/c07a.jpg`
- Read `scratchpad/fresh12/whole08.jpg`
- Ran `cat scratchpad/fresh12/tx8.txt | awk 'length>0' | cut -c1-90`
- Ran `S=scratchpad/fresh12; $S/sheet.sh 08 212 1.5 c08a`
- Read `scratchpad/fresh12/c08a.jpg`
- Ran `S=scratchpad/fresh12; ffmpeg -v error -y -ss 66.75 -i out/review/round6/video/ch08-draft.mp4 -frames:v 1 $S/c08_66.jpg; grep -n -B2 -A10 "i…`
- Read `scratchpad/fresh12/c08_66.jpg`
- Ran `S=scratchpad/fresh12; $S/sheet.sh 08 38 1.5 c08b`
- Read `scratchpad/fresh12/c08b.jpg`
- Read `scratchpad/fresh12/whole09.jpg`
- Ran `cat scratchpad/fresh12/tx9.txt | awk 'length>0' | cut -c1-90`
- Ran `S=scratchpad/fresh12; $S/sheet.sh 09 24 1.5 c09a; $S/sheet.sh 09 136 1 c09b`
- Read `scratchpad/fresh12/c09a.jpg`
- Read `scratchpad/fresh12/c09b.jpg`
- Ran `S=scratchpad/fresh12; $S/sheet.sh 09 139.5 0.25 c09c; node $S/w.mjs 9 'stabbing|flashed|light|there|beam|dull|leaped'`
- Read `scratchpad/fresh12/c09c.jpg`
- Ran `S=scratchpad/fresh12; $S/sheet.sh 09 138.4 0.0833 c09d 6 3`
- Read `scratchpad/fresh12/c09d.jpg`
- Ran `grep -n -A14 "id: I$" script/boards/ch09.yaml; grep -n "stabbing\|p121.4" src/scenes/ch09.js | head`
- Read `scratchpad/fresh12/whole10.jpg`
- Ran `cat scratchpad/fresh12/tx10.txt scratchpad/fresh12/tx11.txt | awk 'length>0' | cut -c1-90`
- Read `scratchpad/fresh12/whole11.jpg`
- Read `scratchpad/fresh12/whole01.jpg`
- Read `scratchpad/fresh12/whole00.jpg`
- Ran `S=scratchpad/fresh12; V=out/review/round6/video/ch00-draft.mp4; ffmpeg -v error -y -ss 12.5 -i $V -frames:v 1 -vf crop=640:200:320:100 $S/c…`
- Read `scratchpad/fresh12/c00_12.jpg`
- Read `scratchpad/fresh12/c00_30.jpg`
- Ran `for i in 00 01 02 03 04 05 06 07 08 09 10 11; do V=out/review/round6/video/ch$i-draft.mp4; [ $i = 05 ] && V=out/review/round5/video/ch05-dr…`
- Ran `S=scratchpad/fresh12; for i in 00 01 02 03 04 05 06 07 08 09 10 11; do V=out/review/round6/video/ch$i-draft.mp4; [ $i = 05 ] && V=out/revie…`
- Ran `S=scratchpad/fresh12; cat > $S/lines.mjs <<'EOF' import fs from 'fs'; const S='scratchpad/fresh12'; for (let n=0;n<12;n++){ const nn=String…`
- Ran `S=scratchpad/fresh12; awk '/pts_time/{split($3,a,":"); t=a[2]} /r128.M/{split($0,b,"="); if (t>=32.5 && t<=37) printf "%s:%.0f ", t, b[2]}'…`
- Ran `S=scratchpad/fresh12; awk '/pts_time/{split($3,a,":"); t=a[2]} /r128.M/{split($0,b,"="); if (t>=72.5 && t<=75) printf "%s:%.0f ", t, b[2]}'…`
- Ran `sed -n 140,160p PLAN.md`
- Ran `S=scratchpad/fresh12; node $S/w.mjs 5 'snap|fell|heavily'; cat script/sfx.yaml | head -40; grep -n "snap" script/sfx.yaml`
- Ran `sed -n 40,100p script/sfx.yaml`
- Ran `S=scratchpad/fresh12; $S/sheet.sh 07 30 2 c07b`
- Read `scratchpad/fresh12/c07b.jpg`
- Ran `ls -la out/quality/phone out/quality/desktop | head -40; ls site/public | head -30`
- Ran `ls out/quality/phone/*.jpg 2>/dev/null | head; ls out/quality | head -50; file out/quality/desktop/home.jpg`
- Ran `cd site/public && python3 -c " import re,html,sys for f in ['index.html','about/index.html','review/index.html']: s=open(f).read() s=re.sub…`
- Ran `cd site && ls; ls public/watch public/review/round7 2>/dev/null; grep -o 'src="[^"]*\.\(mp4\|vtt\|webm\)[^"]*"' review/round7/annotated.htm…`
- Ran `ls site/review/; ls site/review/round*/video 2>/dev/null | head -40; for i in 00 04 05; do V=out/review/round6/video/ch$i-draft.mp4; [ $i =…`
- Ran `cd site && wc -c review/round7/annotated.html public/review/round7/annotated.html public/watch/index.html; diff -q review/round7/annotated.…`
- Ran `python3 -c " d=[57.833333,222.065,312.5,486.082,316.5,542.916667,281.5,265.48,317.914,308.666667,159.162,152.25] s=sum(d);print(s, int(s//6…`
- Ran `cd site/public && python3 -c " import re,html s=open('review/round7/annotated.html').read() s=re.sub(r'<script.*?</script>|<style.*?</style…`
- Ran `grep -n "shown" script/script.yaml | grep -v "shown: break" | head -30; grep -n -A3 "shown: footnote" script/script.yaml | head -30`
- Ran `grep -n -i "footnote\|unit.*gravity\|\[2\]" script/script.yaml | head; grep -n "fn2\|footnote" src/scenes/ch02.js | head`
- Ran `S=scratchpad/fresh12; ffmpeg -v error -y -ss 62 -i out/review/round6/video/ch02-draft.mp4 -frames:v 1 $S/c02_62.jpg`
- Read `scratchpad/fresh12/c02_62.jpg`
- Ran `S=scratchpad/fresh12; $S/sheet.sh 02 34 1.5 c02c`
- Read `scratchpad/fresh12/c02c.jpg`
- Ran `cd out/quality/phone && ls; file home.jpg`
- Ran `cd out/quality/phone && S=scratchpad/fresh12; ffmpeg -v error -y -i home.jpg -i watch.jpg -i read.jpg -i about.jpg -i review_quality.jpg -f…`
- Read `scratchpad/fresh12/phone1.jpg`
- Loaded the skill `anthropic-skills:built-in-browser`
- Browser: opened https://curtcox.github.io/The-Last-Evolution/
- Browser: resize window
- Browser: ran a script in the page
- Browser: ran a script in the page
- Ran `cd scratchpad/fresh12 && curl -s -A "Mozilla/5.0" https://curtcox.github.io/The-Last-Evolution/review/round7/annotated.html -o live_ann.htm…`
- Ran `cd site/public && cat watch/index.html; echo; python3 - <<'EOF' import re,html s=open('read/index.html').read() s=re.sub(r'<script.*?</scri…`
- Ran `S=scratchpad/fresh12; $S/sheet.sh 03 368 5 c03e`
- Read `scratchpad/fresh12/c03e.jpg`
- Ran `S=scratchpad/fresh12; $S/sheet.sh 07 182 1 c07c; $S/sheet.sh 06 232 1 c06b`
- Read `scratchpad/fresh12/c07c.jpg`
- Read `scratchpad/fresh12/c06b.jpg`
- Ran `S=scratchpad/fresh12; $S/sheet.sh 05 160 2 c05c`
- Read `scratchpad/fresh12/c05c.jpg`
- Ran `S=scratchpad/fresh12; $S/sheet.sh 05 200.5 0.167 c05d 6 3; cd .; grep -n -A10 " - id: P$\| - id: Q$" script/boards/ch05.yaml | head -30`
- Read `scratchpad/fresh12/c05d.jpg`
- Ran `S=scratchpad/fresh12; ffmpeg -v error -y -ss 139.25 -i out/review/round6/video/ch09-draft.mp4 -frames:v 1 -vf crop=760:300:0:60 $S/c09_139.…`
- Read `scratchpad/fresh12/c09_139.jpg`
- Read `scratchpad/fresh12/c09_143.jpg`
- Ran `cd site/public && grep -o '<details[^>]*><summary>[^<]*' review/quality/index.html | head; grep -c "a few credits" review/quality/index.html`
- Ran `S=scratchpad/fresh12; ffmpeg -v error -y -ss 33 -i out/review/round6/video/ch02-draft.mp4 -frames:v 1 -vf scale=375:-1 $S/c02_33_phone.png`
- Read `scratchpad/fresh12/c02_33_phone.png`
- Ran `S=scratchpad/fresh12; ffmpeg -v error -y -ss 33 -i out/review/round6/video/ch02-draft.mp4 -frames:v 1 -vf crop=900:120:0:580 $S/c02_33_fn.p…`
- Read `scratchpad/fresh12/c02_33_fn.png`
- Ran `S=scratchpad/fresh12; $S/sheet.sh 09 198 1 c09e 6 2`
- Read `scratchpad/fresh12/c09e.jpg`
- Ran `S=scratchpad/fresh12; ffmpeg -v error -y -ss 208 -i out/review/round6/video/ch09-draft.mp4 -frames:v 1 -vf crop=900:420:300:150 $S/c09_208.…`
- Read `scratchpad/fresh12/c09_208.jpg`
- Browser: resize window
