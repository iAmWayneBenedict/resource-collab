"use client";

import React from "react";
import { Button, Card, CardBody, Input, Image, Form } from "@heroui/react";
import { useAuthUser } from "@/store";
import { githubIcon, googleIcon } from "../../../../../public/assets/icons";

export const PasswordReset = () => {
	const [currentPassword, setCurrentPassword] = React.useState("");
	const [newPassword, setNewPassword] = React.useState("");
	const [confirmPassword, setConfirmPassword] = React.useState("");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (newPassword !== confirmPassword) return;
	};

	return (
		<Card className="shadow-md">
			<CardBody>
				<h2 className="mb-4 text-lg font-semibold">Password</h2>
				<Form onSubmit={handleSubmit} className="flex flex-col gap-4">
					<Input
						label="Current Password"
						type="password"
						placeholder="Enter current password"
						value={currentPassword}
						onValueChange={setCurrentPassword}
					/>
					<Input
						label="New Password"
						type="password"
						placeholder="Enter new password"
						value={newPassword}
						onValueChange={setNewPassword}
					/>
					<Input
						label="Confirm New Password"
						type="password"
						placeholder="Confirm new password"
						value={confirmPassword}
						onValueChange={setConfirmPassword}
					/>
					<Button
						className="bg-violet text-white"
						radius="full"
						type="submit"
					>
						Reset Password
					</Button>
				</Form>
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
		<Card className="shadow-md">
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
