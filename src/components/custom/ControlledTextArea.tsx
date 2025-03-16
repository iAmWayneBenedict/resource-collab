"use client";

import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { FieldError } from "react-hook-form";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { FormMessage, FormField } from "../ui/form";

const sizeEnum = z.enum(["sm", "md", "lg", "default"]);

type Props = {
	label: string;
	name: string;
	children?: React.ReactNode;
	size: z.infer<typeof sizeEnum>;
	control: any;
	error: FieldError | undefined;
} & TextAreaType;

const rawSizes = {
	sm: 48,
	md: 144,
	lg: 192,

	default: 0,
};

/**
 * A controlled textarea component for handling form fields.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {string} props.label - The label for the textarea field.
 * @param {string} props.name - The name attribute for the textarea field.
 * @param {React.ReactNode} [props.children] - Optional children to render within the textarea.
 * @param {('sm' | 'md' | 'lg' | 'default')} props.size - The size of the textarea ('sm', 'md', 'lg', or 'default').
 * @param {any} props.control - The control object from React Hook Form.
 * @param {FieldError | undefined} props.error - An optional error object from form validation.
 * @param {...any} props - Additional props to pass to the textarea element.
 * @returns {React.ReactElement} - The controlled textarea component.
 */
const ControlledTextArea: React.FC<Props> = ({
	label,
	name,
	children,
	size = "default",
	error,
	control,
	...props
}) => {
	const labelRef = useRef<HTMLLabelElement>(null);

	const handleLabel = (event: React.FocusEvent<HTMLTextAreaElement>) => {
		const { currentTarget: textArea, type } = event;
		labelTransform(type, textArea);
	};
	const labelTransform = (type: string, textArea: HTMLTextAreaElement) => {
		labelRef.current!.classList.toggle(
			"active",
			type === "focus" || textArea.value !== "",
		);
	};
	const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
		const { currentTarget: textArea } = event;
		textArea.style.height = "0px";
		textArea.style.height = textArea.scrollHeight + "px";
		labelRef.current!.classList.toggle("active", true);
	};

	useEffect(() => {
		const textArea = document.getElementById(name) as HTMLTextAreaElement;
		if (textArea) {
			labelTransform("", textArea);
		}
	});

	return (
		<FormField
			name={name}
			control={control}
			render={({
				field: {
					onBlur: onBlurReactHookForm,
					onChange: onChangeReactHookForm,
					...field
				},
			}) => (
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
								error
									? "border-b-red-500"
									: "border-b-zinc-500",
							)}
							id={name}
							onChange={(
								e: React.ChangeEvent<HTMLTextAreaElement>,
							) => {
								onChangeReactHookForm(e);
								handleChange(e);
							}}
							onBlur={(
								e: React.FocusEvent<HTMLTextAreaElement>,
							) => {
								onBlurReactHookForm();
								handleLabel(e);
							}}
							onFocus={(
								e: React.FocusEvent<HTMLTextAreaElement>,
							) => {
								handleLabel(e);
							}}
							suppressHydrationWarning // This is a workaround for a bug in Next.js where additional attributes are being added to the input element and causing a hydration mismatch due to the browser extensions
							{...field}
							{...props}
						>
							{children}
						</Textarea>
						<span
							className={cn(
								"absolute bottom-0 h-[1px] w-full bg-black transition-all duration-300 ease-out dark:bg-white",
								error ? "bg-red-500" : "bg-black dark:bg-white",
							)}
						></span>
					</div>
					{error && (
						<FormMessage className="absolute -bottom-[1.3rem] right-0 text-xs text-red-500 md:text-sm">
							{error.message}
						</FormMessage>
					)}
				</div>
			)}
		/>
	);
};
export default ControlledTextArea;
