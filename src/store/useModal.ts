import { create } from "zustand";

type TModalState = {
	name: string;
	title: string;
	type: string;
	data: any;
	isOpen: boolean;
	onSubmitCallback: (data: any) => void;
	onFormChangeCallback: (data: any) => void;
	setSubmitCallback: (callback: (data: any) => void) => void;
	onOpen: (name: string, data: any, type?: string, title?: string) => void;
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
	onFormChangeCallback: (data) => {},
	onOpen: (name, data, type, title) =>
		set({ name, data, type: type ?? "create", isOpen: true, title }),
	onClose: () =>
		set({ isOpen: false, data: null, name: "", type: "", title: "" }),

	setSubmitCallback: (callback) => set({ onSubmitCallback: callback }),
	reset: () =>
		set({ name: "", data: null, isOpen: false, type: "", title: "" }),
}));
