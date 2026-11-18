#!/usr/bin/env node
'use strict';

// Prints the CHANGELOG section for a version: node scripts/release-notes.js 0.6.0
const fs = require('node:fs');
const path = require('node:path');

const version = process.argv[2];
if (!version) {
  console.error('usage: release-notes.js <version>');
  process.exit(1);
}
const changelog = fs.readFileSync(path.resolve(__dirname, '..', 'CHANGELOG.md'), 'utf8').split('\n');
const start = changelog.findIndex((l) => l.startsWith(`## [${version}]`));
if (start === -1) {
  console.error(`No changelog entry for ${version}`);
  process.exit(1);
}
const end = changelog.findIndex((l, i) => i > start && l.startsWith('## ['));
console.info(changelog.slice(start + 1, end === -1 ? undefined : end).join('\n').trim());
