"use client";

import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { BookmarkButton } from "./BookmarkButton";
import { AnimatePresence } from "motion/react";
import { CollectionsList, CreateCollectionForm } from "./SaveResourcePopOver";
import { useState } from "react";
import { DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@heroui/react";

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
				<div className="mx-auto w-full max-w-sm">
					<VisuallyHidden>
						<DialogTitle>Save to collection</DialogTitle>
					</VisuallyHidden>
					<div className="relative h-full w-full">
						<AnimatePresence mode="wait" initial={false}>
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
