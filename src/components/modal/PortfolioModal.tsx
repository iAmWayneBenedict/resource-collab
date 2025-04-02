import { useModal } from "@/store";
import {
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	useDisclosure,
} from "@heroui/react";
import React, { useEffect } from "react";

const PortfolioModal = () => {
	const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
	const { name, type, data, title, onClose: onCloseModal } = useModal();

	useEffect(() => {
		if (name == "portfolio-modal") onOpen();
	}, [name]);

	const handleClose = () => {
		onClose();
		onCloseModal();
	};

	return (
		<Modal backdrop="blur" isOpen={isOpen} onOpenChange={handleClose}>
			<ModalContent className="rounded-2xl border border-default-200 p-0">
				<ModalHeader className="flex flex-col gap-1">
					{title}
				</ModalHeader>
				<ModalBody>
					<p>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit.
						Nullam pulvinar risus non risus hendrerit venenatis.
						Pellentesque sit amet hendrerit risus, sed porttitor
						quam.
					</p>
					<p>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit.
						Nullam pulvinar risus non risus hendrerit venenatis.
						Pellentesque sit amet hendrerit risus, sed porttitor
						quam.
					</p>
					<p>
						Magna exercitation reprehenderit magna aute tempor
						cupidatat consequat elit dolor adipisicing. Mollit dolor
						eiusmod sunt ex incididunt cillum quis. Velit duis sit
						officia eiusmod Lorem aliqua enim laboris do dolor
						eiusmod. Et mollit incididunt nisi consectetur esse
						laborum eiusmod pariatur proident Lorem eiusmod et.
						Culpa deserunt nostrud ad veniam.
					</p>
				</ModalBody>
				<ModalFooter>
					<Button variant="light" radius="full" onPress={handleClose}>
						Close
					</Button>
					<Button
						color="primary"
						radius="full"
						className="bg-violet text-white"
						onPress={handleClose}
					>
						Action
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default PortfolioModal;
