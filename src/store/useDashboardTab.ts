import { create } from "zustand";

type DashboardTabState = {
	dashboardTab: string;
	setDashboardTab: (dashboardTab: any) => void;
	getDashboardTab: () => any;

	reset: () => void;
};

export const useDashboardTab = create<DashboardTabState>((set, get) => ({
	dashboardTab: "resources",
	setDashboardTab: (dashboardTab: any) => set({ dashboardTab }),
	getDashboardTab: () => get().dashboardTab,

	reset: () => set({ dashboardTab: "resources" }),
}));
