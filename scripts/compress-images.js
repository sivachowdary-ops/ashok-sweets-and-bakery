const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const sourceDir = process.argv[2];
const targetDir = process.argv[3];

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

fs.readdirSync(sourceDir).forEach(file => {
  if (file.endsWith('.png')) {
    // Remove the timestamp suffix e.g., _1783516990256.png
    const nameWithoutTimestamp = file.replace(/_\d+\.png$/, '');
    const outPath = path.join(targetDir, `${nameWithoutTimestamp}.webp`);
    console.log(`Converting ${file} -> ${nameWithoutTimestamp}.webp`);
    
    if (nameWithoutTimestamp.includes('hero')) {
      sharp(path.join(sourceDir, file))
        .resize(1200) // max width 1200 for hero
        .webp({ quality: 70 }) // high compression for hero
        .toFile(outPath)
        .then(info => console.log('Success', info))
        .catch(err => console.error(err));
    } else {
      sharp(path.join(sourceDir, file))
        .resize(500) // max width 500 for cards
        .webp({ quality: 75 })
        .toFile(outPath)
        .then(info => console.log('Success', info))
        .catch(err => console.error(err));
    }
  }
});
