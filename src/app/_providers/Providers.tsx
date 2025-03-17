"use client";

import React, { useLayoutEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HeroUIProvider } from "@heroui/react";
import { ToastProvider } from "@heroui/toast";
import { useAppTheme } from "@/hooks";
import { useAuthUser } from "@/store/useAuthUser";
import CustomAlertDialog from "@/components/custom/CustomDialog";
import { PostHogProvider } from "./PostHogProvider";

const queryClient = new QueryClient();
const Providers = ({ data, children }: any) => {
	const { setAuthUser } = useAuthUser();
	useAppTheme();

	useLayoutEffect(() => {
		if (data?.emailVerified) setAuthUser(data);
		else setAuthUser(null);
	}, [data]);

	return (
		<PostHogProvider>
			<QueryClientProvider client={queryClient}>
				<HeroUIProvider>
					<ToastProvider
						placement="bottom-right"
						toastOffset={100}
						toastProps={{
							radius: "lg",
							variant: "flat",
							timeout: 6000,
						}}
					/>
					{children}
					<CustomAlertDialog />
				</HeroUIProvider>
			</QueryClientProvider>
		</PostHogProvider>
	);
};

export default Providers;
