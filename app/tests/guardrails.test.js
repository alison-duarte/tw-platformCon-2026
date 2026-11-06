/**
 * Deterministic harness gates (skills: infosec guardrails, brand, architecture).
 * These fail the build regardless of what any prompt or reviewer says.
 */
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(ROOT, 'src');

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}
const files = walk(SRC);
const js = files.filter((f) => f.endsWith('.js'));
const layerOf = (file) => relative(SRC, file).split('/')[0];

// Which layers each layer may import. Features may also use their own folder.
const ALLOWED = {
  kernel: ['kernel'],
  content: ['content'],
  domain: ['domain'],
  application: ['application', 'domain', 'kernel'],
  infrastructure: ['infrastructure', 'application', 'domain'],
  features: ['kernel'],
  composition: ['composition', 'application', 'content', 'infrastructure', 'kernel'],
};

test('dependency rule: layers only import what they are allowed to', () => {
  for (const file of js) {
    const layer = layerOf(file);
    if (!ALLOWED[layer]) continue; // main.js is the entry point
    const source = readFileSync(file, 'utf8');
    for (const [, spec] of source.matchAll(/(?:\bfrom|\bimport\s*\(?)\s*['"](\.[^'"]+)['"]/g)) {
      const target = resolve(dirname(file), spec);
      if (!target.startsWith(SRC)) continue;
      const targetLayer = layerOf(target);
      if (layer === 'features' && targetLayer === 'features') {
        const sameFeature = relative(SRC, target).split('/')[1] === relative(SRC, file).split('/')[1];
        assert.ok(sameFeature, `${relative(ROOT, file)} imports another feature: ${spec}`);
        continue;
      }
      // composition may lazy-load features
      if (layer === 'composition' && targetLayer === 'features') continue;
      assert.ok(ALLOWED[layer].includes(targetLayer), `${relative(ROOT, file)} (${layer}) must not import ${targetLayer}: ${spec}`);
    }
  }
});

test('domain and kernel stay free of browser and third-party APIs', () => {
  for (const file of js.filter((f) => ['domain', 'kernel'].includes(layerOf(f)) && !f.endsWith('dom.js'))) {
    const source = readFileSync(file, 'utf8');
    assert.doesNotMatch(source, /\b(document|window|localStorage|navigator)\b/, relative(ROOT, file));
    assert.doesNotMatch(source, /from\s+['"][^.]/, `${relative(ROOT, file)} imports a package`);
  }
});

test('no innerHTML/outerHTML/insertAdjacentHTML/eval (XSS guardrail)', () => {
  for (const file of js) {
    assert.doesNotMatch(readFileSync(file, 'utf8'), /\.(innerHTML|outerHTML)\b|insertAdjacentHTML|\beval\(|new Function\(/, relative(ROOT, file));
  }
});

test('no remote scripts, styles or fonts in the shell or sources', () => {
  const sources = [...files, join(ROOT, 'index.html')];
  for (const file of sources) {
    const text = readFileSync(file, 'utf8');
    assert.doesNotMatch(text, /(src|href)=["']https?:\/\//, relative(ROOT, file));
    assert.doesNotMatch(text, /https?:\/\/(cdn|fonts|unpkg|cdnjs)\./, relative(ROOT, file));
  }
});

test('no hardcoded secrets', () => {
  const pattern = /(api[_-]?key|secret|passwd|password|token)\s*[:=]\s*['"][^'"]{6,}['"]|AKIA[0-9A-Z]{16}|-----BEGIN [A-Z ]*PRIVATE KEY-----/i;
  for (const file of files) assert.doesNotMatch(readFileSync(file, 'utf8'), pattern, relative(ROOT, file));
});

test('brand: user-facing copy has no em dashes and no wrong company spelling', () => {
  for (const file of files.filter((f) => layerOf(f) === 'content')) {
    const text = readFileSync(file, 'utf8');
    assert.doesNotMatch(text, /—/, `${relative(ROOT, file)} contains an em dash`);
    assert.doesNotMatch(text, /ThoughtWorks|Thought Works|\bTW\b/, relative(ROOT, file));
    assert.doesNotMatch(text, /\b(delve|unleash|empower|transformative|leverage|seamless|robust|holistic)\b/i, relative(ROOT, file));
  }
});

test('kiosk: viewport blocks zoom and base CSS blocks overscroll', () => {
  const html = readFileSync(join(ROOT, 'index.html'), 'utf8');
  assert.match(html, /user-scalable=no/);
  const css = readFileSync(join(SRC, 'styles/base.css'), 'utf8');
  assert.match(css, /overscroll-behavior:\s*none/);
  assert.match(css, /--tap|min-height:\s*var\(--tap\)/);
});

test('kiosk: tap target token is at least 48px', () => {
  const tokens = readFileSync(join(SRC, 'styles/tokens.css'), 'utf8');
  const px = Number(tokens.match(/--tap:\s*(\d+)px/)?.[1]);
  assert.ok(px >= 48);
});

test('brand palette tokens match the brand skill', () => {
  const tokens = readFileSync(join(SRC, 'styles/tokens.css'), 'utf8').toUpperCase();
  for (const hex of ['#F2617A', '#003D4C', '#0F172A', '#E2E8F0', '#F8FAFC', '#F3A712', '#00A389']) {
    assert.ok(tokens.includes(hex), hex);
  }
});

