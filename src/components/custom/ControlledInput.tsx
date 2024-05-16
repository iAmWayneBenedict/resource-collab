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
			| React.SyntheticEvent<HTMLInputElement, Event>
	) => {
		const { currentTarget: inputRef, type } = event;
		labelTransform(type, inputRef);
	};
	const labelTransform = (type: string, inputRef: HTMLInputElement) => {
		labelRef.current!.classList.toggle("active", type === "focus" || inputRef.value !== "");
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
				field: { onBlur: onBlurReactHookForm, onChange: onChangeReactHookForm, ...field },
			}) => {
				return (
					<div className="flex relative flex-col w-full">
						<FormLabel
							ref={labelRef}
							className={cn(
								"input-label absolute w-full left-0 text-xl cursor-[text] transition-all duration-300 ease",
								error && "text-black"
							)}
							htmlFor={name}
						>
							{label}
						</FormLabel>
						<div className="flex relative flex-col w-full overflow-hidden">
							<FormControl>
								<Input
									className={cn(
										"mt-10 pb-3 px-0 rounded-none text-2xl lg:text-3xl 2xl:text-4xl font-light bg-transparent border-x-0 border-t-0 ring-0 border-b-[1px] border-opacity-50 w-full focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none active:outline-none outline-none",
										error ? "border-b-red-500" : "border-b-gray-500"
									)}
									id={name}
									type={type}
									onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
										onBlurReactHookForm();
										handleLabel(e);
									}}
									onFocus={(e: React.FocusEvent<HTMLInputElement>) => {
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
									"absolute bottom-0 h-[1px] w-full  transition-all duration-300 ease-out",
									error ? "bg-red-500" : "bg-black dark:bg-white"
								)}
							></span>
						</div>
						<FormMessage className="absolute text-red-500 text-xs md:text-sm -bottom-[1.3rem] right-0" />
					</div>
				);
			}}
		/>
	);
};

export default ControlledInput;
