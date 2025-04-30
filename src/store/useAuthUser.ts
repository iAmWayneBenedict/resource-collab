import { create } from "zustand";

interface TUserState {
	authUser: User | null;
	setAuthUser: (authUser: User | null) => void;
}

interface User {
	// Define the properties of the User object here
	id: string;
	name: string;
	email: string;
	role: string;
	image: string;
	subscription: Record<string, any>;
}

export const useAuthUser = create<TUserState>((set) => ({
	authUser: null,
	setAuthUser: (authUser: User | null) => set({ authUser }),

	reset: () => set({ authUser: null }),
}));
