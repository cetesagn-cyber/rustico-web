import fs from 'node:fs';

const nextUrl = process.argv[2]?.replace(/\/+$/, '');

if (!nextUrl || !/^https?:\/\/[^ ]+$/i.test(nextUrl)) {
  console.error('Uso: npm run site:url -- https://usuario.github.io/repositorio');
  process.exit(1);
}

const files = [
  'index.html',
  'privacidad.html',
  'cookies.html',
  'terminos.html',
  'robots.txt',
  'sitemap.xml',
];

const currentPatterns = [
  /http:\/\/127\.0\.0\.1:8090/g,
  /http:\/\/localhost:8090/g,
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  for (const pattern of currentPatterns) {
    content = content.replace(pattern, nextUrl);
  }
  fs.writeFileSync(file, content);
}

console.log(`URL de produccion aplicada: ${nextUrl}`);
