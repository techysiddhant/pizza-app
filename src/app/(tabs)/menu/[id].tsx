import { Stack, useLocalSearchParams } from 'expo-router'
import { View, Text } from 'react-native'

const ProductDetailsScreen = () => {
 const { id } = useLocalSearchParams();
 return (
  <View>
   <Stack.Screen options={{ title: 'Product Details ' + id }} />
   <Text>ProductDetails ID: {id}</Text>
  </View>
 )
}

export default ProductDetailsScreen