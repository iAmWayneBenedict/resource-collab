import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type RecentSearchesState = {
	resources: string[];
	portfolios: string[];
	setAddResource: (name: string) => void;
	setAddPortfolio: (name: string) => void;
	reset: () => void;
};

export const useRecentSearches = create(
	persist<RecentSearchesState>(
		(set, get) => ({
			resources: [],
			portfolios: [],

			setAddResource: (name: string) => {
				const resources = get().resources;
				if (resources.length >= 5) resources.shift();
				set({ resources: [...new Set([name, ...resources])] });
			},

			setAddPortfolio: (name: string) => {
				const portfolios = get().portfolios;
				if (portfolios.length >= 5) portfolios.shift();
				set({ portfolios: [...new Set([name, ...portfolios])] });
			},

			reset: () => set({ resources: [], portfolios: [] }),
		}),
		{
			name: "recent-searches",
			storage: createJSONStorage(() => sessionStorage),
		},
	),
);
