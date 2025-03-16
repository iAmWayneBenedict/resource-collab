import { create } from "zustand";

interface Params {
	// Define the properties of the User object here
	query: string;
	setQuery: (query: string) => void;
	reset: () => void;
}

export const useAISearchStore = create<Params>((set) => ({
	query: "",

	setQuery: (query: string) => set({ query }),

	reset: () => set({ query: "" }),
}));
