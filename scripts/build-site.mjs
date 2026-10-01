import { cp, mkdir, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = path.join(root, 'dist');
// dist is generated output. Only the listed website files are published.
const websiteFiles = [
  'index.html',
  'styles.css',
  'script.js',
  'site-config.js',
  'assets',
  'font-source',
  'FONT-LICENSES.txt',
  '.nojekyll'
];

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
for (const name of websiteFiles) {
  await cp(path.join(root, name), path.join(output, name), { recursive: true });
}
console.log('Website prepared in dist/. Ready for GitHub Pages or Firebase Hosting.');
