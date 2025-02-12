"use client";

import React, { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { bgGradient4 } from "../../../../public/assets/img";

type Props = {
	classNames?: string;
};

const BannerGradient: React.FC<Props> = ({
	classNames = "w-full h-[15rem]",
}) => {
	return (
		<div className={cn(classNames, "relative overflow-hidden rounded-xl")}>
			<div className="bg-custom-overlay absolute h-full w-full"></div>
			<Image
				src={bgGradient4}
				className={cn("h-full w-full object-cover object-center")}
				priority
				alt={""}
			/>
		</div>
	);
};

export default BannerGradient;
