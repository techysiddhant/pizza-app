import products from "@assets/data/products";
import { Link, Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Image, StyleSheet, Pressable, ActivityIndicator } from "react-native";
import { Text, View } from "@components/Themed";
import Colors from "@constants/Colors";
import { defaultPizzaImage } from "@components/ProductListItem";
import { useState } from "react";
import Button from "@components/Button";
import { useCart } from "src/providers/CartProvider";
import { PizzaSize } from "src/types";
import { FontAwesome } from "@expo/vector-icons";
import { useProduct } from "src/api/products";
import RemoteImage from "@components/RemoteImage";
const sizes: PizzaSize[] = ["S", "M", "L", "XL"];
const ProductDetailsScreen = () => {
	const router = useRouter();
	const [selectedSize, setSelectedSize] = useState<PizzaSize>("M");
	const { id: idString } = useLocalSearchParams();
	const id = parseInt(typeof idString === "string" ? idString : idString[0]);
	const { data: product, error, isLoading } = useProduct(id);
	const { addItem } = useCart();

	const addToCart = () => {
		// TODO: Add to cart
		if (!product) return;
		addItem(product, selectedSize);
		router.push("/cart");
	};

	if (isLoading) {
		return <ActivityIndicator />;
	}
	if (error) {
		return <Text>Failed to fetch products</Text>;
	}
	return (
		<View style={styles.container}>
			<Stack.Screen
				options={{
					title: "Edit",
					headerRight: () => (
						<Link
							href={`/(admin)/menu/create?id=${id}`}
							asChild
						>
							<Pressable>
								{({ pressed }) => (
									<FontAwesome
										name="pencil"
										size={25}
										color={Colors.light.tint}
										style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
									/>
								)}
							</Pressable>
						</Link>
					),
				}}
			/>
			<Stack.Screen options={{ title: product?.name }} />
			<RemoteImage
				path={product?.image}
				fallback={defaultPizzaImage}
				style={styles.image}
			/>

			<Text style={styles.title}>{product?.name}</Text>
			<Text style={styles.price}>&#8377;{product?.price}</Text>
		</View>
	);
};

export default ProductDetailsScreen;
const styles = StyleSheet.create({
	container: {
		backgroundColor: Colors.light.background,
		flex: 1,
		padding: 10,
	},
	image: {
		width: "100%",
		aspectRatio: 1,
		borderRadius: 1000,
	},
	price: {
		fontSize: 18,
		color: Colors.light.text,
		fontWeight: "bold",
		// marginTop: 'auto'
	},
	title: {
		fontSize: 24,
		color: Colors.light.text,
	},
});
