import React from "react";

type Props = {
	title: string;
	description: string;
};

const BannerContent: React.FC<Props> = ({ title, description }) => {
	return (
		<>
			<div className="flex w-full justify-between items-center">
				<div className="flex flex-col gap-4">
					<h1 className="text-6xl font-PlayFairDisplay font-medium whitespace-pre-line leading-snug">
						{title}
					</h1>
				</div>
			</div>
			<p className="mt-10">{description}</p>
		</>
	);
};

export default BannerContent;
