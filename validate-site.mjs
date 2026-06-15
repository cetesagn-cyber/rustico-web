import fs from 'node:fs';
import vm from 'node:vm';

const htmlFiles = ['index.html', 'privacidad.html', 'cookies.html', 'terminos.html'];
const requiredFiles = [
  ...htmlFiles,
  'robots.txt',
  'sitemap.xml',
  'serve-static.mjs',
  'Rustico/logo-rustico-web.png',
  'Rustico/logo-rustico-og.png',
];

const report = {
  requiredFiles: [],
  html: {},
  warnings: [],
};

for (const file of requiredFiles) {
  report.requiredFiles.push({ file, exists: fs.existsSync(file) });
}

for (const file of htmlFiles) {
  const html = fs.readFileSync(file, 'utf8');
  const scripts = [...html.matchAll(/<script(?![^>]*application\/ld\+json)[^>]*>([\s\S]*?)<\/script>/gi)]
    .map(match => match[1]);
  const failedScripts = scripts
    .map((code, index) => {
      try {
        new vm.Script(code);
        return null;
      } catch (error) {
        return { index, message: error.message };
      }
    })
    .filter(Boolean);
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map(match => match[1]);
  const duplicateIds = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
  const localUrls = [...html.matchAll(/(?:src|href|poster)="([^"]+)"|url\('([^']+)'\)/g)]
    .map(match => match[1] || match[2])
    .filter(Boolean)
    .filter(url => !/^(https?:|mailto:|tel:|#|data:)/i.test(url));
  const missingLocalUrls = [...new Set(localUrls.filter(url => {
    const normalized = decodeURIComponent(url.split('#')[0].split('?')[0]);
    return normalized && !fs.existsSync(normalized);
  }))];

  report.html[file] = {
    title: Boolean(html.match(/<title>.+<\/title>/i)),
    description: Boolean(html.match(/<meta name="description" content="[^"]+"/i)),
    scripts: scripts.length,
    failedScripts,
    duplicateIds,
    missingLocalUrls,
  };

  if (html.includes('href="#"')) {
    report.warnings.push(`${file} contains placeholder href="#" links.`);
  }
  if (/[\u00c3\u00c2\u00e2\u00f0\ufffd]/.test(html)) {
    report.warnings.push(`${file} may contain mojibake/encoding artifacts.`);
  }
  if (/pendiente/i.test(html)) {
    report.warnings.push(`${file} still contains legal or business data marked as pending.`);
  }
}

const index = fs.readFileSync('index.html', 'utf8');
if (index.includes('logo-rustico-4k-solid-clean.png')) {
  report.warnings.push('index.html references the 4K logo instead of the optimized web logo.');
}
if (index.includes('preload="auto"')) {
  report.warnings.push('A video still uses preload="auto".');
}
if (index.includes('127.0.0.1')) {
  report.warnings.push('Local 127.0.0.1 URLs remain. Replace them with the production GitHub Pages/domain URL before final SEO indexing.');
}

const hasFailures = report.requiredFiles.some(item => !item.exists)
  || Object.values(report.html).some(item => (
    item.failedScripts.length
    || item.duplicateIds.length
    || item.missingLocalUrls.length
  ));

console.log(JSON.stringify(report, null, 2));
if (hasFailures) process.exit(1);
