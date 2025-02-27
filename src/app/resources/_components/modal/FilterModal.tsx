"use client";

import ControlledMultipleChipFilter from "@/components/custom/ControlledMultipleChipFilter";
import CustomComboBox from "@/components/custom/CustomComboBox";
import { useGetPaginatedResourcesQuery } from "@/lib/queries/resources";
import { reInitQueryParams, toggleScrollBody } from "@/lib/utils";
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
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { useGetCategoriesQuery } from "../../../../lib/queries/categories";

const SORT_LIST = ["Newest", "Oldest", "Alphabetical", "Reverse Alphabetical"];
const FilterFormSchema = z.object({
	sortBy: z.string().nullish(),
	tags: z.array(z.string()).nullish(),
});

const FilterFormModal = () => {
	const { isOpen, onOpen, onOpenChange } = useDisclosure();
	const [isSubmitting, setIsSubmitting] = useState(false);

	const searchParams = useSearchParams();
	// make sure it exist
	const tagsSearchParams = searchParams
		.get("tags")
		?.split(",")
		?.filter((tag) => tag);
	const sortBySearchParams = searchParams.get("sortBy");

	const router = useRouter();

	const category = searchParams.get("category") ?? "";

	const { handleSubmit, control, reset } = useForm({
		resolver: zodResolver(FilterFormSchema),
		defaultValues: useMemo(
			() => ({
				sortBy: sortBySearchParams ?? "",
				tags: tagsSearchParams ?? [],
			}),
			[sortBySearchParams, tagsSearchParams],
		),
	});

	useEffect(() => {
		if (!sortBySearchParams && !tagsSearchParams)
			reset({
				sortBy: "",
				tags: [],
			});
	}, [sortBySearchParams, tagsSearchParams]);

	const { name: modalName, onClose, data: dataModal, type } = useModal();

	const categoriesResponse = useGetCategoriesQuery();

	const tags = useMemo(() => {
		if (!categoriesResponse.isSuccess) return [];

		const rows = categoriesResponse.data.data.rows;

		if (!category || isNaN(Number(category)))
			return rows
				.map((row: any) => row.tags.map((tag: any) => tag.name))
				.flat();

		const categoryTags = rows
			.find((row: any) => row.id === Number(category))
			?.tags.map((tag: any) => tag.name);

		return categoryTags;
	}, [category, categoriesResponse.isSuccess]);

	useEffect(() => {
		if (modalName === "Resource Filter") {
			toggleScrollBody(true);
			onOpen();
		} else {
			onClose();
		}
	}, [modalName, onClose, onOpen]);

	const onCloseModal = () => {
		toggleScrollBody(false);
		onOpenChange();
		onClose();
	};

	const onSubmit = (data: any) => {
		router.push(reInitQueryParams(window.location.href, data), {
			scroll: false,
		});
		onCloseModal();
	};

	const onReset = () => {
		router.push(window.location.pathname, { scroll: false });
		onCloseModal();
	};

	return (
		<Modal
			isOpen={isOpen}
			placement="center"
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
										selectedKeys={[
											(field.value as string) ?? "",
										]}
										onChange={field.onChange}
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
								name="tags"
								control={control}
								render={({ field }) => (
									<CustomComboBox
										triggerText="Select Tags"
										value={field.value as string[]}
										onSelect={field.onChange}
										options={tags}
										selectionMode="multiple"
										placement="top-start"
										disableParentScrollOnOpen={false}
									/>
								)}
							/>
						</ModalBody>
						<ModalFooter>
							<Button
								color="default"
								variant="light"
								onPress={onReset}
								isDisabled={isSubmitting}
								radius="full"
							>
								Reset
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
