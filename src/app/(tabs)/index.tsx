import { StyleSheet, Image } from 'react-native';
import { Text, View } from '@/src/components/Themed';
import Colors from '@/src/constants/Colors';
import products from '@/assets/data/products';
const product = products[0];
export default function TabOneScreen() {
  return (
    <View style={styles.container}>
      <Image source={{ uri: product.image }} style={styles.image} />
      <Text style={styles.title}>{product.name}</Text>
      <Text style={styles.price}>${product.price}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.background,
    padding: 10,
    borderRadius: 20
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 10,
    color: Colors.light.text
  },
  price: {
    color: Colors.light.tint
  },
  image: {
    width: '100%',
    aspectRatio: 1
  }
});
