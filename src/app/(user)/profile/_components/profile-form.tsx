"use client";

import React, { useEffect, useState } from "react";
import {
	Card,
	CardBody,
	Input,
	Button,
	Avatar,
	addToast,
	Form,
} from "@heroui/react";
import { PasswordReset, SocialAuthInfo } from "./password-management";
import { useAuthUser } from "@/store";
import { UploadButton } from "@/lib/storage/uploadthing";
import { authClient } from "@/config/auth";
import { ClientUploadedFileData } from "uploadthing/types";
import { usePostDeleteUploadThingFileMutation } from "@/lib/mutations/storage/uploadthing";
import { AnimatePresence, motion } from "motion/react";

const updateUserFields = async (body: Record<string, string>) => {
	const { setAuthUser } = useAuthUser.getState();
	await authClient.updateUser(body);
	try {
		const user = await authClient.getSession();
		if (user.data?.user) {
			setAuthUser(user.data.user as any);
			addToast({
				title: "Success",
				description: "Successfully updated profile",
				color: "success",
			});
		}
	} catch (err) {
		console.log(err);
	}
};

export const ProfileForm = () => {
	const { authUser, setAuthUser } = useAuthUser();
	const deleteImageMutation = usePostDeleteUploadThingFileMutation();
	const [fileId, setFileId] = useState<string | null>(null);
	const [isEditing, setIsEditing] = useState(false);
	const [profileLoading, setProfileLoading] = useState(false);
	const [formData, setFormData] = useState({
		name: authUser?.name,
		email: authUser?.email,
	});

	useEffect(() => {
		if (authUser) {
			setFormData({ name: authUser?.name, email: authUser?.email });
			setFileId(authUser?.image?.split("/").at(-1) as string);
		}
	}, [authUser]);

	const handleSave = async (event: React.FormEvent) => {
		event.preventDefault();
		setProfileLoading(true);
		await updateUserFields({ name: formData.name as string });
		setProfileLoading(false);
		setIsEditing(false);
	};
	const handleCancel = () => {
		setFormData({ name: authUser?.name, email: authUser?.email });
		setIsEditing(false);
	};

	const handleClientUploadComplete = async (
		res: ClientUploadedFileData<{ uploadedBy: string }>[],
	) => {
		updateUserFields({ image: res[0].ufsUrl });
		setFileId(res[0].key);
	};

	const handleBeforeUploadBegin = (files: File[]) => {
		if (fileId) deleteImageMutation.mutate([fileId]);
		return files;
	};

	return (
		<div className="mx-auto w-full">
			<Form onSubmit={handleSave} className="w-full">
				<Card className="mb-6 w-full bg-default-50 shadow-none">
					<CardBody className="gap-6">
						<div className="flex items-center gap-4">
							<Avatar
								isBordered
								size="lg"
								src={authUser?.image}
							/>
							<UploadButton
								endpoint="imageUploader"
								className="ut-button:rounded-3xl ut-button:bg-violet"
								onClientUploadComplete={
									handleClientUploadComplete
								}
								onUploadError={(error: Error) => {
									// Do something with the error.
									console.log(error.name);

									addToast({
										title: "Error",
										description:
											"File must be less than 4mb in size.",
										color: "danger",
									});
								}}
								onBeforeUploadBegin={handleBeforeUploadBegin}
							/>
						</div>

						<div className="space-y-4">
							<Input
								label="Name"
								placeholder="Enter your name"
								value={formData.name}
								onValueChange={(value) =>
									setFormData({ ...formData, name: value })
								}
								isRequired
								isReadOnly={!isEditing}
							/>
							<Input
								label="Email"
								value={formData.email}
								onValueChange={(value) =>
									setFormData({ ...formData, email: value })
								}
								isDisabled={true}
							/>
						</div>

						<motion.div
							className="flex gap-2"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ duration: 0.3 }}
						>
							<AnimatePresence mode="wait" initial={false}>
								{isEditing ? (
									<motion.div
										key="submit"
										initial={{ opacity: 0, x: -20 }}
										animate={{ opacity: 1, x: 0 }}
										exit={{ opacity: 0, x: 20 }}
										transition={{ duration: 0.2 }}
										className="flex gap-2"
									>
										<Button
											className="bg-violet text-white"
											radius="full"
											type="submit"
											isLoading={profileLoading}
										>
											Save Changes
										</Button>
										<Button
											variant="light"
											radius="full"
											type="button"
											isDisabled={profileLoading}
											onPress={handleCancel}
										>
											Cancel
										</Button>
									</motion.div>
								) : (
									<motion.div
										key="edit"
										initial={{ opacity: 0, x: 20 }}
										animate={{ opacity: 1, x: 0 }}
										exit={{ opacity: 0, x: -20 }}
										transition={{ duration: 0.2 }}
									>
										<button type="submit" hidden />
										<Button
											className="bg-violet-200 text-violet-700 dark:bg-violet-900 dark:text-violet-200"
											radius="full"
											variant="flat"
											type="button"
											onPress={() => setIsEditing(true)}
										>
											Edit Profile
										</Button>
									</motion.div>
								)}
							</AnimatePresence>
						</motion.div>
					</CardBody>
				</Card>
			</Form>

			<SocialAuthInfo />
			{authUser?.provider === "credential" && <PasswordReset />}
		</div>
	);
};
