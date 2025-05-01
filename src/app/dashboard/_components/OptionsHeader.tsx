import { useDashboardPage } from "@/store/useDashboardPage";
import { useRequestStatus } from "@/store/useRequestStatus";
import { useSelectedCollection } from "@/store/useSelectedCollection";
import { Button } from "@heroui/react";
import { MoveLeft, Plus, Settings2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { useMediaQuery } from "react-responsive";

type Props = {
	currentCollection?: Record<string, any> | null;
};
const OptionsHeader = ({ currentCollection }: Props) => {
	const router = useRouter();
	const isMobileScreen = useMediaQuery({ query: "(max-width: 40rem)" });
	const { requestStatus } = useRequestStatus();
	const getDashboardPage = useDashboardPage(
		(state) => state.getDashboardPage,
	);
	const isCollectionPage = getDashboardPage() === "collections";

	const permission = currentCollection?.shared_to[0]?.permission;

	const onClickReturnHandler = () => router.back();

	return (
		<div className="flex items-center justify-between">
			<Button
				variant="light"
				radius="full"
				onPress={onClickReturnHandler}
				startContent={<MoveLeft />}
			>
				{currentCollection?.name}
			</Button>
			<div className="flex gap-2">
				<Button
					variant="light"
					radius="full"
					isIconOnly={isMobileScreen}
					isDisabled={requestStatus !== "success"}
					startContent={<Settings2 size={18} />}
				>
					{!isMobileScreen ? "Options" : ""}
				</Button>
				{(permission === "edit" || isCollectionPage) && (
					<Button
						radius="full"
						className="bg-violet text-white"
						isDisabled={requestStatus !== "success"}
						startContent={<Plus size={18} />}
					>
						Add new
					</Button>
				)}
			</div>
		</div>
	);
};

export default OptionsHeader;
