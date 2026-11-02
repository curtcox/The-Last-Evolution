# Round 3: casting and sound

**Closed 2026-11-01: Curt chose the cast and accepted the other recommendations.** The decisions are logged in
[DECISIONS.md](../DECISIONS.md).

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
**Curt:** narrator C, roal B, trest A, kahsh B, cr21 B, x5638 B, x6349 A, x6621 B, f1 B, cru1 A, plant C, sphere1 C,
golden B.
**Claude:** recorded in `script/cast.yaml` (`pick`). Both flagged misreadings were avoided: X-5638 B and the power
plant C read their lines right. Six are saved to the account: the narrator, Roal, Trest, Kahsh, C-R-21 and X-5638.
The account then refused the seventh: its plan allows **10 custom voices**, and four were already taken by the clones
on it. The other seven (X-6349, X-6621, F-1, C-R-U-1, the power plant, the force-sphere, the golden sphere) are still
previews, which may not stay available for long. To save them, the account needs seven free slots: either a plan with
more (ElevenLabs' Creator plan has 30, and the full voice pass needs a bigger character allowance anyway: the film is
about 40,000 characters before retakes), or room made by deleting voices on the account you no longer need. Deleting
is yours to decide; I haven't touched the voices that were there. Once there's room, `npm run save-cast` with the line
above saves the rest.
**Curt:** I'll upgrade the plan. … It's upgraded.
**Claude:** the other seven are saved. All thirteen are on the account now, each named "TLE" and its role, with its id
in `script/cast.yaml`.

**1.2 One voice for F-2.** The plan has the narrator and the F-2 of the scenes as one voice: young (raw) in the scenes,
old (treated) as the narrator. The narrator's candidates read narration and one of F-2's scene speeches (p088), so you
can hear both treatments of the same voice.
*Recommend:* keep one voice. If no candidate works both ways, cast the narrator first; I'll design the young F-2 to
match.
**Claude:** done that way for now: F-2 in the scenes uses the narrator's voice (C), raw. Say if you'd rather have a
young F-2 of its own.
**Curt:**

## 2. The treatments

These are processed copies of the same clips, made with ffmpeg, so changing one doesn't mean re-voicing anything. Each
is a starting point; say "more", "less" or "none".

**2.1 The narrator's age** (the "old" button): about 3% lower, a little slower, a faint flutter, a narrower band, and a
little room.
**Curt:** use your recommendations.
**Claude:** kept as they are, as the starting point; they're tuned by ear on the pilot. With the treatment on, v4 reads the narrator at 135 words a minute, the pace 4.2 aimed for.

**2.2 Thought-speech** (the beings of force, "as thought"): chorus and a soft double echo. In the film, the newborn
F-2's first words and F-2's vow get it too.
**Curt:** use your recommendations.
**Claude:** kept as it is, for the newborn F-2, F-2's vow, the force-sphere and the golden sphere; tuned on the pilot.

**2.3 The machines** ("machine"): a slow, light flanger, a narrower band, and a short metallic echo. It's meant to stay
under the words, not over them.
**Curt:** use your recommendations.
**Claude:** kept as it is; tuned on the pilot.

## 3. Sound

**3.1 The motif.**
- A, *wistful*: theremin over muted strings.
- B, *cosmic*: theremin over celesta, harp and vibraphone.
- C, *monumental*: theremin over organ and timpani.

