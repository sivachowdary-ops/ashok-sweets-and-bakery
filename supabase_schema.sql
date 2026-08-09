-- Supabase SQL Schema for Sri Durga Sweets and Bakery

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create Products Table
create table if not exists public.sri_durga_products (
    id text primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    name text not null,
    category text not null,
    price jsonb not null, -- e.g., {"quarter_kg": 100, "half_kg": 200, "one_kg": 400} or {"unit": 50}
    image text not null,
    featured boolean default false not null,
    available boolean default true not null
);

-- Create Orders Table
create table if not exists public.sri_durga_orders (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    customer_name text not null,
    customer_phone text not null,
    customer_address text not null,
    items jsonb not null, -- Array of items ordered
    subtotal numeric(10, 2) not null,
    status text default 'pending'::text not null, -- 'pending', 'confirmed', 'paid', 'cancelled'
    whatsapp_message text not null
);

-- Enable Row Level Security (RLS)
alter table public.sri_durga_products enable row level security;
alter table public.sri_durga_orders enable row level security;

-- Create Policies for Products (Anyone can read, Admin can write)
create policy "Allow public read access to products" on public.sri_durga_products
    for select using (true);

create policy "Allow all access to products for authenticated users" on public.sri_durga_products
    for all using (true) with check (true); -- In a simple setup, allow all access. For production, restrict to admin.

-- Create Policies for Orders (Public can create, Authenticated/Admin can read/write)
create policy "Allow public to insert orders" on public.sri_durga_orders
    for insert with check (true);

create policy "Allow all access to orders for authenticated users" on public.sri_durga_orders
    for all using (true) with check (true);

-- Enable realtime for tracking orders
alter publication supabase_realtime add table public.sri_durga_orders;
