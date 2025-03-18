import { useModal } from "@/store";
import {
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalHeader,
	Input,
	Switch,
	Card,
	RadioGroup,
	Radio,
} from "@heroui/react";
import { Check, Copy, Link, Globe, Lock } from "lucide-react";
import { useEffect, useState } from "react";

const ShareModal = () => {
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [copied, setCopied] = useState<boolean>(false);
	const [emails, setEmails] = useState<string>("");
	const [shareType, setShareType] = useState<"private" | "public">("private");
	const { name, data, title, onClose } = useModal();

	useEffect(() => {
		if (name === "share-resource") {
			setIsOpen(true);
		}
	}, [name]);

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
		// Logic to send invites to the emails
		console.log("Sending invites to:", emails);
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
								Share {title}
							</div>
							<div className="p-6">
								<p className="mb-4 text-sm text-default-600">
									Give your audience access to {title}.
								</p>

								<div className="mb-6">
									<RadioGroup
										value={shareType}
										onValueChange={setShareType as any}
										orientation="horizontal"
										className="gap-4"
										classNames={{
											wrapper: "flex gap-4",
										}}
									>
										<Radio
											value="private"
											className="rounded-lg border-1 p-3 data-[selected=true]:border-primary"
										>
											<div className="flex items-center gap-2">
												<div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
													<Lock size={16} />
												</div>
												<div>
													<p className="text-sm font-medium">
														Invite Only
													</p>
													<p className="text-xs text-default-500">
														Only invited people
													</p>
												</div>
											</div>
										</Radio>
										<Radio
											value="public"
											className="rounded-lg border-1 p-3 data-[selected=true]:border-primary"
										>
											<div className="flex items-center gap-2">
												<div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
													<Globe size={16} />
												</div>
												<div>
													<p className="text-sm font-medium">
														Public
													</p>
													<p className="text-xs text-default-500">
														Anyone with the link
													</p>
												</div>
											</div>
										</Radio>
									</RadioGroup>
								</div>

								{shareType === "private" && (
									<>
										<div className="mb-6 flex items-center gap-2">
											<Input
												placeholder="Email, comma separated"
												value={emails}
												onChange={(e) =>
													setEmails(e.target.value)
												}
												className="flex-1"
											/>
											<Button
												className="bg-violet text-content1"
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
											? "Anyone with the link can access this resource."
											: "Share read-only enrollment link to enroll an audience in this resource."}
									</p>
									<div className="flex items-center gap-2 rounded-lg border border-default-200 p-2">
										<Link
											size={16}
											className="ml-2 text-default-500"
										/>
										<span className="flex-1 truncate text-sm">
											{data?.url}
										</span>
										<Button
											size="sm"
											variant="flat"
											onClick={handleCopyUrl}
											className="transition-all"
										>
											{copied ? "Copied" : "Copy"}
										</Button>
									</div>
								</div>

								<div className="mt-6 flex w-full justify-end">
									<div className="flex gap-2">
										<Button
											variant="light"
											onPress={() => onCloseModal(false)}
										>
											Cancel
										</Button>
										<Button
											color="primary"
											onPress={() => onCloseModal(false)}
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
