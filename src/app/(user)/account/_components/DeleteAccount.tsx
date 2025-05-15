"use client";

import { authClient } from "@/config/auth";
import { useAuthUser } from "@/store";
import {
	addToast,
	Button,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	useDisclosure,
} from "@heroui/react";
import { Trash2 } from "lucide-react";
import { useState } from "react";

const DeleteAccount = () => {
	const { isOpen, onOpen, onOpenChange } = useDisclosure();
	const authUser = useAuthUser((state) => state.authUser);
	const [email, setEmail] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");

	const handleDelete = async () => {
		setIsLoading(true);

		if (authUser?.email !== email) {
			setError("Email does not match");
			setIsLoading(false);
			return;
		}

		try {
			await authClient.deleteUser();
			addToast({
				title: "Account deleted",
				description: "Your account has been deleted",
				color: "success",
			});
			setIsLoading(false);
			onOpenChange();
			setTimeout(() => {
				location.href = "/";
			}, 2000);
		} catch (error) {
			setError("Something went wrong");
			setIsLoading(false);
			return;
		}
	};

	return (
		<div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6">
			<div className="flex w-full flex-col items-start space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
				<div className="space-y-1">
					<h2 className="text-lg font-medium">Delete Account</h2>
					<p className="text-sm text-default-500">
						Once you delete your account, there is no going back.
						Please be certain.
					</p>
				</div>
				<Button
					color="danger"
					variant="flat"
					onPress={onOpen}
					startContent={<Trash2 className="h-4 w-4" />}
					radius="full"
				>
					Delete Account
				</Button>
			</div>

			<Modal
				isOpen={isOpen}
				onOpenChange={onOpenChange}
				placement="center"
				backdrop="blur"
			>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader className="flex flex-col gap-1">
								<h3>Delete Account</h3>
								<p className="text-sm font-normal text-default-500">
									This action cannot be undone. This will
									permanently delete your account and remove
									your data from our servers. Please type your
									email <b>"{authUser?.email}"</b> to confirm.
								</p>
							</ModalHeader>
							<ModalBody>
								<Input
									type="email"
									label={`Type your email to confirm`}
									placeholder={`Type your email to confirm deletion`}
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									errorMessage={error}
									isInvalid={!!error}
								/>
							</ModalBody>
							<ModalFooter>
								<Button
									variant="light"
									onPress={onClose}
									radius="full"
								>
									Cancel
								</Button>
								<Button
									color="danger"
									onPress={handleDelete}
									isLoading={isLoading}
									isDisabled={!email}
									radius="full"
								>
									Delete Account
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</div>
	);
};

export default DeleteAccount;
