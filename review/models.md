# Models that watch and listen

Curt asked for models I can use to put quick questions to the rendered audio and video. Today I can look at still
frames, but I can't hear anything and I can't see motion. This sheet sets out every kind of model that could fill that
gap, matches them to the questions Curt picked, and says what I need to set them up. Written 2026-11-01. The trial
on 2026-11-02, with what worked and what didn't, is [§5](#5-the-trial-2026-11-02).

**Curt's answers so far:**
- **Questions that matter:** does it make sense; the look (colour, flicker); sync and clarity; picture against board;
  continuity.
- **Budget:** keep a running total, and stop and tell Curt if it passes $10.
- **Where answers go:** to me only. I use them while I work and report what matters.

---

## 1. The kinds of model

**1.1 Measurements, no model.** ffmpeg and a little code, run on the draft or the frames.
- **Sound:** loudness per chapter and per line (EBU R128), silences, and spectrograms. A spectrogram is an image, so I
  can read it.
- **Picture:** for each shot, how much colour there is, how much the still parts shimmer from frame to frame, and where
  the cuts fall. The shimmer can be drawn as a map that shows where the boil is strongest.
- **Good for:** the look and the levels, as numbers that don't drift. Before and after a change, such as the boil fix in
  Round 6 §1.2, they show exactly what moved.
- **Not for:** whether it makes sense, or whether it's good.
- **Cost:** free and private.

**1.2 Transcribers.** A transcriber turns the finished mix back into words, with times.
- **What it shows:** compared with the script, it shows which words are lost under music or effects, and when each word
  lands against its board cue.
- **ElevenLabs Scribe:** uses the account Curt already has. It gives word times and tags sound events. It costs
  credits.
- **Whisper on this Mac:** free and private, a few minutes per chapter.

**1.3 Decision models.** These are new this year, and Curt named two of them.
- **How they answer:** you give one a state, which can be text, frames or sound, and typed questions. It answers with
  probabilities, not prose. There are a few kinds of question:
  - yes/no ("noul"): a probability that it's true;
  - choice: one option from a set;
  - score: a level on a scale;
  - box: where something is in the frame.
- **Strengths:**
  - They're very cheap and fast.
  - Their probabilities are calibrated, so I can set a threshold and only look at what falls below it.
  - The same question gets the same answer, so they work as regression checks.
- **Weaknesses:**
  - They give no reasons and no timestamps. To get timestamps, I cut the input into pieces myself.
  - They're weak judges of whether a story makes sense.

| model | from | takes | runs | cost |
|---|---|---|---|---|
| **Jev** 1.14 | TypeSafe, through OpenRouter | text and still images; **no sound or video** | hosted | $0.042 per million tokens in, nothing out |
| **d1-Omni-2B** | Liquid AI | text, images, **video as frames, and sound**; even spoken questions | **on this Mac** (2B parameters, 2.7 GB for MLX) | free; open weights (LFM Open License) |
| d1-2B | Liquid AI | text, images, video as frames | on this Mac | free |
| d1-omni-600M | Liquid AI | text with images, or text with up to 30 s of sound | on this Mac | free; marked experimental |
| d1-ultra, Perplexity Decider, Celeris-1 | various | text and images | hosted | about Jev's price |
| Jev-Omni | community | text, images, sound, video | needs a CUDA GPU and about 50 GB | not on this Mac |

- **Evidence so far:** a September paper (JEVQA, Robitza) used Jev with no training to rate video quality from tables of
  measurements. Its ratings matched the standard metric fairly well, a correlation of 0.74 to 0.82, but models trained
  for the task did better. That's the pattern I'd expect here. They're good for sorting and flagging, and they don't
  replace a look.
- **d1-Omni-2B is the one that fits this project:** it hears, it sees motion, and it runs here at no cost.
- **What I couldn't confirm about d1-Omni-2B:**
  - whether it takes a clip's picture and its sound in one question;
  - how many frames it takes;
  - whether the Mac route (MLX) works yet: its model card says that support is "in progress", and the documented route
    is Python with transformers.

**1.4 Models that watch and answer in words.** These take a whole video with its sound and answer in prose, with
timestamps.
- **Good for:** the hardest question, whether it makes sense. I can ask one to watch a chapter as a first-time viewer
  and retell it, then compare the retelling with the logline.
- **Gemini** is the only one I found with a hosted API that takes video and sound together.

| model | in, per million tokens | an hour of film (about 1.1 million tokens) | chapter 5 (about 9 min) |
|---|---|---|---|
| Gemini 3.8 Flash | $0.75 to Dec 31, then $1.50 | about $0.80, then $1.60 | about $0.12 |
| Gemini 3.1 Pro (preview) | $2.00; $4.00 over 200k tokens | about $4.30 | about $0.35 |

  Video counts as about 300 tokens a second at default resolution, by Google's estimate. On the paid tier, Google
  doesn't use what you send to train; on the free tier it does.
- **Other providers:** OpenAI's audio models hear but don't watch video. Open omni models are too big to run here while
  the renders are going: Qwen3-Omni, Nemotron 3 Nano Omni, and the Gemma 4 that's on disk (9.6 GB, though Ollama doesn't
  list it).

