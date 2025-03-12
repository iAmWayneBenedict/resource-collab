/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState, forwardRef } from "react";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { FieldError, UseFormRegisterReturn } from "react-hook-form";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { FormMessage } from "../ui/form";

const sizeEnum = z.enum(["sm", "md", "lg", "default"]);

type Props = {
	label: string;
	name: string;
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

/**
 * CustomTextArea is a component that renders a text area with custom sizes and additional properties.
 *
 *
 * @param {string} label - The label text for the text area.
 * @param {string} name - The name attribute for the text area.
 * @param {React.ReactNode} [children] - The children nodes to be rendered inside the text area.
 * @param {("sm" | "md" | "lg" | "default")} size - The size of the text area, defined by the sizeEnum.
 * @param {UseFormRegisterReturn<string>} register - The register function from react-hook-form.
 * @param {FieldError | undefined} error - The error object for the text area, if any.
 * @param {TextAreaType} ...otherProps - Additional props specific to the text area.
 * @returns {React.ReactElement} The rendered text area component.
 */
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
		const textArea = document.querySelector(
			`#${name}`,
		) as HTMLTextAreaElement;
		labelRef.current!.classList.add("active");
		if (event.type === "focusout" && textArea.value === "")
			labelRef.current!.classList.remove("active");
	};

	const handleChange = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
		const textArea = document.querySelector(
			`#${name}`,
		) as HTMLTextAreaElement;
		const self = event.target as HTMLTextAreaElement;
		self.style.height = "0px";
		let scrollHeight = textArea.scrollHeight;
		self.style.height = scrollHeight + "px";
	};

	useEffect(() => {
		const textArea = document.querySelector(
			`#${name}`,
		) as HTMLTextAreaElement;
		if (textArea) {
			textArea.addEventListener("focus", handleLabel);
			textArea.addEventListener("focusout", handleLabel);
		}
	}, []);

	return (
		<div className="relative flex w-full">
			<Label
				ref={labelRef}
				className="input-label ease absolute left-0 w-full cursor-[text] text-xl text-black transition-all duration-300 dark:text-white"
				htmlFor={name}
			>
				{label}
			</Label>
			<div className="relative flex w-full overflow-hidden">
				<Textarea
					style={{
						minHeight: `${rawSizes[size]}px`,
					}}
					className={cn(
						`mt-10 h-0 w-full resize-none overflow-hidden border-x-0 border-b-[1px] border-t-0 border-b-zinc-500 border-opacity-50 bg-transparent px-0 pb-3 text-2xl font-light outline-none focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 active:outline-none lg:text-3xl 2xl:text-4xl`,
					)}
					id={name}
					onKeyUp={(
						event: React.KeyboardEvent<HTMLTextAreaElement>,
					) => handleChange(event)}
					{...register}
					{...props}
				>
					{children}
				</Textarea>
				<span className="absolute bottom-0 h-[1px] w-full bg-black transition-all duration-300 ease-out dark:bg-white"></span>
			</div>
			{error && (
				<FormMessage className="absolute -bottom-[1.3rem] right-0 text-xs text-red-500 md:text-sm">
					{error.message}
				</FormMessage>
			)}
		</div>
	);
};

CustomTextArea.displayName = "CustomTextArea";

export default CustomTextArea;
