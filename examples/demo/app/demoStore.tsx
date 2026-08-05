import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

export type DemoStore = {
  selectedOptions: Record<string, string>;
  selectOption: (productId: string, optionId: string) => void;
  wishlist: ReadonlySet<string>;
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  cart: Readonly<Record<string, number>>;
  addToCart: (productId: string) => void;
  decrementCart: (productId: string) => void;
  removeFromCart: (productId: string) => void;
  quantity: (productId: string) => number;
  cartCount: number;
};

const DemoStoreContext = createContext<DemoStore | null>(null);

export function DemoStoreProvider({ children }: { children: ReactNode }) {
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [wishlist, setWishlist] = useState<ReadonlySet<string>>(new Set());
  const [cart, setCart] = useState<Readonly<Record<string, number>>>({});

  const selectOption = useCallback((productId: string, optionId: string) => {
    setSelectedOptions((current) => ({ ...current, [productId]: optionId }));
  }, []);

  const toggleWishlist = useCallback((productId: string) => {
    setWishlist((current) => {
      const next = new Set(current);
      if (next.has(productId)) {
        next.delete(productId);
      } else {
        next.add(productId);
      }
      return next;
    });
  }, []);

  const addToCart = useCallback((productId: string) => {
    setCart((current) => ({ ...current, [productId]: (current[productId] ?? 0) + 1 }));
  }, []);

  const decrementCart = useCallback((productId: string) => {
    setCart((current) => {
      const quantity = current[productId] ?? 0;
      if (quantity <= 1) {
        const { [productId]: _removed, ...rest } = current;
        return rest;
      }
      return { ...current, [productId]: quantity - 1 };
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart((current) => {
      const { [productId]: _removed, ...rest } = current;
      return rest;
    });
  }, []);

  const isWishlisted = useCallback((productId: string) => wishlist.has(productId), [wishlist]);

  const quantity = useCallback((productId: string) => cart[productId] ?? 0, [cart]);

  const cartCount = useMemo(
    () => Object.values(cart).reduce((sum, count) => sum + count, 0),
    [cart]
  );

  const value = useMemo<DemoStore>(
    () => ({
      selectedOptions,
      selectOption,
      wishlist,
      toggleWishlist,
      isWishlisted,
      cart,
      addToCart,
      decrementCart,
      removeFromCart,
      quantity,
      cartCount,
    }),
    [
      selectedOptions,
      selectOption,
      wishlist,
      toggleWishlist,
      isWishlisted,
      cart,
      addToCart,
      decrementCart,
      removeFromCart,
      quantity,
      cartCount,
    ]
  );

  return <DemoStoreContext.Provider value={value}>{children}</DemoStoreContext.Provider>;
}

export function useDemoStore(): DemoStore {
  const value = useContext(DemoStoreContext);
  if (value == null) {
    throw new Error("useDemoStore must be used within a DemoStoreProvider");
  }
  return value;
}
