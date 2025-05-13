import {
	FilterModalTrigger,
	SearchModalTrigger,
} from "@/app/resources/_components/filter";
import { useModal } from "@/store";
import { useDashboardPage } from "@/store/useDashboardPage";
import { Button } from "@heroui/react";
import { MoveLeft, Plus } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React from "react";

type Props = {
	currentCollection?: Record<string, any> | null;
};
const OptionsHeader = ({ currentCollection }: Props) => {
	const getDashboardPage = useDashboardPage(
		(state) => state.getDashboardPage,
	);
	const { onOpen: onOpenModal } = useModal();
	const searchParams = useSearchParams();
	const isCollectionPage = getDashboardPage() === "collections";
	const page = getDashboardPage();
	const tab = searchParams.get("tab");

	const permission = currentCollection?.shared_to[0]?.permission;

	return (
		<div className="flex items-center justify-between">
			<Button
				href={`/dashboard?page=${page}&tab=${tab}`}
				variant="light"
				radius="full"
				as={Link}
				startContent={<MoveLeft />}
			>
				{currentCollection?.name}
			</Button>
			<div className="flex gap-2">
				<SearchModalTrigger hideAiSearch={true} iconOnly={true} />
				<FilterModalTrigger iconOnly={true} />
				{(permission === "edit" || isCollectionPage) && (
					<Button
						className="bg-violet text-white"
						radius="full"
						startContent={<Plus />}
						onPress={() =>
							onOpenModal("resourcesForm", { type: "url" })
						}
					>
						Add Resource
					</Button>
				)}
			</div>
		</div>
	);
};

export default OptionsHeader;
