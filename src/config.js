// config.js: project settings.
//   duration: the video's length in seconds.
//   bpm:      the pulse that idles and pulse() follow. The film has no music bed, so it's an unhurried one.
// A chapter (studio.html?chapter=N, from Phase 5) will take its length from its generated timeline; until then, the
// toolchain's smoke test (src/scenes/smoke.js).
const PROJECT = window.CHAPTER ? { duration: CHAPTER.duration, bpm: 72, offset: 0 } : { duration: 8, bpm: 72, offset: 0 };
