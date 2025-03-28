import {
	Button,
	Input,
	Avatar,
	Dropdown,
	DropdownTrigger,
	DropdownMenu,
	DropdownItem,
	User,
} from "@heroui/react";
import { Mail, Eye, ChevronDown, Pencil, X } from "lucide-react";
import React, { Fragment, useMemo, useState, KeyboardEvent, Key } from "react";

type Props = {
	sharedTo: Record<string, string>[];
	setSharedTo: (value: Record<string, string>[]) => void;
	type: "Resource" | "Collection";
	handleChange: (e: any) => void;
};

const SharedEmails = ({ sharedTo, setSharedTo, type, handleChange }: Props) => {
	const [inputValue, setInputValue] = useState("");
	const [error, setError] = useState("");
	const [recentAddedEmails, setRecentAddedEmails] = useState<string[]>([]);

	// Email validation regex
	const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

	const validateEmail = (email: string): boolean => {
		return emailRegex.test(email);
	};
	const emailList = useMemo(() => {
		return sharedTo.map((user) => ({ ...user, email: user.email.trim() }));
	}, [sharedTo]);

	const removeEmail = (emailToRemove: string) => {
		const newSharedTo = sharedTo.filter(
			(user) => user.email !== emailToRemove,
		);
		setSharedTo(newSharedTo);
		setRecentAddedEmails((prev) =>
			prev.filter((email) => email !== emailToRemove),
		);
		handleChange({
			sharedTo: newSharedTo,
		});
	};

	const addEmail = (newEmail: string) => {
		if (!newEmail) return;
		const isEmailExist = emailList.find((user) => user.email === newEmail);
		// Check if email already exists in the list
		if (isEmailExist) {
			setError(`"${newEmail}" has already been added`);
			return;
		}

		if (validateEmail(newEmail)) {
			const updatedSharedTo = [
				...sharedTo,
				{ email: newEmail, permission: "view" },
			];
			setSharedTo(updatedSharedTo);
			setRecentAddedEmails((prev) => [...prev, newEmail]);
			setInputValue("");
			setError("");
			handleChange({
				sharedTo: updatedSharedTo,
			});
		} else {
			setError(`"${newEmail}" is not a valid email address`);
		}
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setInputValue(value);

		// If the input ends with a comma, add it to the emails list
		if (value.endsWith(",")) {
			const newEmail = value.slice(0, -1).trim();
			addEmail(newEmail);
		}
	};

	const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter" && inputValue.trim()) {
			addEmail(inputValue.trim());
			e.preventDefault();
		}
	};

	// New function to handle permission changes
	const handlePermissionChange = (email: string, permission: string) => {
		const updatedSharedTo = sharedTo.map((user) => {
			if (user.email === email) {
				return { ...user, permission };
			}
			return user;
		});
		setSharedTo(updatedSharedTo);
		handleChange({ sharedTo: updatedSharedTo });
	};

	const handleSendInvite = () => {
		console.log(recentAddedEmails);
	};

	return (
		<Fragment>
			<div className="mb-6">
				<div className="flex items-center gap-2">
					<Input
						label=""
						placeholder="Email, press comma or enter to add"
						value={inputValue}
						onChange={handleInputChange}
						onKeyDown={handleKeyDown}
						className="flex-1"
						radius="full"
						color={error ? "danger" : "default"}
						isInvalid={!!error}
						errorMessage={error}
						validate={(value) => {
							if (
								value &&
								!value.endsWith(",") &&
								!validateEmail(value)
							) {
								return "Please enter a valid email address";
							}
							return true;
						}}
						startContent={
							<Mail
								size={16}
								className="pointer-events-none flex-shrink-0 text-default-400"
							/>
						}
					/>
					<Button
						className="bg-violet text-white"
						onPress={handleSendInvite}
						radius="full"
					>
						Send Invite
					</Button>
				</div>
			</div>

			<div className="mb-6">
				<h3 className="mb-2 text-sm font-medium">Audience</h3>
				{emailList.length > 0 ? (
					<div className="custom-scrollbar max-h-[10rem] space-y-1.5 overflow-y-auto">
						{emailList.map((currentUser, index) => {
							const sharedUser = sharedTo?.find(
								(user) => user.email === currentUser.email,
							);
							return (
								<div
									key={index}
									className="flex items-center justify-between rounded-xl border border-default-200 p-2"
								>
									<div className="flex items-center gap-3">
										<User
											avatarProps={{
												size: "sm",
												fallback: currentUser.email
													.charAt(0)
													.toUpperCase(),
											}}
											name={currentUser.email}
										/>
									</div>
									<div className="flex items-center">
										<Dropdown placement="bottom-end">
											<DropdownTrigger>
												<Button
													variant="light"
													size="sm"
													radius="full"
													className="flex min-w-[70px] items-center justify-between px-3"
													endContent={
														<ChevronDown
															size={16}
														/>
													}
												>
													<div className="flex items-center gap-1.5">
														<span className="font-medium capitalize text-default-500 dark:text-default-700">
															{sharedUser?.permission ||
																sharedUser?.permission ||
																"View"}
														</span>
													</div>
												</Button>
											</DropdownTrigger>
											<DropdownMenu aria-label="Permission options">
												<DropdownItem
													key="view"
													className="text-primary"
													startContent={
														<Eye size={20} />
													}
													description="Can only view the resource"
													onPress={() =>
														handlePermissionChange(
															currentUser.email,
															"view",
														)
													}
												>
													View
												</DropdownItem>
												<DropdownItem
													key="edit"
													startContent={
														<Pencil size={20} />
													}
													description="Can view and edit the resource"
													onPress={() =>
														handlePermissionChange(
															currentUser.email,
															"edit",
														)
													}
												>
													Edit
												</DropdownItem>
											</DropdownMenu>
										</Dropdown>
										<Button
											isIconOnly
											size="sm"
											variant="light"
											radius="full"
											onPress={() =>
												removeEmail(currentUser.email)
											}
											className="text-default-500"
										>
											<X size={16} />
										</Button>
									</div>
								</div>
							);
						})}
					</div>
				) : (
					<div className="text-sm text-default-500">
						No users added yet
					</div>
				)}
			</div>
		</Fragment>
	);
};

export default SharedEmails;
