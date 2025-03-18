"use client";

import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { BookmarkButton } from "./BookmarkButton";
import { AnimatePresence } from "motion/react";
import { CollectionsList, CreateCollectionForm } from "./SaveResourcePopOver";
import { useState } from "react";
import { DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@heroui/react";

const data = [
	{
		goal: 400,
	},
	{
		goal: 300,
	},
	{
		goal: 200,
	},
	{
		goal: 300,
	},
	{
		goal: 200,
	},
	{
		goal: 278,
	},
	{
		goal: 189,
	},
	{
		goal: 239,
	},
	{
		goal: 300,
	},
	{
		goal: 200,
	},
	{
		goal: 278,
	},
	{
		goal: 189,
	},
	{
		goal: 349,
	},
];

export function SaveResourceDrawer({
	bookmarkCount,
	id,
	isBookmarked,
	collectionList,
}: {
	bookmarkCount: number;
	id: number;
	isBookmarked: boolean;
	collectionList: any[];
}) {
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
		<Drawer open={isOpen} onOpenChange={onOpenChangeHandler}>
			<DrawerTrigger asChild>
				<BookmarkButton
					count={bookmarkCount || 0}
					isBookmarked={isBookmarked}
				/>
			</DrawerTrigger>
			<DrawerContent>
				<div className="mx-auto min-h-96 w-full max-w-sm">
					<VisuallyHidden>
						<DialogTitle>Save to collection</DialogTitle>
					</VisuallyHidden>
					<div className="relative h-full w-full overflow-hidden">
						<AnimatePresence mode="popLayout" initial={false}>
							{!showCreateForm ? (
								<CollectionsList
									onCreateNew={() => setShowCreateForm(true)}
									onComplete={onCompleteHandler}
									titleProps={null}
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
				</div>
			</DrawerContent>
		</Drawer>
	);
}
