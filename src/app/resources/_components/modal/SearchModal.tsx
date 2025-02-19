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
import { ChevronRight, Search, X } from "lucide-react";
import { KeyboardEvent, useEffect, useRef, useState } from "react";

const SearchFormModal = () => {
	const { isOpen, onOpen, onOpenChange } = useDisclosure();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [searchValue, setSearchValue] = useState("");
	const searchRef = useRef<HTMLInputElement>(null);

	const { name: modalName, onClose, data: dataModal, type } = useModal();

	const searchDebounced = useDebounce(searchValue, 250);

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

	const onKeyEnterHandler = (e: KeyboardEvent<HTMLInputElement>) => {
		e.key === "Enter" && onCloseModal();
	};

	return (
		<Modal
			isOpen={isOpen}
			placement="top-center"
			onOpenChange={onCloseModal}
			// backdrop="blur"
			isDismissable={!isSubmitting}
			size="xl"
		>
			<ModalContent>
				{() => (
					<ModalBody className="gap-1 border border-black/10 p-0">
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
									"h-14 focus-within:ring-0 group-data-[focus=true]:border-0 border-0 shadow-none bg-white",
							}}
							startContent={
								<Search className="pointer-events-none flex-shrink-0 text-2xl text-default-400" />
							}
							endContent={
								<div className="flex items-center gap-1">
									<span className="rounded-full bg-default-700 p-1 text-white">
										<X size={10} />
									</span>
									<Chip
										size="sm"
										classNames={{
											base: "bg-default-200 text-default-900 hover:bg-default-200 hover:text-default-900 hover:shadow-none text-sm py-2 px-3",
										}}
									>
										Enter
									</Chip>
								</div>
							}
							onKeyUp={onKeyEnterHandler}
							onClear={() => setSearchValue("")}
							onChange={(e) => setSearchValue(e.target.value)}
							value={searchValue}
						/>
						<Divider />
						<div className="px-2">
							<Listbox
								className="w-full border-0"
								aria-label="Listbox"
								disabledKeys={["empty"]}
							>
								<ListboxSection
									title="Recent"
									classNames={{
										group: "flex flex-col gap-2",
									}}
								>
									{[
										{ id: "1", name: "Item 1" },
										{ id: "2", name: "Item 2" },
									].map(({ id, name }) => (
										<ListboxItem
											key={id}
											className="bg-default-100 py-3 pl-3 text-default-700 hover:bg-violet hover:bg-white data-[hover=true]:bg-violet data-[hover=true]:text-white"
											classNames={{ title: "text-md" }}
											startContent={<Search />}
											endContent={
												<ChevronRight size={18} />
											}
										>
											{name}
										</ListboxItem>
									))}
									{/* {
										<ListboxItem
											key={"empty"}
											classNames={{ title: "text-md text-center" }}
										>
											No Recent Search
										</ListboxItem>
									} */}
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
