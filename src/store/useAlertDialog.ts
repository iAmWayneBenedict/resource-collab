import { create } from "zustand";

type AlertType = "confirm" | "alert";

const DEFAULT_STATE = {
	type: "",
	title: "",
	message: "",
	isOpen: false,
	actionLink: "",
	dialogType: "alert" as AlertType,
	showClose: true,
	onConfirm: () => {},
	onCancel: () => {},
};

type AlertDialogDetailsType = typeof DEFAULT_STATE;

type AlertDialogType = {
	alertDialogDetails: AlertDialogDetailsType;
	setAlertDialogDetails: (details: Partial<AlertDialogDetailsType>) => void;
	reset: () => void;
};

export const useAlertDialog = create<AlertDialogType>((set) => ({
	alertDialogDetails: DEFAULT_STATE,
	setAlertDialogDetails: (details) =>
		set((state) => ({
			alertDialogDetails: {
				...state.alertDialogDetails,
				...details,
			},
		})),

	reset: () => set({ alertDialogDetails: DEFAULT_STATE }),
}));
