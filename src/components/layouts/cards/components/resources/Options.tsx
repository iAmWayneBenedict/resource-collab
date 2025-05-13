import { useDeleteResourceMutation } from "@/lib/mutations/resources";
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
import { EllipsisVertical, Pencil, PinOff, Trash2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import React from "react";

type Props = {
	data: any;
};

const Options = ({ data }: Props) => {
	const { onOpen } = useModal();
	const { setAlertDialogDetails } = useAlertDialog();
	const searchParams = useSearchParams();
	const item = searchParams.get("item");
	const queryClient = useQueryClient();

	const deleteMutation = useDeleteResourceMutation({
		onSuccess: () => {
			addToast({
				title: "Resource deleted successfully",
				description: "The resource has been deleted successfully",
				color: "success",
			});
			queryClient.invalidateQueries({
				queryKey: [`user-collection-resources-${item}-resources`],
			});
			queryClient.invalidateQueries({
				queryKey: ["user-resources-resources"],
			});
		},
		onError: (error: any) => {
			console.log(error);
			addToast({
				title: "Error deleting resource",
				description: error.response.data.message,
				color: "danger",
			});
		},
	});

	const onDelete = () => {
		setAlertDialogDetails({
			type: "danger",
			title: "Delete resource",
			message:
				"Are you sure you want to delete this resource permanently?",
			dialogType: "confirm",
			isOpen: true,
			onConfirm: () => {
				deleteMutation.mutate({
					ids: [data.id],
				});
			},
		});
	};
	return (
		<Dropdown
			placement="bottom-end"
			// onOpenChange={(state: boolean) =>
			// 	setEnableClickHandler(!state)
			// }
		>
			<DropdownTrigger>
				<Button isIconOnly variant="light" size="sm" radius="full">
					<EllipsisVertical size={18} />
				</Button>
			</DropdownTrigger>

			<DropdownMenu variant="flat">
				<DropdownSection title={"Action"}>
					<DropdownItem
						key="edit"
						description="Change collection name"
						startContent={<Pencil size={20} />}
						onPress={() => onOpen("resourcesForm", data, "edit")}
					>
						Edit
					</DropdownItem>
					<DropdownItem
						key="delete"
						color="danger"
						description="Delete permanently"
						startContent={<Trash2 size={20} />}
						onPress={onDelete}
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
	);
};

export default Options;
