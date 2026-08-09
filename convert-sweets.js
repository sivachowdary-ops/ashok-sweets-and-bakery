const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const artifactDir = 'C:\\Users\\sivap\\.gemini\\antigravity\\brain\\35e2f135-86fa-407a-9357-01dbf1b4052c';
const productOutputDir = path.resolve(process.cwd(), 'public', 'images', 'products');
const categoryOutputDir = path.resolve(process.cwd(), 'public', 'images');

const mappings = [
  { src: 'sweet_kova_items_1786296699745.jpg', dest: path.resolve(productOutputDir, 'sw-kova.webp') },
  { src: 'sweet_kalakandha_1786296718124.jpg', dest: path.resolve(productOutputDir, 'sw-kalakandha.webp') },
  { src: 'sweet_mysorepak_1786296735566.jpg', dest: path.resolve(productOutputDir, 'sw-mysorepak.webp') },
  { src: 'sweet_icecream_burfi_1786296753987.jpg', dest: path.resolve(productOutputDir, 'sw-icecreamburfi.webp') },
  { src: 'sweet_sunnonda_1786296770017.jpg', dest: path.resolve(productOutputDir, 'sw-sunnonda.webp') },
  { src: 'sweet_besara_laddu_1786296788643.jpg', dest: path.resolve(productOutputDir, 'sw-besaraladdu.webp') },
  { src: 'sweet_thokkudu_laddu_1786296809364.jpg', dest: path.resolve(productOutputDir, 'sw-thokkuduladdu.webp') },
  { src: 'sweet_mothichur_laddu_1786296823255.jpg', dest: path.resolve(productOutputDir, 'sw-mothichurladdu.webp') },
  { src: 'sweet_laddu_1786296839288.jpg', dest: path.resolve(productOutputDir, 'sw-laddu.webp') },
  { src: 'sweet_kaja_1786296853299.jpg', dest: path.resolve(productOutputDir, 'sw-kaja.webp') },
  { src: 'sweet_jangiri_1786296869073.jpg', dest: path.resolve(productOutputDir, 'sw-jangiri.webp') },
  // Category Sweets image
  { src: 'sweet_mothichur_laddu_1786296823255.jpg', dest: path.resolve(categoryOutputDir, 'category_sweets.webp') }
];

async function main() {
  // Ensure output directories exist
  if (!fs.existsSync(productOutputDir)) {
    fs.mkdirSync(productOutputDir, { recursive: true });
  }

  for (const item of mappings) {
    const srcPath = path.resolve(artifactDir, item.src);
    if (fs.existsSync(srcPath)) {
      console.log(`Converting ${item.src} to ${path.basename(item.dest)}...`);
      await sharp(srcPath)
        .resize({ width: 600, height: 600, fit: 'cover' })
        .webp({ quality: 80 })
        .toFile(item.dest);
      console.log(`Converted successfully! Saved to ${item.dest}`);
    } else {
      console.error(`Source file not found: ${srcPath}`);
    }
  }
}

main().catch(console.error);
