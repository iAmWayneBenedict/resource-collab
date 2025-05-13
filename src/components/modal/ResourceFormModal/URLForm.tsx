import { usePostResourceMutation } from "@/lib/mutations/resources";
import { addToast, Alert, Button, Input } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
	url: z.string().url("Invalid URL"),
	alert: z.string().nullish(),
});

const DEFAULT_VALUES = {
	url: "",
	alert: "",
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
	const {
		control,
		handleSubmit,
		setError,
		reset,
		formState: { errors },
	} = useForm({
		defaultValues: DEFAULT_VALUES,
		resolver: zodResolver(formSchema),
	});
	const searchParams = useSearchParams();
	const page = searchParams.get("page");
	const item = searchParams.get("item");

	const queryClient = useQueryClient();

	const [isSubmitting, setIsSubmitting] = useState(false);

	const createResourceMutation = usePostResourceMutation({
		onSuccess: (data) => {
			onSubmittingCallback(false);
			setIsSubmitting(false);
			onCloseModal();

			queryClient.invalidateQueries({
				queryKey: ["user-resources-resources"],
			});
			queryClient.invalidateQueries({
				queryKey: [`user-collection-resources-${item}-resources`],
			});

			addToast({
				title: "Success",
				description: "Resource created successfully.",
				color: "success",
			});
		},
		onError: (error) => {
			console.log(error.response.data);
			onSubmittingCallback(false);
			setIsSubmitting(false);
			setError(error.response.data.path[0], {
				message: error.response.message,
			});
		},
	});

	const onSubmit = (data: any) => {
		onSubmittingCallback(true);
		setIsSubmitting(true);

		if (page === "collections") data["collection_folder_id"] = item;

		createResourceMutation.mutate(data);
	};
	return (
		<form onSubmit={handleSubmit(onSubmit)} className="mt-4">
			<Alert
				color="danger"
				variant={"flat"}
				radius={"full"}
				isVisible={!!errors.alert?.message}
				title={(errors.alert?.message as string) ?? ""}
				className="mb-3"
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
						isDisabled={isSubmitting}
					/>
				)}
			/>
			<p className="mt-4 text-xs italic">
				By default, this approach uses AI to determine the category and
				tags associated with the resource
			</p>
			<div className="mb-3 mt-5 flex justify-end gap-2">
				<Button
					color="default"
					variant="light"
					radius="full"
					onPress={onCloseModal}
					isDisabled={isSubmitting}
				>
					Close
				</Button>
				<Button
					color="primary"
					className="bg-violet"
					type="submit"
					radius="full"
					isLoading={isSubmitting}
				>
					{isSubmitting ? "Please wait" : "Create"}
				</Button>
			</div>
		</form>
	);
};

export default URLForm;
