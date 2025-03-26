import { useMobileScreen } from "@/hooks/useMediaQueries";
import { useRequestStatus } from "@/store/useRequestStatus";
import { Button } from "@heroui/react";
import { MoveLeft, Plus, Settings2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

const OptionsHeader = () => {
	const router = useRouter();
	const isMobileScreen = useMobileScreen();
	const { requestStatus } = useRequestStatus();

	const onClickReturnHandler = () => router.back();

	return (
		<div className="flex items-center justify-between">
			<Button
				variant="light"
				radius="full"
				onPress={onClickReturnHandler}
				startContent={<MoveLeft />}
			>
				Return
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
				<Button
					radius="full"
					className="bg-violet text-white"
					isDisabled={requestStatus !== "success"}
					startContent={<Plus size={18} />}
				>
					Add new
				</Button>
			</div>
		</div>
	);
};

export default OptionsHeader;
