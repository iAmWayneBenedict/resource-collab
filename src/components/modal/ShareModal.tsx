import { useModal } from "@/store";
import { Button, Modal, ModalBody, ModalContent } from "@heroui/react";
import { useEffect, useState } from "react";
import AccessLevel from "./components/ShareModal/access-level";
import PermissionLevel from "./components/ShareModal/permission-level";
import SharedEmails from "./components/ShareModal/shared-emails";
import ShortUrlContainer from "./components/ShareModal/shorturl-container";

const ShareModal = () => {
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [copied, setCopied] = useState<boolean>(false);
	const [emails, setEmails] = useState<string>("");
	const [shareType, setShareType] = useState<"private" | "public">("private");
	const [role, setRole] = useState<"view" | "edit">("view");
	const { name, data, title, onClose, onSubmitCallback } = useModal();
	const [isLoadingShortUrl, setIsLoadingShortUrl] = useState<boolean>(false);

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

								{!data?.restrictedTo && (
									<div className="mb-6">
										<AccessLevel
											shareType={shareType}
											setShareType={setShareType}
											data={data}
										/>
									</div>
								)}

								{!data?.restrictedTo && (
									<div className="mb-6">
										<PermissionLevel
											role={role}
											setRole={setRole}
											data={data}
										/>
									</div>
								)}

								{shareType === "private" && (
									<SharedEmails
										emails={emails}
										setEmails={setEmails}
										handleSendInvite={handleSendInvite}
									/>
								)}
								<ShortUrlContainer
									data={data}
									copied={copied}
									role={role}
									shareType={shareType}
									isLoadingShortUrl={isLoadingShortUrl}
									handleCopyUrl={handleCopyUrl}
								/>

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
