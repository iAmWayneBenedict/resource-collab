"use client";

import React from "react";
import { Button } from "@heroui/react";
import { MoveLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const BackToHome = () => {
	const router = useRouter();
	return (
		<div className="absolute top-[5%] left-0 sm:top-[10%] sm:left-[10%]">
			<Button
				onClick={() => router.push("/")}
				variant="light"
				className="flex gap-3 data-[hover=true]:bg-transparent hover:opacity-60"
			>
				<MoveLeft /> Return to Homepage
			</Button>
		</div>
	);
};

export default BackToHome;
