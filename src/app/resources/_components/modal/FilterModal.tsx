"use client";

import ControlledMultipleChipFilter from "@/components/custom/ControlledMultipleChipFilter";
import { useModal } from "@/store";
import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Button,
	useDisclosure,
} from "@heroui/react";
import { useEffect, useState } from "react";

const FilterFormModal = () => {
	const { isOpen, onOpen, onOpenChange } = useDisclosure();
	const [isSubmitting, setIsSubmitting] = useState(false);

	const { name: modalName, onClose, data: dataModal, type } = useModal();

	useEffect(() => {
		if (modalName === "Resource Filter") {
			onOpen();
		} else {
			onClose();
		}
	}, [modalName, onClose, onOpen]);

	const onCloseModal = () => {
		onOpenChange();
		onClose();
	};

	const onSubmit = (data: any) => {
		console.log(data);
	};

	return (
		<Modal
			isOpen={isOpen}
			placement="top-center"
			onOpenChange={onCloseModal}
			backdrop="blur"
			isDismissable={!isSubmitting}
		>
			<ModalContent>
				{() => (
					<form onSubmit={onSubmit}>
						<ModalHeader className="flex flex-col gap-1">
							<span>Filters</span>
						</ModalHeader>
						<ModalBody className="gap-4">
							<ControlledMultipleChipFilter />
						</ModalBody>
						<ModalFooter>
							<Button
								color="default"
								variant="light"
								onPress={onCloseModal}
								isDisabled={isSubmitting}
								radius="full"
							>
								Close
							</Button>
							<Button
								color="primary"
								className="bg-violet"
								type="submit"
								isLoading={isSubmitting}
								radius="full"
							>
								{isSubmitting ? "Filtering..." : "Filter"}
							</Button>
						</ModalFooter>
					</form>
				)}
			</ModalContent>
		</Modal>
	);
};
export default FilterFormModal;
