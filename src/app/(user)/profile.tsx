import { View, Text, Button } from "react-native";
import { supabase } from "src/lib/supabase";
// import { supabase } from "@/lib/supabase";

const ProfileScreen = () => {
	return (
		<View>
			<Button
				onPress={async () => await supabase.auth.signOut()}
				title="Sign out"
			/>
		</View>
	);
};

export default ProfileScreen;
