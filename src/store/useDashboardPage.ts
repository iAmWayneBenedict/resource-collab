import { create } from "zustand";

type DashboardPageState = {
	dashboardPage: string;
	setDashboardPage: (dashboardPage: any) => void;
	getDashboardPage: () => any;

	reset: () => void;
};

export const useDashboardPage = create<DashboardPageState>((set, get) => ({
	dashboardPage: "resources",
	setDashboardPage: (dashboardPage: any) => set({ dashboardPage }),
	getDashboardPage: () => get().dashboardPage,

	reset: () => set({ dashboardPage: "resources" }),
}));
