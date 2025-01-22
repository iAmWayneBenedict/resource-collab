import { create } from "zustand";

type ChecklistItem = {
	id: string;
	list: unknown[];
};

type ChecklistState = {
	checklist: ChecklistItem[];
	isExists: (id: string | number) => boolean;
	addChecklist: (id: string, list: unknown[]) => void;
	removeChecklist: (id: string) => void;
	updateChecklist: (id: string, list: unknown[]) => void;
	getChecklistById: (id: string) => ChecklistItem | undefined;
	reset: () => void;
};

export const useChecklist = create<ChecklistState>((set, get) => ({
	checklist: [],

	/**
	 * Checks if a given id exists in the checklist state.
	 * @param {string|number} id - The id to check for.
	 * @returns {boolean} true if the id exists, false otherwise.
	 */
	isExists: (id: string | number): boolean => {
		return !!get().checklist.find((item) => item.id === id);
	},

	/**
	 * Adds a new checklist to the checklist state.
	 * @param {string|number} id - The id of the checklist to add.
	 * @param {unknown[]} list - The initial checked list for the checklist.
	 */
	addChecklist: (id: string | number, list: unknown[]) => {
		set((state) => ({
			checklist: [...state.checklist, { id: id.toString(), list }],
		}));
	},

	/**
	 * Removes a checklist with a given id from the checklist state.
	 * @param {string|number} id - The id of the checklist to remove.
	 */
	removeChecklist: (id: string | number) => {
		set((state) => ({
			checklist: state.checklist.filter((item) => item.id !== id),
		}));
	},

	/**
	 * Updates a checklist with a given id in the checklist state.
	 * @param {string|number} id - The id of the checklist to update.
	 * @param {unknown[]} list - The new checked list for the checklist.
	 */
	updateChecklist: (id: string | number, list: unknown[]) => {
		set((state) => ({
			checklist: state.checklist.map((item) => {
				if (item.id === id) {
					return { ...item, list };
				}
				return item;
			}),
		}));
	},

	/**
	 * Gets a checklist from the checklist state by its id.
	 * @param {string|number} id - The id of the checklist to get.
	 * @returns {ChecklistItem|undefined} The checklist with the given id, or undefined if not found.
	 */
	getChecklistById: (id: string | number): ChecklistItem | undefined => {
		return get().checklist.find((item) => item.id === id);
	},

	reset: () => set({ checklist: [] }),
}));
