import CustomInput from "@/components/custom/CustomInput";
import React, { useCallback } from "react";
import { Playfair_Display } from "next/font/google";
import { cn, urlValidator } from "@/lib/utils";
import contactGradient from "../../../../public/assets/img/contact-gradient.png";
import Image from "next/image";
import CustomTextArea from "@/components/custom/CustomTextArea";
const Contact = () => {
	const handleUrlInput = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
		const url = event.target.value;
		const validatedUrl = urlValidator(url);
		console.log(validatedUrl);
	}, []);

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
				<form action="">
					<div className="flex flex-col gap-3">
						<CustomInput placeholder="Name" name="name" type="text" />
						<CustomInput placeholder="Email" name="email" type="email" />
						<CustomInput
							onChangeCallback={handleUrlInput}
							placeholder="Link"
							name="link"
							type="text"
						/>
						<CustomTextArea size="md" placeholder="Message" name="message" />
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
