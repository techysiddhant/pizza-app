import { Alert, Image, StyleSheet, TextInput } from 'react-native'
import React, { useState } from 'react'
import { Text, View } from '@components/Themed'
import Colors from '@constants/Colors'
import Button from '@components/Button'
import { defaultPizzaImage } from '@components/ProductListItem'
import * as ImagePicker from 'expo-image-picker';
import { Stack, useLocalSearchParams } from 'expo-router'
const CreateProductScreen = () => {
 const [name, setName] = useState('');
 const [price, setPrice] = useState('')
 const [error, setError] = useState('');
 const [image, setImage] = useState('');
 const { id } = useLocalSearchParams();
 const isUpdating = !!id;
 const onCreate = () => {
  if (!validateInput()) {
   return;
  }
  resetField()
 }
 const onUpdate = () => {
  if (!validateInput()) {
   return;
  }
  resetField()
 }
 const resetField = () => {
  setName('');
  setPrice('')
 }
 const validateInput = () => {
  setError('')
  if (!name) {
   setError('Name is Required!')
   return false;
  }
  if (!price) {
   setError('Price is required')
   return false;
  }
  if (isNaN(parseFloat(price))) {
   setError('Price is not a number')
   return false;
  }
  return true;
 }
 const onSubmit = () => {
  if (isUpdating) {
   // call update funtion
  }
  else {
   onCreate()
  }
 }
 const pickImage = async () => {
  // No permissions request is necessary for launching the image library
  let result = await ImagePicker.launchImageLibraryAsync({
   mediaTypes: ImagePicker.MediaTypeOptions.Images,
   allowsEditing: true,
   aspect: [4, 3],
   quality: 1,
  });

  console.log(result);

  if (!result.canceled) {
   setImage(result.assets[0].uri);
  }
 };
 const onDelete = () => {
  console.warn('DELETE!!!!!');
 }
 const confirmDelete = () => {
  Alert.alert('Confirm', 'Are you sure you want to delete this product.', [
   { text: 'Cancel' }, { text: "Delete", style: 'destructive', onPress: onDelete }
  ])
 }
 return (
  <View style={styles.container}>
   <Stack.Screen options={{ title: isUpdating ? 'Update Product' : 'Create Product' }} />
   <Image source={{ uri: image || defaultPizzaImage }} style={styles.image} />
   <Text style={styles.textButton} onPress={pickImage}>Select Image</Text>
   <Text style={styles.label}>Name</Text>
   <TextInput placeholder='Name' style={styles.input} value={name} onChangeText={setName} />
   <Text style={styles.label}>Price</Text>
   <TextInput placeholder='9.99' style={styles.input} keyboardType='numeric' value={price} onChangeText={setPrice} />
   <Text style={{ color: 'red' }}>{error}</Text>
   <Button text={isUpdating ? 'Update' : 'Create'} onPress={onSubmit} />
   {isUpdating && <Text onPress={confirmDelete} style={styles.textButton}>Delete</Text>}
  </View>
 )
}

export default CreateProductScreen

const styles = StyleSheet.create({
 container: {
  flex: 1,
  justifyContent: 'center',
  padding: 10
 },
 input: {
  backgroundColor: '#f1f1f1',
  padding: 10,
  borderRadius: 5,
  marginTop: 5,
  marginBottom: 5
 },
 label: {
  color: Colors.light.text,
  fontSize: 16
 },
 image: {
  width: '50%',
  aspectRatio: 1,
  alignSelf: 'center',
  borderRadius: 100
 },
 textButton: {
  alignSelf: 'center',
  fontWeight: 'bold',
  color: Colors.light.tint
 }
})