import { usePostResourceMutation } from "@/lib/mutations/resources";
import { Button, Input } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
	url: z.string().url("Invalid URL"),
});

const DEFAULT_VALUES = {
	url: "",
};

type URLFormProps = {
	data: any;
	onCloseModal: () => void;
	onSubmittingCallback: (state: boolean) => void;
};

const URLForm = ({
	onCloseModal,
	data,
	onSubmittingCallback,
}: URLFormProps) => {
	const { control, handleSubmit, setError, reset } = useForm({
		defaultValues: DEFAULT_VALUES,
		resolver: zodResolver(formSchema),
	});

	const [isSubmitting, setIsSubmitting] = useState(false);

	const createResourceMutation = usePostResourceMutation({
		onSuccess: (data) => {
			console.log(data);
			onSubmittingCallback(false);
			setIsSubmitting(false);
		},
		onError: (error) => {
			console.log(error);
			onSubmittingCallback(false);
			setIsSubmitting(false);
		},
	});

	const onSubmit = (data: any) => {
		console.log(data);
		onSubmittingCallback(true);
		setIsSubmitting(true);

		createResourceMutation.mutate(data);
	};
	return (
		<form onSubmit={handleSubmit(onSubmit)} className="mt-4">
			
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
						isDisabled={isSubmitting}
					/>
				)}
			/>
			<p className="text-xs italic mt-4">
				By default, this approach uses AI to determine the category and
				tags associated with the resource
			</p>
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
					{isSubmitting ? "Please wait" : "Create"}
				</Button>
			</div>
		</form>
	);
};

export default URLForm;
