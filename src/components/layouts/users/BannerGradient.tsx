"use client";

import React, { useState } from "react";
import Image from "next/image";
import backGroundGradient from "../../../../public/assets/img/gradient-bg-4.png";
import { cn } from "@/lib/utils";

type Props = {
	classNames?: string;
};

const BannerGradient: React.FC<Props> = ({ classNames = "w-full h-[15rem]" }) => {
	return (
		<div className={cn(classNames, "rounded-xl overflow-hidden relative")}>
			<div className="absolute w-full h-full bg-custom-overlay"></div>
			<Image
				src={backGroundGradient}
				className={cn("h-full w-full object-cover object-center")}
				priority
				alt={""}
			/>
		</div>
	);
};

export default BannerGradient;
