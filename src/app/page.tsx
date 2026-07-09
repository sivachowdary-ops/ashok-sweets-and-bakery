import Header from '../components/Header';
import Footer from '../components/Footer';
import WhatsAppFloatButton from '../components/WhatsAppFloatButton';
import FloatingCartButton from '../components/FloatingCartButton';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ShoppingBag, MessageCircle, CheckCircle2, Search } from 'lucide-react';
import CategoryTile from '../components/CategoryTile';
import ProductCard from '../components/ProductCard';
import FAQAccordion from '../components/FAQAccordion';
import { CATEGORIES, products } from '../data/products';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Ashok Sweets and Bakery | Order Online",
  description: "Bite into Happiness! Order freshly baked artisanal cakes, breads, and authentic sweets delivered locally. Reach out via WhatsApp.",
};

export default function Home() {
  const featuredProducts = products.filter(p => p.featured).slice(0, 8);
  
  return (
    <>
      <Header />
      <main className="flex-grow">
        
        {/* Hero Section */}
        <section className="relative h-[60vh] min-h-[400px] w-full flex items-center justify-start">
          <Image 
            src="/images/hero_bakery_spread.webp"
            alt="Delicious assortment of baked goods"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/50" />
          
          <div className="relative z-10 text-left px-6 sm:px-12 md:px-24 max-w-4xl mt-8">
            <h1 className="font-serif text-4xl md:text-6xl font-bold text-white leading-tight mb-6 drop-shadow-md">
              Bite into Happiness, Savor the Sweetness
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8 font-light drop-shadow-sm max-w-2xl">
              Freshly baked artisanal cakes, breads, and authentic sweets delivered locally.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-start">
              <Link href="/menu" className="inline-flex items-center justify-center px-8 py-3.5 border border-transparent text-base font-medium rounded-full text-white bg-brand-tan hover:bg-[#b07848] transition-colors shadow-lg hover:shadow-xl">
                View Menu
              </Link>
            </div>
          </div>
        </section>



        {/* Popular Categories */}
        <section className="py-16 md:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-brand-brown">Categories</h2>
              <div className="w-24 h-1 bg-brand-tan mx-auto mt-4 rounded-full"></div>
            </div>
            
            <div className="flex overflow-x-auto hide-scrollbar gap-4 sm:gap-6 pb-4 snap-x snap-mandatory">
              {CATEGORIES.map(category => (
                <div key={category.id} className="w-[50vw] sm:w-64 flex-shrink-0 snap-start">
                  <CategoryTile {...category} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Popular Products */}
        <section className="py-16 md:py-24 bg-brand-cream">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-10">
              <div>
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-brand-brown">Best Sellers</h2>
                <p className="text-brand-brown/70 mt-2">Our most loved treats today.</p>
              </div>
              <Link href="/menu" className="hidden sm:flex items-center text-brand-tan font-medium hover:text-[#b07848] transition-colors">
                View all <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            
            <div className="mt-10 text-center sm:hidden">
              <Link href="/menu" className="inline-flex items-center justify-center px-6 py-3 border border-brand-tan text-brand-tan font-medium rounded-full hover:bg-brand-tan hover:text-white transition-colors w-full">
                View All Menu
              </Link>
            </div>
          </div>
        </section>

      </main>

      {/* How It Works Strip */}
      <section className="bg-brand-brown text-brand-cream py-12 border-t border-brand-brown/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-white">How to Order</h2>
            <div className="w-24 h-1 bg-brand-tan mx-auto mt-4 rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center">
              <Search className="w-8 h-8 text-brand-tan mb-3" />
              <span className="font-bold mb-1">1. Browse</span>
              <p className="text-sm text-brand-cream/70">Explore our fresh catalog</p>
            </div>
            <div className="flex flex-col items-center">
              <ShoppingBag className="w-8 h-8 text-brand-tan mb-3" />
              <span className="font-bold mb-1">2. Add to Cart</span>
              <p className="text-sm text-brand-cream/70">Select quantities & weights</p>
            </div>
            <div className="flex flex-col items-center">
              <MessageCircle className="w-8 h-8 text-brand-tan mb-3" />
              <span className="font-bold mb-1">3. WhatsApp Order</span>
              <p className="text-sm text-brand-cream/70">Send your cart directly to us</p>
            </div>
            <div className="flex flex-col items-center">
              <CheckCircle2 className="w-8 h-8 text-brand-tan mb-3" />
              <span className="font-bold mb-1">4. We Confirm</span>
              <p className="text-sm text-brand-cream/70">We arrange delivery/pickup</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="py-16 md:py-24 bg-white border-t border-brand-brown/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-brand-brown">Frequently Asked Questions</h2>
            <div className="w-24 h-1 bg-brand-tan mx-auto mt-4 rounded-full"></div>
          </div>
          
          <FAQAccordion />
        </div>
      </section>

      <Footer />
      <FloatingCartButton />
      <WhatsAppFloatButton />
    </>
  );
}
