import { useContext } from "react";
import { ResourcePaginatedSearchParamsContext } from "./providers/ResourcePaginatedSearchParams";
import { useStore } from "zustand";

const useResourcePaginatedSearchParams = (selector: any) => {
	const searchParams = useContext(ResourcePaginatedSearchParamsContext);
	if (!searchParams) {
		throw new Error(
			"useResourcePaginatedSearchParams must be used within a ResourcePaginatedSearchParamsProvider",
		);
	}
	return useStore(searchParams, selector);
};

export default useResourcePaginatedSearchParams;
