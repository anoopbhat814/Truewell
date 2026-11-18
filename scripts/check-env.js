#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');

function parseEnv(text) {
  return Object.fromEntries(
    text
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l && !l.startsWith('#') && l.includes('='))
      .map((l) => [l.slice(0, l.indexOf('=')), l.slice(l.indexOf('=') + 1)]),
  );
}

const examplePath = path.join(root, '.env.example');
const envPath = path.join(root, '.env');
const required = Object.keys(parseEnv(fs.readFileSync(examplePath, 'utf8')));

const actual = fs.existsSync(envPath) ? parseEnv(fs.readFileSync(envPath, 'utf8')) : {};
const merged = { ...actual, ...Object.fromEntries(Object.entries(process.env).filter(([k]) => required.includes(k))) };
const missing = required.filter((k) => !merged[k]);
const weak = ['TRUEWELL_JWT_SECRET', 'TRUEWELL_VIDEO_SIGNING_KEY'].filter((k) => merged[k] && /change-?me|dev-only/.test(merged[k]));

if (missing.length) {
  console.error(`Missing environment variables: ${missing.join(', ')}`);
  process.exit(1);
}
if (merged.TRUEWELL_ENVIRONMENT === 'production' && weak.length) {
  console.error(`Refusing to run in production with default secrets: ${weak.join(', ')}`);
  process.exit(1);
}
console.info(`Environment OK (${required.length} variables checked).`);
