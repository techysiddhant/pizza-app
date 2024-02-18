import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "src/lib/supabase";
import { useAuth } from "src/providers/AuthProvider";
import { Order, Product } from "src/types";
import { Tables } from "src/database.types";
import { InsertTables } from "src/types";
export const useAdminOrderList = ({ archived = false }) => {
	const statuses = archived ? ["Delivered"] : ["New", "Cooking", "Delivering"];
	return useQuery({
		queryKey: ["orders", { archived }],
		queryFn: async () => {
			const { data, error } = await supabase
				.from("orders")
				.select("*")
				.in("status", statuses)
				.order("created_at", { ascending: false });
			if (error) {
				throw new Error(error.message);
			}
			return data;
		},
	});
};

export const useMyOrderList = () => {
	const { session } = useAuth();
	const id = session?.user.id;
	return useQuery({
		queryKey: ["orders", { userId: id }],
		queryFn: async () => {
			if (!id) {
				return null;
			}
			const { data, error } = await supabase
				.from("orders")
				.select("*")
				.eq("user_id", id)
				.order("created_at", { ascending: false });
			if (error) {
				throw new Error(error.message);
			}
			return data;
		},
	});
};

export const useOrderDetails = (id: number) => {
	return useQuery({
		queryKey: ["orders", id],
		queryFn: async () => {
			const { data, error } = await supabase
				.from("orders")
				.select("*, order_items(*, products(*))")
				.eq("id", id)
				.single();
			if (error) {
				throw new Error(error.message);
			}
			return data;
		},
	});
};

export const useInsertOrder = () => {
	const queryClient = useQueryClient();
	const { session } = useAuth();
	const userId = session?.user.id;
	return useMutation({
		async mutationFn(data: InsertTables<"orders">) {
			const { error, data: newProduct } = await supabase
				.from("orders")
				.insert({ ...data, user_id: userId })
				.select()
				.single();
			if (error) {
				throw new Error(error.message);
			}
			return newProduct;
		},
		async onSuccess() {
			await queryClient.invalidateQueries({
				queryKey: ["orders"],
			});
		},
		// onError (error){
		// TODO:ADD error
		// }
	});
};

export const useUpdateOrder = () => {
	const queryClient = useQueryClient();

	return useMutation({
		async mutationFn({ id, status }: Pick<Order, "id" | "status">) {
			const { data, error } = await supabase
				.from("orders")
				.update({ status })
				.eq("id", id)
				.select();

			if (error) {
				throw error;
			}
			return data;
		},
		async onSuccess(_, { id }) {
			await queryClient.invalidateQueries({
				queryKey: ["orders"],
			});
			await queryClient.invalidateQueries({
				queryKey: ["order", id],
			});
		},
		onError(error) {
			console.log(error);
		},
	});
};
