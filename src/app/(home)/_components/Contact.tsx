import CustomInput from "@/components/custom/CustomInput";
import React, { useCallback } from "react";
import { Playfair_Display } from "next/font/google";
import { cn } from "@/lib/utils";
import contactGradient from "../../../../public/assets/img/contact-gradient.png";
import Image from "next/image";
import CustomTextArea from "@/components/custom/CustomTextArea";
import { useForm, Controller, SubmitHandler, FieldErrors } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import ControlledInput from "@/components/custom/ControlledInput";
import ControlledTextArea from "@/components/custom/ControlledTextArea";

// Contact form schema
// Define the schema for contact form
export const FormSchema = z.object({
	name: z.string().min(1, { message: "Name is required" }),
	email: z.string().email().includes("@").min(5).max(255),
	link: z
		.string()
		.url()
		.min(5, {
			message: "Link is required",
		})
		.max(255, { message: "Link is too long" }),
	message: z.string().min(1, { message: "Message is required" }),
});

type TFormValues = z.infer<typeof FormSchema>;

const formFields = [
	{ name: "name", type: "text" },
	{ name: "email", type: "email" },
	{ name: "link", type: "url" },
];

const Contact = () => {
	const form = useForm<TFormValues>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			name: "",
			email: "",
			link: "",
			message: "",
		},
	});
	const {
		register,
		handleSubmit,
		formState: { errors },
		control,
	} = form;
	const handleUrlInput = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
		const url = event.target.value;
	}, []);

	const onSubmit: SubmitHandler<TFormValues> = (data) => console.log(data);
	return (
		<div
			className="flex flex-col w-full mt-56 lg:flex-row"
			style={{
				gap: "clamp(3rem, 10vw, 10rem)",
			}}
		>
			<div className="flex flex-col flex-1 gap-10">
				<div>
					<h1
						className={cn(
							"font-PlayFairDisplay font-medium",
							"~text-4xl/6xl whitespace-pre-wrap flex flex-col gap-3"
						)}
					>
						<span>Want to add?</span>
						<span>Send us a message</span>
					</h1>
					<p className="mt-10 mb-5">
						Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
						tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
						quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
						consequat.
					</p>
				</div>
				<div className="w-full h-auto overflow-hidden rounded-[20px]">
					<Image
						className="object-cover w-full h-full"
						src={contactGradient}
						alt="contact gradient"
					/>
				</div>
			</div>
			<div className="flex-1 mt-7">
				<Form {...form}>
					<form onSubmit={handleSubmit(onSubmit)}>
						<div className="flex flex-col gap-3">
							{formFields.map(({ name, type }) => {
								return (
									<ControlledInput
										key={name}
										name={name}
										type={type}
										label={name[0].toUpperCase() + name.slice(1)}
										control={control}
										error={errors[name as keyof TFormValues]}
									/>
								);
							})}

							<ControlledTextArea
								size="lg"
								name={"message"}
								label={"Message"}
								control={control}
								error={errors["message"]}
							/>
						</div>
						<div className="w-full mt-10">
							<button
								type="submit"
								title="Submit"
								className="w-full py-3 text-lg text-white rounded-full bg-violet"
							>
								Message
							</button>
						</div>
					</form>
				</Form>
			</div>
		</div>
	);
};

export default Contact;
