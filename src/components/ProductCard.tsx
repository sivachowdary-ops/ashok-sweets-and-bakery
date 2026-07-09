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
  const [selectedWeight, setSelectedWeight] = useState<'half_kg' | 'one_kg' | 'unit'>(
    product.price.unit ? 'unit' : 'half_kg'
  );
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore(state => state.addItem);

  const hasWeightOptions = product.price.half_kg !== undefined && product.price.one_kg !== undefined;
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
        {product.featured && (
          <span className="absolute top-3 right-3 bg-brand-tan text-white text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider">
            Popular
          </span>
        )}
      </div>
      
      <div className="p-3 sm:p-5 flex flex-col flex-grow">
        <div className="flex-grow">
          <h3 className="font-serif text-base sm:text-lg font-bold text-brand-brown mb-1 leading-tight">{product.name}</h3>
          <p className="text-brand-tan font-semibold text-base sm:text-lg mb-3 sm:mb-4">₹{currentPrice}</p>
        </div>

        {hasWeightOptions && (
          <div className="flex p-1 bg-brand-cream rounded-lg mb-4">
            <button
              onClick={() => setSelectedWeight('half_kg')}
              className={`flex-1 text-sm font-medium py-1.5 rounded-md transition-colors ${selectedWeight === 'half_kg' ? 'bg-white shadow-sm text-brand-brown' : 'text-brand-brown/60 hover:text-brand-brown'}`}
            >
              ½ kg
            </button>
            <button
              onClick={() => setSelectedWeight('one_kg')}
              className={`flex-1 text-sm font-medium py-1.5 rounded-md transition-colors ${selectedWeight === 'one_kg' ? 'bg-white shadow-sm text-brand-brown' : 'text-brand-brown/60 hover:text-brand-brown'}`}
            >
              1 kg
            </button>
          </div>
        )}
        
        {!hasWeightOptions && <div className="h-8 sm:h-10 mb-3 sm:mb-4"></div> /* Spacer to keep cards aligned */}

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
      </div>
    </div>
  );
}
