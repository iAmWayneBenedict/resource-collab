"use client";

import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NextUIProvider } from "@nextui-org/react";
import { useAppTheme } from "@/hooks";

const Providers = ({ children }: any) => {
	const queryClient = new QueryClient();
	useAppTheme();
	return (
		<QueryClientProvider client={queryClient}>
			<NextUIProvider>{children}</NextUIProvider>
		</QueryClientProvider>
	);
};

export default Providers;
