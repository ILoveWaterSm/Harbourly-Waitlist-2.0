// Renders every state of a built page at desktop (1440) and phone (390) width for the canvas.
// Usage: node design/tools/render.mjs <builtPage.html> <outDir> <framePrefix>
// Google Fonts requests are fetched with curl (which trusts the proxy CA) and handed to the browser.
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';
const require = createRequire(import.meta.url);
let pw; try { pw = require('playwright'); } catch { pw = require(execSync('npm root -g').toString().trim() + '/playwright'); }
const { chromium } = pw;
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const [, , page, outDir, prefix] = process.argv;
fs.mkdirSync(outDir, { recursive: true });
const cache = new Map();
function curl(url) {
  if (!cache.has(url)) cache.set(url, execFileSync('curl', ['-sSL', '-A', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0 Safari/537.36', url], { maxBuffer: 1 << 26 }));
  return cache.get(url);
}
const browser = await chromium.launch();
const widths = { desktop: 1440, phone: 390 };
const done = [];
for (const [wname, w] of Object.entries(widths)) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, deviceScaleFactor: 2 });
  await ctx.route(/fonts\.(googleapis|gstatic)\.com/, async (route) => {
    const url = route.request().url();
    const body = curl(url);
    const type = url.includes('googleapis') ? 'text/css' : 'font/woff2';
    await route.fulfill({ status: 200, body, headers: { 'content-type': type, 'access-control-allow-origin': '*' } });
  });
  const p = await ctx.newPage();
  await p.goto('file://' + path.resolve(page));
  await p.evaluate(() => document.body.classList.add('mk-capture'));
  const states = await p.evaluate(() => window.mk.states.filter((s) => s.id !== 'all'));
  for (const s of states) {
    await p.evaluate(([id, wn]) => window.mk.set(id, wn), [s.id, wname]);
    await p.evaluate(() => document.fonts.ready);
    await p.waitForTimeout(250);
    const file = path.join(outDir, `${prefix}__${s.id}__${wname}.png`);
    await p.screenshot({ path: file, fullPage: true });
    done.push({ file, state: s.label, width: wname });
  }
  await ctx.close();
}
await browser.close();
console.log(JSON.stringify(done, null, 1));
