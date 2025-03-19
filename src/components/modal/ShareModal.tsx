import { cn } from "@/lib/utils";
import { useModal } from "@/store";
import {
	Button,
	Modal,
	ModalBody,
	ModalContent,
	Input,
	RadioGroup,
	Radio,
	Select,
	SelectItem,
	Spacer,
	Tooltip,
	Spinner,
} from "@heroui/react";
import {
	Copy,
	Link,
	Globe,
	Lock,
	CheckCheck,
	Eye,
	Mail,
	Pencil,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";

const PERMISSION_LEVELS = [
	{
		label: "View only",
		value: "view",
		description: "(Can view but not edit)",
		icon: <Eye size={16} className="text-default-500" />,
	},
	{
		label: "Editor",
		value: "edit",
		description: "(Can edit and make changes)",
		icon: <Pencil size={16} className="text-default-500" />,
	},
];

const ACCESS_LEVELS = [
	{
		name: "Invite Only",
		value: "private",
		description: "Only invited people can access",
		icon: <Lock size={16} />,
	},
	{
		name: "Public",
		value: "public",
		description: "Anyone with the link can access",
		icon: <Globe size={16} />,
	},
];

const ShareModal = () => {
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [copied, setCopied] = useState<boolean>(false);
	const [emails, setEmails] = useState<string>("");
	const [shareType, setShareType] = useState<"private" | "public">("private");
	const [role, setRole] = useState<"view" | "edit">("view");
	const { name, data, title, onClose, onSubmitCallback } = useModal();
	const [isLoadingShortUrl, setIsLoadingShortUrl] = useState<boolean>(false);
	const isSmallDevices = useMediaQuery({
		query: "(max-width: 64rem)",
	});
	useEffect(() => {
		if (name === "share-resource") {
			setIsOpen(true);
			setShareType(data?.restrictedTo);
			if (data?.restrictedTo && !data?.id) {
				setIsLoadingShortUrl(true);
				onSubmitCallback({
					id: data?.id ?? null,
					access_level: data?.restrictedTo,
					emails: [],
				});
			}
		}
	}, [name]);

	useEffect(() => {
		if (data?.id && data?.restrictedTo) {
			setIsLoadingShortUrl(false);
		}
	}, [data]);

	const onCloseModal = (state: boolean) => {
		setIsOpen(state);
		onClose();
	};

	const handleCopyUrl = () => {
		if (data?.url) {
			navigator.clipboard.writeText(data.url);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		}
	};

	const handleSendInvite = () => {
		// Logic to send invites to the emails with selected role
		console.log("Sending invites to:", emails, "with role:", role);
		// Reset the input field after sending
		setEmails("");
	};

	return (
		<Modal
			isOpen={isOpen}
			placement="center"
			onOpenChange={onCloseModal}
			backdrop="blur"
			size="xl"
		>
			<ModalContent>
				{() => (
					<>
						<ModalBody className="gap-1 rounded-2xl border border-default-200 p-0">
							<div className="px-6 pt-4 text-base font-semibold">
								Share {data?.type}
							</div>
							<div className="p-6">
								<p className="mb-4 line-clamp-2 text-sm text-default-600">
									Give your audience access to "{title}".
								</p>

								<div className="mb-6">
									<RadioGroup
										value={shareType}
										onValueChange={setShareType as any}
										orientation={
											isSmallDevices
												? "vertical"
												: "horizontal"
										}
										classNames={{
											wrapper: "flex gap-3",
										}}
										isDisabled={!!data?.restrictedTo}
									>
										{ACCESS_LEVELS.map((level) => (
											<Radio
												key={level.value}
												value={level.value}
												classNames={{
													base: cn(
														"m-0 inline-flex items-center justify-between bg-content1 hover:bg-content2",
														"max-w-full flex-1 cursor-pointer flex-row-reverse gap-4 rounded-lg border-1 border-default-200 px-2 py-3",
														"rounded-xl data-[selected=true]:border-primary",
													),
												}}
											>
												<div className="flex items-center gap-2">
													<div className="flex h-8 w-8 min-w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
														{level.icon}
													</div>
													<div>
														<p className="text-sm font-medium">
															{level.name}
														</p>
														<p className="text-xs text-default-500">
															{level.description}
														</p>
													</div>
												</div>
											</Radio>
										))}
									</RadioGroup>
								</div>

								<div className="mb-6">
									<Spacer />
									<Select
										label="Select permission level"
										labelPlacement="outside"
										value={role}
										onChange={(e) =>
											setRole(
												e.target.value as
													| "view"
													| "edit",
											)
										}
										className="w-full"
										defaultSelectedKeys={["view"]}
										aria-label="Select permission level"
										isDisabled={!!data?.restrictedTo}
										renderValue={(items) => {
											return items.map((item) => {
												const level =
													PERMISSION_LEVELS.find(
														(level) =>
															level.value ===
															item.key,
													);
												return (
													<div
														key={item.key}
														className="flex items-center gap-2"
													>
														{level?.icon}
														<span>
															{level?.label}
														</span>
														<span className="text-xs text-default-500">
															{level?.description}
														</span>
													</div>
												);
											});
										}}
									>
										{PERMISSION_LEVELS.map((level) => (
											<SelectItem
												key={level.value}
												textValue={`${level.label} ${level.description}`}
											>
												<div className="flex items-center gap-2">
													{level.icon}
													<span>{level.label}</span>
													<span className="text-xs text-default-500">
														{level.description}
													</span>
												</div>
											</SelectItem>
										))}
									</Select>
								</div>

								{shareType === "private" && (
									<>
										<div className="mb-6 flex items-center gap-2">
											<Input
												label=""
												placeholder="Email, comma separated"
												value={emails}
												onChange={(e) =>
													setEmails(e.target.value)
												}
												className="flex-1"
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
											>
												Send Invite
											</Button>
										</div>

										<div className="mb-6">
											<h3 className="mb-2 text-sm font-medium">
												Audience
											</h3>
											<div className="text-sm text-default-500">
												No users added yet
											</div>
										</div>
									</>
								)}
								<div className="mb-4">
									<p className="mb-2 text-sm text-default-600">
										{shareType === "public"
											? `Anyone with the link can ${role === "view" ? "view" : "edit"} this resource.`
											: `Share ${role === "view" ? "read-only" : "editable"} enrollment link to enroll an audience in this resource.`}
									</p>
									<div className="flex items-center gap-2 rounded-xl bg-default-100 p-2">
										<Link
											size={16}
											className="ml-2 text-default-500"
										/>
										<span className="flex-1 truncate text-sm">
											{data?.url}
										</span>
										<Tooltip
											content={"Copied!"}
											placement="top"
											isOpen={copied}
											showArrow
										>
											<Button
												size="sm"
												variant="flat"
												onPress={handleCopyUrl}
												isIconOnly
												isDisabled={isLoadingShortUrl}
											>
												{isLoadingShortUrl ? (
													<Spinner size="sm" />
												) : copied ? (
													<CheckCheck size={16} />
												) : (
													<Copy size={16} />
												)}
											</Button>
										</Tooltip>
									</div>
								</div>

								<div className="mt-6 flex w-full justify-end">
									<div className="flex gap-2">
										<Button
											variant="light"
											onPress={() => onCloseModal(false)}
											radius="full"
										>
											Cancel
										</Button>
										<Button
											onPress={() => onCloseModal(false)}
											className="bg-violet text-white"
											radius="full"
										>
											Done
										</Button>
									</div>
								</div>
							</div>
						</ModalBody>
					</>
				)}
			</ModalContent>
		</Modal>
	);
};
export default ShareModal;
