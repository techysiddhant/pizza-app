import { createContext, useContext, useState } from 'react'
import { CartItem, Tables } from 'src/types';
import { randomUUID } from 'expo-crypto';
import { useInsertOrder } from 'src/api/orders';
import { useRouter } from 'expo-router';
import { useInsertOrderItems } from 'src/api/order-items';
type Product = Tables<'products'>
type CartType = {
 items: CartItem[];
 addItem: (product: Product, size: CartItem['size']) => void;
 updateQuantity: (itemId: string, amount: -1 | 1) => void;
 total: number;
 checkout: () => void;
}
export const CartContext = createContext<CartType>({
 items: [],
 addItem: () => { },
 updateQuantity: () => { },
 total: 0,
 checkout: () => { }
});

const CartProvider = ({ children }: { children: React.ReactNode }) => {
 const [items, setItems] = useState<CartItem[]>([]);
 const router = useRouter();
 const { mutate: insertOrder } = useInsertOrder();
 const { mutate: insertOrderItems } = useInsertOrderItems();

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
 const clearCart = () => {
  setItems([]);
 }
 const checkout = () => {
  insertOrder({ total }, {
   onSuccess: saveOrderItems
  });
 }
 const saveOrderItems = (order: any) => {
  const orderItems = items.map((cartItem) => ({
   order_id: order.id,
   product_id: cartItem.product.id,
   quantity: cartItem.quantity,
   size: cartItem.size
  }));
  insertOrderItems(
   orderItems
   ,
   {
    onSuccess() {
     clearCart();
     router.push(`/(user)/orders/${order.id}`)
    }
   });

 }
 return (
  <CartContext.Provider
   value={{
    items,
    addItem,
    updateQuantity,
    total,
    checkout
   }}
  >
   {children}
  </CartContext.Provider>
 );
};

export default CartProvider

// const styles = StyleSheet.create({})
export const useCart = () => useContext(CartContext);