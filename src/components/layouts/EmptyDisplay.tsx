"use client";

import { Button } from "@heroui/react";
import React from "react";

type EmptyDisplayProps = {
	code: string;
	title: string;
	description: string;
	showButton: boolean;
	buttonText?: string;
	onPress?: () => void;
	children?: React.ReactNode;
};

const EmptyDisplay = ({
	code,
	title,
	description,
	showButton,
	buttonText,
	onPress,
	children,
}: EmptyDisplayProps) => {
	return (
		<div className="flex w-full flex-col items-center justify-center p-8 text-center">
			<div className="mb-2 text-[8rem] font-bold leading-none text-gray-200 opacity-60">
				{code}
			</div>
			<div>
				<h3 className="mb-2 text-xl font-semibold">{title}</h3>
				<p className="mb-4 text-gray-600">{description}</p>
				{showButton && (
					<Button
						radius="full"
						className="bg-violet text-white"
						onPress={onPress}
					>
						{buttonText}
					</Button>
				)}
				{children && children}
			</div>
		</div>
	);
};

export default EmptyDisplay;
