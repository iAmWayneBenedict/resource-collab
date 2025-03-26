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
import React from "react";

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
