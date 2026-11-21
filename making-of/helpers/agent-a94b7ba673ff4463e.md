# Helper: Seventh fresh-eyes review

Started in [2026-11-07](../parts/2026-11-07.md). [All parts](../README.md)

A helper is another copy of Claude, started with its own instructions for one job. It sees only what it's given.

#### Claude, to the helper · 14:18

You are doing a fresh-eyes quality review of an animated film and its companion website, in the repository at .. The film adapts John W. Campbell's 1932 story "The Last Evolution" as twelve chapters (ch00-ch11) in a pulp ink-and-wash style. You have no earlier context, and that is the point: judge it as a first-time viewer and a careful critic.

READ-ONLY: do not edit, commit, render, or publish anything, and do not run `npm run ask` or any paid model call. Write scratch files only under scratchpad/fresh7/.

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

#### The helper did · 14:18

- Ran `ls && wc -l quality/rubric.yaml QUALITY.md PLAN.md script/script.yaml && ls out/review/round6/video/ out/review/round5/video/ out/quality/p…`
- Ran `cat quality/rubric.yaml QUALITY.md; ls out/review/round6/video/`
- Ran `grep -n '^#' PLAN.md | head -60`
- Ran `sed -n 161,246p PLAN.md; for f in out/review/round6/video/*.mp4 out/review/round5/video/ch05-draft.mp4; do echo "$f $(ffprobe -v error -sho…`
- Ran `S=scratchpad/fresh7; for n in 00 01 02 03 04 05 06 07 08 09 10 11; do v=out/review/round6/video/ch$n-draft.mp4; [ $n = 05 ] && v=out/review…`
- Ran `tail -c 400 src/gen/ch00.js; ls script/boards src/scenes | head -40`
- Ran `S=scratchpad/fresh7; cat > $S/dump.cjs <<'EOF' const fs=require('fs'); const n=process.argv[2]; const src=fs.readFileSync('src/gen/ch${n}.j…`
- Read `scratchpad/fresh7/whole00.jpg`
- Ran `S=scratchpad/fresh7; cat $S/lines01.txt | cut -c1-900`
- Read `scratchpad/fresh7/whole01.jpg`
- Ran `S=scratchpad/fresh7; cat > $S/text.cjs <<'EOF' const fs=require('fs'); const n=process.argv[2]; const src=fs.readFileSync('src/gen/ch${n}.j…`
- Ran `S=scratchpad/fresh7; ffmpeg -v error -y -ss 118 -i out/review/round6/video/ch01-draft.mp4 -vf "fps=1/1,scale=320:-1,tile=6x4" -frames:v 1 $…`
- Read `scratchpad/fresh7/c01a.jpg`
- Ran `S=scratchpad/fresh7; ffmpeg -v error -y -ss 6 -i out/review/round6/video/ch01-draft.mp4 -vf "fps=1/1,scale=320:-1,tile=6x4" -frames:v 1 $S/…`
- Read `scratchpad/fresh7/c01b.jpg`
- Ran `S=scratchpad/fresh7; ffmpeg -v error -y -ss 26 -i out/review/round6/video/ch01-draft.mp4 -vf "fps=4,scale=480:-1,tile=4x4" -frames:v 1 $S/c…`
- Read `scratchpad/fresh7/c01c.jpg`
- Ran `S=scratchpad/fresh7; node $S/text.cjs 02 13`
- Read `scratchpad/fresh7/whole02.jpg`
- Ran `S=scratchpad/fresh7; V=out/review/round6/video/ch02-draft.mp4; ffmpeg -v error -y -ss 34 -i $V -vf "fps=1/2,scale=320:-1,tile=6x4" -frames:…`
- Read `scratchpad/fresh7/c02a.jpg`
- Read `scratchpad/fresh7/c02b.jpg`
- Read `scratchpad/fresh7/c02c.jpg`
- Ran `S=scratchpad/fresh7; grep -o 'last@[0-9.]* plunger@[0-9.]* snapped@[0-9.]* shut.@[0-9.]* Instantly@[0-9.]* the@[0-9.]* vast@[0-9.]* energie…`
- Read `scratchpad/fresh7/c02d.jpg`
- Ran `S=scratchpad/fresh7; node $S/text.cjs 03 20`
- Read `scratchpad/fresh7/whole03.jpg`
- Ran `S=scratchpad/fresh7; V=out/review/round6/video/ch03-draft.mp4; ffmpeg -v error -y -ss 174 -i $V -vf "fps=1/2,scale=320:-1,tile=6x4" -frames…`
- Read `scratchpad/fresh7/c03a.jpg`
- Ran `S=scratchpad/fresh7; V=out/review/round6/video/ch03-draft.mp4; ffmpeg -v error -y -ss 193 -i $V -frames:v 1 -vf crop=960:540:0:540 $S/f03_1…`
- Read `scratchpad/fresh7/f03_193.jpg`
- Read `scratchpad/fresh7/c03b.jpg`
- Ran `S=scratchpad/fresh7; V=out/review/round6/video/ch03-draft.mp4; ffmpeg -v error -y -ss 370 -i $V -vf "fps=1/5,scale=320:-1,tile=6x4" -frames…`
- Read `scratchpad/fresh7/c03c.jpg`
- Ran `S=scratchpad/fresh7; node $S/text.cjs 04 15`
- Read `scratchpad/fresh7/whole04.jpg`
- Ran `S=scratchpad/fresh7; V=out/review/round6/video/ch04-draft.mp4; ffmpeg -v error -y -ss 92 -i $V -vf "fps=1,scale=320:-1,tile=6x4" -frames:v …`
- Read `scratchpad/fresh7/c04a.jpg`
- Ran `S=scratchpad/fresh7; V=out/review/round6/video/ch04-draft.mp4; ffmpeg -v error -y -ss 93 -t 11 -i $V -vf "fps=2,crop=1920:700:0:300,scale=4…`
- Read `scratchpad/fresh7/c04c.jpg`
- Ran `ffprobe -v error -show_entries stream=width,height,r_frame_rate -of csv=p=0 out/review/round6/video/ch04-draft.mp4`
- Ran `S=scratchpad/fresh7; V=out/review/round6/video/ch04-draft.mp4; ffmpeg -v error -y -ss 93 -t 11 -i $V -vf "fps=2,crop=1280:400:0:300,scale=4…`
- Read `scratchpad/fresh7/c04c.jpg`
- Ran `grep -n "6349" src/scenes/ch04.js | head -30; grep -n "6349\|^ G:\|shot: G" script/boards/ch04.yaml | head`
- Ran `S=scratchpad/fresh7; V=out/review/round6/video/ch04-draft.mp4; ffmpeg -v error -y -ss 150 -i $V -vf "fps=1/1.5,scale=320:-1,tile=6x4" -fram…`
- Read `scratchpad/fresh7/c04d.jpg`
- Ran `S=scratchpad/fresh7; V=out/review/round6/video/ch04-draft.mp4; ffmpeg -v error -y -ss 182 -i $V -vf "fps=1/2,scale=640:-1,tile=2x3" -frames…`
- Read `scratchpad/fresh7/c04e.jpg`
- Ran `S=scratchpad/fresh7; node $S/text.cjs 05 20`
- Read `scratchpad/fresh7/whole05.jpg`
- Ran `S=scratchpad/fresh7; V=out/review/round5/video/ch05-draft.mp4; ffmpeg -v error -y -ss 262 -i $V -vf "fps=1/1.5,scale=320:-1,tile=6x4" -fram…`
- Read `scratchpad/fresh7/c05a.jpg`
- Ran `S=scratchpad/fresh7; V=out/review/round5/video/ch05-draft.mp4; ffmpeg -v error -y -ss 420 -i $V -vf "fps=1/3,scale=320:-1,tile=6x4" -frames…`
- Read `scratchpad/fresh7/c05b.jpg`
- Ran `S=scratchpad/fresh7; V=out/review/round5/video/ch05-draft.mp4; ffmpeg -v error -y -ss 472.5 -i $V -frames:v 1 -vf crop=400:300:440:250 $S/f…`
- Read `scratchpad/fresh7/f05_472.jpg`
- Ran `S=scratchpad/fresh7; node $S/text.cjs 06 12`
- Read `scratchpad/fresh7/whole06.jpg`
- Ran `S=scratchpad/fresh7; V=out/review/round6/video/ch06-draft.mp4; ffmpeg -v error -y -ss 60 -i $V -vf "fps=1/1.5,scale=320:-1,tile=6x4" -frame…`
- Read `scratchpad/fresh7/c06a.jpg`
- Read `scratchpad/fresh7/c06b.jpg`
- Ran `S=scratchpad/fresh7; node $S/text.cjs 07 12`
- Read `scratchpad/fresh7/whole07.jpg`
- Ran `S=scratchpad/fresh7; V=out/review/round6/video/ch07-draft.mp4; ffmpeg -v error -y -ss 230 -i $V -vf "fps=1/1.5,scale=320:-1,tile=6x4" -fram…`
- Read `scratchpad/fresh7/c07a.jpg`
- Ran `S=scratchpad/fresh7; V=out/review/round6/video/ch07-draft.mp4; ffmpeg -v error -y -ss 261 -i $V -vf "fps=3,scale=320:-1,tile=4x4" -frames:v…`
- Read `scratchpad/fresh7/c07b.jpg`
- Read `scratchpad/fresh7/c08start.jpg`
- Ran `S=scratchpad/fresh7; V=out/review/round6/video/ch07-draft.mp4; ffmpeg -v error -y -ss 264.3 -i $V -vf "scale=320:-1,tile=6x2" -frames:v 1 $…`
- Read `scratchpad/fresh7/c07c.jpg`
- Read `scratchpad/fresh7/ends.jpg`
- Ran `S=scratchpad/fresh7; node $S/text.cjs 08 12`
- Read `scratchpad/fresh7/whole08.jpg`
- Ran `S=scratchpad/fresh7; V=out/review/round6/video/ch08-draft.mp4; ffmpeg -v error -y -ss 296 -i $V -vf "fps=1,scale=320:-1,tile=6x4" -frames:v…`
- Read `scratchpad/fresh7/c08a.jpg`
- Ran `S=scratchpad/fresh7; V=out/review/round6/video/ch08-draft.mp4; ffmpeg -v error -y -ss 288 -i $V -frames:v 1 $S/f08_288.jpg; ffmpeg -v error…`
- Read `scratchpad/fresh7/f08_288.jpg`
- Read `scratchpad/fresh7/f08_305.jpg`
- Ran `S=scratchpad/fresh7; node $S/text.cjs 09 12`
- Read `scratchpad/fresh7/whole09.jpg`
- Ran `S=scratchpad/fresh7; V=out/review/round6/video/ch09-draft.mp4; ffmpeg -v error -y -ss 137 -i $V -vf "fps=1/1.5,scale=320:-1,tile=6x4" -fram…`
- Read `scratchpad/fresh7/c09a.jpg`
- Ran `S=scratchpad/fresh7; V=out/review/round6/video/ch09-draft.mp4; grep -o 'I@13[0-9.]* can@[0-9.]* exist@[0-9.]* quite@[0-9.]* alone.@[0-9.]*\…`
- Read `scratchpad/fresh7/c09c.jpg`
- Read `scratchpad/fresh7/c09d.jpg`
- Read `scratchpad/fresh7/c09b.jpg`
- Ran `S=scratchpad/fresh7; node $S/text.cjs 10 10; node $S/text.cjs 11 10`
- Read `scratchpad/fresh7/whole10.jpg`
- Ran `S=scratchpad/fresh7; V=out/review/round6/video/ch10-draft.mp4; grep -o 'Instantly,@[0-9.]* they@[0-9.]* swung@[0-9.]* their@[0-9.]* weapons…`
- Read `scratchpad/fresh7/c10a.jpg`
- Read `scratchpad/fresh7/c10b.jpg`
- Read `scratchpad/fresh7/whole11.jpg`
- Ran `S=scratchpad/fresh7; ffmpeg -v error -y -ss 105 -i out/review/round6/video/ch11-draft.mp4 -frames:v 1 -vf crop=700:240:290:100 $S/p11.jpg; …`
- Read `scratchpad/fresh7/p11.jpg`
- Read `scratchpad/fresh7/p02.jpg`
- Ran `S=scratchpad/fresh7; ffmpeg -v error -y -ss 30 -i out/review/round6/video/ch02-draft.mp4 -frames:v 1 -vf crop=1000:130:30:540 $S/p02.jpg`
- Read `scratchpad/fresh7/p02.jpg`
- Ran `S=scratchpad/fresh7; ffmpeg -v error -y -ss 34 -i out/review/round6/video/ch02-draft.mp4 -frames:v 1 -vf crop=1000:150:30:520 $S/p02.jpg; g…`
- Read `scratchpad/fresh7/p02.jpg`
- Ran `for n in 00 01 02 03 04 05 06 07 08 09 10 11; do v=out/review/round6/video/ch$n-draft.mp4; [ $n = 05 ] && v=out/review/round5/video/ch05-dr…`
- Ran `S=scratchpad/fresh7; cat > $S/lines_t.cjs <<'EOF' const fs=require('fs');const n=process.argv[2]; const C=JSON.parse(fs.readFileSync('src/g…`
- Ran `S=scratchpad/fresh7; sort -k6 -n $S/lineloud.txt | head -4; wc -l < $S/lineloud.txt`
- Ran `for n in 00 01 02 03 04 05 06 07 08 09 10 11; do v=out/review/round6/video/ch$n-draft.mp4; [ $n = 05 ] && v=out/review/round5/video/ch05-dr…`
- Ran `ffmpeg -hide_banner -ss 80 -t 5 -i out/review/round6/video/ch07-draft.mp4 -vn -af ebur128 -f null - 2>&1 | grep -E 't: *[0-9]' | awk '{prin…`
- Ran `ffmpeg -hide_banner -ss 80 -t 5 -i out/review/round6/video/ch07-draft.mp4 -vn -af ebur128 -f null - 2>&1 | grep -E 'M:' | head -3; ffmpeg -…`
- Ran `sed -n 146,160p PLAN.md`
- Ran `grep -n "snap\|thud\|fall" script/sfx.yaml | head -20; ffmpeg -hide_banner -ss 287 -t 6 -i out/review/round5/video/ch05-draft.mp4 -vn -af "…`
- Ran `S=scratchpad/fresh7; ffmpeg -v error -y -ss 160 -i out/review/round6/video/ch08-draft.mp4 -vf "fps=1/3,scale=320:-1,tile=6x4" -frames:v 1 $…`
- Read `scratchpad/fresh7/c08b.jpg`
- Read `scratchpad/fresh7/c07d.jpg`
- Ran `S=scratchpad/fresh7; ffmpeg -v error -y -ss 45 -i out/review/round6/video/ch08-draft.mp4 -frames:v 1 $S/f08_45.jpg`
- Read `scratchpad/fresh7/f08_45.jpg`
- Ran `S=scratchpad/fresh7; for n in 01 02 03 04 05 06 07 08 09 10 11; do v=out/review/round6/video/ch$n-draft.mp4; [ $n = 05 ] && v=out/review/ro…`
- Read `scratchpad/fresh7/heads.jpg`
- Ran `S=scratchpad/fresh7; ffmpeg -v error -y -ss 6 -i out/review/round6/video/ch03-draft.mp4 -vf "fps=1/2,scale=320:-1,tile=6x4" -frames:v 1 $S/…`
- Read `scratchpad/fresh7/c03d.jpg`
- Ran `sed -n 1,60p script/boards/ch03.yaml`
- Ran `cd site/public && find . -name "*.html" | grep -v node_modules | head -50; ls`
- Ran `cd site/public && python3 -c " import re,sys,html for f in ['index.html','watch/index.html','about/index.html','review/index.html','notes/i…`
- Ran `cd site/public && cat watch/index.html | head -30; python3 -c " import re,sys,html for f in ['review/round7/annotated.html','review/round6/…`
- Ran `cd site/public && python3 -c " import re,sys,html f='review/round7/annotated.html' s=open(f).read() s=re.sub(r'<script.*?</script>|<style.*…`
- Ran `cd site/public && python3 -c " import re,sys,html f='review/round7/annotated.html' s=open(f).read() s=re.sub(r'<script.*?</script>|<style.*…`
- Ran `cd out/quality && for f in phone/*.jpg; do echo "$f $(ffprobe -v error -show_entries stream=width,height -of csv=p=0 $f)"; done | head -40`
- Ran `cd out/quality/phone && S=scratchpad/fresh7; ffmpeg -v error -y -i home.jpg -i review_round7_annotated.jpg -i read.jpg -i about.jpg -i revi…`
- Read `scratchpad/fresh7/phone1.jpg`
- Ran `grep -rn -i "menta-\?type" script/script.yaml text/* 2>/dev/null | head; ls text`
- Read `scratchpad/fresh7/phone2.jpg`
- Ran `grep -n -i "kahsh\|kosh" text/story.md script/script.yaml | head; grep -rn -i "kosh\b" site/public --include=*.html | head -5; grep -rn -i …`
- Ran `cd out/quality/desktop && ffprobe -v error -show_entries stream=width,height -of csv=p=0 review_round7_annotated.jpg; S=scratchpad/fresh7; …`
- Read `scratchpad/fresh7/d_ann.jpg`
- Ran `cd site/public/review/round7 && grep -oE '(src|href)="[^"]+"' annotated.html | sort | uniq -c | sort -rn | head -40; grep -oE '"[^"]*\.(mp4…`
- Ran `for n in 00 03 08; do shasum -a 256 out/review/round6/video/ch$n-draft.mp4 | cut -c1-8; md5 -q out/review/round6/video/ch$n-draft.mp4 | cut…`
- Ran `cd site/public/review/round7 && grep -oE '<(video|track)[^>]*>' annotated.html | head; grep -o 'vtt[^"]*' annotated.html | head -3; grep -c…`
- Ran `cd site/public && for p in "" review/round7/annotated.html read/ review/quality/; do f=${p:-index.html}; [ "$p" = read/ ] && f=read/index.h…`
- Ran `cd site/public && python3 -c " import re,sys,html for f in ['review/quality/index.html']: s=open(f).read() s=re.sub(r'<script.*?</script>|<…`
- Ran `S=scratchpad/fresh7; ffmpeg -v error -y -ss 44 -i out/review/round5/video/ch05-draft.mp4 -vf "fps=1,scale=320:-1,tile=6x4" -frames:v 1 $S/c…`
- Read `scratchpad/fresh7/c05c.jpg`
- Ran `S=scratchpad/fresh7; grep -o 'Hydrogen,@[0-9.]* an@[0-9.]* atom@[0-9.]* in@[0-9.]* space;@[0-9.]* but@[0-9.]* a@[0-9.]* single@[0-9.]* prot…`
- Ran `S=scratchpad/fresh7; ffmpeg -v error -y -ss 172 -i out/review/round6/video/ch07-draft.mp4 -vf "fps=1/2,scale=320:-1,tile=6x4" -frames:v 1 $…`
- Read `scratchpad/fresh7/c07e.jpg`
- Ran `S=scratchpad/fresh7; ffmpeg -v error -y -ss 190 -t 6 -i out/review/round6/video/ch07-draft.mp4 -vf "fps=2,crop=640:260:320:420,scale=320:-1…`
- Read `scratchpad/fresh7/c07f.jpg`
- Read `scratchpad/fresh7/f07_202.jpg`
- Ran `grep -n -i "bell\|quiver" script/boards/ch07.yaml src/scenes/ch07.js | head`
- Ran `sed -n 95,130p src/scenes/ch07.js`
- Ran `S=scratchpad/fresh7; ffmpeg -v error -y -ss 186 -t 8 -i out/review/round6/video/ch07-draft.mp4 -vf "fps=1,crop=700:400:290:320,scale=350:-1…`
- Read `scratchpad/fresh7/c07g.jpg`
- Ran `S=scratchpad/fresh7; grep -o 'rose@[0-9.]*\|induction@[0-9.]* beam.@[0-9.]*\|harmless@[0-9.]*\|weaving@[0-9.]* tentacles@[0-9.]*' $S/lines0…`
- Read `scratchpad/fresh7/c04f.jpg`
- Ran `S=scratchpad/fresh7; ffmpeg -v error -y -ss 287 -i out/review/round6/video/ch02-draft.mp4 -frames:v 1 $S/f02_287.jpg`
- Read `scratchpad/fresh7/f02_287.jpg`
- Ran `S=scratchpad/fresh7; ffmpeg -v error -y -ss 276 -i out/review/round6/video/ch08-draft.mp4 -frames:v 1 -vf scale=640:-1 $S/f08_276.jpg`
- Read `scratchpad/fresh7/f08_276.jpg`
- Ran `grep -n "retard" notes/annotations.yaml site/public/notes/*/index.html | cut -c1-250`
