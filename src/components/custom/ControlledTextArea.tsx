import React, { useRef } from "react";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { TValidFormNames, TextAreaType } from "@/types/FormTypes";
import { FieldError } from "react-hook-form";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { FormMessage, FormField } from "../ui/form";

const sizeEnum = z.enum(["sm", "md", "lg", "default"]);

type Props = {
	label: string;
	name: TValidFormNames;
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
 * @param {TValidFormNames} props.name - The name attribute for the textarea field.
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
		console.log(type);
		labelRef.current!.classList.toggle("active", type === "focus" || textArea.value !== "");
	};

	const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
		const { currentTarget: textArea } = event;
		textArea.style.height = "0px";
		textArea.style.height = textArea.scrollHeight + "px";
		console.log(textArea.value);
		labelRef.current!.classList.toggle("active", true);
	};

	return (
		<FormField
			name={name}
			control={control}
			render={({
				field: { onBlur: onBlurReactHookForm, onChange: onChangeReactHookForm, ...field },
			}) => (
				<div className="flex relative w-full">
					<Label
						ref={labelRef}
						className="input-label absolute w-full left-0 text-black dark:text-white text-xl cursor-[text] transition-all duration-300 ease"
						htmlFor={name}
					>
						{label}
					</Label>
					<div className="flex relative w-full overflow-hidden">
						<Textarea
							style={{
								minHeight: `${rawSizes[size]}px`,
							}}
							className={cn(
								`mt-10 pb-3 px-0 text-2xl lg:text-3xl 2xl:text-4xl font-light h-0 resize-none overflow-hidden bg-transparent border-x-0 border-t-0 border-b-[1px] w-full border-b-gray-500 border-opacity-50 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 active:outline-none outline-none`,
								error ? "border-b-red-500" : "border-b-gray-500"
							)}
							id={name}
							onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
								onChangeReactHookForm(e);
								handleChange(e);
							}}
							onBlur={(e: React.FocusEvent<HTMLTextAreaElement>) => {
								onBlurReactHookForm();
								handleLabel(e);
							}}
							onFocus={(e: React.FocusEvent<HTMLTextAreaElement>) => {
								handleLabel(e);
							}}
							{...field}
							{...props}
						>
							{children}
						</Textarea>
						<span
							className={cn(
								"absolute bottom-0 bg-black dark:bg-white h-[1px] w-full  transition-all duration-300 ease-out",
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
			)}
		/>
	);
};
export default ControlledTextArea;
