import { TUsers } from "@/data/schema";
import { CustomError } from "@/lib/error";
import { userRepository } from "@/repositories";

export const getUser = async <K extends keyof TUsers>(
	by: K,
	value: TUsers[K],
	selectFields?: (keyof TUsers)[]
) => {
	if (!by) throw new CustomError("User not found", null, 404);

	const user = await userRepository.findUserBy(by, value, selectFields);

	if (!user.length) throw new CustomError("User not found", null, 404);

	return user[0];
};

export type TPaginatedUsers = {
	page?: number;
	limit?: number;
	search?: string;
	sortBy?: string;
	sortType?: string;
	filter?: string;
};

export const showPaginatedUsers = async ({
	page,
	limit,
	search,
	sortBy,
	sortType,
	filter,
}: TPaginatedUsers) => {
	try {
		return await userRepository.findAllUsers({ page, limit, search, sortBy, sortType, filter });
	} catch (error) {
		console.log(error);
		throw new CustomError("Error retrieving users", null, 500);
	}
};

export const removeUsers = async (listIds: string[]) => {
	try {
		for (const listId of listIds) {
			await userRepository.remove(listId);
		}

		return true;
	} catch (error) {
		throw new CustomError("Error deleting users", null, 500);
	}
};

export const createUser = async (user: TUsers) => {
	try {
		const newUser = await userRepository.save(user);

		return newUser[0];
	} catch (error) {
		throw new CustomError("Error creating user", null, 500);
	}
};
