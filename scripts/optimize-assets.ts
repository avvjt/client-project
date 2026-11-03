/**
 * One-off asset pipeline:
 * 1. Recompress oversized product/section PNGs (palette-quantized, max 200KB-ish).
 * 2. Render og-image.png (1200x630), apple-icon.png (180x180) and PWA icons
 *    (192/512) from a brand-exact SVG (Swiss red field + DC monogram).
 */
import sharp from "sharp";
import { readFileSync, writeFileSync, statSync } from "fs";
import path from "path";

const PUB = path.join(process.cwd(), "public");

const IMAGES = [
  "product-shoe-covers.png",
  "product-caps.png",
  "product-gowns.png",
  "product-masks.png",
  "cleanroom-production.png",
  "packaging-supply.png",
  "product-custom-packs.png",
  "product-procedure-kits.png",
  "product-sterilization-wrap.png",
  "cinema-gowns.png",
  "cinema-masks.png",
  "cinema-kits.png",
  "cinema-wraps.png",
  "cinema-cleanroom.png",
  "intel-inspection.png",
  "intel-coordination.png",
  "intel-automation.png",
  "intel-testing.png",
  "intel-dispatch.png",
];

async function recompress() {
  console.log("── Recompressing PNG sources ──");
  for (const name of IMAGES) {
    const file = path.join(PUB, "images", name);
    try {
      statSync(file);
    } catch {
      console.log(`  skip (missing): ${name}`);
      continue;
    }
    const before = statSync(file).size;
    if (before < 280_000) {
      console.log(`  ok (small): ${name} (${(before / 1024).toFixed(0)}KB)`);
      continue;
    }
    const buf = await sharp(file)
      .resize({ width: 1344, withoutEnlargement: true })
      .png({ palette: true, quality: 82, compressionLevel: 9, effort: 10 })
      .toBuffer();
    // Only replace when meaningfully smaller (never quality-regress).
    if (buf.length < before * 0.92) {
      writeFileSync(file, buf);
      console.log(`  ✓ ${name}: ${(before / 1024).toFixed(0)}KB → ${(buf.length / 1024).toFixed(0)}KB`);
    } else {
      console.log(`  = ${name}: kept (${(before / 1024).toFixed(0)}KB; no win)`);
    }
  }
}

function ogSvg(): string {
  const inter = 'font-family="Inter, Manrope, system-ui, sans-serif"';
  return `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="#0B1726"/>
  <rect width="1200" height="630" fill="url(#grid)" opacity="0.14"/>
  <defs>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M40 0H0V40" fill="none" stroke="#1E4A5F" stroke-width="1"/>
    </pattern>
    <linearGradient id="glow" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#14B8A6" stop-opacity="0.18"/>
      <stop offset="1" stop-color="#0B1726" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <rect x="0" y="0" width="1200" height="10" fill="#DA291C"/>
  <!-- Swiss DC badge -->
  <g transform="translate(84,120)">
    <rect width="120" height="120" rx="24" fill="#DA291C"/>
    <path d="M60 22v12M60 86v12M22 60h12M86 60h12" stroke="#fff" stroke-width="8" stroke-linecap="round"/>
    <text x="60" y="74" text-anchor="middle" ${inter} font-size="40" font-weight="800" fill="#fff">DC</text>
  </g>
  <text x="240" y="188" ${inter} font-size="52" font-weight="800" letter-spacing="4" fill="#FFFFFF">DISPO<tspan fill="#F0574A">-</tspan>CONCEPT</text>
  <text x="240" y="232" ${inter} font-size="22" font-weight="500" fill="#7FD1C8">Medical-Grade Elements · Manufacturing &amp; Supply</text>

  <text x="84" y="360" ${inter} font-size="58" font-weight="800" fill="#FFFFFF">Medical essentials.</text>
  <text x="84" y="428" ${inter} font-size="58" font-weight="800" fill="#7FD1C8">Made with purpose.</text>
  <text x="84" y="496" ${inter} font-size="58" font-weight="800" fill="#FFFFFF">Supplied with discipline.</text>

  <text x="84" y="566" ${inter} font-size="21" font-weight="500" fill="#9FB2C4">Surgical gowns (reinforced BVB) · Procedure kits · 2-ply / 3-ply masks · Sterilization wraps</text>
  <g transform="translate(84,596)">
    <circle cx="5" cy="-6" r="5" fill="#DA291C"/>
    <text x="22" y="0" ${inter} font-size="19" font-weight="600" fill="#C7D4E0">Bengaluru, India — Swiss-grade process discipline · RFQ open</text>
  </g>
</svg>`;
}

async function renderBrandImages() {
  console.log("── Rendering og-image / icons ──");
  const og = await sharp(Buffer.from(ogSvg())).png({ compressionLevel: 9 }).toBuffer();
  writeFileSync(path.join(PUB, "og-image.png"), og);
  console.log(`  ✓ og-image.png (${(og.length / 1024).toFixed(0)}KB)`);

  const iconSvg = (size: number) => `<svg width="${size}" height="${size}" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <rect width="64" height="64" rx="12" fill="#DA291C"/>
  <path d="M32 12v9M32 43v9M12 32h9M43 32h9" stroke="#fff" stroke-width="4" stroke-linecap="round"/>
  <text x="32" y="41" text-anchor="middle" font-family="Inter, system-ui, sans-serif" font-size="20" font-weight="800" fill="#fff">DC</text>
</svg>`;

  for (const [name, size] of [
    ["icon-192.png", 192],
    ["icon-512.png", 512],
    ["apple-icon.png", 180],
  ] as const) {
    const buf = await sharp(Buffer.from(iconSvg(size))).png().toBuffer();
    writeFileSync(path.join(PUB, name), buf);
    console.log(`  ✓ ${name}`);
  }
}

await recompress();
await renderBrandImages();
console.log("DONE");
