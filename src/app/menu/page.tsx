'use client';

import { useState, useMemo, useEffect } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import WhatsAppFloatButton from '../../components/WhatsAppFloatButton';
import FloatingCartButton from '../../components/FloatingCartButton';
import ProductCard from '../../components/ProductCard';
import EmptyState from '../../components/EmptyState';
import { CATEGORIES, products as localProducts, ProductCategory, Product } from '../../data/products';
import { getProducts } from '../../lib/supabase';

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState<ProductCategory | 'all'>('all');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts()
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load products from database, using local fallback:", err);
        setProducts(localProducts);
        setLoading(false);
      });
  }, []);

  const filteredProducts = useMemo(() => {
    const list = products.length > 0 ? products : localProducts;
    if (activeCategory === 'all') return list;
    return list.filter(p => p.category === activeCategory);
  }, [activeCategory, products]);

  return (
    <>
      <Header />
      <main className="flex-grow bg-brand-cream/30 min-h-[calc(100vh-64px)]">
        
        {/* Page Header */}
        <div className="bg-brand-cream py-12 md:py-16 border-b border-brand-brown/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-brand-brown mb-4">Our Menu</h1>
            <p className="text-brand-brown/70 max-w-2xl mx-auto text-lg">
              Browse our selection of freshly baked goods. From classic butter cakes to flaky puffs.
            </p>
          </div>
        </div>

        {/* Category Filter */}
        <div className="sticky top-16 z-30 bg-white/80 backdrop-blur-md border-b border-brand-brown/10 py-4 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex overflow-x-auto hide-scrollbar space-x-2 sm:space-x-4 pb-2 sm:pb-0 sm:justify-center">
              <button
                onClick={() => setActiveCategory('all')}
                className={`flex-shrink-0 px-5 py-2 rounded-full font-medium transition-colors ${
                  activeCategory === 'all' 
                    ? 'bg-brand-brown text-white' 
                    : 'bg-brand-cream text-brand-brown hover:bg-brand-tan/20'
                }`}
              >
                All
              </button>
              {CATEGORIES.map(category => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id as ProductCategory)}
                  className={`flex-shrink-0 px-5 py-2 rounded-full font-medium transition-colors ${
                    activeCategory === category.id 
                      ? 'bg-brand-brown text-white' 
                      : 'bg-brand-cream text-brand-brown hover:bg-brand-tan/20'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 lg:gap-8">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="py-12 bg-white rounded-2xl shadow-sm border border-brand-brown/10">
              <EmptyState 
                title={`${CATEGORIES.find(c => c.id === activeCategory)?.label || 'Items'} coming soon!`}
                message="We are currently perfecting our recipes for this category. Please check back later."
              />
            </div>
          )}
        </div>

      </main>
      <Footer />
      <FloatingCartButton />
      <WhatsAppFloatButton />
    </>
  );
}
