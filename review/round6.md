# Round 6: the whole film, in draft

Curt watched chapter 5's draft and named two possible issues: "it's very monochrome" and "it's flickery". They said
"Those might be the right calls. I want to see the whole thing before I decide." (Round 5, §5.) So this round is the
whole film at draft level: the other eleven chapters made the way the pilot was, joined with it in order.

**To watch:** [the whole film](https://curtcox.github.io/The-Last-Evolution/review/round6/film.html) on the site, or
locally after `npm start` (http://localhost:8077/review/round6/film.html).
- **What it is:** every chapter's draft played back to back, about an hour in all. There's a scrub bar for the whole
  film with a mark at each chapter. Under the video, the line being said lights up word by word, along with the
  chapter and shot.
- **Notes:** pause anywhere, type, and press Enter. *Copy notes* gives them back as timed text, with the chapter and
  shot.
- **Each chapter** also has its own page, linked from the film's chapter list. It shows that chapter's shots, with
  each shot's board taken from the draft and what's seen there and how the camera moves.
- **The written storyboards** are in [`script/boards/`](../script/boards/). There's one per chapter, in chapter 5's
  format, and every time in them is cued to the voice.

---

## 1. The look, judged whole

**1.1 Monochrome.** Is the ink-wash world with colour only for energy right across the film, or too grey?
How the colour runs through the film, as built:

| ch | the colour in it |
|---|---|
| 0 | the beings of force in every colour; the memories of 2538 in grey |
| 1 | grey; only the machines' pale force and the mock battles' flashes |
| 2 | the fusing ray's heat, the stored energy's white, the projector's blue |
| 3 | the battle's white beams, heat and violet screens; then the green spreads across the land and the screens |
| 4 | the induction beam's heat on X-5638's violet screen; F-1's lens waking |
| 5 | the pilot: force shafts, the birth's lightning, C-R-U-1's gold, the first green beam |
| 6 | the most colour so far: the giants' screens run violet, blue, orange, red and die to black; the green turned on them |
| 7 | the green pressing on the black dome; the violet beam holding it up |
| 8 | the dome's violet; the livid beam |
| 9 | the white globe and the red beam that kills it (red, orange, green); the golden sphere and a red dawn |
| 10 | every weapon at once, swallowed by the gold |
| 11 | the beings of force, full colour, to the end; then the page |

*Recommend:* keep the rule. If it's still too grey, tint the wash itself by place, as the cheapest change (sepia for
2538, colder for space and the Outsiders), and leave colour for energy alone.
**Curt:**

**1.2 Flicker.** Is the boil right?
- **Why it flickers:** every stroke is redrawn 12 times a second. That includes the backgrounds' wash and the
  halftone, not just the figures' lines.
- **Recommended fix:** hold the backgrounds and the halftone steady, and boil only the figures and the energy.
- **Alternatives:** boil on twos (6 a second), or both.

*Recommend:* the fix above. It keeps the hand-drawn life where the eye is, and loses the shimmer behind it.
**Curt:**

## 2. The chapters

**2.1 What's ours, not the text's.** As in the pilot, where the text is silent I've staged things:
- **The frame.** F-2 old among the beings of force (chapters 0 and 11), and the mentatype as thin metal sheets (from
  p138's "certain records on thin sheets of metal").
- **Chapter 1.** The history as a science plate, the city of 2538, and the two imaginations as the curl and the ruled
  line. Those are the pilot's motif, introduced here.
- **Chapter 2.** The control in Chicago is shown as the transport's thought-line breaking.
- **Chapter 3.** The battle and the settlement are reached through the hall's screens. The planets' insert is for
  "Pluto as on Mercury".
- **Chapter 6.** A look inside a giant ship, at the men feeding the generator (p076).
- **Chapter 8.** Roal's last-evolution speech as a ladder: life, man, machine, pure force.
- **Chapter 10.** The flagship, once locked, is the only drawing in the film that doesn't boil.
- **Chapter 11.** The record carried back down a tunnel of light, and THE END over the theme.

*Recommend:* note any of these on the film page where they don't serve the text.
**Curt:**

**2.2 What's next, after this round.** Settle the look (1.1, 1.2). Then:
1. the acting pass and the painting brought up to the model sheets, chapter 5 first, as Round 5 4.3 planned;
2. then the other chapters, in the batches PLAN.md §9 sets;
3. then the final render at 24 frames a second.

*Recommend:* that order.
**Curt:**

**2.3 Models that watch and listen.** These would let me put quick questions to the rendered sound and picture,
covering sense, look, sync, board and continuity. The options, and what I need from you, are in a sheet of their own:
[models.md](models.md).
- **Built and tried on the whole film:** measurements, Whisper, Jev and Gemini
  ([§5 there](models.md#5-the-trial-2026-11-02)). The whole pass costs about 50 cents.
- **What they found:**
  - the mix is clear and in sync throughout;
  - a few close shots aren't close, and a few figures are too small to read;
  - a first-time viewer can't tell Roal from Trest, and a few inserts come with nothing to set them up.

**Curt:** keys added, and billing on, 2026-11-02.

## Claude's open concerns

- **These eleven chapters were made in one pass.** The pilot had a storyboard round and a draft round; these went
  straight from the storyboard to the draft. Their staging is simpler than chapter 5's, and some framings are
  plainer.
- **People are small and stiff.** They're the pilot's profile figures, walking and gesturing but not yet acting.
  The council (chapter 4) and the dome (chapters 7 and 8) need the acting pass most.
- **Some spaces are reused.** The hall serves chapters 3, 4, 6 and 7, and the bare rock serves 5, 6, 8 and 9. That's
  the story's own geography, but they want more variety in light and framing.
- **The repo grows.** The chapters' draft videos run from 2 to 43 MB. This round adds about 175 MB of them, and the
  whole film's videos come to about 230 MB.
- **A thin moment in chapter 10.** The volley where every ship fires on the golden sphere reads thinner than the text's
  "every ray and force they know". It's one to strengthen in the next pass.
