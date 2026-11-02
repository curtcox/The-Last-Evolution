# Round 7: the film, annotated

**Closed 2026-11-02: Curt accepted every recommendation.** The decisions are logged in [DECISIONS.md](../DECISIONS.md).

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
**Curt:** use your recommendations.

**1.2 On or off to start.** Notes start on. The foreword suggests that a first-time viewer might turn them off and read
them afterwards, as the story's first readers met it, with nothing in the margin. The alternative is to start with
them off and let viewers turn them on.

*Recommend:* on, with that suggestion in the foreword.
**Curt:** use your recommendations.

**1.3 How many.** There are 49 notes over 57 minutes, about one every 70 seconds, and none closer than 20 seconds to
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
**Curt:** use your recommendations.

**1.4 Six kinds.**

| kind | notes | for |
|---|---|---|
| Who's who | 5 | the people and machines, their numbers, and who the narrator is |
| Words | 3 | the story's own terms and numbers: mentatype, kilads, 9,633 |
| 1932 science | 13 | what Campbell knew, and what we know now |
| The text | 5 | the two printings, the footnotes, Morey's picture |
| Heirs | 12 | the idea that machines might inherit from us, before Campbell and since |
| The making | 11 | where the film pictures what the text leaves unsaid |

*Recommend:* these six.
**Curt:** use your recommendations.

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
**Curt:** use your recommendations.

**2.2 Chapter forewords.** I considered a line before each chapter, and didn't make them.
- **The problem:** each line either gives away what's coming or repeats the chapter's own page, which already opens
  every chapter with its title and first words.
- **What's there instead:** the margin's first note in a chapter usually sets it up. Examples are "Six centuries of
  machines" in chapter 1, "Roal and Trest" in chapter 3 and "The machines' names" in chapter 4.

*Recommend:* no chapter forewords.
**Curt:** use your recommendations.

**2.3 YouTube.** The film's description there can carry a short form of the foreword (what it is, 1932, the AI
disclosure) and the afterword's links, pointing to this page for the notes.

*Recommend:* that, in Phase 8.
**Curt:** use your recommendations.

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
**Curt:** use your recommendations.
**Curt:** I would expand the two Heirs notes. Make any changes you see fit.
**Claude:** both are now three short paragraphs, and the margin takes paragraphs. They come 125 and 97 seconds before
the next note, so there's time to read them.
- *Imagination by recombination* now sets F-2 against chapter 1's two kinds of imagination. It gives a figure for
  today's models, Llama 3's 15 trillion tokens (2024), and both sides of the argument over whether recombination is
  imagination: the "stochastic parrots" paper (2021), and the evidence against it. It ends with F-2 still needing Roal's
  leap in chapter 8.
- *Loyal heirs* now defines *aligned*, says the field counts it an open problem that Campbell takes for granted, and
  adds Campbell's own sequel: the Three Laws of Robotics, which Asimov credited to a talk with Campbell on 23 December
  1940. It points ahead to chapter 9's disloyal heir. The Three Laws are also in [the longer Heirs
  notes](../notes/succession.md).
- The four new sources are in the [fact-check list](../notes/factcheck.md), each read for its claim.

**Claude:** the notes stand as drafted. "Locked" is reworded for the steady backgrounds (Round 6 §1.2): the flagship
is now the only ship in the film to go still.

## 4. Where it goes from here

**4.1 Into the site.** In Phase 7 this page becomes the site's watch page.
- **What it gains there:**
  - the final film;
  - the synced full text beside it, with `#t=` and `#line=` links;
  - the longer notes as pages of their own. The "More" links go to GitHub until then.
- **What it keeps:** the notes, foreword and afterword carry over as they are.

*Recommend:* that.
**Curt:** use your recommendations.

**4.2 The QR codes.** PLAN.md §5 plans 30 to 60 QR codes in the film, each opening a page here. These 48 notes are the
natural set to choose from. Each code would open the annotated film at its note, with a link of the form
`annotated.html#note=bacteria`, which works now.

*Recommend:* choose the codes from these notes when the QR layouts are made (Phase 4).
**Curt:** use your recommendations.

## 5. Why this story

**Curt:** In the 80s, I read Campbell's works in *The Best of John W. Campbell* and was struck by his pessimism around
the concept of utopia. It was much easier to shrug off then when its future seemed well beyond my lifetime -- yet here
we are. This isn't the most illustrative work for framing that concern, but it is the one that I can freely use. Make
any changes you see fit.

**Claude:** that's the reason the project hadn't stated, so I've written it into the foreword and followed the thread
through the other notes.
- **The book.** The US edition (1976, edited by Lester del Rey) opens with *The Last Evolution*. The next four stories
  are "Twilight", "The Machine", "The Invaders" and "Rebellion". Those are the utopia stories: machines bring peace,
  plenty and long life, the perfection goes stale, and mankind has to go back to an earlier stage of life. Read in
  order, the book gives this story first and the pessimism on the pages right after it.
- **[The foreword](../notes/foreword.md)** has a new section, *Why this story*: your reading in the 1980s, the pessimism
  about utopia, a future no longer beyond a lifetime, and this as the story anyone may use. It also points out that the
  utopia is in this story's first chapter: "no productive work was necessary". It's in the third person, "Curt Cox, who
  made this film", to match the rest of the foreword. It could be in your own first person if you'd rather; either way,
  please check that it says what you meant.
- **[The afterword](../notes/afterword.md)** adds a third worry beside the two camps, Campbell's own: not that the
  machines fail us, but that they succeed.
  - Keynes in 1930: "the economic problem may be solved" within a century, and his "dread" of what the ordinary man
    would do with the freedom.
  - "Twilight" and the three Machine stories of 1935.
  - Bostrom's *Deep Utopia* (2024), the same question for an age of AI.
  It then notes that this story's utopia is ended by invasion before it can go stale.