Each is heard alone and "at a chapter's head", fading under the scratch narrator. The chosen one gets a title version
and a credits version.
**Curt:** use your recommendations.
**Claude:** I hadn't recommended one, since I can't hear them, so this is from the brief, not by ear: **A, wistful.** The story is
an elegy, told by the last of its kind, and muted strings sit closest to that voice. B's glitter belongs to the golden
sphere and the frame, and C's organ to the machines, so both may still serve as colour under those scenes. To keep one
tune through the film, the title, the credits and the chapter heads are all cut from one longer piece generated in A's
manner, on [the sound page](https://curtcox.github.io/The-Last-Evolution/review/round3/sound.html). Change it freely
before the pilot; nothing is locked to it yet.

**3.2 The effects.** There are nine sketches: the workshop, F-2's birth, F-1's fall, the green and violet beams, the power
plant, the storm, the red beam and the golden sphere. Mark each keep, redo (and how) or drop. The final cues and levels
are set in the pilot.
**Curt:** use your recommendations.
**Claude:** all nine kept as sketches for now. The pilot sets their final cues and levels, and redoes any that don't sit in the mix.

**3.3 Rights to the generated music and effects.** ElevenLabs allows commercial use of what it generates on paid
plans, under terms that vary by plan. A monetised YouTube film counts as commercial use. I can't see your plan, since
the key can't read the account.
*Recommend:* check that your plan covers commercial use of music and sound effects before release. The film can carry
an AI-generated credit either way.
**Curt:** use your recommendations.
**Claude:** after your upgrade, it's worth one look at the plan's terms for commercial use of music and effects before release. It's on the release checklist rather than blocking anything now.

## 4. The voice pass (after your picks)

**4.1 Model.** The account has Eleven v4, the newest, as well as v3 and Multilingual v2, which the scratch voice used.
*Recommend:* **v4.** Once the narrator is picked, I'll voice one paragraph with v3 and v4 so you can confirm by ear
before the full pass.
**Claude:** [the voice trial](https://curtcox.github.io/The-Last-Evolution/review/round3/trial.html) is up: chapter
1's opening paragraph in the narrator's voice, and part of the council (the narrator, X-5638, Roal and C-R-21), each in
v3 and v4, with the treatments on. Speech-to-text found every word in both narrator takes. Still recommend v4.
**Curt:** use your recommendations.
**Claude:** v4 for the full pass.

**4.2 Pace.** The scratch voices ran at 153 words a minute. The plan's narrator is unhurried.
*Recommend:* aim for about **135 words a minute for the narrator** (about 52 minutes for the film), and let dialogue
run at its natural pace. Set it by ear on the pilot chapter.
**Claude:** with the old treatment on, v4 reads the narrator at **135 words a minute** on its own, right on the
target; v3 at 122. v4 ignored a request to slow down, so the pace will be adjusted, if it needs it, by the narrator's
treatment rather than the model.
**Curt:** use your recommendations.
**Claude:** v4's own pace with the old treatment, about 135; the voice pass measured it across the whole film (below).

**4.3 Saving the voices.** Your picks are previews until they're saved to your ElevenLabs account, one voice slot each,
13 at most. The ids are kept in `script/casting_candidates.json`. If the account runs out of slots, I'll say so before
saving anything.
*Recommend:* save the picks as soon as you've made them, since I don't know how long previews stay available.
**Claude:** six saved; the account ran out of slots for the other seven (see 1.1). I couldn't check the limit
beforehand, since the key can't read the account's plan, so the six went before the refusal said so. After your
upgrade, the other seven are saved too (see 1.1).
**Curt:** use your recommendations.

**4.4 The voice pass.** [The whole story in the cast's voices](https://curtcox.github.io/The-Last-Evolution/review/round3/voice.html),
chapter by chapter, in Eleven v4 with the treatments on. The masters are committed in `assets/voice/`, since voicing
again costs credits and never comes out the same. The numbers are in `script/reports/voice.md`:
- **About 55 minutes.** The narrator runs at 127 words a minute over the whole film, a little slower than the 135
  measured on one paragraph in the trial. Dialogue runs at 138.
- **Every line was checked by speech-to-text.** Five were voiced again for dropped or garbled words. Two are still
  flagged: "memory-minds" heard as "memory mines" (p014) and F-1's "Roal—" heard as "Roald" (p052). Each read the same
  way over four takes, so it's probably the transcriber mishearing, not the voice.

*Recommend:* listen to a chapter or two, and in particular to the two flagged lines, then say which lines to redo and
how. A redo is `npm run voice -- --retake=<line id>`. Keep the narrator's slower pace: it suits the "unhurried" memoir,
and the pilot can tighten the silences between lines if the film runs long.
**Curt:**
