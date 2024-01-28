"use client";

import NavBar from "@/components/layouts/NavBar";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import backGroundGradient from "../../public/assets/img/gradient-bg-4.png";
import { cn } from "@/lib/utils";
import { Playfair_Display } from "next/font/google";
import { Badge } from "@/components/ui/badge";
import sampleLogo from "../../public/assets/img/Group 50.png";
import { Input } from "@/components/ui/input";
import CustomInput from "@/components/custom/CustomInput";

const playfair = Playfair_Display({
	subsets: ["latin"],
	weight: "500",
});
export default function Home() {
	return (
		<main className="relative h-[3000px]">
			<NavBar />

			<div className="mx-24 mt-36">
				<div className="w-full h-[15rem] rounded-xl overflow-hidden relative">
					<div className="absolute w-full h-full bg-overlay"></div>
					<Image
						src={backGroundGradient}
						className={cn("h-full w-full object-cover object-center")}
						alt={""}
					/>
				</div>
				{/* <div className="container-gradient">
					<div></div>
					<div></div>
					<div></div>
					<div></div>
				</div> */}
				<section className="mt-16 w-full">
					<div className="flex w-full justify-between items-center">
						<div className="flex flex-col gap-4">
							<h1 className={cn(playfair.className, "text-6xl")}>Collaborator: </h1>
							<h1 className={cn(playfair.className, "text-6xl")}>
								Simplifying Your Project.
							</h1>
						</div>
						<div>
							<Button
								className={cn(
									"bg-violet hover:bg-violet-foreground rounded-full text-white px-8 py-6"
								)}
							>
								Get Started
							</Button>
						</div>
					</div>
					<p className="mt-10">
						Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
						tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
						quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
						consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
						cillum dolore eu fugiat nulla pariatur.
					</p>
				</section>
				<div className="mt-16 grid gap-4 grid-cols-2 grid-rows-2">
					{[1, 2, 3, 4].map((el) => (
						<div key={el} className={cn("bg-white dark:bg-black rounded-[20px] p-8")}>
							<div>
								<div className={cn("w-full flex justify-between items-start")}>
									<Badge className={cn("px-5 py-2 bg-black dark:bg-white")}>
										Typography
									</Badge>
									<div className={cn("w-[10rem] h-[8rem]")}>
										<Image
											src={sampleLogo}
											className={cn(
												"w-full h-full object-contain object-center"
											)}
											alt={""}
										/>
									</div>
								</div>
								<div className="flex flex-col gap-2">
									<h2 className={cn("text-3xl font-semibold")}>
										Deliver effective{" "}
										<span className="text-green-500">typography</span>
									</h2>
									<p>
										Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
										do eiusmod tempor incididunt ut labore et dolore magna
										aliqua. Ut enim ad minim veniam, quis nostrud exercitation
										ullamco laboris nisi ut aliquip ex ea commodo consequat.{" "}
									</p>
								</div>
							</div>
						</div>
					))}
				</div>
				<div className="flex gap-7">
					<div>
						<h1>Want to add? Send us a message</h1>
					</div>
					<div>
						<form action="">
							<CustomInput placeholder="Email" name="email" type="text" />
						</form>
					</div>
				</div>
			</div>
		</main>
	);
}
