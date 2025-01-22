"use client";

import Image from "next/image";
import bannerGradient from "../../../../../public/assets/img/gradient-bg-4.png";
import { redirect, useSearchParams } from "next/navigation";
import BackToHome from "./BackToHome";
import FormFields from "./FormFields";

const VerificationLayout = () => {
	const searchParams = useSearchParams();
	const email = searchParams.get("email");
	if (!email) redirect("/auth/login");
	return (
		<div className="relative h-screen w-screen flex justify-center items-center">
			{/* back to homepage */}

			<BackToHome />

			{/* main */}
			<div className="w-full max-w-[30rem] p-5 rounded-2xl">
				<div className="flex justify-center flex-col gap-4">
					<div className="w-full h-[4rem] overflow-hidden rounded-[10px]">
						<Image
							className="object-cover w-full h-full"
							src={bannerGradient}
							alt="contact gradient"
						/>
					</div>
					<h1 className="text-center mt-6 text-4xl font-semibold font-PlayFairDisplay">
						OTP Verification
					</h1>
					<div className="flex justify-center flex-col my-4">
						<p className="text-center m-0 text-muted-foreground">
							Please enter the verification code
						</p>
						<p className="text-center m-0 text-muted-foreground">
							sent to{" "}
							<span className="border-b border-green-500 text-primary font-medium">
								{email}
							</span>
						</p>
					</div>
				</div>
				<FormFields email={email} />
			</div>
		</div>
	);
};

export default VerificationLayout;
