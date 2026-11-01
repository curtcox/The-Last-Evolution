# Round 2: the text and the notes

The decisions Phase 2 needs from you (PLAN.md §9). Each comes with a recommendation. Reply in chat with item numbers
("all recs", or "all except 2.3"), or write after **Curt:** here. The gate closes when every item is decided, every
claim in the notes is sourced and every link is live. The links are all live now (`npm run refs`).

**What to look at**
- [text/comparison_1932.md](../text/comparison_1932.md): the three texts compared (1932, 1961, Gutenberg), with scan crops
- [notes/science.md](../notes/science.md): the science of 1932
- [notes/succession.md](../notes/succession.md): machines as heirs, from Butler to now
- [notes/history.md](../notes/history.md): Campbell, Morey and the pulps
- [notes/factcheck.md](../notes/factcheck.md): every claim and its source. The "general" rows are the ones I wrote from
  textbook knowledge and didn't re-read a source for
- [notes/refs.yaml](../notes/refs.yaml) and [notes/reports/links.md](../notes/reports/links.md): the 37 sources, all live

---

## 1. Which text the film reads

The plan says we voice Gutenberg's text word for word. Comparing all three versions found that Gutenberg's source, the
1961 reprint, lost words that are in the 1932 first printing:
- a 24-word clause (p013);
- two negatives that reverse their lines: "they **don't** realize it" (p034) and "we have **not** the attack system"
  (p069);
- a dozen smaller words.

Gutenberg's transcriber, who didn't have the 1932 text, corrected four errors that both printings share. The main one is
"F-2" printed three times where F-1 is meant.

**1.1 The film's text.**
- **(a)** Gutenberg exactly, as now. Two lines say the opposite of what the story needs.
- **(b)** Gutenberg, with every 1932 reading restored where 1961 lost or changed words (items 1–16 in the comparison),
  and Gutenberg's own corrections kept (items 17–19).
- **(c)** Gutenberg, with only the clear errors restored: the clause, the two negatives, and the two ungrammatical slips
  (items 1–4 and 11).

*Recommend:* **(b).** The 1932 text is Campbell's. None of the 1961 changes reads like an author revising: they're one
typesetter's slips, and Gutenberg kept them only because it never saw 1932. Option (b) gives the story as first
printed, minus its misprints. It adds 30 words net, about 12 seconds.
**Curt:**

**1.2 How it's done** (if 1.1 is (b) or (c)).
- `text/source/pg27462.txt` stays unmodified, with its checksum.
- A new file, `text/emendations.yaml`, lists each change: the paragraph, the Gutenberg words, the 1932 words, and the scan
  that shows them.
- `npm run story` applies the changes, and the verbatim check holds the script to Gutenberg plus exactly those changes,
  nothing else.
- The site's Read page marks each restored word with a note, so a reader can see what differs from Gutenberg.

*Recommend:* as described.
**Curt:**

**1.3 The chemist's number.** 1932 has X-6621; 1961 and Gutenberg have X-6221. He's named only once, so nothing settles
it.
*Recommend:* **X-6621**, the first printing's, if 1.1 is (b). Otherwise X-6221.
**Curt:**

## 2. The notes

**2.1 Content and balance.** Read the three notes. They're drafts: the facts are checked, and the wording will be tightened
for the site in Phase 7.
*Recommend:* approve the content, and note anything to add, cut or soften.
**Curt:**

**2.2 Machines as heirs.** This is the note the plan flags as needing balance. It sets out the story's argument (Roal's
"Man has always been a parasite"), the line of thinkers before and after it, and today's two camps:
- succession welcomed: Sutton in 2025;
- succession as a risk to prevent: the 2023 Statement on AI Risk, and Bostrom.

It takes neither side. It observes that Campbell's machines are loyal, what researchers now call aligned, and that
humanity's end comes from outside.
*Recommend:* keep it neutral, as drafted.
**Curt:**

**2.3 Disclosure.** The note's last paragraph says the film was made with Claude, and that Anthropic's chief executive
signed the 2023 statement.
*Recommend:* **keep it.** Readers should know who made the film when they read a note about AI succession.
**Curt:**

**2.4 Campbell's later record.** The history note gives one paragraph to his pseudoscience, his politics, and the 2019
renaming of his award, sourced to the SF Encyclopedia and the award's history.
*Recommend:* **keep it**, brief and factual: "as history, alongside the story, not instead of it."
**Curt:**

**2.5 The 1961 introduction.** Sam Moskowitz's introduction to the 1961 reprint says Campbell wrote "Twilight" first,
saw it rejected everywhere, and wrote "The Last Evolution" in its place. The 1961 issue may still be in copyright,
since *Amazing* renewed its issues from 1954, so the note paraphrases it and quotes nothing longer than a word.
*Recommend:* paraphrase only, as drafted.
**Curt:**

## 3. Nothing to decide yet

- **The synced text** (the fourth site area) is built in Phase 7 against the real voice timings. Each note already says
  which paragraphs it belongs beside, so the site can show it as the film reaches them.
- **QR codes.** The film's codes point at the notes and at sources from `refs.yaml`. Picking which ones, and where, is
  part of the storyboards (Phases 4–6).
