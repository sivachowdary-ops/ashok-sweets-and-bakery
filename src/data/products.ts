export type PriceByWeight = {
  quarter_kg?: number;
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
  
  // Sweets
  { id: 'sw-kova', name: 'Kova Items', category: 'sweets', price: { quarter_kg: 100, half_kg: 200, one_kg: 400 }, image: '/images/products/sw-kova.webp', featured: true },
  { id: 'sw-kalakandha', name: 'Kalakandha', category: 'sweets', price: { quarter_kg: 120, half_kg: 220, one_kg: 440 }, image: '/images/products/sw-kalakandha.webp', featured: true },
  { id: 'sw-mysorepak', name: 'Ghee Mysorepak', category: 'sweets', price: { quarter_kg: 120, half_kg: 220, one_kg: 440 }, image: '/images/products/sw-mysorepak.webp', featured: true },
  { id: 'sw-icecreamburfi', name: 'Ice cream burfi', category: 'sweets', price: { quarter_kg: 120, half_kg: 220, one_kg: 440 }, image: '/images/products/sw-icecreamburfi.webp' },
  { id: 'sw-sunnonda', name: 'Sunnonda', category: 'sweets', price: { quarter_kg: 100, half_kg: 200, one_kg: 400 }, image: '/images/products/sw-sunnonda.webp' },
  { id: 'sw-besaraladdu', name: 'Besara laddu', category: 'sweets', price: { quarter_kg: 90, half_kg: 180, one_kg: 360 }, image: '/images/products/sw-besaraladdu.webp' },
  { id: 'sw-thokkuduladdu', name: 'Thokkudu laddu', category: 'sweets', price: { quarter_kg: 60, half_kg: 120, one_kg: 240 }, image: '/images/products/sw-thokkuduladdu.webp' },
  { id: 'sw-mothichurladdu', name: 'Mothi chur laddu', category: 'sweets', price: { quarter_kg: 70, half_kg: 140, one_kg: 280 }, image: '/images/products/sw-mothichurladdu.webp', featured: true },
  { id: 'sw-laddu', name: 'Laddu', category: 'sweets', price: { quarter_kg: 60, half_kg: 120, one_kg: 240 }, image: '/images/products/sw-laddu.webp' },
  { id: 'sw-kaja', name: 'Kaja', category: 'sweets', price: { quarter_kg: 60, half_kg: 120, one_kg: 240 }, image: '/images/products/sw-kaja.webp' },
  { id: 'sw-jangiri', name: 'Jangiri', category: 'sweets', price: { quarter_kg: 60, half_kg: 120, one_kg: 240 }, image: '/images/products/sw-jangiri.webp' },

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
  { id: 'sweets', label: 'Sweets', image: '/images/category_sweets.webp' },
  { id: 'breads', label: 'Breads', image: '/images/products/br-milk.webp' },
  { id: 'puffs', label: 'Puffs', image: '/images/products/pf-veg.webp' },
];
