import CustomComboBox from "@/components/custom/CustomComboBox";
import {
	usePostResourceMutation,
	usePutResourceMutation,
} from "@/lib/mutations/resources";
import {
	Autocomplete,
	AutocompleteItem,
	Button,
	Input,
	Textarea,
	addToast,
	Alert,
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { usePostDeleteUploadThingFileMutation } from "../../../../../lib/mutations/storage/uploadthing";
import { bindReactHookFormError } from "@/lib/utils";
import { UploadImageResource } from "./UploadImage";
import { useGetCategoriesQuery } from "@/lib/queries/categories";

const formSchema = z.object({
	url: z.string().url("Invalid URL"),
	name: z.string().min(3, "Name must be at least 3 characters"),
	category: z.union([z.string(), z.number()], {
		required_error: "Category is required",
	}),
	tags: z.array(z.string().nullish()),
	icon: z.union([z.literal(""), z.string().url()]),
	thumbnail: z.union([z.literal(""), z.string().url()]),
	description: z.string().nullish(),
	alert: z.string().nullish(),
});
const DEFAULT_VALUES = {
	url: "",
	name: "",
	category: "",
	tags: [],
	icon: "",
	thumbnail: "",
	description: "",
	alert: "",
};

type CompleteFormProps = {
	data: any;
	onCloseModal: () => void;
	onSubmittingCallback: (state: boolean) => void;
};

const CompleteForm = ({
	data,
	onCloseModal,
	onSubmittingCallback,
}: CompleteFormProps) => {
	const {
		control,
		handleSubmit,
		setError,
		reset,
		setValue,
		watch,
		clearErrors,
		getValues,
		formState: { errors },
	} = useForm({
		defaultValues: DEFAULT_VALUES,
		resolver: zodResolver(formSchema),
	});

	const [fileIds, setFileIds] = useState({
		icon: "", // uploaded file id
		thumbnail: "", // uploaded file id
	});
	const [isDisableForm, setIsDisableForm] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [showUploadButtons, setShowUploadButtons] = useState({
		icon: false,
		thumbnail: false,
	});

	const categoriesWithTagsResponse = useGetCategoriesQuery();

	const categoriesWithTags = useMemo(() => {
		if (categoriesWithTagsResponse.data) {
			return categoriesWithTagsResponse.data?.data?.rows?.map(
				(category: any) => {
					return {
						id: category.id,
						name: category.name,
						tags: category.tags,
					};
				},
			);
		}

		if (data?.category_id)
			return [{ id: data?.category_id, name: data?.category }];

		return [{ id: "", name: "" }];
	}, [categoriesWithTagsResponse.data]);

	useEffect(() => {
		if (data?.category_id && categoriesWithTagsResponse.data) {
			reset({
				...data,
				category: data.category_id + "",
				tags: data.resourceTags,
			});
		} else {
			reset(DEFAULT_VALUES);
		}
	}, [data, categoriesWithTagsResponse.data]);

	useEffect(() => {
		if (!watch("category")) setValue("tags", []);
	}, [watch("category")]);

	const tagsList = useMemo(
		() =>
			categoriesWithTags
				.find(
					(category: any) =>
						category.id === Number(getValues("category")),
				)
				?.tags.map((tag: any) => tag.name) ?? [],
		[watch("category"), categoriesWithTagsResponse.data],
	);

	const deleteUploadedImagesMutation = usePostDeleteUploadThingFileMutation();

	useEffect(() => {
		return () => {
			const hasImage = watch("icon") || watch("thumbnail");
			if (hasImage && Object.values(fileIds).length)
				deleteUploadedImagesMutation.mutate(
					Object.values(fileIds).filter((v) => v),
				);
		};
	}, []);

	const createResourceMutation = usePostResourceMutation({
		onSuccess: (data) => {
			onSubmittingCallback(false);
			setIsDisableForm(false);
			setIsSubmitting(false);

			addToast({
				title: "Success",
				description: "Resource created successfully.",
				color: "success",
			});
		},
		onError: (error) => {
			console.log(error);
			onSubmittingCallback(false);
			setIsDisableForm(false);
			setIsSubmitting(false);
			bindReactHookFormError(error.response.data, setError);
		},
	});

	const updateResourceMutation = usePutResourceMutation({
		params: data?.id ?? "",
		onSuccess: (data) => {
			onSubmittingCallback(false);
			setIsDisableForm(false);
			setIsSubmitting(false);

			addToast({
				title: "Success",
				description: "Resource updated successfully.",
				color: "success",
			});
		},
		onError: (error) => {
			console.log(error.response.data);
			onSubmittingCallback(false);
			setIsDisableForm(false);
			setIsSubmitting(false);
			bindReactHookFormError(error.response.data, setError);
		},
	});

	const onSubmit = (payload: any) => {
		console.log(payload);
		onSubmittingCallback(true);
		setIsDisableForm(true);
		setIsSubmitting(true);

		if (data?.category_id) {
			payload["id"] = data?.id;
			updateResourceMutation.mutate(payload);
			return;
		}
		createResourceMutation.mutate(payload);
	};
	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className="mt-4 flex flex-col gap-4"
		>
			<Alert
				color="danger"
				variant={"flat"}
				radius={"full"}
				isVisible={!!errors.alert?.message}
				title={(errors.alert?.message as string) ?? ""}
				className="mb-3"
			/>
			<Controller
				name="name"
				control={control}
				render={({ field, formState: { errors } }) => (
					<Input
						value={field.value}
						onValueChange={field.onChange}
						isInvalid={!!errors.name}
						errorMessage={errors.name?.message}
						label="Name"
						placeholder="Enter name"
						color={errors.name ? "danger" : "default"}
						isDisabled={isDisableForm}
					/>
				)}
			/>

			<Controller
				name="url"
				control={control}
				render={({ field, formState: { errors } }) => (
					<Input
						value={field.value}
						onValueChange={field.onChange}
						isInvalid={!!errors.url}
						errorMessage={errors.url?.message}
						label="Website URL"
						placeholder="Enter website URL"
						color={errors.url ? "danger" : "default"}
						isDisabled={isDisableForm}
					/>
				)}
			/>

			<Controller
				name="category"
				control={control}
				render={({ field, formState: { errors } }) => {
					return (
						<Autocomplete
							isVirtualized
							allowsCustomValue
							label="Category"
							placeholder="Select category"
							items={categoriesWithTags}
							isLoading={categoriesWithTagsResponse.isLoading}
							defaultItems={[{ id: "", name: "" }]}
							selectedKey={field.value}
							onSelectionChange={field.onChange}
							disabledKeys={["empty"]}
							isInvalid={!!errors.category}
							errorMessage={errors.category?.message}
							color={errors.category ? "danger" : "default"}
							isDisabled={
								isDisableForm ||
								categoriesWithTagsResponse.isLoading
							}
						>
							{(item) => (
								<AutocompleteItem key={item?.id}>
									{item?.name}
								</AutocompleteItem>
							)}
						</Autocomplete>
					);
				}}
			/>

			<UploadImageResource
				name="icon"
				watch={watch}
				setShowUploadButtons={setShowUploadButtons}
				isDisableForm={isDisableForm}
				clearErrors={clearErrors}
				control={control}
				setIsDisableForm={setIsDisableForm}
				setValue={setValue}
				showUploadButtons={showUploadButtons}
				setFileIds={setFileIds}
				fileIds={fileIds}
			/>
			<UploadImageResource
				name="thumbnail"
				watch={watch}
				setShowUploadButtons={setShowUploadButtons}
				isDisableForm={isDisableForm}
				clearErrors={clearErrors}
				control={control}
				setIsDisableForm={setIsDisableForm}
				setValue={setValue}
				showUploadButtons={showUploadButtons}
				setFileIds={setFileIds}
				fileIds={fileIds}
			/>

			<Controller
				name="description"
				control={control}
				render={({ field, formState: { errors } }) => (
					<Textarea
						value={field.value as string}
						onValueChange={field.onChange}
						isInvalid={!!errors.description}
						errorMessage={errors.description?.message}
						label="Description"
						placeholder="Enter description"
						color={errors.description ? "danger" : "default"}
						isDisabled={isDisableForm}
						maxRows={3}
					/>
				)}
			/>

			<div>
				<Controller
					name="tags"
					control={control}
					render={({ field }) => {
						console.log(field.value);
						return (
							<CustomComboBox
								triggerText="Select Tags"
								value={field.value as string[]}
								onSelect={field.onChange}
								options={tagsList}
								selectionMode="multiple"
								placement="top-start"
								isDisabled={isDisableForm || !tagsList.length}
								disableParentScrollOnOpen={false}
							/>
						);
					}}
				/>
				<div className="text-xs italic">Tags are based on category</div>
			</div>

			<div className="mb-3 mt-5 flex justify-end gap-2">
				<Button
					color="default"
					variant="light"
					onPress={onCloseModal}
					isDisabled={isDisableForm}
				>
					Close
				</Button>
				<Button
					color="primary"
					className="bg-violet"
					type="submit"
					isLoading={isSubmitting}
					isDisabled={isDisableForm}
				>
					{isSubmitting ? "Please wait" : "Create Account"}
				</Button>
			</div>
		</form>
	);
};

export default CompleteForm;
