# Helper: Fresh-eyes review round 27

Started in [2026-11-16](../parts/2026-11-16.md). [All parts](../README.md)

A helper is another copy of Claude, started with its own instructions for one job. It sees only what it's given.

#### Claude, to the helper · 06:06

Read the file out/quality/fresh27/prompt.txt and follow its instructions exactly. It describes a read-only fresh-eyes quality review of a film and its website; your final message is the report it asks for.

#### The helper did · 06:06

- Read `out/quality/fresh27/prompt.txt`
- Ran `ls out/review/round6/video/ out/review/round5/video/ && wc -l quality/rubric.yaml QUALITY.md PLAN.md script/script.yaml notes/annotations.y…`
- Ran `cat quality/rubric.yaml QUALITY.md`
- Ran `grep -n '^#' PLAN.md | head -60`
- Ran `sed -n 161,246p PLAN.md`
- Ran `mkdir -p out/quality/fresh27 && for f in out/review/round6/video/ch0{0,1,2,3,4}-draft.mp4 out/review/round5/video/ch05-draft.mp4 out/review…`
- Ran `cd out/quality/fresh27 && for n in 00 01 02 03 04 05 06 07 08 09 10 11; do v=../../review/round6/video/ch$n-draft.mp4; [ $n = 05 ] && v=../…`
- Ran `cat > out/quality/fresh27/dump.mjs <<'EOF' import fs from 'fs'; const n = process.argv[2]; const src = fs.readFileSync('src/gen/ch${n}.js',…`
- Ran `sed -i '' 's/l.speaker||l.voice||l.role||/l.who||/; s/const fmt = t => '${Math.floor(t\/60)}:${(t%60).toFixed(1).padStart(4,.0.)}';/const f…`

#### The helper · 06:07

Now let me look at the whole-chapter sheets.

#### The helper did · 06:07

