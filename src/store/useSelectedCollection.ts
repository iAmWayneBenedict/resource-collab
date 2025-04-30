import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type SelectedCollectionType = {
	selectedCollection: any;
	setSelectedCollection: (selectedCollection: any) => void;
	getSelectedCollection: () => any;

	reset: () => void;
};

export const useSelectedCollection = create(
	persist<SelectedCollectionType>(
		(set, get) => ({
			selectedCollection: null,
			setSelectedCollection: (selectedCollection: any) =>
				set({ selectedCollection }),
			getSelectedCollection: () => get().selectedCollection,

			reset: () => set({ selectedCollection: null }),
		}),
		{
			name: "selectedCollection",
			storage: createJSONStorage(() => sessionStorage),
		},
	),
);
