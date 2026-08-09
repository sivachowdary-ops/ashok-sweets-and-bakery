const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  'src/app/about/page.tsx',
  'src/app/admin/page.tsx',
  'src/app/contact/page.tsx',
  'src/app/layout.tsx',
  'src/app/page.tsx',
  'src/components/Footer.tsx',
  'src/components/Header.tsx',
  'supabase_schema.sql'
];

filesToUpdate.forEach(file => {
  const filePath = path.resolve(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace "Ashok Sweets and Bakery", "Ashok Sweets & Bakery", etc.
    content = content.replace(/Ashok Sweets and Bakery/gi, 'Sri Durga Sweets and Bakery');
    content = content.replace(/Ashok Sweets & Bakery/gi, 'Sri Durga Sweets and Bakery');
    content = content.replace(/ashoksweetsandbakery/gi, 'sridurgasweetsandbakery');
    
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${file} to Sri Durga Sweets and Bakery`);
  } else {
    console.error(`File not found: ${file}`);
  }
});
