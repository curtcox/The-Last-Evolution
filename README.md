# The Last Evolution

A voiced, painted film of John W. Campbell, Jr.'s 1932 story *The Last Evolution*, read in full, and its companion site:
https://curtcox.github.io/The-Last-Evolution/

## Try it

```bash
npm start
```

This extracts the story, builds the script and checks it word for word, builds the site, and opens it at
http://localhost:8077/. The studio, for scrubbing scenes, is at http://localhost:8077/studio/. Once `npm run scratch` has
voiced it, Round 1's listening page is at http://localhost:8077/review/round1/. You need Node.js 20 or newer; making the film also needs Google Chrome and ffmpeg.

## What's where

| path | what it is |
|---|---|
| [PLAN.md](PLAN.md) | The plan: the film, the site, the phases, and how we iterate until we're both satisfied |
| [DECISIONS.md](DECISIONS.md) | Every settled decision, with its date and who made it |
| [text/](text/) | The Gutenberg file, unmodified, with its checksum; the story extracted from it ([story.md](text/story.md)) |
| [script/](script/) | The script: who speaks each quotation ([speakers.yaml](script/speakers.yaml)), the cast, the chapters, the respellings, and the generated [script.yaml](script/script.yaml) with its [reports](script/reports/) |
| [review/](review/) | Each review round's decision sheet, starting with [Round 1](review/round1.md) |
| [assets/ref/](assets/ref/README.md) | Scans of the August 1932 printing, including Leo Morey's illustration, and their copyright status |
| [src/](src/) | The painting engine (from the Claude Animation Base) and the scenes |
| [tools/](tools/) | Story extraction, the script builder and verbatim check, the scratch voice, the site builder, the local server, the ElevenLabs key check |
| [render.mjs](render.mjs) | The headless renderer: contact sheets, strips, stills, video |
| [ANIMATION_GUIDE.md](ANIMATION_GUIDE.md) | The kit's guide to painting and timing (without its Clawd sections) |

## Credits

- Story: John W. Campbell, Jr., *Amazing Stories*, August 1932. Text from
  [Project Gutenberg #27462](https://www.gutenberg.org/ebooks/27462). Public domain in the US.
- Illustration: Leo Morey, the same issue. Public domain in the US.
- Painting kit: [Claude Animation Base](https://github.com/JohnHeibel/ClaudeAnimationBase) by John Heibel (MIT).
- Tools adapted from [axol-f](https://github.com/curtcox/axol-f) (MIT).
