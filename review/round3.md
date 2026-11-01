# Round 3: casting and sound

This round is mostly for your ears. I can't hear the candidates, so I don't recommend voices or a motif. What I could
check, I did: every candidate was run through speech-to-text and compared with the words it was given, and the page
flags any that dropped or garbled words. Where something other than taste decides, there's a recommendation.

**To listen:** open the pages on the site, or locally after `npm start` (http://localhost:8077/review/round3/):
- [Casting](https://curtcox.github.io/The-Last-Evolution/review/round3/): 13 roles with 3 voices each. Pick one per
  role, and the bar at the bottom gathers your picks into one line to paste back. Picks are kept in the browser you
  made them in, so the site and localhost each keep their own.
- [Sound](https://curtcox.github.io/The-Last-Evolution/review/round3/sound.html): the motif (three directions) and nine
  effect sketches.

The gate closes when every role is cast, the motif is chosen and the full voice pass is done (PLAN.md §9). The full pass
comes after your picks.

---

## 1. The cast

**1.1 Pick a voice for each role.** Every candidate is new: ElevenLabs Voice Design made it from the description in
[script/casting.yaml](../script/casting.yaml), and none imitates a real person. What each one read is under "What they
read". Speech-to-text found three real misreadings, flagged on the page:
- **X-5638, A and C** say "four screen" for "force-screen". B reads it right.
- **The power plant, B** drops the P ("our ready"). A and C are right.

Some marks on the page aren't really misses: "Roal" heard as "Ro" or "Roll", and *mentatype* transcribed as one word.
"None of these" sends a role back for another three voices; tell me what to change in its description.
**Curt:** none of these for the force-sphere: more ethereal.
**Claude:** redesigned. The new description asks for an ethereal, airy, distant, floating voice with a faint shimmer,
still cool and aloof. All three new candidates read their line correctly, and they take it more slowly than the first
three (15 to 19 seconds for the two takes, against 12 to 14). The page now shows them, and a pick or "none" saved for
the old three is cleared.
**Curt:**

**1.2 One voice for F-2.** The plan has the narrator and the F-2 of the scenes as one voice: young (raw) in the scenes,
old (treated) as the narrator. The narrator's candidates read narration and one of F-2's scene speeches (p088), so you
can hear both treatments of the same voice.
*Recommend:* keep one voice. If no candidate works both ways, cast the narrator first; I'll design the young F-2 to
match.
**Curt:**

## 2. The treatments

These are processed copies of the same clips, made with ffmpeg, so changing one doesn't mean re-voicing anything. Each
is a starting point; say "more", "less" or "none".

**2.1 The narrator's age** (the "old" button): about 3% lower, a little slower, a faint flutter, a narrower band, and a
little room.
**Curt:**

**2.2 Thought-speech** (the beings of force, "as thought"): chorus and a soft double echo. In the film, the newborn
F-2's first words and F-2's vow get it too.
**Curt:**

**2.3 The machines** ("machine"): a slow, light flanger, a narrower band, and a short metallic echo. It's meant to stay
under the words, not over them.
**Curt:**

## 3. Sound

**3.1 The motif.**
- A, *wistful*: theremin over muted strings.
- B, *cosmic*: theremin over celesta, harp and vibraphone.
- C, *monumental*: theremin over organ and timpani.

Each is heard alone and "at a chapter's head", fading under the scratch narrator. The chosen one gets a title version
and a credits version.
**Curt:**

**3.2 The effects.** There are nine sketches: the workshop, F-2's birth, F-1's fall, the green and violet beams, the power
plant, the storm, the red beam and the golden sphere. Mark each keep, redo (and how) or drop. The final cues and levels
are set in the pilot.
**Curt:**

**3.3 Rights to the generated music and effects.** ElevenLabs allows commercial use of what it generates on paid
plans, under terms that vary by plan. A monetised YouTube film counts as commercial use. I can't see your plan, since
the key can't read the account.
*Recommend:* check that your plan covers commercial use of music and sound effects before release. The film can carry
an AI-generated credit either way.
**Curt:**

## 4. The voice pass (after your picks)

**4.1 Model.** The account has Eleven v4, the newest, as well as v3 and Multilingual v2, which the scratch voice used.
*Recommend:* **v4.** Once the narrator is picked, I'll voice one paragraph with v3 and v4 so you can confirm by ear
before the full pass.
**Curt:**

**4.2 Pace.** The scratch voices ran at 153 words a minute. The plan's narrator is unhurried.
*Recommend:* aim for about **135 words a minute for the narrator** (about 52 minutes for the film), and let dialogue
run at its natural pace. Set it by ear on the pilot chapter.
**Curt:**

**4.3 Saving the voices.** Your picks are previews until they're saved to your ElevenLabs account, one voice slot each,
13 at most. The ids are kept in `script/casting_candidates.json`. If the account runs out of slots, I'll say so before
saving anything.
*Recommend:* save the picks as soon as you've made them, since I don't know how long previews stay available.
**Curt:**
