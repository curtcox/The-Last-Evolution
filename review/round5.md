# Round 5: the pilot

**Closed 2026-11-01: Curt settled the motion; the look was held open for the whole film, and settled in Round 6.** The
decisions are logged in [DECISIONS.md](../DECISIONS.md).

Phase 5 makes chapter 5, *The Hydrogen Wall*, in three steps: storyboard, draft, final render (PLAN.md §9). This round
starts with the storyboard. It's the standard every other chapter will follow, so the questions here are about the
pattern as much as about this chapter.

**To watch:** [the storyboard](https://curtcox.github.io/The-Last-Evolution/review/round5/ch05.html) on the site, or
locally after `npm start` (http://localhost:8077/review/round5/ch05.html). **New:** [the
draft](https://curtcox.github.io/The-Last-Evolution/review/round5/ch05-draft.html), with motion, made from your notes
(§4).
- **What it is:** a board for each of the 39 shots, laid over the chapter's sound, 9:03 in all. The board changes with
  the shot, and the words light up as they're said. Click any shot to start there.
- **The sound:** the cast's voices from the Round 3 pass, with silences added where the pictures need them, the
  theme's first phrase under the chapter's page, and the kept effects ducked under the voice.
- **The boards:** each one is now a still of the draft at the shot's key moment (they were the blocking pass's). In
  the studio you can scrub the whole chapter (http://localhost:8077/studio/?chapter=5).
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

*A second way, from your notes:* [AudioOnline](https://github.com/curtcox/AudioOnline) makes sound from a few lines of
code: oscillators, noise, filters, envelopes and effects placed on tracks over time, rendered in the browser to a WAV,
byte for byte the same every time. Weighed for these three:
- **For it:** they're abstract energies (a cold hum, a rising whine, a crackle), which synthesis does well. The source
  would live in the repo, so each could be tuned and re-timed to its cue exactly and remade at will. It costs no credit,
  and there's no licence to check for it (the commercial-use question in Round 3 is about generated audio).
- **Against it:** it isn't wired into the toolchain yet; its renderer runs in a browser, though its own tests run it
  headless under Node. The other nine effects are generated, so three synthesised ones might sit apart from them, and
  organic textures (a roar, crackling) are harder to make convincing from scratch.

*Recommend, revised:* make each of the three both ways and choose by ear. It's a small job either way.
**Curt:**

## 3. Next

**3.1 The draft.** Motion for every shot: acting, camera moves and transitions, rendered at 12 frames a second and 1280
wide, then a watch page where notes can be pinned to a moment.
*Recommend:* start the draft as soon as 1.1 is answered. Changes from 1.2–1.4 can go in while it's being built.
**Curt:**

*Done, after your notes below* (§4). 1.1–1.4 are still open: the draft keeps the beats, inventions and pauses as
recommended, so any answer there carries into it.

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

## 4. The draft

**Curt's notes on the storyboard** (his words):
> I share your concerns.
>
> Add more intermediate animation to show objects moving from position to position rather than jumping.
> Also, use more panning and zooming in place of the current jump cuts.
> Combine these techniques as necessary. Visually holding on a still frame should be used sparingly.
>
> Consider custom sound creation via https://github.com/curtcox/AudioOnline as an option.
> Treat that as a data point not a suggestion.

Recorded in DECISIONS.md as the pattern for the film. AudioOnline is weighed in 2.2.

**To watch:** [the draft](https://curtcox.github.io/The-Last-Evolution/review/round5/ch05-draft.html), 9:03, or
locally at http://localhost:8077/review/round5/ch05-draft.html. Pause anywhere and type to pin a note to that moment;
*Copy notes* gives them back as timed text to paste here or send.

**What changed from the storyboard:**
- **No jump cuts in the hall.** It's one continuous place, drawn whole at every moment. The camera moves from each of the
  storyboard's framings to the next, panning and zooming, easing out and back in on the long moves, starting a little
  before the words it serves. The only hard changes are hidden: under the story's two brush wipes, and behind the flash
  out of the science plate.
- **Everything moves from mark to mark.**
  - F-1 drifts across the floor to Roal's couch to talk, and back to its place to work.
  - Roal sits up, swings his legs off the couch and stands while F-1 hums. Then he walks: to watch the work, to the
    newborn's side, a step back from the aura, back out of the way when F-2 says it will make others, and forward to
    ask his question.
  - F-1's tentacles reach out from hanging to the work, and roll back.
  - The struck science-machine drifts in from the right during the roar, and falls beside F-1.
  - F-2 turns to whatever it attends to: to Roal, to the ruler, three-quarters toward us, to the cage, and its nose up
    to the screens. The turns squash through the profile.
  - The investigator floats in with the cage and later leaves. C-R-U-1 floats into the dawn.
- **The other spaces are reached by matched moves.**
  - The camera pushes into Roal's face and dissolves into his eyes.
  - It pushes into his pupil, which becomes F-1's lens.
  - It pulls back from the lens into the hall, on F-1's lens.
  - The hall darkens into the plate as the proton appears.
  - The plate is one atom throughout: the camera pulls back to the bombardment, pushes in ring by ring to the wall, and
    the grid bends around the same proton.
  - Morey's page dissolves in over the hall, which goes on under it.
- **Acting from the voice.** Mouths open on their words; F-1's and C-R-U-1's lenses and F-2's glow light with theirs.
  Roal breathes, blinks, shifts his weight, looks up at F-1 and down at F-2, and opens his hand when he asks.

**On my concerns:**
1. **Stiff figures:** better, not solved. The walking, standing and talking are simple, and there's still no
   three-quarter head (M is a close profile).
2. **Weak boards:**
   - R: the tiers now float in a ring, small and high at the back, whole machines left and right at the front, with
     every lens turned to the work and lit by the flashes. Better.
   - AE and AH: closer.
   - AI: now a moving shot.
   - Q: it was a still's problem; in motion its light and dark work.
3. **The dream:** Roal's eyes now dissolve in over the atom at "the proton is positive", and back out. They show as a
   double exposure rather than a cut.
4. **F-2's design:** still open (Round 4 §5.3).

**Staging I changed to make the continuity work:**
- E is no longer over Roal's shoulder: F-1 comes across the floor to him instead.
- C-R-U-1 is made on F-1's empty floor (the text's "the empty floor"), not at Roal's end of the hall.
- The investigator comes in from the right, under F-2.
- In the birth, Roal is in the hall at the left with his arm up, not a separate figure close in the foreground.

**4.1 The moves.** Do the camera's pans, zooms and dissolves read, and is there anywhere that wants a cut or a hold
after all?
*Recommend:* note on the draft page wherever a move is too fast, too slow or too busy.
**Curt:**

**4.2 The restaging.** E without the over-the-shoulder shot; C-R-U-1 on F-1's floor; the investigator from the right;
Roal in the hall at the birth.
*Recommend:* keep all four. Each one keeps the floor continuous.
**Curt:**

**4.3 Next.** After your notes on the draft: the acting pass (a three-quarter head for the close shots, hands and weight),
the painting brought up to the model sheets, then the final render at 24 frames a second with the effects from 2.2.
*Recommend:* that order.
**Curt:** Watched the draft. Two possible issues: "it's very monochrome" and "it's flickery". "Those might be the right
calls. I want to see the whole thing before I decide." So the next step is drafts of the other eleven chapters (§5).

**My concerns on the draft:**
- **F-1's fall** has a lurch, a bounce and dust now, but it's still a big tilt more than a collapse.
- **Fast moves at 12 frames a second** can step visibly. The fastest move is under 60 px a frame; 24 fps in the final
  render will smooth them.
- **The investigator** is a small machine carrying the cage by one tentacle; at this size it reads, but only just.

---

## 5. Curt's notes on the draft, and the whole film

**5.1 "It's very monochrome."** It is, by the rule in PLAN.md §5: the world is ink wash, and only energy has colour.
Chapter 5 is the grey hall at night, so its colour is a few seconds of force shafts, the birth's lightning, C-R-U-1's
dull gold and the first green beam. The rule is meant to work across the film, not in one chapter. The green death
spreads in chapters 2–3, the screens go violet to red in 7, the golden sphere in 9 is the first warm colour that isn't
a weapon, and chapter 11's frame is the only full-colour scene. Seeing the whole film is the right test of the rule.
If it's still too grey, the cheapest change is to tint the wash itself: sepia for 2538, colder for the Outsiders'
ships. The rule would stay.

**5.2 "It's flickery."** Two causes:
- **The boil.** The linework reseeds 12 times a second, and the draft runs at 12, so every frame redraws every stroke
  differently. That includes the background's wash and blooms, not just the figures' lines. That's the hand-drawn look
  the kit was built for, but here it's applied to the whole frame.
- **The halftone.** The halftone dots follow the boil, so the grey areas shimmer.

If it's too much, the fixes are cheap and don't touch the drawing:
- hold the background steady and boil only the figures;
- boil on twos (6 a second);
- or both.

The 24 fps final render would make it worse, not better, unless the boil stays at 12 or lower.

**5.3 The whole film, as drafts.** The other eleven chapters, each made the way chapter 5 was:
- a storyboard;
- the timeline and mix from the voice pass;
- the scene;
- a 12 fps render.

They're all built with the same boil and palette, so the whole is judged as it stands. Each chapter's draft page goes
up as it's done. Then the whole film joins on one page, with chapter markers, about 55 minutes long.
*Recommend:* build them in story order, and leave the look alone until you've watched the whole thing.
**Curt:**

