// Builds a publishable copy of a design page: inlines local stylesheets and scripts,
// and rewrites local images to their basename (published alongside as supporting files).
// Usage: node design/tools/build.mjs design/pages/0.2-components.html <outDir>
import fs from 'node:fs';
import path from 'node:path';

const [, , pagePath, outDir] = process.argv;
const pageDir = path.dirname(path.resolve(pagePath));
let html = fs.readFileSync(pagePath, 'utf8');
const assets = new Set();
const isLocal = (u) => !/^(https?:|data:|#)/.test(u);

html = html.replace(/<link rel="stylesheet" href="([^"]+)">/g, (m, href) =>
  isLocal(href) ? `<style>/* ${path.basename(href)} */\n${fs.readFileSync(path.resolve(pageDir, href), 'utf8')}</style>` : m);
html = html.replace(/<script src="([^"]+)"><\/script>/g, (m, src) =>
  isLocal(src) ? `<script>/* ${path.basename(src)} */\n${fs.readFileSync(path.resolve(pageDir, src), 'utf8')}</script>` : m);
html = html.replace(/src="([^"]+\.(?:png|jpe?g|webp|svg))"/g, (m, src) => {
  if (!isLocal(src)) return m;
  const abs = path.resolve(pageDir, src);
  assets.add(abs);
  return `src="${path.basename(abs)}"`;
});
html = html.replace(/<!-- page -->\n?/, '');

fs.mkdirSync(outDir, { recursive: true });
const out = path.join(outDir, path.basename(pagePath));
fs.writeFileSync(out, html);
for (const a of assets) fs.copyFileSync(a, path.join(outDir, path.basename(a)));
console.log(JSON.stringify({ page: out, assets: [...assets].map((a) => path.basename(a)) }));
