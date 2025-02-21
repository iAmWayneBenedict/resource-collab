"use client";

import { useModal } from "@/store";
import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	useDisclosure,
} from "@heroui/react";
import { useCallback, useEffect, useState } from "react";
import URLForm from "./URLForm";
import CompleteForm from "./CompleteForm";
import { TabsContent, Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ResourceFormModal = () => {
	const { isOpen, onOpen, onOpenChange } = useDisclosure();

	const { name: modalName, onClose, data: dataModal, type } = useModal();

	const [isSubmitting, setIsSubmitting] = useState(false);

	useEffect(() => {
		if (modalName === "resourcesForm") onOpen();
	}, [modalName, onOpen]);

	const onCloseModal = () => {
		onOpenChange();
		onClose();
	};

	const handleSubmittingCallback = useCallback((state: boolean) => {
		setIsSubmitting(state);
	}, []);

	return (
		<Modal
			isOpen={isOpen}
			placement="top-center"
			onOpenChange={onCloseModal}
			backdrop="blur"
			isDismissable={!isSubmitting}
		>
			<ModalContent>
				<ModalHeader className="flex flex-col gap-1">
					<span>Create Resource</span>
				</ModalHeader>
				<ModalBody className="gap-4">
					<Tabs defaultValue="url" className="w-full">
						<TabsList className="grid w-full grid-cols-2">
							<TabsTrigger value="url">URL</TabsTrigger>
							<TabsTrigger value="form">Form</TabsTrigger>
						</TabsList>
						<TabsContent value="url">
							<URLForm
								data={dataModal}
								onCloseModal={onCloseModal}
								onSubmittingCallback={handleSubmittingCallback}
							/>
						</TabsContent>
						<TabsContent value="form">
							<CompleteForm
								data={dataModal}
								onCloseModal={onCloseModal}
								onSubmittingCallback={handleSubmittingCallback}
							/>
						</TabsContent>
					</Tabs>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
};
export default ResourceFormModal;
