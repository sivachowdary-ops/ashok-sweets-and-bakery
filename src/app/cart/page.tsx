'use client';

import Header from '../../components/Header';
import Footer from '../../components/Footer';
import WhatsAppFloatButton from '../../components/WhatsAppFloatButton';
import FloatingCartButton from '../../components/FloatingCartButton';
import EmptyState from '../../components/EmptyState';
import { useCartStore } from '../../store/cartStore';
import { generateWhatsAppOrderLink, generateWhatsAppMessage } from '../../lib/whatsapp';
import { createOrder } from '../../lib/supabase';
import { Minus, Plus, Trash2, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function CartPage() {
  const { items, updateQuantity, removeItem, getSubtotal, clearCart } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [isCheckout, setIsCheckout] = useState(false);
  const [customer, setCustomer] = useState({ name: '', phone: '', address: '' });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Avoid hydration mismatch on initial load for Zustand persisted state

  const subtotal = getSubtotal();

  const handleWhatsAppOrder = async () => {
    if (!customer.name || !customer.phone || !customer.address) return;
    
    const link = generateWhatsAppOrderLink(items, subtotal, customer);
    const rawMessage = generateWhatsAppMessage(items, subtotal, customer);
    const dbItems = items.map(item => ({
      product_id: item.product.id,
      product_name: item.product.name,
      quantity: item.quantity,
      selected_weight: item.selectedWeight,
      price_at_selection: item.priceAtSelection
    }));

    try {
      await createOrder({
        customer_name: customer.name,
        customer_phone: customer.phone,
        customer_address: customer.address,
        items: dbItems,
        subtotal: subtotal,
        whatsapp_message: rawMessage
      });
      clearCart();
    } catch (err) {
      console.error("Failed to save order to database:", err);
    }
    
    window.open(link, '_blank');
  };

  return (
    <>
      <Header />
      <main className="flex-grow bg-brand-cream/30 min-h-[calc(100vh-64px)] py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-brand-brown mb-8">Your Cart</h1>

          {items.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-brand-brown/10">
              <EmptyState 
                title="Your cart is empty" 
                message="Looks like you haven't added anything to your cart yet."
                actionLabel="Browse Menu"
                actionHref="/menu"
              />
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-brand-brown/10 overflow-hidden flex flex-col md:flex-row">
              
              {/* Cart Items List */}
              <div className="flex-grow p-6 md:p-8 md:border-r border-brand-brown/10">
                <ul className="divide-y divide-brand-brown/10">
                  {items.map((item, idx) => (
                    <li key={`${item.product.id}-${item.selectedWeight}-${idx}`} className="py-6 flex flex-col sm:flex-row gap-6">
                      <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-brand-cream hidden sm:block">
                        <Image 
                          src={item.product.image}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                          sizes="96px"
                        />
                      </div>
                      
                      <div className="flex-grow flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-bold text-brand-brown">{item.product.name}</h3>
                            <p className="text-sm text-brand-brown/60 capitalize mt-1">
                              {item.selectedWeight.replace('_', ' ')}
                            </p>
                          </div>
                          <p className="font-semibold text-brand-tan text-lg">
                            ₹{item.priceAtSelection * item.quantity}
                          </p>
                        </div>
                        
                        <div className="flex justify-between items-end mt-4">
                          <div className="flex items-center border border-brand-brown/20 rounded-lg overflow-hidden h-9 bg-white">
                            <button 
                              onClick={() => updateQuantity(item.product.id, item.selectedWeight, Math.max(1, item.quantity - 1))}
                              className="w-9 h-full flex items-center justify-center text-brand-brown hover:bg-brand-cream transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center text-sm font-medium text-brand-brown">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.product.id, item.selectedWeight, item.quantity + 1)}
                              className="w-9 h-full flex items-center justify-center text-brand-brown hover:bg-brand-cream transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          
                          <button 
                            onClick={() => removeItem(item.product.id, item.selectedWeight)}
                            className="text-red-400 hover:text-red-500 transition-colors p-2 -mr-2"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Order Summary */}
              <div className="w-full md:w-80 bg-brand-cream/30 p-6 md:p-8 flex flex-col">
                <h2 className="text-xl font-serif font-bold text-brand-brown mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-6 flex-grow text-brand-brown/80">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Delivery</span>
                    <span>TBD</span>
                  </div>
                  <div className="border-t border-brand-brown/10 pt-4 mt-4 flex justify-between font-bold text-brand-brown text-lg">
                    <span>Estimated Total</span>
                    <span className="text-brand-tan">₹{subtotal}</span>
                  </div>
                </div>

                {!isCheckout ? (
                  <div className="mt-auto">
                    <p className="text-xs text-brand-brown/60 mb-4 text-center leading-relaxed">
                      * Final price & delivery charges will be confirmed via WhatsApp.
                    </p>
                    <button
                      onClick={() => setIsCheckout(true)}
                      className="w-full py-4 rounded-xl bg-brand-tan hover:bg-[#b07848] text-white font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center"
                    >
                      Proceed to Checkout
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </button>
                    
                    <Link 
                      href="/menu" 
                      className="block w-full text-center py-3 mt-3 text-sm font-medium text-brand-brown hover:text-brand-tan transition-colors"
                    >
                      Continue Browsing
                    </Link>
                  </div>
                ) : (
                  <div className="mt-4 flex flex-col gap-3">
                    <h3 className="font-bold text-brand-brown border-b border-brand-brown/10 pb-2 mb-2">Delivery Details</h3>
                    <input 
                      type="text" 
                      placeholder="Full Name" 
                      value={customer.name}
                      onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-brand-brown/20 focus:outline-none focus:ring-2 focus:ring-brand-tan bg-white text-brand-brown placeholder:text-brand-brown/40"
                    />
                    <input 
                      type="tel" 
                      placeholder="Contact Number" 
                      value={customer.phone}
                      onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-brand-brown/20 focus:outline-none focus:ring-2 focus:ring-brand-tan bg-white text-brand-brown placeholder:text-brand-brown/40"
                    />
                    <textarea 
                      placeholder="Full Delivery Address" 
                      value={customer.address}
                      rows={3}
                      onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-brand-brown/20 focus:outline-none focus:ring-2 focus:ring-brand-tan bg-white text-brand-brown placeholder:text-brand-brown/40 resize-none"
                    ></textarea>
                    
                    <button
                      onClick={handleWhatsAppOrder}
                      disabled={!customer.name || !customer.phone || !customer.address}
                      className="w-full py-4 mt-2 rounded-xl bg-[#25D366] hover:bg-[#20ba59] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center"
                    >
                      Complete via WhatsApp
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </button>
                    
                    <button 
                      onClick={() => setIsCheckout(false)}
                      className="block w-full text-center py-2 text-sm font-medium text-brand-brown/60 hover:text-brand-brown transition-colors"
                    >
                      Back to Cart
                    </button>
                  </div>
                )}
              </div>
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
