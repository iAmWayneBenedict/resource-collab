"use client";

import { Fragment, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import contactGradient from "../../../../public/assets/img/contact-gradient.png";
import Image from "next/image";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import ControlledInput from "@/components/custom/ControlledInput";
import ControlledTextArea from "@/components/custom/ControlledTextArea";
import { useWebScraperQuery } from "@/lib/queries/scraper";
import { useDebounce } from "@/hooks";
import { SiteCard } from "@/components/layouts/cards/SiteCard";

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

type TScrapedData = {
	title: string;
	description: string;
	image: string;
	link: string;
};

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
		handleSubmit,
		watch,
		formState: { errors },
		control,
	} = form;

	const [scrapedData, setScrapedData] = useState<TScrapedData | null>(null);

	// debounce link
	const watchedLink = watch("link");
	const hasLink = watchedLink.length > 0;
	const link = hasLink
		? watchedLink.startsWith("https")
			? watchedLink
			: `https://${watchedLink}`
		: "";

	const debouncedLink = useDebounce(link, 250); // 250ms delay every change of link

	const webScraperResponse = useWebScraperQuery({ data: debouncedLink });

	// store the scraped data in state to make the data more readable
	useEffect(() => {
		if (webScraperResponse.isSuccess) {
			const data = webScraperResponse.data.data;
			console.log(data);
			setScrapedData({
				title: data.title || data.site_name,
				description: data.description,
				image: data.image.includes("http")
					? data.image
					: data.url + data.image,
				link: data.url,
			});
		} else {
			setScrapedData(null);
		}
	}, [
		webScraperResponse.data?.data,
		webScraperResponse.isSuccess,
		webScraperResponse.isError,
	]);

	const onSubmit: SubmitHandler<TFormValues> = (data) => console.log(data);
	return (
		<div
			className="mt-56 flex w-full flex-col lg:flex-row"
			style={{
				gap: "clamp(3rem, 10vw, 10rem)",
			}}
		>
			<div className="flex flex-1 flex-col gap-10">
				<div>
					<h1
						className={cn(
							"font-PlayFairDisplay font-medium",
							"flex flex-col gap-3 whitespace-pre-wrap ~text-4xl/6xl",
						)}
					>
						<span>Want to add?</span>
						<span>Send us a message</span>
					</h1>
					<p className="mb-5 mt-10">
						Lorem ipsum dolor sit amet, consectetur adipiscing elit,
						sed do eiusmod tempor incididunt ut labore et dolore
						magna aliqua. Ut enim ad minim veniam, quis nostrud
						exercitation ullamco laboris nisi ut aliquip ex ea
						commodo consequat.
					</p>
				</div>
				<div className="h-auto w-full overflow-hidden rounded-[20px]">
					<Image
						className="h-full w-full object-cover"
						src={contactGradient}
						alt="contact gradient"
					/>
				</div>
			</div>
			<div className="mt-7 flex-1">
				<Form {...form}>
					<form onSubmit={handleSubmit(onSubmit)}>
						<div className="flex flex-col gap-3">
							{formFields.map(({ name, type }) => {
								return (
									<Fragment key={name}>
										{/*
											show scraped link if name is link
										*/}

										{name === "link" && scrapedData && (
											<SiteCard
												img={scrapedData.image}
												title={scrapedData.title}
												description={
													scrapedData.description
												}
												link={scrapedData.link}
											/>
										)}
										<ControlledInput
											name={name}
											type={type}
											label={
												name[0].toUpperCase() +
												name.slice(1)
											}
											control={control}
											error={
												errors[
													name as keyof TFormValues
												]
											}
										/>
									</Fragment>
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
						<div className="mt-10 w-full">
							<button
								type="submit"
								title="Submit"
								className="w-full rounded-full bg-violet py-5 text-lg text-white"
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
