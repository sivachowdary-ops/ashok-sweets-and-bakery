const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  'src/app/about/page.tsx',
  'src/app/contact/page.tsx',
  'src/app/layout.tsx',
  'src/components/Footer.tsx',
  'src/components/Header.tsx'
];

filesToUpdate.forEach(file => {
  const filePath = path.resolve(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace names
    content = content.replace(/Anand Sweets & Bakery/gi, 'Ashok Sweets and Bakery');
    content = content.replace(/Anand Sweets and Bakery/gi, 'Ashok Sweets and Bakery');
    content = content.replace(/Anand Sweets Bakery/gi, 'Ashok Sweets and Bakery');
    content = content.replace(/Anand Sweets/g, 'Ashok Sweets and Bakery');
    content = content.replace(/anandsweetsbakery/gi, 'ashoksweetsandbakery');

    // Phone number in contact page
    if (file.includes('contact/page.tsx')) {
      content = content.replace(/\+91 99000 00000/g, '+91 97030 52522');
    }

    fs.writeFileSync(filePath, content);
    console.log(`Updated ${file}`);
  }
});

// Update .env.local
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  let envContent = fs.readFileSync(envPath, 'utf8');
  if (envContent.includes('NEXT_PUBLIC_WHATSAPP_NUMBER')) {
    envContent = envContent.replace(/NEXT_PUBLIC_WHATSAPP_NUMBER=.*/g, 'NEXT_PUBLIC_WHATSAPP_NUMBER=919703052522');
  } else {
    envContent += '\nNEXT_PUBLIC_WHATSAPP_NUMBER=919703052522\n';
  }
  fs.writeFileSync(envPath, envContent);
  console.log('Updated .env.local');
} else {
  fs.writeFileSync(envPath, 'NEXT_PUBLIC_WHATSAPP_NUMBER=919703052522\n');
  console.log('Created .env.local with whatsapp number');
}
