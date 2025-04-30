"use client";

import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { BookmarkButton } from "./BookmarkButton";
import { AnimatePresence } from "motion/react";
import { CollectionsList, CreateCollectionForm } from "./SaveResourcePopOver";
import { useState } from "react";
import { DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@heroui/react";
import { useAuthUser, useModal } from "@/store";
import { useDashboardPage } from "@/store/useDashboardPage";

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
	const { authUser } = useAuthUser();
	const onOpenModal = useModal((state) => state.onOpen);
	const getDashboardPage = useDashboardPage(
		(state) => state.getDashboardPage,
	);
	const isSharedPage = getDashboardPage() === "shared";

	const onCompleteHandler = () => {
		onOpenChangeHandler(false);
	};

	const onOpenChangeHandler = (isOpen: boolean) => {
		if (isSharedPage) return;

		if (!authUser) {
			onOpenModal("auth-modal", {});
			return;
		}
		setIsOpen(isOpen);
		setShowCreateForm(false);
	};

	return (
		<Drawer open={isOpen} onOpenChange={onOpenChangeHandler}>
			<DrawerTrigger asChild disabled={isSharedPage}>
				<BookmarkButton
					count={bookmarkCount || 0}
					isBookmarked={isBookmarked}
				/>
			</DrawerTrigger>
			<DrawerContent>
				<div className="mx-auto min-h-[30rem] w-full max-w-sm">
					<VisuallyHidden>
						<DialogTitle>Save to collection</DialogTitle>
					</VisuallyHidden>
					<div className="relative h-fit w-full">
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
