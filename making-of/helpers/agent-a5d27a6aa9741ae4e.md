# Helper: Second fresh-eyes review of film and site

Started in [2026-11-05](../parts/2026-11-05.md). [All parts](../README.md)

A helper is another copy of Claude, started with its own instructions for one job. It sees only what it's given.

#### Claude, to the helper · 02:02

You are doing a fresh-eyes quality review of an animated film and its companion website, in the repository at .. The film adapts John W. Campbell's 1932 story "The Last Evolution" as twelve chapters (ch00-ch11) in a pulp ink-and-wash style. You have no earlier context, and that is the point: judge it as a first-time viewer and a careful critic.

READ-ONLY: do not edit, commit, render, or publish anything, and do not run `npm run ask` or any paid model call. Write scratch files only under scratchpad/fresh2/.

What to judge against: quality/rubric.yaml (the criteria for each item: acting, picture, sync, sound, story per chapter; the site pages; work items) and QUALITY.md. Also skim PLAN.md section 5 (designs) and the story text in script/script.yaml for what each chapter must convey.

Material:
- Film drafts: out/review/round6/video/ch00-draft.mp4 … ch11-draft.mp4 (chapter 5 is out/review/round5/video/ch05-draft.mp4). About 57 minutes in all.
- Storyboards: script/boards/chNN.yaml; scene code src/scenes/chNN.js; voice timing in src/gen/chNN.js.
- The site: built pages under site/public/ (the film page is site/review/round7/annotated.html; notes source in notes/annotations.yaml). Phone and desktop screenshots in out/quality/phone and out/quality/desktop (fresh as of today). The live site is https://curtcox.github.io/The-Last-Evolution/ (use a generic User-Agent if you fetch it).

Tools and tips:
- ffmpeg is installed but has no drawtext filter. Frame sheets: `ffmpeg -v error -y -ss START -i VIDEO -vf "fps=1/STEP,scale=320:-1,tile=6x4" -frames:v 1 OUT.jpg`, then view with the Read tool; tile k is at about START + k*STEP. Crop full-size frames for detail: `ffmpeg -ss T -i V -frames:v 1 -vf crop=960:540:X:Y out.jpg`.
- Loudness: `ffmpeg -hide_banner -ss A -t D -i V -vn -af ebur128 -f null - 2>&1 | grep -E '^\s+I:'` (target about -14.5 LUFS). Levels: `-af astats` and grep 'RMS level dB'.
- The shell is zsh: `set -- $var` does not word-split; pass arguments explicitly.
- Transcripts with words lost/extra may exist in out/ask/chNN/hear.json.
- The `yaml` npm package resolves only when node runs from the repo directory.

Do a real watch: for every chapter, at least one whole-chapter sheet (step about duration/24), then closer sheets (step 1-5 s) wherever something looks off or the story has a key beat. Look for: figures overlapping or hidden, things appearing or vanishing without a cut, illegible or too-dark shots, staging that contradicts the narration, characters frozen while others speak, continuity breaks between shots and chapters, sound level jumps or dropouts, sync of cuts to words, story beats that don't land, lettering errors; and on the site: wrong or stale wording, broken layout at phone width, links, anything addressed to the makers instead of visitors.

Report back (as your final message, plain text) a list of findings, most serious first. For each: chapter or page, timestamp (m:ss) or element, what is wrong, why it matters, severity (major / minor / nit), and the evidence (which sheet or measurement). If you find nothing wrong in an area, say what you checked. Be concrete and honest: don't invent problems to fill the list, and don't pass over real ones. Keep the report under about 1200 words.

#### The helper did · 02:02

