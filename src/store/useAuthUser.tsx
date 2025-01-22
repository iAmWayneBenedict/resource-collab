import { create } from "zustand";

interface UserState {
	authUser: User | null;
	setAuthUser: (authUser: User | null) => void;
}

interface User {
	// Define the properties of the User object here
	id: string;
	name: string;
	email: string;
	role: string;
}

export const useAuthUser = create<UserState>((set) => ({
	authUser: null,
	setAuthUser: (authUser: User | null) => set({ authUser }),

	reset: () => set({ authUser: null }),
}));
