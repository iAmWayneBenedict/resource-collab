import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";
import sampleLogo from "../../../../public/assets/img/Group 50.png";

const Card = () => {
	return (
		<div className={cn("bg-white dark:bg-black rounded-[20px] p-8")}>
			<div>
				<div className={cn("w-full flex justify-between items-start")}>
					<Badge className={cn("px-5 py-2 bg-black dark:bg-white")}>Typography</Badge>
					<div className={cn("w-[10rem] h-[8rem]")}>
						<Image
							src={sampleLogo}
							className={cn("w-full h-full object-contain object-center")}
							alt={""}
						/>
					</div>
				</div>
				<div className="flex flex-col gap-2">
					<h2 className={cn("text-3xl font-semibold")}>
						Deliver effective <span className="text-green-500">typography</span>
					</h2>
					<p>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
						tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
						quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
						consequat.{" "}
					</p>
				</div>
			</div>
		</div>
	);
};

export default Card;
