import { useDeleteCollectionFoldersMutation } from "@/lib/mutations/collections";
import { useAlertDialog, useModal } from "@/store";
import {
	addToast,
	Button,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownSection,
	DropdownTrigger,
} from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";
import { EllipsisVertical, Pencil, Share2, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import config from "@/config";
import { useGetCollectionShortUrl } from "@/lib/queries/short-urls";
import { usePostCollectionsShortUrlMutation } from "@/lib/mutations/short_urls";
import { usePathname } from "next/navigation";

const CollectionHeader = ({
	data,
	setEnableClickHandler,
}: {
	data: any;
	setEnableClickHandler: (d: any) => void;
}) => {
	const onOpenModal = useModal((state) => state.onOpen);
	const setAlertDialogDetails = useAlertDialog(
		(state) => state.setAlertDialogDetails,
	);
	const queryClient = useQueryClient();
	const deleteMutation = useDeleteCollectionFoldersMutation({
		onSuccess: (data) => {
			addToast({
				color: "success",
				title: "Success",
				description: "Collection deleted successfully",
			});
			queryClient.invalidateQueries({ queryKey: ["user-collections"] });
		},
		onError: (error) => {
			console.log(error);
			addToast({
				color: "danger",
				title: "Error",
				description: error.message,
			});
		},
	});

	const onDeleteHandler = () => {
		setAlertDialogDetails({
			isOpen: true,
			title: "Delete Collection",
			type: "danger",
			message:
				"Are you sure you want to delete this collection? This will delete all the resources inside this collection",
			dialogType: "confirm",
			onConfirm: () =>
				deleteMutation.mutate({
					ids: [data.id],
				}),
		});
	};

	// share
	const pathname = usePathname();
	const setSubmitCallback = useModal((state) => state.setSubmitCallback);
	const [shareData, setShareData] = useState<Record<string, any> | null>(
		null,
	);
	const [enabledInitShortUrl, setEnableInitShortUrl] =
		useState<boolean>(false);

	const restrictedTo = pathname === "/resources" ? "public" : null;

	const resourceShortUrlMutation = usePostCollectionsShortUrlMutation({
		params: data.id,
		onSuccess: (data) => {
			const formattedData = {
				...data.data,
				url: data.data.short_url,
				restrictedTo,
				type: "Collection",
				loaded: true,
			};

			setShareData(formattedData);
			setEnableInitShortUrl(false);
			onOpenModal(
				"share-modal",
				formattedData,
				undefined,
				data.data.name,
			);
		},
		onError: () => {
			setEnableInitShortUrl(false);
		},
	});

	const onSubmitShare = (data: any) => {
		const req = {
			...data,
		};
		resourceShortUrlMutation.mutate(req);
	};

	const onClickShareHandler = () => {
		const data = shareData ?? {
			url: null,
			restrictedTo,
			type: "Collection",
		};
		onOpenModal(
			"share-modal",
			{ ...data, loaded: false },
			undefined,
			data.name,
		);
		setEnableInitShortUrl(true);
		setSubmitCallback(onSubmitShare);
	};

	const shortUrlResponse = useGetCollectionShortUrl({
		enabled: enabledInitShortUrl,
		collectionId: data.id,
	});

	useEffect(() => {
		if (shortUrlResponse.isSuccess) {
			const shortUrlData = shortUrlResponse.data.data;
			const formattedData = {
				...shortUrlData.collection_short_urls,
				...shortUrlData.collection_folders,
				type: "Collection",
				url: `${config.BASE_URL}/c/${shortUrlData.collection_short_urls.short_code}`,
				loaded: true,
			};

			onOpenModal("share-modal", formattedData, undefined, data.name);
			setEnableInitShortUrl(false);
		}
		if (shortUrlResponse.isError) {
			onOpenModal(
				"share-modal",
				{
					url: null,
					restrictedTo,
					type: "Collection",
					loaded: true,
				},
				undefined,
				data.name,
			);
			setEnableInitShortUrl(false);
		}
	}, [
		shortUrlResponse.data,
		shortUrlResponse.isSuccess,
		shortUrlResponse.isError,
	]);

	return (
		<div className="absolute left-0 top-0 z-[2] flex w-full">
			<div className="flex flex-1 items-center justify-end gap-2 px-3 pt-2">
				<Dropdown
					placement="bottom-end"
					onOpenChange={(state: boolean) =>
						setEnableClickHandler(!state)
					}
				>
					<DropdownTrigger>
						<Button
							isIconOnly
							variant="light"
							size="sm"
							radius="full"
							className="text-default-200 dark:text-default-700"
						>
							<EllipsisVertical size={18} />
						</Button>
					</DropdownTrigger>

					<DropdownMenu variant="flat">
						<DropdownSection title={"Action"}>
							<DropdownItem
								key="edit"
								description="Edit collection"
								startContent={<Pencil size={20} />}
								onPress={() =>
									onOpenModal(
										"create-collection",
										{ name: data.name, id: data.id },
										"edit",
									)
								}
							>
								Edit
							</DropdownItem>
							<DropdownItem
								key="share"
								description="Share collection"
								showDivider
								startContent={<Share2 size={20} />}
								onPress={onClickShareHandler}
							>
								Share
							</DropdownItem>
							<DropdownItem
								key="delete"
								color="danger"
								description="Delete collection"
								onPress={onDeleteHandler}
								startContent={<Trash2 size={20} />}
								classNames={{
									base: "text-danger",
									description: "text-danger",
								}}
							>
								Delete
							</DropdownItem>
						</DropdownSection>
					</DropdownMenu>
				</Dropdown>
			</div>
		</div>
	);
};

export default CollectionHeader;
