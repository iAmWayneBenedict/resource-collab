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
	Listbox,
	ListboxSection,
	ListboxItem,
	Chip,
} from "@heroui/react";
import { ChevronRight, Search } from "lucide-react";
import {
	KeyboardEvent,
	useEffect,
	useRef,
	useState,
	useMemo,
	Key,
} from "react";
import { useGetPaginatedResourcesQuery } from "../../../../lib/queries/resources";
import { useRouter, useSearchParams } from "next/navigation";
import { reInitQueryParams } from "@/lib/utils";
import { useRecentSearches } from "@/store/useRecentSearches";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";

// Helper function to highlight matching text
const HighlightedText = ({
	text,
	highlight,
}: {
	text: string;
	highlight: string;
}) => {
	if (!highlight.trim()) return <>{text}</>;
	const regex = new RegExp(`(${highlight})`, "gi");
	const parts = text.split(regex);

	return (
		<>
			{parts.map((part, i) =>
				regex.test(part) ? (
					<span
						key={i}
						className="font-bold text-violet underline decoration-2 group-hover:text-white group-hover:decoration-white group-focus:text-white group-focus:decoration-white"
					>
						{part}
					</span>
				) : (
					<span
						key={i}
						className="group-hover:text-white group-focus:text-white"
					>
						{part}
					</span>
				),
			)}
		</>
	);
};

const SearchFormModal = () => {
	const { isOpen, onOpen, onOpenChange } = useDisclosure();
	const [searchValue, setSearchValue] = useState("");

	const searchParams = useSearchParams();
	const searchDefault = searchParams.get("search") ?? "";

	const { resources, setAddResource } = useRecentSearches();

	const router = useRouter();
	const searchRef = useRef<HTMLInputElement>(null);

	const {
		name: modalName,
		onClose,
		data: dataModal,
		onOpen: onOpenModal,
	} = useModal();

	const searchDebounced = useDebounce(searchValue, 250);

	const { data } = useGetPaginatedResourcesQuery({
		page: 1,
		limit: -1,
	});

	useKeyboardShortcut({ ctrlKey: true, key: "k" }, () => {
		onOpenModal("Search Filter", null);
	});

	useEffect(() => {
		setSearchValue(searchDefault);
	}, [searchDefault]);

	const filteredResources = useMemo(
		() =>
			data?.data?.rows
				?.filter((resource: any) => {
					if (!searchDebounced) return false;
					const searchLower = searchDebounced.toLowerCase();
					return (
						resource.name.toLowerCase().includes(searchLower) ||
						resource.description.toLowerCase().includes(searchLower)
					);
				})
				.slice(0, 5) || [],
		[data?.data?.rows, searchDebounced],
	);

	useEffect(() => {
		if (modalName === "Search Filter") {
			onOpen();
			setTimeout(() => {
				searchRef.current?.focus();
			}, 500);
		} else {
			onClose();
		}
	}, [modalName, onClose, onOpen]);

	const onCloseModal = () => {
		onOpenChange();
		onClose();
	};

	const onChangeHandler = (e: any) => {
		setSearchValue(e.target.value);
	};

	const onKeyDownHandler = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "ArrowDown" && filteredResources.length > 0) {
			e.preventDefault();
			const firstItem = document.querySelector(
				'[role="option"]',
			) as HTMLElement;
			firstItem?.focus();
		} else if (e.key === "Escape") {
			onCloseModal();
		} else if (e.key === "Enter") {
			router.push(
				reInitQueryParams(window.location.href, {
					search: e.currentTarget.value,
				}),
				{ scroll: false },
			);
			onCloseModal();
		}
	};

	const onActionHandler = (key: Key) => {
		router.push(
			reInitQueryParams(window.location.href, {
				search: key as string,
			}),
			{ scroll: false },
		);
		setAddResource(key as string);
		onCloseModal();
	};

	const showSearchResult = filteredResources.length > 0;
	const showEmptySearchResult = !filteredResources.length && searchDebounced;
	const showRecentSearchResult = !searchDebounced && resources.length;
	const showEmptyRecentSearchResult = !searchDebounced && !resources.length;

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
				{() => (
					<ModalBody className="gap-1 rounded-2xl border border-default-200 p-0">
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
							<Listbox
								className="w-full border-0"
								aria-label="Listbox"
								disabledKeys={["empty"]}
								selectionMode="single"
								hideSelectedIcon
								onAction={onActionHandler}
							>
								<ListboxSection
									title={
										searchDebounced.length
											? "Results"
											: "Recent"
									}
									classNames={{
										group: "flex flex-col gap-2",
										heading: "text-default-600",
									}}
								>
									{showSearchResult &&
										filteredResources.map(
											(resource: any) => (
												<ListboxItem
													key={resource.name}
													textValue={resource.name}
													className="group bg-default-100 py-3 pl-3 text-default-700 hover:bg-violet hover:text-white focus:bg-violet focus:text-white focus:outline-none data-[hover=true]:bg-violet data-[hover=true]:text-white data-[focus-visible=true]:outline-0 data-[selectable=true]:focus:bg-violet data-[selectable=true]:focus:text-white"
													classNames={{
														title: "text-md",
														description:
															"text-default-500 group-focus:text-white group-hover:text-white",
														base: "group-focus:text-white",
													}}
													startContent={
														<Search className="text-default-500 group-hover:text-white group-focus:text-white" />
													}
													endContent={
														<ChevronRight
															size={18}
															className="text-default-500 group-hover:text-white group-focus:text-white"
														/>
													}
													description={
														<div className="line-clamp-1 text-default-500 group-hover:text-white">
															<HighlightedText
																text={
																	resource.description
																}
																highlight={
																	searchDebounced
																}
															/>
														</div>
													}
												>
													<div className="line-clamp-1 group-hover:text-white">
														<HighlightedText
															text={resource.name}
															highlight={
																searchDebounced
															}
														/>
													</div>
												</ListboxItem>
											),
										)}
									{showEmptySearchResult && (
										<ListboxItem
											key="empty"
											classNames={{
												title: "text-md text-center text-default-600",
											}}
										>
											{`No results for "${searchDebounced}"`}
										</ListboxItem>
									)}
									{showRecentSearchResult &&
										resources.map((resource) => (
											<ListboxItem
												key={resource}
												textValue={resource}
												className="group bg-default-100 py-3 pl-3 text-default-700 hover:bg-violet hover:text-white focus:bg-violet focus:text-white focus:outline-none data-[hover=true]:bg-violet data-[hover=true]:text-white data-[focus-visible=true]:outline-0 data-[selectable=true]:focus:bg-violet data-[selectable=true]:focus:text-white"
												startContent={
													<Search className="text-default-500 group-hover:text-white group-focus:text-white" />
												}
												endContent={
													<ChevronRight
														size={18}
														className="text-default-500 group-hover:text-white group-focus:text-white"
													/>
												}
											>
												{resource}
											</ListboxItem>
										))}
									{showEmptyRecentSearchResult && (
										<ListboxItem
											key="empty"
											classNames={{
												title: "text-md text-center text-default-600",
											}}
										>
											Start typing to search...
										</ListboxItem>
									)}
								</ListboxSection>
							</Listbox>
						</div>
					</ModalBody>
				)}
			</ModalContent>
		</Modal>
	);
};
export default SearchFormModal;
