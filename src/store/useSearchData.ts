import { create } from "zustand";

type SearchDataType = {
	searchData: any;
	setSearchData: (searchData: any) => void;
	getSearchData: () => any;

	reset: () => void;
};

export const useSearchData = create<SearchDataType>((set, get) => ({
	searchData: null,
	setSearchData: (searchData) => set({ searchData }),
	getSearchData: () => get().searchData,

	reset: () => set({ searchData: null }),
}));
