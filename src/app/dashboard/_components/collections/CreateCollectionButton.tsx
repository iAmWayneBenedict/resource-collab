import { useModal } from "@/store";
import { Button } from "@heroui/react";
import { Plus } from "lucide-react";
import React from "react";
import { useMediaQuery } from "react-responsive";

const CreateCollectionButton = () => {
	const onOpen = useModal((state) => state.onOpen);
	const isSmallDevices = useMediaQuery({ query: "(max-width: 40rem)" });

	const handleCreateCollection = () => {
		onOpen("create-collection", null);
	};

	return (
		<Button
			radius="full"
			className="bg-violet text-white"
			startContent={<Plus size={18} />}
			onPress={handleCreateCollection}
			isIconOnly={isSmallDevices}
		>
			{isSmallDevices ? "" : "Create collection"}
		</Button>
	);
};

export default CreateCollectionButton;
