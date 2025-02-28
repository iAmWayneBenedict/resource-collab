import {
	Button,
	Input,
	Popover,
	PopoverContent,
	PopoverTrigger,
	ListboxItem,
	Listbox,
} from "@heroui/react";
import React, { useState } from "react";
import { BookmarkButton } from "./BookmarkButton";
import { motion, AnimatePresence } from "motion/react";
import { Plus, ArrowLeft, Lock, Eye, Users } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { usePostCollectionsMutation } from "@/lib/mutations/collections";
import { bindReactHookFormError } from "@/lib/utils";

// Collection item type
// Update the Collection type to include additional information
type Collection = {
	key: string;
	label: string;
	resourceCount: number;
	visibility: "private" | "public" | "shared";
};

// Props for the CollectionsList component
type CollectionsListProps = {
	collections: Collection[];
	onCreateNew: () => void;
	titleProps: any;
};

// Props for the CreateCollectionForm component
type CreateCollectionFormProps = {
	resourceId: number;
	onBack: () => void;
	onComplete: (name: string) => void;
};

// Collections list component
const CollectionsList = ({
	collections,
	onCreateNew,
	titleProps,
}: CollectionsListProps) => (
	<motion.div
		key="collections-list"
		initial={{ opacity: 0, x: -150 }}
		animate={{ opacity: 1, x: 0 }}
		exit={{ opacity: 0, x: -150 }}
		transition={{
			type: "tween",
			ease: "easeInOut",
			duration: 0.3,
		}}
		className="w-full p-2"
	>
		<p
			className="mb-2 px-1 text-small font-bold text-foreground"
			{...titleProps}
		>
			Save to collection
		</p>
		<div className="mt-3 flex w-full justify-center">
			<Button
				color="primary"
				startContent={<Plus size={16} />}
				size="sm"
				className="w-full"
				radius="full"
				onPress={onCreateNew}
			>
				Create new collection
			</Button>
		</div>
		<div className="mt-2 rounded-md border border-gray-200 dark:border-gray-700">
			<Listbox aria-label="Collections" className="w-full">
				{collections.map((collection) => (
					<ListboxItem
						key={collection.key}
						className="py-2"
						endContent={
							<div className="flex items-center gap-2">
								{collection.visibility === "private" && (
									<Lock size={18} />
								)}
								{collection.visibility === "public" && (
									<Eye size={18} />
								)}
								{collection.visibility === "shared" && (
									<Users size={18} />
								)}
							</div>
						}
						description={`${collection.resourceCount} item(s)`}
					>
						{collection.label}
					</ListboxItem>
				))}
			</Listbox>
		</div>
	</motion.div>
);

const collectionFormSchema = z.object({
	name: z.string().min(1, "Collection name is required"),
});
// Create collection form component
const CreateCollectionForm = ({
	resourceId,
	onBack,
	onComplete,
}: CreateCollectionFormProps) => {
	const {
		control,
		handleSubmit,
		setError,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(collectionFormSchema),
		defaultValues: {
			name: "",
		},
	});

	const mutation = usePostCollectionsMutation({
		onSuccess: (data) => {
			console.log("Collection created:", data);
			// onBack();
		},
		onError: (error) => {
			console.error("Error creating collection:", error.response.data);
			bindReactHookFormError(error.response.data, setError);
		},
	});

	const onSubmit = (data: any) => {
		if (!data) return;
		console.log("Submitting new collection:", data, resourceId);
		// onComplete(data);
		mutation.mutate({ name: data.name, resource_id: resourceId });
	};

	return (
		<motion.div
			key="create-form"
			initial={{ opacity: 0, x: 150 }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 0, x: 150 }}
			transition={{ type: "tween", ease: "easeInOut", duration: 0.3 }}
			className="w-full p-2"
		>
			<div className="mb-2 flex items-center">
				<Button
					isIconOnly
					variant="light"
					size="sm"
					radius="full"
					onPress={onBack}
				>
					<ArrowLeft size={16} />
				</Button>
				<p className="ml-1 text-small font-bold text-foreground">
					Create new collection
				</p>
			</div>
			<form
				className="flex w-full flex-col"
				onSubmit={handleSubmit(onSubmit)}
			>
				<div className="flex gap-2">
					<Controller
						name="name"
						control={control}
						render={({ field, fieldState: { error } }) => (
							<Input
								value={field.value}
								onChange={field.onChange}
								isInvalid={!!error?.message}
								errorMessage={error?.message}
								isDisabled={false}
								placeholder="Collection name"
								size="sm"
								className="flex-1"
								autoFocus
							/>
						)}
					/>
					<Button
						color="primary"
						size="sm"
						radius="full"
						type="submit"
					>
						Create
					</Button>
				</div>
			</form>
		</motion.div>
	);
};

// Main component
const SaveResourcePopOver = ({
	bookmarkCount,
	id,
}: {
	bookmarkCount: number;
	id: number;
}) => {
	const [showCreateForm, setShowCreateForm] = useState(false);

	const collections = [
		{
			key: "1",
			label: "Favorites",
			resourceCount: 12,
			visibility: "private" as const,
		},
		{
			key: "2",
			label: "Read Later",
			resourceCount: 5,
			visibility: "public" as const,
		},
		{
			key: "3",
			label: "Design Inspiration",
			resourceCount: 8,
			visibility: "shared" as const,
		},
	];

	const handleComplete = (name: string) => {
		console.log(`Creating collection: ${name}`);
		// setShowCreateForm(false);
	};

	return (
		<Popover
			showArrow
			offset={10}
			placement="bottom"
			backdrop="transparent"
		>
			<PopoverTrigger>
				<BookmarkButton
					count={bookmarkCount || 0}
					isBookmarked={false}
				/>
			</PopoverTrigger>
			<PopoverContent className="w-[280px] p-0">
				{(titleProps) => (
					<div className="relative w-full overflow-hidden">
						<AnimatePresence mode="popLayout" initial={false}>
							{!showCreateForm ? (
								<CollectionsList
									collections={collections}
									onCreateNew={() => setShowCreateForm(true)}
									titleProps={titleProps}
								/>
							) : (
								<CreateCollectionForm
									onBack={() => setShowCreateForm(false)}
									onComplete={handleComplete}
									resourceId={id}
								/>
							)}
						</AnimatePresence>
					</div>
				)}
			</PopoverContent>
		</Popover>
	);
};

export default SaveResourcePopOver;
