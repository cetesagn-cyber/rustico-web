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

const clamp = (value) => Math.max(0, Math.min(255, Math.round(value)));
const mix = (a, b, t) => a + (b - a) * t;

function removeWhiteBackground(image) {
  image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
    const r = this.bitmap.data[idx + 0];
    const g = this.bitmap.data[idx + 1];
    const b = this.bitmap.data[idx + 2];
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const whiteDistance = Math.sqrt((255 - r) ** 2 + (255 - g) ** 2 + (255 - b) ** 2);
    const isNeutral = max - min < 26;

    if (whiteDistance < 22) {
      this.bitmap.data[idx + 3] = 0;
      return;
    }

    if (isNeutral && whiteDistance < 86) {
      const alpha = Math.min(255, Math.round(((whiteDistance - 22) / 64) * 255));
      this.bitmap.data[idx + 3] = Math.min(this.bitmap.data[idx + 3], alpha);
    }
  });
  return image;
}

function alphaBounds(image, threshold = 12, pad = 20) {
  let minX = image.bitmap.width;
  let minY = image.bitmap.height;
  let maxX = 0;
  let maxY = 0;

  image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
    if (this.bitmap.data[idx + 3] > threshold) {
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    }
  });

  if (minX > maxX || minY > maxY) {
    return { x: 0, y: 0, w: image.bitmap.width, h: image.bitmap.height };
  }

  const x = Math.max(0, minX - pad);
  const y = Math.max(0, minY - pad);
  const right = Math.min(image.bitmap.width, maxX + pad);
  const bottom = Math.min(image.bitmap.height, maxY + pad);
  return { x, y, w: right - x, h: bottom - y };
}

function goldTone(luminance, shine) {
  const t = Math.max(0, Math.min(1, (luminance - 20) / 215));
  const dark = [112, 72, 12];
  const mid = [214, 164, 52];
  const light = [255, 231, 142];
  const high = [255, 248, 207];
  const a = t < 0.56 ? dark : mid;
  const b = t < 0.56 ? mid : light;
  const localT = t < 0.56 ? t / 0.56 : (t - 0.56) / 0.44;
  let rgb = [mix(a[0], b[0], localT), mix(a[1], b[1], localT), mix(a[2], b[2], localT)];
  if (shine > 0.72) rgb = rgb.map((v, i) => mix(v, high[i], (shine - 0.72) / 0.28));
  return rgb;
}

function recolorBrandGold(image) {
  const h = image.bitmap.height;
  image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
    const alpha = this.bitmap.data[idx + 3];
    if (alpha < 8) return;

    const r = this.bitmap.data[idx + 0];
    const g = this.bitmap.data[idx + 1];
    const b = this.bitmap.data[idx + 2];
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    const blueLetter = b > 72 && b > r * 1.28 && b > g * 1.05;
    const subtitleZone = y > h * 0.70 && x > image.bitmap.width * 0.36 && max - min < 48 && lum > 42;
    const darkTextEdge = y > h * 0.68 && x > image.bitmap.width * 0.32 && lum > 24 && lum < 142 && max - min < 58;

    if (blueLetter || subtitleZone || darkTextEdge) {
      const shine = Math.max(r, g, b) / 255;
      const [nr, ng, nb] = goldTone(lum, shine);
      const edgeBoost = blueLetter ? 1.06 : 1.0;
      this.bitmap.data[idx + 0] = clamp(nr * edgeBoost);
      this.bitmap.data[idx + 1] = clamp(ng * edgeBoost);
      this.bitmap.data[idx + 2] = clamp(nb * edgeBoost);
    }
  });
  return image;
}

