import { FlatList, Platform, StyleSheet, Text } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { useCart } from 'src/providers/CartProvider'
import { CartItem, Product } from 'src/types'
import { View } from '@components/Themed'
import CartListItem from '@components/CartListItem'
import Button from '@components/Button'

const CartScreen = () => {
 const { items, total } = useCart();
 // console.warn(value);
 return (
  <View style={{ padding: 10 }}>
   <FlatList data={items} renderItem={({ item }) => <CartListItem key={item.id} cartItem={item} />} contentContainerStyle={{ padding: 10, gap: 10 }} />
   <Text style={{ marginTop: 20, fontSize: 20, fontWeight: '500' }}>Total: ${total} </Text>
   <Button text="Checkout" onPress={() => { }} />
   <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
  </View>
 )
}

export default CartScreen

const styles = StyleSheet.create({})