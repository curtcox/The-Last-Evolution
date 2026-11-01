# The Last Evolution

A voiced, painted film of John W. Campbell, Jr.'s 1932 story *The Last Evolution*, read in full, and its companion site:
https://curtcox.github.io/The-Last-Evolution/

## Try it

```bash
npm start
```

This extracts the story, builds the site, and opens it at http://localhost:8077/. The studio, for scrubbing scenes, is at
http://localhost:8077/studio/. You need Node.js 20 or newer; making the film also needs Google Chrome and ffmpeg.

## What's where

| path | what it is |
|---|---|
| [PLAN.md](PLAN.md) | The plan: the film, the site, the phases, and how we iterate until we're both satisfied |
| [DECISIONS.md](DECISIONS.md) | Every settled decision, with its date and who made it |
| [text/](text/) | The Gutenberg file, unmodified, with its checksum; the story extracted from it ([story.md](text/story.md)) |
| [assets/ref/](assets/ref/README.md) | Scans of the August 1932 printing, including Leo Morey's illustration, and their copyright status |
| [src/](src/) | The painting engine (from the Claude Animation Base) and the scenes |
| [tools/](tools/) | Story extraction, the site builder, the local server, the ElevenLabs key check |
| [render.mjs](render.mjs) | The headless renderer: contact sheets, strips, stills, video |
| [ANIMATION_GUIDE.md](ANIMATION_GUIDE.md) | The kit's guide to painting and timing (without its Clawd sections) |

## Credits

- Story: John W. Campbell, Jr., *Amazing Stories*, August 1932. Text from
  [Project Gutenberg #27462](https://www.gutenberg.org/ebooks/27462). Public domain in the US.
- Illustration: Leo Morey, the same issue. Public domain in the US.
- Painting kit: [Claude Animation Base](https://github.com/JohnHeibel/ClaudeAnimationBase) by John Heibel (MIT).
- Tools adapted from [axol-f](https://github.com/curtcox/axol-f) (MIT).