- Read `out/quality/fresh27/whole00.jpg`
- Read `out/quality/fresh27/whole01.jpg`
- Read `out/quality/fresh27/whole02.jpg`
- Ran `cat out/quality/fresh27/lines02.txt`
- Ran `cd out/quality/fresh27 && V=../../review/round6/video/ch02-draft.mp4; ffmpeg -v error -y -ss 175 -i $V -vf "fps=1/1.5,scale=320:-1,tile=6x4…`
- Read `out/quality/fresh27/c02a.jpg`
- Ran `node -e " const fs=require('fs');const n=process.argv[1];const s=fs.readFileSync('src/gen/ch'+n+'.js','utf8');const C=JSON.parse(s.match(/c…`
- Ran `cd out/quality/fresh27 && V=../../review/round6/video/ch02-draft.mp4; ffmpeg -v error -y -ss 198 -i $V -vf "fps=1,crop=800:400:480:120,scal…`
- Read `out/quality/fresh27/c02c.jpg`
- Read `out/quality/fresh27/c02b.jpg`
- Read `out/quality/fresh27/whole03.jpg`
- Ran `cat out/quality/fresh27/lines03.txt | cut -c1-400`
- Ran `cd out/quality/fresh27 && ./words.sh 03 trees killed greenish revived annihilated remained machines swept colonies > /dev/null; ./words.sh …`
- Read `out/quality/fresh27/c03a.jpg`
- Ran `cd out/quality/fresh27 && V=../../review/round6/video/ch03-draft.mp4; ffmpeg -v error -y -ss 366 -i $V -vf "fps=1/5,scale=320:-1,tile=6x4" …`
- Read `out/quality/fresh27/c03b.jpg`
- Read `out/quality/fresh27/whole04.jpg`
- Ran `cut -c1-300 out/quality/fresh27/lines04.txt`
- Read `out/quality/fresh27/whole05.jpg`
- Ran `cut -c1-250 out/quality/fresh27/lines05.txt`
- Ran `grep -E "p0(59|60|61|63|64|65)\.1" out/quality/fresh27/lines05.txt`
- Ran `cd out/quality/fresh27 && ./words.sh 05 enormous crackling cracked dull fell snap still; V=../../review/round5/video/ch05-draft.mp4; ffmpeg…`
- Read `out/quality/fresh27/c05a.jpg`
- Read `out/quality/fresh27/whole06.jpg`
- Ran `cut -c1-600 out/quality/fresh27/lines06.txt`
- Ran `cd out/quality/fresh27 && ./words.sh 06 violet blue orange red annihilating flaming dull blackness blank horny vanishing; V=../../review/ro…`
- Read `out/quality/fresh27/c06a.jpg`
- Ran `cd out/quality/fresh27 && V=../../review/round6/video/ch06-draft.mp4; ffmpeg -v error -y -ss 72.0 -i $V -vf "fps=4,crop=640:360:320:180,sca…`
- Read `out/quality/fresh27/c06b.jpg`
- Ran `cd out/quality/fresh27 && ./words.sh 06 darted nearer disappear watchers half; V=../../review/round6/video/ch06-draft.mp4; ffmpeg -v error …`
- Read `out/quality/fresh27/c06c.jpg`
- Read `out/quality/fresh27/whole07.jpg`
- Ran `cut -c1-500 out/quality/fresh27/lines07.txt`
- Read `out/quality/fresh27/whole08.jpg`
- Ran `cut -c1-400 out/quality/fresh27/lines08.txt`
- Ran `cd out/quality/fresh27 && V=../../review/round6/video/ch08-draft.mp4; ffmpeg -v error -y -ss 40 -i $V -vf "fps=1/1.5,scale=320:-1,tile=6x4"…`
- Read `out/quality/fresh27/c08a.jpg`
- Ran `sed -n 55,75p script/boards/ch08.yaml; cd out/quality/fresh27 && ffmpeg -v error -y -ss 60 -i ../../review/round6/video/ch08-draft.mp4 -fra…`
- Read `out/quality/fresh27/c08b.jpg`
- Read `out/quality/fresh27/whole09.jpg`
- Ran `cut -c1-500 out/quality/fresh27/lines09.txt`
- Ran `cd out/quality/fresh27 && ./words.sh 09 stabbing dull leaped orange green vanished shrinking; V=../../review/round6/video/ch09-draft.mp4; f…`
- Read `out/quality/fresh27/c09a.jpg`
- Ran `cd out/quality/fresh27 && V=../../review/round6/video/ch09-draft.mp4; ffmpeg -v error -y -ss 139 -i $V -vf "fps=4,scale=320:-1,tile=6x2" -f…`
- Read `out/quality/fresh27/c09b.jpg`
- Ran `cd out/quality/fresh27 && ./words.sh 09 flashed beam there; grep -n "p121.4" ../../../script/boards/ch09.yaml`
- Read `out/quality/fresh27/whole10.jpg`
- Ran `cut -c1-600 out/quality/fresh27/lines10.txt; cut -c1-600 out/quality/fresh27/lines11.txt`
- Read `out/quality/fresh27/whole11.jpg`
- Ran `grep p136 out/quality/fresh27/lines11.txt | cut -c600-; cd out/quality/fresh27; ffmpeg -v error -y -ss 36 -i ../../review/round6/video/ch11…`
- Read `out/quality/fresh27/c11a.jpg`
- Ran `cd out/quality/fresh27 && for n in 00 01 02 03 04 05 06 07 08 09 10 11; do v=../../review/round6/video/ch$n-draft.mp4; [ $n = 05 ] && v=../…`
- Ran `cd out/quality/fresh27 && cat > jumps.py <<'EOF' import re,sys,glob for f in sorted(glob.glob('eb*.txt')): pts=[] for line in open(f): m=re…`
- Ran `sed -n 146,160p PLAN.md; cd out/quality/fresh27; python3 - <<'EOF' import re for n in ['00','01','02','03','04','05','06','07','08','09','1…`
- Ran `cd out/quality/fresh27 && python3 - <<'EOF' import re def series(n,a,b): out=[] for line in open(f'eb{n}.txt'): m=re.search(r't:\s*([\d.]+)…`
- Ran `ls script/ && grep -n -A3 "ch02\|^ 2:" script/sfx.yaml | head -40`
- Ran `cd out/quality/fresh27 && V=../../review/round6/video/ch04-draft.mp4; ffmpeg -v error -y -ss 86 -i $V -vf "fps=1/1.5,scale=320:-1,tile=6x4"…`
- Read `out/quality/fresh27/c04a.jpg`
- Ran `cd site/public && find . -name "*.html" | grep -v "/video/" | head -60; ls ../review/round7/`
- Ran `cd site/public && python3 - <<'EOF' import re,html for f in ['index.html','watch/index.html','read/index.html','about/index.html','notes/in…`
- Ran `cd site/public && cat watch/index.html | head -20; python3 - <<'EOF' import re,html s=open('review/round7/annotated.html').read() print(len…`
- Ran `cd site/public && python3 - <<'EOF' import re,html s=open('review/round7/annotated.html').read() s2=re.sub(r'<script.*?</script>|<style.*?<…`
- Ran `cd out/quality/fresh27 && ./words.sh 08 deadly leaping intuition; V=../../review/round6/video/ch08-draft.mp4; ffmpeg -v error -y -ss 236 -i…`
- Read `out/quality/fresh27/c08c.jpg`
- Ran `cd out/quality && ls -la phone/ | head -50; python3 -c " from PIL import Image;import glob for f in sorted(glob.glob('phone/*.jpg'))[:40]: …`
- Ran `cd out/quality && ffmpeg -v error -y -i phone/home.jpg -i phone/review_round7_annotated.jpg -i phone/read.jpg -i phone/about.jpg -i phone/n…`
- Read `out/quality/fresh27/phone1.jpg`
- Read `out/quality/fresh27/phone2.jpg`
- Ran `grep -n -i "footnote" script/script.yaml | head; grep -rn -i "footnote" script/boards/*.yaml | head`
- Ran `sed -n 720,742p script/script.yaml; grep -n "p013\|p130\|kilad\|Kilad" script/script.yaml | head`
- Ran `cd out/quality/fresh27 && ./words.sh 02 units thousand; V=../../review/round6/video/ch02-draft.mp4; ffmpeg -v error -y -ss 50 -i $V -vf "fp…`
- Read `out/quality/fresh27/c02d.jpg`
- Ran `head -40 notes/annotations.yaml; grep -c "^ - " notes/annotations.yaml`
- Ran `node -e " const Y=require('yaml');const fs=require('fs');const d=Y.parse(fs.readFileSync('notes/annotations.yaml','utf8')); for(const n of …`
- Ran `grep -n -i "curl" script/boards/ch03.yaml script/boards/ch05.yaml script/boards/ch07.yaml script/boards/ch08.yaml src/scenes/ch03.js | head…`
- Ran `cd out/quality/fresh27 && ./words.sh 01 ear-apparatus eye brain twenty-five independence mock decrease; V=../../review/round6/video/ch01-dr…`
- Read `out/quality/fresh27/c01a.jpg`
- Ran `cd out/quality/fresh27 && ./words.sh 01 later the; V=../../review/round6/video/ch01-draft.mp4; ffmpeg -v error -y -ss 20.5 -i $V -vf "fps=4…`
- Read `out/quality/fresh27/c01b.jpg`
- Ran `cd out/quality/fresh27 && V=../../review/round5/video/ch05-draft.mp4; ffmpeg -v error -y -ss 430 -i $V -vf "fps=1/1.5,scale=320:-1,tile=6x4…`
- Read `out/quality/fresh27/c05b.jpg`
- Ran `cd out/quality/fresh27 && ./words.sh 05 appeared c golden; V=../../review/round5/video/ch05-draft.mp4; ffmpeg -v error -y -ss 466 -i $V -vf…`
- Read `out/quality/fresh27/c05c.jpg`
- Read `out/quality/fresh27/c05d.jpg`
- Ran `cd out/quality/fresh27 && ./words.sh 03 roal trest; V=../../review/round6/video/ch03-draft.mp4; ffmpeg -v error -y -ss 18 -i $V -vf "fps=1/…`
- Read `out/quality/fresh27/c03c.jpg`
- Ran `cd out/quality/fresh27 && V=../../review/round6/video/ch03-draft.mp4; ffmpeg -v error -y -ss 46 -i $V -frames:v 1 -vf crop=640:400:100:300 …`
- Read `out/quality/fresh27/c03d.jpg`
- Ran `cd site/public && grep -o 'src="[^"]*\.mp4[^"]*"\|"[^"]*\.mp4"' review/round7/annotated.html | sort -u | head -20; grep -o '[a-zA-Z0-9_/.-]…`
- Ran `for n in 00 02 05 06; do v=out/review/round6/video/ch$n-draft.mp4; [ $n = 05 ] && v=out/review/round5/video/ch05-draft.mp4; echo ch$n $(sha…`
- Ran `cd out/quality/fresh27 && for p in "" "review/round7/annotated.html" "read/" "about/" "review/quality/"; do curl -s -A "Mozilla/5.0" -o liv…`
- Ran `cd site/public && python3 - <<'EOF' import re,html for f in ['review/quality/index.html']: s=open(f).read() s=re.sub(r'<script.*?</script>|…`
- Ran `cd site/public && for f in index.html read/index.html about/index.html notes/*/index.html review/round7/annotated.html; do grep -o '<img[^>…`
- Ran `cd site/public && grep -n -i "vtt\|track\|caption\|subtitle\|textTracks" review/round7/annotated.html | cut -c1-300 | head -20`
- Ran `cd site/public && sed -n 150,166p review/round7/annotated.html | cut -c1-900; grep -o '"kill-ads\|kilads[^"]\{0,20\}\|Dye-mos\|Deimos' revi…`
- Ran `cd site/public && grep -o '"who":"[a-z0-9]*"' review/round7/annotated.html | sort | uniq -c; grep -o '\["F[- ][a-z0-9]*[^]]*\]' review/roun…`
- Ran `grep -rn "who" tools/annotated*.mjs 2>/dev/null | head -20; ls tools | head -50`
- Ran `head -30 script/cast.yaml; grep -o '"who":"[^"]*"' site/public/review/round7/annotated.html | sort | uniq -c`
- Ran `cd out/quality/fresh27 && V=../../review/round6/video/ch02-draft.mp4; ffmpeg -v error -y -ss 236 -i $V -frames:v 1 -vf scale=640:-1 c02f.jp…`
- Read `out/quality/fresh27/c02g.jpg`
- Ran `cd out/quality/fresh27 && V=../../review/round6/video/ch02-draft.mp4; ffmpeg -v error -y -ss 222.5 -i $V -frames:v 1 -vf scale=640:-1 c02h.…`
- Read `out/quality/fresh27/c02hi.jpg`
- Ran `cd out/quality/fresh27 && V=../../review/round6/video/ch06-draft.mp4; ffmpeg -v error -y -ss 94 -i $V -vf "fps=1/2,scale=320:-1,tile=6x4" -…`
- Read `out/quality/fresh27/c06d.jpg`
- Read `out/quality/desktop/review_round7_annotated.jpg`
- Ran `node -e " const Y=require('yaml');const fs=require('fs');const d=Y.parse(fs.readFileSync('notes/annotations.yaml','utf8')); for(const n of …`
- Ran `cd out/quality/fresh27 && grep p050 lines04.txt | cut -c1-900; V=../../review/round6/video/ch04-draft.mp4; ffmpeg -v error -y -ss 280 -i $V…`
- Read `out/quality/fresh27/c04b.jpg`
- Ran `cd out/quality/fresh27 && for n in 06 07; do ffmpeg -v error -y -ss 3 -i ../../review/round6/video/ch$n-draft.mp4 -frames:v 1 -vf scale=640…`
- Read `out/quality/fresh27/t67.jpg`
- Ran `cd out/quality/fresh27 && for n in 01 02 03 04 05 08 09; do v=../../review/round6/video/ch$n-draft.mp4; [ $n = 05 ] && v=../../review/round…`
- Read `out/quality/fresh27/heads.jpg`
- Ran `cd out/quality/fresh27 && ffmpeg -v error -y -ss 373 -i ../../review/round6/video/ch03-draft.mp4 -frames:v 1 -vf scale=640:-1 c03e.jpg; gre…`
- Read `out/quality/fresh27/c03e.jpg`
- Ran `cd out/quality/fresh27 && ffmpeg -v error -y -ss 407 -i ../../review/round6/video/ch03-draft.mp4 -vf "fps=2,crop=480:360:400:300,scale=240:…`
- Read `out/quality/fresh27/c03f.jpg`
- Ran `cd out/quality/fresh27 && ffmpeg -v error -y -ss 407.5 -i ../../review/round6/video/ch03-draft.mp4 -vf "fps=1,scale=320:-1,tile=4x2" -frame…`
- Read `out/quality/fresh27/c03g.jpg`
- Ran `cd out/quality/fresh27 && ffmpeg -v error -y -ss 409.6 -i ../../review/round6/video/ch03-draft.mp4 -vf "fps=4,crop=200:200:380:240,tile=6x2…`
- Read `out/quality/fresh27/c03h.jpg`
- Ran `node -e " const fs=require('fs');for(const n of ['04','05','08']){const s=fs.readFileSync('src/gen/ch'+n+'.js','utf8');const C=JSON.parse(s…`
- Ran `cd out/quality/fresh27 && sort -k4 -n seglufs.txt | head -4; sort -k4 -n seglufs.txt | tail -4`
- Ran `cd site/public && python3 - <<'EOF' import re,os,glob bad=[] for f in glob.glob('**/*.html',recursive=True): s=open(f).read() for m in re.f…`
- Ran `cd site/public && python3 - <<'EOF' import re,os,glob ids={} for f in glob.glob('**/*.html',recursive=True): s=open(f).read(); ids[os.path.…`
- Ran `cd site/public && python3 - <<'EOF' import re,os,glob ids={} for f in glob.glob('**/*.html',recursive=True): s=open(f).read(); ids[os.path.…`
- Ran `cd out/quality/fresh27 && ./words.sh 10 inside restored twisted acute blue-white locked mad helpless flagship; ffmpeg -v error -y -ss 72 -i…`
- Read `out/quality/fresh27/c10a.jpg`
- Ran `cd site/public && for f in index.html read/index.html about/index.html notes/index.html notes/*/index.html review/index.html review/round7/…`
- Ran `cd site/public && for f in review/round6/ch0*-draft.html review/round6/ch1*-draft.html review/round5/ch05-draft.html review/round6/film.htm…`
- Ran `for h in ch02-draft-3b821630 ch05-draft-145bc427 ch06-draft-57e894ab; do curl -s -o /dev/null -I -L -A "Mozilla/5.0" -w "%{http_code} %{siz…`
- Ran `cd out/quality/fresh27 && ffmpeg -v error -y -ss 44 -i ../../review/round5/video/ch05-draft.mp4 -vf "fps=1,scale=320:-1,tile=6x2" -frames:v…`
- Read `out/quality/fresh27/c05e.jpg`
- Ran `cd out/quality/fresh27 && ./words.sh 03 colorado sahara gobi enormous; ffmpeg -v error -y -ss 188 -i ../../review/round6/video/ch03-draft.m…`
- Read `out/quality/fresh27/c03i.jpg`
- Ran `cd out/quality/fresh27 && ./words.sh 07 struck quivered bellied violet spread driven; ffmpeg -v error -y -ss 184 -i ../../review/round6/vid…`
- Read `out/quality/fresh27/c07a.jpg`
- Ran `cd out/quality/fresh27 && ffmpeg -v error -y -ss 218 -i ../../review/round6/video/ch07-draft.mp4 -vf "fps=1,scale=320:-1,tile=6x2" -frames:…`
- Read `out/quality/fresh27/c07b.jpg`
- Read `out/quality/desktop/home.jpg`
- Ran `cd out/quality/fresh27 && ffmpeg -v error -y -ss 140.5 -i ../../review/round6/video/ch09-draft.mp4 -vf "fps=2,crop=800:400:0:0,scale=400:-1…`
- Read `out/quality/fresh27/c09c.jpg`
