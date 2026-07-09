import * as fs from 'fs';
import * as path from 'path';
import sharp from 'sharp';
import dotenv from 'dotenv';
import { products } from '../src/data/products';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const PEXELS_API_KEY = process.env.PEXELS_API_KEY;

if (!PEXELS_API_KEY) {
  console.error("PEXELS_API_KEY is missing from .env.local");
  process.exit(1);
}

const QUERIES: Record<string, string> = {
  "Vanilla Butter Cake": "vanilla sponge cake slice",
  "Strawberry Butter Cake": "strawberry cream cake",
  "Pineapple Butter Cake": "pineapple cake dessert",
  "Butterscotch Butter Cake": "butterscotch cake caramel",
  "Chocolate Butter Cake": "chocolate cake slice frosting",
  "Green Apple Butter Cake": "green apple cake dessert",
  "Vanilla Pastry Cake": "vanilla pastry cake bakery",
  "Strawberry Pastry Cake": "strawberry pastry cake fresh",
  "Pineapple Pastry Cake": "pineapple pastry dessert cake",
  "Butterscotch Pastry Cake": "butterscotch pastry cake bakery",
  "Chocolate Pastry Cake": "chocolate pastry cake rich",
  "Green Apple Pastry Cake": "apple pastry cake slice",
  "Red Velvet Pastry Cake": "red velvet cake slice",
  "Black Forest Pastry Cake": "black forest cake cherries",
  "Honey Almond Pastry Cake": "honey almond cake dessert",
  "Milk Bread": "milk bread loaf soft",
  "Brown Bread": "brown bread loaf rustic",
  "Wheat Bread": "whole wheat bread loaf",
  "Veg Puff": "vegetable puff pastry indian bakery",
  "Egg Puff": "egg puff pastry bakery",
  "Chicken Puff": "chicken puff pastry snack"
};

const outputDir = path.resolve(process.cwd(), 'public', 'images', 'products');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const sourcesFile = path.resolve(process.cwd(), 'src', 'data', 'image-sources.json');
let sources: any = {};
if (fs.existsSync(sourcesFile)) {
  sources = JSON.parse(fs.readFileSync(sourcesFile, 'utf8'));
}

const usedIds = new Set<number>();
// Populate used IDs
for (const key in sources) {
  usedIds.add(sources[key].id);
}

async function searchPexels(query: string) {
  const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=15&orientation=landscape`;
  const res = await fetch(url, {
    headers: {
      Authorization: PEXELS_API_KEY as string
    }
  });
  if (!res.ok) {
    throw new Error(`Pexels API error: ${res.status} ${res.statusText}`);
  }
  return await res.json();
}

async function processImage(url: string, destPath: string) {
  const res = await fetch(url);
  const arrayBuffer = await res.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  
  await sharp(buffer)
    .resize({ width: 600, height: 600, fit: 'cover' })
    .webp({ quality: 75 })
    .toFile(destPath);
    
  const stat = fs.statSync(destPath);
  return stat.size;
}

async function main() {
  console.log("Starting image fetch process...");
  
  for (const product of products) {
    const query = QUERIES[product.name];
    if (!query) {
      console.warn(`[SKIP] No query defined for: ${product.name}`);
      continue;
    }
    
    console.log(`\nProcessing: ${product.name}`);
    console.log(`Query: "${query}"`);
    
    try {
      const data = await searchPexels(query);
      const photos = data.photos || [];
      
      let selectedPhoto = null;
      for (const photo of photos) {
        if (!usedIds.has(photo.id)) {
          selectedPhoto = photo;
          break;
        }
      }
      
      if (!selectedPhoto) {
        console.warn(`[WARNING] No unused photos found on Pexels for query: "${query}"`);
        continue;
      }
      
      usedIds.add(selectedPhoto.id);
      
      const destPath = path.join(outputDir, `${product.id}.webp`);
      
      // Usually, Pexels offers original, large, medium, small. Large is good for sharp processing.
      const imageUrl = selectedPhoto.src.large || selectedPhoto.src.original;
      
      console.log(`Downloading photo ID: ${selectedPhoto.id} by ${selectedPhoto.photographer}`);
      const sizeBytes = await processImage(imageUrl, destPath);
      
      console.log(`Saved ${product.id}.webp - Size: ${(sizeBytes / 1024).toFixed(2)} KB`);
      
      sources[product.id] = {
        productName: product.name,
        source: 'Pexels',
        id: selectedPhoto.id,
        photographer: selectedPhoto.photographer,
        url: selectedPhoto.url
      };
      
    } catch (err) {
      console.error(`[ERROR] Failed to process ${product.name}:`, err);
    }
    
    // Add a small delay to avoid rate limits
    await new Promise(r => setTimeout(r, 1000));
  }
  
  fs.writeFileSync(sourcesFile, JSON.stringify(sources, null, 2));
  console.log(`\nManifest saved to src/data/image-sources.json`);
  console.log("Done!");
}

main().catch(console.error);
