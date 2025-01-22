"use client";

import React, { useLayoutEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HeroUIProvider } from "@heroui/react";
import { useAppTheme } from "@/hooks";
import { useAuthUser } from "@/store/useAuthUser";

const Providers = ({ data, children }: any) => {
	const { setAuthUser } = useAuthUser();
	const queryClient = new QueryClient();
	useAppTheme();

	useLayoutEffect(() => {
		if (data) setAuthUser(data);
		else setAuthUser(null);
	}, [data]);

	return (
		<QueryClientProvider client={queryClient}>
			<HeroUIProvider>{children}</HeroUIProvider>
		</QueryClientProvider>
	);
};

export default Providers;
