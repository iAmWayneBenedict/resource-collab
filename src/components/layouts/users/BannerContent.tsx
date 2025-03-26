import { cn } from "@/lib/utils";
import React from "react";

type Props = {
	title: string;
	description: string;
	descriptionClasses?: string;
};

const BannerContent: React.FC<Props> = ({
	title,
	description,
	descriptionClasses = "",
}) => {
	return (
		<>
			<div className="flex w-full items-center justify-between">
				<div className="flex flex-col gap-4">
					<h1 className="whitespace-pre-line font-PlayFairDisplay text-5xl font-medium leading-snug xl:text-6xl">
						{title}
					</h1>
				</div>
			</div>
			<p className={cn("mt-10 whitespace-pre-line", descriptionClasses)}>
				{description}
			</p>
		</>
	);
};

export default BannerContent;
