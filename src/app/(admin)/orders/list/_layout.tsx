import { Tabs, withLayoutContext } from "expo-router";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "@constants/Colors";
const TopTabs = withLayoutContext(createMaterialTopTabNavigator().Navigator);
export default function OrderListNavigator() {
 return (
  <SafeAreaView style={{ flex: 1, backgroundColor: Colors.light.background }} edges={['top']}>
   <TopTabs>
    <TopTabs.Screen name='index' options={{ title: 'Active' }} />
   </TopTabs>
  </SafeAreaView>
 )
}