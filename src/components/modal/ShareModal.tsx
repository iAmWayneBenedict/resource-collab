import { useModal } from "@/store";
import { Modal, ModalBody, ModalContent, ModalHeader } from "@heroui/react";
import { Copy } from "lucide-react";
import { useEffect, useState } from "react";

const ShareModal = () => {
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const { name, data, title, onClose } = useModal();

	useEffect(() => {
		if (name === "share-resource") {
			setIsOpen(true);
		}
	}, [name]);

	const onCloseModal = (state: boolean) => {
		setIsOpen(state);
		onClose();
	};

	return (
		<Modal
			isOpen={isOpen}
			placement="center"
			onOpenChange={onCloseModal}
			backdrop="blur"
			size="xl"
			hideCloseButton
		>
			<ModalContent>
				{() => (
					<>
						<ModalBody className="gap-1 rounded-2xl border border-default-200 p-0">
							<span>{data?.url}</span>
							asdasd
						</ModalBody>
					</>
				)}
			</ModalContent>
		</Modal>
	);
};
export default ShareModal;
