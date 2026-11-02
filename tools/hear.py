# hear.py: Whisper's words, with times, for ask.mjs's hear.
#   uv run --with faster-whisper python3 -I tools/hear.py in.wav out.json [model] [hotwords] [windows.json]
# Writes [[word, start, end, probability], ...]. Runs on the CPU, int8. With windows ([[t0, t1], ...], one per spoken
# line) each is heard on its own: over a whole chapter Whisper skips long stretches under music (chapter 11's last
# lines came back empty that way, and clear when heard alone).
import json, sys, wave
import numpy as np
from faster_whisper import WhisperModel

wav, out = sys.argv[1], sys.argv[2]
model = WhisperModel(sys.argv[3] if len(sys.argv) > 3 else 'small.en', device='cpu', compute_type='int8')
hot = sys.argv[4] if len(sys.argv) > 4 else None  # the story's names, which Whisper otherwise mishears
with wave.open(wav) as w:  # 16 kHz mono s16 from ffmpeg; read here, not through PyAV
    audio = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32) / 32768
windows = json.load(open(sys.argv[5])) if len(sys.argv) > 5 else [[0, len(audio) / 16000]]
words = []
for t0, t1 in windows:
    clip = audio[int(t0 * 16000):int(t1 * 16000)]
    segments, _ = model.transcribe(clip, word_timestamps=True, vad_filter=False, beam_size=5, condition_on_previous_text=False, hotwords=hot)
    words += [[w.word.strip(), round(t0 + w.start, 3), round(t0 + w.end, 3), round(w.probability, 3)] for s in segments for w in s.words]
json.dump(words, open(out, 'w'))
print(f'{len(words)} words heard')
