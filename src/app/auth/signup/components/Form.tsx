"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm, SubmitHandler } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import ControlledInput from "@/components/custom/ControlledInput";
import { Form } from "@/components/ui/form";
import { RegisterFormSchema, TRegisterForm } from "@/types/zod/forms";
import { Checkbox } from "@nextui-org/checkbox";
import Socials from "../../_components/Socials";
import { Button } from "@nextui-org/Button";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { bindReactHookFormError } from "@/lib/utils";
import { usePostRegisterMutation } from "@/services/mutations/users/auth-services";

const SignUpForm = () => {
	const [isDisabledBtn, setDisabledBtn] = useState(false);
	const router = useRouter();
	const form = useForm<TRegisterForm>({
		resolver: zodResolver(RegisterFormSchema),
		defaultValues: {
			name: "",
			email: "",
			password: "",
			confirm_password: "",
		},
	});
	const {
		register,
		formState: { errors },
		handleSubmit,
		control,
		setError,
	} = form;
	
	const registerMutation = usePostRegisterMutation({
		onSuccess: (res) => {
			setDisabledBtn(false);

			// redirect to verification page
			router.push("/auth/verification?email=" + form.getValues("email"));
		},
		onError: (err) => {
			setDisabledBtn(false);
			bindReactHookFormError(err, setError);
		},
	});
	const onSubmit: SubmitHandler<TRegisterForm> = (data) => {
		setDisabledBtn(true);
		registerMutation.mutate(data);
	};
	const [passwordType, setPasswordType] = useState("password");
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
						name="name"
						type="text"
						label="Name"
						control={control}
						error={errors.name}
					/>
					<ControlledInput
						name="email"
						type="email"
						label="Email"
						control={control}
						error={errors.email}
					/>
					<ControlledInput
						name="password"
						type={passwordType}
						label="Password"
						control={control}
						error={errors.password}
					/>
					<ControlledInput
						name="confirm_password"
						type={passwordType}
						label="Confirm Password"
						control={control}
						error={errors.confirm_password}
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
					<Socials setDisabled={setDisabledBtn} disabled={isDisabledBtn} />
					<br />
					<Button
						type="submit"
						isLoading={isDisabledBtn}
						className="gap-4 w-full bg-violet hover:bg-violet-foreground text-white rounded-full py-8 "
					>
						Sign up
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
export default SignUpForm;
