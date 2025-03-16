/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { FieldError, UseFormRegisterReturn } from "react-hook-form";
import { FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";

type PropsSchema = {
	label: string;
	type: string;
	name: string;
	register: UseFormRegisterReturn<string>;
	error: FieldError | undefined;
	valueAsNumber?: boolean;
};

// Infer the type from the schema
type Props = PropsSchema & InputType;

/**
 * Custom input component that utilizes form registration and error handling.
 * @date 3/7/2024 - 10:09:57 AM
 *
 * @param {Props} props - The props for the CustomInput component.
 * @param {string} props.label - The label text for the input.
 * @param {string} props.type - The type of the input.
 * @param {string} props.name - The name attribute for the input.
 * @param {UseFormRegisterReturn<string>} props.register - The register function from react-hook-form.
 * @param {FieldError | undefined} props.error - The error object for the input, if any.
 * @param {boolean} [props.valueAsNumber] - Whether the input value should be treated as a number.
 * @param {Object<string, any>} [props...otherProps] - Additional props passed to the input component.
 * @returns {React.ReactElement} The rendered input component.
 */

const CustomInput: React.FC<Props> = ({
	label,
	type,
	name,
	error,
	register,
	valueAsNumber,
	...props
}) => {
	const labelRef = useRef<HTMLLabelElement>(null);

	const handleLabel = (event: FocusEvent) => {
		const inputRef = document.querySelector(`#${name}`) as HTMLInputElement;
		labelRef.current!.classList.add("active");
		if (event.type === "focusout" && inputRef.value === "") {
			labelRef.current!.classList.remove("active");
		}
	};

	useEffect(() => {
		const inputRef = document.querySelector(`#${name}`) as HTMLInputElement;
		const currentInput = inputRef;
		if (!currentInput) return;

		currentInput.addEventListener("focus", handleLabel);
		currentInput.addEventListener("focusout", handleLabel);

		return () => {
			currentInput.removeEventListener("focus", handleLabel);
			currentInput.removeEventListener("focusout", handleLabel);
		};
	}, []);
	return (
		<div className="relative flex w-full flex-col">
			<FormLabel
				ref={labelRef}
				className="input-label ease absolute left-0 w-full cursor-[text] text-xl transition-all duration-300"
				htmlFor={name}
			>
				{label}
			</FormLabel>
			<div className="relative flex w-full flex-col overflow-hidden">
				<Input
					className={cn(
						"mt-10 w-full rounded-none border-x-0 border-b-[1px] border-t-0 border-opacity-50 bg-transparent px-0 pb-3 text-2xl font-light outline-none ring-0 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 active:outline-none lg:text-3xl 2xl:text-4xl",
						error ? "border-b-red-500" : "border-b-zinc-500",
					)}
					id={name}
					type={type}
					{...register}
					{...props}
				/>
				<span
					className={cn(
						"absolute bottom-0 h-[1px] w-full transition-all duration-300 ease-out",
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
	);
};

export default CustomInput;
