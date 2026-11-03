import { createRequire } from 'node:module';
import fs from 'node:fs/promises';
// Reuse the image processor already supplied by Next.js; no new dependency.
const require = createRequire(import.meta.resolve('next/package.json'));
const sharp = require('sharp');
const transparent = 'public/Logo Tristan NoBg.png';
const background = 'public/Logo Tristan.png';
await fs.mkdir('public/brand', { recursive: true });
const { data: mark, info } = await sharp(transparent).trim().toBuffer({ resolveWithObject: true });
await sharp(mark)
  .resize({ width: 192 })
  .webp({ lossless: true })
  .toFile('public/brand/tristan-mark.webp');
const square = (size) =>
  sharp(mark).resize(size, size, { fit: 'contain', background: '#00000000' }).png();
await square(512).toFile('src/app/icon.png');
const pngs = await Promise.all([16, 32, 48].map((size) => square(size).toBuffer()));
const header = Buffer.alloc(6 + pngs.length * 16);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(pngs.length, 4);
let offset = header.length;
pngs.forEach((png, index) => {
  const entry = 6 + index * 16;
  header[entry] = header[entry + 1] = [16, 32, 48][index];
  header.writeUInt16LE(1, entry + 4);
  header.writeUInt16LE(32, entry + 6);
  header.writeUInt32LE(png.length, entry + 8);
  header.writeUInt32LE(offset, entry + 12);
  offset += png.length;
});
await fs.writeFile('src/app/favicon.ico', Buffer.concat([header, ...pngs]));
// Crop the supplied opaque artwork around the same mark for Apple home screens.
await sharp(background)
  .extract({
    left: -info.trimOffsetLeft,
    top: -info.trimOffsetTop,
    width: info.width,
    height: info.height,
  })
  .resize(132, 132, { fit: 'contain', background: '#0a0c14' })
  .extend({ top: 24, bottom: 24, left: 24, right: 24, background: '#0a0c14' })
  .png()
  .toFile('src/app/apple-icon.png');
console.log(
  'Generated transparent navbar mark, favicon (16/32/48), icon (512) and Apple icon (180).',
);
