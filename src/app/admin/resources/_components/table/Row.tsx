import {
	Button,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
	User,
} from "@heroui/react";
import { EllipsisVertical } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { useModal } from "@/store";
type Props = {
	row: any;
	columnKey: string;
};

const Row = ({ row, columnKey }: Props) => {
	const { onOpen: onOpenModal } = useModal();

	const cellValue = row[columnKey];

	switch (columnKey) {
		case "created_at":
			return <div>{formatDate(cellValue as string)}</div>;
		case "updated_at":
			return <div>{formatDate(cellValue as string)}</div>;
		case "actions":
			return (
				<div className="relative flex items-center justify-end gap-2">
					<Dropdown placement="bottom-end">
						<DropdownTrigger>
							<Button isIconOnly size="sm" variant="light">
								<EllipsisVertical className="text-default-300" />
							</Button>
						</DropdownTrigger>
						<DropdownMenu>
							<DropdownItem key="view">View</DropdownItem>
							<DropdownItem
								key="update"
								onPress={() =>
									onOpenModal("resourcesForm", row, "update")
								}
							>
								Update
							</DropdownItem>
							<DropdownItem key="delete">Delete</DropdownItem>
						</DropdownMenu>
					</Dropdown>
				</div>
			);
		default:
			return (
				<div className="block w-full max-w-[15rem] overflow-hidden text-ellipsis whitespace-nowrap break-words">
					{cellValue}
				</div>
			);
	}
};

export default Row;