**1.5 Me.** I already check frames and contact sheets myself. With 1.1 I can also read spectrograms and shimmer maps.
That's free, but I still can't hear the film.

## 2. Which model for which question

| question | first check | second opinion |
|---|---|---|
| **Does it make sense?** | Gemini Flash watches a chapter and retells it; I compare the retelling with the board's logline | Gemini Pro once on the whole film, then a decision model scores each retelling against the logline |
| **The look: colour, flicker** | measurements per shot (1.1), as a ruler for Round 6 §1 | d1 or Jev scores frames for "reads as monochrome"; d1 on clips for "distracting flicker" |
| **Sync and clarity** | Whisper on the mix compared with the script; loudness per chapter | d1-Omni-2B on 30-second windows: "is the voice clear over the music?" |
| **Picture against board** | for every `reads` line in every board, the frame at its time, and a yes/no question to a decision model: "this frame shows: …" | I look at anything that scores low |
| **Continuity** | frames of each recurring character and place across chapters, side by side, for me | a decision model on pairs: "same design?"; Gemini on the joins between chapters |

"Picture against board" suits decision models best. The film has about 600 board reads, and checking all of them on
Jev costs a few cents, or nothing on d1. I'd rerun it after every change.

## 3. Recommendation

Build it in layers, behind one command (`npm run ask`). Every call is logged with its cost to a running total, and the
command refuses any call that would take the total past $10 and tells Curt.

1. **Measurements and Whisper.** Free; I can start as soon as the renders finish.
2. **d1-Omni-2B on this Mac** for the bulk typed checks: board reads, clarity windows, flicker clips. Jev through
   OpenRouter is the hosted cross-check, and the fallback if d1 won't run here.
3. **Gemini Flash** for whether it makes sense, and for anything that needs an answer in words with times. Pro only for
   the one whole-film pass.

A full pass of everything comes to roughly $2 to $3 now, mostly Gemini. That's well under $10.

## 4. What I need

**4.1 Billing on the Gemini key's project.** The key is saved as `gemini-api`, but it's on Google's free tier: its
project has no billing. On the free tier the calls hit tight limits, and Google may use what's sent to train its
models (§5.5).
- **What's needed:** in AI Studio, open the project the key belongs to and set up billing. The key itself stays the
  same.
- **Then:** I run chapter 5 through Gemini first, about $0.15, and the whole film after, about $1.

**Curt:** added the key, 2026-11-02. Billing: waiting.

**4.2 An OpenRouter key, for Jev.** **Done** (saved as `openrouter`, 2026-11-02).

**4.3 Downloading d1-Omni-2B.** **Done.** It's 4.1 GB, in the Hugging Face cache. I read the LFM Open License v1.0
first:
- It's free to use, commercially too, for anyone under $10 million a year in revenue.
- It says nothing about what the model's answers are used for, so checking a film for YouTube is fine.
- It asks for its notices to be kept if the model is passed on, and we don't pass it on.

I also read the model's bundled Python code (it runs with `trust_remote_code`): it makes no network, shell or file
calls. The tool loads that exact revision from the cache, offline.

## 5. The trial, 2026-11-02

**What's built:** `npm run ask`, in `tools/ask.mjs`, with `tools/hear.py` (Whisper) and `tools/d1.py` (d1).
- **Commands:** `total`, `measure N`, `hear N`, `board N`, `frame N`, `clips N` and `watch N`. The header of
  `tools/ask.mjs` says what each does.
- **Answers:** they land in `out/ask/`, which isn't committed.
- **The ledger:** every paid call goes through it. It estimates the call first, refuses one that would pass $10, then
  records what the call cost.

**Spent: $0.23 of $10.**
- **Jev:** $0.05, for about 700 questions over the whole film.
- **Gemini:** $0.18. That's one call that timed out on my side, logged at its estimate in case it was billed. Since the
  key turned out to be on the free tier, it probably cost nothing.

Every check below has run on all twelve chapters.

**5.1 Measurements: they work, as a ruler.** They give loudness, colour and boil per shot; the boil is the change
between frames that shows at full size but not when the frame is shrunk to a thumbnail. By chapter, weighted by time:

| ch | loudness | colour | vivid colour | boil |
|---|---|---|---|---|
| 0 | −14.4 LUFS | 9.3 | 11.6 | 0.98 |
| 1 | −14.4 | 11.8 | 13.3 | 1.26 |
| 2 | −14.4 | 6.7 | 8.4 | 0.83 |
| 3 | −14.3 | 12.9 | 15.4 | 1.88 |
| 4 | −14.7 | **15.3** | **19.0** | **2.69** |
| 5 | −14.7 | 8.8 | 13.3 | 1.58 |
| 6 | −14.4 | 8.3 | 15.2 | 0.87 |
| 7 | −14.6 | 6.9 | 9.0 | 1.12 |
| 8 | −14.7 | 8.4 | 10.2 | 0.48 |
| 9 | −14.5 | 9.1 | 11.7 | 0.59 |
| 10 | −14.5 | 4.8 | 9.7 | 0.78 |
| 11 | −14.4 | 11.3 | 13.4 | 0.95 |

