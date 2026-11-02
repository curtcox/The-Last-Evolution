# The quality loop

How Claude keeps working on the film and the site until it's satisfied with both, rather than until it runs out of things
it happens to remember. PLAN.md §2 sets the bar: the checks pass, Claude has watched the draft since the last change, and
it can say why each beat works. This file, [`quality/rubric.yaml`](quality/rubric.yaml) and
[`tools/quality.mjs`](tools/quality.mjs) make that bar something a tool can measure.

## The parts

- **The rubric** ([`quality/rubric.yaml`](quality/rubric.yaml)) lists every item that has to pass, with criteria concrete
  enough to judge:
  - five per chapter: acting, picture, sync, sound, story;
  - two per site page: what it says, and how it looks and works;
  - the open work items;
  - Curt's gates.
- **The record** ([`quality/status.yaml`](quality/status.yaml)) holds each judgment: passed or open, the note saying why,
  and a fingerprint of what was judged. A chapter's fingerprint is its draft video; a page's is the built page. When the
  fingerprint changes, the judgment goes **stale** and the item is back in the queue.
- **The checks** in `npm run quality` do the measuring:
  - Every run: the verbatim check; the site build and its links; the annotated page rebuilt; no voice line still flagged;
    captions for every spoken line; spend under the cap.
  - Every run, per chapter (its `draft` item): the draft is newer than its sources, it was made from frames that are too
    (frame rendering skips frames already on disk), and it's at −14 LUFS with peaks under −1 dBTP (measured once per
    draft).
  - On request, since they're slow or go to the network: the notes' sources (`refs`), every page at phone and desktop
    width (`phone`), and the live site (`live`).
    `npm run quality -- --full` runs them all; `--check=phone` runs one. A slow check whose inputs have changed goes back
    in the queue.
- **The queue** is what `npm run quality` prints, in this order:
  1. failing checks;
  2. slow checks that are stale or haven't run;
  3. a fresh-eyes round when one is due;
  4. Claude's items, film first, chapter 5 first.

  Curt's items are listed apart and never block.
- **The scorecard** ([`quality/scorecard.json`](quality/scorecard.json)) is published on the site at
  [/review/quality/](https://curtcox.github.io/The-Last-Evolution/review/quality/). It shows where everything stands,
  with Curt's questions first.

## The loop

`npm run quality -- loop on` creates `.quality-loop`, a local file that isn't committed. While it exists, a Stop hook
(`.claude/settings.json`) runs `npm run quality -- --hook` each time Claude tries to end a turn. If one of Claude's items
is open, the hook keeps the turn going and hands over the top item. Each pass goes like this:

1. **Look first.** For a chapter, the tools are:
   - `node render.mjs --chapter=N --sheet=…` or `--strip=…` (frames);
   - `npm run ask -- measure N` / `hear N` / `clips N` (numbers, words, flicker);
   - `npm run ask -- watch N` (a model's first viewing, which is paid: see below);
   - watching the draft.

   For a page, look at the screenshots in `out/quality/phone/`.
2. **Fix it.** Re-render with `npm run timeline -- N`, render the frames, then `npm run draft -- N`. Re-run `npm run quality`.
3. **Record it:**
   - `npm run quality -- pass ID --note="why it's right"`;
   - or `open ID --note="what's still wrong"`;
   - or `curt ID --note="the question"` when it's Curt's call.
4. **Commit and push to main**, one commit per item. The commit message says what was wrong and why it's right now. Curt
   asked for every step to deploy (DECISIONS.md, 2026-11-02): the record of the process is part of the point, and every
   deploy but the last is short-lived.

`npm run quality -- loop off` deletes the flag. Without it, the hook does nothing.

## Keeping Claude honest

- **Fresh eyes.** After every 8 passes, and again once the queue is empty, the hook asks for a fresh-eyes round:
  1. A subagent with none of the session's context reviews the film and the pages against this rubric.
  2. Claude can also put the question to outside models with `npm run ask`, within the cap.
  3. Each finding goes into the record as an open item, and the round is logged with
     `npm run quality -- fresh --found=N --note=…`.
- **Done** means the queue has none of Claude's items left, and the last two fresh-eyes rounds both found nothing, with no
  change in between.
- **Stuck.** If the hook hands out the same item three times and nothing in the repository changes, the item goes to
  Curt's queue with a note saying so, and the loop moves on.
- **The loop stops** when it's done, or when one of these holds:
  - only Curt's items are left;
  - the model spend nears the $10 cap (`npm run ask -- total`);
  - the hook has kept 40 turns going since `loop on` (`loop on --cap=N` changes the limit).

  Each time, the hook says why it stopped.
- **Curt's calls stay Curt's.** These are Curt's to decide:
  - voices by ear, and the look's direction;
  - the foreword's wording;
  - anything DECISIONS.md settles;
  - voicing more than 10 lines again (it costs ElevenLabs credits, and the key can't read the quota).

  Claude puts each one to Curt with a recommendation (`curt ID`) and doesn't decide it.
