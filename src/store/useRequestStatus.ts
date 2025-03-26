import { create } from "zustand";

type RequestStatusState = {
	requestStatus: "pending" | "loading" | "success" | "error";
	setRequestStatus: (requestStatus: any) => void;
	getRequestStatus: () => any;

	reset: () => void;
};

export const useRequestStatus = create<RequestStatusState>((set, get) => ({
	requestStatus: "pending",
	setRequestStatus: (requestStatus: any) => set({ requestStatus }),
	getRequestStatus: () => get().requestStatus,

	reset: () => set({ requestStatus: "pending" }),
}));
