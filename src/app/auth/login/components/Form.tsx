"use client";

import { useState } from "react";
import Link from "next/link";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ControlledInput from "@/components/custom/ControlledInput";
import { Form } from "@/components/ui/form";
import { Checkbox, Button } from "@heroui/react";
import Socials from "../../_components/Socials";
import { LoginFormSchema, TLoginForm } from "@/types/zod/forms";
import { bindReactHookFormError } from "@/lib/utils";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { authClient } from "@/config/auth";

const LoginForm = () => {
	const [isDisabledBtn, setIsDisabledBtn] = useState(false);
	const form = useForm<TLoginForm>({
		resolver: zodResolver(LoginFormSchema),
		defaultValues: {
			email: "",
			password: "",
			alert: "",
		},
	});

	const {
		formState: { errors },
		handleSubmit,
		control,
		setError,
	} = form;

	const [passwordType, setPasswordType] = useState("password");
	const onSubmit: SubmitHandler<TLoginForm> = async (data) => {
		setIsDisabledBtn(true);
		const signinResponse = await authClient.signIn.email({
			email: data.email,
			password: data.password,
		});
		setIsDisabledBtn(false);
		if (signinResponse.error) {
			if (signinResponse.error.code === "INVALID_EMAIL_OR_PASSWORD")
				bindReactHookFormError(
					{
						data: { path: ["alert"] },
						message: "Invalid email or password",
					},
					setError,
				);
		} else {
			location.href = "/dashboard?page=resources";
		}
	};
	return (
		<Form {...form}>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="mt-8 max-w-[50rem]"
			>
				{errors.alert && (
					<>
						<Alert variant="destructive">
							<AlertCircle className="h-4 w-4" />
							<AlertTitle>Error</AlertTitle>
							<AlertDescription>
								{errors.alert?.message || ""}
							</AlertDescription>
						</Alert>
						<br />
					</>
				)}
				<div className="flex flex-col gap-4">
					<ControlledInput
						name={"email"}
						type={"email"}
						label={"Email"}
						control={control}
						error={errors.email}
					/>
					<ControlledInput
						name={"password"}
						type={passwordType}
						label={"Password"}
						control={control}
						error={errors.password}
					/>
					<div className="flex items-center space-x-2">
						<Checkbox
							isSelected={passwordType === "text"}
							onValueChange={(checked: boolean) =>
								setPasswordType(checked ? "text" : "password")
							}
						>
							Show password
						</Checkbox>
					</div>
					<br />
					<br />
					<Socials
						setDisabled={setIsDisabledBtn}
						disabled={isDisabledBtn}
					/>
					<br />
					<Button
						type="submit"
						isLoading={isDisabledBtn}
						className="w-full rounded-full bg-violet py-8 text-white hover:bg-violet-foreground"
					>
						Login
					</Button>
					<div>
						<center className="mt-4">
							Don&apos;t have an account?{" "}
							<Link
								href="/auth/signup"
								className="text-green-500"
							>
								Sign up
							</Link>
						</center>
					</div>
				</div>
			</form>
		</Form>
	);
};

export default LoginForm;
