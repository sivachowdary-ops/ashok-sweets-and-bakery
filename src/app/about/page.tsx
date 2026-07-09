import Header from '../../components/Header';
import Footer from '../../components/Footer';
import WhatsAppFloatButton from '../../components/WhatsAppFloatButton';
import FloatingCartButton from '../../components/FloatingCartButton';
import Image from 'next/image';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "About Us | Ashok Sweets and Bakery",
  description: "Learn about our artisanal bakery story, where passion meets tradition in crafting the finest cakes and authentic sweets.",
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="flex-grow bg-brand-cream/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            
            {/* Left side: Square Image */}
            <div className="relative aspect-square w-full max-w-sm mx-auto md:mx-0 rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="/images/hero_bakery_spread.webp"
                alt="Inside Ashok Sweets and Bakery"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            
            {/* Right side: Story Text */}
            <div className="text-left">
              <h1 className="font-serif text-3xl md:text-4xl font-bold text-brand-brown mb-4">Our Story</h1>
              <div className="w-12 h-1 bg-brand-tan mb-6 rounded-full"></div>
              
              <div className="space-y-4 text-base md:text-lg text-brand-brown/80 leading-relaxed font-light">
                <p>
                  Welcome to Ashok Sweets and Bakery. We started with a simple belief: the best moments in life are celebrated with something sweet, baked fresh from the oven.
                </p>
                <p>
                  Combining traditional techniques with the finest ingredients, every item we create—from butter cakes to warm puffs—is crafted with care. No shortcuts, just fresh, daily baking.
                </p>
                <p className="font-medium text-brand-brown pt-2">
                  Thank you for letting us be a part of your celebrations!
                </p>
              </div>
            </div>

          </div>
        </div>
      </main>
      <Footer />
      <FloatingCartButton />
      <WhatsAppFloatButton />
    </>
  );
}
