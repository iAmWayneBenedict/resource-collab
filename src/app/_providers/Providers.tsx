"use client";

import React, { useLayoutEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HeroUIProvider } from "@heroui/react";
import { useAppTheme } from "@/hooks";
import { useAuthUser } from "@/store/useAuthUser";

const queryClient = new QueryClient();
const Providers = ({ data, children }: any) => {
	const { setAuthUser } = useAuthUser();
	useAppTheme();

	useLayoutEffect(() => {
		if (data?.emailVerified) setAuthUser(data);
		else setAuthUser(null);
	}, [data]);

	return (
		<QueryClientProvider client={queryClient}>
			<HeroUIProvider>{children}</HeroUIProvider>
		</QueryClientProvider>
	);
};

export default Providers;
