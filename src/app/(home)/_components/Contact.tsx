import CustomInput from "@/components/custom/CustomInput";
import React, { useCallback } from "react";
import { Playfair_Display } from "next/font/google";
import { cn, urlValidator } from "@/lib/utils";
import contactGradient from "../../../../public/assets/img/contact-gradient.png";
import Image from "next/image";
import CustomTextArea from "@/components/custom/CustomTextArea";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

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

const Contact = () => {
	const {
		register,
		formState: { errors },
		handleSubmit,
	} = useForm<TFormValues>({
		resolver: zodResolver(FormSchema),
	});
	const handleUrlInput = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
		const url = event.target.value;
		const validatedUrl = urlValidator(url);
	}, []);

	const onSubmit: SubmitHandler<TFormValues> = (data) => console.log(data);
	return (
		<div
			className="flex mt-56"
			style={{
				gap: "clamp(3rem, 10vw, 10rem)",
			}}
		>
			<div className="flex-1 flex flex-col gap-10">
				<div>
					<h1
						className={cn(
							"font-PlayFairDisplay font-medium",
							"text-6xl whitespace-pre-wrap flex flex-col gap-3"
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
						className="w-full h-full object-cover"
						src={contactGradient}
						alt="contact gradient"
					/>
				</div>
			</div>
			<div className="flex-1 mt-7">
				<form onSubmit={handleSubmit(onSubmit)}>
					<div className="flex flex-col gap-3">
						<CustomInput
							name="name"
							type="text"
							label="Name"
							register={register("name")}
							error={errors.name}
						/>
						<CustomInput
							name="email"
							type="email"
							label="Email"
							register={register("email")}
							error={errors.email}
						/>
						<CustomInput
							name="link"
							type="text"
							label="Link"
							register={register("link")}
							error={errors.link}
						/>
						<CustomTextArea
							name="message"
							label="Message"
							size="md"
							register={register("message")}
							error={errors.message}
						/>
					</div>
					<div className="mt-10 w-full">
						<button
							type="submit"
							title="Submit"
							className="bg-violet text-white w-full py-3 rounded-full text-lg"
						>
							Message
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default Contact;
