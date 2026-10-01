import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const index = args.indexOf(name);
  return index >= 0 && args[index + 1] ? args[index + 1] : fallback;
};
const port = Number(flag('--port', process.env.PORT || '4173'));
const host = flag('--host', '0.0.0.0');
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.woff': 'font/woff', '.svg': 'image/svg+xml' };
http.createServer(async (request, response) => {
  try {
    const url = new URL(request.url, 'http://preview.local');
    const pathname = decodeURIComponent(url.pathname);
    // Development-only responsive inspection. This server is not deployed.
    if (pathname === '/__preview') {
      const desired = Number(url.searchParams.get('width'));
      const width = [320, 390, 768, 1024].includes(desired) ? desired : 390;
      response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
      response.end(`<!doctype html><html><head><title>Responsive check</title><style>body{margin:0;padding:20px;background:#e8ebf0;font:14px Arial}nav{margin-bottom:18px;display:flex;gap:20px}a{color:#124fc4}iframe{display:block;width:${width}px;height:850px;border:0;background:white}</style></head><body><nav><a href="/__preview?width=320">320px</a><a href="/__preview?width=390">390px</a><a href="/__preview?width=768">768px</a><a href="/__preview?width=1024">1024px</a><a href="/">Desktop</a></nav><iframe src="/" title="Homepage responsive preview"></iframe></body></html>`);
      return;
    }
    const requested = path.resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
    if (!requested.startsWith(root)) {
      response.writeHead(403).end('Forbidden');
      return;
    }
    const bytes = await readFile(requested);
    response.writeHead(200, { 'Content-Type': types[path.extname(requested)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    response.end(bytes);
  } catch {
    response.writeHead(404, { 'Content-Type': 'text/plain' }).end('Page not found');
  }
}).listen(port, host, () => console.log(`Heavenly Helpers preview ready on port ${port}`));
