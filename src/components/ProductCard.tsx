'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Product } from '../data/products';
import { useCartStore } from '../store/cartStore';
import { Plus, Minus, ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [selectedWeight, setSelectedWeight] = useState<'quarter_kg' | 'half_kg' | 'one_kg' | 'unit'>(() => {
    if (product.price.unit) return 'unit';
    if (product.price.quarter_kg) return 'quarter_kg';
    if (product.price.half_kg) return 'half_kg';
    return 'one_kg';
  });
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore(state => state.addItem);

  const weightOptions = (Object.keys(product.price) as Array<keyof typeof product.price>)
    .filter(key => product.price[key] !== undefined);
  const currentPrice = product.price[selectedWeight] || 0;

  const handleAddToCart = () => {
    addItem(product, quantity, selectedWeight);
    setQuantity(1); // Reset after adding
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-brand-brown/5 flex flex-col h-full">
      <div className="relative h-40 sm:h-48 w-full bg-brand-cream">
        <Image 
          src={product.image} 
          alt={`${product.name} - ${product.category}`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {product.featured && product.available !== false && (
          <span className="absolute top-3 right-3 bg-brand-tan text-white text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider">
            Popular
          </span>
        )}
        {product.available === false && (
          <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider">
            Sold Out
          </span>
        )}
      </div>
      
      <div className="p-3 sm:p-5 flex flex-col flex-grow">
        <div className="flex-grow">
          <h3 className="font-serif text-base sm:text-lg font-bold text-brand-brown mb-1 leading-tight">{product.name}</h3>
          <p className="text-brand-tan font-semibold text-base sm:text-lg mb-3 sm:mb-4">₹{currentPrice}</p>
        </div>

        {weightOptions.length > 1 && (
          <div className="flex p-1 bg-brand-cream rounded-lg mb-4 gap-1">
            {weightOptions.map((weight) => (
              <button
                key={weight}
                disabled={product.available === false}
                onClick={() => setSelectedWeight(weight)}
                className={`flex-1 text-sm font-medium py-1.5 rounded-md transition-colors ${selectedWeight === weight ? 'bg-white shadow-sm text-brand-brown' : 'text-brand-brown/60 hover:text-brand-brown'} ${product.available === false ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {weight === 'quarter_kg' && '¼ kg'}
                {weight === 'half_kg' && '½ kg'}
                {weight === 'one_kg' && '1 kg'}
                {weight === 'unit' && 'Unit'}
              </button>
            ))}
          </div>
        )}
        
        {weightOptions.length <= 1 && <div className="h-8 sm:h-10 mb-3 sm:mb-4"></div> /* Spacer to keep cards aligned */}

        {product.available === false ? (
          <div className="w-full text-center py-2 sm:py-3 bg-gray-100 text-gray-400 border border-gray-200 rounded-lg font-medium text-sm sm:text-base mt-auto select-none">
            Out of Stock
          </div>
        ) : (
          <div className="flex flex-col xl:flex-row gap-2 mt-auto">
            <div className="flex items-center justify-between border border-brand-brown/20 rounded-lg overflow-hidden h-9 sm:h-11 bg-white">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-full flex items-center justify-center text-brand-brown hover:bg-brand-cream transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center font-medium text-brand-brown">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-full flex items-center justify-center text-brand-brown hover:bg-brand-cream transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>
            
            <button 
              onClick={handleAddToCart}
              className="flex-1 h-9 sm:h-11 bg-brand-tan hover:bg-[#b07848] text-white rounded-lg flex items-center justify-center font-medium transition-colors text-sm sm:text-base"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Add
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
