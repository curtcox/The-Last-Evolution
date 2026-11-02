# Round 7: the film, annotated

Curt asked me to "start work on an annotated version for the web site", thinking about the notes for particular points
in the film, and about forewords and afterwords. This round is a first pass at that, over the draft film from Round 6.
It's the start of the site's watch page (PLAN.md §7, Phase 7), with notes drawn from the ones Round 2 approved.

**To watch:** [the annotated film](https://curtcox.github.io/The-Last-Evolution/review/round7/annotated.html) on the
site, or locally after `npm start` (http://localhost:8077/review/round7/annotated.html).
- **What it is:** a foreword, then the whole film with notes appearing beside it as it reaches their words, then an
  afterword. Every note is also listed by chapter at the foot of the page; click a time to watch from there.
- **The controls:** buttons turn each kind of note on or off, or all of them off. The scrub bar marks each note with a
  dot.
- **Links into the film:** `#note=bacteria` opens the film paused at that note, with the note showing. `#t=15:57` (or
  `#t=957`) opens it at a moment. Every time on the page is such a link, and a note's title in the list at the foot
  links to that note.
- **On a phone:** the margin becomes a card under the video, showing the latest note.
- **Your notes:** pin a note to any moment, as on the film page. *Copy* gives them back with the chapter and the
  nearest margin note.
- **The sources:**
  - the margin notes are in [`notes/annotations.yaml`](../notes/annotations.yaml);
  - the foreword and afterword are in [`notes/foreword.md`](../notes/foreword.md) and
    [`notes/afterword.md`](../notes/afterword.md);
  - every note's time and the gap before it are in [`notes/reports/annotations.md`](../notes/reports/annotations.md);
  - `npm run annotated` builds the page.

---

## 1. The shape

**1.1 Where the notes appear.**
- **What I built:** notes appear in a margin beside the picture. They never cover it and never pause the film, and none
  shows before the film reaches it. The latest one is lit for 45 seconds, then fades into the list above it.
- **Alternatives I passed over:**
  - pop-ups over the picture would fight the painting;
  - pausing at each note would break the voice's pace;
  - a spoken commentary track would break the film's rule against commentary in the voice track (PLAN.md §1).

*Recommend:* the margin.
**Curt:**

**1.2 On or off to start.** Notes start on. The foreword suggests that a first-time viewer might turn them off and read
them afterwards, as the story's first readers met it, with nothing in the margin. The alternative is to start with
them off and let viewers turn them on.

*Recommend:* on, with that suggestion in the foreword.
**Curt:**

**1.3 How many.** There are 48 notes over 57 minutes, about one every 71 seconds, and none closer than 20 seconds to
the one before.
- **The rule:** notes stay sparse where the story is busiest. The battle, the end of chapter 7 and the globe of force
  in chapter 9 each run two to four minutes without a note.
- **Added since the first pass:** two notes in the longest quiet stretches.
  - *Wells's lesson* (chapter 3, 15:57): the Outsiders kill down to the microbes because, unlike Wells's Martians,
    they know what Earth's germs would do.
  - *Logic and intuition* (chapter 8, 45:45): the power plant built from "the deadly logic of the machine, inspired by
    the leaping intuition of man", the ruled line and the curl together, as the boards draw it.
  These shorten the longest gaps from 223 and 285 seconds to 152 and 188 seconds.
- **What it cost:** a first draft had 53 notes. To meet the rule I merged or dropped seven, among them notes on Sirius
  and Alpha Centauri, the control in Chicago and the lost "don't". The lost "don't" is now folded into the note on the
  lost "not".

*Recommend:* keep the rule of about one a minute and at least 20 seconds apart.
**Curt:**

**1.4 Six kinds.**

| kind | notes | for |
|---|---|---|
| Who's who | 5 | the people and machines, their numbers, and who the narrator is |
| Words | 3 | the story's own terms and numbers: mentatype, kilads, 9,633 |
| 1932 science | 13 | what Campbell knew, and what we know now |
| The text | 5 | the two printings, the footnotes, Morey's picture |
| Heirs | 11 | the idea that machines might inherit from us, before Campbell and since |
| The making | 11 | where the film pictures what the text leaves unsaid |

*Recommend:* these six.
**Curt:**

## 2. Forewords and afterwords

**2.1 The film's foreword and afterword.** Both are text on the page, not voiced.
- **[The foreword](../notes/foreword.md)** (about 400 words) sits above the film. It covers what this is, when it was
  written (the atom coming apart in 1932, with no computer anywhere), how to watch with the notes, a word on the
  1932 language (the "parasite" speech kept whole), and who made it, with the AI disclosure.
- **[The afterword](../notes/afterword.md)** (about 600 words) sits below the film, and the page scrolls to it when the
  film ends. It picks up the last line's challenge with what became of four things:
  - Campbell: "Twilight", *Astounding*, and his later record, as Round 2 settled;
  - the science: the positron, and the wall as the atom's lowest state;
  - the idea: from Butler to today's two camps;
  - the text: the 1932 readings put back.
  It ends with where to go next.
- **The alternative:** a voiced foreword in a neutral voice (not F-2's), on the site only.

*Recommend:* text. The film stays the story alone, and readers can skim. A voiced foreword can come later if the
YouTube cut wants one.
**Curt:**

**2.2 Chapter forewords.** I considered a line before each chapter, and didn't make them.
- **The problem:** each line either gives away what's coming or repeats the chapter's own page, which already opens
  every chapter with its title and first words.
- **What's there instead:** the margin's first note in a chapter usually sets it up. Examples are "Six centuries of
  machines" in chapter 1, "Roal and Trest" in chapter 3 and "The machines' names" in chapter 4.

*Recommend:* no chapter forewords.
**Curt:**

**2.3 YouTube.** The film's description there can carry a short form of the foreword (what it is, 1932, the AI
disclosure) and the afterword's links, pointing to this page for the notes.

*Recommend:* that, in Phase 8.
**Curt:**

## 3. The notes themselves

Read them as they come round, or all at once at the foot of the page, and pin anything to change. Four things to
weigh:
- **Some notes cover what the draft doesn't yet show.** Gemini's first-time viewer got lost in places (Round 6 §2.3),
  and several notes answer them:
  - Roal and Trest;
  - Morey's page;
  - the planets;
  - the lattice of three facts;
  - the curl over Roal;
  - the inside of a giant ship;
  - the turn to the page.
  These notes help, but they aren't the fix: the acting pass should still make Roal and Trest tell apart on their own.
- **Two of the Heirs notes compare the story with today.**
  - *Imagination by recombination* says Campbell's "trillions of facts to combine and recombine" reads now like a
    description of how AI models are made.
  - *Loyal heirs* calls the machines what today's researchers would call aligned.
  Both describe without taking sides, as Round 2 asked of the Heirs note. They're the two I'd most like you to read.
- **Spoilers.**
  - The margin never shows a note ahead of the film.
  - The narrator isn't named until chapter 5's "How the narrator remembers". The film's chapter 0 already shows the old
    machine, so this names what's on screen.
  - The F-1 line in chapter 5 says only "remember the line in chapter 9".
- **Every note waits for its words.** Each is pinned to a phrase of the story rather than a time, so it moves with the
  voice if the voice is re-timed. The build fails if a phrase is missing or occurs twice.

*Recommend:* read and pin.
**Curt:**

## 4. Where it goes from here

**4.1 Into the site.** In Phase 7 this page becomes the site's watch page.
- **What it gains there:**
  - the final film;
  - the synced full text beside it, with `#t=` and `#line=` links;
  - the longer notes as pages of their own. The "More" links go to GitHub until then.
- **What it keeps:** the notes, foreword and afterword carry over as they are.

*Recommend:* that.
**Curt:**

**4.2 The QR codes.** PLAN.md §5 plans 30 to 60 QR codes in the film, each opening a page here. These 48 notes are the
natural set to choose from. Each code would open the annotated film at its note, with a link of the form
`annotated.html#note=bacteria`, which works now.

*Recommend:* choose the codes from these notes when the QR layouts are made (Phase 4).
**Curt:**

## Claude's open concerns

- **New facts.**
  - These notes add a few claims that the Round 2 notes didn't make: Pluto (1930), the UN's population projection,
    Wien's law, the theremin, *The War of the Worlds* (1898), and some arithmetic.
  - They're in the [fact-check list](../notes/factcheck.md), and each was checked against its source: Wikipedia for
    Pluto, Wien, the theremin, Wells and the world's population in 1932, and the UN's 2024 release for the projection.
    That turned up no errors, and the theremin note now gives the instrument's date: 1920.
  - Checking the older notes' textbook claims the same way corrected two: Rutherford knocked protons out of nitrogen in
    1919, but it was Blackett in 1925 who showed the nitrogen had become oxygen; and *R.U.R.* gave us "robot", but the
    source doesn't call it the first story of made workers replacing humanity, as the notes had. The science note now
    also cites Dirac's 1930 paper "On the Annihilation of Electrons and Protons", to show that Roal's guess was a
    physicist's guess too. Every claim in the list now rests on a source read for it.
- **Notes about pictures may change with them.**
  - Four notes describe the draft's pictures: the lattice, the curl, the inside of the giant ship, and "Locked" (the
    flagship as the one drawing that doesn't boil).
  - If the look changes (Round 6 §1.2 would stop the backgrounds boiling), "Locked" will need new words. The
    flagship's stillness only stands out while everything else boils.
- **Long quiet stretches.** The power plant now has a note, but the storm and the globe of force (chapter 9) still go
  three minutes without one, as does the end of chapter 7. That's deliberate; either could take a note if you'd like
  more there.
- **It's on the draft.** The video is Round 6's at 12 drawings a second, so the notes are being judged against
  unfinished pictures.
