import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Product } from '../data/products';

export type CartItem = {
  product: Product;
  quantity: number;
  selectedWeight: 'quarter_kg' | 'half_kg' | 'one_kg' | 'unit';
  priceAtSelection: number;
};

interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity: number, weight: 'quarter_kg' | 'half_kg' | 'one_kg' | 'unit') => void;
  removeItem: (productId: string, weight: 'quarter_kg' | 'half_kg' | 'one_kg' | 'unit') => void;
  updateQuantity: (productId: string, weight: 'quarter_kg' | 'half_kg' | 'one_kg' | 'unit', quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getSubtotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, quantity, weight) => {
        const priceAtSelection = product.price[weight] || 0;
        
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (item) => item.product.id === product.id && item.selectedWeight === weight
          );

          if (existingItemIndex > -1) {
            const newItems = [...state.items];
            newItems[existingItemIndex].quantity += quantity;
            return { items: newItems };
          }
          
          return {
            items: [...state.items, { product, quantity, selectedWeight: weight, priceAtSelection }]
          };
        });
      },
      removeItem: (productId, weight) => {
        set((state) => ({
          items: state.items.filter(
            (item) => !(item.product.id === productId && item.selectedWeight === weight)
          )
        }));
      },
      updateQuantity: (productId, weight, quantity) => {
        set((state) => ({
          items: state.items.map((item) => 
            item.product.id === productId && item.selectedWeight === weight
              ? { ...item, quantity }
              : item
          )
        }));
      },
      clearCart: () => set({ items: [] }),
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
      getSubtotal: () => {
        return get().items.reduce((total, item) => total + (item.priceAtSelection * item.quantity), 0);
      }
    }),
    {
      name: 'bakery-cart-storage',
      // The prompt specifically asks to use sessionStorage so it clears naturally after the visit
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
