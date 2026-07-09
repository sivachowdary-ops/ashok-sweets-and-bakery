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

// These are the specific products the user wants changed, with new, more specific queries.
const REFETCH_LIST: Record<string, string> = {
  "pc-strawberry": "strawberry pastry dessert slice",
  "pc-pineapple": "pineapple pastry slice cream",
  "pc-butterscotch": "caramel pastry dessert slice bakery",
  "pc-greenapple": "green apple pastry dessert",
  "pc-honeyalmond": "almond cake slice honey sweet",
  "br-milk": "sliced white bread soft",
  "br-brown": "sliced brown bread rustic",
  "br-wheat": "sliced whole wheat bread fresh"
};

const outputDir = path.resolve(process.cwd(), 'public', 'images', 'products');
const sourcesFile = path.resolve(process.cwd(), 'src', 'data', 'image-sources.json');

let sources: any = {};
if (fs.existsSync(sourcesFile)) {
  sources = JSON.parse(fs.readFileSync(sourcesFile, 'utf8'));
}

// Keep track of all historically used IDs so we don't accidentally fetch the exact same bad image again,
// or use an image that belongs to another product.
const usedIds = new Set<number>();
for (const key in sources) {
  usedIds.add(sources[key].id);
}

async function searchPexels(query: string) {
  const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=30&orientation=landscape`;
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
  console.log("Starting targeted image refetch...");
  
  for (const product of products) {
    if (!REFETCH_LIST[product.id]) continue;
    
    const query = REFETCH_LIST[product.id];
    console.log(`\nRefetching: ${product.name} (ID: ${product.id})`);
    console.log(`New Query: "${query}"`);
    
    try {
      const data = await searchPexels(query);
      const photos = data.photos || [];
      
      let selectedPhoto = null;
      for (const photo of photos) {
        // Find a photo we haven't used AT ALL in the catalog yet
        if (!usedIds.has(photo.id)) {
          selectedPhoto = photo;
          break;
        }
      }
      
      if (!selectedPhoto) {
        console.warn(`[WARNING] No unused photos found on Pexels for query: "${query}". Skipping.`);
        continue;
      }
      
      // Mark as used
      usedIds.add(selectedPhoto.id);
      
      const destPath = path.join(outputDir, `${product.id}.webp`);
      const imageUrl = selectedPhoto.src.large || selectedPhoto.src.original;
      
      console.log(`Downloading new photo ID: ${selectedPhoto.id} by ${selectedPhoto.photographer}`);
      const sizeBytes = await processImage(imageUrl, destPath);
      
      console.log(`Saved ${product.id}.webp - Size: ${(sizeBytes / 1024).toFixed(2)} KB`);
      
      // Update manifest
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
    
    // Rate limit delay
    await new Promise(r => setTimeout(r, 1000));
  }
  
  fs.writeFileSync(sourcesFile, JSON.stringify(sources, null, 2));
  console.log(`\nManifest updated at src/data/image-sources.json`);
  console.log("Done!");
}

main().catch(console.error);
