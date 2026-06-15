import fs from 'node:fs';
import path from 'node:path';
import { Jimp } from 'jimp';

const source = path.resolve('Rustico/logo-rustico-4k-solid-clean.png');
const outputs = [
  { file: 'Rustico/logo-rustico-web.png', width: 720 },
  { file: 'Rustico/logo-rustico-og.png', width: 1200 },
];

const image = await Jimp.read(source);

for (const output of outputs) {
  const clone = image.clone();
  clone.resize({ w: output.width });
  const target = path.resolve(output.file);
  await clone.write(target);
  console.log(JSON.stringify({
    source,
    target,
    bytes: fs.statSync(target).size,
    width: clone.bitmap.width,
    height: clone.bitmap.height,
  }));
}
