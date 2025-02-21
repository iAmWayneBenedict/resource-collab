import CustomComboBox from "@/components/custom/CustomComboBox";
import { delay } from "@/lib/utils";
import { Button, Input } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
	url: z.string().url("Invalid URL"),
	name: z.string().min(3, "Name must be at least 3 characters"),
	category: z.union([z.string(), z.number()], {
		required_error: "Category is required",
	}),
	tags: z.array(z.string().nullish()),
	icon: z.string().nullish(),
	thumbnail: z.string().nullish(),
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
	const { control, handleSubmit, setError, reset } = useForm({
		defaultValues: DEFAULT_VALUES,
		resolver: zodResolver(formSchema),
	});
	const [isSubmitting, setIsSubmitting] = useState(false);

	const onSubmit = (data: any) => {
		onSubmittingCallback(true);
		delay(1000).then(() => {
			onSubmittingCallback(false);
		});
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
						isDisabled={isSubmitting}
					/>
				)}
			/>
			<Controller
				name="category"
				control={control}
				render={({ field, formState: { errors } }) => (
					<Input
						value={field.value as string}
						onValueChange={field.onChange}
						isInvalid={!!errors.category}
						errorMessage={errors.category?.message}
						label="Category"
						placeholder="Enter category"
						color={errors.category ? "danger" : "default"}
						isDisabled={isSubmitting}
					/>
				)}
			/>

			<Controller
				name="icon"
				control={control}
				render={({ field, formState: { errors } }) => (
					<Input
						value={field.value as string}
						onValueChange={field.onChange}
						isInvalid={!!errors.icon}
						errorMessage={errors.icon?.message}
						label="Icon"
						placeholder="Enter icon"
						color={errors.icon ? "danger" : "default"}
						isDisabled={isSubmitting}
					/>
				)}
			/>
			<Controller
				name="thumbnail"
				control={control}
				render={({ field, formState: { errors } }) => (
					<Input
						value={field.value as string}
						onValueChange={field.onChange}
						isInvalid={!!errors.thumbnail}
						errorMessage={errors.thumbnail?.message}
						label="Thumbnail"
						placeholder="Enter thumbnail"
						color={errors.thumbnail ? "danger" : "default"}
						isDisabled={isSubmitting}
					/>
				)}
			/>
			<Controller
				name="description"
				control={control}
				render={({ field, formState: { errors } }) => (
					<Input
						value={field.value as string}
						onValueChange={field.onChange}
						isInvalid={!!errors.description}
						errorMessage={errors.description?.message}
						label="Description"
						placeholder="Enter description"
						color={errors.description ? "danger" : "default"}
						isDisabled={isSubmitting}
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
						options={["test", "test2", "asdf"]}
						selectionMode="multiple"
						placement="top-start"
						isDisabled={isSubmitting}
					/>
				)}
			/>

			<div className="mb-3 mt-5 flex justify-end gap-2">
				<Button
					color="default"
					variant="light"
					onPress={onCloseModal}
					isDisabled={isSubmitting}
				>
					Close
				</Button>
				<Button
					color="primary"
					className="bg-violet"
					type="submit"
					isLoading={isSubmitting}
				>
					{isSubmitting ? "Please wait" : "Create Account"}
				</Button>
			</div>
		</form>
	);
};

export default CompleteForm;
