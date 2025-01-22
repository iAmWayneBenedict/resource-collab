import { SortDescriptor } from "@heroui/react";
import { create } from "zustand";

type SortState = {
	sort: SortDescriptor;

	setSort: (sort: SortState["sort"]) => void;

	reset: () => void;
};

export const useSortTable = create<SortState>((set) => ({
	sort: { column: "name", direction: "ascending" },

	setSort: (sort) => set({ sort }),

	reset: () => set({ sort: { column: "name", direction: "ascending" } }),
}));
