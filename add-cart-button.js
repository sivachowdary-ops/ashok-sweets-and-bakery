const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  'src/app/about/page.tsx',
  'src/app/cart/page.tsx',
  'src/app/contact/page.tsx',
  'src/app/menu/page.tsx'
];

filesToUpdate.forEach(file => {
  const filePath = path.resolve(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    if (!content.includes('FloatingCartButton')) {
      content = content.replace(
        "import WhatsAppFloatButton from '../../components/WhatsAppFloatButton';",
        "import WhatsAppFloatButton from '../../components/WhatsAppFloatButton';\nimport FloatingCartButton from '../../components/FloatingCartButton';"
      );

      content = content.replace(
        "<WhatsAppFloatButton />",
        "<FloatingCartButton />\n      <WhatsAppFloatButton />"
      );

      fs.writeFileSync(filePath, content);
      console.log(`Updated ${file}`);
    }
  }
});
