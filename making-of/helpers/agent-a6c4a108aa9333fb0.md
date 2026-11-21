# Helper: Fresh-eyes review round 22

Started in [2026-11-14](../parts/2026-11-14.md). [All parts](../README.md)

A helper is another copy of Claude, started with its own instructions for one job. It sees only what it's given.

#### Claude, to the helper · 10:28

Read the file out/quality/fresh22/prompt.txt and follow its instructions exactly. It describes a read-only fresh-eyes quality review of a film and its website; your final message is the report it asks for.

#### The helper did · 10:28

- Read `out/quality/fresh22/prompt.txt`
- Ran `cd .; ls out/quality/ | head -50; ls out/quality/fresh22 out/review/round6/video out/review/round5/video; wc -l quality/rubric.yaml QUALITY…`
- Read `quality/rubric.yaml`
- Ran `cd .; cat QUALITY.md; grep -n '^## ' PLAN.md`
- Ran `cd .; sed -n 161,246p PLAN.md`
- Ran `cd .; D=out/quality/fresh22; for n in 00 01 02 03 04 05 06 07 08 09 10 11; do v=out/review/round6/video/ch$n-draft.mp4; [ $n = 05 ] && v=ou…`
- Ran `cd .; ls -la out/review/round6/video/ out/review/round5/video/; ls -la site/review/*/video/ 2>/dev/null | tail -30; ls site/public/review/ …`

#### The helper · 10:28

Good, they're current. Now the whole-chapter sheets.

#### The helper did · 10:28

