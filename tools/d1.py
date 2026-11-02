# d1.py: Liquid AI's d1-Omni-2B on this Mac, for ask.mjs.   uv run --with ... python3 -I tools/d1.py requests.json answers.json
# Loads the model once (from the Hugging Face cache, on the GPU through MPS) and answers a batch of requests:
#   {"id": ..., "state": text or null, "questions": {...},
#    "video": {"path": mp4, "t0": s, "t1": s, "fps": 4, "width": 384},   frames cut by ffmpeg, as PIL images
#    "audio": {"path": mp4 or wav, "t0": s, "t1": s},                      16 kHz mono, cut by ffmpeg
#    "image": jpg}
# Writes {"id": answers, ...} and prints one line per request. The model's own code (trust_remote_code) was read before
# it was first run here: it makes no network, shell or file calls.
import io, json, os, subprocess, sys, time
os.environ['HF_HUB_OFFLINE'] = '1'  # from the cache only: never fetch a newer copy of the model's code
import numpy as np
import torch
from PIL import Image
from transformers import AutoModel

MODEL, REVISION = 'LiquidAI/d1-Omni-2B', '431f1d667de5afcc9b0c58b2d9c170a7b38b358b'  # the revision whose code was read


def frames(v):
    w, fps = v.get('width', 384), v.get('fps', 4)
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-ss', str(v['t0']), '-t', str(v['t1'] - v['t0']), '-i', v['path'],
                          '-vf', f'fps={fps},scale={w}:-2', '-f', 'image2pipe', '-c:v', 'png', '-'],
                         check=True, capture_output=True).stdout
    out, i = [], 0
    while i < len(raw):  # split the PNG stream at each file's end chunk
        j = raw.index(b'IEND', i) + 8
        out.append(Image.open(io.BytesIO(raw[i:j])).convert('RGB'))
        i = j
    return out, fps


def sound(a):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-ss', str(a['t0']), '-t', str(a['t1'] - a['t0']), '-i', a['path'],
                          '-vn', '-ac', '1', '-ar', '16000', '-f', 's16le', '-'], check=True, capture_output=True).stdout
    return np.frombuffer(raw, np.int16).astype(np.float32) / 32768


def main():
    reqs = json.load(open(sys.argv[1]))
    device = 'mps' if torch.backends.mps.is_available() else 'cpu'
    t = time.time()
    model = AutoModel.from_pretrained(MODEL, revision=REVISION, trust_remote_code=True, dtype=torch.bfloat16 if device == 'mps' else torch.float32).to(device)
    print(f'd1 loaded on {device} in {time.time() - t:.0f} s', flush=True)
    answers = {}
    for r in reqs:
        media = []
        if r.get('video'):
            f, fps = frames(r['video'])
            media.append({'type': 'video', 'video': f, 'fps': fps})
        if r.get('audio'):
            media.append({'type': 'audio', 'audio': sound(r['audio']), 'sampling_rate': 16000})
        if r.get('image'):
            media.append(Image.open(r['image']).convert('RGB'))
        t = time.time()
        out = model.system_one(r.get('state'), r['questions'], media=media or None)
        answers[r['id']] = out['answers']
        brief = {k: round(v.get('noul', v.get('score', v.get('number', 0))) or 0, 3) if isinstance(v, dict) else v for k, v in out['answers'].items()}
        print(f"{r['id']}: {brief}  ({time.time() - t:.1f} s)", flush=True)
    json.dump(answers, open(sys.argv[2], 'w'), indent=1, default=lambda o: o.tolist() if hasattr(o, 'tolist') else str(o))


main()