- **Loudness:** level across the film, within half a decibel.
- **Colour:** mostly the paper's warmth. "Vivid" is the colour of the most saturated tenth of each frame.
- **What it shows:** chapter 4 (the council) is the most colourful and boils the most; chapters 8 and 9 boil least.
- **What it's for:** the before-and-after for the boil fix in Round 6 §1.2.

**5.2 Whisper: it works, heard line by line.**
- **The first run went wrong.** Over a whole chapter at once, Whisper dropped whole sentences: up to a third of
  chapters 1, 3 and 11. I first took that for the mix burying the voice.
- **What fixed it:** each of those lines, heard on its own, came back clean. So it now hears each line in pieces of at
  most 15 seconds, and is told the story's names.
- **The mix is clear throughout:** 0 to 3% of words go unheard in every chapter, and those are names, numbers and
  spellings ("10,000" against "ten thousand", "mentatype").
- **Sync holds:** Whisper's word starts sit 0.12 to 0.15 s before the alignment's in every chapter. That gap is the
  same everywhere, so it's how the two measure, not drift.

**5.3 Jev, picture against board: it works for whole shots, asked as a choice.**
- **How it's asked:** a yes/no score runs low on long descriptions, so each shot's description is put against three
  decoys from shots elsewhere in the chapter. The check fails where a decoy wins.
- **Calibration:** given one frame and two descriptions, Jev picked its own shot's for 38 of 39 frames in chapter 5.
- **Over the film:** 150 of 187 shots are recognised from their own board frame.
- **The misses:** I looked at 19 of the 37, and 11 are real:
  - close shots that aren't close at the board's time: chapter 5's C (F-1's lenses cut off at the top), M, S and AB,
    and chapter 8's C;
  - figures too small to read: the games on chapter 1's plaza, and chapter 6's motes;
  - a count or scale the board names but the frame doesn't show: chapter 7's six machines (two are seen), and chapter
    9's "sphere, grown".
- **False alarms:** the rest match on a look, for example Kahsh's collar (chapter 4) and the magazine page (chapter
  11).
- **The reads:** checked one by one, they're too terse ("F-2", "the second"), and the decoys are often true as well.
  About 60% are recognised, and the misses don't tell much.
- **Cost:** about a cent a chapter.

**5.4 d1-Omni-2B: it runs here, but it isn't a useful judge yet.**
- **How it runs:** on the Mac's GPU. It loads in 14 s and answers in about a second. A chapter's 150 or so questions
  take 4 minutes. It takes a clip's frames and its sound in one question.
- **Is the voice clear?** It ranks windows sensibly, but its scores sit between 0.56 and 0.83, and it finds nothing
  that Whisper misses.
- **Flicker:** it follows the measured boil only loosely (a rank correlation of 0.44 over 187 shots). The measurement
  is the better ruler.
- **Does the shot show what's said?** No signal: 0.5 to 0.6 everywhere, and unrelated to Jev's shot check (0.02).
- **For now:** parked. It's there for a question about movement that a still can't answer, tested on a known case
  first.

**5.5 Gemini: not run yet.**
- **Why:** the key is on the free tier (§4.1).
- **The first attempt:** it uploaded chapter 5's draft, and timed out on my side before an answer came. It may have
  been processed under free-tier terms. The upload is deleted.
- **What the tool does now:** it stops as soon as it sees a free-tier key, and deletes its upload even after an
  error.
- **Retrying:** 3.8 Flash was also refusing calls for high demand much of the morning. The tool retries those, which
  aren't billed.

**Where that leaves §3:** the working set is the measurements, Whisper and Jev's shot check. Together they cost about
$0.15 for the whole film. Gemini follows once billing is on, for "does it make sense"; nothing here answers that yet.

## Claude's open concerns

- **Five of the trial's findings are about the film, not the tools:** the close shots that aren't close, small figures,
  and two counts. They belong with the acting and framing pass (Round 6 §2.2).
- **Gemini sees the unreleased film, and may already have, on the free tier.** I'll send nothing more until billing is
  on.
- **§1 to §3 were from reading.** §5 corrects them where the trial disagreed. In particular, Jev's numbers need asking
  as choices, and d1 is weaker than its card suggests.
- **The models are judges, not taste.** They'll give a steady ruler for colour and flicker, but whether the look is
  right is still Curt's call.

Sources: [OpenRouter on Jev](https://openrouter.ai/blog/insights/what-is-jev/),
[decision-model rankings](https://benchlm.ai/decision-models), [JEVQA](https://arxiv.org/pdf/2609.24395),
[d1-2B](https://huggingface.co/LiquidAI/d1-2B), [d1-Omni-2B for MLX](https://huggingface.co/LiquidAI/d1-Omni-2B-MLX-8bit),
[d1-omni-600M](https://huggingface.co/LiquidAI/d1-omni-600M), [Gemini pricing](https://ai.google.dev/gemini-api/docs/pricing).
