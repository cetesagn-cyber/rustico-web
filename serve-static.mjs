import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const port = Number(process.argv[2] || 8085);
const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.mp4': 'video/mp4',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
};

const publicFiles = new Set([
  '/index.html',
  '/privacidad.html',
  '/cookies.html',
  '/terminos.html',
  '/robots.txt',
  '/sitemap.xml',
]);

const securityHeaders = {
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' data: https://www.google.com https://maps.gstatic.com https://*.googleapis.com https://*.ggpht.com https://www.google-analytics.com https://www.googletagmanager.com",
    "media-src 'self'",
    "frame-src https://maps.google.com https://www.google.com",
    "connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com https://www.googletagmanager.com",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
    "frame-ancestors 'self'",
  ].join('; '),
  'Cross-Origin-Resource-Policy': 'same-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'SAMEORIGIN',
};

function isPublicPath(requestPath) {
  return publicFiles.has(requestPath) || requestPath.startsWith('/Rustico/');
}

http
  .createServer((req, res) => {
    let requestPath;
    try {
      requestPath = decodeURIComponent((req.url || '/').split('?')[0]);
    } catch {
      res.writeHead(400, securityHeaders);
      res.end('Bad request');
      return;
    }

    if (requestPath === '/' || requestPath === '') requestPath = '/index.html';
    if (!isPublicPath(requestPath)) {
      res.writeHead(404, securityHeaders);
      res.end('Not found');
      return;
    }

    const filePath = path.resolve(root, `.${requestPath}`);
    const relativePath = path.relative(root, filePath);
    if (relativePath.startsWith('..') || path.isAbsolute(relativePath)) {
      res.writeHead(403);
      res.end('Forbidden');
      return;
    }

    fs.readFile(filePath, (error, data) => {
      if (error) {
        res.writeHead(404);
        res.end('Not found');
        return;
      }

      const ext = path.extname(filePath).toLowerCase();
      const cacheControl = ext === '.html'
        ? 'no-cache'
        : 'public, max-age=31536000, immutable';

      res.writeHead(200, {
        ...securityHeaders,
        'Cache-Control': cacheControl,
        'Content-Type': types[ext] || 'application/octet-stream',
      });
      res.end(data);
    });
  })
  .listen(port, '127.0.0.1', () => {
    console.log(`Rustico static server: http://127.0.0.1:${port}`);
  });
