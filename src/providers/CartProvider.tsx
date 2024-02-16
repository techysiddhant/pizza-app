import { createContext, useContext, useState } from 'react'
import { CartItem, Product } from 'src/types';
import { randomUUID } from 'expo-crypto';
type CartType = {
 items: CartItem[];
 addItem: (product: Product, size: CartItem['size']) => void;
 updateQuantity: (itemId: string, amount: -1 | 1) => void;
 total: number;
}
export const CartContext = createContext<CartType>({
 items: [],
 addItem: () => { },
 updateQuantity: () => { },
 total: 0,
});

const CartProvider = ({ children }: { children: React.ReactNode }) => {
 const [items, setItems] = useState<CartItem[]>([]);
 const addItem = (product: Product, size: CartItem["size"]) => {
  const existingItem = items.find((item) => item.product_id === product.id && item.size === size);
  if (existingItem) {
   updateQuantity(existingItem.id, 1);
   return;
  }
  const newCartItem: CartItem = {
   id: randomUUID(), // generate
   product,
   product_id: product.id,
   size,
   quantity: 1,
  };
  console.log(newCartItem);
  setItems([newCartItem, ...items]);
 };
 const updateQuantity = (itemId: string, amount: -1 | 1) => {
  setItems(items.map((item) =>
   item.id === itemId ? { ...item, quantity: item.quantity + amount } : item
  ).filter((item) => item.quantity > 0));
 };
 const total = items.reduce((total, item) => total + item.product.price * item.quantity, 0);
 return (
  <CartContext.Provider
   value={{
    items,
    addItem,
    updateQuantity,
    total
   }}
  >
   {children}
  </CartContext.Provider>
 );
};

export default CartProvider

// const styles = StyleSheet.create({})
export const useCart = () => useContext(CartContext);