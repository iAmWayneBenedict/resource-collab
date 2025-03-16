"use client";

import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { FieldError } from "react-hook-form";
import { FormControl, FormField, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";

type PropsSchema = {
	label: string;
	type: string;
	name: string;
	valueAsNumber?: boolean;
	control: any;
	error: FieldError | undefined;
};

// Infer the type from the schema
type Props = PropsSchema & InputType;

/**
 * A controlled input component for handling form fields.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {string} props.label - The label for the input field.
 * @param {string} props.type - The type of input (e.g., 'text', 'number', 'email').
 * @param {string} props.name - The name attribute for the input field.
 * @param {boolean} [props.valueAsNumber] - Indicates whether the value should be treated as a number.
 * @param {any} props.control - The control object from React Hook Form.
 * @param {FieldError | undefined} props.error - An optional error object from form validation.
 * @param {...any} ...props - Additional props to pass to the input element.
 * @returns {React.ReactElement} - The controlled input component.
 */
const ControlledInput: React.FC<Props> = ({
	label,
	type,
	name,
	control,
	valueAsNumber,
	error,
	...props
}) => {
	const labelRef = useRef<HTMLLabelElement>(null);
	const handleLabel = (
		event:
			| React.FocusEvent<HTMLInputElement>
			| React.ChangeEvent<HTMLInputElement>
			| React.SyntheticEvent<HTMLInputElement, Event>,
	) => {
		const { currentTarget: inputRef, type } = event;
		labelTransform(type, inputRef);
	};
	const labelTransform = (type: string, inputRef: HTMLInputElement) => {
		labelRef.current!.classList.toggle(
			"active",
			type === "focus" || inputRef.value !== "",
		);
	};
	useEffect(() => {
		const inputRef = document.getElementById(name) as HTMLInputElement;
		if (inputRef) {
			labelTransform("", inputRef);
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
			}) => {
				return (
					<div className="relative flex w-full flex-col">
						<FormLabel
							ref={labelRef}
							className={cn(
								"input-label ease absolute left-0 w-full cursor-[text] text-xl transition-all duration-300",
								error && "text-black",
							)}
							htmlFor={name}
						>
							{label}
						</FormLabel>
						<div className="relative flex w-full flex-col overflow-hidden">
							<FormControl>
								<Input
									className={cn(
										"mt-10 w-full rounded-none border-x-0 border-b-[1px] border-t-0 border-opacity-50 bg-transparent px-0 pb-3 text-2xl font-light outline-none ring-0 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 active:outline-none lg:text-3xl 2xl:text-4xl",
										error
											? "border-b-red-500"
											: "border-b-zinc-500",
									)}
									id={name}
									type={type}
									onBlur={(
										e: React.FocusEvent<HTMLInputElement>,
									) => {
										onBlurReactHookForm();
										handleLabel(e);
									}}
									onFocus={(
										e: React.FocusEvent<HTMLInputElement>,
									) => {
										handleLabel(e);
									}}
									onChange={(e) => {
										handleLabel(e);
										onChangeReactHookForm(e);
									}}
									suppressHydrationWarning // This is a workaround for a bug in Next.js where additional attributes are being added to the input element and causing a hydration mismatch due to the browser extensions
									{...field}
									{...props}
								/>
							</FormControl>
							<span
								className={cn(
									"absolute bottom-0 h-[1px] w-full transition-all duration-300 ease-out",
									error
										? "bg-red-500"
										: "bg-black dark:bg-white",
								)}
							></span>
						</div>
						<FormMessage className="absolute -bottom-[1.3rem] right-0 text-xs text-red-500 md:text-sm" />
					</div>
				);
			}}
		/>
	);
};

export default ControlledInput;
