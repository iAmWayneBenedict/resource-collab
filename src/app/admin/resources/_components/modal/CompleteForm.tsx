import CustomComboBox from "@/components/custom/CustomComboBox";
import { usePostResourceMutation } from "@/lib/mutations/resources";
import { UploadButton } from "@/lib/storage/uploadthing";
import {
	Autocomplete,
	AutocompleteItem,
	Button,
	Chip,
	Input,
	Switch,
	Textarea,
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { AnimatePresence, motion } from "motion/react";
import { usePostDeleteUploadThingFileMutation } from "../../../../../lib/mutations/storage/uploadthing";
import { isValidUrl } from "@/lib/utils";

const formSchema = z.object({
	url: z.string().url("Invalid URL"),
	name: z.string().min(3, "Name must be at least 3 characters"),
	category: z.union([z.string(), z.number()], {
		required_error: "Category is required",
	}),
	tags: z.array(z.string().nullish()),
	icon: z.union([z.string().url(), z.literal("").nullish()]),
	thumbnail: z.union([z.string().url(), z.literal("").nullish()]),
	description: z.string().nullish(),
});
const DEFAULT_VALUES = {
	url: "",
	name: "",
	category: "",
	tags: [],
	icon: "",
	thumbnail: "",
	description: "",
};

type CompleteFormProps = {
	data: typeof DEFAULT_VALUES;
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

	const deleteUploadedImagesMutation = usePostDeleteUploadThingFileMutation();
	useEffect(() => {
		return () => {
			if (watch("icon") || watch("thumbnail"))
				deleteUploadedImagesMutation.mutate(
					Object.values(fileIds).filter((v) => v),
				);
		};
	}, []);

	const createResourceMutation = usePostResourceMutation({
		onSuccess: (data) => {
			console.log(data);
			onSubmittingCallback(false);
			setIsDisableForm(false);
			setIsSubmitting(false);
		},
		onError: (error) => {
			console.log(error);
			onSubmittingCallback(false);
			setIsDisableForm(false);
			setIsSubmitting(false);
		},
	});
	console.log(watch("category"));
	const onSubmit = (data: any) => {
		console.log(data);
		onSubmittingCallback(true);
		setIsDisableForm(true);
		setIsSubmitting(true);

		createResourceMutation.mutate(data);
	};
	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className="mt-4 flex flex-col gap-4"
		>
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
				render={({ field, formState: { errors } }) => (
					<Autocomplete
						isVirtualized
						label="Category"
						placeholder="Select category"
						items={[
							{ name: "category data" },
							{ name: "category data 2" },
						]}
						selectedKey={field.value}
						onSelectionChange={field.onChange}
						isInvalid={!!errors.category}
						errorMessage={errors.category?.message}
						color={errors.category ? "danger" : "default"}
						isDisabled={isDisableForm}
					>
						{(item) => (
							<AutocompleteItem key={item.name}>
								{item.name}
							</AutocompleteItem>
						)}
					</Autocomplete>
				)}
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

			<Controller
				name="tags"
				control={control}
				render={({ field }) => (
					<CustomComboBox
						triggerText="Select Tags"
						value={field.value as string[]}
						onSelect={field.onChange}
						options={[
							"test",
							"test2",
							"asdf",
							"asdfg",
							"asdfas",
							"asdfaas",
							"asdfasddaw",
							"as",
							"asdfwwwr",
						]}
						selectionMode="multiple"
						placement="top-start"
						isDisabled={isDisableForm}
						disableParentScrollOnOpen={false}
					/>
				)}
			/>

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

type UploadImageResource = {
	name: string;
	watch: any;
	clearErrors: any;
	setValue: any;
	isDisableForm: boolean;
	setShowUploadButtons: React.Dispatch<
		React.SetStateAction<{
			icon: boolean;
			thumbnail: boolean;
		}>
	>;
	showUploadButtons: any;
	control: any;
	setIsDisableForm: any;
	setFileIds: any;
	fileIds: any;
};
const UploadImageResource = ({
	name,
	isDisableForm,
	setShowUploadButtons,
	clearErrors,
	setValue,
	watch,
	showUploadButtons,
	control,
	setIsDisableForm,
	setFileIds,
	fileIds,
}: UploadImageResource) => {
	const deleteImageMutation = usePostDeleteUploadThingFileMutation();
	return (
		<div>
			<div className="mb-1 flex justify-between">
				<Switch
					size="sm"
					isDisabled={!!isDisableForm}
					isSelected={showUploadButtons[name]}
					onValueChange={(state: boolean) =>
						setShowUploadButtons((prev) => ({
							...prev,
							[name]: state,
						}))
					}
				>
					Show upload button
				</Switch>
				<AnimatePresence mode="popLayout">
					{watch(name) && (
						<motion.div
							onClick={() => {
								setValue(name, "");
								clearErrors([name]);
								deleteImageMutation.mutate([fileIds[name]]);
							}}
							className="cursor-pointer"
							initial={{ opacity: 0, scale: 0.95 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{
								ease: "easeInOut",
								duration: 0.2,
							}}
						>
							<Chip size="sm" className="text-xs" variant="flat">
								Clear
							</Chip>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
			<div className={showUploadButtons[name] ? "hidden" : "flex"}>
				<Controller
					name={name}
					control={control}
					render={({ field, formState: { errors } }) => (
						<Input
							value={field.value as string}
							onValueChange={field.onChange}
							isInvalid={!!errors[name]}
							errorMessage={errors[name]?.message?.toString()}
							label={name}
							placeholder={`Enter ${name}`}
							color={errors[name] ? "danger" : "default"}
							isDisabled={isDisableForm}
							classNames={{ label: "capitalize" }}
						/>
					)}
				/>
			</div>
			<div className={showUploadButtons[name] ? "mt-2 flex" : "hidden"}>
				<UploadButton
					endpoint="imageUploader"
					onClientUploadComplete={(res) => {
						// Do something with the response
						console.log("Files: ", res);
						setValue(name, res[0].ufsUrl);
						setIsDisableForm(false);
						setShowUploadButtons((prev) => ({
							icon: false,
							thumbnail: false,
						}));
						setFileIds((prev: any) => ({
							...prev,
							[name]: res[0].key,
						}));
					}}
					onUploadError={(error: Error) => {
						// Do something with the error.
						setIsDisableForm(false);
					}}
					onBeforeUploadBegin={(files) => {
						// Do something before the upload begins.
						if (fileIds[name])
							deleteImageMutation.mutate(
								Object.values(fileIds).filter((v) => v),
							);

						setIsDisableForm(true);
						return files;
					}}
				/>
			</div>
		</div>
	);
};
