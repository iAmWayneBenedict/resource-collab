"use client";

import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Button } from "@nextui-org/Button";
import Link from "next/link";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { bindReactHookFormError } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { usePostVerifyEmailMutation } from "@/services/api/mutations/users";

const formSchema = z.object({
	code: z.string().length(6, { message: "Invalid OTP" }),
	email: z.string().email().optional(),
});

type TVerifyEmailForm = z.infer<typeof formSchema>;

const FormFields = ({ email }: { email: string | undefined }) => {
	const router = useRouter();
	const form = useForm<TVerifyEmailForm>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			code: "",
		},
	});
	const { watch, setError } = form;

	const verifyEmailMutation = usePostVerifyEmailMutation({
		onSuccess: (res) => {
			toast.success(res.message);

			setTimeout(() => {
				router.push("/auth/login");
			}, 2000);
		},
		onError: (err) => {
			bindReactHookFormError(err, setError);
		},
	});
	const onSubmit: SubmitHandler<TVerifyEmailForm> = (data: TVerifyEmailForm) => {
		data.email = email;
		verifyEmailMutation.mutate(data);
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
								<div className="space-y-5 flex justify-center">
									<InputOTP maxLength={6} {...field}>
										<InputOTPGroup>
											{[0, 1, 2, 3, 4, 5].map((index) => (
												<React.Fragment key={index}>
													<InputOTPSlot
														className="text-base h-12 w-12 md:text-lg md:h-14 md:w-14 rounded-xl"
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

				<div className="w-full mt-10 flex flex-col justify-center items-center">
					<Button
						isDisabled={watch("code").length !== 6}
						type="submit"
						className="w-full bg-violet hover:bg-violet-foreground text-white rounded-full py-7 "
					>
						Verify
					</Button>
					<Button
						variant="light"
						type="button"
						className="w-fit h-fit mb-5 p-0 border-b border-green-500 mt-5 text-muted-foreground dark:hover:text-white hover:text-black hover:bg-transparent data-[hover=true]:bg-transparent transition-colors rounded-none"
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
