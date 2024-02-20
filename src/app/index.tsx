// import "react-native-polyfill-globals/auto";
import { View, Text, ActivityIndicator } from "react-native";
import React from "react";
import Button from "../components/Button";
import { Link, Redirect } from "expo-router";
import { useAuth } from "src/providers/AuthProvider";
import { supabase } from "src/lib/supabase";
const index = () => {
	const { session, loading, isAdmin } = useAuth();
	console.log(session);
	if (loading) {
		return <ActivityIndicator />;
	}
	if (!session) {
		return <Redirect href={"/sign-in"} />;
	}
	if (!isAdmin) {
		<Redirect href={"/(user)"} />;
	}

	return (
		<View style={{ flex: 1, justifyContent: "center", padding: 10 }}>
			<Link
				href={"/(user)"}
				asChild
			>
				<Button text="User" />
			</Link>
			<Link
				href={"/(admin)"}
				asChild
			>
				<Button text="Admin" />
			</Link>
			{/* <Link href={'/sign-in'} asChild>
    <Button text="Sign in" />
   </Link> */}
			<Button
				onPress={() => supabase.auth.signOut()}
				text="Sign out"
			/>
		</View>
	);
};

export default index;
