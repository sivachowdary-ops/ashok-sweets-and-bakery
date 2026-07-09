export type PriceByWeight = {
  half_kg?: number;
  one_kg?: number;
  unit?: number;
};

export type ProductCategory = 'butter-cakes' | 'pastry-cakes' | 'sweets' | 'breads' | 'puffs';

export type Product = {
  id: string;
  name: string;
  category: ProductCategory;
  price: PriceByWeight;
  image: string;
  featured?: boolean;
  available?: boolean;
};

export const products: Product[] = [
  // Butter Cakes
  { id: 'bc-vanilla', name: 'Vanilla Butter Cake', category: 'butter-cakes', price: { half_kg: 150, one_kg: 300 }, image: '/images/products/bc-vanilla.webp', featured: true },
  { id: 'bc-strawberry', name: 'Strawberry Butter Cake', category: 'butter-cakes', price: { half_kg: 150, one_kg: 300 }, image: '/images/products/bc-strawberry.webp' },
  { id: 'bc-pineapple', name: 'Pineapple Butter Cake', category: 'butter-cakes', price: { half_kg: 150, one_kg: 300 }, image: '/images/products/bc-pineapple.webp' },
  { id: 'bc-butterscotch', name: 'Butterscotch Butter Cake', category: 'butter-cakes', price: { half_kg: 180, one_kg: 350 }, image: '/images/products/bc-butterscotch.webp' },
  { id: 'bc-chocolate', name: 'Chocolate Butter Cake', category: 'butter-cakes', price: { half_kg: 180, one_kg: 350 }, image: '/images/products/bc-chocolate.webp', featured: true },
  { id: 'bc-greenapple', name: 'Green Apple Butter Cake', category: 'butter-cakes', price: { half_kg: 150, one_kg: 300 }, image: '/images/products/bc-greenapple.webp' },
  
  // Pastry Cakes
  { id: 'pc-vanilla', name: 'Vanilla Pastry Cake', category: 'pastry-cakes', price: { half_kg: 300, one_kg: 600 }, image: '/images/products/pc-vanilla.webp' },
  { id: 'pc-strawberry', name: 'Strawberry Pastry Cake', category: 'pastry-cakes', price: { half_kg: 300, one_kg: 600 }, image: '/images/products/pc-strawberry.webp', featured: true },
  { id: 'pc-pineapple', name: 'Pineapple Pastry Cake', category: 'pastry-cakes', price: { half_kg: 300, one_kg: 600 }, image: '/images/products/pc-pineapple.webp', featured: true },
  { id: 'pc-butterscotch', name: 'Butterscotch Pastry Cake', category: 'pastry-cakes', price: { half_kg: 350, one_kg: 700 }, image: '/images/products/pc-butterscotch.webp' },
  { id: 'pc-chocolate', name: 'Chocolate Pastry Cake', category: 'pastry-cakes', price: { half_kg: 350, one_kg: 700 }, image: '/images/products/pc-chocolate.webp' },
  { id: 'pc-greenapple', name: 'Green Apple Pastry Cake', category: 'pastry-cakes', price: { half_kg: 300, one_kg: 600 }, image: '/images/products/pc-greenapple.webp' },
  { id: 'pc-redvelvet', name: 'Red Velvet Pastry Cake', category: 'pastry-cakes', price: { half_kg: 400, one_kg: 800 }, image: '/images/products/pc-redvelvet.webp' },
  { id: 'pc-blackforest', name: 'Black Forest Pastry Cake', category: 'pastry-cakes', price: { half_kg: 400, one_kg: 800 }, image: '/images/products/pc-blackforest.webp' },
  { id: 'pc-honeyalmond', name: 'Honey Almond Pastry Cake', category: 'pastry-cakes', price: { half_kg: 400, one_kg: 800 }, image: '/images/products/pc-honeyalmond.webp' },
  
  // Breads
  { id: 'br-milk', name: 'Milk Bread', category: 'breads', price: { unit: 50 }, image: '/images/products/br-milk.webp', featured: true },
  { id: 'br-brown', name: 'Brown Bread', category: 'breads', price: { unit: 70 }, image: '/images/products/br-brown.webp', featured: true },
  { id: 'br-wheat', name: 'Wheat Bread', category: 'breads', price: { unit: 60 }, image: '/images/products/br-wheat.webp' },
  
  // Puffs
  { id: 'pf-veg', name: 'Veg Puff', category: 'puffs', price: { unit: 20 }, image: '/images/products/pf-veg.webp', featured: true },
  { id: 'pf-egg', name: 'Egg Puff', category: 'puffs', price: { unit: 25 }, image: '/images/products/pf-egg.webp' },
  { id: 'pf-chicken', name: 'Chicken Puff', category: 'puffs', price: { unit: 35 }, image: '/images/products/pf-chicken.webp', featured: true },
];

export const CATEGORIES = [
  { id: 'butter-cakes', label: 'Butter Cakes', image: '/images/products/bc-vanilla.webp' },
  { id: 'pastry-cakes', label: 'Pastry Cakes', image: '/images/products/pc-strawberry.webp' },
  { id: 'sweets', label: 'Sweets', image: '' },
  { id: 'breads', label: 'Breads', image: '/images/products/br-milk.webp' },
  { id: 'puffs', label: 'Puffs', image: '/images/products/pf-veg.webp' },
];