- Ran `mkdir -p scratchpad/fresh2 && wc -l quality/rubric.yaml QUALITY.md PLAN.md script/script.yaml && ls out/review/round6/video out/review/roun…`
- Ran `cat quality/rubric.yaml QUALITY.md && grep -n "^## " PLAN.md`
- Ran `sed -n 161,246p PLAN.md`
- Ran `S=scratchpad/fresh2; for n in 00 01 02 03 04 05 06 07 08 09 10 11; do v=out/review/round6/video/ch$n-draft.mp4; [ $n = 05 ] && v=out/review…`
- Read `scratchpad/fresh2/ch00-all.jpg`
- Ran `cat script/boards/ch00.yaml | head -80`
- Ran `S=scratchpad/fresh2; v=out/review/round6/video/ch00-draft.mp4; ffmpeg -v error -y -ss 1 -i $v -frames:v 1 -vf crop=960:300:480:40 $S/c0a.jp…`
- Ran `S=scratchpad/fresh2; v=out/review/round6/video/ch00-draft.mp4; ffmpeg -v error -y -ss 1.5 -i $v -frames:v 1 -vf crop=640:160:320:30,scale=1…`
- Read `scratchpad/fresh2/c0a.jpg`
- Ran `S=scratchpad/fresh2; v=out/review/round6/video/ch00-draft.mp4; ffmpeg -v error -y -ss 1.5 -i $v -frames:v 1 -vf crop=640:200:320:130,scale=…`
- Read `scratchpad/fresh2/c0a.jpg`
- Read `scratchpad/fresh2/c0b.jpg`
- Read `scratchpad/fresh2/ch01-all.jpg`
- Ran `grep -nE "^\s+- id:|^\s+at:|^\s+title:" script/boards/ch01.yaml | paste - - - | head -40; ls src/gen | head; head -c 1500 src/gen/ch01.js`
- Ran `S=scratchpad/fresh2; cat > $S/lines.mjs <<'EOF' import fs from 'fs'; const n=process.argv[2]; const src=fs.readFileSync('src/gen/ch${n}.js'…`
- Ran `S=scratchpad/fresh2; v=out/review/round6/video/ch01-draft.mp4; ffmpeg -v error -y -ss 11 -i $v -vf "fps=1/1,scale=320:-1,tile=6x4" -frames:…`
- Read `scratchpad/fresh2/c1b.jpg`
- Read `scratchpad/fresh2/c1d.jpg`
- Ran `S=scratchpad/fresh2; v=out/review/round6/video/ch01-draft.mp4; ffmpeg -v error -y -ss 87 -i $v -frames:v 1 $S/c1e.jpg`
- Read `scratchpad/fresh2/c1e.jpg`
- Read `scratchpad/fresh2/ch02-all.jpg`
- Ran `S=scratchpad/fresh2; node $S/lines.mjs 02 | cut -c1-140`
- Ran `S=scratchpad/fresh2; v=out/review/round6/video/ch02-draft.mp4; ffmpeg -v error -y -ss 172 -i $v -vf "fps=1/1,scale=320:-1,tile=6x4" -frames…`
- Read `scratchpad/fresh2/c2a.jpg`
- Read `scratchpad/fresh2/c2fn.jpg`
- Ran `S=scratchpad/fresh2; v=out/review/round6/video/ch02-draft.mp4; for t in 25 29 31 33; do ffmpeg -v error -y -ss $t -i $v -frames:v 1 -vf sca…`
- Read `scratchpad/fresh2/c2f.jpg`
- Read `scratchpad/fresh2/ch03-all.jpg`
- Ran `S=scratchpad/fresh2; node $S/lines.mjs 03 | cut -c1-150`
- Ran `grep -A1 '"shots"' src/gen/ch03.js | head -2 | grep -o '"shots":{[^}]*}'; grep -nE "^\s+- id:|^\s+at:|^\s+title:" script/boards/ch03.yaml |…`
- Ran `S=scratchpad/fresh2; v=out/review/round6/video/ch03-draft.mp4; ffmpeg -v error -y -ss 176 -i $v -vf "fps=1/1,scale=320:-1,tile=6x4" -frames…`
- Read `scratchpad/fresh2/c3j.jpg`
- Ran `S=scratchpad/fresh2; v=out/review/round6/video/ch03-draft.mp4; ffmpeg -v error -y -ss 211 -i $v -frames:v 1 $S/c3k.jpg`
- Read `scratchpad/fresh2/c3k.jpg`
- Read `scratchpad/fresh2/c3m.jpg`
- Ran `S=scratchpad/fresh2; v=out/review/round6/video/ch03-draft.mp4; ffmpeg -v error -y -ss 205 -i $v -vf "fps=2,crop=1280:240:0:480,scale=640:-1…`
- Read `scratchpad/fresh2/c3k2.jpg`
- Ran `S=scratchpad/fresh2; v=out/review/round6/video/ch03-draft.mp4; ffmpeg -v error -y -ss 211 -i $v -vf "fps=2,crop=1280:240:0:480,scale=640:-1…`
- Read `scratchpad/fresh2/c3k3.jpg`
- Ran `S=scratchpad/fresh2; v=out/review/round6/video/ch03-draft.mp4; ffmpeg -v error -y -ss 372 -i $v -vf "fps=1/4.5,scale=320:-1,tile=6x4" -fram…`
- Read `scratchpad/fresh2/c3s.jpg`
- Ran `S=scratchpad/fresh2; v=out/review/round6/video/ch03-draft.mp4; ffmpeg -v error -y -ss 400 -i $v -vf "fps=1/3,crop=640:400:320:320,scale=320…`
- Read `scratchpad/fresh2/c3s2.jpg`
- Read `scratchpad/fresh2/ch04-all.jpg`
- Ran `S=scratchpad/fresh2; node $S/lines.mjs 04 | cut -c1-130; grep -nE "^\s+- id:|^\s+at:|^\s+title:" script/boards/ch04.yaml | paste - - - | cu…`
- Ran `S=scratchpad/fresh2; v=out/review/round6/video/ch04-draft.mp4; ffmpeg -v error -y -ss 110 -i $v -frames:v 1 $S/c4i.jpg`
- Read `scratchpad/fresh2/c4i.jpg`
- Read `scratchpad/fresh2/ch05-all.jpg`
- Ran `S=scratchpad/fresh2; node $S/lines.mjs 05 | cut -c1-120`
- Ran `S=scratchpad/fresh2; v=out/review/round5/video/ch05-draft.mp4; ffmpeg -v error -y -ss 260 -i $v -vf "fps=1/1.5,scale=320:-1,tile=6x4" -fram…`
- Read `scratchpad/fresh2/c5b.jpg`
- Read `scratchpad/fresh2/c5c.jpg`
- Ran `S=scratchpad/fresh2; v=out/review/round5/video/ch05-draft.mp4; ffmpeg -v error -y -ss 471 -i $v -frames:v 1 -vf crop=400:300:440:150 $S/c5c…`
- Read `scratchpad/fresh2/c5cru.jpg`
- Read `scratchpad/fresh2/ch06-all.jpg`
- Ran `S=scratchpad/fresh2; node $S/lines.mjs 06 | cut -c1-120; grep -nE "^\s+- id:|^\s+at:|^\s+title:" script/boards/ch06.yaml | paste - - - | cu…`
- Ran `S=scratchpad/fresh2; v=out/review/round6/video/ch06-draft.mp4; ffmpeg -v error -y -ss 58 -i $v -vf "fps=1/1,scale=320:-1,tile=6x4" -frames:…`
- Read `scratchpad/fresh2/c6e.jpg`
- Ran `S=scratchpad/fresh2; v=out/review/round6/video/ch06-draft.mp4; ffmpeg -v error -y -ss 182 -i $v -vf "fps=1/2.5,scale=320:-1,tile=6x5" -fram…`
- Read `scratchpad/fresh2/c6i.jpg`
- Ran `S=scratchpad/fresh2; v=out/review/round6/video/ch06-draft.mp4; ffmpeg -v error -y -ss 216 -i $v -frames:v 1 $S/c6j.jpg`
- Read `scratchpad/fresh2/c6j.jpg`
- Read `scratchpad/fresh2/ch07-all.jpg`
- Ran `S=scratchpad/fresh2; node $S/lines.mjs 07 | cut -c1-120; grep -nE "^\s+- id:|^\s+at:|^\s+title:" script/boards/ch07.yaml | paste - - - | cu…`
- Ran `S=scratchpad/fresh2; v=out/review/round6/video/ch07-draft.mp4; ffmpeg -v error -y -ss 30 -i $v -vf "fps=1/2.5,scale=320:-1,tile=6x4" -frame…`
- Read `scratchpad/fresh2/c7d.jpg`
- Ran `S=scratchpad/fresh2; v=out/review/round6/video/ch07-draft.mp4; ffmpeg -v error -y -ss 52.5 -i $v -frames:v 1 $S/c7e.jpg`
- Read `scratchpad/fresh2/c7e.jpg`
- Ran `S=scratchpad/fresh2; v=out/review/round6/video/ch07-draft.mp4; ffmpeg -v error -y -ss 16 -i $v -frames:v 1 $S/c7b.jpg; ffmpeg -v error -y -…`
- Read `scratchpad/fresh2/c7b.jpg`
- Read `scratchpad/fresh2/c7g.jpg`
- Read `scratchpad/fresh2/ch08-all.jpg`
- Ran `S=scratchpad/fresh2; node $S/lines.mjs 08 | cut -c1-120; grep -nE "^\s+- id:|^\s+at:|^\s+title:" script/boards/ch08.yaml | paste - - - | cu…`
- Ran `S=scratchpad/fresh2; for n in 02 03 04 05 08 09 10 11; do v=out/review/round6/video/ch$n-draft.mp4; [ $n = 05 ] && v=out/review/round5/vide…`
- Read `scratchpad/fresh2/opens.jpg`
- Read `scratchpad/fresh2/ch09-all.jpg`
- Ran `S=scratchpad/fresh2; node $S/lines.mjs 09 | cut -c1-120; grep -nE "^\s+- id:|^\s+at:|^\s+title:" script/boards/ch09.yaml | paste - - - | cu…`
- Ran `S=scratchpad/fresh2; v=out/review/round6/video/ch09-draft.mp4; ffmpeg -v error -y -ss 124 -i $v -vf "fps=1/2,scale=320:-1,tile=6x4" -frames…`
- Read `scratchpad/fresh2/c9i.jpg`
- Ran `S=scratchpad/fresh2; v=out/review/round6/video/ch09-draft.mp4; ffmpeg -v error -y -ss 138.5 -i $v -vf "fps=2,scale=320:-1,tile=6x3" -frames…`
- Read `scratchpad/fresh2/c9j.jpg`
- Ran `S=scratchpad/fresh2; v=out/review/round6/video/ch09-draft.mp4; ffmpeg -v error -y -ss 210 -i $v -frames:v 1 $S/c9k.jpg; ffmpeg -v error -y …`
- Read `scratchpad/fresh2/c9k.jpg`
- Read `scratchpad/fresh2/c9m.jpg`
- Ran `S=scratchpad/fresh2; v=out/review/round6/video/ch09-draft.mp4; ffmpeg -v error -y -ss 192 -i $v -vf "fps=1,scale=320:-1,tile=6x5" -frames:v…`
- Read `scratchpad/fresh2/c9k2.jpg`
- Read `scratchpad/fresh2/ch10-all.jpg`
- Ran `S=scratchpad/fresh2; node $S/lines.mjs 10 | cut -c1-120; node $S/lines.mjs 11 | cut -c1-120`
- Read `scratchpad/fresh2/ch11-all.jpg`
- Ran `for n in 00 01 02 03 04 05 06 07 08 09 10 11; do v=out/review/round6/video/ch$n-draft.mp4; [ $n = 05 ] && v=out/review/round5/video/ch05-dr…`
- Ran `S=scratchpad/fresh2; cat > $S/perline.mjs <<'EOF' import fs from 'fs'; import {execFileSync} from 'child_process'; const n=process.argv[2];…`
- Ran `ffmpeg -hide_banner -nostats -t 2 -i out/review/round6/video/ch04-draft.mp4 -vn -af ebur128=framelog=verbose -f null - 2>&1 | grep -m3 "M:"`
- Ran `ffmpeg -hide_banner -nostats -t 2 -i out/review/round6/video/ch04-draft.mp4 -vn -af ebur128=metadata=1,ametadata=print:key=lavfi.r128.M -f …`
- Ran `ffmpeg -hide_banner -nostats -t 2 -i out/review/round6/video/ch04-draft.mp4 -vn -af ebur128=metadata=1,ametadata=print:key=lavfi.r128.M -f …`
- Ran `S=scratchpad/fresh2; python3 - <<'EOF' import re p='scratchpad/fresh2/perline.mjs' s=open(p).read() s=s.replace("['-hide_banner','-nostats'…`
- Ran `S=scratchpad/fresh2; cat >> $S/perline.mjs <<'EOF' const vals=res.map(x=>+x[3]);console.log('RANGE',Math.min(...vals),Math.max(...vals)); c…`
- Ran `v=out/review/round5/video/ch05-draft.mp4; ffmpeg -hide_banner -nostats -ss 299 -t 4.5 -i $v -vn -af ebur128=metadata=1,ametadata=print:key=…`
- Ran `v=out/review/round6/video/ch00-draft.mp4; ffmpeg -hide_banner -nostats -t 15 -i $v -vn -af ebur128=metadata=1,ametadata=print:key=lavfi.r12…`
- Ran `ls out/ask/ 2>/dev/null; for n in 00 01 02 03 04 05 06 07 08 09 10 11; do f=out/ask/ch$n/hear.json; [ -f $f ] && echo "ch$n $(stat -f %Sm $…`
- Ran `for n in 00 01 02 03 04 05 06 07 08 09 10 11; do node -e "const j=require('./out/ask/ch$n/hear.json');console.log('ch$n',j.words,j.lost,j.e…`
- Ran `ls -la out/quality/phone | head -40; python3 -c " import struct,glob for f in sorted(glob.glob('out/quality/phone/*.jpg'))[:40]: d=open(f,'…`
- Ran `cd out/quality/phone && S=scratchpad/fresh2; ffmpeg -v error -y -i home.jpg -i watch.jpg -i read.jpg -i notes.jpg -i about.jpg -filter_comp…`
- Read `scratchpad/fresh2/phone1.jpg`
- Ran `cd site/public && ls; ls review review/round7 | head; python3 - <<'EOF' import re,html def txt(p): s=open(p).read() s=re.sub(r'(?s)<(script…`
- Ran `cd site/public && wc -c review/round7/annotated.html watch/index.html; head -c 600 watch/index.html; echo; python3 - <<'EOF' import re,html…`
- Ran `cd site/public && grep -o 'vtt[^"]\{0,80\}' review/round7/annotated.html | head; grep -o 'track[^;]\{0,100\}' review/round7/annotated.html …`
- Ran `ls site/review/round*/video/ 2>/dev/null | head -30; for n in 00 05 07; do v=out/review/round6/video/ch$n-draft.mp4; [ $n = 05 ] && v=out/r…`
- Ran `S=scratchpad/fresh2; for p in "" review/round7/annotated.html read/ notes/ about/ review/ review/quality/ notes/science/ notes/factcheck/ n…`
- Ran `cd site/public && python3 - <<'EOF' import re,os,glob,urllib.parse bad=[];ext=set() files=[f for f in glob.glob('**/*.html',recursive=True)…`
- Ran `cd site/public && python3 - <<'EOF' import re,html s=open('review/round7/annotated.html').read() for m in re.finditer(r'href="#t=(\d+)"[^>]…`
- Ran `cd site/public && for f in index.html review/round7/annotated.html read/index.html notes/index.html about/index.html review/index.html note…`
- Browser: opened https://curtcox.github.io/The-Last-Evolution/review/round7/annotated.html
- Browser: resize window
- Browser: ran a script in the page
- Browser: ran a script in the page
- Browser: screenshot
- Browser: ran a script in the page
- Browser: ran a script in the page
- Browser: ran a script in the page
- Browser: ran a script in the page
- Browser: ran a script in the page
- Browser: resize window
- Read `scratchpad/fresh2/phone2.jpg`
- Browser: ran a script in the page
- Ran `cd site/public && python3 - <<'EOF' import re,html for p in ['review/quality/index.html','about/index.html']: s=open(p).read() s=re.sub(r'(…`
- Ran `S=scratchpad/fresh2; v=out/review/round6/video/ch04-draft.mp4; for t in 20 122 150 205; do ffmpeg -v error -y -ss $t -i $v -frames:v 1 -vf …`
- Read `scratchpad/fresh2/c4lab.jpg`
- Ran `S=scratchpad/fresh2; v=out/review/round6/video/ch04-draft.mp4; ffmpeg -v error -y -ss 205 -i $v -frames:v 1 -vf crop=1280:200:0:520 $S/c4bo…`
- Read `scratchpad/fresh2/c4bot.jpg`
- Ran `python3 -c "import PIL; print(PIL.__version__)" 2>&1; python3 -c "import numpy; print(numpy.__version__)" 2>&1`
- Ran `S=scratchpad/fresh2; cat > $S/edges.py <<'EOF' import subprocess,sys,numpy as np v=sys.argv[1]; W,H=320,180 p=subprocess.run(['ffmpeg','-v'…`
- Ran `S=scratchpad/fresh2; i=0; for spec in "03 12" "03 230" "03 375" "04 80" "04 162" "04 170" "04 195" "08 265" "08 276" "09 15" "09 153" "09 2…`
- Read `scratchpad/fresh2/edges.jpg`
- Ran `S=scratchpad/fresh2; v=out/review/round6/video/ch04-draft.mp4; ffmpeg -v error -y -ss 85 -i $v -frames:v 1 $S/c4_85.jpg`
- Read `scratchpad/fresh2/c4_85.jpg`
- Ran `S=scratchpad/fresh2; v=out/review/round6/video/ch02-draft.mp4; ffmpeg -v error -y -ss 122 -i $v -frames:v 1 $S/c2o.jpg`
- Read `scratchpad/fresh2/c2o.jpg`
