import { cn } from "@/lib/utils";
import React from "react";

type Props = {
	title: string;
	description: string;
	descriptionClasses?: string;
	classNames?: {
		title?: string;
		description?: string;
	};
};

const BannerContent: React.FC<Props> = ({
	title,
	description,
	descriptionClasses = "",
	classNames = {
		title: "",
		description: "",
	},
}) => {
	return (
		<>
			<div className="flex w-full items-center justify-between">
				<div className="flex w-full flex-col gap-4">
					<h1
						className={cn(
							"whitespace-pre-line font-PlayFairDisplay text-5xl font-medium leading-snug xl:text-6xl",
							classNames?.title,
						)}
					>
						{title}
					</h1>
				</div>
			</div>
			<p
				className={cn(
					"mt-10 whitespace-pre-line",
					descriptionClasses,
					classNames?.description,
				)}
			>
				{description}
			</p>
		</>
	);
};

export default BannerContent;
