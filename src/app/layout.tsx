import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import LenisWrapper from "@/components/layouts/LenisWrapper";
import Providers from "./_providers/Providers";
import { Toaster } from "@/components/ui/sonner";
import React from "react";
import { cn } from "@/lib/utils";
import { getSession } from "@/lib/auth";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "./api/uploadthing/core";

export const metadata: Metadata = {
	title: "Coollabs",
	description: "One Platform. Endless Professional Possibilities",
	icons: { icon: "/assets/favicon.svg" },
	openGraph: {
		title: "Coollabs",
		description: "One Platform. Endless Professional Possibilities",
		images: ["/assets/img/thumbnail.svg"],
		siteName: "Coollabs",
		type: "website",
	},
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const session = await getSession();
	console.log(session);
	return (
		<html lang="en" suppressHydrationWarning={true}>
			<head>
				<script
					crossOrigin="anonymous"
					src="//unpkg.com/react-scan/dist/auto.global.js"
				/>
			</head>
			<body className={cn(GeistSans.className)}>
				<NextSSRPlugin
					/**
					 * The `extractRouterConfig` will extract **only** the route configs
					 * from the router to prevent additional information from being
					 * leaked to the client. The data passed to the client is the same
					 * as if you were to fetch `/api/uploadthing` directly.
					 */
					routerConfig={extractRouterConfig(ourFileRouter)}
				/>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					// disableTransitionOnChange
				>
					<Toaster richColors position="top-center" />
					<Providers data={session?.user}>
						<LenisWrapper>{children}</LenisWrapper>
					</Providers>
				</ThemeProvider>
			</body>
		</html>
	);
}
