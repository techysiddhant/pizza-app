import { Alert, Image, StyleSheet, TextInput } from "react-native";
import React, { useEffect, useState } from "react";
import { Text, View } from "@components/Themed";
import Colors from "@constants/Colors";
import Button from "@components/Button";
import { defaultPizzaImage } from "@components/ProductListItem";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import {
	useDeleteProduct,
	useInsertProduct,
	useProduct,
	useUpdateProduct,
} from "src/api/products";
import { randomUUID } from "expo-crypto";
import { supabase } from "src/lib/supabase";
import { decode } from "base64-arraybuffer";
const CreateProductScreen = () => {
	const [name, setName] = useState("");
	const [price, setPrice] = useState("");
	const [error, setError] = useState("");
	const [image, setImage] = useState<string | null>("");
	const router = useRouter();
	const { id: idString } = useLocalSearchParams();
	const id = parseInt(typeof idString === "string" ? idString : idString?.[0]);
	const isUpdating = !!id;
	const { mutate: insertProduct } = useInsertProduct();
	const { mutate: updateProduct } = useUpdateProduct();
	const { data: updatingProduct } = useProduct(id);
	const { mutate: deleteProduct, isPending } = useDeleteProduct();
	useEffect(() => {
		if (updatingProduct) {
			setName(updatingProduct.name);
			setPrice(updatingProduct.price.toString());
			setImage(updatingProduct.image);
		}
	}, [updatingProduct]);
	const onCreate = async () => {
		if (!validateInput()) {
			return;
		}
		const imagePath = await uploadImage();
		insertProduct(
			{ name, price: parseFloat(price), image: imagePath },
			{
				onSuccess: () => {
					resetField();
					router.back();
				},
			}
		);
	};
	const onUpdate = async () => {
		if (!validateInput()) {
			return;
		}
		const imagePath = await uploadImage();
		updateProduct(
			{ id, name, price: parseFloat(price), image: imagePath ? imagePath : "" },
			{
				onSuccess: () => {
					resetField();
					router.back();
				},
			}
		);
	};
	const resetField = () => {
		setName("");
		setPrice("");
	};
	const validateInput = () => {
		setError("");
		if (!name) {
			setError("Name is Required!");
			return false;
		}
		if (!price) {
			setError("Price is required");
			return false;
		}
		if (isNaN(parseFloat(price))) {
			setError("Price is not a number");
			return false;
		}
		return true;
	};
	const onSubmit = () => {
		if (isUpdating) {
			// call update funtion
			onUpdate();
		} else {
			onCreate();
		}
	};
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
		// console.warn('DELETE!!!!!');
		deleteProduct(id, {
			onSuccess: () => {
				resetField();
				router.replace("/(admin)");
			},
		});
	};
	const confirmDelete = () => {
		Alert.alert("Confirm", "Are you sure you want to delete this product.", [
			{ text: "Cancel" },
			{ text: "Delete", style: "destructive", onPress: onDelete },
		]);
	};
	const uploadImage = async () => {
		if (!image?.startsWith("file://")) {
			return;
		}

		const base64 = await FileSystem.readAsStringAsync(image, {
			encoding: "base64",
		});
		const filePath = `${randomUUID()}.png`;
		const contentType = "image/png" || "image/jpg" || "image/jpeg";
		const { data, error } = await supabase.storage
			.from("product-images")
			.upload(filePath, decode(base64), { contentType });

		if (data) {
			return data.path;
		}
	};
	return (
		<View style={styles.container}>
			<Stack.Screen
				options={{ title: isUpdating ? "Update Product" : "Create Product" }}
			/>
			<Image
				source={{ uri: image || defaultPizzaImage }}
				style={styles.image}
			/>
			<Text
				style={styles.textButton}
				onPress={pickImage}
			>
				Select Image
			</Text>
			<Text style={styles.label}>Name</Text>
			<TextInput
				placeholder="Name"
				style={styles.input}
				value={name}
				onChangeText={setName}
			/>
			<Text style={styles.label}>Price</Text>
			<TextInput
				placeholder="9.99"
				style={styles.input}
				keyboardType="numeric"
				value={price}
				onChangeText={setPrice}
			/>
			<Text style={{ color: "red" }}>{error}</Text>
			<Button
				text={isUpdating ? "Update" : "Create"}
				onPress={onSubmit}
			/>
			{isUpdating && (
				<Text
					onPress={confirmDelete}
					style={styles.textButton}
					disabled={isPending}
				>
					{isPending ? "Deleting..." : "Delete"}
				</Text>
			)}
		</View>
	);
};

export default CreateProductScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		padding: 10,
	},
	input: {
		backgroundColor: "#f1f1f1",
		padding: 10,
		borderRadius: 5,
		marginTop: 5,
		marginBottom: 5,
	},
	label: {
		color: Colors.light.text,
		fontSize: 16,
	},
	image: {
		width: "50%",
		aspectRatio: 1,
		alignSelf: "center",
		borderRadius: 100,
	},
	textButton: {
		alignSelf: "center",
		fontWeight: "bold",
		color: Colors.light.tint,
	},
});
