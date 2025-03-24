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
	Image,
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
import { bindReactHookFormError, cn, toggleScrollBody } from "@/lib/utils";
import { useCollections } from "@/store/useCollections";
import { useQueryClient } from "@tanstack/react-query";
import { useMediaQuery } from "react-responsive";
import { useAuthUser, useModal } from "@/store";
import { collectionItemIcons } from "../../utils";
import useResourcePaginatedSearchParams from "@/store/context/useResourcePaginatedSearchParams";
import { ResourcePaginatedSearchParamsState } from "@/store/context/providers/ResourcePaginatedSearchParams";

// Collection item type
// Update the Collection type to include additional information
type Collection = {
	id: number;
	key: string;
	name: string;
	resourceCount: number;
	thumbnail: string;
	access_level: "private" | "public" | "shared";
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

// Collections list component
export const CollectionsList = ({
	onCreateNew,
	titleProps,
	onComplete,
	collectionList,
	resourceId,
}: CollectionsListProps) => {
	const isSmallDevices = useMediaQuery({
		query: "(max-width: 64rem)",
	});
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
			queryClient.invalidateQueries({
				queryKey: ["user-resources"],
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
				className="mb-2 px-1 text-base font-bold text-foreground lg:text-small"
				{...titleProps}
			>
				Save to collection
			</p>
			<div className="mt-3 flex w-full justify-center">
				<Button
					color="primary"
					startContent={<Plus size={16} />}
					size={isSmallDevices ? "md" : "sm"}
					className="w-full"
					radius="full"
					variant="ghost"
					onPress={onCreateNew}
				>
					Create new collection
				</Button>
			</div>
			<div className="mt-2 rounded-xl border border-zinc-200 dark:border-zinc-700">
				<Listbox
					aria-label="Collections"
					className="w-full"
					isVirtualized
					selectionMode="multiple"
					selectedKeys={selectedKeys}
					onSelectionChange={setSelectedKeys}
					virtualization={{
						maxListboxHeight: isSmallDevices ? 300 : 200,
						itemHeight: 48,
					}}
				>
					{collections?.map((collection) => (
						<ListboxItem
							key={collection.id}
							className="py-2"
							endContent={
								<div className="flex items-center gap-2">
									{
										collectionItemIcons[
											collection.access_level
										]
									}
								</div>
							}
							startContent={
								collection?.thumbnail ? (
									<Image
										alt=""
										src={collection.thumbnail}
										radius="md"
										className="h-9 w-16 min-w-16 max-w-16"
										disableSkeleton
										fallbackSrc="https://placehold.co/600x400"
									/>
								) : (
									<div className="h-9 min-w-16 rounded-md bg-default-200" />
								)
							}
							description={`${collection.resourceCount} item(s)`}
						>
							{collection.name}
						</ListboxItem>
					))}
				</Listbox>
			</div>
			<div className="mt-2 flex w-full">
				<Button
					size={isSmallDevices ? "md" : "sm"}
					className="w-full bg-violet text-white"
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
export const CreateCollectionForm = ({
	resourceId,
	onBack,
	onComplete,
}: CreateCollectionFormProps) => {
	const isSmallDevices = useMediaQuery({
		query: "(max-width: 64rem)",
	});
	const searchParams = useResourcePaginatedSearchParams(
		(state: ResourcePaginatedSearchParamsState) => state.searchParams,
	) as ResourcePaginatedSearchParamsState["searchParams"];
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
			queryClient.invalidateQueries({
				queryKey: searchParams.queryKey,
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
					className="p-0 hover:bg-transparent data-[hover=true]:bg-transparent"
					variant="light"
					size="sm"
					radius="full"
					onPress={onBack}
					startContent={<ArrowLeft size={16} />}
				>
					<p className="ml-1 text-base font-bold text-foreground lg:text-small">
						Create new collection
					</p>
				</Button>
			</div>
			<form
				className="flex w-full flex-col"
				onSubmit={handleSubmit(onSubmit)}
			>
				<div
					className={cn(
						"flex gap-2",
						isSmallDevices && "flex-col gap-4",
					)}
				>
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
								size={isSmallDevices ? "md" : "sm"}
								className="flex-1"
								autoFocus
							/>
						)}
					/>
					<Button
						size={isSmallDevices ? "md" : "sm"}
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
	const { authUser } = useAuthUser();
	const onOpenModal = useModal((state) => state.onOpen);

	const onCompleteHandler = () => {
		onOpenChangeHandler(false);
	};

	const onOpenChangeHandler = (isOpen: boolean) => {
		if (!authUser) {
			onOpenModal("auth-modal", {});
			return;
		}
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
