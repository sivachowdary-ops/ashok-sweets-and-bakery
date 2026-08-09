import { createClient } from '@supabase/supabase-js';
import { products as initialProducts, Product } from '../data/products';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export interface DBOrder {
  id?: string;
  created_at?: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  items: any[];
  subtotal: number;
  status: 'pending' | 'confirmed' | 'paid' | 'cancelled';
  whatsapp_message: string;
}

export async function createOrder(order: Omit<DBOrder, 'status'>) {
  if (!supabase) {
    console.warn("Supabase is not configured. Order not saved in database.");
    return null;
  }

  const { data, error } = await supabase
    .from('sri_durga_orders')
    .insert([
      {
        customer_name: order.customer_name,
        customer_phone: order.customer_phone,
        customer_address: order.customer_address,
        items: order.items,
        subtotal: order.subtotal,
        status: 'pending',
        whatsapp_message: order.whatsapp_message
      }
    ])
    .select()
    .single();

  if (error) {
    console.error("Error creating order in Supabase:", error);
    throw error;
  }

  return data;
}

export async function getOrders(): Promise<DBOrder[]> {
  if (!supabase) {
    console.warn("Supabase is not configured. Cannot fetch orders.");
    return [];
  }

  const { data, error } = await supabase
    .from('sri_durga_orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching orders from Supabase:", error);
    throw error;
  }

  return data || [];
}

export async function updateOrderStatus(orderId: string, status: DBOrder['status']) {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('sri_durga_orders')
    .update({ status })
    .eq('id', orderId)
    .select()
    .single();

  if (error) {
    console.error("Error updating order status in Supabase:", error);
    throw error;
  }

  return data;
}

export async function getProducts(): Promise<Product[]> {
  if (!supabase) {
    console.warn("Supabase is not configured. Falling back to local products.");
    return initialProducts;
  }

  const { data, error } = await supabase
    .from('sri_durga_products')
    .select('*')
    .order('category')
    .order('name');

  if (error) {
    console.error("Error fetching products from Supabase:", error);
    return initialProducts;
  }

  if (!data || data.length === 0) {
    // Seed products table if empty
    console.log("Products table is empty. Seeding initial product catalog...");
    const seedData = initialProducts.map(p => ({
      id: p.id,
      name: p.name,
      category: p.category,
      price: p.price,
      image: p.image,
      featured: p.featured || false,
      available: p.available !== false
    }));

    const { error: seedError } = await supabase
      .from('sri_durga_products')
      .insert(seedData);

    if (seedError) {
      console.error("Error seeding products to Supabase:", seedError);
    }
    return initialProducts;
  }

  // Map database products back to code types
  return data.map(p => ({
    id: p.id,
    name: p.name,
    category: p.category,
    price: p.price,
    image: p.image,
    featured: p.featured,
    available: p.available
  }));
}

export async function updateProduct(productId: string, updates: Partial<Product>) {
  if (!supabase) {
    console.warn("Supabase is not configured. Cannot update product.");
    return null;
  }

  const { data, error } = await supabase
    .from('sri_durga_products')
    .update(updates)
    .eq('id', productId)
    .select()
    .single();

  if (error) {
    console.error("Error updating product in Supabase:", error);
    throw error;
  }

  return data;
}
