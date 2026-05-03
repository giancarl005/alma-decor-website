import React, { createContext, useContext, useState, useEffect } from 'react';

interface CartItem {
  id: number;
  name: string;
  slug: string;
  price: number;
  sale_price: number | null;
  image: string;
  quantity: number;
  variation_id?: number | null;
  variation_name?: string | null;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: any, quantity: number, variationId?: number | null, variationName?: string | null) => void;
  removeFromCart: (id: number, variationId?: number | null) => void;
  updateQuantity: (id: number, quantity: number, variationId?: number | null) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem('alma_decor_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('alma_decor_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: any, quantity: number, variationId: number | null = null, variationName: string | null = null) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(item => 
        item.id === product.id && item.variation_id === variationId
      );

      if (existingItemIndex > -1) {
        const newCart = [...prevCart];
        newCart[existingItemIndex].quantity += quantity;
        return newCart;
      }

      return [...prevCart, {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        sale_price: product.sale_price,
        image: product.primary_image,
        quantity: quantity,
        variation_id: variationId,
        variation_name: variationName
      }];
    });
  };

  const removeFromCart = (id: number, variationId: number | null = null) => {
    setCart(prevCart => prevCart.filter(item => !(item.id === id && item.variation_id === variationId)));
  };

  const updateQuantity = (id: number, quantity: number, variationId: number | null = null) => {
    if (quantity < 1) return;
    setCart(prevCart => prevCart.map(item => 
      (item.id === id && item.variation_id === variationId) ? { ...item, quantity } : item
    ));
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + (item.sale_price || item.price) * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
