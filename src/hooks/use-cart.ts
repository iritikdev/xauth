import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { toast } from 'sonner';

interface CartItem {
  id: string;
  name: string;
  price: number; // MRP
  discount: number; // Associate %
  bvAmount: number;
  image: string;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (product: any, quantity: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCart = create(
  persist<CartStore>((set, get) => ({
    items: [],
    addItem: (product, quantity) => {
      const currentItems = get().items;
      const existingItem = currentItems.find((item) => item.id === product.id);

      if (existingItem) {
        return toast.info("Item already in cart, quantity updated.");
      }

      set({ items: [...get().items, { ...product, quantity }] });
      toast.success("Added to Business Cart");
    },
    removeItem: (id) => {
      set({ items: get().items.filter((item) => item.id !== id) });
    },
    updateQuantity: (id, quantity) => {
      set({
        items: get().items.map((item) =>
          item.id === id ? { ...item, quantity } : item
        ),
      });
    },
    clearCart: () => set({ items: [] }),
  }), {
    name: 'amaze-cart-storage',
    storage: createJSONStorage(() => localStorage),
  })
);