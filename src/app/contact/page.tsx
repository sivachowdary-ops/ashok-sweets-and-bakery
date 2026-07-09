import Header from '../../components/Header';
import Footer from '../../components/Footer';
import WhatsAppFloatButton from '../../components/WhatsAppFloatButton';
import FloatingCartButton from '../../components/FloatingCartButton';
import { MapPin, Phone, Clock, Mail, Send, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Contact Us | Ashok Sweets and Bakery",
  description: "Get in touch with Ashok Sweets and Bakery. Visit our store, call us, or send a WhatsApp message to place an order.",
};

export default function ContactPage() {
  const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '';

  return (
    <>
      <Header />
      <main className="flex-grow bg-brand-cream/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-brand-brown mb-6">Get in Touch</h1>
            <p className="text-lg text-brand-brown/70 font-light">
              We&apos;d love to hear from you! Whether you want to place a custom order, ask about our ingredients, or just say hello.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
            
            {/* Contact Details */}
            <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-brand-brown/10">
              <h2 className="font-serif text-2xl font-bold text-brand-brown mb-8">Contact Information</h2>
              
              <div className="space-y-6 text-brand-brown/80">
                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-full bg-brand-tan/10 flex items-center justify-center flex-shrink-0 mr-4">
                    <MapPin className="w-6 h-6 text-brand-tan" />
                  </div>
                  <div>
                    <h3 className="font-bold text-brand-brown">Visit Us</h3>
                    <p className="mt-1">123 Bakery Lane,<br />Sweet District, City 12345</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-full bg-brand-tan/10 flex items-center justify-center flex-shrink-0 mr-4">
                    <Phone className="w-6 h-6 text-brand-tan" />
                  </div>
                  <div>
                    <h3 className="font-bold text-brand-brown">Call or WhatsApp</h3>
                    <p className="mt-1">+91 97030 52522</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-full bg-brand-tan/10 flex items-center justify-center flex-shrink-0 mr-4">
                    <Clock className="w-6 h-6 text-brand-tan" />
                  </div>
                  <div>
                    <h3 className="font-bold text-brand-brown">Business Hours</h3>
                    <p className="mt-1">Mon - Sat: 8:00 AM - 9:00 PM</p>
                    <p>Sun: 9:00 AM - 8:00 PM</p>
                  </div>
                </div>
              </div>

              <div className="mt-10 pt-8 border-t border-brand-brown/10">
                <h3 className="font-bold text-brand-brown mb-4">Follow us for updates</h3>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-brand-tan hover:text-[#b07848] font-medium transition-colors">
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                  @ashoksweetsandbakery
                </a>
              </div>
            </div>

            {/* Static Map / Action Area */}
            <div className="flex flex-col h-full">
              <a 
                href="https://maps.google.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group relative flex-grow min-h-[300px] bg-brand-brown/5 rounded-3xl overflow-hidden border border-brand-brown/10 flex items-center justify-center mb-6 hover:shadow-md transition-shadow"
              >
                {/* Minimalist Map Placeholder representing the static map image request */}
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-brown via-transparent to-transparent bg-[length:20px_20px]" />
                <div className="z-10 bg-white p-4 rounded-xl shadow-lg flex items-center transform group-hover:-translate-y-1 transition-transform">
                  <MapPin className="w-6 h-6 text-brand-tan mr-3" />
                  <span className="font-bold text-brand-brown">View on Google Maps</span>
                </div>
              </a>

              <a
                href={`https://wa.me/${phoneNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center"
              >
                <MessageCircle className="w-6 h-6 mr-2" />
                Chat with us on WhatsApp
              </a>
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
