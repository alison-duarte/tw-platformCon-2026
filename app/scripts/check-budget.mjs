// Deterministic performance gate: the code needed for first paint must stay small.
// Tone.js and confetti are lazy chunks and are intentionally not counted here.
import { readFileSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = join(resolve(dirname(fileURLToPath(import.meta.url)), '..'), 'dist');
const BUDGET_KB = { entryJs: 40, entryCss: 8 };

const html = readFileSync(join(dist, 'index.html'), 'utf8');
const asset = (re) => {
  const match = html.match(re);
  if (!match) throw new Error(`Cannot find asset in dist/index.html: ${re}`);
  return join(dist, match[1]);
};
const gz = (file) => gzipSync(readFileSync(file)).length / 1024;

const sizes = {
  entryJs: gz(asset(/<script[^>]+src="\.\/(assets\/[^"]+\.js)"/)),
  entryCss: gz(asset(/<link[^>]+href="\.\/(assets\/[^"]+\.css)"/)),
};

let failed = false;
for (const [name, kb] of Object.entries(sizes)) {
  const limit = BUDGET_KB[name];
  const over = kb > limit;
  failed ||= over;
  console.log(`${over ? 'FAIL' : 'ok  '} ${name}: ${kb.toFixed(1)} kB gzip (budget ${limit} kB)`);
}
if (/modulepreload[^>]+(esm|tone)/i.test(html)) {
  failed = true;
  console.log('FAIL Tone.js must stay a lazy chunk, but index.html preloads it');
}
process.exit(failed ? 1 : 0);
