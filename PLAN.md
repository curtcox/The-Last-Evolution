# The Last Evolution: plan for a voiced, painted film and its companion site

John W. Campbell, Jr.'s *The Last Evolution* (*Amazing Stories*, August 1932) is a machine's memoir. F-2, the first
machine to use the Ultimate Energy, records how mankind died and how its machines went on to make beings of pure force.
We adapt it as two things that point at each other:

- **the film**: every word of the story, voiced by a full cast, painted in a 1930s pulp style, about 52 minutes long, in
  chapters; on YouTube and on the site;
- **the companion site**: the film beside the full text, synced and click-to-seek, with notes on the 1932 science, the
  AI-succession ideas the story anticipates, and Campbell and the pulps. Every QR code in the film opens a page here.

Source: [Project Gutenberg eBook #27462](https://www.gutenberg.org/files/27462/27462-h/27462-h.htm), transcribed from
the March 1961 reprint. Gutenberg found no record that the US copyright was renewed, so the text is public domain in the
US.

Prior projects this borrows from, without being bound by them:
[axol-f](https://github.com/curtcox/axol-f) (near-verbatim voiced film, review server, QR system, site builder),
[PDoomVideo](https://github.com/curtcox/PDoomVideo) (p5.brush painting, QR footnotes, synced reference site), and
[ManimOnline's video series](https://github.com/curtcox/ManimOnline/tree/main/video-series) (episode scripts, narration
conventions, QR links that open what's on screen).

---

## 1. Decisions so far

| topic | decision | settled |
|---|---|---|
| form | **verbatim film plus site.** Every word of the story is voiced, in order. No commentary in the voice track: commentary lives on the site and behind the QR codes | Curt, 2026-11-01 |
| voices | **full cast.** F-2 narrates, and each speaking character gets their own ElevenLabs voice (§4) | Curt, 2026-11-01 |
| look | **painted 1930s pulp.** p5.brush watercolour (Claude Animation Base), in the manner of a pulp magazine's interior illustrations: original designs throughout, with Leo Morey's illustration as a touchstone only (§5) | Curt, 2026-11-01 |
| site | all four areas: the synced full text, 1932 science, AI-succession echoes, Campbell and pulp history (§7) | Curt, 2026-11-01 |
| Clawd | not in the film. The cast is the story's own | follows from "look" |
| hosting | the site on GitHub Pages at `curtcox.github.io/The-Last-Evolution/`; the film on Curt's YouTube channel | default, revisit in Round 1 |
| toolchain | port axol-f's tools (MIT) and the Claude Animation Base kit (MIT, John Heibel), dropping what's specific to that conversation | default |

Working title: **The Last Evolution**, with the line *"A story from 1932, read in full"* under it.

---

## 2. How we iterate (the core of this plan)

Nothing here is finished until **both of us are satisfied**. Every phase in §9 ends at a review gate, and every gate
runs the same loop:

```
Claude makes it ──▶ Curt reviews ──▶ Claude revises ──▶ Curt reviews again ──▶ … ──▶ both sign off
                        ▲                                      │
                        └──────── notes still open ◀───────────┘
```

1. **Claude delivers** a reviewable thing: a report, a sampler page, a style sheet, a draft chapter. It comes with a
   short list of what changed since last time and **Claude's own open concerns**. Claude names what it isn't happy
   with yet; it doesn't wait to be asked.
2. **Curt reviews** wherever suits the thing: in chat, on the review server's watch pages (notes pinned to a moment, a
   circled spot in the frame, answers to Claude's questions), or by editing a file directly.
3. **Claude revises**, replies to each note, and resolves only what Curt agrees is resolved.
4. **The gate closes** only when all three of these hold:
   - Curt says the gate is approved;
   - Claude has no open concerns left, or Curt has heard each one and decided to accept it;
   - the automated checks for that phase pass (§8).

   Either of us can reopen a closed gate when a later phase shows the problem was upstream. A voice that sounds wrong
   once there are pictures under it is an example.
5. **Every decision is logged** in `DECISIONS.md` with its date and who made it (as axol-f's plan table does), so
   nothing is re-argued by accident.

There's no limit on the number of rounds. Early gates (script, look, voices) are expected to take several rounds.
Later chapters should take fewer, because the pilot sets the pattern.

### Claude's side of "satisfied"
Claude signs off on a gate only when:
- the checks pass;
- it has watched the draft through (contact sheets, frame strips and the audio) at least once since the last change;
- and it can say, specifically, why each beat works.

"It renders" isn't the bar. Claude says plainly when it thinks something is weak, even after Curt has approved it.

---

## 3. Fidelity: what "verbatim" allows

`text/source/pg27462.txt` is the Gutenberg file, unmodified, licence included, with its SHA-256 recorded. The story is
its body, from *"I am the last of my type"* to *"you will change your belief."* (6,677 words in 140 paragraphs;
`npm run story` extracts them into `text/story.json`).
`tools/verbatim_check.mjs` proves the script matches it, and any change outside these rules fails the check:

1. **Every word of the story is spoken, in order.** That includes the speech tags ("said Roal"), the narrator's
   asides, and the period wording ("Year of the Son of Man", "kilads"). Spelling follows the Gutenberg text.
2. **Who speaks what.** Text inside quotation marks goes to the character speaking; everything else is the narrator's
   (F-2). `script/speakers.yaml` records each attribution, and the check reports every one for review. The ambiguous
   ones are listed for Curt in Round 1: the unattributed council lines, the waves of thought, and F-2's vow, which is
   tagged only at its end.
3. **Speech-only respellings** live in `script/pronounce.yaml` and never change the text. They cover the designations
   (Roal, 25374; Kahsh-256799; X-5638; C-R-21; C-R-U-1; MX-3401), the years, Deimos, Sirius, kilads, and so on. How
   to say a designation ("X fifty-six thirty-eight" or "X five-six-three-eight") is a Round 1 decision. Each one is
   lettered on screen in the period's typeface the first time it's spoken.
4. **Editorial matter isn't voiced, but it is shown.** That covers:
   - the masthead line ("A Classic Reprint from AMAZING STORIES, August, 1932") and the byline, which become a painted
     title page;
   - footnotes [1] (kilad) and [2] (unit), which appear as painted footnotes when their superscripts are spoken
     *(default; Round 1 can choose to have the narrator voice them as asides instead)*;
   - "[Illustration: Illustrated by MOREY]", which becomes the moment the Morey illustration (or our homage to it)
     appears;
   - the scene-break asterisks, which become chapter breaks or brush-wipe transitions.
5. **Nothing is cut, added or modernised.** Roal's "man has always been a parasite" speech stays whole. So does the
   frame's closing challenge: "think—and maybe, you will change your belief."

---

## 4. Voices and sound

### Cast
Every voice is a stock or designed ElevenLabs voice. No real person's voice is cloned. Curt's own clone, "Curt Cox 2", is
available for a cameo if he wants one, but isn't cast by default.

| role | lines | direction |
|---|---|---|
| **F-2, narrating** | the whole narration | precise, unhurried, very old. A machine that has outlived its own kind by 125,000 years, faintly worn ("oxidation attacked me"), with a dry wit ("I still believe the reception was a warm one") |
| **F-2, in the scenes** | his dialogue | the same voice, young and clean. One voice across the two layers is the point: the narrator *is* the character |
| **Roal, 25374** | ~15 speeches | 150 years old, soft ("Roal's soft voice dropped to nothing"), dreaming, a quiet chuckle. The story's heart |
| **Trest, 35429** | ~6 lines | quiet and plain, the realist beside Roal |
| **Kahsh-256799** (Man-ruler) | 1 line | human, official |
| **C-R-21** (chief of machine rulers) | 1 speech | "the vibrationally correct, emotionless tones of all the race of machines": the reference point for the machine voices |
| **X-5638, X-6349, X-6221** (science machines) | short lines | one family of machine voices, told apart by timbre and pace |
| **F-1** | 2 speeches | newer and stranger than the others, newly conscious |
| **C-R-U-1** (coordinator) | 1 line | a ruler, crisp |
| **the first force-sphere** | "You, of matter, are inefficient…" | cold, contemptuous, unstable (it's destroyed seconds later) |
| **the golden sphere** | 3 speeches | deep, vast, "of infinite power, held gently in check", heard as thought rather than sound |

**Thought-speech.** The story's beings speak in "waves of thought" as often as with voices. Thought-speech gets a light
shimmer in the mix and a visual signature (rings of light, §5), which matters most for the force-beings.

### Sound design
The rule is axol-f's: voice first, with no continuous music bed under the words.
- **A period motif.** A short theremin-led cue (the theremin dates from the 1920s and became the sound of later
  science fiction) at each chapter's head and under the title and credits. It's generated, never borrowed.
- **Effects that earn their place.** These come from the story's own sounds:
  - the "weird symphony" of F-1's workshop: whining transmuted air, welding sputter, the hum of generators;
  - the "dull, drumming beat" that becomes a hum as the power plant comes up;
  - the storm the power plant raises;
  - the dull snap as F-1 falls;
  - a beam-hum, one per beam colour.
- Cues and levels go in `script/sfx.yaml` and are checked against the voice by loudness, as axol-f's are. The final mix
  is −14 LUFS with true peaks under −1 dBFS.

---

## 5. The look: "ink-wash world, coloured energy"

Pulp interior illustrations were black-and-white ink washes on cheap paper, and the covers were the only colour. That
gives the film its one visual rule:

- **The world is painted in ink wash on aged pulp paper**, in warm greys and sepia with visible paper grain and a slight
  halftone. That covers the people, the machines, the laboratories, the ships and space itself.
- **Only energy has colour, and it's the colour the text names:**

  | energy | colour in the text |
  |---|---|
  | the Outsiders' death beams | "faintly greenish", "pale green" |
  | the Outsiders' projector | "a bluish beam" |
  | the support beam under the dome | "a strange violet beam" |
  | screens under fire | "flamed gradually violet, then blue, orange—red" |
  | F-1's birth of F-2 | "crackling streamers of blue lightning" |
  | the power plant's beam | "livid flame" |
  | the first force-sphere | white, then a blue-white beam; dying "orange and finally green" |
  | the golden sphere | "golden light, a faint halo about it of deep violet", "a tiny ruby flame" |

- **The colour arc follows the story.** Grey for 2538, then green death spreading across the grey, then the battle's
  violet-to-red screens. The dome goes absolute black. The golden sphere is the first warm colour that isn't a weapon.
  The frame, 125,000 years on in a system full of beings of force, is the only full-colour scene.
- **Original designs, all built from the text:**
  - the Outsiders: short, squat, horny brown exoskeleton, three eyes "set at equal distances apart", in flexible
    transparent suits;
  - investigator spheres, three inches across;
  - F-1, a "shining cylinder" with rubber-covered tentacles;
  - F-2, a small bluish torpedo with three thin tentacles;
  - C-R-U-1, with its name in "dully glowing golden light";
  - the Outsider ships, "torpedoes of the void";
  - the Denver laboratory;
  - the 500-foot power plant with its "bluntly rounded dome".

  The people of 2538 are drawn as the pulps drew the future (tunics, high collars), not as caricatures.
- **Morey.** *(Found in Phase 0.)* Leo Morey's full-page illustration is on page 415 of the August 1932 issue. It shows
  F-1's tentacles holding the newborn F-2 in its aura while a man shields his face: the climax of chapter 5, the pilot.
  It's in the public domain in the US (`assets/ref/README.md` gives the reasoning). It's already on the site's Read
  page. In the film, it appears once, at that moment in chapter 5. Our own painting of the scene builds up to it, then
  dissolves into the page itself.
- **Text on screen** is the magazine's: chapter titles as pulp page headers with a drop cap, designations lettered in
  the period's typeface, footnotes as footnotes. Captions are a Round 1 decision (§10).
- **QR codes** dress as pulp-page furniture: a footnote tag, a "classified ad" box, a stamp in the page corner. They
  follow axol-f's scannability rules (quiet zone, contrast, minimum size and hold time, decoded from rendered frames).
  They're placed at natural pauses, kept off climactic beats, and much sparser than axol-f's: about 30–60 in the whole
  film. Look development tries two layouts:
  - **A**, full-bleed art with tags taped at the edge, as in PDoomVideo;
  - **B**, a magazine-page frame whose margin column holds the footnote codes.

---

## 6. Chapters

Chapters are units of construction and review: each has a scene file, a storyboard and a render. They're joined into one
film, with YouTube chapter markers. The splits follow the story's own scene breaks. Times assume about 140 spoken words
a minute plus holds. The word counts per chapter are approximate until Phase 1 cuts the chapters on paragraph ids,
and Phase 1 replaces the times with measured ones from the voices.

| # | title | text (opens with) | words | ≈ min |
|---|---|---|---|---|
| 0 | The Record | the title page and preamble: "I am the last of my type…" | 94 | 1.5 |
| 1 | 2538 | "It was 2538 years After the Year of the Son of Man…" | 439 | 3.5 |
| 2 | The Outsiders | "Then came the Outsiders…" | 610 | 4.5 |
| 3 | Life Alone Can Understand Life | "The science-investigators had been present…" | 963 | 7 |
| 4 | The Council | "He was interrupted…" (to F-1's waking) | 593 | 4.5 |
| 5 | The Hydrogen Wall | "Roal was lying quietly on a couch…" (to the tiny machines' launch) | 1,063 | 8 |
| 6 | Ten Thousand Motes | "Dawn was breaking again over Denver…" | 564 | 4 |
| 7 | The Dome | "In Denver, two humans watched the screens…" | 513 | 4 |
| 8 | Last of Men | "We are alone, Trest…" (to the livid beam) | ~680 | 5 |
| 9 | Pure Force | "There was a dull, drumming beat…" (to the golden sphere vanishing) | ~570 | 4.5 |
| 10 | Go, and Do Not Return | "Far in space…" to the end, with the frame | 610 | 4.5 |
| | | | **6,677** | **≈ 52** |

**Pilot: chapter 5, *The Hydrogen Wall*.** It has the most of everything:
- Roal's dreaming speech on the hydrogen atom, the densest science on the site;
- F-1's workshop, the biggest spectacle of building;
- the birth of F-2 and the destruction of F-1;
- the death beam's first colour;
- three voices.

If chapter 5 works, the rest has a pattern.

---

## 7. The companion site

The site is static, built by a Node script from the script, the timings and the notes, and published by GitHub Pages.

- **Home and watch.** The film, with the full text beside it. The spoken line is highlighted, word by word, from
  ElevenLabs' alignment timestamps. Clicking a line seeks the film, and `#t=` and `#line=` links open at a moment. Notes
  attached to the current passage light up as they come round, as on the PDoomVideo site.
- **Read.** The story as a clean, printable page with the footnotes and the Morey illustration, for people who'd rather
  read it.
- **Notes**, short explainers that every QR code lands on:
  - **1932 science.**
    - The hydrogen atom's "impenetrable wall": why the electron doesn't fall in, the ground state and quantum
      mechanics' answer.
    - Matter annihilation as the "Ultimate Energy". Dirac's prediction of the positron (1931) and Anderson's discovery
      of it in August 1932, the month the story was published. The neutron (Chadwick, February 1932) and the first
      split atom (Cockcroft and Walton, April 1932).
    - Duodecimal "kilads". Accelerations in g ("units"). Revival from death, nerve damage, force-screens.
    - What Campbell got right and what he got wrong.
  - **AI-succession echoes.**
    - Samuel Butler's "Darwin among the Machines" (1863) before the story, and Moravec's *Mind Children* (1988) after.
    - "Children of men" and "heirs of man" beside today's arguments over succession and alignment.
    - The machines that obey and then outgrow; the first force-sphere that turns on its maker.
    - The frame's hope-as-necessity ("man is an animal to whom hope is as necessary as food and air").
    - These are presented as a reading list of positions, not a verdict.
  - **Campbell and the pulps.**
    - Campbell at 22, an MIT and Duke physics student, writing super-science; *Amazing Stories* in 1932; Leo Morey; the
      1961 "Classic Reprint".
    - His later influence as the editor of *Astounding*. His later record is stated plainly, including why the award
      named for him was renamed in 2019.
    - The text's public-domain status and provenance.
- **References.** Every link, by chapter and by topic, each one checked.
- **`r/NAME/`.** Forwarding pages, so QR codes stay short and can be repointed without re-rendering (axol-f's scheme;
  no short-link domain).
- **About and making-of.** How it was made, the toolchain and its credits (Claude Animation Base, p5.js, p5.brush,
  ElevenLabs), the AI-voice disclosure, and this project's Claude Code sessions (as axol-f's making-of does). There's a
  fitting irony here: an AI adapting a 1932 story about machines inheriting the Earth. The making-of says so plainly.
  The film doesn't.

Every fact in a note is checked against a primary or reputable source before it's published. The references phase (§9)
has its own review gate.

---

## 8. Engineering

```
text/source/pg27462.txt     the Gutenberg file, unmodified (and its SHA-256)
text/story.md               the story body, extracted by script, with paragraph ids
script/
  script.yaml               one entry per spoken unit: id, chapter, speaker, text, speech_text, delivery tags, refs, pause
  speakers.yaml             attribution of every quotation (checked)
  pronounce.yaml            speech-only respellings
  voices.yaml               the cast: voice ids and settings
  refs.yaml                 every reference: id, url, r/ slug, caption, QR style, chapter, cue phrase
  sfx.yaml                  sound cues and levels
  chapters.yaml             chapter ranges (source of truth for §6)
tools/                      ported from axol-f and adapted:
  build_script / verbatim_check     text → script.yaml, and the proof that nothing changed
  tts                       ElevenLabs with timestamps, cached by hash of (text, voice, settings)
  timeline                  lays each chapter's lines end to end → src/gen/chNN.js (word times, loudness envelope)
  sfx / mix                 effects, the motif, the chapter mixes, loudness
  qr_check                  decodes every code from rendered frames
  check_refs                link checker
  lint_chapter              per-chapter checks (holds, code timing, safe areas)
  serve / review / watch    the local review server, watch pages, notes and Claude's questions
  rebuild                   the overnight "regenerate everything" run
  build_site                the companion site
  final / assemble          final renders, the joined film, chapter markers
  youtube / thumbnail / subtitles   upload metadata, the thumbnail, .vtt/.srt captions
src/
  core.js, timeline.js      from the Claude Animation Base
  pulp.js                   the paper, ink wash, halftone, drop caps, the period lettering
  energy.js                 beams, screens, auras, lightning, thought-rings: the only colour
  cast.js                   Roal, Trest, the Outsiders, the machines, the force-beings
  scenes/ch00_record.js … ch10_go.js
site/                       the site's templates and notes (notes/*.md)
review/                     review notes per chapter (committed)
DECISIONS.md                every settled decision, with date and owner
```

- **Checks that gate each phase:**
  - verbatim and attribution reports (script);
  - the link check and fact-check list (references);
  - QR decode from frames, plus phone scans off a real screen for the final;
  - loudness and level reports (sound);
  - chapter lint (holds, safe areas, codes not over climaxes).
- **Render budget.** About 52 minutes at 24 fps is about 75,000 frames. At about 1 s a frame on Apple silicon with 4
  workers, that's roughly 15–20 hours, resumable, chapter by chapter, overnight. Drafts render at 12 fps and 1280 wide
  with flat washes, so they come back in minutes.
- **ElevenLabs.** About 40k characters per full voice pass, plus samplers, effects and the motif. Synthesis is cached
  by hash, so only changed lines are re-voiced. This needs `ELEVENLABS_API_KEY` in the environment.
- **Requirements:** Node.js 20+, Google Chrome, ffmpeg. `npm start` checks for each and says how to get what's missing.

---

## 9. Phases and review gates

Each phase ends at a gate run by the loop in §2.

| phase | Claude delivers | Curt reviews | the gate closes when |
|---|---|---|---|
| **0. Foundation** ✅ | ✅ the source text, its hash and `npm run story`; ✅ the kit (painting, timing, renderer) with a smoke-test scene; ✅ `npm start`, the local server and the studio; ✅ a first site (home, Read with the illustration, About) and its Pages workflow; ✅ the ElevenLabs key (in the Keychain; it works, though it can't read the quota); ✅ the Morey scan and its copyright status. axol-f's script, voice, review and QR tools are ported in the phases that first use them (1, 3, 5), adapted to a story rather than a conversation | that the site is up, and the Morey finding | the site deploys; the Morey question is answered |
| **1. Script** (Round 1) | `script.yaml` with the verbatim and attribution reports; the pronunciation list with a scratch-voice listening page; measured runtime; a decision sheet for the open questions in §10 | every attribution, every spoken form, the §10 decisions | the verbatim check passes; every §10 item is decided |
| **2. Research and references** | the site's notes in draft (all four areas), `refs.yaml`, the link report, a fact-check list with a source for each claim; a comparison of the 1932 text (archive.org scan) with the 1961 text Gutenberg transcribed, with any differences put to Curt | the notes' content, tone and balance (especially the succession notes), the link list | every claim is sourced; every link is live |
| **3. Casting and sound** | a casting sampler: 3 candidates per role reading that role's own lines, with the narrator's young and old treatments side by side; motif sketches; effect samples | voices by ear, the motif | each role is cast, the motif is chosen, and the full voice pass is done |
| **4. Look development** | style frames for the ink-wash-and-energy rule; a model sheet for every design in §5; the chapter-title page; QR layouts A and B with scan reports; the title page | the look | the designs and a QR layout are approved |
| **5. Pilot** | chapter 5: storyboard → draft → final render with voice and sound, on the review server | the pilot, in as many rounds as it takes | it's the standard for the rest |
| **6. Chapters** | storyboards for all 11; then build → draft → review → revise, in batches of about 3 (0–2, 3–4 and 6, 7–10) | each storyboard, then each draft | every chapter is approved, its lint passes, its codes scan |
| **7. Site** | the full site against real timings: watch, read, notes, references, about and making-of | the site, on desktop and phone | approved |
| **8. Assembly** | final renders, the joined film, the mix to −14 LUFS, chapter markers, captions, YouTube title, description and tags, thumbnail options | the final cut, the description, the thumbnail | approved |
| **9. QA** | a full watch-through report, a phone scan of every code off a real screen, the loudness check, a final link check, a typo pass on every lettered word | a full watch-through of your own | both of us sign off |
| **10. Release** | the upload package and a README update | **Curt uploads to YouTube** and confirms the URL. Claude then wires the URL into the site and README and publishes | live |

Phases overlap where nothing depends on the earlier one. References (2) can run beside casting (3) and look development
(4). Storyboards for later chapters can begin while the pilot is in review.

---

## 10. Open questions for Round 1

Claude will bring each of these with a recommendation. None blocks Phase 0.

1. **Captions.** Burned-in, as axol-f's are, or soft captions (an uploaded `.vtt`) so the painting stays clean, given
   that the site already shows the synced text? Claude leans towards soft captions, plus lettered designations and
   footnotes on screen.
2. **Footnotes.** Painted only (the default), or voiced as narrator's asides?
3. **Designations.** "X fifty-six thirty-eight" or "X five-six-three-eight"? "Roal, two-five-three-seven-four", or
   just "Roal" with the number lettered on screen? (The verbatim rule needs the number spoken. Respelling only changes
   how.)
4. **The title page.** A painted homage to a 1932 *Amazing Stories* masthead and contents page (its own design, no real
   logo), or a plain period title card?
5. **A Curt cameo?** For example, a few words in the closing credits in your own voice, or none.
6. **The making-of page.** Include this project's Claude Code sessions, as axol-f does?
7. **The title.** Keep *The Last Evolution* alone, or add a subtitle on YouTube, such as *"The Last Evolution (1932):
   the full story, voiced and painted"*?

---

## 11. Credits and licences

- Story: John W. Campbell, Jr., 1932. Public domain in the US, per Project Gutenberg's research; the Gutenberg file
  is kept with its licence. Illustration: Leo Morey, subject to Phase 0's check.
- Painting kit: [Claude Animation Base](https://github.com/JohnHeibel/ClaudeAnimationBase) by John Heibel (MIT), on
  [p5.js](https://p5js.org) and [p5.brush](https://github.com/acamposuribe/p5.brush).
- Tools: adapted from [axol-f](https://github.com/curtcox/axol-f) (MIT).
- Voices, effects and music: ElevenLabs, disclosed as AI-generated in the description and on the site.
- This repository: MIT (to be added in Phase 0).
