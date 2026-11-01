# Round 5: the pilot

Phase 5 makes chapter 5, *The Hydrogen Wall*, in three steps: storyboard, draft, final render (PLAN.md §9). This round
starts with the storyboard. It's the standard every other chapter will follow, so the questions here are about the
pattern as much as about this chapter.

**To watch:** [the storyboard](https://curtcox.github.io/The-Last-Evolution/review/round5/ch05.html) on the site, or
locally after `npm start` (http://localhost:8077/review/round5/ch05.html).
- **What it is:** a board for each of the 39 shots, laid over the chapter's sound, 9:03 in all. The board changes with
  the shot, and the words light up as they're said. Click any shot to start there.
- **The sound:** the cast's voices from the Round 3 pass, with silences added where the pictures need them, the
  theme's first phrase under the chapter's page, and the kept effects ducked under the voice.
- **The boards:** each one is a still from the scene's blocking pass (`src/scenes/ch05.js`). It shows the shot's key
  pose and its event, but not yet its motion. In the studio you can scrub the motion that's there so far
  (http://localhost:8077/studio/?chapter=5).
- **The written storyboard:** [`script/boards/ch05.yaml`](../script/boards/ch05.yaml). For each shot it gives what's
  seen, the event, the camera and the reads, and each one is cued to the voice by its words.

The pilot's gate closes when it's "the standard for the rest". This round settles the storyboard. The draft follows.

---

## 1. The storyboard

**1.1 The shots.** 39 shots in 9:03, about 14 seconds each on average.
- **The opening:** the chapter's page with the theme's first phrase, then the hall at night, with Roal on his couch
  and F-1 waiting.
- **Roal's dream (H to M), 1:34:** his speech on the hydrogen atom, drawn as pulp science plates on dark paper:
  - the atom;
  - the bombardment that never reaches the proton;
  - the electron falling ring by ring, with a white flash at each "flash", until it stops at the wall;
  - the grid of space bending until it folds shut.
- **F-1 at work (N to R):** its logic climbs in ruled steps to a gap; then the force shafts, the writhing tentacles,
  the transmutation field, and the "weird symphony" of arcs and white-hot metal.
- **The birth and the fall (S to Y):** F-2 held in three beams, half Roal's height; the birth in white and blue, with
  Roal's arm up as in Morey's page; Morey's page itself; the lightning; F-1 falling; F-2 held up on its own power.
- **F-2 takes over (Z to AK):**
  - rings of thought;
  - F-1 unmade along a stream of light;
  - the Ultimate Energy inside F-2;
  - C-R-U-1 made, and its name glowing on;
  - the guinea pig, and the film's first green.
- **The close (AL, AM):** outside on the bare rock at dawn, the great machine grows in hours, and thousands of tiny
  machines rise until they're specks among the stars.

*Recommend:* approve the beats and their order. Say which shots to cut, add or stage differently.
**Curt:**

**1.2 What's ours, not the text's.** Where the text is silent, I've invented:
- **Two kinds of thought.** Roal's thought is a loose curl of pale wash; the machines' is ruled, straight ink. This
  comes from the chapter's first sentence ("not with the logical trains of thought that machines must follow").
- **The ruled steps** for F-1's "step that no logic can justly ascend, but yet, working backwards, it is perfect".
- **The science plates** for Roal's speech, and the bending grid for "electric force curves space".
- **Memories of earlier chapters** drifting in F-2's rings: the towers, a torpedo of the void, a green beam.
- **The atom's electron again** (AD): tiny pale motes dodging and caught, for "its futilely resisting electrons".
- **Staging the text doesn't give:**
  - Roal stays in the hall throughout;
  - the investigator carries the cage in a tentacle;
  - the Outsiders' ships are on the laboratory's screens when F-2 says "attack that enemy life-form";
  - Roal isn't in the last two shots, outside.

*Recommend:* keep all of these. The two kinds of thought matter most, because they come back in later chapters (the
council, the force-beings).
**Curt:**

**1.3 Morey's page.** Our painting of the birth builds to Morey's composition: the newborn tilted in its aura, F-1
towering, and Roal in the foreground with his arm thrown up across his face. It then dissolves into the page itself.
The page's caption is the sentence just spoken ("An enormous aura of white light..."), so the voice waits 4 seconds
before "Lightning cracked..." to leave time to read it. The page is upright, so it sits in the middle of the frame
with paper either side.
*Recommend:* keep the pause. The alternative is to go straight on, with the page under the voice.
**Curt:**

**1.4 The pauses.** Thirteen silences are added for the pictures, 19 seconds in all. Each one gives an event time to
land before the next line starts: F-1 falling, F-1 gone from the floor, the guinea pig dead, "What is that wall—why?"
hanging in the air. Three of them fall in the middle of a line, which is cut at the natural pause there. Each is listed
with its reason in the storyboard file.
*Recommend:* keep them as the pattern. A pause belongs where a beat needs one, never as a fixed gap.
**Curt:**

## 2. Sound

**2.1 The mix.**
- **The theme:** its first phrase plays under the chapter's page at about the voice's loudness, and the narrator comes
  in over it at six seconds.
- **The effects:** the workshop symphony twice (louder for F-1, quieter for F-2), the birth, the snap and the green
  beam. Each is laid by its words, and ducked whenever the voice speaks.
- **The level:** the whole is brought to −14 LUFS with true peaks under −1 dBFS (plan §4).

*Recommend:* listen to it on the storyboard page and say what's too loud, too soft or missing.
**Curt:**

**2.2 Sounds the sketches don't cover.** Three of the chapter's energies have no sound yet:
- F-1's force shafts;
- F-2's disintegrating stream;
- the forces that make C-R-U-1.

*Recommend:* I generate three short effects for these in the draft. That's a few cents of credit, from the same
period-science prompts as the others.
**Curt:**

## 3. Next

**3.1 The draft.** Motion for every shot: acting, camera moves and transitions, rendered at 12 frames a second and 1280
wide, then a watch page where notes can be pinned to a moment.
*Recommend:* start the draft as soon as 1.1 is answered. Changes from 1.2–1.4 can go in while it's being built.
**Curt:**

## Claude's open concerns

The loop in §2 asks me to name what I'm not happy with. On the storyboard:

1. **The figures are still stiff.** Roal's profile poses are new (model sheet 7, added to the
   [model sheets](https://curtcox.github.io/The-Last-Evolution/review/round4/models.html)). They read in the boards,
   but they need acting in the draft: weight shifts, hands, a three-quarter head for the close shots (M is a profile
   for now).
2. **Weak boards:**
   - R, the tiers of watching machines: they read as jars on shelves and need depth;
   - AE, AH and AI: the subjects are small in the frame;
   - Q, the symphony: it depends on its rhythm of light and dark, which a still can't show.
3. **Roal's dream runs 1:34 of diagrams.** Only one cut goes back to a face (M, at the end). I'd consider a cut to his
   eyes at "Yet—the proton is positive", halfway through. Say if you'd like it.
4. **F-2 still looks a little like a fishing lure** in the wide shots. Its tentacles now trail back instead of hooking
   down, which helps. The design question is open in Round 4 §5.3.
5. **Two things you haven't answered yet feed this chapter:**
   - **Your listen to the voice pass (Round 3, 4.4).** One of its two flagged lines, F-1's "Roal—", is shot C here.
   - **The model sheets (Round 4, §5).** The pilot uses the recommended designs, and any change there carries into it.
