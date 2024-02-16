import products from '@assets/data/products';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import { Image, StyleSheet, Pressable } from 'react-native'
import { Text, View } from '@components/Themed'
import Colors from '@constants/Colors';
import { defaultPizzaImage } from '@components/ProductListItem';
import { useState } from 'react';
import Button from '@components/Button';
import { useCart } from 'src/providers/CartProvider';
import { PizzaSize } from 'src/types';
const sizes: PizzaSize[] = ['S', 'M', 'L', 'XL']
const ProductDetailsScreen = () => {
 const router = useRouter();
 const [selectedSize, setSelectedSize] = useState<PizzaSize>('M');
 const { id } = useLocalSearchParams();
 const { addItem } = useCart();
 const product = products.find(product => product.id.toString() === id);

 const addToCart = () => {
  // TODO: Add to cart
  if (!product) return;
  addItem(product, selectedSize);
  router.push('/cart');

 }

 if (!product) {
  return <Text>Product not found</Text>
 }
 return (
  <View style={styles.container}>
   <Stack.Screen options={{ title: product?.name }} />
   <Image source={{ uri: product.image || defaultPizzaImage }} style={styles.image} />
   <Text style={styles.selectSize}>Select size</Text>
   <View style={styles.sizes}>
    {
     sizes.map((size) => (
      <Pressable onPress={() => { setSelectedSize(size) }} key={size} style={[styles.size, { backgroundColor: selectedSize === size ? Colors.light.tint : Colors.light.background }]}>
       <Text style={[styles.sizeText, { color: selectedSize === size ? Colors.light.background : Colors.light.text }]}>{size}</Text>
      </Pressable>
     ))
    }
   </View>
   <Text style={styles.price}>${product.price}</Text>
   <Button onPress={addToCart} text="Add to cart" />
  </View>
 )
}

export default ProductDetailsScreen
const styles = StyleSheet.create({
 container: {
  backgroundColor: Colors.light.background,
  flex: 1,
  padding: 10
 },
 image: {
  width: '100%',
  aspectRatio: 1,
 },
 price: {
  fontSize: 18,
  color: Colors.light.text,
  fontWeight: 'bold',
  marginTop: 'auto'
 },
 selectSize: {
  color: Colors.light.text,
 },
 sizes: {
  flexDirection: 'row',
  justifyContent: 'space-around',
  marginVertical: 10,
  backgroundColor: Colors.light.background,
 },
 size: {
  backgroundColor: Colors.light.background,
  color: Colors.light.text,
  width: 50,
  aspectRatio: 1,
  borderRadius: 25,
  alignItems: 'center',
  justifyContent: 'center'
 },
 sizeText: {
  fontSize: 20,
  fontWeight: '500',
  color: Colors.light.text,
 },
})