# Models that watch and listen

Curt asked for models I can use to put quick questions to the rendered audio and video. Today I can look at still
frames, but I can't hear anything and I can't see motion. This sheet sets out every kind of model that could fill that
gap, matches them to the questions Curt picked, and says what I need to set them up. Written 2026-11-01.

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

**4.1 A Gemini key.** The Keychain item `gemini` (account `antigravity`) is rejected by the Gemini API. It's probably
for something else, so I won't touch it.
- **What's needed:** a key from AI Studio on a project with billing turned on.
- **Where it goes:** a new Keychain item, `gemini-api`. Running this prompts for the key, so it never appears on screen:

```bash
security add-generic-password -s gemini-api -a curt -w
```

**Curt:**

**4.2 An OpenRouter key, for Jev.** This is optional, and only needed for the hosted cross-check. Save it the same way,
as `openrouter`.
**Curt:**

**4.3 Downloading d1-Omni-2B.** It's 2.7 to 4 GB. The disk has 17 GB free, and the film's frames take much of that. I'd
download it after the renders finish. I'll read the LFM Open License first and report anything in it that touches a film
on YouTube.
**Curt:**

## Claude's open concerns

- **This is all from reading.** It comes from vendor pages, one paper and model cards, and I haven't run any of these
  models yet. The decision-model rankings I found are partly promotional. The first job is a small trial on chapter 5,
  with questions whose answers I already know.
- **The models are judges, not taste.** They'll give a steady ruler for colour and flicker, but whether the look is
  right is still Curt's call.
- **Gemini sees the unreleased film.** That's the cost of the one model that can say whether it makes sense.

Sources: [OpenRouter on Jev](https://openrouter.ai/blog/insights/what-is-jev/),
[decision-model rankings](https://benchlm.ai/decision-models), [JEVQA](https://arxiv.org/pdf/2609.24395),
[d1-2B](https://huggingface.co/LiquidAI/d1-2B), [d1-Omni-2B for MLX](https://huggingface.co/LiquidAI/d1-Omni-2B-MLX-8bit),
[d1-omni-600M](https://huggingface.co/LiquidAI/d1-omni-600M), [Gemini pricing](https://ai.google.dev/gemini-api/docs/pricing).
