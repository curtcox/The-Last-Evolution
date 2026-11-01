# The three texts: 1932, 1961, and Gutenberg

There are three versions of the story's words:
- **1932**, the first printing (*Amazing Stories*, August 1932);
- **1961**, its reprint (*Amazing Stories*, March 1961, "A Classic Reprint");
- **Gutenberg's** transcription of the 1961 reprint, which is the text we voice. Its transcriber notes that "minor
  spelling and typographical errors have been corrected without note".

`tools/compare_printings.mjs` compares Gutenberg word by word with archive.org's OCR of each printing:
- the 1932 OCR is in `assets/ref/amazing_1932-08_ocr_story.txt`, with 73 differences listed in
  [compare_1932_raw.md](compare_1932_raw.md);
- the 1961 OCR is in `assets/ref/amazing_1961-03_ocr_story.txt`, with 49 differences listed in
  [compare_1961_raw.md](compare_1961_raw.md).

**Round 2 restored the 1932 readings of items 1–16 below** (`text/emendations.yaml`), and kept Gutenberg's corrections
(items 17–19). So the film and the site's Read page follow 1932, minus its misprints.

Most of those differences are OCR noise. The real ones are below. Each 1932 reading was checked against the page scan;
the crops are in [assets/ref/1932/](../assets/ref/1932/). The 1961 readings are from the OCR, and every one is clean
where it matters. Only words are compared, not punctuation or capitals.

**In short:**
- **1961 lost words.** It was reset from the 1932 text, and the typesetter dropped words: a 24-word clause lost by
  eye-skip, two negatives that reverse what their lines say, and a dozen small slips. None of the changes reads like the
  author revising.
- **Gutenberg corrected some errors.** It fixed four errors that 1932 and 1961 share, most notably "F-2" printed three
  times where F-1 is meant. It also smoothed one sentence that 1961's slip had made ungrammatical. It didn't have the
  1932 text, so it couldn't restore the lost words.

## 1961 changed the meaning, and Gutenberg kept it

| | where | 1932 (first printing) | 1961 = Gutenberg | 1932 scan |
|---|---|---|---|---|
| 1 | p013 | A combination was arranged so that the machine **could not withstand it; the last plunger snapped shut. Instantly the vast energies stored for operating the ship were released, and the entire machine**, as well as the investigator and the Outsiders, were destroyed. | A combination was arranged so that the machine, as well as the investigator and the Outsiders, were destroyed. | [p416](../assets/ref/1932/p416_p012-p013.jpg) |
| 2 | p034 | You are their most deadly enemies, and they **don't** realize it. They have no intelligent machines; probably they can conceive of none. | …and they realize it… | [p417](../assets/ref/1932/p417_p033-p036.jpg) |
| 3 | p069 | Half of half of the beams of Death are not yet stopped. And we have **not** the attack system | …And we have the attack system | [p418](../assets/ref/1932/p418_p065-p072.jpg) |

1 is an eye-skip: the typesetter's eye jumped from "the machine" to "the entire machine" and lost 24 words. The 1961
sentence still parses, but it no longer says how the ship was destroyed.
2 and 3 each lose a negative, and the 1932 reading is the one the story needs. Roal's whole point is that the Outsiders
can't conceive of thinking machines. C-R-U-1 is listing what's still missing, and F-2's answer is to make the attack
beam: "At least, we have the beam."

## 1961 changed the wording

