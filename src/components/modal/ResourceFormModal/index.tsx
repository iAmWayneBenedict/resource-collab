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
import { toggleScrollBody } from "@/lib/utils";

const ResourceFormModal = () => {
	const {
		isOpen,
		onOpen,
		onOpenChange,
		onClose: onCloseModalView,
	} = useDisclosure();

	const { name: modalName, onClose, data: dataModal, type } = useModal();

	const [isSubmitting, setIsSubmitting] = useState(false);

	useEffect(() => {
		if (modalName === "resourcesForm") {
			toggleScrollBody(true);
			onOpen();
		}
	}, [modalName, onOpen]);

	const onCloseModal = () => {
		toggleScrollBody(false);
		onCloseModalView();
		onClose();
	};

	const handleSubmittingCallback = useCallback((state: boolean) => {
		setIsSubmitting(state);
	}, []);

	return (
		<Modal
			isOpen={isOpen}
			placement="center"
			onOpenChange={onCloseModal}
			backdrop="blur"
			scrollBehavior="outside"
			isDismissable={!isSubmitting}
		>
			<ModalContent>
				<ModalHeader className="flex flex-col gap-1">
					<span>Create Resource</span>
					<p className="text-xs font-normal lg:text-sm">
						Create new resources automatically using a URL or
						manually fill them out using a form.
					</p>
				</ModalHeader>
				<ModalBody className="gap-4">
					<Tabs
						defaultValue={type === "create" ? "url" : "form"}
						className="w-full"
					>
						<TabsList className="grid w-full grid-cols-2">
							<TabsTrigger
								disabled={isSubmitting || type === "update"}
								value="url"
							>
								URL
							</TabsTrigger>
							<TabsTrigger
								disabled={isSubmitting || type === "update"}
								value="form"
							>
								Form
							</TabsTrigger>
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
