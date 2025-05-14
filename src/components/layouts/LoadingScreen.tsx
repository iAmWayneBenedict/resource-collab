"use client";

import Link from "next/link";
import React from "react";
import { favicon } from "../../../public/assets";
import { Spinner } from "@heroui/react";

const LoadingScreen = () => {
	return (
		<div className="flex h-screen w-screen items-center justify-center">
			<div className="flex flex-col items-center">
				<Link href="/" className="flex items-center gap-2">
					<img src={favicon.src} className="aspect-auto w-12" />
					<span className="flex font-PlayFairDisplay text-2xl font-black uppercase">
						Coollabs
					</span>
				</Link>
				<Spinner className="mt-7" />
			</div>
		</div>
	);
};

export default LoadingScreen;
