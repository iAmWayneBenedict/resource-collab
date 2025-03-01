import { create } from "zustand";
type CollectionsState = {
	collections: any;
	setCollections: (collections: any) => void;
	getCollections: () => any;
};

export const useCollections = create<CollectionsState>((set, get) => ({
	collections: null,
	setCollections: (collections: any) => set({ collections }),
	getCollections: () => get().collections,

	reset: () => set({ collections: null }),
}));