| | where | 1932 | 1961 | Gutenberg | 1932 scan |
|---|---|---|---|---|---|
| 4 | p005 | **an** imagination that outstrips | **and** imagination that outstrips | as 1961 | [p414](../assets/ref/1932/p414_p005-p007.jpg) |
| 5 | p020 | they were unable to withstand **any acceleration above the** very meager earth-acceleration | they were unable to withstand **only** very meager earth-acceleration | they were **able** to withstand only very meager earth-acceleration | [p416](../assets/ref/1932/p416_p018-p023.jpg) |
| 6 | p021 | they attacked **in** such numbers | **at** such numbers | as 1961 | the same |
| 7 | p021 | while being destroyed, **they** were able to send back signals up to the moment of **complete** annihilation | both words dropped | as 1961 | the same |
| 8 | p036 | the hidden secret of their **powerful** force-screen | "powerful" dropped | as 1961 | [p417](../assets/ref/1932/p417_p033-p036.jpg) |
| 9 | p037 | Already, **within** his parts | **with** his parts | as 1961 | [p417](../assets/ref/1932/p417_p037-p041.jpg) |
| 10 | p048 | recombine in **that** extrapolation | in **the** extrapolation | as 1961 | [p417](../assets/ref/1932/p417_p044-p049.jpg) |
| 11 | p079 | alike turned aside | alike turned **as** aside | as 1961 | [p419](../assets/ref/1932/p419_p077-p080.jpg) |
| 12 | p080 | As at one command | As at **the** one command | as 1961 | the same |
| 13 | p108 | this day and **forevermore** gone | this day and **forever** gone | as 1961 | [p420](../assets/ref/1932/p420_p106-p111.jpg) |
| 14 | p134 | they saw **that** sphere | they saw **the** sphere | as 1961 | [p421](../assets/ref/1932/p421_p133-p134.jpg) |
| 15 | p137 | for my kind is now, **as** theirs was, poor and inefficient | …now, **and** theirs was… | as 1961 | [p421](../assets/ref/1932/p421_p134-p138.jpg) |
| 16 | p045 | answered **X-6621** | answered **X-6221** | as 1961 | [p417](../assets/ref/1932/p417_p044-p049.jpg) |

4 and 11 are plain slips: "and imagination that" and "turned as aside" don't parse.
5 shows the chain: 1961 dropped four words and left nonsense ("unable to withstand only"), and Gutenberg mended the
grammar the only way it could without 1932, by turning "unable" into "able".
15 is close to a meaning change. In 1932 F-2 says his kind is poor and inefficient *as* man's was; "and" loses the
comparison.
16 can't be settled from the text: the chemist is named only once. 1932 is the earlier authority.

## Errors in both printings that Gutenberg corrected

| | where | 1932 and 1961 | Gutenberg | 1932 scan |
|---|---|---|---|---|
| 17 | p058, p059 | **F-2** hummed softly… the shining cylinder of **F-2**… About **F-2** were clustered | F-1, each time | [p418](../assets/ref/1932/p418_p057-p059.jpg) |
| 18 | p008 | dispatched from **Diemos** | Deimos | [p416](../assets/ref/1932/p416_p008.jpg) |
| 19 | p013 | the control signals from the **Ruler's** brains | Rulers' | [p416](../assets/ref/1932/p416_p012-p013.jpg) |

17 is a misprint: F-2 doesn't exist yet in that scene, and the same paragraph says "F-1 floated motionless". The 1961
OCR also reads "they had build" (p073) and "on" as "of" twice (p058, p080). Gutenberg and 1932 agree in each case, so
these are 1961 slips or OCR errors, and it doesn't matter which.

## Other things that differ

- **The introductions.** The 1932 printing has a one-sentence editor's introduction: *"It must be the dream of countless
  numbers to reach the acme of evolution…"*. The 1961 reprint replaces it with a page-long introduction by Sam
  Moskowitz on Campbell's early career (see [Campbell and the pulps](../notes/history.md)). Neither is the author's, so
  neither is voiced.
- **Spelling and punctuation, as seen along the way.** Both printings have "Kahsh-256,799" and "exo-thermic" and
  "endo-thermic". 1932 also has "can not", "machine Rulers", "The ultimate Energy" (p068) and "Strange-life-forms"
  (p010). Its footnotes are marked * rather than [1] and [2]. None of these changes what's said aloud.
- **The illustration.** 1932 credits "Illustrated by MOREY" at the head of the story. Gutenberg's [Illustration] marker
  after p012 comes from the 1961 layout.
