const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const mappings = {
  'butterscotch_butter_cake.png': 'bc-butterscotch.webp',
  'butterscotch_pastry.png': 'pc-butterscotch.webp',
  'greenapple_butter_cake.png': 'bc-greenapple.webp',
  'greenapple_pastry.png': 'pc-greenapple.webp',
  'honeyalmond_pastry.png': 'pc-honeyalmond.webp',
  'pineapple_butter_cake.png': 'bc-pineapple.webp',
  'pineapple_pastry.png': 'pc-pineapple.webp',
  'strawberry_pastry.png': 'pc-strawberry.webp',
  'vanaila_pastry_image.png': 'pc-vanilla.webp',
  'vanila_butter_cake.png': 'bc-vanilla.webp'
};

async function main() {
  const outputDir = path.resolve(process.cwd(), 'public', 'images', 'products');
  
  for (const [pngFile, webpFile] of Object.entries(mappings)) {
    const inputPath = path.resolve(process.cwd(), pngFile);
    if (fs.existsSync(inputPath)) {
      const destPath = path.resolve(outputDir, webpFile);
      
      console.log(`Converting ${pngFile} to ${webpFile}...`);
      await sharp(inputPath)
        .resize({ width: 600, height: 600, fit: 'cover' })
        .webp({ quality: 75 })
        .toFile(destPath);
        
      console.log(`Converted successfully! Saved to ${destPath}`);
      
      // Optionally delete the source png file to clean up root
      fs.unlinkSync(inputPath);
    } else {
      console.warn(`File not found: ${pngFile}`);
    }
  }
}

main().catch(console.error);
