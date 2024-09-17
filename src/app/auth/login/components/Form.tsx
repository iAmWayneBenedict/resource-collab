"use client";

import { useState } from "react";
import Link from "next/link";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ControlledInput from "@/components/custom/ControlledInput";
import { Form } from "@/components/ui/form";
import { Checkbox } from "@nextui-org/checkbox";
import Socials from "../../_components/Socials";
import { LoginFormSchema, TLoginForm } from "@/types/zod/forms";
import AuthApiManager from "@/api/managers/AuthApiManager";
import { useRouter } from "next/navigation";
import { bindReactHookFormError } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Button } from "@nextui-org/Button";
const LoginForm = () => {
	const [isDisabledBtn, setDisabledBtn] = useState(false);
	const router = useRouter();
	const form = useForm<TLoginForm>({
		resolver: zodResolver(LoginFormSchema),
	});
	const {
		register,
		formState: { errors },
		handleSubmit,
		control,
		setError,
	} = form;
	const [passwordType, setPasswordType] = useState("password");
	const loginMutation = useMutation({
		mutationFn: (data: TLoginForm) => AuthApiManager.login(data),
		onSuccess: (res) => {
			setDisabledBtn(false);
			// router.push("/auth/verification?email=" + form.getValues("email"));
		},
		onError: (err) => {
			setDisabledBtn(false);
			bindReactHookFormError(err, setError);
		},
	});
	const onSubmit: SubmitHandler<TLoginForm> = (data) => {
		setDisabledBtn(true);
		loginMutation.mutate(data);
	};
	return (
		<Form {...form}>
			<form onSubmit={handleSubmit(onSubmit)} className="mt-8 max-w-[50rem]">
				{errors.alert && (
					<>
						<Alert variant="destructive">
							<AlertCircle className="h-4 w-4" />
							<AlertTitle>Error</AlertTitle>
							<AlertDescription>{errors.alert?.message || ""}</AlertDescription>
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
					<Socials />
					<br />
					<Button
						type="submit"
						isLoading={isDisabledBtn}
						className="w-full bg-violet hover:bg-violet-foreground text-white rounded-full py-8 "
					>
						Login
					</Button>
					<div>
						<center className="mt-4">
							Don&apos;t have an account?{" "}
							<Link href="/auth/signup" className="text-green-500">
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
