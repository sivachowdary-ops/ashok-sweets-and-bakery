import Link from 'next/link';
import { MapPin, Phone, Clock } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-brand-brown text-brand-cream border-t border-brand-brown/10 pt-12 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          <div className="col-span-1 md:col-span-1">
            <h2 className="font-serif text-2xl font-bold mb-4">Sri Durga Sweets and Bakery</h2>
            <p className="text-brand-cream/80 text-sm mb-6 leading-relaxed">
              Freshly baked with love. Discover our range of artisanal cakes, breads, puffs, and traditional sweets.
            </p>
            <div className="flex space-x-4">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-brand-cream/10 hover:bg-brand-tan transition-colors" aria-label="Instagram">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
            </div>
          </div>

          <div className="col-span-1">
            <h3 className="font-bold mb-4 tracking-wider text-sm uppercase text-brand-tan">Quick Links</h3>
            <ul className="space-y-2 text-sm text-brand-cream/80">
              <li><Link href="/" className="hover:text-brand-tan transition-colors">Home</Link></li>
              <li><Link href="/menu" className="hover:text-brand-tan transition-colors">Menu</Link></li>
              <li><Link href="/about" className="hover:text-brand-tan transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-brand-tan transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div className="col-span-1">
            <h3 className="font-bold mb-4 tracking-wider text-sm uppercase text-brand-tan">Contact Us</h3>
            <ul className="space-y-3 text-sm text-brand-cream/80">
              <li className="flex items-start">
                <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-brand-tan" />
                <span>Demo Address Line 1, <br />Demo City, XY 12345</span>
              </li>
              <li className="flex items-center">
                <Phone className="w-4 h-4 mr-2 flex-shrink-0 text-brand-tan" />
                <span>+1 (555) 000-0000</span>
              </li>
            </ul>
          </div>

          <div className="col-span-1">
            <h3 className="font-bold mb-4 tracking-wider text-sm uppercase text-brand-tan">Business Hours</h3>
            <ul className="space-y-3 text-sm text-brand-cream/80">
              <li className="flex items-start">
                <Clock className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-brand-tan" />
                <div>
                  <p>Mon - Sat: 8:00 AM - 9:00 PM</p>
                  <p className="mt-1">Sun: 9:00 AM - 8:00 PM</p>
                </div>
              </li>
            </ul>
          </div>

        </div>
        
        <div className="pt-8 border-t border-brand-cream/10 text-center text-xs text-brand-cream/60">
          <p>&copy; {new Date().getFullYear()} Sri Durga Sweets and Bakery. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
