#!/usr/bin/env node
/**
 * verify-i18n.js
 * Run: node verify-i18n.js
 *
 * Checks:
 *  1. All locale files are valid JSON
 *  2. All locales have the same keys as English (no missing / extra)
 *  3. Total string count meets the 100-string minimum
 *  4. No empty translation values
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const LOCALES_DIR = join(__dirname, 'src/i18n/locales');
const LOCALES = ['en', 'hi', 'gu'];
const MIN_STRINGS = 100;

let pass = 0, fail = 0;

function ok(msg)   { console.log(`  ✓  ${msg}`); pass++; }
function err(msg)  { console.error(`  ✗  ${msg}`); fail++; }
function head(msg) { console.log(`\n── ${msg} ──`); }

// ── Load & parse ────────────────────────────────────────────
head('Loading locale files');
const data = {};
for (const locale of LOCALES) {
  try {
    const raw = readFileSync(join(LOCALES_DIR, `${locale}.json`), 'utf8');
    data[locale] = JSON.parse(raw);
    ok(`${locale}.json — valid JSON`);
  } catch (e) {
    err(`${locale}.json — ${e.message}`);
    process.exit(1);
  }
}

// ── Flatten helper ──────────────────────────────────────────
function flatten(obj, prefix = '') {
  return Object.entries(obj).reduce((acc, [k, v]) => {
    const key = prefix ? `${prefix}.${k}` : k;
    if (typeof v === 'object' && v !== null) Object.assign(acc, flatten(v, key));
    else acc[key] = v;
    return acc;
  }, {});
}

const flat = {};
for (const locale of LOCALES) flat[locale] = flatten(data[locale]);

// ── String count ────────────────────────────────────────────
head('String counts');
for (const locale of LOCALES) {
  const count = Object.keys(flat[locale]).length;
  if (count >= MIN_STRINGS) ok(`${locale}: ${count} strings (≥ ${MIN_STRINGS})`);
  else err(`${locale}: only ${count} strings — need at least ${MIN_STRINGS}`);
}

// ── Key parity ──────────────────────────────────────────────
head('Key parity (all locales vs en)');
const enKeys = new Set(Object.keys(flat.en));
for (const locale of ['hi', 'gu']) {
  const keys = new Set(Object.keys(flat[locale]));
  const missing = [...enKeys].filter((k) => !keys.has(k));
  const extra   = [...keys].filter((k) => !enKeys.has(k));

  if (missing.length === 0 && extra.length === 0) {
    ok(`${locale}: all ${keys.size} keys match en`);
  } else {
    if (missing.length) err(`${locale}: missing keys — ${missing.join(', ')}`);
    if (extra.length)   err(`${locale}: extra keys — ${extra.join(', ')}`);
  }
}

// ── Empty values ────────────────────────────────────────────
head('No empty values');
for (const locale of LOCALES) {
  const empty = Object.entries(flat[locale]).filter(([, v]) => !v || v.trim() === '');
  if (empty.length === 0) ok(`${locale}: no empty values`);
  else err(`${locale}: ${empty.length} empty — ${empty.map(([k]) => k).join(', ')}`);
}

// ── Summary ─────────────────────────────────────────────────
console.log(`\n${'─'.repeat(40)}`);
console.log(`  ${pass} passed   ${fail} failed`);
console.log(`${'─'.repeat(40)}\n`);
if (fail > 0) process.exit(1);
