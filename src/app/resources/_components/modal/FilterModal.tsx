"use client";

import ControlledMultipleChipFilter from "@/components/custom/ControlledMultipleChipFilter";
import CustomComboBox from "@/components/custom/CustomComboBox";
import { reInitQueryParams } from "@/lib/utils";
import { useModal } from "@/store";
import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Button,
	useDisclosure,
	Select,
	SelectItem,
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

const SORT_LIST = ["Newest", "Oldest", "Alphabetical", "Reverse Alphabetical"];
const FilterFormSchema = z.object({
	sortBy: z.string().nullish(),
	filter: z.array(z.string()).nullish(),
});

const FilterFormModal = () => {
	const { isOpen, onOpen, onOpenChange } = useDisclosure();
	const [isSubmitting, setIsSubmitting] = useState(false);

	const searchParams = useSearchParams();
	const router = useRouter();

	const {
		handleSubmit,
		control,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(FilterFormSchema),
		defaultValues: {
			sortBy: searchParams.get("sortBy") ?? "",
			filter: searchParams.get("filter")?.split(",") ?? [],
		},
	});
	console.log(errors);
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
		// router.push(reInitQueryParams(window.location.href, { filter: formData }), {
		// 	scroll: false,
		// });
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
					<form onSubmit={handleSubmit(onSubmit)}>
						<ModalHeader className="flex flex-col gap-1">
							<span>Filters</span>
						</ModalHeader>
						<ModalBody className="gap-4">
							<Controller
								name="sortBy"
								control={control}
								render={({ field }) => (
									<Select
										selectedKeys={
											(field.value as string) ?? ""
										}
										onSelectionChange={field.onChange}
										label="Sort"
										placeholder="Select sort"
									>
										{SORT_LIST.map((sortBy) => (
											<SelectItem key={sortBy}>
												{sortBy}
											</SelectItem>
										))}
									</Select>
								)}
							/>
							<Controller
								name="filter"
								control={control}
								render={({ field }) => (
									<CustomComboBox
										triggerText="Select Tags"
										value={field.value as string[]}
										onSelect={field.onChange}
										options={["test", "test2", "asdf"]}
										selectionMode="multiple"
										placement="top-start"
									/>
								)}
							/>
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
								{isSubmitting ? "Please wait" : "Apply"}
							</Button>
						</ModalFooter>
					</form>
				)}
			</ModalContent>
		</Modal>
	);
};
export default FilterFormModal;
