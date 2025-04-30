import {
	useDeleteCollectionFoldersMutation,
	useDeletePinCollectionMutation,
	usePostPinCollectionMutation,
} from "@/lib/mutations/collections";
import { useAlertDialog, useModal } from "@/store";
import {
	addToast,
	Avatar,
	Button,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownSection,
	DropdownTrigger,
} from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";
import {
	EllipsisVertical,
	Pencil,
	Pin,
	PinOff,
	Share2,
	Trash2,
} from "lucide-react";
import React, { Fragment, useEffect, useState } from "react";
import config from "@/config";
import { useGetCollectionShortUrl } from "@/lib/queries/short-urls";
import { usePostCollectionsShortUrlMutation } from "@/lib/mutations/short_urls";
import { usePathname } from "next/navigation";
import { useSelectedCollection } from "@/store/useSelectedCollection";

const CollectionHeader = ({
	data,
	setEnableClickHandler,
}: {
	data: any;
	setEnableClickHandler: (d: any) => void;
}) => {
	const onOpenModal = useModal((state) => state.onOpen);
	const getSelectedCollection = useSelectedCollection(
		(state) => state.getSelectedCollection,
	);
	const setAlertDialogDetails = useAlertDialog(
		(state) => state.setAlertDialogDetails,
	);
	const queryClient = useQueryClient();

	// START -- pin
	const pinOptions = (message: string) => ({
		params: data?.id,
		onSuccess: (data: any) => {
			addToast({
				color: "success",
				title: "Success",
				description: message,
			});
			queryClient.invalidateQueries({ queryKey: ["user-collections"] });
		},
		onError: (error: any) => {
			console.log(error);
			addToast({
				color: "danger",
				title: "Error",
				description: error.message,
			});
		},
	});
	const addPinMutation = usePostPinCollectionMutation(
		pinOptions("Collection pinned successfully!"),
	);

	const removePinMutation = useDeletePinCollectionMutation(
		pinOptions("Collection unpinned successfully!"),
	);

	const togglePin = () => {
		if (data.pinned) removePinMutation.mutate({});
		else addPinMutation.mutate({});
	};

	// END -- pin

	// START -- delete collections
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
			onConfirm: () => deleteMutation.mutate({ ids: [data.id] }),
		});
	};

	// END -- delete collection

	// START - share
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
		onSuccess: async (data) => {
			const formattedData = {
				...data.data,
				url: data.data.short_url,
				restrictedTo,
				type: "Collection",
				loaded: true,
			};

			setShareData(formattedData);
			setEnableInitShortUrl(false);
			await queryClient.invalidateQueries({
				queryKey: ["collection-short-url"],
			});
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

	const onSubmitShare = (data: any) => resourceShortUrlMutation.mutate(data);

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
			// setEnableInitShortUrl(false);
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
		shortUrlResponse.isFetching,
	]);

	// END -- share

	return (
		<div className="absolute left-0 top-0 z-[2] flex w-full">
			<div className="flex flex-1 items-center justify-between gap-2 px-3 pt-2">
				<div>
					{data.pinned && <Pin size={16} className="text-white" />}
					{data.sharedBy && (
						<div className="flex items-center gap-2">
							<Avatar
								name={data.sharedBy.email}
								src={data.sharedBy.image}
								className="h-5 w-5"
								size="sm"
							/>
							<p className="text-xs text-zinc-200">
								{data.sharedBy.email}
							</p>
						</div>
					)}
				</div>
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
								key="pin"
								description="Pin on extension and mobile"
								startContent={
									data.pinned ? (
										<PinOff size={20} />
									) : (
										<Pin size={20} />
									)
								}
								onPress={togglePin}
							>
								{data.pinned ? "Unpin" : "Pin"}
							</DropdownItem>
							{!getSelectedCollection() ? (
								<Fragment>
									<DropdownItem
										key="edit"
										description="Change collection name"
										startContent={<Pencil size={20} />}
										onPress={() =>
											onOpenModal(
												"create-collection",
												{
													name: data.name,
													id: data.id,
												},
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
										description="Delete permanently"
										onPress={onDeleteHandler}
										startContent={<Trash2 size={20} />}
										classNames={{
											base: "text-danger",
											description: "text-danger",
										}}
									>
										Delete
									</DropdownItem>
								</Fragment>
							) : null}
						</DropdownSection>
					</DropdownMenu>
				</Dropdown>
			</div>
		</div>
	);
};

export default CollectionHeader;
