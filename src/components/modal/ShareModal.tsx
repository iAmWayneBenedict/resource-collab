"use client";

import { useModal } from "@/store";
import { Button, Modal, ModalBody, ModalContent } from "@heroui/react";
import { useCallback, useEffect, useState } from "react";
import AccessLevel from "./components/ShareModal/access-level";
import PermissionLevel from "./components/ShareModal/permission-level";
import SharedEmails from "./components/ShareModal/shared-emails";
import ShortUrlContainer from "./components/ShareModal/shorturl-container";
import { toggleScrollBody } from "@/lib/utils";

interface ShareValues {
	access_level?: "private" | "public";
	permission_level?: "view" | "edit";
	emails?: string;
	sharedTo?: Record<string, string>[];
	id?: number | null;
}

const ShareModal = () => {
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [copied, setCopied] = useState<boolean>(false);
	// const [emails, setEmails] = useState<string>("");
	const [sharedTo, setSharedTo] = useState<Record<string, string>[]>([]);
	const [shareType, setShareType] = useState<"private" | "public">("public");
	const [role, setRole] = useState<"view" | "edit">("view");
	const [isLoadingShortUrl, setIsLoadingShortUrl] = useState<boolean>(false);
	const { name, data, title, onClose, onSubmitCallback } = useModal();

	// Initialize modal state when opened
	useEffect(() => {
		if (name === "share-modal") {
			setIsOpen(true);
			setShareType(
				(data?.restrictedTo || data?.access_level) ?? "private",
			);
			setIsLoadingShortUrl(true);
			toggleScrollBody(true);

			// Only submit if we have restrictedTo but no ID
			if (data?.restrictedTo && !data?.id) {
				onSubmitCallback({
					id: null,
					access_level: data.restrictedTo,
					emails: [],
				});
			}
		}
	}, [name]);
	// Update state based on data changes
	useEffect(() => {
		if (data?.loaded) {
			setIsLoadingShortUrl(false);
		}
		if (name === "share-modal") {
			if (data?.id && data?.shared_to) {
				setSharedTo(data.shared_to);
				setShareType(
					data?.access_level === "shared"
						? "private"
						: data?.access_level,
				);
			} else {
				setSharedTo([]);
			}
		}
	}, [data]);

	const onCloseModal = useCallback(() => {
		onClose();
		setIsOpen(false);
		toggleScrollBody(false);
	}, [onClose]);

	const handleCopyUrl = useCallback(() => {
		if (data?.url) {
			navigator.clipboard.writeText(data.url);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		}
	}, [data?.url]);

	const handleChange = useCallback(
		(values: ShareValues) => {
			const access_level = values?.access_level || shareType;
			const permission_level = values?.permission_level || role;
			const shared_to =
				values?.sharedTo === undefined ? sharedTo : values?.sharedTo;
			let sharedToType: Record<string, any[]> = {
				emails: [],
				shared_to: [],
			};
			if (data?.type === "Resource") {
				sharedToType.emails =
					access_level === "public"
						? []
						: shared_to.map(({ email }) => email);
			} else if (data?.type === "Collection") {
				sharedToType.shared_to =
					access_level === "public" ? [] : shared_to;
			}
			setIsLoadingShortUrl(true);
			onSubmitCallback({
				id: data?.id,
				access_level: (sharedToType?.shared_to || sharedToType.emails)
					.length
					? "shared"
					: access_level,
				permission_level,
				...sharedToType,
			});
		},
		[data?.id, data?.type, shareType, role, sharedTo, data?.type],
	);

	const renderAccessLevel = () => {
		if (data?.restrictedTo) return null;

		return (
			<div className="mb-6">
				<AccessLevel
					shareType={shareType}
					setShareType={setShareType}
					handleChange={handleChange}
					data={data}
					disabled={isLoadingShortUrl}
				/>
			</div>
		);
	};
	const renderPermissionLevel = () => {
		if (data?.type === "Resource" || shareType === "private") return null;

		return (
			<div className="mb-6">
				<PermissionLevel
					handleChange={handleChange}
					role={role}
					setRole={setRole}
					data={data}
					disabled={isLoadingShortUrl}
				/>
			</div>
		);
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
				<ModalBody className="gap-1 rounded-2xl border border-default-200 p-0">
					<div className="px-6 pt-4 text-base font-semibold">
						Share {data?.type}
					</div>
					<div className="p-6">
						<p className="mb-4 line-clamp-2 text-sm text-default-600">
							Give your audience access to "{title}".
						</p>

						{renderAccessLevel()}
						{renderPermissionLevel()}

						{shareType === "private" && (
							<SharedEmails
								handleChange={handleChange}
								sharedTo={sharedTo}
								setSharedTo={setSharedTo}
								type={data?.type}
								disabled={isLoadingShortUrl}
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
									onPress={onCloseModal}
									radius="full"
								>
									Close
								</Button>
							</div>
						</div>
					</div>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
};

export default ShareModal;
