import {
	Button,
	Input,
	Popover,
	PopoverContent,
	PopoverTrigger,
	ListboxItem,
	Listbox,
	addToast,
	Selection,
} from "@heroui/react";
import React, { Key, useCallback, useEffect, useMemo, useState } from "react";
import { BookmarkButton } from "./BookmarkButton";
import { motion, AnimatePresence } from "motion/react";
import { Plus, ArrowLeft, Lock, Eye, Users, Trash2 } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
	usePostCreateCollectionsMutation,
	usePostCreateResourceCollectionsMutation,
} from "@/lib/mutations/collections";
import { bindReactHookFormError, toggleScrollBody } from "@/lib/utils";
import { useCollections } from "@/store/useCollections";
import { useQueryClient } from "@tanstack/react-query";
import { a } from "vitest/dist/chunks/suite.qtkXWc6R.js";

// Collection item type
// Update the Collection type to include additional information
type Collection = {
	id: number;
	key: string;
	name: string;
	resourceCount: number;
	visibility: "private" | "public" | "shared";
};

// Props for the CollectionsList component
type CollectionsListProps = {
	onCreateNew: () => void;
	onComplete: () => void;
	titleProps: any;
	collectionList: string[];
	resourceId: number;
};

// Props for the CreateCollectionForm component
type CreateCollectionFormProps = {
	resourceId: number;
	onBack: () => void;
	onComplete: () => void;
};

const collectionItemIcons = {
	private: <Lock size={18} />,
	public: <Eye size={18} />,
	shared: <Users size={18} />,
};

// Collections list component
const CollectionsList = ({
	onCreateNew,
	titleProps,
	onComplete,
	collectionList,
	resourceId,
}: CollectionsListProps) => {
	const getCollections = useCollections((state) => state.getCollections);
	const [selectedKeys, setSelectedKeys] = useState<Selection>(
		new Set([...collectionList]),
	);

	const queryClient = useQueryClient();

	const collections = getCollections() as Collection[];

	// Prevent scroll body when collections exceed 4
	useEffect(() => {
		if (!collections || collections.length <= 4) return;
		toggleScrollBody(true);

		return () => toggleScrollBody(false);
	}, [collections]);

	const mutation = usePostCreateResourceCollectionsMutation({
		onSuccess: (data) => {
			console.log("Resource added to collection:", data);
			addToast({
				title: "Success",
				description: "Updated collection",
				color: "success",
			});
			queryClient.invalidateQueries({ queryKey: ["collections"] });
			queryClient.invalidateQueries({
				queryKey: ["paginated-resources"],
			});
			onComplete();
		},
		onError: (error) => {
			console.error(
				"Error adding resource to collection:",
				error.response.data,
			);
			addToast({
				title: "Error",
				description: "Resource addition failed.",
				color: "danger",
			});
		},
	});

	const isSimilar = useMemo(() => {
		const convert = (collectionList: any[]) => {
			const sortedList = [...collectionList]
				.map(Number)
				.sort((a, b) => a - b);
			return JSON.stringify(sortedList);
		};
		const selectedSetKeys = convert([...selectedKeys]);
		const collectionListSet = convert(collectionList);

		return selectedSetKeys === collectionListSet;
	}, [selectedKeys, collectionList]);

	const onDoneSubmit = useCallback(() => {
		mutation.mutate({
			collection_folder_ids: [...selectedKeys].map((v) => Number(v)),
			resource_id: resourceId,
		});
	}, [selectedKeys]);

	return (
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
			<div className="mt-2 rounded-xl border border-gray-200 dark:border-gray-700">
				<Listbox
					aria-label="Collections"
					className="w-full"
					isVirtualized
					selectionMode="multiple"
					selectedKeys={selectedKeys}
					onSelectionChange={setSelectedKeys}
					virtualization={{
						maxListboxHeight: 200,
						itemHeight: 48,
					}}
				>
					{collections?.map((collection) => (
						<ListboxItem
							key={collection.id}
							className="py-2"
							endContent={
								<div className="flex items-center gap-2">
									{collectionItemIcons[collection.visibility]}
								</div>
							}
							description={`${collection.resourceCount} item(s)`}
						>
							{collection.name}
						</ListboxItem>
					))}
				</Listbox>
			</div>
			<div className="mt-2 flex w-full justify-end">
				<Button
					size="sm"
					className="bg-violet text-white"
					radius="full"
					onPress={onDoneSubmit}
					isLoading={mutation.isPending}
					isDisabled={isSimilar}
				>
					Done
				</Button>
			</div>
		</motion.div>
	);
};

const collectionFormSchema = z.object({
	name: z.string().min(1, "Collection name is required"),
});
// Create collection form component
const CreateCollectionForm = ({
	resourceId,
	onBack,
	onComplete,
}: CreateCollectionFormProps) => {
	const queryClient = useQueryClient();
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

	const mutation = usePostCreateCollectionsMutation({
		onSuccess: (data) => {
			console.log("Collection created:", data);
			queryClient.invalidateQueries({ queryKey: ["collections"] });
			queryClient.invalidateQueries({
				queryKey: ["paginated-resources"],
			});
			addToast({
				title: "Success",
				description: "Collection created successfully.",
				color: "success",
			});
			onComplete();
		},
		onError: (error) => {
			console.error("Error creating collection:", error.response.data);
			bindReactHookFormError(error.response.data, setError);
			addToast({
				title: "Error",
				description: "Collection creation failed.",
				color: "danger",
			});
		},
	});

	const onSubmit = (data: any) => {
		if (!data) return;
		console.log("Submitting new collection:", data, resourceId);
		// onComplete(data);
		mutation.mutate({
			name: data.name,
			resource_id: resourceId,
		});
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
						size="sm"
						radius="full"
						type="submit"
						className="bg-violet text-white"
						isLoading={mutation.isPending}
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
	isBookmarked,
	collectionList,
}: {
	bookmarkCount: number;
	id: number;
	isBookmarked: boolean;
	collectionList: any[];
}) => {
	const [showCreateForm, setShowCreateForm] = useState(false);
	const [isOpen, setIsOpen] = useState(false);

	const onCompleteHandler = () => {
		onOpenChangeHandler(false);
	};

	const onOpenChangeHandler = (isOpen: boolean) => {
		setIsOpen(isOpen);
		setShowCreateForm(false);
	};

	return (
		<Popover
			showArrow
			offset={10}
			placement="bottom"
			backdrop="transparent"
			isOpen={isOpen}
			onOpenChange={onOpenChangeHandler}
		>
			<PopoverTrigger>
				<BookmarkButton
					count={bookmarkCount || 0}
					isBookmarked={isBookmarked}
				/>
			</PopoverTrigger>
			<PopoverContent className="w-[280px] p-0">
				{(titleProps) => (
					<div className="relative w-full overflow-hidden">
						<AnimatePresence mode="popLayout" initial={false}>
							{!showCreateForm ? (
								<CollectionsList
									onCreateNew={() => setShowCreateForm(true)}
									onComplete={onCompleteHandler}
									titleProps={titleProps}
									collectionList={collectionList}
									resourceId={id}
								/>
							) : (
								<CreateCollectionForm
									onBack={() => setShowCreateForm(false)}
									onComplete={onCompleteHandler}
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
