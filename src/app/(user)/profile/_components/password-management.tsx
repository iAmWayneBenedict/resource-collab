"use client";

import React, { useState } from "react";
import {
	Button,
	Card,
	CardBody,
	Input,
	Image,
	Checkbox,
	addToast,
} from "@heroui/react";
import { useAuthUser } from "@/store";
import { githubIcon, googleIcon } from "../../../../../public/assets/icons";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { authClient } from "@/config/auth";

// Regex for password validation
// Example: At least 8 characters, one uppercase, one lowercase, one number, and one special character
const passwordRegex =
	/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[_^a-zA-Z\d\s])[A-Za-z\d\W_]{8,}$/;
const resetPasswordSchema = z
	.object({
		currentPassword: z
			.string()
			.regex(passwordRegex, {
				message:
					"Password must be at least 8 characters long, include one uppercase letter, one lowercase letter, one number, and one special character",
			})
			.min(8)
			.max(255),
		newPassword: z
			.string()
			.regex(passwordRegex, {
				message:
					"Password must be at least 8 characters long, include one uppercase letter, one lowercase letter, one number, and one special character",
			})
			.min(8)
			.max(255),
		confirmPassword: z.string(),
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

export const PasswordReset = () => {
	const { setAuthUser } = useAuthUser();
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const form = useForm({
		resolver: zodResolver(resetPasswordSchema),
		defaultValues: {
			currentPassword: "",
			newPassword: "",
			confirmPassword: "",
		},
	});

	const onSubmit = async (data: z.infer<typeof resetPasswordSchema>) => {
		try {
			setIsLoading(true);
			const res = await authClient.changePassword({
				currentPassword: data.currentPassword,
				newPassword: data.newPassword,
			});
			if (res.error?.code === "INVALID_PASSWORD") {
				return form.setError("currentPassword", {
					message: "Invalid current password",
				});
			}
			if (res.data) {
				const user = await authClient.getSession();
				if (user.data?.user) {
					setAuthUser(user.data.user as any);
					addToast({
						title: "Success",
						description: "Successfully changed password",
						color: "success",
					});
				}

				form.reset();
				setShowPassword(false);
			}
		} catch (error) {
			console.log(error);
			addToast({
				title: "Error",
				description: "Failed to change password",
				color: "danger",
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Card className="bg-default-50 shadow-none">
			<CardBody>
				<h2 className="mb-4 text-lg font-semibold">Password</h2>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="flex flex-col gap-4"
				>
					<Controller
						name="currentPassword"
						control={form.control}
						render={({ field, formState: { errors } }) => (
							<Input
								label="Current Password"
								type={showPassword ? "text" : "password"}
								placeholder="Enter current password"
								value={field.value}
								onValueChange={field.onChange}
								isInvalid={!!errors.currentPassword}
								errorMessage={errors.currentPassword?.message}
							/>
						)}
					/>
					<Controller
						name="newPassword"
						control={form.control}
						render={({ field, formState: { errors } }) => (
							<Input
								label="New Password"
								type={showPassword ? "text" : "password"}
								placeholder="Enter new password"
								value={field.value}
								onValueChange={field.onChange}
								isInvalid={!!errors.newPassword}
								errorMessage={errors.newPassword?.message}
							/>
						)}
					/>
					<Controller
						name="confirmPassword"
						control={form.control}
						render={({ field, formState: { errors } }) => (
							<Input
								label="Confirm New Password"
								type={showPassword ? "text" : "password"}
								placeholder="Confirm new password"
								value={field.value}
								onValueChange={field.onChange}
								isInvalid={!!errors.confirmPassword}
								errorMessage={errors.confirmPassword?.message}
							/>
						)}
					/>

					<Checkbox
						isSelected={showPassword}
						onValueChange={(isChecked) =>
							setShowPassword(isChecked)
						}
					>
						Show Password
					</Checkbox>
					<Button
						className="bg-violet text-white"
						radius="full"
						type="submit"
						isLoading={isLoading}
					>
						Reset Password
					</Button>
				</form>
			</CardBody>
		</Card>
	);
};

export const SocialAuthInfo = () => {
	const { authUser } = useAuthUser();
	const provider = authUser?.provider;

	if (!provider || (provider !== "google" && provider !== "github")) {
		return null;
	}

	const providerIcon = provider === "google" ? googleIcon : githubIcon;
	const providerName = provider.charAt(0).toUpperCase() + provider.slice(1);

	return (
		<Card className="bg-default-50 shadow-none">
			<CardBody>
				<h2 className="mb-4 text-lg font-semibold">Password</h2>
				<div className="flex items-center gap-4 rounded-2xl bg-default-100 p-4">
					<div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
						<Image
							src={providerIcon.src}
							alt={providerName}
							width={24}
							height={24}
							className={
								provider === "github"
									? "group-hover:[filter:invert(1)]"
									: ""
							}
						/>
					</div>
					<div>
						<h3 className="font-medium">
							Signed in with {providerName}
						</h3>
						<p className="text-sm text-default-600">
							Password management is handled by {providerName}.
							You cannot change your password here.
						</p>
					</div>
				</div>
			</CardBody>
		</Card>
	);
};
