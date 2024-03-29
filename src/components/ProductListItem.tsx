import { StyleSheet, Image, Pressable } from "react-native";
import { Text } from "@components/Themed";
import Colors from "@constants/Colors";
import { Tables } from "../types";
import { Link, useSegments } from "expo-router";
import RemoteImage from "./RemoteImage";
export const defaultPizzaImage =
	"https://notjustdev-dummy.s3.us-east-2.amazonaws.com/food/default.png";
type ProductListItemProps = {
	product: Tables<"products">;
};

const ProductListItem = ({ product }: ProductListItemProps) => {
	const segments = useSegments();

	// Fix type error by checking if segments[0] is defined before using it
	let menuLink = `/menu/${product.id}`;
	if (segments[0]) {
		menuLink = `/${segments[0]}/menu/${product.id}`;
	}

	return (
		<Link
			href={menuLink as any}
			asChild
		>
			<Pressable style={styles.container}>
				{/* <Image
     source={{ uri: product.image || defaultPizzaImage }}
     
    /> */}
				<RemoteImage
					style={styles.image}
					resizeMode="contain"
					path={product?.image}
					fallback={defaultPizzaImage}
				/>
				<Text style={styles.title}>{product.name}</Text>
				<Text style={styles.price}>&#8377;{product.price}</Text>
			</Pressable>
		</Link>
	);
};

export default ProductListItem;
const styles = StyleSheet.create({
	container: {
		backgroundColor: Colors.light.background,
		padding: 10,
		borderRadius: 20,
		flex: 1,
		maxWidth: "50%",
	},
	title: {
		fontSize: 18,
		fontWeight: "600",
		marginVertical: 10,
		color: Colors.light.text,
	},
	price: {
		color: Colors.light.tint,
	},
	image: {
		width: "100%",
		aspectRatio: 1,
		borderRadius: 100,
	},
});
