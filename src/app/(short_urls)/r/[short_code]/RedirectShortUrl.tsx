"use client";

import { useGetResourceShortUrlRedirect } from "@/lib/queries/short-urls";
import { useParams, useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { Spinner, Button, Spacer } from "@heroui/react";
import Image from "next/image";
import { bgGradient4 } from "../../../../../public/assets/img";

const RedirectShortUrl = () => {
	const params = useParams();
	const router = useRouter();
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [errorStatus, setErrorStatus] = useState<number | null>(null);

	const {
		data,
		isSuccess,
		isError,
		error: queryError,
	} = useGetResourceShortUrlRedirect({
		short_code: (params?.short_code || "") as string,
	});

	useEffect(() => {
		if (isSuccess && data?.data?.redirect_url) {
			// window.location.href = data.data.redirect_url;
		} else if (isSuccess && !data?.data?.redirect_url) {
			setError("Invalid short URL");
			setIsLoading(false);
		} else if (isError && queryError instanceof Error) {
			// Type guard to ensure queryError is an Error object
			const axiosError = queryError as any; // Cast to any to access potential axios error properties
			setErrorStatus(axiosError?.response?.status);
			// Handle different error scenarios
			if (axiosError?.response?.status === 401) {
				setError("Authentication required to access this resource");
			} else if (axiosError?.response?.status === 403) {
				setError("You don't have permission to access this resource");
			} else {
				setError("This short URL is invalid or has expired");
			}
			setIsLoading(false);
		}
	}, [data, isSuccess, isError, queryError]);

	const handleLogin = () => {
		// Redirect to login page, then return to this URL after login
		router.push(
			`/auth/login?returnUrl=${encodeURIComponent(window.location.pathname)}`,
		);
	};

	if (isLoading) {
		return (
			<div className="flex h-screen w-screen flex-col items-center justify-center gap-5">
				<div className="flex flex-col items-center justify-center">
					<Spinner size="lg" className="text-violet" />
					<p className="mt-4 text-lg font-medium text-gray-700">
						Redirecting you to the resource...
					</p>
					<p className="mt-2 text-sm text-gray-500">
						This may take a moment
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="relative flex min-h-screen w-screen items-center justify-center p-4">
			<div className="w-full max-w-md">
				<div className="flex flex-col justify-center gap-4">
					<div className="h-[4rem] w-full overflow-hidden rounded-[10px]">
						<Image
							className="h-full w-full object-cover"
							src={bgGradient4}
							alt="resource gradient"
						/>
					</div>
					<h1 className="mt-6 text-center font-PlayFairDisplay text-4xl font-semibold">
						Resource Access
					</h1>
				</div>

				<Spacer y={8} />

				<p className="text-center">{error}</p>

				<Spacer y={4} className="mb-12" />

				{errorStatus === 401 ? (
					<Button
						onPress={handleLogin}
						radius="full"
						className="w-full bg-violet py-7 text-white transition-all hover:bg-violet-700"
					>
						Login to Access
					</Button>
				) : (
					<p className="text-center text-sm text-gray-600">
						The link you tried to access is either invalid, expired,
						or you don't have the necessary permissions.
					</p>
				)}

				<div className="mt-3">
					<Button
						onPress={() => router.push("/")}
						variant="light"
						radius="full"
						className="w-full"
					>
						Return to Home
					</Button>
				</div>
			</div>
		</div>
	);
};

export default RedirectShortUrl;
