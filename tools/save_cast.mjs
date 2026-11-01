// save_cast.mjs: saves Round 3's picks as voices on the ElevenLabs account and records them in script/cast.yaml.
//   node tools/save_cast.mjs "narrator C, roal B, …"   the line the casting page gathers (with or without "Round 3 picks:")
// Each pick is a Voice Design preview (its id in script/casting_candidates.json) until it's saved; saved, it takes one
// voice slot and keeps its voice id for good. A role already saved with the same pick is left alone, so it's safe to
// re-run. The narrator's voice is also F-2's in the scenes (Round 3, 1.2): young (raw) there, old (treated) narrating.
import { readFileSync, writeFileSync } from 'node:fs';
import YAML from 'yaml';
import { eleven } from './eleven.mjs';
import { PATHS } from './script_lib.mjs';

const line = process.argv.slice(2).join(' ').replace(/^.*picks:\s*/i, '');
const picks = Object.fromEntries(line.split(',').map(s => s.trim().split(/\s+/)).filter(p => p.length === 2));
if (!Object.keys(picks).length) { console.error('usage: node tools/save_cast.mjs "narrator C, roal B, …"'); process.exit(1); }
const cands = JSON.parse(readFileSync('script/casting_candidates.json', 'utf8'));
const brief = YAML.parse(readFileSync('script/casting.yaml', 'utf8'));
const doc = YAML.parseDocument(readFileSync(PATHS.cast, 'utf8'));
const save = () => writeFileSync(PATHS.cast, doc.toString({ lineWidth: 0 }));

// every pick is recorded first, saved or not; a saved voice keeps its preview's id, so `voice` is set only once it's saved
for (const [role, k] of Object.entries(picks)) {
  if (!cands[role]?.candidates[k]) { console.error(`${role} ${k}: no such candidate`); process.exit(1); }
  if (doc.getIn([role, 'pick']) !== k) { doc.setIn([role, 'pick'], k); doc.deleteIn([role, 'voice']); if (role === 'narrator') doc.deleteIn(['f2', 'voice']); }
}
save();
for (const [role, k] of Object.entries(picks)) {
  const c = cands[role].candidates[k];
  if (doc.getIn([role, 'voice']) === c.generated_voice_id) { console.log(`${role}: already saved`); continue; }
  const name = `TLE ${doc.getIn([role, 'name'])}`.slice(0, 100);
  const desc = brief[role].about.replace(/\s+/g, ' ').slice(0, 1000);
  let v;
  try { v = await eleven('text-to-voice', { method: 'POST', body: { voice_name: name, voice_description: desc, generated_voice_id: c.generated_voice_id,
    labels: { project: 'the-last-evolution', role } } }); }
  catch (e) {
    if (!/voice_limit_reached/.test(e.message)) throw e;
    const left = Object.keys(picks).filter(r => !doc.getIn([r, 'voice']));
    console.error(`the account's custom-voice slots are full (${e.message.match(/\d+ \/ \d+/)?.[0] || 'none free'}); not yet saved: ${left.join(', ')}`);
    process.exit(2);
  }
  doc.setIn([role, 'voice'], v.voice_id);
  if (role === 'narrator') doc.setIn(['f2', 'voice'], v.voice_id);
  save();   // after each, so a failure (no slots left) keeps what's done
  console.log(`${role}: ${k} saved as "${name}"`);
}
