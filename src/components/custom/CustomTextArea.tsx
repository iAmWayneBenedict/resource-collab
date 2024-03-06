import React, { useEffect, useRef, useState, forwardRef } from "react";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { TValidFormNames, TextAreaType } from "@/types/FormTypes";
import { FieldError, UseFormRegisterReturn } from "react-hook-form";

const sizeEnum = z.enum(["sm", "md", "lg", "default"]);

type Props = {
	label: string;
	name: TValidFormNames;
	children?: React.ReactNode;
	size: z.infer<typeof sizeEnum>;
	register: UseFormRegisterReturn<string>;
	error: FieldError | undefined;
} & TextAreaType;

// tailwindcss sizes
const sizes = {
	sm: 12,
	md: 36,
	lg: 48,

	default: 0,
};

// for raw pixel sizes based on tailwindcss sizes
const rawSizes = {
	sm: 48,
	md: 144,
	lg: 192,

	default: 0,
};
const CustomTextArea: React.FC<Props> = ({
	label,
	name,
	children,
	size = "default",
	error,
	register,
	...props
}) => {
	const [value, setValue] = useState<string>("");
	const labelRef = useRef<HTMLLabelElement>(null);

	const handleLabel = (event: FocusEvent) => {
		const textArea = document.querySelector(`#${name}`) as HTMLTextAreaElement;
		labelRef.current!.classList.add("active");
		if (event.type === "focusout" && textArea.value === "")
			labelRef.current!.classList.remove("active");
	};

	const handleChange = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
		const textArea = document.querySelector(`#${name}`) as HTMLTextAreaElement;
		const self = event.target as HTMLTextAreaElement;
		self.style.height = "0px";
		let scrollHeight = textArea.scrollHeight;
		self.style.height = scrollHeight + "px";
	};

	useEffect(() => {
		const textArea = document.querySelector(`#${name}`) as HTMLTextAreaElement;
		if (textArea) {
			textArea.addEventListener("focus", handleLabel);
			textArea.addEventListener("focusout", handleLabel);
		}
	}, []);

	return (
		<div className="flex relative w-full">
			<label
				ref={labelRef}
				className="input-label absolute w-full left-0 text-black dark:text-white text-xl cursor-[text] transition-all duration-300 ease"
				htmlFor={name}
			>
				{label}
			</label>
			<div className="flex relative w-full overflow-hidden">
				<textarea
					style={{
						minHeight: `${rawSizes[size]}px`,
					}}
					className={cn(
						`mt-10 pb-3 text-2xl lg:text-3xl 2xl:text-4xl font-light h-0 resize-none overflow-hidden bg-transparent border-b-[1px] w-full border-b-gray-500 border-opacity-50 focus:outline-none active:outline-none outline-none`
					)}
					id={name}
					onKeyUp={(event: React.KeyboardEvent<HTMLTextAreaElement>) =>
						handleChange(event)
					}
					{...register}
					{...props}
				>
					{children}
				</textarea>
				<span className="absolute bottom-0 bg-black dark:bg-white h-[1px] w-full  transition-all duration-300 ease-out"></span>
			</div>
			{error && (
				<p className="absolute text-red-500 text-xs md:text-sm -bottom-[1.3rem] right-0">
					{error.message}
				</p>
			)}
		</div>
	);
};

CustomTextArea.displayName = "CustomTextArea";

export default CustomTextArea;
