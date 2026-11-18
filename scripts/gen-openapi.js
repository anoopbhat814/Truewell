#!/usr/bin/env node
'use strict';

// Fetches the OpenAPI document from a running API and writes docs/openapi.json plus a Markdown route table.
const fs = require('node:fs');
const path = require('node:path');

const base = process.env.TRUEWELL_API_URL || 'http://localhost:8000';
const outDir = path.resolve(__dirname, '..', 'docs');

async function main() {
  const res = await fetch(`${base}/openapi.json`);
  if (!res.ok) throw new Error(`OpenAPI request failed: ${res.status}`);
  const spec = await res.json();
  fs.writeFileSync(path.join(outDir, 'openapi.json'), `${JSON.stringify(spec, null, 2)}\n`);

  const rows = [];
  for (const [route, methods] of Object.entries(spec.paths).sort(([a], [b]) => a.localeCompare(b))) {
    for (const [method, op] of Object.entries(methods)) {
      rows.push(`| ${method.toUpperCase()} | \`${route}\` | ${op.summary || op.operationId || ''} |`);
    }
  }
  const table = ['| Method | Path | Summary |', '| --- | --- | --- |', ...rows].join('\n');
  fs.writeFileSync(path.join(outDir, 'routes.md'), `${table}\n`);
  console.info(`Wrote ${rows.length} routes.`);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
