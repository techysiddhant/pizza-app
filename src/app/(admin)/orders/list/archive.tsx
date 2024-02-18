import { ActivityIndicator, FlatList } from 'react-native';
import OrderListItem from '@components/OrderListItem';
import { Stack } from 'expo-router';
import { Text } from '@components/Themed';
import { useAdminOrderList } from 'src/api/orders';

export default function OrdersScreen() {
 const { data: orders, isLoading, error } = useAdminOrderList({ archived: true });
 if (isLoading) {
  return <ActivityIndicator />
 }
 if (error) {
  return <Text>Failed to load</Text>
 }
 return (
  <>
   <Stack.Screen options={{ title: 'Archive' }} />
   <FlatList
    data={orders}
    contentContainerStyle={{ gap: 10, padding: 10 }}
    renderItem={({ item }) => <OrderListItem order={item} />}
   />
  </>
 );
}