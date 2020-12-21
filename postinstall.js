const fs = require('fs');
const path = require('path');
const Diff = require('diff');

const patchPath = path.join(__dirname, 'puppeteer.patch');
const patchStr = fs.readFileSync(patchPath, 'utf-8');
const patch = Diff.parsePatch(patchStr);
const targetPath = path.join(
  __dirname,
  'node_modules/storycrawler/node_modules/puppeteer-core/lib/cjs/puppeteer/common/Coverage.js',
);

let orig;
let p;
try {
  orig = fs.readFileSync(targetPath, 'utf-8');
  p = targetPath;
} catch {
  const pcorebase = require.resolve('puppeteer-core');
  p = path.resolve(path.dirname(pcorebase), './lib/cjs/puppeteer/common/Coverage.js');
  orig = fs.readFileSync(p, 'urf-8');
}
if (orig) {
  const patched = Diff.applyPatch(orig, patch);
  if (patched) {
    fs.writeFileSync(p, patched, 'utf-8');
  }
} else {
  process.exit(1);
}
