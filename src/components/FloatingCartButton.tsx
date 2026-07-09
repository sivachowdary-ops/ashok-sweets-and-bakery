'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '../store/cartStore';

export default function FloatingCartButton() {
  const [mounted, setMounted] = useState(false);
  const items = useCartStore((state) => state.items);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  // Avoid hydration mismatch and only show if there are items in the cart
  if (!mounted || items.length === 0) return null;

  // Calculate total number of items
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <Link
      href="/cart"
      className="fixed bottom-[88px] right-6 z-50 bg-brand-brown text-white p-4 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
      aria-label="View Cart"
    >
      <ShoppingCart className="w-6 h-6" />
      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-white shadow-sm">
        {totalItems > 99 ? '99+' : totalItems}
      </span>
    </Link>
  );
}