function enhanceDefinition(image) {
  const src = Buffer.from(image.bitmap.data);
  const { width, height, data } = image.bitmap;
  const kernel = [
    0, -0.65, 0,
    -0.65, 3.6, -0.65,
    0, -0.65, 0,
  ];

  for (let y = 1; y < height - 1; y += 1) {
    for (let x = 1; x < width - 1; x += 1) {
      const idx = (width * y + x) << 2;
      if (src[idx + 3] < 8) continue;

      for (let channel = 0; channel < 3; channel += 1) {
        let value = 0;
        let k = 0;
        for (let yy = -1; yy <= 1; yy += 1) {
          for (let xx = -1; xx <= 1; xx += 1) {
            const nIdx = (width * (y + yy) + (x + xx)) << 2;
            value += src[nIdx + channel] * kernel[k];
            k += 1;
          }
        }
        data[idx + channel] = clamp(value);
      }

      data[idx + 3] = src[idx + 3];
    }
  }
  return image;
}

function containOnCanvas(image, width, height, background = 0x00000000) {
  const canvas = new Jimp({ width, height, color: background });
  const clone = image.clone();
  const scale = Math.min(width / clone.bitmap.width, height / clone.bitmap.height);
  clone.resize({ w: Math.round(clone.bitmap.width * scale) });
  if (clone.bitmap.height > height) clone.resize({ h: height });
  canvas.composite(clone, Math.round((width - clone.bitmap.width) / 2), Math.round((height - clone.bitmap.height) / 2));
  return canvas;
}

function containRaw(image, width, height) {
  const clone = image.clone();
  const scale = Math.min(width / clone.bitmap.width, height / clone.bitmap.height);
  clone.resize({ w: Math.round(clone.bitmap.width * scale) });
  if (clone.bitmap.height > height) clone.resize({ h: height });
  return clone;
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

const cutout = enhanceDefinition(recolorBrandGold(removeWhiteBackground(sourceImage.clone())));
const trimmed = cutout.crop(alphaBounds(cutout, 12, 18));

await write(containRaw(trimmed, 1000, 420), 'logo-rustico-web-gold.png');
await write(containOnCanvas(trimmed, 520, 210), 'logo-rustico-navbar-gold.png');
await write(containOnCanvas(trimmed, 640, 260), 'logo-rustico-footer-gold.png');

const ogBg = new Jimp({ width: 1200, height: 630, color: 0x07090fff });
ogBg.scan(0, 0, ogBg.bitmap.width, ogBg.bitmap.height, function(x, y, idx) {
  const vignette = Math.min(1, Math.hypot((x - 600) / 700, (y - 315) / 430));
  const glow = Math.max(0, 1 - vignette) * 34;
  this.bitmap.data[idx + 0] = clamp(7 + glow);
  this.bitmap.data[idx + 1] = clamp(9 + glow * 0.7);
  this.bitmap.data[idx + 2] = clamp(15 + glow * 0.18);
});
const ogLogo = containRaw(trimmed, 1040, 430);
ogBg.composite(ogLogo, Math.round((1200 - ogLogo.bitmap.width) / 2), Math.round((630 - ogLogo.bitmap.height) / 2));
await write(ogBg, 'logo-rustico-og-gold.png');

const iconCrop = sourceImage.clone().crop({ x: 0, y: 45, w: 520, h: 880 });
const iconCutout = enhanceDefinition(removeWhiteBackground(iconCrop));
const iconTrimmed = iconCutout.crop(alphaBounds(iconCutout, 12, 18));
const faviconBg = new Jimp({ width: 512, height: 512, color: 0x0c1220ff });
const icon = containRaw(iconTrimmed, 420, 420);
faviconBg.composite(icon, Math.round((512 - icon.bitmap.width) / 2), Math.round((512 - icon.bitmap.height) / 2));
await write(faviconBg, 'favicon-gold.png');

const appleBg = new Jimp({ width: 180, height: 180, color: 0x0c1220ff });
const appleIcon = containRaw(iconTrimmed, 146, 146);
appleBg.composite(appleIcon, Math.round((180 - appleIcon.bitmap.width) / 2), Math.round((180 - appleIcon.bitmap.height) / 2));
await write(appleBg, 'apple-touch-icon-gold.png');
