import {
	Button,
	Input,
	Chip,
	Avatar,
	Dropdown,
	DropdownTrigger,
	DropdownMenu,
	DropdownItem,
} from "@heroui/react";
import { Mail, Eye, ChevronDown, Pencil } from "lucide-react";
import React, { Fragment, useMemo, useState, KeyboardEvent } from "react";

type Props = {
	emails: string;
	setEmails: (value: string) => void;
	handleSendInvite: () => void;
};

const SharedEmails = ({ emails, setEmails, handleSendInvite }: Props) => {
	const [inputValue, setInputValue] = useState("");
	const [error, setError] = useState("");
	const [users, setUsers] = useState<any>([]);

	// Email validation regex
	const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

	const validateEmail = (email: string): boolean => {
		return emailRegex.test(email);
	};

	const emailList = useMemo(() => {
		return emails
			.split(",")
			.map((email) => email.trim())
			.filter((email) => email !== "");
	}, [emails]);

	const removeEmail = (emailToRemove: string) => {
		const newEmails = emailList
			.filter((email) => email !== emailToRemove)
			.join(", ");
		setEmails(newEmails);
	};

	const addEmail = (newEmail: string) => {
		if (!newEmail) return;

		if (validateEmail(newEmail)) {
			const updatedEmails = emails ? `${emails}, ${newEmail}` : newEmail;
			setEmails(updatedEmails);
			setInputValue("");
			setError("");
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
	const handlePermissionChange = (userId: number, permission: string) => {
		// setUsers(
		// 	users.map((user) =>
		// 		user.id === userId ? { ...user, permission } : user,
		// 	),
		// );
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

				{emailList.length > 0 && (
					<div className="mt-2 flex flex-wrap gap-2">
						{emailList.map((email, index) => (
							<Chip
								key={index}
								onClose={() => removeEmail(email)}
								variant="flat"
								radius="full"
							>
								{email}
							</Chip>
						))}
					</div>
				)}
			</div>

			<div className="mb-6">
				<h3 className="mb-2 text-sm font-medium">Audience</h3>
				{users.length > 0 ? (
					<div className="space-y-3">
						{users.map((user: any) => (
							<div
								key={user.id}
								className="flex items-center justify-between rounded-xl border border-default-200 p-2"
							>
								<div className="flex items-center gap-3">
									<Avatar
										name={user.name}
										size="sm"
										radius="full"
										color="primary"
										fallback={user.name.charAt(0)}
									/>
									<div>
										<p className="text-sm font-medium">
											{user.name}
										</p>
										<p className="text-xs text-default-500">
											{user.email}
										</p>
									</div>
								</div>
								<Dropdown placement="bottom-end" isDisabled>
									<DropdownTrigger>
										<Button
											variant="light"
											size="sm"
											radius="full"
											className="flex min-w-[70px] items-center justify-between px-3"
											endContent={
												<ChevronDown size={16} />
											}
										>
											<div className="flex items-center gap-1.5">
												<span className="font-medium capitalize text-default-500 dark:text-default-200">
													{user.permission}
												</span>
											</div>
										</Button>
									</DropdownTrigger>
									<DropdownMenu aria-label="Permission options">
										<DropdownItem
											key="view"
											className={
												user.permission === "view"
													? "text-primary"
													: ""
											}
											onPress={() =>
												handlePermissionChange(
													user.id,
													"view",
												)
											}
											startContent={<Eye size={20} />}
											description="Can only view the resource"
										>
											View
										</DropdownItem>
										<DropdownItem
											key="edit"
											className={
												user.permission === "edit"
													? "text-primary"
													: ""
											}
											onPress={() =>
												handlePermissionChange(
													user.id,
													"edit",
												)
											}
											startContent={<Pencil size={20} />}
											description="Can view and edit the resource"
										>
											Edit
										</DropdownItem>
									</DropdownMenu>
								</Dropdown>
							</div>
						))}
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