- **A new margin note**, *A world without work* (Heirs, 1:55), sits on "no productive work was necessary". It sets 2538
  beside Keynes, then says Campbell soured on that world in "Twilight" and the Machine stories. It comes 31 seconds
  after the note before it and 56 seconds before the next. That makes 49 notes, 12 of them Heirs; §1.3 and §1.4 now say
  so.
- **[The longer Heirs notes](../notes/succession.md)** gain Keynes (1930), the Machine stories (1935), and *Deep Utopia*
  beside the two camps.
- **Sources.** All four new sources are in the [fact-check list](../notes/factcheck.md), each read for its claim. The
  plots of "The Machine" and its sequels rest on a review of the 1976 book ([Black
  Gate](https://www.blackgate.com/?p=226361)), since I haven't read those stories themselves, so
  the notes describe them only in outline. Copies of the book would let me read them and say more.

## 6. Every kind of visitor

**Curt:** Review the site and the video. Use whatever tools you want. Make any changes you want. Consider what is there
now from the perspective of all different types of future visitors.

**Claude:** I went through the site at desktop and phone widths and in dark mode, followed note links into the film,
played it with captions on, and looked at frames and levels from every chapter. What each visitor would have met, and
what changed:
- **Someone arriving at the front page** read "The film isn't made yet", with no way to the draft. The front page now
  offers three ways in: watch the film (a draft, with notes), read the story, see how it's made. The *In production*
  box says what's left. Every page's menu has *Watch*.
- **Someone following a shared link or a QR code** landed on a page titled "Round 7: the film, annotated", at an address
  that moves when the watch page is built (Phase 7).
  - The site now has a lasting address, [/watch/](https://curtcox.github.io/The-Last-Evolution/watch/). For now it
    forwards to this page, keeping any `#note=` or `#t=` link. So the QR codes should use `watch/#note=bacteria`
    rather than `annotated.html#note=bacteria` (§4.2).
  - The page is titled *The Last Evolution, annotated (draft)*, and links to it show a description and Morey's
    picture.
  - Its notice now speaks to anyone, not just to you, and has a *Skip to the film* link past the foreword.
  - The site has a 404 page and a tab icon.
- **Someone who can't hear it** had the words under the player, but nothing in full screen.
  - The player now has English captions, built in the page from the voice's word timings. Once turned on, they stay on
    from chapter to chapter.
  - The speaker is named in the captions and in the line under the player ("Roal: Attack — therefore!").
  - 37 of the 186 lines had shown the voice's respellings ("Roal, two five three seven four") because the voice
    counted words differently. They're now aligned to the text ("Roal, 25374"). All 49 notes kept their times.
- **Someone using a screen reader** would have heard the whole margin re-read each time a note arrived. Now only the new
  note's kind and title are announced, and only while the film plays.
- **Someone who finds a mistake** had nowhere to say so. The About page and the film page now ask for a GitHub issue.
- **A teacher or researcher** now finds, on the About page, the longer notes, their sources, and the fact-check list.
  Morey's illustration is credited there too.
- **Anyone watching** saw two clocks: the player's own, for the chapter, and the film's. The film's is now labelled
  "the whole film".
- **The Review page** showed Rounds 3 to 7 as open, though DECISIONS.md settles them all. Each sheet now has its
  closing line.
- **The film itself.**
  - Loudness holds steady from chapter to chapter: −14.3 to −14.7 LUFS, with peaks below −0.4 dB.
  - The frames match the draft Round 6 accepted.
  - I changed nothing in it. The acting and painting pass is next anyway.

Not changed, for later:
- **The film has no credits.** It ends on THE END. Anyone who meets the video away from this site, a download or a
  clip, won't learn that the voices are made with AI, or where the notes are. Phase 8 plans credits cut to the theme.
  *Recommend:* they include that line and the site's address.
- **The foreword comes first.** It's about a thousand words before the player. Round 7 put it there on purpose, and the
  skip link now gets returning visitors past it. *Recommend:* keep it as it is.
- **The older review pages** (the Round 5 and 6 drafts) still show the respellings, until they're rebuilt. They're the
  record of their rounds, so I left them.

**Later, 2026-11-02.** Curt: "Make any changes you see fit." The live site checked out: /watch/ forwards with its
`#note=` kept, and the 404 page and tab icon serve. Then the last item above that didn't need the film:
- **The longer notes are pages of the site now**, under [Notes](https://curtcox.github.io/The-Last-Evolution/notes/):
  the science of 1932, machines as heirs, Campbell and the pulps, and the fact-check list. Every menu has *Notes*, and
  the front page offers them.
- The film's *More* links, the afterword's and the About page's go to those pages, at the same sections, instead of
  to GitHub.
- The science note's paragraph lists ("¶15, ¶41 · chapters 2, 4") link to the paragraphs on the Read page. The
  fact-check list's source ids link to their sources.
- One renderer (`tools/notes_md.mjs`) now makes the notes for both the film page and the site.
- The menu wraps on a narrow phone instead of running off the page.
- A check of every link on the built site: 1,086 internal links and anchors, none broken.

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
  - Round 6 §1.2 has now stopped the backgrounds boiling, so "Locked" has new words: the flagship's stillness stands
    out against the ships and energy that still boil, not against the whole picture.
- **Long quiet stretches.** The power plant now has a note, but the storm and the globe of force (chapter 9) still go
  three minutes without one, as does the end of chapter 7. That's deliberate; either could take a note if you'd like
  more there.
- **It's on the draft.** The video is Round 6's at 12 drawings a second, so the notes are being judged against
  unfinished pictures.
