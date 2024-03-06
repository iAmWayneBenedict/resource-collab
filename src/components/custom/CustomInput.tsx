import React, { useEffect, useRef } from "react";
import { InputType, TValidFormNames } from "@/types/FormTypes";
import { cn } from "@/lib/utils";
import { FieldError, UseFormRegisterReturn } from "react-hook-form";

type PropsSchema = {
	label: string;
	type: string;
	name: TValidFormNames;
	register: UseFormRegisterReturn<string>;
	error: FieldError | undefined;
	valueAsNumber?: boolean;
};

// Infer the type from the schema
type Props = PropsSchema & InputType;

/**
 * Description Default Input Style Component
 * @date 3/6/2024 - 9:48:18 AM
 * @param {string} label - label for input
 * @param {string=} [error=''] - error message (optional)
 * @param {InputType} props - input props
 *
 * @returns {React.FC<Props>} - React Component
 * @type {*}
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
			<label
				ref={labelRef}
				className="input-label absolute w-full left-0 text-xl cursor-[text] transition-all duration-300 ease"
				htmlFor={name}
			>
				{label}
			</label>
			<div className="flex relative flex-col w-full overflow-hidden">
				<input
					className={cn(
						"mt-10 pb-3 text-2xl lg:text-3xl 2xl:text-4xl font-light bg-transparent border-b-[1px] border-opacity-50 w-full  focus:outline-none active:outline-none outline-none",
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
				<p className="absolute text-red-500 text-xs md:text-sm -bottom-[1.3rem] right-0">
					{error.message}
				</p>
			)}
		</div>
	);
};

export default CustomInput;
