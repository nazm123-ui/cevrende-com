import sharp from "sharp";
import { promises as fs } from "fs";
import path from "path";

const PUBLIC = "public";

// Logo: cream background with black circle containing a smaller cream dot.
function makeSvg(size, { padded = false, maskable = false }) {
  // Maskable: %20 safe zone (ikon kenarlardan biraz uzak, OS adaptive crop'a hazır)
  const dotRatio = maskable ? 0.55 : padded ? 0.7 : 0.82;
  const innerRatio = 0.27;
  const cx = size / 2;
  const cy = size / 2;
  const r = (size * dotRatio) / 2;
  const inner = (size * innerRatio) / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" fill="#fafaf7"/>
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="#0f1110"/>
  <circle cx="${cx}" cy="${cy}" r="${inner}" fill="#fafaf7"/>
</svg>`;
}

async function renderPng(svg, outPath) {
  const buffer = Buffer.from(svg);
  await sharp(buffer).png().toFile(outPath);
  console.log(`✓ ${outPath}`);
}

async function main() {
  await fs.mkdir(PUBLIC, { recursive: true });

  // Standart PWA ikonları
  const sizes = [
    { name: "icon-192.png", size: 192, opts: {} },
    { name: "icon-512.png", size: 512, opts: {} },
    { name: "icon-maskable-512.png", size: 512, opts: { maskable: true } },
    { name: "apple-touch-icon.png", size: 180, opts: { padded: true } },
    { name: "favicon-16.png", size: 16, opts: { padded: true } },
    { name: "favicon-32.png", size: 32, opts: { padded: true } },
    { name: "favicon-64.png", size: 64, opts: { padded: true } },
  ];

  for (const { name, size, opts } of sizes) {
    const svg = makeSvg(size, opts);
    await renderPng(svg, path.join(PUBLIC, name));
  }

  // Apple splash screens — sade krem bg ortada logo (kullanıcı app açarken görür)
  const splashes = [
    // iPhone 14, 15
    { name: "apple-splash-1170-2532.png", w: 1170, h: 2532 },
    // iPhone 14/15 Pro Max
    { name: "apple-splash-1284-2778.png", w: 1284, h: 2778 },
    // iPhone 15 Pro
    { name: "apple-splash-1179-2556.png", w: 1179, h: 2556 },
    // iPad Pro 12.9"
    { name: "apple-splash-2048-2732.png", w: 2048, h: 2732 },
    // iPad Pro 11"
    { name: "apple-splash-1668-2388.png", w: 1668, h: 2388 },
  ];

  for (const { name, w, h } of splashes) {
    const logoSize = Math.min(w, h) * 0.25;
    const cx = w / 2;
    const cy = h / 2;
    const r = logoSize / 2;
    const inner = logoSize * 0.16;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <rect width="${w}" height="${h}" fill="#fafaf7"/>
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="#0f1110"/>
  <circle cx="${cx}" cy="${cy}" r="${inner}" fill="#fafaf7"/>
</svg>`;
    await renderPng(svg, path.join(PUBLIC, name));
  }

  console.log("\nAll icons generated.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
