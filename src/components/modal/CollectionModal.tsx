"use client";

import {
	addToast,
	Button,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	useDisclosure,
} from "@heroui/react";
import React, { Fragment, useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useModal } from "@/store";
import {
	usePostCreateCollectionsMutation,
	usePutCollectionFoldersMutation,
} from "@/lib/mutations/collections";
import { bindReactHookFormError } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";

const FormSchema = z.object({
	name: z.string().min(1, {
		message: "Name is required",
	}),
});

const CollectionModal = () => {
	const [isLoading, setIsLoading] = useState(false);
	const { isOpen, onOpen, onClose } = useDisclosure();
	const { name, data, type, onClose: onCloseToggle } = useModal();
	const queryClient = useQueryClient();
	const { handleSubmit, control, clearErrors, reset, setError } = useForm({
		resolver: zodResolver(FormSchema),
		defaultValues: useMemo(
			() => ({
				name: data?.name ?? "",
			}),
			[data],
		),
	});

	useEffect(() => {
		if (name === "create-collection") {
			clearErrors(["name"]);
			onOpen();
			if (type === "edit") {
				reset({ name: data?.name ?? "" });
			}
		}
	}, [name]);

	const onCloseModal = (forceClose = false) => {
		if (isLoading && !forceClose) return;
		onClose();
		onCloseToggle();
	};

	const onSuccess = (data: any) => {
		onCloseModal(true);
		addToast({
			title: "Success",
			description: `Collection ${type === "create" ? "created" : "updated"} successfully.`,
			color: "success",
		});
		setIsLoading(false);
		queryClient.invalidateQueries({
			queryKey: ["user-collections"],
		});
	};

	const onError = (error: any) => {
		setIsLoading(false);
		bindReactHookFormError(error.response.data, setError);
		console.log(error);
	};

	const createMutation = usePostCreateCollectionsMutation({
		onSuccess,
		onError,
	});
	const updateMutation = usePutCollectionFoldersMutation({
		params: data?.id,
		onSuccess,
		onError,
	});

	const onSubmit = (data: { name: string }) => {
		setIsLoading(true);
		if (type === "create") createMutation.mutate(data);
		else updateMutation.mutate(data);
	};

	return (
		<Fragment>
			<Modal
				isOpen={isOpen}
				onOpenChange={onCloseModal}
				isDismissable={!isLoading}
				backdrop="blur"
			>
				<ModalContent>
					{(onClose) => (
						<form onSubmit={handleSubmit(onSubmit)}>
							<ModalHeader>
								<h2>Add new collection</h2>
							</ModalHeader>
							<ModalBody>
								<Controller
									name="name"
									control={control}
									render={({
										field,
										fieldState: { error },
									}) => (
										<Input
											value={field.value}
											onChange={field.onChange}
											errorMessage={error?.message}
											isInvalid={!!error?.message}
											label="Name"
											placeholder="Enter a name"
										/>
									)}
								/>
							</ModalBody>
							<ModalFooter className="flex w-full justify-end gap-2">
								<Button
									variant="light"
									onPress={onClose}
									radius="full"
									isDisabled={isLoading}
								>
									Cancel
								</Button>
								<Button
									className="bg-violet text-white"
									type={"submit"}
									radius="full"
									isLoading={isLoading}
									isDisabled={isLoading}
								>
									Add
								</Button>
							</ModalFooter>
						</form>
					)}
				</ModalContent>
			</Modal>
		</Fragment>
	);
};

export default CollectionModal;
