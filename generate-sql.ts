import fs from 'fs';
import path from 'path';
import { products } from './src/data/products';

function generateSQL() {
  let sql = `-- SQL Script to insert initial products into public.sri_durga_products\n\n`;
  sql += `INSERT INTO public.sri_durga_products (id, name, category, price, image, featured, available)\nVALUES\n`;

  const values = products.map(p => {
    const priceJson = JSON.stringify(p.price);
    const featured = p.featured ? 'true' : 'false';
    const available = p.available !== false ? 'true' : 'false';
    
    // Escape single quotes for SQL insertion
    const nameEscaped = p.name.replace(/'/g, "''");
    
    return `  ('${p.id}', '${nameEscaped}', '${p.category}', '${priceJson}'::jsonb, '${p.image}', ${featured}, ${available})`;
  });

  sql += values.join(',\n') + ';\n';

  const destPath = path.resolve(process.cwd(), 'insert_products.sql');
  fs.writeFileSync(destPath, sql);
  console.log(`Generated SQL inserts at ${destPath}`);
}

generateSQL();
