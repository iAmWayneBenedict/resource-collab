"use client";

import { useDebounce } from "@/hooks";
import { useModal } from "@/store";
import {
	Modal,
	ModalContent,
	ModalBody,
	useDisclosure,
	Input,
	Divider,
	Chip,
} from "@heroui/react";
import { ChevronRight, Search } from "lucide-react";
import { KeyboardEvent, useEffect, useRef, useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { reInitQueryParams } from "@/lib/utils";
import { useRecentSearches } from "@/store/useRecentSearches";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";
import { useSearchData } from "@/store/useSearchData";
import { AnimatePresence, motion } from "framer-motion";
import { HighlightedText } from "./components/SearchModal/HighlightText";
import ListItem from "./components/SearchModal/ListItem";

// Add these motion variants before the SearchFormModal component
const listContainerVariants = {
	hidden: {
		opacity: 0,
		height: 0,
		overflow: "hidden",
	},
	visible: {
		opacity: 1,
		height: "auto",
		overflow: "visible",
	},
};

const SearchFormModal = () => {
	const { isOpen, onOpen, onOpenChange } = useDisclosure();
	const [searchValue, setSearchValue] = useState("");
	const [selectedIndex, setSelectedIndex] = useState(-1);

	const searchParams = useSearchParams();
	const searchDefault = searchParams.get("search") ?? "";

	const { resources, setAddResource } = useRecentSearches();

	const router = useRouter();
	const searchRef = useRef<HTMLInputElement>(null);
	const listRef = useRef<HTMLUListElement>(null);
	const { searchData } = useSearchData();

	const {
		name: modalName,
		onClose,
		data: dataModal,
		onOpen: onOpenModal,
	} = useModal();

	const searchDebounced = useDebounce(searchValue, 250);

	useKeyboardShortcut({ ctrlKey: true, key: "k" }, () => {
		onOpenModal("Search Filter", null);
	});

	useEffect(() => {
		setSearchValue(searchDefault);
	}, [searchDefault]);

	const filteredResources = useMemo(
		() =>
			searchData
				?.filter((resource: any) => {
					if (!searchDebounced) return false;
					const searchLower = searchDebounced.toLowerCase();
					return (
						resource.name.toLowerCase().includes(searchLower) ||
						resource.description.toLowerCase().includes(searchLower)
					);
				})
				.slice(0, 5) || [],
		[searchData, searchDebounced],
	);

	useEffect(() => {
		if (modalName === "Search Filter") {
			onOpen();
			setTimeout(() => {
				searchRef.current?.focus();
			}, 500);
		}
	}, [modalName, onClose, onOpen]);

	useEffect(() => {
		// Reset selected index when search results change
		setSelectedIndex(-1);
	}, [filteredResources, searchDebounced]);

	const onCloseModal = () => {
		onOpenChange();
		onClose();
	};

	const onChangeHandler = (e: any) => {
		setSearchValue(e.target.value);
	};

	const handleItemSelection = (item: string) => {
		router.push(
			reInitQueryParams(window.location.href, {
				search: item,
			}),
			{ scroll: false },
		);
		setAddResource(item);
		onCloseModal();
	};

	const onKeyDownHandler = (e: KeyboardEvent<HTMLInputElement>) => {
		const items = searchDebounced
			? filteredResources.map((r: any) => r.name)
			: resources;

		if (e.key === "ArrowDown") {
			e.preventDefault();
			if (items.length > 0) {
				setSelectedIndex((prev) =>
					prev < items.length - 1 ? prev + 1 : prev,
				);
				const listItems =
					listRef.current?.querySelectorAll('li[tabindex="0"]');
				if (listItems && listItems[selectedIndex + 1]) {
					(listItems[selectedIndex + 1] as HTMLElement).focus();
				}
			}
		} else if (e.key === "ArrowUp") {
			e.preventDefault();
			if (selectedIndex > 0) {
				setSelectedIndex((prev) => prev - 1);
				const listItems =
					listRef.current?.querySelectorAll('li[tabindex="0"]');
				if (listItems && listItems[selectedIndex - 1]) {
					(listItems[selectedIndex - 1] as HTMLElement).focus();
				}
			} else {
				searchRef.current?.focus();
			}
		} else if (e.key === "Escape") {
			onCloseModal();
		} else if (e.key === "Enter") {
			if (selectedIndex >= 0 && items[selectedIndex]) {
				handleItemSelection(items[selectedIndex]);
			} else {
				router.push(
					reInitQueryParams(window.location.href, {
						search: e.currentTarget.value,
					}),
					{ scroll: false },
				);
				onCloseModal();
			}
		}
	};

	const handleListKeyDown = (
		e: KeyboardEvent<HTMLLIElement>,
		item: string,
	) => {
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			handleItemSelection(item);
		} else if (e.key === "ArrowDown") {
			e.preventDefault();
			const items = searchDebounced
				? filteredResources.map((r: any) => r.name)
				: resources;
			const nextIndex =
				selectedIndex < items.length - 1
					? selectedIndex + 1
					: selectedIndex;
			setSelectedIndex(nextIndex);
			const listItems =
				listRef.current?.querySelectorAll('li[tabindex="0"]');
			if (listItems && listItems[nextIndex]) {
				(listItems[nextIndex] as HTMLElement).focus();
			}
		} else if (e.key === "ArrowUp") {
			e.preventDefault();
			const prevIndex = selectedIndex > 0 ? selectedIndex - 1 : -1;
			setSelectedIndex(prevIndex);
			if (prevIndex >= 0) {
				const listItems =
					listRef.current?.querySelectorAll('li[tabindex="0"]');
				if (listItems && listItems[prevIndex]) {
					(listItems[prevIndex] as HTMLElement).focus();
				}
			} else {
				searchRef.current?.focus();
			}
		} else if (e.key === "Escape") {
			onCloseModal();
		}
	};

	const showSearchResult = filteredResources.length > 0;
	const showEmptySearchResult = !filteredResources.length && searchDebounced;
	const showRecentSearchResult = !searchDebounced && resources.length;
	const showEmptyRecentSearchResult = !searchDebounced && !resources.length;

	// Calculate the number of items to display for height animation
	const itemCount = showSearchResult
		? filteredResources.length
		: showRecentSearchResult
			? resources.length
			: 1; // For empty state messages

	return (
		<Modal
			isOpen={isOpen}
			placement="center"
			onOpenChange={onCloseModal}
			backdrop="blur"
			size="xl"
			hideCloseButton
		>
			<ModalContent>
				<ModalBody className="gap-1 rounded-2xl border border-default-200 p-0">
					<div
						style={{
							height: `calc(${itemCount} * 5rem + 5.25rem)`,
						}}
						className="transition-all"
					>
						<Input
							ref={searchRef}
							isClearable
							variant="bordered"
							labelPlacement="outside"
							placeholder="Type to search..."
							type="search"
							size="lg"
							className="mt-1"
							classNames={{
								inputWrapper:
									"h-14 focus-within:ring-0 group-data-[focus=true]:border-0 border-0 shadow-none",
								input: "max-w-[83%]",
							}}
							startContent={
								<Search className="pointer-events-none flex-shrink-0 text-2xl text-default-400" />
							}
							endContent={
								<div className="flex items-center gap-1">
									<Chip
										size="sm"
										classNames={{
											base: "min-w-0 px-1.5 bg-default-100 text-default-600 hover:bg-default-200 text-xs py-2",
										}}
									>
										ESC
									</Chip>
								</div>
							}
							onKeyDown={onKeyDownHandler}
							onClear={() => setSearchValue("")}
							onChange={onChangeHandler}
							value={searchValue}
						/>
						<Divider className="bg-default-200" />
						<div className="px-2">
							<div className="w-full border-0">
								<div className="mb-2 text-sm text-default-600">
									{searchDebounced.length
										? "Results"
										: "Recent"}
								</div>
								<AnimatePresence>
									<motion.ul
										ref={listRef}
										className="flex flex-col gap-2 pb-2"
										role="listbox"
										aria-label="Search results"
										variants={listContainerVariants}
										initial="hidden"
										animate="visible"
										exit="hidden"
										transition={{ duration: 0.3 }}
									>
										<AnimatePresence mode="popLayout">
											{showSearchResult &&
												filteredResources.map(
													(
														resource: any,
														index: number,
													) => (
														<ListItem
															key={resource.name}
															keyIdentifier={
																resource.name
															}
															className={
																selectedIndex ===
																index
																	? "bg-violet! text-white!"
																	: ""
															}
															selected={
																selectedIndex ===
																index
															}
															onClick={() =>
																handleItemSelection(
																	resource.name,
																)
															}
															onKeyDown={(e) =>
																handleListKeyDown(
																	e,
																	resource.name,
																)
															}
														>
															<div className="flex items-center gap-2">
																<Search className="min-w-6 text-default-500 group-hover:text-white group-focus:text-white" />
																<div>
																	<div className="line-clamp-1 text-base group-hover:text-white">
																		<HighlightedText
																			text={
																				resource.name
																			}
																			highlight={
																				searchDebounced
																			}
																		/>
																	</div>
																	<div className="line-clamp-1 text-sm text-default-500 group-hover:text-white">
																		<HighlightedText
																			text={
																				resource.description
																			}
																			highlight={
																				searchDebounced
																			}
																		/>
																	</div>
																</div>
																<ChevronRight
																	size={18}
																	className="min-w-8 text-default-500 group-hover:text-white group-focus:text-white"
																/>
															</div>
														</ListItem>
													),
												)}
											{showEmptySearchResult && (
												<ListItem
													overrideClassName={true}
													className="text-md py-3 text-center text-default-600"
													aria-disabled="true"
													key="empty"
													keyIdentifier="empty"
												>
													{`No results for "${searchDebounced}"`}
												</ListItem>
											)}
											{showRecentSearchResult &&
												resources.map(
													(resource, index) => (
														<ListItem
															key={resource}
															keyIdentifier={
																resource
															}
															className="min-h-16"
															selected={
																selectedIndex ===
																index
															}
															onClick={() =>
																handleItemSelection(
																	resource,
																)
															}
															onKeyDown={(e) =>
																handleListKeyDown(
																	e,
																	resource,
																)
															}
														>
															<div className="flex w-full items-center gap-2">
																<Search className="min-w-6 text-default-500 group-hover:text-white group-focus:text-white" />
																<div className="w-full">
																	<div className="line-clamp-1 text-base group-hover:text-white">
																		{
																			resource
																		}
																	</div>
																</div>
																<ChevronRight
																	size={18}
																	className="min-w-8 text-default-500 group-hover:text-white group-focus:text-white"
																/>
															</div>
														</ListItem>
													),
												)}
											{showEmptyRecentSearchResult && (
												<ListItem
													overrideClassName={true}
													className="text-md py-3 text-center text-default-600"
													aria-disabled="true"
													key="type to search"
													keyIdentifier="type to search"
												>
													Start typing to search...
												</ListItem>
											)}
										</AnimatePresence>
									</motion.ul>
								</AnimatePresence>
							</div>
						</div>
					</div>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
};
export default SearchFormModal;
