import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// User Store
interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role?: "admin" | "user";
  wishlist: string[];
  addresses: any[];
}

interface UserStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  logout: () => void;
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
}

export const useUserStore = create<UserStore>(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setUser: (user: User) =>
        set({ user, isAuthenticated: !!user }),
      setToken: (token: string) =>
        set({ token }),
      logout: () =>
        set({ user: null, token: null, isAuthenticated: false }),
      addToWishlist: (productId: string) =>
        set((state) => ({
          user: state.user
            ? {
                ...state.user,
                wishlist: [...new Set([...state.user.wishlist, productId])],
              }
            : null,
        })),
      removeFromWishlist: (productId: string) =>
        set((state) => ({
          user: state.user
            ? {
                ...state.user,
                wishlist: state.user.wishlist.filter((id) => id !== productId),
              }
            : null,
        })),
    }),
    {
      name: 'user-store',
      partialize: (state) => ({ token: state.token }),
    }
  )
);

// Cart Store
interface CartItem {
  productId: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  discountPrice?: number;
  quantity: number;
  variantId?: string;
  color?: string;
  size?: string;
}

interface CartStore {
  items: CartItem[];
  total: number;
  discount: number;
  discountCode?: string;
  shippingCost: number;
  tax: number;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  setDiscount: (discount: number, code?: string) => void;
  setShippingCost: (cost: number) => void;
  calculateTotal: () => void;
  getItemCount: () => number;
}

const calculateCartTotal = (items: CartItem[], discount: number, shippingCost: number, tax: number) => {
  const subtotal = items.reduce((acc, item) => acc + (item.discountPrice || item.price) * item.quantity, 0);
  return Math.round((subtotal - discount + shippingCost + tax) * 100) / 100;
};

export const useCartStore = create<CartStore>(
  persist(
    (set, get) => ({
      items: [],
      total: 0,
      discount: 0,
      shippingCost: 0,
      tax: 0,
      addItem: (item: CartItem) =>
        set((state) => {
          const existingItem = state.items.find((i) => i.productId === item.productId);
          const newItems = existingItem
            ? state.items.map((i) =>
                i.productId === item.productId
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              )
            : [...state.items, item];
          return {
            items: newItems,
            total: calculateCartTotal(newItems, state.discount, state.shippingCost, state.tax),
          };
        }),
      removeItem: (productId: string) =>
        set((state) => {
          const newItems = state.items.filter((i) => i.productId !== productId);
          return {
            items: newItems,
            total: calculateCartTotal(newItems, state.discount, state.shippingCost, state.tax),
          };
        }),
      updateQuantity: (productId: string, quantity: number) =>
        set((state) => {
          const newItems = state.items.map((i) =>
            i.productId === productId ? { ...i, quantity } : i
          );
          return {
            items: newItems,
            total: calculateCartTotal(newItems, state.discount, state.shippingCost, state.tax),
          };
        }),
      clearCart: () => set({ items: [], total: 0, discount: 0, discountCode: undefined, shippingCost: 0, tax: 0 }),
      setDiscount: (discount: number, code?: string) =>
        set((state) => ({
          discount,
          discountCode: code,
          total: calculateCartTotal(state.items, discount, state.shippingCost, state.tax),
        })),
      setShippingCost: (cost: number) =>
        set((state) => ({
          shippingCost: cost,
          total: calculateCartTotal(state.items, state.discount, cost, state.tax),
        })),
      calculateTotal: () => {
        const state = get();
        set({
          total: calculateCartTotal(state.items, state.discount, state.shippingCost, state.tax),
        });
      },
      getItemCount: () => {
        const state = get();
        return state.items.reduce((acc, item) => acc + item.quantity, 0);
      },
    }),
    {
      name: 'cart-store',
    }
  )
);

// Theme Store
interface ThemeStore {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export const useThemeStore = create<ThemeStore>(
  persist(
    (set) => ({
      isDarkMode: false,
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
    }),
    {
      name: 'theme-store',
    }
  )
);
