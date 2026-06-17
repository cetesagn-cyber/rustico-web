import fs from 'node:fs';
import vm from 'node:vm';

const htmlFiles = ['index.html', 'privacidad.html', 'cookies.html', 'terminos.html'];
const report = {
  html: {},
  totals: {
    localReferences: 0,
    missingLocalReferences: 0,
    brokenHashLinks: 0,
    placeholderLinks: 0,
    unsafeBlankLinks: 0,
    mojibakeFiles: 0,
    loremFiles: 0,
  },
};

for (const file of htmlFiles) {
  const html = fs.readFileSync(file, 'utf8');
  const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map(match => match[1]));
  const localRefs = [...html.matchAll(/(?:src|href|poster)="([^"]+)"|url\('([^']+)'\)/g)]
    .map(match => match[1] || match[2])
    .filter(Boolean);
  const missingLocalReferences = [];
  const brokenHashLinks = [];

  for (const ref of localRefs) {
    if (ref === '#') continue;
    if (ref.startsWith('#')) {
      if (!ids.has(ref.slice(1))) brokenHashLinks.push(ref);
      continue;
    }
    if (/^(https?:|mailto:|tel:|data:)/i.test(ref)) continue;
    const normalized = decodeURIComponent(ref.split('#')[0].split('?')[0]);
    if (normalized && !fs.existsSync(normalized)) missingLocalReferences.push(ref);
  }

  const scripts = [...html.matchAll(/<script(?![^>]*application\/ld\+json)[^>]*>([\s\S]*?)<\/script>/gi)]
    .map(match => match[1]);
  const failedScripts = scripts.map((code, index) => {
    try {
      new vm.Script(code);
      return null;
    } catch (error) {
      return { index, message: error.message };
    }
  }).filter(Boolean);

  const placeholderLinks = (html.match(/href="#"/g) || []).length;
  const unsafeBlankLinks = [...html.matchAll(/<a\b[^>]*target="_blank"[^>]*>/gi)]
    .map(match => match[0])
    .filter(tag => !/\brel="[^"]*\bnoopener\b[^"]*\bnoreferrer\b[^"]*"/i.test(tag)
      && !/\brel="[^"]*\bnoreferrer\b[^"]*\bnoopener\b[^"]*"/i.test(tag));
  const hasMojibake = /(?:Ã|Â|â€|â•|â”|ðŸ|�)/.test(html);
  const hasLorem = /lorem ipsum/i.test(html);

  report.html[file] = {
    hasTitle: /<title>[^<]+<\/title>/i.test(html),
    hasDescription: /<meta name="description" content="[^"]+"/i.test(html),
    hasCanonical: /<link rel="canonical" href="[^"]+"/i.test(html),
    hasFavicon: /<link rel="icon"[^>]+href="[^"]+"/i.test(html),
    scripts: scripts.length,
    failedScripts,
    missingLocalReferences: [...new Set(missingLocalReferences)],
    brokenHashLinks: [...new Set(brokenHashLinks)],
    placeholderLinks,
    unsafeBlankLinks,
    hasMojibake,
    hasLorem,
  };

  report.totals.localReferences += localRefs.length;
  report.totals.missingLocalReferences += missingLocalReferences.length;
  report.totals.brokenHashLinks += brokenHashLinks.length;
  report.totals.placeholderLinks += placeholderLinks;
  report.totals.unsafeBlankLinks += unsafeBlankLinks.length;
  if (hasMojibake) report.totals.mojibakeFiles += 1;
  if (hasLorem) report.totals.loremFiles += 1;
}

console.log(JSON.stringify(report, null, 2));

const failed = Object.values(report.html).some(item => (
  !item.hasTitle
  || !item.hasDescription
  || !item.hasCanonical
  || !item.hasFavicon
  || item.failedScripts.length
  || item.missingLocalReferences.length
  || item.brokenHashLinks.length
  || item.placeholderLinks
  || item.unsafeBlankLinks.length
  || item.hasMojibake
  || item.hasLorem
));

if (failed) process.exit(1);
