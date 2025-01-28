import {
	Button,
	Chip,
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
		case "name":
			return (
				<User avatarProps={{ radius: "lg", src: row.avatar }} name={cellValue}>
					{row.email}
				</User>
			);
		case "created_at":
			return <div>{formatDate(cellValue as string)}</div>;
		case "updated_at":
			return <div>{formatDate(cellValue as string)}</div>;
		case "actions":
			return (
				<div className="relative flex justify-end items-center gap-2">
					<Dropdown placement="bottom-end">
						<DropdownTrigger>
							<Button isIconOnly size="sm" variant="light">
								<EllipsisVertical className="text-default-300" />
							</Button>
						</DropdownTrigger>
						<DropdownMenu>
							<DropdownItem key="view">View</DropdownItem>
							<DropdownItem
								key="edit"
								onPress={() => onOpenModal("resourceForm", row, "update")}
							>
								Edit
							</DropdownItem>
							<DropdownItem key="delete">Delete</DropdownItem>
						</DropdownMenu>
					</Dropdown>
				</div>
			);
		default:
			return <div>{cellValue}</div>;
	}
};

export default Row;
