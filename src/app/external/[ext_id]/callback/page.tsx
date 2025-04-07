"use client";

import { Image, Spacer } from "@heroui/react";
import { bgGradient4 } from "../../../../../public/assets/img";

const Page = () => {
	return (
		<div className="relative flex min-h-screen w-screen items-center justify-center p-4">
			<div className="w-full max-w-md">
				<div className="flex flex-col justify-center gap-4">
					<div className="h-[4rem] w-full overflow-hidden rounded-[10px]">
						<Image
							className="h-full w-full object-cover"
							src={bgGradient4.src}
							alt="resource gradient"
						/>
					</div>
					<h1 className="mt-6 text-center text-3xl font-semibold">
						You have successfully logged in.
					</h1>
				</div>

				<Spacer y={4} className="mb-12" />

				<p className="text-center text-sm text-gray-600">
					You can close this window.
				</p>
			</div>
		</div>
	);
};

export default Page;
