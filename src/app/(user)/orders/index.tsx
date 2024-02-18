import { ActivityIndicator, FlatList } from 'react-native';
import OrderListItem from '../../../components/OrderListItem';
import { Stack } from 'expo-router';
import { useMyOrderList } from 'src/api/orders';
import { Text } from '@components/Themed';

export default function OrdersScreen() {
 const { data: orders, isLoading, error } = useMyOrderList();
 if (isLoading) {
  return <ActivityIndicator />
 }
 if (error) {
  return <Text>Failed to load {error.message}</Text>
 }
 return (
  <>
   <Stack.Screen options={{ title: 'Orders' }} />
   <FlatList
    data={orders}
    contentContainerStyle={{ gap: 10, padding: 10 }}
    renderItem={({ item }) => <OrderListItem order={item} />}
   />
  </>
 );
}