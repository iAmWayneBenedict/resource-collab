import { create } from "zustand";

type TModalState = {
	name: string;
	title: string;
	type: string;
	data: any;
	isOpen: boolean;
	onSubmitCallback: (data: any) => void;
	onOpen: (name: string, data: any, type?: string) => void;
	onClose: () => void;
	reset: () => void;
};

export const useModal = create<TModalState>((set) => ({
	name: "",
	title: "",
	type: "",
	data: null,
	isOpen: false,
	onSubmitCallback: (data) => {},
	onOpen: (name, data, type) => set({ name, data, type: type || "create", isOpen: true }),
	onClose: () => set({ isOpen: false, data: null, name: "", type: "" }),

	reset: () => set({ name: "", data: null, isOpen: false, type: "" }),
}));