- Read `out/quality/fresh22/ch00-all.jpg`
- Ran `cd .; ls script/ script/boards src/gen | head -40; head -80 script/boards/ch00.yaml`
- Ran `cd .; D=out/quality/fresh22; v=out/review/round6/video/ch00-draft.mp4; ffmpeg -v error -y -ss 5.5 -i $v -frames:v 1 -vf crop=640:200:320:15…`
- Read `out/quality/fresh22/c00_5.jpg`
- Read `out/quality/fresh22/c00_12.jpg`
- Read `out/quality/fresh22/ch01-all.jpg`
- Ran `cd .; grep -nE '^\s+- id:|^\s+at:|^\s+title:' script/boards/ch01.yaml | paste - - - ; node -e "const m=require('./src/gen/ch01.js');" 2>&1 …`
- Ran `cd .; tail -c 400 src/gen/ch01.js; cat > out/quality/fresh22/lines.mjs <<'EOF' import fs from 'fs'; const n = process.argv[2]; const src = …`
- Ran `cd .; node out/quality/fresh22/lines.mjs 01 1 | cut -c1-3000; sed -n 52,145p script/boards/ch01.yaml`
- Ran `cd .; D=out/quality/fresh22; v=out/review/round6/video/ch01-draft.mp4; ffmpeg -v error -y -ss 29 -i $v -vf "fps=1/2.6,scale=320:-1,tile=6x4…`
- Read `out/quality/fresh22/c01_CD.jpg`
- Ran `cd .; D=out/quality/fresh22; v=out/review/round6/video/ch01-draft.mp4; ffmpeg -v error -y -ss 64 -i $v -frames:v 1 $D/c01_64.jpg; ffmpeg -v…`
- Read `out/quality/fresh22/c01_64.jpg`
- Read `out/quality/fresh22/c01_88.jpg`
- Ran `cd .; D=out/quality/fresh22; v=out/review/round6/video/ch01-draft.mp4; sed -n 38,51p script/boards/ch01.yaml; ffmpeg -v error -y -ss 12 -i …`
- Read `out/quality/fresh22/c01_B.jpg`
- Read `out/quality/fresh22/ch02-all.jpg`
- Ran `cd .; node out/quality/fresh22/lines.mjs 02; grep -nE '^\s+- id:|^\s+at:|^\s+title:' script/boards/ch02.yaml | paste - - -`
- Ran `cd .; D=out/quality/fresh22; v=out/review/round6/video/ch02-draft.mp4; ffmpeg -v error -y -ss 160 -i $v -vf "fps=1/2,scale=320:-1,tile=6x4"…`
- Read `out/quality/fresh22/c02_J.jpg`
- Ran `cd .; D=out/quality/fresh22; v=out/review/round6/video/ch02-draft.mp4; ffmpeg -v error -y -ss 88 -i $v -vf "fps=1/2.6,scale=320:-1,tile=6x4…`
- Read `out/quality/fresh22/c02_GH.jpg`
- Ran `cd .; D=out/quality/fresh22; v=out/review/round6/video/ch02-draft.mp4; ffmpeg -v error -y -ss 129 -i $v -vf "fps=1,scale=427:-1,tile=4x5" -…`
- Read `out/quality/fresh22/c02_H.jpg`
- Ran `cd .; D=out/quality/fresh22; v=out/review/round6/video/ch02-draft.mp4; ffmpeg -v error -y -ss 276 -i $v -vf "fps=1,scale=427:-1,tile=4x5" -…`
- Read `out/quality/fresh22/c02_N.jpg`
- Read `out/quality/fresh22/ch03-all.jpg`
- Ran `cd .; node out/quality/fresh22/lines.mjs 03; grep -nE '^\s+- id:|^\s+at:|^\s+title:' script/boards/ch03.yaml | paste - - -`
- Ran `cd .; D=out/quality/fresh22; v=out/review/round6/video/ch03-draft.mp4; ffmpeg -v error -y -ss 190 -i $v -vf "fps=1/1.5,scale=427:-1,tile=4x…`
- Read `out/quality/fresh22/c03_K.jpg`
- Ran `cd .; D=out/quality/fresh22; v=out/review/round6/video/ch03-draft.mp4; ffmpeg -v error -y -ss 371 -i $v -vf "fps=1/4.6,scale=320:-1,tile=6x…`
- Read `out/quality/fresh22/c03_SU.jpg`
- Ran `cd .; node out/quality/fresh22/lines.mjs 03 1 | grep -E 'p03[3456]'`
- Ran `cd .; grep -nE 'p03[456]' -A4 script/script.yaml | head -40`
- Ran `cd .; D=out/quality/fresh22; v=out/review/round6/video/ch03-draft.mp4; ffmpeg -v error -y -ss 57 -i $v -vf "fps=1/2,scale=427:-1,tile=4x5" …`
- Read `out/quality/fresh22/c03_DEF.jpg`
- Ran `cd .; D=out/quality/fresh22; v=out/review/round6/video/ch03-draft.mp4; ffmpeg -v error -y -ss 70 -i $v -frames:v 1 $D/c03_70.jpg; ffmpeg -v…`
- Read `out/quality/fresh22/c03_70.jpg`
- Read `out/quality/fresh22/c03_86.jpg`
- Read `out/quality/fresh22/ch04-all.jpg`
- Ran `cd .; node out/quality/fresh22/lines.mjs 04; grep -nE '^\s+- id:|^\s+at:|^\s+title:' script/boards/ch04.yaml | paste - - -`
- Ran `cd .; D=out/quality/fresh22; v=out/review/round6/video/ch04-draft.mp4; for t in 10 98 113 125 150 205; do ffmpeg -v error -y -ss $t -i $v -…`
- Read `out/quality/fresh22/c04_98.jpg`
- Read `out/quality/fresh22/c04_113.jpg`
- Read `out/quality/fresh22/c04_125.jpg`
- Read `out/quality/fresh22/ch05-all.jpg`
- Ran `cd .; node out/quality/fresh22/lines.mjs 05; grep -nE '^\s+- id:|^\s+at:|^\s+title:' script/boards/ch05.yaml | paste - - -`
- Ran `cd .; D=out/quality/fresh22; v=out/review/round5/video/ch05-draft.mp4; ffmpeg -v error -y -ss 262 -i $v -vf "fps=1,scale=427:-1,tile=4x6" -…`
- Read `out/quality/fresh22/c05_UX.jpg`
- Ran `cd .; D=out/quality/fresh22; v=out/review/round5/video/ch05-draft.mp4; ffmpeg -v error -y -ss 285 -i $v -vf "fps=1,scale=427:-1,tile=4x5" -…`
- Read `out/quality/fresh22/c05_X.jpg`
- Ran `cd .; D=out/quality/fresh22; v=out/review/round5/video/ch05-draft.mp4; ffmpeg -v error -y -ss 460 -i $v -vf "fps=1/1.5,scale=427:-1,tile=4x…`
- Read `out/quality/fresh22/c05_AG.jpg`
- Read `out/quality/fresh22/c05_471.jpg`
- Ran `cd .; D=out/quality/fresh22; v=out/review/round5/video/ch05-draft.mp4; ffmpeg -v error -y -ss 16 -i $v -vf "fps=1/1.5,scale=320:-1,tile=6x4…`
- Read `out/quality/fresh22/c05_BG.jpg`
- Ran `cd .; D=out/quality/fresh22; v=out/review/round5/video/ch05-draft.mp4; ffmpeg -v error -y -ss 36 -i $v -frames:v 1 -vf crop=640:400:640:100…`
- Read `out/quality/fresh22/c05_36.jpg`
- Ran `cd .; grep -n "'F-1'\|\"F-1\"\|label" src/scenes/ch05.js | head -20`
- Ran `cd .; sed -n 90,103p src/scenes/ch05.js | cut -c1-300`
- Ran `cd .; D=out/quality/fresh22; v=out/review/round5/video/ch05-draft.mp4; ffmpeg -v error -y -ss 290.6 -i $v -vf "fps=6,crop=700:450:580:200,s…`
- Read `out/quality/fresh22/c05_fall.jpg`
- Ran `cd .; D=out/quality/fresh22; v=out/review/round5/video/ch05-draft.mp4; ffmpeg -v error -y -ss 291.9 -i $v -vf "fps=6,crop=900:500:480:200,s…`
- Read `out/quality/fresh22/c05_fall2.jpg`
- Read `out/quality/fresh22/ch06-all.jpg`
- Ran `cd .; node out/quality/fresh22/lines.mjs 06; grep -nE '^\s+- id:|^\s+at:|^\s+title:' script/boards/ch06.yaml | paste - - -`
- Ran `cd .; D=out/quality/fresh22; v=out/review/round6/video/ch06-draft.mp4; ffmpeg -v error -y -ss 66 -i $v -vf "fps=1,scale=320:-1,tile=6x4" -f…`
- Read `out/quality/fresh22/c06_E.jpg`
- Ran `cd .; D=out/quality/fresh22; v=out/review/round6/video/ch06-draft.mp4; for t in 72.0 72.6 73.2 73.8 74.4 75.0; do ffmpeg -v error -y -ss $t…`
- Read `out/quality/fresh22/c06_728.jpg`
- Ran `cd .; D=out/quality/fresh22; v=out/review/round6/video/ch06-draft.mp4; ffmpeg -v error -y -ss 200 -i $v -vf "fps=1/2.5,scale=320:-1,tile=6x…`
- Read `out/quality/fresh22/c06_IJK.jpg`
- Read `out/quality/fresh22/ch07-all.jpg`
- Ran `cd .; node out/quality/fresh22/lines.mjs 07; grep -nE '^\s+- id:|^\s+at:|^\s+title:' script/boards/ch07.yaml | paste - - -`
- Ran `cd .; D=out/quality/fresh22; v=out/review/round6/video/ch07-draft.mp4; ffmpeg -v error -y -ss 99 -i $v -frames:v 1 -vf scale=800:-1 $D/c07_…`
- Read `out/quality/fresh22/c07_99.jpg`
- Read `out/quality/fresh22/c07_92.jpg`
- Ran `cd .; grep -n "f2(" src/scenes/ch07.js | head; grep -n "f2(x\|f2 =\|f2:" src/designs.js | head`
- Ran `cd .; sed -n 131,175p src/designs.js | cut -c1-220 | grep -n "tent\|view"`
- Ran `cd .; D=out/quality/fresh22; v=out/review/round6/video/ch07-draft.mp4; ffmpeg -v error -y -ss 99 -i $v -frames:v 1 -vf crop=400:200:500:280…`
- Read `out/quality/fresh22/c07_99c.jpg`
- Ran `cd .; D=out/quality/fresh22; v=out/review/round6/video/ch07-draft.mp4; ffmpeg -v error -y -ss 144 -i $v -frames:v 1 -vf scale=640:-1 $D/c07…`
- Read `out/quality/fresh22/c07_144.jpg`
- Read `out/quality/fresh22/c07_110.jpg`
- Read `out/quality/fresh22/ch08-all.jpg`
- Ran `cd .; node out/quality/fresh22/lines.mjs 08; grep -nE '^\s+- id:|^\s+at:|^\s+title:' script/boards/ch08.yaml | paste - - -`
- Read `out/quality/fresh22/ch09-all.jpg`
- Ran `cd .; node out/quality/fresh22/lines.mjs 09; grep -nE '^\s+- id:|^\s+at:|^\s+title:' script/boards/ch09.yaml | paste - - -`
- Ran `cd .; sed -n 1,31p script/boards/ch09.yaml; sed -n 105,180p script/boards/ch09.yaml`
- Ran `cd .; D=out/quality/fresh22; v=out/review/round6/video/ch09-draft.mp4; ffmpeg -v error -y -ss 138 -i $v -vf "fps=1/1.5,scale=320:-1,tile=6x…`
- Read `out/quality/fresh22/c09_I.jpg`
- Read `out/quality/fresh22/ch10-all.jpg`
- Ran `cd .; node out/quality/fresh22/lines.mjs 10; grep -nE '^\s+- id:|^\s+at:|^\s+title:' script/boards/ch10.yaml | paste - - -`
- Ran `cd .; node out/quality/fresh22/lines.mjs 10 1 | grep -E 'p134|p133'; sed -n 72,95p script/boards/ch10.yaml`
- Read `out/quality/fresh22/ch11-all.jpg`
- Ran `cd .; ls src/gen/; node out/quality/fresh22/lines.mjs 11 2>&1 | head; grep -nE '^\s+- id:|^\s+at:|^\s+title:' script/boards/ch11.yaml | pas…`
- Ran `cd .; D=out/quality/fresh22; v=out/review/round6/video/ch11-draft.mp4; ffmpeg -v error -y -ss 116.4 -i $v -vf "fps=4,crop=640:300:200:200,s…`
- Read `out/quality/fresh22/c11_x.jpg`
- Ran `cd .; for n in 00 01 02 03 04 05 06 07 08 09 10 11; do v=out/review/round6/video/ch$n-draft.mp4; [ $n = 05 ] && v=out/review/round5/video/c…`
- Ran `cd .; cat > out/quality/fresh22/linelufs.mjs <<'EOF' import fs from 'fs'; import {execFileSync} from 'child_process'; for (const n of ['00'…`
- Ran `cd .; for n in 00 01 02 03 04 05 06 07 08 09 10 11; do v=out/review/round6/video/ch$n-draft.mp4; [ $n = 05 ] && v=out/review/round5/video/c…`
- Ran `cd .; D=out/quality/fresh22; v=out/review/round6/video/ch08-draft.mp4; ffmpeg -v error -y -ss 6 -i $v -vf "fps=1/1.5,crop=900:500:150:100,s…`
- Read `out/quality/fresh22/c08_B.jpg`
- Ran `cd .; ls -la out/quality/phone out/quality/desktop | head -50; ls site/public; ls site/public/review/round7`
- Read `out/quality/phone/home.jpg`
- Ran `cd .; python3 - <<'EOF' import re,html for f in ['site/public/index.html','site/public/about/index.html','site/public/review/index.html','s…`
- Ran `cd .; ls quality; python3 -c " import json;d=json.load(open('quality/scorecard.json'));print(json.dumps(d,indent=0)[:3000])"`
- Ran `cd .; python3 - <<'EOF' import re,html f='site/public/review/round7/annotated.html' s=open(f).read() print(len(s)) s2=re.sub(r'<script.*?</…`
- Ran `cd .; python3 -c " d=[57.833,222.065,312.5,486.082,316.5,542.917,281.5,265.48,317.914,308.667,159.162,152.25];s=sum(d);print(s,int(s//60),s…`
- Ran `cd .; for n in 00 01 02 03 05; do v=out/review/round6/video/ch$n-draft.mp4; [ $n = 05 ] && v=out/review/round5/video/ch05-draft.mp4; echo "…`
- Ran `cd .; for n in 04 06 07 08 09 10 11; do v=out/review/round6/video/ch$n-draft.mp4; h=$(shasum -a 256 $v | cut -c1-8); grep -q "ch$n-draft-$h…`
- Ran `cd .; python3 - <<'EOF' import re,html s=open('site/public/review/round7/annotated.html').read() s2=re.sub(r'<script.*?</script>|<style.*?<…`
- Ran `cd .; python3 - <<'EOF' import re,html s=open('site/public/review/round7/annotated.html').read() s2=re.sub(r'<script.*?</script>|<style.*?<…`
- Ran `cd .; D=out/quality/fresh22; v=out/review/round6/video/ch08-draft.mp4; ffmpeg -v error -y -ss 228 -i $v -vf "fps=1/2,scale=320:-1,tile=6x4"…`
- Read `out/quality/fresh22/c08_KL.jpg`
- Ran `cd .; ls out/quality/phone; python3 -c " from PIL import Image for f in ['watch','read','review_quality','about','notes_science','home','re…`
- Ran `cd .; python3 -c " from PIL import Image fs=['watch','read','review_quality','about','notes_science','review','review_round6_ch03-draft','4…`
- Read `out/quality/fresh22/phone_grid.jpg`
- Ran `cd .; ls site/public/review/round6 site/public/review/round5; for f in site/public/review/round6/*/index.html site/public/review/round5/*/i…`
- Ran `cd .; for f in site/public/review/round6/*.html site/public/review/round5/*.html; do echo "$f: $(python3 -c " import re,html,sys s=open('$f…`
- Ran `cd .; for f in site/public/review/round6/ch0[0-4]-draft.html; do python3 -c " import re,html,sys s=open('$f').read();s=re.sub(r'<script.*?<…`
- Ran `cd .; D=out/quality/fresh22; v=out/review/round6/video/ch01-draft.mp4; ffmpeg -v error -y -ss 58 -i $v -vf "fps=1,scale=427:-1,tile=4x3" -f…`
- Read `out/quality/fresh22/c01_games.jpg`
- Ran `cd .; grep -rliE 'coming soon|TODO|TBD|lorem|FIXME' site/public --include=*.html; grep -rhoiE '[^.]{0,80}(not yet|still to come|will be (re…`
- Ran `cd .; grep -rliE 'coming soon|TODO|TBD|lorem|FIXME' site/public; grep -rhoiE '[^.<>]{0,80}(not yet|still to come|will be (rendered|posted|a…`
- Ran `cd .; /usr/bin/grep -rliE 'coming soon|TODO|TBD|lorem|FIXME' site/public; /usr/bin/grep -rhoE '.{0,80}(not yet|still to come|will be render…`
- Ran `cd .; find site/public -name '*.html' | xargs /usr/bin/grep -liE 'coming soon|TODO|TBD|lorem|FIXME'; find site/public -name '*.html' | xarg…`
- Ran `cd .; python3 -c " from PIL import Image fs=['watch','home','review_quality','read'] ims=[Image.open('out/quality/desktop/'+f+'.jpg') for f…`
- Read `out/quality/fresh22/desk_grid.jpg`
- Ran `cd .; for p in "" review/round7/annotated.html review/quality/; do curl -s -A 'Mozilla/5.0' "https://curtcox.github.io/The-Last-Evolution/$…`
- Ran `cd .; node out/quality/fresh22/lines.mjs 04 1 | grep p037.3 | cut -c1-900; node out/quality/fresh22/lines.mjs 09 1 | grep p129`
- Ran `cd .; D=out/quality/fresh22; v=out/review/round6/video/ch04-draft.mp4; ffmpeg -v error -y -ss 15 -i $v -vf "fps=1,scale=320:-1,tile=6x4" -f…`
- Read `out/quality/fresh22/c04_C.jpg`
- Read `out/quality/fresh22/c09_P.jpg`
- Ran `cd .; sed -n '/id: P/,$p' script/boards/ch09.yaml; grep -n "p129\|gone" src/scenes/ch09.js | head`
- Ran `cd .; D=out/quality/fresh22; v=out/review/round6/video/ch07-draft.mp4; ffmpeg -v error -y -ss 0 -i $v -vf "fps=2,scale=320:-1,tile=6x2" -fr…`
- Read `out/quality/fresh22/c07_A.jpg`
- Ran `cd .; D=out/quality/fresh22; v=out/review/round6/video/ch07-draft.mp4; ffmpeg -v error -y -ss 3 -i $v -frames:v 1 -vf crop=640:300:320:80 $…`
- Read `out/quality/fresh22/c07_page.jpg`
- Ran `cd .; D=out/quality/fresh22; v=out/review/round6/video/ch11-draft.mp4; ffmpeg -v error -y -ss 148 -i $v -frames:v 1 $D/c11_end.jpg; ffmpeg …`
- Read `out/quality/fresh22/c11_end.jpg`
- Read `out/quality/fresh22/c01_page.jpg`
- Ran `cd .; D=out/quality/fresh22; v=out/review/round6/video/ch02-draft.mp4; ffmpeg -v error -y -ss 31 -i $v -frames:v 1 -vf scale=640:-1 $D/c02_…`
- Read `out/quality/fresh22/c02_31.jpg`
- Read `out/quality/fresh22/c02_60.jpg`
- Ran `cd .; D=out/quality/fresh22; v=out/review/round6/video/ch02-draft.mp4; ffmpeg -v error -y -ss 54 -i $v -vf "fps=1,scale=320:-1,tile=6x4" -f…`
- Read `out/quality/fresh22/c02_E.jpg`
- Ran `cd .; D=out/quality/fresh22; v=out/review/round6/video/ch04-draft.mp4; ffmpeg -v error -y -ss 39 -i $v -vf "fps=1/3.5,scale=320:-1,tile=6x4…`
- Read `out/quality/fresh22/c04_DK.jpg`
- Ran `cd .; v=out/review/round5/video/ch05-draft.mp4; ffmpeg -v error -ss 288.5 -t 3 -i $v -vn -ac 1 -ar 8000 -f s16le - | python3 -c " import sy…`
- Ran `cd .; v=out/review/round5/video/ch05-draft.mp4; ffmpeg -v error -ss 288.5 -t 3 -i $v -vn -ac 1 -ar 8000 -f s16le - | python3 -c " import sy…`
- Ran `cd .; v=out/review/round5/video/ch05-draft.mp4; ffmpeg -v error -ss 286 -t 3 -i $v -vn -ac 1 -ar 8000 -f s16le - | python3 -c " import sys,…`
- Ran `cd .; v=out/review/round5/video/ch05-draft.mp4; ffmpeg -v error -ss 262 -t 30 -i $v -vn -ac 1 -ar 8000 -f s16le - | python3 -c " import sys…`
- Ran `cd .; v=out/review/round6/video/ch11-draft.mp4; ffmpeg -v error -ss 146 -i $v -vn -ac 1 -ar 8000 -f s16le - | python3 -c " import sys,struc…`
- Ran `cd .; v=out/review/round6/video/ch11-draft.mp4; for t in 149 150.5 151.5 152.1; do ffmpeg -v error -ss $t -i $v -frames:v 1 -vf scale=64:36…`
- Ran `cd .; D=out/quality/fresh22; v=out/review/round6/video/ch08-draft.mp4; ffmpeg -v error -y -ss 72 -i $v -vf "fps=1/3.3,scale=320:-1,tile=6x4…`
- Read `out/quality/fresh22/c08_EG.jpg`
- Ran `cd .; D=out/quality/fresh22; v=out/review/round6/video/ch03-draft.mp4; ffmpeg -v error -y -ss 283 -i $v -vf "fps=1,scale=320:-1,tile=6x4" -…`
- Read `out/quality/fresh22/c03_O.jpg`

#### The helper · 10:43

That background search has finished, and it doesn't change the report. It ran over the audio and image files as well as the pages, so its matches were binary noise. I had already re-run the search on the HTML pages alone: no page contains "coming soon", "TODO" or similar placeholder text, and the "not yet" hits are the story's own words or the status-page key. The report I sent stands.
