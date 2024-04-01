import { cn } from "@/lib/utils";
import React from "react";

type Props = {
	title: string;
	description: string;
	descriptionClasses?: string;
};

const BannerContent: React.FC<Props> = ({ title, description, descriptionClasses = "" }) => {
	return (
		<>
			<div className="flex items-center justify-between w-full">
				<div className="flex flex-col gap-4">
					<h1 className="text-5xl font-medium leading-snug whitespace-pre-line xl:text-6xl font-PlayFairDisplay">
						{title}
					</h1>
				</div>
			</div>
			<p className={cn("mt-10 whitespace-pre-line", descriptionClasses)}>{description}</p>
		</>
	);
};

export default BannerContent;
