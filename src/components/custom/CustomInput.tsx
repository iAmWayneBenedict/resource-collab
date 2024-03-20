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
		<div className="flex relative flex-col w-full">
			<FormLabel
				ref={labelRef}
				className="input-label absolute w-full left-0 text-xl cursor-[text] transition-all duration-300 ease"
				htmlFor={name}
			>
				{label}
			</FormLabel>
			<div className="flex relative flex-col w-full overflow-hidden">
				<Input
					className={cn(
						"mt-10 pb-3 px-0 rounded-none text-2xl lg:text-3xl 2xl:text-4xl font-light bg-transparent border-x-0 border-t-0 ring-0 border-b-[1px] border-opacity-50 w-full focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none active:outline-none outline-none",
						error ? "border-b-red-500" : "border-b-gray-500"
					)}
					id={name}
					type={type}
					{...register}
					{...props}
				/>
				<span
					className={cn(
						"absolute bottom-0 h-[1px] w-full  transition-all duration-300 ease-out",
						error ? "bg-red-500" : "bg-black dark:bg-white"
					)}
				></span>
			</div>
			{error && (
				<FormMessage className="absolute text-red-500 text-xs md:text-sm -bottom-[1.3rem] right-0">
					{error.message}
				</FormMessage>
			)}
		</div>
	);
};

export default CustomInput;
