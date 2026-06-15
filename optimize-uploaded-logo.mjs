import fs from 'node:fs';
import path from 'node:path';
import { Jimp } from 'jimp';

const source = process.argv[2] || 'Rustico/logo-rustico-source.png';
const sourcePath = path.resolve(source);

if (!fs.existsSync(sourcePath)) {
  console.error(`No existe el logo fuente: ${sourcePath}`);
  process.exit(1);
}

const outDir = path.resolve('Rustico');
const sourceImage = await Jimp.read(sourcePath);

function removeWhiteBackground(image) {
  image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
    const r = this.bitmap.data[idx + 0];
    const g = this.bitmap.data[idx + 1];
    const b = this.bitmap.data[idx + 2];
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const whiteDistance = Math.sqrt((255 - r) ** 2 + (255 - g) ** 2 + (255 - b) ** 2);
    const isNeutral = max - min < 24;

    if (whiteDistance < 18) {
      this.bitmap.data[idx + 3] = 0;
      return;
    }

    if (isNeutral && whiteDistance < 78) {
      const alpha = Math.min(255, Math.round(((whiteDistance - 18) / 60) * 255));
      this.bitmap.data[idx + 3] = Math.min(this.bitmap.data[idx + 3], alpha);
    }
  });
  return image;
}

function alphaBounds(image) {
  let minX = image.bitmap.width;
  let minY = image.bitmap.height;
  let maxX = 0;
  let maxY = 0;

  image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
    if (this.bitmap.data[idx + 3] > 12) {
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    }
  });

  if (minX > maxX || minY > maxY) {
    return { x: 0, y: 0, w: image.bitmap.width, h: image.bitmap.height };
  }

  const pad = 18;
  const x = Math.max(0, minX - pad);
  const y = Math.max(0, minY - pad);
  const right = Math.min(image.bitmap.width, maxX + pad);
  const bottom = Math.min(image.bitmap.height, maxY + pad);
  return { x, y, w: right - x, h: bottom - y };
}

function contain(image, width, height) {
  const clone = image.clone();
  const scale = Math.min(width / clone.bitmap.width, height / clone.bitmap.height);
  clone.resize({ w: Math.round(clone.bitmap.width * scale) });
  if (clone.bitmap.height > height) clone.resize({ h: height });
  return clone;
}

function cover(image, width, height) {
  const clone = image.clone();
  const scale = Math.max(width / clone.bitmap.width, height / clone.bitmap.height);
  clone.resize({ w: Math.round(clone.bitmap.width * scale) });
  if (clone.bitmap.height < height) clone.resize({ h: height });
  const x = Math.max(0, Math.floor((clone.bitmap.width - width) / 2));
  const y = Math.max(0, Math.floor((clone.bitmap.height - height) / 2));
  return clone.crop({ x, y, w: width, h: height });
}

async function write(image, file) {
  const target = path.join(outDir, file);
  await image.write(target);
  console.log(JSON.stringify({
    file: path.relative(process.cwd(), target),
    bytes: fs.statSync(target).size,
    width: image.bitmap.width,
    height: image.bitmap.height,
  }));
}

const cutout = removeWhiteBackground(sourceImage.clone());
const bounds = alphaBounds(cutout);
const trimmed = cutout.crop(bounds);

const web = contain(trimmed, 920, 260);
await write(web, 'logo-rustico-web.png');

const nav = contain(trimmed, 680, 170);
await write(nav, 'logo-rustico-navbar.png');

const footer = contain(trimmed, 760, 220);
await write(footer, 'logo-rustico-footer.png');

const ogBg = new Jimp({ width: 1200, height: 630, color: 0x07090fff });
ogBg.scan(0, 0, ogBg.bitmap.width, ogBg.bitmap.height, function(x, y, idx) {
  const vignette = Math.min(1, Math.hypot((x - 600) / 700, (y - 315) / 420));
  const goldWash = Math.max(0, 1 - vignette) * 16;
  this.bitmap.data[idx + 0] = Math.round(7 + goldWash);
  this.bitmap.data[idx + 1] = Math.round(9 + goldWash * 0.75);
  this.bitmap.data[idx + 2] = Math.round(15 + goldWash * 0.25);
});
const ogLogo = contain(trimmed, 1040, 340);
ogBg.composite(ogLogo, Math.round((1200 - ogLogo.bitmap.width) / 2), 145);
await write(ogBg, 'logo-rustico-og.png');

const iconCrop = sourceImage.clone().crop({ x: 0, y: 45, w: 520, h: 880 });
const iconCutout = removeWhiteBackground(iconCrop);
const iconTrimmed = iconCutout.crop(alphaBounds(iconCutout));
const faviconBg = new Jimp({ width: 512, height: 512, color: 0x0c1220ff });
const icon = contain(iconTrimmed, 405, 405);
faviconBg.composite(icon, Math.round((512 - icon.bitmap.width) / 2), Math.round((512 - icon.bitmap.height) / 2));
await write(faviconBg, 'favicon.png');

const appleBg = new Jimp({ width: 180, height: 180, color: 0x0c1220ff });
const appleIcon = contain(iconTrimmed, 142, 142);
appleBg.composite(appleIcon, Math.round((180 - appleIcon.bitmap.width) / 2), Math.round((180 - appleIcon.bitmap.height) / 2));
await write(appleBg, 'apple-touch-icon.png');
