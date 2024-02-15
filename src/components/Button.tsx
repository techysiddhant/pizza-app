import { Pressable, StyleSheet, View } from 'react-native';
import Colors from '../constants/Colors';
import { forwardRef } from 'react';
import { Text } from '@components/Themed'
type ButtonProps = {
 text: string;
} & React.ComponentPropsWithoutRef<typeof Pressable>;

const Button = forwardRef<View | null, ButtonProps>(
 ({ text, ...pressableProps }, ref) => {
  return (
   <Pressable ref={ref} {...pressableProps} style={styles.container}>
    <Text style={styles.text}>{text}</Text>
   </Pressable>
  );
 }
);

const styles = StyleSheet.create({
 container: {
  backgroundColor: Colors.light.tint,
  padding: 15,
  alignItems: 'center',
  borderRadius: 100,
  marginVertical: 10,
 },
 text: {
  fontSize: 16,
  fontWeight: '600',
  color: Colors.light.background,
 },
});

export default Button;