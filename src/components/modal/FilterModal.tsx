"use client";

import CustomComboBox from "@/components/custom/CustomComboBox";
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
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Fragment, useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { useMediaQuery } from "react-responsive";
import { useGetCategoriesQuery } from "@/lib/queries/categories";

const SORT_LIST = ["Newest", "Oldest", "Alphabetical", "Reverse Alphabetical"];
const FilterFormSchema = z.object({
	category: z.union([z.string(), z.number()]).nullish(),
	sortBy: z.string().nullish(),
	tags: z.array(z.string()).nullish(),
});

const FilterFormModal = () => {
	const { isOpen, onOpen, onOpenChange } = useDisclosure();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const pathname = usePathname();
	const isSmallDevices = useMediaQuery({
		query: "(max-width: 64rem)",
	});

	const router = useRouter();
	const searchParams = useSearchParams();

	const tagsSearchParams = searchParams
		.get("tags")
		?.split(",")
		?.filter((tag) => tag);
	const sortBySearchParams = searchParams.get("sortBy");
	const tab = searchParams.get("tab");
	const page = searchParams.get("page");
	const id = searchParams.get("item");
	const category = searchParams.get("category") ?? "";

	const isResources =
		page === "resources" ||
		page === "liked" ||
		id ||
		pathname.includes("/resources");

	const { name: modalName, onClose, data: dataModal, type } = useModal();

	const categoriesResponse = useGetCategoriesQuery();

	const { handleSubmit, control, reset } = useForm({
		resolver: zodResolver(FilterFormSchema),
		defaultValues: useMemo(
			() => ({
				category: category ?? "",
				sortBy: sortBySearchParams ?? "",
				tags: tagsSearchParams ?? [],
			}),
			[sortBySearchParams, tagsSearchParams],
		),
	});

	useEffect(() => {
		if (!sortBySearchParams && !tagsSearchParams)
			reset({
				category: "",
				sortBy: "",
				tags: [],
			});
	}, [sortBySearchParams, tagsSearchParams]);

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
		}
	}, [modalName, onOpen]);

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
		let location = window.location.pathname;
		if (category && !isSmallDevices) location += `?category=${category}`;
		if (location.includes("/dashboard")) {
			location += `?tab=${tab}&page=${page}`;

			if (id) location += `&item=${id}`;
		}

		router.push(location, { scroll: false });
		onCloseModal();
	};

	const categoryOptions = categoriesResponse.data?.data.rows.filter(
		(category: any) => category.name,
	);

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
					<form
						onSubmit={handleSubmit(onSubmit)}
						className="rounded-2xl border border-default-200 p-0"
					>
						<ModalHeader className="flex flex-col gap-1">
							<span>Filters</span>
						</ModalHeader>
						<ModalBody className="gap-4">
							<Fragment>
								{isSmallDevices &&
									pathname === "/resources" && (
										<Controller
											name="category"
											control={control}
											render={({ field }) => (
												<Select
													selectedKeys={[
														field.value ?? "",
													]}
													onChange={field.onChange}
													label="Category"
													placeholder="Select category"
												>
													{categoryOptions.map(
														(category: any) => (
															<SelectItem
																key={
																	category.id
																}
																textValue={
																	"category" +
																	category.id
																}
															>
																{category.name}
															</SelectItem>
														),
													)}
												</Select>
											)}
										/>
									)}
							</Fragment>

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
							{isResources && (
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
							)}
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
								className="bg-violet text-white"
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
