"use client";

import {
	InputOTP,
	InputOTPGroup,
	InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@heroui/react";
import Link from "next/link";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { bindReactHookFormError } from "@/lib/utils";
import { authClient } from "@/config/auth";

const formSchema = z.object({
	code: z.string().length(6, { message: "Invalid OTP" }),
	email: z.string().email().optional(),
});

type TVerifyEmailForm = z.infer<typeof formSchema>;

const FormFields = ({ email }: { email: string | undefined }) => {
	const [isLoadingVerify, setIsLoadingVerify] = useState(false);
	const [isLoadingNewOTP, setIsLoadingNewOTP] = useState(false);
	const form = useForm<TVerifyEmailForm>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			code: "",
		},
	});
	const { watch, setError } = form;

	const resendOTPVerification = async () => {
		setIsLoadingNewOTP(true);
		const { data, error } = await authClient.emailOtp.sendVerificationOtp({
			email: email as string,
			type: "email-verification", // or "email-verification", "forget-password"
		});
		setIsLoadingNewOTP(false);
	};
	const onSubmit: SubmitHandler<TVerifyEmailForm> = async (
		data: TVerifyEmailForm,
	) => {
		data.email = email;
		setIsLoadingVerify(true);
		const verificationResponse = await authClient.emailOtp.verifyEmail({
			email: email as string,
			otp: data.code,
		});

		setIsLoadingVerify(false);
		if (verificationResponse.error) {
			if (verificationResponse.error.code === "INVALID_OTP")
				bindReactHookFormError(
					{ data: { path: ["code"] }, message: "Invalid OTP" },
					setError,
				);
			if (verificationResponse.error.code === "OTP_EXPIRED")
				bindReactHookFormError(
					{
						data: { path: ["code"] },
						message:
							"Expired OTP. Please click the resend OTP below.",
					},
					setError,
				);
			return;
		}

		toast.success("Successfully verified account!");

		setTimeout(() => {
			location.href = "/dashboard/resources";
		}, 2000);
	};
	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)}>
				<FormField
					control={form.control}
					name="code"
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<div className="flex justify-center space-y-5">
									<InputOTP maxLength={6} {...field}>
										<InputOTPGroup>
											{[0, 1, 2, 3, 4, 5].map((index) => (
												<React.Fragment key={index}>
													<InputOTPSlot
														className="h-12 w-12 rounded-xl text-base md:h-14 md:w-14 md:text-lg"
														index={index}
													/>
												</React.Fragment>
											))}
										</InputOTPGroup>
									</InputOTP>
								</div>
							</FormControl>
							<FormMessage className="text-center" />
						</FormItem>
					)}
				/>

				<div className="mt-10 flex w-full flex-col items-center justify-center">
					<Button
						isDisabled={
							watch("code").length !== 6 || isLoadingNewOTP
						}
						isLoading={isLoadingVerify}
						type="submit"
						className="w-full rounded-full bg-violet py-7 text-white hover:bg-violet-foreground"
					>
						Verify
					</Button>
					<Button
						onPress={resendOTPVerification}
						isDisabled={isLoadingVerify}
						isLoading={isLoadingNewOTP}
						variant="light"
						type="button"
						className="mb-5 mt-5 h-fit w-fit rounded-none border-b border-green-500 p-0 text-muted-foreground transition-colors hover:bg-transparent hover:text-black data-[hover=true]:bg-transparent dark:hover:text-white"
					>
						Resend OTP
					</Button>
					<div>
						<center className="mt-4">
							Already have an account?{" "}
							<Link href="/auth/login" className="text-green-500">
								Login
							</Link>
						</center>
					</div>
				</div>
			</form>
		</Form>
	);
};

export default FormFields;
