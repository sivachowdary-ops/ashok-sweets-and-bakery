const fs = require('fs');
let content = fs.readFileSync('src/data/products.ts', 'utf8');
content = content.replace(/\\'/g, "'");
fs.writeFileSync('src/data/products.ts', content);
