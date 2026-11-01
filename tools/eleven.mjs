// eleven.mjs: ElevenLabs for the film's tools. The API key is read at call time from the Mac's Keychain
// (service "elevenlabs", added with: security add-generic-password -a "$USER" -s elevenlabs -w), or from
// ELEVENLABS_API_KEY if that's set (e.g. on another machine). It's never printed, logged or written to a file.
//   node tools/eleven.mjs        says whether the key is there, and the account's character quota
import { execFileSync } from 'node:child_process';

let cached;
function key() {
  if (cached) return cached;
  cached = process.env.ELEVENLABS_API_KEY;
  if (!cached && process.platform === 'darwin')
    try { cached = execFileSync('security', ['find-generic-password', '-s', 'elevenlabs', '-w'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim(); } catch { }
  if (!cached) throw new Error('no ElevenLabs key: add it with  security add-generic-password -a "$USER" -s elevenlabs -w');
  return cached;
}

// a call to https://api.elevenlabs.io/v1/<path>: JSON back, or the raw bytes with { raw: true }; body is JSON, or a FormData
export async function eleven(path, { method = 'GET', body, raw = false } = {}) {
  const form = body instanceof FormData;   // a file upload (speech-to-text) goes as multipart, with its own content type
  const r = await fetch(`https://api.elevenlabs.io/v1/${path}`, { method, headers: { 'xi-api-key': key(), ...(body && !form ? { 'Content-Type': 'application/json' } : {}) },
    body: form ? body : body ? JSON.stringify(body) : undefined });
  if (!r.ok) throw new Error(`ElevenLabs ${method} ${path}: ${r.status} ${(await r.text()).slice(0, 300)}`);
  return raw ? Buffer.from(await r.arrayBuffer()) : r.json();
}

if (import.meta.url === `file://${process.argv[1]}`) {
  try {
    const s = await eleven('user/subscription');
    console.log(`key found; plan ${s.tier}: ${s.character_count.toLocaleString()} of ${s.character_limit.toLocaleString()} characters used this period (resets ${new Date(s.next_character_count_reset_unix * 1000).toISOString().slice(0, 10)})`);
  } catch (e) {
    // a key scoped without user_read can still voice lines; show that it works by listing voices instead
    if (!/user_read/.test(e.message)) throw e;
    const v = await eleven('voices');
    console.log(`key found and working (${v.voices.length} voices on the account); it can't read the quota, since it lacks the user_read permission`);
  }
}
