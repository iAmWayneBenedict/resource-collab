import { createContext, ReactNode, useState } from "react";
import { createStore, StoreApi } from "zustand";

export interface ResourcePaginatedSearchParamsState {
	searchParams: Record<string, any>;
	actions: {
		setSearchParams: (searchParams: Record<string, any>) => void;
		resetSearchParams: () => void;
	};
}

// More specific type for the context
export const ResourcePaginatedSearchParamsContext =
	createContext<StoreApi<ResourcePaginatedSearchParamsState> | null>(null);

// Props interface for the provider component
interface ResourcePaginatedSearchParamsProviderProps {
	children: ReactNode;
	initialSearchParams: Record<string, any>;
}

export const ResourcePaginatedSearchParamsProvider = ({
	children,
	initialSearchParams,
}: ResourcePaginatedSearchParamsProviderProps) => {
	const [searchParamsStore] = useState(() =>
		createStore<ResourcePaginatedSearchParamsState>((set) => ({
			searchParams: initialSearchParams,
			actions: {
				setSearchParams: (searchParams) => set({ searchParams }),
				resetSearchParams: () =>
					set({ searchParams: initialSearchParams }),
			},
		})),
	);

	return (
		<ResourcePaginatedSearchParamsContext.Provider
			value={searchParamsStore}
		>
			{children}
		</ResourcePaginatedSearchParamsContext.Provider>
	);
};
