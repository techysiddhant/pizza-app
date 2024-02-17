import products from '@assets/data/products';
import ProductListItem from '@components/ProductListItem';
import { Text } from '@components/Themed';
import { ActivityIndicator, FlatList } from 'react-native';
import { useProductList } from 'src/api/products';


export default function TabOneScreen() {
  const { data: products, error, isLoading } = useProductList();
  if (isLoading) {
    return <ActivityIndicator />
  }
  if (error) {
    return <Text>Failed to fetch products</Text>
  }
  return (
    <FlatList data={products} renderItem={
      ({ item }) => <ProductListItem product={item} key={item.id} />
    } numColumns={2} contentContainerStyle={{ gap: 10, padding: 10 }} columnWrapperStyle={{ gap: 10 }} />
  );
}


