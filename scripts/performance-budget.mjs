import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const baseline = JSON.parse(await fs.readFile('docs/performance/baseline.json', 'utf8')).results;
const current = JSON.parse(await fs.readFile('docs/performance/revision.json', 'utf8')).results;
const median = (rows, key) =>
  rows.map((row) => row[key]).sort((a, b) => a - b)[Math.floor(rows.length / 2)];
for (const profile of ['desktop', 'mobile-4x-slow4g']) {
  const rows = current.filter((row) => row.profile === profile),
    before = baseline.filter((row) => row.profile === profile);
  assert.ok(rows.length >= 3, 'Three cold runs/profile are required');
  const mobile = profile.startsWith('mobile');
  assert.ok(median(rows, 'javaScriptGzip') <= 335000, `${profile}: JavaScript budget exceeded`);
  assert.ok(
    median(rows, 'lcp') <= median(before, 'lcp') + 250,
    `${profile}: LCP regression exceeds 250 ms on this lab profile`,
  );
  assert.ok(median(rows, 'lcp') <= 2500, `${profile}: LCP exceeds 2.5 seconds`);
  assert.ok(median(rows, 'cls') <= 0.02, `${profile}: CLS budget exceeded`);
  assert.ok(
    median(rows, 'interactionMs') <= 100,
    `${profile}: lab interaction sample exceeds 100 ms`,
  );
  assert.ok(
    median(rows, 'longTaskMs') <= (mobile ? 400 : 250),
    `${profile}: startup long-task budget exceeded`,
  );
  assert.ok(median(rows, 'frameP95Ms') <= 50, `${profile}: browser frame interval budget exceeded`);
  for (const row of rows) {
    assert.equal(row.canvas, true, 'Both profiles must render the 3D scene');
    if (row.gpu?.drawCalls) assert.ok(Number(row.gpu.drawCalls) <= 8);
    if (row.gpu?.triangles) assert.ok(Number(row.gpu.triangles) <= 8000);
  }
  console.log(
    `${profile}: measured budgets pass / LCP ${median(rows, 'lcp')} ms, JS gzip ${median(rows, 'javaScriptGzip')} bytes`,
  );
}
console.log('Checks saved lab reports only. Rerun the production benchmark after a scene change.');
